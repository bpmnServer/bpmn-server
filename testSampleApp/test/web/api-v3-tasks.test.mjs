// @features: api-v3
// API v3's processes and tasks, as an application uses them: each of its users calls with their own token; they see
// what they may start, start it, get their tasks with their forms, claim and complete them. The operations are the
// task API's (routes/api/tasks.ts); v3 answers { items, next } with an opaque cursor, and errors as { error }.
import test from 'node:test';
import assert from 'node:assert/strict';
import { startWebApp, why, WebClient, API_KEY } from '../support/webApp.mjs';

let web;
test.after(async () => { await web?.stop(); setImmediate(() => process.exit(0)); });

const v3 = (method, url, token, body) => new WebClient(web.base).request(method, '/api/v3' + url, {
  json: body, headers: { authorization: `Bearer ${token}` },
});
async function tokenFor(userName, groups) {
  const res = await new WebClient(web.base).request('POST', '/api/v3/tokens', { json: { userName, groups }, headers: { 'x-api-key': API_KEY } });
  assert.equal(res.status, 201, why(res));
  return res.body.token;
}

const MANAGERS_ONLY = 'v3-managers-start';
const MANAGERS_ONLY_XML = `<?xml version="1.0" encoding="UTF-8"?>
<bpmn:definitions xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" id="d" targetNamespace="urn:test">
  <bpmn:process id="ManagersStart" isExecutable="true">
    <bpmn:laneSet id="Roles"><bpmn:lane id="ManagerLane" name="manager"><bpmn:flowNodeRef>Begin</bpmn:flowNodeRef></bpmn:lane></bpmn:laneSet>
    <bpmn:startEvent id="Begin" />
    <bpmn:endEvent id="Done" />
    <bpmn:sequenceFlow id="f1" sourceRef="Begin" targetRef="Done" />
  </bpmn:process>
</bpmn:definitions>`;

let sam, mia;
test.before(async () => {
  web = await startWebApp();
  sam = await tokenFor('sam', ['staff']);
  mia = await tokenFor('mia', ['manager']);
  await web.bpmnServer.definitions.save(MANAGERS_ONLY, MANAGERS_ONLY_XML);
});

test('what a user may start: the start events their lanes and candidates allow, with their forms', async () => {
  const forSam = await v3('GET', '/processes/startable', sam);
  assert.equal(forSam.status, 200, why(forSam));
  const names = forSam.body.items.map(i => i.processName);
  assert.ok(names.includes('leave-request'));
  assert.ok(!names.includes(MANAGERS_ONLY), 'a manager-only start is not offered to staff');
  const leave = forSam.body.items.find(i => i.processName === 'leave-request');
  assert.deepEqual(Object.keys(leave).sort(), ['documentation', 'form', 'name', 'processName', 'startNodeId'].filter(k => k in leave).sort());
  assert.ok(Array.isArray(leave.form.fields));

  const forMia = await v3('GET', '/processes/startable', mia);
  assert.ok(forMia.body.items.some(i => i.processName === MANAGERS_ONLY));
  const refused = await v3('POST', `/processes/${MANAGERS_ONLY}/start`, sam, {});
  assert.equal(refused.status, 404);
  assert.equal(refused.body.error.code, 'NOT_STARTABLE');
});

test('a request from start to approval, each step as its user', async () => {
  const started = await v3('POST', '/processes/leave-request/start', sam, { data: { requestedBy: 'sam' } });
  assert.equal(started.status, 201, why(started));
  const submit = started.body.task;
  assert.equal(submit.elementId, 'Submit', 'the staff member\'s first task');

  const one = await v3('GET', `/tasks/${submit.id}`, sam);
  assert.equal(one.status, 200, why(one));
  assert.deepEqual(one.body.form.fields.map(f => f.id), ['days', 'reason']);

  const done = await v3('POST', `/tasks/${submit.id}/complete`, sam, { data: { days: 6, reason: 'holiday' } });
  assert.equal(done.status, 200, why(done));
  assert.equal(done.body.task.completedBy, 'sam');

  const approve = (await v3('GET', '/tasks?limit=200', mia)).body.items.find(t => t.instanceId === started.body.instance.id);
  assert.equal(approve?.elementId, 'Approve', 'the manager sees the approval');
  assert.ok(!(await v3('GET', '/tasks?limit=200', sam)).body.items.some(t => t.id === approve.id), 'staff do not');
  const notMine = await v3('GET', `/tasks/${approve.id}`, sam);
  assert.equal(notMine.status, 404);
  assert.equal(notMine.body.error.code, 'TASK_NOT_FOUND');

  const claimed = await v3('POST', `/tasks/${approve.id}/claim`, mia);
  assert.equal(claimed.body.task.assignee, 'mia');
  const approved = await v3('POST', `/tasks/${approve.id}/complete`, mia, { data: { approved: true } });
  assert.equal(approved.status, 200, why(approved));
  const twice = await v3('POST', `/tasks/${approve.id}/complete`, mia, {});
  assert.equal(twice.status, 409);
  assert.equal(twice.body.error.code, 'ITEM_NOT_WAITING');
});

test('the task list comes a page at a time, by an opaque cursor; next is absent on the last page', async () => {
  for (let i = 0; i < 3; i++) await v3('POST', '/processes/leave-request/start', sam, {});
  const seen = [];
  let cursor, pages = 0, last;
  do {
    last = await v3('GET', `/tasks?limit=2${cursor ? `&cursor=${cursor}` : ''}`, sam);
    assert.equal(last.status, 200, why(last));
    seen.push(...last.body.items.map(t => t.id));
    cursor = last.body.next;
    pages++;
  } while (cursor && pages < 100);
  assert.ok(pages >= 2);
  assert.equal(new Set(seen).size, seen.length, 'no task twice');
  assert.ok(!('next' in last.body), 'no next on the last page');
  assert.equal((await v3('GET', '/tasks?cursor=nonsense', sam)).body.error.code, 'BAD_CURSOR');
  assert.equal((await v3('GET', '/tasks?limit=0', sam)).body.error.code, 'BAD_LIMIT');
  assert.equal((await v3('POST', '/processes/leave-request/start', sam, { data: [] })).body.error.code, 'BAD_DATA');
});
