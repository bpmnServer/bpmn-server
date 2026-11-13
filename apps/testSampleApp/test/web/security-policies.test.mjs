// @features: security-policies
// Security policies through API v3 and the pages (docs/design/security-policies.md, routes/caseAccess.ts): the models
// folder's policies/security/default.dmn.xml decides who sees a case, which of its data, and who may complete its tasks.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { startWebApp, why, WebClient, API_KEY } from '../support/webApp.mjs';

const POLICY = `<?xml version="1.0" encoding="UTF-8"?>
<definitions xmlns="https://www.omg.org/spec/DMN/20191111/MODEL/" id="d" name="default" namespace="t">
  <decision id="default" name="Leave cases"><decisionTable id="t" hitPolicy="COLLECT">
    <input id="i1" label="initiator"><inputExpression id="e1" typeRef="string"><text>actors.initiator</text></inputExpression></input>
    <input id="i2" label="groups"><inputExpression id="e2" typeRef="string"><text>user.userGroups</text></inputExpression></input>
    <input id="i3" label="task"><inputExpression id="e3" typeRef="string"><text>task</text></inputExpression></input>
    <output id="o1" name="see" typeRef="string" /><output id="o2" name="data" typeRef="string" /><output id="o3" name="complete" typeRef="string" /><output id="o4" name="assign" typeRef="string" />
    <rule id="r1"><description>whoever asked: their case, what the forms entered</description>
      <inputEntry id="a1"><text>user.userName</text></inputEntry><inputEntry id="a2"><text>-</text></inputEntry><inputEntry id="a3"><text>-</text></inputEntry>
      <outputEntry id="a4"><text>"full"</text></outputEntry><outputEntry id="a5"><text>"forms"</text></outputEntry><outputEntry id="a6"><text></text></outputEntry><outputEntry id="a7"><text></text></outputEntry></rule>
    <rule id="r2"><description>managers: every case, all of it</description>
      <inputEntry id="b1"><text>-</text></inputEntry><inputEntry id="b2"><text>"manager"</text></inputEntry><inputEntry id="b3"><text>-</text></inputEntry>
      <outputEntry id="b4"><text>"full"</text></outputEntry><outputEntry id="b5"><text>"all"</text></outputEntry><outputEntry id="b6"><text></text></outputEntry><outputEntry id="b7"><text></text></outputEntry></rule>
    <rule id="r3"><description>separation of duties: not your own approval, nor giving it to someone else</description>
      <inputEntry id="c1"><text>user.userName</text></inputEntry><inputEntry id="c2"><text>-</text></inputEntry><inputEntry id="c3"><text>"Approve"</text></inputEntry>
      <outputEntry id="c4"><text></text></outputEntry><outputEntry id="c5"><text></text></outputEntry><outputEntry id="c6"><text>"deny"</text></outputEntry><outputEntry id="c7"><text>"deny"</text></outputEntry></rule>
  </decisionTable></decision>
</definitions>`;

let web, sam, olga, mona, samsCase, monasCase;
const v3 = (method, url, token, body) => new WebClient(web.base).request(method, '/api/v3' + url, {
  json: body, headers: token === 'service' ? { 'x-api-key': API_KEY } : { authorization: `Bearer ${token}` },
});
async function tokenFor(userName, groups) {
  const res = await v3('POST', '/tokens', 'service', { userName, groups });
  assert.equal(res.status, 201, why(res));
  return res.body.token;
}
/** A long leave (to the manager's Approve), asked by this person: its id. */
async function askLeave(token) {
  const started = await v3('POST', '/processes/leave-request/start', token, { data: { note: 'not from a form' } });
  assert.equal(started.status, 201, why(started));
  const done = await v3('POST', `/tasks/${started.body.task.id}/complete`, token, { data: { days: 10, reason: 'holiday' } });
  assert.equal(done.status, 200, why(done));
  return started.body.instance.id;
}

