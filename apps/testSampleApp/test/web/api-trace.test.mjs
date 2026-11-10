// @features: ai-remote-development
// API_TRACE: each API call and its answer, one JSON line, to replay what a client (an AI agent) did; no secret in it.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { startWebApp, API_KEY } from '../support/webApp.mjs';

const TRACE = path.join(fs.mkdtempSync(path.join(os.tmpdir(), 'bpmn-trace-')), 'api-trace.jsonl');
let web;
test.before(async () => { web = await startWebApp({ env: { API_TRACE: TRACE } }); });
test.after(async () => { await web?.stop(); setImmediate(() => process.exit(0)); });

test('a call and its answer are traced, a password and the key are not', async () => {
  await web.api('POST', '/api2/models/no-such/verify', { source: '<not-bpmn/>', password: 'Secret-1' });
  await web.api('GET', '/api2/models/no-such');
  await new Promise(resolve => setTimeout(resolve, 300));     // appended when the answer is sent
  const lines = fs.readFileSync(TRACE, 'utf8').trim().split('\n').map(line => JSON.parse(line));
  const verify = lines.find(l => l.path === '/api2/models/no-such/verify');
  assert.equal(verify.method, 'POST');
  assert.equal(verify.status, 200);
  assert.equal(verify.credential, 'x-api-key');
  assert.match(verify.request, /<not-bpmn\/>/);
  assert.match(verify.request, /"password":"\*\*\*"/);
  assert.match(verify.response, /"valid":false/);
  assert.ok(typeof verify.ms === 'number' && verify.at);
  assert.equal(lines.find(l => l.path === '/api2/models/no-such').status, 404);
  const text = fs.readFileSync(TRACE, 'utf8');
  assert.ok(!text.includes('Secret-1') && !text.includes(API_KEY), 'no password, no key');
});
