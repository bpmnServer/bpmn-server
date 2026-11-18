// @features: form-lookups
// A form field's list or lookup (docs/design/form-lookups.md), as an application and the drawn forms use it: the form
// says which fields have one, and POST .../choices/{field} answers their choices from the source the model names,
// as the person filling the form; a filter reads the form's values, then the case's data. The sample app's services
// are the sources (connectors/appServices.ts: departments, employees).
import test from 'node:test';
import assert from 'node:assert/strict';
import { startWebApp, why, WebClient, API_KEY } from '../support/webApp.mjs';

let web;
test.after(async () => { await web?.stop(); setImmediate(() => process.exit(0)); });

const v3 = (method, url, token, body) => new WebClient(web.base).request(method, '/api/v3' + url, {
  json: body, headers: { authorization: `Bearer ${token}` },
});
async function tokenFor(userName, groups) {
  const res = await new WebClient(web.base).request('POST', '/api/v3/tokens', { json: { userName, groups }, headers: { 'x-api-key': API_KEY } });
  assert.equal(res.status, 201, why(res));
  return res.body.token;
}

const MODEL = 'form-choices';
const FIELDS = `
        <camunda:formField id="department" label="Department" type="string">
          <owf:list source="service:departments" key="code" display="title" />
        </camunda:formField>
        <camunda:formField id="approver" label="Approver" type="string">
          <owf:lookup source="service:employees" display="name" filter="\${data.department}" />
        </camunda:formField>
        <camunda:formField id="broken" label="Broken" type="string">
          <owf:list source="service:noSuchService" />
        </camunda:formField>
        <camunda:formField id="note" label="Note" type="string" />`;
const XML = `<?xml version="1.0" encoding="UTF-8"?>
<bpmn:definitions xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:camunda="http://camunda.org/schema/1.0/bpmn"
  xmlns:owf="http://omniworkflow.com/schema/owf/1.0" id="d" targetNamespace="urn:test">
  <bpmn:process id="FormChoices" isExecutable="true">
    <bpmn:startEvent id="Begin"><bpmn:extensionElements><camunda:formData>${FIELDS}</camunda:formData></bpmn:extensionElements>
      <bpmn:outgoing>f1</bpmn:outgoing></bpmn:startEvent>
    <bpmn:userTask id="Review" name="Review" camunda:assignee="sam"><bpmn:extensionElements><camunda:formData>${FIELDS}</camunda:formData></bpmn:extensionElements>
      <bpmn:incoming>f1</bpmn:incoming><bpmn:outgoing>f2</bpmn:outgoing></bpmn:userTask>
    <bpmn:endEvent id="Done"><bpmn:incoming>f2</bpmn:incoming></bpmn:endEvent>
    <bpmn:sequenceFlow id="f1" sourceRef="Begin" targetRef="Review" />
    <bpmn:sequenceFlow id="f2" sourceRef="Review" targetRef="Done" />
  </bpmn:process>
</bpmn:definitions>`;

let sam, mia;
test.before(async () => {
  web = await startWebApp();
  sam = await tokenFor('sam', ['staff']);
  mia = await tokenFor('mia', ['staff']);
  await web.bpmnServer.models.save(MODEL, XML);
});

const keys = res => res.body.items.map(i => i.key);

