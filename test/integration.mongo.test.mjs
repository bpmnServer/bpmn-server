// Real-server integration test — run in YOUR environment where Mongo is reachable.
//   MONGO_URL="mongodb://localhost:27017" node --test integration.mongo.test.mjs
// Skips itself if MONGO_URL is unset, so it's CI-safe.
import test from 'node:test';
import assert from 'node:assert/strict';
import { MongoDB } from '../dist/datastore/MongoDB.js';

const URL = process.env.MONGO_URL;
const DB = process.env.MONGO_DB || 'bpmn_migration_check';
const COLL = 'esm_migration_probe';
const logger = { log: () => {} };

test('round-trips against a real mongodb server', { skip: !URL && 'MONGO_URL not set' }, async () => {
  const db = new MongoDB({ db_url: URL }, logger);   // exercises the real connect()
  await db.remove(DB, COLL, {});                      // clean slate
  assert.equal(await db.insert(DB, COLL, [{ id: 'x', n: 1 }, { id: 'y', n: 2 }]), 2);
  assert.equal((await db.find(DB, COLL, {})).length, 2);
  assert.equal((await db.find(DB, COLL, { id: 'y' }))[0].n, 2);
  assert.equal(await db.update(DB, COLL, { id: 'x' }, { $set: { n: 99 } }), 1);
  assert.equal((await db.find(DB, COLL, { id: 'x' }))[0].n, 99);
  await db.createIndex(DB, COLL, { id: 1 });          // must not throw / handles re-create
  assert.equal((await db.remove(DB, COLL, {})).deletedCount, 2);
  await (await db.getClient()).close();
});
