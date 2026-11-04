// A task whose work throws (a service, a script, a connector that can not be called):
// - with camunda:exceptionsAsErrors="true", the exception is raised as a BPMN error when an error event can catch
//   it: a boundary error event on the task, or an error event sub-process around it. One with no error code
//   catches any exception; one with a code catches the exception whose `code` (else its name) is that code. The
//   flow goes on from the event, as for a returned { bpmnError }.
// - otherwise (or with no event to catch it) the call fails with the exception itself, as before, and the task's
//   item is saved with the status error and the message: engine.retry runs its work again.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { makeServer } from './helpers.mjs';

const NS = 'xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:camunda="http://camunda.org/schema/1.0/bpmn"';
const model = (body, roots = '') => `<?xml version="1.0" encoding="UTF-8"?>
<bpmn:definitions ${NS} id="d" targetNamespace="urn:test">${roots}<bpmn:process id="p" isExecutable="true">${body}</bpmn:process></bpmn:definitions>`;

/** start → task → done, with `boundary` (an error event definition) on the task leading to `caught`. */
const guarded = (task, definition) => model(`
  <bpmn:startEvent id="start" />
  ${task}
  <bpmn:boundaryEvent id="failed" attachedToRef="work">${definition}</bpmn:boundaryEvent>
  <bpmn:endEvent id="done" />
  <bpmn:endEvent id="caught" />
  <bpmn:sequenceFlow id="f0" sourceRef="start" targetRef="work" />
  <bpmn:sequenceFlow id="f1" sourceRef="work" targetRef="done" />
  <bpmn:sequenceFlow id="f2" sourceRef="failed" targetRef="caught" />`,
  '<bpmn:error id="Refused" errorCode="ECONNREFUSED" />');

const SERVICE = '<bpmn:serviceTask id="work" implementation="callOut" camunda:exceptionsAsErrors="true" />';
const SCRIPT = '<bpmn:scriptTask id="work" scriptFormat="JavaScript" camunda:exceptionsAsErrors="true"><bpmn:script>throw new RangeError("too much");</bpmn:script></bpmn:scriptTask>';
const PLAIN = '<bpmn:serviceTask id="work" implementation="callOut" />';
const ANY = '<bpmn:errorEventDefinition />';
const REFUSED = '<bpmn:errorEventDefinition errorRef="Refused" />';

const refused = () => Object.assign(new Error('connect ECONNREFUSED 127.0.0.1:9'), { code: 'ECONNREFUSED' });

async function serverWith(xml, services = {}) {
  const made = await makeServer({ services });
  fs.writeFileSync(made.dir + 'm.bpmn', xml);
  await made.server.definitions.rebuild();
  return made;
}

const status = (instance, id) => instance.items.find(i => i.elementId === id)?.status;

test('a service that throws: a boundary error event with no code catches it, and the flow goes on from it', async () => {
  const { server, store } = await serverWith(guarded(SERVICE, ANY), { callOut: async () => { throw new TypeError('service down'); } });
  const { instance } = await server.engine.start('m', {});
  assert.equal(instance.status, 'end');
  assert.equal(status(instance, 'caught'), 'end');
  assert.equal(status(instance, 'done'), undefined, 'not the normal way');
  assert.equal(status(instance, 'work'), 'end', 'the task is complete, not left started');
  assert.match(JSON.stringify(instance.logs), /service down/, 'the exception is in the log');
  assert.match(JSON.stringify(instance.items.find(i => i.elementId === 'work').statusDetails), /service down/);
  const saved = await server.dataStore.findInstances({ id: instance.id }, 'full');
  assert.equal(saved[0].status, 'end', 'saved as ended, not running');
  assert.deepEqual(await store.find('bpmn_test', 'wf_locks', { kind: 'lock' }), []);
  await server.shutdown();
});

test('a script that throws is caught the same way', async () => {
  const { server } = await serverWith(guarded(SCRIPT, ANY));
  const { instance } = await server.engine.start('m', {});
  assert.equal(instance.status, 'end');
  assert.equal(status(instance, 'caught'), 'end');
  await server.shutdown();
});

test('an error event with a code catches the exception whose code it is; another exception is not caught', async () => {
  let { server } = await serverWith(guarded(SERVICE, REFUSED), { callOut: async () => { throw refused(); } });
  const { instance } = await server.engine.start('m', {});
  assert.equal(status(instance, 'caught'), 'end');
  await server.shutdown();

  ({ server } = await serverWith(guarded(SERVICE, REFUSED), { callOut: async () => { throw new TypeError('something else'); } }));
  await assert.rejects(server.engine.start('m', {}), /something else/);
  await server.shutdown();
});

