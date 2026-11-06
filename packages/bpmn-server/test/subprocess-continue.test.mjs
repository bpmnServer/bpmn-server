// @features: subprocess
// An embedded sub-process that is done within its own start goes on once: it went on twice (its child signalled it
// and its start went on too), and an exclusive gateway after it, with a default and a condition not met, failed
// on the second pass ("this.currentNode.getOutbounds is not a function").
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { makeServer, definitionsFolder } from './helpers.mjs';

const MODEL = `<?xml version="1.0" encoding="UTF-8"?>
<bpmn:definitions xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    id="D" targetNamespace="http://bpmn.io/schema/bpmn">
  <bpmn:process id="SubThenChoice" isExecutable="true">
    <bpmn:startEvent id="S"><bpmn:outgoing>f1</bpmn:outgoing></bpmn:startEvent>
    <bpmn:subProcess id="Sub"><bpmn:incoming>f1</bpmn:incoming><bpmn:outgoing>f2</bpmn:outgoing>
      <bpmn:startEvent id="SubStart"><bpmn:outgoing>sf</bpmn:outgoing></bpmn:startEvent>
      <bpmn:endEvent id="SubEnd"><bpmn:incoming>sf</bpmn:incoming></bpmn:endEvent>
      <bpmn:sequenceFlow id="sf" sourceRef="SubStart" targetRef="SubEnd" />
    </bpmn:subProcess>
    <bpmn:exclusiveGateway id="G" default="toNo"><bpmn:incoming>f2</bpmn:incoming><bpmn:outgoing>toYes</bpmn:outgoing><bpmn:outgoing>toNo</bpmn:outgoing></bpmn:exclusiveGateway>
    <bpmn:userTask id="Yes"><bpmn:incoming>toYes</bpmn:incoming></bpmn:userTask>
    <bpmn:userTask id="No"><bpmn:incoming>toNo</bpmn:incoming><bpmn:outgoing>f3</bpmn:outgoing></bpmn:userTask>
    <bpmn:endEvent id="E"><bpmn:incoming>f3</bpmn:incoming></bpmn:endEvent>
    <bpmn:sequenceFlow id="f1" sourceRef="S" targetRef="Sub" /><bpmn:sequenceFlow id="f2" sourceRef="Sub" targetRef="G" />
    <bpmn:sequenceFlow id="toYes" sourceRef="G" targetRef="Yes">
      <bpmn:conditionExpression xsi:type="bpmn:tFormalExpression" language="JavaScript">data.ok == true</bpmn:conditionExpression>
    </bpmn:sequenceFlow>
    <bpmn:sequenceFlow id="toNo" sourceRef="G" targetRef="No" /><bpmn:sequenceFlow id="f3" sourceRef="No" targetRef="E" />
  </bpmn:process>
</bpmn:definitions>`;

test('a sub-process done within its start goes on once: the gateway after it takes its default, once', async () => {
  const dir = definitionsFolder();
  fs.writeFileSync(path.join(dir, 'SubThenChoice.bpmn'), MODEL);
  const { server } = await makeServer({ dir });
  const ends = [];
  server.listener.on('end', ({ context }) => { if (context.item?.elementId === 'Sub') ends.push(context.item.id); });

  const run = await server.engine.start('SubThenChoice', {});
  const count = id => run.instance.items.filter(i => i.elementId === id).length;
  assert.equal(run.instance.status, 'running');
  assert.deepEqual(run.instance.items.filter(i => i.status === 'wait').map(i => i.elementId), ['No'], 'the default, waiting');
  assert.deepEqual(['Sub', 'G', 'toNo', 'No'].map(count), [1, 1, 1, 1], 'each once');
  assert.equal(ends.length, 1, 'the sub-process ended once');
  assert.equal(run.instance.logs.filter(l => /"id":'Sub',"action":'Ended'/.test(l.message ?? l)).length, 1);

  const done = await server.engine.invoke({ id: run.id, 'items.elementId': 'No' }, {});
  assert.equal(done.instance.status, 'end');
  await server.shutdown();
});

test('the condition met: the other way, also once', async () => {
  const dir = definitionsFolder();
  fs.writeFileSync(path.join(dir, 'SubThenChoice.bpmn'), MODEL);
  const { server } = await makeServer({ dir });
  const run = await server.engine.start('SubThenChoice', { ok: true });
  assert.deepEqual(run.instance.items.filter(i => i.status === 'wait').map(i => i.elementId), ['Yes']);
  assert.equal(run.instance.items.filter(i => i.elementId === 'G').length, 1);
  await server.shutdown();
});
