// @features: timers, instance-locks, engine-api
// What the engine owes when timers, locks and its host's calls go wrong: a timer starts at its own start event, a lock is
// kept for as long as its holder lives, and a host is told plainly when its engine does not answer.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import { BPMNServer, InstanceLocker } from '../dist/index.js';
import { makeServer, newStore, until, quiet, definitionsFolder } from './helpers.mjs';

const TWO_STARTS = `<?xml version="1.0" encoding="UTF-8"?>
<bpmn:definitions xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" id="d" targetNamespace="urn:test">
  <bpmn:process id="TwoStarts" isExecutable="true">
    <bpmn:startEvent id="ByHand" />
    <bpmn:userTask id="HandPath" />
    <bpmn:startEvent id="ByTimer"><bpmn:timerEventDefinition><bpmn:timeDuration>PT1S</bpmn:timeDuration></bpmn:timerEventDefinition></bpmn:startEvent>
    <bpmn:userTask id="TimerPath" />
    <bpmn:sequenceFlow id="f1" sourceRef="ByHand" targetRef="HandPath" />
    <bpmn:sequenceFlow id="f2" sourceRef="ByTimer" targetRef="TimerPath" />
  </bpmn:process>
</bpmn:definitions>`;

test('a timer start event starts at itself, on the path it begins, and not as a user named after it', async () => {
  const dir = definitionsFolder();
  fs.writeFileSync(path.join(dir, 'two-starts.bpmn'), TWO_STARTS);
  const { server } = await makeServer({ dir, cron: true });
  try {
    const started = await until(async () => (await server.dataStore.findInstances({ name: 'two-starts' }, 'full'))[0], 6000, 'the timer to start it');
    const elements = started.items.map(item => item.elementId);
    assert.ok(elements.includes('ByTimer') && elements.includes('TimerPath'), elements.join());
    assert.ok(!elements.includes('HandPath'), 'not the start event a user starts');
    assert.notEqual(started.items[0].userName, 'ByTimer');
  } finally { await server.shutdown(); }
});

test('a lock is kept for as long as its holder lives, however long that is; only a dead holder\'s goes stale', async () => {
  const store = newStore();
  const options = { database: 'd', retryDelay: 5, maxTries: 2, staleAfter: 300 };
  const holder = new InstanceLocker(store, { ...options, owner: 'holder' });
  const other = new InstanceLocker(store, { ...options, owner: 'other' });
  await holder.install();
  await holder.lock('i1');
  await new Promise(resolve => setTimeout(resolve, 900));      // three times the stale age: a long service task
  await assert.rejects(other.lock('i1'), /held by holder/, 'it is still being worked on');
  await holder.release('i1');
  assert.equal(await other.lock('i1'), true, 'released: free');
  await other.release('i1');

  // the holder dies: no one renews, and its lock is taken over
  await holder.lock('i2');
  holder.stopRenewing();
  await new Promise(resolve => setTimeout(resolve, 400));
  assert.equal(await other.lock('i2'), true);
  await other.release('i2');
});

test('a claim is not renewed: a server that dies holding a timer\'s claim does not keep it from firing', async () => {
  const store = newStore();
  const options = { database: 'd', staleAfter: 200 };
  const first = new InstanceLocker(store, { ...options, owner: 'first' });
  const second = new InstanceLocker(store, { ...options, owner: 'second' });
  await first.install();
  assert.equal(await first.claim('timer:t1'), true);
  assert.equal(await second.claim('timer:t1'), false, 'while it may be firing');
  await new Promise(resolve => setTimeout(resolve, 300));
  assert.equal(await second.claim('timer:t1'), true, 'tried again');
});

function launchedAt(url, engineTimeout) {
  return (async () => {
    const { server } = await makeServer({});
    const launched = BPMNServer.launch(server.configuration, quiet(), { cron: false, engine: url, engineKey: 'k', engineTimeout });
    await launched.ready.catch(() => { });
    return launched;
  })();
}

