// @features: messages-signals, app-delegate
// A model's throw events, through the default application delegate: a message thrown starts the process whose start
// event catches it, or reaches the instance waiting for it; one nobody catches goes to the delegate's issueMessage. A
// signal reaches every instance waiting for it, and one nobody waits for goes to issueSignal.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { makeServer, definitionsFolder } from './helpers.mjs';

const head = `<?xml version="1.0" encoding="UTF-8"?>
<bpmn:definitions xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" id="D_ID" targetNamespace="x">
  <bpmn:message id="M1" name="Order" /><bpmn:message id="M2" name="Nobody" />
  <bpmn:signal id="G1" name="Go" /><bpmn:signal id="G2" name="Silence" />`;

/** S, then a throw event of each `definitions` in turn, then an end. */
const thrower = (id, definitions) => head.replace('D_ID', 'D_' + id) + `
  <bpmn:process id="${id}" isExecutable="true">
    <bpmn:startEvent id="S"><bpmn:outgoing>f0</bpmn:outgoing></bpmn:startEvent>
    ${definitions.map((d, i) => `<bpmn:intermediateThrowEvent id="T${i}"><bpmn:incoming>f${i}</bpmn:incoming><bpmn:outgoing>f${i + 1}</bpmn:outgoing>${d}</bpmn:intermediateThrowEvent>`).join('\n    ')}
    <bpmn:endEvent id="E"><bpmn:incoming>f${definitions.length}</bpmn:incoming></bpmn:endEvent>
    ${definitions.map((d, i) => `<bpmn:sequenceFlow id="f${i}" sourceRef="${i ? 'T' + (i - 1) : 'S'}" targetRef="T${i}" />`).join('\n    ')}
    <bpmn:sequenceFlow id="f${definitions.length}" sourceRef="T${definitions.length - 1}" targetRef="E" />
  </bpmn:process>
</bpmn:definitions>`;

/** A process started by the message Order: it waits at Received. */
const receiver = head.replace('D_ID', 'D_Receiver') + `
  <bpmn:process id="Receiver" isExecutable="true">
    <bpmn:startEvent id="OnOrder"><bpmn:outgoing>r1</bpmn:outgoing><bpmn:messageEventDefinition messageRef="M1" /></bpmn:startEvent>
    <bpmn:userTask id="Received"><bpmn:incoming>r1</bpmn:incoming></bpmn:userTask>
    <bpmn:sequenceFlow id="r1" sourceRef="OnOrder" targetRef="Received" />
  </bpmn:process>
</bpmn:definitions>`;

/** A process that waits for the signal Go, then at Went. */
const waiter = head.replace('D_ID', 'D_Waiter') + `
  <bpmn:process id="Waiter" isExecutable="true">
    <bpmn:startEvent id="WS"><bpmn:outgoing>w1</bpmn:outgoing></bpmn:startEvent>
    <bpmn:intermediateCatchEvent id="OnGo"><bpmn:incoming>w1</bpmn:incoming><bpmn:outgoing>w2</bpmn:outgoing>
      <bpmn:signalEventDefinition signalRef="G1" /></bpmn:intermediateCatchEvent>
    <bpmn:userTask id="Went"><bpmn:incoming>w2</bpmn:incoming></bpmn:userTask>
    <bpmn:sequenceFlow id="w1" sourceRef="WS" targetRef="OnGo" />
    <bpmn:sequenceFlow id="w2" sourceRef="OnGo" targetRef="Went" />
  </bpmn:process>
</bpmn:definitions>`;

async function server(issued) {
  const dir = definitionsFolder();
  fs.writeFileSync(path.join(dir, 'SendsOrder.bpmn'), thrower('SendsOrder', ['<bpmn:messageEventDefinition messageRef="M1" />']));
  fs.writeFileSync(path.join(dir, 'SendsNobody.bpmn'), thrower('SendsNobody', ['<bpmn:messageEventDefinition messageRef="M2" />']));
  fs.writeFileSync(path.join(dir, 'SendsGo.bpmn'), thrower('SendsGo', ['<bpmn:signalEventDefinition signalRef="G1" />', '<bpmn:signalEventDefinition signalRef="G2" />']));
  fs.writeFileSync(path.join(dir, 'Receiver.bpmn'), receiver);
  fs.writeFileSync(path.join(dir, 'Waiter.bpmn'), waiter);
  // the delegate's own hooks, for what no process catches
  const services = {
    issueMessage: async (id, data) => issued.push(['message', id]),
    issueSignal: async (id, data) => issued.push(['signal', id]),
  };
  return (await makeServer({ dir, services })).server;
}

const waitingAt = async (srv, name, elementId) =>
  (await srv.dataStore.findInstances({ name }, 'full')).filter(i => i.items.some(it => it.elementId === elementId && it.status === 'wait'));

test('a message thrown starts the process whose start event catches it', async () => {
  const issued = [];
  const srv = await server(issued);
  const { instance } = await srv.engine.start('SendsOrder', { order: 7 });
  assert.equal(instance.status, 'end');
  assert.equal((await waitingAt(srv, 'Receiver', 'Received')).length, 1, 'Receiver was started by the message');
  assert.deepEqual(issued, [], 'caught: not issued');
  await srv.shutdown();
});

