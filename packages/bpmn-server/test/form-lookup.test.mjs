// @features: form-lookups
// A form field's list or lookup (addons/forms/FormLookup.ts; docs/design/form-lookups.md): the model says it all, in an
// <owf:list> or <owf:lookup> on the field, and its choices come from the source it names, asked for on demand: a
// service of the application, or a connector's operation. A local server plays the people API.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import { makeServer, definitionsFolder } from './helpers.mjs';
import { formFieldLookup, choicesOf, lookupChoices, filterValue, parseLookupSource, verifyModel, LOOKUP_LIMIT } from '../dist/index.js';

process.env.SECRETS_KEY = 'a test encryption key';
const TOKEN = 'people-token';
const PEOPLE = [
  { id: 'E1', name: 'David Kim', dept: { code: 'HR' } },
  { id: 'E2', name: 'Sarah Chen', dept: { code: 'IT' } },
  { id: 'E3', name: 'Dana Scott', dept: { code: 'IT' } },
];
const DOCUMENT = {
  openapi: '3.1.0', info: { title: 'People', version: '1' }, servers: [{ url: '/api' }],
  components: { securitySchemes: { bearerAuth: { type: 'http', scheme: 'bearer' } } }, security: [{ bearerAuth: [] }],
  paths: {
    '/people': { get: { operationId: 'searchPeople', parameters: [{ name: 'q', in: 'query', schema: { type: 'string' } }, { name: 'dept', in: 'query', schema: { type: 'string' } }], responses: { 200: { description: 'People' } } } },
    '/departments': { get: { operationId: 'listDepartments', responses: { 200: { description: 'Departments' } } } },
    '/people/{id}': { get: { operationId: 'getPerson', parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }], responses: { 200: { description: 'One' } } } },
    '/broken': { get: { operationId: 'broken', responses: { 200: { description: 'Never' } } } },
  },
};
const asked = [];
const api = http.createServer((req, res) => {
  const url = new URL(req.url, 'http://x');
  const send = (status, body) => { res.writeHead(status, { 'Content-Type': 'application/json' }); res.end(JSON.stringify(body)); };
  if (url.pathname === '/openapi.json') return send(200, DOCUMENT);
  if (req.headers.authorization !== `Bearer ${TOKEN}`) return send(401, { error: 'unauthorized' });
  asked.push(url.pathname + url.search);
  if (url.pathname === '/api/people') {
    const q = (url.searchParams.get('q') ?? '').toLowerCase();
    const dept = url.searchParams.get('dept');
    return send(200, { people: PEOPLE.filter(p => p.name.toLowerCase().includes(q) && (!dept || p.dept.code === dept)), total: 3 });
  }
  if (url.pathname === '/api/departments') return send(200, [{ code: 'HR', title: 'Human Resources' }, { code: 'IT', title: 'Technology' }]);
  if (url.pathname === '/api/broken') return send(500, { error: 'down' });
  send(404, { error: 'no route' });
});
let base;
test.before(async () => {
  await new Promise(resolve => api.listen(0, '127.0.0.1', resolve));
  base = `http://127.0.0.1:${api.address().port}`;
});
test.after(() => api.close());

async function peopleServer(services = {}) {
  const made = await makeServer({ services, extra: { connectors: { retryDelay: 1 } } });
  await made.server.connectors.install();
  await made.server.connectors.add({ id: 'people', source: `${base}/openapi.json` });
  await made.server.connectors.setKey('people', TOKEN);
  return made;
}

const model = (fields) => `<?xml version="1.0" encoding="UTF-8"?>
<bpmn:definitions xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:camunda="http://camunda.org/schema/1.0/bpmn"
  xmlns:owf="http://omniworkflow.com/schema/owf/1.0" id="d" targetNamespace="t">
  <bpmn:process id="P" isExecutable="true">
    <bpmn:startEvent id="S"><bpmn:outgoing>a</bpmn:outgoing></bpmn:startEvent>
    <bpmn:userTask id="T"><bpmn:extensionElements><camunda:formData>${fields}</camunda:formData></bpmn:extensionElements>
      <bpmn:incoming>a</bpmn:incoming><bpmn:outgoing>b</bpmn:outgoing></bpmn:userTask>
    <bpmn:endEvent id="E"><bpmn:incoming>b</bpmn:incoming></bpmn:endEvent>
    <bpmn:sequenceFlow id="a" sourceRef="S" targetRef="T" /><bpmn:sequenceFlow id="b" sourceRef="T" targetRef="E" />
  </bpmn:process></bpmn:definitions>`;
