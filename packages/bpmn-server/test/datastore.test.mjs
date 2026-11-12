// @features: memory-store, queries
// The storage port's shared query semantics, the models datastore's files, and upgrade through
// the data store's typed operation.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { DocumentQuery, DocumentPager, MemoryDocumentStore, DuplicateKeyError } from '../dist/index.js';
import { makeServer, coverage } from './helpers.mjs';

const doc = { id: 'i1', name: 'claim', status: 'wait', data: { amount: 5 }, items: [{ id: 'a', status: 'end', tags: ['x'] }, { id: 'b', status: 'wait', timeDue: '2026-10-21T10:00:00.000Z' }] };

test('queries: dotted paths into arrays, $elemMatch, $or/$nor, comparisons, $exists, $in', () => {
  const m = (q) => DocumentQuery.matches(doc, q);
  assert.equal(m({ 'items.status': 'wait' }), true);
  assert.equal(m({ items: { $elemMatch: { id: 'a', status: 'wait' } } }), false);
  assert.equal(m({ items: { $elemMatch: { id: 'b', status: 'wait' } } }), true);
  assert.equal(m({ $nor: [{ items: { $elemMatch: { id: 'c' } } }] }), true);
  assert.equal(m({ $or: [{ name: 'other' }, { 'data.amount': { $gte: 5 } }] }), true);
  assert.equal(m({ 'items.timeDue': { $exists: true } }), true);
  assert.equal(m({ 'items.timeDue': { $lt: new Date('2026-10-22') } }), true, 'an ISO string compares as a date');
  assert.equal(m({ 'items.tags': 'x' }), true);
  assert.equal(m({ status: { $in: ['end', 'wait'] }, 'data.missing': { $exists: false } }), true);
});

test('queries: null matches an array element without the field, as in MongoDB; $exists counts only fields there', () => {
  const task = { items: [{ id: 'a', assignee: 'sam' }, { id: 'b' }] };
  const m = (q, d = task) => DocumentQuery.matches(d, q);
  assert.equal(m({ 'items.assignee': null }), true, 'item b has no assignee');
  assert.equal(m({ 'items.assignee': null }, { items: [{ assignee: 'sam' }] }), false);
  assert.equal(m({ 'items.candidateUsers': { $exists: true } }), false, 'no item has the field');
  assert.equal(m({ 'items.candidateUsers': { $exists: false } }), true);
  assert.equal(m({ 'items.assignee': { $exists: true } }), true);
  assert.equal(m({ 'items.assignee': { $ne: null } }), false, 'item b\'s is null');
  assert.deepEqual(DocumentQuery.sort([{ items: [{}, { n: 2 }] }, { items: [{ n: 1 }] }], { 'items.n': 1 }).map(d => d.items.at(-1).n), [1, 2]);
});

test('queries: an operator the store does not know is refused, not ignored', () => {
  // $regex is known since 3.7 (sqlite-store.test.mjs); these are not
  assert.throws(() => DocumentQuery.matches(doc, { name: { $where: 'cl' } }), /Unsupported query operator \$where/);
  assert.throws(() => DocumentQuery.matches(doc, { $where: 'true' }), /Unsupported/);
});

test('the memory store: copies in and out, projections, upsert, unique indexes', async () => {
  const store = new MemoryDocumentStore();
  await store.createIndex('d', 'c', { id: 1 }, { unique: true });
  const original = { id: 'x', nested: { n: 1 } };
  await store.insert('d', 'c', [original]);
  original.nested.n = 2;
  const [read] = await store.find('d', 'c', { id: 'x' }, { nested: 1 });
  assert.deepEqual(read.nested, { n: 1 });
  assert.equal(read.id, undefined);
  await assert.rejects(store.insert('d', 'c', [{ id: 'x' }]), DuplicateKeyError);
  assert.equal(await store.update('d', 'c', { id: 'y' }, { $set: { v: 1 } }, { upsert: true }), 1);
  assert.equal((await store.find('d', 'c', { id: 'y' }))[0].v, 1);
});

