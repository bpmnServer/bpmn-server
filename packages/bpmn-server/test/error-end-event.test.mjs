// @features: errors-escalations
// An error end event outside any sub-process: there is nothing around it to cancel. The error goes to what catches it, or
// the instance ends there.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { makeServer } from './helpers.mjs';

const model = handler => `<?xml version="1.0" encoding="UTF-8"?>
<bpmn:definitions xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" id="d" targetNamespace="urn:test">
<bpmn:error id="E" errorCode="E1" />
<bpmn:process id="p" isExecutable="true">
  <bpmn:startEvent id="start" />
  <bpmn:exclusiveGateway id="which" />
  <bpmn:endEvent id="thrown"><bpmn:errorEventDefinition errorRef="E" /></bpmn:endEvent>
  <bpmn:sequenceFlow id="f0" sourceRef="start" targetRef="which" />
  <bpmn:sequenceFlow id="f1" sourceRef="which" targetRef="thrown" />
  ${handler}
</bpmn:process></bpmn:definitions>`;

const HANDLER = `<bpmn:subProcess id="handler" triggeredByEvent="true">
    <bpmn:startEvent id="catching"><bpmn:errorEventDefinition errorRef="E" /></bpmn:startEvent>
    <bpmn:task id="handle" />
    <bpmn:endEvent id="handled" />
    <bpmn:sequenceFlow id="h0" sourceRef="catching" targetRef="handle" />
    <bpmn:sequenceFlow id="h1" sourceRef="handle" targetRef="handled" />
  </bpmn:subProcess>`;

async function run(xml) {
  const made = await makeServer({});
  fs.writeFileSync(made.dir + 'm.bpmn', xml);
  await made.server.definitions.rebuild();
  return (await made.server.engine.start('m', {})).instance;
}
const status = (instance, id) => instance.items.find(i => i.elementId === id)?.status;

test('caught by an event sub-process: the handler runs, and the instance ends', async () => {
  const instance = await run(model(HANDLER));
  assert.equal(status(instance, 'handle'), 'end');
  assert.equal(status(instance, 'handled'), 'end');
  assert.equal(status(instance, 'thrown'), 'end');
  assert.equal(instance.status, 'end');
});

test('caught by nothing: the instance ends there, as one inside a sub-process does', async () => {
  const instance = await run(model(''));
  assert.equal(status(instance, 'thrown'), 'end');
  assert.equal(instance.status, 'end');
});
