import test from 'node:test';
import assert from 'node:assert/strict';
import { describeError, errorDetailsHandler, redactSecrets } from './dist/routes/middleware/errorDetails.js';

function fakeResponse() {
  const res = { statusCode: 200, body: undefined, contentType: undefined, headersSent: false };
  res.status = code => { res.statusCode = code; return res; };
  res.json = body => { res.body = body; return res; };
  res.type = t => { res.contentType = t; return res; };
  res.send = body => { res.body = body; return res; };
  return res;
}

test('redacts credentials, tokens and sensitive key/value pairs', () => {
  const text = redactSecrets('connect mongodb://admin:hunter22@db:27017 failed; password=abc123 ' +
    'Authorization: Bearer abc.def.ghi apiKey: "k-123456" token eyJhbGciOi.eyJzdWIiOi.sig');
  for (const secret of ['hunter22', 'abc123', 'abc.def.ghi', 'k-123456', 'eyJhbGciOi'])
    assert.ok(!text.includes(secret), `${secret} leaked: ${text}`);
  assert.match(text, /mongodb:\/\/\[redacted\]@db:27017/);
});

test('redacts values of sensitive environment variables', () => {
  process.env.TEST_SESSION_SECRET = 'super-sekrit-value';
  try {
    assert.equal(redactSecrets('bad key super-sekrit-value'), 'bad key [redacted]');
  } finally {
    delete process.env.TEST_SESSION_SECRET;
  }
});

test('describes the error without the stack or query string', () => {
  const err = Object.assign(new TypeError('cannot read x'), { code: 'E_X' });
  const details = describeError(err, { method: 'GET', originalUrl: '/model/list?token=abc' });
  assert.equal(details.status, 500);
  assert.equal(details.error, 'TypeError');
  assert.equal(details.message, 'cannot read x');
  assert.equal(details.code, 'E_X');
  assert.equal(details.path, '/model/list');
  assert.ok(details.reference);
  assert.ok(!JSON.stringify(details).includes('at '), 'no stack frames');
});

test('keeps client error statuses and answers API requests with JSON', () => {
  const res = fakeResponse();
  const err = Object.assign(new Error('request entity too large'), { status: 413 });
  const errorLog = console.error; console.error = () => {};
  try {
    errorDetailsHandler(err, { method: 'POST', originalUrl: '/api/engine/start', accepts: () => 'html' }, res, () => {});
  } finally { console.error = errorLog; }
  assert.equal(res.statusCode, 413);
  assert.equal(res.body.message, 'request entity too large');
});

test('renders escaped HTML for browser requests', () => {
  const res = fakeResponse();
  const errorLog = console.error; console.error = () => {};
  try {
    errorDetailsHandler(new Error('<script>x</script>'), { method: 'GET', originalUrl: '/workflow', accepts: () => 'html' }, res, () => {});
  } finally { console.error = errorLog; }
  assert.equal(res.statusCode, 500);
  assert.equal(res.contentType, 'html');
  assert.ok(res.body.includes('&lt;script&gt;'));
  assert.ok(!res.body.includes('<script>x'));
});

test('keeps a status the middleware already set on the response', () => {
  const res = fakeResponse();
  res.statusCode = 403;
  const errorLog = console.error; console.error = () => {};
  try {
    errorDetailsHandler(new Error('CSRF token mismatch'), { method: 'POST', originalUrl: '/resetData', accepts: () => 'html' }, res, () => {});
  } finally { console.error = errorLog; }
  assert.equal(res.statusCode, 403);
  assert.ok(res.body.includes('CSRF token mismatch'));
});