const field = (id, inner) => `<camunda:formField id="${id}" label="${id}" type="string">${inner}</camunda:formField>`;
const DEPARTMENT = field('department', '<owf:list source="service:departments" key="code" display="title" />');
const APPROVER = field('approver', '<owf:lookup source="connector:people/searchPeople" text="q" display="name" items="people" filter="${data.department}" filterInput="dept" />');
const departments = async () => [{ code: 'HR', title: 'Human Resources' }, { code: 'IT', title: 'Technology' }];

test('a field\'s list or lookup, read from the model: its element\'s attributes, with their defaults; none on a plain field', async () => {
  const dir = definitionsFolder();
  fs.writeFileSync(path.join(dir, 'Choices.bpmn'), model(DEPARTMENT + APPROVER + '<camunda:formField id="note" type="string" />'));
  const { server } = await makeServer({ dir });
  const definition = await server.definitions.load('Choices');
  const fields = Object.fromEntries(definition.getNodeInfo('T').fields.map(f => [f.id, f]));
  assert.deepEqual(formFieldLookup(fields.department), { kind: 'list', source: { type: 'service', name: 'departments' }, sourceText: 'service:departments', key: 'code', display: 'title' });
  assert.deepEqual(formFieldLookup(fields.approver), { kind: 'lookup', source: { type: 'connector', operation: 'people/searchPeople' }, sourceText: 'connector:people/searchPeople',
    key: 'id', display: 'name', text: 'q', filter: '${data.department}', filterInput: 'dept', items: 'people' });
  assert.equal(formFieldLookup(fields.note), undefined);
  const one = (inner) => formFieldLookup({ $children: [inner] });
  assert.deepEqual(one({ $type: 'owf:list', source: 'service:all' }), { kind: 'list', source: { type: 'service', name: 'all' }, sourceText: 'service:all', key: 'id', display: 'id' }, 'the key is id, shown as it is');
  assert.equal(one({ $type: 'owf:list', source: 'service:all', text: 'q' }).text, undefined, 'a list sends no text');
  assert.equal(one({ $type: 'owf:list', source: 'nothing' }), undefined, 'no valid source: none');
  assert.equal(one({ $type: 'owf:list' }), undefined);
  assert.equal(one({ $type: 'owf:list', $attrs: { source: 'service:x' } }).source.name, 'x', 'in $attrs too');
  assert.deepEqual(parseLookupSource(' connector: a/b '), { type: 'connector', operation: 'a/b' });
  assert.equal(parseLookupSource('script:x'), undefined);
  assert.equal(filterValue({ filter: '${data.a.b}' }, { a: { b: 7 } }), 7, 'a filter is a data path');
  assert.equal(filterValue({ filter: 'IT' }, {}), undefined, 'not a data path: no value');
  assert.equal(filterValue({}, { a: 1 }), undefined);
  await server.shutdown();
});

test('an answer\'s choices: its rows where the field says, else the answer or its first list; nested paths; searched when the source did not', () => {
  const lookup = { kind: 'lookup', source: { type: 'connector', operation: 'p/s' }, text: 'q', key: 'id', display: 'name' };
  assert.deepEqual(choicesOf([{ id: 1, name: 'A' }, { id: 'x' }], lookup), [{ key: '1', display: 'A' }, { key: 'x', display: 'x' }], 'a list answer; the key shown when no display');
  assert.deepEqual(choicesOf({ total: 2, rows: [{ id: 'a', name: 'A' }] }, lookup), [{ key: 'a', display: 'A' }], 'the first list in an object');
  assert.deepEqual(choicesOf({ data: { found: [{ who: { id: 'n1', name: 'N' } }] } }, { ...lookup, items: 'data.found', key: 'who.id', display: 'who.name' }),
    [{ key: 'n1', display: 'N' }], 'items, and nested key and display');
  assert.deepEqual(choicesOf([{ name: 'no key' }, { id: null }, { id: { a: 1 } }, { id: 0, name: 'zero' }], lookup), [{ key: '0', display: 'zero' }], 'rows without a plain key are left out');
  assert.deepEqual(choicesOf('text', lookup), []);
  assert.deepEqual(choicesOf(null, lookup), []);
  assert.deepEqual(choicesOf({ items: 'not a list' }, { ...lookup, items: 'items' }), []);
  const rows = [{ id: 'a', name: 'Alpha' }, { id: 'b', name: 'Beta' }];
  assert.equal(choicesOf(rows, lookup, 'alp').length, 2, 'the connector searched (it has the text): not again here');
  assert.equal(choicesOf(rows, { ...lookup, text: undefined, source: { type: 'service', name: 's' } }, 'alp').length, 2, 'a service searched');
  assert.deepEqual(choicesOf(rows, { ...lookup, text: undefined }, 'ALP'), [{ key: 'a', display: 'Alpha' }], 'a connector without a text input: searched here, by display or key');
  assert.deepEqual(choicesOf(rows, { ...lookup, kind: 'list', text: undefined }, 'b'), [{ key: 'b', display: 'Beta' }]);
  assert.equal(choicesOf(Array.from({ length: 80 }, (_, i) => ({ id: i })), lookup).length, LOOKUP_LIMIT, 'at most the limit');
});