test('an engine that does not answer: the host stops waiting and says it may still be running', async () => {
  const silent = http.createServer(() => { /* never answers */ });
  await new Promise(resolve => silent.listen(0, '127.0.0.1', resolve));
  const launched = await launchedAt(`http://127.0.0.1:${silent.address().port}`, 200);
  try {
    await assert.rejects(launched.engine.start('anything', {}), error => {
      assert.equal(error.code, 'ENGINE_TIMEOUT');
      assert.match(error.message, /did not answer within 200 ms/);
      assert.match(error.message, /may still be running/);
      return true;
    });
  } finally {
    silent.closeAllConnections();
    silent.close();
  }
});

test('an engine that breaks off in the middle of an answer: said as such, not as a bad answer', async () => {
  const breaking = http.createServer((request, response) => { request.resume(); request.on('end', () => response.destroy()); });
  await new Promise(resolve => breaking.listen(0, '127.0.0.1', resolve));
  const launched = await launchedAt(`http://127.0.0.1:${breaking.address().port}`, 5000);
  try {
    await assert.rejects(launched.engine.start('anything', {}), /can not be reached/);
  } finally {
    breaking.closeAllConnections();
    breaking.close();
  }
});

test('locks refuse to run with nothing to exclude anyone: no unique index, and none could be made', async () => {
  const store = newStore();
  store.createIndex = async () => { throw new Error('not authorized'); };
  const locker = new InstanceLocker(store, { database: 'd', owner: 'a', retryDelay: 5, maxTries: 2 });
  await assert.rejects(locker.lock('i1'), /can not exclude anyone.*not authorized/s);
  assert.deepEqual(await store.find('d', 'wf_locks', {}, null).catch(() => []), [], 'and its trial leaves nothing');
});

test('a user who may not create indexes still locks, when the index is already there', async () => {
  const store = newStore();
  await new InstanceLocker(store, { database: 'd', owner: 'setup' }).install();
  store.createIndex = async () => { throw new Error('not authorized'); };
  const locker = new InstanceLocker(store, { database: 'd', owner: 'a', retryDelay: 5, maxTries: 2 });
  assert.equal(await locker.lock('i1'), true);
  await locker.release('i1');
});

const REMINDERS = `<?xml version="1.0" encoding="UTF-8"?>
<bpmn:definitions xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" id="d2" targetNamespace="urn:test">
  <bpmn:process id="Reminders" isExecutable="true">
    <bpmn:startEvent id="S" /><bpmn:userTask id="Task" />
    <bpmn:boundaryEvent id="Every" cancelActivity="false" attachedToRef="Task"><bpmn:timerEventDefinition><bpmn:timeCycle xsi:type="bpmn:tFormalExpression">R3/PT1H</bpmn:timeCycle></bpmn:timerEventDefinition></bpmn:boundaryEvent>
    <bpmn:scriptTask id="Remind" scriptFormat="JavaScript"><bpmn:script>this.data.reminders = (this.data.reminders || 0) + 1;</bpmn:script></bpmn:scriptTask>
    <bpmn:endEvent id="E" />
    <bpmn:sequenceFlow id="f1" sourceRef="S" targetRef="Task" /><bpmn:sequenceFlow id="f2" sourceRef="Task" targetRef="E" /><bpmn:sequenceFlow id="b1" sourceRef="Every" targetRef="Remind" />
  </bpmn:process>
</bpmn:definitions>`;

const remindersOf = async (server, id) => (await server.dataStore.findInstances({ id }, 'full'))[0].data.reminders ?? 0;
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

test('a repeating timer survives a restart: its remaining repetitions, no more', { timeout: 30000 }, async () => {
  const store = newStore();
  const dir = definitionsFolder();
  fs.writeFileSync(path.join(dir, 'reminders.bpmn'), REMINDERS);
  const timers = { forceTimersDelay: 400, precision: 100, pollInterval: 200 };
  const a = await makeServer({ store, dir, cron: true, timers, serverId: 'a' });
  const { id } = await a.server.engine.start('reminders', {});
  await until(async () => (await remindersOf(a.server, id)) === 1, 8000, 'the first reminder');
  await a.server.shutdown();
  const fired = await remindersOf(a.server, id);
  assert.ok(fired < 3, `some are left: ${fired}`);

  const b = await makeServer({ store, dir, cron: true, timers, serverId: 'b' });
  try {
    await until(async () => (await remindersOf(b.server, id)) === 3, 10000, 'all three reminders');
    await sleep(1200);
    assert.equal(await remindersOf(b.server, id), 3, 'three, no more');
  } finally { await b.server.shutdown(); }
});

