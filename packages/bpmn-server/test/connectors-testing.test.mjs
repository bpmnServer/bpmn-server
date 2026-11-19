// @features: connector-testing
// A connector outside production (Connectors.ts, ConnectorTesting; docs/docs/connectors.md#outside-production): where
// APP_ENV is development or test, it answers as its `testing` says: the real API, its document's examples (nothing
// called), or a sandbox of the API. Production, or a server that doesn't say, always calls the real API.
import test from 'node:test';
import assert from 'node:assert/strict';
import http from 'node:http';
import { makeServer } from './helpers.mjs';
import { exampleOf } from '../dist/index.js';

process.env.CONNECTORS_KEY = 'a test encryption key';
const DOC = base => ({
  openapi: '3.0.3', info: { title: 'Staff', version: '1' }, servers: [{ url: base }],
  paths: {
    '/staff/{id}': { get: {
      operationId: 'getEmployee', parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
      responses: { 200: { description: 'One', content: { 'application/json': { example: { id: 'E-0', name: 'From the document' } } } } },
    } },
    '/staff': { get: {
      operationId: 'listEmployees',
      responses: { 200: { description: 'All', content: { 'application/json': { schema: { type: 'array', items: { type: 'object', properties: { id: { type: 'string', example: 'E-9' }, active: { type: 'boolean' }, since: { type: 'string', format: 'date' } } } } } } } },
    } },
  },
});

/** an API that counts its calls and answers who it is */
function api(who) {
  const calls = [];
  const server = http.createServer((req, res) => { calls.push(req.url); res.writeHead(200, { 'Content-Type': 'application/json' }); res.end(JSON.stringify({ from: who, url: req.url })); });
  return { server, calls, start: () => new Promise(resolve => server.listen(0, '127.0.0.1', () => resolve(`http://127.0.0.1:${server.address().port}`))) };
}
const real = api('real'), sandbox = api('sandbox');
let realBase, sandboxBase, connectors;
const setEnv = value => value === undefined ? delete process.env.APP_ENV : process.env.APP_ENV = value;

test.before(async () => {
  [realBase, sandboxBase] = await Promise.all([real.start(), sandbox.start()]);
  const { server } = await makeServer();
  connectors = server.connectors;
  await connectors.install();
  await connectors.add({ id: 'staff', document: DOC(realBase) });
});
test.after(() => { real.server.close(); sandbox.server.close(); setEnv(undefined); });

test('examples: in development, nothing called; the document\'s example, else one made from the schema; the connector\'s own answers first', async () => {
  setEnv('development');
  await connectors.update('staff', { testing: { answer: 'examples' } });
  const before = real.calls.length;
  const one = await connectors.call('staff/getEmployee', { id: 'E-1' });
  assert.deepEqual(one.output, { id: 'E-0', name: 'From the document' });
  assert.equal(one.url, 'example:staff/getEmployee');
  assert.deepEqual((await connectors.call('staff/listEmployees')).output, [{ id: 'E-9', active: false, since: '2026-01-01' }], 'made from the schema');
  assert.equal(real.calls.length, before, 'the real API not called');

  await connectors.update('staff', { testing: { answer: 'examples', answers: { getEmployee: { id: 'E-7', name: 'Ann' } } } });
  assert.deepEqual((await connectors.call('staff/getEmployee', { id: 'E-1' })).output, { id: 'E-7', name: 'Ann' });
});

test('sandbox: in test, the same call to the sandbox\'s address', async () => {
  setEnv('test');
  await connectors.update('staff', { testing: { answer: 'sandbox', baseUrl: sandboxBase } });
  const answer = await connectors.call('staff/getEmployee', { id: 'E-2' });
  assert.equal(answer.output.from, 'sandbox');
  assert.equal(answer.output.url, '/staff/E-2');
  await assert.rejects(connectors.update('staff', { testing: { answer: 'sandbox', baseUrl: 'ftp://x' } }), /http or https/);
  await assert.rejects(connectors.update('staff', { testing: { answer: 'maybe' } }), /real, examples or sandbox/);
});

test('production, or a server that doesn\'t say: always the real API, whatever the connector\'s testing', async () => {
  await connectors.update('staff', { testing: { answer: 'examples' } });
  for (const env of ['production', undefined]) {
    setEnv(env);
    assert.equal((await connectors.call('staff/getEmployee', { id: 'E-3' })).output.from, 'real', `APP_ENV ${env ?? 'not set'}`);
  }
  setEnv('development');
  await connectors.update('staff', { testing: null });
  assert.equal((await connectors.call('staff/getEmployee', { id: 'E-4' })).output.from, 'real', 'no testing: the real API');
  assert.equal((await connectors.get('staff')).testing, undefined);
});

test('a value made from a schema: an example, a default, an enum, a type', () => {
  assert.deepEqual(exampleOf({ type: 'object', properties: { a: { type: 'integer' }, b: { enum: ['x', 'y'] }, c: { type: 'string', default: 'd' }, d: { type: 'string', format: 'email' } } }),
    { a: 0, b: 'x', c: 'd', d: 'someone@example.com' });
  assert.deepEqual(exampleOf({ allOf: [{ properties: { a: { type: 'boolean' } } }, { properties: { b: { type: 'number' } } }] }), { a: false, b: 0 });
  assert.equal(exampleOf(undefined), null);
});

test('own answers by case: the first whose input matches, its status; a failing one fails as the API would; environments', async () => {
  setEnv('test');
  await connectors.update('staff', { testing: { answer: 'examples', environments: ['test'], answers: { getEmployee: { cases: [
    { when: { id: 'E-2' }, output: { id: 'E-2', name: 'James' } },
    { status: 404, output: { error: 'not found' } },
  ] } } } });
  assert.deepEqual((await connectors.call('staff/getEmployee', { id: 'E-2' })).output, { id: 'E-2', name: 'James' });
  await assert.rejects(connectors.call('staff/getEmployee', { id: 'E-9' }), err => err.status === 404 && err.name === 'ConnectorError' || /404/.test(err.message));
  // only in test: development calls the real API
  setEnv('development');
  assert.equal((await connectors.call('staff/getEmployee', { id: 'E-2' })).output.from, 'real');
  await assert.rejects(connectors.update('staff', { testing: { answer: 'examples', environments: ['production'] } }), /development, test, or both/);
  await connectors.update('staff', { testing: null });
});
