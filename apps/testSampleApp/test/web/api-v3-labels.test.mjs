// @features: labels
// Labels in API v3 (docs/design/labels.md, phase 3): each task and instance it answers carries its label, filled in
// from its case's own model when answered (nothing stored), and its lists take the pages' filter by label.
import test from 'node:test';
import assert from 'node:assert/strict';
import { startWebApp, why, WebClient, API_KEY } from '../support/webApp.mjs';

const MODEL = 'v3-claim';
const SOURCE = (caseLabel = 'Client: ${Client = data.clientId} · Order: ${Order = data.orderNo}') => `<?xml version="1.0" encoding="UTF-8"?>
<bpmn:definitions xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:camunda="http://camunda.org/schema/1.0/bpmn"
    id="D_V3Claim" targetNamespace="http://bpmn.io/schema/bpmn">
  <bpmn:process id="V3Claim" isExecutable="true" camunda:label="${caseLabel}">
    <bpmn:startEvent id="S"><bpmn:outgoing>f1</bpmn:outgoing></bpmn:startEvent>
    <bpmn:userTask id="Approve" name="Approve" camunda:label="Amount: \${Amount = data.amount}" camunda:endLabel="Approved by \${completedBy}">
      <bpmn:incoming>f1</bpmn:incoming><bpmn:outgoing>f2</bpmn:outgoing></bpmn:userTask>
    <bpmn:userTask id="Pay" name="Pay"><bpmn:incoming>f2</bpmn:incoming><bpmn:outgoing>f3</bpmn:outgoing></bpmn:userTask>
    <bpmn:endEvent id="E"><bpmn:incoming>f3</bpmn:incoming></bpmn:endEvent>
    <bpmn:sequenceFlow id="f1" sourceRef="S" targetRef="Approve" /><bpmn:sequenceFlow id="f2" sourceRef="Approve" targetRef="Pay" />
    <bpmn:sequenceFlow id="f3" sourceRef="Pay" targetRef="E" />
  </bpmn:process>
</bpmn:definitions>`;

let web, ann, abc, zeta;
const v3 = (method, url, token, body) => new WebClient(web.base).request(method, '/api/v3' + url, {
    json: body, headers: { authorization: `Bearer ${token}` },
});
const ofModel = items => items.filter(i => (i.processName ?? i.name) === MODEL);

test.before(async () => {
    web = await startWebApp();
    await web.bpmnServer.definitions.save(MODEL, SOURCE());
    const issued = await new WebClient(web.base).request('POST', '/api/v3/tokens', { json: { userName: 'ann', groups: ['staff'] }, headers: { 'x-api-key': API_KEY } });
    assert.equal(issued.status, 201, why(issued));
    ann = issued.body.token;
    const started = await v3('POST', `/processes/${MODEL}/start`, ann, { data: { clientId: 'abc', orderNo: 1234, amount: 240 } });
    assert.equal(started.status, 201, why(started));
    abc = started.body;
    zeta = (await v3('POST', `/processes/${MODEL}/start`, ann, { data: { clientId: 'zeta', orderNo: 77, amount: 10 } })).body;
});
test.after(async () => { await web?.stop(); setImmediate(() => process.exit(0)); });

test("a start answers the instance's label and its first task's", () => {
    assert.equal(abc.instance.label, 'Client: abc · Order: 1234');
    assert.deepEqual(abc.instance.labelValues, [{ name: 'Client', path: 'data.clientId', value: 'abc' }, { name: 'Order', path: 'data.orderNo', value: 1234 }]);
    assert.equal(abc.task.label, 'Amount: 240 — Client: abc · Order: 1234', "its own label, then its case's");
    assert.equal(abc.task.caseLabel, 'Client: abc · Order: 1234');
    assert.deepEqual(abc.task.labelValues, [{ name: 'Amount', path: 'data.amount', value: 240 }]);
    assert.equal(abc.task.ownLabel, undefined, 'not an answer field');
});

test('tasks: the list, one task, a claim, each labeled', async () => {
    const listed = await v3('GET', `/tasks?model=${MODEL}`, ann);
    assert.equal(listed.status, 200, why(listed));
    assert.deepEqual(ofModel(listed.body.items).map(t => t.caseLabel).sort(), ['Client: abc · Order: 1234', 'Client: zeta · Order: 77']);
    const one = await v3('GET', `/tasks/${abc.task.id}`, ann);
    assert.equal(one.body.label, 'Amount: 240 — Client: abc · Order: 1234');
    assert.ok(Array.isArray(one.body.form.fields), 'still with its form');
    const claimed = await v3('POST', `/tasks/${abc.task.id}/claim`, ann);
    assert.equal(claimed.body.task.caseLabel, 'Client: abc · Order: 1234');
});

