// Business rule tasks in the model editor: the Decision group lists the decision files of the models folder and
// says what the named one reads and gives, the Report shows its table, and the decision editor (dmn-js) opens,
// creates and saves them.
//   npm run test:ui
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright';
import { startWebApp, PASSWORD } from '../support/webApp.mjs';

const SAMPLES = path.join(import.meta.dirname, '..', '..', 'processes');

let web, browser, context, page;
const errors = [];
test.before(async () => {
    web = await startWebApp();
    fs.copyFileSync(path.join(SAMPLES, 'loan_approval.dmn.xml'), path.join(web.definitionsPath, 'loan_approval.dmn.xml'));
    fs.copyFileSync(path.join(SAMPLES, 'Business Rules.bpmn'), path.join(web.definitionsPath, 'rules.bpmn'));
    await web.bpmnServer.definitions.rebuild();
    browser = await chromium.launch();
    context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    await context.route('**/*', route => route.request().url().startsWith(web.base) ? route.continue() : route.abort());
    page = await context.newPage();
    page.setDefaultTimeout(20000);
    page.on('pageerror', e => errors.push(e.message));
    await page.goto(web.base + '/login');
    await page.fill('#userName', 'designer');
    await page.fill('#password', PASSWORD);
    await Promise.all([page.waitForURL(url => !url.pathname.startsWith('/login')), page.click('button[type=submit]')]);
});
test.after(async () => {
    await browser?.close();
    await web?.stop();
    setImmediate(() => process.exit(0));
});

async function openEditor(model = 'rules') {
    await page.goto(`${web.base}/model/edit/${model}`);
    await page.waitForSelector('#js-problems-counts .count, #js-problems-status:text("No problems")');
    await page.waitForFunction(() => window.bpmnModeler.get('decisions').loaded);
}

async function selectTask() {
    await page.evaluate(() => {
        const m = window.bpmnModeler;
        m.get('selection').select(m.get('elementRegistry').get('Activity_0px5w2d'));
    });
    const header = page.locator('.bio-properties-panel-group-header', { hasText: 'Decision' }).first();
    await page.waitForTimeout(100);      // the panel settles: the editor opens the groups that have values
    if (!/\bopen\b/.test(await header.getAttribute('class')))
        await header.click();
}

const summaryText = () => page.locator('[data-entry-id="decision-summary"] .bio-properties-panel-description').innerText();

test('the Decision group lists the decision files and says what the named one reads and gives', async () => {
    await openEditor();
    await selectTask();
    const select = page.locator('#bio-properties-panel-decisionRef');
    assert.equal(await select.inputValue(), 'loanApproval', 'the decision id the sample names');
    const options = await select.locator('option').allInnerTexts();
    assert.ok(options.includes('loan_approval (Loan Approval)'), options.join());
    assert.equal(await summaryText(), 'PRIORITY, 5 rules. Reads credit_score, income; gives approvalStatus, maxAmount.');
    assert.match(await page.locator('[data-entry-id="decision-summary"] button').innerText(), /Open loan_approval\.dmn\.xml/);
    assert.equal(await page.inputValue('#bio-properties-panel-decision-resultVariable'), 'loan');

    // choose the file and a result mapping; saved as bpmn-server reads them
    await select.selectOption('loan_approval');
    await page.locator('#bio-properties-panel-decision-mapDecisionResult').selectOption('singleResult');
    const saved = page.waitForResponse(r => r.request().method() === 'POST' && r.url().endsWith('/model/edit/rules'));
    await page.click('#js-save');
    assert.equal((await saved).status(), 200);
    const xml = await web.bpmnServer.definitions.getSource('rules');
    assert.match(xml, /camunda:decisionRef="loan_approval"/);
    assert.match(xml, /camunda:resultVariable="loan"/);
    assert.match(xml, /camunda:mapDecisionResult="singleResult"/);

    // a result variable and mapping on a business rule task are not Camunda settings bpmn-server ignores
    const notRun = await page.locator('#js-problems .problem[data-code="not-run-by-bpmn-server"]').allInnerTexts();
    assert.ok(!notRun.some(t => /Result variable/.test(t)), notRun.join('\n'));
    // and the result variable is a data field scripts can complete
    assert.ok(await page.evaluate(() => window.bpmnModeler.get('scriptContext').dataFields().includes('loan')));
    assert.deepEqual(errors, []);
});

