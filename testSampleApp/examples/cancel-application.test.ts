// Cancel Application: in a sub-process, Apply, then Approve and Cancel are both offered (an inclusive gateway
// with no conditions takes both flows). Whichever is completed first ends the sub-process and sets
// data.subProcess.Cancel; a cancelled application goes back to Apply ("Re-Apply"), an approved one goes on.
//
// Shows: a sub-process keeps its data under data.<sub-process id>; ending a sub-process ends what still waits in
// it; a loop back over a sub-process.
import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { testApp, type TestApp } from '../test/support/testApp.js';

let app: TestApp;
before(async () => { app = await testApp({ quiet: true }); });
after(async () => { await app.stop(); });

test('an approved application goes on', async () => {
    const run = await app.start('Cancel Application');
    await run.complete('apply');
    assert.ok(run.waiting().includes('approve') && run.waiting().includes('cancel'), `waiting: ${run.waiting()}`);

    await run.complete('approve');
    assert.equal(run.data.subProcess.Cancel, false, 'set by the end listener of Approve');
    assert.equal(run.item('cancel').status, 'end', 'Cancel no longer waits');
    assert.equal(run.status, 'end');
});

test('a cancelled application goes back to Apply', async () => {
    const run = await app.start('Cancel Application');
    await run.complete('apply');
    await run.complete('cancel');
    assert.equal(run.data.subProcess.Cancel, true);
    assert.deepEqual(run.items('apply').map(i => i.status), ['end', 'wait'], 'Apply again');

    await run.complete('apply');
    await run.complete('approve');
    assert.equal(run.status, 'end');
});
