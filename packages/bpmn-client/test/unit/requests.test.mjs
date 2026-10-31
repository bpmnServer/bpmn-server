// What each client method sends, and how answers and failures come back, against a recording
// HTTP server (no bpmn-web needed). The contract tests (test/contract) check the same calls
// against a real server.
import test from 'node:test';
import assert from 'node:assert/strict';
import http from 'node:http';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { BPMNClient, BPMNClient2 } from '../../dist/index.js';

const API_KEY = 'runtime-key';
const ADMIN_KEY = 'admin-key';
let server, port, requests = [], reply = () => ({ status: 200, body: {} });

test.before(async () => {
  server = http.createServer((req, res) => {
    let body = '';
    req.on('data', c => { body += c; });
    req.on('end', () => {
      const parsed = (req.headers['content-type'] || '').includes('json') && body ? JSON.parse(body) : body;
      const recorded = { method: req.method, path: req.url, key: req.headers['x-api-key'], body: parsed, contentType: req.headers['content-type'] };
      requests.push(recorded);
      const { status = 200, body: answer = {}, type = 'application/json' } = reply(recorded);
      res.writeHead(status, { 'content-type': type });
      res.end(typeof answer === 'string' ? answer : JSON.stringify(answer));
    });
  });
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  port = server.address().port;
});
test.after(() => server.close());
test.beforeEach(() => { requests = []; reply = () => ({ status: 200, body: {} }); });

const client2 = () => new BPMNClient2('127.0.0.1', port, API_KEY, { adminApiKey: ADMIN_KEY });
const client1 = () => new BPMNClient('127.0.0.1', port, API_KEY, { adminApiKey: ADMIN_KEY });
const last = () => requests[requests.length - 1];

test('BPMNClient2 engine and data calls: method, path, key, body', async () => {
  const c = client2();
  reply = () => ({ body: { id: 'i1', instance: { id: 'i1' }, items: [], instances: [] } });
  const cases = [
    [() => c.engine.start('m', { a: 1 }), 'POST', '/api2/engine/start', b => b.name === 'm' && b.data.a === 1],
    [() => c.engine.invoke({ id: 'i1' }, { d: 2 }), 'PUT', '/api2/engine/invoke', b => b.query.id === 'i1' && b.data.d === 2],
    [() => c.engine.assign({ id: 'i1' }, {}, { assignee: 'u' }), 'PUT', '/api2/engine/assign', b => b.assignment.assignee === 'u'],
    [() => c.engine.throwMessage('msg', { x: 1 }), 'POST', '/api2/engine/throwMessage', b => b.messageId === 'msg'],
    [() => c.engine.throwSignal('sig', {}), 'POST', '/api2/engine/throwSignal', b => b.signalId === 'sig'],
    [() => c.data.findItems({ id: 'i1' }), 'POST', '/api2/data/findItems', b => b.query.id === 'i1'],
    [() => c.data.findInstances({ id: 'i1' }), 'GET', '/api2/data/findInstances', b => b.query.id === 'i1'],
    [() => c.data.find({ filter: { name: 'm' }, limit: 5 }), 'GET', '/api2/datastore/find', b => b.filter.name === 'm' && b.limit === 5],
    [() => c.data.deleteInstances({ id: 'i1' }), 'DELETE', '/api2/data/deleteInstances', b => b.query.id === 'i1'],
  ];
  for (const [call, method, url, checkBody] of cases) {
    await call();
    const r = last();
    assert.equal(r.method, method, url);
    assert.equal(r.path, url);
    assert.equal(r.key, API_KEY, `${url} uses the runtime key`);
    assert.ok(checkBody(r.body), `${url} body ${JSON.stringify(r.body)}`);
  }
});