test('an exception is matched by its name when it has no code', async () => {
  const xml = guarded(SERVICE, '<bpmn:errorEventDefinition errorRef="Type" />').replace('</bpmn:definitions>', '').replace('<bpmn:process', '<bpmn:error id="Type" errorCode="TypeError" /><bpmn:process') + '</bpmn:definitions>';
  const { server } = await serverWith(xml, { callOut: async () => { throw new TypeError('bad'); } });
  const { instance } = await server.engine.start('m', {});
  assert.equal(status(instance, 'caught'), 'end');
  await server.shutdown();
});

test('without the option an error event does not catch an exception: it fails the call, as documented', async () => {
  const { server } = await serverWith(guarded(PLAIN, ANY), { callOut: async () => { throw new TypeError('service down'); } });
  await assert.rejects(server.engine.start('m', {}), /service down/);
  await server.shutdown();
});

test('an error event sub-process catches an exception of a task in its process', async () => {
  const xml = model(`
    <bpmn:startEvent id="start" />
    ${SERVICE}
    <bpmn:endEvent id="done" />
    <bpmn:sequenceFlow id="f0" sourceRef="start" targetRef="work" />
    <bpmn:sequenceFlow id="f1" sourceRef="work" targetRef="done" />
    <bpmn:subProcess id="handler" triggeredByEvent="true">
      <bpmn:startEvent id="onError">${ANY}</bpmn:startEvent>
      <bpmn:endEvent id="handled" />
      <bpmn:sequenceFlow id="h1" sourceRef="onError" targetRef="handled" />
    </bpmn:subProcess>`);
  const { server } = await serverWith(xml, { callOut: async () => { throw new TypeError('service down'); } });
  const { instance } = await server.engine.start('m', {});
  assert.equal(status(instance, 'handled'), 'end');
  assert.equal(status(instance, 'done'), undefined);
  await server.shutdown();
});

test('with no error event to catch it, the call fails with the exception itself, as before', async () => {
  const xml = model(`
    <bpmn:startEvent id="start" />
    ${SERVICE}
    <bpmn:endEvent id="done" />
    <bpmn:sequenceFlow id="f0" sourceRef="start" targetRef="work" />
    <bpmn:sequenceFlow id="f1" sourceRef="work" targetRef="done" />`);
  const { server } = await serverWith(xml, { callOut: async () => { throw new TypeError('service down'); } });
  await assert.rejects(server.engine.start('m', {}), e => e instanceof TypeError && /service down/.test(e.message));
  await server.shutdown();
});

test('a failed item is saved with the status error and its message, not left started; retry runs its work again', async () => {
  let down = true;
  const { server, store } = await serverWith(guarded(PLAIN, ANY), {
    callOut: async () => { if (down) throw Object.assign(new Error('connect ECONNREFUSED'), { code: 'ECONNREFUSED' }); return { ok: true }; } });
  await assert.rejects(server.engine.start('m', {}), /ECONNREFUSED/);
  let [saved] = await server.dataStore.findInstances({ name: 'm' }, 'full');
  assert.equal(saved.status, 'running');
  const failed = saved.items.find(i => i.elementId === 'work');
  assert.equal(failed.status, 'error');
  assert.deepEqual(failed.statusDetails, { error: 'connect ECONNREFUSED', code: 'ECONNREFUSED' });
  assert.equal(status(saved, 'failed'), 'wait', 'its boundary event still waits');
  assert.deepEqual(await store.find('bpmn_test', 'wf_locks', { kind: 'lock' }), []);

  await assert.rejects(server.engine.retry({ 'items.id': failed.id }), /ECONNREFUSED/, 'still failing: the same item, still error');
  [saved] = await server.dataStore.findInstances({ name: 'm' }, 'full');
  assert.equal(saved.items.filter(i => i.elementId === 'work').length, 1);
  assert.equal(status(saved, 'work'), 'error');

  down = false;
  const { instance } = await server.engine.retry({ 'items.id': failed.id }, 'ops');
  assert.equal(instance.status, 'end');
  assert.equal(status(instance, 'work'), 'end');
  assert.equal(status(instance, 'done'), 'end', 'on the normal way');
  assert.equal(status(instance, 'caught'), undefined);
  assert.notEqual(status(instance, 'failed'), 'wait', 'its boundary event is cancelled with it');
  assert.equal(instance.items.find(i => i.elementId === 'work').statusDetails, undefined);

  await assert.rejects(server.engine.retry({ 'items.id': failed.id }), /has not failed/);
  await server.shutdown();
});
