// The editor's Test tab: a scenario is run step by step (Run shows what waits; running a step shows what waits
// next), its steps are kept, and Replay / Run all repeat them; the path is marked on the diagram.
//   npm run test:ui
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright';
import { startWebApp, PASSWORD } from '../support/webApp.mjs';

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

async function openTestTab(model = 'leave-request') {
    const context = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
    await context.route('**/*', route => route.request().url().startsWith(web.base) ? route.continue() : route.abort());
    await context.addInitScript(() => localStorage.setItem('bpmn-web.modeler.panel', JSON.stringify({ dockHeight: 560 })));
    const page = await context.newPage();
    page.setDefaultTimeout(20000);
    page.on('dialog', d => d.accept());
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    await page.goto(web.base + '/login');
    await page.fill('#userName', 'designer');
    await page.fill('#password', PASSWORD);
    await Promise.all([page.waitForURL(url => !url.pathname.startsWith('/login')), page.click('button[type=submit]')]);
    await page.goto(`${web.base}/model/edit/${model}`);
    await page.waitForSelector('#js-canvas .djs-shape');
    await page.click('#js-tab-test');
    await page.waitForSelector('#js-test .test-panel');
    return { page, errors, close: () => context.close() };
}

const marked = (page, marker) => page.evaluate(m => [...document.querySelectorAll(`.djs-element.${m}`)].map(e => e.dataset.elementId).sort(), marker);
const pendingNames = page => page.locator('.test-step.pending .test-step-name').allInnerTexts();

/** Run the pending step of an element with data (into its form fields, the rest as JSON); wait for it to be done. */
async function runStep(page, elementId, data) {
    const step = page.locator(`.test-step.pending[data-element-id="${elementId}"]`);
    const rest = {};
    for (const [key, value] of Object.entries(data)) {
        const input = step.locator(`[data-field="${key}"]`);
        if (await input.count()) await input.fill(String(value));
        else rest[key] = value;
    }
    const hasForm = (await step.locator('[data-field]').count()) > 0;
    if (!hasForm)
        await step.locator('textarea').fill(JSON.stringify(rest));
    else if (Object.keys(rest).length) {
        // the form's other data is under a section that starts closed
        if (!(await step.locator('.test-form-other').getAttribute('open') !== null))
            await step.locator('.test-form-other summary').click();
        await step.locator('.test-form-other textarea').fill(JSON.stringify(rest));
    }
    const done = await page.locator('.test-step.done').count();
    await step.locator('.test-step-run').click();
    await page.waitForFunction(n => document.querySelectorAll('.test-step.done').length > n, done);
}

