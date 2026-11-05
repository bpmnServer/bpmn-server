// @features: labels
// Labels in the pages (docs/design/labels.md): each case's and task's label, filled in from its model when the page
// is shown: the Instances and Pending Tasks lists, My work, and the instance page.
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
});
test.after(async () => { await web?.stop(); setImmediate(() => process.exit(0)); });

test("the lists: each case's label, and each task's with its case's", async () => {
    const home = (await admin.get('/')).text;
    assert.match(home, /<td>Claim<\/td>\s*<td>Client: abc · Order: 1234<\/td>\s*<td>[^<]*<\/td>/, 'Name, Case, Case Id');
    assert.match(home, /<td>Case<\/td>/);
    assert.match(home, /<th>Label<\/th>/);
    assert.match(home, /<td>Amount: 240 — Client: abc · Order: 1234<\/td>/, "the task's own label, then its case's");
});

test("My work: what each task is for, under its name", async () => {
    const mine = (await manager.get('/dashboard')).text;
    assert.match(mine, /Approve<\/a>\s*<div class="task-label">Amount: 240 — Client: abc · Order: 1234<\/div>/);
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
