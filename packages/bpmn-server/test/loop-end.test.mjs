// @features: multi-instance
// this.token.loop.end(), called by a round's own script or listener, ends a parallel or sequential multi-instance loop at
// that round's end, as its completion condition does: the rounds still waiting are cancelled and the process goes on.
// Before, a parallel loop ended this way waited for ever: the flag was read as "already cancelled", so neither the
// rounds left nor the last of them moved it on; a sequential one ran every round regardless.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { makeServer, definitionsFolder } from './helpers.mjs';

/** A user task once for each of A, B and C (`sequential` or parallel); its end listener ends the loop after round B. */
const model = (id, sequential) => `<?xml version="1.0" encoding="UTF-8"?>
<bpmn:definitions xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:camunda="http://camunda.org/schema/1.0/bpmn"
    id="D_${id}" targetNamespace="http://bpmn.io/schema/bpmn">
  <bpmn:process id="${id}" isExecutable="true">
    <bpmn:startEvent id="S"><bpmn:outgoing>f1</bpmn:outgoing></bpmn:startEvent>
    <bpmn:userTask id="Review">
      <bpmn:extensionElements>
        <camunda:executionListener event="end"><camunda:script scriptFormat="JavaScript">if (this.itemKey === 'B') this.token.loop.end();</camunda:script></camunda:executionListener>
      </bpmn:extensionElements>
      <bpmn:incoming>f1</bpmn:incoming><bpmn:outgoing>f2</bpmn:outgoing>
      <bpmn:multiInstanceLoopCharacteristics isSequential="${sequential}" camunda:collection="['A','B','C']" />
    </bpmn:userTask>
    <bpmn:userTask id="After"><bpmn:incoming>f2</bpmn:incoming><bpmn:outgoing>f3</bpmn:outgoing></bpmn:userTask>
    <bpmn:endEvent id="E"><bpmn:incoming>f3</bpmn:incoming></bpmn:endEvent>
    <bpmn:sequenceFlow id="f1" sourceRef="S" targetRef="Review" />
    <bpmn:sequenceFlow id="f2" sourceRef="Review" targetRef="After" />
    <bpmn:sequenceFlow id="f3" sourceRef="After" targetRef="E" />
  </bpmn:process>
</bpmn:definitions>`;

async function server() {
  const dir = definitionsFolder();
  fs.writeFileSync(path.join(dir, 'EndParallel.bpmn'), model('EndParallel', false));
  fs.writeFileSync(path.join(dir, 'EndSequential.bpmn'), model('EndSequential', true));
  return (await makeServer({ dir })).server;
}

const waiting = (instance, elementId) => instance.items.filter(i => i.elementId === elementId && i.status === 'wait');

test('a parallel loop ended by loop.end() cancels its rounds left and goes on', async () => {
  const srv = await server();
  const { id } = await srv.engine.start('EndParallel', {});
  await srv.engine.invoke({ id, 'items.elementId': 'Review', 'items.itemKey': 'A' }, {});
  const { instance } = await srv.engine.invoke({ id, 'items.elementId': 'Review', 'items.itemKey': 'B' }, {});
  assert.deepEqual(waiting(instance, 'Review'), [], 'round C is cancelled');
  assert.equal(waiting(instance, 'After').length, 1, 'the process goes on, once');
  const done = await srv.engine.invoke({ id, 'items.elementId': 'After' }, {});
  assert.equal(done.instance.status, 'end');
  await srv.shutdown();
});

test('a parallel loop not ended early still waits for every round', async () => {
  const srv = await server();
  const { id } = await srv.engine.start('EndParallel', {});
  const { instance } = await srv.engine.invoke({ id, 'items.elementId': 'Review', 'items.itemKey': 'C' }, {});
  assert.equal(waiting(instance, 'Review').length, 2);
  assert.equal(waiting(instance, 'After').length, 0);
  await srv.shutdown();
});

test('a sequential loop ended by loop.end() runs no more rounds and goes on', async () => {
  const srv = await server();
  const { id } = await srv.engine.start('EndSequential', {});
  await srv.engine.invoke({ id, 'items.elementId': 'Review', 'items.itemKey': 'A' }, {});
  const { instance } = await srv.engine.invoke({ id, 'items.elementId': 'Review', 'items.itemKey': 'B' }, {});
  assert.equal(instance.items.filter(i => i.elementId === 'Review' && i.itemKey === 'C').length, 0, 'round C never starts');
  assert.equal(waiting(instance, 'After').length, 1);
  await srv.shutdown();
});
