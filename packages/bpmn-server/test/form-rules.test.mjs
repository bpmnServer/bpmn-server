// @features: form-rules
// A form's rules (elements/FormRules.ts; docs/design/form-rules.md), checked when a user task is completed, with its
// validate event (Node.validate): each field's type, its camunda:validation constraints, a list's choices, and a
// validate script's { error }. A form refused is FORM_INVALID, with what each field breaks, and nothing is saved.
// A start event's fields are not checked.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { makeServer, definitionsFolder } from './helpers.mjs';
import { fieldProblems, constraintsOf, FormInvalidError } from '../dist/index.js';

const constraint = (name, config) => `<camunda:constraint name="${name}"${config !== undefined ? ` config="${config}"` : ''} />`;
const field = (id, type, constraints = '', inner = '') =>
  `<camunda:formField id="${id}" label="${id}" type="${type}">${constraints ? `<camunda:validation>${constraints}</camunda:validation>` : ''}${inner}</camunda:formField>`;
const START = field('amount', 'long', constraint('required') + constraint('min', 1) + constraint('max', 1000))
  + field('reason', 'string', constraint('minlength', 3) + constraint('maxlength', 20));
const VALIDATE = `<camunda:taskListener event="validate"><camunda:script scriptFormat="JavaScript">if (data.decision === 'no' &amp;&amp; !data.why) return { error: 'Say why', field: 'why' };</camunda:script></camunda:taskListener>`;
const TASK = field('decision', 'enum', constraint('required'), '<camunda:value id="yes" name="Yes" /><camunda:value id="no" name="No" />')
  + field('amount', 'long', constraint('readonly'))
  + field('due', 'date')
  + field('urgent', 'boolean')
  + field('department', 'string', '', '<owf:list source="service:departments" key="code" display="title" />');
const MODEL = `<?xml version="1.0" encoding="UTF-8"?>
<bpmn:definitions xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:camunda="http://camunda.org/schema/1.0/bpmn"
  xmlns:owf="http://omniworkflow.com/schema/owf/1.0" id="d" targetNamespace="t">
  <bpmn:process id="P" isExecutable="true">
    <bpmn:startEvent id="S"><bpmn:extensionElements><camunda:formData>${START}</camunda:formData></bpmn:extensionElements><bpmn:outgoing>a</bpmn:outgoing></bpmn:startEvent>
    <bpmn:userTask id="T"><bpmn:extensionElements><camunda:formData>${TASK}</camunda:formData>${VALIDATE}</bpmn:extensionElements>
      <bpmn:incoming>a</bpmn:incoming><bpmn:outgoing>b</bpmn:outgoing></bpmn:userTask>
    <bpmn:endEvent id="E"><bpmn:incoming>b</bpmn:incoming></bpmn:endEvent>
    <bpmn:sequenceFlow id="a" sourceRef="S" targetRef="T" /><bpmn:sequenceFlow id="b" sourceRef="T" targetRef="E" />
  </bpmn:process></bpmn:definitions>`;
const departments = async () => [{ code: 'HR', title: 'Human Resources' }, { code: 'IT', title: 'Technology' }];

async function server(extra = {}) {
  const dir = definitionsFolder();
  fs.writeFileSync(path.join(dir, 'Rules.bpmn'), MODEL);
  return (await makeServer({ dir, services: { departments }, extra })).server;
}
const refused = async (promise) => {
  try { await promise; }
  catch (error) { return error; }
  assert.fail('not refused');
};
const rulesOf = error => error.details.map(d => `${d.field}:${d.rule}`);

test('each rule, on one value: a type, a constraint and its config; text from a drawn form read as its type', () => {
  const f = (type, constraints = {}) => ({ id: 'x', type, validation: { constraints: Object.entries(constraints).map(([name, config]) => ({ name, config })) } });
  const rules = (fld, value, opts) => fieldProblems(fld, value, opts).map(p => p.rule);
  assert.deepEqual(rules(f('long'), '12'), []);
  assert.deepEqual(rules(f('long'), '1.5'), ['type']);
  assert.deepEqual(rules(f('boolean'), 'true'), []);
  assert.deepEqual(rules(f('boolean'), 'No'), [], 'yes or no too');
  assert.deepEqual(rules(f('boolean'), 'maybe'), ['type']);
  assert.deepEqual(rules(f('date'), '2026-11-18'), []);
  assert.deepEqual(rules(f('date'), 'soon'), ['type']);
  assert.deepEqual(rules(f('string', { required: undefined }), ''), ['required']);
  assert.deepEqual(rules(f('string', { minlength: '3', maxlength: '5' }), 'ab'), ['minlength']);
  assert.deepEqual(rules(f('string', { minlength: '3', maxlength: '5' }), 'abcdef'), ['maxlength']);
  assert.deepEqual(rules(f('long', { min: '1', max: '10' }), 11), ['max']);
  assert.deepEqual(rules(f('long', { min: '1' }), ''), [], 'absent: only required is checked');
  assert.deepEqual(rules(f('string', { readonly: undefined }), 'new', { sent: true, current: 'old' }), ['readonly']);
  assert.deepEqual(rules(f('string', { readonly: undefined }), 'old', { sent: true, current: 'old' }), [], 'the same value sent back');
  assert.deepEqual(Object.keys(constraintsOf(f('string', { Required: undefined, validator: 'x', other: 1 }))), ['required', 'validator'],
    'names in any case; a validator recorded, not run');
});

test("a start event's fields: not checked", async () => {
  const s = await server();
  const started = await s.engine.start('Rules', { amount: '0', reason: 'no' });
  assert.equal(started.instance.status, 'running');
});

test('a task completed: its rules; a value the case has counts; a read-only one unchanged; a list\'s value one of its choices', async () => {
  const s = await server();
  const { instance } = await s.engine.start('Rules', { amount: 250 });
  const task = instance.items.find(i => i.elementId === 'T');

  const error = await refused(s.engine.invoke({ 'items.id': task.id }, { amount: 999, due: 'soon', urgent: 'maybe', department: 'XX' }));
  assert.deepEqual(rulesOf(error), ['decision:required', 'amount:readonly', 'due:type', 'urgent:type', 'department:list']);
  assert.match(error.message, /decision: a value is required/);
  const still = await s.dataStore.findInstance({ id: instance.id }, 'full');
  assert.equal(still.items.find(i => i.id === task.id).status, 'wait', 'the task still waits');
  assert.equal(still.data.amount, 250, 'nothing of it saved');

  assert.deepEqual(rulesOf(await refused(s.engine.invoke({ 'items.id': task.id }, { decision: 'maybe' }))), ['decision:enum']);
  const script = await refused(s.engine.invoke({ 'items.id': task.id }, { decision: 'no' }));
  assert.deepEqual(script.details, [{ field: 'why', rule: 'validate', message: 'Say why' }], "the validate event's error refuses it too");
  const done = await s.engine.invoke({ 'items.id': task.id }, { decision: 'yes', amount: 250, due: '2026-12-01', urgent: 'false', department: 'IT' });
  assert.equal(done.instance.status, 'end');
});

test('off with the configuration\'s formRules: false', async () => {
  const s = await server({ formRules: false });
  const { instance } = await s.engine.start('Rules', {});
  const task = instance.items.find(i => i.elementId === 'T');
  const done = await s.engine.invoke({ 'items.id': task.id }, { decision: 'maybe' });
  assert.equal(done.instance.status, 'end');
});