test('models: saved whole (no temporary file left), a model that does not parse leaves the files, the SVG is optional', async () => {
  const { server, dir } = await makeServer();
  const source = fs.readFileSync(dir + 'reminder.bpmn', 'utf8');
  await server.definitions.save('copied', source);
  assert.equal(fs.readFileSync(dir + 'copied.bpmn', 'utf8'), source);
  assert.deepEqual(fs.readdirSync(dir).filter(f => f.endsWith('.tmp')), []);
  assert.equal(await server.definitions.getSVG('copied'), null);
  await assert.rejects(server.definitions.save('broken', '<not-bpmn'));
  assert.equal(fs.existsSync(dir + 'broken.bpmn'), false);
  await assert.rejects(server.definitions.getSource('absent'), /No process definition named absent/);
  await server.shutdown();
});

test('upgrade: only instances that have not reached the given nodes take the new source', async () => {
  const { server, store, dir } = await makeServer({ services: coverage(true) });
  const early = await server.engine.start('property-claim', {});
  const later = await server.engine.start('property-claim', {});
  await server.engine.invoke({ 'items.id': later.instance.items.find(i => i.elementId === 'AssessClaim').id }, {});
  const changed = fs.readFileSync(dir + 'property-claim.bpmn', 'utf8').replace('name="Assess claim"', 'name="Assess the claim"');
  await server.definitions.save('property-claim', changed);
  const upgraded = await server.engine.upgrade('property-claim', ['PaymentConfirmed']);
  assert.deepEqual(upgraded, [early.id]);
  const [e] = await store.find('bpmn_test', 'wf_instances', { id: early.id });
  const [l] = await store.find('bpmn_test', 'wf_instances', { id: later.id });
  assert.ok(e.source.includes('Assess the claim'));
  assert.ok(!l.source.includes('Assess the claim'));
  await server.shutdown();
});

test('paged search on a store that is not MongoDB: pages by a cursor, items unwound, the last item, the count', async () => {
  const { server } = await makeServer({ services: coverage(true) });
  const ids = [];
  for (let i = 0; i < 5; i++) { ids.push((await server.engine.start('property-claim', { n: i })).id); await new Promise(r => setTimeout(r, 5)); }
  const page1 = await server.dataStore.find({ filter: { name: 'property-claim' }, sort: { startedAt: 1 }, limit: 2, getTotalCount: true });
  assert.equal(page1.error, undefined);
  assert.deepEqual(page1.data.map(d => d.id), ids.slice(0, 2));
  assert.equal(page1.totalCount, 5);
  const page2 = await server.dataStore.find({ filter: { name: 'property-claim' }, sort: { startedAt: 1 }, limit: 2, after: page1.nextCursor });
  const page3 = await server.dataStore.find({ filter: { name: 'property-claim' }, sort: { startedAt: 1 }, limit: 2, after: page2.nextCursor });
  assert.deepEqual([...page2.data, ...page3.data].map(d => d.id), ids.slice(2));
  const waiting = await server.dataStore.find({ filter: { 'items.status': 'wait' }, limit: 10 });
  assert.equal(waiting.data.length, 5);
  assert.ok(waiting.data.every(d => d.items.elementId === 'AssessClaim'), 'one entry per matching item, `items` being it');
  const last = await server.dataStore.find({ filter: {}, lastItem: { status: 'end' }, limit: 10 });
  assert.equal(last.data.length, 5);
  for (const d of last.data) {
    const expected = d.items.filter(i => i.status === 'end').sort((x, y) => y.seq - x.seq)[0];
    assert.equal(d.lastItem.id, expected.id, 'its ended item with the highest seq');
  }
  await server.shutdown();
});

