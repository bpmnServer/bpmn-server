// @features: engine-api
// A host and its engine over the network (docs/design/engine-isolation.md): `startEngineService` serves the engine's
// calls, `BPMNServer.launch(..., { engine: 'http://...', engineKey })` asks them. Each call the host forwards reaches
// the engine and answers data; an error the engine throws comes back as one, its message and code kept; the service
// refuses what is not a call from its host.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { makeServer, definitionsFolder, newStore } from './helpers.mjs';
import { startEngineService, EngineNotRunningError } from '../dist/index.js';

const KEY = 'the-hosts-key';

/** Review waits; a second start event (Extra) starts Additional; Wait catches the message Order, Hold the signal Go. */
const model = `<?xml version="1.0" encoding="UTF-8"?>
<bpmn:definitions xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" id="D_Remote" targetNamespace="x">
  <bpmn:message id="M1" name="Order" />
  <bpmn:signal id="G1" name="Go" />
  <bpmn:process id="Remote" isExecutable="true">
    <bpmn:startEvent id="S"><bpmn:outgoing>f1</bpmn:outgoing></bpmn:startEvent>
    <bpmn:userTask id="Review"><bpmn:incoming>f1</bpmn:incoming><bpmn:outgoing>f2</bpmn:outgoing></bpmn:userTask>
    <bpmn:intermediateCatchEvent id="Wait"><bpmn:incoming>f2</bpmn:incoming><bpmn:outgoing>f3</bpmn:outgoing>
      <bpmn:messageEventDefinition messageRef="M1" /></bpmn:intermediateCatchEvent>
    <bpmn:intermediateCatchEvent id="Hold"><bpmn:incoming>f3</bpmn:incoming><bpmn:outgoing>f4</bpmn:outgoing>
      <bpmn:signalEventDefinition signalRef="G1" /></bpmn:intermediateCatchEvent>
    <bpmn:endEvent id="E"><bpmn:incoming>f4</bpmn:incoming></bpmn:endEvent>
    <bpmn:startEvent id="Extra"><bpmn:outgoing>f5</bpmn:outgoing></bpmn:startEvent>
    <bpmn:userTask id="Additional"><bpmn:incoming>f5</bpmn:incoming></bpmn:userTask>
    <bpmn:sequenceFlow id="f1" sourceRef="S" targetRef="Review" />
    <bpmn:sequenceFlow id="f2" sourceRef="Review" targetRef="Wait" />
    <bpmn:sequenceFlow id="f3" sourceRef="Wait" targetRef="Hold" />
    <bpmn:sequenceFlow id="f4" sourceRef="Hold" targetRef="E" />
    <bpmn:sequenceFlow id="f5" sourceRef="Extra" targetRef="Additional" />
  </bpmn:process>
</bpmn:definitions>`;

/** An engine with its service, and a host launched on it: the same models and store. */
async function hostAndEngine(t, { calls, engineTimeout } = {}) {
  const dir = definitionsFolder();
  fs.writeFileSync(path.join(dir, 'Remote.bpmn'), model);
  const store = newStore();
  const engine = (await makeServer({ dir, store })).server;
  const service = await startEngineService(engine, { port: 0, key: KEY, calls });
  const at = `http://127.0.0.1:${service.address().port}`;
  const host = (await makeServer({ dir, store, launched: true, engine: at, engineKey: KEY, engineTimeout })).server;
  t.after(async () => { await new Promise(resolve => service.close(resolve)); await host.shutdown(); await engine.shutdown(); });
  return { engine, host, at };
}

const post = (at, body, key = KEY, method = 'POST', url = '/engine/call') =>
  fetch(at + url, { method, headers: { 'Content-Type': 'application/json', 'x-engine-key': key }, body: method === 'POST' ? body : undefined });

const statusOf = (result, elementId) => result.instance.items.filter(i => i.elementId === elementId).map(i => i.status);

