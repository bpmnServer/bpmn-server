// The dashboards: my work for every user, design for designers, administration for administrators.
import test from 'node:test';
import assert from 'node:assert/strict';
import { startWebApp, why } from '../support/webApp.mjs';

let web, admin, designer, staff, manager;
const MODEL = 'leave-request';

test.before(async () => {
  web = await startWebApp();
  admin = await web.login('admin');
  designer = await web.login('designer');
  staff = await web.login('staff');
  manager = await web.login('manager');
});
test.after(async () => { await web?.stop(); setImmediate(() => process.exit(0)); });

/** The part of a page between an element's id and the next card. */
const card = (html, id) => {
  const start = html.indexOf(`id="${id}"`);
  assert.ok(start >= 0, `the page has #${id}`);
  const next = html.indexOf('class="dash-card', start + 1);
  return html.slice(start, next < 0 ? undefined : next);
};

test('each role reaches its own dashboards only', async () => {
  for (const [client, url, status] of [
    [staff, '/dashboard', 200], [staff, '/dashboard/design', 403], [staff, '/dashboard/admin', 403],
    [designer, '/dashboard/design', 200], [designer, '/dashboard/admin', 403],
    [admin, '/dashboard', 200], [admin, '/dashboard/design', 200], [admin, '/dashboard/admin', 200],
  ]) {
    const res = await client.get(url);
    assert.equal(res.status, status, `${url}: ${why(res)}`);
  }
  const page = (await staff.get('/dashboard')).text;
  assert.doesNotMatch(page, /href="\/dashboard\/admin"/, 'no administration link for a regular user');
  assert.match((await admin.get('/dashboard')).text, /href="\/dashboard\/admin"/);
});

test('my work: a task for my group, started from the start form, then completed and listed as mine', async () => {
  let page = (await staff.get('/dashboard')).text;
  assert.match(card(page, 'start-events'), new RegExp(MODEL), 'the model can be started');

  const started = await staff.post('/dashboard/start', { processName: MODEL, startNodeId: 'Requested' });
  assert.equal(started.status, 302, why(started));
  const instanceId = new URL(started.location, web.base).searchParams.get('id');
  assert.ok(instanceId, started.location);

  page = (await staff.get('/dashboard')).text;
  assert.match(card(page, 'available-tasks'), /Submit request/, 'candidate group staff');
  assert.doesNotMatch(card((await designer.get('/dashboard')).text, 'available-tasks'), /Submit request/, 'not for other groups');

  const instance = await web.bpmnServer.dataStore.findInstance({ id: instanceId }, 'full');
  const submit = instance.items.find(i => i.elementId === 'Submit');
  const done = await staff.post('/invokeItem', { itemId: submit.id, processName: MODEL, days: '2', reason: 'rest' });
  assert.ok(done.status < 400, why(done));

  page = (await staff.get('/dashboard')).text;
  assert.match(card(page, 'completed-tasks'), /Submit request/, 'completed by staff');
  assert.doesNotMatch(card((await manager.get('/dashboard')).text, 'completed-tasks'), /Submit request/, 'not completed by manager');
});

test('design: every model with its checks and the decisions', async () => {
  const page = (await designer.get('/dashboard/design')).text;
  assert.match(card(page, 'models'), new RegExp(`/model/edit/${MODEL}`));
  assert.match(card(page, 'models'), /dash-badge/);
});

test('administration: server, users, add a user, locks, backup', async () => {
  let page = (await admin.get('/dashboard/admin')).text;
  for (const id of ['instances', 'server', 'operations', 'users', 'console'])
    assert.match(page, new RegExp(`id="${id}"`));
  assert.match(card(page, 'console'), /spw/);

  const added = await admin.post('/dashboard/admin/users', { userName: 'newbie', email: 'newbie@example.com', password: 'pw-1234', userGroups: 'staff, manager' });
  assert.equal(added.status, 302, why(added));
  assert.match(decodeURIComponent(added.location), /User 'newbie' added/);
  page = (await admin.get('/dashboard/admin')).text;
  assert.match(card(page, 'users'), /newbie/);
  const again = await admin.post('/dashboard/admin/users', { userName: 'newbie', email: 'other@example.com', password: 'pw-1234' });
  assert.match(decodeURIComponent(again.location), /already exists/);
  assert.equal((await staff.post('/dashboard/admin/users', { userName: 'x', email: 'x@example.com', password: 'pw-1234' })).status, 403);

  const released = await admin.post('/dashboard/admin/locks/release', {});
  assert.match(decodeURIComponent(released.location), /All locks released/);

  const backup = await admin.get('/dashboard/admin/backup');
  assert.equal(backup.status, 200, why(backup));
  assert.match(backup.headers.get('content-disposition'), /bpmn-backup-.*\.json/);
  const data = JSON.parse(backup.text);
  assert.equal(data.format, 'bpmn-web-backup');
  assert.equal(data.version, 2);
  assert.ok(data.files.some(f => f.name === MODEL + '.bpmn'), 'the models folder');
  assert.ok(Object.keys(data.collections).some(c => /users/i.test(c)), 'the users');
  for (const name of ['wf_instances', 'wf_archive', 'wf_locks', 'wf_models', 'wf_events', 'wf_test_scenarios'])
    assert.ok(Array.isArray(data.collections[name]), name);
  assert.ok(data.collections.wf_models.some(m => m.name === MODEL), 'the models collection');
  assert.ok(!('sessions' in data.collections), 'never the sessions');
  assert.equal((await staff.get('/dashboard/admin/backup')).status, 403);
});

test('restart without a supervisor does not stop the server', async () => {
  const res = await admin.post('/dashboard/admin/restart', {});
  assert.equal(res.status, 302);
  assert.match(decodeURIComponent(res.location), /Nothing restarts this process/);
  assert.equal((await admin.get('/dashboard')).status, 200, 'still running');
});
