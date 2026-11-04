// @features: sqlite
// The SQLite adapter of the storage port: the in-memory store's semantics on a file, dates kept, the file
// reopened, and two connections to one file (two servers) sharing unique indexes, locks and instances.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { SqliteDocumentStore, MemoryDocumentStore, InstanceLocker, DuplicateKeyError } from '../dist/index.js';
import { makeServer, coverage } from './helpers.mjs';

const file = () => path.join(fs.mkdtempSync(path.join(os.tmpdir(), 'bpmn-sqlite-')), 'test.db');
const doc = { id: 'i1', name: 'claim', status: 'wait', data: { amount: 5 }, items: [{ id: 'a', status: 'end', tags: ['x'] }, { id: 'b', status: 'wait', timeDue: '2026-10-21T10:00:00.000Z' }] };

test('queries mean what they mean on the in-memory store', async () => {
  const sqlite = new SqliteDocumentStore(file()), memory = new MemoryDocumentStore();
  const docs = [doc, { id: 'i2', name: 'other', status: 'end', data: { amount: 7 }, items: [{ id: 'c', status: 'wait' }] },
    { id: 'i3', name: ['claim', 'tagged'], status: 'wait', items: { id: 'a', status: 'wait' } }];
  for (const store of [sqlite, memory]) await store.insert('d', 'c', docs);
  const queries = [
    {}, { id: 'i1' }, { name: 'claim' }, { 'items.id': 'a' }, { 'items.status': 'wait' }, { 'items.id': 'c', status: 'end' },
    { 'data.amount': 5 }, { 'data.amount': { $gte: 6 } }, { items: { $elemMatch: { id: 'a', status: 'wait' } } },
    { $or: [{ name: 'other' }, { 'items.tags': 'x' }] }, { 'items.timeDue': { $lt: new Date('2026-10-22') } },
    { 'items.timeDue': '2026-10-21T10:00:00Z' }, { status: { $in: ['end'] } }, { 'items.0.id': 'a' }, { id: 'none' },
  ];
  for (const query of queries) {
    const ids = async (store) => (await store.find('d', 'c', query, null, { id: 1 })).map(d => d.id);
    assert.deepEqual(await ids(sqlite), await ids(memory), JSON.stringify(query));
    assert.equal(await sqlite.count('d', 'c', query), await memory.count('d', 'c', query), 'count ' + JSON.stringify(query));
  }
  await assert.rejects(sqlite.find('d', 'c', { name: { $regex: 'cl' } }), /Unsupported query operator/);
  await sqlite.close();
});

test('copies in and out, projections, updates, upsert, remove, unique indexes', async () => {
  const store = new SqliteDocumentStore(file());
  await store.createIndex('d', 'c', { id: 1 }, { unique: true });
  const original = { id: 'x', nested: { n: 1 } };
  await store.insert('d', 'c', [original]);
  original.nested.n = 2;
  const [read] = await store.find('d', 'c', { id: 'x' }, { nested: 1 });
  assert.deepEqual(read.nested, { n: 1 });
  assert.equal(read.id, undefined);
  await assert.rejects(store.insert('d', 'c', [{ id: 'x' }]), DuplicateKeyError);
  await assert.rejects(store.insert('d', 'c', [{ id: 'y1' }, { id: 'y1' }]), DuplicateKeyError);
  assert.equal((await store.find('d', 'c', { id: 'y1' })).length, 0, 'all of an insert, or none');
  assert.equal(await store.update('d', 'c', { id: 'y' }, { $set: { v: 1 } }, { upsert: true }), 1);
  assert.equal(await store.update('d', 'c', { id: 'y' }, { $set: { v: 2 }, $inc: { n: 1 } }), 1);
  assert.deepEqual((await store.find('d', 'c', { id: 'y' }, { _id: 0 }))[0], { id: 'y', v: 2, n: 1 });
  await assert.rejects(store.update('d', 'c', { id: 'y' }, { $set: { id: 'x' } }), DuplicateKeyError);
  assert.equal(await store.update('d', 'c', { id: 'none' }, { $set: { v: 1 } }), 0);
  assert.deepEqual(await store.remove('d', 'c', { id: 'y' }), { deletedCount: 1 });
  assert.deepEqual(await store.remove('d', 'c', {}), { deletedCount: 1 });
  await store.close();
});

