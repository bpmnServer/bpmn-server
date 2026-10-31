// BPMNClient2 with an administrator and system service account: model administration under
// /admin/api2 (admin key), raw datastore paging, messages, instance deletion.
import test from 'node:test';
import assert from 'node:assert/strict';
import path from 'node:path';
import { BPMNClient2 } from '../../dist/index.js';
import { startServer, skip } from './server.mjs';

const MODEL = 'leave-request';
let server, client;

test.before(async () => {
  if (skip) return;
  server = await startServer({ env: { API_SERVICE_USER_GROUPS: 'ADMIN,SYSTEM' } });
  client = new BPMNClient2(server.host, server.port, server.apiKey, { adminApiKey: server.adminApiKey });
});
test.after(async () => { await server?.web.stop(); setImmediate(() => process.exit(0)); });

const names = async () => (await client.model.list()).map(m => m.name ?? m);

test('model.list lists the definitions', { skip }, async () => {
  assert.ok((await names()).includes(MODEL));
});

test('model.import uploads a model; load, rename and delete it', { skip }, async () => {
  const file = path.join(server.fixtures, 'leave-request.bpmn');
  await client.model.import('client-model', file);
  assert.ok((await names()).includes('client-model'));

  const definition = await client.model.load('client-model');
  assert.ok(definition.elements.some(e => e.id === 'Submit'), 'definition elements');

  await client.model.rename('client-model', 'client-model-2');
  assert.ok((await names()).includes('client-model-2'));
  await client.model.delete('client-model-2');
  assert.ok(!(await names()).some(n => n.startsWith('client-model')));
});

test('changing models needs the admin key', { skip }, async () => {
  const runtimeOnly = new BPMNClient2(server.host, server.port, server.apiKey);
  await assert.rejects(() => runtimeOnly.model.rename(MODEL, 'x'), /401/);
});

test('data.find pages through instances', { skip }, async () => {
  await client.engine.start(MODEL, { page: 1 });
  await client.engine.start(MODEL, { page: 2 });
  const first = await client.data.find({ filter: { name: MODEL }, limit: 1, getTotalCount: true });
  assert.equal(first.data.length, 1, JSON.stringify(first).slice(0, 300));
  assert.ok(first.totalCount >= 2);
  assert.ok(first.nextCursor, 'a cursor to the next page');
  const second = await client.data.find({ filter: { name: MODEL }, limit: 1, after: first.nextCursor });
  assert.notEqual(second.data[0]._id, first.data[0]._id, 'the next page');   // the default projection omits id
});

test('a system principal throws messages and signals', { skip }, async () => {
  const message = await client.engine.throwMessage('no-listener', {});
  assert.ok(message !== undefined);
  const signal = await client.engine.throwSignal('no-listener', {});
  assert.ok(signal !== undefined);
});

test('data.deleteInstances deletes', { skip }, async () => {
  const instance = await client.engine.start(MODEL, { marker: 'delete-me' });
  await client.data.deleteInstances({ id: instance.id });
  assert.deepEqual(await client.data.findInstances({ id: instance.id }), []);
});
