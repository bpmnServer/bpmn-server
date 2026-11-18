// @features: mongodb, queries
// The paged search on MongoDB (dataStore.find, an aggregation: Aggregate.ts) gives what the other stores' (DocumentPager,
// test/datastore.test.mjs) does, for the same documents: one row per item when items are asked for, the last or the
// latest item, a cursor after a date, a number, text or an _id, the count, nothing found, an error as an answer.
// Runs when BPMN_TEST_MONGO_URL is set (CI provides a MongoDB service); skipped otherwise.
import test from 'node:test';
import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import { MongoClient } from 'mongodb';
import { MongoDB } from '../dist/index.js';
import { makeServer, quiet } from './helpers.mjs';

const URL = process.env.BPMN_TEST_MONGO_URL;
const DB = 'bpmn_paging_' + randomUUID().slice(0, 8);

test('MongoDB: the paged search, as the other stores page', { skip: !URL && 'BPMN_TEST_MONGO_URL is not set' }, async (t) => {
  const client = new MongoClient(URL);
  await client.connect();
  t.after(async () => { await client.db(DB).dropDatabase(); await client.close(); });
  const store = new MongoDB({ db_url: URL }, quiet());
  const { server } = await makeServer({ store, extra: { database: { MongoDB: { db_url: URL, db: DB } } } });
  t.after(async () => { await server.shutdown(); await (await store.getClient()).close(); });

  const at = (day) => new Date(`2026-01-0${day}T00:00:00Z`);
  const instances = client.db(DB).collection('wf_instances');
  await instances.deleteMany({});
  // inserted in order: their ObjectIds rise a, b, c
  for (const doc of [
    { id: 'a', name: 'm', n: 1, startedAt: at(1), items: [{ seq: 1, status: 'end', endedAt: at(2) }, { seq: 2, status: 'wait' }] },
    { id: 'b', name: 'm', n: 2, startedAt: at(3), items: [{ seq: 1, status: 'end', endedAt: at(4) }] },
    { id: 'c', name: 'o', n: 3, startedAt: at(5), items: [] },
  ]) await instances.insertOne(doc);
  const oid = Object.fromEntries((await instances.find({}).toArray()).map(d => [d.id, String(d._id)]));
  const find = (params) => server.dataStore.find(params);
  const ids = result => result.data.map(r => r.id);

  const rows = await find({ filter: { 'items.status': 'wait' } });
  assert.deepEqual(rows.data.map(r => [r.id, r.items.seq]), [['a', 2]], 'one row per item');

  const last = await find({ lastItem: { status: 'end' }, filter: { 'items.seq': 2 }, projection: { id: 1 } });
  assert.deepEqual(ids(last), ['a'], 'the last item, with an item filter');
  const latest = await find({ latestItem: { status: 'end' }, sort: { n: 1 }, projection: { id: 1, n: 1 } });
  assert.deepEqual(latest.data.map(r => [r.id, r.latestItem.seq]), [['a', 1], ['b', 1]], 'the latest item');
  assert.equal(latest.data[0].items, undefined, 'projected, with the item chosen');

  const first = await find({ sort: { startedAt: 1 }, limit: 2, getTotalCount: true });
  assert.deepEqual(ids(first), ['a', 'b']);
  assert.equal(first.totalCount, 3);
  assert.equal(first.nextCursor, `d:${at(3).getTime()}|${oid.b}`);
  assert.deepEqual(ids(await find({ sort: { startedAt: 1 }, after: first.nextCursor })), ['c'], 'after a date');

  const byNumber = await find({ sort: { n: -1 }, limit: 1 });
  assert.equal(byNumber.nextCursor, `3|${oid.c}`);
  assert.deepEqual(ids(await find({ sort: { n: -1 }, after: byNumber.nextCursor })), ['b', 'a'], 'after a number');
  assert.deepEqual(ids(await find({ sort: { name: 1 }, after: `m|${oid.a}` })), ['b', 'c'], 'after text');
  assert.deepEqual(ids(await find({ after: oid.b })), ['a'], 'after an _id (newest first)');

  // by an item's field: the cursor's own instance has items after it too (before, they were left out)
  const items = { 'items.status': { $in: ['end', 'wait'] } };
  const page1 = await find({ filter: items, sort: { 'items.seq': 1 }, limit: 1 });
  assert.deepEqual(page1.data.map(r => [r.id, r.items.seq]), [['a', 1]]);
  assert.equal(page1.nextCursor, `1|${oid.a}`);
  const page2 = await find({ filter: items, sort: { 'items.seq': 1 }, after: page1.nextCursor });
  assert.deepEqual(page2.data.map(r => [r.id, r.items.seq]), [['b', 1], ['a', 2]], 'b\'s first item, then a\'s second');

  const none = await find({ filter: { name: 'nothing' } });
  assert.deepEqual([none.data, none.nextCursor, none.totalCount], [[], null, 0]);
  const failing = await find({ filter: { $bad: 1 } });
  assert.ok(typeof failing.error === 'string' && failing.error.length, `an error is given as an answer: ${failing.error}`);
});
