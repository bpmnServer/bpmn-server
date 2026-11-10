// @features: api-v3
// The API's models and their tests (routes/api/models.ts; /api2 has the same operations): read by anyone the door lets
// in; saved (checked first, laid out without a diagram), tested, renamed and deleted by a designer's token or the
// service key; a staff token is refused, with v3's errors.
import test from 'node:test';
import assert from 'node:assert/strict';
import { startWebApp, why, WebClient, API_KEY } from '../support/webApp.mjs';

const MODEL = 'v3-approval';
const XML = (end = '<bpmn:endEvent id="Done" />') => `<?xml version="1.0" encoding="UTF-8"?>
<bpmn:definitions xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:camunda="http://camunda.org/schema/1.0/bpmn" id="d" targetNamespace="urn:test">
  <bpmn:process id="V3Approval" isExecutable="true">
    <bpmn:startEvent id="Start" />
    <bpmn:userTask id="Approve" name="Approve" camunda:candidateGroups="manager">
      <bpmn:documentation>A manager decides</bpmn:documentation>
      <bpmn:extensionElements><camunda:formData><camunda:formField id="approved" label="Approved" type="boolean" /></camunda:formData></bpmn:extensionElements>
    </bpmn:userTask>
    ${end}
    <bpmn:sequenceFlow id="f1" sourceRef="Start" targetRef="Approve" />
    <bpmn:sequenceFlow id="f2" sourceRef="Approve" targetRef="Done" />
  </bpmn:process>
</bpmn:definitions>`;
const FEATURE = `Feature: ${MODEL}
  Scenario: approved
    When user:mia @login with role of "manager"
      And @start process:${MODEL} as :a
      And @invoke element:Approve in :a
        | approved | true |
    Then @check :a status is "end"
`;

let web, designer, staff;
const v3 = (method, url, credential, body) => new WebClient(web.base).request(method, '/api/v3' + url, {
  json: body, headers: credential === 'service' ? { 'x-api-key': API_KEY } : { authorization: `Bearer ${credential}` },
});
const tokenFor = async (userName, groups) => (await v3('POST', '/tokens', 'service', { userName, groups })).body.token;

test.before(async () => {
  web = await startWebApp({ env: { APP_ENV: 'production', API_TRACE: '' } });
  // a designer's token is the person's own (the page's, or their AI link): issued here as the pages issue it
  const { Tokens } = await import('../../../../packages/bpmn-web/dist/routes/api/tokens.js');
  designer = (await new Tokens(web.bpmnServer).issue({ userName: 'dee', groups: ['DESIGNER'] }, 'dee', { own: true })).token;
  staff = await tokenFor('sam', ['staff']);
});
test.after(async () => { await web?.stop(); setImmediate(() => process.exit(0)); });

test('a designer saves a model: checked, laid out, read back; one with errors is refused with its check', async () => {
  const bad = await v3('PUT', `/models/${MODEL}`, designer, { source: XML('<bpmn:endEvent id="Done"><bpmn:timerEventDefinition><bpmn:timeDuration>soon</bpmn:timeDuration></bpmn:timerEventDefinition></bpmn:endEvent>') });
  assert.equal(bad.status, 422, why(bad));
  assert.equal(bad.body.error.code, 'MODEL_INVALID');
  assert.ok(bad.body.error.details.errors.length > 0);

  const saved = await v3('PUT', `/models/${MODEL}`, designer, { source: XML() });
  assert.equal(saved.status, 201, why(saved));
  assert.deepEqual([saved.body.created, saved.body.laidOut, saved.body.valid], [true, true, true]);
  assert.match(saved.body.url, new RegExp(`/model/edit/${MODEL}$`));
  assert.equal((await v3('PUT', `/models/${MODEL}`, designer, { source: XML() })).status, 200, 'changed: 200');

  const read = await v3('GET', `/models/${MODEL}`, staff);
  assert.equal(read.status, 200, why(read));
  assert.match(read.body.source, /BPMNDiagram/);
  assert.ok((await v3('GET', '/models', staff)).body.items.some(m => m.name === MODEL));
  assert.equal((await v3('POST', `/models/${MODEL}/verify`, staff, {})).body.valid, true);
});

test('an element: its type, documentation, assignment and form', async () => {
  const el = await v3('GET', `/models/${MODEL}/elements/Approve`, staff);
  assert.equal(el.status, 200, why(el));
  assert.equal(el.body.type, 'bpmn:UserTask');
  assert.equal(el.body.documentation, 'A manager decides');
  assert.deepEqual(el.body.assignment.candidateGroups, ['manager']);
  assert.deepEqual(el.body.form.fields.map(f => f.id), ['approved']);
  assert.equal((await v3('GET', `/models/${MODEL}/elements/Nothing`, staff)).body.error.code, 'ELEMENT_NOT_FOUND');
});

test('its tests: written, run, each scenario\'s result', async () => {
  const written = await v3('PUT', `/models/${MODEL}/feature`, designer, { text: FEATURE });
  assert.equal(written.status, 200, why(written));
  assert.match((await v3('GET', `/models/${MODEL}/feature`, staff)).body.text, /Scenario: approved/);
  const run = await v3('POST', `/models/${MODEL}/test`, designer, {});
  assert.equal(run.status, 200, why(run));
  assert.deepEqual([run.body.passed, run.body.failed], [1, 0], JSON.stringify(run.body));
});

test('staff may read, not change: 403 DESIGN_REFUSED; the service key may', async () => {
  for (const [method, url, body] of [['PUT', `/models/${MODEL}`, { source: XML() }], ['PUT', `/models/${MODEL}/feature`, { text: FEATURE }],
    ['POST', `/models/${MODEL}/test`, {}], ['DELETE', `/models/${MODEL}`], ['POST', `/models/${MODEL}/rename`, { newName: 'x' }]]) {
    const res = await v3(method, url, staff, body);
    assert.equal(res.status, 403, `${method} ${url}`);
    assert.equal(res.body.error.code, 'DESIGN_REFUSED');
  }
  assert.equal((await v3('PUT', `/models/${MODEL}`, 'service', { source: XML() })).status, 200);
});

test('renamed, then deleted', async () => {
  const renamed = await v3('POST', `/models/${MODEL}/rename`, designer, { newName: `${MODEL}-2` });
  assert.equal(renamed.status, 200, why(renamed));
  assert.equal((await v3('GET', `/models/${MODEL}`, staff)).body.error.code, 'MODEL_NOT_FOUND');
  assert.deepEqual((await v3('DELETE', `/models/${MODEL}-2`, designer)).body, { deleted: `${MODEL}-2` });
  assert.equal((await v3('GET', `/models/${MODEL}-2`, staff)).status, 404);
  assert.equal((await v3('PUT', '/models/..%2Fescape', designer, { source: XML() })).status, 400, 'a name that is not a file name');
});
