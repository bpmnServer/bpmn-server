// @features: assignment-policies
// Assignment policies (docs/design/assignment.md): a user task names one; when it starts, the policy's first matching
// rule assigns it; the policy wins over the task's attributes and lane; no match, no policy or a failing one assigns
// nothing, and the Rationale says why. Roles are roles.json's names.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { verifyModel } from '../dist/index.js';
import { makeServer, definitionsFolder } from './helpers.mjs';

/** A policy: a DMN table, hit policy FIRST, inputs amount and department; outputs as given, a rule each. */
const POLICY = (rules, outputs = ['assignee', 'candidateGroups']) => `<?xml version="1.0" encoding="UTF-8"?>
<definitions xmlns="https://www.omg.org/spec/DMN/20191111/MODEL/" id="policy" name="Policy">
  <decision id="Approval" name="Approval">
    <decisionTable hitPolicy="FIRST">
      <input id="i1" label="amount"><inputExpression typeRef="number"><text>amount</text></inputExpression></input>
      <input id="i2" label="department"><inputExpression typeRef="string"><text>department</text></inputExpression></input>
${outputs.map((o, i) => `      <output id="o${i}" name="${o}" typeRef="string" />`).join('\n')}
${rules.map(([amount, department, ...cells], r) => `      <rule id="r${r}">
        <inputEntry id="r${r}a"><text>${amount}</text></inputEntry><inputEntry id="r${r}b"><text>${department}</text></inputEntry>
${cells.map((c, i) => `        <outputEntry id="r${r}o${i}"><text>${c}</text></outputEntry>`).join('\n')}
      </rule>`).join('\n')}
    </decisionTable>
  </decision>
</definitions>`;

const APPROVAL = POLICY([
    ['&gt; 10000', '-', '', '"Director"'],
    ['-', '"IT"', '', '"ITManager,Admins"'],
    ['-', '"HR"', '$(appServices.managerOf(data.requesterId))', ''],
    ['-', '"Sales"', 'requesterId', ''],
]);

/** A model: Approve (in the Managers lane), with these attributes. */
const MODEL = (attrs = 'camunda:assignmentPolicy="Approval"') => `<?xml version="1.0" encoding="UTF-8"?>
<bpmn:definitions xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:camunda="http://camunda.org/schema/1.0/bpmn"
    id="Defs" targetNamespace="http://bpmn.io/schema/bpmn">
  <bpmn:process id="Request" isExecutable="true">
    <bpmn:laneSet id="ls"><bpmn:lane id="L" name="Managers"><bpmn:flowNodeRef>Approve</bpmn:flowNodeRef></bpmn:lane></bpmn:laneSet>
    <bpmn:startEvent id="Start"><bpmn:outgoing>f1</bpmn:outgoing></bpmn:startEvent>
    <bpmn:userTask id="Approve" name="Approve" ${attrs}><bpmn:incoming>f1</bpmn:incoming><bpmn:outgoing>f2</bpmn:outgoing></bpmn:userTask>
    <bpmn:endEvent id="End"><bpmn:incoming>f2</bpmn:incoming></bpmn:endEvent>
    <bpmn:sequenceFlow id="f1" sourceRef="Start" targetRef="Approve" /><bpmn:sequenceFlow id="f2" sourceRef="Approve" targetRef="End" />
  </bpmn:process>
</bpmn:definitions>`;

async function server({ model = MODEL(), policy = APPROVAL, roles } = {}) {
    const dir = definitionsFolder();
    fs.writeFileSync(path.join(dir, 'Request.bpmn'), model);
    if (policy) {
        fs.mkdirSync(path.join(dir, 'policies'), { recursive: true });
        fs.writeFileSync(path.join(dir, 'policies', 'Approval.dmn.xml'), policy);
    }
    if (roles) fs.writeFileSync(path.join(dir, 'roles.json'), JSON.stringify(roles));
    const made = await makeServer({ dir, services: { managerOf: id => `manager-of-${id}` } });
    return { ...made, dir };
}

/** The started task, as saved, and the Rationale entries about it. */
async function approve(srv, data) {
    const { id } = await srv.engine.start('Request', data, null, 'ann');
    const [instance] = await srv.dataStore.findInstances({ id }, 'full');
    const task = instance.items.find(i => i.elementId === 'Approve');
    const entries = instance.logs.filter(l => l.type === 'decision' && /user task 'Approve'/.test(l.element ?? l.message));
    return { task, entries, why: entries.map(e => e.message).join('\n') };
}

