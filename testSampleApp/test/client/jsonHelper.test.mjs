import test from 'node:test';
import assert from 'node:assert/strict';
import { loadClientScript } from './load.mjs';

const sb = loadClientScript('jsonHelper.js');

test('getTreeData builds a nested <ul>/<li> tree from data', () => {
  const data = [{ name: 'a', children: [{ name: 'b', children: [] }] }];
  const html = sb.getTreeData(data, 'name');
  assert.match(html, /^<ul><li>a<\/li>/);
  assert.match(html, /<li>b<\/li>/);
  // one outer + one inner (for a) + one empty (for b)
  assert.equal((html.match(/<ul>/g) || []).length, 3);
});

test('getJsonValue navigates dotted object paths', () => {
  sb.jsonData = { a: { b: { c: 42 } } };
  assert.equal(sb.getJsonValue('a.b.c'), 42);
});

test('getJsonValue returns null for a missing path', () => {
  sb.jsonData = { a: { b: {} } };
  assert.equal(sb.getJsonValue('a.b.missing'), null);
});

test('getJsonValue resolves array element by id via [id] syntax', () => {
  sb.jsonData = { items: [{ id: 'x', v: 1 }, { id: 'y', v: 2 }] };
  assert.equal(sb.getJsonValue('items.[y].v'), 2);
});

test('getJsonValue resolves array element by custom key via [key=val]', () => {
  sb.jsonData = { items: [{ ref: 'x', v: 1 }, { ref: 'y', v: 2 }] };
  assert.equal(sb.getJsonValue('items.[ref=y].v'), 2);
});

test('setJsonValue creates intermediate nodes then reads back', () => {
  sb.jsonData = {};
  sb.setJsonValue('a.b.c', 7);
  assert.equal(sb.getJsonValue('a.b.c'), 7);
});

test('setJsonValue creates an array when next segment is [..]', () => {
  sb.jsonData = {};
  sb.setJsonValue('list.[k1].name', 'one');
  assert.ok(Array.isArray(sb.jsonData.list), 'list became an array');
  assert.equal(sb.getJsonValue('list.[k1].name'), 'one');
});

test('getObject appends [id] and returns the matching element', () => {
  sb.jsonData = { items: [{ id: 'a', n: 1 }, { id: 'b', n: 2 }] };
  assert.deepEqual(sb.getObject('items', 'b'), { id: 'b', n: 2 });
});

test('getItemValue returns the requested field of an element (no dead code after return)', () => {
  sb.jsonData = { items: [{ id: 'a', color: 'red' }] };
  assert.equal(sb.getItemValue('items', 'a', 'color'), 'red');
});
