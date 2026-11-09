// @features: timers, instance-locks
// A server shut down with processes halfway: the next one, on the same store, carries each on from where it stopped, with its data,
// with nothing lost, nothing done twice, and what was running when it was asked to stop finished first.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { makeServer, newStore, until, definitionsFolder } from './helpers.mjs';

const model = (id, body, globals = '') => `<?xml version="1.0" encoding="UTF-8"?>
<bpmn:definitions xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:camunda="http://camunda.org/schema/1.0/bpmn" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" id="d_${id}" targetNamespace="urn:test">${globals}
  <bpmn:process id="${id}" isExecutable="true">${body}</bpmn:process>
</bpmn:definitions>`;
const flow = (from, to, condition = '') => `<bpmn:sequenceFlow id="${from}_${to}" sourceRef="${from}" targetRef="${to}">${condition ? `<bpmn:conditionExpression xsi:type="bpmn:tFormalExpression">${condition}</bpmn:conditionExpression>` : ''}</bpmn:sequenceFlow>`;

const MODELS = {
  steps: model('steps', `<bpmn:startEvent id="S" /><bpmn:userTask id="A" /><bpmn:scriptTask id="Add" scriptFormat="JavaScript"><bpmn:script>this.data.added = (this.data.added || 0) + 1;</bpmn:script></bpmn:scriptTask><bpmn:userTask id="B" /><bpmn:userTask id="C" /><bpmn:endEvent id="E" />
    ${flow('S', 'A')}${flow('A', 'Add')}${flow('Add', 'B')}${flow('B', 'C')}${flow('C', 'E')}`),
  parallel: model('parallel', `<bpmn:startEvent id="S" /><bpmn:parallelGateway id="Split" /><bpmn:userTask id="A" /><bpmn:userTask id="B" /><bpmn:parallelGateway id="Join" /><bpmn:userTask id="After" /><bpmn:endEvent id="E" />
    ${flow('S', 'Split')}${flow('Split', 'A')}${flow('Split', 'B')}${flow('A', 'Join')}${flow('B', 'Join')}${flow('Join', 'After')}${flow('After', 'E')}`),
  inclusive: model('inclusive', `<bpmn:startEvent id="S" /><bpmn:inclusiveGateway id="Split" /><bpmn:userTask id="A" /><bpmn:userTask id="B" /><bpmn:userTask id="Never" /><bpmn:inclusiveGateway id="Join" /><bpmn:userTask id="After" /><bpmn:endEvent id="E" />
    ${flow('S', 'Split')}${flow('Split', 'A', 'data.a')}${flow('Split', 'B', 'data.b')}${flow('Split', 'Never', 'data.never')}${flow('A', 'Join')}${flow('B', 'Join')}${flow('Never', 'Join')}${flow('Join', 'After')}${flow('After', 'E')}`),
  sub: model('sub', `<bpmn:startEvent id="S" /><bpmn:subProcess id="Sub"><bpmn:startEvent id="SubS" /><bpmn:userTask id="Inner1" /><bpmn:userTask id="Inner2" /><bpmn:endEvent id="SubE" />${flow('SubS', 'Inner1')}${flow('Inner1', 'Inner2')}${flow('Inner2', 'SubE')}</bpmn:subProcess><bpmn:userTask id="After" /><bpmn:endEvent id="E" />
    ${flow('S', 'Sub')}${flow('Sub', 'After')}${flow('After', 'E')}`),
  child: model('child', `<bpmn:startEvent id="S" /><bpmn:userTask id="Check" /><bpmn:scriptTask id="Wrap" scriptFormat="JavaScript"><bpmn:script>this.data.fromChild = 'yes';</bpmn:script></bpmn:scriptTask><bpmn:endEvent id="E" />
    ${flow('S', 'Check')}${flow('Check', 'Wrap')}${flow('Wrap', 'E')}`),
  caller: model('caller', `<bpmn:startEvent id="S" /><bpmn:callActivity id="Call" calledElement="child" /><bpmn:userTask id="After" /><bpmn:endEvent id="E" />
    ${flow('S', 'Call')}${flow('Call', 'After')}${flow('After', 'E')}`),
  votes: model('votes', `<bpmn:startEvent id="S" /><bpmn:userTask id="Vote"><bpmn:multiInstanceLoopCharacteristics isSequential="false" camunda:collection="$data.voters" camunda:elementVariable="voter" /></bpmn:userTask><bpmn:userTask id="Done" /><bpmn:endEvent id="E" />
    ${flow('S', 'Vote')}${flow('Vote', 'Done')}${flow('Done', 'E')}`),
  rounds: model('rounds', `<bpmn:startEvent id="S" /><bpmn:userTask id="Vote"><bpmn:multiInstanceLoopCharacteristics isSequential="true" camunda:collection="$data.voters" camunda:elementVariable="voter" /></bpmn:userTask><bpmn:userTask id="Done" /><bpmn:endEvent id="E" />
    ${flow('S', 'Vote')}${flow('Vote', 'Done')}${flow('Done', 'E')}`),
  loop: model('loop', `<bpmn:startEvent id="S" /><bpmn:userTask id="Draft" /><bpmn:exclusiveGateway id="Ok" default="Ok_E" /><bpmn:endEvent id="E" />
    ${flow('S', 'Draft')}${flow('Draft', 'Ok')}${flow('Ok', 'Draft', 'data.again === true')}${flow('Ok', 'E')}`),
  message: model('message', `<bpmn:startEvent id="S" /><bpmn:intermediateCatchEvent id="Wait"><bpmn:messageEventDefinition messageRef="Go" /></bpmn:intermediateCatchEvent><bpmn:userTask id="After" /><bpmn:endEvent id="E" />
    ${flow('S', 'Wait')}${flow('Wait', 'After')}${flow('After', 'E')}`, '<bpmn:message id="Go" name="Go" />'),
  either: model('either', `<bpmn:startEvent id="S" /><bpmn:eventBasedGateway id="Gate" /><bpmn:intermediateCatchEvent id="ByMessage"><bpmn:messageEventDefinition messageRef="Go2" /></bpmn:intermediateCatchEvent><bpmn:intermediateCatchEvent id="ByTime"><bpmn:timerEventDefinition><bpmn:timeDuration>PT1H</bpmn:timeDuration></bpmn:timerEventDefinition></bpmn:intermediateCatchEvent><bpmn:userTask id="Got" /><bpmn:userTask id="Late" /><bpmn:endEvent id="E" />
    ${flow('S', 'Gate')}${flow('Gate', 'ByMessage')}${flow('Gate', 'ByTime')}${flow('ByMessage', 'Got')}${flow('ByTime', 'Late')}${flow('Got', 'E')}${flow('Late', 'E')}`, '<bpmn:message id="Go2" name="Go2" />'),
  deadline: model('deadline', `<bpmn:startEvent id="S" /><bpmn:userTask id="Task" /><bpmn:boundaryEvent id="Late" attachedToRef="Task"><bpmn:timerEventDefinition><bpmn:timeDuration>PT1S</bpmn:timeDuration></bpmn:timerEventDefinition></bpmn:boundaryEvent><bpmn:userTask id="Escalated" /><bpmn:userTask id="Normal" /><bpmn:endEvent id="E" /><bpmn:endEvent id="E2" />
    ${flow('S', 'Task')}${flow('Task', 'Normal')}${flow('Late', 'Escalated')}${flow('Normal', 'E')}${flow('Escalated', 'E2')}`),
  slow: model('slow', `<bpmn:startEvent id="S" /><bpmn:userTask id="A" /><bpmn:serviceTask id="Work" implementation="slowWork" /><bpmn:userTask id="B" /><bpmn:endEvent id="E" />
    ${flow('S', 'A')}${flow('A', 'Work')}${flow('Work', 'B')}${flow('B', 'E')}`),
};

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

