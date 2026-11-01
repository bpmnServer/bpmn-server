// bpmnlint's modeling rules in the editor: listed under Problems with bpmn-server's checks, named and linked to
// the rule's documentation, marked on the canvas, and cleared when the model is fixed.
//   npm run test:ui
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright';
import { startWebApp, PASSWORD } from '../support/webApp.mjs';

/**
 * Start -> Review, which splits without a gateway to Approve and Archive; both end at End (a fake join). Elements
 * list their flows (incoming, outgoing), as the editor saves them: bpmnlint's flow rules read those.
 */
const MODEL = `<?xml version="1.0" encoding="UTF-8"?>
<bpmn:definitions xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" id="d" targetNamespace="urn:test">
  <bpmn:process id="P" isExecutable="true">
    <bpmn:startEvent id="Start" name="Start"><bpmn:outgoing>f1</bpmn:outgoing></bpmn:startEvent>
    <bpmn:userTask id="Review" name="Review"><bpmn:incoming>f1</bpmn:incoming><bpmn:outgoing>f2</bpmn:outgoing><bpmn:outgoing>f3</bpmn:outgoing></bpmn:userTask>
    <bpmn:userTask id="Approve" name="Approve"><bpmn:incoming>f2</bpmn:incoming><bpmn:outgoing>f4</bpmn:outgoing></bpmn:userTask>
    <bpmn:userTask id="Archive" name="Archive"><bpmn:incoming>f3</bpmn:incoming><bpmn:outgoing>f5</bpmn:outgoing></bpmn:userTask>
    <bpmn:endEvent id="End" name="End"><bpmn:incoming>f4</bpmn:incoming><bpmn:incoming>f5</bpmn:incoming></bpmn:endEvent>
    <bpmn:sequenceFlow id="f1" sourceRef="Start" targetRef="Review" />
    <bpmn:sequenceFlow id="f2" sourceRef="Review" targetRef="Approve" />
    <bpmn:sequenceFlow id="f3" sourceRef="Review" targetRef="Archive" />
    <bpmn:sequenceFlow id="f4" sourceRef="Approve" targetRef="End" />
    <bpmn:sequenceFlow id="f5" sourceRef="Archive" targetRef="End" />
  </bpmn:process>
</bpmn:definitions>`;

