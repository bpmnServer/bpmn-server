// @features: connectors
// Connectors (docs/docs/connectors.md): REST APIs described by OpenAPI, added with an authorization key, called by
// service tasks (camunda:connector). A local server plays the shop API; one test calls GitHub itself, and is
// skipped when GitHub can not be reached.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import http from 'node:http';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import zlib from 'node:zlib';
import { makeServer, quiet } from './helpers.mjs';
import { ConnectorError, MemoryDocumentStore, parseDocument, listOperations, resolveRefs, verifyModel } from '../dist/index.js';

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
  const { server, store, dir } = await shopServer();
  const [listed] = await server.connectors.list();
  assert.equal(listed.id, 'shop');
  assert.equal(listed.name, 'Shop');
  assert.equal(listed.baseUrl, `${base}/api`, 'a relative server, read against the document\'s URL');
  assert.equal(listed.openapi.source, `${base}/openapi.yaml`);
  assert.equal(listed.operations.getCustomer, true, 'every operation enabled');
  assert.deepEqual({ ...listed.auth, setAt: undefined }, { type: 'bearer', scheme: 'bearerAuth', last4: '1234', setAt: undefined });
  assert.equal('secret' in listed.auth, false, 'the key is not listed');
  // the connector is a file in the models folder's connectors folder; the key stays with this server, encrypted, never in the file
  const [stored] = await store.find('bpmn_test', 'wf_connectors', { id: 'shop' });
  assert.match(stored.key.secret, /^v1:/);
  assert.ok(!JSON.stringify(stored).includes(TOKEN), 'the key is not stored in clear');
  assert.equal(stored.openapi, undefined, 'the definition is not in the collection');
  const file = JSON.parse(fs.readFileSync(path.join(dir, 'connectors', 'shop.connector.json'), 'utf8'));
  assert.equal(file.id, 'shop');
  assert.equal(file.openapi.document.info.title, 'Shop', 'the document in the file, as JSON');
  assert.deepEqual(file.auth, { type: 'bearer', scheme: 'bearerAuth' }, 'the key\'s scheme in the file');
  assert.ok(!JSON.stringify(file).includes(TOKEN) && !JSON.stringify(file).includes('v1:'), 'no key in the file, not even encrypted');
  assert.equal(listed.openapi.document, undefined, 'not handed out');
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
  const raised = missing.instance.logs.filter(l => l.type === 'decision').map(l => l.message);
  assert.ok(raised.some(d => /action: raises the BPMN error HTTP_404\nwhy:\n    the connector \S+ answered HTTP 404/.test(d)), raised.join('\n\n'));
  await server.shutdown();
});

test('a connector call with output parameters and no inputs (a list, say): the output mapped at exit, never into itself', async () => {
  // its outputs were made on entering, as a throw event's: ${output} was the item's own output, set inside itself. A
  // save during the call (a boundary event waiting on the task saves the instance) met that circle: MongoDB refused it,
  // "Cannot convert circular structure to BSON". This store converts what it saves, as a database has to.
  class SavingStore extends MemoryDocumentStore {
    async insert(db, col, docs) { return super.insert(db, col, JSON.parse(JSON.stringify(docs))); }
    async update(db, col, query, update, options) { return super.update(db, col, query, JSON.parse(JSON.stringify(update)), options); }
  }
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'bpmn-defs-')) + path.sep;
  fs.writeFileSync(path.join(dir, 'health-check.bpmn'), `<?xml version="1.0" encoding="UTF-8"?>
<bpmn:definitions xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:camunda="http://camunda.org/schema/1.0/bpmn" id="d" targetNamespace="t">
  <bpmn:error id="Down" errorCode="HTTP_503" />
  <bpmn:process id="HealthCheck" isExecutable="true">
    <bpmn:startEvent id="S"><bpmn:outgoing>f1</bpmn:outgoing></bpmn:startEvent>
    <bpmn:serviceTask id="Check"><bpmn:extensionElements><camunda:connector><camunda:connectorId>shop/health</camunda:connectorId>
      <camunda:inputOutput><camunda:outputParameter name="health">\${output}</camunda:outputParameter></camunda:inputOutput>
    </camunda:connector></bpmn:extensionElements><bpmn:incoming>f1</bpmn:incoming><bpmn:outgoing>f2</bpmn:outgoing></bpmn:serviceTask>
    <bpmn:boundaryEvent id="IsDown" attachedToRef="Check"><bpmn:outgoing>f3</bpmn:outgoing><bpmn:errorEventDefinition errorRef="Down" /></bpmn:boundaryEvent>
    <bpmn:endEvent id="E"><bpmn:incoming>f2</bpmn:incoming></bpmn:endEvent>
    <bpmn:endEvent id="Failed"><bpmn:incoming>f3</bpmn:incoming></bpmn:endEvent>
    <bpmn:sequenceFlow id="f1" sourceRef="S" targetRef="Check" />
    <bpmn:sequenceFlow id="f2" sourceRef="Check" targetRef="E" />
    <bpmn:sequenceFlow id="f3" sourceRef="IsDown" targetRef="Failed" />
  </bpmn:process>
</bpmn:definitions>`);
  const { server } = await makeServer({ dir, store: new SavingStore(), extra: { connectors: { retryDelay: 1 } } });
  await server.connectors.install();
  await server.connectors.add({ id: 'shop', source: `${base}/openapi.yaml` });
  const { instance } = await server.engine.start('health-check', {});
  assert.equal(instance.status, 'end');
  assert.deepEqual(instance.data.health, { ok: true });
  assert.deepEqual(instance.items.find(i => i.elementId === 'Check').output, { ok: true }, 'the output is the answer, nothing set inside it');
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

