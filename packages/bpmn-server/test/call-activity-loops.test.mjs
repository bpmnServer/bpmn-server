// @features: call-activity, multi-instance
// A call activity's called process runs as the caller's user, in the caller's tenant, and gives back only what its
// output parameters say; a multi-instance loop gives each round its element (camunda:elementVariable) and stops
// when its completion condition holds (docs/design/approvals.md, the engine's gaps).
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { makeServer, definitionsFolder } from './helpers.mjs';

const model = (id, body) => `<?xml version="1.0" encoding="UTF-8"?>
<bpmn:definitions xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:camunda="http://camunda.org/schema/1.0/bpmn"
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" id="D_${id}" targetNamespace="http://bpmn.io/schema/bpmn">
  <bpmn:process id="${id}" isExecutable="true">${body}</bpmn:process>
</bpmn:definitions>`;

/** Caller: calls `called` with the subject; with `outputs`, only those come back. Then waits at After. */
const caller = (called, outputs = '') => model('Caller_' + called, `
    <bpmn:startEvent id="S"><bpmn:outgoing>f1</bpmn:outgoing></bpmn:startEvent>
    <bpmn:callActivity id="Call" calledElement="${called}">
      <bpmn:extensionElements><camunda:inputOutput>
        <camunda:inputParameter name="subject">$item.data.subject</camunda:inputParameter>${outputs}
      </camunda:inputOutput></bpmn:extensionElements>
      <bpmn:incoming>f1</bpmn:incoming><bpmn:outgoing>f2</bpmn:outgoing>
    </bpmn:callActivity>
    <bpmn:userTask id="After"><bpmn:incoming>f2</bpmn:incoming><bpmn:outgoing>f3</bpmn:outgoing></bpmn:userTask>
    <bpmn:endEvent id="E"><bpmn:incoming>f3</bpmn:incoming></bpmn:endEvent>
    <bpmn:sequenceFlow id="f1" sourceRef="S" targetRef="Call" /><bpmn:sequenceFlow id="f2" sourceRef="Call" targetRef="After" />
    <bpmn:sequenceFlow id="f3" sourceRef="After" targetRef="E" />`);

/** Called: a review by who started it (its start event's initiator), then its results. */
const REVIEW = model('Review', `
    <bpmn:startEvent id="S" camunda:initiator="requester"><bpmn:outgoing>f1</bpmn:outgoing></bpmn:startEvent>
    <bpmn:userTask id="Check" camunda:assignee="\${data.requester}"><bpmn:incoming>f1</bpmn:incoming><bpmn:outgoing>f2</bpmn:outgoing></bpmn:userTask>
    <bpmn:scriptTask id="Wrap" scriptFormat="JavaScript"><bpmn:incoming>f2</bpmn:incoming><bpmn:outgoing>f3</bpmn:outgoing>
      <bpmn:script>this.data.internal = { step: 3 }; this.data.decision = this.data.decision || 'none';</bpmn:script></bpmn:scriptTask>
    <bpmn:endEvent id="E"><bpmn:incoming>f3</bpmn:incoming></bpmn:endEvent>
    <bpmn:sequenceFlow id="f1" sourceRef="S" targetRef="Check" /><bpmn:sequenceFlow id="f2" sourceRef="Check" targetRef="Wrap" />
    <bpmn:sequenceFlow id="f3" sourceRef="Wrap" targetRef="E" />`);

/** Called, ends within its start: no wait. */
const QUICK = model('Quick', `
    <bpmn:startEvent id="S"><bpmn:outgoing>f1</bpmn:outgoing></bpmn:startEvent>
    <bpmn:scriptTask id="Compute" scriptFormat="JavaScript"><bpmn:incoming>f1</bpmn:incoming><bpmn:outgoing>f2</bpmn:outgoing>
      <bpmn:script>this.data.decision = 'auto'; this.data.internal = 'x';</bpmn:script></bpmn:scriptTask>
    <bpmn:endEvent id="E"><bpmn:incoming>f2</bpmn:incoming></bpmn:endEvent>
    <bpmn:sequenceFlow id="f1" sourceRef="S" targetRef="Compute" /><bpmn:sequenceFlow id="f2" sourceRef="Compute" targetRef="E" />`);

const DECISION_ONLY = `
        <camunda:outputParameter name="decision">$output.decision</camunda:outputParameter>`;

