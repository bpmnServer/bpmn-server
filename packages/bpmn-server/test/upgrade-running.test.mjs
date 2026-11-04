// @features: upgrade-running
// engine.upgradeRunning: instances that have not ended move onto their model's saved source and run it from
// where they are; ended ones keep theirs; a step the new model lacks, a held lock and a model with errors are
// reported, not forced.
import test from 'node:test';
import assert from 'node:assert/strict';
import { MemoryDocumentStore } from '../dist/index.js';
import { makeServer } from './helpers.mjs';

const NS = 'xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:camunda="http://camunda.org/schema/1.0/bpmn"';
/** Start → Planner (user) → Svc (service, input p) → Checker (user) → End */
const model = (p, checker = 'Checker') => `<?xml version="1.0" encoding="UTF-8"?>
<bpmn:definitions ${NS} id="D" targetNamespace="t"><bpmn:process id="P" isExecutable="true">
<bpmn:startEvent id="S"/><bpmn:sequenceFlow id="f1" sourceRef="S" targetRef="Planner"/>
<bpmn:userTask id="Planner"/><bpmn:sequenceFlow id="f2" sourceRef="Planner" targetRef="Svc"/>
<bpmn:serviceTask id="Svc" camunda:delegateExpression="record"><bpmn:extensionElements><camunda:inputOutput>
<camunda:inputParameter name="p">${p}</camunda:inputParameter></camunda:inputOutput></bpmn:extensionElements></bpmn:serviceTask>
<bpmn:sequenceFlow id="f3" sourceRef="Svc" targetRef="${checker}"/>
<bpmn:userTask id="${checker}"/><bpmn:sequenceFlow id="f4" sourceRef="${checker}" targetRef="E"/><bpmn:endEvent id="E"/>
</bpmn:process></bpmn:definitions>`;

const received = [];
const { server } = await makeServer({
  store: new MemoryDocumentStore(),
  services: { record: async (input) => { received.push(input.p); return {}; } },
  locks: { retryDelay: 5, maxTries: 2 },
});
server.dataStore.saveSource = true;

const save = (name, xml) => server.definitions.save(name, xml, null);
const start = async (name) => (await server.engine.start(name, {})).instance.id;
const complete = (id, task) => server.engine.invoke({ id, 'items.elementId': task, 'items.status': 'wait' }, {});
const instance = async (id) => (await server.dataStore.findInstances({ id }, 'full'))[0];
const outcomes = (reports) => Object.fromEntries(reports.flatMap(r => r.instances.map(i => [i.instanceId, i.outcome])));

test.after(() => server.shutdown());

test('running instances move onto the saved model and run it; ended ones keep the source they ran', async () => {
  await save('Plan', model('old'));
  const atPlanner = await start('Plan');
  const atChecker = await start('Plan');
  await complete(atChecker, 'Planner');
  const ended = await start('Plan');
  await complete(ended, 'Planner');
  await complete(ended, 'Checker');
  assert.equal((await instance(ended)).status, 'end');
  received.length = 0;

  await save('Plan', model('$({ "v": 2 })'));
  const dry = await server.engine.upgradeRunning(['Plan'], { dryRun: true });
  assert.deepEqual(outcomes(dry), { [atPlanner]: 'would-upgrade', [atChecker]: 'would-upgrade' });
  assert.match((await instance(atPlanner)).source, />old</, 'a dry run changes nothing');

  const done = await server.engine.upgradeRunning(['Plan']);
  assert.deepEqual(outcomes(done), { [atPlanner]: 'upgraded', [atChecker]: 'upgraded' });
  assert.match((await instance(atPlanner)).source, /"v": 2/);
  assert.match((await instance(ended)).source, />old</, 'the record of what ran');

  await complete(atPlanner, 'Planner');            // resumes on the new version: its service gets the new input
  assert.deepEqual(received, [{ v: 2 }]);
  await complete(atChecker, 'Checker');
  assert.equal((await instance(atChecker)).status, 'end');

  assert.deepEqual(outcomes(await server.engine.upgradeRunning(['Plan'])), { [atPlanner]: 'current' });
});

test('an instance on a step the saved model does not have is left as it is, and reported', async () => {
  await save('Renamed', model('old'));
  const atPlanner = await start('Renamed');
  const atChecker = await start('Renamed');
  await complete(atChecker, 'Planner');
  await save('Renamed', model('new', 'CheckerRenamed'));

  const [report] = await server.engine.upgradeRunning(['Renamed']);
  assert.deepEqual(outcomes([report]), { [atPlanner]: 'upgraded', [atChecker]: 'stranded' });
  assert.match(report.instances.find(i => i.instanceId === atChecker).detail, /Checker/);
  assert.match((await instance(atChecker)).source, />old</);
});

test('an instance another call holds is not touched; the next run upgrades it', async () => {
  await save('Held', model('old'));
  const id = await start('Held');
  await save('Held', model('new'));
  await server.dataStore.locker.lock(id);
  try {
    assert.deepEqual(outcomes(await server.engine.upgradeRunning(['Held'])), { [id]: 'busy' });
  } finally {
    await server.dataStore.locker.release(id);
  }
  assert.match((await instance(id)).source, />old</);
  assert.deepEqual(outcomes(await server.engine.upgradeRunning(['Held'])), { [id]: 'upgraded' });
});

test('a saved model with errors is refused and none of its instances changes', async () => {
  await save('Broken', model('old'));
  const id = await start('Broken');
  await save('Broken', model('${"type": "template"}'));   // an expression that does not compile
  const [report] = await server.engine.upgradeRunning(['Broken']);
  assert.match(report.refused, /errors/);
  assert.deepEqual(report.instances, []);
  assert.match((await instance(id)).source, />old</);
});

test('with no model named, it covers every model that has instances running', async () => {
  const reports = await server.engine.upgradeRunning([], { dryRun: true });
  for (const name of ['Plan', 'Renamed', 'Held', 'Broken'])
    assert.ok(reports.some(r => r.model === name), name);
});