test('Run shows what waits; running a step shows what waits next, until the end', async () => {
    const { page, errors, close } = await openTestTab();
    await page.click('.test-new');
    await page.fill('.test-name', 'Long leave');
    await page.selectOption('.test-expect-status', 'end');
    await page.fill('.test-expect-passes', 'Approve');
    assert.equal(await page.locator('.test-run').innerText(), 'Start');
    await page.click('.test-run');

    await page.waitForSelector('.test-step.pending');
    assert.deepEqual(await pendingNames(page), ['Submit request (Submit)']);
    assert.equal(await page.locator('.test-step.pending .test-step-run').innerText(), 'Execute', 'as on the instance page');
    // Submit has form fields: a form, typed, with the fields' labels
    const form = page.locator('.test-step.pending .test-form');
    assert.deepEqual(await form.locator('.test-form-field > span').allInnerTexts(), ['Days', 'Reason']);
    assert.equal(await form.locator('[data-field="days"]').getAttribute('type'), 'number', 'a long is a number');
    assert.equal(await form.locator('[data-field="days"]').inputValue(), '0');
    assert.deepEqual(await marked(page, 'test-waiting'), ['Submit']);

    await runStep(page, 'Submit', { days: 10 });       // more than 5 days: the manager approves
    assert.deepEqual(await pendingNames(page), ['Approve request (Approve)']);
    assert.deepEqual(await marked(page, 'test-waiting'), ['Approve']);

    await runStep(page, 'Approve', { approved: true });
    await page.waitForSelector('.test-finished');
    assert.match(await page.locator('.test-finished').innerText(), /No more steps: the instance is end/);
    await page.waitForSelector('.test-result.ok');
    assert.deepEqual(await page.locator('.test-checks li').allInnerTexts(), ['✓ status is end', '✓ passes Approve']);
    assert.deepEqual(await marked(page, 'test-passed'), ['Approve', 'Approved', 'LongLeave', 'Requested', 'Submit']);

    // the items, in the order they ran; a row selects its element
    const rows = await page.locator('.test-items tbody tr').evaluateAll(trs => trs.map(tr => [...tr.cells].slice(0, 5).map(td => td.innerText)));
    const elements = rows.map(r => r[1]);
    assert.ok(elements.indexOf('Submit') < elements.indexOf('LongLeave') && elements.indexOf('LongLeave') < elements.indexOf('Approve'), elements.join());
    assert.deepEqual(rows.find(r => r[1] === 'Approve').slice(2), ['Approve request', 'UserTask', 'end']);
    await page.locator('.test-items tbody tr[data-element-id="LongLeave"]').click();
    assert.deepEqual(await page.evaluate(() => window.bpmnModeler.get('selection').get().map(e => e.id)), ['LongLeave']);

    // the steps run are the scenario's
    await page.click('.test-stop');
    assert.deepEqual(await page.locator('.test-step.saved .test-step-name').allInnerTexts(), ['Submit request (Submit)', 'Approve request (Approve)']);
    assert.deepEqual(errors, []);
    await close();
});

test('another run follows the saved steps, prefilled; a different choice changes the path', async () => {
    const { page, close } = await openTestTab();
    await page.locator('.test-list li', { hasText: 'Long leave' }).click();
    await page.click('.test-run');
    await page.waitForSelector('.test-step.pending');
    assert.equal(await page.locator('.test-step.pending [data-field="days"]').inputValue(), '10', 'the saved step');

    await page.click('.test-duplicate, .test-editor-actions button:has-text("Duplicate")');
    await page.fill('.test-name', 'Short leave');
    await page.fill('.test-expect-passes', 'AutoApprove');
    await page.click('.test-run');
    await page.waitForSelector('.test-step.pending');
    await runStep(page, 'Submit', { days: 2 });         // 5 days or fewer: approved automatically, nothing waits
    await page.waitForSelector('.test-finished');
    await page.waitForSelector('.test-result.ok');
    assert.deepEqual(await marked(page, 'test-passed'), ['AutoApprove', 'AutoApproved', 'LongLeave', 'Requested', 'Submit']);
    await page.click('.test-stop');
    assert.deepEqual(await page.locator('.test-step.saved .test-step-name').allInnerTexts(), ['Submit request (Submit)'], 'the path taken, not the one copied');
    await page.waitForTimeout(1000);     // saved after a pause
    await close();
});

test('Run repeats the saved steps on a new instance; Simulate numbers its path; Run all runs every scenario', async () => {
    const { page, close } = await openTestTab();
    await page.locator('.test-list li', { hasText: 'Short leave' }).click();
    assert.equal(await page.locator('.test-replay').innerText(), 'Run');
    await page.click('.test-replay');
    await page.waitForSelector('.test-status:text("Short leave: passed")');     // this Run's result, not the kept one
    assert.deepEqual(await page.locator('.test-steps-result li').allInnerTexts(), ['✓ Submit']);

    await page.click('.test-simulate');
    assert.equal(await page.locator('.test-simulate').innerText(), 'Pause');
    await page.click('.test-simulate');                       // pause
    assert.equal(await page.locator('.test-simulate').innerText(), 'Continue');
    assert.equal(await page.locator('.test-sim-step').isVisible(), true);
    const paused = await page.locator('.djs-element.test-started, .djs-element.test-passed').count();
    await page.waitForTimeout(1200);
    assert.equal(await page.locator('.djs-element.test-started, .djs-element.test-passed').count(), paused, 'nothing moves while paused');
    await page.click('.test-sim-step');                      // one change
    assert.match(await page.locator('.test-status').innerText(), /Paused at \d+ of \d+/);
    await page.click('.test-simulate');                       // continue
    await page.waitForSelector('.test-status:text("Simulation done")', { timeout: 20000 });
    assert.equal(await page.locator('.test-simulate').innerText(), 'Simulate');
    const numbers = await page.evaluate(() => [...document.querySelectorAll('.test-seq')]
        .map(b => [b.closest('.djs-overlays').getAttribute('data-container-id'), Number(b.textContent)]));
    const order = numbers.sort((a, b) => a[1] - b[1]).map(([id]) => id);
    assert.deepEqual(order, ['Requested', 'Submit', 'LongLeave', 'AutoApprove', 'AutoApproved'], 'numbered in the order they ran');

    await page.click('.test-run-all');
    await page.waitForSelector('.test-status:text("passed")');
    assert.equal(await page.locator('.test-status').innerText(), 'All 2 passed');
    const badges = await page.locator('.test-list li').evaluateAll(lis => lis.map(li => li.innerText.replace(/\s+/g, ' ').trim()));
    assert.deepEqual(badges, ['✓ Long leave', '✓ Short leave']);
    await close();
});