/** A server on a store and a models folder that outlive it. */
async function host({ services = {}, timers = {} } = {}) {
  const store = newStore();
  const dir = definitionsFolder();
  for (const [name, xml] of Object.entries(MODELS)) fs.writeFileSync(path.join(dir, `${name}.bpmn`), xml);
  let count = 0;
  const open = async () => (await makeServer({ store, dir, services, timers, cron: true, serverId: `server-${++count}` })).server;
  const state = { server: await open() };
  return {
    get server() { return state.server; },
    get engine() { return state.server.engine; },
    async restart() { await state.server.shutdown(); state.server = await open(); },
    stop: () => state.server.shutdown(),
    saved: async id => (await state.server.dataStore.findInstances({ id }, 'full'))[0],
    /** Completes the waiting item of an element, by the id of that item. */
    async complete(id, elementId, data = {}) {
      const [instance] = await state.server.dataStore.findInstances({ id }, 'full');
      const item = instance.items.find(i => i.elementId === elementId && i.status === 'wait');
      assert.ok(item, `${elementId} is not waiting: ${instance.items.filter(i => i.status === 'wait').map(i => i.elementId)}`);
      return state.server.engine.invoke({ id, 'items.id': item.id }, data);
    },
  };
}
const statuses = (instance, elementId) => instance.items.filter(i => i.elementId === elementId).map(i => i.status);
const waiting = instance => instance.items.filter(i => i.status === 'wait').map(i => i.elementId).sort();

