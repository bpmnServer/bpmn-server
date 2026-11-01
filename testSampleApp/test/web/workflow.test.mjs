// Process scenarios through the UI routes: start, task lists, task forms, assignment, approval paths,
// candidate-group authorization and instance administration. Uses test/processes/leave-request.bpmn:
//   Submit request (staff, form: days, reason) -> More than 5 days?
//     yes -> Approve request (manager) -> Approved
//     no  -> Approve automatically (script: approvedBy = 'system') -> Approved automatically
import test from 'node:test';
import assert from 'node:assert/strict';
import { startWebApp, why } from '../support/webApp.mjs';

const MODEL = 'leave-request';
let web, admin, staff, manager;

test.before(async () => {
  web = await startWebApp();
  [admin, staff, manager] = await Promise.all(['admin', 'staff', 'manager'].map(u => web.login(u)));
});
test.after(async () => { await web?.stop(); setImmediate(() => process.exit(0)); });

const instance = (id) => web.bpmnServer.dataStore.findInstance({ id }, 'full');
const waiting = async (id) => (await instance(id)).items.filter(i => i.status === 'wait');
const waitingAt = async (id, elementId) => (await waiting(id)).find(i => i.elementId === elementId);
/** A single candidate group is stored as a string, several as an array. */
const groups = (value) => [].concat(value ?? []);

/** Starts the model through GET /execute as `client`; returns the instance id. */
async function start(client) {
  const res = await client.get('/execute/' + MODEL);
  if (res.status === 302) return new URL(res.location, web.base).searchParams.get('id');
  // non-admins are shown the workbench instead of the instance page
  assert.equal(res.status, 200, why(res));
  const latest = await web.bpmnServer.dataStore.findInstances({ name: MODEL }, 'summary');
  return latest.sort((a, b) => new Date(b.startedAt) - new Date(a.startedAt))[0].id;
}
const submit = (client, itemId, form) => client.post('/invokeItem', { itemId, ...form });

test('starting a process opens its instance page with the first task waiting', async () => {
  const res = await admin.get('/execute/' + MODEL);
  assert.equal(res.status, 302);
  assert.match(res.location, /^\/instanceDetails\?id=/);
  const id = new URL(res.location, web.base).searchParams.get('id');
  const submitTask = await waitingAt(id, 'Submit');
  assert.ok(submitTask, 'Submit request waits');
  assert.deepEqual(groups(submitTask.candidateGroups), ['staff']);
});

test('starting with data from the start form stores it on the instance', async () => {
  const res = await admin.post('/execute', { processName: MODEL, field1: 'requester', value1: 'pat', field2: 'tags', value2: '[a,b]' });
  assert.equal(res.status, 302, why(res));
  const id = new URL(res.location, web.base).searchParams.get('id');
  const data = (await instance(id)).data;
  assert.equal(data.requester, 'pat');
  assert.deepEqual(data.tags, ['a', 'b']);
  assert.equal(typeof data.caseId, 'number');
});

test('a regular user can start a process', async () => {
  const id = await start(staff);
  assert.ok(await waitingAt(id, 'Submit'));
});

test('task lists show waiting tasks to the candidate groups', async () => {
  const id = await start(admin);
  const item = await waitingAt(id, 'Submit');
  for (const client of [staff, manager, admin]) {
    const tasks = await client.get('/tasks');
    assert.equal(tasks.status, 200, `${client.userName}: ${why(tasks)}`);
    assert.ok(tasks.text.includes(item.id), `${client.userName} sees the Submit task`);
  }
});

