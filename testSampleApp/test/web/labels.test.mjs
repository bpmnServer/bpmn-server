// @features: labels
// Labels in the pages (docs/design/labels.md): each case's and task's label, filled in from its model when the page
// is shown: the Instances and Pending Tasks lists, My work, and the instance page; and the lists' filter by label.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { startWebApp } from '../support/webApp.mjs';

const MODEL = 'Claim';
const SOURCE = `<?xml version="1.0" encoding="UTF-8"?>
<bpmn:definitions xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:camunda="http://camunda.org/schema/1.0/bpmn"
    id="D_Claim" targetNamespace="http://bpmn.io/schema/bpmn">
  <bpmn:process id="Claim" isExecutable="true" camunda:label="Client: \${Client = data.clientId} · Order: \${Order = data.orderNo}">
    <bpmn:startEvent id="S"><bpmn:outgoing>f1</bpmn:outgoing></bpmn:startEvent>
    <bpmn:userTask id="Approve" name="Approve" camunda:candidateGroups="manager"
        camunda:label="Amount: \${Amount = data.amount}" camunda:endLabel="Approved by \${completedBy}">
      <bpmn:incoming>f1</bpmn:incoming><bpmn:outgoing>f2</bpmn:outgoing></bpmn:userTask>
    <bpmn:userTask id="Pay" name="Pay" camunda:candidateGroups="manager"><bpmn:incoming>f2</bpmn:incoming><bpmn:outgoing>f3</bpmn:outgoing></bpmn:userTask>
    <bpmn:endEvent id="E"><bpmn:incoming>f3</bpmn:incoming></bpmn:endEvent>
    <bpmn:sequenceFlow id="f1" sourceRef="S" targetRef="Approve" /><bpmn:sequenceFlow id="f2" sourceRef="Approve" targetRef="Pay" />
    <bpmn:sequenceFlow id="f3" sourceRef="Pay" targetRef="E" />
  </bpmn:process>
</bpmn:definitions>`;

let web, manager, admin, instanceId;
test.before(async () => {
    web = await startWebApp();
    fs.writeFileSync(path.join(web.definitionsPath, MODEL + '.bpmn'), SOURCE);
    [manager, admin] = await Promise.all([web.login('manager'), web.login('admin')]);
    instanceId = (await web.bpmnServer.engine.start(MODEL, { clientId: 'abc', orderNo: 1234, amount: 240 }, null, 'staff')).id;
    await web.bpmnServer.engine.start(MODEL, { clientId: 'zeta', orderNo: 77, amount: 10 }, null, 'staff');
});
test.after(async () => { await web?.stop(); setImmediate(() => process.exit(0)); });

test("the lists: each case's label, and each task's with its case's", async () => {
    const home = (await admin.get('/')).text;
    assert.match(home, /<td>Claim<\/td>\s*<td>Client: abc · Order: 1234<\/td>\s*<td>[^<]*<\/td>/, 'Name, Case, Case Id');
    assert.match(home, /<td>Case<\/td>/);
    assert.match(home, /<th>Label<\/th>/);
    assert.match(home, /<td>Amount: 240 — Client: abc · Order: 1234<\/td>/, "the task's own label, then its case's");
});

test("My work: a task's own label under its name, its case's in the Case column", async () => {
    const mine = (await manager.get('/dashboard')).text;
    assert.match(mine, /<th>Task<\/th>\s*<th>Case<\/th>\s*<th>Process<\/th>/);
    assert.match(mine, /Approve<\/a>\s*<div class="task-label">Amount: 240<\/div><\/td>\s*<td>Client: abc · Order: 1234<\/td>\s*<td>Claim<\/td>/);
});

test('the filter by label: the bar offers the named values; Instances and My work show what it finds', async () => {
    const home = (await admin.get('/')).text;
    assert.match(home, /<form class="label-filter"/);
    assert.match(home, /<option value="Client" title="Claim: data.clientId">Client<\/option>/);
    // on the Workbench the bar is in the Instances section, and filters that section only
    const instancesOf = html => html.slice(html.indexOf('id="instances"'));
    const tasksOf = html => html.slice(html.indexOf('id="tasks"'), html.indexOf('id="instances"'));
    assert.match(tasksOf(home), /<form class="label-filter"/);
    assert.match(instancesOf(home), /<form class="label-filter"/);
    assert.equal((home.match(/<form class="label-filter"/g) ?? []).length, 2, "a bar for each list");
    const filtered = (await admin.get('/?field=Client&op=contains&value=ZET')).text;
    assert.match(instancesOf(filtered), /Client: zeta · Order: 77/);
    assert.doesNotMatch(instancesOf(filtered), /Client: abc · Order: 1234/, 'the other case left out');
    assert.match(tasksOf(filtered), /Client: abc · Order: 1234/, 'Pending Tasks not filtered');
    assert.match(filtered, /× Clear/);
    assert.match(instancesOf((await admin.get('/?search=1234')).text), /Client: abc · Order: 1234/, 'search everything, a number');
    assert.match(instancesOf((await admin.get('/?search=no-such-value')).text), /No instances match this filter/);

    // Pending Tasks' own filter: only that list
    const tasksFiltered = (await admin.get('/?task_field=Client&task_op=contains&task_value=ZET')).text;
    assert.match(tasksOf(tasksFiltered), /Amount: 10 — Client: zeta · Order: 77/);
    assert.doesNotMatch(tasksOf(tasksFiltered), /Client: abc · Order: 1234/, 'the other task left out');
    assert.match(instancesOf(tasksFiltered), /Client: abc · Order: 1234/, 'Instances not filtered');
    assert.match(tasksOf((await admin.get('/?task_search=no-such-value')).text), /No pending tasks match this filter/);

    // both at once; each bar keeps the other's filter, and clearing one keeps the other
    const both = (await admin.get('/?field=Client&value=abc&task_field=Client&task_value=zeta')).text;
    assert.doesNotMatch(tasksOf(both), /Client: abc · Order: 1234/);
    assert.doesNotMatch(instancesOf(both), /Client: zeta · Order: 77/);
    assert.match(tasksOf(both), /<input type="hidden" name="value" value="abc"/, "the tasks' bar keeps the instances' filter");
    assert.match(instancesOf(both), /<input type="hidden" name="task_value" value="zeta"/, "the instances' bar keeps the tasks' filter");
    assert.match(tasksOf(both), /href="\/\?[^"#]*field=Client[^"#]*#tasks"[^>]*>× Clear/);
    const mine = (await manager.get('/dashboard?field=Order&op=is&value=77')).text;
    assert.match(mine, /Client: zeta · Order: 77/);
    assert.doesNotMatch(mine, /Client: abc · Order: 1234/);
});

test("the instance page: the case's label, and an ended task's end label under its name", async () => {
    await web.bpmnServer.engine.invoke({ id: instanceId, 'items.elementId': 'Approve' }, {}, 'manager');
    const page = (await admin.get(`/instanceDetails?id=${instanceId}`)).text;
    assert.match(page, /class="instance-subtitle">Client: abc · Order: 1234 · Claim</);
    assert.match(page, /Approve\s*<div class="item-label">Approved by manager<\/div>/);
    assert.doesNotMatch(page, /Pay\s*<div class="item-label">/, 'a task with no label of its own: none');
    const [stored] = await web.bpmnServer.dataStore.findInstances({ id: instanceId }, 'full');
    assert.equal(stored.label, undefined, 'nothing stored');
});
