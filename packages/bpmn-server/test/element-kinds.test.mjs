// @features: engine-api
// What each kind of element says about itself, the configuration's defaults, the cache of live instances and the models kept only
// in the database (ModelsDatastoreDB, which ModelsDatastore puts files in front of).
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { Configuration, ModelsDatastore, ModelsDatastoreDB, DataStore, DefaultAppDelegate, ScriptHandler, NoCacheManager, CacheManager, DMNParser } from '../dist/index.js';
import { makeServer } from './helpers.mjs';

const NS = 'xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:camunda="http://camunda.org/schema/1.0/bpmn"';
const model = (body) => `<?xml version="1.0" encoding="UTF-8"?>
<bpmn:definitions ${NS} id="d" targetNamespace="urn:test"><bpmn:process id="p" isExecutable="true">${body}</bpmn:process></bpmn:definitions>`;

const KINDS = model(`
  <bpmn:startEvent id="start" />
  <bpmn:userTask id="user"><bpmn:extensionElements><camunda:formData><camunda:formField id="a" label="A" type="string" /></camunda:formData></bpmn:extensionElements></bpmn:userTask>
  <bpmn:scriptTask id="script" scriptFormat="JavaScript"><bpmn:script>return 1;</bpmn:script></bpmn:scriptTask>
  <bpmn:serviceTask id="service" implementation="x" />
  <bpmn:sendTask id="send" />
  <bpmn:receiveTask id="receive" />
  <bpmn:businessRuleTask id="rule" />
  <bpmn:callActivity id="call" calledElement="other" />
  <bpmn:subProcess id="sub"><bpmn:startEvent id="sub_start" /></bpmn:subProcess>
  <bpmn:intermediateCatchEvent id="catch"><bpmn:signalEventDefinition /></bpmn:intermediateCatchEvent>
  <bpmn:intermediateThrowEvent id="throw"><bpmn:signalEventDefinition /></bpmn:intermediateThrowEvent>
  <bpmn:boundaryEvent id="boundary" attachedToRef="user"><bpmn:signalEventDefinition /></bpmn:boundaryEvent>
  <bpmn:exclusiveGateway id="xor" />
  <bpmn:parallelGateway id="and" />
  <bpmn:eventBasedGateway id="events" />
  <bpmn:manualTask id="manual" />
  <bpmn:endEvent id="end" />`);

test('each kind of element says whether it waits, can be invoked, catches', async () => {
  const { server, dir } = await makeServer();
  fs.writeFileSync(dir + 'kinds.bpmn', KINDS);
  await server.definitions.rebuild();
  const definition = await server.definitions.load('kinds');
  const of = (id) => { const n = definition.getNodeById(id); return [n.requiresWait, n.canBeInvoked, n.isCatching]; };
  assert.deepEqual(of('user'), [true, true, false]);
  assert.deepEqual(of('receive'), [true, true, true]);
  assert.deepEqual(of('call'), [true, false, false]);
  assert.deepEqual(of('sub'), [true, false, false]);
  assert.deepEqual(of('script').slice(0, 2), [false, false]);
  assert.deepEqual(of('service').slice(0, 2), [false, false]);
  assert.deepEqual(of('send').slice(0, 2), [false, false]);
  assert.deepEqual(of('rule').slice(0, 2), [false, false]);
  assert.deepEqual(of('catch').slice(0, 2), [true, true]);
  assert.equal(of('boundary')[1], true);
  assert.equal(of('throw')[0], false, 'a throw event does not wait');
  assert.equal(definition.getNodeById('manual').constructor.name, 'Node', 'a kind the engine has no class for is a plain node');
  assert.deepEqual((await definition.getFields('user')).map(f => f.id), ['a']);
  assert.equal(await definition.getFields('script'), null, 'no form');
  const process = definition.processes.values().next().value;
  assert.equal(process.getStartNode().id, 'start');
  assert.deepEqual(process.getEventSubProcessStart(), []);
  await server.shutdown();
});

test('the configuration\'s defaults make the standard parts', async () => {
  const { server } = await makeServer();
  const configuration = new Configuration({ database: { MongoDB: { db_url: 'unused://', db: 'x' } } });
  const made = {
    definitions: configuration.definitions(server), appDelegate: configuration.appDelegate(server), dataStore: configuration.dataStore(server),
    cacheManager: configuration.cacheManager(server), scriptHandler: configuration.scriptHandler(server),
  };
  assert.ok(made.definitions instanceof ModelsDatastore);
  assert.ok(made.appDelegate instanceof DefaultAppDelegate);
  assert.ok(made.dataStore instanceof DataStore);
  assert.ok(made.cacheManager instanceof NoCacheManager);
  assert.ok(made.scriptHandler instanceof ScriptHandler);
  await server.shutdown();
});

test('the cache holds live instances by id', async () => {
  const { server } = await makeServer();
  const cache = new CacheManager(server);
  const live = { id: 'i1' };
  cache.add(live);
  assert.equal(cache.getInstance('i1'), live);
  cache.remove('i1');
  assert.equal(cache.getInstance('i1'), undefined);
  await server.shutdown();
});

