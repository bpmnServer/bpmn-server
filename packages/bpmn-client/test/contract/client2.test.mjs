// BPMNClient2 (the /api2 client) against a real bpmn-web: every method, as a consumer calls it.
// The process is bpmn-web's leave-request fixture:
//   Submit request (staff, form: days) -> more than 5 days? -> Approve request (manager) | automatic approval
import test from 'node:test';
import assert from 'node:assert/strict';
import { BPMNClient2 } from '../../dist/index.js';
import { startServer, skip } from './server.mjs';

const MODEL = 'leave-request';
let server, client;

test.before(async () => {
  if (skip) return;
  server = await startServer();
  client = new BPMNClient2(server.host, server.port, server.apiKey);
});
test.after(async () => { await server?.web.stop(); setImmediate(() => process.exit(0)); });

const waiting = (instance, elementId) => instance.items.find(i => i.elementId === elementId && i.status === 'wait');

test('engine.start returns the new instance', { skip }, async () => {
  const instance = await client.engine.start(MODEL, { requester: 'client' });
  assert.ok(instance.id);
  assert.equal(instance.name, MODEL);
  assert.equal(instance.data.requester, 'client');
  assert.ok(waiting(instance, 'Submit'), 'first task waits');
});

test('data.findItems finds the waiting task', { skip }, async () => {
  const instance = await client.engine.start(MODEL, {});
  const items = await client.data.findItems({ id: instance.id, 'items.status': 'wait' });
  assert.ok(Array.isArray(items), `items: ${JSON.stringify(items)}`);
  assert.deepEqual(items.map(i => i.elementId), ['Submit']);
});

test('data.findInstances returns instances with their data', { skip }, async () => {
  const instance = await client.engine.start(MODEL, { marker: 'find-me' });
  const instances = await client.data.findInstances({ id: instance.id });
  assert.ok(Array.isArray(instances), `instances: ${JSON.stringify(instances)}`);
  assert.equal(instances.length, 1);
  assert.equal(instances[0].data.marker, 'find-me');
});

test('engine.invoke completes a task and returns the instance', { skip }, async () => {
  const started = await client.engine.start(MODEL, {});
  const instance = await client.engine.invoke({ id: started.id, 'items.elementId': 'Submit' }, { days: 2 });
  assert.equal(instance.status, 'end');
  assert.equal(instance.data.approvedBy, 'system');
});

test('a long leave waits for the manager, then completes', { skip }, async () => {
  const started = await client.engine.start(MODEL, {});
  const afterSubmit = await client.engine.invoke({ id: started.id, 'items.elementId': 'Submit' }, { days: 9 });
  assert.ok(waiting(afterSubmit, 'Approve'));
  const done = await client.engine.invoke({ id: started.id, 'items.elementId': 'Approve' }, {});
  assert.equal(done.status, 'end');
});

test('engine.assign sets the assignee', { skip }, async () => {
  const started = await client.engine.start(MODEL, {});
  const instance = await client.engine.assign({ id: started.id, 'items.elementId': 'Submit' }, {}, { assignee: 'manager' });
  assert.equal(waiting(instance, 'Submit').assignee, 'manager');
});

test('data.find (raw datastore query) needs a system principal', { skip }, async () => {
  await assert.rejects(() => client.data.find({ filter: { name: MODEL }, limit: 1 }), /403 System permission/);
});

test('errors from the server reject with the server message', { skip }, async () => {
  await assert.rejects(() => client.engine.start('no-such-model', {}), /no-such-model|not found|No process/i);
  await assert.rejects(() => client.engine.invoke({ id: 'no-such-instance' }, {}), /no items|not found|no instance/i);
});

test('messages and signals need a system principal', { skip }, async () => {
  await assert.rejects(() => client.engine.throwMessage('msg', {}), /System permission/);
  await assert.rejects(() => client.engine.throwSignal('sig', {}), /System permission/);
});

test('deleteInstances needs an administrator principal', { skip }, async () => {
  await assert.rejects(() => client.data.deleteInstances({ name: MODEL }), /403|Administrator permission/);
});

test('a wrong API key rejects with 401', { skip }, async () => {
  const wrong = new BPMNClient2(server.host, server.port, 'not-the-key');
  await assert.rejects(() => wrong.engine.start(MODEL, {}), /401|api key/i);
  await assert.rejects(() => wrong.data.findItems({}), /401|api key/i);
});

test('an unreachable server rejects with the connection error', { skip }, async () => {
  const nowhere = new BPMNClient2('127.0.0.1', 1, server.apiKey);
  await assert.rejects(() => nowhere.engine.start(MODEL, {}), /ECONNREFUSED|connect/i);
});

test('model.list and findStartEvents work with the runtime key', { skip }, async (t) => {
  // (the client's own HTTP stack: fetch's keep-alive sockets can crash Node on Windows at process.exit)
  const status = await client.get('model/list', {}).then(() => 200, e => e.status ?? 0);
  if (status === 404) return t.skip('the server predates runtime model reads (bpmn-web with bpmn-server 3.2)');
  const names = (await client.model.list()).map(m => m.name ?? m);
  assert.ok(names.includes(MODEL), names.join(','));
  const starts = await client.model.findStartEvents();
  assert.ok(starts.some(e => (e.modelName ?? e.name) === MODEL));
});

