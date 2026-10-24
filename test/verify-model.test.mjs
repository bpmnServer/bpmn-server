import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

import { verifyModel, BPMNAdminAPI, SecureUser } from '../dist/index.js';
import { makeServer, PROCESSES, coverage } from './helpers.mjs';

const NS = 'xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:camunda="http://camunda.org/schema/1.0/bpmn" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"';
/** A model around `body`, without diagram information. */
const model = (body) => `<?xml version="1.0" encoding="UTF-8"?>
<bpmn:definitions ${NS} id="d" targetNamespace="urn:test"><bpmn:process id="p" isExecutable="true">${body}</bpmn:process></bpmn:definitions>`;
const codes = (result, severity) => result.issues.filter(i => !severity || i.severity === severity).map(i => i.code);
const issue = (result, code) => result.issues.find(i => i.code === code);

const linear = `
  <bpmn:startEvent id="s" />
  <bpmn:task id="t" name="Work" />
  <bpmn:endEvent id="e" />
  <bpmn:sequenceFlow id="f1" sourceRef="s" targetRef="t" />
  <bpmn:sequenceFlow id="f2" sourceRef="t" targetRef="e" />`;

test('the test fixtures verify without errors or warnings (they carry no diagram)', async () => {
  for (const file of fs.readdirSync(PROCESSES)) {
    const result = await verifyModel(fs.readFileSync(PROCESSES + file, 'utf8'));
    assert.equal(result.valid, true, `${file}: ${JSON.stringify(result.issues)}`);
    assert.deepEqual(codes(result, 'warning').filter(c => c !== 'no-diagram'), [], file);
  }
});

test('reports invalid XML and empty sources', async () => {
  assert.deepEqual(codes(await verifyModel('')), ['empty-model']);
  const result = await verifyModel('<bpmn:definitions');
  assert.equal(result.valid, false);
  assert.deepEqual(codes(result), ['invalid-xml']);
});

test('reports structural errors and modelling mistakes', async () => {
  const result = await verifyModel(model(`
    <bpmn:task id="orphan" name="Orphan" />
    <bpmn:task id="t" />
    <bpmn:sequenceFlow id="f1" sourceRef="t" targetRef="missing" />`));
  assert.equal(result.valid, false);
  const all = codes(result);
  for (const code of ['no-start-event', 'unresolved-reference', 'no-end-event', 'no-diagram'])
    assert.ok(all.includes(code), `${code} in ${all}`);
  assert.equal(issue(result, 'no-start-event').processId, 'p');
  assert.equal(result.issues[0].severity, 'error', 'errors are listed first');
  assert.equal(result.errors, result.issues.filter(i => i.severity === 'error').length);
});

test('connections are read from the flows, not the optional incoming/outgoing lists', async () => {
  const result = await verifyModel(model(linear));
  assert.deepEqual(codes(result).filter(c => c !== 'no-diagram'), []);
});

test('flags unreachable elements and paths without an end event', async () => {
  const result = await verifyModel(model(linear + '<bpmn:task id="lost" name="Lost" />'));
  const lost = result.issues.filter(i => i.elementId === 'lost').map(i => i.code).sort();
  assert.deepEqual(lost, ['no-outgoing', 'unreachable']);
  assert.equal(issue(result, 'unreachable').elementName, 'Lost');
  assert.equal(result.valid, true, 'warnings do not make a model invalid');
});

test('checks gateways: default flow, conditions, event-based targets', async () => {
  const result = await verifyModel(model(`
    <bpmn:startEvent id="s" />
    <bpmn:exclusiveGateway id="g" default="f9" />
    <bpmn:endEvent id="a" /><bpmn:endEvent id="b" />
    <bpmn:eventBasedGateway id="eg" /><bpmn:task id="notEvent" /><bpmn:endEvent id="c" />
    <bpmn:sequenceFlow id="f1" sourceRef="s" targetRef="g" />
    <bpmn:sequenceFlow id="f2" sourceRef="g" targetRef="a"><bpmn:conditionExpression xsi:type="bpmn:tFormalExpression">data.ok</bpmn:conditionExpression></bpmn:sequenceFlow>
    <bpmn:sequenceFlow id="f3" sourceRef="g" targetRef="eg" />
    <bpmn:sequenceFlow id="f4" sourceRef="eg" targetRef="notEvent" />
    <bpmn:sequenceFlow id="f9" sourceRef="notEvent" targetRef="c" />`));
  const all = codes(result);
  for (const code of ['default-flow-not-outgoing', 'flow-without-condition', 'event-gateway-target'])
    assert.ok(all.includes(code), `${code} in ${all}`);
});

