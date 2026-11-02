// GUEST_ACCESS=true (a public demo): a visitor without a session becomes a guest with models of its own (a copy
// of the application's), test runs of its own, and nothing of anyone else's.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { startWebApp, why, FIXTURES } from '../support/webApp.mjs';

const GUESTS = fs.mkdtempSync(path.join(os.tmpdir(), 'bpmn-guests-'));
const DEMO = { GUEST_ACCESS: 'true', DEMO_MODE: 'true', DISABLE_ADMIN: 'true', GUESTS_PATH: GUESTS, GUEST_RATE_LIMIT: '1000' };
let web, a, b;

/** A new visitor: its first page makes it a guest. */
async function visitor() {
  const client = web.client();
  const res = await client.follow('/dashboard');
  assert.equal(res.status, 200, why(res));
  return client;
}
const source = (name) => fs.readFileSync(path.join(FIXTURES, `${name}.bpmn`), 'utf8');
const SVG = '<svg xmlns="http://www.w3.org/2000/svg"/>';

test.before(async () => {
  web = await startWebApp({ env: DEMO });
  a = await visitor();
  b = await visitor();
});
test.after(async () => {
  for (const key of Object.keys(DEMO)) delete process.env[key];
  await web?.stop();
  fs.rmSync(GUESTS, { recursive: true, force: true });
  setImmediate(() => process.exit(0));
});

test('each visitor is a guest of its own, with a copy of the models', async () => {
  const folders = fs.readdirSync(GUESTS);
  assert.equal(folders.length, 2, folders.join(', '));
  for (const folder of folders) {
    assert.match(folder, /^guest-[0-9a-f]{12}$/);
    assert.ok(fs.existsSync(path.join(GUESTS, folder, 'leave-request.bpmn')));
  }
  const list = await a.get('/model/list');
  assert.equal(list.status, 200, why(list));
  assert.match(list.text, /leave-request/);
});

test("a guest's changes are its own: other guests and the application's models are unchanged", async () => {
  const changed = source('leave-request').replace(/name="([^"]*)"/, 'name="$1 (guest A)"');
  const save = await a.request('POST', '/model/edit/leave-request', { json: { processId: 'leave-request', bpmn: changed, svg: SVG } });
  assert.ok(save.status < 400, why(save));
  assert.match((await a.get('/model/download/leave-request.bpmn')).text, /\(guest A\)/);
  assert.doesNotMatch((await b.get('/model/download/leave-request.bpmn')).text, /\(guest A\)/);
  assert.doesNotMatch(fs.readFileSync(path.join(web.definitionsPath, 'leave-request.bpmn'), 'utf8'), /\(guest A\)/);

  const created = await a.request('POST', '/model/edit/a-only', { json: { processId: 'a-only', bpmn: source('simple'), svg: SVG } });
  assert.ok(created.status < 400, why(created));
  assert.match((await a.get('/model/list')).text, /a-only/);
  assert.doesNotMatch((await b.get('/model/list')).text, /a-only/);
  assert.equal(fs.existsSync(path.join(web.definitionsPath, 'a-only.bpmn')), false);
});

test("a guest's test runs are its own, in its tenant", async () => {
  const started = await a.request('POST', '/model/test/start', { json: { processName: 'simple', data: { x: 1 } } });
  assert.equal(started.status, 200, why(started));
  const id = started.body.instance.id;
  assert.equal((await a.get(`/model/test/instance/${id}`)).status, 200);
  assert.equal((await b.get(`/model/test/instance/${id}`)).status, 404, "another guest's test instance is not found");
  assert.equal((await b.request('DELETE', `/model/test/instance/${id}`)).status, 404);
  const stored = await web.bpmnServer.dataStore.findInstance({ id }, 'summary');
  assert.match(stored.tenantId, /^guest-/);
});

test('a guest downloads its models as a .zip', async () => {
  const res = await a.get('/model/download-all');
  assert.equal(res.status, 200, why(res));
  assert.match(res.headers.get('content-type'), /zip/);
  assert.ok(res.text.startsWith('PK'));
  assert.ok(res.text.includes('a-only.bpmn'));
});

test('a guest has no administration and no other way in', async () => {
  assert.equal((await a.get('/dashboard/admin')).status, 404);
  const anonymous = await web.client().request('POST', '/model/edit/x', { json: { processId: 'x', bpmn: source('simple') } });
  assert.notEqual(anonymous.status, 200, 'a POST without a session does not make a guest');
});

test('guest access does not start without the demo settings', async () => {
  const { checkGuestSettings } = await import('../../../packages/bpmn-web/dist/guests/guests.js');
  const saved = process.env.DEMO_MODE;
  process.env.DEMO_MODE = 'false';
  try {
    assert.throws(() => checkGuestSettings(), /GUEST_ACCESS=true needs DEMO_MODE=true/);
  } finally {
    process.env.DEMO_MODE = saved;
  }
});
