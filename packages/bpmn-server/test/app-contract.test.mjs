// @features: app-contract
// The application's contract (engine/AppContract.ts, docs/design/app-contract.md): app-contract.json, its folder's,
// read and checked; verifyModel checking a model against it; the contract compared with the code.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { makeServer, definitionsFolder } from './helpers.mjs';
import { contractProblems, compareWithCode, readAppContract, saveContractRoles, verifyModel, rolePermissionsOf, SecureUser } from '../dist/index.js';

const CONTRACT = {
  name: 'test',
  expressions: [
    { kind: 'function', name: 'managerOf', params: [{ name: 'userName' }], effect: 'read' },
    { kind: 'function', name: 'record', params: [{ name: 'what' }], effect: 'write' },
  ],
  roles: [{ name: 'Manager' }],
  pages: [{ id: 'request', url: '/forms/request' }],
};

const MODEL = (body, extra = '') => `<?xml version="1.0" encoding="UTF-8"?>
<bpmn:definitions xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:camunda="http://camunda.org/schema/1.0/bpmn" xmlns:owf="http://omniworkflow.com/schema/owf/1.0" id="d" targetNamespace="t">
  <bpmn:process id="P" isExecutable="true" ${extra}>
    ${body}
  </bpmn:process>
</bpmn:definitions>`;

test('a contract is checked: its kinds, names, effects', () => {
  assert.deepEqual(contractProblems(CONTRACT), []);
  const problems = contractProblems({ expressions: [{ kind: 'thing', name: 'x' }, { kind: 'var', name: 'v' }, { kind: 'function', name: '1bad' }, { kind: 'function', name: 'f', effect: 'maybe' }], roles: [{}] });
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
  const found = compareWithCode(CONTRACT, { services: ['managerOf', 'extra'] });
  assert.deepEqual(found.map(f => f.severity).sort(), ['error', 'warning']);
  assert.ok(found.some(f => f.severity === 'error' && /appServices\.record/.test(f.message)));
  assert.ok(found.some(f => f.severity === 'warning' && /appServices\.extra/.test(f.message)));
});

test('verifyModel against the contract: unknown names, the wrong number of arguments, a page, a write function in a decision', async () => {
  const { server } = await makeServer();
  server.appDelegate.describe = () => CONTRACT;
  const dir = server.configuration.definitionsPath;
  fs.mkdirSync(path.join(dir, 'assignment'), { recursive: true });
  fs.writeFileSync(path.join(dir, 'assignment', 'Who.dmn.xml'), `<?xml version="1.0" encoding="UTF-8"?>
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
      <bpmn:script>data.a = appServices.managerOf(data.who, 2); data.b = appServices.nothing();</bpmn:script></bpmn:scriptTask>
    <bpmn:endEvent id="E"><bpmn:incoming>f3</bpmn:incoming></bpmn:endEvent>
    <bpmn:sequenceFlow id="f1" sourceRef="S" targetRef="T" /><bpmn:sequenceFlow id="f2" sourceRef="T" targetRef="X" /><bpmn:sequenceFlow id="f3" sourceRef="X" targetRef="E" />`);
  const { issues } = await verifyModel(source, server, 'Checked');
  const codes = issues.map(i => i.code);
  for (const code of ['function-unknown', 'function-arguments', 'page-unknown', 'function-write-in-decision'])
    assert.ok(codes.includes(code), `${code}: ${JSON.stringify(issues.map(i => [i.code, i.message]), null, 1)}`);
  assert.ok(!issues.some(i => /managerOf: /.test(i.message)), 'what it declares is fine');
  assert.equal(issues.find(i => i.code === 'function-write-in-decision').severity, 'error');
  await server.shutdown?.();
});

test("the roles are the contract's, and roles.json is what they were before 3.7.5", async () => {
  const dir = definitionsFolder();
  // the legacy file beside the models, and a contract that declares its own roles
  fs.writeFileSync(path.join(dir, 'roles.json'), JSON.stringify(['Legacy']));
  const { server } = await makeServer({ dir });
  server.appDelegate.describe = () => ({ ...CONTRACT, roles: [{ name: 'Manager' }, { name: 'Director' }] });
  const source = MODEL(`
    <bpmn:startEvent id="S"><bpmn:outgoing>f1</bpmn:outgoing></bpmn:startEvent>
    <bpmn:userTask id="T"><bpmn:incoming>f1</bpmn:incoming></bpmn:userTask>
    <bpmn:sequenceFlow id="f1" sourceRef="S" targetRef="T" />`);
  const { issues } = await verifyModel(source, server, 'Roles');
  const named = issues.filter(i => i.code === 'role-unknown').map(i => i.message).join(' ');
  // the contract wins: its names are the ones a warning lists, and the legacy file's are not
  assert.ok(!named.includes('Legacy') || named === '', `roles.json should not be read when the contract declares roles: ${named}`);
  await server.shutdown?.();
});

