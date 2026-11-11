// @features: api-v3
// A server's own API settings (start({ hostSettings }), runtime/hostSettings.ts): its keys and service account come
// from the server, not from process.env at request time, so a workspace's server (3.8) can have its own
// (docs/design/multi-app-tenants.md §8.2). The default reads .env's values when asked, as before.
import test from 'node:test';
import assert from 'node:assert/strict';
import { startWebApp, why, WebClient, API_KEY } from '../support/webApp.mjs';

const OWN_KEY = 'this-servers-own-key';
let web;
test.before(async () => {
  web = await startWebApp({
    hostSettings: () => ({
      apiKey: OWN_KEY,
      adminApiKey: 'this-servers-admin-key',
      impersonation: false,
      serviceAccount: { userName: 'workspace-service', groups: ['staff'] },
    }),
  });
});
test.after(async () => { await web?.stop(); setImmediate(() => process.exit(0)); });

const call = (url, key) => new WebClient(web.base).get(url, { headers: { 'x-api-key': key } });

test('the server\'s own key opens the API; .env\'s API_KEY does not', async () => {
  const own = await call('/api/v3/me', OWN_KEY);
  assert.equal(own.status, 200, why(own));
  assert.equal(own.body.userName, 'workspace-service', 'the server\'s own service account');
  assert.deepEqual(own.body.groups, ['staff']);
  assert.equal((await call('/api/v3/me', API_KEY)).status, 401, '.env\'s key is not this server\'s');
});

test('the older APIs and the administration APIs take the server\'s keys too', async () => {
  assert.equal((await call('/api2/status', OWN_KEY)).status, 200);
  assert.equal((await call('/api2/status', API_KEY)).status, 401);
  assert.equal((await call('/admin/api2/status', 'this-servers-admin-key')).status !== 401, true);
});
