import test from 'node:test';
import assert from 'node:assert/strict';
import { Definition } from '../dist/elements/Definition.js';

test('loading a definition again does not repeat its flows', async () => {
  const source = `<?xml version="1.0" encoding="UTF-8"?>
    <bpmn:definitions xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" id="d" targetNamespace="urn:test">
      <bpmn:process id="P" isExecutable="true">
        <bpmn:startEvent id="s" />
        <bpmn:exclusiveGateway id="g" default="f2" />
        <bpmn:endEvent id="e1" />
        <bpmn:endEvent id="e2" />
        <bpmn:sequenceFlow id="f1" sourceRef="s" targetRef="g" />
        <bpmn:sequenceFlow id="f2" sourceRef="g" targetRef="e1" />
        <bpmn:sequenceFlow id="f3" sourceRef="g" targetRef="e2"><bpmn:conditionExpression>data.x</bpmn:conditionExpression></bpmn:sequenceFlow>
      </bpmn:process>
    </bpmn:definitions>`;
  const server = { appDelegate: { moddleOptions: {} }, logger: {}, listener: { emit: async () => {} } };
  const definition = new Definition('twice', source, server);

  await definition.load();
  await definition.load();

  assert.deepEqual(definition.flows.map(f => f.id), ['f1', 'f2', 'f3']);
  assert.deepEqual(JSON.parse(definition.getJson()).flows.map(f => f.id), ['f1', 'f2', 'f3']);
  assert.equal(definition.getNodeById('g').outbounds.length, 2, 'the nodes are the second load\'s, with their own flows');
});

test('a user task whose form has no fields is described (the instance page reads getJson)', async () => {
  const { makeServer } = await import('./helpers.mjs');
  const fs = (await import('node:fs')).default;
  const made = await makeServer();
  fs.writeFileSync(made.dir + 'empty-form.bpmn', `<?xml version="1.0" encoding="UTF-8"?>
<bpmn:definitions xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:camunda="http://camunda.org/schema/1.0/bpmn" id="d" targetNamespace="urn:test">
  <bpmn:process id="p" isExecutable="true">
    <bpmn:startEvent id="start" />
    <bpmn:userTask id="task"><bpmn:extensionElements><camunda:formData /></bpmn:extensionElements></bpmn:userTask>
    <bpmn:endEvent id="end" />
    <bpmn:sequenceFlow id="f0" sourceRef="start" targetRef="task" />
    <bpmn:sequenceFlow id="f1" sourceRef="task" targetRef="end" />
  </bpmn:process>
</bpmn:definitions>`);
  await made.server.definitions.rebuild();
  const definition = await made.server.definitions.load('empty-form');
  assert.doesNotThrow(() => definition.getJson());
  await made.server.shutdown();
});
