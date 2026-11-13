// @features: security-policies
// Security policies (docs/design/security-policies.md): a DMN table in policies/security/ decides who sees a case, which
// of its data, and what they may do with it and its tasks; every matching rule counts and a denial wins.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { SecurityPolicy } from '../dist/index.js';

const policies = dir => new SecurityPolicy(dir);
const decideAccess = (dir, ...args) => policies(dir).decide(...args);
const anyFolder = new SecurityPolicy('');

const cell = text => `<text>${text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')}</text>`;
/** A COLLECT table: inputs relation, groups, task; outputs see, data, complete. Rules: [relation, groups, task, see, data, complete]. */
const policy = (rules, hit = 'COLLECT') => `<?xml version="1.0" encoding="UTF-8"?>
<definitions xmlns="https://www.omg.org/spec/DMN/20191111/MODEL/" id="d" name="P" namespace="t">
  <decision id="P" name="P"><decisionTable id="t" hitPolicy="${hit}">
    <input id="i1" label="relation"><inputExpression id="e1" typeRef="string"><text>relation</text></inputExpression></input>
    <input id="i2" label="groups"><inputExpression id="e2" typeRef="string"><text>groups</text></inputExpression></input>
    <input id="i3" label="task"><inputExpression id="e3" typeRef="string"><text>task</text></inputExpression></input>
    <output id="o1" name="see" typeRef="string" /><output id="o2" name="data" typeRef="string" /><output id="o3" name="complete" typeRef="string" />
    ${rules.map((r, n) => `<rule id="r${n}">${r.slice(0, 3).map((c, i) => `<inputEntry id="r${n}i${i}">${cell(c)}</inputEntry>`).join('')}${r.slice(3).map((c, i) => `<outputEntry id="r${n}o${i}">${cell(c)}</outputEntry>`).join('')}</rule>`).join('\n')}
  </decisionTable></decision>
</definitions>`;

const MODEL = (policyAttr = 'owf:securityPolicy="Cases"', taskAttr = '') => `<?xml version="1.0" encoding="UTF-8"?>
<bpmn:definitions xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:camunda="http://camunda.org/schema/1.0/bpmn" xmlns:owf="http://omniworkflow.com/schema/owf/1.0" id="d" targetNamespace="t">
  <bpmn:process id="P" isExecutable="true" ${policyAttr}>
    <bpmn:startEvent id="S"><bpmn:extensionElements><camunda:formData><camunda:formField id="reason" /></camunda:formData></bpmn:extensionElements></bpmn:startEvent>
    <bpmn:userTask id="Approve" ${taskAttr}><bpmn:extensionElements><camunda:formData><camunda:formField id="approved" /></camunda:formData></bpmn:extensionElements></bpmn:userTask>
    <bpmn:userTask id="Notes" />
  </bpmn:process>
</bpmn:definitions>`;

function folder({ model = MODEL(), policies = {} } = {}) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'bpmn-security-'));
  fs.writeFileSync(path.join(dir, 'Request.bpmn'), model);
  fs.mkdirSync(path.join(dir, 'policies', 'security'), { recursive: true });
  for (const [name, xml] of Object.entries(policies)) fs.writeFileSync(path.join(dir, 'policies', 'security', `${name}.dmn.xml`), xml);
  return dir;
}

/** A case Ann started; its Approve waits for the managers; Bob completed an earlier task. */
const CASE = {
  name: 'Request', data: { reason: 'rest', approved: null, salary: 100, customer: { name: 'Acme', address: 'x' } },
  items: [
    { seq: 1, type: 'bpmn:StartEvent', elementId: 'S', status: 'end', userName: 'ann' },
    { seq: 2, type: 'bpmn:UserTask', elementId: 'Notes', status: 'end', userName: 'bob' },
    { seq: 3, type: 'bpmn:UserTask', elementId: 'Approve', status: 'wait', candidateGroups: ['Manager'] },
  ],
};
const ann = { userName: 'ann', userGroups: ['Employee', 'Manager'] };
const mia = { userName: 'mia', userGroups: ['Employee', 'Manager'] };
const bob = { userName: 'bob', userGroups: ['Employee'] };
const eve = { userName: 'eve', userGroups: ['Employee'] };

test('a person\'s relations to a case: who started it, whose task waits, who worked on it', () => {
  assert.deepEqual(anyFolder.relationsOf(ann, CASE).sort(), ['candidate', 'initiator', 'participant']);
  assert.deepEqual(anyFolder.relationsOf(bob, CASE), ['participant']);
  assert.deepEqual(anyFolder.relationsOf(eve, CASE), []);
  const assigned = { ...CASE, items: CASE.items.map(i => i.elementId === 'Approve' ? { ...i, assignee: 'mia' } : i) };
  assert.deepEqual(anyFolder.relationsOf(mia, assigned).sort(), ['assignee', 'candidate', 'participant']);
  assert.ok(!anyFolder.relationsOf(ann, assigned).includes('candidate'), 'assigned to someone else: no longer offered to her');
});