test('a connector kept whole in the database before 3.7 (packed or not) is written out to its file; its key and test stay', async () => {
  const { server, store, dir } = await makeServer();
  await server.connectors.install();
  const document = parseDocument(SHOP);
  await store.insert('bpmn_test', 'wf_connectors', [
    { id: 'old', name: 'Old', baseUrl: base + '/api', enabled: true, groups: [], operations: { health: true },
      openapi: { version: '3.1.0', fetchedAt: '2026-11-01T00:00:00.000Z', document }, createdAt: 'x', updatedAt: 'x' },
    { id: 'packed', name: 'Packed', baseUrl: base + '/api', enabled: true, groups: [], operations: { health: true },
      openapi: { version: '3.1.0', fetchedAt: '2026-11-01T00:00:00.000Z', packed: zlib.gzipSync(JSON.stringify(document)).toString('base64'), bytes: 1 },
      auth: { type: 'bearer', scheme: 'bearerAuth', secret: 'v1:kept', last4: 'abcd', setAt: 'y' },
      test: { at: 'z', operation: 'health', ok: true, status: 200 }, createdAt: 'x', updatedAt: 'x' }]);
  assert.deepEqual((await server.connectors.list()).map(c => c.id), ['old', 'packed']);
  for (const id of ['old', 'packed']) {
    const file = JSON.parse(fs.readFileSync(path.join(dir, 'connectors', `${id}.connector.json`), 'utf8'));
    assert.equal(file.openapi.document.info.title, 'Shop', `${id}: its document in its file`);
    assert.equal(file.openapi.packed, undefined);
  }
  const [packed] = await store.find('bpmn_test', 'wf_connectors', { id: 'packed' });
  assert.deepEqual({ ...packed, _id: undefined }, { _id: undefined, id: 'packed', key: { secret: 'v1:kept', last4: 'abcd', setAt: 'y', setBy: undefined }, test: { at: 'z', operation: 'health', ok: true, status: 200 } }, 'the collection keeps the key and the test only');
  const file = JSON.parse(fs.readFileSync(path.join(dir, 'connectors', 'packed.connector.json'), 'utf8'));
  assert.deepEqual(file.auth, { type: 'bearer', scheme: 'bearerAuth' }, 'the scheme in the file, not the key');
  assert.equal((await server.connectors.get('packed')).auth.last4, 'abcd', 'the key still this server\'s');
  assert.ok((await server.connectors.operations('old')).some(op => op.operationId === 'getCustomer'));
  assert.equal((await server.connectors.call('old/health')).status, 200);
  await server.shutdown();
});

