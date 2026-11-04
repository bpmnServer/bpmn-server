// @features: forms, run-one-element, test-tab
// The editor's Test tab: a scenario is started from its start form and run step by step (what waits shows as the
// next steps), its steps are kept, Run / Run all repeat them, its checks run after a step or at the end; the
// path is marked on the diagram and simulated one change at a time; Debug changes the variables and restarts a step.
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

/** Start: the start form opens; Start the process starts it. */
async function startRun(page) {
    await page.click('.test-run');
    await page.click('.test-start-go');
    await page.waitForSelector('.test-step.pending, .test-finished');
}

/** Add a check: the last row's When, What and fields. */
async function addCheck(page, { at = 'end', kind, node, count, status, path, op, value }) {
    await page.click('.test-check-add');
    const row = page.locator('.test-check-row').last();
    await row.locator('.test-check-at').selectOption(at);
    await row.locator('.test-check-kind').selectOption(kind);
    if (node !== undefined) await row.locator('.test-check-node').selectOption(node);
    if (count !== undefined) await row.locator('.test-check-count').fill(String(count));
    if (status !== undefined) await row.locator('.test-check-status').selectOption(status);
    if (path !== undefined) await row.locator('.test-check-path').fill(path);
    if (op !== undefined) await row.locator('.test-check-op').selectOption(op);
    if (value !== undefined) await row.locator('.test-check-value').fill(String(value));
}

/** Simulate: it opens paused on the first change; Play shows the rest. */
async function simulateAll(page) {
    await page.click('.test-simulate');
    await page.click('.test-simulate');
    await page.waitForSelector('.test-status:text("Simulation done")', { timeout: 30000 });
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
    await addCheck(page, { kind: 'status', status: 'end' });
    await addCheck(page, { kind: 'node', node: 'Approve' });
    assert.equal(await page.locator('.test-run').innerText(), 'Start');
    assert.equal(await page.locator('.test-start').count(), 0, 'the start form only when Start is clicked');
    await page.click('.test-run');
    assert.equal(await page.locator('.test-start').isVisible(), true);
    await page.click('.test-start-go');

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
    await page.click('.test-tab-design');
    assert.deepEqual(await page.locator('.test-step.saved .test-step-name').allInnerTexts(), ['Submit request (Submit)', 'Approve request (Approve)']);
    assert.deepEqual(errors, []);
    await close();
});

test('another run follows the saved steps, prefilled; a different choice changes the path', async () => {
    const { page, close } = await openTestTab();
    await page.locator('.test-list li', { hasText: 'Long leave' }).click();
    await startRun(page);
    assert.equal(await page.locator('.test-step.pending [data-field="days"]').inputValue(), '10', 'the saved step');

    await page.click('.test-duplicate, .test-editor-actions button:has-text("Duplicate")');
    await page.fill('.test-name', 'Short leave');
    await page.locator('.test-check-node').selectOption('AutoApprove');
    await startRun(page);
    await runStep(page, 'Submit', { days: 2 });         // 5 days or fewer: approved automatically, nothing waits
    await page.waitForSelector('.test-finished');
    await page.waitForSelector('.test-result.ok');
    assert.deepEqual(await marked(page, 'test-passed'), ['AutoApprove', 'AutoApproved', 'LongLeave', 'Requested', 'Submit']);
    await page.click('.test-stop');
    await page.click('.test-tab-design');
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

    // one change at a time: it opens paused on the first
    await page.click('.test-simulate');
    assert.equal(await page.locator('.test-simulate').innerText(), 'Play');
    assert.match(await page.locator('.test-status').innerText(), /^1 of \d+: Leave requested \(Requested\) started$/);
    assert.equal(await page.locator('.test-sim-back').isDisabled(), true, 'nothing before the first');
    const first = await page.locator('.djs-element.test-started, .djs-element.test-passed').count();
    await page.waitForTimeout(1200);
    assert.equal(await page.locator('.djs-element.test-started, .djs-element.test-passed').count(), first, 'nothing moves until Step or Play');
    await page.click('.test-sim-step');
    await page.click('.test-sim-step');
    assert.match(await page.locator('.test-status').innerText(), /^3 of \d+: /);
    await page.click('.test-sim-back');
    assert.match(await page.locator('.test-status').innerText(), /^2 of \d+: /);
    await page.click('.test-simulate');                       // play the rest
    await page.waitForSelector('.test-status:text("Simulation done")', { timeout: 20000 });
    const numbers = await page.evaluate(() => [...document.querySelectorAll('.test-seq')]
        .map(b => [b.closest('.djs-overlays').getAttribute('data-container-id'), Number(b.textContent)]));
    const order = numbers.sort((a, b) => a[1] - b[1]).map(([id]) => id);
    assert.deepEqual(order, ['Requested', 'Submit', 'LongLeave', 'AutoApprove', 'AutoApproved'], 'numbered in the order they ran');
    await page.click('.test-sim-stop');
    assert.equal(await page.locator('.test-simulate').innerText(), 'Simulate');

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
    await startRun(page);
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
    await simulateAll(page);
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
    await page.click('.test-tab-runs');
    await page.waitForSelector(`.test-runs tr.shown[data-instance-id="${instanceId}"]`);
    assert.match(await page.locator('.test-runs tr.shown').innerText(), /✓.*Run/s);
    await page.waitForSelector('.test-result.ok');
    assert.ok((await page.locator('.test-items tbody tr').count()) > 5, 'its items');
    assert.equal(await page.locator('.test-simulate').isDisabled(), false, 'Simulate without running');
    await simulateAll(page);
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
    await startRun(page);
    await runStep(page, 'Submit', { days: 2 });
    await page.waitForSelector('.test-finished');
    await page.click('.test-stop');
    assert.equal(await page.locator('.test-simulate').isDisabled(), false);
    await simulateAll(page);
    assert.deepEqual(errors, []);
    await close();
});

