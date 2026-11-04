// @features: sandbox, script-handler, script-task
// A public demo: scripts and expressions run in SandboxScriptHandler (QuickJS: no Node.js, a time limit), timers
// are not scheduled and service tasks call nothing (configuration.demo); each says so in the run's decisions.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

import { SandboxScriptHandler, runSandboxed } from '../dist/index.js';
import { makeServer } from './helpers.mjs';

const NS = 'xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:camunda="http://camunda.org/schema/1.0/bpmn" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"';
const model = (id, body) => `<?xml version="1.0" encoding="UTF-8"?>
<bpmn:definitions ${NS} id="d" targetNamespace="urn:test"><bpmn:process id="${id}" isExecutable="true">${body}</bpmn:process></bpmn:definitions>`;
const xml = (text) => text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/** start -> script task (the script) -> user task 'wait' -> end */
const scripted = (id, script) => model(id, `
  <bpmn:startEvent id="start" />
  <bpmn:scriptTask id="run" scriptFormat="javascript"><bpmn:script>${xml(script)}</bpmn:script></bpmn:scriptTask>
  <bpmn:userTask id="wait" />
  <bpmn:endEvent id="end" />
  <bpmn:sequenceFlow id="f0" sourceRef="start" targetRef="run" />
  <bpmn:sequenceFlow id="f1" sourceRef="run" targetRef="wait" />
  <bpmn:sequenceFlow id="f2" sourceRef="wait" targetRef="end" />`);

let server, dir;
const calls = [];

test.before(async () => {
  ({ server, dir } = await makeServer({
    services: { charge: async (input) => { calls.push(input); return { charged: true }; } },
    extra: { demo: true, scriptHandler: () => new SandboxScriptHandler({ timeLimit: 100 }) },
  }));
  const models = {
    'sb-data': scripted('sbData', `
      data.total = data.a + data.b;
      data.list = [1, 2, 3].map(x => x * data.a);
      delete data.removeMe;
      item.assignee = 'user' + data.total;
      console.log('total', data.total);`),
    'sb-route': model('sbRoute', `
      <bpmn:startEvent id="start" />
      <bpmn:exclusiveGateway id="gw" default="toLow" />
      <bpmn:userTask id="high" />
      <bpmn:userTask id="low" />
      <bpmn:sequenceFlow id="f0" sourceRef="start" targetRef="gw" />
      <bpmn:sequenceFlow id="toHigh" sourceRef="gw" targetRef="high"><bpmn:conditionExpression xsi:type="bpmn:tFormalExpression">\${data.amount &gt; 1000}</bpmn:conditionExpression></bpmn:sequenceFlow>
      <bpmn:sequenceFlow id="toLow" sourceRef="gw" targetRef="low" />`),
    'sb-process': scripted('sbProcess', `data.p = typeof process + ',' + typeof require + ',' + typeof appDelegate;`),
    'sb-escape': scripted('sbEscape', `data.p = this.constructor.constructor('return typeof process')();`),
    'sb-loop': scripted('sbLoop', `while (true) {}`),
    'sb-service-call': scripted('sbServiceCall', `data.result = await appServices.charge({ amount: 5 });`),
    'sb-timer': model('sbTimer', `
      <bpmn:startEvent id="start" />
      <bpmn:intermediateCatchEvent id="pause" name="Pause"><bpmn:timerEventDefinition><bpmn:timeDuration>PT1S</bpmn:timeDuration></bpmn:timerEventDefinition></bpmn:intermediateCatchEvent>
      <bpmn:endEvent id="end" />
      <bpmn:sequenceFlow id="f0" sourceRef="start" targetRef="pause" />
      <bpmn:sequenceFlow id="f1" sourceRef="pause" targetRef="end" />`),
    'sb-service': model('sbService', `
      <bpmn:startEvent id="start" />
      <bpmn:serviceTask id="pay" name="Pay" camunda:delegateExpression="charge" />
      <bpmn:endEvent id="end" />
      <bpmn:sequenceFlow id="f0" sourceRef="start" targetRef="pay" />
      <bpmn:sequenceFlow id="f1" sourceRef="pay" targetRef="end" />`),
  };
  for (const [name, source] of Object.entries(models))
    fs.writeFileSync(`${dir}${name}.bpmn`, source);
  await server.definitions.rebuild();
});
test.after(async () => { await server?.shutdown?.(); });