test('the task form shows the fields of the task', async () => {
  const id = await start(admin);
  const item = await waitingAt(id, 'Submit');
  const form = await staff.get(`/invokeItem?id=${item.id}&processName=${MODEL}&elementId=Submit`);
  assert.equal(form.status, 200, why(form));
  assert.match(form.text, /name=["']?days/);
  assert.match(form.text, /name=["']?reason/);
  assert.match(form.text, new RegExp(`value=["']?${item.id}`));
});

test('a short leave is approved automatically', async () => {
  const id = await start(admin);
  const item = await waitingAt(id, 'Submit');
  const res = await submit(staff, item.id, { days: '3', reason: 'family' });
  assert.ok([200, 302].includes(res.status), why(res));
  const done = await instance(id);
  assert.equal(done.status, 'end');
  assert.equal(done.data.days, '3');
  assert.equal(done.data.reason, 'family');
  assert.equal(done.data.approvedBy, 'system');
  assert.ok(done.items.some(i => i.elementId === 'AutoApproved' && i.status === 'end'));
});

test('a long leave waits for a manager, who approves it', async () => {
  const id = await start(admin);
  await submit(staff, (await waitingAt(id, 'Submit')).id, { days: '8', reason: 'travel' });
  const approve = await waitingAt(id, 'Approve');
  assert.ok(approve, 'Approve request waits');
  assert.deepEqual(groups(approve.candidateGroups), ['manager']);

  assert.ok(!(await staff.get('/tasks')).text.includes(approve.id), 'staff does not see the approval');
  assert.ok((await manager.get('/tasks')).text.includes(approve.id), 'manager sees the approval');

  await submit(staff, approve.id, {});
  assert.ok(await waitingAt(id, 'Approve'), 'staff can not complete the approval');

  await submit(manager, approve.id, {});
  const done = await instance(id);
  assert.equal(done.status, 'end');
  assert.ok(done.items.some(i => i.elementId === 'Approved' && i.status === 'end'));
});

test('a task is reassigned through the assign form', async () => {
  const id = await start(admin);
  const item = await waitingAt(id, 'Submit');
  const form = await admin.get(`/assign?id=${item.id}&processName=${MODEL}&elementId=Submit`);
  assert.equal(form.status, 200, why(form));
  assert.match(form.text, /name=["']?assignee/);

  const res = await admin.post('/assign', {
    itemId: item.id, assignee: 'manager', candidateUsers: 'manager', candidateGroups: 'manager',
    dueDate: '2026-12-01', followUpDate: '', priority: '2',
  });
  assert.ok([200, 302].includes(res.status), why(res));
  const assigned = await waitingAt(id, 'Submit');
  assert.equal(assigned.assignee, 'manager');
  assert.deepEqual(assigned.candidateGroups, ['manager']);
  assert.deepEqual(assigned.candidateUsers, ['manager']);
  assert.equal(new Date(assigned.dueDate).toISOString().slice(0, 10), '2026-12-01');
  assert.equal(String(assigned.priority), '2');
});

test('the end-user pages start processes and complete tasks', async () => {
  const before = (await web.bpmnServer.dataStore.findInstances({ name: MODEL }, 'summary')).length;
  const started = await staff.get('/user/execute/' + MODEL);
  assert.ok([200, 302].includes(started.status), why(started));
  const all = await web.bpmnServer.dataStore.findInstances({ name: MODEL }, 'summary');
  assert.equal(all.length, before + 1);
  const id = all.sort((a, b) => new Date(b.startedAt) - new Date(a.startedAt))[0].id;

  const item = await waitingAt(id, 'Submit');
  const tasks = await staff.get('/user/tasks');
  assert.ok(tasks.text.includes(item.id), 'listed in the end-user task list');
  const form = await staff.get(`/user/invokeItem?id=${item.id}&processName=${MODEL}&elementId=Submit`);
  assert.equal(form.status, 200, why(form));
  await staff.post('/user/invokeItem', { itemId: item.id, days: '1', reason: 'appointment' });
  assert.equal((await instance(id)).status, 'end');
});

test('the instance page replays the items of a finished instance', async () => {
  const id = await start(admin);
  await submit(staff, (await waitingAt(id, 'Submit')).id, { days: '2', reason: 'x' });
  const page = await admin.get('/instanceDetails?id=' + id);
  assert.equal(page.status, 200);
  const items = JSON.parse(/<script type="application\/json" id="animationItems">([\s\S]*?)<\/script>/.exec(page.text)[1]);
  const elements = items.map(i => i.id);
  for (const element of ['Requested', 'Submit', 'LongLeave', 'AutoApprove', 'AutoApproved'])
    assert.ok(elements.includes(element), element);
});

test('users only see instance pages they take part in', async () => {
  const id = await start(admin);
  await submit(staff, (await waitingAt(id, 'Submit')).id, { days: '9', reason: 'x' });
  const stranger = await web.login('staff');
  const res = await stranger.get('/instanceDetails?id=' + id);
  assert.equal(res.status, 200, 'staff took part (submitted the request)');
});

test('an administrator deletes an instance', async () => {
  const id = await start(admin);
  const res = await admin.post('/deleteInstance', { id });
  assert.equal(res.status, 200, why(res));
  assert.equal((await web.bpmnServer.dataStore.findInstances({ id }, 'summary')).length, 0);
});

test('an administrator resets all instance data', async () => {
  await start(admin);
  const res = await admin.post('/resetData', {});
  assert.equal(res.status, 200, why(res));
  assert.equal((await web.bpmnServer.dataStore.findInstances({}, 'summary')).length, 0);
});
