// @features: handoff
// A process's start form through a handoff (docs/docs/handoffs.md): the application's back end asks for a link to a process's
// start form for one of its people; the browser opens it with no sign-in and no menu, fills the form in, and the process is
// started as that person, then they go where the application said, with the instance's id.
import test from 'node:test';
import assert from 'node:assert/strict';
import { startWebApp, why, WebClient, API_KEY } from '../support/webApp.mjs';

let web;
test.after(async () => { await web?.stop(); setImmediate(() => process.exit(0)); });

const MODEL = 'handoff-start';
const XML = `<?xml version="1.0" encoding="UTF-8"?>
<bpmn:definitions xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:camunda="http://camunda.org/schema/1.0/bpmn" id="d" targetNamespace="urn:test">
  <bpmn:process id="HandoffStart" isExecutable="true">
    <bpmn:laneSet id="Roles"><bpmn:lane id="StaffLane" name="staff"><bpmn:flowNodeRef>Begin</bpmn:flowNodeRef><bpmn:flowNodeRef>Check</bpmn:flowNodeRef></bpmn:lane></bpmn:laneSet>
    <bpmn:startEvent id="Begin" name="Ask for leave">
      <bpmn:extensionElements><camunda:formData>
        <camunda:formField id="days" label="Days" type="long" />
        <camunda:formField id="kind" label="Kind" type="enum"><camunda:value id="Vacation" name="Vacation" /><camunda:value id="Sick" name="Sick" /></camunda:formField>
        <camunda:formField id="reason" label="Reason" type="string" />
      </camunda:formData></bpmn:extensionElements>
      <bpmn:outgoing>f1</bpmn:outgoing></bpmn:startEvent>
    <bpmn:userTask id="Check" name="Check it" camunda:assignee="\${data.requester}"><bpmn:incoming>f1</bpmn:incoming><bpmn:outgoing>f2</bpmn:outgoing></bpmn:userTask>
    <bpmn:endEvent id="Done"><bpmn:incoming>f2</bpmn:incoming></bpmn:endEvent>
    <bpmn:sequenceFlow id="f1" sourceRef="Begin" targetRef="Check" /><bpmn:sequenceFlow id="f2" sourceRef="Check" targetRef="Done" />
  </bpmn:process>
</bpmn:definitions>`;

const service = (method, url, json) => new WebClient(web.base).request(method, '/api/v3' + url, { json, headers: { 'x-api-key': API_KEY } });
const handoff = (userName, page, extra = {}) => service('POST', '/handoffs', { userName, groups: ['staff'], page, returnTo: 'http://app.example/hr/', ...extra });
const path = url => url.replace(/^https?:\/\/[^/]+/, '');
const tokenFor = async (userName, groups = ['staff']) => (await service('POST', '/tokens', { userName, groups })).body.token;

test.before(async () => {
  web = await startWebApp();
  await web.bpmnServer.models.save(MODEL, XML);
});

test('a handoff to a start form: a link for the process, and what a page may be', async () => {
  const res = await handoff('ann', { type: 'start', process: MODEL });
  assert.equal(res.status, 201, why(res));
  assert.match(res.body.url, new RegExp(`^${web.base}/embed/start/${MODEL}\\?handoff=bph_`));
  assert.deepEqual(res.body.page, { type: 'start', process: MODEL });
  const at = await handoff('ann', { type: 'start', process: MODEL, startNodeId: 'Begin' });
  assert.deepEqual(at.body.page, { type: 'start', process: MODEL, startNodeId: 'Begin' });
  for (const page of [{ type: 'start' }, { type: 'start', process: '../x' }, { type: 'start', process: 'a/b' }, { type: 'start', process: MODEL, startNodeId: '../x' }, { type: 'start', process: 5 }, { type: 'nothing' }]) {
    const bad = await handoff('ann', page);
    assert.equal(bad.status, 400, `${JSON.stringify(page)}: ${why(bad)}`);
    assert.equal(bad.body.error.code, 'BAD_PAGE');
  }
});