test.before(async () => {
  web = await startWebApp();
  fs.mkdirSync(path.join(web.definitionsPath, 'policies', 'security'), { recursive: true });
  fs.writeFileSync(path.join(web.definitionsPath, 'policies', 'security', 'default.dmn.xml'), POLICY);
  [sam, olga, mona] = await Promise.all([tokenFor('sam', ['staff']), tokenFor('olga', ['staff']), tokenFor('mona', ['manager', 'staff'])]);
  samsCase = await askLeave(sam);
  monasCase = await askLeave(mona);
});
test.after(async () => { await web?.stop(); setImmediate(() => process.exit(0)); });

test('whoever asked sees their case, and only what the forms entered; another person does not see it at all', async () => {
  const own = await v3('GET', `/instances/${samsCase}`, sam);
  assert.equal(own.status, 200, why(own));
  assert.equal(own.body.data.days, 10, 'entered on a form');
  assert.equal(own.body.data.note, undefined, 'not entered on a form');
  assert.ok((await v3('GET', '/instances', sam)).body.items.some(i => i.id === samsCase));

  assert.equal((await v3('GET', `/instances/${samsCase}`, olga)).status, 404, 'the same 404 as no such case');
  assert.equal((await v3('GET', `/instances/${samsCase}/rationale`, olga)).status, 404);
  assert.ok(!(await v3('GET', '/instances', olga)).body.items.some(i => i.id === samsCase), 'not in her list');
});

test('a manager sees every case and all its data, and approves another\'s leave', async () => {
  const seen = await v3('GET', `/instances/${samsCase}`, mona);
  assert.equal(seen.status, 200, why(seen));
  assert.equal(seen.body.data.note, 'not from a form', 'all of it');
  const tasks = (await v3('GET', '/tasks', mona)).body.items;
  const approve = tasks.find(t => t.instanceId === samsCase && t.elementId === 'Approve');
  assert.ok(approve, 'Sam\'s Approve is hers to do');
  const done = await v3('POST', `/tasks/${approve.id}/complete`, mona, { data: { approved: true } });
  assert.equal(done.status, 200, why(done));
});

test('separation of duties: a manager may not approve her own leave; the rule that denied it is said', async () => {
  const tasks = (await v3('GET', '/tasks', mona)).body.items;
  assert.ok(!tasks.some(t => t.instanceId === monasCase && t.elementId === 'Approve'), 'not in her tasks');
  const [item] = (await v3('GET', `/instances/${monasCase}`, mona)).body.items.filter(i => i.elementId === 'Approve' && i.status === 'wait');
  const refused = await v3('POST', `/tasks/${item.id}/complete`, mona, { data: { approved: true } });
  assert.equal(refused.status, 403, why(refused));
  assert.equal(refused.body.error.code, 'POLICY_DENIED');
  assert.match(refused.body.error.message, /complete: policy default, rule 3/);
  const claim = await v3('POST', `/tasks/${item.id}/claim`, mona);
  assert.equal(claim.status, 403, 'a task she may not complete is not hers to take either');
  assert.equal(claim.body.error.code, 'POLICY_DENIED');
});

test('restart without a rule that allows it: refused, for the one who asked too', async () => {
  const { body } = await v3('GET', `/instances/${samsCase}`, sam);
  const refused = await v3('POST', `/instances/${samsCase}/restart`, sam, { itemId: body.items[0].id });
  assert.equal(refused.status, 403, why(refused));
  assert.equal(refused.body.error.code, 'POLICY_DENIED');
});

test('the pages: the instance page is for those the policy shows it to; an administrator is not asked', async () => {
  const designer = await web.login('designer');
  assert.equal((await designer.get(`/instanceDetails?id=${samsCase}`)).status, 403, 'no rule shows it to a designer here');
  const manager = await web.login('manager');
  assert.equal((await manager.get(`/instanceDetails?id=${samsCase}`)).status, 200);
  const admin = await web.login('admin');
  assert.equal((await admin.get(`/instanceDetails?id=${monasCase}`)).status, 200);
});