test('debug: a check after a step; the variables changed; a step restarted and run again; why the engine went where it did', async () => {
    const { page, errors, close } = await openTestTab();
    await page.click('.test-new');
    await page.fill('.test-name', 'Debugged');
    await addCheck(page, { at: 'after:Submit', kind: 'data', path: 'days', op: '>', value: 5 });
    await startRun(page);
    await page.click('.test-debug');

    await runStep(page, 'Submit', { days: 10 });
    const done = page.locator('.test-step.done[data-element-id="Submit"]');
    assert.deepEqual(await done.locator('.test-step-checks li').allInnerTexts(), ['✓ after Submit: data.days > 5']);
    assert.deepEqual(await pendingNames(page), ['Approve request (Approve)'], 'a long leave: the manager');

    // the variables now, one added, applied
    const variables = page.locator('.test-variables');
    const names = await variables.locator('.test-variable-name').evaluateAll(inputs => inputs.map(i => i.value));
    assert.ok(names.includes('days'), names.join());
    await variables.locator('.test-variable-add').click();
    await variables.locator('.test-variable-name').last().fill('note');
    await variables.locator('.test-variable-value').last().fill('checked');
    await variables.locator('.test-variables-apply').click();
    await page.waitForSelector('.test-status:text("Variables changed")');
    assert.match(await page.locator('.test-result .test-data').first().innerText(), /"note": "checked"/);

    // back to Submit: it waits again, and a short leave goes the other way
    await done.locator('.test-restart').click();
    await done.locator('.test-restart-form .test-variables-apply').click();
    await page.waitForSelector('.test-status:text("Back at Submit request (Submit)")');
    assert.equal(await page.locator('.test-step.done').count(), 0, 'no step done before it');
    assert.deepEqual(await pendingNames(page), ['Submit request (Submit)']);
    await runStep(page, 'Submit', { days: 2 });
    await page.waitForSelector('.test-finished');
    assert.deepEqual(await page.locator('.test-step.done .test-step-checks li').allInnerTexts(), ['✗ after Submit: data.days > 5 (is 2)']);

    // why: the gateway's condition with the value it read
    const why = await page.locator('.test-decisions').innerText();
    assert.match(why, /action: not taken\s+why:[^]*condition[^]*days[^]*result: false \(days=2\)/);
    assert.match(why, /takes its default flow/);
    assert.deepEqual(errors, []);
    await close();
});

