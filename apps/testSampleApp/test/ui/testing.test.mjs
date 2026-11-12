// @features: forms, run-one-element, test-tab
// The editor's Test tab: a scenario is recorded from its start form, step by step (what waits shows as the next
// steps) and closes by itself at the end; its steps are kept, Run / Run all repeat them, its checks run after a step or
// at the end; it keeps its last run; the path is marked on the diagram and simulated one change at a time
// (its panel); Debug changes the variables and restarts a step (its panel); the panel can take the full window.
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

/** Record: the start form opens; Start recording starts it, and a step waits. */
async function startRun(page) {
    await page.click('.test-run');
    await page.click('.test-start-go');
    await page.waitForSelector('.test-step.pending');
}

/** New: The whole process. */
async function newScenario(page) {
    await page.click('.test-new-menu summary');
    await page.click('.test-new');
}

/** New: The task selected. */
async function newTask(page) {
    await page.click('.test-new-menu summary');
    await page.click('.test-task');
}

const pick = (page, name) => page.locator('.test-tree-row', { hasText: name }).click();
/** The tree's scenarios: their result and name. */
const listed = page => page.locator('.test-tree-row').evaluateAll(rows => rows.map(r => `${r.querySelector('.test-badge').textContent} ${r.querySelector('.test-tree-name').textContent}`));
/** What the last result's checks found (the result line says only Passed or Failed). */
const checkResults = page => page.evaluate(() => {
    const panel = window.bpmnModeler.get('testPanel');
    return panel._results.get(panel._current).checks.map(c => `${c.ok ? '✓' : '✗'} ${c.what}${!c.ok && c.actual !== undefined ? ` (is ${JSON.stringify(c.actual)})` : ''}`);
});
const savedNames = page => page.locator('.test-step.saved .test-step-name').allInnerTexts();

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

/** Simulate: its panel opens paused on the first change; Play shows the rest. */
async function simulateAll(page) {
    await page.click('.test-simulate');
    await page.click('.test-sim-play');
    await page.waitForSelector('.test-sim-text:text("Done (")', { timeout: 30000 });
}

const marked = (page, marker) => page.evaluate(m => [...document.querySelectorAll(`.djs-element.${m}`)].map(e => e.dataset.elementId).sort(), marker);
const pendingNames = page => page.locator('.test-step.pending .test-step-name').allInnerTexts();

/** Run the pending step of an element with data (into its form fields, the rest as JSON); wait for it to be done, or for the recording to close. */
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
    await page.waitForFunction(n => document.querySelectorAll('.test-step.done').length > n || !document.querySelector('.test-summary.recording'), done);
}

test('Run shows what waits; running a step shows what waits next, until the end', async () => {
    const { page, errors, close } = await openTestTab();
    await newScenario(page);
    await page.fill('.test-name', 'Long leave');
    await addCheck(page, { kind: 'status', status: 'end' });
    await addCheck(page, { kind: 'node', node: 'Approve' });
    assert.equal(await page.locator('.test-run').innerText(), '● Record');
    assert.equal(await page.locator('.test-check-add').count(), 1, 'one Add check');
    assert.match(await page.locator('.test-summary-title').innerText(), /Not run yet/);
    assert.equal(await page.locator('.test-start').count(), 0, 'the start form only when Record is clicked');
    await page.click('.test-run');
    assert.equal(await page.locator('.test-start').isVisible(), true);
    await page.click('.test-start-go');

    await page.waitForSelector('.test-step.pending');
    assert.deepEqual(await pendingNames(page), ['Submit request (Submit)']);
    assert.match(await page.locator('.test-summary-title').innerText(), /Recording/);
    assert.equal(await page.locator('.test-step.pending .test-step-run').innerText(), 'Complete step');
    // Submit has form fields: a form, typed, with the fields' labels
    const form = page.locator('.test-step.pending .test-form');
    assert.deepEqual(await form.locator('.test-form-field > span').allInnerTexts(), ['Days', 'Reason']);
    assert.equal(await form.locator('[data-field="days"]').getAttribute('type'), 'number', 'a long is a number');
    assert.equal(await form.locator('[data-field="days"]').inputValue(), '0');
    assert.deepEqual(await marked(page, 'test-waiting'), ['Submit']);

    await runStep(page, 'Submit', { days: 10 });       // more than 5 days: the manager approves
    assert.deepEqual(await pendingNames(page), ['Approve request (Approve)']);
    assert.deepEqual(await marked(page, 'test-waiting'), ['Approve']);

    // the last step: the recording closes by itself, and its result shows
    await runStep(page, 'Approve', { approved: true });
    await page.waitForSelector('.test-summary.ok');
    assert.equal(await page.locator('.test-summary-title').innerText(), '✓ Passed');
    assert.equal(await page.locator('.test-stop-recording').count(), 0);
    assert.equal(await page.locator('.test-finished').count(), 0);
    assert.equal(await page.locator('.test-inspect').evaluate(d => d.open), true, 'Inspect this run shows');
    assert.deepEqual(await checkResults(page), ['✓ status is end', '✓ passes Approve']);
    assert.equal(await page.locator('.test-summary .test-checks').count(), 0, 'Passed or Failed is enough at the top');
    assert.deepEqual(await marked(page, 'test-passed'), ['Approve', 'Approved', 'LongLeave', 'Requested', 'Submit']);

    // the items, in the order they ran; a row selects its element
    const rows = await page.locator('.test-items tbody tr').evaluateAll(trs => trs.map(tr => [...tr.cells].slice(0, 5).map(td => td.innerText)));
    const elements = rows.map(r => r[1]);
    assert.ok(elements.indexOf('Submit') < elements.indexOf('LongLeave') && elements.indexOf('LongLeave') < elements.indexOf('Approve'), elements.join());
    assert.deepEqual(rows.find(r => r[1] === 'Approve').slice(2), ['Approve request', 'UserTask', 'end']);
    await page.locator('.test-items tbody tr[data-element-id="LongLeave"]').click();
    assert.deepEqual(await page.evaluate(() => window.bpmnModeler.get('selection').get().map(e => e.id)), ['LongLeave']);

    // the steps run are the scenario's
    assert.deepEqual(await savedNames(page), ['✓ Submit request (Submit)', '✓ Approve request (Approve)']);
    assert.match(await page.locator('.test-summary-title').getAttribute('title'), /^Recorded, /);
    assert.deepEqual(errors, []);
    await close();
});

