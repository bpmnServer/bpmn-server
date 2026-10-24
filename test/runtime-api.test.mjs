// The runtime API (BPMNAPI) as an application's task portal uses it, with non-admin principals:
// find what one may start, read a model's documentation and task forms, start, list one's tasks,
// open a task with its data, complete it. bpmn-server 3.1.0 broke these for non-admins (model reads
// moved to BPMNAdminAPI; findInstances stripped data that findItems still returned) and no test
// drove the API this way.
import test from 'node:test';
import assert from 'node:assert/strict';

import { BPMNAPI, BPMNAdminAPI, SecureUser, APIModelReader, APIModel } from '../dist/index.js';
import { makeServer } from './helpers.mjs';

const staff = new SecureUser({ userName: 'sam', userGroups: ['staff'] });
const manager = new SecureUser({ userName: 'mia', userGroups: ['manager'] });
const outsider = new SecureUser({ userName: 'olga', userGroups: ['contractor'] });
const admin = new SecureUser({ userName: 'ada', userGroups: ['ADMIN'] });

let server, api;
test.before(async () => {
  ({ server } = await makeServer());
  api = new BPMNAPI(server);
});
test.after(async () => { await server?.shutdown(); });

const names = (list) => list.map(m => m.name ?? m).sort();
const startNames = async (user) => [...new Set((await api.model.findStartEvents({}, user)).map(e => e.modelName ?? e.name))].sort();

test('the runtime API reads models but can not change them', () => {
  assert.ok(api.model instanceof APIModelReader);
  assert.ok(!(api.model instanceof APIModel));
  for (const read of ['get', 'list', 'findEvents', 'findStartEvents', 'getSource', 'load', 'verifyModel'])
    assert.equal(typeof api.model[read], 'function', read);
  for (const write of ['save', 'delete', 'rename', 'export'])
    assert.equal(api.model[write], undefined, write);
  const adminApi = new BPMNAdminAPI(server);
  for (const write of ['save', 'delete', 'rename'])
    assert.equal(typeof adminApi.model[write], 'function', write);
});

test('a regular user lists models and reads one', async () => {
  const list = names(await api.model.list({}, staff));
  assert.ok(list.includes('expense-approval'), list.join(','));
  assert.match(await api.model.getSource('expense-approval', staff), /ExpenseApproval/);
  const definition = await api.model.load('expense-approval', staff);
  const { fields } = definition.getNodeInfo('SubmitExpense');
  assert.deepEqual(fields.map(f => f.id), ['amount'], 'task form fields');
  const [info] = await api.model.get({ name: 'expense-approval' }, staff);
  assert.equal(info.name, 'expense-approval');
});

test('reads work without a query', async () => {
  assert.ok((await api.model.list(undefined, staff)).length > 0);
  assert.ok((await api.model.get(undefined, staff)).length > 0);
  assert.ok(Array.isArray(await api.model.findEvents(undefined, staff)));
});

test('start events follow the candidate rules of the start event', async () => {
  const forStaff = await startNames(staff);
  const forOutsider = await startNames(outsider);
  assert.ok(forStaff.includes('expense-approval'), forStaff.join(','));
  assert.ok(!forOutsider.includes('expense-approval'), 'restricted to staff');
  assert.ok(forOutsider.includes('reminder'), 'unrestricted models are open to all');
  assert.ok((await startNames(admin)).includes('expense-approval'));
});

test('a model is verified through the runtime API', async () => {
  const result = await api.model.verifyModel('expense-approval', staff);
  assert.equal(result.valid, true, JSON.stringify(result.issues));
});

test('reads need a principal', async () => {
  await assert.rejects(() => api.model.list({}), /authenticated principal is required/);
  await assert.rejects(() => api.model.getSource('expense-approval'), /authenticated principal is required/);
});

test('a task portal: start, list my tasks, open one with its data, complete it', async () => {
  const started = await api.engine.start('expense-approval', { requester: 'sam' }, staff);
  const instanceId = started.instance.id;

  const myTasks = await api.data.getPendingUserTasks({}, staff);
  const submit = myTasks.find(t => t.instanceId === instanceId && t.elementId === 'SubmitExpense');
  assert.ok(submit, 'staff sees the submit task');
  assert.ok(!(await api.data.getPendingUserTasks({}, manager)).some(t => t.instanceId === instanceId), 'not the manager yet');

  // opening the task: its instance, with the data the form shows
  const [instance] = await api.data.findInstances({ 'items.id': submit.id }, staff, 'full');
  assert.equal(instance.id, instanceId);
  assert.equal(instance.data.requester, 'sam', 'findInstances returns the data of a visible instance');
  assert.ok(Array.isArray(instance.items), 'and its items');
  const item = await api.data.findItem({ 'items.id': submit.id }, staff);
  assert.equal(item.data.requester, 'sam');

  await api.engine.invoke({ 'items.id': submit.id }, { amount: 120 }, staff);
  const approve = (await api.data.getPendingUserTasks({}, manager)).find(t => t.instanceId === instanceId);
  assert.equal(approve.elementId, 'ApproveExpense');

  await assert.rejects(() => api.engine.invoke({ 'items.id': approve.id }, {}, staff), /no items/i, 'staff can not approve');
  const done = await api.engine.invoke({ 'items.id': approve.id }, {}, manager);
  assert.equal(done.instance.status, 'end');
  assert.equal(done.instance.data.amount, 120);
});

test('findInstances and findItems agree on what a principal sees', async () => {
  const { instance } = await api.engine.start('expense-approval', { cost: 7 }, staff);
  for (const user of [staff, manager, outsider, admin]) {
    const instances = await api.data.findInstances({ id: instance.id }, user, 'full');
    const items = await api.data.findItems({ id: instance.id }, user);
    assert.equal(instances.length > 0, items.length > 0, `${user.userName}: same instance visibility`);
    if (instances.length) {
      assert.deepEqual(instances[0].data, items[0].data, `${user.userName}: same data`);
    }
  }
});

test('visibility today (3.0 rules): any principal sees instances with an unrestricted item', async () => {
  // qualifyInstances admits an instance when any item has no assignee and no candidates (e.g. its
  // start event), so this is every instance. Tasks stay restricted: see the portal test above.
  // Changing this is a separate, deliberate decision; this test documents the behaviour.
  const { instance } = await api.engine.start('expense-approval', { private: true }, staff);
  const seen = await api.data.findInstances({ id: instance.id }, outsider, 'full');
  assert.equal(seen.length, 1);
  assert.equal((await api.data.getPendingUserTasks({ id: instance.id }, outsider)).length, 0, 'but none of its tasks');
});

test('tenants are isolated', async () => {
  const tenantA = new SecureUser({ userName: 'a', userGroups: ['staff'], tenantId: 'tenant-a' });
  const tenantB = new SecureUser({ userName: 'b', userGroups: ['staff'], tenantId: 'tenant-b' });
  const { instance } = await api.engine.start('expense-approval', {}, tenantA);
  assert.equal((await api.data.findInstances({ id: instance.id }, tenantA)).length, 1);
  assert.equal((await api.data.findInstances({ id: instance.id }, tenantB)).length, 0);
  assert.equal((await api.data.findItems({ id: instance.id }, tenantB)).length, 0);
});
