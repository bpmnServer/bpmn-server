// @features: transaction
// Transactions (elements/Transaction.ts, behaviours/TransEvents.ts): a cancel end event undoes what the transaction completed and
// leaves through its cancel boundary event; a compensate throw event runs the compensation of a named activity.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { makeServer } from './helpers.mjs';

const NS = 'xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:camunda="http://camunda.org/schema/1.0/bpmn"';
const model = (body) => `<?xml version="1.0" encoding="UTF-8"?>
<bpmn:definitions ${NS} id="d" targetNamespace="urn:test"><bpmn:process id="p" isExecutable="true">${body}</bpmn:process></bpmn:definitions>`;

async function serverWith(xml) {
  const made = await makeServer();
  fs.writeFileSync(made.dir + 'm.bpmn', xml);
  await made.server.definitions.rebuild();
  return made;
}
const status = (instance, id) => instance.items.filter(i => i.elementId === id).map(i => i.status);
const task = (server, instance, id, data = {}) => server.engine.invoke({ id: instance.id, 'items.elementId': id, 'items.status': 'wait' }, data);

/** A booking: book (undone by unbook), then decide: cancel inside the transaction, or finish it. */
const booking = model(`
  <bpmn:startEvent id="start" />
  <bpmn:sequenceFlow id="f0" sourceRef="start" targetRef="trans" />
  <bpmn:transaction id="trans">
    <bpmn:startEvent id="t_start" />
    <bpmn:sequenceFlow id="t0" sourceRef="t_start" targetRef="book" />
    <bpmn:scriptTask id="book" scriptFormat="JavaScript"><bpmn:script>data.booked = true;</bpmn:script></bpmn:scriptTask>
    <bpmn:boundaryEvent id="undo" attachedToRef="book"><bpmn:compensateEventDefinition /></bpmn:boundaryEvent>
    <bpmn:scriptTask id="unbook" isForCompensation="true" scriptFormat="JavaScript"><bpmn:script>data.booked = false;</bpmn:script></bpmn:scriptTask>
    <bpmn:association id="a0" associationDirection="One" sourceRef="undo" targetRef="unbook" />
    <bpmn:sequenceFlow id="t1" sourceRef="book" targetRef="decide" />
    <bpmn:userTask id="decide" />
    <bpmn:sequenceFlow id="t2" sourceRef="decide" targetRef="gate" />
    <bpmn:exclusiveGateway id="gate" default="t4" />
    <bpmn:sequenceFlow id="t3" sourceRef="gate" targetRef="cancelled"><bpmn:conditionExpression>data.cancel == true</bpmn:conditionExpression></bpmn:sequenceFlow>
    <bpmn:sequenceFlow id="t4" sourceRef="gate" targetRef="t_end" />
    <bpmn:endEvent id="cancelled"><bpmn:cancelEventDefinition /></bpmn:endEvent>
    <bpmn:endEvent id="t_end" />
  </bpmn:transaction>
  <bpmn:boundaryEvent id="on_cancel" attachedToRef="trans"><bpmn:cancelEventDefinition /></bpmn:boundaryEvent>
  <bpmn:sequenceFlow id="f1" sourceRef="trans" targetRef="done" />
  <bpmn:sequenceFlow id="f2" sourceRef="on_cancel" targetRef="sorry" />
  <bpmn:endEvent id="done" />
  <bpmn:endEvent id="sorry" />`);

test('a transaction that finishes goes on the normal way; its compensation does not run', async () => {
  const { server } = await serverWith(booking);
  const { instance } = await server.engine.start('m', {});
  assert.deepEqual(status(instance, 'decide'), ['wait']);
  const { instance: after } = await task(server, instance, 'decide');
  assert.equal(after.status, 'end');
  assert.deepEqual(status(after, 'done'), ['end']);
  assert.deepEqual(status(after, 'sorry'), []);
  assert.equal(after.data.trans.booked, true, 'a transaction keeps its data under its id');
  await server.shutdown();
});

test('a cancel end event undoes what completed and leaves through the cancel boundary event', async () => {
  const { server } = await serverWith(booking);
  const { instance } = await server.engine.start('m', {});
  const { instance: after } = await task(server, instance, 'decide', { cancel: true });
  assert.deepEqual(status(after, 'sorry'), ['end'], 'out through the boundary event');
  assert.deepEqual(status(after, 'done'), [], 'not the normal way');
  assert.ok(status(after, 'undo').includes('end'), 'the compensation event of what had completed fired');
  assert.deepEqual(status(after, 'unbook'), ['end']);
  assert.equal(after.data.trans.booked, false, 'and undid it');
  await server.shutdown();
});

