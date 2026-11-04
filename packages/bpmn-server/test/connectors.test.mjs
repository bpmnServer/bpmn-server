// Connectors (docs/docs/connectors.md): REST APIs described by OpenAPI, added with an authorization key, called by
// service tasks (camunda:connector). A local server plays the shop API; one test calls GitHub itself, and is
// skipped when GitHub can not be reached.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { makeServer, quiet } from './helpers.mjs';
import { ConnectorError, parseDocument, listOperations, verifyModel } from '../dist/index.js';

const FIXTURES = fileURLToPath(new URL('./fixtures/connectors/', import.meta.url));
const SHOP = fs.readFileSync(path.join(FIXTURES, 'shop.openapi.yaml'), 'utf8');
const GITHUB = fs.readFileSync(path.join(FIXTURES, 'github.openapi.json'), 'utf8');
const TOKEN = 'shop-token-1234';
process.env.CONNECTORS_KEY = 'a test encryption key';

// ---- the shop API
const counts = { flaky: 0, orders: 0 };
const api = http.createServer((req, res) => {
  const url = new URL(req.url, 'http://x');
  const send = (status, body, type = 'application/json') => { res.writeHead(status, { 'Content-Type': type }); res.end(typeof body === 'string' ? body : JSON.stringify(body)); };
  if (url.pathname === '/openapi.yaml') return send(200, SHOP, 'application/yaml');
  if (url.pathname === '/api/health') return send(200, { ok: true });
  if (req.headers.authorization !== `Bearer ${TOKEN}`) return send(401, { error: 'unauthorized' });
  const customer = /^\/api\/customers\/([^/]+)$/.exec(url.pathname);
  if (customer) return decodeURIComponent(customer[1]) === 'C-1' ? send(200, { id: 'C-1', tier: 'gold' }) : send(404, { error: 'no such customer' });
  if (url.pathname === '/api/flaky') return ++counts.flaky < 3 ? send(503, 'busy', 'text/plain') : send(200, { tries: counts.flaky });
  if (url.pathname === '/api/orders') { counts.orders++; return send(503, 'down', 'text/plain'); }
  if (url.pathname === '/api/slow') return setTimeout(() => send(200, {}), 400);
  if (url.pathname.startsWith('/api/echo/')) return send(200, { path: url.pathname, tags: url.searchParams.getAll('tags'), trace: req.headers['x-trace'] ?? null });
  send(404, { error: 'no route' });
});
let base;
test.before(async () => {
  await new Promise(resolve => api.listen(0, '127.0.0.1', resolve));
  base = `http://127.0.0.1:${api.address().port}`;
});
test.after(() => api.close());

async function shopServer(extra = {}) {
  const made = await makeServer({ extra: { connectors: { retryDelay: 1 }, ...extra } });
  await made.server.connectors.install();
  await made.server.connectors.add({ id: 'shop', source: `${base}/openapi.yaml` });
  await made.server.connectors.setKey('shop', TOKEN);
  return made;
}

test('an OpenAPI document: JSON or YAML, $refs resolved, operations by operationId; others refused', () => {
  const doc = parseDocument(SHOP);
  const { operations, skipped } = listOperations(doc);
  assert.deepEqual([...operations.keys()].sort(), ['createOrder', 'echo', 'flaky', 'getCustomer', 'health', 'slow']);
  assert.deepEqual(skipped, ['POST /health'], 'no operationId: no operation');
  const get = operations.get('getCustomer');
  assert.deepEqual(get.parameters, [{ name: 'id', in: 'path', required: true, description: undefined, schema: { type: 'string' } }], 'the path\'s parameter, its $ref resolved');
  assert.deepEqual(get.responses['200'].schema.properties.tier, { type: 'string' });
  assert.deepEqual(operations.get('health').security, [], 'an operation without security');
  assert.equal(listOperations(parseDocument(GITHUB)).operations.get('repos/get').path, '/repos/{owner}/{repo}');
  assert.throws(() => parseDocument({ swagger: '2.0', paths: {} }), /Swagger 2.0 documents are not supported yet/);
  assert.throws(() => parseDocument('{ "openapi": "3.0.0", "paths": { "/a": { "get": { "$ref": "other.yaml#/x" } } } }'), /refers to another file/);
  assert.throws(() => parseDocument('not: [valid'), /does not parse/);
});

