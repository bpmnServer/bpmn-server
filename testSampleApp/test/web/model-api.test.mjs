// @features: ai-remote-development
// Models and their tests over the API, as an AI agent builds a workflow with no editor: the OpenAPI document; a
// model refused with its errors, then created; read back and checked; its .feature written and run; a failing test
// says where and why; the run's Rationale by step.
import test from 'node:test';
import assert from 'node:assert/strict';
import { startWebApp, why, API_KEY } from '../support/webApp.mjs';

const MODEL = 'agent-leave';
const XML = (end = '<bpmn:endEvent id="Done" name="Done" />') => `<?xml version="1.0" encoding="UTF-8"?>
<bpmn:definitions xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" id="d" targetNamespace="urn:test">
  <bpmn:process id="AgentLeave" isExecutable="true">
    <bpmn:startEvent id="Requested" name="Requested" />
    <bpmn:userTask id="Approve" name="Approve" />
    ${end}
    <bpmn:sequenceFlow id="f1" sourceRef="Requested" targetRef="Approve" />
    <bpmn:sequenceFlow id="f2" sourceRef="Approve" targetRef="Done" />
  </bpmn:process>
</bpmn:definitions>`;
const FEATURE = check => `Feature: ${MODEL}
  Scenario: approved
    When @start process:${MODEL} as :leave
    And @invoke element:Approve in :leave
    Then @check :leave status is "${check}"
`;

let web;
test.before(async () => { web = await startWebApp(); });
test.after(async () => { await web?.stop(); setImmediate(() => process.exit(0)); });
const api = (method, url, body) => web.api(method, '/api2' + url, body);

test('the OpenAPI document needs no key, and names each call', async () => {
  const res = await web.client().get('/api2/openapi.json');
  assert.equal(res.status, 200, why(res));
  const ops = Object.values(res.body.paths).flatMap(p => Object.values(p).map(o => o.operationId));
  for (const id of ['getModel', 'saveModel', 'verifyModel', 'saveModelTests', 'runModelTests', 'getInstanceRationale', 'startProcess'])
    assert.ok(ops.includes(id), id);
  assert.equal(res.body.components.securitySchemes.apiKey.name, 'x-api-key');
  assert.equal((await web.client().get('/api2/models/x')).status, 401, 'the calls themselves need the key');
});

test('an agent builds a model and its tests, runs them, reads why one failed', async () => {
  // a model with an error is not saved: what is wrong comes back
  const bad = await api('PUT', `/models/${MODEL}`, { source: XML('<bpmn:endEvent id="Done" name="Done"><bpmn:timerEventDefinition><bpmn:timeDuration>soon</bpmn:timeDuration></bpmn:timerEventDefinition></bpmn:endEvent>') });
  assert.equal(bad.status, 422, why(bad));
  assert.equal(bad.body.saved, false);
  assert.ok(bad.body.errors.length > 0, JSON.stringify(bad.body));

  const created = await api('PUT', `/models/${MODEL}`, { source: XML() });
  assert.equal(created.status, 201, why(created));
  assert.equal(created.body.created, true);
  assert.match(created.body.url, new RegExp(`/model/edit/${MODEL}$`));

  const read = await api('GET', `/models/${MODEL}`);
  assert.equal(read.status, 200, why(read));
  assert.match(read.body.source, /AgentLeave/);
  assert.match(read.body.source, /BPMNDiagram/, 'laid out, as the editor\'s import');
  assert.equal((await api('POST', `/models/${MODEL}/verify`)).body.valid, true);

  // its tests: saved, run, passed
  const saved = await api('PUT', `/models/${MODEL}/feature`, { text: FEATURE('end') });
  assert.equal(saved.status, 200, why(saved));
  const passed = await api('POST', `/models/${MODEL}/test`);
  assert.equal(passed.status, 200, why(passed));
  assert.deepEqual([passed.body.passed, passed.body.failed], [1, 0], JSON.stringify(passed.body));

  // a test that fails: its step and why; and the run's Rationale by step
  const failed = await api('POST', `/models/${MODEL}/test`, { source: FEATURE('running') });
  assert.equal(failed.body.failed, 1, JSON.stringify(failed.body));
  const [scenario] = failed.body.scenarios;
  assert.match(scenario.failedStep, /@check :leave status is "running"/);
  assert.ok(scenario.error);
  const rationale = await api('GET', `/instances/${scenario.instances[0]}/rationale`);
  assert.equal(rationale.status, 200, why(rationale));
  assert.equal(rationale.body.status, 'end');
  assert.deepEqual(rationale.body.steps.map(s => s.label), ['Start Process', 'Invoke Item']);
  assert.equal(rationale.body.steps[1].outcome.status, 'end');
});

test('a feature that does not read as tests is refused, and the file stays', async () => {
  const res = await api('PUT', `/models/${MODEL}/feature`, { text: 'not gherkin' });
  assert.equal(res.status, 400, why(res));
  assert.match((await api('GET', `/models/${MODEL}/feature`)).body.text, /Scenario: approved/);
});

test('/llms.txt: where an agent starts: this site\'s facts, then BPMN Server\'s guide; no sign-in', async () => {
  const res = await web.client().get('/llms.txt');
  assert.equal(res.status, 200, why(res));
  assert.match(res.headers.get('content-type'), /markdown/);
  const text = res.text;
  assert.match(text, /^# .*BPMN Server, for AI agents/);
  assert.match(text, /## This site/);
  assert.match(text, /\/api2\/openapi\.json/);
  assert.match(text, /Creating and changing models, running their tests: on/);
  assert.match(text, /Services a model can call[^\n]*`notify`/, 'the services of services.json');
  assert.match(text, /User groups in use[^\n]*`ADMIN`, `DESIGNER`, `manager`, `staff`/, 'the groups of its users');
  assert.doesNotMatch(text, /user1|manager1/, 'groups, not users');
  assert.match(text, /## How to build workflows on BPMN Server/);
  assert.match(text, /\]\(https:\/\/bpmnserver\.github\.io\/bpmn-server\/testing\/\)/, 'the guide\'s links, to the published docs');
  assert.match((await web.client().get('/api2/openapi.json')).body.info.description, /\/llms\.txt/, 'the OpenAPI document points to it');
});

test('the list as /models; a model laid out has no "no diagram" warning; a .feature as source', async () => {
  const list = await api('GET', '/models');
  assert.ok(list.body.some(m => m.name === MODEL && m.url.endsWith(`/model/edit/${MODEL}`)), JSON.stringify(list.body).slice(0, 200));
  const saved = await api('PUT', `/models/${MODEL}`, { source: XML() });
  assert.equal(saved.status, 200, why(saved));
  assert.equal(saved.body.laidOut, true);
  assert.ok(!saved.body.warnings.some(w => w.code === 'no-diagram'), JSON.stringify(saved.body.warnings));
  assert.match(saved.body.urlOpensFor, /signed in/);
  const feature = await api('PUT', `/models/${MODEL}/feature`, { source: FEATURE('end') });
  assert.equal(feature.status, 200, why(feature));
});