test('a timer whose firing fails after its claim is tried again, once its claim expires, and does not run twice', { timeout: 30000 }, async () => {
  const reminded = [];
  const services = { remind: async (input, context) => { reminded.push(context.item.token.execution.id); } };
  const { server } = await makeServer({ services, cron: true, locks: { staleAfter: 500 }, timers: { pollInterval: 200 } });
  const invoke = server.engine.invoke.bind(server.engine);
  let failures = 0;
  server.engine.invoke = async (...args) => {
    if (failures++ === 0) throw new Error('the database went away');
    return invoke(...args);
  };
  try {
    const started = await server.engine.start('reminder', {});
    await until(async () => (await server.dataStore.findInstance({ id: started.id }, 'summary')).status === 'end', 15000, 'the timer, the second time');
    await sleep(800);
    assert.deepEqual(reminded, [started.id]);
    assert.ok(failures >= 2);
  } finally { await server.shutdown(); }
});

test('a cancelled process\'s timer does not fire', async () => {
  const reminded = [];
  const { server } = await makeServer({ services: { remind: async () => { reminded.push(1); } }, cron: true });
  try {
    const started = await server.engine.start('reminder', {});
    await server.engine.cancel({ id: started.id });
    await sleep(1800);
    assert.deepEqual(reminded, []);
    assert.notEqual((await server.dataStore.findInstance({ id: started.id }, 'summary')).status, 'end');
  } finally { await server.shutdown(); }
});

test('after shutdown a pending timer does not fire; another server takes it, once', { timeout: 20000 }, async () => {
  const reminded = [];
  const services = { remind: async (input, context) => { reminded.push(context.item.token.execution.id); } };
  const store = newStore();
  const a = await makeServer({ store, services, cron: true, serverId: 'a' });
  const started = await a.server.engine.start('reminder', {});
  await a.server.shutdown();
  await sleep(1800);
  assert.deepEqual(reminded, [], 'nothing runs on a server that stopped');
  const b = await makeServer({ store, dir: a.dir, services, cron: true, serverId: 'b' });
  try {
    await until(async () => (await b.server.dataStore.findInstance({ id: started.id }, 'summary')).status === 'end', 8000, 'the next server');
    assert.deepEqual(reminded, [started.id]);
  } finally { await b.server.shutdown(); }
});

const TIMED = seconds => `<?xml version="1.0" encoding="UTF-8"?>
<bpmn:definitions xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" id="d3" targetNamespace="urn:test"><bpmn:process id="timed" isExecutable="true">
  <bpmn:startEvent id="T"><bpmn:timerEventDefinition><bpmn:timeDuration>PT${seconds}S</bpmn:timeDuration></bpmn:timerEventDefinition></bpmn:startEvent><bpmn:userTask id="U" /><bpmn:sequenceFlow id="f" sourceRef="T" targetRef="U" />
</bpmn:process></bpmn:definitions>`;
const startedCount = async server => (await server.dataStore.findInstances({ name: 'timed' }, 'summary')).length;

test('two servers, a process timer due on both: one instance, whatever their start times', { timeout: 30000 }, async () => {
  for (const gap of [0, 700]) {
    const store = newStore();
    const dir = definitionsFolder();
    fs.writeFileSync(path.join(dir, 'timed.bpmn'), TIMED(2));
    const a = await makeServer({ store, dir, cron: true, serverId: 'a' });
    await sleep(gap);
    const b = await makeServer({ store, dir, cron: true, serverId: 'b' });
    await sleep(2300 - gap);
    assert.equal(await startedCount(a.server), 1, `started ${gap} ms apart`);
    await a.server.shutdown(); await b.server.shutdown();
  }
});