test('added from its URL: the base URL from the document\'s server, the key stored encrypted and never shown', async () => {
  const { server, store } = await shopServer();
  const [listed] = await server.connectors.list();
  assert.equal(listed.id, 'shop');
  assert.equal(listed.name, 'Shop');
  assert.equal(listed.baseUrl, `${base}/api`, 'a relative server, read against the document\'s URL');
  assert.equal(listed.openapi.source, `${base}/openapi.yaml`);
  assert.equal(listed.operations.getCustomer, true, 'every operation enabled');
  assert.deepEqual({ ...listed.auth, setAt: undefined }, { type: 'bearer', scheme: 'bearerAuth', last4: '1234', setAt: undefined });
  assert.equal('secret' in listed.auth, false, 'the key is not listed');
  const [stored] = await store.find('bpmn_test', 'wf_connectors', { id: 'shop' });
  assert.match(stored.auth.secret, /^v1:/);
  assert.ok(!JSON.stringify(stored).includes(TOKEN), 'the key is not stored in clear');
  assert.equal(typeof stored.openapi.packed, 'string', 'the document kept packed');
  assert.equal(stored.openapi.document, undefined);
  assert.equal(listed.openapi.packed, undefined, 'not handed out');
  assert.equal((await server.connectors.document('shop')).info.title, 'Shop', 'read back as it was');

  await assert.rejects(server.connectors.add({ id: 'shop', document: SHOP, baseUrl: base }), /A connector 'shop' exists/);
  await assert.rejects(server.connectors.add({ id: 'bad id', document: SHOP, baseUrl: base }), /can not be a connector id/);
  await assert.rejects(server.connectors.add({ id: 'x', document: SHOP }), /relative server URL needs the document's URL/);
  await assert.rejects(server.connectors.add({ id: 'x', document: SHOP, baseUrl: 'file:///etc' }), /must be http or https/);
  await server.shutdown();
});

test('a service task calls the connector: the inputs in the request, the answer mapped to the data; a 404 is the BPMN error HTTP_404', async () => {
  const { server } = await shopServer();
  const found = await server.engine.start('customer-lookup', { customerId: 'C-1' });
  assert.equal(found.instance.status, 'end');
  assert.equal(found.instance.data.tier, 'gold');
  assert.deepEqual(found.instance.data.customer, { id: 'C-1', tier: 'gold' });
  assert.ok(found.instance.items.some(i => i.elementId === 'Done'));
  const logs = JSON.stringify(found.instance.logs);
  assert.match(logs, /connector shop\/getCustomer: GET http:\/\/127\.0\.0\.1:\d+\/api\/customers\/C-1 → 200/);
  assert.ok(!logs.includes(TOKEN), 'the key is not logged');

  const missing = await server.engine.start('customer-lookup', { customerId: 'nobody' });
  assert.equal(missing.instance.status, 'end');
  assert.ok(missing.instance.items.some(i => i.elementId === 'Unknown' && i.status === 'end'), 'the boundary error event caught HTTP_404');
  assert.ok(!missing.instance.items.some(i => i.elementId === 'Done'));
  assert.match(JSON.stringify(missing.instance.decisions ?? missing.instance.logs), /answered HTTP 404, raised as the BPMN error HTTP_404/);
  await server.shutdown();
});

test('calls: parameters placed and encoded, retries only when safe, the timeout, the key\'s scheme', async () => {
  const { server } = await shopServer();
  const echo = await server.connectors.call('shop/echo', { value: 'a/b c', tags: ['x', 'y'], 'X-Trace': 't-1' });
  assert.deepEqual(echo.output, { path: '/api/echo/a%2Fb%20c', tags: ['x', 'y'], trace: 't-1' }, 'a path parameter can not add a segment');
  await assert.rejects(server.connectors.call('shop/echo', { value: '..' }), /can not be the path parameter/);
  await assert.rejects(server.connectors.call('shop/echo', {}), /the input 'value' is required/);

  const flaky = await server.connectors.call('shop/flaky');
  assert.deepEqual(flaky.output, { tries: 3 }, 'a GET is tried again after 503');
  await assert.rejects(server.connectors.call('shop/createOrder', { 'body.customerId': 'C-1', 'body.amount': 5 }),
    e => e instanceof ConnectorError && e.code === 'HTTP_503');
  assert.equal(counts.orders, 1, 'a POST is never tried again');
  await assert.rejects(server.connectors.call('shop/createOrder', {}), /the input 'body' is required/);

  await server.connectors.update('shop', { timeout: 100 });
  await assert.rejects(server.connectors.call('shop/slow'), /no answer within 100 ms/);

  await server.connectors.clearKey('shop');
  await assert.rejects(server.connectors.call('shop/getCustomer', { id: 'C-1' }), e => e.code === 'HTTP_401', 'no key, no authorization');
  await server.connectors.setKey('shop', 'wrong', { type: 'apiKey', in: 'header', name: 'X-Key' });
  assert.equal((await server.connectors.get('shop')).auth.name, 'X-Key');
  await assert.rejects(server.connectors.setKey('shop', 'k', 'nope'), /no security scheme 'nope'/);
  await assert.rejects(server.connectors.setKey('shop', 'k', { type: 'basic' }), /A basic key is user:password/);
  await server.shutdown();
});

test('disabled connectors and operations are refused; the test of the connection is kept; refresh says what changed', async () => {
  const { server } = await shopServer();
  await assert.rejects(server.connectors.call('nope/x'), /No connector 'nope'/);
  await assert.rejects(server.connectors.call('shop'), /does not name a connector's operation/);
  await assert.rejects(server.connectors.call('shop/nope'), /has no operation 'nope'/);
  await server.connectors.update('shop', { operations: { getCustomer: false } });
  await assert.rejects(server.connectors.call('shop/getCustomer', { id: 'C-1' }), /The operation 'shop\/getCustomer' is disabled/);
  await server.connectors.update('shop', { enabled: false });
  await assert.rejects(server.connectors.call('shop/flaky'), /The connector 'shop' is disabled/);

  const tested = await server.connectors.test('shop', 'health');
  assert.equal(tested.ok, true);
  assert.equal((await server.connectors.get('shop')).test.status, 200);

  const changed = await server.connectors.refresh('shop', SHOP.replace('operationId: slow', 'operationId: slowly'));
  assert.deepEqual(changed, { added: ['slowly'], removed: ['slow'] });
  assert.equal((await server.connectors.get('shop')).operations.getCustomer, false, 'a refresh keeps what was disabled');
  assert.equal(await server.connectors.remove('shop'), true);
  assert.deepEqual(await server.connectors.list(), []);
  await server.shutdown();
});

test('a connector stored before documents were packed is read, and packed once', async () => {
  const { server, store } = await makeServer();
  await server.connectors.install();
  await store.insert('bpmn_test', 'wf_connectors', [{ id: 'old', name: 'Old', baseUrl: base + '/api', enabled: true, groups: [],
    operations: { health: true }, openapi: { version: '3.1.0', fetchedAt: '2026-11-01T00:00:00.000Z', document: parseDocument(SHOP) }, createdAt: 'x', updatedAt: 'x' }]);
  assert.deepEqual((await server.connectors.list()).map(c => c.id), ['old']);
  assert.ok((await server.connectors.operations('old')).some(op => op.operationId === 'getCustomer'));
  const [stored] = await store.find('bpmn_test', 'wf_connectors', { id: 'old' });
  assert.equal(stored.openapi.document, undefined, 'the old form gone');
  assert.equal(typeof stored.openapi.packed, 'string', 'packed instead');
  assert.equal((await server.connectors.call('old/health')).status, 200);
  await server.shutdown();
});

test('verify: a connector task is checked against the server\'s connectors, and is not "a service task that names no service"', async () => {
  const { server } = await shopServer();
  const task = (ref, params = '', extra = '') => `<?xml version="1.0" encoding="UTF-8"?>
<bpmn:definitions xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:camunda="http://camunda.org/schema/1.0/bpmn" id="d" targetNamespace="t">
  <bpmn:process id="P" isExecutable="true">
    <bpmn:startEvent id="S"><bpmn:outgoing>a</bpmn:outgoing></bpmn:startEvent>
    <bpmn:serviceTask id="T" ${extra}><bpmn:extensionElements><camunda:connector><camunda:connectorId>${ref}</camunda:connectorId>
      <camunda:inputOutput>${params}</camunda:inputOutput></camunda:connector></bpmn:extensionElements>
      <bpmn:incoming>a</bpmn:incoming><bpmn:outgoing>b</bpmn:outgoing></bpmn:serviceTask>
    <bpmn:endEvent id="E"><bpmn:incoming>b</bpmn:incoming></bpmn:endEvent>
    <bpmn:sequenceFlow id="a" sourceRef="S" targetRef="T" /><bpmn:sequenceFlow id="b" sourceRef="T" targetRef="E" />
  </bpmn:process></bpmn:definitions>`;
  const codes = async (xml) => (await verifyModel(xml, server)).issues.map(i => i.code).filter(c => c !== 'no-diagram' && c !== 'not-in-diagram');
  const input = (name, value) => `<camunda:inputParameter name="${name}">${value}</camunda:inputParameter>`;

  assert.deepEqual(await codes(task('shop/getCustomer', input('id', '${data.id}'))), [], 'all well: nothing, not service-not-named');
  assert.deepEqual(await codes(task('shop/getCustomer')), ['connector-input-missing']);
  assert.deepEqual(await codes(task('shop/getCustomer', input('id', 'x') + input('extra', 'y'))), ['connector-input-unknown']);
  assert.deepEqual(await codes(task('shop/createOrder', input('body', '${data.order}'))), [], 'the body whole');
  assert.deepEqual(await codes(task('shop/createOrder')), ['connector-input-missing']);
  assert.deepEqual(await codes(task('nope/x')), ['connector-unknown']);
  assert.deepEqual(await codes(task('shop/nope')), ['connector-operation-unknown']);
  assert.deepEqual(await codes(task('shop/')), ['connector-not-named']);
  assert.deepEqual(await codes(task('')), ['connector-not-named']);
  assert.deepEqual(await codes(task('shop/flaky', '', 'camunda:delegateExpression="notify"')), ['connector-and-service']);
  await server.connectors.update('shop', { operations: { flaky: false } });
  assert.deepEqual(await codes(task('shop/flaky')), ['connector-operation-disabled']);
  await server.connectors.update('shop', { enabled: false });
  assert.ok((await codes(task('shop/health'))).includes('connector-disabled'));
  const issue = (await verifyModel(task('shop/getCustomer'), server)).issues.find(i => i.code === 'connector-input-missing');
  assert.equal(issue.severity, 'error');
  assert.match(issue.message, /needs the input 'id'/);
  await server.shutdown();
});

test('without CONNECTORS_KEY no key can be set; in demo mode connectors do not run; CONNECTORS_ALLOW_HOSTS limits hosts', async () => {
  const { server } = await shopServer({ demo: true });
  const demo = await server.engine.start('customer-lookup', { customerId: 'C-1' });
  assert.equal(demo.instance.status, 'end');
  assert.equal(demo.instance.data.tier, undefined, 'not called');
  assert.match(JSON.stringify(demo.instance.decisions ?? demo.instance.logs), /in this demo, connectors do not run/);

  const key = process.env.CONNECTORS_KEY;
  delete process.env.CONNECTORS_KEY;
  try {
    await assert.rejects(server.connectors.setKey('shop', TOKEN), /need CONNECTORS_KEY/);
  } finally {
    process.env.CONNECTORS_KEY = key;
  }
  process.env.CONNECTORS_ALLOW_HOSTS = 'api.example.com, *.trusted.dev';
  try {
    await assert.rejects(server.connectors.add({ id: 'other', document: SHOP, baseUrl: 'https://evil.example.org' }), /not in CONNECTORS_ALLOW_HOSTS/);
    await server.connectors.add({ id: 'trusted', document: SHOP, baseUrl: 'https://api.trusted.dev/v1' });
    await assert.rejects(server.connectors.call('shop/health'), /127\.0\.0\.1 is not in CONNECTORS_ALLOW_HOSTS/, 'checked at each call too');
  } finally {
    delete process.env.CONNECTORS_ALLOW_HOSTS;
  }
  await server.shutdown();
});

test('the sample: GitHub\'s repository bpmnServer/bpmn-server, its description and how many stars it has', async (t) => {
  const { server } = await makeServer({ logger: quiet() });
  await server.connectors.install();
  await server.connectors.add({ id: 'github', document: GITHUB });
  try {
    const probe = await fetch('https://api.github.com/rate_limit', { signal: AbortSignal.timeout(5000) });
    if (!probe.ok || Number((await probe.json())?.resources?.core?.remaining ?? 1) < 2)
      return t.skip('GitHub is rate limiting this address');
  } catch {
    await server.shutdown();
    return t.skip('GitHub can not be reached');
  }

  const run = await server.engine.start('github-repo', { owner: 'bpmnServer', repo: 'bpmn-server' });
  assert.equal(run.instance.status, 'end');
  assert.ok(run.instance.items.some(i => i.elementId === 'Done'), JSON.stringify(run.instance.logs.slice(-5)));
  assert.equal(typeof run.instance.data.description, 'string');
  assert.match(run.instance.data.description, /BPMN/i);
  assert.equal(typeof run.instance.data.starsCount, 'number');
  assert.ok(run.instance.data.starsCount > 0);

  const missing = await server.engine.start('github-repo', { owner: 'bpmnServer', repo: 'no-such-repository-here' });
  assert.ok(missing.instance.items.some(i => i.elementId === 'NotFound'), 'a 404 ends at Not found');
  await server.shutdown();
});
