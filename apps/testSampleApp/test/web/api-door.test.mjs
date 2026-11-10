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

// ---- /api and /api2 are frozen (docs/design/api-v3.md): their answers and documents say so

test('/api and /api2 answer as deprecated, naming the API as their successor; the API does not', async () => {
  for (const url of ['/api/status', '/api2/status']) {
    const res = await web.api('GET', url);
    assert.equal(res.status, 200, url);
    assert.equal(res.headers.get('deprecation'), 'true', url);
    assert.match(res.headers.get('link') ?? '', /\/api\/v3\/openapi\.json>; rel="successor-version"/, url);
  }
  const v3 = await web.api('GET', '/api/v3/me');
  assert.equal(v3.status, 200);
  assert.equal(v3.headers.get('deprecation'), null);
});

test('/api has an OpenAPI document of its routes, each deprecated; /api2\'s is marked too', async () => {
  const v1 = await web.client().get('/api/openapi.json');
  assert.equal(v1.status, 200, why(v1));
  assert.match(v1.body.info.title, /deprecated/);
  assert.equal(v1.body.servers[0].url, `${web.base}/api`);
  assert.ok(v1.body.paths['/engine/start/{name}']?.post?.deprecated, 'its routes, as they are');
  assert.ok(Object.values(v1.body.paths).every(ops => Object.values(ops).every(op => op.deprecated)));
  const v2 = await web.client().get('/api2/openapi.json');
  assert.match(v2.body.info.title, /deprecated/);
  assert.ok(Object.values(v2.body.paths).every(ops => Object.values(ops).every(op => op.deprecated)));
});