test('the choices, asked for: a service with the criteria and who asks; a connector with its inputs; a failing source throws', async () => {
  const calls = [];
  const searchPeople = async (criteria, context) => { calls.push({ criteria, context }); return PEOPLE.filter(p => p.name.toLowerCase().includes(criteria.text.toLowerCase()) && (!criteria.filter || p.dept.code === criteria.filter)); };
  const { server } = await peopleServer({ departments, searchPeople, failing: async () => { throw new Error('down'); } });
  const list = { kind: 'list', source: { type: 'service', name: 'departments' }, key: 'code', display: 'title' };
  assert.deepEqual(await lookupChoices(server, list), [{ key: 'HR', display: 'Human Resources' }, { key: 'IT', display: 'Technology' }]);

  const byService = { kind: 'lookup', source: { type: 'service', name: 'searchPeople' }, key: 'id', display: 'name' };
  assert.deepEqual(await lookupChoices(server, byService, { text: 'sa', filter: 'IT' }, { user: { userName: 'ann' } }), [{ key: 'E2', display: 'Sarah Chen' }]);
  assert.deepEqual(calls, [{ criteria: { text: 'sa', filter: 'IT' }, context: { user: { userName: 'ann' } } }], 'the text and the filter, and who asks');

  asked.length = 0;
  const byConnector = { kind: 'lookup', source: { type: 'connector', operation: 'people/searchPeople' }, text: 'q', filterInput: 'dept', key: 'id', display: 'name', items: 'people' };
  assert.deepEqual(await lookupChoices(server, byConnector, { text: 'da', filter: 'IT' }), [{ key: 'E3', display: 'Dana Scott' }]);
  assert.deepEqual(asked, ['/api/people?q=da&dept=IT'], 'the text and the filter as its inputs; the key stays with the server');
  const dept = { kind: 'list', source: { type: 'connector', operation: 'people/listDepartments' }, key: 'code', display: 'title' };
  assert.equal((await lookupChoices(server, dept)).length, 2);

  await assert.rejects(lookupChoices(server, { ...dept, source: { type: 'connector', operation: 'people/broken' } }), /500/);
  await assert.rejects(lookupChoices(server, { ...dept, source: { type: 'connector', operation: 'nobody/x' } }));
  await assert.rejects(lookupChoices(server, { ...list, source: { type: 'service', name: 'nope' } }), /have no 'nope'/);
  await assert.rejects(lookupChoices(server, { ...list, source: { type: 'service', name: 'failing' } }), /down/);
  await assert.rejects(lookupChoices({}, dept), /no connectors/);
  await server.shutdown();
});

test('verify: a list or lookup names a source the application or the server has; its inputs are the operation\'s; one per field', async () => {
  const { server } = await peopleServer({ departments });
  const codes = async (fields) => (await verifyModel(model(fields), server)).issues.map(i => i.code).filter(c => c !== 'no-diagram' && c !== 'not-in-diagram');
  const f = (inner) => field('f', inner);
  assert.deepEqual(await codes(DEPARTMENT + APPROVER), [], 'all well');
  assert.deepEqual(await codes(f('<owf:list source="service:nope" />')), ['lookup-service-unknown']);
  assert.deepEqual(await codes(f('<owf:list source="script:x" />')), ['lookup-source']);
  assert.deepEqual(await codes(f('<owf:list />')), ['lookup-source']);
  assert.deepEqual(await codes(f('<owf:list source="connector:people" />')), ['lookup-source']);
  assert.deepEqual(await codes(f('<owf:lookup source="connector:people/searchPeople" />')), ['lookup-no-text']);
  assert.deepEqual(await codes(f('<owf:lookup source="connector:people/searchPeople" text="name" />')), ['lookup-input-unknown']);
  assert.deepEqual(await codes(f('<owf:lookup source="connector:people/searchPeople" text="q" filter="${data.d}" />')), ['lookup-filter-unsent']);
  assert.deepEqual(await codes(f('<owf:lookup source="service:departments" filter="IT" />')), ['lookup-filter']);
  assert.deepEqual(await codes(f('<owf:list source="connector:people/getPerson" />')), ['lookup-input-missing']);
  assert.deepEqual(await codes(f('<owf:list source="connector:nobody/x" />')), ['connector-unknown']);
  assert.deepEqual(await codes(f('<owf:list source="connector:people/nope" />')), ['connector-operation-unknown']);
  assert.deepEqual(await codes(f('<owf:list source="service:departments" /><owf:lookup source="service:departments" />')), ['lookup-and-list']);
  await server.shutdown();
});
