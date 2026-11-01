// Authentication and authorization of the UI and the APIs, as they behave today.
import test from 'node:test';
import assert from 'node:assert/strict';
import { startWebApp, PASSWORD, ADMIN_API_KEY } from '../support/webApp.mjs';

let web;
test.before(async () => { web = await startWebApp(); });
test.after(async () => { await web?.stop(); setImmediate(() => process.exit(0)); });

test('UI pages redirect anonymous visitors to the login page', async () => {
  const anonymous = web.client();
  for (const url of ['/', '/tasks', '/instanceDetails?id=x', '/model/list', '/user', '/account']) {
    const res = await anonymous.get(url);
    assert.equal(res.status, 302, url);
    assert.match(res.location, /\/login$/, url);
  }
});

test('public account pages render', async () => {
  const anonymous = web.client();
  for (const url of ['/login', '/signup', '/forgot']) {
    const res = await anonymous.get(url);
    assert.equal(res.status, 200, url);
  }
  assert.match((await anonymous.get('/login')).text, /name=["']?userName/);
});

test('a wrong password does not log in', async () => {
  const client = web.client();
  await client.get('/login');
  const res = await client.post('/login', { userName: 'staff', password: 'wrong' });
  assert.equal(res.status, 302);
  assert.match(res.location, /\/login$/);
  assert.equal((await client.get('/')).status, 302, 'still anonymous');
});

test('users log in, see the workbench, and log out', async () => {
  const staff = await web.login('staff');
  const home = await staff.get('/');
  assert.equal(home.status, 200);
  assert.match(home.text, /Models/);
  const out = await staff.get('/logout');
  assert.equal(out.status, 302);
  assert.equal((await staff.get('/')).status, 302, 'logged out');
});

test('admin-only actions refuse regular users', async () => {
  const staff = await web.login('staff');
  assert.equal((await staff.get('/setUser')).status, 403);
  assert.equal((await staff.post('/resetData', {})).status, 403);
  assert.equal((await staff.post('/deleteInstance', { id: 'x' })).status, 403);
});

test('the admin user can reach admin actions', async () => {
  const admin = await web.login('admin');
  assert.equal((await admin.get('/setUser')).status, 200);
});

test('APIs require the API key', async () => {
  const none = await web.client().get('/api2/status');
  assert.equal(none.status, 401);
  const wrong = await web.api('GET', '/api2/status', undefined, 'not-the-key');
  assert.equal(wrong.status, 401);
  assert.equal((await web.api('GET', '/api2/status')).status, 200);
  assert.equal((await web.api('GET', '/api/status')).status, 200);
});

test('model administration over the API needs the admin key', async () => {
  assert.equal((await web.api('GET', '/admin/api2/model/list')).status, 401, 'runtime key is refused');
  const list = await web.api('GET', '/admin/api2/model/list', undefined, ADMIN_API_KEY);
  assert.equal(list.status, 200);
});

test('the runtime API does not expose model administration', async () => {
  const res = await web.api('POST', '/api2/model/delete', { name: 'leave-request' });
  assert.notEqual(res.status, 200);
});

test('unknown API paths answer 404 JSON', async () => {
  for (const [url, key] of [['/api2/no-such-route', undefined], ['/api/no/such', undefined], ['/admin/api2/nope', ADMIN_API_KEY]]) {
    const res = await web.api('GET', url, undefined, key);
    assert.equal(res.status, 404, url);
    assert.match(res.body.errors, /No API route/, url);
  }
  // without a key the key check answers first
  assert.equal((await web.client().get('/api2/no-such-route')).status, 401);
});

test('signup creates a user who can log in', async () => {
  const client = web.client();
  await client.get('/signup');
  const res = await client.post('/signup', { userName: 'newcomer', email: 'newcomer@test.local', password: PASSWORD, confirmPassword: PASSWORD });
  assert.equal(res.status, 302, res.text.slice(0, 200));
  const login = await web.login('newcomer');
  assert.equal((await login.get('/')).status, 200);
});

test('state-changing requests without the CSRF token are refused', async () => {
  const admin = await web.login('admin');
  admin.sendCsrf = false;
  for (const [url, form] of [['/resetData', {}], ['/model/rename', { processName: 'leave-request', newName: 'x' }], ['/account/profile', { email: 'a@b.c' }]]) {
    const res = await admin.post(url, form);
    assert.equal(res.status, 403, `${url}: ${res.status}`);
  }
  const names = (await web.bpmnServer.definitions.getList()).map(m => m.name ?? m);
  assert.ok(names.includes('leave-request'), 'nothing renamed');
});

test('a token from another session is refused', async () => {
  const admin = await web.login('admin');
  const other = await web.login('staff');
  admin.sendCsrf = false;
  const res = await admin.post('/resetData', { _csrf: decodeURIComponent(other.cookies.get('_csrf')) });
  assert.equal(res.status, 403);
});

test('the login form needs the token too', async () => {
  const client = web.client();
  await client.get('/login');
  client.sendCsrf = false;
  const res = await client.post('/login', { userName: 'staff', password: PASSWORD });
  assert.equal(res.status, 403);
});

test('pages carry the token for forms and scripts', async () => {
  const admin = await web.login('admin');
  const home = await admin.get('/');
  assert.match(home.text, /<meta name="csrf-token" content="[^"]+"/);
  assert.match(home.text, /\/javascripts\/csrf\.js/);
  const assign = await admin.get('/model/rename/leave-request');
  assert.match(assign.text, /name="_csrf" value="[^"]+"/);
});

test('API-key requests need no CSRF token', async () => {
  const res = await web.api('POST', '/api2/engine/start', { name: 'leave-request', data: {} });
  assert.equal(res.status, 200);
  assert.ok(res.body.id);
});
