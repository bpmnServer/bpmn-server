// @features: labels
// Labels (docs/design/labels.md): templates in the model, their values named in their placeholders, filled in when
// shown from the case's data and its own model; nothing stored.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { parseTemplate, fillTemplate, templateProblems, formatTemplate, setNamedValue, addNamedValue, removeNamedValue, modelLabels, labelInstances, labelItems, labelFields, labelQuery, verifyModel } from '../dist/index.js';
import { makeServer, definitionsFolder } from './helpers.mjs';

const EXPENSE = (caseLabel = 'Client: ${Client = data.clientId} · Order: ${Order = data.orderNo}') => `<?xml version="1.0" encoding="UTF-8"?>
<bpmn:definitions xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:camunda="http://camunda.org/schema/1.0/bpmn"
    id="Defs" targetNamespace="http://bpmn.io/schema/bpmn">
  <bpmn:process id="Expense" isExecutable="true" camunda:label="${caseLabel}">
    <bpmn:startEvent id="Start"><bpmn:outgoing>f1</bpmn:outgoing></bpmn:startEvent>
    <bpmn:userTask id="Submit" name="Submit"><bpmn:incoming>f1</bpmn:incoming><bpmn:outgoing>f2</bpmn:outgoing></bpmn:userTask>
    <bpmn:userTask id="Approve" name="Approve" camunda:label="Approve \${Amount = data.amount} for \${instance.Client}"
        camunda:endLabel="Approved by \${completedBy}"><bpmn:incoming>f2</bpmn:incoming><bpmn:outgoing>f3</bpmn:outgoing></bpmn:userTask>
    <bpmn:subProcess id="Rounds"><bpmn:incoming>f3</bpmn:incoming><bpmn:outgoing>f4</bpmn:outgoing>
      <bpmn:multiInstanceLoopCharacteristics camunda:collection="$data.levels" />
      <bpmn:startEvent id="RS"><bpmn:outgoing>r1</bpmn:outgoing></bpmn:startEvent>
      <bpmn:scriptTask id="Mark" scriptFormat="JavaScript"><bpmn:incoming>r1</bpmn:incoming><bpmn:outgoing>r2</bpmn:outgoing>
        <bpmn:script>this.data.round = 'R' + this.itemKey;</bpmn:script></bpmn:scriptTask>
      <bpmn:userTask id="Check" name="Check" camunda:label="Round \${Round = data.round}"><bpmn:incoming>r2</bpmn:incoming><bpmn:outgoing>r3</bpmn:outgoing></bpmn:userTask>
      <bpmn:endEvent id="RE"><bpmn:incoming>r3</bpmn:incoming></bpmn:endEvent>
      <bpmn:sequenceFlow id="r1" sourceRef="RS" targetRef="Mark" /><bpmn:sequenceFlow id="r2" sourceRef="Mark" targetRef="Check" />
      <bpmn:sequenceFlow id="r3" sourceRef="Check" targetRef="RE" />
    </bpmn:subProcess>
    <bpmn:endEvent id="Done"><bpmn:incoming>f4</bpmn:incoming></bpmn:endEvent>
    <bpmn:sequenceFlow id="f1" sourceRef="Start" targetRef="Submit" /><bpmn:sequenceFlow id="f2" sourceRef="Submit" targetRef="Approve" />
    <bpmn:sequenceFlow id="f3" sourceRef="Approve" targetRef="Rounds" /><bpmn:sequenceFlow id="f4" sourceRef="Rounds" targetRef="Done" />
  </bpmn:process>
</bpmn:definitions>`;

async function server(source = EXPENSE(), services = {}) {
  const dir = definitionsFolder();
  fs.writeFileSync(path.join(dir, 'Expense.bpmn'), source);
  return { ...(await makeServer({ dir, services })), dir };
}
const load = async (srv, id) => (await srv.dataStore.findInstances({ id }, 'full'))[0];
const byElement = (instance, id) => instance.items.filter(i => i.elementId === id);