test('a message nobody catches goes to the delegate\'s issueMessage', async () => {
  const issued = [];
  const srv = await server(issued);
  const { instance } = await srv.engine.start('SendsNobody', {});
  assert.equal(instance.status, 'end');
  assert.deepEqual(issued, [['message', 'Nobody']]);
  await srv.shutdown();
});

test('a signal thrown reaches every instance waiting for it; one nobody waits for is issued', async () => {
  const issued = [];
  const srv = await server(issued);
  await srv.engine.start('Waiter', {});
  await srv.engine.start('Waiter', {});
  assert.equal((await waitingAt(srv, 'Waiter', 'OnGo')).length, 2);
  const { instance } = await srv.engine.start('SendsGo', {});
  assert.equal(instance.status, 'end');
  assert.equal((await waitingAt(srv, 'Waiter', 'Went')).length, 2, 'both went on');
  assert.deepEqual(issued.filter(([kind]) => kind === 'signal').map(([, id]) => id), ['Silence'], 'Go was caught; Silence was issued');
  await srv.shutdown();
});

/** Started by the signal Go: it waits at Started. */
const signalStarted = head.replace('D_ID', 'D_OnGo') + `
  <bpmn:process id="OnGo" isExecutable="true">
    <bpmn:startEvent id="GoStart"><bpmn:outgoing>g1</bpmn:outgoing><bpmn:signalEventDefinition signalRef="G1" /></bpmn:startEvent>
    <bpmn:userTask id="Started"><bpmn:incoming>g1</bpmn:incoming></bpmn:userTask>
    <bpmn:sequenceFlow id="g1" sourceRef="GoStart" targetRef="Started" />
  </bpmn:process>
</bpmn:definitions>`;

/** One instance: a branch waits for Go while the other throws it. */
const selfSignal = head.replace('D_ID', 'D_Self') + `
  <bpmn:process id="Self" isExecutable="true">
    <bpmn:startEvent id="S"><bpmn:outgoing>s0</bpmn:outgoing></bpmn:startEvent>
    <bpmn:parallelGateway id="Split"><bpmn:incoming>s0</bpmn:incoming><bpmn:outgoing>s1</bpmn:outgoing><bpmn:outgoing>s2</bpmn:outgoing></bpmn:parallelGateway>
    <bpmn:intermediateCatchEvent id="Hear"><bpmn:incoming>s1</bpmn:incoming><bpmn:outgoing>s3</bpmn:outgoing><bpmn:signalEventDefinition signalRef="G1" /></bpmn:intermediateCatchEvent>
    <bpmn:userTask id="Heard"><bpmn:incoming>s3</bpmn:incoming></bpmn:userTask>
    <bpmn:userTask id="Before"><bpmn:incoming>s2</bpmn:incoming><bpmn:outgoing>s4</bpmn:outgoing></bpmn:userTask>
    <bpmn:intermediateThrowEvent id="Say"><bpmn:incoming>s4</bpmn:incoming><bpmn:outgoing>s5</bpmn:outgoing><bpmn:signalEventDefinition signalRef="G1" /></bpmn:intermediateThrowEvent>
    <bpmn:endEvent id="E"><bpmn:incoming>s5</bpmn:incoming></bpmn:endEvent>
    <bpmn:sequenceFlow id="s0" sourceRef="S" targetRef="Split" />
    <bpmn:sequenceFlow id="s1" sourceRef="Split" targetRef="Hear" />
    <bpmn:sequenceFlow id="s2" sourceRef="Split" targetRef="Before" />
    <bpmn:sequenceFlow id="s3" sourceRef="Hear" targetRef="Heard" />
    <bpmn:sequenceFlow id="s4" sourceRef="Before" targetRef="Say" />
    <bpmn:sequenceFlow id="s5" sourceRef="Say" targetRef="E" />
  </bpmn:process>
</bpmn:definitions>`;

test('a signal starts the processes whose start event catches it, and reaches the throwing instance\'s own branch', async () => {
  const issued = [];
  const srv = await server(issued);
  fs.writeFileSync(path.join(srv.configuration.definitionsPath, 'OnGo.bpmn'), signalStarted);
  fs.writeFileSync(path.join(srv.configuration.definitionsPath, 'Self.bpmn'), selfSignal);
  await srv.definitions.rebuild();

  const reached = await srv.engine.throwSignal('Go', { from: 'outside' });
  assert.equal(reached.length, 1, 'one process started');
  assert.equal((await waitingAt(srv, 'OnGo', 'Started')).length, 1);

  const { instance } = await srv.engine.start('Self', {});
  const done = await srv.engine.invoke({ id: instance.id, 'items.elementId': 'Before' }, {});
  const heard = done.instance.items.filter(i => i.elementId === 'Heard').map(i => i.status);
  assert.deepEqual(heard, ['wait'], 'its own branch heard it');
  assert.equal((await waitingAt(srv, 'OnGo', 'Started')).length, 2, 'and another OnGo started');
  await srv.shutdown();
});

test('a throw with no message or signal named does nothing', async () => {
  const srv = await server([]);
  assert.equal(await srv.engine.throwSignal(null, {}), null);
  assert.equal(await srv.engine.throwMessage(null, {}), null);
  await srv.shutdown();
});