let web, browser, page;
const errors = [];
test.before(async () => {
    web = await startWebApp();
    fs.writeFileSync(path.join(web.definitionsPath, 'lint-split.bpmn'), MODEL);
    await web.bpmnServer.definitions.rebuild();
    browser = await chromium.launch();
    const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
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

const lintItems = rule => page.locator(`#js-problems .problem[data-code="bpmnlint/${rule}"]`);

test('bpmnlint findings are listed with bpmn-server\'s, name their rule and lead to the element', async () => {
    await page.goto(`${web.base}/model/edit/lint-split`);
    await lintItems('no-implicit-split').waitFor();

    const split = lintItems('no-implicit-split');
    assert.equal(await split.count(), 1);
    assert.match(await split.getAttribute('class'), /severity-warning/);
    assert.match(await split.locator('.message').innerText(), /Flow splits implicitly/);
    assert.equal(await split.locator('.where').innerText(), 'Review');
    const rule = split.locator('a.rule');
    assert.equal(await rule.innerText(), 'bpmnlint/no-implicit-split');
    assert.match(await rule.getAttribute('href'), /^https:\/\/github\.com\/bpmn-io\/bpmnlint\/blob\/main\/docs\/rules\/no-implicit-split/);
    assert.equal(await lintItems('fake-join').count(), 1, 'End: incoming flows that do not join');

    // what verifyModel checks is not listed twice: bpmnlint's start and end event rules are off
    assert.equal(await lintItems('start-event-required').count(), 0);
    assert.equal(await page.locator('#js-problems .problem[data-code^="bpmnlint/"].severity-error').count(), 0);

    // marked on the canvas, and selected from the list
    assert.equal(await page.locator('.djs-element.problem-warning[data-element-id="Review"]').count(), 1);
    await split.locator('.message').click();
    assert.deepEqual(await page.evaluate(() => window.bpmnModeler.get('selection').get().map(e => e.id)), ['Review']);
    assert.deepEqual(errors, []);
});

test('fixing the model clears the finding', async () => {
    await page.goto(`${web.base}/model/edit/lint-split`);
    await lintItems('no-implicit-split').waitFor();
    // a parallel gateway after Review: the split is explicit
    await page.evaluate(() => {
        const m = window.bpmnModeler;
        const registry = m.get('elementRegistry'), modeling = m.get('modeling');
        const review = registry.get('Review');
        const gateway = modeling.appendShape(review, { type: 'bpmn:ParallelGateway' }, { x: review.x + 200, y: review.y + 40 });
        for (const id of ['f2', 'f3'])
            modeling.reconnectStart(registry.get(id), gateway, { x: gateway.x + 25, y: gateway.y + 25 });
    });
    await page.waitForFunction(() => !document.querySelector('#js-problems .problem[data-code="bpmnlint/no-implicit-split"]'));
    assert.deepEqual(errors, []);
});

test('checking again does not report what an earlier check saw (rules keep state: one linter each time)', async () => {
    await page.goto(`${web.base}/model/edit/lint-split`);
    await lintItems('no-implicit-split').waitFor();
    for (let i = 0; i < 2; i++)
        await page.evaluate(() => window.bpmnModeler.get('problems').check());
    assert.equal(await lintItems('no-duplicate-sequence-flows').count(), 0);
    assert.equal(await lintItems('no-implicit-split').count(), 1);
});

test('a finding turns its rule off for everyone; the Rules dialog turns it on again', async () => {
    await page.goto(`${web.base}/model/edit/lint-split`);
    await lintItems('fake-join').waitFor();
    page.once('dialog', dialog => dialog.accept());
    await lintItems('fake-join').locator('.rule-off').click();
    await lintItems('fake-join').waitFor({ state: 'detached' });
    const saved = () => JSON.parse(fs.readFileSync(path.join(web.definitionsPath, 'bpmnlint.json'), 'utf8')).rules;
    assert.deepEqual(saved(), { 'fake-join': 'off' });
    assert.equal(await page.locator('#js-problems .problem.selected, .djs-element.selected').count(), 0, 'the element is not selected by the button');

    // another designer's editor (a new page) has it off too
    await page.reload();
    await lintItems('no-implicit-split').waitFor();
    assert.equal(await lintItems('fake-join').count(), 0);

    // the Rules dialog: marked as changed; back to its default level brings the finding back
    await page.click('#js-lint-rules-open');
    const row = page.locator('#js-lint-rules tr[data-rule="fake-join"]');
    assert.match(await row.getAttribute('class'), /changed/);
    assert.equal(await row.locator('td.default').innerText(), 'Warning');
    // under each rule's name, what it checks
    assert.match(await row.locator('.lint-rule-description').innerText(), /does not join them: each arrival runs it again/);
    const described = await page.locator('#js-lint-rules tbody tr').evaluateAll(rows =>
        rows.filter(r => !r.querySelector('.lint-rule-description')?.textContent.trim()).map(r => r.dataset.rule));
    assert.deepEqual(described, [], 'every rule is described');
    await row.locator('select').selectOption('warn');
    await page.waitForFunction(() => !document.querySelector('#js-lint-rules tr[data-rule="fake-join"]').classList.contains('changed'));
    assert.deepEqual(saved(), {});
    await page.click('#js-lint-rules button:text("Close")');
    await lintItems('fake-join').waitFor();

    // and a rule made stricter is listed at its new level
    await page.click('#js-lint-rules-open');
    await page.locator('#js-lint-rules tr[data-rule="no-implicit-split"] select').selectOption('error');
    await page.click('#js-lint-rules button:text("Close")');
    await page.waitForSelector('#js-problems .problem.severity-error[data-code="bpmnlint/no-implicit-split"]');
    assert.deepEqual(errors, []);
});
