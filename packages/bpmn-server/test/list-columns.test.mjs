// @features: list-columns
// The lists' columns (engine/ListColumns.ts): a value the labels name, each model's path, or a data path; their values
// as text; the sort's order (numbers as numbers, none last); a filter on a data field, more and less than.
import test from 'node:test';
import assert from 'node:assert/strict';
import { listColumns, columnKeys, columnValues, columnSortPath, sortRecords, sortOrder, labelQuery, ListColumnError } from '../dist/index.js';

const FIELDS = [
    { name: 'Client', model: 'Claim', path: 'data.clientId' },
    { name: 'Client', model: 'Order', path: 'data.customer.name' },
    { name: 'Order', model: 'Order', path: 'data.orderNo' },
];

test('the keys: a list or text, each once', () => {
    assert.deepEqual(columnKeys('Client, data.amount,,Client'), ['Client', 'data.amount']);
    assert.deepEqual(columnKeys(['a', 'b']), ['a', 'b']);
    assert.deepEqual(columnKeys(undefined), []);
});

test('a column: a named value reads each model\'s path; a data path the same in every model', () => {
    const [client, amount] = listColumns(FIELDS, ['Client', 'data.amount']);
    assert.equal(columnSortPath(client), undefined, 'two models, two paths: not one the store can sort by');
    assert.equal(columnSortPath(listColumns(FIELDS, ['Client'], 'Order')[0]), 'data.customer.name', 'within one model, one');
    assert.equal(columnSortPath(amount), 'data.amount');
    assert.deepEqual(columnValues([client, amount], 'Order', { customer: { name: 'acme' }, amount: 12.5 }), { Client: 'acme', 'data.amount': '12.5' });
    assert.deepEqual(columnValues([client], 'Unknown', { clientId: 'x' }), { Client: '' }, 'a model that doesn\'t name it');
});

test('a column that is neither, or a path that can\'t be read, is refused', () => {
    assert.throws(() => listColumns(FIELDS, ['Nope']), (e) => e instanceof ListColumnError && e.code === 'BAD_COLUMN');
    assert.throws(() => listColumns(FIELDS, ['data.__proto__.x']), /can not be read/);
    assert.throws(() => listColumns(FIELDS, ['Order'], 'Claim'), /in Claim/);
    assert.throws(() => listColumns(FIELDS, Array.from({ length: 13 }, (_, i) => `data.f${i}`)), /at most 12/);
});

test('sorting: numbers as numbers, text by its letters, none last either way', () => {
    const rows = [{ v: 10 }, { v: 9 }, { v: null }, { v: 100 }];
    assert.deepEqual(sortRecords(rows, r => r.v, 1).map(r => r.v), [9, 10, 100, null]);
    assert.deepEqual(sortRecords(rows, r => r.v, -1).map(r => r.v), [100, 10, 9, null]);
    assert.deepEqual(sortRecords([{ v: 'b' }, { v: 'A' }, { v: 'c' }], r => r.v, 1).map(r => r.v), ['A', 'b', 'c']);
    assert.equal(sortOrder(undefined, -1), -1);
    assert.equal(sortOrder('asc', -1), 1);
    assert.throws(() => sortOrder('up', 1), (e) => e.code === 'BAD_SORT');
});

test('a filter on a data field, and more or less than', () => {
    assert.deepEqual(labelQuery(FIELDS, { field: 'data.amount', op: 'gt', value: '100' }), { $and: [{ 'data.amount': { $gt: 100 } }] });
    assert.deepEqual(labelQuery(FIELDS, { field: 'data.when', op: 'lt', value: '2026-01-01' }), { $and: [{ 'data.when': { $lt: '2026-01-01' } }] });
    assert.deepEqual(labelQuery(FIELDS, { field: 'Order', op: 'gt', value: '5' }), { $and: [{ $or: [{ name: 'Order', 'data.orderNo': { $gt: 5 } }] }] });
});
