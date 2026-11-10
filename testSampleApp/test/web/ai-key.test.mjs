// @features: ai-remote-development
// A person's link for their AI agent (/ai/key): an API token that acts as them, at the level they choose among those
// they have (work, design, administer); it reaches no more than its level, nor than its person; it goes when they
// revoke it or sign out; the page it opens tells the agent its level and rules; the request log never shows it.
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
test.before(async () => { web = await startWebApp({ env: { APP_ENV: 'production', API_TRACE: '', SESSION_SECRET: 'a-test-secret' } }); });
test.after(async () => { await web?.stop(); setImmediate(() => process.exit(0)); });

/** A link for this user at this level (or their default): its key, the level given, and the signed-in client. */
async function linkFor(userName, level) {
  const client = await web.login(userName);
  const res = await client.get(`/ai/key?format=json${level ? `&level=${level}` : ''}`);
  assert.equal(res.status, 200, why(res));
  const key = /\/ai\/(bpt_[\w-]+)$/.exec(res.body.url)?.[1];
  assert.ok(key, res.body.url);
  return { client, key, body: res.body };
}
const api = (key, method, url, body) => new WebClient(web.base).request(method, '/api/v3' + url, { json: body, headers: { authorization: `Bearer ${key}` } });

test('signed out, /ai/key goes to sign-in', async () => {
  const res = await new WebClient(web.base).get('/ai/key');
  assert.equal(res.status, 302);
  assert.match(res.location, /\/login$/);
});

test('each person is offered the levels their rights allow; a designer\'s default is design', async () => {
  assert.deepEqual((await linkFor('staff')).body.levels, ['work']);
  const designer = await linkFor('designer');
  assert.deepEqual([designer.body.levels, designer.body.level], [['work', 'design'], 'design']);
  assert.deepEqual((await linkFor('admin')).body.levels, ['work', 'design', 'administer']);
  assert.equal((await linkFor('staff', 'administer')).body.level, 'work', 'a level they do not have is not given');
  const page = await designer.client.get('/ai/key?level=work');
  assert.match(page.text, /A link for your AI agent/);
  assert.match(page.text, /href="\/ai\/key\?level=design"/);
  assert.match(page.text, /curl only, not a browser/);
});

test('a link reaches its level and no more', async () => {
  const work = await linkFor('designer', 'work');
  assert.equal((await api(work.key, 'GET', '/tasks')).status, 200);
  const refused = await api(work.key, 'PUT', '/models/ai-key-model', { source: XML });
  assert.equal(refused.status, 403, why(refused));
  assert.equal(refused.body.error.code, 'LEVEL_REFUSED');

  const design = await linkFor('designer', 'design');
  assert.equal((await api(design.key, 'PUT', '/models/ai-key-model', { source: XML })).status, 201);
  assert.equal((await api(design.key, 'GET', '/settings')).body.error.code, 'LEVEL_REFUSED');

  const admin = await linkFor('admin', 'administer');
  const settings = await api(admin.key, 'GET', '/settings');
  assert.equal(settings.status, 200, why(settings));
  const all = Object.values(settings.body.groups).flat();
  assert.equal(all.find(s => s.name === 'SESSION_SECRET').value, '***', 'a secret never shows');
  assert.equal(all.find(s => s.name === 'APP_ENV').value, 'production');
  assert.equal((await api(admin.key, 'POST', '/settings/checks/database')).body.ok, true);
  assert.equal((await api(admin.key, 'PUT', '/models/ai-key-model', { source: XML })).body.error.code, 'LEVEL_REFUSED');
});

test('a link is not a key of /api or /api2', async () => {
  const { key } = await linkFor('admin', 'design');
  for (const url of ['/api2/models', '/api/status'])
    assert.equal((await new WebClient(web.base).request('GET', url, { headers: { 'x-api-key': key } })).status, 401, url);
});

test('the page the agent opens: whom it acts as, its level, the rules, where to start', async () => {
  const { key } = await linkFor('designer', 'design');
  const res = await new WebClient(web.base).get(`/ai/${key}`);
  assert.equal(res.status, 200, why(res));
  assert.match(res.text, /You act as \*\*designer\*\* \(groups: DESIGNER\), at the \*\*design\*\* level/);
  assert.match(res.text, /Use curl only/);
  assert.match(res.text, /Authorization: Bearer bpt_/);
  assert.match(res.text, /\/api\/v3\/openapi\.json/);
  const unknown = await new WebClient(web.base).get('/ai/bpt_not-a-key');
  assert.equal(unknown.status, 401);
  assert.match(unknown.text, /This link no longer works/);
});

test('revoking stops the links, not the pages; signing out stops both', async () => {
  const mine = await linkFor('staff');
  const theirs = await linkFor('manager');
  await mine.client.get('/dashboard');      // the pages' own token, for staff
  const res = await mine.client.post('/ai/revoke', {});
  assert.equal(res.status, 302, why(res));
  assert.match(res.location, /\/ai\/key\?revoked=\d+$/);
  assert.equal((await api(mine.key, 'GET', '/me')).status, 401, 'revoked');
  assert.equal((await mine.client.get('/dashboard')).status, 200, 'the pages go on');
  assert.equal((await api(theirs.key, 'GET', '/me')).status, 200, 'another person\'s link stays');
  await theirs.client.get('/logout');
  assert.equal((await api(theirs.key, 'GET', '/me')).status, 401, 'signed out');
});

test('the request log never shows a key', async () => {
  const { key } = await linkFor('staff');
  const written = [];
  const write = process.stdout.write;
  process.stdout.write = function (chunk, ...rest) { written.push(String(chunk)); return write.call(this, chunk, ...rest); };
  try {
    await new WebClient(web.base).get(`/ai/${key}`);
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  finally { process.stdout.write = write; }
  const log = written.join('');
  assert.ok(!log.includes(key), 'the key is not in the log');
  assert.match(log, /\/ai\/bpt_\*\*\*/);
});