test('an occurrence overdue on two servers that start together: one instance', { timeout: 30000 }, async () => {
  const store = newStore();
  const dir = definitionsFolder();
  fs.writeFileSync(path.join(dir, 'timed.bpmn'), TIMED(1));
  const first = await makeServer({ store, dir, cron: true, serverId: 'first' });
  await first.server.shutdown();
  await sleep(1300);       // due, with no server to start it
  const [a, b] = await Promise.all(['a', 'b'].map(serverId => makeServer({ store, dir, cron: true, serverId })));
  await sleep(600);
  assert.equal(await startedCount(a.server), 1);
  await a.server.shutdown(); await b.server.shutdown();
});

test('the server that starts a repeating process timer dies: the other starts the next', { timeout: 30000 }, async () => {
  const store = newStore();
  const dir = definitionsFolder();
  fs.writeFileSync(path.join(dir, 'timed.bpmn'), TIMED(1));
  const timers = { pollInterval: 200 };
  const servers = await Promise.all(['a', 'b'].map(serverId => makeServer({ store, dir, cron: true, timers, serverId })));
  await until(async () => (await startedCount(servers[0].server)) >= 1, 6000, 'the first');
  const [winner, other] = servers[0].server.cron.counters.fired ? servers : [servers[1], servers[0]];
  await winner.server.shutdown();
  const before = await startedCount(other.server);
  await until(async () => (await startedCount(other.server)) > before, 8000, 'the next, by the one left');
  await other.server.shutdown();
});

test('deleting an instance is the engine\'s: its timers go with it, and a call running it finishes first', { timeout: 20000 }, async () => {
  const reminded = [];
  const { server } = await makeServer({ services: { remind: async () => { reminded.push(1); } }, cron: true });
  try {
    const started = await server.engine.start('reminder', {});
    assert.equal(server.cron.pending, 1);
    assert.deepEqual(await server.engine.deleteInstances({ id: started.id }), { deletedCount: 1 });
    assert.equal(server.cron.pending, 0, 'its timer is cancelled with it');
    await sleep(1500);
    assert.deepEqual(reminded, [], 'nothing fires for it after');
    assert.equal((await server.dataStore.findInstances({ id: started.id }, 'summary')).length, 0);

    // a call under way holds the instance: the delete waits for it, and what it saved does not come back
    const slow = await server.engine.start('reminder', {});
    await server.locker.lock(slow.id);
    const deleting = server.engine.deleteInstances({ id: slow.id });
    await sleep(100);
    assert.equal((await server.dataStore.findInstances({ id: slow.id }, 'summary')).length, 1, 'not while it is held');
    await server.locker.release(slow.id);
    assert.deepEqual(await deleting, { deletedCount: 1 });
  } finally { await server.shutdown(); }
});

test('a user task in a lane with one candidate group: offered to both, and it starts', async () => {
  const { server } = await makeServer({});
  try {
    fs.writeFileSync(path.join(server.configuration.definitionsPath, 'laned.bpmn'), `<?xml version="1.0" encoding="UTF-8"?>
<bpmn:definitions xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:camunda="http://camunda.org/schema/1.0/bpmn" id="d5" targetNamespace="urn:test">
  <bpmn:collaboration id="c"><bpmn:participant id="p" processRef="laned" /></bpmn:collaboration>
  <bpmn:process id="laned" isExecutable="true">
    <bpmn:laneSet id="ls"><bpmn:lane id="l" name="Manager"><bpmn:flowNodeRef>s</bpmn:flowNodeRef><bpmn:flowNodeRef>u</bpmn:flowNodeRef></bpmn:lane></bpmn:laneSet>
    <bpmn:startEvent id="s" /><bpmn:userTask id="u" camunda:candidateGroups="Finance" /><bpmn:sequenceFlow id="f" sourceRef="s" targetRef="u" />
  </bpmn:process>
</bpmn:definitions>`);
    await server.definitions.rebuild();
    const { instance } = await server.engine.start('laned', {});
    const task = instance.items.find(i => i.elementId === 'u');
    assert.equal(task.status, 'wait');
    assert.deepEqual([...task.candidateGroups].sort(), ['Finance', 'Manager']);
  } finally { await server.shutdown(); }
});
