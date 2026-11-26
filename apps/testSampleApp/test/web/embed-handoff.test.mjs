// @features: handoff
// An application hands a person to one page of OWF (docs/design/roadmap-3.8.md): its back end asks for a handoff with the
// service key (POST /api/v3/handoffs), the person's browser opens the link, and gets one task's form with no menu, no second
// sign-in, and nothing else of the server. The link is spent by its first visit, and the task is completed as that person.
import test from 'node:test';
import assert from 'node:assert/strict';
import { startWebApp, why, WebClient, API_KEY } from '../support/webApp.mjs';

let web;
test.after(async () => { await web?.stop(); setImmediate(() => process.exit(0)); });

const MODEL = 'handoff-leave';
const XML = `<?xml version="1.0" encoding="UTF-8"?>
<bpmn:definitions xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:camunda="http://camunda.org/schema/1.0/bpmn" id="d" targetNamespace="urn:test">
  <bpmn:process id="HandoffLeave" isExecutable="true">
    <bpmn:startEvent id="Begin"><bpmn:outgoing>f1</bpmn:outgoing></bpmn:startEvent>
    <bpmn:userTask id="Request" name="Ask for leave" camunda:assignee="\${data.requester}">
      <bpmn:extensionElements><camunda:formData>
        <camunda:formField id="days" label="Days" type="long"><camunda:validation><camunda:constraint name="required" /><camunda:constraint name="max" config="30" /></camunda:validation></camunda:formField>
        <camunda:formField id="reason" label="Reason" type="string" />
      </camunda:formData></bpmn:extensionElements>
      <bpmn:incoming>f1</bpmn:incoming><bpmn:outgoing>f2</bpmn:outgoing></bpmn:userTask>
    <bpmn:endEvent id="Done"><bpmn:incoming>f2</bpmn:incoming></bpmn:endEvent>
    <bpmn:sequenceFlow id="f1" sourceRef="Begin" targetRef="Request" /><bpmn:sequenceFlow id="f2" sourceRef="Request" targetRef="Done" />
  </bpmn:process>
</bpmn:definitions>`;

const service = (method, url, json) => new WebClient(web.base).request(method, '/api/v3' + url, { json, headers: { 'x-api-key': API_KEY } });
async function tokenFor(userName, groups = []) {
  const res = await service('POST', '/tokens', { userName, groups });
  assert.equal(res.status, 201, why(res));
  return res.body.token;
}
const asUser = (token, method, url, json) => new WebClient(web.base).request(method, '/api/v3' + url, { json, headers: { authorization: `Bearer ${token}` } });

/** A waiting task of this person's: the case is started as them, the task is theirs. */
async function startFor(userName) {
  const token = await tokenFor(userName, ['staff']);
  const started = await asUser(token, 'POST', `/processes/${MODEL}/start`, { data: { requester: userName } });
  assert.equal(started.status, 201, why(started));
  const tasks = await asUser(token, 'GET', '/tasks');
  const task = tasks.body.items.find(t => t.instanceId === started.body.instance.id);
  assert.ok(task, 'the person has the task');
  return { task, instanceId: started.body.instance.id, token };
}
const handoffFor = (userName, taskId, extra = {}) => service('POST', '/handoffs', { userName, groups: ['staff'], page: { type: 'task', id: taskId }, returnTo: 'http://app.example/hr/', ...extra });
const path = url => url.replace(/^https?:\/\/[^/]+/, '');

test.before(async () => {
  web = await startWebApp();
  await web.bpmnServer.models.save(MODEL, XML);
});

test('a handoff is asked for with the service key, for one person and one task', async () => {
  const { task } = await startFor('ann');
  const res = await handoffFor('ann', task.id);
  assert.equal(res.status, 201, why(res));
  assert.match(res.body.handoff, /^bph_/);
  assert.match(res.body.url, new RegExp(`^${web.base}/embed/task/${task.id}\\?handoff=bph_`), 'a link to this server, for that task');
  assert.ok(Date.parse(res.body.expiresAt) > Date.now() && Date.parse(res.body.expiresAt) < Date.now() + 90_000, 'about a minute');
  assert.deepEqual(res.body.page, { type: 'task', id: task.id });
});