test('the runs: a kept run debugged again and restarted at a step; a run deleted; all cleared', async () => {
    const { page, errors, close } = await openTestTab();
    await page.locator('.test-list li', { hasText: 'Long leave' }).click();
    assert.equal(await page.locator('.test-tab-design').getAttribute('aria-selected'), 'true', 'a scenario opens on its design');
    await page.click('.test-replay');                           // a run: the Runs section shows it
    await page.waitForSelector('.test-result.ok');
    assert.equal(await page.locator('.test-tab-runs').getAttribute('aria-selected'), 'true');
    assert.equal(await page.locator('.test-instance-link').getAttribute('target'), '_blank');

    // Debug on a kept run: its steps done, from its items; Restart here goes back to one
    await page.click('.test-debug');
    await page.waitForSelector('.test-step.done[data-element-id="Approve"]');
    assert.deepEqual(await page.locator('.test-step.done .test-step-name').allInnerTexts(), ['✓ Submit request (Submit)', '✓ Approve request (Approve)']);
    const approve = page.locator('.test-step.done[data-element-id="Approve"]');
    await approve.locator('.test-restart').click();
    await approve.locator('.test-restart-form .test-variables-apply').click();
    await page.waitForSelector('.test-status:text("Back at Approve request (Approve)")');
    assert.deepEqual(await pendingNames(page), ['Approve request (Approve)'], 'Approve waits again');

    // a run deleted: gone from the list, its instance too
    const before = await page.locator('.test-runs tbody tr').count();
    const deleted = await page.locator('.test-runs tr.shown').getAttribute('data-instance-id');
    await page.click('.test-run-delete');
    await page.waitForSelector('.test-status:text("Run deleted")');
    assert.equal(await page.locator('.test-runs tbody tr').count(), before - 1);
    assert.equal(await web.bpmnServer.dataStore.findInstance({ id: deleted }, 'summary').catch(() => null), null, 'its instance is deleted');

    // Clear all: every run of every scenario
    await page.click('.test-clear-all');
    await page.waitForSelector('.test-status:text("runs cleared")');
    assert.equal(await page.locator('.test-runs tbody tr').count(), 0);
    assert.equal(await page.locator('.test-clear-all').isDisabled(), true);
    assert.deepEqual(errors, []);
    await close();
});

test('Test this task: the task selected on the diagram, by itself; a script runs, a user task waits for its step; nothing after', async () => {
    const { page, errors, close } = await openTestTab();
    const select = id => page.evaluate(id => window.bpmnModeler.get('selection').select(window.bpmnModeler.get('elementRegistry').get(id)), id);

    // a script task: its input, then what it did
    await select('AutoApprove');
    await page.click('.test-task');
    assert.equal(await page.inputValue('.test-name'), 'Approve automatically by itself');
    assert.equal(await page.inputValue('.test-start-event'), 'AutoApprove');
    assert.equal(await page.locator('.test-start-go').innerText(), 'Run the task');
    await page.fill('textarea.test-start-data', '{"days": 2}');
    await page.click('.test-start-go');
    await page.waitForSelector('.test-finished');
    assert.match(await page.locator('.test-finished').innerText(), /the instance is end/);
    const items = await page.locator('.test-items tbody tr').evaluateAll(trs => trs.map(tr => tr.dataset.elementId));
    assert.deepEqual(items, ['AutoApprove'], 'that task only');

    // a user task: it waits; its step completes it, and the run ends there
    await page.click('.test-stop');
    await select('Approve');
    await page.click('.test-task');
    await page.click('.test-start-go');
    await page.waitForSelector('.test-step.pending');
    assert.deepEqual(await pendingNames(page), ['Approve request (Approve)']);
    await runStep(page, 'Approve', { approved: true });
    await page.waitForSelector('.test-finished');
    assert.deepEqual(await page.locator('.test-items tbody tr').evaluateAll(trs => trs.map(tr => tr.dataset.elementId)), ['Approve']);

    // nothing selected: a message
    await page.click('.test-stop');
    await page.evaluate(() => window.bpmnModeler.get('selection').select(null));
    await page.click('.test-task');
    assert.match(await page.locator('.test-status').innerText(), /Select a task on the diagram first/);
    assert.deepEqual(errors, []);
    await close();
});
