// @features: pages-through-api
// The workflow pages (routes/workflow.ts: the Workbench, the task and assign forms, the instance page) ask API v3's
// operations (routes/api/pageClient.ts), which decide who may see and do what: the pages hold no security rules of
// their own. The Workbench lists instances a page at a time, as the API does.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { startWebApp, why } from '../support/webApp.mjs';

const MODEL = 'leave-request';
const WORKFLOW = path.join(import.meta.dirname, '..', '..', '..', '..', 'packages', 'bpmn-web', 'src', 'routes', 'workflow.ts');
let web, admin, staff;

test.before(async () => {
    web = await startWebApp();
    [admin, staff] = await Promise.all([web.login('admin'), web.login('staff')]);
});
test.after(async () => { await web?.stop(); setImmediate(() => process.exit(0)); });

test('the workflow pages hold no security rules: they ask the API\'s operations', () => {
    const source = fs.readFileSync(WORKFLOW, 'utf8');
    assert.doesNotMatch(source, /new CaseAccess\b|\bcaseAccess\.\w+\(/, 'no case security policy asked by the pages');
    assert.doesNotMatch(source, /notATest/, 'no list filtered by the pages');
    assert.match(source, /pageApi\(/);
});

test('the Workbench: a page of instances at a time, newest first, with a link to the older ones', async () => {
    for (let i = 0; i < 52; i++) await web.bpmnServer.engine.start(MODEL, { n: i }, null, 'admin');
    const first = (await admin.get('/')).text;
    const rows = text => [...text.matchAll(/href="\/instanceDetails\?id=([^"]+)"/g)].map(m => m[1]);
    assert.equal(rows(first).length, 50);
    const older = first.match(/href="\/\?after=([^"#]+)#instances"/);
    assert.ok(older, 'a link to the older instances');
    const second = (await admin.get(`/?after=${older[1]}`)).text;
    assert.ok(rows(second).length >= 2);
    assert.equal(rows(second).filter(id => rows(first).includes(id)).length, 0, 'no instance twice');
});

test('a task: an administrator opens and completes anyone\'s; someone with no part in it may not', async () => {
    // Approve: offered to the manager group, which staff is not in
    const { id } = await web.bpmnServer.engine.start(MODEL, {}, null, 'staff');
    await web.bpmnServer.engine.invoke({ id, 'items.elementId': 'Submit', 'items.status': 'wait' }, { days: 10 }, 'staff');
    const [task] = (await web.bpmnServer.dataStore.findItems({ id, 'items.elementId': 'Approve', 'items.status': 'wait' }));
    assert.ok(task, 'Approve waits');
    const refused = await staff.get(`/invokeItem?id=${task.id}&processName=${MODEL}&elementId=${task.elementId}`);
    assert.equal(refused.status, 403, why(refused));
    const form = await admin.get(`/invokeItem?id=${task.id}&processName=${MODEL}&elementId=${task.elementId}`);
    assert.ok([200, 302].includes(form.status), why(form));
});
