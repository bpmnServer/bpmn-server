// @features: process-guide
// A process explained (routes/api/guide.ts, docs/docs/process-guide.md), for whoever may start it or works in it:
// its steps (who does each, what its form asks, where it goes next), its rules, and its examples: its scenarios in
// plain words, each with the case it made. As a page (/guide/<process>) and API v3's GET /processes/{name}/guide.
import test from 'node:test';
import assert from 'node:assert/strict';
import { startWebApp, why, WebClient, API_KEY } from '../support/webApp.mjs';

const MODEL = 'leave-request';
let web, designer, staff;
const v3 = (url, token) => new WebClient(web.base).request('GET', '/api/v3' + url, { headers: { authorization: `Bearer ${token}` } });
const tokenFor = async (userName, groups) => (await new WebClient(web.base).request('POST', '/api/v3/tokens', { json: { userName, groups }, headers: { 'x-api-key': API_KEY } })).body.token;

test.before(async () => {
    web = await startWebApp({ env: { APP_ENV: 'development' } });
    [designer, staff] = await Promise.all([web.login('designer'), web.login('staff')]);
    // a scenario, run and saved: an example with its test case
    await designer.get('/dashboard/design');
    const scenario = { name: 'A long leave goes to a manager', start: { data: {} }, steps: [{ element: 'Submit', data: { days: 8, reason: 'travel' } }] };
    assert.equal((await designer.request('PUT', `/model/scenarios/${MODEL}`, { json: { scenarios: [scenario] } })).status, 200);
    assert.equal((await designer.post('/dashboard/design/tests', { model: MODEL })).status, 302);
});
test.after(async () => { await web?.stop(); setImmediate(() => process.exit(0)); });

test('the API: its steps in the order a case meets them, who does each, what each form asks, where it goes next', async () => {
    const res = await v3(`/processes/${MODEL}/guide`, await tokenFor('sam', ['staff']));
    assert.equal(res.status, 200, why(res));
    const guide = res.body;
    assert.equal(guide.name, MODEL);
    const [first, ...rest] = guide.steps;
    assert.equal(first.kind, 'start');
    const submit = rest.find(s => s.id === 'Submit');
    assert.equal(submit.kind, 'task');
    assert.deepEqual(submit.who.groups, ['staff']);
    assert.deepEqual(submit.fields.map(f => f.label), ['Days', 'Reason']);
    const decision = guide.steps.find(s => s.kind === 'decision');
    assert.deepEqual(decision.next.map(n => n.name).sort(), ['no', 'yes']);
    assert.ok(guide.steps.findIndex(s => s.id === 'Submit') < guide.steps.findIndex(s => s.id === 'Approve'), 'in the order a case meets them');
    assert.ok(!JSON.stringify(guide).includes('item.data.days'), 'no expression');
});

test('its examples: the scenarios in plain words, each with the case it made', async () => {
    const guide = (await v3(`/processes/${MODEL}/guide`, await tokenFor('mia', ['manager']))).body;
    const [example] = guide.examples.scenarios;
    assert.equal(example.name, 'A long leave goes to a manager');
    const texts = example.steps.map(s => s.text);
    assert.ok(texts.some(t => /starts leave-request\./.test(t)), texts.join(' | '));
    const completes = example.steps.find(s => /completes “Submit request”\./.test(s.text));
    assert.ok(completes, texts.join(' | '));
    assert.deepEqual(completes.values, [['Days', '8'], ['Reason', 'travel']], 'the fields by their labels');
    assert.ok(!texts.some(t => t.includes('@')), 'no step written as the test language');
    assert.equal(example.testCase.ok, true);
    assert.equal(example.testCase.current, true);
});

test('who may read it: whoever may start it or works in it, designers and administrators; anyone else, a 404', async () => {
    // leave-request's start is anyone's: anyone may read it
    assert.equal((await v3(`/processes/${MODEL}/guide`, await tokenFor('olga', ['outsiders']))).status, 200);
    // a process started and worked in by managers only: theirs, not an outsider's
    await web.bpmnServer.models.save('managers-only', `<?xml version="1.0" encoding="UTF-8"?>
<bpmn:definitions xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:camunda="http://camunda.org/schema/1.0/bpmn" id="D_M" targetNamespace="t">
  <bpmn:process id="ManagersOnly" isExecutable="true">
    <bpmn:laneSet id="LS"><bpmn:lane id="L" name="manager"><bpmn:flowNodeRef>S</bpmn:flowNodeRef><bpmn:flowNodeRef>T</bpmn:flowNodeRef><bpmn:flowNodeRef>E</bpmn:flowNodeRef></bpmn:lane></bpmn:laneSet>
    <bpmn:startEvent id="S"><bpmn:outgoing>f1</bpmn:outgoing></bpmn:startEvent>
    <bpmn:userTask id="T" name="Decide" camunda:candidateGroups="manager"><bpmn:incoming>f1</bpmn:incoming><bpmn:outgoing>f2</bpmn:outgoing></bpmn:userTask>
    <bpmn:endEvent id="E"><bpmn:incoming>f2</bpmn:incoming></bpmn:endEvent>
    <bpmn:sequenceFlow id="f1" sourceRef="S" targetRef="T" /><bpmn:sequenceFlow id="f2" sourceRef="T" targetRef="E" />
  </bpmn:process>
</bpmn:definitions>`, null, 'designer');
    assert.equal((await v3('/processes/managers-only/guide', await tokenFor('olga', ['outsiders']))).status, 404);
    assert.equal((await v3('/processes/managers-only/guide', await tokenFor('max', ['manager']))).status, 200);
    assert.equal((await v3('/processes/no-such-model/guide', await tokenFor('sam', ['staff']))).status, 404);
    // a designer's token is the person's own (the page's, or their AI link): issued here as the pages issue it
    const { Tokens } = await import('../../../../packages/bpmn-web/dist/routes/api/tokens.js');
    const designerToken = (await new Tokens(web.bpmnServer).issue({ userName: 'dee', groups: ['DESIGNER'] }, 'dee', { own: true })).token;
    assert.equal((await v3('/processes/managers-only/guide', designerToken)).status, 200, 'a designer reads any');
});

test('the page: the process, its steps and examples, linked from My work and from a case', async () => {
    const page = await staff.get(`/guide/${MODEL}`);
    assert.equal(page.status, 200, why(page));
    assert.match(page.text, /<h1>leave-request<\/h1>/);
    assert.match(page.text, /data-step="Submit"/);
    assert.match(page.text, /Asks for:/);
    assert.match(page.text, /A long leave goes to a manager/);
    assert.match(page.text, /href="\/test-cases\/leave-request\/A%20long%20leave%20goes%20to%20a%20manager">See the case it made</);
    assert.match((await staff.get('/dashboard')).text, /href="\/guide\/leave-request"/);
    const { id } = await web.bpmnServer.engine.start(MODEL, {}, null, 'staff');
    assert.match((await staff.get('/instanceDetails?id=' + id)).text, /href="\/guide\/leave-request">How this process goes/);
    assert.equal((await staff.get(`/test-cases/${MODEL}/${encodeURIComponent('A long leave goes to a manager')}`)).status, 200);
});
