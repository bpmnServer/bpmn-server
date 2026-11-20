// @features: list-columns
// The lists as the person chooses them (docs/docs/list-columns.md, routes/listView.ts): the columns they add (a value
// the labels name, a field of the cases' data), filters on them, and sorting by them; in API v3 and in the pages
// (the Workbench's Instances and Pending Tasks, My work), the view in the URL and remembered for the session.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { startWebApp, why, WebClient, API_KEY } from '../support/webApp.mjs';

const MODEL = 'Columns';
const SOURCE = `<?xml version="1.0" encoding="UTF-8"?>
<bpmn:definitions xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:camunda="http://camunda.org/schema/1.0/bpmn"
    id="D_Columns" targetNamespace="http://bpmn.io/schema/bpmn">
  <bpmn:process id="Columns" isExecutable="true" camunda:label="Client: \${Client = data.clientId}">
    <bpmn:startEvent id="S"><bpmn:outgoing>f1</bpmn:outgoing></bpmn:startEvent>
    <bpmn:userTask id="Approve" name="Approve"><bpmn:extensionElements><camunda:formData>
      <camunda:formField id="amount" label="Amount (USD)" type="long" /><camunda:formField id="note" label="Note" type="string" />
    </camunda:formData></bpmn:extensionElements><bpmn:incoming>f1</bpmn:incoming><bpmn:outgoing>f2</bpmn:outgoing></bpmn:userTask>
    <bpmn:endEvent id="E"><bpmn:incoming>f2</bpmn:incoming></bpmn:endEvent>
    <bpmn:sequenceFlow id="f1" sourceRef="S" targetRef="Approve" /><bpmn:sequenceFlow id="f2" sourceRef="Approve" targetRef="E" />
  </bpmn:process>
</bpmn:definitions>`;

const CASES = [
    { clientId: 'beta', amount: 300, region: { name: 'East' } },
    { clientId: 'alpha', amount: 1200, region: { name: 'West' } },
    { clientId: 'gamma', amount: 50 },
];

let web, ann, admin;
const v3 = (url, token = ann) => new WebClient(web.base).request('GET', '/api/v3' + url, { headers: { authorization: `Bearer ${token}` } });
const ofModel = items => items.filter(i => (i.processName ?? i.name) === MODEL);

test.before(async () => {
    web = await startWebApp();
    fs.writeFileSync(path.join(web.definitionsPath, MODEL + '.bpmn'), SOURCE);
    const issued = await new WebClient(web.base).request('POST', '/api/v3/tokens', { json: { userName: 'ann', groups: ['staff'] }, headers: { 'x-api-key': API_KEY } });
    assert.equal(issued.status, 201, why(issued));
    ann = issued.body.token;
    for (const data of CASES) await web.bpmnServer.engine.start(MODEL, data, null, 'ann');
    admin = await web.login('admin');
});
test.after(async () => { await web?.stop(); setImmediate(() => process.exit(0)); });

test('API v3 instances: the columns asked, by a label\'s name or a data path, as text; sorted by one', async () => {
    const listed = await v3(`/instances?name=${MODEL}&columns=Client,data.amount,data.region.name&sort=data.amount&order=desc`);
    assert.equal(listed.status, 200, why(listed));
    const items = ofModel(listed.body.items);
    assert.deepEqual(items.map(i => i.columns), [
        { Client: 'alpha', 'data.amount': '1200', 'data.region.name': 'West' },
        { Client: 'beta', 'data.amount': '300', 'data.region.name': 'East' },
        { Client: 'gamma', 'data.amount': '50', 'data.region.name': '' },
    ], 'by amount, the largest first, as numbers');
    const byClient = ofModel((await v3(`/instances?name=${MODEL}&columns=Client&sort=Client`)).body.items);
    assert.deepEqual(byClient.map(i => i.columns.Client), ['alpha', 'beta', 'gamma']);
    const plain = ofModel((await v3(`/instances?name=${MODEL}`)).body.items);
    assert.equal(plain[0].columns, undefined, 'no columns asked, none answered');
});

test('API v3 instances: a sorted list a page at a time', async () => {
    const first = await v3(`/instances?name=${MODEL}&columns=Client&sort=Client&limit=2`);
    assert.deepEqual(first.body.items.map(i => i.columns.Client), ['alpha', 'beta']);
    assert.ok(first.body.next, 'a next page');
    const second = await v3(`/instances?name=${MODEL}&columns=Client&sort=Client&limit=2&cursor=${encodeURIComponent(first.body.next)}`);
    assert.equal(second.status, 200, why(second));
    assert.deepEqual(second.body.items.map(i => i.columns.Client), ['gamma']);
    assert.equal(second.body.next, undefined);
});