test('each call the host forwards runs in the engine, and answers data', async (t) => {
  const { host } = await hostAndEngine(t);
  const started = await host.engine.start('Remote', { amount: 1 });
  const id = started.instance.id;
  assert.deepEqual(statusOf(started, 'Review'), ['wait']);

  const got = await host.engine.get({ id });
  assert.equal(got.instance.data.amount, 1);

  const extra = await host.engine.startEvent(id, 'Extra', { extra: true });
  assert.deepEqual(statusOf(extra, 'Additional'), ['wait'], 'startEvent: the second start event ran');

  const invoked = await host.engine.invoke({ id, 'items.elementId': 'Review' }, { approved: true });
  assert.deepEqual(statusOf(invoked, 'Wait'), ['wait']);

  // restart reaches the engine, which says why it cannot: no save point was kept for Review
  await assert.rejects(host.engine.restart({ id, 'items.elementId': 'Review' }, {}, 'admin'), /No savePoint found/);

  await host.engine.throwMessage('Order', { order: 7 }, { id });
  const signalled = await host.engine.throwSignal('Go', {}, { id });
  assert.ok(Array.isArray(signalled), 'throwSignal answers the instances it reached');
  await host.engine.invoke({ id, 'items.elementId': 'Additional' }, {});
  assert.equal((await host.engine.get({ id })).instance.status, 'end');

  const other = (await host.engine.start('Remote', {})).instance.id;
  const cancelled = await host.engine.cancel({ id: other }, 'admin');
  assert.equal(cancelled.instance.status, 'terminated');

  const status = await host.engine.status();
  assert.equal(status.running, 0);
  assert.ok(status.calls >= 8, `the engine counted the calls: ${status.calls}`);

  const report = await host.engine.upgradeRunning(['Remote'], { dryRun: true });
  assert.ok(Array.isArray(report));
  const upgraded = await host.engine.upgrade('Remote', []);
  assert.ok(Array.isArray(upgraded) || upgraded.errors, 'upgrade answers what it did, or its errors');
});

test('an error in the engine comes back as one, with its message and code', async (t) => {
  const { host } = await hostAndEngine(t);
  const { instance } = await host.engine.start('Remote', {});
  await assert.rejects(host.engine.retry({ id: instance.id, 'items.elementId': 'Review' }), /has not failed/);
  await assert.rejects(host.engine.call('noSuchCall'), /No call 'noSuchCall'/);
});

test('the service answers only its host\'s calls', async (t) => {
  const { at } = await hostAndEngine(t);
  const call = JSON.stringify({ method: 'status', args: [] });
  assert.equal((await post(at, call, 'wrong-key')).status, 401, 'another key');
  assert.equal((await post(at, call, KEY, 'GET')).status, 404, 'not a POST');
  assert.equal((await post(at, call, KEY, 'POST', '/other')).status, 404, 'another path');
  assert.equal((await post(at, '{not json')).status, 400, 'not JSON');
  assert.equal((await post(at, JSON.stringify({ method: 'status', args: 'x' }))).status, 404, 'args not a list');
  assert.equal((await post(at, JSON.stringify({ method: 'toString' }))).status, 404, 'not one of its calls');
  const ok = await post(at, call);
  assert.equal(ok.status, 200);
  assert.equal((await ok.json()).result.running, 0);
  assert.throws(() => startEngineService({}, { port: 0 }), /needs a key/);
});

test('an engine that is not there, or too slow, is said to be', async (t) => {
  const slow = () => ({ slow: () => new Promise(resolve => setTimeout(() => resolve('late'), 400)) });
  const { host } = await hostAndEngine(t, { calls: slow, engineTimeout: 100 });
  await assert.rejects(host.engine.call('slow'), err => err.code === 'ENGINE_TIMEOUT' && /did not answer within 100 ms/.test(err.message));

  // the host's first call, setting up the engine's stores, finds no one there
  await assert.rejects(makeServer({ launched: true, engine: 'http://127.0.0.1:9', engineKey: KEY }),
    err => err instanceof EngineNotRunningError && /can not be reached/.test(err.message));
});
