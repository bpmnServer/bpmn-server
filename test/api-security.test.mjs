import test from 'node:test';
import assert from 'node:assert/strict';
import { BPMNAPI, SecureUser } from '../dist/index.js';

const alice = new SecureUser({ userName: 'alice', userGroups: ['staff'], tenantId: 'tenant-a' });
const admin = new SecureUser({ userName: 'admin', userGroups: ['ADMIN'], tenantId: 'tenant-a' });

test('start derives the tenant from the principal rather than caller options', async () => {
  const api = new BPMNAPI({ engine: {
    start: async (_name, _data, _node, _user, options) => options,
  } });
  const result = await api.engine.start('model', {}, alice, { tenantId: 'tenant-b' });
  assert.equal(result.tenantId, 'tenant-a');
});

test('restart applies task and tenant qualifications', async () => {
  const api = new BPMNAPI({ engine: {
    restart: async query => query,
  } });
  const query = await api.engine.restart({ 'items.id': 'task-1' }, {}, alice);
  assert.equal(query.tenantId, 'tenant-a');
  assert.equal(query['items.id'], 'task-1');
  assert.ok(query.$or.length);
});

test('startEvent resolves only an instance visible to the caller', async () => {
  let called = false;
  const api = new BPMNAPI({
    dataStore: { findInstance: async query => {
      assert.equal(query.id, 'instance-1');
      assert.equal(query.tenantId, 'tenant-a');
      throw new Error('No instance found');
    } },
    engine: { startEvent: async () => { called = true; } },
  });
  await assert.rejects(api.engine.startEvent('instance-1', 'event', {}, alice), /No instance found/);
  assert.equal(called, false);
});

test('bulk upgrade requires a system principal', async () => {
  let called = false;
  const api = new BPMNAPI({ engine: { upgrade: async () => { called = true; } } });
  await assert.rejects(api.engine.upgrade('model', [], admin), /System permission/);
  assert.equal(called, false);
});

test('global message and signal delivery require a system principal', async () => {
  let called = false;
  const api = new BPMNAPI({ engine: {
    throwMessage: async () => { called = true; },
    throwSignal: async () => { called = true; },
  } });
  await assert.rejects(api.engine.throwMessage('message', {}, {}, alice), /System permission/);
  await assert.rejects(api.engine.throwSignal('signal', {}, {}, alice), /System permission/);
  assert.equal(called, false);
});

test('instance lists are qualified by the principal and returned whole', async () => {
  const full = { id: 'instance-1', name: 'model', status: 'wait', data: { value: 42 }, items: [{ id: 'task' }] };
  const queries = [];
  const api = new BPMNAPI({ dataStore: { findInstances: async query => { queries.push(query); return [full]; } } });
  assert.deepEqual(await api.data.findInstances({}, alice), [full]);
  assert.equal(queries[0].tenantId, 'tenant-a');
  assert.ok(queries[0].$or.length, 'non-admin query is qualified');
  assert.deepEqual(await api.data.findInstances({}, admin), [full]);
  assert.equal(queries[1].$or, undefined, 'admins are not filtered by candidates');
});

test("model reads are scoped to the principal's tenant", async () => {
  const seen = [];
  const scoped = new SecureUser({ userName: 'alice', userGroups: ['staff'], tenantId: 'tenant-a', modelsOwner: 'owner-a' });
  const api = new BPMNAPI({ definitions: {
    getList: async query => { seen.push(['list', query]); return []; },
    get: async query => { seen.push(['get', query]); return []; },
    getSource: async (name, owner) => { seen.push(['source', owner]); return ''; },
    findEvents: async (query, owner) => { seen.push(['events', owner, query.$or ? 'qualified' : 'open']); return []; },
  } });
  await api.model.list({}, scoped);
  await api.model.get({ name: 'm' }, scoped);
  await api.model.getSource('m', scoped);
  await api.model.findStartEvents({}, scoped);
  assert.deepEqual(seen, [
    ['list', { owner: 'owner-a' }],
    ['get', { name: 'm', owner: 'owner-a' }],
    ['source', 'owner-a'],
    ['events', 'owner-a', 'qualified'],
  ]);
});

test("model reads do not change the caller's query object", async () => {
  const api = new BPMNAPI({ definitions: { getList: async q => q, findEvents: async q => q } });
  const query = { name: 'm' };
  await api.model.list(query, new SecureUser({ userName: 'x', userGroups: [], tenantId: 't', modelsOwner: 'o' }));
  await api.model.findStartEvents(query, alice);
  assert.deepEqual(query, { name: 'm' });
});