test('model reads use the runtime API, falling back to /admin/api2 on older servers', async () => {
  const c = client2();
  reply = () => ({ body: [{ name: 'm' }] });
  assert.deepEqual(await c.model.list(), [{ name: 'm' }]);
  assert.deepEqual([last().method, last().path, last().key], ['GET', '/api2/model/list', API_KEY]);
  await c.model.findStartEvents({ name: 'm' });
  assert.deepEqual([last().path, last().body], ['/api2/model/findStartEvents', { query: { name: 'm' } }]);

  for (const older of [{ status: 404, body: { errors: 'No API route' } }, { body: '<!DOCTYPE html><html>login</html>', type: 'text/html' }]) {
    requests = [];
    reply = r => r.path.startsWith('/admin/') ? { body: [{ name: 'old' }] } : older;
    assert.deepEqual(await c.model.list(), [{ name: 'old' }]);
    assert.deepEqual(requests.map(r => `${r.path} ${r.key}`), ['/api2/model/list runtime-key', '/admin/api2/model/list admin-key']);
  }
  reply = () => ({ status: 401, body: { errors: 'bad key' } });
  await assert.rejects(() => c.model.list(), /401 bad key/, 'other failures are not retried');
});

test('BPMNClient2 model changes go to /admin/api2 with the admin key', async () => {
  const c = client2();
  reply = () => ({ body: {} });
  await c.model.rename('a', 'b');
  assert.deepEqual([last().method, last().path, last().key, last().body], ['POST', '/admin/api2/model/rename', ADMIN_KEY, { name: 'a', newName: 'b' }]);
  await c.model.delete('a');
  assert.deepEqual([last().method, last().path, last().body], ['POST', '/admin/api2/model/delete', { name: 'a' }]);
  await c.model.load('My Model');
  assert.deepEqual([last().method, last().path], ['GET', '/admin/api2/model/load/My%20Model']);
});

test('model import uploads the files as multipart to the admin API', async () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'client-test-'));
  const bpmn = path.join(dir, 'm.bpmn'), svg = path.join(dir, 'm.svg');
  fs.writeFileSync(bpmn, '<bpmn:definitions/>');
  fs.writeFileSync(svg, '<svg/>');
  reply = () => ({ body: 'OK' });
  await client2().model.import('My Model', bpmn, svg);
  const r = last();
  assert.equal(r.method, 'POST');
  assert.equal(r.path, '/admin/api2/model/import/My%20Model');
  assert.equal(r.key, ADMIN_KEY);
  assert.match(r.contentType, /multipart\/form-data/);
  assert.match(r.body, /<bpmn:definitions\/>/);
  assert.match(r.body, /<svg\/>/);

  await client1().definitions.import('legacy', bpmn);
  assert.equal(last().path, '/admin/api/definitions/import/legacy');
  assert.equal(last().key, ADMIN_KEY);
});

test('BPMNClient (legacy) calls: method, path, key', async () => {
  const c = client1();
  reply = () => ({ body: { id: 'i1', instance: { id: 'i1' }, items: [], instances: [] } });
  const cases = [
    [() => c.engine.start('m', {}), 'POST', '/api/engine/start', API_KEY],
    [() => c.engine.invoke({ id: 'i1' }, {}), 'PUT', '/api/engine/invoke', API_KEY],
    [() => c.engine.assign({ id: 'i1' }, {}, null, { assignee: 'u' }), 'PUT', '/api/engine/assign', API_KEY],
    [() => c.engine.restart({ 'items.id': 'x' }, {}), 'PUT', '/api/engine/restart', API_KEY],
    [() => c.engine.startEvent('i1', 'e1', {}), 'PUT', '/api/engine/startEvent', API_KEY],
    [() => c.engine.get({ id: 'i1' }), 'GET', '/api/engine/get', API_KEY],
    [() => c.engine.status(), 'GET', '/api/engine/status', API_KEY],
    [() => c.datastore.findItems({ id: 'i1' }), 'GET', '/api/datastore/findItems', API_KEY],
    [() => c.datastore.findInstances({ id: 'i1' }), 'GET', '/api/datastore/findInstances', API_KEY],
    [() => c.datastore.deleteInstances({ id: 'i1' }), 'DELETE', '/admin/api/datastore/deleteInstances', ADMIN_KEY],
    [() => c.definitions.list(), 'GET', '/admin/api/definitions/list', ADMIN_KEY],
    [() => c.definitions.rename('a', 'b'), 'POST', '/admin/api/definitions/rename', ADMIN_KEY],
    [() => c.definitions.delete('a'), 'POST', '/admin/api/definitions/delete', ADMIN_KEY],
  ];
  for (const [call, method, url, key] of cases) {
    await call();
    assert.deepEqual([last().method, last().path, last().key], [method, url, key], url);
  }
});