test('a cancelled transaction ends its instance', async () => {
  const { server } = await serverWith(booking);
  const { instance } = await server.engine.start('m', {});
  const { instance: after } = await task(server, instance, 'decide', { cancel: true });
  await server.shutdown();
  assert.equal(after.status, 'end');
});

test('a cancelled transaction inside a sub-process: the sub-process finishes, and what comes after it runs', async () => {
  const { server } = await serverWith(model(`
    <bpmn:startEvent id="start" />
    <bpmn:sequenceFlow id="f0" sourceRef="start" targetRef="outer" />
    <bpmn:subProcess id="outer">
      <bpmn:startEvent id="o_start" />
      <bpmn:sequenceFlow id="o0" sourceRef="o_start" targetRef="trans" />
      <bpmn:transaction id="trans">
        <bpmn:startEvent id="t_start" />
        <bpmn:sequenceFlow id="t0" sourceRef="t_start" targetRef="book" />
        <bpmn:scriptTask id="book" scriptFormat="JavaScript"><bpmn:script>data.booked = true;</bpmn:script></bpmn:scriptTask>
        <bpmn:boundaryEvent id="undo" attachedToRef="book"><bpmn:compensateEventDefinition /></bpmn:boundaryEvent>
        <bpmn:scriptTask id="unbook" isForCompensation="true" scriptFormat="JavaScript"><bpmn:script>data.booked = false;</bpmn:script></bpmn:scriptTask>
        <bpmn:association id="a0" associationDirection="One" sourceRef="undo" targetRef="unbook" />
        <bpmn:sequenceFlow id="t1" sourceRef="book" targetRef="cancelled" />
        <bpmn:endEvent id="cancelled"><bpmn:cancelEventDefinition /></bpmn:endEvent>
      </bpmn:transaction>
      <bpmn:boundaryEvent id="on_cancel" attachedToRef="trans"><bpmn:cancelEventDefinition /></bpmn:boundaryEvent>
      <bpmn:sequenceFlow id="o1" sourceRef="on_cancel" targetRef="sorry" />
      <bpmn:endEvent id="sorry" />
    </bpmn:subProcess>
    <bpmn:sequenceFlow id="f1" sourceRef="outer" targetRef="after" />
    <bpmn:userTask id="after" />
    <bpmn:sequenceFlow id="f2" sourceRef="after" targetRef="done" />
    <bpmn:endEvent id="done" />`));
  const { instance } = await server.engine.start('m', {});
  assert.deepEqual(status(instance, 'sorry'), ['end']);
  assert.deepEqual(status(instance, 'unbook'), ['end']);
  assert.deepEqual(status(instance, 'outer'), ['end'], 'the sub-process around it finishes');
  assert.deepEqual(status(instance, 'after'), ['wait'], 'and goes on');
  const { instance: after } = await task(server, instance, 'after');
  assert.equal(after.status, 'end');
  await server.shutdown();
});

test('a compensate throw event names an activity: its compensation runs, and the flow goes on', async () => {
  const { server } = await serverWith(model(`
    <bpmn:startEvent id="start" />
    <bpmn:sequenceFlow id="f0" sourceRef="start" targetRef="trans" />
    <bpmn:transaction id="trans">
      <bpmn:startEvent id="t_start" />
      <bpmn:sequenceFlow id="t0" sourceRef="t_start" targetRef="book" />
      <bpmn:scriptTask id="book" scriptFormat="JavaScript"><bpmn:script>data.booked = true;</bpmn:script></bpmn:scriptTask>
      <bpmn:boundaryEvent id="undo" attachedToRef="book"><bpmn:compensateEventDefinition /></bpmn:boundaryEvent>
      <bpmn:sequenceFlow id="t1" sourceRef="book" targetRef="t_end" />
      <bpmn:endEvent id="t_end" />
    </bpmn:transaction>
    <bpmn:sequenceFlow id="f1" sourceRef="trans" targetRef="comp" />
    <bpmn:intermediateThrowEvent id="comp"><bpmn:compensateEventDefinition activityRef="trans" /></bpmn:intermediateThrowEvent>
    <bpmn:sequenceFlow id="f2" sourceRef="comp" targetRef="done" />
    <bpmn:endEvent id="done" />`));
  const { instance } = await server.engine.start('m', {});
  assert.equal(instance.status, 'end');
  assert.deepEqual(status(instance, 'done'), ['end']);
  assert.ok(status(instance, 'undo').includes('end'), 'the compensation of book fired');
  await server.shutdown();
});
