// @features: engine-api, script-task
// Small parts of the public API that nothing else runs: an item's accessors, as a script sees them; engine.invokeItem
// (invoke's older name); the Query builder.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { makeServer, definitionsFolder } from './helpers.mjs';
import { Query } from '../dist/index.js';

const model = `<?xml version="1.0" encoding="UTF-8"?>
<bpmn:definitions xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" id="D_Acc" targetNamespace="x">
  <bpmn:process id="Accessors" isExecutable="true">
    <bpmn:startEvent id="S"><bpmn:outgoing>f1</bpmn:outgoing></bpmn:startEvent>
    <bpmn:scriptTask id="Run" scriptFormat="JavaScript"><bpmn:incoming>f1</bpmn:incoming><bpmn:outgoing>f2</bpmn:outgoing>
      <bpmn:script>
        item.setData({ fromSetData: 1 });
        item.data = { fromSetter: 2 };
        data.tokenId = item.tokenId;
        data.sameToken = item.tokenId === item.token.id;
        data.options = item.options === item.token.execution.options;
      </bpmn:script></bpmn:scriptTask>
    <bpmn:userTask id="Wait"><bpmn:incoming>f2</bpmn:incoming><bpmn:outgoing>f3</bpmn:outgoing></bpmn:userTask>
    <bpmn:endEvent id="E"><bpmn:incoming>f3</bpmn:incoming></bpmn:endEvent>
    <bpmn:sequenceFlow id="f1" sourceRef="S" targetRef="Run" />
    <bpmn:sequenceFlow id="f2" sourceRef="Run" targetRef="Wait" />
    <bpmn:sequenceFlow id="f3" sourceRef="Wait" targetRef="E" />
  </bpmn:process>
</bpmn:definitions>`;

async function server() {
  const dir = definitionsFolder();
  fs.writeFileSync(path.join(dir, 'Accessors.bpmn'), model);
  return (await makeServer({ dir })).server;
}

test('a script sets data through its item (setData, data =) and reads its token and options', async () => {
  const srv = await server();
  const { instance } = await srv.engine.start('Accessors', {});
  assert.equal(instance.data.fromSetData, 1);
  assert.equal(instance.data.fromSetter, 2);
  assert.equal(instance.data.tokenId, 0, 'the first token');
  assert.equal(instance.data.sameToken, true);
  assert.equal(instance.data.options, true);
  await srv.shutdown();
});

test('engine.invokeItem is invoke', async () => {
  const srv = await server();
  const { instance } = await srv.engine.start('Accessors', {});
  const done = await srv.engine.invokeItem({ id: instance.id, 'items.elementId': 'Wait' }, { approved: true });
  assert.equal(done.instance.status, 'end');
  assert.equal(done.instance.data.approved, true);
  await srv.shutdown();
});

test('a Query is built by its setters, each giving the query back', () => {
  const query = new Query({ instanceName: 'Accessors' });
  const same = query.instanceId('i1').instanceName('n').instanceStatus('running').data({ a: 1 })
    .itemId('t1').itemName('Wait').itemStatus('wait').itemElementId('Wait');
  assert.equal(same, query);
});

test('invoke with noWait answers before the rest runs; the rest runs, is saved, and the lock is released', async () => {
  const dir = definitionsFolder();
  fs.writeFileSync(path.join(dir, 'Later.bpmn'), `<?xml version="1.0" encoding="UTF-8"?>
<bpmn:definitions xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" id="D_L" targetNamespace="x">
  <bpmn:process id="Later" isExecutable="true">
    <bpmn:startEvent id="S"><bpmn:outgoing>f1</bpmn:outgoing></bpmn:startEvent>
    <bpmn:userTask id="First"><bpmn:incoming>f1</bpmn:incoming><bpmn:outgoing>f2</bpmn:outgoing></bpmn:userTask>
    <bpmn:scriptTask id="Work" scriptFormat="JavaScript"><bpmn:incoming>f2</bpmn:incoming><bpmn:outgoing>f3</bpmn:outgoing>
      <bpmn:script>data.worked = true;</bpmn:script></bpmn:scriptTask>
    <bpmn:userTask id="Second"><bpmn:incoming>f3</bpmn:incoming></bpmn:userTask>
    <bpmn:sequenceFlow id="f1" sourceRef="S" targetRef="First" />
    <bpmn:sequenceFlow id="f2" sourceRef="First" targetRef="Work" />
    <bpmn:sequenceFlow id="f3" sourceRef="Work" targetRef="Second" />
  </bpmn:process>
</bpmn:definitions>`);
  const { server: srv, store } = await makeServer({ dir });
  const { instance } = await srv.engine.start('Later', {});
  const execution = await srv.engine.invoke({ id: instance.id, 'items.elementId': 'First' }, { given: 1 }, null, { noWait: true });
  assert.equal(execution.isLocked, true, 'answered while the rest still runs, under the lock');
  await execution.worker;
  const [saved] = await store.find('bpmn_test', 'wf_instances', { id: instance.id });
  assert.equal(saved.data.given, 1);
  assert.equal(saved.data.worked, true);
  assert.deepEqual(saved.items.filter(i => i.elementId === 'Second').map(i => i.status), ['wait']);
  assert.deepEqual(await store.find('bpmn_test', 'wf_locks', {}), [], 'its lock was released');
  await srv.shutdown();
});