/** A vote: one round per voter (elementVariable voter), with an optional completion condition; then Done. */
const vote = (id, { sequential = false, condition = '' } = {}) => model(id, `
    <bpmn:startEvent id="S"><bpmn:outgoing>f1</bpmn:outgoing></bpmn:startEvent>
    <bpmn:userTask id="Vote" camunda:assignee="\${data.voter.name}">
      <bpmn:incoming>f1</bpmn:incoming><bpmn:outgoing>f2</bpmn:outgoing>
      <bpmn:multiInstanceLoopCharacteristics isSequential="${sequential}" camunda:collection="$data.voters" camunda:elementVariable="voter">${condition
        ? `<bpmn:completionCondition xsi:type="bpmn:tFormalExpression">${condition}</bpmn:completionCondition>` : ''}</bpmn:multiInstanceLoopCharacteristics>
    </bpmn:userTask>
    <bpmn:userTask id="Done"><bpmn:incoming>f2</bpmn:incoming><bpmn:outgoing>f3</bpmn:outgoing></bpmn:userTask>
    <bpmn:endEvent id="E"><bpmn:incoming>f3</bpmn:incoming></bpmn:endEvent>
    <bpmn:sequenceFlow id="f1" sourceRef="S" targetRef="Vote" /><bpmn:sequenceFlow id="f2" sourceRef="Vote" targetRef="Done" />
    <bpmn:sequenceFlow id="f3" sourceRef="Done" targetRef="E" />`);

const VOTERS = [{ name: 'ann' }, { name: 'bob' }, { name: 'cy' }];

async function server(models) {
  const dir = definitionsFolder();
  for (const [name, xml] of Object.entries(models))
    fs.writeFileSync(path.join(dir, name + '.bpmn'), xml);
  return (await makeServer({ dir })).server;
}
const load = async (srv, id) => (await srv.dataStore.findInstances({ id }, 'full'))[0];
const waiting = (instance, elementId) => instance.items.filter(i => i.elementId === elementId && i.status === 'wait');

test('the called process runs as the caller\'s user, in the caller\'s tenant: it knows who started it', async () => {
  const srv = await server({ Review: REVIEW, Caller_Review: caller('Review') });
  const parent = await srv.engine.start('Caller_Review', { subject: 'S-1' }, null, 'ann', { tenantId: 'acme' });
  const call = waiting(parent.instance, 'Call')[0];
  const [child] = await srv.dataStore.findInstances({ parentItemId: call.id }, 'full');
  assert.equal(child.data.requester, 'ann', "its initiator: the caller's user");
  assert.equal(child.tenantId, 'acme', 'isolated as its caller is');
  assert.equal(waiting(child, 'Check')[0].assignee, 'ann', 'assigned to who started it');
  await srv.shutdown();
});

test('without output parameters all of the called data comes back, as before; the call continues as who ended it', async () => {
  const srv = await server({ Review: REVIEW, Caller_Review: caller('Review') });
  const parent = await srv.engine.start('Caller_Review', { subject: 'S-2' }, null, 'ann');
  const [child] = await srv.dataStore.findInstances({ parentItemId: waiting(parent.instance, 'Call')[0].id }, 'full');
  await srv.engine.invoke({ id: child.id, 'items.elementId': 'Check' }, { decision: 'ok' }, 'bob');
  const after = await load(srv, parent.id);
  assert.equal(after.data.decision, 'ok');
  assert.deepEqual(after.data.internal, { step: 3 }, 'all of it');
  assert.equal(after.items.find(i => i.elementId === 'Call').userName, 'bob');
  assert.ok(waiting(after, 'After').length);
  await srv.shutdown();
});

test('with output parameters only what they map comes back', async () => {
  const srv = await server({ Review: REVIEW, Caller_Review: caller('Review', DECISION_ONLY) });
  const parent = await srv.engine.start('Caller_Review', { subject: 'S-3' }, null, 'ann');
  const [child] = await srv.dataStore.findInstances({ parentItemId: waiting(parent.instance, 'Call')[0].id }, 'full');
  await srv.engine.invoke({ id: child.id, 'items.elementId': 'Check' }, { decision: 'approved' }, 'ann');
  const after = await load(srv, parent.id);
  assert.equal(after.data.decision, 'approved');
  assert.equal(after.data.internal, undefined, 'the called process\'s internals stay there');
  assert.equal(after.data.subject, 'S-3');
  await srv.shutdown();
});

