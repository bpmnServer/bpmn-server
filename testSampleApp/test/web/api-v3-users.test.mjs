// @features: api-v3
// The API's users (routes/api/users.ts): an administrator's own token, or the service key, lists, adds, regroups,
// sets passwords and deletes users; changing a user's groups or deleting them ends their tokens. Staff are refused,
// and so is an AI link, whatever its level.
import test from 'node:test';
import assert from 'node:assert/strict';
import { startWebApp, why, WebClient, API_KEY } from '../support/webApp.mjs';

let web, Tokens, admin;
const v3 = (method, url, credential, body) => new WebClient(web.base).request(method, '/api/v3' + url, {
  json: body, headers: credential === 'service' ? { 'x-api-key': API_KEY } : { authorization: `Bearer ${credential}` },
});
const own = async (userName, groups, scope) => (await new Tokens(web.bpmnServer).issue({ userName, groups }, userName, { own: true, scope })).token;

test.before(async () => {
  web = await startWebApp({ env: { APP_ENV: 'production', API_TRACE: '' } });
  ({ Tokens } = await import('../../../packages/bpmn-web/dist/routes/api/tokens.js'));
  admin = await own('admin', ['ADMIN']);
});
test.after(async () => { await web?.stop(); setImmediate(() => process.exit(0)); });

test('an administrator adds a user, sets their groups and password; a name taken is refused', async () => {
  const added = await v3('POST', '/users', admin, { userName: 'newbie', email: 'newbie@example.com', password: 'a-password-1', groups: ['staff'] });
  assert.equal(added.status, 201, why(added));
  assert.deepEqual(added.body, { userName: 'newbie', email: 'newbie@example.com', groups: ['staff'] });
  assert.equal((await v3('POST', '/users', admin, { userName: 'NEWBIE', password: 'a-password-1' })).body.error.code, 'USER_EXISTS');
  assert.equal((await v3('POST', '/users', admin, { userName: 'x', password: 'short' })).status, 400);
  assert.ok((await v3('GET', '/users', admin)).body.items.some(u => u.userName === 'newbie'));

  const token = await own('newbie', ['staff']);
  assert.equal((await v3('GET', '/me', token)).status, 200);
  const regrouped = await v3('PUT', '/users/newbie/groups', admin, { groups: ['staff', 'manager'] });
  assert.deepEqual(regrouped.body.groups, ['staff', 'manager']);
  assert.equal((await v3('GET', '/me', token)).status, 401, 'their tokens end when their groups change');

  assert.equal((await v3('POST', '/users/newbie/password', admin, { password: 'another-password-2' })).body.passwordSet, true);
  const client = new WebClient(web.base);
  await client.get('/login');
  const login = await client.post('/login', { userName: 'newbie', password: 'another-password-2' });
  assert.equal(login.status, 302);
  assert.ok(!login.location.endsWith('/login'), 'signs in with the new password');
});

test('an administrator deletes a user, not themselves', async () => {
  await v3('POST', '/users', admin, { userName: 'leaver', password: 'a-password-1', groups: ['staff'] });
  assert.equal((await v3('DELETE', '/users/admin', admin)).body.error.code, 'SELF');
  assert.deepEqual((await v3('DELETE', '/users/leaver', admin)).body, { deleted: 'leaver' });
  assert.equal((await v3('DELETE', '/users/leaver', admin)).body.error.code, 'USER_NOT_FOUND');
});

test('staff are refused, and so is an AI link, whatever its level; the service key may', async () => {
  assert.equal((await v3('GET', '/users', await own('sam', ['staff']))).body.error.code, 'ADMIN_REQUIRED');
  const link = await own('admin', ['ADMIN'], 'administer');
  assert.equal((await v3('GET', '/users', link)).body.error.code, 'LEVEL_REFUSED');
  assert.equal((await v3('GET', '/users', 'service')).status, 200);
});
