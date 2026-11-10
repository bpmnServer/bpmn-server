// @features: rest-api
// Unit tests for the /api|/api2 API-key middleware. No DB or server required.
//   node --test apikey-auth.test.mjs
import test from 'node:test';
import assert from 'node:assert/strict';
import { apiKeyAuth, timingSafeEqualStr } from '../../../packages/bpmn-web/dist/routes/middleware/apiKeyAuth.js';
import { levelsFor, offeredLevels, linkMinutes } from '../../../packages/bpmn-web/dist/routes/aiAccess.js';

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

// a person's AI link is an API token with a level (routes/aiAccess.ts); its calls are tested in test/web/ai-key.test.mjs
test("an AI link is never an /api or /api2 key: x-api-key takes the site's key only", () => {
  process.env.API_KEY = KEY;
  const res = mockReqRes({ 'x-api-key': 'bpt_a-link-key' }, {}, '/api2/models');
  apiKeyAuth(res.req, res.res, res.next);
  assert.equal(res.state.statusCode, 401);
});

test('a person is offered the levels their rights allow, as far as AI_ACCESS goes', () => {
  const env = { AI_ACCESS: process.env.AI_ACCESS, DISABLE_DESIGN: process.env.DISABLE_DESIGN, DISABLE_ADMIN: process.env.DISABLE_ADMIN, REQUIRE_AUTHENTICATION: process.env.REQUIRE_AUTHENTICATION };
  try {
    for (const k of Object.keys(env)) delete process.env[k];
    assert.deepEqual(levelsFor({ userName: 'sam', userGroups: ['staff'] }), ['work']);
    assert.deepEqual(levelsFor({ userName: 'dee', userGroups: ['DESIGNER'] }), ['work', 'design']);
    assert.deepEqual(levelsFor({ userName: 'ann', userGroups: ['ADMIN'] }), ['work', 'design', 'administer']);
    process.env.AI_ACCESS = 'work, design';
    assert.deepEqual(offeredLevels(), ['work', 'design']);
    assert.deepEqual(levelsFor({ userName: 'ann', userGroups: ['ADMIN'] }), ['work', 'design']);
    process.env.AI_ACCESS = 'off';
    assert.deepEqual(levelsFor({ userName: 'ann', userGroups: ['ADMIN'] }), []);
  }
  finally {
    for (const [k, v] of Object.entries(env)) if (v === undefined) delete process.env[k]; else process.env[k] = v;
  }
});

test('how long a link lasts: by group, the shortest matching; an administer link 10 minutes at most', () => {
  process.env.AI_KEY_TTL_GROUPS = JSON.stringify({ employee: 45, manager: 20, ADMIN: 60 });
  try {
    assert.equal(linkMinutes(['employee']), 45);
    assert.equal(linkMinutes(['employee', 'manager']), 20);
    assert.equal(linkMinutes(['unknown']), 30);
    assert.equal(linkMinutes(['ADMIN'], 'design'), 60);
    assert.equal(linkMinutes(['ADMIN'], 'administer'), 10);
  }
  finally { delete process.env.AI_KEY_TTL_GROUPS; }
});