/** Two tasks in parallel, then a joining gateway, drawn. */
const PARALLEL = `<?xml version="1.0" encoding="UTF-8"?>
<bpmn:definitions xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" xmlns:dc="http://www.omg.org/spec/DD/20100524/DC" id="d" targetNamespace="urn:test">
  <bpmn:process id="P" isExecutable="true">
    <bpmn:startEvent id="Start" /><bpmn:parallelGateway id="Split" />
    <bpmn:userTask id="A" name="Task A" /><bpmn:userTask id="B" name="Task B" />
    <bpmn:parallelGateway id="Join" /><bpmn:userTask id="After" name="After both" /><bpmn:endEvent id="End" />
    <bpmn:sequenceFlow id="f1" sourceRef="Start" targetRef="Split" /><bpmn:sequenceFlow id="f2" sourceRef="Split" targetRef="A" />
    <bpmn:sequenceFlow id="f3" sourceRef="Split" targetRef="B" /><bpmn:sequenceFlow id="f4" sourceRef="A" targetRef="Join" />
    <bpmn:sequenceFlow id="f5" sourceRef="B" targetRef="Join" /><bpmn:sequenceFlow id="f6" sourceRef="Join" targetRef="After" />
    <bpmn:sequenceFlow id="f7" sourceRef="After" targetRef="End" />
  </bpmn:process>
  <bpmndi:BPMNDiagram id="dia"><bpmndi:BPMNPlane id="plane" bpmnElement="P">
    ${[['Start', 50, 120, 36, 36], ['Split', 120, 113, 50, 50], ['A', 210, 40, 100, 80], ['B', 210, 160, 100, 80],
        ['Join', 350, 113, 50, 50], ['After', 440, 98, 100, 80], ['End', 580, 120, 36, 36]]
        .map(([id, x, y, w, h]) => `<bpmndi:BPMNShape id="${id}_di" bpmnElement="${id}"><dc:Bounds x="${x}" y="${y}" width="${w}" height="${h}" /></bpmndi:BPMNShape>`).join('')}
  </bpmndi:BPMNPlane></bpmndi:BPMNDiagram>
</bpmn:definitions>`;

