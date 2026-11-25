// The feature catalog (docs/features.yaml): every docs, code and test reference is there, and the tests' tags are the
// catalog's. To fix: correct the catalog, then `npm run features` (it tags the tests and writes docs/docs/features.md).
import test from 'node:test';
import assert from 'node:assert/strict';
import { check, tagsUpToDate } from '../../../../scripts/features.mjs';

test('the feature catalog: its references are there, and the tests carry its tags', () => {
    const { problems, byTest } = check();
    assert.deepEqual(problems, []);
    assert.deepEqual(tagsUpToDate(byTest), [], 'tags out of date: npm run features');
});

test('a feature\'s xml markers find it in a model: elements, attributes, children; whatever the prefixes; where, by id', async () => {
    const { parseXml, find, modelFeatures, parseMarker } = await import('../../../../scripts/features.mjs');
    const model = `<?xml version="1.0"?>
<!-- a comment <bpmn:userTask id="NotThis"/> -->
<bpmn2:definitions xmlns:bpmn2="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:camunda="http://camunda.org/schema/1.0/bpmn">
  <bpmn2:process id="P">
    <bpmn2:startEvent id="Asked" camunda:formKey="leave-form"><bpmn2:timerEventDefinition id="Def1"/></bpmn2:startEvent>
    <bpmn2:subProcess id="Sub" triggeredByEvent="true"><userTask id="Inner" camunda:assignee="sam"/></bpmn2:subProcess>
    <bpmn2:serviceTask id="Call"><bpmn2:extensionElements><camunda:connector><camunda:connectorId>hr/get</camunda:connectorId></camunda:connector></bpmn2:extensionElements></bpmn2:serviceTask>
    <bpmn2:sequenceFlow id="F1"><bpmn2:conditionExpression><![CDATA[data.x > 1 && <bpmn:userTask/>]]></bpmn2:conditionExpression></bpmn2:sequenceFlow>
  </bpmn2:process>
</bpmn2:definitions>`;
    const tree = parseXml(model);
    const ids = marker => find(tree, marker).map(e => e.attrs.id ?? e.name);
    assert.deepEqual(ids('bpmn:userTask'), ['Inner'], 'by the local name: bpmn2:, or no prefix; not in a comment or CDATA');
    assert.deepEqual(ids('[camunda:formKey]'), ['Asked']);
    assert.deepEqual(ids('bpmn:subProcess[triggeredByEvent=true]'), ['Sub']);
    assert.deepEqual(ids('bpmn:subProcess[triggeredByEvent=false]'), []);
    assert.deepEqual(ids('bpmn:startEvent > bpmn:timerEventDefinition'), ['Def1']);
    assert.deepEqual(ids('bpmn:serviceTask camunda:connector'), ['connector'], 'inside, at any depth');
    assert.deepEqual(ids('bpmn:serviceTask > camunda:connector'), [], 'directly inside: not');
    assert.throws(() => parseMarker('bpmn:userTask >'), /not a marker/);
    assert.throws(() => parseMarker('bpmn:user Task!'), /not a marker/);

    const catalog = { features: [
        { id: 'timers', name: 'Timers', xml: ['bpmn:timerEventDefinition'] },
        { id: 'connectors', name: 'Connectors', xml: ['bpmn:serviceTask camunda:connector'] },
        { id: 'forms', name: 'Forms', xml: ['[camunda:formKey]'] },
        { id: 'expressions', name: 'Expressions', xml: ['bpmn:conditionExpression'] },
        { id: 'dmn', name: 'DMN', xml: ['dmn:decisionTable'] },
    ] };
    assert.deepEqual(modelFeatures(model, catalog).map(({ id, at }) => [id, at]), [
        ['timers', ['Asked']], ['connectors', ['Call']], ['forms', ['Asked']], ['expressions', ['F1']],
    ], 'where: the element a person sees (the event, not its definition; the flow, not its condition)');
});

test('a marker\'s prefixed attribute is an extension\'s: [camunda:label] is not a plain label="..." (a DMN input\'s, a form field\'s)', async () => {
    const { parseXml, find } = await import('../../../../scripts/features.mjs');
    const tree = parseXml(`<definitions xmlns:camunda="http://camunda.org/schema/1.0/bpmn">
      <process id="P" camunda:label="Leave by \${data.requester}"><userTask id="T"><formField id="F" label="Days" /></userTask></process>
      <decision id="D"><input id="In" label="Amount" /></decision></definitions>`);
    assert.deepEqual(find(tree, '[camunda:label]').map(e => e.attrs.id), ['P']);
    assert.deepEqual(find(tree, '[label]').map(e => e.attrs.id), ['P', 'F', 'In'], 'unprefixed: by its local name, prefixed or not');
});