test('unique indexes of several fields: a missing field counts as null, a document with none of them is not indexed', async () => {
  const store = new SqliteDocumentStore(file());
  await store.createIndex('d', 'models', { name: 1, owner: 1 }, { unique: true });
  await store.insert('d', 'models', [{ name: 'a' }, { name: 'a', owner: 'u1' }, { other: 1 }, { other: 2 }]);
  await assert.rejects(store.insert('d', 'models', [{ name: 'a', owner: null }]), DuplicateKeyError, 'a missing owner is null');
  await assert.rejects(store.insert('d', 'models', [{ name: 'a', owner: 'u1' }]), DuplicateKeyError);
  await store.close();
});

test('dates are kept as dates; the file keeps everything when reopened', async () => {
  const name = file();
  const store = new SqliteDocumentStore(name);
  const at = new Date('2026-11-02T10:00:00.000Z');
  await store.insert('d', 'c', [{ id: 'x', at, items: [{ at }] }]);
  await store.close();
  const again = new SqliteDocumentStore(name);
  const [read] = await again.find('d', 'c', { at: { $gte: new Date('2026-11-01') } });
  assert.ok(read.at instanceof Date && read.items[0].at instanceof Date);
  assert.equal(read.at.getTime(), at.getTime());
  assert.equal((await again.find('d', 'c', { at: '2026-11-02T10:00:00.000Z' })).length, 1, 'an ISO string matches the date');
  await again.close();
});

test('two connections to one file: a unique index, locks and claims hold across them', async () => {
  const name = file();
  const one = new SqliteDocumentStore(name), two = new SqliteDocumentStore(name);
  await one.createIndex('d', 'c', { id: 1 }, { unique: true });
  await one.insert('d', 'c', [{ id: 'x' }]);
  await assert.rejects(two.insert('d', 'c', [{ id: 'x' }]), DuplicateKeyError);

  const a = new InstanceLocker(one, { database: 'd', owner: 'a', retryDelay: 5, maxTries: 3, staleAfter: 60_000 });
  const b = new InstanceLocker(two, { database: 'd', owner: 'b', retryDelay: 5, maxTries: 3, staleAfter: 60_000 });
  await a.install();
  await a.lock('i1');
  await assert.rejects(b.lock('i1'), /held by a/);
  await a.release('i1');
  assert.equal(await b.lock('i1'), true);
  const claims = await Promise.all([a.claim('timer:x:1'), b.claim('timer:x:1')]);
  assert.equal(claims.filter(Boolean).length, 1);
  await one.close(); await two.close();
});

test('a server on a file; another server, on its own connection, continues the instance', async () => {
  const name = file();
  const a = await makeServer({ store: new SqliteDocumentStore(name), services: coverage(true), serverId: 'a' });
  const started = await a.server.engine.start('property-claim', { claimId: 'C-1' });
  const task = started.instance.items.find(i => i.elementId === 'AssessClaim');
  assert.equal(await a.server.dataStore.countInstances({ 'items.status': 'wait' }), 1);

  const b = await makeServer({ store: new SqliteDocumentStore(name), dir: a.dir, services: coverage(true), serverId: 'b' });
  const continued = await b.server.engine.invoke({ 'items.id': task.id }, { assessment: 'pay' });
  assert.equal(continued.instance.data.claimId, 'C-1');
  assert.ok(continued.instance.items.some(i => i.elementId === 'PaymentConfirmed' && i.status === 'wait'));
  const [seen] = await a.server.dataStore.findInstances({ id: started.id }, 'full');
  assert.ok(seen.items.some(i => i.elementId === 'PaymentConfirmed'), 'the first server reads what the second saved');
  await a.server.shutdown(); await b.server.shutdown();
});
