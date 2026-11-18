// @features: business-rule-task
// A business rule task's result, as camunda:mapDecisionResult asks for it (singleEntry, singleResult, collectEntries,
// resultList, or the result as it is); a single one asked for when several rules matched is an error; a task that names
// no decision evaluates nothing and goes on.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { makeServer, definitionsFolder } from './helpers.mjs';

const tasks = ['singleEntry', 'singleResult', 'collectEntries', 'resultList', ''].map((map, i) =>
  `<bpmn:businessRuleTask id="T${i}" camunda:decisionRef="D" ${map ? `camunda:mapDecisionResult="${map}"` : ''} />`).join('');

const model = `<?xml version="1.0" encoding="UTF-8"?>
<bpmn:definitions xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:camunda="http://camunda.org/schema/1.0/bpmn" id="D_M" targetNamespace="x">
  <bpmn:process id="Mapped" isExecutable="true">
    <bpmn:startEvent id="S"><bpmn:outgoing>f1</bpmn:outgoing></bpmn:startEvent>
    <bpmn:businessRuleTask id="NoDecision"><bpmn:incoming>f1</bpmn:incoming><bpmn:outgoing>f2</bpmn:outgoing></bpmn:businessRuleTask>
    <bpmn:endEvent id="E"><bpmn:incoming>f2</bpmn:incoming></bpmn:endEvent>
    <bpmn:sequenceFlow id="f1" sourceRef="S" targetRef="NoDecision" />
    <bpmn:sequenceFlow id="f2" sourceRef="NoDecision" targetRef="E" />
    ${tasks}
  </bpmn:process>
</bpmn:definitions>`;

async function loaded() {
  const dir = definitionsFolder();
  fs.writeFileSync(path.join(dir, 'Mapped.bpmn'), model);
  const { server } = await makeServer({ dir });
  const definition = await server.definitions.load('Mapped');
  return { server, node: i => definition.getNodeById(`T${i}`) };
}

test('each mapping of a decision\'s result', async () => {
  const { server, node } = await loaded();
  const one = [{ level: 'gold', discount: 10 }];
  const two = [{ level: 'gold' }, { level: 'silver' }];
  assert.equal(node(0).mapResult(one), 'gold', 'singleEntry: the first output of the one result');
  assert.equal(node(0).mapResult([]), null, 'singleEntry: no rule matched');
  assert.equal(node(0).mapResult('plain'), 'plain', 'singleEntry: a value that is not an object');
  assert.deepEqual(node(1).mapResult(one), one[0], 'singleResult');
  assert.deepEqual(node(1).mapResult(one[0]), one[0], 'singleResult: one result, not in a list');
  assert.throws(() => node(1).mapResult(two), /Decision 'D': mapDecisionResult singleResult needs one result; 2 rules matched/);
  assert.throws(() => node(0).mapResult(two), /singleEntry needs one result/);
  assert.deepEqual(node(2).mapResult(two), ['gold', 'silver'], 'collectEntries');
  assert.deepEqual(node(2).mapResult(null), [], 'collectEntries: nothing');
  assert.deepEqual(node(3).mapResult(two), two, 'resultList');
  assert.deepEqual(node(3).mapResult(undefined), [], 'resultList: nothing');
  assert.equal(node(4).mapResult(two), two, 'no mapping: as it is');
  const described = Object.fromEntries(node(0).describe());
  assert.equal(described['Decision'], 'D');
  assert.equal(described['Result mapping'], 'singleEntry');
  await server.shutdown();
});

test('a business rule task with no decision evaluates nothing, and the process goes on', async () => {
  const { server } = await loaded();
  const { instance } = await server.engine.start('Mapped', {});
  assert.equal(instance.status, 'end');
  await server.shutdown();
});
