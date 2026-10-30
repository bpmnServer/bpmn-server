// The editor's Report view: the whole process as one document, from the model being edited.
//   npm run test:ui
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright';
import { startWebApp, PASSWORD, FIXTURES } from '../support/webApp.mjs';

const SAMPLES = path.join(FIXTURES, '..', '..', 'processes');

let web, browser;
test.before(async () => {
    web = await startWebApp();
    browser = await chromium.launch();
});
test.after(async () => {
    await browser?.close();
    await web?.stop();
    setImmediate(() => process.exit(0));
});

async function openReport(model, xml) {
    fs.writeFileSync(path.join(web.definitionsPath, model + '.bpmn'), xml);
    await web.bpmnServer.definitions.rebuild();
    const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    await context.route('**/*', route => route.request().url().startsWith(web.base) ? route.continue() : route.abort());
    const page = await context.newPage();
    page.setDefaultTimeout(20000);
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    await page.goto(web.base + '/login');
    await page.fill('#userName', 'designer');
    await page.fill('#password', PASSWORD);
    await Promise.all([page.waitForURL(url => !url.pathname.startsWith('/login')), page.click('button[type=submit]')]);
    await page.goto(`${web.base}/model/edit/${model}`);
    await page.waitForSelector('#js-problems .problems-counts .count, #js-problems .problems-status:text("No problems")');
    assert.equal(await page.locator('#js-print').isVisible(), false, 'Print belongs to the report');
    await page.click('#js-view-report');
    await page.waitForSelector('.report-element');
    return { page, errors, close: () => context.close() };
}

const section = (page, id) => page.locator(`.report-element[data-element-id="${id}"]`);

test('the report lists the process in flow order, with how bpmn-server reads each element', async () => {
    const { page, errors, close } = await openReport('report-car', fs.readFileSync(path.join(SAMPLES, 'Buy Used Car.bpmn'), 'utf8'));
    assert.equal(await page.locator('#js-canvas').isVisible(), false, 'the report replaces the diagram');
    assert.equal(await page.locator('#js-print').isVisible(), true);

    const order = await page.locator('.report-element').evaluateAll(els => els.map(e => e.dataset.elementId));
    const at = id => order.indexOf(id);
    assert.ok(at('StartEvent_158yep3') === 0, order.join());
    assert.ok(at('task_Buy') < at('gateway_1'));
    for (const branch of ['task_clean', 'task_repair'])
        assert.ok(at('gateway_1') < at(branch) && at(branch) < at('gateway_2'), 'the join after both branches: ' + order.join());
    assert.ok(at('gateway_2') < at('task_Drive'));

    const buy = section(page, 'task_Buy');
    assert.match(await buy.innerText(), /User task/);
    assert.match(await buy.locator('.report-documentation').innerText(), /A User Task/);
    const description = await buy.locator('.report-description').innerText();
    assert.match(description, /candidateGroups\s+Employee,Manager/);
    assert.match(description, /script on start/);

    const conditions = await page.locator('.report-flows').innerText();
    assert.match(conditions, /needsCleaning=="Yes"/);
    assert.deepEqual(errors, []);
    await close();
});

test('problems are shown with their element, and the report follows edits', async () => {
    const xml = fs.readFileSync(path.join(FIXTURES, 'leave-request.bpmn'), 'utf8').replace("data.approvedBy = 'system';", 'data.approvedBy = ;');
    const { page, errors, close } = await openReport('report-broken', xml);
    assert.match(await page.locator('.report-summary').innerText(), /Problems: 1 error/);
    assert.match(await section(page, 'AutoApprove').locator('.report-issues').innerText(), /ERROR\s+The script does not compile/);

    // an edit in the diagram shows in the report
    await page.click('#js-view-diagram');
    await page.evaluate(() => {
        const m = window.bpmnModeler;
        m.get('modeling').updateProperties(m.get('elementRegistry').get('Submit'), { name: 'Send the request' });
    });
    await page.waitForFunction(() => window.bpmnModeler.get('problems').issues !== undefined);
    await page.click('#js-view-report');
    await page.waitForSelector('.report-element[data-element-id="Submit"] h3 a:text("Send the request")');
    assert.deepEqual(errors, []);
    await close();
});

test('an element of the report opens it in the diagram', async () => {
    const { page, errors, close } = await openReport('report-reveal', fs.readFileSync(path.join(SAMPLES, 'Buy Used Car.bpmn'), 'utf8'));
    await section(page, 'task_Drive').locator('h3 a').click();
    assert.equal(await page.locator('#js-canvas').isVisible(), true);
    assert.equal(await page.locator('#js-view-diagram').getAttribute('aria-pressed'), 'true');
    assert.deepEqual(await page.evaluate(() => window.bpmnModeler.get('selection').get().map(e => e.id)), ['task_Drive']);
    assert.deepEqual(errors, []);
    await close();
});
