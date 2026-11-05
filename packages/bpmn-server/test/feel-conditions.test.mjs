// @features: expressions
// A sequence flow's condition in FEEL: when it says so, over the data's values by name; JavaScript stays the default, and ${...} is a
// wrapper in either.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

import { SandboxScriptHandler, verifyModel } from '../dist/index.js';
import { makeServer } from './helpers.mjs';

const xml = text => text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const cond = (body, language) => `<conditionExpression xsi:type="tFormalExpression"${language ? ` language="${language}"` : ''}>${xml(body)}</conditionExpression>`;
const flow = (id, from, to, condition = '') => `<sequenceFlow id="${id}" sourceRef="${from}" targetRef="${to}">${condition}</sequenceFlow>`;

/** start -> gateway -> high (by the condition) or low (the default) */
const gateway = condition => `<?xml version="1.0" encoding="UTF-8"?>
<definitions xmlns="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" id="d" targetNamespace="urn:test"><process id="p" isExecutable="true">
  <startEvent id="start" />
  <exclusiveGateway id="gw" default="toLow" />
  <endEvent id="high" />
  <endEvent id="low" />
  ${flow('f0', 'start', 'gw')}
  ${flow('toHigh', 'gw', 'high', condition)}
  ${flow('toLow', 'gw', 'low')}
</process></definitions>`;

let server, dir, count = 0;
test.before(async () => { ({ server, dir } = await makeServer()); });
test.after(async () => { await server?.shutdown?.(); });

/** The model saved under a name of its own, and started. */
async function start(condition, data, target = { server, dir }) {
  const name = `feel-${++count}`;
  fs.writeFileSync(`${target.dir}${name}.bpmn`, gateway(condition));
  await target.server.definitions.rebuild();
  return target.server.engine.start(name, data);
}
/** Which way the gateway went. */
async function way(condition, data, target) {
  const { instance } = await start(condition, data, target);
  assert.equal(instance.status, 'end');
  return instance.items.some(i => i.elementId === 'high') ? 'high' : 'low';
}

test('FEEL, when it says so: over the data\'s values by name, and data itself', async () => {
  assert.equal(await way(cond('amount > 1000', 'FEEL'), { amount: 2000 }), 'high');
  assert.equal(await way(cond('amount > 1000', 'FEEL'), { amount: 10 }), 'low');
  assert.equal(await way(cond('amount > 1000 and approved = true', 'FEEL'), { amount: 2000, approved: true }), 'high');
  assert.equal(await way(cond('amount > 1000 and approved = true', 'FEEL'), { amount: 2000, approved: false }), 'low');
  assert.equal(await way(cond('data.amount > 1000', 'FEEL'), { amount: 2000 }), 'high');
  assert.equal(await way(cond('amount > 1000', 'feel'), { amount: 2000 }), 'high', 'whatever its case');
  assert.equal(await way(cond('\n   amount > 1000\n', 'FEEL'), { amount: 2000 }), 'high', 'written on a line of its own');
});

test('a value that is missing, or not true, does not take the flow', async () => {
  assert.equal(await way(cond('amount > 1000', 'FEEL'), {}), 'low');
  assert.equal(await way(cond('amount', 'FEEL'), { amount: 2000 }), 'low');
});

test('the wrapper and the language are separate: ${...} around FEEL is FEEL; around JavaScript, JavaScript', async () => {
  assert.equal(await way(cond('${amount > 1000}', 'FEEL'), { amount: 2000 }), 'high');
  assert.equal(await way(cond('${amount > 1000}', 'FEEL'), { amount: 10 }), 'low');
  assert.equal(await way(cond('${data.amount > 1000}'), { amount: 2000 }), 'high');
  assert.equal(await way(cond('${data.amount > 1000}', 'JavaScript'), { amount: 10 }), 'low');
  await assert.rejects(start(cond('${amount > 1000}'), { amount: 2000 }), /amount is not defined/, 'not FEEL by its wrapper');
});

test('JavaScript stays the default: no language, or JavaScript, as it was', async () => {
  assert.equal(await way(cond('data.amount > 1000'), { amount: 2000 }), 'high');
  assert.equal(await way(cond('data.amount > 1000', 'JavaScript'), { amount: 10 }), 'low');
  assert.equal(await way(cond('data.amount > 1000', 'javascript'), { amount: 2000 }), 'high');
});

test('in the sandbox too', async () => {
  const sandboxed = await makeServer({ extra: { scriptHandler: () => new SandboxScriptHandler() } });
  assert.equal(await way(cond('amount > 1000', 'FEEL'), { amount: 2000 }, sandboxed), 'high');
  assert.equal(await way(cond('amount > 1000', 'FEEL'), { amount: 10 }, sandboxed), 'low');
  await sandboxed.server.shutdown?.();
});

test('checking a model: FEEL is checked as FEEL, JavaScript as JavaScript', async () => {
  const check = async condition => (await verifyModel(gateway(condition), server)).issues.filter(i => /expression/.test(i.code)).map(i => i.code);
  assert.deepEqual(await check(cond('amount > 1000', 'FEEL')), []);
  assert.deepEqual(await check(cond('amount > 1000 and approved', 'FEEL')), []);
  assert.deepEqual(await check(cond('amount >', 'FEEL')), ['expression-syntax']);
  assert.deepEqual(await check(cond('data.amount >')), ['expression-syntax']);
});
