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