test('a page of a list in the store: find\'s limit after sorting, on both stores; instances with a limit; items read lean (fable-review.md H5)', async () => {
  const fs = await import('node:fs'), os = await import('node:os'), path = await import('node:path');
  const { SqliteDocumentStore } = await import('../dist/index.js');
  const sqlite = new SqliteDocumentStore(path.join(fs.mkdtempSync(path.join(os.tmpdir(), 'bpmn-limit-')), 'l.db'));
  const docs = [3, 1, 4, 2, 5].map(n => ({ id: `i${n}`, n }));
  for (const store of [new MemoryDocumentStore(), sqlite]) {
    await store.insert('d', 'c', docs);
    assert.deepEqual((await store.find('d', 'c', {}, null, { n: -1 }, 2)).map(d => d.n), [5, 4], 'the first two after sorting');
    assert.equal((await store.find('d', 'c', {}, null, null)).length, 5, 'no limit: all');
  }

  const { server } = await makeServer({ services: coverage(true) });
  for (let i = 0; i < 3; i++) { await server.engine.start('property-claim', { n: i, big: 'x'.repeat(1000) }); await new Promise(r => setTimeout(r, 5)); }
  const newest = await server.dataStore.findInstances({ name: 'property-claim' }, { projection: { id: 1, startedAt: 1 }, sort: { startedAt: -1 }, limit: 2 });
  assert.equal(newest.length, 2);
  assert.ok(new Date(newest[0].startedAt) >= new Date(newest[1].startedAt), 'newest first');
  assert.equal(newest[0].items, undefined, 'only what was asked for');

  const lean = await server.dataStore.findItems({ 'items.status': 'wait' }, { lean: true });
  const whole = await server.dataStore.findItems({ 'items.status': 'wait' });
  assert.deepEqual(lean.map(i => i.id).sort(), whole.map(i => i.id).sort(), 'the same items');
  assert.ok(lean.every(i => i.instanceData === undefined && i.data === undefined && i.instanceId && i.processName), 'without the instances\' data');
  assert.ok(whole.every(i => i.instanceData?.big), 'read whole, as before');
  await server.shutdown();
});

test('counts and backups through the port: with the store\'s count, without it, and what each store keeps', async () => {
  const { server, store } = await makeServer({ services: coverage(true) });
  const first = await server.engine.start('property-claim', {});
  await server.engine.start('property-claim', {});
  await server.engine.invoke({ 'items.id': first.instance.items.find(i => i.elementId === 'AssessClaim').id }, {});
  const counts = async () => [await server.dataStore.countInstances({}), await server.dataStore.countInstances({ items: { $elemMatch: { status: 'wait', elementId: 'AssessClaim' } } })];
  assert.deepEqual(await counts(), [2, 1]);
  assert.equal(await store.count('bpmn_test', 'wf_instances', { name: 'property-claim' }), 2);
  // an adapter without count: the data store counts what find returns
  const { count } = store;
  store.count = undefined;
  try {
    assert.deepEqual(await counts(), [2, 1]);
  } finally {
    store.count = count;
  }

  const engine = await server.dataStore.backup();
  assert.deepEqual(Object.keys(engine).sort(), ['wf_archive', 'wf_instances', 'wf_locks']);
  assert.equal(engine.wf_instances.length, 2);
  const models = await server.definitions.backup();
  assert.deepEqual(Object.keys(models).sort(), ['wf_events', 'wf_models']);
  assert.ok(models.wf_models.some(m => m.name === 'property-claim'));
  await server.shutdown();
});

test('a data store whose db is replaced after it was made locks in the replacement (as a test, or an application, may replace it)', async () => {
  const { server } = await makeServer();
  const replacement = new MemoryDocumentStore();
  server.dataStore.db = replacement;
  await server.dataStore.locker.lock('i-1');
  assert.equal((await replacement.find('bpmn_test', 'wf_locks', { id: 'i-1' })).length, 1);
  await server.dataStore.locker.release('i-1');
  await server.shutdown();
});