test('a start form: which fields have a list or a lookup, and their choices; a filter reads the form\'s values', async () => {
  const startable = await v3('GET', '/processes/startable', sam);
  const form = startable.body.items.find(i => i.processName === MODEL).form;
  const byId = Object.fromEntries(form.fields.map(f => [f.id, f]));
  assert.deepEqual(byId.department.list, { source: 'service:departments', key: 'code', display: 'title' });
  assert.deepEqual(byId.approver.lookup, { source: 'service:employees', key: 'id', display: 'name', filter: '${data.department}' });
  assert.equal(byId.note.list ?? byId.note.lookup, undefined);

  const departments = await v3('POST', `/processes/${MODEL}/choices/department`, sam, {});
  assert.equal(departments.status, 200, why(departments));
  assert.deepEqual(departments.body.items[0], { key: 'HR', display: 'Human Resources' });
  assert.deepEqual(keys(departments), ['HR', 'IT', 'FIN']);

  const anyone = await v3('POST', `/processes/${MODEL}/choices/approver`, sam, { text: 'da' });
  assert.deepEqual(keys(anyone), ['david.kim', 'dana.scott'], 'searched by the text');
  const inIT = await v3('POST', `/processes/${MODEL}/choices/approver`, sam, { text: 'da', data: { department: 'IT' }, startNodeId: 'Begin' });
  assert.deepEqual(keys(inIT), ['dana.scott'], 'and by the department the form has');

  const none = await v3('POST', `/processes/${MODEL}/choices/note`, sam, {});
  assert.equal(none.status, 404);
  assert.equal(none.body.error.code, 'NO_CHOICES');
  const failing = await v3('POST', `/processes/${MODEL}/choices/broken`, sam, {});
  assert.equal(failing.status, 502, why(failing));
  assert.equal(failing.body.error.code, 'CHOICES_FAILED');
  assert.match(failing.body.error.message, /noSuchService/);
  const notStartable = await v3('POST', '/processes/no-such-model/choices/department', sam, {});
  assert.equal(notStartable.status, 404);
});

test('a task\'s form: its choices as the person who completes it; the filter reads the case\'s data; the chosen label saved', async () => {
  const started = await v3('POST', `/processes/${MODEL}/start`, sam, { data: { department: 'HR' } });
  assert.equal(started.status, 201, why(started));
  const taskId = started.body.task.id;

  const task = await v3('GET', `/tasks/${taskId}`, sam);
  assert.deepEqual(task.body.form.fields.find(f => f.id === 'approver').lookup.source, 'service:employees');

  assert.deepEqual(keys(await v3('POST', `/tasks/${taskId}/choices/approver`, sam, { text: 'da' })), ['david.kim'], 'the case\'s department, HR');
  assert.deepEqual(keys(await v3('POST', `/tasks/${taskId}/choices/approver`, sam, { text: 'da', data: { department: 'IT' } })), ['dana.scott'],
    'the form\'s department, changed, before the case\'s');

  const notMine = await v3('POST', `/tasks/${taskId}/choices/approver`, mia, { text: 'da' });
  assert.equal(notMine.status, 404, 'not her task: the same 404 as none');
  const badText = await v3('POST', `/tasks/${taskId}/choices/approver`, sam, { text: 7 });
  assert.equal(badText.status, 400);
  assert.equal(badText.body.error.code, 'BAD_TEXT');

  const done = await v3('POST', `/tasks/${taskId}/complete`, sam, { data: { approver: 'dana.scott', approverDisplay: 'Dana Scott' } });
  assert.equal(done.status, 200, why(done));
  assert.equal(done.body.instance.data.approver, 'dana.scott');
  assert.equal(done.body.instance.data.approverDisplay, 'Dana Scott', 'the label kept beside the key');
});

test('the drawn forms: a drop-down and a search box, and their choices as the person signed in', async () => {
  const staff = await web.login('staff');
  const startPage = await staff.get(`/dashboard/start/${MODEL}`);
  assert.equal(startPage.status, 200, why(startPage));
  assert.match(startPage.text, new RegExp(`<select[^>]*name="field.department"[^>]*data-choices-url="/dashboard/choices/start/${MODEL}/department"`));
  assert.match(startPage.text, /<input[^>]*data-choices-url="\/dashboard\/choices\/start\/form-choices\/approver"/);
  assert.match(startPage.text, /<input[^>]*type="hidden"[^>]*name="field.approverDisplay"/);
  assert.match(startPage.text, /formLookup\.js/);

  const choices = await staff.request('POST', `/dashboard/choices/start/${MODEL}/approver`, { json: { text: 'm', data: { department: 'FIN' } } });
  assert.equal(choices.status, 200, why(choices));
  assert.deepEqual(choices.body.items, [{ key: 'michael.brown', display: 'Michael Brown' }]);

  const signedOut = await web.client().request('POST', `/dashboard/choices/start/${MODEL}/approver`, { json: { text: 'm' } });
  assert.notEqual(signedOut.status, 200, 'not signed in: no choices');
});
