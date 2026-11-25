// @features: form-rules
// A task's form rules as applications and the drawn forms meet them (docs/design/form-rules.md): API v3 refuses a
// completion that breaks them, or that its validate script refuses, with 400 FORM_INVALID and what each field breaks
// (also when the engine runs in its own process); the drawn task form carries the rules as its inputs' attributes and
// shows the case's values, and a form refused is a 400 page that says why.
import test from 'node:test';
import assert from 'node:assert/strict';
import { startWebApp, why, WebClient, API_KEY } from '../support/webApp.mjs';

let web;
test.after(async () => { await web?.stop(); setImmediate(() => process.exit(0)); });

const v3 = (method, url, token, body) => new WebClient(web.base).request(method, '/api/v3' + url, {
  json: body, headers: { authorization: `Bearer ${token}` },
});

const MODEL = 'form-rules';
const XML = `<?xml version="1.0" encoding="UTF-8"?>
<bpmn:definitions xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:camunda="http://camunda.org/schema/1.0/bpmn"
  xmlns:owf="http://omniworkflow.com/schema/owf/1.0" id="d" targetNamespace="urn:test">
  <bpmn:process id="FormRules" isExecutable="true">
    <bpmn:startEvent id="Begin"><bpmn:outgoing>f1</bpmn:outgoing></bpmn:startEvent>
    <bpmn:userTask id="Review" name="Review" camunda:candidateGroups="staff"><bpmn:extensionElements><camunda:formData>
        <camunda:formField id="department" label="Department" type="string">
          <camunda:validation><camunda:constraint name="required" /></camunda:validation>
          <owf:list source="service:departments" key="code" display="title" />
        </camunda:formField>
        <camunda:formField id="amount" label="Amount" type="long">
          <camunda:validation><camunda:constraint name="readonly" /></camunda:validation>
        </camunda:formField>
        <camunda:formField id="days" label="Days" type="long">
          <camunda:validation><camunda:constraint name="max" config="30" /></camunda:validation>
        </camunda:formField>
        <camunda:formField id="note" label="Note" type="string">
          <camunda:validation><camunda:constraint name="maxlength" config="20" /></camunda:validation>
        </camunda:formField>
      </camunda:formData>
      <camunda:taskListener event="validate"><camunda:script scriptFormat="JavaScript">if (data.days > 10 &amp;&amp; !data.note) return { error: 'A long leave needs a note', field: 'note' };</camunda:script></camunda:taskListener>
      </bpmn:extensionElements><bpmn:incoming>f1</bpmn:incoming><bpmn:outgoing>f2</bpmn:outgoing></bpmn:userTask>
    <bpmn:endEvent id="Done"><bpmn:incoming>f2</bpmn:incoming></bpmn:endEvent>
    <bpmn:sequenceFlow id="f1" sourceRef="Begin" targetRef="Review" />
    <bpmn:sequenceFlow id="f2" sourceRef="Review" targetRef="Done" />
  </bpmn:process>
</bpmn:definitions>`;

let sam;
test.before(async () => {
  web = await startWebApp();
  const res = await new WebClient(web.base).request('POST', '/api/v3/tokens', { json: { userName: 'sam', groups: ['staff'] }, headers: { 'x-api-key': API_KEY } });
  assert.equal(res.status, 201, why(res));
  sam = res.body.token;
  await web.bpmnServer.models.save(MODEL, XML);
});

const rules = res => res.body.error.details.map(d => `${d.field}:${d.rule}`);

test('API v3: a completion that breaks the rules, or its validate script, is 400 FORM_INVALID with what each field breaks', async () => {
  const started = await v3('POST', `/processes/${MODEL}/start`, sam, { data: { amount: 300 } });
  assert.equal(started.status, 201, why(started));
  const taskId = started.body.task.id;

  const refused = await v3('POST', `/tasks/${taskId}/complete`, sam, { data: { department: 'XX', amount: 1, days: 40 } });
  assert.equal(refused.status, 400, why(refused));
  assert.equal(refused.body.error.code, 'FORM_INVALID');
  assert.deepEqual(rules(refused), ['note:validate', 'department:list', 'amount:readonly', 'days:max']);
  assert.match(refused.body.error.message, /A long leave needs a note/);
  assert.deepEqual(rules(await v3('POST', `/tasks/${taskId}/complete`, sam, { data: {} })), ['department:required']);
  const task = await v3('GET', `/tasks/${taskId}`, sam);
  assert.equal(task.body.status, 'wait', 'still waiting');

  const done = await v3('POST', `/tasks/${taskId}/complete`, sam, { data: { department: 'IT', days: 12, note: 'family' } });
  assert.equal(done.status, 200, why(done));
  assert.equal(done.body.instance.data.amount, 300, 'the read-only value kept');
});

test('the drawn task form: the rules as attributes, the case\'s values shown; a form refused is a 400 page that says why', async () => {
  const { instance } = await web.bpmnServer.engine.start(MODEL, { amount: 300, days: 3 });
  const item = instance.items.find(i => i.elementId === 'Review');
  const staff = await web.login('staff');
  const page = await staff.get(`/invokeItem?id=${item.id}&processName=${MODEL}&elementId=Review`);
  assert.equal(page.status, 200, why(page));
  assert.match(page.text, /<select[^>]*name="department"[^>]*required/);
  assert.match(page.text, /<input[^>]*name="amount"[^>]*value="300"[^>]*readonly/);
  assert.match(page.text, /<input[^>]*name="days"[^>]*value="3"[^>]*max="30"/);
  assert.match(page.text, /<input[^>]*name="note"[^>]*maxlength="20"/);

  const refused = await staff.post('/invokeItem', { itemId: item.id, department: 'IT', amount: '300', days: '2.5', note: '' });
  assert.equal(refused.status, 400, why(refused));
  assert.match(refused.text, /Days: (&quot;|")2.5(&quot;|") is not a whole number/);
});
