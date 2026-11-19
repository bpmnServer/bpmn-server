// @features: app-contract
// The application's contract (engine/AppContract.ts, docs/design/app-contract.md): app-contract.json, its folder's,
// read and checked; the delegate's variables (appVars.<name>) worked out before an expression runs, in a script, a
// condition and a decision; verifyModel checking a model against it; the contract compared with the code.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { makeServer } from './helpers.mjs';
import { contractProblems, compareWithCode, appVarsFor, readAppContract, verifyModel, methodNames } from '../dist/index.js';

const CONTRACT = {
  name: 'test',
  expressions: [
    { kind: 'var', name: 'boss', type: 'string' },
    { kind: 'var', name: 'limit', type: 'number' },
    { kind: 'function', name: 'managerOf', params: [{ name: 'userName' }], effect: 'read' },
    { kind: 'function', name: 'record', params: [{ name: 'what' }], effect: 'write' },
  ],
  roles: [{ name: 'Manager' }],
  pages: [{ id: 'request', url: '/forms/request' }],
};

class Vars {
  constructor(context) { this.context = context; }
  boss() { return `boss-of-${this.context.user?.userName ?? 'nobody'}`; }
  async limit() { return 5; }
}

const MODEL = (body, extra = '') => `<?xml version="1.0" encoding="UTF-8"?>
<bpmn:definitions xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:camunda="http://camunda.org/schema/1.0/bpmn" xmlns:owf="http://omniworkflow.com/schema/owf/1.0" id="d" targetNamespace="t">
  <bpmn:process id="P" isExecutable="true" ${extra}>
    ${body}
  </bpmn:process>
</bpmn:definitions>`;

test('a contract is checked: its kinds, names, effects; a variable takes no arguments', () => {
  assert.deepEqual(contractProblems(CONTRACT), []);
  const problems = contractProblems({ expressions: [{ kind: 'thing', name: 'x' }, { kind: 'var', name: '1bad' }, { kind: 'var', name: 'v', params: [{ name: 'a' }] }, { kind: 'function', name: 'f', effect: 'maybe' }], roles: [{}] });
  assert.equal(problems.length, 5, problems.join('\n'));
  assert.deepEqual(contractProblems([]), ['it is not a JSON object']);
});

test('the file: read once until it changes; none, no contract; a bad one, its problem', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'bpmn-contract-'));
  const file = path.join(dir, 'app-contract.json');
  assert.equal(readAppContract(file).contract, null);
  fs.writeFileSync(file, JSON.stringify(CONTRACT));
  assert.equal(readAppContract(file).contract.name, 'test');
  fs.writeFileSync(file, '{ not json');
  assert.match(readAppContract(file).problems[0], /can not be read/);
});

test('compared with the code: a declared function the code lacks is an error, one it has undeclared a warning', () => {
  const found = compareWithCode(CONTRACT, { services: ['managerOf', 'extra'], vars: methodNames(Vars) });
  assert.deepEqual(found.map(f => f.severity).sort(), ['error', 'warning']);
  assert.ok(found.some(f => f.severity === 'error' && /appServices\.record/.test(f.message)));
  assert.ok(found.some(f => f.severity === 'warning' && /appServices\.extra/.test(f.message)));
});

test('appVars: only the names read, a method called (an async one awaited), with the evaluation\'s context', async () => {
  const delegate = { appVarsClass: Vars };
  assert.deepEqual(await appVarsFor(delegate, { user: { userName: 'ann' } }, ['boss']), { boss: 'boss-of-ann' });
  assert.deepEqual(await appVarsFor(delegate, { user: { userName: 'ann' } }), { boss: 'boss-of-ann', limit: 5 }, 'all: a decision\'s');
  assert.deepEqual(await appVarsFor({}, {}), {}, 'no variables class: none');
});