test('a connector is its file: copied into another server\'s models folder, that server has it; its key is that server\'s to set', async () => {
  const { server, dir } = await shopServer();
  const other = await makeServer({ extra: { connectors: { retryDelay: 1 } } });
  fs.mkdirSync(path.join(other.dir, 'connectors'));
  fs.copyFileSync(path.join(dir, 'connectors', 'shop.connector.json'), path.join(other.dir, 'connectors', 'shop.connector.json'));
  const copied = await other.server.connectors.get('shop');
  assert.equal(copied.baseUrl, `${base}/api`);
  assert.equal(copied.auth.last4, undefined, 'no key came with the file');
  assert.equal((await other.server.connectors.call('shop/health')).status, 200, 'an operation that needs no key works at once');
  await other.server.connectors.setKey('shop', TOKEN);
  assert.equal((await other.server.connectors.call('shop/getCustomer', { id: 'C-1' })).output.tier, 'gold');
  assert.equal(await other.server.connectors.remove('shop'), true);
  assert.equal(fs.existsSync(path.join(other.dir, 'connectors', 'shop.connector.json')), false, 'removed: its file goes');
  await server.shutdown();
  await other.server.shutdown();
});

test('a connector file beside the models (where 3.7 wrote them at first) moves into the connectors folder; one there already wins', async () => {
  const { server, dir } = await shopServer();
  const other = await makeServer({ extra: { connectors: { retryDelay: 1 } } });
  const shop = fs.readFileSync(path.join(dir, 'connectors', 'shop.connector.json'), 'utf8');
  fs.writeFileSync(path.join(other.dir, 'shop.connector.json'), shop);
  assert.equal((await other.server.connectors.get('shop'))?.id, 'shop', 'found at its first read');
  assert.ok(fs.existsSync(path.join(other.dir, 'connectors', 'shop.connector.json')), 'moved into connectors/');
  assert.equal(fs.existsSync(path.join(other.dir, 'shop.connector.json')), false, 'not left beside the models');

  fs.writeFileSync(path.join(other.dir, 'shop.connector.json'), shop.replace(`${base}/api`, 'http://elsewhere'));
  assert.equal((await other.server.connectors.list()).find(c => c.id === 'shop').baseUrl, `${base}/api`, 'the one in connectors/ is the connector');
  assert.ok(fs.existsSync(path.join(other.dir, 'shop.connector.json')), 'the other left where it is, for a person to look at');
  assert.equal(await other.server.connectors.remove('shop'), true);
  assert.equal(fs.existsSync(path.join(other.dir, 'shop.connector.json')), false, 'removing it removes both');
  await server.shutdown();
  await other.server.shutdown();
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
  assert.match(JSON.stringify(demo.instance.decisions ?? demo.instance.logs), /connectors do not run on this server/);

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

// ---- how a key is sent, and what comes back

const keyed = {
  openapi: '3.0.3', info: { title: 'Keyed' },
  components: { securitySchemes: {
    header: { type: 'apiKey', in: 'header', name: 'X-Key' },
    query: { type: 'apiKey', in: 'query', name: 'key' },
    cookie: { type: 'apiKey', in: 'cookie', name: 'key' },
    basic: { type: 'http', scheme: 'basic' },
    oauth: { type: 'oauth2', flows: {} },
  } },
  paths: {
    '/show': { get: { operationId: 'show', parameters: [
      { name: 'tag', in: 'query', schema: { type: 'array' } },
      { name: 'filter', in: 'query', schema: { type: 'object' } },
      { name: 'session', in: 'cookie', schema: { type: 'string' } },
    ], responses: { 200: { description: 'ok' } } } },
    '/empty': { get: { operationId: 'empty', responses: { 204: { description: 'nothing' } } } },
    '/text': { get: { operationId: 'text', responses: { 200: { description: 'text' } } } },
    '/broken': { get: { operationId: 'broken', responses: { 200: { description: 'not quite JSON' } } } },
    '/huge': { get: { operationId: 'huge', responses: { 200: { description: 'more than it should' } } } },
    '/chunked': { get: { operationId: 'chunked', responses: { 200: { description: 'more than it said' } } } },
    '/submit': { post: { operationId: 'submit', requestBody: { content: { 'application/json': { schema: { type: 'object', properties: { a: { type: 'string' } } } } } }, responses: { 200: { description: 'ok' } } } },
  },
};
const echo = http.createServer((req, res) => {
  const url = new URL(req.url, 'http://x');
  if (url.pathname === '/empty') { res.writeHead(204); return res.end(); }
  if (url.pathname === '/text') { res.writeHead(200, { 'Content-Type': 'text/plain' }); return res.end('plain words'); }
  if (url.pathname === '/broken') { res.writeHead(200, { 'Content-Type': 'application/json' }); return res.end('{ not json'); }
  if (url.pathname === '/huge') { res.writeHead(200, { 'Content-Length': 200 }); return res.end('x'.repeat(200)); }
  if (url.pathname === '/chunked') { res.writeHead(200); return res.end('x'.repeat(200)); }
  if (url.pathname === '/notfound') { res.writeHead(500); return res.end(); }
  let body = '';
  req.on('data', chunk => body += chunk);
  req.on('end', () => {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ query: Object.fromEntries(url.searchParams), all: url.searchParams.getAll('tag'), key: req.headers['x-key'], cookie: req.headers.cookie, authorization: req.headers.authorization, body }));
  });
});
let echoBase;
test.before(async () => {
  await new Promise(resolve => echo.listen(0, '127.0.0.1', resolve));
  echoBase = `http://127.0.0.1:${echo.address().port}`;
});
test.after(() => echo.close());