test('queries: the rest of the operators', () => {
  const m = (q) => DocumentQuery.matches(doc, q);
  assert.equal(DocumentQuery.matches(doc, null), true, 'no query matches all');
  assert.equal(m({ $and: [{ name: 'claim' }, { status: 'wait' }] }), true);
  assert.equal(m({ $and: [{ name: 'claim' }, { status: 'end' }] }), false);
  assert.throws(() => m({ $or: { name: 'claim' } }), /\$or takes an array of queries/);
  assert.equal(m({ 'data.amount': { $eq: 5 } }), true);
  assert.equal(m({ 'data.amount': { $gt: 4 } }), true);
  assert.equal(m({ 'data.amount': { $gt: 5 } }), false);
  assert.equal(m({ 'data.amount': { $lte: 5 } }), true);
  assert.equal(m({ 'data.missing': { $gt: 1 } }), false, 'nothing there: not greater than anything');
  assert.equal(m({ 'data.amount': { $not: { $gt: 9 } } }), true);
  assert.equal(m({ 'data.amount': { $not: { $gt: 1 } } }), false);
  assert.equal(DocumentQuery.matches({ n: [1, 5] }, { n: { $elemMatch: { $gt: 4 } } }), true, '$elemMatch on plain values');
  assert.equal(DocumentQuery.equal({ a: 1 }, { a: 1 }), true, 'objects by their contents');
  assert.equal(DocumentQuery.equal({ a: 1 }, { a: 2 }), false);
});

test('updates: dotted paths, $unset, $inc, $push; a document replaces, keeping its _id; an unknown operator is refused', () => {
  const start = { _id: 1, a: 1, list: [1] };
  assert.deepEqual(DocumentQuery.apply(start, { $set: { 'b.c.d': 2 } }).b, { c: { d: 2 } });
  assert.equal(DocumentQuery.apply(start, { $unset: { a: '' } }).a, undefined);
  assert.equal(DocumentQuery.apply(start, { $inc: { a: 2, n: 3 } }).a, 3);
  assert.equal(DocumentQuery.apply(start, { $inc: { n: 3 } }).n, 3, 'from nothing');
  assert.deepEqual(DocumentQuery.apply(start, { $push: { list: 2, fresh: 1 } }).list, [1, 2]);
  assert.deepEqual(DocumentQuery.apply(start, { $push: { fresh: 1 } }).fresh, [1], 'a list is made');
  assert.deepEqual(DocumentQuery.apply(start, { x: 1 }), { _id: 1, x: 1 });
  assert.deepEqual(DocumentQuery.apply({ a: 1 }, { x: 1 }), { x: 1 }, 'no _id to keep');
  assert.throws(() => DocumentQuery.apply(start, { $rename: { a: 'b' } }), /Unsupported update operator \$rename/);
  assert.deepEqual(start, { _id: 1, a: 1, list: [1] }, 'the document given is not changed');
});

test('projections, seeds and index keys', () => {
  assert.deepEqual(DocumentQuery.project({ _id: 1, a: 1, b: 2 }, { a: 0 }), { _id: 1, b: 2 }, 'leaving out');
  assert.deepEqual(DocumentQuery.project({ _id: 1, a: 1, b: 2 }, { a: 1, _id: 0 }), { a: 1 });
  assert.deepEqual(DocumentQuery.seed({ a: 1, 'b.c': 2, $or: [], d: { $gt: 1 } }), { a: 1 }, 'only plain equalities');
  assert.deepEqual(DocumentQuery.seed(null), {});
  assert.equal(DocumentQuery.indexKey({ a: 1 }, ['x', 'y']), null, 'none of its fields');
  assert.equal(DocumentQuery.indexKey({ a: 1 }, ['a', 'y']), '[1,null]');
  assert.deepEqual(DocumentQuery.sort([{ a: 1 }, { a: 1 }], { a: 1 }), [{ a: 1 }, { a: 1 }], 'ties keep their places');
});