test('the person opens the link and fills in the start form: no sign-in, no menu, its fields as the model has them', async () => {
  const { body: { url } } = await handoff('ann', { type: 'start', process: MODEL });
  const browser = new WebClient(web.base);
  const arrived = await browser.get(path(url));
  assert.equal(arrived.status, 302, why(arrived));
  assert.equal(arrived.location, `/embed/start/${MODEL}`, 'the handoff is not left in the address');
  const page = await browser.get(arrived.location);
  assert.equal(page.status, 200, why(page));
  for (const name of ['field.days', 'field.kind', 'field.reason'])
    assert.match(page.text, new RegExp(`name="${name.replace('.', '\\.')}"`), name);
  assert.match(page.text, new RegExp(`action="/embed/start/${MODEL}"`), 'it is started here');
  assert.doesNotMatch(page.text, /Workbench|Sign out/, 'no menu');
  assert.ok([302, 401, 403].includes((await browser.get('/dashboard')).status), 'nothing else is opened');
  assert.equal((await browser.get('/embed/start/other-process')).status, 401, 'a session is for its one process');
});

test('submitting starts the process as that person, and sends them back with the instance\'s id', async () => {
  const { body: { url } } = await handoff('bea', { type: 'start', process: MODEL }, { returnTo: 'http://app.example/hr/work?from=start' });
  const browser = new WebClient(web.base);
  await browser.get(path(url));
  await browser.get(`/embed/start/${MODEL}`);                                  // for the CSRF token
  const sent = await browser.post(`/embed/start/${MODEL}`, { processName: MODEL, startNodeId: 'Begin', 'field.days': '3', 'field.kind': 'Sick', 'field.reason': 'flu', 'field.ignored': '' });
  assert.equal(sent.status, 302, why(sent));
  const back = new URL(sent.location);
  assert.equal(`${back.origin}${back.pathname}`, 'http://app.example/hr/work');
  assert.equal(back.searchParams.get('from'), 'start', 'the address\'s own query is kept');
  const instanceId = back.searchParams.get('instance');
  assert.ok(instanceId, 'the instance that was made');
  const token = await tokenFor('bea');
  const mine = await new WebClient(web.base).request('GET', `/api/v3/instances/${instanceId}`, { headers: { authorization: `Bearer ${token}` } });
  assert.equal(mine.status, 200, why(mine));
  const data = mine.body.instance?.data ?? mine.body.data;
  assert.deepEqual([data.days, data.kind, data.reason], ['3', 'Sick', 'flu'], 'with what was entered');
  assert.ok(!('ignored' in data), 'an empty field is not sent');
  // the session was for that start: it is over
  assert.equal((await browser.get(`/embed/start/${MODEL}`)).status, 401);
});

test('who may start it is the process\'s own rule, and a link is for its one process and one use', async () => {
  // a person outside the staff lane: the process is not one they may start
  const { body: { url } } = await service('POST', '/handoffs', { userName: 'out', groups: ['visitors'], page: { type: 'start', process: MODEL } });
  const browser = new WebClient(web.base);
  await browser.get(path(url));
  assert.equal((await browser.get(`/embed/start/${MODEL}`)).status, 403, 'refused by the process\'s own lane');
  // spent by its first visit
  const spent = (await handoff('ann', { type: 'start', process: MODEL })).body.url;
  assert.equal((await new WebClient(web.base).get(path(spent))).status, 302);
  assert.equal((await new WebClient(web.base).get(path(spent))).status, 403);
  // a task link does not open a start form, nor a start link a task
  const task = (await handoff('ann', { type: 'task', id: 'x' })).body.url;
  assert.equal((await new WebClient(web.base).get(path(task).replace('/embed/task/x', `/embed/start/${MODEL}`))).status, 403);
  const start = (await handoff('ann', { type: 'start', process: MODEL })).body.url;
  assert.equal((await new WebClient(web.base).get(path(start).replace(`/embed/start/${MODEL}`, '/embed/task/x'))).status, 403);
  // nothing without a session
  assert.equal((await new WebClient(web.base).get(`/embed/start/${MODEL}`)).status, 401);
  assert.ok([401, 403].includes((await new WebClient(web.base).post(`/embed/start/${MODEL}`, { 'field.days': '1' })).status));
});
