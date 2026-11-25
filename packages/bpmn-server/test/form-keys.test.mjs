// @features: app-contract
// Form keys (docs/design/form-keys.md): a user task or a start event names the application's page by its address, and
// the engine carries that address out to whoever draws the form. This is the API behind the flows of form-keys.md
// section 6: the key reaches the client for a user task (flows A, B) and for a start event (flow E), a task without
// one still answers its fields (flow C), and the address may be an expression the host fills in (section 3), so one
// model runs wherever the application is served. Completing takes any data, not only the fields the model lists
// (section 5).
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { makeServer } from './helpers.mjs';

// A user task whose form is the application's page, a start event with one, and a task with fields and no key.
// The expression as the model holds it, built so this file needs no escape inside its template literal.
const HR_FORMS = '$' + '{appVars.hrForms}';

const MODEL = `<?xml version="1.0" encoding="UTF-8"?>
<bpmn:definitions xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:camunda="http://camunda.org/schema/1.0/bpmn" id="d" targetNamespace="t">
  <bpmn:process id="Leave" isExecutable="true">
    <bpmn:startEvent id="Request" camunda:formKey="/hr/forms/leave-request"><bpmn:outgoing>f1</bpmn:outgoing></bpmn:startEvent>
    <bpmn:userTask id="Assign" name="Choose the assignment" camunda:formKey="${HR_FORMS}/assignment">
      <bpmn:incoming>f1</bpmn:incoming><bpmn:outgoing>f2</bpmn:outgoing></bpmn:userTask>
    <bpmn:userTask id="Note" name="Add a note">
      <bpmn:extensionElements><camunda:formData>
        <camunda:formField id="note" label="Note" type="string" />
      </camunda:formData></bpmn:extensionElements>
      <bpmn:incoming>f2</bpmn:incoming><bpmn:outgoing>f3</bpmn:outgoing></bpmn:userTask>
    <bpmn:endEvent id="Done"><bpmn:incoming>f3</bpmn:incoming></bpmn:endEvent>
    <bpmn:sequenceFlow id="f1" sourceRef="Request" targetRef="Assign" />
    <bpmn:sequenceFlow id="f2" sourceRef="Assign" targetRef="Note" />
    <bpmn:sequenceFlow id="f3" sourceRef="Note" targetRef="Done" />
  </bpmn:process>
</bpmn:definitions>`;

async function serverWithModel(extra = {}) {
  const made = await makeServer(extra);
  fs.writeFileSync(path.join(made.server.configuration.definitionsPath, 'Leave.bpmn'), MODEL);
  return made;
}

test('the form key reaches the client: a user task (flows A, B), a start event (flow E), fields without one (flow C)', async () => {
  const { server } = await serverWithModel();
  const definition = await server.definitions.load('Leave');

  // Flows A and B: the task's form is an address, with no fields of its own — the application draws it.
  const assign = definition.getNodeInfo('Assign');
  assert.equal(assign.formKey, '${appVars.hrForms}/assignment', 'the task carries its page\'s address, expression and all');
  assert.deepEqual(assign.fields ?? [], [], 'the application draws it, so the model lists no fields');

  // Flow E: a start event carries one the same way — the same shape, so one client path serves both.
  assert.equal(definition.getNodeInfo('Request').formKey, '/hr/forms/leave-request', 'the start event carries its address');

  // Flow C: no key, so owf draws the fields itself, as today.
  const note = definition.getNodeInfo('Note');
  assert.equal(note.formKey, undefined, 'no form key');
  assert.deepEqual(note.fields.map(f => f.id), ['note'], 'its fields are answered instead');

  await server.shutdown?.();
});

test("the address is the model's, so nothing registers it and nothing maps it (section 4)", async () => {
  const { server } = await serverWithModel();
  const definition = await server.definitions.load('Leave');
  // What the client gets is the address itself: no id to look up, no contract entry to keep in step.
  const key = definition.getNodeInfo('Assign').formKey;
  assert.ok(!key.startsWith('app:'), 'not a registered name');
  assert.match(key, /\/assignment$/, 'it ends at the page, which the application serves');
  // An expression is carried through as written: it is worked out when the person opens the task, not at save.
  assert.match(key, /^\$\{appVars\.[A-Za-z_$][\w$]*\}/, 'the prefix is the host\'s to fill in (.env, via appVars)');
  await server.shutdown?.();
});

test('an expression in the address resolves against the application\'s variables (section 3)', async () => {
  // The contract's variable, as the HR application would give it: its own, free to read process.env.
  class Vars {
    constructor(context) { this.context = context; }
    hrForms() { return process.env.HR_FORMS_URL ?? '/hr/forms'; }
  }
  const { server } = await serverWithModel({ extra: { appVarsClass: Vars } });
  const definition = await server.definitions.load('Leave');
  const key = definition.getNodeInfo('Assign').formKey;

  // What owf does before it redirects: work out the expression, then add the identifiers (section 4).
  const vars = new Vars({});
  const resolved = key.replace(/\$\{appVars\.([A-Za-z_$][\w$]*)\}/g, (_, name) => vars[name]());
  assert.equal(resolved, '/hr/forms/assignment', 'the deployment\'s prefix, with the model\'s own path');

  const address = `${resolved}?instance=i-1&item=t-9&returnTo=${encodeURIComponent('/my-work')}`;
  assert.match(address, /\?instance=i-1&item=t-9&/, 'identifiers only: no case data in the address');
  assert.ok(!/data=/.test(address), 'the page reads the data itself, as the person');

  await server.shutdown?.();
});

test('completing takes any data, not only the fields the model lists (section 5)', async () => {
  const { server } = await serverWithModel();
  // The form's own result, which no camunda:formField describes: an application's form usually lists none, and it
  // often has something the process needs (the assignment's id). It reaches the instance's data as sent.
  const { instance } = await server.engine.start('Leave', { employeeId: 'e-1' }, null, 'ann');
  const assign = instance.items.find(i => i.elementId === 'Assign');
  const done = await server.engine.invoke({ 'items.id': assign.id }, { assignmentId: 'A-91', note: 'kept too' }, 'ann');
  assert.equal(done.instance.data.assignmentId, 'A-91', 'an undeclared value is kept, not filtered away');
  assert.equal(done.instance.data.employeeId, 'e-1', 'and what was there already stays');
  await server.shutdown?.();
});