test('appVars in a running process: a script and a condition read them, worked out before they run', async () => {
  const { server } = await makeServer();
  server.appDelegate.appVarsClass = Vars;
  fs.writeFileSync(path.join(server.configuration.definitionsPath, 'Vars.bpmn'), MODEL(`
    <bpmn:startEvent id="S"><bpmn:outgoing>f1</bpmn:outgoing></bpmn:startEvent>
    <bpmn:scriptTask id="Read" scriptFormat="JavaScript"><bpmn:incoming>f1</bpmn:incoming><bpmn:outgoing>f2</bpmn:outgoing>
      <bpmn:script>data.boss = appVars.boss; data.limit = appVars.limit;</bpmn:script></bpmn:scriptTask>
    <bpmn:exclusiveGateway id="G" default="small"><bpmn:incoming>f2</bpmn:incoming><bpmn:outgoing>big</bpmn:outgoing><bpmn:outgoing>small</bpmn:outgoing></bpmn:exclusiveGateway>
    <bpmn:sequenceFlow id="f1" sourceRef="S" targetRef="Read" /><bpmn:sequenceFlow id="f2" sourceRef="Read" targetRef="G" />
    <bpmn:sequenceFlow id="big" sourceRef="G" targetRef="Big"><bpmn:conditionExpression xsi:type="bpmn:tFormalExpression" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">$(data.days &gt; appVars.limit)</bpmn:conditionExpression></bpmn:sequenceFlow>
    <bpmn:sequenceFlow id="small" sourceRef="G" targetRef="Small" />
    <bpmn:endEvent id="Big"><bpmn:incoming>big</bpmn:incoming></bpmn:endEvent>
    <bpmn:endEvent id="Small"><bpmn:incoming>small</bpmn:incoming></bpmn:endEvent>`));
  const run = await server.engine.start('Vars', { days: 8 }, null, 'ann');
  assert.equal(run.instance.data.boss, 'boss-of-ann');
  assert.equal(run.instance.data.limit, 5);
  assert.ok(run.instance.items.some(i => i.elementId === 'Big' && i.status === 'end'), 'the condition read appVars.limit');
  await server.shutdown?.();
});

test('verifyModel against the contract: unknown names, the wrong number of arguments, a page, a write function in a decision', async () => {
  const { server } = await makeServer();
  server.appDelegate.describe = () => CONTRACT;
  const dir = server.configuration.definitionsPath;
  fs.mkdirSync(path.join(dir, 'policies', 'assignment'), { recursive: true });
  fs.writeFileSync(path.join(dir, 'policies', 'assignment', 'Who.dmn.xml'), `<?xml version="1.0" encoding="UTF-8"?>
<definitions xmlns="https://www.omg.org/spec/DMN/20191111/MODEL/" id="d" name="Who" namespace="t">
  <decision id="Who" name="Who"><decisionTable id="t" hitPolicy="FIRST">
    <input id="i"><inputExpression id="e" typeRef="string"><text>appServices.record(data)</text></inputExpression></input>
    <output id="o" name="assignee" typeRef="string" />
    <rule id="r"><inputEntry id="a"><text>-</text></inputEntry><outputEntry id="b"><text>"x"</text></outputEntry></rule>
  </decisionTable></decision>
</definitions>`);
  const source = MODEL(`
    <bpmn:startEvent id="S" camunda:formKey="app:nowhere"><bpmn:outgoing>f1</bpmn:outgoing></bpmn:startEvent>
    <bpmn:userTask id="T" owf:assignmentPolicy="Who"><bpmn:incoming>f1</bpmn:incoming><bpmn:outgoing>f2</bpmn:outgoing></bpmn:userTask>
    <bpmn:scriptTask id="X" scriptFormat="JavaScript"><bpmn:incoming>f2</bpmn:incoming><bpmn:outgoing>f3</bpmn:outgoing>
      <bpmn:script>data.a = appServices.managerOf(data.who, 2); data.b = appServices.nothing(); data.c = appVars.missing; data.d = appVars.boss;</bpmn:script></bpmn:scriptTask>
    <bpmn:endEvent id="E"><bpmn:incoming>f3</bpmn:incoming></bpmn:endEvent>
    <bpmn:sequenceFlow id="f1" sourceRef="S" targetRef="T" /><bpmn:sequenceFlow id="f2" sourceRef="T" targetRef="X" /><bpmn:sequenceFlow id="f3" sourceRef="X" targetRef="E" />`);
  const { issues } = await verifyModel(source, server, 'Checked');
  const codes = issues.map(i => i.code);
  for (const code of ['function-unknown', 'function-arguments', 'variable-unknown', 'page-unknown', 'function-write-in-decision'])
    assert.ok(codes.includes(code), `${code}: ${JSON.stringify(issues.map(i => [i.code, i.message]), null, 1)}`);
  assert.ok(!issues.some(i => /appVars\.boss|managerOf: /.test(i.message)), 'what it declares is fine');
  assert.equal(issues.find(i => i.code === 'function-write-in-decision').severity, 'error');
  await server.shutdown?.();
});
