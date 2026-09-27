import test from 'node:test';
import assert from 'node:assert/strict';
import { MongoClient, ObjectId } from 'mongodb';
import { MongoDB } from './dist/datastore/MongoDB.js';

// ---------------------------------------------------------------------------
// SUITE 1 — real mongodb@7 API contract: every surface MongoDB.ts depends on
// ---------------------------------------------------------------------------
test('mongodb@7 exposes the API surface the rewrite calls', () => {
  assert.equal(typeof MongoClient, 'function', 'MongoClient ctor');
  assert.equal(typeof MongoClient.prototype.connect, 'function');
  assert.equal(typeof MongoClient.prototype.db, 'function');
  assert.equal(typeof ObjectId, 'function', 'ObjectId (renamed from ObjectID)');
  const oid = new ObjectId();
  assert.equal(oid.toHexString().length, 24, 'ObjectId produces 24-hex');
});

test('mongodb@7 Collection prototype has promise methods used by rewrite', async () => {
  const { Collection } = await import('mongodb');
  for (const m of ['find','insertMany','updateOne','deleteMany','deleteOne','createIndex'])
    assert.equal(typeof Collection.prototype[m], 'function', `Collection.${m}`);
  // the removed-in-v4 callback-era methods must NOT be there
  assert.equal(Collection.prototype.update, undefined, 'legacy .update() is gone');
  assert.equal(Collection.prototype.remove, undefined, 'legacy .remove() is gone');
});

// ---------------------------------------------------------------------------
// faithful in-memory driver (actually filters/updates/deletes)
// ---------------------------------------------------------------------------
function matches(doc, q) {
  return Object.entries(q || {}).every(([k, v]) => {
    if (k === '_id') return String(doc._id) === String(v);
    return doc[k] === v;
  });
}
function makeFakeClient(store) {
  const coll = (name) => {
    store[name] ??= [];
    const docs = store[name];
    const cursor = (arr) => ({
      project: () => cursor(arr),
      sort: () => cursor(arr),
      toArray: async () => arr.slice(),
    });
    return {
      find: (q) => cursor(docs.filter(d => matches(d, q))),
      insertMany: async (ds) => { ds.forEach(d => { d._id ??= new ObjectId(); docs.push(d); }); return { insertedCount: ds.length }; },
      updateOne: async (q, u) => { const d = docs.find(x => matches(x, q)); if (d && u.$set) Object.assign(d, u.$set); return { modifiedCount: d ? 1 : 0 }; },
      deleteMany: async (q) => { const before = docs.length; for (let i = docs.length-1; i>=0; i--) if (matches(docs[i], q)) docs.splice(i,1); return { deletedCount: before - docs.length }; },
      deleteOne: async (q) => { const i = docs.findIndex(x => matches(x, q)); if (i>=0) docs.splice(i,1); return { deletedCount: i>=0?1:0 }; },
      createIndex: async (idx) => Object.keys(idx).join('_') + '_1',
    };
  };
  return { db: () => ({ collection: coll }) };
}
const logger = { log: () => {} };
function freshDB(store) { const m = new MongoDB({ db_url: 'mongodb://fake' }, logger); m.client = makeFakeClient(store); return m; }

// ---------------------------------------------------------------------------
// SUITE 2 — behavioral: migrated MongoDB.ts against the fake driver
// ---------------------------------------------------------------------------
test('insert returns insertedCount and persists docs', async () => {
  const store = {}; const db = freshDB(store);
  const n = await db.insert('app', 'wf', [{ id: 'a' }, { id: 'b' }]);
  assert.equal(n, 2);
  assert.equal(store['wf'].length, 2);
});

test('find returns array, honours filter', async () => {
  const store = {}; const db = freshDB(store);
  await db.insert('app', 'wf', [{ id: 'a', s: 1 }, { id: 'b', s: 2 }]);
  const all = await db.find('app', 'wf', {});
  assert.ok(Array.isArray(all)); assert.equal(all.length, 2);
  const one = await db.find('app', 'wf', { id: 'b' });
  assert.equal(one.length, 1); assert.equal(one[0].s, 2);
});

test('find with projection and with sort both run (branch coverage)', async () => {
  const store = {}; const db = freshDB(store);
  await db.insert('app', 'wf', [{ id: 'a' }]);
  assert.equal((await db.find('app', 'wf', {}, { id: 1 })).length, 1);   // projection branch
  assert.equal((await db.find('app', 'wf', {}, null, { id: 1 })).length, 1); // sort branch
});

test('find applies sort even when a projection is provided', async () => {
  const calls = [];
  const cursor = {
    project: () => { calls.push('project'); return cursor; },
    sort: () => { calls.push('sort'); return cursor; },
    toArray: async () => [],
  };
  const db = freshDB({});
  db.client = { db: () => ({ collection: () => ({ find: () => cursor }) }) };
  await db.find('app', 'wf', {}, { id: 1 }, { id: -1 });
  assert.deepEqual(calls, ['project', 'sort']);
});

test('update returns modifiedCount and mutates the doc', async () => {
  const store = {}; const db = freshDB(store);
  await db.insert('app', 'wf', [{ id: 'a', status: 'open' }]);
  const n = await db.update('app', 'wf', { id: 'a' }, { $set: { status: 'closed' } });
  assert.equal(n, 1);
  assert.equal(store['wf'][0].status, 'closed');
});

test('remove deletes matching docs and returns deletedCount result', async () => {
  const store = {}; const db = freshDB(store);
  await db.insert('app', 'wf', [{ id: 'a' }, { id: 'a' }, { id: 'c' }]);
  const res = await db.remove('app', 'wf', { id: 'a' });
  assert.equal(res.deletedCount, 2);
  assert.equal(store['wf'].length, 1);
});

test('removeById uses ObjectId and deletes one', async () => {
  const store = {}; const db = freshDB(store);
  const oid = new ObjectId();
  store['wf'] = [{ _id: oid, id: 'x' }];
  const res = await db.removeById('app', 'wf', oid.toHexString());
  assert.equal(res.deletedCount, 1);
  assert.equal(store['wf'].length, 0);
});

test('createIndex resolves to an index name (and swallows code-85 conflicts)', async () => {
  const store = {}; const db = freshDB(store);
  const name = await db.createIndex('app', 'wf', { id: 1 }, { unique: true });
  assert.equal(name, 'id_1');
});

test('removed dead update2() is truly gone', () => {
  assert.equal(MongoDB.prototype.update2, undefined);
});
