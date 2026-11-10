// @features: rest-api
// Unit tests for the /api|/api2 API-key middleware. No DB or server required.
//   node --test apikey-auth.test.mjs
import test from 'node:test';
import assert from 'node:assert/strict';
import { apiKeyAuth, timingSafeEqualStr } from '../../../packages/bpmn-web/dist/routes/middleware/apiKeyAuth.js';
import { issueAiKey, aiKeyHolder, aiKeyTtlMs, revokeAiKeys } from '../../../packages/bpmn-web/dist/routes/aiAccess.js';

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

test('a person\'s AI key stands for them, works on /api2 only, and expires', () => {
  process.env.API_KEY = KEY;
  process.env.ADMIN_API_KEY = 'admin-key-456';
  delete process.env.AI_KEY_TTL_GROUPS;
  const now = Date.now();
  const issued = issueAiKey({ userName: 'designer', userGroups: ['DESIGNER'] }, now);
  assert.match(issued.key, /^ai_/);
  assert.equal(aiKeyHolder(issued.key, now).userName, 'designer');
  assert.deepEqual(aiKeyHolder(issued.key, now).groups, ['DESIGNER']);
  assert.equal(aiKeyHolder(issued.key, now + issued.ttlMs), undefined, 'expired');

  const fresh = issueAiKey({ userName: 'designer', userGroups: ['DESIGNER'] });
  const api2 = mockReqRes({ 'x-api-key': fresh.key }, {}, '/api2/models');
  apiKeyAuth(api2.req, api2.res, api2.next);
  assert.equal(api2.state.nextCalled, true);
  assert.equal(api2.req.aiKeyHolder.userName, 'designer');

  for (const url of ['/api/status', '/admin/api2/model/list']) {
    const other = mockReqRes({ 'x-api-key': fresh.key }, {}, url);
    apiKeyAuth(other.req, other.res, other.next);
    assert.equal(other.state.statusCode, 401, url);
  }
});

test('revoking a person\'s keys stops them; other people\'s keys stay', () => {
  const mine = issueAiKey({ userName: 'ann', userGroups: [] });
  const theirs = issueAiKey({ userName: 'bob', userGroups: [] });
  assert.equal(revokeAiKeys('ann'), 1);
  assert.equal(aiKeyHolder(mine.key), undefined);
  assert.equal(aiKeyHolder(theirs.key).userName, 'bob');
});

test('AI key limits vary by group and the shortest matching limit wins', () => {
  process.env.AI_KEY_TTL_GROUPS = JSON.stringify({ employee: 45, manager: 20, AI: 60 });
  assert.equal(aiKeyTtlMs(['employee']), 45 * 60 * 1000);
  assert.equal(aiKeyTtlMs(['employee', 'manager']), 20 * 60 * 1000);
  assert.equal(aiKeyTtlMs(['unknown']), 30 * 60 * 1000);
  delete process.env.AI_KEY_TTL_GROUPS;
});
