// @features: add-ons
// The context (docs/design/context-object.md): one object made for each call, its `source` saying where. A service
// and a listener are handed it, its item fixed for the call; what it doesn't have it reads from the execution, as
// code was handed the execution before (deprecated). The API's events: `pre-query` narrows a read with its
// listeners' conditions, `pre-action` may refuse an action. The case's actors are kept on it (instance.actors).
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { makeServer, definitionsFolder } from './helpers.mjs';
import { BPMNAPI, SecureUser, narrowed, itemContext, formProblems } from '../dist/index.js';

const model = (id, body) => `<?xml version="1.0" encoding="UTF-8"?>
<bpmn:definitions xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:camunda="http://camunda.org/schema/1.0/bpmn" xmlns:owf="http://omniworkflow.com/schema/owf" id="D_${id}" targetNamespace="x">
  <bpmn:process id="${id}" isExecutable="true">${body}</bpmn:process>
</bpmn:definitions>`;
const SERVICE = model('Svc', `
    <bpmn:startEvent id="S"><bpmn:outgoing>f1</bpmn:outgoing></bpmn:startEvent>
    <bpmn:serviceTask id="Call" camunda:delegateExpression="look"><bpmn:incoming>f1</bpmn:incoming><bpmn:outgoing>f2</bpmn:outgoing></bpmn:serviceTask>
    <bpmn:userTask id="Review" owf:actor="reviewer"><bpmn:incoming>f2</bpmn:incoming><bpmn:outgoing>f3</bpmn:outgoing></bpmn:userTask>
    <bpmn:endEvent id="E"><bpmn:incoming>f3</bpmn:incoming></bpmn:endEvent>
    <bpmn:sequenceFlow id="f1" sourceRef="S" targetRef="Call" />
    <bpmn:sequenceFlow id="f2" sourceRef="Call" targetRef="Review" />
    <bpmn:sequenceFlow id="f3" sourceRef="Review" targetRef="E" />`);

async function serverWith(t, services = {}, extra = {}) {
  const dir = definitionsFolder();
  fs.writeFileSync(path.join(dir, 'Svc.bpmn'), SERVICE);
  const { server } = await makeServer({ dir, services, extra });
  t.after(() => server.shutdown());
  return server;
}

test('a service is handed the context of its call: its item, the case, where it was made; the rest is the execution\'s', async (t) => {
  let seen;
  const server = await serverWith(t, { look: async (input, context) => { seen = { context, kind: context.source.kind, what: context.source.what, item: context.item, instance: context.instance, tokens: context.tokens, id: context.id }; return { ok: 1 }; } });
  const started = await server.engine.start('Svc', { n: 1 });
  assert.equal(seen.kind, 'item');
  assert.equal(seen.what, 'look');
  assert.equal(seen.item.elementId, 'Call', 'its item, fixed for the call');
  assert.equal(seen.instance.id, started.instance.id);
  assert.ok(seen.tokens, 'what it has not, the execution\'s (deprecated)');
  assert.equal(seen.id, started.instance.id, 'the execution\'s id, through it');
  assert.equal(seen.context.execution.id, started.instance.id, 'the execution itself, not enumerable');
  assert.ok(!Object.keys(seen.context).includes('execution'));
});

test('a listener is handed the event\'s context: its item stays the event\'s', async (t) => {
  const server = await serverWith(t, { look: async () => ({}) });
  const kept = [];
  server.listener.on('end', ({ context }) => kept.push(context));
  await server.engine.start('Svc', {});
  const call = kept.find(c => c.item?.elementId === 'Call');
  assert.ok(call, 'the service task\'s end');
  assert.equal(call.source.kind, 'item');
  assert.equal(call.event, 'end');
  // later events set the execution's item; the context kept stays its own
  assert.equal(call.item.elementId, 'Call');
});

test('executionStarted and the services provider are handed the context too, after the execution', async (t) => {
  const calls = [];
  class Delegate extends (await import('./helpers.mjs')).TestDelegate {
    executionStarted(execution, context) { calls.push(['started', !!execution?.instance, context?.source?.kind]); }
    async getServicesProvider(execution, context) { calls.push(['provider', context?.source?.kind]); return this; }
  }
  const server = await serverWith(t, {}, { appDelegate: (s) => new Delegate(s, { look: async () => ({}) }) });
  await server.engine.start('Svc', {});
  assert.deepEqual(calls.find(c => c[0] === 'started'), ['started', true, 'element']);
  assert.deepEqual(calls.find(c => c[0] === 'provider' && c[1]), ['provider', 'item']);
});

