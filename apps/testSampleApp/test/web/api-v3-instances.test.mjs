// @features: api-v3
// API v3's instances (routes/api/instances.ts): a user sees the instances the engine's rules let them see, one with its items,
// and why it went the way it did (the Rationale by step); paged by an opaque cursor. Deleting is an administrator's,
// messages and signals the system's.
import test from 'node:test';
import assert from 'node:assert/strict';
import { BPMNAPI, SecureUser } from 'bpmn-server';
import { startWebApp, why, WebClient, API_KEY } from '../support/webApp.mjs';

let web, sam, olga, requestId;
const v3 = (method, url, token, body) => new WebClient(web.base).request(method, '/api/v3' + url, {
  json: body, headers: token === 'service' ? { 'x-api-key': API_KEY } : { authorization: `Bearer ${token}` },
});
async function tokenFor(userName, groups) {
  const res = await v3('POST', '/tokens', 'service', { userName, groups });
  assert.equal(res.status, 201, why(res));
  return res.body.token;
}
/** The service account in the SYSTEM group, for this call. */
async function asSystem(fn) {
  const groups = process.env.API_SERVICE_USER_GROUPS;
  process.env.API_SERVICE_USER_GROUPS = 'SYSTEM';
  try { return await fn(); } finally { process.env.API_SERVICE_USER_GROUPS = groups; }
}

test.before(async () => {
  web = await startWebApp();
  sam = await tokenFor('sam', ['staff']);
  olga = await tokenFor('olga', ['finance']);
  const started = await v3('POST', '/processes/leave-request/start', sam, {});
  requestId = started.body.instance.id;
  await v3('POST', `/tasks/${started.body.task.id}/complete`, sam, { data: { days: 6, reason: 'holiday' } });
});
test.after(async () => { await web?.stop(); setImmediate(() => process.exit(0)); });

test('one instance: its data and items; its Rationale, step by step', async () => {
  const one = await v3('GET', `/instances/${requestId}`, sam);
  assert.equal(one.status, 200, why(one));
  assert.equal(one.body.name, 'leave-request');
  assert.equal(one.body.data.days, 6);
  const byElement = Object.fromEntries(one.body.items.map(i => [i.elementId, i.status]));
  assert.equal(byElement.Submit, 'end');
  assert.equal(byElement.Approve, 'wait');

  const why_ = await v3('GET', `/instances/${requestId}/rationale`, sam);
  assert.equal(why_.status, 200, why(why_));
  assert.ok(Array.isArray(why_.body.steps) && why_.body.steps.length > 0, 'steps');
});

test("a user sees the instances the engine's rules let them see, no more; an unknown one is a 404", async () => {
  // the rules are BPMNAPI's (SecureUser.qualifyInstances): v3 lists what they give, for each user
  const api = new BPMNAPI(web.bpmnServer);
  for (const [token, userName, groups] of [[sam, 'sam', ['staff']], [olga, 'olga', ['finance']]]) {
    const listed = await v3('GET', '/instances?limit=200', token);
    assert.equal(listed.status, 200, why(listed));
    const allowed = (await api.data.findInstances({}, new SecureUser({ userName, userGroups: groups }, { enforceSecurity: true }), 'summary'))
      .filter(i => !String(i.id).startsWith('test-')).map(i => i.id).sort();
    assert.deepEqual(listed.body.items.map(i => i.id).sort(), allowed, userName);
  }
  assert.ok((await v3('GET', '/instances?limit=200', sam)).body.items.some(i => i.id === requestId), 'sam sees his request');
  const unknown = await v3('GET', '/instances/no-such-id', sam);
  assert.equal(unknown.status, 404);
  assert.equal(unknown.body.error.code, 'INSTANCE_NOT_FOUND');
  assert.equal((await v3('GET', '/instances/test-anything', sam)).status, 404, "never a test run's");
});

test('instances come a page at a time, newest first; next is absent on the last page', async () => {
  for (let i = 0; i < 3; i++) await v3('POST', '/processes/leave-request/start', sam, {});
  const seen = [];
  let cursor, last, pages = 0;
  do {
    last = await v3('GET', `/instances?name=leave-request&limit=2${cursor ? `&cursor=${cursor}` : ''}`, sam);
    assert.equal(last.status, 200, why(last));
    seen.push(...last.body.items.map(i => i.id));
    cursor = last.body.next;
    pages++;
  } while (cursor && pages < 100);
  assert.ok(seen.length >= 4 && pages >= 2);
  assert.equal(new Set(seen).size, seen.length, 'no instance twice');
  assert.ok(!('next' in last.body));
  assert.equal((await v3('GET', '/instances?limit=0', sam)).body.error.code, 'BAD_LIMIT');
});

test('deleting is an administrator\'s; messages and signals the system\'s', async () => {
  assert.equal((await v3('DELETE', `/instances/${requestId}`, sam)).body.error.code, 'ADMIN_REQUIRED');
  assert.equal((await v3('POST', '/messages/anything', sam, {})).body.error.code, 'SYSTEM_REQUIRED');
  assert.equal((await v3('POST', '/signals/anything', 'service', {})).body.error.code, 'SYSTEM_REQUIRED', 'the service account is not SYSTEM here');

  await asSystem(async () => {
    const message = await v3('POST', '/messages/nothing-waits-for-this', 'service', { data: {} });
    assert.equal(message.status, 200, why(message));
    assert.deepEqual(message.body, { instance: null });
    const deleted = await v3('DELETE', `/instances/${requestId}`, 'service');
    assert.deepEqual(deleted.body, { deleted: requestId });
    const after = await v3('GET', `/instances/${requestId}`, 'service');
    assert.equal(after.status, 404, JSON.stringify(after.body).slice(0, 600));
  });
});

test('a restart needs the item', async () => {
  const started = await v3('POST', '/processes/leave-request/start', sam, {});
  const res = await v3('POST', `/instances/${started.body.instance.id}/restart`, sam, {});
  assert.equal(res.status, 400);
  assert.equal(res.body.error.code, 'BAD_ITEM');
});
