// @features: engine-api
// What the engine in a process of its own does when things happen at once, and when it is killed: no step is lost or done
// twice, a join goes on once, and a timer due while it was down fires once when it is back.
import test from 'node:test';
import assert from 'node:assert/strict';
import { startWebApp } from '../support/webApp.mjs';

const model = (id, body) => `<?xml version="1.0" encoding="UTF-8"?>
<bpmn:definitions xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" id="d" targetNamespace="urn:t"><bpmn:process id="${id}" isExecutable="true">${body}</bpmn:process></bpmn:definitions>`;
const flow = (from, to) => `<bpmn:sequenceFlow id="${from}_${to}" sourceRef="${from}" targetRef="${to}" />`;

const MODELS = {
  'at-once': model('at-once', `<bpmn:startEvent id="s" /><bpmn:parallelGateway id="split" /><bpmn:userTask id="a" /><bpmn:userTask id="b" /><bpmn:parallelGateway id="join" /><bpmn:userTask id="after" /><bpmn:endEvent id="e" />
    ${flow('s', 'split')}${flow('split', 'a')}${flow('split', 'b')}${flow('a', 'join')}${flow('b', 'join')}${flow('join', 'after')}${flow('after', 'e')}`),
  'killed-in-a-step': model('killed-in-a-step', `<bpmn:startEvent id="s" /><bpmn:userTask id="first" /><bpmn:scriptTask id="busy" scriptFormat="JavaScript"><bpmn:script>const until = Date.now() + 4000; while (Date.now() &lt; until); data.done = (data.done || 0) + 1;</bpmn:script></bpmn:scriptTask><bpmn:userTask id="last" /><bpmn:endEvent id="e" />
    ${flow('s', 'first')}${flow('first', 'busy')}${flow('busy', 'last')}${flow('last', 'e')}`),
  'timer-while-down': model('timer-while-down', `<bpmn:startEvent id="s" /><bpmn:intermediateCatchEvent id="wait"><bpmn:timerEventDefinition><bpmn:timeDuration>PT3S</bpmn:timeDuration></bpmn:timerEventDefinition></bpmn:intermediateCatchEvent><bpmn:userTask id="after" /><bpmn:endEvent id="e" />
    ${flow('s', 'wait')}${flow('wait', 'after')}${flow('after', 'e')}`),
};

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
let web;
const saved = async id => (await web.bpmnServer.dataStore.findInstances({ id }, 'summary'))[0];
const itemsOf = (instance, elementId) => instance.items.filter(item => item.elementId === elementId);
async function until(what, check, ms = 30_000) {
  const end = Date.now() + ms;
  while (Date.now() < end) {
    const answer = await check();
    if (answer) return answer;
    await sleep(200);
  }
  throw new Error(`waited ${ms} ms for ${what}`);
}

test.before(async () => {
  // a lock left by a killed engine is taken over soon, for the test
  web = await startWebApp({ remoteEngine: true, env: { LOCK_STALE_AFTER_MS: '2000' } });
  for (const [name, source] of Object.entries(MODELS)) await web.bpmnServer.definitions.save(name, source);
});
test.after(async () => { await web?.stop(); setImmediate(() => process.exit(0)); });

test('two tasks of one instance completed at once: both count, and the join goes on once', async () => {
  const { id } = await web.bpmnServer.engine.start('at-once', {});
  const results = await Promise.allSettled(['a', 'b'].map(task => web.bpmnServer.engine.invoke({ id, 'items.elementId': task }, { [task]: true })));
  assert.deepEqual(results.map(r => r.reason?.message), [undefined, undefined]);
  const instance = await saved(id);
  assert.deepEqual(['a', 'b'].map(task => itemsOf(instance, task).map(item => item.status)), [['end'], ['end']]);
  assert.deepEqual(itemsOf(instance, 'after').map(item => item.status), ['wait'], 'what comes after the join, once');
  assert.equal(instance.data.a, true);
  assert.equal(instance.data.b, true, 'neither completion overwrote the other');
});