test('the Policies add-on keeps the case\'s actors on it, saved with it', async (t) => {
  const server = await serverWith(t, { look: async () => ({}) });
  const started = await server.engine.start('Svc', {}, null, 'ann');
  const review = started.instance.items.find(i => i.elementId === 'Review');
  await server.engine.invoke({ id: started.instance.id, 'items.id': review.id }, {}, 'bob');
  const [saved] = await server.dataStore.findInstances({ id: started.instance.id }, 'full');
  assert.equal(saved.actors?.initiator, 'ann');
  assert.equal(saved.actors?.reviewer, 'bob', 'the actor of the task bob completed');
});

test('pre-query: a listener\'s conditions narrow the API\'s reads; pre-action: a listener refuses', async (t) => {
  const server = await serverWith(t, { look: async () => ({}) });
  const api = new BPMNAPI(server);
  const ann = new SecureUser({ userName: 'ann', userGroups: ['staff'] }, { enforceSecurity: true });
  const a = await server.engine.start('Svc', { region: 'east' });
  await server.engine.start('Svc', { region: 'west' });
  const asked = [];
  server.listener.on('pre-query', (context) => { asked.push(context.source); context.conditions.push({ 'data.region': 'east' }); });
  const found = await api.data.findInstances({ name: 'Svc' }, ann);
  assert.deepEqual(found.map(i => i.data.region), ['east'], 'only what the listener allows');
  assert.equal(asked[0].kind, 'query');
  assert.equal(asked[0].query, 'instances');

  server.listener.on('pre-action', (context) => { if (context.action === 'complete' && context.user.userName === 'ann') throw Object.assign(new Error('not ann'), { code: 'REFUSED' }); });
  const review = a.instance.items.find(i => i.elementId === 'Review');
  await assert.rejects(() => api.engine.invoke({ id: a.instance.id, 'items.id': review.id }, {}, ann), /not ann/);
});

test('narrowed: conditions all hold, a key said twice kept both ways', () => {
  assert.deepEqual(narrowed({ name: 'A' }, [{ status: 'wait' }]), { name: 'A', status: 'wait' });
  assert.deepEqual(narrowed({ $or: [{ a: 1 }] }, [{ $or: [{ b: 2 }] }]), { $and: [{ $or: [{ a: 1 }] }, { $or: [{ b: 2 }] }] });
  assert.equal(typeof itemContext, 'function');
});

test("appVars are made from the context: a script's, its item's, with its source", async (t) => {
  const dir = definitionsFolder();
  fs.writeFileSync(path.join(dir, 'Vars.bpmn'), model('Vars', `
    <bpmn:startEvent id="S"><bpmn:outgoing>f1</bpmn:outgoing></bpmn:startEvent>
    <bpmn:scriptTask id="Calc"><bpmn:incoming>f1</bpmn:incoming><bpmn:script>data.w = appVars.who;</bpmn:script></bpmn:scriptTask>
    <bpmn:sequenceFlow id="f1" sourceRef="S" targetRef="Calc" />`));
  const { server } = await makeServer({ dir });
  t.after(() => server.shutdown());
  let seen;
  server.appDelegate.appVarsClass = class { constructor(context) { seen = context; } who() { return 'w'; } };
  const started = await server.engine.start('Vars', {});
  assert.equal(started.instance.data.w, 'w');
  assert.equal(seen.source.kind, 'item');
  assert.equal(seen.source.elementId, 'Calc');
  assert.equal(seen.item.elementId, 'Calc', 'the live item');
  assert.equal(seen.instance.id, started.instance.id);
  assert.equal(seen.evaluatingSource.id, 'Calc', 'its name before 3.7.5, kept');
});

test("a form's rules are handed the field's context, kind form, what they were handed before kept", async (t) => {
  const server = await serverWith(t);
  let seen;
  server.registrations.addFieldRule({ name: 'seen', check(_s, _f, _v, _at, context) { seen = context; return null; } });
  await formProblems(server, [{ id: 'amount', type: 'long' }], { amount: 5 }, {}, { processName: 'Svc', taskId: 't1', user: { userName: 'ann' } });
  assert.equal(seen.source.kind, 'form');
  assert.equal(seen.field, 'amount');
  assert.deepEqual(seen.input, { amount: 5 }, "the form's values");
  assert.equal(seen.user.userName, 'ann');
  assert.equal(seen.processName, 'Svc', 'as before');
  assert.equal(seen.taskId, 't1');
});

test('a case saved without actors (before 3.7.5) has them as it is read', async (t) => {
  const server = await serverWith(t, { look: async () => ({}) });
  const started = await server.engine.start('Svc', {}, null, 'ann');
  const store = server.dataStore;
  await store.db.update(store.dbConfiguration.db, store.dbConfiguration.Instance_collection, { id: started.instance.id }, { $set: { actors: null } });
  const [read] = await store.findInstances({ id: started.instance.id }, 'full');
  assert.equal(read.actors?.initiator, 'ann');
});
