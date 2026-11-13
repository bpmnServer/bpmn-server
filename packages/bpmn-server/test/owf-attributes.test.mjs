// @features: assignment-policies, labels, security-policies
// OWF's own model attributes are in the owf: namespace (docs/design/owf-namespace.md): owf:assignmentPolicy,
// owf:label, owf:endLabel, owf:exceptionsAsErrors. A model saved before, with them as camunda:, works the same, and
// verifyModel warns that the editor saves them as owf:.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { modelLabels, verifyModel, owfAttribute, legacyAttributes, OWF_NAMESPACE } from '../dist/index.js';
import { makeServer, definitionsFolder } from './helpers.mjs';

const POLICY = `<?xml version="1.0" encoding="UTF-8"?>
<definitions xmlns="https://www.omg.org/spec/DMN/20191111/MODEL/" id="policy" name="Policy">
  <decision id="Approval" name="Approval"><decisionTable hitPolicy="FIRST">
    <input id="i1" label="amount"><inputExpression typeRef="number"><text>amount</text></inputExpression></input>
    <output id="o1" name="candidateGroups" typeRef="string" />
    <rule id="r1"><inputEntry id="a"><text>&gt; 100</text></inputEntry><outputEntry id="b"><text>"Director"</text></outputEntry></rule>
  </decisionTable></decision>
</definitions>`;

/** Approve (a policy, a label, a label once done) then a script that throws, caught by an error event; `p` the prefix. */
const MODEL = p => `<?xml version="1.0" encoding="UTF-8"?>
<bpmn:definitions xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:camunda="http://camunda.org/schema/1.0/bpmn"
    xmlns:owf="${OWF_NAMESPACE}" id="Defs" targetNamespace="urn:test">
  <bpmn:process id="Request" isExecutable="true" ${p}:label="Request \${Amount = data.amount}">
    <bpmn:startEvent id="Start"><bpmn:outgoing>f1</bpmn:outgoing></bpmn:startEvent>
    <bpmn:userTask id="Approve" name="Approve" ${p}:assignmentPolicy="Approval" ${p}:label="Approve \${data.amount}"
        ${p}:endLabel="Approved by \${completedBy}"><bpmn:incoming>f1</bpmn:incoming><bpmn:outgoing>f2</bpmn:outgoing></bpmn:userTask>
    <bpmn:scriptTask id="Work" scriptFormat="JavaScript" ${p}:exceptionsAsErrors="true"><bpmn:incoming>f2</bpmn:incoming><bpmn:outgoing>f3</bpmn:outgoing>
      <bpmn:script>throw new RangeError("too much");</bpmn:script></bpmn:scriptTask>
    <bpmn:boundaryEvent id="Failed" attachedToRef="Work"><bpmn:outgoing>f4</bpmn:outgoing><bpmn:errorEventDefinition /></bpmn:boundaryEvent>
    <bpmn:endEvent id="Done"><bpmn:incoming>f3</bpmn:incoming></bpmn:endEvent>
    <bpmn:endEvent id="Caught"><bpmn:incoming>f4</bpmn:incoming></bpmn:endEvent>
    <bpmn:sequenceFlow id="f1" sourceRef="Start" targetRef="Approve" /><bpmn:sequenceFlow id="f2" sourceRef="Approve" targetRef="Work" />
    <bpmn:sequenceFlow id="f3" sourceRef="Work" targetRef="Done" /><bpmn:sequenceFlow id="f4" sourceRef="Failed" targetRef="Caught" />
  </bpmn:process>
</bpmn:definitions>`;

async function server(model) {
    const dir = definitionsFolder();
    fs.writeFileSync(path.join(dir, 'Request.bpmn'), model);
    fs.mkdirSync(path.join(dir, 'policies', 'assignment'), { recursive: true });
    fs.writeFileSync(path.join(dir, 'policies', 'assignment', 'Approval.dmn.xml'), POLICY);
    return (await makeServer({ dir })).server;
}

