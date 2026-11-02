// Messages and signals.
// MsgCatch: started by the message newInvoiceMessage; waits for newInvoiceMessage2; then throws its own.
// Signal: three parallel tasks, each with a boundary event on the signal Cancel_All; the task "Cancel ?" throws it.
import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { testApp, type TestApp } from '../support/testApp.js';

let app: TestApp;
before(async () => { app = await testApp(); });
after(async () => { await app.stop(); });

test('a message starts the process, a second one completes it', async () => {
    const run = await app.message('newInvoiceMessage', { invoice: 'INV-1' });
    assert.ok(run, 'an instance was started');
    assert.deepEqual(run.waiting(), ['catch_msg2']);

    await run.message('newInvoiceMessage2', { amount: 120 });
    assert.equal(run.status, 'end');
    assert.equal(run.data.amount, 120, 'the message\'s data is merged in');
});

// Cancel_All goes to the three boundary events; each leads to a terminate end event, so the first one taken ends
// the instance and the other two with it.

test('the signal Cancel_All, thrown inside the process, interrupts the parallel tasks', async () => {
    const run = await app.start('Signal');
    const tasks = ['Activity_0qilwzd', 'Activity_1j0jypn', 'Activity_0h61osn'];
    for (const task of tasks)
        assert.ok(run.waiting().includes(task), `${task} waits`);

    await run.complete('Activity_1qc2lbd');          // "Cancel ?": then its throw event signals Cancel_All
    await run.refresh();                              // the boundary events ran on the signal
    for (const task of tasks)
        assert.notEqual(run.item(task).status, 'wait', `${task} interrupted`);
    assert.equal(run.status, 'end', 'terminated');
});

test('a signal sent from outside does the same', async () => {
    const run = await app.start('Signal');
    await run.signal('Cancel_All');
    assert.deepEqual(run.waiting(), []);
    assert.equal(run.status, 'end', 'terminated');
});
