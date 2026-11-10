// @features: ai-remote-development
// A person's link for their AI agent (/ai/key): it acts as them on /api2, with their groups and no more; it is refused
// on /api; it goes when they revoke it or sign out; the page it opens tells the agent its rules; the request log
// never shows it.
import test from 'node:test';
import assert from 'node:assert/strict';
import { startWebApp, why, WebClient } from '../support/webApp.mjs';

const XML = `<?xml version="1.0" encoding="UTF-8"?>
<bpmn:definitions xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" id="d" targetNamespace="urn:test">
  <bpmn:process id="AiKeyModel" isExecutable="true">
    <bpmn:startEvent id="Start" />
    <bpmn:endEvent id="End" />
    <bpmn:sequenceFlow id="f1" sourceRef="Start" targetRef="End" />
  </bpmn:process>
</bpmn:definitions>`;

let web;
test.before(async () => { web = await startWebApp({ env: { APP_ENV: 'production', API_TRACE: '' } }); });
test.after(async () => { await web?.stop(); setImmediate(() => process.exit(0)); });

/** A link for this user, signed in: its key, and the client they are signed in with. */
async function linkFor(userName) {
  const client = await web.login(userName);
  const res = await client.get('/ai/key?format=json');
  assert.equal(res.status, 200, why(res));
  const key = /\/ai\/(ai_[\w-]+)$/.exec(res.body.url)?.[1];
  assert.ok(key, res.body.url);
  return { client, key, body: res.body };
}
const withKey = (key, method, url, body) => web.api(method, url, body, key);

test('signed out, /ai/key goes to sign-in and comes back', async () => {
  const res = await new WebClient(web.base).get('/ai/key');
  assert.equal(res.status, 302);
  assert.match(res.location, /\/login$/);
});

test('the page shows the link, whom it acts as, and how to use it', async () => {
  const client = await web.login('designer');
  const res = await client.get('/ai/key');
  assert.equal(res.status, 200, why(res));
  assert.match(res.text, /A link for your AI agent/);
  assert.match(res.text, /\/ai\/ai_[\w-]+/);
  assert.match(res.text, /curl only, not a browser/);
});

test('the link acts as its person: a designer saves a model, staff may not', async () => {
  const designer = await linkFor('designer');
  assert.equal(designer.body.userName, 'designer');
  assert.deepEqual(designer.body.groups, ['DESIGNER']);
  const saved = await withKey(designer.key, 'PUT', '/api2/models/ai-key-model', { source: XML });
  assert.equal(saved.status, 201, why(saved));

  const staff = await linkFor('staff');
  assert.equal((await withKey(staff.key, 'GET', '/api2/models')).status, 200, 'staff may read');
  const refused = await withKey(staff.key, 'PUT', '/api2/models/ai-key-model', { source: XML });
  assert.equal(refused.status, 403, why(refused));
  assert.match(refused.body.error, /staff may not design models/);
});

test('the link works on /api2 only: /api and the administration API refuse it', async () => {
  const { key } = await linkFor('admin');
  assert.equal((await withKey(key, 'GET', '/api2/models')).status, 200);
  assert.equal((await withKey(key, 'GET', '/api/status')).status, 401);
  assert.equal((await withKey(key, 'GET', '/admin/api2/model/list')).status, 401);
});

test('the page the agent opens: whom it acts as, the rules, where to start', async () => {
  const { key } = await linkFor('designer');
  const res = await new WebClient(web.base).get(`/ai/${key}`);
  assert.equal(res.status, 200, why(res));
  assert.match(res.text, /You act as \*\*designer\*\* \(groups: DESIGNER\)/);
  assert.match(res.text, /Use curl only/);
  assert.match(res.text, /\/api2 only, never \/api/);
  assert.match(res.text, /\/llms\.txt/);
  const unknown = await new WebClient(web.base).get('/ai/ai_not-a-key');
  assert.equal(unknown.status, 401);
  assert.match(unknown.text, /This link no longer works/);
});

test('revoking and signing out stop the links', async () => {
  const revoked = await linkFor('staff');
  const other = await linkFor('manager');
  const res = await revoked.client.post('/ai/revoke', {});
  assert.equal(res.status, 302, why(res));
  assert.match(res.location, /\/ai\/key\?revoked=\d+$/);
  assert.equal((await withKey(revoked.key, 'GET', '/api2/models')).status, 401, 'revoked');
  assert.equal((await withKey(other.key, 'GET', '/api2/models')).status, 200, 'another person\'s link stays');

  await other.client.get('/logout');
  assert.equal((await withKey(other.key, 'GET', '/api2/models')).status, 401, 'signed out');
});

test('the request log never shows a key', async () => {
  const { key } = await linkFor('staff');
  const written = [];
  const write = process.stdout.write;
  process.stdout.write = function (chunk, ...rest) { written.push(String(chunk)); return write.call(this, chunk, ...rest); };
  try {
    await new WebClient(web.base).get(`/ai/${key}`);
    // morgan writes when the response has finished
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  finally { process.stdout.write = write; }
  const log = written.join('');
  assert.ok(!log.includes(key), 'the key is not in the log');
  assert.match(log, /\/ai\/ai_\*\*\*/);
});