test('API v3 tasks: columns from each task\'s case; sorted by one', async () => {
    const listed = await v3(`/tasks?model=${MODEL}&columns=Client,data.amount&sort=data.amount`);
    assert.equal(listed.status, 200, why(listed));
    assert.deepEqual(ofModel(listed.body.items).map(t => t.columns['data.amount']), ['50', '300', '1200']);
    const byName = await v3(`/tasks?model=${MODEL}&columns=Client&sort=Client&order=desc`);
    assert.deepEqual(ofModel(byName.body.items).map(t => t.columns.Client), ['gamma', 'beta', 'alpha']);
});

test('API v3: filters on a data field, more and less than', async () => {
    const more = ofModel((await v3(`/instances?name=${MODEL}&field=data.amount&op=gt&value=100&columns=Client&sort=Client`)).body.items);
    assert.deepEqual(more.map(i => i.columns.Client), ['alpha', 'beta']);
    const less = ofModel((await v3(`/tasks?model=${MODEL}&field=data.amount&op=lt&value=100&columns=Client`)).body.items);
    assert.deepEqual(less.map(t => t.columns.Client), ['gamma']);
});

test('API v3: a column, a sort or an op it can not use is a 400', async () => {
    for (const [url, code] of [
        [`/instances?columns=NoSuchName`, 'BAD_COLUMN'],
        [`/instances?columns=data.__proto__`, 'BAD_COLUMN'],
        [`/instances?sort=nothing`, 'BAD_SORT'],
        [`/instances?sort=started&order=sideways`, 'BAD_SORT'],
        [`/tasks?sort=data.amount`, 'BAD_SORT'],
        [`/instances?field=Client&op=near&value=a`, 'BAD_FILTER'],
    ]) {
        const answer = await v3(url);
        assert.equal(answer.status, 400, `${url}: ${why(answer)}`);
        assert.equal(answer.body.error.code, code, url);
    }
});

test('the Workbench: the picker, the columns added, sorted by a heading, kept for the session', async () => {
    const instancesOf = html => html.slice(html.indexOf('id="instances"'));
    const home = (await admin.get('/')).text;
    assert.match(instancesOf(home), /<details class="list-columns" data-list="workbench-instances"/);
    assert.match(instancesOf(home), /name="columns" value="Client"/, 'the labels\' names offered');

    const chosen = (await admin.get(`/?columns_set=1&columns=Client&columns_add=amount&model=${MODEL}&sort=data.amount&order=asc#instances`)).text;
    const list = instancesOf(chosen);
    assert.match(list, /<th aria-sort="ascending"><a class="sort-heading sorted"[^>]*>Amount \(USD\)<span class="sort-mark"[^>]*> ▲<\/span><\/a><\/th>/);
    const order = ['gamma', 'beta', 'alpha'].map(c => list.indexOf(`<td class="list-column">${c}</td>`));
    assert.ok(order.every(i => i > 0) && order[0] < order[1] && order[1] < order[2], `by amount: ${order}`);
    assert.match(list, /<td class="list-column">1200<\/td>/);
    assert.match(list, /<option value="data.amount"[^>]*>data.amount<\/option>/, 'the filter bar offers the data column');

    // opened again without them: as they were left; the Reset link clears them
    const again = instancesOf((await admin.get(`/?model=${MODEL}`)).text);
    assert.match(again, /<td class="list-column">1200<\/td>/, 'remembered for the session');
    const reset = instancesOf((await admin.get(`/?columns_set=1&model=${MODEL}`)).text);
    assert.doesNotMatch(reset, /class="list-column"/);
});

test('Pending Tasks and My work: their own columns and sort', async () => {
    const tasksOf = html => html.slice(html.indexOf('id="tasks"'), html.indexOf('id="instances"'));
    const home = tasksOf((await admin.get(`/?task_columns_set=1&task_columns=data.amount&task_sort=data.amount&task_order=desc&task_model=${MODEL}`)).text);
    const order = ['1200', '300', '50'].map(v => home.indexOf(`<td class="list-column">${v}</td>`));
    assert.ok(order.every(i => i > 0) && order[0] < order[1] && order[1] < order[2], `Pending Tasks by amount, largest first: ${order}`);
    const work = (await admin.get(`/dashboard?columns_set=1&columns=Client&sort=Client&order=desc&model=${MODEL}`)).text;
    const mine = ['gamma', 'beta', 'alpha'].map(c => work.indexOf(`<td class="list-column">${c}</td>`));
    assert.ok(mine.every(i => i > 0) && mine[0] < mine[1] && mine[1] < mine[2], `My work by Client, descending: ${mine}`);
});