test('every matching rule counts, and a denial wins wherever it is in the table', () => {
  const rows = (...outputs) => outputs.map((o, i) => ({ policy: 'P', rule: i + 1, outputs: o }));
  assert.equal(anyFolder.combine(rows({ see: 'summary' }, { see: 'full' })).see, 'full', 'the widest allowed');
  assert.equal(anyFolder.combine(rows({ see: 'full' }, { see: 'deny' })).see, 'none');
  assert.equal(anyFolder.combine(rows({ see: 'deny' }, { see: 'full' })).see, 'none', 'order does not matter');
  assert.equal(anyFolder.combine(rows({ complete: 'allow' }, { complete: 'deny' })).complete, false);
  assert.equal(anyFolder.combine(rows({})).complete, null, 'nothing said: as the assignment says');
  assert.equal(anyFolder.combine(rows({})).assign, null, 'giving it to someone else: as today, when nothing is said');
  assert.equal(anyFolder.combine(rows({ assign: 'allow' }, { assign: 'deny' })).assign, false);
  assert.equal(anyFolder.combine(rows({ assign: 'allow' })).assign, true);
  assert.equal(anyFolder.combine(rows({ restart: '' })).restart, false, 'a protected action without an allowing rule: refused');
  assert.deepEqual(anyFolder.combine(rows({ data: 'forms' }, { data: ['salary'] })).data, { all: false, forms: true, paths: ['salary'] });
  assert.equal(anyFolder.combine(rows({ data: 'all' }, { data: 'deny' })).data.all, false);
});

test('a policy decides: a list input matches one of its values; the requester may not approve their own', async () => {
  const dir = folder({ policies: { Cases: policy([
    ['', '"Manager"', '', '"full"', '["reason","approved"]', ''],
    ['"initiator"', '', '', '"full"', '"forms"', ''],
    ['"participant"', '', '', '"summary"', '', ''],
    ['"initiator"', '', '"Approve"', '', '', '"deny"'],
  ]) } });
  const mias = await decideAccess(dir, mia, CASE, { elementId: 'Approve' });
  assert.equal(mias.see, 'full');
  assert.equal(mias.complete, null, 'hers to complete, as the assignment offers it');
  const anns = await decideAccess(dir, ann, CASE, { elementId: 'Approve' });
  assert.equal(anns.complete, false, 'a manager, but she asked for it');
  assert.deepEqual(anns.rules.map(r => r.rule).sort(), [1, 2, 3, 4]);
  assert.equal((await decideAccess(dir, ann, CASE)).complete, null, 'the case itself: no task, the last rule does not match');
  assert.equal((await decideAccess(dir, bob, CASE)).see, 'summary');
  assert.equal((await decideAccess(dir, eve, CASE)).see, 'none', 'no rule: not seen');
  assert.equal((await decideAccess(dir, { ...eve, unrestricted: true }, CASE)).see, 'full', 'an administrator is not asked');
});

test('without the process naming one: the application\'s default, else bpmn-web\'s built-in one; a missing policy decides nothing', async () => {
  const noName = folder({ model: MODEL('') });
  const builtIn = await decideAccess(noName, ann, CASE);
  assert.equal(builtIn.see, 'summary', 'built in: the candidate sees a line');
  assert.equal(builtIn.data.forms, true);
  assert.equal((await decideAccess(noName, { userName: 'dee', userGroups: ['DESIGNER'] }, CASE)).see, 'full', 'built in: designers see every case');
  assert.equal(builtIn.rules[0].policy, 'built-in default');

  const ownDefault = folder({ model: MODEL(''), policies: { default: policy([['', '"Employee"', '', '"summary"', '', '']]) } });
  assert.equal((await decideAccess(ownDefault, eve, CASE)).see, 'summary', 'the application\'s default');

  const errors = [];
  const missing = await decideAccess(folder({ model: MODEL('owf:securityPolicy="Gone"') }), ann, CASE, undefined, errors);
  assert.equal(missing.see, 'none', 'what it would have allowed stays refused');
  assert.match(errors.join(), /there is no policies\/security\/Gone\.dmn\.xml/);
});

test('a task names its own policy too: asked with the process\'s, a denial in either wins', async () => {
  const dir = folder({ model: MODEL('owf:securityPolicy="Cases"', 'owf:securityPolicy="Approvals"'), policies: {
    Cases: policy([['', '"Manager"', '', '"full"', '', '']]),
    Approvals: policy([['', '', '"Approve"', '', '', '"deny"']]),
  } });
  const access = await decideAccess(dir, mia, CASE, { elementId: 'Approve' });
  assert.equal(access.see, 'full');
  assert.equal(access.complete, false);
  assert.deepEqual(access.rules.map(r => r.policy), ['Cases', 'Approvals']);
});

test('the data a person reads: all, what forms entered, these paths (a whole branch), and a task\'s own fields', () => {
  const dir = folder();
  const model = policies(dir).model('Request');
  assert.deepEqual([...model.formFields].sort(), ['approved', 'reason']);
  assert.equal(model.policy, 'Cases');
  const access = data => anyFolder.combine([{ policy: 'P', rule: 1, outputs: { data } }]);
  assert.deepEqual(anyFolder.visibleData(CASE.data, access('forms'), model.formFields), { reason: 'rest', approved: null });
  assert.deepEqual(anyFolder.visibleData(CASE.data, access(['customer'])), { customer: { name: 'Acme', address: 'x' } });
  assert.deepEqual(anyFolder.visibleData(CASE.data, access(['customer.name'])), { customer: { name: 'Acme' } });
  assert.deepEqual(anyFolder.visibleData(CASE.data, access(''), model.formFields, model.taskFields.get('Approve')), { approved: null }, 'nothing allowed: the task\'s own fields still');
  assert.equal(anyFolder.visibleData(CASE.data, access('all')), CASE.data);
});

test('off until an application has policies/security, or SECURITY_POLICY=default', () => {
  const none = fs.mkdtempSync(path.join(os.tmpdir(), 'bpmn-security-'));
  assert.equal(policies(none).on, false);
  assert.equal(policies(folder()).on, true);
  process.env.SECURITY_POLICY = 'default';
  try { assert.equal(policies(none).on, true); }
  finally { delete process.env.SECURITY_POLICY; }
});
