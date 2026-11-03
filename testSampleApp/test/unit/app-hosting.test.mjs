// What an application hosting bpmn-web relies on: its own routes ahead of bpmn-web's, model design
// turned off in the pages (DISABLE_DESIGN), and no admin/admin user added to a database that has users.
import test from 'node:test';
import assert from 'node:assert/strict';

import { WebApp } from '../../../packages/bpmn-web/dist/app.js';
import { Common } from '../../../packages/bpmn-web/dist/routes/common.js';
import { canDesign, isDesignerGroups, isAdminGroups } from '../../../packages/bpmn-web/dist/userAccess/roles.js';
import { UserService } from '../../../packages/bpmn-web/dist/userAccess/UserService.js';
import User from '../../../packages/bpmn-web/dist/userAccess/models/User.js';
import { apiKeyAuth } from '../../../packages/bpmn-web/dist/index.js';
import { signupEnabled } from '../../../packages/bpmn-web/dist/userAccess/routes/account.js';

function withEnv(vars, fn) {
  const saved = Object.fromEntries(Object.keys(vars).map(k => [k, process.env[k]]));
  Object.assign(process.env, vars);
  const restore = () => { for (const [k, v] of Object.entries(saved)) if (v === undefined) delete process.env[k]; else process.env[k] = v; };
  try { const r = fn(); if (r?.then) return r.finally(restore); restore(); return r; }
  catch (e) { restore(); throw e; }
}

test('the application\'s routes are mounted before the APIs and the UI', () => {
  const mounted = [];
  const app = { use: (path) => mounted.push(Array.isArray(path) ? path.join(',') : String(path)) };
  const fake = { app, bpmnServer: {}, application: { api: true, ui: false, routes: (a) => a.use('/api/instance') } };
  withEnv({ DISABLE_ADMIN: 'false' }, () => WebApp.prototype.setupRoutes.call(fake));
  assert.equal(mounted[0], '/api/instance');
  assert.ok(mounted.indexOf('/api') > 0);
});

test('apiKeyAuth is exported for the application\'s own API routes', () => {
  assert.equal(typeof apiKeyAuth, 'function');
});

test('DISABLE_DESIGN: nobody designs in the pages, administrators and the no-sign-in mode included', () => {
  withEnv({ DISABLE_DESIGN: 'true', REQUIRE_AUTHENTICATION: 'false' }, () => {
    assert.equal(isDesignerGroups(['ADMIN']), false);
    assert.equal(canDesign({ userGroups: ['DESIGNER'] }), false);
    assert.equal(isAdminGroups(['ADMIN']), true, 'administration stays on');
    let status;
    new Common({}).isDesigner({ isDesigner: true }, { status(c) { status = c; return { send() {} }; } }, assert.fail);
    assert.equal(status, 404);
  });
  withEnv({ DISABLE_DESIGN: 'false', REQUIRE_AUTHENTICATION: 'true' }, () => {
    assert.equal(canDesign({ userGroups: ['ADMIN'] }), true);
    assert.equal(canDesign({ userGroups: ['staff'] }), false);
  });
});

test('install adds admin/admin only to a database without users', async () => {
  UserService.initialized = true;            // no database connection in a unit test
  const count = User.countDocuments, add = UserService.prototype.addUser;
  const added = [];
  UserService.prototype.addUser = async (...args) => { added.push(args[0]); };
  const log = console.log; console.log = () => {};
  try {
    User.countDocuments = async () => 3;     // users named otherwise: before, admin/admin was added
    assert.equal(await new UserService().install(), false);
    User.countDocuments = async () => 0;
    assert.equal(await new UserService().install(), true);
    assert.deepEqual(added, ['admin']);
  }
  finally {
    User.countDocuments = count; UserService.prototype.addUser = add; console.log = log;
  }
});

test('DISABLE_SIGNUP: the sign-up pages answer 404; otherwise they are served', () => {
  const run = () => {
    const out = { next: false, status: undefined };
    signupEnabled({}, { status(c) { out.status = c; return { send() {} }; } }, () => { out.next = true; });
    return out;
  };
  withEnv({ DISABLE_SIGNUP: 'true' }, () => assert.deepEqual(run(), { next: false, status: 404 }));
  withEnv({ DISABLE_SIGNUP: 'false' }, () => assert.deepEqual(run(), { next: true, status: undefined }));
});

test.after(() => { setImmediate(() => process.exit(0)); });
