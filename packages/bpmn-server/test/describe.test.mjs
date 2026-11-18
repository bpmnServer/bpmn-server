// @features: instance-page, messages-signals, errors-escalations, timers
// What a model says of each of its elements (`Definition.getJson`, which the instance page reads, and the designer's
// descriptions): each behaviour's `describe()` is a list of [label, text] pairs. Before, an error or an escalation event
// said it was a message ("catches message"), and a signal event gave one pair, not a list of them, so the designer
// (which keeps only the pairs) dropped it.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { makeServer, definitionsFolder } from './helpers.mjs';
import { BehaviourLoader, Behaviour } from '../dist/index.js';

const model = `<?xml version="1.0" encoding="UTF-8"?>
<bpmn:definitions xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:camunda="http://camunda.org/schema/1.0/bpmn"
    id="D_Described" targetNamespace="http://bpmn.io/schema/bpmn">
  <bpmn:message id="M1" name="Order" />
  <bpmn:signal id="G1" name="Go" />
  <bpmn:error id="E1" errorCode="Bad" />
  <bpmn:escalation id="X1" escalationCode="Late" />
  <bpmn:process id="Described" isExecutable="true">
    <bpmn:startEvent id="Start"><bpmn:outgoing>f1</bpmn:outgoing></bpmn:startEvent>
    <bpmn:scriptTask id="Each" scriptFormat="JavaScript"><bpmn:incoming>f1</bpmn:incoming><bpmn:outgoing>f2</bpmn:outgoing>
      <bpmn:multiInstanceLoopCharacteristics isSequential="true" camunda:collection="\${data.items}" />
      <bpmn:script>return 1;</bpmn:script></bpmn:scriptTask>
    <bpmn:scriptTask id="All" scriptFormat="JavaScript"><bpmn:incoming>f2</bpmn:incoming><bpmn:outgoing>f3</bpmn:outgoing>
      <bpmn:multiInstanceLoopCharacteristics camunda:collection="\${data.items}" />
      <bpmn:script>return 1;</bpmn:script></bpmn:scriptTask>
    <bpmn:userTask id="Review" camunda:assignee="ann" camunda:candidateGroups="managers" camunda:priority="2">
      <bpmn:incoming>f3</bpmn:incoming><bpmn:outgoing>f4</bpmn:outgoing></bpmn:userTask>
    <bpmn:serviceTask id="Call"><bpmn:extensionElements><camunda:connector><camunda:connectorId>crm/findCustomer</camunda:connectorId>
        <camunda:inputOutput><camunda:inputParameter name="email">\${data.email}</camunda:inputParameter></camunda:inputOutput>
      </camunda:connector></bpmn:extensionElements>
      <bpmn:incoming>f4</bpmn:incoming><bpmn:outgoing>f5</bpmn:outgoing></bpmn:serviceTask>
    <bpmn:intermediateThrowEvent id="SendOrder"><bpmn:incoming>f5</bpmn:incoming><bpmn:outgoing>f6</bpmn:outgoing>
      <bpmn:messageEventDefinition messageRef="M1" /></bpmn:intermediateThrowEvent>
    <bpmn:intermediateThrowEvent id="SendGo"><bpmn:incoming>f6</bpmn:incoming><bpmn:outgoing>f7</bpmn:outgoing>
      <bpmn:signalEventDefinition signalRef="G1" /></bpmn:intermediateThrowEvent>
    <bpmn:intermediateThrowEvent id="RaiseLate"><bpmn:incoming>f7</bpmn:incoming><bpmn:outgoing>f8</bpmn:outgoing>
      <bpmn:escalationEventDefinition escalationRef="X1" /></bpmn:intermediateThrowEvent>
    <bpmn:intermediateCatchEvent id="Wait"><bpmn:incoming>f8</bpmn:incoming><bpmn:outgoing>f9</bpmn:outgoing>
      <bpmn:timerEventDefinition><bpmn:timeDuration>PT1H</bpmn:timeDuration></bpmn:timerEventDefinition></bpmn:intermediateCatchEvent>
    <bpmn:intermediateCatchEvent id="Daily"><bpmn:incoming>f9</bpmn:incoming><bpmn:outgoing>f10</bpmn:outgoing>
      <bpmn:timerEventDefinition><bpmn:timeCycle>R3/PT1H</bpmn:timeCycle></bpmn:timerEventDefinition></bpmn:intermediateCatchEvent>
    <bpmn:intermediateCatchEvent id="OnDate"><bpmn:incoming>f10</bpmn:incoming><bpmn:outgoing>f11</bpmn:outgoing>
      <bpmn:timerEventDefinition><bpmn:timeDate>2030-01-01T00:00:00Z</bpmn:timeDate></bpmn:timerEventDefinition></bpmn:intermediateCatchEvent>
    <bpmn:intermediateCatchEvent id="GetOrder"><bpmn:incoming>f11</bpmn:incoming><bpmn:outgoing>f12</bpmn:outgoing>
      <bpmn:messageEventDefinition messageRef="M1" /></bpmn:intermediateCatchEvent>
    <bpmn:intermediateCatchEvent id="GetGo"><bpmn:incoming>f12</bpmn:incoming><bpmn:outgoing>f13</bpmn:outgoing>
      <bpmn:signalEventDefinition signalRef="G1" /></bpmn:intermediateCatchEvent>
    <bpmn:transaction id="Trans"><bpmn:incoming>f13</bpmn:incoming><bpmn:outgoing>f14</bpmn:outgoing>
      <bpmn:startEvent id="TStart"><bpmn:outgoing>t1</bpmn:outgoing></bpmn:startEvent>
      <bpmn:intermediateThrowEvent id="Undo"><bpmn:incoming>t1</bpmn:incoming><bpmn:outgoing>t2</bpmn:outgoing>
        <bpmn:compensateEventDefinition /></bpmn:intermediateThrowEvent>
      <bpmn:endEvent id="CancelIt"><bpmn:incoming>t2</bpmn:incoming><bpmn:cancelEventDefinition /></bpmn:endEvent>
      <bpmn:sequenceFlow id="t1" sourceRef="TStart" targetRef="Undo" />
      <bpmn:sequenceFlow id="t2" sourceRef="Undo" targetRef="CancelIt" />
    </bpmn:transaction>
    <bpmn:boundaryEvent id="OnBad" attachedToRef="Review"><bpmn:outgoing>f15</bpmn:outgoing><bpmn:errorEventDefinition errorRef="E1" /></bpmn:boundaryEvent>
    <bpmn:boundaryEvent id="OnAnyError" attachedToRef="Call"><bpmn:outgoing>f16</bpmn:outgoing><bpmn:errorEventDefinition /></bpmn:boundaryEvent>
    <bpmn:boundaryEvent id="OnLate" attachedToRef="Call" cancelActivity="false"><bpmn:outgoing>f17</bpmn:outgoing><bpmn:escalationEventDefinition escalationRef="X1" /></bpmn:boundaryEvent>
    <bpmn:endEvent id="Fail"><bpmn:incoming>f15</bpmn:incoming><bpmn:errorEventDefinition errorRef="E1" /></bpmn:endEvent>
    <bpmn:endEvent id="Stop"><bpmn:incoming>f16</bpmn:incoming><bpmn:incoming>f17</bpmn:incoming><bpmn:terminateEventDefinition /></bpmn:endEvent>
    <bpmn:endEvent id="End"><bpmn:incoming>f14</bpmn:incoming></bpmn:endEvent>
    <bpmn:sequenceFlow id="f1" sourceRef="Start" targetRef="Each" />
    <bpmn:sequenceFlow id="f2" sourceRef="Each" targetRef="All" />
    <bpmn:sequenceFlow id="f3" sourceRef="All" targetRef="Review" />
    <bpmn:sequenceFlow id="f4" sourceRef="Review" targetRef="Call" />
    <bpmn:sequenceFlow id="f5" sourceRef="Call" targetRef="SendOrder" />
    <bpmn:sequenceFlow id="f6" sourceRef="SendOrder" targetRef="SendGo" />
    <bpmn:sequenceFlow id="f7" sourceRef="SendGo" targetRef="RaiseLate" />
    <bpmn:sequenceFlow id="f8" sourceRef="RaiseLate" targetRef="Wait" />
    <bpmn:sequenceFlow id="f9" sourceRef="Wait" targetRef="Daily" />
    <bpmn:sequenceFlow id="f10" sourceRef="Daily" targetRef="OnDate" />
    <bpmn:sequenceFlow id="f11" sourceRef="OnDate" targetRef="GetOrder" />
    <bpmn:sequenceFlow id="f12" sourceRef="GetOrder" targetRef="GetGo" />
    <bpmn:sequenceFlow id="f13" sourceRef="GetGo" targetRef="Trans" />
    <bpmn:sequenceFlow id="f14" sourceRef="Trans" targetRef="End" />
    <bpmn:sequenceFlow id="f15" sourceRef="OnBad" targetRef="Fail" />
    <bpmn:sequenceFlow id="f16" sourceRef="OnAnyError" targetRef="Stop" />
    <bpmn:sequenceFlow id="f17" sourceRef="OnLate" targetRef="Stop" />
  </bpmn:process>
</bpmn:definitions>`;

