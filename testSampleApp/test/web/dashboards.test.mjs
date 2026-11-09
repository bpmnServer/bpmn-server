// @features: backup, dashboards, forms, start-events, start-page
// The dashboards: my work for every user, design for designers, administration for administrators.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
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
  assert.equal(started.location, '/dashboard', 'a user who is not a designer or an administrator: back to My work');
  const instanceId = (await web.bpmnServer.dataStore.findInstances({ name: MODEL }, 'summary'))
    .sort((a, b) => new Date(b.startedAt) - new Date(a.startedAt))[0].id;

  page = (await staff.get('/dashboard')).text;
  assert.match(card(page, 'available-tasks'), /Submit request/, 'candidate group staff');
  assert.doesNotMatch(card((await designer.get('/dashboard')).text, 'available-tasks'), /Submit request/, 'not for other groups');

  const instance = await web.bpmnServer.dataStore.findInstance({ id: instanceId }, 'full');
  const submit = instance.items.find(i => i.elementId === 'Submit');
  const done = await staff.post('/invokeItem', { itemId: submit.id, days: '2', reason: 'rest', returnTo: 'undefined' });
  assert.equal(done.status, 302, why(done));
  assert.equal(done.location, '/dashboard', 'completed: back to My work');
  const data = (await web.bpmnServer.dataStore.findInstance({ id: instanceId }, 'full')).data;
  assert.equal(data.reason, 'rest');
  for (const formOnly of ['_csrf', 'returnTo', 'itemId'])
    assert.ok(!(formOnly in data), `the form's ${formOnly} is not the task's data`);

  page = (await staff.get('/dashboard')).text;
  assert.match(card(page, 'completed-tasks'), /Submit request/, 'completed by staff');
  assert.doesNotMatch(card((await manager.get('/dashboard')).text, 'completed-tasks'), /Submit request/, 'not completed by manager');
});

test('designers and administrators go to the instance after starting or completing, to see what ran', async () => {
  let id;
  for (const client of [designer, admin]) {
    const started = await client.post('/dashboard/start', { processName: MODEL, startNodeId: 'Requested' });
    assert.match(started.location, /^\/instanceDetails\?id=/, client.userName);
    id = new URL(started.location, web.base).searchParams.get('id');
  }
  // Submit is the staff group's: of these two, the administrator may complete it
  const submit = (await web.bpmnServer.dataStore.findInstance({ id }, 'full')).items.find(i => i.elementId === 'Submit');
  const done = await admin.post('/invokeItem', { itemId: submit.id, days: '2', reason: 'rest' });
  assert.equal(done.location, `/instanceDetails?id=${encodeURIComponent(id)}`);
});

test('design: every model with its checks and the decisions', async () => {
  const page = (await designer.get('/dashboard/design')).text;
  assert.match(card(page, 'models'), new RegExp(`/model/edit/${MODEL}`));
  assert.match(card(page, 'models'), /dash-badge/);
});

test('design: a model\'s description, its saved versions, and what its scenarios cover, saved with the runs', async () => {
  const row = html => { const models = card(html, 'models'); const at = models.indexOf(`/model/edit/${MODEL}`); return models.slice(at, models.indexOf('</tr>', at)); };
  const before = row((await designer.get('/dashboard/design')).text);
  assert.match(before, /Test fixture for bpmn-web/, 'the description');
  assert.doesNotMatch(before, /\d+%/, 'no scenarios, no coverage');

  const scenario = name => ({ name, start: { data: { days: 2 } }, steps: [{ element: 'Submit', data: { days: 2, reason: 'rest' } }] });
  const saved = await designer.request('PUT', `/model/scenarios/${MODEL}`, { json: { scenarios: [scenario('short')] } });
  assert.equal(saved.status, 200, why(saved));
  assert.match(row((await designer.get('/dashboard/design')).text), /1 not run/);

  const run = await designer.post('/dashboard/design/tests', { model: MODEL });
  assert.equal(run.status, 302, why(run));
  const after = row((await designer.get('/dashboard/design')).text);
  const percent = Number(/(\d+)%/.exec(after)?.[1]);
  assert.ok(percent > 0 && percent < 100, `some of it: ${after}`);
  assert.match(after, /title="\d+ of \d+ nodes, \d+ of \d+ flows"/);
  assert.doesNotMatch(after, /not run|out of date/);

  const { scenarios: [kept] } = JSON.parse((await designer.get(`/model/scenarios/${MODEL}`)).text);
  assert.equal(kept.runs.length, 1);
  assert.ok(kept.runs[0].reached.includes('Submit'), 'what it reached is kept with the run');
  const first = kept.runs[0].instanceId;
  await designer.post('/dashboard/design/tests', { model: MODEL });
  const { scenarios: [again] } = JSON.parse((await designer.get(`/model/scenarios/${MODEL}`)).text);
  assert.notEqual(again.runs[0].instanceId, first);
  assert.equal(await web.bpmnServer.dataStore.findInstances({ id: first }, 'summary').then(list => list.length), 0, 'the run before is replaced, its instance deleted');

  assert.match(row((await designer.get('/dashboard/design')).text), new RegExp(`${percent}%`), 'the coverage from the tag');

  const file = path.join(web.definitionsPath, `${MODEL}.bpmn`);
  const source = fs.readFileSync(file, 'utf8');
  await web.bpmnServer.definitions.save(MODEL, source.replace('name="Submit request"', 'name="Submit it"'), null, null, 'designer');
  const edited = row((await designer.get('/dashboard/design')).text);
  assert.match(edited, /out of date/, 'the model changed since its runs');
  assert.match(edited, /<td>[1-9]\d*<\/td>/, 'its saved versions');
  await designer.request('PUT', `/model/scenarios/${MODEL}`, { json: { scenarios: [] } });
  await web.bpmnServer.definitions.save(MODEL, source, null, null, 'designer');
});

