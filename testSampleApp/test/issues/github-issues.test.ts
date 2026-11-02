// GitHub issues of bpmnServer/bpmn-server, each on the model it was reported with (test/scenarios/processes),
// and engine problems found going over the old bpmn-web examples. The other issues have scenarios in
// test/scenarios/feature: Issue124-2.js, Issue186.js, Issue196.js, Issue197A.js, Issue197_cancel_loop.js,
// Issue233.js. Not here: Issue186A.bpmn reads `rootData`, which the engine does not have, and Issue193.bpmn calls
// the reporter's own appDelegate.collService.
//
// A test marked todo is a problem the engine still has; work/engine-findings.md has the details.
import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { testApp, type TestApp } from '../support/testApp.js';

let app: TestApp;      // the issue models
let ours: TestApp;     // the app's models, processes/
let local: TestApp;    // test/issues/models
before(async () => {
    app = await testApp({ models: 'test/scenarios/processes/', quiet: true });
    ours = await testApp({ quiet: true });
    local = await testApp({ models: 'test/issues/models/', quiet: true });
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

test('#124 (1): a boundary timer interrupts a service task that is still running', {
    todo: 'engine: start() never returns when a boundary timer fires during a long service task',
    timeout: 15000,
}, async () => {
    // ST2 (service1, 3.5 s) has a 1 s boundary timer: the timer takes the branch, ST2's late result is dropped
    const run = await app.start('Issue124-1');
    await delay(4000);
    await run.refresh();
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
    // processes/loop1 without its sub-process listener, which fails (the todo below)
    const run = await local.start('nested loops');
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

test('a failing start listener of a sub-process fails the run', {
    todo: 'engine: Process.start and Process.end call doEvent without await; the error is an unhandled rejection',
}, async () => {
    // loop1's sub-process listener reads this.token, which a sub-process listener does not have: start goes on,
    // and the error surfaces later as an unhandled rejection
    await assert.rejects(ours.start('loop1'), /loop/);
});

test('a repeating timer R3/PT1S fires three times', {
    todo: 'engine: Timer.ts repeats while repeat > timerCount, counting from 0: R3 fires four times',
    timeout: 15000,
}, async () => {
    const run = await ours.start('timer-repeat');          // a non-interrupting R3 timer on a user task
    await delay(5500);
    await run.refresh();
    assert.equal(run.items('Activity_00qabv3').length, 3, 'the reminder script ran three times');
});

test('an ad hoc sub-process: its tasks wait, the flow next to it waits too', {
    todo: 'engine: in "ad hoc", Task 2 ends at start without being completed, and the ad hoc sub-process never completes',
}, async () => {
    const run = await ours.start('ad hoc');
    assert.ok(run.waiting().includes('Activity_0o0xpek'), `Task 2 waits; waiting: ${run.waiting()}`);
});