test('a process stopped at each step goes on from there, with its data, each step once', async t => {
  const h = await host();
  t.after(() => h.stop());
  const { id } = await h.engine.start('steps', { order: 7 });
  await h.restart();
  assert.deepEqual(waiting(await h.saved(id)), ['A']);
  await h.complete(id, 'A', { fromA: 1 });
  await h.restart();
  assert.deepEqual(waiting(await h.saved(id)), ['B']);
  await h.complete(id, 'B', { fromB: 2 });
  await h.restart();
  await h.complete(id, 'C');
  const done = await h.saved(id);
  assert.equal(done.status, 'end');
  assert.deepEqual(['order', 'fromA', 'fromB', 'added'].map(k => done.data[k]), [7, 1, 2, 1], 'the data kept; the script ran once');
  for (const element of ['A', 'Add', 'B', 'C']) assert.deepEqual(statuses(done, element), ['end'], element);
});

test('parallel branches: one done before the stop, one after; the join goes on once', async t => {
  const h = await host();
  t.after(() => h.stop());
  const { id } = await h.engine.start('parallel', {});
  await h.complete(id, 'A');
  await h.restart();
  assert.deepEqual(waiting(await h.saved(id)), ['B', 'Join'], 'the other branch, and the join for it');
  await h.complete(id, 'B');
  const after = await h.saved(id);
  assert.deepEqual(statuses(after, 'After'), ['wait']);
  await h.restart();
  await h.complete(id, 'After');
  assert.equal((await h.saved(id)).status, 'end');
});

test('an inclusive gateway\'s join waits, after a restart, only for the branches taken', async t => {
  const h = await host();
  t.after(() => h.stop());
  const { id } = await h.engine.start('inclusive', { a: true, b: true, never: false });
  await h.complete(id, 'A');
  await h.restart();
  assert.deepEqual(waiting(await h.saved(id)), ['B', 'Join'], 'the other branch, and the join for it');
  await h.complete(id, 'B');
  assert.deepEqual(statuses(await h.saved(id), 'After'), ['wait']);
});

test('inside a sub-process: it goes on inside, then out of it', async t => {
  const h = await host();
  t.after(() => h.stop());
  const { id } = await h.engine.start('sub', {});
  await h.restart();
  await h.complete(id, 'Inner1');
  await h.restart();
  assert.deepEqual(waiting(await h.saved(id)).filter(e => e !== 'Sub'), ['Inner2']);
  await h.complete(id, 'Inner2');
  const after = await h.saved(id);
  assert.deepEqual(statuses(after, 'Sub'), ['end']);
  assert.deepEqual(statuses(after, 'After'), ['wait']);
});

test('a called process stopped halfway: it finishes, and its caller goes on with what it gave back', async t => {
  const h = await host();
  t.after(() => h.stop());
  const { id } = await h.engine.start('caller', {});
  const [child] = await h.server.dataStore.findInstances({ name: 'child' }, 'summary');
  assert.ok(child, 'the called process started');
  await h.restart();
  await h.complete(child.id, 'Check');
  assert.equal((await h.saved(child.id)).status, 'end');
  const caller = await h.saved(id);
  assert.deepEqual(statuses(caller, 'Call'), ['end']);
  assert.deepEqual(statuses(caller, 'After'), ['wait']);
  assert.equal(caller.data.fromChild, 'yes');
});

for (const [name, what] of [['votes', 'parallel'], ['rounds', 'sequential']])
  test(`a ${what} multi-instance stopped between its rounds: each round once, then on`, async t => {
    const h = await host();
    t.after(() => h.stop());
    const { id } = await h.engine.start(name, { voters: [{ name: 'ann' }, { name: 'bob' }, { name: 'cy' }] });
    await h.complete(id, 'Vote');
    await h.restart();
    await h.complete(id, 'Vote');
    await h.restart();
    await h.complete(id, 'Vote');
    const after = await h.saved(id);
    assert.deepEqual(statuses(after, 'Vote').filter(s => s === 'wait'), []);
    assert.deepEqual(statuses(after, 'Done'), ['wait'], 'on, once');
  });

