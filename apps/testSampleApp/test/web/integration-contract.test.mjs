// @features: integration-page
// The application's contract as a card of the Settings page (routes/integration.ts: contractCard): who the application is,
// each API it declares with the connector made from it and how that stands, its pages, roles and functions, what is wrong
// with the file, and how it and this server reach each other.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { startWebApp, why } from '../support/webApp.mjs';
import { contractCard } from 'bpmn-web';

const CONTRACT = {
  name: 'hr', description: 'The HR application, beside this server',
  apis: [{ id: 'hr', openapi: 'http://hr.example/api/hr/openapi.json' }, { id: 'payroll', openapi: 'http://hr.example/api/payroll/openapi.json' }],
  pages: [{ id: 'assignment', url: 'http://hr.example/forms/assignment', title: 'Assignment' }],
  roles: [{ name: 'Employee' }, { name: 'Manager' }],
  expressions: [{ kind: 'function', name: 'managerOf' }, { kind: 'function', name: 'recordLeave' }],
};
const connector = extra => ({ id: 'hr', enabled: true, auth: { type: 'apiKey', last4: 'cret' }, ...extra });
const ENV = { API_KEY: 'k', SITE_URL: 'https://owf.example.com' };

test('what the card says of each API: no connector, no key, not tested, connected, failed, off', () => {
  const state = c => contractCard(CONTRACT, [], c ? [c] : [], { env: ENV }).apis[0].state;
  assert.equal(state(null), 'no connector made');
  assert.equal(state(connector({ auth: { type: 'apiKey' } })), 'no key');
  assert.equal(state(connector()), 'not tested');
  assert.equal(state(connector({ test: { ok: true, at: 'now', operation: 'listEmployees' } })), 'connected');
  assert.equal(state(connector({ test: { ok: false, at: 'now', operation: 'listEmployees', message: 'HTTP 401' } })), 'last test failed');
  assert.equal(state(connector({ enabled: false })), 'off');
  assert.equal(contractCard(CONTRACT, [], [], { env: ENV }).apis[1].state, 'no connector made', 'each API is its own');
});

test('the rest of the card: pages, roles, functions, the problems of the file, and how it connects', () => {
  const card = contractCard(CONTRACT, ['expressions[0]: kind is function'], [], { hostUsers: true, origin: 'http://owf', env: ENV });
  assert.equal(card.found, true);
  assert.equal(card.name, 'hr');
  assert.deepEqual(card.pages, [{ id: 'assignment', url: 'http://hr.example/forms/assignment', title: 'Assignment' }]);
  assert.deepEqual(card.roles, ['Employee', 'Manager']);
  assert.equal(card.functions, 2);
  assert.deepEqual(card.problems, ['expressions[0]: kind is function']);
  assert.deepEqual(card.connection, { api: 'http://owf/api/v3', serviceKey: true, siteAddress: 'https://owf.example.com', signIn: 'the application signs its people in (its user manager)' });
  const bare = contractCard(CONTRACT, [], [], { env: {} });
  assert.equal(bare.connection.serviceKey, false);
  assert.match(bare.connection.siteAddress, /not set/);
  assert.match(bare.connection.signIn, /own users/);
  assert.deepEqual(contractCard(null, [], [], { env: ENV }).apis, [], 'no contract: nothing declared');
  assert.equal(contractCard(null, [], [], { env: ENV }).found, false);
});

let web, admin, designer, staff;
test.before(async () => {
  web = await startWebApp();
  [admin, designer, staff] = await Promise.all([web.login('admin'), web.login('designer'), web.login('staff')]);
});
test.after(async () => { await web?.stop(); setImmediate(() => process.exit(0)); });

test('the Settings page has the card, first; its area shows the contract: APIs, pages, roles; an end user does not open it', async () => {
  fs.writeFileSync(path.join(web.definitionsPath, 'app-contract.json'), JSON.stringify(CONTRACT));
  const overview = await admin.get('/dashboard/settings');
  assert.equal(overview.status, 200, why(overview));
  assert.ok(overview.text.includes('<a class="integration-card" href="/dashboard/settings/contract" id="contract">'), 'its card');
  assert.ok(overview.text.indexOf('id="contract"') < overview.text.indexOf('id="roles"'), 'before the other areas');
  assert.match(overview.text, /hr: 2 APIs \(0 connected\), 1 page, 2 roles/);
  assert.match(overview.text, /An API in the contract has no connector yet/);
  const area = await admin.get('/dashboard/settings/contract');
  assert.equal(area.status, 200, why(area));
  for (const text of ['The HR application, beside this server', 'http://hr.example/api/hr/openapi.json', 'payroll', 'no connector made', 'Assignment', 'http://hr.example/forms/assignment', 'Employee', 'Manager', '/api/v3'])
    assert.ok(area.text.includes(text), text);
  assert.equal((await designer.get('/dashboard/settings/contract')).status, 200, 'a designer too');
  assert.equal((await staff.get('/dashboard/settings/contract')).status, 403);
});

test('a file with problems is said so, and so is no contract', async () => {
  fs.writeFileSync(path.join(web.definitionsPath, 'app-contract.json'), JSON.stringify({ name: 'bad', expressions: [{ kind: 'thing', name: 'x' }] }));
  assert.match((await admin.get('/dashboard/settings')).text, /1 problem in app-contract\.json/);
  assert.match((await admin.get('/dashboard/settings/contract')).text, /kind is function/);
  fs.rmSync(path.join(web.definitionsPath, 'app-contract.json'));
  assert.match((await admin.get('/dashboard/settings')).text, /No contract: the application publishes none/);
  assert.match((await admin.get('/dashboard/settings/contract')).text, /The application publishes no contract/);
});