for (const prefix of ['owf', 'camunda']) {
    test(`${prefix}: the policy assigns, the labels are read, an exception is raised as an error`, async () => {
        const labels = await modelLabels(MODEL(prefix));
        assert.equal(labels.process, 'Request ${Amount = data.amount}');
        assert.deepEqual(labels.elements.get('Approve'), { label: 'Approve ${data.amount}', endLabel: 'Approved by ${completedBy}' });

        const srv = await server(MODEL(prefix));
        const { id } = await srv.engine.start('Request', { amount: 500 }, null, 'ann');
        let [instance] = await srv.dataStore.findInstances({ id }, 'full');
        const approve = instance.items.find(i => i.elementId === 'Approve');
        assert.deepEqual(approve.candidateGroups, ['Director']);
        assert.deepEqual(approve.assignment, { policy: 'Approval', rule: 1 });

        await srv.engine.invoke({ 'items.id': approve.id }, {}, 'dora');
        [instance] = await srv.dataStore.findInstances({ id }, 'full');
        assert.equal(instance.items.find(i => i.elementId === 'Caught')?.status, 'end', 'the exception was raised as a BPMN error');
        await srv.shutdown();
    });
}

test('owf: is read first; verifyModel warns of each OWF attribute still under camunda:, and of none under owf:', async () => {
    assert.equal(owfAttribute({ $attrs: { 'owf:label': 'new', 'camunda:label': 'old' } }, 'label'), 'new');
    assert.equal(owfAttribute({ $attrs: { 'camunda:label': 'old' } }, 'label'), 'old');
    assert.deepEqual(legacyAttributes({ $attrs: { 'camunda:label': 'x', 'camunda:assignee': 'y', 'owf:endLabel': 'z' } }), ['label'],
        'camunda:assignee is Camunda\'s own');

    const srv = await server(MODEL('owf'));
    const legacy = await verifyModel(MODEL('camunda'), srv, 'Request');
    const warned = legacy.issues.filter(i => i.code === 'owf-attribute-legacy');
    assert.deepEqual(warned.map(i => `${i.elementId ?? 'process'}: ${/camunda:(\w+)/.exec(i.message)[1]}`).sort(),
        ['Approve: assignmentPolicy', 'Approve: endLabel', 'Approve: label', 'Request: label', 'Work: exceptionsAsErrors'].sort(),
        JSON.stringify(legacy.issues));
    assert.ok(warned.every(i => i.severity === 'warning'));
    assert.match(warned[0].message, /saves it as owf:/);

    const current = await verifyModel(MODEL('owf'), srv, 'Request');
    assert.deepEqual(current.issues.filter(i => i.code === 'owf-attribute-legacy'), []);
    assert.ok(!current.issues.some(i => i.code === 'assignment-policy-not-found'), 'owf:assignmentPolicy is checked as before');
    await srv.shutdown();
});

test('verifyModel: an actor the model, its policies or its decisions read that no element is (owf:actor)', async () => {
    const model = MODEL('owf').replace('<bpmn:userTask id="Approve" name="Approve"', '<bpmn:userTask id="Approve" name="Approve" owf:actor="approver"')
        .replace('throw new RangeError("too much");', 'data.who = actors.approver + actors.aprover;');
    const srv = await server(model);
    fs.writeFileSync(path.join(srv.configuration.definitionsPath, 'policies', 'assignment', 'Approval.dmn.xml'),
        POLICY.replace('<text>amount</text>', '<text>actors.reviewer</text>'));
    const { issues } = await verifyModel(model, srv, 'Request');
    const unknown = issues.filter(i => i.code === 'actor-unknown').map(i => i.message);
    assert.equal(unknown.length, 2, unknown.join('\n'));
    assert.match(unknown.join('\n'), /actors\.aprover \(the model\): no element of the model is the actor 'aprover'.*its actors are initiator, assignee, candidate, approver/);
    assert.match(unknown.join('\n'), /actors\.reviewer \(assignment policy Approval\)/);
    await srv.shutdown();
});
