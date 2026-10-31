import test from 'node:test';
import assert from 'node:assert/strict';

import { API } from './dist/routes/api.js';
import { API2 } from './dist/routes/api2.js';

const webApp = { bpmnServer: {} };
const paths = (router) => router.stack.map((layer) => layer.route?.path).filter(Boolean);

test('legacy operational router excludes definition administration', () => {
  const api = new API(webApp);
  assert.equal(paths(api.config()).some((path) => path.startsWith('/definitions') || path.startsWith('/model')), false);
  assert.equal(paths(api.adminConfig()).some((path) => path.startsWith('/definitions')), true);
});

test('authorized operational router reads models but excludes model administration', () => {
  const api = new API2(webApp);
  const runtimeModel = paths(api.config()).filter((path) => path.startsWith('/model')).sort();
  assert.deepEqual(runtimeModel, ['/model/findEvents', '/model/findStartEvents', '/model/list']);
  const admin = paths(api.adminConfig());
  for (const write of ['/model/import{/:name}', '/model/rename', '/model/delete'])
    assert.ok(admin.includes(write), write);
});

test.after(() => { setImmediate(() => process.exit(0)); });