test('a loop stopped in its second time round: it counts on from there', async t => {
  const h = await host();
  t.after(() => h.stop());
  const { id } = await h.engine.start('loop', {});
  await h.complete(id, 'Draft', { again: true });
  await h.restart();
  await h.complete(id, 'Draft', { again: false });
  const after = await h.saved(id);
  assert.equal(after.status, 'end');
  assert.deepEqual(statuses(after, 'Draft'), ['end', 'end']);
});

test('a process waiting for a message hears it after a restart', async t => {
  const h = await host();
  t.after(() => h.stop());
  const { id } = await h.engine.start('message', {});
  await h.restart();
  await h.engine.throwMessage('Go', { heard: true }, { id });
  const after = await h.saved(id);
  assert.deepEqual(statuses(after, 'Wait'), ['end']);
  assert.deepEqual(statuses(after, 'After'), ['wait']);
});

test('an event-based gateway after a restart: the message wins, and its timer is gone', async t => {
  const h = await host();
  t.after(() => h.stop());
  const { id } = await h.engine.start('either', {});
  await h.restart();
  await h.engine.throwMessage('Go2', {}, { id });
  const after = await h.saved(id);
  assert.deepEqual(statuses(after, 'Got'), ['wait']);
  assert.deepEqual(statuses(after, 'Late'), []);
  assert.ok(!statuses(after, 'ByTime').includes('wait'), 'the other way is closed');
});

test('a deadline on a task: it fires after a restart if it falls due, and interrupts the task', { timeout: 20000 }, async t => {
  const h = await host();
  t.after(() => h.stop());
  const { id } = await h.engine.start('deadline', {});
  await h.restart();
  await until(async () => statuses(await h.saved(id), 'Escalated').length > 0, 8000, 'the deadline');
  const after = await h.saved(id);
  assert.ok(!statuses(after, 'Task').includes('wait'), 'it interrupts the task');
  assert.deepEqual(statuses(after, 'Normal'), []);
});

test('a deadline on a task done after a restart does not fire', { timeout: 20000 }, async t => {
  const h = await host();
  t.after(() => h.stop());
  const { id } = await h.engine.start('deadline', {});
  await h.restart();
  await h.complete(id, 'Task');
  await sleep(1500);
  const after = await h.saved(id);
  assert.deepEqual(statuses(after, 'Normal'), ['wait']);
  assert.deepEqual(statuses(after, 'Escalated'), []);
});

test('many processes at different points all go on', async t => {
  const h = await host();
  t.after(() => h.stop());
  const started = [];
  for (let n = 0; n < 12; n++) started.push((await h.engine.start('steps', { n })).id);
  for (const id of started.slice(0, 4)) await h.complete(id, 'A');
  for (const id of started.slice(0, 2)) await h.complete(id, 'B');
  await h.restart();
  const left = { A: started.slice(4), B: started.slice(2, 4), C: started.slice(0, 2) };
  for (const [element, ids] of Object.entries(left))
    for (const id of ids) assert.deepEqual(waiting(await h.saved(id)), [element], `${id} at ${element}`);
  for (const id of left.A) await h.complete(id, 'A');
  for (const id of [...left.A, ...left.B]) await h.complete(id, 'B');
  for (const id of started) await h.complete(id, 'C');
  const instances = await Promise.all(started.map(id => h.saved(id)));
  assert.deepEqual(instances.map(i => i.status), started.map(() => 'end'));
  assert.deepEqual(instances.map(i => i.data.n), started.map((_, n) => n), 'none mixed with another');
  assert.deepEqual(instances.map(i => i.data.added), started.map(() => 1));
});

test('what is running when the server is asked to stop finishes and is saved, and new work is refused', { timeout: 20000 }, async t => {
  let calls = 0;
  const services = { slowWork: async () => { calls++; await sleep(600); return { worked: true }; } };
  const h = await host({ services });
  t.after(() => h.stop());
  const { id } = await h.engine.start('slow', {});
  const [item] = (await h.saved(id)).items.filter(i => i.elementId === 'A');
  const running = h.engine.invoke({ id, 'items.id': item.id }, {});
  await sleep(100);       // the service is under way
  const old = h.server;
  const stopping = old.shutdown();
  await assert.rejects(old.engine.start('slow', {}), 'a stopping server starts nothing new');
  await Promise.all([running, stopping]);
  const stored = (await old.dataStore.findInstances({ id }, 'full'))[0];
  assert.deepEqual(statuses(stored, 'Work'), ['end'], 'it finished before the stop');
  assert.deepEqual(waiting(stored), ['B']);

  await h.restart();      // its shutdown again does nothing; a new server
  await h.complete(id, 'B');
  assert.equal((await h.saved(id)).status, 'end');
  assert.equal(calls, 1, 'the service ran once');
});