test('a template: text, named values, plain placeholders; a missing value takes its name along', () => {
  assert.deepEqual(parseTemplate('Client: ${Client = data.clientId} (${data.x})'),
    [{ text: 'Client: ' }, { name: 'Client', path: 'data.clientId' }, { text: ' (' }, { path: 'data.x' }, { text: ')' }]);
  const scope = { data: { clientId: 'abc', orderNo: 1234, when: new Date('2026-01-02T00:00:00Z'), list: [1, 2] } };
  assert.deepEqual(fillTemplate('Client: ${Client = data.clientId} · Order: ${Order = data.orderNo}', scope),
    { text: 'Client: abc · Order: 1234', values: [{ name: 'Client', path: 'data.clientId', value: 'abc' }, { name: 'Order', path: 'data.orderNo', value: 1234 }] });
  assert.equal(fillTemplate('Client: ${Client = data.none} · Order: ${Order = data.orderNo}', scope).text, 'Order: 1234', 'no dangling "Client:"');
  assert.equal(fillTemplate('Client: ${Client = data.clientId} · Order: ${Order = data.none}', scope).text, 'Client: abc');
  assert.equal(fillTemplate('Due ${data.when}, items ${data.list}', scope).text, 'Due 2026-01-02T00:00:00.000Z, items 1, 2');
  assert.deepEqual(fillTemplate('${data.toString}${data.constructor}', scope), { text: '', values: [] }, 'own fields only, never internals');
});

test("a template edited by its named values (the editor's table): rename, change a path, add, remove", () => {
  const t = 'Client: ${Client = data.clientId} · Order: ${Order = data.orderNo} (${data.note})';
  assert.equal(formatTemplate(parseTemplate(t)), t, 'parts and back');
  assert.equal(setNamedValue(t, 0, { name: 'Customer' }), 'Customer: ${Customer = data.clientId} · Order: ${Order = data.orderNo} (${data.note})', 'its caption follows');
  assert.equal(setNamedValue(t, 1, { path: 'data.order.no' }), 'Client: ${Client = data.clientId} · Order: ${Order = data.order.no} (${data.note})');
  assert.equal(setNamedValue('Ref ${Order = data.no}', 0, { name: 'No' }), 'Ref ${No = data.no}', 'a caption of its own stays');
  assert.equal(setNamedValue(t, 5, { name: 'X' }), t, 'no such value');
  assert.equal(addNamedValue(t, 'Amount', 'data.amount'), t + ' · Amount: ${Amount = data.amount}');
  assert.equal(addNamedValue('', 'Client', 'data.clientId'), 'Client: ${Client = data.clientId}');
  assert.equal(removeNamedValue(t, 1), 'Client: ${Client = data.clientId} (${data.note})', 'with its caption');
  assert.equal(removeNamedValue(t, 0), 'Order: ${Order = data.orderNo} (${data.note})', 'the separator left trimmed');
  assert.equal(removeNamedValue('Client: ${Client = data.clientId}', 0), '');
  for (const edited of [setNamedValue(t, 0, { name: 'Customer' }), addNamedValue(t, 'Amount', 'data.amount'), removeNamedValue(t, 0)])
    assert.deepEqual(templateProblems(edited), [], edited);
});

test('a template is checked: data paths only, a name once', () => {
  assert.deepEqual(templateProblems('Client: ${Client = data.clientId} ${data.x}'), []);
  const problems = templateProblems('${A = data.a + 1} ${B = data.__proto__.x} ${A = data.c} ${1x = data.d}');
  for (const expected of [/'data\.a \+ 1' is not a path/, /__proto__/, /'A' is named twice/, /'1x' is not a name/])
    assert.ok(problems.some(p => expected.test(p)), `${expected}\n${problems.join('\n')}`);
});

test("a model's templates are read from its XML, sub-processes included", async () => {
  const labels = await modelLabels(EXPENSE());
  assert.equal(labels.process, 'Client: ${Client = data.clientId} · Order: ${Order = data.orderNo}');
  assert.deepEqual(labels.elements.get('Approve'), { label: 'Approve ${Amount = data.amount} for ${instance.Client}', endLabel: 'Approved by ${completedBy}' });
  assert.ok(labels.elements.get('Check'), 'inside a sub-process');
  assert.equal(labels.elements.get('Submit'), undefined);
});

