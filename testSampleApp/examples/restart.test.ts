// Restart: an ended instance is run again from one of its earlier items. Buy Used Car is bought and driven, then
// restarted from Buy: Buy waits again, with the instance's data kept.
//
// Shows: engine.restart, by a query naming the instance and the item to restart from. Restarting needs the
// instance's save points: kept for every instance with SAVE_POINTS=true in .env, or for one instance with the
// flag savePoints when it is started (as here).
import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { testApp, Run, type TestApp } from '../test/support/testApp.js';

let app: TestApp;
before(async () => { app = await testApp({ quiet: true }); });
after(async () => { await app.stop(); });

test('an ended instance is restarted from Buy', async () => {
    const started = await app.server.engine.start('Buy Used Car', { caseId: 7 }, null, 'buyer', { flags: { savePoints: true } });
    const run = new Run(app, started.instance);
    await run.complete('task_Buy', { needsRepairs: 'No', needsCleaning: 'No' });
    await run.complete('task_Drive');
    assert.equal(run.status, 'end');

    const restarted = await app.server.engine.restart({ id: run.id, 'items.elementId': 'task_Buy' }, {}, 'buyer');
    run.instance = restarted.instance;
    assert.equal(run.status, 'running');
    assert.equal(run.data.caseId, 7, 'the data is kept');
    assert.deepEqual(run.waiting(), ['task_Buy']);
});