test('a decision that is not there can be created from the panel', async () => {
    await openEditor();
    await selectTask();
    await page.evaluate(() => {
        const m = window.bpmnModeler;
        m.get('modeling').updateProperties(m.get('elementRegistry').get('Activity_0px5w2d'), { 'camunda:decisionRef': 'risk' });
    });
    await page.waitForFunction(() => /No decision file risk\.dmn\.xml/.test(document.querySelector('[data-entry-id="decision-summary"]')?.innerText || ''));
    await page.waitForFunction(() => document.querySelector('#bio-properties-panel-decisionRef')?.value === 'risk');
    assert.match(await page.locator('#bio-properties-panel-decisionRef option:checked').innerText(), /risk \(not found\)/);
    page.once('dialog', dialog => dialog.accept('risk'));
    const [editor] = await Promise.all([
        context.waitForEvent('page'),
        page.locator('[data-entry-id="decision-summary"] button', { hasText: 'Create risk.dmn.xml' }).click()
    ]);
    await editor.waitForSelector('.tjs-table');
    assert.match(await editor.locator('.modeler-status').innerText(), /New file: not saved yet/);
    await editor.click('#js-save');
    await editor.waitForSelector('.modeler-status.ok');
    assert.ok(fs.existsSync(path.join(web.definitionsPath, 'risk.dmn.xml')));
    await editor.close();

    // back in the model editor, the new file is read when the page gets the focus again
    await page.bringToFront();
    await page.evaluate(() => window.dispatchEvent(new Event('focus')));
    await page.waitForFunction(() => /FIRST, 1 rules\. Reads input1; gives output1\./.test(document.querySelector('[data-entry-id="decision-summary"]')?.innerText || ''));
    assert.deepEqual(errors, []);
});

test('the decision editor opens a file on its table and saves changes', async () => {
    const editor = await context.newPage();
    const editorErrors = [];
    editor.on('pageerror', e => editorErrors.push(e.message));
    await editor.goto(`${web.base}/model/decision/loan_approval`);
    await editor.waitForSelector('.tjs-table');
    assert.equal(await editor.locator('.tjs-table tbody tr').count(), 5);
    // a rule's output cell, edited as the table editor does it
    await editor.evaluate(() => {
        const viewer = window.dmnModeler.getActiveViewer();
        const rule = viewer.get('sheet').getRoot().rows[2];
        const cell = rule.cells.find(c => c.col.id === 'OutputClause_1x57vxz');
        viewer.get('modeling').editCell(cell.businessObject, '7500');
    });
    await editor.waitForSelector('.modeler-status:text("Unsaved changes")');
    await editor.keyboard.press('Control+s');
    await editor.waitForSelector('.modeler-status.ok');
    const xml = fs.readFileSync(path.join(web.definitionsPath, 'loan_approval.dmn.xml'), 'utf8');
    assert.match(xml, /<text>7500<\/text>/);
    assert.deepEqual(editorErrors, []);
    await editor.close();
});

test('the Report shows a business rule task\'s decision table and where its result goes', async () => {
    await openEditor();
    await page.click('#js-tab-report');
    const section = page.locator('.report-element[data-element-id="Activity_0px5w2d"]');
    await section.locator('.report-decision-table').waitFor();
    assert.match(await section.locator('.report-decision-title').innerText(), /Decision Loan Approval · loan_approval\.dmn\.xml/);
    assert.equal(await section.locator('.report-decision-table caption').innerText(), 'PRIORITY');
    const headers = await section.locator('.report-decision-table th').allInnerTexts();
    assert.deepEqual(headers.slice(0, 5), ['#', 'credit_score', 'income', 'approvalStatus', 'maxAmount']);
    assert.equal(await section.locator('.report-decision-table tbody tr').count(), 5);
    assert.match(await section.innerText(), /Result saved in data\.loan/);
    assert.deepEqual(errors, []);
});
