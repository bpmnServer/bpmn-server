// @features: api-v3
// API v3's contract: its OpenAPI document (routes/api/openapi-v3.ts) needs no credential, and names every route the
// v3 router has, and no other; each operation has an id and an error answer in v3's shape.
import test from 'node:test';
import assert from 'node:assert/strict';
import { startWebApp, why, WebClient } from '../support/webApp.mjs';

let web;
test.before(async () => { web = await startWebApp(); });
test.after(async () => { await web?.stop(); setImmediate(() => process.exit(0)); });

/** The v3 router's routes, as "METHOD /path/{param}". */
async function routes() {
  const { v3Router } = await import('bpmn-web/dist/routes/api/v3.js').catch(() => import('../../../../packages/bpmn-web/dist/routes/api/v3.js'));
  const router = v3Router(web.bpmnServer);
  return router.stack.filter(layer => layer.route && layer.route.path !== '/openapi.json')
    .flatMap(layer => Object.keys(layer.route.methods).map(method => `${method.toUpperCase()} ${layer.route.path.replace(/:(\w+)/g, '{$1}')}`))
    .sort();
}

test('the document needs no credential, and has the address the client used', async () => {
  const res = await new WebClient(web.base).get('/api/v3/openapi.json');
  assert.equal(res.status, 200, why(res));
  assert.equal(res.body.openapi, '3.1.0');
  assert.equal(res.body.servers[0].url, `${web.base}/api/v3`);
});

test('every v3 route is in the document, and every path in it is a route', async () => {
  const doc = (await new WebClient(web.base).get('/api/v3/openapi.json')).body;
  const documented = Object.entries(doc.paths).flatMap(([path, ops]) => Object.keys(ops).map(method => `${method.toUpperCase()} ${path}`)).sort();
  assert.deepEqual(documented, await routes());
});

test('each operation has an id, a summary, and errors in v3\'s shape', async () => {
  const doc = (await new WebClient(web.base).get('/api/v3/openapi.json')).body;
  const ids = new Set();
  for (const [path, ops] of Object.entries(doc.paths))
    for (const [method, op] of Object.entries(ops)) {
      const where = `${method} ${path}`;
      assert.ok(op.operationId && !ids.has(op.operationId), `${where}: a unique operationId`);
      ids.add(op.operationId);
      assert.ok(op.summary, `${where}: a summary`);
      assert.equal(op.responses['401']?.content['application/json'].schema.$ref, '#/components/schemas/Error', `${where}: 401 as an Error`);
    }
});
