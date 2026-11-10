// @features: modeler
// Scripts and expressions in the properties panel: highlighted code fields that check the code as bpmn-server
// compiles it and complete the names it can use.
//   npm run test:ui
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright';
import { startWebApp, PASSWORD, FIXTURES } from '../support/webApp.mjs';

let web, browser, page, context;
test.before(async () => {
    web = await startWebApp();
    browser = await chromium.launch();
    context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    await context.route('**/*', route => route.request().url().startsWith(web.base) ? route.continue() : route.abort());
    page = await context.newPage();
    page.setDefaultTimeout(20000);
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

async function openEditor(model = 'leave-request') {
    await page.goto(`${web.base}/model/edit/${model}`);
    await page.waitForSelector('#js-problems-counts .count, #js-problems-status:text("No problems")');
    await page.waitForFunction(() => window.bpmnModeler.get('scriptContext').services.length > 0);
}

async function select(id) {
    await page.evaluate(id => {
        document.activeElement?.blur();
        const m = window.bpmnModeler;
        m.get('selection').select(id ? m.get('elementRegistry').get(id) : []);
    }, id);
}

async function openGroup(label) {
    const header = page.locator('.bio-properties-panel-group-header', { hasText: label }).first();
    await page.waitForTimeout(100);      // the panel settles: the editor opens the groups that have values
    if (!/\bopen\b/.test(await header.getAttribute('class')))
        await header.click();
}

/** Type at the end of a code field; the completions offered. */
async function complete(field, text) {
    await page.click(field);
    await page.keyboard.press('Control+End');
    await page.keyboard.type(text);
    await page.waitForSelector('.cm-tooltip-autocomplete li');
    // the list follows the last key typed: read it once it has stopped changing
    let labels = [], previous;
    do {
        previous = labels;
        await page.waitForTimeout(150);
        labels = await page.locator('.cm-tooltip-autocomplete .cm-completionLabel').allInnerTexts();
    } while (labels.join() !== previous.join());
    await page.keyboard.press('Escape');
    return labels;
}

test('a script completes the data fields, the item and the application\'s services', async () => {
    await openEditor();
    await select('AutoApprove');
    await openGroup('Script');
    const field = '#bio-properties-panel-script-body';
    assert.equal(await page.locator(field).innerText(), "data.approvedBy = 'system';");

    const services = await complete(field, '\nappServices.');
    for (const name of ['add', 'echo', 'getApprovers'])
        assert.ok(services.includes(name), services.join());
    const fields = await complete(field, 'echo(data.');
    assert.deepEqual(fields.filter(f => ['days', 'reason', 'caseId'].includes(f)).sort(), ['caseId', 'days', 'reason']);
    const globals = await complete(field, ');\nap');
    assert.ok(globals.includes('appServices') && globals.includes('appUtils'), globals.join());
});

test('code that does not compile is marked as it is typed, as bpmn-server compiles it', async () => {
    await openEditor();
    await select('AutoApprove');
    await openGroup('Script');
    await page.click('#bio-properties-panel-script-body');
    await page.keyboard.press('Control+End');
    await page.keyboard.type('\ndata.x = ;');
    await page.waitForSelector('[data-entry-id="script-body"] .cm-lint-marker-error');

});

test('a condition is checked as an expression: return (...), a leading $ allowed', async () => {
    fs.copyFileSync(path.join(FIXTURES, 'buy-used-car.bpmn'), path.join(web.definitionsPath, 'code-car.bpmn'));
    await web.bpmnServer.definitions.rebuild();
    await openEditor('code-car');
    await select('flow_gw1_clean');
    await openGroup('Condition');
    const marker = '[data-entry-id="conditionExpression"] .cm-lint-marker-error';
    await page.fill('#bio-properties-panel-conditionExpression', '$(data.days > 5)');
    await page.waitForTimeout(600);
    assert.equal(await page.locator(marker).count(), 0, 'a $ expression compiles');
    await page.fill('#bio-properties-panel-conditionExpression', 'data.a = 1; data.b');
    await page.waitForSelector(marker);     // statements are not an expression
    await page.fill('#bio-properties-panel-conditionExpression', 'data.days > 5');
    await page.waitForSelector(marker, { state: 'detached' });
});

test('a process script sees the execution, not an item', async () => {
    await openEditor();
    await select(null);
    await page.locator('.bio-properties-panel-group-header', { hasText: 'Scripts' }).locator('.bio-properties-panel-add-entry').click();
    const field = '[id$="-script-0-script"]';
    await page.waitForSelector(field);
    const globals = await complete(field, 'ins');
    assert.ok(globals.includes('instance'));
    const members = await complete(field, 'tance.');
    assert.ok(members.includes('data'), members.join());
    const self = await complete(field, '\nthis.');
    assert.ok(self.includes('instance') && !self.includes('elementId'), self.join());
});
