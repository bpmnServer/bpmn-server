// multi-inst: a script lists the departments, then a parallel multi-instance sub-process runs once per
// department; each instance has a Vote task. Each vote is kept under data.department.<department>.
//
// Shows: a multi-instance sub-process over a collection; finding one instance's item by its itemKey; where each
// instance's data goes.
import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { testApp, type TestApp } from '../test/support/testApp.js';

let app: TestApp;
before(async () => { app = await testApp({ quiet: true }); });
after(async () => { await app.stop(); });

test('each department votes; the votes are kept per department', async () => {
    const run = await app.start('multi-inst');
    assert.deepEqual(run.data.departments, ['IT', 'HR', 'Billing']);
    assert.deepEqual(run.items('Activity_vote').map(i => i.itemKey), ['IT', 'HR', 'Billing'], 'a Vote per department');

    // several Vote items wait: pick one by its itemKey (the collection's value)
    const votes = { IT: true, HR: false, Billing: true };
    for (const [department, vote] of Object.entries(votes)) {
        const item = run.items('Activity_vote').find(i => i.itemKey === department && i.status === 'wait');
        await app.server.engine.invoke({ id: run.id, 'items.id': item.id }, { vote });
        await run.refresh();
    }

    for (const [department, vote] of Object.entries(votes))
        assert.equal(run.data.department[department].vote, vote, department);
    assert.equal(run.data.department.HR.scriptLog, 'added by script event,key:HR', 'the Vote start listener sees its key');
    assert.equal(run.status, 'end', 'Summerize Votes ran after the last vote');
});