async function described() {
  const dir = definitionsFolder();
  fs.writeFileSync(path.join(dir, 'Described.bpmn'), model);
  const { server } = await makeServer({ dir });
  const definition = await server.definitions.load('Described');
  const json = JSON.parse(definition.getJson());
  return { server, definition, json, of: id => json.elements.find(e => e.id === id) };
}

/** Every [label, text] pair a node's behaviours give. */
const pairs = element => element.behaviours.flat();
const says = (element, label, text) => pairs(element).some(([l, t]) => l === label && t === text);

test('each behaviour describes itself as a list of [label, text] pairs', async () => {
  const { server, json } = await described();
  for (const element of json.elements)
    for (const lines of element.behaviours) {
      assert.ok(Array.isArray(lines), `${element.id}: a list`);
      for (const line of lines) assert.ok(Array.isArray(line) && line.length === 2, `${element.id}: ${JSON.stringify(line)} is a pair`);
    }
  await server.shutdown();
});

test('events say what they throw or catch, by its kind', async () => {
  const { server, of } = await described();
  assert.ok(says(of('SendOrder'), 'Message', "throws message 'Order'"));
  assert.ok(says(of('GetOrder'), 'Message', "catches message 'Order'"));
  assert.ok(says(of('SendGo'), 'Signal', "throws signal 'Go'"));
  assert.ok(says(of('GetGo'), 'Signal', "catches signal 'Go'"));
  assert.ok(says(of('Fail'), 'Error', "throws error 'Bad'"));
  assert.ok(says(of('OnBad'), 'Error', "catches error 'Bad'"));
  assert.ok(says(of('OnAnyError'), 'Error', "catches error 'any'"), 'no code: any');
  assert.ok(says(of('RaiseLate'), 'Escalation', "throws escalation 'Late'"));
  assert.ok(says(of('OnLate'), 'Escalation', "catches escalation 'Late'"));
  assert.ok(says(of('Stop'), '', 'Terminates all active nodes'));
  assert.ok(says(of('Undo'), 'Compensate', ''));
  assert.ok(says(of('CancelIt'), 'CancelTransaction', ''));
  await server.shutdown();
});

