// Unit tests for the /api|/api2 API-key middleware. No DB or server required.
//   node --test apikey-auth.test.mjs
import test from 'node:test';
import assert from 'node:assert/strict';
import { apiKeyAuth, timingSafeEqualStr } from './dist/routes/middleware/apiKeyAuth.js';

function mockReqRes(headers = {}, query = {}, originalUrl = '/api/status') {
  const state = { statusCode: 200, body: undefined, nextCalled: false };
  const req = { header: (n) => headers[n.toLowerCase()], query, originalUrl };
  const res = {
    status(code) { state.statusCode = code; return this; },
    json(payload) { state.body = payload; return this; },
  };
  const next = () => { state.nextCalled = true; };
  return { req, res, next, state };
}

const KEY = 'test-key-123';

test('valid x-api-key header calls next()', () => {
  process.env.API_KEY = KEY;
  const { req, res, next, state } = mockReqRes({ 'x-api-key': KEY });
  apiKeyAuth(req, res, next);
  assert.equal(state.nextCalled, true);
});

test('wrong key is rejected with 401', () => {
  process.env.API_KEY = KEY;
  const { req, res, next, state } = mockReqRes({ 'x-api-key': 'wrong' });
  apiKeyAuth(req, res, next);
  assert.equal(state.nextCalled, false);
  assert.equal(state.statusCode, 401);
});

test('missing key is rejected with 401', () => {
  process.env.API_KEY = KEY;
  const { req, res, next, state } = mockReqRes({});
  apiKeyAuth(req, res, next);
  assert.equal(state.statusCode, 401);
});

test('query-param apiKey is ignored (header only)', () => {
  process.env.API_KEY = KEY;
  const { req, res, next, state } = mockReqRes({}, { apiKey: KEY });
  apiKeyAuth(req, res, next);
  assert.equal(state.nextCalled, false);
  assert.equal(state.statusCode, 401);
});

test('fails CLOSED (500) when server API_KEY is unset', () => {
  delete process.env.API_KEY;
  const { req, res, next, state } = mockReqRes({ 'x-api-key': '' });
  apiKeyAuth(req, res, next);
  assert.equal(state.nextCalled, false);
  assert.equal(state.statusCode, 500);
});

test('admin routes require the separate ADMIN_API_KEY', () => {
  process.env.API_KEY = KEY;
  process.env.ADMIN_API_KEY = 'admin-key-456';

  const rejected = mockReqRes({ 'x-api-key': KEY }, {}, '/admin/api2/model/list');
  apiKeyAuth(rejected.req, rejected.res, rejected.next);
  assert.equal(rejected.state.nextCalled, false);
  assert.equal(rejected.state.statusCode, 401);

  const accepted = mockReqRes({ 'x-api-key': 'admin-key-456' }, {}, '/admin/api2/model/list');
  apiKeyAuth(accepted.req, accepted.res, accepted.next);
  assert.equal(accepted.state.nextCalled, true);
});

test('admin routes fail closed when ADMIN_API_KEY is unset', () => {
  delete process.env.ADMIN_API_KEY;
  const request = mockReqRes({ 'x-api-key': KEY }, {}, '/admin/api/definitions/list');
  apiKeyAuth(request.req, request.res, request.next);
  assert.equal(request.state.nextCalled, false);
  assert.equal(request.state.statusCode, 500);
});

test('timingSafeEqualStr matches equal and rejects unequal/different-length', () => {
  assert.equal(timingSafeEqualStr('abc', 'abc'), true);
  assert.equal(timingSafeEqualStr('abc', 'abd'), false);
  assert.equal(timingSafeEqualStr('abc', 'abcd'), false);
});