test('the same task completed at once through the host: one wins, and the process goes on once', async () => {
  const { id } = await web.bpmnServer.engine.start('at-once', {});
  const results = await Promise.allSettled([1, 2, 3].map(() => web.bpmnServer.engine.invoke({ id, 'items.elementId': 'a', 'items.status': 'wait' }, {})));
  assert.equal(results.filter(r => r.status === 'fulfilled').length, 1, JSON.stringify(results.map(r => r.reason?.message)));
  assert.deepEqual(itemsOf(await saved(id), 'a').map(item => item.status), ['end']);
});

test('many instances at once: each ends, none mixed with another', async () => {
  const started = await Promise.all(Array.from({ length: 10 }, (_, n) => web.bpmnServer.engine.start('at-once', { n })));
  await Promise.all(started.flatMap(({ id }) => ['a', 'b'].map(task => web.bpmnServer.engine.invoke({ id, 'items.elementId': task }, {}))));
  await Promise.all(started.map(({ id }) => web.bpmnServer.engine.invoke({ id, 'items.elementId': 'after' }, {})));
  const instances = await Promise.all(started.map(({ id }) => saved(id)));
  assert.deepEqual(instances.map(i => i.status), started.map(() => 'end'));
  assert.deepEqual(instances.map(i => i.data.n), started.map((_, n) => n));
});

test('the engine killed in the middle of a step: the host says so; the step shows as hung, and recovering it finishes the process', async () => {
  const { id } = await web.bpmnServer.engine.start('killed-in-a-step', {});
  const inFlight = web.bpmnServer.engine.invoke({ id, 'items.elementId': 'first' }, {}).then(() => null, error => error);
  await sleep(1000);
  await web.killEngine();
  assert.ok(await inFlight, 'the call under way fails, it does not hang');
  await assert.rejects(web.bpmnServer.engine.start('at-once', {}), /can not be reached/);

  // the state was saved at the step's start: it stays there, not lost and not run on its own, and is found as hung
  await web.startEngineAgain();
  await sleep(2500);    // the killed engine's lock goes stale
  let instance = await saved(id);
  assert.equal(instance.status, 'running');
  assert.deepEqual(itemsOf(instance, 'first').map(i => i.status), ['end']);
  const [busy] = itemsOf(instance, 'busy');
  assert.equal(busy.status, 'start');
  assert.ok((await web.bpmnServer.dataStore.findItems({ 'items.status': 'start', id })).some(i => i.id === busy.id), 'the query for hung items finds it');

  await web.bpmnServer.engine.invoke({ 'items.id': busy.id }, {}, null, { recover: true });
  instance = await saved(id);
  assert.equal(instance.data.done, 1, 'the step runs again from its start: what it had not saved was lost with the engine');
  assert.deepEqual(itemsOf(instance, 'busy').map(i => i.status), ['end'], 'one item for the step');
  assert.deepEqual(itemsOf(instance, 'last').map(i => i.status), ['wait'], 'the process goes on, once');
  await web.bpmnServer.engine.invoke({ id, 'items.elementId': 'last' }, {});
  assert.equal((await saved(id)).status, 'end');
});

test('a timer due while the engine is down fires when it is back, once', async () => {
  const { id } = await web.bpmnServer.engine.start('timer-while-down', {});
  assert.deepEqual(itemsOf(await saved(id), 'wait').map(i => i.status), ['wait']);
  await web.killEngine();
  await sleep(4000);    // it falls due now, with no engine
  assert.deepEqual(itemsOf(await saved(id), 'wait').map(i => i.status), ['wait'], 'nothing moved without the engine');
  await web.startEngineAgain();
  await until('the timer', async () => itemsOf(await saved(id), 'after').length > 0);
  await sleep(4000);    // long enough to fire again, if it were to
  const instance = await saved(id);
  assert.deepEqual(itemsOf(instance, 'wait').map(i => i.status), ['end']);
  assert.deepEqual(itemsOf(instance, 'after').map(i => i.status), ['wait'], 'once');
});
