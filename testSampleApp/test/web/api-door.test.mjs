// @features: api-v3
// The API's door (routes/api/door.ts): /api acts as its service account, and a user the caller names is ignored, with
// a Warning, unless API_IMPERSONATION=true (until 4.0); a server without a service account says which settings to set.
import test from 'node:test';
import assert from 'node:assert/strict';
import { startWebApp, why } from '../support/webApp.mjs';

let web;
test.before(async () => { web = await startWebApp(); });
test.after(async () => { await web?.stop(); setImmediate(() => process.exit(0)); });

const startedBy = instance => instance.items.find(item => item.elementId === 'Requested')?.userName;

test('/api acts as its service account: a named user is ignored, and the answer says so', async () => {
  const res = await web.api('POST', '/api/engine/start/leave-request', { data: {}, userName: 'mary' });
  assert.equal(res.status, 200, why(res));
  assert.equal(startedBy(res.body), 'api-service');
  assert.match(res.headers.get('warning') ?? '', /userName is ignored.*API_IMPERSONATION/);

  const plain = await web.api('POST', '/api/engine/start/leave-request', { data: {} });
  assert.equal(startedBy(plain.body), 'api-service');
  assert.equal(plain.headers.get('warning'), null, 'no warning when no user is named');
});

test('API_IMPERSONATION=true: /api acts as the user the caller names, as before 3.7', async () => {
  process.env.API_IMPERSONATION = 'true';
  try {
    const res = await web.api('POST', '/api/engine/start/leave-request', { data: {}, options: { userName: 'mary' } });
    assert.equal(res.status, 200, why(res));
    assert.equal(startedBy(res.body), 'mary');
    assert.equal(res.headers.get('warning'), null);
  }
  finally { delete process.env.API_IMPERSONATION; }
});

test('/api2 never acts as a named user, whatever API_IMPERSONATION says', async () => {
  process.env.API_IMPERSONATION = 'true';
  try {
    const res = await web.api('POST', '/api2/engine/start/leave-request', { data: {}, userName: 'mary' });
    assert.equal(res.status, 200, why(res));
    assert.equal(startedBy(res.body), 'api-service');
  }
  finally { delete process.env.API_IMPERSONATION; }
});

test('no service account: /api and /api2 say which settings to set', async () => {
  const saved = process.env.API_SERVICE_USER_NAME;
  delete process.env.API_SERVICE_USER_NAME;
  try {
    for (const url of ['/api/status', '/api2/status']) {
      const res = await web.api('GET', url);
      assert.equal(res.status, 500, url);
      assert.match(res.body.errors, /API_SERVICE_USER_NAME and API_SERVICE_USER_GROUPS/, url);
    }
  }
  finally { process.env.API_SERVICE_USER_NAME = saved; }
});
