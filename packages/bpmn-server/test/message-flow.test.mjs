// @features: pools-lanes, messages-signals
// A message flow between pools of one model: when the task it leaves ends, the flow's target goes on: a catch event
// waiting there is signalled; a target with no token (its pool not running) gets one, started there.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { makeServer, definitionsFolder } from './helpers.mjs';

/**
 * Pool A: S → Send → Send2 (user tasks) → E. Pool B: B0 → Listen (message catch) → Heard (user); and a message start
 * event Begin → Started (user). Message flows: Send → Listen, Send → Begin, Send2 → Listen.
 */
const model = `<?xml version="1.0" encoding="UTF-8"?>
<bpmn:definitions xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" id="D_MF" targetNamespace="x">
  <bpmn:message id="M1" name="Note" />
  <bpmn:collaboration id="C">
    <bpmn:participant id="PA" processRef="A" />
    <bpmn:participant id="PB" processRef="B" />
    <bpmn:messageFlow id="toListen" sourceRef="Send" targetRef="Listen" />
    <bpmn:messageFlow id="toBegin" sourceRef="Send" targetRef="Begin" />
    <bpmn:messageFlow id="again" sourceRef="Send2" targetRef="Listen" />
  </bpmn:collaboration>
  <bpmn:process id="A" isExecutable="true">
    <bpmn:startEvent id="S"><bpmn:outgoing>a1</bpmn:outgoing></bpmn:startEvent>
    <bpmn:userTask id="Send"><bpmn:incoming>a1</bpmn:incoming><bpmn:outgoing>a2</bpmn:outgoing></bpmn:userTask>
    <bpmn:userTask id="Send2"><bpmn:incoming>a2</bpmn:incoming><bpmn:outgoing>a3</bpmn:outgoing></bpmn:userTask>
    <bpmn:endEvent id="E"><bpmn:incoming>a3</bpmn:incoming></bpmn:endEvent>
    <bpmn:sequenceFlow id="a1" sourceRef="S" targetRef="Send" />
    <bpmn:sequenceFlow id="a2" sourceRef="Send" targetRef="Send2" />
    <bpmn:sequenceFlow id="a3" sourceRef="Send2" targetRef="E" />
  </bpmn:process>
  <bpmn:process id="B" isExecutable="true">
    <bpmn:startEvent id="B0"><bpmn:outgoing>b1</bpmn:outgoing></bpmn:startEvent>
    <bpmn:intermediateCatchEvent id="Listen"><bpmn:incoming>b1</bpmn:incoming><bpmn:outgoing>b2</bpmn:outgoing>
      <bpmn:messageEventDefinition messageRef="M1" /></bpmn:intermediateCatchEvent>
    <bpmn:userTask id="Heard"><bpmn:incoming>b2</bpmn:incoming></bpmn:userTask>
    <bpmn:startEvent id="Begin"><bpmn:outgoing>b3</bpmn:outgoing><bpmn:messageEventDefinition messageRef="M1" /></bpmn:startEvent>
    <bpmn:userTask id="Started"><bpmn:incoming>b3</bpmn:incoming></bpmn:userTask>
    <bpmn:sequenceFlow id="b1" sourceRef="B0" targetRef="Listen" />
    <bpmn:sequenceFlow id="b2" sourceRef="Listen" targetRef="Heard" />
    <bpmn:sequenceFlow id="b3" sourceRef="Begin" targetRef="Started" />
  </bpmn:process>
</bpmn:definitions>`;

test('a task\'s message flows: a target with no token is started there; a waiting one is signalled', async () => {
  const dir = definitionsFolder();
  fs.writeFileSync(path.join(dir, 'Pools.bpmn'), model);
  const { server } = await makeServer({ dir });
  const { instance } = await server.engine.start('Pools', {});
  const statuses = (inst, id) => inst.items.filter(i => i.elementId === id).map(i => i.status);
  assert.deepEqual(statuses(instance, 'Listen'), [], 'pool B is not running: nothing there yet');

  const first = await server.engine.invoke({ id: instance.id, 'items.elementId': 'Send' }, {});
  assert.deepEqual(statuses(first.instance, 'Listen'), ['wait'], 'a token started at the catch event, which waits');
  assert.deepEqual(statuses(first.instance, 'Started'), ['wait'], 'a token started at the message start event');

  const second = await server.engine.invoke({ id: instance.id, 'items.elementId': 'Send2' }, {});
  assert.deepEqual(statuses(second.instance, 'Listen'), ['end'], 'the waiting catch event signalled');
  assert.deepEqual(statuses(second.instance, 'Heard'), ['wait']);
  await server.shutdown();
});
