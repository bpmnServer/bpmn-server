// @features: ad-hoc-sub-process, errors-escalations, multi-instance
// GitHub issues of bpmnServer/bpmn-server, each on the model it was reported with (processes),
// and engine problems found going over the old bpmn-web examples. The other issues have scenarios in
// processes/*.engine.feature: Issue 196, Issue 233, Issue186, Issue197, test-throw.
// Issue233.js. Not here: Issue186A.bpmn reads `rootData`, which the engine does not have, and Issue193.bpmn calls
// the reporter's own appDelegate.collService.
import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { testApp, type TestApp } from '../support/testApp.js';

let app: TestApp;      // the issue models
let ours: TestApp;     // the app's models, processes/
let local: TestApp;    // small models for one problem each, in processes/ with the rest
before(async () => {
    app = await testApp({ models: 'processes/', quiet: true });
    ours = await testApp({ quiet: true });
    local = await testApp({ models: 'processes/', quiet: true });
});
after(async () => { await app.stop(); await ours.stop(); await local.stop(); });

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

test('#124 (2): a boundary timer firing on one branch keeps what the other branch did', async () => {
    // two user tasks in parallel, each with a boundary timer, joined before UT
    const run = await app.start('Issue124-1A');
    await run.complete('Activity_0vz8m3u', { rt1: 'done' });
    await run.complete('Event_019mryy');                   // the other task's timer
    assert.equal(run.data.rt1, 'done', 'the first task\'s data is kept');
    assert.deepEqual(run.waiting(), ['Activity_0l5bien'], 'joined, on to the next task');
});

test('#124 (1): a boundary timer interrupts a service task that is still running', { timeout: 15000 }, async () => {
    // ST2 (service1, 3.5 s) has a 1 s boundary timer: the timer takes the branch while start() is still running
    // (it used to wait for itself, and start() never returned), and ST2's late result is dropped
    const run = await app.start('Issue124-1');
    assert.equal(run.item('Event_1ntmfqq').status, 'end', 'the timer fired');
    assert.deepEqual(run.waiting(), ['Activity_01c57dc'], 'UT1 waits once, after the join');
});

test('#245: a script task\'s bpmnError goes to its error boundary event, the instance goes on', async () => {
    const run = await app.start('Issue 245');
    await run.complete('Activity_1d1g6ql');                // Manual 1; then "Explicit Throw" returns a bpmnError
    assert.equal(run.item('Event_02hy81m').status, 'end', 'the boundary event caught it');
    assert.equal(run.status, 'running');
    assert.deepEqual(run.waiting(), ['Activity_0f25hsc'], 'Manual 2 waits');
});

test('#233: a parallel loop inside a sequential loop keys its items outer.inner', async () => {
    const run = await ours.start('loop1');
    const task = 'Activity_1qe2z25';
    assert.deepEqual(run.items(task).map(i => i.itemKey), ['1.1', '1.2']);
    await run.complete(task);
    await run.complete(task);
    assert.deepEqual(run.items(task).map(i => i.itemKey), ['1.1', '1.2', '2.1', '2.2'], 'the second pass');
    await run.complete(task);
    await run.complete(task);
    assert.equal(run.status, 'end');
});

// Found going over the old examples: no GitHub issue.

test('a failing process listener fails the call', async () => {
    // Process.start and end ran their listeners without await: the run went on, the error came later, unhandled
    await assert.rejects(local.start('failing listener'), /the process start listener failed/);
});

test('a sub-process listener runs on the sub-process item, once', async () => {
    // it also ran as a process listener, without this.token (loop1's listener reads this.token.loop)
    const run = await ours.start('loop1');
    assert.equal(run.status, 'running');
    assert.ok(!run.log().some(line => /reading 'loop'/.test(line)), 'no listener error');
});

test('a repeating timer R3/PT1S fires three times', { timeout: 15000 }, async () => {
    const run = await ours.start('timer-repeat');          // a non-interrupting R3 timer on a user task
    await delay(5500);
    await run.refresh();
    assert.equal(run.items('Activity_00qabv3').length, 3, 'the reminder script ran three times (it ran four)');
    assert.deepEqual(run.waiting(), ['Activity_1fpjmlq'], 'the task still waits, no timer');
});

test('branches arriving at a parallel join together join once', async () => {
    // employee-onboarding: three service tasks in parallel, then send-welcome and an inclusive gateway; the join
    // ran twice, and the second run went on from a sequence flow (getOutbounds is not a function)
    for (const [data, last] of [[{}, 'onboarded'], [{ department: 'engineering' }, 'dev-ready']] as const) {
        const run = await ours.start('employee-onboarding', data);
        assert.equal(run.status, 'end', JSON.stringify(data));
        assert.equal(run.items('send-welcome').length, 1, 'past the join once');
        assert.ok(run.item(last), `${last} reached`);
    }
});

test('an inclusive gateway takes the flows whose conditions hold, or its default', async () => {
    const run = await ours.start('employee-onboarding', { department: 'engineering', isManager: true });
    assert.ok(run.item('grant-dev-tools') && run.item('enrol-leadership'), 'both conditional flows');
    assert.equal(run.item('send-welcome-pack'), undefined, 'not the default');
});

test('an ad hoc sub-process offers its tasks at once and completes when they are done', async () => {
    // Task 1 leads to Task 2 and to the ad hoc sub-process (three tasks, no flows). The ad hoc sub-process ended
    // at once (its empty start event ended it) and Task 2 with it
    const run = await ours.start('ad hoc');
    const adHocTasks = ['Activity_1318veb', 'Activity_13h5p8m', 'Activity_0gmr9an'];
    assert.deepEqual(run.waiting().sort(), ['Activity_06iwtah', 'Activity_0o0xpek', ...adHocTasks].sort());

    await run.complete('Activity_13h5p8m');
    await run.complete('Activity_1318veb');
    assert.equal(run.item('Activity_06iwtah').status, 'wait', 'one task left');
    await run.complete('Activity_0gmr9an');
    assert.equal(run.item('Activity_06iwtah').status, 'end', 'all done: the ad hoc sub-process completes');
});
