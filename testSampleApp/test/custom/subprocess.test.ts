// @features: sub-process
// SubProcess: Design Campaign, then a sub-process (Send Emails to Clients, a script; Follow-up with Clients, a
// user task), then Finalize.
import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { testApp, type TestApp } from '../support/testApp.js';

let app: TestApp;
before(async () => { app = await testApp(); });
after(async () => { await app.stop(); });

test('the sub-process runs between Design Campaign and Finalize', async () => {
    const run = await app.start('SubProcess');
    assert.deepEqual(run.waiting(), ['Task_design']);

    await run.complete('Task_design', { campaign: 'Spring' });
    assert.ok(run.item('sub_task_1'), 'the sub-process\'s script ran');
    // waiting: the user task, and around it the sub-process and its boundary events (cancel, error)
    assert.ok(run.waiting().includes('sub_usertask_2'), `waiting: ${run.waiting()}`);

    await run.complete('sub_usertask_2');
    assert.equal(run.item('task_subProcess').status, 'end');
    assert.ok(run.item('Activity_0hrqkhp'), 'Finalize ran');
    assert.equal(run.status, 'end');
});