test('the memory store: remove, count and what it refuses', async () => {
  const store = new MemoryDocumentStore();
  await store.insert('d', 'c', [{ id: 1 }, { id: 2 }]);
  assert.equal((await store.find('d', 'c', { id: 1 })).length, 1);
  assert.equal(await store.count('d', 'c', {}), 2);
  assert.equal((await store.remove('d', 'c', { id: 1 })).deletedCount, 1);
  assert.equal((await store.remove('d', 'c', { id: 9 })).deletedCount, 0);
  assert.equal((await store.find('d', 'nothing', {})).length, 0, 'a collection not made yet is empty');
  assert.equal((await store.remove('d', 'nothing', {})).deletedCount, 0);
  assert.equal(await store.update('d', 'c', { id: 9 }, { $set: { a: 1 } }), 0, 'nothing to update');
  await store.update('d', 'c', { id: 9 }, { $set: { a: 1 } }, { upsert: true });
  assert.equal((await store.find('d', 'c', { id: 9 }))[0].a, 1, 'an upsert starts from the query');
  await store.createIndex('d', 'c', { id: 1 }, { unique: true });
  await assert.rejects(store.insert('d', 'c', [{ id: 9 }]), DuplicateKeyError.is ? (e) => DuplicateKeyError.is(e) : /duplicate/i);
});

test('the paged search: by items, a sort of dates and numbers, a cursor, and an error given as an answer', async () => {
  const store = new MemoryDocumentStore();
  const at = (day) => new Date(`2026-01-0${day}T00:00:00Z`);
  await store.insert('d', 'c', [
    { _id: 'a', name: 'm', n: 1, startedAt: at(1), items: [{ seq: 1, status: 'end', endedAt: at(2) }, { seq: 2, status: 'wait' }] },
    { _id: 'b', name: 'm', n: 2, startedAt: at(3), items: [{ seq: 1, status: 'end', endedAt: at(4) }] },
    { _id: 'c', name: 'o', n: 3, startedAt: at(5) },
  ]);
  const find = (params) => DocumentPager.find(store, 'd', 'c', params);

  assert.deepEqual((await find({ filter: { 'items.status': 'wait' } })).data.map(r => [r._id, r.items.seq]), [['a', 2]], 'one row per item');
  const last = await find({ lastItem: { status: 'end' }, filter: { 'items.seq': 2 } });
  assert.deepEqual(last.data.map(r => r._id), ['a'], 'with an item filter');
  const latest = await find({ latestItem: { status: 'end' }, sort: { n: 1 }, projection: { n: 1 } });
  assert.deepEqual(latest.data.map(r => [r._id, r.latestItem.seq]), [['a', 1], ['b', 1]]);
  assert.equal(latest.data[0].items, undefined, 'projected, with the item chosen');

  const first = await find({ sort: { startedAt: 1 }, limit: 2, getTotalCount: true });
  assert.deepEqual(first.data.map(r => r._id), ['a', 'b']);
  assert.equal(first.totalCount, 3);
  assert.match(first.nextCursor, /^d:\d+\|b$/);
  assert.deepEqual((await find({ sort: { startedAt: 1 }, after: first.nextCursor })).data.map(r => r._id), ['c'], 'after a date');

  const byNumber = await find({ sort: { n: -1 }, limit: 1 });
  assert.equal(byNumber.nextCursor, '3|c');
  assert.deepEqual((await find({ sort: { n: -1 }, after: byNumber.nextCursor })).data.map(r => r._id), ['b', 'a'], 'after a number');
  assert.deepEqual((await find({ sort: { name: 1 }, after: 'm|a' })).data.map(r => r._id), ['b', 'c'], 'after text');
  assert.deepEqual((await find({ sort: { 'data.x': 1 }, after: '1|a', limit: 1 })).data.length, 1, 'a cursor on a dotted path');
  assert.deepEqual((await find({ after: 'b' })).data.map(r => r._id), ['a'], 'after an _id');

  const none = await find({ filter: { name: 'nothing' } });
  assert.deepEqual([none.data, none.nextCursor, none.totalCount], [[], null, 0]);
  const failing = await DocumentPager.find({ find: async () => { throw new Error('the store is down'); } }, 'd', 'c', {});
  assert.deepEqual(failing, { error: 'the store is down' });
});
