// @features: web-security
// API_RATE_LIMIT: calls a minute from one address to the APIs; over it, 429 with RATE_LIMITED. Unset, no limit
// (every other test file runs without it). The Fable Review, M6.
import test from 'node:test';
import assert from 'node:assert/strict';
import { startWebApp, why } from '../support/webApp.mjs';

let web;
test.before(async () => { web = await startWebApp({ env: { API_RATE_LIMIT: '3' } }); });
test.after(async () => { await web?.stop(); setImmediate(() => process.exit(0)); });

test('the fourth call in a minute is refused, on every API', async () => {
  for (let i = 0; i < 3; i++) {
    const res = await web.api('GET', '/api/v3/me');
    assert.equal(res.status, 200, why(res));
  }
  const over = await web.api('GET', '/api/v3/me');
  assert.equal(over.status, 429);
  assert.equal(over.body.error.code, 'RATE_LIMITED');
  assert.ok(over.headers.get('ratelimit') || over.headers.get('ratelimit-reset') || over.headers.get('retry-after'), 'says when to try again');
  assert.equal((await web.api('GET', '/api2/status')).status, 429, 'the same count for /api2');
});

test('the pages are not counted', async () => {
  assert.equal((await web.client().get('/login')).status, 200);
});