test('scripts, conditions and expressions must compile as the script handler runs them', async () => {
  const result = await verifyModel(model(`
    <bpmn:startEvent id="s" />
    <bpmn:scriptTask id="bad" name="Bad"><bpmn:script>data.x = ;</bpmn:script></bpmn:scriptTask>
    <bpmn:scriptTask id="async"><bpmn:script>await fetch('x');</bpmn:script></bpmn:scriptTask>
    <bpmn:scriptTask id="good"><bpmn:script>data.total = data.a + data.b;</bpmn:script></bpmn:scriptTask>
    <bpmn:userTask id="u" camunda:assignee="$(data.owner" />
    <bpmn:exclusiveGateway id="g" default="f6" />
    <bpmn:endEvent id="e" />
    <bpmn:sequenceFlow id="f1" sourceRef="s" targetRef="bad" />
    <bpmn:sequenceFlow id="f2" sourceRef="bad" targetRef="async" />
    <bpmn:sequenceFlow id="f3" sourceRef="async" targetRef="good" />
    <bpmn:sequenceFlow id="f4" sourceRef="good" targetRef="u" />
    <bpmn:sequenceFlow id="f5" sourceRef="u" targetRef="g" />
    <bpmn:sequenceFlow id="f6" sourceRef="g" targetRef="e" />
    <bpmn:sequenceFlow id="f7" sourceRef="g" targetRef="e"><bpmn:conditionExpression xsi:type="bpmn:tFormalExpression">data.a ==</bpmn:conditionExpression></bpmn:sequenceFlow>`));
  const failed = result.issues.filter(i => i.severity === 'error').map(i => `${i.code}:${i.elementId}`).sort();
  assert.deepEqual(failed, ['expression-syntax:f7', 'expression-syntax:u', 'script-syntax:async', 'script-syntax:bad']);
});

test('timers need a valid duration, cycle or date', async () => {
  const timer = (id, def) => `<bpmn:intermediateCatchEvent id="${id}"><bpmn:timerEventDefinition>${def}</bpmn:timerEventDefinition></bpmn:intermediateCatchEvent>`;
  const result = await verifyModel(model(`
    <bpmn:startEvent id="s" />
    ${timer('ok1', '<bpmn:timeDuration>PT5M</bpmn:timeDuration>')}
    ${timer('ok2', '<bpmn:timeCycle>R3/PT10H</bpmn:timeCycle>')}
    ${timer('ok3', '<bpmn:timeCycle>*/5 * * * *</bpmn:timeCycle>')}
    ${timer('ok4', '<bpmn:timeDuration>$data.wait</bpmn:timeDuration>')}
    ${timer('badDuration', '<bpmn:timeDuration>5 minutes</bpmn:timeDuration>')}
    ${timer('badDate', '<bpmn:timeDate>next week</bpmn:timeDate>')}
    ${timer('none', '')}
    <bpmn:endEvent id="e" />
    <bpmn:sequenceFlow id="f1" sourceRef="s" targetRef="ok1" /><bpmn:sequenceFlow id="f2" sourceRef="ok1" targetRef="ok2" />
    <bpmn:sequenceFlow id="f3" sourceRef="ok2" targetRef="ok3" /><bpmn:sequenceFlow id="f4" sourceRef="ok3" targetRef="ok4" />
    <bpmn:sequenceFlow id="f5" sourceRef="ok4" targetRef="badDuration" /><bpmn:sequenceFlow id="f6" sourceRef="badDuration" targetRef="badDate" />
    <bpmn:sequenceFlow id="f7" sourceRef="badDate" targetRef="none" /><bpmn:sequenceFlow id="f8" sourceRef="none" targetRef="e" />`));
  const failed = result.issues.filter(i => i.severity === 'error').map(i => `${i.code}:${i.elementId}`).sort();
  assert.deepEqual(failed, ['timer-invalid:badDate', 'timer-invalid:badDuration', 'timer-not-defined:none']);
});

test('api.model.verifyModel checks saved models against the application', async () => {
  const { server } = await makeServer({ services: coverage(true) });
  const api = new BPMNAdminAPI(server);
  const admin = new SecureUser({ userName: 'admin', userGroups: ['ADMIN'] });

  const saved = await api.model.verifyModel('property-claim', admin);
  assert.equal(saved.valid, true, JSON.stringify(saved.issues));
  assert.deepEqual(codes(saved).filter(c => c !== 'no-diagram'), []);

  const missing = await api.model.verifyModel('no-such-model', admin);
  assert.equal(missing.valid, false);
  assert.deepEqual(codes(missing), ['model-not-found']);

  const source = model(`
    <bpmn:startEvent id="s" />
    <bpmn:serviceTask id="svc" implementation="notAService" />
    <bpmn:callActivity id="call" calledElement="no-such-model" />
    <bpmn:endEvent id="e" />
    <bpmn:sequenceFlow id="f1" sourceRef="s" targetRef="svc" />
    <bpmn:sequenceFlow id="f2" sourceRef="svc" targetRef="call" />
    <bpmn:sequenceFlow id="f3" sourceRef="call" targetRef="e" />`);
  const checked = await api.model.verifyModel(source, admin);
  assert.ok(codes(checked).includes('service-not-found'));
  assert.ok(codes(checked).includes('called-model-missing'));

  await assert.rejects(() => api.model.verifyModel(source), /authenticated principal is required/);
  await server.shutdown();
});