test('design: coverage counts as the Test tab does: an event sub-process is not an element, what is inside it is', async () => {
  const { modelElements, modelDescription } = await import(new URL('../../../packages/bpmn-web/dist/testing/modelCoverage.js', import.meta.url).href);
  const pools = `<?xml version="1.0"?><bpmn:definitions xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" id="d" targetNamespace="urn:t">
    <bpmn:collaboration id="c"><bpmn:documentation>What it is for</bpmn:documentation><bpmn:participant id="pa" processRef="p" /></bpmn:collaboration>
    <bpmn:process id="p"><bpmn:documentation>Older: one \\n two</bpmn:documentation></bpmn:process></bpmn:definitions>`;
  assert.equal(await modelDescription(pools), 'What it is for', 'what the editor shows with nothing selected comes first');
  assert.equal(await modelDescription(pools.replace('<bpmn:documentation>What it is for</bpmn:documentation>', '')), 'Older: one two', 'else the process\'s, its \\n read as a break');
  const { elements, listeners } = await modelElements(fs.readFileSync(new URL('../../processes/Error events.bpmn', import.meta.url), 'utf8'));
  assert.deepEqual([elements.nodes.length, elements.flows.length], [28, 22]);
  assert.ok(listeners.size > 0);
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
  for (const name of ['wf_instances', 'wf_archive', 'wf_locks', 'wf_models', 'wf_events'])
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

test('Run on a model with several start events, or a start form, asks first: the start page, then the start chosen with its data', async () => {
  const fs = await import('node:fs');
  fs.writeFileSync(web.definitionsPath + 'multi-start.bpmn', `<?xml version="1.0" encoding="UTF-8"?>
<bpmn:definitions xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:camunda="http://camunda.org/schema/1.0/bpmn" id="d" targetNamespace="urn:test">
  <bpmn:message id="Msg" name="order" />
  <bpmn:process id="P" isExecutable="true">
    <bpmn:startEvent id="ByMessage" name="By message"><bpmn:messageEventDefinition messageRef="Msg" /></bpmn:startEvent>
    <bpmn:startEvent id="ByHand" name="By hand">
      <bpmn:extensionElements><camunda:formData><camunda:formField id="customer" label="Customer" type="string" /></camunda:formData></bpmn:extensionElements>
    </bpmn:startEvent>
    <bpmn:startEvent id="Quick" name="Quick" />
    <bpmn:userTask id="FromMessage" /><bpmn:userTask id="FromHand" /><bpmn:userTask id="FromQuick" />
    <bpmn:sequenceFlow id="f1" sourceRef="ByMessage" targetRef="FromMessage" />
    <bpmn:sequenceFlow id="f2" sourceRef="ByHand" targetRef="FromHand" />
    <bpmn:sequenceFlow id="f3" sourceRef="Quick" targetRef="FromQuick" />
  </bpmn:process>
</bpmn:definitions>`);
  await web.bpmnServer.definitions.rebuild();

  const run = await admin.get('/execute/multi-start');
  assert.equal(run.status, 302);
  assert.match(run.location, /\/dashboard\/start\/multi-start$/);
  const page = (await admin.get('/dashboard/start/multi-start')).text;
  assert.match(page, /name="startNodeId" value="ByHand"/);
  assert.match(page, /name="startNodeId" value="Quick"/);
  assert.doesNotMatch(page, /value="ByMessage"/, 'a message start is not started by hand');
  assert.match(page, /name="field.customer"/, 'its start form');

  const started = await admin.post('/dashboard/start', { processName: 'multi-start', startNodeId: 'ByHand', 'field.customer': 'ACME' });
  assert.equal(started.status, 302, why(started));
  const id = new URL(started.location, web.base).searchParams.get('id');
  const instance = await web.bpmnServer.dataStore.findInstance({ id }, 'full');
  assert.equal(instance.data.customer, 'ACME');
  assert.deepEqual(instance.items.filter(i => i.status === 'wait').map(i => i.elementId), ['FromHand']);

  // one start, no form: Run starts at once, as before
  assert.match((await admin.get('/execute/' + MODEL)).location, /\/instanceDetails\?id=/);
});
