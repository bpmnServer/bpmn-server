import test from 'node:test';
import assert from 'node:assert/strict';
import { Common } from './dist/routes/common.js';
import { configuredApiUser } from './dist/routes/middleware/apiKeyAuth.js';
import User from './dist/userAccess/models/User.js';
import { isSafeModelName, modelNameGuard } from './dist/routes/middleware/modelName.js';

function gateRequest(user, authenticated = true) {
  const state = { next: false, status: 200 };
  const req = { user, isAuthenticated: () => authenticated };
  const res = {
    redirect: () => { state.status = 302; },
    status: code => { state.status = code; return res; },
    send: () => res,
  };
  return { req, res, state, next: () => { state.next = true; } };
}

test('UI authentication fails closed and administrator gate uses persisted groups', () => {
  const previous = process.env.REQUIRE_AUTHENTICATION;
  delete process.env.REQUIRE_AUTHENTICATION;
  try {
    const common = new Common({});
    const missing = gateRequest(undefined);
    common.isAuthenticated(missing.req, missing.res, missing.next);
    assert.equal(missing.state.status, 302);
    assert.equal(missing.state.next, false);

    const staff = gateRequest({ userGroups: ['staff'] });
    common.isAuthenticated(staff.req, staff.res, staff.next);
    common.isAdmin(staff.req, staff.res, staff.next);
    assert.equal(staff.state.status, 403);

    const admin = gateRequest({ userGroups: ['ADMIN'] });
    common.isAuthenticated(admin.req, admin.res, admin.next);
    common.isAdmin(admin.req, admin.res, admin.next);
    assert.equal(admin.state.next, true);
  } finally {
    if (previous === undefined) delete process.env.REQUIRE_AUTHENTICATION;
    else process.env.REQUIRE_AUTHENTICATION = previous;
  }
});

test('API2 ignores body user/group claims and uses its configured service identity', () => {
  const keys = ['API_SERVICE_USER_NAME', 'API_SERVICE_USER_GROUPS', 'API_SERVICE_TENANT_ID'];
  const previous = keys.map(key => process.env[key]);
  try {
    process.env.API_SERVICE_USER_NAME = 'integration';
    process.env.API_SERVICE_USER_GROUPS = 'staff';
    process.env.API_SERVICE_TENANT_ID = 'tenant-a';
    const user = configuredApiUser();
    assert.equal(user.userName, 'integration');
    assert.deepEqual(user.userGroups, ['staff']);
    assert.equal(user.tenantId, 'tenant-a');
    assert.equal(user.isSystem(), false);
    delete process.env.API_SERVICE_USER_NAME;
    assert.throws(() => configuredApiUser(), /not configured/);
  } finally {
    keys.forEach((key, i) => {
      if (previous[i] === undefined) delete process.env[key];
      else process.env[key] = previous[i];
    });
  }
});

test('stored ADMIN group drives the user admin indicator', () => {
  assert.equal(new User({ userGroups: ['staff'] }).isAdmin, false);
  assert.equal(new User({ userGroups: ['ADMIN'] }).isAdmin, true);
});

test('model name guard rejects traversal in request names', () => {
  assert.equal(isSafeModelName('Buy Used Car'), true);
  assert.equal(isSafeModelName('../app'), false);
  assert.equal(isSafeModelName('..\\app'), false);
  const state = { status: 200, next: false };
  const res = { status(code) { state.status = code; return this; }, send() {} };
  modelNameGuard({ params: {}, body: { processId: '../../app' } }, res, () => { state.next = true; });
  assert.equal(state.status, 400);
  assert.equal(state.next, false);
});