test("the task list's filter by label: a named value, is or contains, a search, a model", async () => {
    const ids = async query => ofModel((await v3('GET', `/tasks?${query}`, ann)).body.items).map(t => t.caseLabel);
    assert.deepEqual(await ids('field=Client&value=ZET'), ['Client: zeta · Order: 77'], 'contains, any case');
    assert.deepEqual(await ids('field=Order&op=is&value=1234'), ['Client: abc · Order: 1234'], 'is, a number');
    assert.deepEqual(await ids('search=77'), ['Client: zeta · Order: 77']);
    assert.deepEqual(await ids(`model=${MODEL}&field=NoSuchName&value=x`), [], 'a name the model does not have');
    assert.equal((await v3('GET', '/tasks?model=no-such-model', ann)).body.items.length, 0);
    const bad = await v3('GET', '/tasks?field=Client&op=like&value=a', ann);
    assert.equal(bad.status, 400);
    assert.equal(bad.body.error.code, 'BAD_FILTER');
});

test('instances: the list and one instance, labeled, with their items; the same filter', async () => {
    const listed = await v3('GET', `/instances?name=${MODEL}`, ann);
    assert.equal(listed.status, 200, why(listed));
    assert.deepEqual(listed.body.items.map(i => i.label).sort(), ['Client: abc · Order: 1234', 'Client: zeta · Order: 77']);
    const filtered = await v3('GET', `/instances?name=${MODEL}&field=Client&op=is&value=abc`, ann);
    assert.deepEqual(filtered.body.items.map(i => i.id), [abc.instance.id]);
    assert.equal((await v3('GET', `/instances?search=no-such-value`, ann)).body.items.length, 0);
    assert.equal((await v3('GET', '/instances?op=like&search=a', ann)).body.error.code, 'BAD_FILTER');

    const one = await v3('GET', `/instances/${abc.instance.id}`, ann);
    assert.equal(one.body.label, 'Client: abc · Order: 1234');
    assert.equal(one.body.items.find(i => i.elementId === 'Approve').label, 'Amount: 240');
    assert.equal(one.body.items.find(i => i.elementId === 'S').label, undefined, 'no label of its own: none');
});

test("a completion answers the ended task's end label; completed tasks filter too; nothing is stored", async () => {
    const done = await v3('POST', `/tasks/${abc.task.id}/complete`, ann, { data: {} });
    assert.equal(done.status, 200, why(done));
    assert.equal(done.body.task.label, 'Approved by ann — Client: abc · Order: 1234');
    assert.equal(done.body.instance.label, 'Client: abc · Order: 1234');
    const completed = await v3('GET', '/tasks?status=completed&field=Client&value=abc', ann);
    assert.deepEqual(ofModel(completed.body.items).map(t => t.label), ['Approved by ann — Client: abc · Order: 1234']);
    assert.equal(ofModel((await v3('GET', '/tasks?status=completed&field=Client&value=zeta', ann)).body.items).length, 0);

    const [stored] = await web.bpmnServer.dataStore.findInstances({ id: abc.instance.id }, 'full');
    assert.equal(stored.label, undefined, 'not stored');
    assert.ok(stored.items.every(i => i.label === undefined));
});

test("a case's label follows the model it runs: its own with SAVE_SOURCE, else the current one", async () => {
    const ds = web.bpmnServer.dataStore, saveSource = ds.saveSource;
    ds.saveSource = true;
    try {
        const kept = (await v3('POST', `/processes/${MODEL}/start`, ann, { data: { clientId: 'kept', orderNo: 5 } })).body.instance.id;
        await web.bpmnServer.definitions.save(MODEL, SOURCE('Customer ${Customer = data.customer}'));
        const labels = Object.fromEntries((await v3('GET', `/instances?name=${MODEL}`, ann)).body.items.map(i => [i.id, i.label]));
        assert.equal(labels[kept], 'Client: kept · Order: 5', 'the source it started with, read for the list');
        assert.equal(labels[zeta.instance.id], MODEL, 'no source kept: the current model (its values missing: the default)');
    }
    finally {
        ds.saveSource = saveSource;
        await web.bpmnServer.definitions.save(MODEL, SOURCE());
    }
});

test('the contract documents the labels and the filter', async () => {
    const doc = (await new WebClient(web.base).get('/api/v3/openapi.json')).body;
    const params = op => op.parameters.map(p => p.name);
    for (const name of ['field', 'op', 'value', 'search']) {
        assert.ok(params(doc.paths['/tasks'].get).includes(name), `/tasks ${name}`);
        assert.ok(params(doc.paths['/instances'].get).includes(name), `/instances ${name}`);
    }
    assert.ok(params(doc.paths['/tasks'].get).includes('model'));
    for (const field of ['label', 'labelValues', 'caseLabel', 'caseLabelValues'])
        assert.ok(doc.components.schemas.Task.properties[field], `Task.${field}`);
    assert.ok(doc.components.schemas.Instance.properties.label);
    assert.ok(doc.components.schemas.LabelValue);
});