test('the first matching rule assigns; the policy wins over the lane; what decided is kept', async () => {
    const { server: srv } = await server();
    let { task, entries, why } = await approve(srv, { amount: 20000, department: 'IT' });
    assert.deepEqual(task.candidateGroups, ['Director'], 'rule 1, before rule 2; the lane group replaced');
    assert.equal(task.assignee, undefined);
    assert.deepEqual(task.assignment, { policy: 'Approval', rule: 1 });
    assert.equal(task.status, 'wait');
    assert.equal(entries[0].action, 'is offered to Director', why);
    assert.match(why, /policy Approval, rule 1/);

    ({ task } = await approve(srv, { amount: 50, department: 'IT' }));
    assert.deepEqual(task.candidateGroups, ['ITManager', 'Admins'], 'text with commas is a list');
    assert.deepEqual(task.assignment, { policy: 'Approval', rule: 2 });
    await srv.shutdown();
});

test("a rule's output is an expression: a model expression through the application's code, or FEEL on the data", async () => {
    const { server: srv } = await server();
    let { task, entries } = await approve(srv, { amount: 50, department: 'HR', requesterId: 'emp-7' });
    assert.equal(task.assignee, 'manager-of-emp-7', '$(appServices.managerOf(data.requesterId))');
    assert.deepEqual(task.candidateGroups, ['Managers'], 'a field the rule leaves empty keeps the lane');
    assert.equal(entries[0].action, 'is assigned to manager-of-emp-7');
    ({ task } = await approve(srv, { amount: 50, department: 'Sales', requesterId: 'emp-9' }));
    assert.equal(task.assignee, 'emp-9', 'FEEL: requesterId');
    await srv.shutdown();
});

test("the policy wins over the task's own attributes, for each field its rule sets", async () => {
    const { server: srv } = await server({ model: MODEL('camunda:assignee="bob" camunda:candidateGroups="Clerks" camunda:assignmentPolicy="Approval"') });
    let { task } = await approve(srv, { amount: 20000 });
    assert.equal(task.assignee, 'bob', 'rule 1 sets no assignee');
    assert.deepEqual(task.candidateGroups, ['Director'], 'rule 1 sets the groups');
    ({ task } = await approve(srv, { department: 'HR', requesterId: 'emp-1' }));
    assert.equal(task.assignee, 'manager-of-emp-1');
    await srv.shutdown();
});

test('no rule matches, no policy, a failing policy: nothing assigned by it, the Rationale says why, the task waits', async () => {
    let { server: srv } = await server();
    let { task, entries, why } = await approve(srv, { amount: 50, department: 'Legal' });
    assert.equal(task.status, 'wait');
    assert.equal(task.assignee, undefined);
    assert.deepEqual(task.candidateGroups, ['Managers'], 'what the lane gave stays');
    assert.equal(task.assignment, undefined);
    assert.equal(entries[0].action, 'is not assigned by its policy');
    assert.match(why, /no rule matched/);
    await srv.shutdown();

    ({ server: srv } = await server({ policy: null }));
    ({ task, why } = await approve(srv, { amount: 50 }));
    assert.equal(task.status, 'wait');
    assert.match(why, /there is no policies\/Approval\.dmn\.xml/);
    await srv.shutdown();

    ({ server: srv } = await server({ policy: POLICY([['-', '-', '$(appServices.noSuchService(1))', '']]) }));
    ({ task, why } = await approve(srv, { amount: 50 }));
    assert.equal(task.status, 'wait');
    assert.equal(task.assignee, undefined);
    assert.match(why, /the policy failed/);
    await srv.shutdown();
});

test('verifyModel: a policy that is not there, an output that is not a field, groups and lanes not in roles.json', async () => {
    let { server: srv } = await server({ policy: null });
    let result = await verifyModel(MODEL(), srv, 'Request');
    assert.ok(result.issues.some(i => i.code === 'assignment-policy-not-found' && i.severity === 'error' && i.elementId === 'Approve'), JSON.stringify(result.issues));
    await srv.shutdown();

    ({ server: srv } = await server({ policy: POLICY([['-', '-', '"x"', '"Director"', '"y"']], ['assignee', 'candidateGroups', 'approver']), roles: ['Director'] }));
    result = await verifyModel(MODEL(), srv, 'Request');
    const codes = result.issues.map(i => `${i.code}: ${i.message}`);
    assert.ok(codes.some(c => /^assignment-policy-output: .*output 'approver'/.test(c)), codes.join('\n'));
    assert.ok(codes.some(c => /^role-unknown: Lane 'Managers'/.test(c)), codes.join('\n'));
    assert.ok(!codes.some(c => /'Director' is not a role/.test(c)));
    await srv.shutdown();

    ({ server: srv } = await server({ roles: ['Director', 'Managers'] }));
    result = await verifyModel(MODEL(), srv, 'Request');
    assert.ok(result.issues.some(i => i.code === 'role-unknown' && /rule 2: 'ITManager'/.test(i.message)), JSON.stringify(result.issues));
    assert.ok(!result.issues.some(i => i.code === 'assignment-policy-not-found'));
    await srv.shutdown();
});
