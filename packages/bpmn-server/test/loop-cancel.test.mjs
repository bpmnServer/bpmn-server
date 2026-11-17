// @features: multi-instance
// Cancelling a parallel multi-instance loop from outside it: a terminate end event on another branch terminates its
// rounds. With one round, the round being terminated had no sibling and the loop's cancel threw (issue #289); with
// several, the others are still terminated and the loop's item ends.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { makeServer, definitionsFolder } from './helpers.mjs';

/** A parallel split: one review per reviewer, in parallel; and Stop, then a terminate end event. */
const REVIEWS = `<?xml version="1.0" encoding="UTF-8"?>
<bpmn:definitions xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:camunda="http://camunda.org/schema/1.0/bpmn"
    id="D_Reviews" targetNamespace="http://bpmn.io/schema/bpmn">
  <bpmn:process id="Reviews" isExecutable="true">
    <bpmn:startEvent id="S"><bpmn:outgoing>f1</bpmn:outgoing></bpmn:startEvent>
    <bpmn:parallelGateway id="Split"><bpmn:incoming>f1</bpmn:incoming><bpmn:outgoing>f2</bpmn:outgoing><bpmn:outgoing>f3</bpmn:outgoing></bpmn:parallelGateway>
    <bpmn:userTask id="Review"><bpmn:incoming>f2</bpmn:incoming><bpmn:outgoing>f4</bpmn:outgoing>
      <bpmn:multiInstanceLoopCharacteristics isSequential="false" camunda:collection="$data.reviewers" camunda:elementVariable="reviewer" />
    </bpmn:userTask>
    <bpmn:endEvent id="E"><bpmn:incoming>f4</bpmn:incoming></bpmn:endEvent>
    <bpmn:userTask id="Stop"><bpmn:incoming>f3</bpmn:incoming><bpmn:outgoing>f5</bpmn:outgoing></bpmn:userTask>
    <bpmn:endEvent id="Terminate"><bpmn:incoming>f5</bpmn:incoming><bpmn:terminateEventDefinition /></bpmn:endEvent>
    <bpmn:sequenceFlow id="f1" sourceRef="S" targetRef="Split" /><bpmn:sequenceFlow id="f2" sourceRef="Split" targetRef="Review" />
    <bpmn:sequenceFlow id="f3" sourceRef="Split" targetRef="Stop" /><bpmn:sequenceFlow id="f4" sourceRef="Review" targetRef="E" />
    <bpmn:sequenceFlow id="f5" sourceRef="Stop" targetRef="Terminate" />
  </bpmn:process>
</bpmn:definitions>`;

async function server() {
  const dir = definitionsFolder();
  fs.writeFileSync(path.join(dir, 'Reviews.bpmn'), REVIEWS);
  return (await makeServer({ dir })).server;
}
const waiting = (instance, elementId) => instance.items.filter(i => i.elementId === elementId && i.status === 'wait');

/** Starts the reviews, then ends Stop: the terminate end event cancels the rounds still running. */
async function terminate(reviewers) {
  const srv = await server();
  try {
    const run = await srv.engine.start('Reviews', { reviewers }, null, 'ann');
    assert.equal(waiting(run.instance, 'Review').length, reviewers.length, 'one round per reviewer');
    await srv.engine.invoke({ id: run.id, 'items.elementId': 'Stop' }, {}, 'ann');
    return (await srv.dataStore.findInstances({ id: run.id }, 'full'))[0];
  } finally {
    await srv.shutdown();
  }
}

test('a loop of one round, terminated: no sibling round, and the cancel does not throw (#289)', async () => {
  const after = await terminate(['ann']);
  assert.equal(after.status, 'end', 'the instance is terminated');
  assert.equal(waiting(after, 'Review').length, 0, 'the round is cancelled');
  assert.ok(after.items.filter(i => i.elementId === 'Review').every(i => i.status === 'end'), "the round and the loop's item end");
});

test('a loop of several rounds, terminated: every round still running is terminated, as before', async () => {
  const after = await terminate(['ann', 'bob', 'cy']);
  assert.equal(after.status, 'end');
  assert.equal(waiting(after, 'Review').length, 0, 'no round waits');
  assert.ok(after.items.filter(i => i.elementId === 'Review').every(i => i.status === 'end'));
});
