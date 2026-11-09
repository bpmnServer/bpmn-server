// @features: expressions
// What an application adds to scripts' scope (new ScriptHandler({ context })), and a JavaScript condition giving its value by next(error, value).
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { ScriptHandler, SandboxScriptHandler, verifyModel } from '../dist/index.js';
import { makeServer } from './helpers.mjs';

/** A variable of the application's own, for these tests. */
const CONTEXT = { environment: ({ data }) => ({ variables: data }) };

const model = body => `<?xml version="1.0" encoding="UTF-8"?>
<definitions xmlns="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" id="d" targetNamespace="urn:test"><process id="p" isExecutable="true">${body}</process></definitions>`;
const flow = (id, from, to, condition = '') => `<sequenceFlow id="${id}" sourceRef="${from}" targetRef="${to}">${condition}</sequenceFlow>`;
const xml = text => text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const cond = (body, language) => `<conditionExpression xsi:type="tFormalExpression"${language ? ` language="${language}"` : ''}>${xml(body)}</conditionExpression>`;

/** start -> gateway -> high (by the condition) or low (the default) */
const gateway = condition => model(`
  <startEvent id="start" />
  <exclusiveGateway id="gw" default="toLow" />
  <endEvent id="high" />
  <endEvent id="low" />
  ${flow('f0', 'start', 'gw')}
  ${flow('toHigh', 'gw', 'high', condition)}
  ${flow('toLow', 'gw', 'low')}`);

const withContext = () => makeServer({ extra: { scriptHandler: () => new ScriptHandler({ context: CONTEXT }) } });

let count = 0;
async function run({ server, dir }, source, data) {
  const name = `m${++count}`;
  fs.writeFileSync(`${dir}${name}.bpmn`, source);
  await server.definitions.rebuild();
  return (await server.engine.start(name, data)).instance;
}
/** Which way the gateway went. */
async function way(made, condition, data) {
  const instance = await run(made, gateway(condition), data);
  assert.equal(instance.status, 'end');
  return instance.items.some(i => i.elementId === 'high') ? 'high' : 'low';
}

test('next(error, value): as an expression or in statements, the value decides; an error fails the call', async () => {
  const made = await makeServer();
  const expression = cond('next(null, data.amount > 1000)', 'JavaScript');
  assert.equal(await way(made, expression, { amount: 2000 }), 'high');
  assert.equal(await way(made, expression, { amount: 10 }), 'low');
  const statements = cond('if (data.amount > 1000) next(null, true); else next(null, false);', 'javascript');
  assert.equal(await way(made, statements, { amount: 2000 }), 'high');
  assert.equal(await way(made, statements, { amount: 10 }), 'low');
  assert.equal(await way(made, cond('${next(null, data.amount > 1000)}', 'JavaScript'), { amount: 2000 }), 'high', 'inside ${...} too');
  assert.equal(await way(made, cond('if (false) next(null, true);', 'JavaScript'), {}), 'low', 'never called: not taken');
  await assert.rejects(run(made, gateway(cond('next(new Error("from the condition"))', 'JavaScript')), {}), /from the condition/);
  await made.server.shutdown();
});

test('next is only for a condition that says it is JavaScript; a method of that name is not it', async () => {
  const made = await makeServer();
  await assert.rejects(run(made, gateway(cond('next(null, true)')), {}), /next is not defined/, 'no language: an expression');
  assert.equal(await way(made, cond('data.tools.next(1) === 1', 'JavaScript'), {}).catch(() => 'a plain expression'), 'a plain expression', 'it fails as any expression would');
  await made.server.shutdown();
});

test('the context: scripts and conditions read it; writing to it does not change the process\'s data', async () => {
  const made = await withContext();
  assert.equal(await way(made, cond('${environment.variables.amount > 1000}'), { amount: 2000 }), 'high');
  assert.equal(await way(made, cond('data.amount === environment.variables.amount'), { amount: 7 }), 'high');
  assert.equal(await way(made, cond('next(null, environment.variables.amount > 1000)', 'JavaScript'), { amount: 10 }), 'low');
  assert.equal(await way(made, cond('environment.variables.amount > 1000', 'FEEL'), { amount: 2000 }), 'high', 'FEEL too');
  const instance = await run(made, model(`
    <startEvent id="start" />
    <scriptTask id="run" scriptFormat="javascript"><script>environment.variables.amount = 99; data.seen = environment.variables.amount;</script></scriptTask>
    <endEvent id="end" />
    ${flow('f0', 'start', 'run')}
    ${flow('f1', 'run', 'end')}`), { amount: 7 });
  assert.equal(instance.data.amount, 7);
  assert.equal(instance.data.seen, 99);
  await made.server.shutdown();
});

test('a context can not replace what scripts have', () => {
  for (const name of ['data', 'item', 'instance', 'input', 'output', 'appServices', 'appUtils', 'appDelegate', 'not a name'])
    assert.throws(() => new ScriptHandler({ context: { [name]: () => 1 } }), /can not have a variable/, name);
  assert.throws(() => new SandboxScriptHandler({ context: { data: () => 1 } }), /can not have a variable/);
});

test('no context, no such variable: the default is as it was', async () => {
  const made = await makeServer();
  await assert.rejects(run(made, gateway(cond('environment.variables.amount > 1')), { amount: 2 }), /environment is not defined/);
  await made.server.shutdown();
});

test('in the sandbox too: the context and next; its calling of services stays as it was', async () => {
  const made = await makeServer({ extra: { scriptHandler: () => new SandboxScriptHandler({ context: CONTEXT }) } });
  assert.equal(await way(made, cond('${environment.variables.amount > 1000}'), { amount: 2000 }), 'high');
  assert.equal(await way(made, cond('next(null, environment.variables.amount > 1000)', 'JavaScript'), { amount: 2000 }), 'high');
  assert.equal(await way(made, cond('next(null, environment.variables.amount > 1000)', 'JavaScript'), { amount: 10 }), 'low');
  assert.equal(await way(made, cond('environment.variables.amount > 1000', 'FEEL'), { amount: 2000 }), 'high');
  assert.equal(new SandboxScriptHandler({ callServices: true }).callServices, true);
  await made.server.shutdown();
});

test('checking a model: next and the context are known, and what does not compile is still said', async () => {
  const { server } = await withContext();
  const check = async condition => (await verifyModel(gateway(condition), server)).issues.filter(i => /expression/.test(i.code)).map(i => i.code);
  assert.deepEqual(await check(cond('next(null, data.amount > 1)', 'JavaScript')), []);
  assert.deepEqual(await check(cond('if (data.amount > 1) next(null, true); else next(null, false);', 'JavaScript')), []);
  assert.deepEqual(await check(cond('${environment.variables.amount > 1}')), []);
  assert.deepEqual(await check(cond('data.amount >')), ['expression-syntax']);
  await server.shutdown();
});