test('cases and their activities, labeled when shown; nothing is stored', async () => {
  const { server: srv } = await server();
  let run = await srv.engine.start('Expense', { clientId: 'abc', orderNo: 1234, amount: 240, levels: [1, 2] }, null, 'ann');
  run = await srv.engine.invoke({ id: run.id, 'items.elementId': 'Submit' }, {}, 'ann');

  let [instance] = await labelInstances(srv, [await load(srv, run.id)]);
  assert.equal(instance.label, 'Client: abc · Order: 1234');
  assert.deepEqual(instance.labelValues.map(v => [v.name, v.value]), [['Client', 'abc'], ['Order', 1234]]);
  assert.equal(byElement(instance, 'Approve')[0].label, 'Approve 240 for abc', "its own, with its case's Client");
  assert.equal(byElement(instance, 'Submit')[0].label, undefined, 'no label of its own');

  const stored = await load(srv, run.id);
  assert.equal(stored.label, undefined, 'not stored');
  assert.equal(stored.items.find(i => i.elementId === 'Approve').label, undefined);

  run = await srv.engine.invoke({ id: run.id, 'items.elementId': 'Approve' }, {}, 'bob');
  [instance] = await labelInstances(srv, [await load(srv, run.id)]);
  assert.equal(byElement(instance, 'Approve')[0].label, 'Approved by bob', 'ended: its end label, who completed it');
  assert.deepEqual(byElement(instance, 'Check').map(i => i.label).sort(), ['Round R1', 'Round R2'], "each round's own data");
  await srv.shutdown();
});

test("a case is labeled by its own model's template: a later model doesn't relabel it", async () => {
  const { server: srv, dir } = await server();
  const run = await srv.engine.start('Expense', { clientId: 'abc', orderNo: 1, amount: 5, levels: [] }, null, 'ann');
  fs.writeFileSync(path.join(dir, 'Expense.bpmn'), EXPENSE('Customer ${Customer = data.customer}'));
  await srv.definitions.rebuild();
  const [instance] = await labelInstances(srv, [await load(srv, run.id)]);
  assert.equal(instance.label, 'Client: abc · Order: 1', 'the source it kept');
  await srv.shutdown();
});

test("a case read without its source (a summary, an API's) is still labeled by its own model's template", async () => {
  const { server: srv, dir } = await server();
  const run = await srv.engine.start('Expense', { clientId: 'abc', orderNo: 1, amount: 5, levels: [] }, null, 'ann');
  fs.writeFileSync(path.join(dir, 'Expense.bpmn'), EXPENSE('Customer ${Customer = data.customer}'));
  await srv.definitions.rebuild();
  const [summary] = await srv.dataStore.findInstances({ id: run.id }, 'summary');
  assert.equal(summary.source, undefined, 'a summary has no source');
  const [instance] = await labelInstances(srv, [summary]);
  assert.equal(instance.label, 'Client: abc · Order: 1', 'its source, read for it');
  await srv.shutdown();
});

test('missing values: none, null, empty or only spaces take their caption along; a partial label keeps the rest', () => {
  const template = 'Client: ${Client = data.clientId} · Order: ${Order = data.orderNo}';
  for (const clientId of [undefined, null, '', '   ', '	'])
    assert.deepEqual(fillTemplate(template, { data: { clientId, orderNo: 1 } }), { text: 'Order: 1', values: [{ name: 'Order', path: 'data.orderNo', value: 1 }] }, JSON.stringify(clientId));
  assert.equal(fillTemplate(template, { data: { clientId: 'abc' } }).text, 'Client: abc', 'the last one missing');
  assert.equal(fillTemplate(template, { data: { nested: {} } }).text, '', 'all missing: empty, so the default applies');
  assert.equal(fillTemplate('Client: ${data.customer.name}', { data: { customer: null } }).text, '', 'a missing parent');
  assert.equal(fillTemplate(template, { data: { clientId: 0, orderNo: false } }).text, 'Client: 0 · Order: false', 'zero and false are values');
});