test('a called process that ends within the call gives its data back too (it was lost)', async () => {
  const srv = await server({ Quick: QUICK, Caller_Quick: caller('Quick', DECISION_ONLY) });
  const run = await srv.engine.start('Caller_Quick', { subject: 'S-4' }, null, 'ann');
  assert.equal(run.instance.data.decision, 'auto');
  assert.equal(run.instance.data.internal, undefined);
  assert.ok(waiting(run.instance, 'After').length, 'went on');
  await srv.shutdown();
});

test('each round sees its element (elementVariable) and its index; rounds of objects are kept by index', async () => {
  const srv = await server({ VoteAll: vote('VoteAll') });
  const run = await srv.engine.start('VoteAll', { voters: VOTERS }, null, 'ann');
  const rounds = waiting(run.instance, 'Vote');
  assert.deepEqual(rounds.map(i => i.assignee).sort(), ['ann', 'bob', 'cy'], 'each round assigned from its element');
  assert.deepEqual(run.instance.data.Vote, { 0: { voter: VOTERS[0], loopCounter: 0 }, 1: { voter: VOTERS[1], loopCounter: 1 }, 2: { voter: VOTERS[2], loopCounter: 2 } });
  await srv.shutdown();
});

test('parallel: any one approves completes the loop; the rounds still running are cancelled', async () => {
  const srv = await server({ VoteAny: vote('VoteAny', { condition: "rounds.some(r =&gt; r.decision == 'approved')" }) });
  const run = await srv.engine.start('VoteAny', { voters: VOTERS }, null, 'ann');
  const bob = waiting(run.instance, 'Vote').find(i => i.assignee === 'bob');
  await srv.engine.invoke({ id: run.id, 'items.id': bob.id }, { decision: 'approved' }, 'bob');
  const after = await load(srv, run.id);
  assert.equal(waiting(after, 'Vote').length, 0, 'no round waits');
  assert.equal(waiting(after, 'Done').length, 1, 'the loop went on, once');
  assert.ok(after.logs.some(l => /loop of Vote[\s\S]*completes[\s\S]*1 of 3 rounds done/.test(l.message ?? l)), 'the decision says why');
  await srv.shutdown();
});

test('parallel: a majority (rounds, nrOfInstances) completes it; one vote is not enough', async () => {
  const majority = "rounds.filter(r =&gt; r.decision == 'approved').length &gt; nrOfInstances / 2";
  const srv = await server({ VoteMajority: vote('VoteMajority', { condition: majority }) });
  const run = await srv.engine.start('VoteMajority', { voters: VOTERS }, null, 'ann');
  const by = name => waiting(run.instance, 'Vote').find(i => i.assignee === name);
  await srv.engine.invoke({ id: run.id, 'items.id': by('ann').id }, { decision: 'approved' }, 'ann');
  assert.equal(waiting(await load(srv, run.id), 'Vote').length, 2, 'one of three: goes on');
  await srv.engine.invoke({ id: run.id, 'items.id': by('cy').id }, { decision: 'approved' }, 'cy');
  const after = await load(srv, run.id);
  assert.equal(waiting(after, 'Vote').length, 0);
  assert.equal(waiting(after, 'Done').length, 1);
  await srv.shutdown();
});

test('sequential: a rejection completes the loop, no more rounds; without one, every round runs', async () => {
  const srv = await server({ Chain: vote('Chain', { sequential: true, condition: "data.decision == 'rejected'" }) });
  let run = await srv.engine.start('Chain', { voters: VOTERS }, null, 'ann');
  assert.equal(waiting(run.instance, 'Vote')[0].assignee, 'ann');
  const next = (r, decision, user) => srv.engine.invoke({ id: r.id, 'items.id': waiting(r.instance, 'Vote')[0].id }, { decision }, user);
  run = await next(run, 'approved', 'ann');
  assert.equal(waiting(run.instance, 'Vote')[0].assignee, 'bob', 'the next round');
  run = await next(run, 'rejected', 'bob');
  assert.equal(waiting(run.instance, 'Vote').length, 0, 'cy never asked');
  assert.equal(waiting(run.instance, 'Done').length, 1);

  run = await srv.engine.start('Chain', { voters: VOTERS }, null, 'ann');
  for (const name of ['ann', 'bob', 'cy'])
    run = await next(run, 'approved', name);
  assert.equal(waiting(run.instance, 'Done').length, 1, 'all three rounds, then on');
  await srv.shutdown();
});
