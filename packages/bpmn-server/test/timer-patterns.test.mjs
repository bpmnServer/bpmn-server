// @features: timers
// A timer's text is filled in for each item (it was written back into the definition, so later items got the first
// item's value), and a cycle repeats under the configuration's forced delay (it fired once: its repeats were not
// read with a forced delay).
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { makeServer, definitionsFolder, until } from './helpers.mjs';

const model = (id, body) => `<?xml version="1.0" encoding="UTF-8"?>
<bpmn:definitions xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:camunda="http://camunda.org/schema/1.0/bpmn"
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" id="D_${id}" targetNamespace="http://bpmn.io/schema/bpmn">
  <bpmn:process id="${id}" isExecutable="true">${body}</bpmn:process>
</bpmn:definitions>`;

/** One round per wait in data.waits (in hours), each a timer of its own wait, in the same run. */
const ROUNDS = model('Rounds', `
    <bpmn:startEvent id="S"><bpmn:outgoing>f1</bpmn:outgoing></bpmn:startEvent>
    <bpmn:subProcess id="Round"><bpmn:incoming>f1</bpmn:incoming><bpmn:outgoing>f2</bpmn:outgoing>
      <bpmn:multiInstanceLoopCharacteristics camunda:collection="$data.waits" camunda:elementVariable="hours" />
      <bpmn:startEvent id="RS"><bpmn:outgoing>r1</bpmn:outgoing></bpmn:startEvent>
      <bpmn:intermediateCatchEvent id="Wait"><bpmn:incoming>r1</bpmn:incoming><bpmn:outgoing>r2</bpmn:outgoing>
        <bpmn:timerEventDefinition><bpmn:timeDuration xsi:type="bpmn:tFormalExpression">PT\${data.hours}H</bpmn:timeDuration></bpmn:timerEventDefinition>
      </bpmn:intermediateCatchEvent>
      <bpmn:endEvent id="RE"><bpmn:incoming>r2</bpmn:incoming></bpmn:endEvent>
      <bpmn:sequenceFlow id="r1" sourceRef="RS" targetRef="Wait" /><bpmn:sequenceFlow id="r2" sourceRef="Wait" targetRef="RE" />
    </bpmn:subProcess>
    <bpmn:endEvent id="E"><bpmn:incoming>f2</bpmn:incoming></bpmn:endEvent>
    <bpmn:sequenceFlow id="f1" sourceRef="S" targetRef="Round" /><bpmn:sequenceFlow id="f2" sourceRef="Round" targetRef="E" />`);

/** A task with a reminder every hour, three times. */
const REMINDERS = model('Reminders', `
    <bpmn:startEvent id="S"><bpmn:outgoing>f1</bpmn:outgoing></bpmn:startEvent>
    <bpmn:userTask id="Task"><bpmn:incoming>f1</bpmn:incoming><bpmn:outgoing>f2</bpmn:outgoing></bpmn:userTask>
    <bpmn:boundaryEvent id="Every" cancelActivity="false" attachedToRef="Task"><bpmn:outgoing>b1</bpmn:outgoing>
      <bpmn:timerEventDefinition><bpmn:timeCycle xsi:type="bpmn:tFormalExpression">R3/PT1H</bpmn:timeCycle></bpmn:timerEventDefinition>
    </bpmn:boundaryEvent>
    <bpmn:scriptTask id="Remind" scriptFormat="JavaScript"><bpmn:incoming>b1</bpmn:incoming>
      <bpmn:script>this.data.reminders = (this.data.reminders || 0) + 1;</bpmn:script></bpmn:scriptTask>
    <bpmn:endEvent id="E"><bpmn:incoming>f2</bpmn:incoming></bpmn:endEvent>
    <bpmn:sequenceFlow id="f1" sourceRef="S" targetRef="Task" /><bpmn:sequenceFlow id="f2" sourceRef="Task" targetRef="E" />
    <bpmn:sequenceFlow id="b1" sourceRef="Every" targetRef="Remind" />`);

function folder(models) {
  const dir = definitionsFolder();
  for (const [name, xml] of Object.entries(models))
    fs.writeFileSync(path.join(dir, name + '.bpmn'), xml);
  return dir;
}

test('a timer\'s text is filled in for each item: rounds of one run wait their own time', async () => {
  const { server } = await makeServer({ dir: folder({ Rounds: ROUNDS }) });
  const run = await server.engine.start('Rounds', { waits: [1, 5] });
  const dues = run.instance.items.filter(i => i.elementId === 'Wait' && i.status === 'wait')
    .map(i => Math.round((new Date(i.timeDue).getTime() - Date.now()) / 3600000)).sort((a, b) => a - b);
  assert.deepEqual(dues, [1, 5], 'each round its own hours (both were 1)');
  await server.shutdown();
});

test('a cycle repeats under a forced delay: R3 reminds three times', { timeout: 20000 }, async () => {
  const { server } = await makeServer({ dir: folder({ Reminders: REMINDERS }), cron: true, timers: { forceTimersDelay: 150, precision: 50 } });
  const run = await server.engine.start('Reminders', {});
  const reminders = async () => (await server.dataStore.findInstances({ id: run.id }, 'full'))[0].data.reminders;
  await until(async () => (await reminders()) === 3, 10000, 'three reminders');
  await new Promise(r => setTimeout(r, 600));
  assert.equal(await reminders(), 3, 'three, no more');
  const [after] = await server.dataStore.findInstances({ id: run.id }, 'full');
  assert.ok(after.items.some(i => i.elementId === 'Task' && i.status === 'wait'), 'the task still waits');
  await server.shutdown();
});
