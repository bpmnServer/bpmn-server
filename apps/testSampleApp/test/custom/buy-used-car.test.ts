// @features: assignment, inclusive-gateway, scenario-files, user-task
// Buy Used Car: the buyer buys the car (Buy), then drives it (Drive); a car that needs cleaning or repairs
// goes through Clean / Repair first.
import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { testApp, type TestApp } from '../support/testApp.js';

let app: TestApp;
before(async () => { app = await testApp(); });
after(async () => { await app.stop(); });

test('a car that needs nothing is bought, then driven', async () => {
    const run = await app.start('Buy Used Car', { caseId: 1 }, 'buyer');
    assert.deepEqual(run.waiting(), ['task_Buy']);

    await run.complete('task_Buy', { model: 'Thunderbird', needsCleaning: 'No', needsRepairs: 'No' });
    assert.equal(run.item('task_clean'), undefined);
    assert.equal(run.item('task_repair'), undefined);
    assert.deepEqual(run.waiting(), ['task_Drive']);

    await run.complete('task_Drive');
    assert.equal(run.status, 'end');
    assert.equal(run.data.model, 'Thunderbird');
});

test('a car that needs repairs is repaired before it is driven', async () => {
    const run = await app.start('Buy Used Car', { caseId: 2 }, 'buyer');
    await run.complete('task_Buy', { needsCleaning: 'No', needsRepairs: 'Yes' });
    assert.ok(run.waiting().includes('task_repair'), `waiting: ${run.waiting()}`);
});
