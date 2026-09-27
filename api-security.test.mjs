import test from 'node:test';
import assert from 'node:assert/strict';
import { BPMNAPI, SecureUser } from './dist/index.js';

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

test('non-admin instance list exposes metadata without other tasks or process data', async () => {
  const full = { id: 'instance-1', name: 'model', status: 'wait', data: { secret: 42 },
    items: [{ id: 'other-task' }], source: '<xml/>', logs: ['private'] };
  const api = new BPMNAPI({ dataStore: { findInstances: async query => {
    assert.equal(query.tenantId, 'tenant-a');
    return [full];
  } } });
  assert.deepEqual(await api.data.findInstances({}, alice),
    [{ id: 'instance-1', name: 'model', status: 'wait', version: undefined,
      startedAt: undefined, endedAt: undefined, saved: undefined }]);
  assert.deepEqual(await api.data.findInstances({}, admin), [full]);
});