async function keyedServer(document = keyed, extra = {}) {
  const made = await makeServer({ extra: { connectors: { retryDelay: 1, ...extra } } });
  await made.server.connectors.install();
  await made.server.connectors.add({ id: 'keyed', document, baseUrl: echoBase });
  return made;
}

test('a key goes where its scheme says: a header, the query (hidden in the log), a cookie, basic', async () => {
  const { server } = await keyedServer();
  const { connectors } = server;

  assert.equal((await connectors.setKey('keyed', 'k-header', 'header')).auth.name, 'X-Key');
  assert.equal((await connectors.call('keyed/show')).output.key, 'k-header');

  await connectors.setKey('keyed', 'k-query', 'query');
  const queried = await connectors.call('keyed/show');
  assert.equal(queried.output.query.key, 'k-query');
  assert.ok(!queried.url.includes('k-query'), 'the key is not in the URL logged');
  assert.match(queried.url, /key=\*\*\*/);

  await connectors.setKey('keyed', 'k-cookie', 'cookie');
  const cookied = await connectors.call('keyed/show', { session: 'a b' });
  assert.equal(cookied.output.cookie, 'session=a%20b; key=k-cookie', 'a cookie parameter and the key');

  await connectors.setKey('keyed', 'sam:secret', 'basic');
  assert.equal((await connectors.call('keyed/show')).output.authorization, `Basic ${Buffer.from('sam:secret').toString('base64')}`);

  await connectors.setKey('keyed', 'given', { type: 'apiKey', name: 'X-Key' });
  assert.equal((await connectors.get('keyed')).auth.in, 'header', 'in a header unless told');
  assert.equal((await connectors.call('keyed/show')).output.key, 'given');

  assert.equal((await connectors.clearKey('keyed')).auth, undefined);
  assert.equal((await connectors.call('keyed/show')).output.key, undefined, 'no key: no authorization');
  await server.shutdown();
});

test('a key that can not be sent is refused, saying why', async () => {
  const { server } = await keyedServer();
  const { connectors } = server;
  await assert.rejects(connectors.setKey('nope', 'k'), /No connector 'nope'/);
  await assert.rejects(connectors.setKey('keyed', ''), /The key is empty/);
  await assert.rejects(connectors.setKey('keyed', 'k', { type: 'magic' }), /Unknown authorization type 'magic'/);
  await assert.rejects(connectors.setKey('keyed', 'k', { type: 'apiKey' }), /An apiKey needs the name/);
  await assert.rejects(connectors.setKey('keyed', 'k', { type: 'apiKey', name: 'x', in: 'body' }), /An apiKey needs the name/);
  await assert.rejects(connectors.setKey('keyed', 'k', 'nope'), /no security scheme 'nope'/);
  await assert.rejects(connectors.setKey('keyed', 'k'), /Name the security scheme: header, query, cookie, basic/);
  await assert.rejects(connectors.setKey('keyed', 'k', 'oauth'), /The security scheme 'oauth' \(oauth2\) is not supported yet/);
  await assert.rejects(connectors.setKey('keyed', 'no-colon', { type: 'basic' }), /A basic key is user:password/);
  await assert.rejects(connectors.clearKey('nope'), /No connector 'nope'/);
  await server.shutdown();

  const { components, ...noSchemes } = keyed;
  const plain = await keyedServer(noSchemes);
  await assert.rejects(plain.server.connectors.setKey('keyed', 'k'), /no security scheme this server can send/);
  assert.equal((await plain.server.connectors.setKey('keyed', 'k', { type: 'bearer' })).auth.type, 'bearer');
  await plain.server.shutdown();
});

