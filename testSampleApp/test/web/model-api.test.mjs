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
// its own environment, whatever this folder's .env says: production's services, no trace
test.before(async () => { web = await startWebApp({ env: { APP_ENV: 'production', API_TRACE: '' } }); });
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

test('@invoke ... is refused holds when the user may not do it, and fails when they can', async () => {
  const xml = XML().replace('<bpmn:userTask id="Approve" name="Approve" />', '<bpmn:userTask id="Approve" name="Approve" camunda:candidateGroups="manager" />')
    .replace('xmlns:bpmn=', 'xmlns:camunda="http://camunda.org/schema/1.0/bpmn" xmlns:bpmn=');
  assert.equal((await api('PUT', '/models/agent-refused', { source: xml })).status, 201);
  const feature = check => `Feature: agent-refused
  Scenario: who approves
    When user:emp1 @login with role of "staff"
      And @start process:agent-refused as :r
      And @invoke element:Approve in :r${check}
`;
  const refused = await api('POST', '/models/agent-refused/test', { source: feature(' is refused') });
  assert.equal(refused.body.passed, 1, JSON.stringify(refused.body));
  const asManager = await api('POST', '/models/agent-refused/test', { source: feature(' is refused').replace('"staff"', '"manager"') });
  assert.equal(asManager.body.failed, 1);
  assert.match(asManager.body.scenarios[0].error, /it was done, not refused \(as emp1\)/);
  const verify = await api('POST', '/models/agent-refused/verify', { source: XML() });
  assert.ok(verify.body.warnings.some(w => w.code === 'no-diagram' && /laid out/.test(w.message)), JSON.stringify(verify.body.warnings));
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
  assert.match(text, /Environment: \*\*production\*\*: services are real/, 'no APP_ENV: production');
  assert.match(text, /Services a model can call[^\n]*`notifyUsers`/, 'the services of services.json');
  assert.match(text, /User groups in use[^\n]*`ADMIN`, `DESIGNER`, `manager`, `staff`/, 'the groups of its users');
  assert.doesNotMatch(text, /user1|manager1/, 'groups, not users');
  assert.match(text, /## How to build workflows on BPMN Server/);
  assert.match(text, /\]\(https:\/\/bpmnserver\.github\.io\/bpmn-server\/testing\/\)/, 'the guide\'s links, to the published docs');
  assert.match((await web.client().get('/api2/openapi.json')).body.info.description, /\/llms\.txt/, 'the OpenAPI document points to it');
  const asOperation = await web.client().get('/api2/guide');
  assert.equal(asOperation.status, 200, 'the same, as an operation (getGuide), without a key');
  assert.match(asOperation.text, /## This site/);
});

test('the list as /models; a model laid out has no "no diagram" warning; a .feature as source', async () => {
  const list = await api('GET', '/models');
  assert.ok(list.body.some(m => m.name === MODEL && m.url.endsWith(`/model/edit/${MODEL}`)), JSON.stringify(list.body).slice(0, 200));
  const saved = await api('PUT', `/models/${MODEL}`, { source: XML() });
  assert.equal(saved.status, 200, why(saved));
  assert.equal(saved.body.laidOut, true);
  // the model as sent, with a diagram added: a shape for each element, an edge for each flow (no <incoming>/<outgoing> given)
  const stored = (await api('GET', `/models/${MODEL}`)).body.source;
  const processOf = xml => /<bpmn:process[\s\S]*<\/bpmn:process>/.exec(xml)[0];
  assert.equal(processOf(stored), processOf(XML()), 'the model itself is not changed');
  assert.equal((stored.match(/BPMNEdge /g) ?? []).length, 2, 'both flows drawn');
  assert.equal((stored.match(/BPMNShape /g) ?? []).length, 3);
  assert.ok(!saved.body.warnings.some(w => w.code === 'no-diagram'), JSON.stringify(saved.body.warnings));
  assert.match(saved.body.urlOpensFor, /signed in/);
  const feature = await api('PUT', `/models/${MODEL}/feature`, { source: FEATURE('end') });
  assert.equal(feature.status, 200, why(feature));
});
