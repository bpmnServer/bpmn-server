// Leave Application: the requester (the starting user) fills in Request; a manager decides in Approve, which
// a non-interrupting timer reminds about; Approved goes on to Process, Reject ends, InformationRequired goes
// back to Request.
import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { testApp, type TestApp } from '../support/testApp.js';

let app: TestApp;
before(async () => { app = await testApp(); });
after(async () => { await app.stop(); });

test('the requester requests, and an approved request is processed', async () => {
    const run = await app.start('Leave Application', {}, 'ann');
    assert.equal(run.data.requester, 'ann', 'the start event\'s initiator');
    assert.equal(run.item('Request').assignee, 'ann');

    await run.complete('Request', { days: 3 });
    assert.ok(run.waiting().includes('Approve'));

    await run.complete('Approve', { approval: 'Approved' });
    assert.ok(run.item('Activity_1rx1txe'), 'Process ran');
    assert.equal(run.status, 'end');
});

test('the reminder fires without taking Approve away', async () => {
    const run = await app.start('Leave Application', {}, 'ann');
    await run.complete('Request', { days: 3 });
    assert.ok(run.waiting().includes('timer-event'), `waiting: ${run.waiting()}`);

    // a timer is completed like any waiting element: no waiting for real time
    await run.complete('timer-event');
    assert.ok(run.item('Activity_1escddn'), 'the Reminder script ran');
    assert.ok(run.waiting().includes('Approve'), 'Approve is still waiting');
});

test('more information sends it back to the requester; a rejection ends it', async () => {
    const run = await app.start('Leave Application', {}, 'ann');
    await run.complete('Request', { days: 3 });
    await run.complete('Approve', { approval: 'InformationRequired' });
    assert.ok(run.waiting().includes('Request'), 'back to Request');
    assert.equal(run.items('Request').length, 2);

    await run.complete('Request', { days: 2, note: 'family event' });
    await run.complete('Approve', { approval: 'Reject' });
    assert.equal(run.item('Activity_1rx1txe'), undefined, 'not processed');
    assert.equal(run.item('Event_02om8ew').status, 'end');
});