test('what is refused: a person\'s token, no credential, groups the application may not give, a page or an address that is not one', async () => {
  const { task, token } = await startFor('ben');
  const body = { userName: 'ben', page: { type: 'task', id: task.id } };
  assert.equal((await asUser(token, 'POST', '/handoffs', body)).status, 403, 'a token is not the service key');
  assert.equal((await new WebClient(web.base).request('POST', '/api/v3/handoffs', { json: body })).status, 401, 'no credential');
  for (const [change, status, code] of [
    [{ groups: ['ADMIN'] }, 403, 'GROUP_REFUSED'], [{ groups: ['designer'] }, 403, 'GROUP_REFUSED'], [{ groups: 'staff' }, 400, 'BAD_GROUPS'],
    [{ userName: '' }, 400, 'BAD_USER'], [{ page: { type: 'instance', id: task.id } }, 400, 'BAD_PAGE'], [{ page: { type: 'task', id: '../x' } }, 400, 'BAD_PAGE'],
    [{ returnTo: 'javascript:alert(1)' }, 400, 'BAD_RETURN'], [{ returnTo: '//evil.example/x' }, 400, 'BAD_RETURN'], [{ minutes: 60 }, 400, 'BAD_MINUTES'], [{ minutes: 0 }, 400, 'BAD_MINUTES'],
  ]) {
    const res = await service('POST', '/handoffs', { ...body, ...change });
    assert.equal(res.status, status, `${JSON.stringify(change)}: ${why(res)}`);
    assert.equal(res.body.error.code, code, JSON.stringify(change));
  }
});

test('the person opens the link: no sign-in, the task\'s form with no menu, and the link is not in the address after', async () => {
  const { task } = await startFor('cat');
  const { body: { url } } = await handoffFor('cat', task.id);
  const browser = new WebClient(web.base);          // nobody is signed in to this site
  const arrived = await browser.get(path(url));
  assert.equal(arrived.status, 302, why(arrived));
  assert.equal(arrived.location, `/embed/task/${task.id}`, 'the handoff is not left in the address');
  const page = await browser.get(arrived.location);
  assert.equal(page.status, 200, why(page));
  assert.match(page.text, /name="days"/, 'the form\'s fields');
  assert.match(page.text, /name="reason"/);
  assert.match(page.text, new RegExp(`action="/embed/task/${task.id}"`), 'it is completed here');
  assert.doesNotMatch(page.text, /Workbench|Sign out/, 'this server\'s menu is not in the way');
  // a page of the site is not opened by it
  for (const other of ['/dashboard', '/dashboard/admin', '/model/list', '/api/v3/me']) {
    const res = await browser.get(other);
    assert.ok([302, 401, 403].includes(res.status), `${other} is not opened by the handoff: ${res.status}`);
    assert.ok(res.status !== 302 || /login/.test(res.location), `${other} asks for a sign-in`);
  }
});

test('a handoff is spent by its first visit, and lapses', async () => {
  const { task } = await startFor('dan');
  const { body: { url } } = await handoffFor('dan', task.id);
  assert.equal((await new WebClient(web.base).get(path(url))).status, 302, 'the first visit');
  const again = await new WebClient(web.base).get(path(url));
  assert.equal(again.status, 403, 'a second visit, by anyone');
  assert.match(again.text, /used, or has expired/);
  // it lapses: a handoff for a few milliseconds
  const brief = await handoffFor('dan', task.id, { minutes: 0.00002 });
  assert.equal(brief.status, 201, why(brief));
  await new Promise(resolve => setTimeout(resolve, 300));
  assert.equal((await new WebClient(web.base).get(path(brief.body.url))).status, 403, 'after its time');
  // not for another task: the link names its task
  const other = await startFor('dan');
  const wrong = await handoffFor('dan', task.id);
  assert.equal((await new WebClient(web.base).get(path(wrong.body.url).replace(task.id, other.task.id))).status, 403, 'the link is for one page');
  assert.equal((await new WebClient(web.base).get('/embed/task/not-a-handoff?handoff=bph_nonsense')).status, 403);
});