const decisions = (execution) => execution.instance.logs.filter(l => l.type === 'decision').map(l => l.message);

test('a sandboxed script changes data and the item', async () => {
  const execution = await server.engine.start('sb-data', { a: 2, b: 3, removeMe: 1 });
  const data = execution.instance.data;
  assert.equal(data.total, 5);
  assert.deepEqual(data.list, [2, 4, 6]);
  assert.equal('removeMe' in data, false);
  const wait = execution.instance.items.find(i => i.elementId === 'wait');
  assert.equal(wait.status, 'wait');
  const run = execution.instance.items.find(i => i.elementId === 'run');
  assert.equal(run.assignee, 'user5');
});

test('values a script leaves alone keep their kind (a Date stays a Date)', async () => {
  const when = new Date('2026-01-02T03:04:05Z');
  const data = { when, n: 1 };
  const item = { data, input: {}, output: {}, token: { execution: { instance: { id: 'i1', name: 'm' } } }, log() { } };
  const result = await new SandboxScriptHandler().executeScript(item, 'data.n = data.n + 1; return data.when;');
  assert.equal(data.n, 2);
  assert.equal(data.when, when, 'the same Date object');
  assert.equal(result, when.toISOString(), 'what the script returns is JSON');
});

test('sandboxed conditions choose the path', async () => {
  const high = await server.engine.start('sb-route', { amount: 5000 });
  assert.ok(high.instance.items.some(i => i.elementId === 'high' && i.status === 'wait'));
  const low = await server.engine.start('sb-route', { amount: 10 });
  assert.ok(low.instance.items.some(i => i.elementId === 'low' && i.status === 'wait'));
});

test('a script reaches no Node.js: no process, no require, no appDelegate, not even through constructors', async () => {
  const plain = await server.engine.start('sb-process', {});
  assert.equal(plain.instance.data.p, 'undefined,undefined,undefined');
  const escape = await server.engine.start('sb-escape', {});
  assert.equal(escape.instance.data.p, 'undefined');
});

test('an endless loop is stopped at the time limit', async () => {
  const started = Date.now();
  await assert.rejects(server.engine.start('sb-loop', {}), /stopped after 100 ms/);
  assert.ok(Date.now() - started < 5000);
});

test('a service called from a script runs nothing and says so', async () => {
  calls.length = 0;
  const execution = await server.engine.start('sb-service-call', {});
  assert.equal(execution.instance.data.result, undefined);
  assert.equal(calls.length, 0);
  assert.ok(decisions(execution).some(d => /appServices\.charge: not called/.test(d)), decisions(execution).join('\n'));
});

test('demo: a timer is not scheduled; it waits until invoked, and says so', async () => {
  const execution = await server.engine.start('sb-timer', {});
  const pause = execution.instance.items.find(i => i.elementId === 'pause');
  assert.equal(pause.status, 'wait');
  assert.equal(server.cron.pending, 0, 'no timer scheduled');
  assert.ok(decisions(execution).some(d => /timers are disabled/.test(d)), decisions(execution).join('\n'));
  const done = await server.engine.invoke({ 'items.id': pause.id }, {});
  assert.equal(done.instance.status, 'end');
});

test('demo: a service task calls nothing, ends with no output, and says so', async () => {
  calls.length = 0;
  const execution = await server.engine.start('sb-service', { amount: 5 });
  assert.equal(execution.instance.status, 'end');
  assert.equal(calls.length, 0);
  assert.ok(decisions(execution).some(d => /service tasks do not run/.test(d) && /charge/.test(d)), decisions(execution).join('\n'));
});

test('runSandboxed: an expression over given values (the Test tab debugger in a demo)', async () => {
  const values = { data: { amount: 3 }, items: [{ elementId: 'a' }], instance: { id: 'i1' } };
  const { result } = await runSandboxed(values, 'return data.amount * 2 + items.length;', { name: 'evaluate' });
  assert.equal(result, 7);
  await assert.rejects(runSandboxed({}, 'return process.env', { name: 'evaluate' }), /evaluate: 'process' is not defined/);
});
