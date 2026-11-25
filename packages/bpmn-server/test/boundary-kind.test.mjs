// @features: errors-escalations
// An escalation is caught by an escalation event, an error by an error event: a boundary event of the other kind on the
// same task is not a catch-all for it. Before, any boundary event without the thrown kind's definition counted as one,
// so a script's escalation went to the task's error boundary event (found writing testSampleApp's test-escalation2
// scenario), and an error could go to an escalation boundary event.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { makeServer, definitionsFolder } from './helpers.mjs';

/**
 * `Work` (a script returning `result`) has an error boundary event (code E1) and an escalation boundary event (code
 * other), each to its own task; an escalation event subprocess (any code) is in the process too. Work goes on to Next.
 */
const model = (id, result) => `<?xml version="1.0" encoding="UTF-8"?>
<bpmn:definitions xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" id="D_${id}" targetNamespace="http://bpmn.io/schema/bpmn">
  <bpmn:error id="E1" errorCode="E1" />
  <bpmn:escalation id="Other" escalationCode="other" />
  <bpmn:process id="${id}" isExecutable="true">
    <bpmn:startEvent id="S"><bpmn:outgoing>f1</bpmn:outgoing></bpmn:startEvent>
    <bpmn:scriptTask id="Work" scriptFormat="JavaScript"><bpmn:incoming>f1</bpmn:incoming><bpmn:outgoing>f2</bpmn:outgoing>
      <bpmn:script>return ${result};</bpmn:script></bpmn:scriptTask>
    <bpmn:boundaryEvent id="OnError" attachedToRef="Work"><bpmn:outgoing>f3</bpmn:outgoing><bpmn:errorEventDefinition errorRef="E1" /></bpmn:boundaryEvent>
    <bpmn:boundaryEvent id="OnOther" attachedToRef="Work" cancelActivity="false"><bpmn:outgoing>f4</bpmn:outgoing><bpmn:escalationEventDefinition escalationRef="Other" /></bpmn:boundaryEvent>
    <bpmn:userTask id="ErrorHandled"><bpmn:incoming>f3</bpmn:incoming></bpmn:userTask>
    <bpmn:userTask id="OtherHandled"><bpmn:incoming>f4</bpmn:incoming></bpmn:userTask>
    <bpmn:userTask id="Next"><bpmn:incoming>f2</bpmn:incoming></bpmn:userTask>
    <bpmn:subProcess id="AnyEscalation" triggeredByEvent="true">
      <bpmn:startEvent id="EscStart" isInterrupting="false"><bpmn:outgoing>e1</bpmn:outgoing><bpmn:escalationEventDefinition /></bpmn:startEvent>
      <bpmn:userTask id="EscalationHandled"><bpmn:incoming>e1</bpmn:incoming></bpmn:userTask>
      <bpmn:sequenceFlow id="e1" sourceRef="EscStart" targetRef="EscalationHandled" />
    </bpmn:subProcess>
    <bpmn:sequenceFlow id="f1" sourceRef="S" targetRef="Work" />
    <bpmn:sequenceFlow id="f2" sourceRef="Work" targetRef="Next" />
    <bpmn:sequenceFlow id="f3" sourceRef="OnError" targetRef="ErrorHandled" />
    <bpmn:sequenceFlow id="f4" sourceRef="OnOther" targetRef="OtherHandled" />
  </bpmn:process>
</bpmn:definitions>`;

async function server() {
  const dir = definitionsFolder();
  fs.writeFileSync(path.join(dir, 'Escalates.bpmn'), model('Escalates', "{ escalation: 'review' }"));
  fs.writeFileSync(path.join(dir, 'Fails.bpmn'), model('Fails', "{ bpmnError: 'E1' }"));
  fs.writeFileSync(path.join(dir, 'FailsOther.bpmn'), model('FailsOther', "{ bpmnError: 'E2' }"));
  return (await makeServer({ dir })).server;
}

const reached = (instance, id) => instance.items.some(i => i.elementId === id && i.status !== 'end' || i.elementId === id && i.type === 'bpmn:UserTask');

test('an escalation is not caught by the task\'s error boundary event', async () => {
  const srv = await server();
  const { instance } = await srv.engine.start('Escalates', {});
  assert.ok(!reached(instance, 'ErrorHandled'), 'the error boundary event did not catch it');
  assert.ok(!reached(instance, 'OtherHandled'), 'nor the escalation boundary event for another code');
  assert.ok(reached(instance, 'EscalationHandled'), 'the escalation event subprocess caught it');
  assert.ok(reached(instance, 'Next'), 'and the task went on');
  await srv.shutdown();
});

test('an error is caught by its error boundary event, and by no escalation boundary event', async () => {
  const srv = await server();
  const { instance } = await srv.engine.start('Fails', {});
  assert.ok(reached(instance, 'ErrorHandled'), 'the error boundary event for E1 caught it');
  assert.ok(!reached(instance, 'OtherHandled'), 'the escalation boundary event did not');
  assert.ok(!reached(instance, 'Next'));
  const other = (await srv.engine.start('FailsOther', {})).instance;
  assert.ok(!reached(other, 'ErrorHandled'), 'an error E2: not the boundary event for E1');
  assert.ok(!reached(other, 'OtherHandled'), 'nor the escalation boundary event, as a catch-all');
  await srv.shutdown();
});
