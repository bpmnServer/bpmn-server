// BPMNClient (the legacy /api client) against a real bpmn-web: every method, as a consumer calls it.
import test from 'node:test';
import assert from 'node:assert/strict';
import path from 'node:path';
import { BPMNClient } from '../../dist/index.js';
import { startServer, skip } from './server.mjs';

const MODEL = 'leave-request';
let server, client;

test.before(async () => {
  if (skip) return;
  server = await startServer({ env: { SAVE_POINTS: 'true' } });   // engine.restart needs save points
  client = new BPMNClient(server.host, server.port, server.apiKey, { adminApiKey: server.adminApiKey });
});
test.after(async () => { await server?.web.stop(); setImmediate(() => process.exit(0)); });

const waiting = (instance, elementId) => instance.items.find(i => i.elementId === elementId && i.status === 'wait');

test('engine.status answers', { skip }, async () => {
  const status = await client.engine.status();
  assert.ok(status.engine || status.cache, JSON.stringify(status).slice(0, 200));
});

test('engine.start, datastore.findItems, engine.invoke', { skip }, async () => {
  const instance = await client.engine.start(MODEL, { requester: 'legacy' });
  assert.ok(instance.id, JSON.stringify(instance).slice(0, 200));
  assert.equal(instance.data.requester, 'legacy');

  const items = await client.datastore.findItems({ id: instance.id, 'items.status': 'wait' });
  assert.deepEqual(items.map(i => i.elementId), ['Submit']);

  const done = await client.engine.invoke({ id: instance.id, 'items.elementId': 'Submit' }, { days: 1 });
  assert.equal(done.status, 'end');
});

test('engine.get returns an instance', { skip }, async () => {
  const started = await client.engine.start(MODEL, {});
  const instance = await client.engine.get({ id: started.id });
  assert.equal(instance.id, started.id);
});

test('engine.assign sets the assignee', { skip }, async () => {
  const started = await client.engine.start(MODEL, {});
  const instance = await client.engine.assign({ id: started.id, 'items.elementId': 'Submit' }, {}, null, { assignee: 'manager' });
  assert.equal(waiting(instance, 'Submit').assignee, 'manager');
});

test('datastore.findInstances returns instances with their data', { skip }, async () => {
  const started = await client.engine.start(MODEL, { marker: 'legacy-find' });
  const instances = await client.datastore.findInstances({ id: started.id });
  assert.equal(instances.length, 1);
  assert.equal(instances[0].data.marker, 'legacy-find');
});

test('datastore.find pages through instances', { skip }, async () => {
  await client.engine.start(MODEL, {});
  await client.engine.start(MODEL, {});
  const first = await client.datastore.find({ filter: { name: MODEL }, limit: 1 });
  assert.equal(first.data.length, 1);
  const second = await client.datastore.find({ filter: { name: MODEL }, limit: 1, after: first.nextCursor });
  assert.notEqual(second.data[0]._id, first.data[0]._id);
});

test('engine.restart restarts an ended instance from an item', { skip }, async () => {
  const started = await client.engine.start(MODEL, {});
  const done = await client.engine.invoke({ id: started.id, 'items.elementId': 'Submit' }, { days: 1 });
  const submit = done.items.find(i => i.elementId === 'Submit');
  const restarted = await client.engine.restart({ 'items.id': submit.id }, {});
  assert.ok(restarted, 'an instance');
});

test('errors reject with the server message', { skip }, async () => {
  await assert.rejects(() => client.engine.start('no-such-model', {}), /no-such-model|not found|No process/i);
  const wrong = new BPMNClient(server.host, server.port, 'not-the-key');
  await assert.rejects(() => wrong.engine.status(), /401/);
});

test('definitions: import, list, load, rename, delete with the admin key', { skip }, async () => {
  await client.definitions.import('legacy-model', path.join(server.fixtures, 'leave-request.bpmn'));
  const names = async () => (await client.definitions.list()).map(m => m.name ?? m);
  assert.ok((await names()).includes('legacy-model'));
  const source = await client.definitions.load('legacy-model');   // the legacy API returns the XML source
  assert.match(source, /<bpmn:userTask id="Submit"/);
  await client.definitions.rename('legacy-model', 'legacy-model-2');
  assert.ok((await names()).includes('legacy-model-2'));
  await client.definitions.delete('legacy-model-2');
  assert.ok(!(await names()).some(n => n.startsWith('legacy-model')));
});

test('datastore.deleteInstances (admin key) deletes', { skip }, async () => {
  const started = await client.engine.start(MODEL, { marker: 'legacy-delete' });
  await client.datastore.deleteInstances({ id: started.id });
  assert.deepEqual(await client.datastore.findInstances({ id: started.id }), []);
});
