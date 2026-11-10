// test-escalation: a sub-process with a user task; when it is completed with escalation 'true', an escalation
// throw event inside the sub-process reaches the non-interrupting escalation boundary event on the sub-process,
// which starts a follow-up task. A parallel gateway joins the sub-process and the follow-up.
//
// Shows: escalation thrown inside a sub-process and caught on its boundary, without interrupting it.
import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { testApp, type TestApp } from '../test/support/testApp.js';

let app: TestApp;
before(async () => { app = await testApp({ quiet: true }); });
after(async () => { await app.stop(); });

test('an escalation starts the follow-up task', async () => {
    const run = await app.start('test-escalation');
    await run.complete('Activity_userTask1', { escalation: 'true' });
    assert.equal(run.item('Event_catch_escalation').status, 'end', 'caught on the sub-process');
    assert.ok(run.waiting().includes('Activity_11tr5am'), `the follow-up waits; waiting: ${run.waiting()}`);

    await run.complete('Activity_11tr5am');
    assert.equal(run.status, 'end');
});

test('without an escalation, the boundary event does not fire', async () => {
    const run = await app.start('test-escalation');
    await run.complete('Activity_userTask1', { escalation: 'false' });
    assert.equal(run.item('Activity_11tr5am'), undefined, 'no follow-up');
    assert.equal(run.status, 'end');
});