test('saveContractRoles writes the roles back, keeping the rest of the contract', () => {
  const dir = definitionsFolder();
  const file = path.join(dir, 'app-contract.json');
  fs.writeFileSync(file, JSON.stringify({ name: 'x', roles: [{ name: 'Manager', title: 'Manager' }], pages: [{ id: 'p', url: '/p' }] }, null, 2));
  // added: the new one keeps its place, and what a role had is kept
  const names = saveContractRoles(file, [{ name: 'Manager', title: 'Manager' }, { name: 'Director' }]);
  assert.deepEqual(names, ['Manager', 'Director']);
  const after = JSON.parse(fs.readFileSync(file, 'utf8'));
  assert.equal(after.roles[0].title, 'Manager', 'what it had is kept');
  assert.deepEqual(after.pages, [{ id: 'p', url: '/p' }], 'the rest of the contract is untouched');
  assert.equal(after.name, 'x');
  // removed, and a name twice is one role
  assert.deepEqual(saveContractRoles(file, [{ name: 'Director' }, { name: 'Director' }]), ['Director']);
  assert.equal(JSON.parse(fs.readFileSync(file, 'utf8')).roles.length, 1);
});

test("a role's permissions: read from the contract, checked, and granting only (never taking away)", () => {
  // what the contract says its roles may do beyond their own tasks
  const contract = { name: 'x', roles: [
    { name: 'Manager', permissions: ['designer'] },
    { name: 'HR', permissions: ['administrator'] },
    { name: 'Employee' },
  ] };
  assert.deepEqual(contractProblems(contract), []);
  const granted = rolePermissionsOf(contract);
  assert.deepEqual(granted.get('Manager'), ['designer']);
  assert.deepEqual(granted.get('HR'), ['administrator']);
  assert.equal(granted.has('Employee'), false, 'a role with none is not in the map');

  // a permission that is not one is a problem, not a silent grant
  assert.equal(contractProblems({ roles: [{ name: 'R', permissions: ['root'] }] }).length, 1);
  assert.equal(contractProblems({ roles: [{ name: 'R', permissions: 'designer' }] }).length, 1);
  assert.deepEqual(rolePermissionsOf({ roles: [{ name: 'R', permissions: ['root'] }] }).get('R'), undefined,
    'an unknown permission grants nothing');
});

test('the engine honours the granted permissions, and grants nothing without them', () => {
  const was = SecureUser.granted;
  const user = (groups) => new SecureUser({ userName: 'u', userGroups: groups }, { enforceSecurity: true });
  try {
    SecureUser.granted = new Map();
    assert.equal(user(['Manager']).isAdmin(), false, 'no grants: as before');
    assert.equal(user(['Manager']).isDesigner(), false);
    // the group names it has always matched on keep working
    assert.equal(user(['ADMIN']).isAdmin(), true);
    assert.equal(user(['DESIGNER']).isDesigner(), true);

    SecureUser.granted = new Map([['Manager', ['designer']], ['HR', ['administrator']]]);
    assert.equal(user(['Manager']).isDesigner(), true, 'a granted role designs');
    assert.equal(user(['Manager']).isAdmin(), false, 'and no more than that');
    assert.equal(user(['HR']).isAdmin(), true, 'a granted role administers');
    assert.equal(user(['HR']).isDesigner(), true, 'an administrator designs too');
    assert.equal(user(['Employee']).isAdmin(), false, 'a role with no grant gains nothing');
  } finally {
    SecureUser.granted = was;
  }
});

test("saveContractRoles keeps a role's permissions, and drops them when they are not sent", () => {
  const dir = definitionsFolder();
  const file = path.join(dir, 'app-contract.json');
  fs.writeFileSync(file, JSON.stringify({ name: 'x', roles: [{ name: 'Manager', title: 'Manager' }] }, null, 2));
  saveContractRoles(file, [{ name: 'Manager', title: 'Manager', permissions: ['designer'] }]);
  let after = JSON.parse(fs.readFileSync(file, 'utf8'));
  assert.deepEqual(after.roles[0].permissions, ['designer']);
  assert.equal(after.roles[0].title, 'Manager', 'what it had is kept');
  saveContractRoles(file, [{ name: 'Manager', title: 'Manager' }]);
  after = JSON.parse(fs.readFileSync(file, 'utf8'));
  assert.equal(after.roles[0].permissions, undefined, 'unticked: the permission is gone');
});
