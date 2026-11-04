// @features: data-objects
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

import { verifyModel } from '../dist/index.js';
import { makeServer } from './helpers.mjs';

/**
 * Start -> Load (service) -> Price (script) -> Review (user task) -> End.
 * The start event is connected to data object 'client', the service task to data object 'order'.
 */
const MODEL = (extra = '') => `<?xml version="1.0" encoding="UTF-8"?>
<bpmn:definitions xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" id="d" targetNamespace="urn:test">
  <bpmn:process id="P" isExecutable="true">
    <bpmn:dataObject id="DO_client" name="client" />
    <bpmn:dataObjectReference id="ClientRef" name="client" dataObjectRef="DO_client" />
    <bpmn:dataObject id="DO_order" name="order" />
    <bpmn:dataObjectReference id="OrderRef" name="order" dataObjectRef="DO_order" />
    ${extra}
    <bpmn:startEvent id="Start">
      <bpmn:dataOutputAssociation id="a1"><bpmn:targetRef>ClientRef</bpmn:targetRef></bpmn:dataOutputAssociation>
    </bpmn:startEvent>
    <bpmn:serviceTask id="Load" implementation="noop">
      <bpmn:dataInputAssociation id="a2"><bpmn:sourceRef>OrderRef</bpmn:sourceRef></bpmn:dataInputAssociation>
    </bpmn:serviceTask>
    <bpmn:scriptTask id="Price"><bpmn:script>data.discount = data.client.tier === 'gold' ? 10 : 0; data.client.visits += 1; data.total = data.order.amount - data.discount;</bpmn:script></bpmn:scriptTask>
    <bpmn:userTask id="Review" />
    <bpmn:endEvent id="End" />
    <bpmn:sequenceFlow id="f1" sourceRef="Start" targetRef="Load" />
    <bpmn:sequenceFlow id="f2" sourceRef="Load" targetRef="Price" />
    <bpmn:sequenceFlow id="f3" sourceRef="Price" targetRef="Review" />
    <bpmn:sequenceFlow id="f4" sourceRef="Review" targetRef="End" />
  </bpmn:process>
</bpmn:definitions>`;

async function serverWith(services) {
  const made = await makeServer({ services: { noop() { return {}; }, ...services } });
  fs.writeFileSync(path.join(made.dir, 'orders.bpmn'), MODEL());
  await made.server.definitions.rebuild();
  return made.server;
}

test('a data object is loaded by the application when an element connected to it runs, and saved with the instance', async () => {
  const calls = [];
  const server = await serverWith({
    async loadDataObject(name, item) {
      calls.push(`${name}@${item.elementId}`);
      if (name === 'client') return { name: 'Kim', tier: 'gold', visits: 3 };
      if (name === 'order') return { id: item.data.orderId, amount: 120 };
    }
  });

  const started = await server.engine.start('orders', { orderId: 'O-7' });
  assert.deepEqual(calls, ['client@Start', 'order@Load'], 'each when its element runs');
  assert.deepEqual(started.instance.data.client, { name: 'Kim', tier: 'gold', visits: 4 }, 'later elements read and change it');
  assert.deepEqual(started.instance.data.order, { id: 'O-7', amount: 120 });
  assert.equal(started.instance.data.total, 110);

  // saved with the instance: completing the task restores it from the store, without loading again
  const saved = await server.dataStore.findInstance({ id: started.id }, 'full');
  assert.deepEqual(saved.data.client, { name: 'Kim', tier: 'gold', visits: 4 });
  const ended = await server.engine.invoke({ id: started.id, 'items.elementId': 'Review' }, {});
  assert.equal(ended.instance.status, 'end');
  assert.equal(ended.instance.data.client.visits, 4);
  assert.equal(calls.length, 2, 'not loaded again');
  await server.shutdown();
});

test('without a loader the process runs, and the log says the data objects were not loaded', async () => {
  const server = await serverWith({});
  const started = await server.engine.start('orders', {}).catch(err => err);
  // Price reads data.client: without it the script fails; the run says why in its log
  const logs = (started.instance ?? (await server.dataStore.findInstances({}, 'full'))[0])?.logs ?? [];
  assert.ok(logs.some(l => /data objects client: the application has no loadDataObject/.test(l.message ?? l)), 'logged');
  await server.shutdown();
});

test('verifyModel: a data object connected to nothing, and an application without a loader', async () => {
  const loose = MODEL('<bpmn:dataObject id="DO_note" name="note" /><bpmn:dataObjectReference id="NoteRef" name="note" dataObjectRef="DO_note" />');
  const codes = result => result.issues.filter(i => /data-object/.test(i.code)).map(i => `${i.code}${i.elementId ? ':' + i.elementId : ''}`);

  assert.deepEqual(codes(await verifyModel(loose)), ['data-object-not-loaded:NoteRef'], 'without an application, only the model');

  const without = await serverWith({});
  const withoutResult = await verifyModel(MODEL(), without, 'orders');
  assert.deepEqual(codes(withoutResult), ['no-data-object-loader']);
  assert.match(withoutResult.issues.find(i => i.code === 'no-data-object-loader').message, /\(client, order\)/);
  await without.shutdown();

  const loader = await serverWith({ loadDataObject() { return {}; } });
  assert.deepEqual(codes(await verifyModel(MODEL(), loader, 'orders')), []);
  await loader.shutdown();
});