test('answers: nothing, text, what only looks like JSON, and what is too big', async () => {
  const { server } = await keyedServer(keyed, { maxResponseBytes: 100 });
  const { connectors } = server;
  assert.equal((await connectors.call('keyed/empty')).output, undefined);
  assert.equal((await connectors.call('keyed/text')).output, 'plain words');
  assert.equal((await connectors.call('keyed/broken')).output, '{ not json');
  await assert.rejects(connectors.call('keyed/huge'), /keyed\/huge: the answer is 200 bytes, more than 100/);
  await assert.rejects(connectors.call('keyed/chunked'), /keyed\/chunked: the answer is 200 bytes, more than 100/);
  await server.shutdown();
});

test('requests: lists and objects in the query, a body as text or as fields', async () => {
  const { server } = await keyedServer();
  const { connectors } = server;
  const { output } = await connectors.call('keyed/show', { tag: ['a', 'b'], filter: { x: 1 } });
  assert.deepEqual(output.all, ['a', 'b']);
  assert.equal(output.query.filter, '{"x":1}');
  assert.equal((await connectors.call('keyed/submit', { body: 'as it is' })).output.body, 'as it is');
  assert.equal((await connectors.call('keyed/submit', { 'body.a': 'field' })).output.body, '{"a":"field"}');
  assert.equal((await connectors.call('keyed/submit', { body: { a: 'whole' }, 'body.b': 'more' })).output.body, '{"a":"whole","b":"more"}');
  await server.shutdown();
});

test('when the server can not be reached: retried when safe, then the reason; a call given up is not retried', async () => {
  const closed = http.createServer();
  await new Promise(resolve => closed.listen(0, '127.0.0.1', resolve));
  const gone = `http://127.0.0.1:${closed.address().port}`;
  await new Promise(resolve => closed.close(resolve));

  const { server } = await makeServer({ extra: { connectors: { retryDelay: 1, retries: 1 } } });
  const { connectors } = server;
  await connectors.install();
  await connectors.add({ id: 'gone', document: keyed, baseUrl: gone });
  await assert.rejects(connectors.call('gone/show'), /gone\/show: /);

  const given = new AbortController();
  given.abort();
  await assert.rejects(connectors.call('gone/show', {}, { signal: given.signal }), /gone\/show: /);

  const tested = await connectors.test('gone', 'show');
  assert.equal(tested.ok, false, 'a test that fails is kept, not thrown');
  assert.equal((await connectors.get('gone')).test.ok, false);
  await assert.rejects(connectors.test('gone', 'nope'), /No operation 'nope'/);

  await connectors.add({ id: 'unnamed', document: { ...keyed, paths: { '/show': { get: { operationId: 'show', parameters: [{ name: 'q', in: 'query', required: true }] } } } }, baseUrl: gone });
  await assert.rejects(connectors.test('unnamed'), /Name an operation to test with/);
  await server.shutdown();
});

test('what can not be added: no document, one that can not be fetched, no operations, no server', async () => {
  const { server } = await keyedServer();
  const { connectors } = server;
  await assert.rejects(connectors.add({ id: 'a' }), /Give the OpenAPI document, or its URL/);
  await assert.rejects(connectors.add({ id: 'a', source: 'http://127.0.0.1:1/doc' }), /could not be fetched from/);
  await assert.rejects(connectors.add({ id: 'a', source: `${echoBase}/notfound` }), /could not be fetched from .*HTTP 500/);
  await assert.rejects(connectors.add({ id: 'a', document: { openapi: '3.0.0', paths: { '/x': { get: {} } } }, baseUrl: echoBase }), /no operation with an operationId/);
  await assert.rejects(connectors.add({ id: 'a', document: keyed }), /Give the base URL/);
  await assert.rejects(connectors.add({ id: 'a', document: keyed, baseUrl: 'http://[bad' }), /is not a URL/);
  await assert.rejects(connectors.add({}), /can not be a connector id/);
  assert.equal((await connectors.add({ id: 'named', document: { ...keyed, info: {} }, baseUrl: echoBase })).name, 'named', 'no title: named by its id');
  assert.equal((await connectors.add({ id: 'off', document: keyed, baseUrl: echoBase, operations: { show: false } })).operations.show, false);
  await assert.rejects(connectors.refresh('nope'), /No connector 'nope'/);
  await server.shutdown();
});