test('another run follows the saved steps, prefilled; a different choice changes the path', async () => {
    const { page, close } = await openTestTab();
    await pick(page, 'Long leave');
    await startRun(page);
    assert.equal(await page.locator('.test-step.pending [data-field="days"]').inputValue(), '10', 'the saved step');

    await page.click('.test-scenario-menu summary');
    await page.click('.test-duplicate');
    await page.fill('.test-name', 'Short leave');
    await page.locator('.test-check-row', { hasText: 'Approve' }).locator('.test-check-edit').click();
    await page.locator('.test-check-node').selectOption('AutoApprove');
    await startRun(page);
    await runStep(page, 'Submit', { days: 2 });         // 5 days or fewer: approved automatically, nothing waits
    await page.waitForSelector('.test-summary.ok');
    assert.deepEqual(await marked(page, 'test-passed'), ['AutoApprove', 'AutoApproved', 'LongLeave', 'Requested', 'Submit']);
    assert.deepEqual(await savedNames(page), ['✓ Submit request (Submit)'], 'the path taken, not the one copied');
    await page.waitForTimeout(1000);     // saved after a pause
    await close();
});

test('Run repeats the saved steps on a new instance; Simulate numbers its path; Run all runs every scenario', async () => {
    const { page, close } = await openTestTab();
    await pick(page, 'Short leave');
    assert.equal(await page.locator('.test-replay').innerText(), '▶ Run');
    await page.click('.test-replay');
    await page.waitForSelector('.test-status:text("Short leave: passed")');     // this Run's result, not the kept one
    assert.deepEqual(await savedNames(page), ['✓ Submit request (Submit)']);

    // one change at a time: its panel opens, paused on the first
    assert.equal(await page.locator('.test-sim-panel').isVisible(), false);
    await page.click('.test-simulate');
    assert.equal(await page.locator('.test-sim-panel').isVisible(), true);
    assert.equal(await page.locator('.test-sim-play').innerText(), '▶ Play');
    assert.match(await page.locator('.test-sim-text').innerText(), /^1 of \d+: Leave requested \(Requested\) started$/);
    assert.equal(await page.locator('.test-sim-back').isDisabled(), true, 'nothing before the first');
    const first = await page.locator('.djs-element.test-started, .djs-element.test-passed').count();
    await page.waitForTimeout(1200);
    assert.equal(await page.locator('.djs-element.test-started, .djs-element.test-passed').count(), first, 'nothing moves until Step or Play');
    await page.click('.test-sim-step');
    await page.click('.test-sim-step');
    assert.match(await page.locator('.test-sim-text').innerText(), /^3 of \d+: /);
    await page.click('.test-sim-back');
    assert.match(await page.locator('.test-sim-text').innerText(), /^2 of \d+: /);
    await page.click('.test-sim-play');                       // play the rest
    await page.waitForSelector('.test-sim-text:text("Done (")', { timeout: 20000 });
    const numbers = await page.evaluate(() => [...document.querySelectorAll('.test-seq')]
        .map(b => [b.closest('.djs-overlays').getAttribute('data-container-id'), Number(b.textContent)]));
    const order = numbers.sort((a, b) => a[1] - b[1]).map(([id]) => id);
    assert.deepEqual(order, ['Requested', 'Submit', 'LongLeave', 'AutoApprove', 'AutoApproved'], 'numbered in the order they ran');
    await page.click('.test-sim-stop');
    assert.equal(await page.locator('.test-sim-panel').isVisible(), false);

    await page.click('.test-run-all');
    await page.waitForSelector('.test-status:text("passed")');
    assert.equal(await page.locator('.test-status').innerText(), 'All 2 passed');
    assert.deepEqual(await listed(page), ['✓ Long leave', '✓ Short leave']);
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
    await web.bpmnServer.engine.install({ rebuild: true });
    const { page, errors, close } = await openTestTab('parallel-ui');
    await newScenario(page);
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

test('a scenario keeps its last run: after a reload it is shown and simulated without running again; the next run replaces it, and its instance', async () => {
    let { page, close } = await openTestTab();
    await pick(page, 'Long leave');
    await page.click('.test-replay');
    await page.waitForSelector('.test-status:text("Long leave: passed")');
    const instanceId = await page.evaluate(() => window.bpmnModeler.get('testPanel')._results.get(window.bpmnModeler.get('testPanel')._current).instance.id);
    await close();

    ({ page, close } = await openTestTab());
    // the list shows each scenario's last kept result before anything runs
    assert.ok((await listed(page)).includes('✓ Long leave'), (await listed(page)).join(' | '));
    await pick(page, 'Long leave');
    await page.waitForSelector('.test-summary.ok');
    assert.match(await page.locator('.test-summary-title').getAttribute('title'), /^Run, /);
    assert.match(await page.locator('.test-instance-link').getAttribute('href'), new RegExp(instanceId));
    assert.ok((await page.locator('.test-items tbody tr').count()) > 5, 'its items');
    assert.equal(await page.locator('.test-simulate').isDisabled(), false, 'Simulate without running');
    await simulateAll(page);
    assert.ok(await page.locator('.test-seq').count() > 3);

    // Run again: this run replaces it, and its instance is deleted
    await page.click('.test-replay');
    await page.waitForFunction(id => { const panel = window.bpmnModeler.get('testPanel'); const shown = panel._results.get(panel._current)?.instance?.id; return shown && shown !== id; }, instanceId);
    assert.equal(await page.evaluate(() => window.bpmnModeler.get('testPanel')._current.runs.length), 1);
    await page.waitForTimeout(500);
    assert.equal(await web.bpmnServer.dataStore.findInstance({ id: instanceId }, 'summary').catch(() => null), null, 'the instance before it is deleted');
    await close();
});

test('a recording, closed by itself, stays the scenario\'s last run: Simulate replays it', async () => {
    const { page, errors, close } = await openTestTab();
    await newScenario(page);
    await page.fill('.test-name', 'Closed then simulated');
    await startRun(page);
    await runStep(page, 'Submit', { days: 2 });
    await page.waitForSelector('.test-summary.ok');
    assert.equal(await page.locator('.test-simulate').isDisabled(), false);
    await simulateAll(page);
    assert.deepEqual(errors, []);
    await close();
});

test('debug: a check after a step; the variables changed; a step restarted and run again; why the engine went where it did', async () => {
    const { page, errors, close } = await openTestTab();
    await newScenario(page);
    await page.fill('.test-name', 'Debugged');
    await addCheck(page, { at: 'after:Submit', kind: 'data', path: 'days', op: '>', value: 5 });
    await startRun(page);
    await page.click('.test-debug');
    await page.waitForSelector('.test-debug-panel .test-variables');

    await runStep(page, 'Submit', { days: 10 });
    const done = page.locator('.test-step.done[data-element-id="Submit"]');
    assert.equal(await done.locator('.test-check-icon.ok').count(), 1, 'its shield is green as soon as the step is done');
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
    assert.match(await page.locator('.test-data-row[data-path="note"]').innerText(), /"checked"/);

    // back to Submit: it waits again, and a short leave goes the other way
    await done.locator('.test-restart').click();
    await done.locator('.test-restart-form .test-variables-apply').click();
    await page.waitForSelector('.test-status:text("Back at Submit request (Submit)")');
    assert.equal(await page.locator('.test-step.done').count(), 0, 'no step done before it');
    assert.deepEqual(await pendingNames(page), ['Submit request (Submit)']);
    await runStep(page, 'Submit', { days: 2 });
    await page.waitForSelector('.test-summary.failed');
    assert.equal(await page.locator('.test-summary-title').innerText(), '✗ Failed');
    assert.deepEqual(await checkResults(page), ['✗ after Submit: data.days > 5 (is 2)']);
    assert.equal(await page.locator('.test-debug-panel').count(), 0, 'closed with the recording');

    // why: the gateway's condition with the value it read, in the timeline (each step opened to what happened)
    for (const summary of await page.locator('.test-timeline .test-steps-rows > summary').all()) await summary.click();
    const why = await page.locator('.test-timeline').innerText();
    assert.deepEqual(await page.locator('.test-timeline table').first().locator('th').allInnerTexts(), ['Seq #', 'At', 'Element', 'Type', 'What happened', ''],
        'as on the instance page, the why under its row; a column for Add check');
    assert.match(await page.locator('.test-timeline .test-rationale-decision.not').first().innerText(), /not taken/);
    assert.match(why, /condition[^]*days[^]*result: false \(days=2\)/);
    assert.match(why, /takes its default flow/);
    assert.deepEqual(errors, []);
    await close();
});

test('which check failed: its shield is red, with what was found; kept with the run; a check changed since is not marked', async () => {
    const { page, errors, close } = await openTestTab();
    const atEnd = page.locator('.test-checks-editor .test-check-row');
    await newScenario(page);
    await page.fill('.test-name', 'Which check');
    await addCheck(page, { kind: 'node', node: 'Submit' });
    await addCheck(page, { kind: 'node', node: 'Submit', count: 0 });
    await addCheck(page, { kind: 'status', status: 'wait' });
    await addCheck(page, { kind: 'data', path: 'days', op: '=', value: 999 });
    await addCheck(page, { kind: 'data', path: 'missing', op: '=', value: 1 });
    while (await page.locator('.test-check-done').count()) await page.locator('.test-check-done').first().click();
    assert.equal(await atEnd.locator('.test-check-icon.ok, .test-check-icon.failed').count(), 0, 'not run yet: not marked');

    await startRun(page);
    await runStep(page, 'Submit', { days: 2 });
    await page.waitForSelector('.test-summary.failed');
    const results = async () => atEnd.evaluateAll(rows => rows.map(r => [
        r.querySelector('.test-check-icon').classList.contains('ok') ? 'ok' : r.querySelector('.test-check-icon').classList.contains('failed') ? 'failed' : 'none',
        r.querySelector('.test-check-found')?.textContent ?? '']));
    const expected = [['ok', ''], ['failed', 'Found: 1 time'], ['failed', 'Found: the instance has ended'], ['failed', 'Found: 2'], ['failed', 'Found: no value']];
    assert.deepEqual(await results(), expected);
    assert.equal(await page.locator('.test-summary-title').innerText(), '✗ Failed', 'the top stays Passed or Failed');

    // kept with the run: after a reload too
    await page.waitForTimeout(1000);
    await page.reload();
    await page.waitForSelector('#js-canvas .djs-shape');
    await page.click('#js-tab-test');
    await pick(page, 'Which check');
    await page.waitForSelector('.test-summary.failed');
    assert.deepEqual(await results(), expected);

    // changed since the run: what the run found is not about this check
    await atEnd.nth(3).locator('.test-check-edit').click();
    await atEnd.nth(3).locator('.test-check-value').fill('2');
    await atEnd.nth(3).locator('.test-check-done').click();
    assert.deepEqual((await results())[3], ['none', '']);
    assert.deepEqual(errors, []);
    await close();
});

test('the runs: a kept run debugged again and restarted at a step; a run deleted; all cleared', async () => {
    const { page, errors, close } = await openTestTab();
    await pick(page, 'Long leave');
    await page.click('.test-replay');
    await page.waitForSelector('.test-status:text("Long leave: passed")');
    assert.equal(await page.locator('.test-summary .test-instance-link').getAttribute('target'), '_blank');
    const shownInstance = () => page.evaluate(() => { const panel = window.bpmnModeler.get('testPanel'); return panel._results.get(panel._current).instance.id; });

    // Debug on a kept run: its steps done, from its items; Restart here goes back to one
    await page.click('.test-debug');
    await page.waitForSelector('.test-step.done[data-element-id="Approve"]');
    assert.deepEqual(await page.locator('.test-step.done .test-step-name').allInnerTexts(), ['✓ Submit request (Submit)', '✓ Approve request (Approve)']);
    const approve = page.locator('.test-step.done[data-element-id="Approve"]');
    await approve.locator('.test-restart').click();
    await approve.locator('.test-restart-form .test-variables-apply').click();
    await page.waitForSelector('.test-status:text("Back at Approve request (Approve)")');
    assert.deepEqual(await pendingNames(page), ['Approve request (Approve)'], 'Approve waits again');

    // Stop debugging ends a kept run's debugging: one way out, and Record is back
    assert.equal(await page.locator('.test-stop-recording').count(), 0);
    assert.equal(await page.locator('.test-finished .test-stop').count(), 0);
    await page.click('.test-debug-stop');
    await page.waitForFunction(() => !document.querySelector('.test-debug-panel'));
    assert.equal(await page.locator('.test-run').count(), 1);

    // the run deleted: not run any more, its instance gone
    const deleted = await shownInstance();
    await page.click('.test-summary .test-run-delete');
    await page.waitForSelector('.test-status:text("Run deleted")');
    assert.equal(await page.locator('.test-summary-title').innerText(), 'Not run yet');
    assert.equal(await web.bpmnServer.dataStore.findInstance({ id: deleted }, 'summary').catch(() => null), null, 'its instance is deleted');

    // Delete all runs: every run of every scenario; the scenarios stay
    const scenarios = await page.locator('.test-tree-row').count();
    await page.click('.test-list-menu summary');
    await page.click('.test-clear-all');
    await page.waitForSelector('.test-status:text("runs cleared")');
    assert.equal(await page.locator('.test-tree-row').count(), scenarios);
    assert.equal(await page.locator('.test-clear-all').isDisabled(), true);
    assert.deepEqual(errors, []);
    await close();
});

test('New, The task selected: the task selected on the diagram, by itself; a script runs, a user task waits for its step; nothing after', async () => {
    const { page, errors, close } = await openTestTab();
    const select = id => page.evaluate(id => window.bpmnModeler.get('selection').select(window.bpmnModeler.get('elementRegistry').get(id)), id);

    // a script task: its input, then what it did
    await select('AutoApprove');
    await newTask(page);
    assert.equal(await page.inputValue('.test-name'), 'Approve automatically by itself');
    assert.equal(await page.inputValue('.test-start-event'), 'AutoApprove');
    assert.equal(await page.locator('.test-start-go').innerText(), 'Run the task');
    await page.fill('textarea.test-start-data', '{"days": 2}');
    await page.click('.test-start-go');
    await page.waitForSelector('.test-summary.ok');
    const items = await page.locator('.test-items tbody tr').evaluateAll(trs => trs.map(tr => tr.dataset.elementId));
    assert.deepEqual(items, ['AutoApprove'], 'that task only');

    // a user task: it waits; its step completes it, and the run ends there
    await select('Approve');
    await newTask(page);
    await page.click('.test-start-go');
    await page.waitForSelector('.test-step.pending');
    assert.deepEqual(await pendingNames(page), ['Approve request (Approve)']);
    await runStep(page, 'Approve', { approved: true });
    await page.waitForSelector('.test-summary.ok');
    assert.deepEqual(await page.locator('.test-items tbody tr').evaluateAll(trs => trs.map(tr => tr.dataset.elementId)), ['Approve']);

    // nothing selected: a message
    await page.evaluate(() => window.bpmnModeler.get('selection').select(null));
    await newTask(page);
    assert.match(await page.locator('.test-status').innerText(), /Select a task on the diagram first/);
    assert.deepEqual(errors, []);
    await close();
});

test('Add as a check: on a step\'s row, or a value; the check under the row of its item; the step is when it is checked', async () => {
    const { page, errors, close } = await openTestTab();
    // the item's row in the step that changed it (What happened, opened first): its Add as a check
    const addItem = async id => {
        const row = page.locator(`.test-timeline .test-rationale-scroll tbody tr[data-element="${id}"]:has(.test-add-check)`).last();
        const details = row.locator('xpath=ancestor::details[1]');
        if (!(await details.evaluate(d => d.open))) await details.locator(':scope > summary').click();
        await row.locator('.test-add-check').click();
    };
    const addValue = path => page.locator(`.test-data-row[data-path="${path}"] .test-add-check`).click();
    const prose = locator => locator.locator('.test-check-prose').allInnerTexts();
    const atStart = page.locator('.test-step-start .test-check-row');
    const afterSubmit = page.locator('.test-step[data-element-id="Submit"] .test-check-row');
    const afterApprove = page.locator('.test-step[data-element-id="Approve"] .test-check-row');
    await newScenario(page);
    await page.fill('.test-name', 'Checks from the run');
    await startRun(page);

    // just started: Submit waits, a row of the start; its check at the start, under that row, found as it is added
    await addItem('Submit');
    assert.deepEqual(await prose(atStart), ['Submit request (Submit) was reached 1 time, and is waiting']);
    await atStart.locator('.test-check-icon.ok').waitFor();
    const under = atStart.locator('xpath=ancestor::tr[1]/preceding-sibling::tr[1]');
    assert.equal(await under.getAttribute('data-element'), 'Submit', 'under the row of its item');

    // Edit opens its fields, with no When: the step is when; Done back to words
    await atStart.locator('.test-check-edit').click();
    assert.equal(await atStart.locator('.test-check-at').count(), 0);
    assert.equal(await atStart.locator('.test-check-kind').inputValue(), 'node');
    assert.equal(await atStart.locator('.test-check-node').inputValue(), 'Submit');
    assert.equal(await atStart.locator('.test-check-status').inputValue(), 'wait');
    assert.equal(await atStart.locator('.test-check-count').inputValue(), '1');
    await atStart.locator('.test-check-done').click();

    await runStep(page, 'Submit', { days: 10, nested: { level: 3 } });

    // after Submit: Approve waits, a row of Submit's step; values from the Data, under Submit's own row
    await addItem('Approve');
    await addValue('days');
    await addValue('nested.level');     // a value inside an object: its own row
    assert.deepEqual(await prose(afterSubmit), ['days is 10', 'nested.level is 3', 'Approve request (Approve) was reached 1 time, and is waiting']);
    await afterSubmit.nth(0).locator('.test-check-edit').click();
    assert.equal(await afterSubmit.nth(0).locator('.test-check-path').inputValue(), 'days');
    assert.equal(await afterSubmit.nth(0).locator('.test-check-value').inputValue(), '10');
    await afterSubmit.nth(0).locator('.test-check-done').click();
    assert.equal(await page.locator('.test-data-row[data-path="days"] .test-add-check').innerText(), '✓ In checks', 'not twice');

    // a click on the button does not select the row's element
    assert.deepEqual(await page.evaluate(() => window.bpmnModeler.get('selection').get().map(e => e.id)), []);

    // finished: the end event, a row of Approve's step
    await runStep(page, 'Approve', { approved: true });
    await page.waitForSelector('.test-summary.ok');
    await addItem('Approved');
    assert.match((await prose(afterApprove)).at(-1), /Approved.* was reached, and has ended$/);

    // Run: what was added holds on the same path
    await page.waitForTimeout(800);
    await page.click('.test-replay');
    await page.waitForSelector('.test-status:text("Checks from the run: passed")');
    const checks = await checkResults(page);
    assert.equal(checks.length, 5, checks.join(' | '));
    assert.ok(checks.every(c => c.startsWith('✓')), checks.join(' | '));
    assert.ok(checks.includes('✓ at the start: passes Submit, wait, 1 time'), checks.join(' | '));

    // a step's Add check: a check of any kind, under its row, its fields open
    await startRun(page);
    await page.locator('.test-step-start .test-step-add-check').click();
    assert.equal(await atStart.count(), 2);
    // under the start's own row (its first), its fields open to choose what it checks
    const added = atStart.first();
    assert.equal(await added.locator('.test-check-kind').count(), 1, 'its fields, to choose what it checks');
    assert.equal(await added.locator('.test-check-at').count(), 0);
    await added.locator('.test-check-done').click();
    assert.match((await prose(atStart))[0], /A node: none chosen yet/);
    await atStart.first().locator('.test-check-remove').click();
    await page.click('.test-stop-recording');
    assert.deepEqual(errors, []);
    await close();
});

test('Stop ends a recording part way: the steps done stay the scenario\'s, and it is not finished', async () => {
    const { page, errors, close } = await openTestTab();
    await newScenario(page);
    await page.fill('.test-name', 'Stopped');
    await startRun(page);
    await runStep(page, 'Submit', { days: 10 });
    await page.click('.test-stop-recording');
    await page.waitForFunction(() => !document.querySelector('.test-summary.recording'));
    assert.match(await page.locator('.test-summary-title').innerText(), /Not finished/);
    assert.deepEqual(await savedNames(page), ['✓ Submit request (Submit)']);
    assert.equal(await page.locator('.test-run').count(), 1, 'Record is back');
    assert.deepEqual(errors, []);
    await close();
});

test('Full window: the panel over the whole page, on any tab; Esc or Simulate comes back; not remembered', async () => {
    const { page, errors, close } = await openTestTab();
    const box = () => page.locator('#js-dock').boundingBox();
    const isFull = async () => (await page.locator('#js-dock.full').count()) === 1;
    const docked = await box();
    assert.ok(docked.height < 1000);
    await page.click('#js-dock-full');
    assert.deepEqual(await box(), { x: 0, y: 0, width: 1440, height: 1000 });
    assert.match(await page.locator('#js-dock-full').innerText(), /Back to the editor/);
    for (const tab of ['problems', 'report', 'test']) {
        await page.click(`#js-tab-${tab}`);
        assert.equal(await isFull(), true, tab);
    }
    await page.keyboard.press('Escape');
    assert.equal(await isFull(), false);
    assert.match(await page.locator('#js-dock-full').innerText(), /Full window/);

    // Simulate shows on the diagram: it comes back
    await pick(page, 'Long leave');
    await page.click('.test-replay');
    await page.waitForSelector('.test-status:text("Long leave: passed")');
    await page.click('#js-dock-full');
    await page.click('.test-simulate');
    assert.equal(await isFull(), false);
    await page.click('.test-sim-stop');

    // hidden from full: not full; full from hidden: open
    await page.click('#js-dock-full');
    await page.click('#js-dock-toggle');
    assert.equal(await isFull(), false);
    assert.equal(await page.locator('#js-dock.collapsed').count(), 1);
    await page.click('#js-dock-full');
    assert.equal(await isFull(), true);
    assert.equal(await page.locator('#js-dock.collapsed').count(), 0);

    await page.reload();
    await page.waitForSelector('#js-canvas .djs-shape');
    assert.equal(await isFull(), false);
    assert.deepEqual(errors, []);
    await close();
});

test('the scenario list resizes: dragged, within limits, by the keyboard; drawn again and after a reload it stays', async () => {
    const { page, errors, close } = await openTestTab();
    const width = () => page.evaluate(() => Math.round(document.querySelector('.test-list').getBoundingClientRect().width));
    const drag = async by => {
        const box = await page.evaluate(() => { const { x, y } = document.querySelector('.test-list-resizer').getBoundingClientRect(); return { x, y }; });
        await page.mouse.move(box.x + 2, box.y + 50);
        await page.mouse.down();
        await page.mouse.move(box.x + 2 + by, box.y + 50, { steps: 4 });
        await page.mouse.up();
    };
    assert.equal(await width(), 220);
    await drag(120);
    assert.equal(await width(), 340);

    // drawn again: a new scenario redraws the panel
    await newScenario(page);
    assert.equal(await width(), 340);

    // the limits: the list stays usable, and so does what is beside it
    await drag(-1000);
    assert.equal(await width(), 160);
    await drag(5000);
    const room = await page.locator('.test-main').evaluate(e => e.getBoundingClientRect().width);
    assert.ok(room >= 235, `the scenario keeps its room: ${room}`);

    await drag(-5000);
    await page.locator('.test-list-resizer').focus();
    await page.keyboard.press('ArrowRight');
    assert.equal(await width(), 180);
    await page.keyboard.press('ArrowLeft');
    await page.keyboard.press('ArrowRight');
    await page.keyboard.press('ArrowRight');
    assert.equal(await width(), 200);

    await page.reload();
    await page.waitForSelector('#js-canvas .djs-shape');
    await page.click('#js-tab-test');
    await page.waitForSelector('#js-test .test-panel');
    assert.equal(await width(), 200);
    assert.deepEqual(errors, []);
    await close();
});

test('Edit as text: the whole .feature in the Test tab; what does not read is not saved; a run leaves it as typed; coverage under the scenarios', async () => {
    const { page, errors } = await openTestTab();
    const order = await page.evaluate(() => [...document.querySelector('.test-list').children].map(c => c.className));
    assert.ok(order.findIndex(c => c.includes('test-tree')) < order.findIndex(c => c.includes('test-coverage')), order.join());

    await page.click('.test-list-menu summary');
    await page.click('.test-edit-text');
    await page.waitForSelector('.test-text-input');
    assert.equal(await page.locator('.test-list').count(), 0, 'the text has the panel to itself');

    const wrong = 'Feature: x\n\n  Scenario: a\n    When @check\n    Nonsense here\n';
    await page.fill('.test-text-input', wrong);
    await page.click('.test-text-save');
    await page.waitForSelector('.test-status.error');
    assert.match(await page.locator('.test-status').innerText(), /Not saved.*\(5:/s);
    assert.equal(await page.inputValue('.test-text-input'), wrong, 'the text stays to be corrected');

    const typed = [
        'Feature: leave-request',
        '',
        '  # a comment that stays',
        '  Scenario: typed, with an expression',
        '    When @start process:leave-request as :instance',
        '    Then @check ${instance.status === "running"}',
        '',
    ].join('\n');
    await page.fill('.test-text-input', typed);
    await page.click('.test-text-save');
    await page.waitForSelector('.test-list');
    const file = path.join(web.definitionsPath, 'leave-request.feature');
    assert.equal(fs.readFileSync(file, 'utf8'), typed);

    await page.click('.test-tree li:has-text("typed, with an expression")');
    await page.waitForSelector('.test-written-edit');
    await page.click('.test-replay');
    await page.waitForSelector('.test-status:text("typed, with an expression: passed")');
    await page.waitForTimeout(1000);
    assert.equal(fs.readFileSync(file, 'utf8'), typed, 'a run leaves the file as typed');

    await page.click('.test-written-edit');
    await page.waitForSelector('.test-text-input');
    assert.equal(await page.inputValue('.test-text-input'), typed);
    page.once('dialog', dialog => dialog.accept());
    await page.fill('.test-text-input', `${typed}  # more\n`);
    await page.click('.test-text-cancel');
    await page.waitForSelector('.test-list');
    assert.equal(fs.readFileSync(file, 'utf8'), typed, 'Cancel saves nothing');
    fs.rmSync(file);
    assert.deepEqual(errors, []);
});

test('"No problems found" and Rules show with the Problems tab only', async () => {
    const { page } = await openTestTab();
    assert.equal(await page.locator('#js-lint-rules-open').isVisible(), false);
    assert.equal(await page.locator('#js-problems-status').isVisible(), false);
    await page.click('#js-tab-problems');
    assert.equal(await page.locator('#js-lint-rules-open').isVisible(), true);
    await page.click('#js-tab-report');
    assert.equal(await page.locator('#js-lint-rules-open').isVisible(), false);
});

test('a step of the timeline opens to what happened when it ran: its Rationale, Add check on a row; a written scenario, its steps', async () => {
    const { page, errors, close } = await openTestTab();
    // a row of a table, by its element: its last
    const row = (where, id) => where.locator(`.test-rationale-scroll tbody tr[data-element="${id}"]`).last();

    // recorded: the start and each step has what happened; Add check adds the check, which the timeline shows under the step
    await newScenario(page);
    await page.fill('.test-name', 'Steps of a long leave');
    await startRun(page);
    await runStep(page, 'Submit', { days: 10 });
    await page.click('.test-stop-recording');
    await page.click('.test-replay');
    await page.waitForSelector('.test-timeline .test-step[data-element-id="Submit"] .test-steps-rows');
    assert.equal(await page.locator('.test-timeline .test-steps-rows').count(), 2, 'the start, then Submit');
    const submit = page.locator('.test-timeline .test-step[data-element-id="Submit"]');
    assert.equal(await submit.locator('.test-rationale-scroll').isVisible(), false, 'closed: the step is its line');
    await submit.locator('.test-steps-rows > summary').click();
    assert.match(await submit.locator('.test-steps-rows').innerText(), /days[^]*result: true \(days=10\)/, 'its rows, the why under them');
    await row(submit, 'Approve').locator('.test-add-check').click();
    await page.waitForSelector('.test-timeline .test-step[data-element-id="Submit"] .test-rationale-checks .test-check-row');
    const under = row(submit, 'Approve').locator('xpath=following-sibling::tr[1]');
    assert.match(await under.getAttribute('class'), /test-rationale-checks/, 'the check, under the row of its item');
    assert.match(await under.innerText(), /Approve request/);
    assert.equal(await submit.locator('.test-step-check-rows').count(), 0, 'once: not in the timeline too');
    assert.equal(await row(submit, 'Approve').locator('.test-add-check').count(), 0, 'a check shows once: in the timeline, not on its row too');

    // written in Gherkin: its steps under its text; a row copies its check's line; a check of no item is under the step's line
    const file = path.join(web.definitionsPath, 'leave-request.feature');
    await page.click('.test-list-menu summary');
    await page.click('.test-edit-text');
    await page.waitForSelector('.test-text-input');
    const text = await page.inputValue('.test-text-input');
    await page.fill('.test-text-input', text.replace(/\s*$/, '\n') + [
        '',
        '  Scenario: a long leave, written',
        '    When @start process:leave-request as :r',
        '    And @invoke element:Submit in :r',
        '      | days | 10 |',
        '    Then @check ${data.days == 10}',
        '',
    ].join('\n'));
    await page.click('.test-text-save');
    await page.waitForSelector('.test-list');
    await page.click('.test-tree li:has-text("a long leave, written")');
    await page.click('.test-replay');
    await page.waitForSelector('.test-summary.ok, .test-summary.failed');
    assert.equal(await page.locator('.test-summary-title').innerText(), '✓ Passed', (await page.locator('.test-error').allInnerTexts()).join(' | '));
    await page.waitForSelector('.test-written .test-steps-step >> nth=1');
    const step = n => page.locator('.test-written .test-steps-step').nth(n - 1);
    assert.match(await step(1).locator('.test-steps-head').innerText(), /^Step 1 · Start Process/, 'as the engine logged it');
    assert.match(await step(2).locator('.test-steps-head').innerText(), /^Step 2 · Invoke Item[^]*Submit request/);
    await step(2).locator('.test-steps-rows > summary').click();
    // a check of no item (data, an expression): under the step's own row, Submit's
    const expression = step(2).locator('.test-rationale-check', { hasText: '@check ${data.days == 10}' });
    assert.equal(await expression.locator('xpath=ancestor::tr[1]/preceding-sibling::tr[1]').getAttribute('data-element'), 'Submit');
    assert.match(await row(step(2), 'Approve').locator('.test-copy-check').getAttribute('title'), /@check :r has 1 items of element:Approve with status "wait"$/);
    fs.rmSync(file);
    assert.deepEqual(errors, []);
    await close();
});