test("tasks: their label and their case's, from the cases' own sources", async () => {
  const { server: srv } = await server();
  const run = await srv.engine.start('Expense', { clientId: 'abc', orderNo: 1234, amount: 240, levels: [] }, null, 'ann');
  await srv.engine.invoke({ id: run.id, 'items.elementId': 'Submit' }, {}, 'ann');
  const items = await labelItems(srv, await srv.dataStore.findItems({ id: run.id, 'items.status': 'wait' }));
  const approve = items.find(i => i.elementId === 'Approve');
  assert.equal(approve.caseLabel, 'Client: abc · Order: 1234');
  assert.equal(approve.ownLabel, 'Approve 240 for abc');
  assert.equal(approve.label, 'Approve 240 for abc — Client: abc · Order: 1234');
  await srv.shutdown();
});

test("the defaults: the application's hook, else the model and case id, else the model's name", async () => {
  const plain = EXPENSE('').replace(' camunda:label=""', '');
  let { server: srv } = await server(plain, { instanceLabel: instance => `Claim for ${instance.data.clientId}` });
  let [instance] = await labelInstances(srv, [await load(srv, (await srv.engine.start('Expense', { clientId: 'abc', levels: [] })).id)]);
  assert.equal(instance.label, 'Claim for abc');
  await srv.shutdown();

  ({ server: srv } = await server(plain));
  [instance] = await labelInstances(srv, [await load(srv, (await srv.engine.start('Expense', { caseId: 7, levels: [] })).id)]);
  assert.equal(instance.label, 'Expense #7');
  [instance] = await labelInstances(srv, [await load(srv, (await srv.engine.start('Expense', { levels: [] })).id)]);
  assert.equal(instance.label, 'Expense');
  // a template whose values are all missing: the default
  ({ server: srv } = await server());
  [instance] = await labelInstances(srv, [await load(srv, (await srv.engine.start('Expense', { caseId: 9, levels: [] })).id)]);
  assert.equal(instance.label, 'Expense #9');
  await srv.shutdown();
});

test('filters: the named values the models offer, as queries on their data paths', async () => {
  const { server: srv } = await server();
  const fields = await labelFields(srv, ['Expense']);
  assert.deepEqual(fields, [{ name: 'Client', model: 'Expense', path: 'data.clientId' }, { name: 'Order', model: 'Expense', path: 'data.orderNo' }]);
  for (const [clientId, orderNo] of [['acme', 1234], ['Acme West', 1240], ['zeta', 77]])
    await srv.engine.start('Expense', { clientId, orderNo, amount: 1, levels: [] }, null, 'ann');
  const found = async filter => (await srv.dataStore.findInstances(labelQuery(fields, filter) ?? {}, 'summary')).map(i => i.data.clientId).sort();

  assert.deepEqual(await found({ field: 'Client', op: 'contains', value: 'ACME' }), ['Acme West', 'acme'], 'contains, any case');
  assert.deepEqual(await found({ field: 'Client', op: 'is', value: 'acme' }), ['acme'], 'is');
  assert.deepEqual(await found({ field: 'Order', op: 'is', value: '1240' }), ['Acme West'], 'a number, as a number');
  assert.deepEqual(await found({ search: '77' }), ['zeta'], 'search everything');
  assert.deepEqual(await found({ search: 'a.m' }), [], 'the value is text, not a pattern');
  assert.deepEqual(await found({ model: 'Other' }), [], 'another model');
  assert.equal(labelQuery(fields, {}), undefined, 'nothing to filter');

  // tasks, by their cases' named values
  const items = await srv.dataStore.findItems({ 'items.status': 'wait', ...labelQuery(fields, { field: 'Client', value: 'zeta' }) });
  assert.deepEqual([...new Set(items.map(i => i.instanceData.clientId))], ['zeta']);
  await srv.shutdown();
});

test('verifyModel: a label that is not a template of data paths is an error', async () => {
  const { server: srv } = await server();
  const result = await verifyModel(EXPENSE().replace('${Amount = data.amount}', '${Amount = data.amount * 2}'), srv, 'Expense');
  assert.ok(result.issues.some(i => i.code === 'label-template' && i.elementId === 'Approve' && i.severity === 'error'), JSON.stringify(result.issues));
  assert.ok(!result.issues.some(i => i.code === 'label-template' && i.elementId !== 'Approve'));
  await srv.shutdown();
});