test('timers, loops, connectors and tasks describe what they are set to', async () => {
  const { server, of } = await described();
  assert.ok(says(of('Wait'), 'timer', 'Duration:PT1H'));
  assert.ok(says(of('Daily'), 'timer', 'Cycle:R3/PT1H'));
  assert.ok(says(of('OnDate'), 'timer', 'DateTime:2030-01-01T00:00:00Z'));
  assert.ok(says(of('Each'), 'loop', "is a sequential loop based on '${data.items}'"));
  assert.ok(says(of('All'), 'loop', "is a parallel loop based on '${data.items}'"));
  assert.ok(says(of('Call'), 'Connector', 'crm/findCustomer'));
  const review = of('Review').description.map(([label, value]) => `${label}=${value}`).join(' ');
  for (const part of ['ann', 'managers', '2']) assert.ok(review.includes(part), `the user task's description names ${part}: ${review}`);
  await server.shutdown();
});

test('a behaviour registered for an extension element is made for the nodes that have it, its defaults kept', async () => {
  class Audit extends Behaviour {}   // overrides nothing: the base class's defaults
  BehaviourLoader.register('camunda:audit', (node, def) => new Audit(node, def));
  const dir = definitionsFolder();
  fs.writeFileSync(path.join(dir, 'Audited.bpmn'), `<?xml version="1.0" encoding="UTF-8"?>
<bpmn:definitions xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:camunda="http://camunda.org/schema/1.0/bpmn" id="D_A" targetNamespace="x">
  <bpmn:process id="Audited" isExecutable="true">
    <bpmn:startEvent id="S"><bpmn:outgoing>f1</bpmn:outgoing></bpmn:startEvent>
    <bpmn:task id="T"><bpmn:extensionElements><camunda:audit /></bpmn:extensionElements><bpmn:incoming>f1</bpmn:incoming><bpmn:outgoing>f2</bpmn:outgoing></bpmn:task>
    <bpmn:endEvent id="E"><bpmn:incoming>f2</bpmn:incoming></bpmn:endEvent>
    <bpmn:sequenceFlow id="f1" sourceRef="S" targetRef="T" /><bpmn:sequenceFlow id="f2" sourceRef="T" targetRef="E" />
  </bpmn:process>
</bpmn:definitions>`);
  const { server } = await makeServer({ dir });
  const definition = await server.definitions.load('Audited');
  const audit = [...definition.getNodeById('T').behaviours.values()].find(b => b instanceof Audit);
  assert.ok(audit, 'the task has the registered behaviour');
  assert.deepEqual(audit.describe(), []);
  assert.deepEqual(audit.getNodeAttributes([]), undefined);
  const { instance } = await server.engine.start('Audited', {});
  assert.equal(instance.status, 'end', 'a behaviour with only the defaults changes nothing in a run');
  await server.shutdown();
});