test('the form is completed as that person: its rules apply, and then they go where the application said', async () => {
  const { task, instanceId, token } = await startFor('eve');
  const { body: { url } } = await handoffFor('eve', task.id);
  const browser = new WebClient(web.base);
  await browser.get(path(url));
  await browser.get(`/embed/task/${task.id}`);                                       // the page, for its CSRF token
  // a rule broken: refused, and the task still waits
  const refused = await browser.post(`/embed/task/${task.id}`, { days: '90', reason: 'too long' });
  assert.ok(refused.status >= 400 && refused.status < 500, `refused: ${why(refused)}`);
  const waiting = await asUser(token, 'GET', `/tasks/${task.id}`);
  assert.equal(waiting.status, 200);
  assert.equal(waiting.body.status, 'wait', 'still waiting');
  // right: done, and sent back to the application
  const done = await browser.post(`/embed/task/${task.id}`, { days: '3', reason: 'family' });
  assert.equal(done.status, 302, why(done));
  assert.equal(done.location, 'http://app.example/hr/');
  const instance = await asUser(token, 'GET', `/instances/${instanceId}`);
  assert.equal(instance.body.instance?.status ?? instance.body.status, 'end', 'the case went on');
  assert.equal(instance.body.instance?.data?.days ?? instance.body.data?.days, '3', 'with what was entered');
  // the session was for that task: it is over
  assert.equal((await browser.get(`/embed/task/${task.id}`)).status, 401);
});

test('another person\'s task is not opened by a handoff for someone else; and without a handoff nothing opens', async () => {
  const mine = await startFor('fay');
  const theirs = await startFor('gus');
  const { body: { url } } = await handoffFor('fay', theirs.task.id);
  const browser = new WebClient(web.base);
  await browser.get(path(url));
  const page = await browser.get(`/embed/task/${theirs.task.id}`);
  assert.equal(page.status, 403, 'gus\'s task, as fay: refused by the case\'s own rules');
  assert.equal((await browser.get(`/embed/task/${mine.task.id}`)).status, 401, 'a task the session is not for');
  assert.equal((await new WebClient(web.base).get(`/embed/task/${mine.task.id}`)).status, 401, 'no handoff, no session');
  // a change with no session at all is turned away before it is read (the CSRF check), or by the page's own session check
  assert.ok([401, 403].includes((await new WebClient(web.base).post(`/embed/task/${mine.task.id}`, { days: '1' })).status));
  assert.ok([401, 403].includes((await new WebClient(web.base).request('POST', `/embed/choices/task/${mine.task.id}/days`, { json: {} })).status), 'nor its choices');
  assert.equal((await asUser(mine.token, 'GET', `/tasks/${mine.task.id}`)).body.status, 'wait', 'and the task is as it was');
});

test('a task that has a form of the application\'s own is the application\'s to open', async () => {
  const token = await tokenFor('hal', ['staff']);
  const own = 'handoff-own-form';
  await web.bpmnServer.models.save(own, XML.replace('HandoffLeave', 'HandoffOwn').replace('<bpmn:userTask id="Request"', '<bpmn:userTask id="Request" camunda:formKey="/forms/leave"'));
  const started = await asUser(token, 'POST', `/processes/${own}/start`, { data: { requester: 'hal' } });
  assert.equal(started.status, 201, why(started));
  const task = (await asUser(token, 'GET', '/tasks')).body.items.find(t => t.instanceId === started.body.instance.id);
  const { body: { url } } = await handoffFor('hal', task.id);
  const browser = new WebClient(web.base);
  await browser.get(path(url));
  assert.equal((await browser.get(`/embed/task/${task.id}`)).status, 409);
});
