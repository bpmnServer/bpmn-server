// @features: engine-api, labels
// The application's instanceLabel hook (#295) labels the cases its models' templates don't, also seen from a host: a
// launched server's delegate is only what it knows of the application, so the hook is asked of the engine, where the
// code is, once for all the cases. And an application's own engine calls (#294): what `calls` adds to a launch is
// added to the engine's own, not in place of them.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { makeServer, definitionsFolder, newStore, TestDelegate } from './helpers.mjs';
import { startEngineService, labelInstances } from '../dist/index.js';

const KEY = 'the-hosts-key';
const model = (id, label = '') => `<?xml version="1.0" encoding="UTF-8"?>
<bpmn:definitions xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:owf="http://omniworkflow.com/schema/owf" id="D_${id}" targetNamespace="x">
  <bpmn:process id="${id}" isExecutable="true"${label ? ` owf:label="${label}"` : ''}>
    <bpmn:startEvent id="S"><bpmn:outgoing>f1</bpmn:outgoing></bpmn:startEvent>
    <bpmn:userTask id="Review"><bpmn:incoming>f1</bpmn:incoming></bpmn:userTask>
    <bpmn:sequenceFlow id="f1" sourceRef="S" targetRef="Review" />
  </bpmn:process>
</bpmn:definitions>`;

class LabellingDelegate extends TestDelegate {
  asked = 0;
  instanceLabel(instance) { this.asked++; return instance.data?.claimNo ? `Claim ${instance.data.claimNo}` : undefined; }
}

function folder() {
  const dir = definitionsFolder();
  fs.writeFileSync(path.join(dir, 'Plain.bpmn'), model('Plain'));
  fs.writeFileSync(path.join(dir, 'Labelled.bpmn'), model('Labelled', 'Order ${data.orderNo}'));
  return dir;
}
const extra = { appDelegate: (s) => new LabellingDelegate(s, {}) };

test('a host labels by the hook in its engine: in this process', async (t) => {
  const host = (await makeServer({ dir: folder(), launched: true, extra })).server;
  t.after(() => host.shutdown());
  const plain = await host.engine.start('Plain', { claimNo: 'C-7' });
  const none = await host.engine.start('Plain', {});
  const labelled = await host.engine.start('Labelled', { orderNo: 12, claimNo: 'C-8' });
  const cases = await host.dataStore.findInstances({}, 'full');
  await labelInstances(host, cases);
  const label = id => cases.find(c => c.id === id).label;
  assert.equal(label(plain.instance.id), 'Claim C-7', 'by the hook');
  assert.equal(label(none.instance.id), 'Plain', 'the hook said nothing: the default');
  assert.equal(label(labelled.instance.id), 'Order 12', 'the model\'s template comes first');
});

test('a host labels by the hook in its engine: over the network, all cases in one call', async (t) => {
  const dir = folder();
  const store = newStore();
  const engine = (await makeServer({ dir, store, extra })).server;
  let calls = 0;
  const service = await startEngineService(engine, { port: 0, key: KEY, calls: () => ({ 'app.ping': async () => 'pong' }) });
  const at = `http://127.0.0.1:${service.address().port}`;
  const host = (await makeServer({ dir, store, launched: true, engine: at, engineKey: KEY })).server;
  t.after(async () => { await new Promise(r => service.close(r)); await host.shutdown(); await engine.shutdown(); });
  await host.engine.start('Plain', { claimNo: 'A' });
  await host.engine.start('Plain', { claimNo: 'B' });
  const ask = host.engine.instanceLabels.bind(host.engine);
  host.engine.instanceLabels = (...args) => { calls++; return ask(...args); };
  const cases = await labelInstances(host, await host.dataStore.findInstances({}, 'full'));
  assert.deepEqual(cases.map(c => c.label).sort(), ['Claim A', 'Claim B']);
  assert.equal(calls, 1, 'one call for all the cases');
  assert.equal(await host.engine.call('app.ping'), 'pong', 'the application\'s own call');
});

test('an application\'s engine calls are added to the engine\'s own (#294)', async (t) => {
  const host = (await makeServer({ dir: folder(), launched: true, extra })).server;
  t.after(() => host.shutdown());
  // makeServer launches with no calls; a launch with some keeps the engine's
  const { BPMNServer } = await import('../dist/index.js');
  const withCalls = BPMNServer.launch(host.configuration, host.logger, { cron: false, calls: () => ({ 'app.echo': async (x) => x }) });
  t.after(() => withCalls.shutdown());
  await withCalls.ready;
  assert.equal(await withCalls.engine.call('app.echo', 5), 5);
  assert.ok(Array.isArray(await withCalls.engine.instanceLabels([])), 'the engine\'s own calls are still there');
});
