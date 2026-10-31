// The REST APIs (/api2, the authorized API; /api, the legacy one) driving the leave-request process.
// The API key stands for one service account (API_SERVICE_USER_*: groups staff,manager in the tests).
import test from 'node:test';
import assert from 'node:assert/strict';
import { startWebApp, ADMIN_API_KEY, WebClient } from '../support/webApp.mjs';

const MODEL = 'leave-request';
let web;
test.before(async () => { web = await startWebApp(); });
test.after(async () => { await web?.stop(); setImmediate(() => process.exit(0)); });

const waitingAt = (instance, elementId) => instance.items.find(i => i.elementId === elementId && i.status === 'wait');

test('status', async () => {
  const res = await web.api('GET', '/api2/status');
  assert.equal(res.status, 200);
});

test('a process runs through /api2: start, find the task, invoke it', async () => {
  const started = await web.api('POST', '/api2/engine/start', { name: MODEL, data: { requester: 'api' } });
  assert.equal(started.status, 200);
  assert.ok(started.body.id, JSON.stringify(started.body).slice(0, 200));
  const instanceId = started.body.id;

  const found = await web.api('POST', '/api2/data/findItems', { query: { id: instanceId, 'items.status': 'wait' } });
  assert.equal(found.status, 200);
  assert.equal(found.body.errors, undefined, found.body.errors);
  const submit = found.body.items.find(i => i.elementId === 'Submit');
  assert.ok(submit, 'Submit waits');

  const invoked = await web.api('PUT', '/api2/engine/invoke', { query: { id: instanceId, 'items.elementId': 'Submit' }, data: { days: 2, reason: 'api' } });
  assert.equal(invoked.status, 200);
  assert.equal(invoked.body.errors, undefined, invoked.body.errors);
  assert.equal(invoked.body.instance.status, 'end');
  assert.equal(invoked.body.instance.data.approvedBy, 'system');
});

test('the start name can be given in the path', async () => {
  const started = await web.api('POST', '/api2/engine/start/' + MODEL, { data: {} });
  assert.ok(started.body.id);
});

test('a task is assigned through /api2', async () => {
  const { body: instance } = await web.api('POST', '/api2/engine/start', { name: MODEL, data: {} });
  const res = await web.api('PUT', '/api2/engine/assign', {
    query: { id: instance.id, 'items.elementId': 'Submit' }, data: {}, assignment: { assignee: 'manager' },
  });
  assert.equal(res.status, 200);
  const saved = await web.bpmnServer.dataStore.findInstance({ id: instance.id }, 'full');
  assert.equal(waitingAt(saved, 'Submit').assignee, 'manager');
});

test('failures are reported as { errors } on both APIs', async () => {
  for (const url of ['/api2/engine/start', '/api/engine/start']) {
    const res = await web.api('POST', url, { name: 'no-such-model', data: {} });
    assert.equal(typeof res.body.errors, 'string', `${url}: ${JSON.stringify(res.body)}`);
    assert.match(res.body.errors, /no-such-model/);
    assert.equal(res.body.error, undefined, `${url}: no { error }`);
  }
  const invoked = await web.api('PUT', '/api2/engine/invoke', { query: { id: 'no-such-instance' }, data: {} });
  assert.equal(typeof invoked.body.errors, 'string', JSON.stringify(invoked.body));
});

test('successful answers carry no errors', async () => {
  const started = await web.api('POST', '/api2/engine/start', { name: MODEL, data: {} });
  assert.equal(started.body.errors, undefined);
  const found = await web.api('POST', '/api2/data/findItems', { query: { id: started.body.id } });
  assert.equal(found.body.errors, undefined);
});

test('instances are found through /api2', async () => {
  await web.api('POST', '/api2/engine/start', { name: MODEL, data: { marker: 'find-me' } });
  // fetch can not send a body with GET; without one every visible instance is returned
  const res = await web.api('GET', '/api2/data/findInstances');
  assert.equal(res.status, 200);
  const instances = res.body.instances ?? res.body;
  assert.ok(Array.isArray(instances) && instances.some(i => i.name === MODEL), JSON.stringify(res.body).slice(0, 200));
});

test('deleting instances needs an administrator principal', async () => {
  const res = await web.api('DELETE', '/api2/data/deleteInstances', { query: { name: MODEL } });
  assert.equal(res.status, 403, 'the service account is not an administrator');
});

test('the legacy /api starts and invokes processes', async () => {
  const started = await web.api('POST', '/api/engine/start', { name: MODEL, data: {} });
  assert.equal(started.status, 200, JSON.stringify(started.body).slice(0, 200));
  const id = started.body.id ?? started.body.instance?.id;
  assert.ok(id, JSON.stringify(started.body).slice(0, 200));
  const invoked = await web.api('PUT', '/api/engine/invoke', { query: { id, 'items.elementId': 'Submit' }, data: { days: 9 } });
  assert.equal(invoked.status, 200);
  const saved = await web.bpmnServer.dataStore.findInstance({ id }, 'full');
  assert.ok(waitingAt(saved, 'Approve'), 'long leave waits for approval');
});

test('the admin key alone does not let a non-administrator service account change models', async () => {
  const res = await new WebClient(web.base).request('POST', '/admin/api2/model/import/api-model', {
    headers: { 'x-api-key': ADMIN_API_KEY }, multipart: { file: { filename: 'api-model.bpmn', content: 'x', type: 'application/xml' } },
  });
  assert.equal(res.status, 403);
  assert.ok(!JSON.stringify((await web.api('GET', '/admin/api2/model/list', undefined, ADMIN_API_KEY)).body).includes('api-model'));
});

test('the runtime API reads models: list, start events, events', async () => {
  const list = await web.api('GET', '/api2/model/list');
  assert.equal(list.status, 200);
  assert.ok(list.body.some(m => (m.name ?? m) === MODEL), JSON.stringify(list.body).slice(0, 200));
  const starts = await web.api('GET', '/api2/model/findStartEvents');
  assert.equal(starts.status, 200);
  assert.ok(starts.body.some(e => (e.modelName ?? e.name) === MODEL), JSON.stringify(starts.body).slice(0, 300));
  assert.equal((await web.api('GET', '/api2/model/findEvents')).status, 200);
});

test('the runtime API can not change models', async () => {
  for (const [method, url] of [['POST', '/api2/model/rename'], ['POST', '/api2/model/delete'], ['POST', '/api2/model/import/x']]) {
    const res = await web.api(method, url, { name: MODEL, newName: 'x' });
    assert.notEqual(res.status, 200, url);
  }
  const names = (await web.bpmnServer.definitions.getList()).map(m => m.name ?? m);
  assert.ok(names.includes(MODEL));
});