test('the application delegate\'s defaults: no mail, no services of its own, events heard quietly', async () => {
  const { server } = await makeServer();
  const delegate = new DefaultAppDelegate(server);
  await assert.rejects(async () => delegate.sendEmail('a', 'b', 'c'), /sendEmail must be implemented/);
  assert.equal(typeof delegate.getServicesProvider, 'function');
  await delegate.executionEvent({}, {});
  await server.shutdown();
});

test('models in the database alone: saved, listed, read, their timers updated, exported', async () => {
  const { server } = await makeServer();
  const models = new ModelsDatastoreDB(server);
  const source = model(`<bpmn:startEvent id="s"><bpmn:timerEventDefinition><bpmn:timeDuration>PT1H</bpmn:timeDuration></bpmn:timerEventDefinition></bpmn:startEvent><bpmn:endEvent id="e" /><bpmn:sequenceFlow id="f" sourceRef="s" targetRef="e" />`);
  await models.save('only-db', source, '<svg/>');
  assert.ok((await models.getList({ name: 'only-db' })).some(m => m.name === 'only-db'));
  assert.equal(await models.getSource('only-db'), source);
  assert.equal(await models.getSVG('only-db'), '<svg/>');
  assert.equal((await models.loadModel('only-db')).name, 'only-db');
  await assert.rejects(models.loadModel('nope'), /No process definition named nope/);
  assert.equal(await models.updateTimer('only-db'), true);

  const folder = fs.mkdtempSync(path.join(os.tmpdir(), 'bpmn-export-'));
  await models.export('only-db', folder);
  for (const file of ['only-db.bpmn', 'only-db.svg']) {
    for (let tries = 0; !fs.existsSync(path.join(folder, file)) && tries < 100; tries++) await new Promise(r => setTimeout(r, 20));
    assert.ok(fs.existsSync(path.join(folder, file)), file);
  }
  assert.equal(await models.import([{ name: 'imported', source }]), 1);
  assert.ok((await models.get({ name: 'imported' })).length === 1);
  assert.equal(typeof models.rebuild, 'function');
  await models.rebuild();
  await server.shutdown();
});

const NSDMN = 'xmlns="https://www.omg.org/spec/DMN/20191111/MODEL/"';
const dmn = (decisions) => `<?xml version="1.0"?><definitions ${NSDMN} id="defs" name="t">${decisions}</definitions>`;
const cellsTable = ({ policy = 'FIRST', aggregation, input = 'a', test = '-', out = '1', extra = '' } = {}) =>
  `<decision id="d" name="D"><decisionTable hitPolicy="${policy}"${aggregation ? ` aggregation="${aggregation}"` : ''}>
    <input id="i"><inputExpression typeRef="string"><text>${input}</text></inputExpression></input>
    <output id="o" name="r" typeRef="string" />
    <rule id="r1"><inputEntry><text>${test}</text></inputEntry><outputEntry><text>${out}</text></outputEntry>${extra}</rule>
  </decisionTable></decision>`;
const problems = async (xml) => DMNParser.check(await DMNParser.parse(xml)).map(i => i.message);

test('a decision file\'s check says what is wrong with it', async () => {
  await assert.rejects(DMNParser.parse('<nothing />'), /not a DMN file/);
  await assert.rejects(DMNParser.parse(dmn('')), /the file has no decision/);
  assert.deepEqual(await problems(dmn(cellsTable())), []);
  assert.match((await problems(dmn(cellsTable({ policy: 'SOMETIMES' }))))[0], /unknown hit policy 'SOMETIMES'/);
  assert.match((await problems(dmn(cellsTable({ policy: 'FIRST', aggregation: 'SUM' }))))[0], /aggregation 'SUM' is only for the COLLECT/);
  assert.match((await problems(dmn(cellsTable({ policy: 'COLLECT', aggregation: 'MEDIAN' }))))[0], /aggregation 'MEDIAN'/);
  assert.match((await problems(dmn(cellsTable({ input: '1 +' }))))[0], /does not parse as FEEL: 1 \+/);
  assert.match((await problems(dmn(cellsTable({ out: '1 +' }))))[0], /does not parse as FEEL/);
  assert.match((await problems(dmn('<decision id="n" name="N" />')))[0], /neither a decision table nor a literal expression/);
  assert.match((await problems(dmn('<decision id="l" name="L"><literalExpression><text>1 +</text></literalExpression></decision>')))[0], /the expression does not parse as FEEL/);
  assert.match((await problems(dmn('<decision id="x" name="X"><informationRequirement><requiredDecision href="#nope" /></informationRequirement><literalExpression><text>1</text></literalExpression></decision>')))[0], /requires 'nope', which is not in the file/);
  const named = await DMNParser.parse(dmn('<decision id="only"><literalExpression><text>1</text></literalExpression></decision>'));
  assert.equal(named.decisions[0].name, 'only', 'no name: its id');
});