test('giving a task to someone else is a policy action too: whoever asked may not give their own approval away; another manager may; a date is not who', async () => {
    const managersCase = await askLeave(await tokenFor('manager', ['manager', 'staff']));
    const waitingApprove = async () => (await web.bpmnServer.dataStore.findItems({ id: managersCase, 'items.elementId': 'Approve', 'items.status': 'wait' }))[0];
    const approve = await waitingApprove();
    const manager = await web.login('manager');
    assert.equal((await manager.get(`/assign?id=${approve.id}&processName=leave-request&elementId=Approve`)).status, 200, 'the form (and its token)');
    const form = { itemId: approve.id, assignee: 'olga', candidateUsers: '', candidateGroups: 'manager', dueDate: '', followUpDate: '', priority: '' };
    const refused = await manager.post('/assign', form);
    assert.equal(refused.status, 403, why(refused));
    assert.match(refused.text, /assign: policy default, rule 3/);
    assert.equal((await waitingApprove()).assignee ?? null, null, 'as it was');

    // the operations the older APIs call: the same rule, for whoever asks
    const { CaseAccess } = await import(new URL('../../../../packages/bpmn-web/dist/routes/caseAccess.js', import.meta.url).href);
    const access = new CaseAccess(web.bpmnServer);
    const person = (userName, userGroups) => ({ userName, userGroups, isAdmin: () => false });
    await assert.rejects(access.requireAssignment(person('manager', ['manager', 'staff']), { 'items.id': approve.id }, { assignee: 'olga' }), { code: 'POLICY_DENIED' });
    await access.requireAssignment(person('mona', ['manager', 'staff']), { 'items.id': approve.id }, { assignee: 'olga' });
    await access.requireAssignment(person('manager', ['manager', 'staff']), { 'items.id': approve.id }, { dueDate: '2030-01-01' });
    await access.requireAssignment({ ...person('admin', ['admin']), isAdmin: () => true }, { 'items.id': approve.id }, { assignee: 'olga' });
});

test('who may do what with a case: under the Rationale on the instance page, and API v3\'s access (administrators); each task\'s assignment, after the fact', async () => {
    // the instance page, as an administrator: the case's policy asked for each person and role
    const admin = await web.login('admin');
    const page = (await admin.get(`/instanceDetails?id=${samsCase}`)).text;
    assert.match(page, /<h2 id="access-heading">Assignment and access<\/h2>/);
    assert.ok(page.indexOf('id="access-heading"') > page.indexOf('id="rationale-heading"'), 'under the Rationale');
    const row = (table, who) => (new RegExp(`<tr data-who="${who}"[^>]*>([^]*?)</tr>`).exec(table) ?? [])[1] ?? '';
    const caseTable = /<table class="instance-table access-table" id="access-case">([^]*?)<\/table>/.exec(page)?.[1] ?? '';
    assert.match(row(caseTable, 'sam'), /started it[^]*full[^]*what forms entered/, 'sam asked: he sees it, what forms entered');
    assert.match(row(caseTable, 'anyone else'), /<td>—<\/td>/, 'anyone else: not seen');
    // Approve, done by mona earlier: its assignment after the fact
    const approve = /<div class="access-task" data-element="Approve"[^>]*>([^]*?)(?=<div class="access-task"|<\/section>)/.exec(page)?.[1] ?? '';
    assert.match(approve, /Offered to: manager/);
    assert.match(approve, /Completed by: mona/);

    // the API: the same, administrators only
    // the service account (its API key) is an administrator; a person's token never is
    const res = await v3('GET', `/instances/${monasCase}/access`, 'service');
    assert.equal(res.status, 200, why(res));
    assert.equal(res.body.on, true);
    const waitingApprove = res.body.tasks.find(t => t.elementId === 'Approve' && t.status === 'wait');
    // mona (a token, not in the user directory): asked with no groups, and said so; her own leave's approval, denied
    const mona = waitingApprove.who.find(w => w.who.label === 'mona');
    assert.match(mona.who.because, /started it, completed Submit request, groups unknown \(not in the user directory\)/);
    assert.deepEqual([mona.complete, mona.claim], [false, false]);
    assert.match(mona.rules, /default 3/, 'rule 3: she asked for it');
    const managers = waitingApprove.who.find(w => w.who.label === 'manager' && w.who.kind === 'role');
    assert.equal(managers.complete, true, 'any other manager may');
    assert.equal((await v3('GET', `/instances/${monasCase}/access`, sam)).status, 403);
});