test('a joining gateway waits by itself: it is shown, but is not a step to run', async () => {
    fs.writeFileSync(path.join(web.definitionsPath, 'parallel-ui.bpmn'), PARALLEL);
    await web.bpmnServer.definitions.rebuild();
    const { page, errors, close } = await openTestTab('parallel-ui');
    await page.click('.test-new');
    await page.click('.test-run');
    await page.waitForSelector('.test-step.pending');
    assert.deepEqual(await pendingNames(page), ['Task A (A)', 'Task B (B)']);

    await runStep(page, 'A', {});
    assert.deepEqual(await pendingNames(page), ['Task B (B)'], 'not the join');
    assert.match(await page.locator('.test-inside').innerText(), /not a step here: Join/);
    assert.deepEqual(await marked(page, 'test-waiting'), ['B', 'Join']);

    await runStep(page, 'B', {});
    assert.deepEqual(await pendingNames(page), ['After both (After)'], 'once, after both branches');
    assert.equal(await page.locator('.test-inside').count(), 0);

    // Simulate: the join starts when the first branch arrives and ends only when the second has
    await page.evaluate(() => {
        window.simulated = [];
        const state = id => { const c = document.querySelector(`.djs-element[data-element-id="${id}"]`).classList; return c.contains('test-passed') ? 'done' : c.contains('test-started') ? 'started' : c.contains('test-waiting') ? 'waiting' : null; };
        const last = {};
        window.watch = setInterval(() => ['A', 'B', 'Join', 'After'].forEach(id => {
            const s = state(id);
            if (s !== last[id]) { last[id] = s; if (s) window.simulated.push(`${id} ${s}`); }
        }), 30);
    });
    await page.click('.test-simulate');
    await page.waitForSelector('.test-status:text("Simulation done")', { timeout: 30000 });
    const simulated = await page.evaluate(() => { clearInterval(window.watch); return window.simulated; });
    const at = event => simulated.lastIndexOf(event);     // the simulation's, after the live run's marks
    // started (blue) and done (green) apart; what still waits turns waiting (orange) at the end
    assert.ok(at('A done') < at('Join started') && at('Join started') < at('B done') && at('B done') < at('Join done')
        && at('Join done') < at('After started') && at('After started') < at('After waiting'), simulated.join(' → '));
    assert.deepEqual(errors, []);
    await close();
});

test('a scenario keeps its runs: after a reload its last run is shown and simulated without running again', async () => {
    let { page, close } = await openTestTab();
    await page.locator('.test-list li', { hasText: 'Long leave' }).click();
    await page.click('.test-replay');
    await page.waitForSelector('.test-result.ok');
    const instanceId = await page.evaluate(() => window.bpmnModeler.get('testPanel')._results.get(window.bpmnModeler.get('testPanel')._current).instance.id);
    await close();

    ({ page, close } = await openTestTab());
    // the list shows each scenario's last kept result before anything runs
    const listed = await page.locator('.test-list li').evaluateAll(lis => lis.map(li => li.innerText.replace(/\s+/g, ' ').trim()));
    assert.ok(listed.includes('✓ Long leave'), listed.join(' | '));
    await page.locator('.test-list li', { hasText: 'Long leave' }).click();
    await page.waitForSelector(`.test-runs tr.shown[data-instance-id="${instanceId}"]`);
    assert.match(await page.locator('.test-runs tr.shown').innerText(), /✓.*Run/s);
    await page.waitForSelector('.test-result.ok');
    assert.ok((await page.locator('.test-items tbody tr').count()) > 5, 'its items');
    assert.equal(await page.locator('.test-simulate').isDisabled(), false, 'Simulate without running');
    await page.click('.test-simulate');
    await page.waitForSelector('.test-status:text("Simulation done")', { timeout: 30000 });
    assert.ok(await page.locator('.test-seq').count() > 3);

    // an earlier run opens too
    const runs = await page.locator('.test-runs tbody tr').count();
    assert.ok(runs >= 2, `runs kept: ${runs}`);
    await page.locator('.test-runs tbody tr').nth(1).click();
    await page.waitForFunction(id => document.querySelector('.test-runs tr.shown')?.dataset.instanceId !== id, instanceId);
    await close();
});

test('a step-by-step run, closed, stays the scenario\'s last run: Simulate replays it', async () => {
    const { page, errors, close } = await openTestTab();
    await page.click('.test-new');
    await page.fill('.test-name', 'Closed then simulated');
    await page.click('.test-run');
    await page.waitForSelector('.test-step.pending');
    await runStep(page, 'Submit', { days: 2 });
    await page.waitForSelector('.test-finished');
    await page.click('.test-stop');
    assert.equal(await page.locator('.test-simulate').isDisabled(), false);
    await page.click('.test-simulate');
    await page.waitForSelector('.test-status:text("Simulation done")', { timeout: 20000 });
    assert.deepEqual(errors, []);
    await close();
});
