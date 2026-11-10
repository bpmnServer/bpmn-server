// @features: roles
// DISABLE_ADMIN=true (a public demo): no administration pages or /admin APIs, for administrators too;
// everything else works as usual.
import test from 'node:test';
import assert from 'node:assert/strict';
import { startWebApp, why, ADMIN_API_KEY } from '../support/webApp.mjs';

let web, admin, designer;

test.before(async () => {
  web = await startWebApp({ env: { DISABLE_ADMIN: 'true' } });
  admin = await web.login('admin');
  designer = await web.login('designer');
});
test.after(async () => {
  delete process.env.DISABLE_ADMIN;
  await web?.stop();
  setImmediate(() => process.exit(0));
});

test('administration pages answer 404, for an administrator too', async () => {
  for (const url of ['/dashboard/admin', '/dashboard/admin/backup', '/admin', '/setUser?userName=staff']) {
    const res = await admin.get(url);
    assert.equal(res.status, 404, `${url}: ${why(res)}`);
  }
  const page = (await admin.get('/dashboard')).text;
  assert.doesNotMatch(page, /href="\/dashboard\/admin"/, 'no administration link');
});

test('administration actions are refused', async () => {
  const res = await admin.post('/dashboard/admin/restart', {});
  assert.notEqual(res.status, 200, why(res));
  assert.notEqual(res.status, 302, why(res));
});

test('the /admin REST APIs are not served, even with the admin key', async () => {
  const res = await web.api('GET', '/admin/api2/model/list', undefined, ADMIN_API_KEY);
  assert.equal(res.status, 404, why(res));
});

test('the models are still listed through the APIs, with the runtime key', async () => {
  for (const url of ['/api/definitions/list', '/api2/model/list']) {
    const res = await web.api('GET', url);
    assert.equal(res.status, 200, `${url}: ${why(res)}`);
    assert.ok(Array.isArray(res.body) && res.body.length > 0, `${url}: ${JSON.stringify(res.body)}`);
  }
});

test('a model is still read through the API, with the runtime key', async () => {
  const res = await web.api('GET', '/api/definitions/load/leave-request');
  assert.equal(res.status, 200, why(res));
  assert.match(res.text ?? JSON.stringify(res.body), /id="Submit"/);
  assert.equal((await web.api('GET', '/api/definitions/load/no-such-model')).status, 404);
});

test('the rest of the app still works', async () => {
  assert.equal((await admin.get('/dashboard')).status, 200);
  assert.equal((await designer.get('/dashboard/design')).status, 200);
});
