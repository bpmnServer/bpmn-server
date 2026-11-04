// @features: expressions
// ${...} in models: a whole value ${js} is an expression like $js and $(js); a text with ${...} parts has each
// part filled in; and the model check reports Camunda habits (JUEL operators, variables read by name).
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

import { verifyModel } from '../dist/index.js';
import { expressionScript, templateParts, freeNames } from '../dist/engine/Expressions.js';
import { makeServer } from './helpers.mjs';

const NS = 'xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:camunda="http://camunda.org/schema/1.0/bpmn" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"';
const model = (id, body) => `<?xml version="1.0" encoding="UTF-8"?>
<bpmn:definitions ${NS} id="d" targetNamespace="urn:test"><bpmn:process id="${id}" isExecutable="true">${body}</bpmn:process></bpmn:definitions>`;
const codes = (result) => result.issues.map(i => i.code).filter(c => c !== 'no-diagram');
const message = (result, code) => result.issues.find(i => i.code === code)?.message;
const condition = (exp) => `<bpmn:conditionExpression xsi:type="bpmn:tFormalExpression">${exp}</bpmn:conditionExpression>`;

/** A gateway to a user task when `exp` holds, else to an empty task. */
const routed = (exp, task = '<bpmn:userTask id="high" />') => `
  <bpmn:startEvent id="start" />
  <bpmn:exclusiveGateway id="gw" default="toLow" />
  ${task}
  <bpmn:task id="low" />
  <bpmn:endEvent id="end" />
  <bpmn:sequenceFlow id="f0" sourceRef="start" targetRef="gw" />
  <bpmn:sequenceFlow id="toHigh" sourceRef="gw" targetRef="high">${condition(exp)}</bpmn:sequenceFlow>
  <bpmn:sequenceFlow id="toLow" sourceRef="gw" targetRef="low" />
  <bpmn:sequenceFlow id="f1" sourceRef="high" targetRef="end" />
  <bpmn:sequenceFlow id="f2" sourceRef="low" targetRef="end" />`;

test('${js} as the whole value is an expression; any other ${...} makes a text', () => {
  assert.equal(expressionScript('${data.amount > 1000}'), 'data.amount > 1000');
  assert.equal(expressionScript('$data.amount'), 'data.amount');
  assert.equal(expressionScript('$(data.amount)'), '(data.amount)');
  assert.equal(expressionScript('${x == "}"}'), 'x == "}"', 'a brace in a string does not close it');
  assert.equal(expressionScript('${a} and ${b}'), null);
  assert.equal(expressionScript('plain'), null);
  assert.deepEqual(templateParts('Order ${data.id} done'), ['Order ', { script: 'data.id' }, ' done']);
  assert.equal(templateParts('no parts'), null);
  assert.equal(templateParts('${not closed'), null);
});

test('the names an expression reads: not properties, keys or its own parameters', () => {
  assert.deepEqual(freeNames('amount > 1000'), ['amount']);
  assert.deepEqual(freeNames('data.items.filter((x, i) => x.price > limit)'), ['data', 'limit']);
  assert.deepEqual(freeNames('({ a: 1, b: c })'), ['c']);
  assert.deepEqual(freeNames('data.name == "amount"'), ['data']);
});

test('the engine evaluates ${js} conditions, assignments and parameters, and fills in text parts', async () => {
  const task = `<bpmn:userTask id="high" camunda:assignee="\${data.owner}" camunda:candidateGroups="\${data.a},\${data.b}" camunda:candidateUsers="user-\${data.region}">
    <bpmn:extensionElements><camunda:inputOutput>
      <camunda:inputParameter name="title">Order \${data.id} for \${data.owner}</camunda:inputParameter>
      <camunda:inputParameter name="amount">\${data.amount}</camunda:inputParameter>
      <camunda:inputParameter name="note">as written</camunda:inputParameter>
    </camunda:inputOutput></bpmn:extensionElements>
  </bpmn:userTask>`;
  const { server, dir } = await makeServer();
  fs.writeFileSync(dir + 'expressions.bpmn', model('expressions', routed('${data.amount > 1000}', task)));
  await server.definitions.rebuild();

  const data = { id: 7, amount: 2500, owner: 'ada', a: 'managers', b: 'auditors', region: 'east' };
  const resp = await server.engine.start('expressions', data);
  const high = resp.instance.items.find(i => i.elementId === 'high');
  assert.ok(high, 'the ${...} condition held');
  assert.equal(high.assignee, 'ada');
  assert.deepEqual(high.candidateGroups, ['managers', 'auditors'], 'filled in, then split at the comma');
  assert.equal(high.candidateUsers, 'user-east');
  // the item's input is not saved with the instance: read it from the running execution
  const { input } = resp.execution.getItems().find(i => i.elementId === 'high');
  assert.equal(input.title, 'Order 7 for ada');
  assert.equal(input.amount, 2500, 'a whole ${js} keeps its value\'s type');
  assert.equal(input.note, 'as written');

  const low = await server.engine.start('expressions', { ...data, amount: 10 });
  assert.ok(!low.instance.items.some(i => i.elementId === 'high'), 'the default flow when the condition does not hold');
});

test('the model check accepts ${js}, text parts and ${...} in timers', async () => {
  const task = `<bpmn:userTask id="high" camunda:assignee="\${data.owner}" camunda:candidateUsers="user-\${data.region}" />`;
  assert.deepEqual(codes(await verifyModel(model('p', routed('${data.amount > 1000}', task)))), []);
  const timer = model('t', `
    <bpmn:startEvent id="start" />
    <bpmn:intermediateCatchEvent id="wait"><bpmn:timerEventDefinition><bpmn:timeDuration>PT\${data.days * 24}H</bpmn:timeDuration></bpmn:timerEventDefinition></bpmn:intermediateCatchEvent>
    <bpmn:endEvent id="end" />
    <bpmn:sequenceFlow id="f0" sourceRef="start" targetRef="wait" />
    <bpmn:sequenceFlow id="f1" sourceRef="wait" targetRef="end" />`);
  assert.deepEqual(codes(await verifyModel(timer)), [], 'a duration with a ${...} part is not checked as ISO 8601');
});

test('the model check explains Camunda habits: JUEL operators and variables read by name', async () => {
  const juel = await verifyModel(model('p', routed('${amount gt 1000 and approved}')));
  assert.deepEqual(codes(juel), ['expression-juel']);
  assert.match(message(juel, 'expression-juel'), /'gt' with >, 'and' with &&/);

  const named = await verifyModel(model('p', routed('${amount > 1000}')));
  assert.deepEqual(codes(named), ['expression-unknown-name']);
  assert.match(message(named, 'expression-unknown-name'), /reads 'amount'.*data\.amount/);

  const part = await verifyModel(model('p', routed('${data.ok}', '<bpmn:userTask id="high" camunda:candidateUsers="user-${region}" />')));
  assert.deepEqual(codes(part), ['expression-unknown-name'], 'a text\'s ${...} parts are checked too');

  const withTitle = (title) => routed('${data.ok}', `<bpmn:userTask id="high"><bpmn:extensionElements><camunda:inputOutput>
      <camunda:inputParameter name="title">${title}</camunda:inputParameter></camunda:inputOutput></bpmn:extensionElements></bpmn:userTask>`);
  assert.deepEqual(codes(await verifyModel(model('p', withTitle('Order ${data.id +} for you')))), ['expression-syntax'], 'input parameters are checked');
  assert.deepEqual(codes(await verifyModel(model('p', withTitle('Order ${data.id) for you')))), ['template-not-closed']);
});
