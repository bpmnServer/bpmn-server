// Model administration over /admin/api2 and system operations, with a service account in the ADMIN and SYSTEM groups.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';
import { startWebApp, ADMIN_API_KEY, API_KEY, FIXTURES, WebClient } from '../support/webApp.mjs';

let web;
test.before(async () => { web = await startWebApp({ env: { API_SERVICE_USER_GROUPS: 'ADMIN,SYSTEM' } }); });
test.after(async () => { await web?.stop(); setImmediate(() => process.exit(0)); });

const admin = (method, url, body) => web.api(method, url, body, ADMIN_API_KEY);
const names = async () => JSON.stringify((await admin('GET', '/admin/api2/model/list')).body);

test('import, list, load, rename and delete a model', async () => {
  const source = fs.readFileSync(path.join(FIXTURES, 'leave-request.bpmn'), 'utf8');
  const imported = await new WebClient(web.base).request('POST', '/admin/api2/model/import/api-model', {
    headers: { 'x-api-key': ADMIN_API_KEY }, multipart: { file: { filename: 'api-model.bpmn', content: source, type: 'application/xml' } },
  });
  assert.equal(imported.status, 200, JSON.stringify(imported.body));
  assert.match(await names(), /api-model/);

  const loaded = await admin('GET', '/admin/api2/model/load/api-model');
  assert.equal(loaded.status, 200, JSON.stringify(loaded.body).slice(0, 200));
  assert.ok(loaded.body.elements.some(e => e.id === 'Submit'), 'the parsed definition');

  const renamed = await admin('POST', '/admin/api2/model/rename', { name: 'api-model', newName: 'api-model-2' });
  assert.equal(renamed.status, 200, JSON.stringify(renamed.body));
  assert.match(await names(), /api-model-2/);

  const deleted = await admin('POST', '/admin/api2/model/delete', { name: 'api-model-2' });
  assert.equal(deleted.status, 200, JSON.stringify(deleted.body));
  assert.doesNotMatch(await names(), /api-model/);
});

test('the runtime key does not reach model administration', async () => {
  assert.equal((await web.api('GET', '/admin/api2/model/list', undefined, API_KEY)).status, 401);
});

test('an administrator service account may delete instances', async () => {
  await web.api('POST', '/api2/engine/start', { name: 'leave-request', data: { marker: 'delete-me' } });
  const res = await web.api('DELETE', '/api2/data/deleteInstances', { query: { 'data.marker': 'delete-me' } });
  assert.equal(res.status, 200, JSON.stringify(res.body));
  assert.equal((await web.bpmnServer.dataStore.findInstances({ 'data.marker': 'delete-me' }, 'summary')).length, 0);
});

/** GET with a JSON body, as bpmn-client sends it (fetch can not). */
function getWithBody(url, body) {
  return new Promise((resolve, reject) => {
    const payload = JSON.stringify(body);
    const headers = { 'x-api-key': API_KEY, 'content-type': 'application/json', 'content-length': Buffer.byteLength(payload) };
    const req = http.request(web.base + url, { method: 'GET', headers }, res => {
      let text = '';
      res.on('data', c => { text += c; });
      res.on('end', () => {
        let parsed = text;
        try { parsed = JSON.parse(text); } catch { /* not JSON */ }
        resolve({ status: res.statusCode, body: parsed });
      });
    });
    req.on('error', reject);
    req.end(payload);
  });
}

test('raw datastore queries page through instances', async () => {
  await web.api('POST', '/api2/engine/start', { name: 'leave-request', data: {} });
  await web.api('POST', '/api2/engine/start', { name: 'leave-request', data: {} });
  const first = await getWithBody('/api2/datastore/find', { filter: { name: 'leave-request' }, limit: 1 });
  assert.equal(first.status, 200);
  assert.equal(first.body.data.length, 1);
  const second = await getWithBody('/api2/datastore/find', { filter: { name: 'leave-request' }, limit: 1, after: first.body.nextCursor });
  assert.notEqual(second.body.data[0]._id, first.body.data[0]._id);
});

test('a failing raw query answers { errors } rather than null', async () => {
  const res = await getWithBody('/api2/datastore/find', { after: 'not-a-cursor' });
  assert.notEqual(res.body, null);
  assert.equal(typeof res.body.errors, 'string', JSON.stringify(res.body));
});

test('a raw query without a body answers the first page', async () => {
  const res = await web.api('GET', '/api2/datastore/find');
  assert.equal(res.status, 200, JSON.stringify(res.body).slice(0, 200));
  assert.ok(Array.isArray(res.body.data));
});

