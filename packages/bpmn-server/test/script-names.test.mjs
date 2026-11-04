// @features: listeners, script-task
// A model's scripts and expressions are compiled under names that say where they are in the model
// (bpmn:///<model>/<element>/<label>.js), numbered from their own first line: a debugger lists them by name and
// stops at their breakpoints, and an error's stack points at the element and line.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

import { ScriptHandler } from '../dist/index.js';
import { makeServer } from './helpers.mjs';

const NS = 'xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:camunda="http://camunda.org/schema/1.0/bpmn" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"';
const model = (body) => `<?xml version="1.0" encoding="UTF-8"?>
<bpmn:definitions ${NS} id="d" targetNamespace="urn:test"><bpmn:process id="p" isExecutable="true">${body}</bpmn:process></bpmn:definitions>`;

/** A script task `calc` with `script`, its start listener `listener`, then a gateway on `condition`. */
const scripted = ({ script = 'data.ok = true;', listener = 'data.started = true;', condition = '$(data.ok)' } = {}) => model(`
  <bpmn:startEvent id="start" />
  <bpmn:scriptTask id="calc" scriptFormat="JavaScript">
    <bpmn:extensionElements><camunda:executionListener event="start"><camunda:script scriptFormat="JavaScript">${listener}</camunda:script></camunda:executionListener></bpmn:extensionElements>
    <bpmn:script>${script}</bpmn:script>
  </bpmn:scriptTask>
  <bpmn:exclusiveGateway id="gw" default="toNo" />
  <bpmn:endEvent id="yes" />
  <bpmn:endEvent id="no" />
  <bpmn:sequenceFlow id="f0" sourceRef="start" targetRef="calc" />
  <bpmn:sequenceFlow id="f1" sourceRef="calc" targetRef="gw" />
  <bpmn:sequenceFlow id="toYes" sourceRef="gw" targetRef="yes"><bpmn:conditionExpression xsi:type="bpmn:tFormalExpression">${condition}</bpmn:conditionExpression></bpmn:sequenceFlow>
  <bpmn:sequenceFlow id="toNo" sourceRef="gw" targetRef="no" />`);

async function serverWith(name, xml) {
  const made = await makeServer();
  fs.writeFileSync(made.dir + name + '.bpmn', xml);
  await made.server.definitions.rebuild();
  return made.server;
}

/** An item as a script sees it: model "m", element "calc". */
const item = () => ({ elementId: "calc", data: {}, input: {}, output: {},
  token: { execution: { name: "m", instance: {}, appDelegate: { appUtils: {} }, servicesProvider: {} } } });

test('names: model, element, label; a process\'s own scripts under process', () => {
  const execution = { name: 'Buy Used Car' };
  assert.equal(ScriptHandler.scriptName({ elementId: 'task_Buy', token: { execution } }, 'start'), 'bpmn:///Buy%20Used%20Car/task_Buy/start.js');
  assert.equal(ScriptHandler.scriptName(execution, 'end'), 'bpmn:///Buy%20Used%20Car/process/end.js');
});

test('scripts, listeners and conditions still run in the engine', async () => {
  const server = await serverWith('ok', scripted());
  const resp = await server.engine.start('ok', {});
  assert.equal(resp.instance.data.ok, true);
  assert.equal(resp.instance.data.started, true, 'the listener ran');
  assert.ok(resp.instance.items.some(i => i.elementId === 'yes'), 'the condition held');
  await server.shutdown();
});

test('a failing script fails the call that ran it, with its own error and location', async () => {
  const server = await serverWith('failing', scripted({ script: 'data.a = 1;\nthrow new RangeError("too much");' }));
  await assert.rejects(server.engine.start('failing', {}),
    (e) => e instanceof RangeError && /bpmn:\/\/\/failing\/calc\/script\.js:2:/.test(e.stack));
  await server.shutdown();
});

test('an error points at the element, the label and the script\'s own line', async () => {
  const handler = new ScriptHandler();
  assert.equal(await handler.executeScript(item(), 'data.a = 2;\nreturn data.a * 21;', 'start'), 42);
  await assert.rejects(handler.executeScript(item(), 'data.a = 1;\nthrow new RangeError("too much");', 'script'),
    (e) => e instanceof RangeError && /bpmn:\/\/\/m\/calc\/script\.js:2:/.test(e.stack), 'the error itself, at line 2');
  await assert.rejects(handler.evaluateExpression(item(), '$(data.nothing.here)', 'condition'),
    (e) => e instanceof TypeError && /bpmn:\/\/\/m\/calc\/condition\.js:1:/.test(e.stack));
});
