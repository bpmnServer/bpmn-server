// The storage port's shared query semantics, the models datastore's files, and upgrade through
// the data store's typed operation.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { DocumentQuery, MemoryDocumentStore, DuplicateKeyError } from '../dist/index.js';
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

test('queries: an operator the store does not know is refused, not ignored', () => {
  assert.throws(() => DocumentQuery.matches(doc, { name: { $regex: 'cl' } }), /Unsupported query operator \$regex/);
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

test('a data store whose db is replaced after it was made locks in the replacement (as a test, or an application, may replace it)', async () => {
  const { server } = await makeServer();
  const replacement = new MemoryDocumentStore();
  server.dataStore.db = replacement;
  await server.dataStore.locker.lock('i-1');
  assert.equal((await replacement.find('bpmn_test', 'wf_locks', { id: 'i-1' })).length, 1);
  await server.dataStore.locker.release('i-1');
  await server.shutdown();
});