test('the admin key defaults to the API key', async () => {
  const c = new BPMNClient2('127.0.0.1', port, API_KEY);
  reply = () => ({ body: {} });
  await c.model.rename('a', 'b');
  assert.equal(last().key, API_KEY);
});

test('an HTTP error rejects with its status and the server message', async () => {
  reply = () => ({ status: 401, body: { errors: 'missing or invalid "x-api-key"' } });
  await assert.rejects(() => client2().engine.start('m', {}), err => {
    assert.match(err.message, /^401 missing or invalid "x-api-key"/);
    assert.equal(err.status, 401);
    return true;
  });
  reply = () => ({ status: 403, body: { errors: 'Administrator permission required' } });
  await assert.rejects(() => client2().data.deleteInstances({}), /403 Administrator permission required/);
  reply = () => ({ status: 500, body: 'Internal failure', type: 'text/plain' });
  await assert.rejects(() => client1().engine.status(), /500 Internal failure/);
});

test('failures reported in a 200 answer reject, as { errors } or { error }', async () => {
  reply = () => ({ body: { error: 'Error: No process definition named m' } });
  await assert.rejects(() => client2().engine.start('m', {}), /No process definition named m/);
  reply = () => ({ body: { errors: 'query produced no items', instance: null } });
  await assert.rejects(() => client2().engine.invoke({}, {}), /query produced no items/);
  reply = () => ({ body: { errors: 'bad query' } });
  await assert.rejects(() => client1().datastore.findItems({}), /bad query/);
});

test('a web page instead of the API rejects with a clear message', async () => {
  reply = () => ({ body: '<!DOCTYPE html><html><body>Login</body></html>', type: 'text/html' });
  await assert.rejects(() => client2().data.findItems({}), /web page instead of the API/);
});

test('an unreachable server rejects with the connection error', async () => {
  const nowhere = new BPMNClient2('127.0.0.1', 1, API_KEY);
  await assert.rejects(() => nowhere.engine.start('m', {}), /ECONNREFUSED/);
});

test('successful answers come back as the server sent them', async () => {
  reply = () => ({ body: { id: 'i9', name: 'm', status: 'wait', items: [] } });
  assert.deepEqual(await client2().engine.start('m', {}), { id: 'i9', name: 'm', status: 'wait', items: [] });
  reply = () => ({ body: { items: [{ id: 'it1' }] } });
  assert.deepEqual(await client2().data.findItems({}), [{ id: 'it1' }]);
  reply = () => ({ body: { instances: [{ id: 'i1' }] } });
  assert.deepEqual(await client2().data.findInstances({}), [{ id: 'i1' }]);
  reply = () => ({ body: { errors: undefined, instance: { id: 'i1', status: 'end' } } });
  assert.deepEqual(await client2().engine.invoke({}, {}), { id: 'i1', status: 'end' });
});

test('an empty errors list is not a failure', async () => {
  reply = () => ({ body: { errors: [], items: [{ id: 'a' }] } });
  assert.deepEqual(await client2().data.findItems({}), [{ id: 'a' }]);
  reply = () => ({ body: { errors: ['first problem'] } });
  await assert.rejects(() => client2().data.findItems({}), /first problem/);
});

