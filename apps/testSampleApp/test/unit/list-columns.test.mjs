// Extra columns in the instance list and the pending-task table: fields of the instance data an application
// names (INSTANCE_COLUMNS, TASK_COLUMNS, or start({ listColumns })), shown after Case Id.
import test from 'node:test';
import assert from 'node:assert/strict';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import pug from 'pug';

import { parseListColumns, resolveListColumns, columnValue } from '../../../../packages/bpmn-web/dist/runtime/listColumns.js';
import { WebApp } from '../../../../packages/bpmn-web/dist/app.js';

const VIEWS = path.join(path.dirname(fileURLToPath(import.meta.url)), '../../../../packages/bpmn-web/src/views/includes');
const render = (file, locals) => pug.renderFile(path.join(VIEWS, file), { columnValue, _csrf: 't', user: null, ...locals });
const cells = (html, row) => [...html.split('<tr>')[row + 1].matchAll(/<t[hd]>([^<]*)<\/t[hd]>/g)].map(m => m[1].trim());

test('Label:field pairs are read from the setting, and an entry that is not one is left out and reported', () => {
  const { columns, invalid } = parseListColumns(' Order : orderNo, Customer:customer.name,, nofield, Bad:a..b, X:__proto__.y, Ref: a:b:ref', 'INSTANCE_COLUMNS');
  assert.deepEqual(columns, [
    { label: 'Order', field: 'orderNo' },
    { label: 'Customer', field: 'customer.name' },
    { label: 'Ref: a:b', field: 'ref' },
  ]);
  assert.equal(invalid.length, 3);
  assert.ok(invalid.every(m => m.startsWith('INSTANCE_COLUMNS: ') && m.endsWith('left out')));
  assert.deepEqual(parseListColumns(undefined), { columns: [], invalid: [] });
});

test("start()'s listColumns wins for a table it names; the other table still comes from .env", () => {
  const env = { INSTANCE_COLUMNS: 'A:a', TASK_COLUMNS: 'B:b' };
  assert.deepEqual(resolveListColumns({}, env), { instances: [{ label: 'A', field: 'a' }], tasks: [{ label: 'B', field: 'b' }], invalid: [] });
  const given = resolveListColumns({ tasks: [{ label: 'C', field: 'c.d' }, { label: '', field: 'e' }, { label: 'F', field: 'constructor' }] }, env);
  assert.deepEqual(given.instances, [{ label: 'A', field: 'a' }]);
  assert.deepEqual(given.tasks, [{ label: 'C', field: 'c.d' }]);
  assert.equal(given.invalid.length, 2);
  assert.ok(given.invalid.every(m => m.startsWith('listColumns.tasks: ')));
  assert.deepEqual(resolveListColumns({}, {}), { instances: [], tasks: [], invalid: [] });
});

test("a column's value: nested fields, own fields only, lists and objects as text, '' when missing", () => {
  const data = { n: 0, s: 'x', nested: { v: 'deep' }, list: [1, 'two', { k: 3 }], obj: { a: 1 }, nil: null, when: new Date('2026-01-02T03:04:05Z') };
  assert.equal(columnValue(data, 'n'), '0');
  assert.equal(columnValue(data, 's'), 'x');
  assert.equal(columnValue(data, 'nested.v'), 'deep');
  assert.equal(columnValue(data, 'list'), '1, two, {"k":3}');
  assert.equal(columnValue(data, 'obj'), '{"a":1}');
  assert.equal(columnValue(data, 'when'), '2026-01-02T03:04:05.000Z');
  assert.equal(columnValue(data, 'nil'), '');
  assert.equal(columnValue(data, 'missing.deeper'), '');
  assert.equal(columnValue(data, 'toString'), '');      // inherited, not the data's
  assert.equal(columnValue('text', 'length'), '');
  assert.equal(columnValue(undefined, 'a'), '');
});

test('the instance list shows the extra columns after Case Id, escaped', () => {
  const instances = [{ id: 'i1', name: 'Order', data: { caseId: 7, ref: { no: '<b>R-1</b>' } }, fromNow: 'now', endFromNow: '' }, { id: 'i2', name: 'Order', fromNow: 'now' }];
  const html = render('instances.pug', { instances, listColumns: { instances: [{ label: 'Reference', field: 'ref.no' }], tasks: [] } });
  assert.deepEqual(cells(html, 0).slice(0, 4), ['Name', 'Case Id', 'Reference', 'Started']);
  assert.deepEqual(cells(html, 1).slice(0, 4), ['Order', '7', '&lt;b&gt;R-1&lt;/b&gt;', 'now']);
  assert.deepEqual(cells(html, 2).slice(0, 4), ['Order', '', '', 'now']);
});

test("the task table shows them from each task's instance data, after CaseId", () => {
  const waiting = [{ id: 't1', name: 'Approve', elementId: 'A', processName: 'Order', instanceData: { caseId: 3, ref: 'R-2' }, fromNow: 'now' }];
  const html = render('tasks.pug', { waiting, listColumns: { instances: [], tasks: [{ label: 'Reference', field: 'ref' }] } });
  assert.deepEqual(cells(html, 0).slice(0, 5), ['Name -id', 'Model', 'CaseId', 'Reference', 'Started']);
  assert.deepEqual(cells(html, 1).slice(0, 5), ['Approve - A', 'Order', '3', 'R-2', 'now']);
});

test('without columns the tables are as before', () => {
  const instances = [{ id: 'i1', name: 'Order', data: { caseId: 7 }, fromNow: 'now', endFromNow: '' }];
  const waiting = [{ id: 't1', name: 'Approve', elementId: 'A', processName: 'Order', instanceData: { caseId: 3 }, fromNow: 'now' }];
  assert.deepEqual(cells(render('instances.pug', { instances }), 0).slice(0, 3), ['Name', 'Case Id', 'Started']);
  assert.deepEqual(cells(render('tasks.pug', { waiting }), 0).slice(0, 4), ['Name -id', 'Model', 'CaseId', 'Started']);
});

test('the web app gives the views the columns, warning about the ones it leaves out', () => {
  const web = Object.assign(Object.create(WebApp.prototype), { app: { locals: {} } });
  const warn = console.warn; const warnings = [];
  console.warn = m => warnings.push(m);
  try { web.setupListColumns({ listColumns: { tasks: [{ label: 'T', field: 't' }] } }, { INSTANCE_COLUMNS: 'I:i, broken' }); }
  finally { console.warn = warn; }
  assert.deepEqual(web.app.locals.listColumns, { instances: [{ label: 'I', field: 'i' }], tasks: [{ label: 'T', field: 't' }] });
  assert.equal(web.app.locals.columnValue, columnValue);
  assert.equal(warnings.length, 1);
  assert.match(warnings[0], /^\[config\] INSTANCE_COLUMNS: 'broken'/);
});
