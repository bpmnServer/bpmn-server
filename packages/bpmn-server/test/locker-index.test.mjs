// @features: locking
// The lock's unique index (InstanceLocker.ensureIndex): when it can not be made (a user that may not create indexes),
// locking finds out whether it is there anyway: if two rows of one id can be stored, nothing excludes anyone and
// locking refuses rather than pretends; if not, it says so and locks. And the legacy constructor (a data store),
// releasing a lock held elsewhere, taking over a stale one.
import test from 'node:test';
import assert from 'node:assert/strict';
import { InstanceLocker, MemoryDocumentStore } from '../dist/index.js';

const quietLog = () => { const lines = []; return { lines, logger: { log: m => lines.push(m), warn: m => lines.push('WARN ' + m) } }; };
const noIndexes = (store) => { store.createIndex = async () => { throw new Error('not authorized to create indexes'); }; return store; };

test('no unique index, and none can be made: locking refuses', async () => {
  const store = noIndexes(new MemoryDocumentStore());
  const locker = new InstanceLocker(store, { database: 'd', retryDelay: 1, maxTries: 1 });
  await assert.rejects(locker.lock('i-1'), /Locks can not exclude anyone: no unique index on d\.wf_locks, and it could not be made \(not authorized/);
  assert.deepEqual(await store.find('d', 'wf_locks', {}), [], 'the probe rows removed');
});

test('the index can not be made, but it is there: said, and locks exclude', async () => {
  const store = new MemoryDocumentStore();
  await store.createIndex('d', 'wf_locks', { id: 1 }, { unique: true });
  noIndexes(store);
  const { lines, logger } = quietLog();
  const a = new InstanceLocker(store, { database: 'd', owner: 'a', retryDelay: 1, maxTries: 1, logger });
  const b = new InstanceLocker(store, { database: 'd', owner: 'b', retryDelay: 1, maxTries: 1 });
  assert.equal(await a.lock('i-1'), true);
  assert.match(lines.join(), /WARN the unique index on d\.wf_locks could not be made .*it is there, and locks exclude/);
  await assert.rejects(b.lock('i-1'), /failed to lock instance i-1: held by a since/);
  a.stopRenewing();
});

test('a store that fails otherwise while probing: that error, not a guess', async () => {
  const store = noIndexes(new MemoryDocumentStore());
  store.insert = async () => { throw new Error('disk full'); };
  await assert.rejects(new InstanceLocker(store, { database: 'd', retryDelay: 1, maxTries: 1 }).lock('i-1'), /disk full/);
});

test('the legacy constructor (a data store); a lock released by one not holding it; a stale lock taken over', async () => {
  const store = new MemoryDocumentStore();
  const { lines, logger } = quietLog();
  const legacy = new InstanceLocker({ db: store, dbConfiguration: { db: 'old', Locks_collection: 'my_locks' }, logger });
  assert.equal(await legacy.lock('i-1'), true);
  assert.equal((await store.find('old', 'my_locks', { id: 'i-1' })).length, 1, 'its database and collection');
  legacy.stopRenewing();

  const other = new InstanceLocker(store, { database: 'old', collection: 'my_locks', owner: 'other', logger, staleAfter: 0, retryDelay: 1, maxTries: 2 });
  await other.release('i-1');
  assert.match(lines.join('\n'), /lock i-1 was not held by other: nothing released/);
  await new Promise(resolve => setTimeout(resolve, 5));
  assert.equal(await other.lock('i-1'), true, 'stale: taken over');
  assert.match(lines.join('\n'), /lock i-1 was stale \(older than 0 ms\): taken over by other/);
  other.stopRenewing();
});
