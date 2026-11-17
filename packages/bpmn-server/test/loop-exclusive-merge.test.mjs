// @features: multi-instance
// A multi-instance task after a gateway, on a branch an exclusive merge closes (the first branch to reach it goes on,
// the others are cancelled): found writing testSampleApp's Complex Approval Process scenario.
// - The loop's branch cancelled: its token (the one at the loop's own item) is ended too. It stayed running, and the
//   instance never ended.
// - The loop's branch done first: its token, whose path is empty, borrows its first round's item (Token.goNext,
//   issue 186); that item was saved twice.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { makeServer, definitionsFolder } from './helpers.mjs';

const MODEL = `<?xml version="1.0" encoding="UTF-8"?>
<bpmn:definitions xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:camunda="http://camunda.org/schema/1.0/bpmn"
    id="D_LoopMerge" targetNamespace="http://bpmn.io/schema/bpmn">
  <bpmn:process id="LoopMerge" isExecutable="true">
    <bpmn:startEvent id="S"><bpmn:outgoing>f1</bpmn:outgoing></bpmn:startEvent>
    <bpmn:inclusiveGateway id="Split"><bpmn:incoming>f1</bpmn:incoming><bpmn:outgoing>f2</bpmn:outgoing><bpmn:outgoing>f3</bpmn:outgoing></bpmn:inclusiveGateway>
    <bpmn:userTask id="Quick"><bpmn:incoming>f2</bpmn:incoming><bpmn:outgoing>f4</bpmn:outgoing></bpmn:userTask>
    <bpmn:userTask id="Rounds"><bpmn:incoming>f3</bpmn:incoming><bpmn:outgoing>f5</bpmn:outgoing>
      <bpmn:multiInstanceLoopCharacteristics camunda:collection="2" /></bpmn:userTask>
    <bpmn:exclusiveGateway id="Merge"><bpmn:incoming>f4</bpmn:incoming><bpmn:incoming>f5</bpmn:incoming><bpmn:outgoing>f6</bpmn:outgoing></bpmn:exclusiveGateway>
    <bpmn:userTask id="After"><bpmn:incoming>f6</bpmn:incoming><bpmn:outgoing>f7</bpmn:outgoing></bpmn:userTask>
    <bpmn:endEvent id="E"><bpmn:incoming>f7</bpmn:incoming></bpmn:endEvent>
    <bpmn:sequenceFlow id="f1" sourceRef="S" targetRef="Split" />
    <bpmn:sequenceFlow id="f2" sourceRef="Split" targetRef="Quick" />
    <bpmn:sequenceFlow id="f3" sourceRef="Split" targetRef="Rounds" />
    <bpmn:sequenceFlow id="f4" sourceRef="Quick" targetRef="Merge" />
    <bpmn:sequenceFlow id="f5" sourceRef="Rounds" targetRef="Merge" />
    <bpmn:sequenceFlow id="f6" sourceRef="Merge" targetRef="After" />
    <bpmn:sequenceFlow id="f7" sourceRef="After" targetRef="E" />
  </bpmn:process>
</bpmn:definitions>`;

async function server() {
  const dir = definitionsFolder();
  fs.writeFileSync(path.join(dir, 'LoopMerge.bpmn'), MODEL);
  return (await makeServer({ dir })).server;
}

const saved = async (srv, id) => (await srv.dataStore.findInstances({ id }, 'full'))[0];
const ids = doc => doc.items.map(i => i.id);

test('the loop\'s branch cancelled by an exclusive merge: the instance still ends', async () => {
  const srv = await server();
  const { id } = await srv.engine.start('LoopMerge', {});
  await srv.engine.invoke({ id, 'items.elementId': 'Quick' }, {});
  let doc = await saved(srv, id);
  assert.equal(doc.items.filter(i => i.elementId === 'Rounds' && i.status === 'wait').length, 0, 'the rounds are cancelled');
  await srv.engine.invoke({ id, 'items.elementId': 'After' }, {});
  doc = await saved(srv, id);
  assert.equal(doc.status, 'end', `tokens not ended: ${JSON.stringify(doc.tokens.filter(t => !['end', 'terminated'].includes(t.status)).map(t => [t.id, t.status, t.currentNode]))}`);
  await srv.shutdown();
});

test('the loop\'s branch done first: each item is saved once, and the instance ends', async () => {
  const srv = await server();
  const { id } = await srv.engine.start('LoopMerge', {});
  await srv.engine.invoke({ id, 'items.elementId': 'Rounds', 'items.itemKey': '0' }, {});
  await srv.engine.invoke({ id, 'items.elementId': 'Rounds', 'items.itemKey': '1' }, {});
  let doc = await saved(srv, id);
  assert.equal(new Set(ids(doc)).size, ids(doc).length, `an item saved twice: ${doc.items.map(i => i.elementId + (i.itemKey ?? '')).join(', ')}`);
  assert.equal(doc.items.filter(i => i.elementId === 'Quick' && i.status === 'wait').length, 0, 'Quick is cancelled');
  await srv.engine.invoke({ id, 'items.elementId': 'After' }, {});
  doc = await saved(srv, id);
  assert.equal(new Set(ids(doc)).size, ids(doc).length);
  assert.equal(doc.status, 'end');
  await srv.shutdown();
});
