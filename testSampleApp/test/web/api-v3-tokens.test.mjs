// @features: api-v3
// API v3's door and its user tokens (routes/api/door.ts, routes/api/tokens.ts): an application's back end asks with the
// service key for a token for one of its users; each call with the token acts as that user. Tokens expire, are
// revoked, are kept hashed, and can not make an administrator.
import test from 'node:test';
import assert from 'node:assert/strict';
import { startWebApp, why, WebClient, API_KEY } from '../support/webApp.mjs';

let web;
test.before(async () => { web = await startWebApp(); });
test.after(async () => { await web?.stop(); setImmediate(() => process.exit(0)); });

const v3 = (method, url, { token, key, body } = {}) => new WebClient(web.base).request(method, '/api/v3' + url, {
  json: body,
  headers: { ...(token ? { authorization: `Bearer ${token}` } : {}), ...(key ? { 'x-api-key': key } : {}) },
});
const service = (method, url, body) => v3(method, url, { key: API_KEY, body });
async function tokenFor(userName, groups = [], minutes) {
  const res = await service('POST', '/tokens', { userName, groups, ...(minutes ? { minutes } : {}) });
  assert.equal(res.status, 201, why(res));
  return res.body.token;
}

test('no credential, a wrong key, or an unknown token: 401', async () => {
  assert.equal((await v3('GET', '/me')).body.error.code, 'UNAUTHORIZED');
  assert.equal((await v3('GET', '/me', { key: 'wrong' })).status, 401);
  const unknown = await v3('GET', '/me', { token: 'bpt_unknown' });
  assert.equal(unknown.status, 401);
  assert.equal(unknown.body.error.code, 'TOKEN_INVALID');
});

test('the service key acts as the service account', async () => {
  const me = await service('GET', '/me');
  assert.equal(me.status, 200, why(me));
  assert.equal(me.body.userName, 'api-service');
  assert.equal(me.body.credential, 'service');
});

test('a token acts as its user, with their groups', async () => {
  const issued = await service('POST', '/tokens', { userName: 'mary', groups: ['staff'] });
  assert.equal(issued.status, 201, why(issued));
  assert.match(issued.body.token, /^bpt_[\w-]{40,}$/);
  assert.ok(Date.parse(issued.body.expiresAt) > Date.now() + 14 * 60_000, 'fifteen minutes by default');
  const me = await v3('GET', '/me', { token: issued.body.token });
  assert.equal(me.status, 200, why(me));
  assert.deepEqual([me.body.userName, me.body.groups, me.body.credential], ['mary', ['staff'], 'token']);
  assert.deepEqual(me.body.may, { start: true, design: false, administer: false });
});

test('only the service key issues and revokes tokens', async () => {
  const token = await tokenFor('mary', ['staff']);
  assert.equal((await v3('POST', '/tokens', { token, body: { userName: 'boss', groups: ['manager'] } })).body.error.code, 'SERVICE_KEY_REQUIRED');
  assert.equal((await v3('DELETE', '/tokens?userName=mary', { token })).status, 403);
});

test('a token can not make an administrator, and its input is checked', async () => {
  for (const group of ['ADMIN', 'SYSTEM', 'designer']) {
    const res = await service('POST', '/tokens', { userName: 'eve', groups: [group] });
    assert.equal(res.status, 403, group);
    assert.equal(res.body.error.code, 'GROUP_REFUSED');
  }
  assert.equal((await service('POST', '/tokens', { groups: [] })).body.error.code, 'BAD_USER');
  assert.equal((await service('POST', '/tokens', { userName: 'x', groups: 'staff' })).body.error.code, 'BAD_GROUPS');
  for (const minutes of [0, -1, 100000, 'soon'])
    assert.equal((await service('POST', '/tokens', { userName: 'x', minutes })).body.error.code, 'BAD_MINUTES', String(minutes));
});

test('revoking a user\'s tokens stops them at once; other users\' stay', async () => {
  const mine = await tokenFor('rob', ['staff']);
  const again = await tokenFor('rob', ['staff']);
  const theirs = await tokenFor('sue', ['staff']);
  const res = await service('DELETE', '/tokens?userName=rob');
  assert.deepEqual(res.body, { revoked: 2 });
  assert.equal((await v3('GET', '/me', { token: mine })).status, 401);
  assert.equal((await v3('GET', '/me', { token: again })).status, 401);
  assert.equal((await v3('GET', '/me', { token: theirs })).status, 200);
});

test('a token expires', async () => {
  const token = await tokenFor('tim', ['staff'], 0.002);  // about 120 ms
  assert.equal((await v3('GET', '/me', { token })).status, 200);
  await new Promise(resolve => setTimeout(resolve, 200));
  assert.equal((await v3('GET', '/me', { token })).status, 401);
});

test('the store keeps a token\'s hash, never the token', async () => {
  const token = await tokenFor('ida', ['staff']);
  const server = web.bpmnServer;
  const store = server.documentStore ?? server.dataStore.db;
  const db = (server.configuration.database?.MongoDB ?? { db: 'bpmn' }).db;
  const [kept] = await store.find(db, 'wf_tokens', { userName: 'ida' });
  assert.ok(kept, 'kept');
  assert.equal(kept.token, undefined);
  assert.ok(!JSON.stringify(kept).includes(token.slice(4)), 'no part of the token');
  assert.match(kept.hash, /^[0-9a-f]{64}$/);
});

test('v3 answers its unknown routes itself, and /api still works beside it', async () => {
  const res = await service('GET', '/nothing');
  assert.equal(res.status, 404);
  assert.equal(res.body.error.code, 'NO_ROUTE');
  assert.equal((await web.api('GET', '/api/status')).status, 200);
});
