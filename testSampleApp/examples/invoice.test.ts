// Invoice: after Issue Invoice, an event-based gateway waits for whichever comes first: the payment (a receive
// task), or Cancel by Admin (a message catch event, which ends the instance with a terminate end event).
//
// Shows: an event-based gateway; a receive task; completing a waiting event like a task.
import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { testApp, type TestApp } from '../test/support/testApp.js';

let app: TestApp;
before(async () => { app = await testApp({ quiet: true }); });
after(async () => { await app.stop(); });

test('the payment arrives', async () => {
    const run = await app.start('Invoice');
    await run.complete('task_issue_invoice');
    assert.deepEqual(run.waiting().sort(), ['event_cancel', 'task_got_payment']);

    await run.complete('task_got_payment');
    assert.equal(run.status, 'end');
    assert.equal(run.item('event_cancel').status, 'end', 'the other event no longer waits');
});

test('an admin cancels it', async () => {
    const run = await app.start('Invoice');
    await run.complete('task_issue_invoice');
    await run.complete('event_cancel');
    assert.equal(run.status, 'end');
    assert.equal(run.item('task_got_payment').status, 'end', 'the payment is no longer waited for');
});