test('OpenAPI documents: what is refused, references with siblings, in a loop and along a chain', () => {
  assert.throws(() => parseDocument('7'), /is not an object/);
  assert.throws(() => parseDocument({ openapi: '2.0' }), /Not an OpenAPI 3\.0 or 3\.1 document/);
  assert.throws(() => parseDocument({ info: {} }), /Not an OpenAPI 3\.0 or 3\.1 document \(openapi: undefined\)/);
  assert.throws(() => parseDocument({ openapi: '3.0.0' }), /has no paths/);

  const document = {
    openapi: '3.1.0',
    components: { schemas: {
      node: { type: 'object', properties: { next: { $ref: '#/components/schemas/node' } } },
      alias: { $ref: '#/components/schemas/base' },
      base: { type: 'string' },
      loopA: { $ref: '#/components/schemas/loopB' },
      loopB: { $ref: '#/components/schemas/loopA' },
    } },
    paths: { '/x': { description: 'not an operation', parameters: [null], get: { operationId: 'x',
      requestBody: { content: { 'text/plain+json': { schema: { $ref: '#/components/schemas/base', description: 'with a sibling' } } } },
      responses: { 200: { description: 'ok', content: { 'text/plain': {} } } } } }, '/skip': 'nothing here' },
  };
  const resolved = resolveRefs(document);
  assert.equal(resolved.components.schemas.node.properties.next.properties.next.type, 'object', 'a schema that contains itself');
  assert.equal(resolved.components.schemas.alias.type, 'string', 'along a chain');
  assert.equal(resolved.components.schemas.loopA, undefined, 'a chain that loops ends as undefined');
  assert.throws(() => resolveRefs({ a: { $ref: '#/nothing/here' } }), /refers to #\/nothing\/here, which it does not have/);
  assert.throws(() => resolveRefs({ a: { $ref: 'other.yaml#/x' } }), /refers to another file/);

  const { operations } = listOperations(document);
  const x = operations.get('x');
  assert.equal(x.body.contentType, 'text/plain+json', 'any type naming json');
  assert.equal(x.body.schema.description, 'with a sibling');
  assert.equal(x.body.schema.type, 'string');
});

test('a launched server (the host): the scheme into the file, the key and the test by engine calls (engine-isolation.md)', async () => {
  const { server, store, dir } = await makeServer({ launched: true, extra: { connectors: { retryDelay: 1 } } });
  await server.connectors.add({ id: 'shop', source: `${base}/openapi.yaml` });
  assert.equal((await server.engine.facts()).connectorKeys, true, 'the engine says a key can be set (its CONNECTORS_KEY)');
  await server.connectors.setScheme('shop');
  assert.deepEqual(JSON.parse(fs.readFileSync(path.join(dir, 'connectors', 'shop.connector.json'), 'utf8')).auth, { type: 'bearer', scheme: 'bearerAuth' });
  assert.equal((await store.find('bpmn_test', 'wf_connectors', { id: 'shop' })).length, 0, 'the scheme is the file\'s: nothing kept yet');
  const set = await server.engine.setConnectorKey('shop', TOKEN, 'admin');
  assert.equal(set.auth.last4, '1234');
  assert.equal(set.auth.secret, undefined, 'the engine answers without the key');
  assert.equal((await server.engine.call('start', 'customer-lookup', { customerId: 'C-1' })).instance.data.tier, 'gold', 'a call with the key');
  const tested = await server.engine.testConnector('shop', 'health');
  assert.equal(tested.ok, true);
  assert.equal((await server.connectors.get('shop')).test.ok, true, 'the test kept with this server');
  await server.engine.clearConnectorKey('shop');
  assert.equal((await server.connectors.get('shop')).auth.last4, undefined);
  await server.shutdown();
});
