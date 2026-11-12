// @features: assignment-policies
// Assignment policies in the editor (docs/docs/assignment-policies.md): the policies listed, a new one offered as a
// FIRST table with the assignment's outputs, saved in policies/assignment/, previewed with data, and tested as a decision is.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { startWebApp, why } from '../support/webApp.mjs';

const POLICY = `<?xml version="1.0" encoding="UTF-8"?>
<definitions xmlns="https://www.omg.org/spec/DMN/20191111/MODEL/" id="d" name="Approval">
  <decision id="Approval" name="Approval">
    <decisionTable hitPolicy="FIRST">
      <input id="i1" label="amount"><inputExpression typeRef="number"><text>amount</text></inputExpression></input>
      <output id="o1" name="assignee" typeRef="string" />
      <output id="o2" name="candidateGroups" typeRef="string" />
      <rule id="r1"><inputEntry id="e1"><text>&gt; 10000</text></inputEntry><outputEntry id="a1"><text></text></outputEntry><outputEntry id="g1"><text>"Director"</text></outputEntry></rule>
      <rule id="r2"><inputEntry id="e2"><text>&gt; 100</text></inputEntry><outputEntry id="a2"><text>$(appServices.managerOf(data.requesterId))</text></outputEntry><outputEntry id="g2"><text></text></outputEntry></rule>
    </decisionTable>
  </decision>
</definitions>`;

let web, designer;
test.before(async () => {
    web = await startWebApp();
    designer = await web.login('designer');
});
test.after(async () => { await web?.stop(); setImmediate(() => process.exit(0)); });

test('a new policy: offered as a FIRST table with the assignment outputs; saved in policies/assignment/; listed', async () => {
    const page = await designer.get('/model/policy/Approval');
    assert.equal(page.status, 200, why(page));
    assert.match(page.text, /policies\/assignment\/Approval\.dmn\.xml/);
    assert.match(page.text, /Assignment policy editor/);
    assert.match(page.text, /hitPolicy=\\"FIRST\\"/);
    assert.match(page.text, /name=\\"candidateGroups\\"/);

    const saved = await designer.request('POST', '/model/policy/Approval', { json: { xml: POLICY } });
    assert.equal(saved.status, 200, why(saved));
    assert.ok(fs.existsSync(path.join(web.definitionsPath, 'policies', 'assignment', 'Approval.dmn.xml')));
    const listed = await designer.get('/model/policies');
    assert.deepEqual(listed.body.policies.map(p => p.name), ['Approval']);
    assert.equal((await designer.get('/model/decisions')).body.decisions.some(d => d.name === 'Approval'), false, 'not a business rule');
    assert.equal((await designer.request('POST', '/model/policy/..%2Fx', { json: { xml: POLICY } })).status, 400);
});

test('the preview: the rule that matches, its outputs (an expression as written), or none', async () => {
    const preview = data => designer.request('POST', '/model/policy/Approval/preview', { json: { data } });
    assert.deepEqual((await preview({ amount: 20000 })).body, { rule: 1, outputs: { candidateGroups: 'Director' }, expressions: [] });
    assert.deepEqual((await preview({ amount: 500 })).body,
        { rule: 2, outputs: { assignee: '$(appServices.managerOf(data.requesterId))' }, expressions: ['assignee'] });
    assert.deepEqual((await preview({ amount: 5 })).body, { rule: null, outputs: null, expressions: [] });
    assert.equal((await designer.request('POST', '/model/policy/NoSuch/preview', { json: { data: {} } })).status, 404);
});

test("a policy's tests: saved, and run on its file", async () => {
    const tests = [
        { name: 'big', data: { amount: 20000 }, checks: [{ kind: 'output', path: 'candidateGroups', op: '=', value: 'Director' }] },
        { name: 'manager', data: { amount: 500 }, checks: [{ kind: 'output', path: 'assignee', op: '=', value: '$(appServices.managerOf(data.requesterId))' }] },
    ];
    const saved = await designer.request('PUT', '/model/policy/Approval/tests', { json: { tests } });
    assert.equal(saved.status, 200, why(saved));
    assert.deepEqual((await designer.get('/model/policy/Approval/tests')).body.tests.map(t => t.name), ['big', 'manager']);
    const run = await designer.request('POST', '/model/policy/Approval/tests/run', { json: {} });
    assert.equal(run.status, 200, why(run));
    assert.ok(run.body.results.every(r => r.ok), JSON.stringify(run.body.results));
    assert.ok(!fs.existsSync(path.join(web.definitionsPath, 'policies', 'Approval.policy.dmn.feature')), "its tests sit with the decisions' tests");
});

test('the roles, on the Administration page: added, listed with where they are used and their users, removed; admins only', async () => {
    const admin = await web.login('admin');
    const rolesFile = path.join(web.definitionsPath, 'roles.json');
    fs.rmSync(rolesFile, { force: true });
    fs.writeFileSync(path.join(web.definitionsPath, 'Roles-model.bpmn'), `<?xml version="1.0" encoding="UTF-8"?>
<bpmn:definitions xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" id="d" targetNamespace="urn:test">
  <bpmn:process id="P" isExecutable="true"><bpmn:laneSet id="ls"><bpmn:lane id="L" name="Approvers" /></bpmn:laneSet><bpmn:startEvent id="S" /></bpmn:process>
</bpmn:definitions>`);
    const section = html => html.slice(html.indexOf('id="roles"'), html.indexOf('id="connectors"'));

    let page = section((await admin.get('/dashboard/admin')).text);
    assert.match(page, /No roles\.json yet/);
    assert.match(page, /Used, not listed[\s\S]*Approvers[\s\S]*Roles-model: lane/, 'a lane offered');
    assert.match(page, /Director[\s\S]*policy Approval, rule 1/, "a policy's group offered");

    const add = name => admin.post('/dashboard/admin/roles', { name });
    assert.equal((await add('Approvers')).status, 302);
    await add('Director');
    await add('manager');
    assert.deepEqual(JSON.parse(fs.readFileSync(rolesFile, 'utf8')), ['Approvers', 'Director', 'manager']);
    page = section((await admin.get('/dashboard/admin')).text);
    assert.match(page, /<td>Approvers<\/td><td>Roles-model: lane<\/td>/);
    assert.match(page, /<td>manager<\/td><td><span class="dash-muted">not used yet<\/span><\/td><td>\d+<\/td>/, "the users in the group");
    assert.doesNotMatch(page, /Used, not listed/);

    const refused = await add('A, B');
    assert.match(decodeURIComponent(refused.location), /not a role name/);
    assert.match(decodeURIComponent((await add('Director')).location), /a role already/);

    const removed = await admin.post('/dashboard/admin/roles/delete', { name: 'Approvers' });
    assert.match(decodeURIComponent(removed.location), /Role 'Approvers' removed\. It is still used \(Roles-model: lane\)/);
    assert.deepEqual(JSON.parse(fs.readFileSync(rolesFile, 'utf8')), ['Director', 'manager']);

    // a designer is not an administrator
    const before = fs.readFileSync(rolesFile, 'utf8');
    await designer.post('/dashboard/admin/roles', { name: 'Hacker' });
    assert.equal(fs.readFileSync(rolesFile, 'utf8'), before);
});
