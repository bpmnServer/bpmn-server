// One database for instances, archive, models and locks; and the locks' unique index made on first use.
import test from 'node:test';
import assert from 'node:assert/strict';
import { databaseName, InstanceLocker, MemoryDocumentStore } from '../dist/index.js';
import { makeServer } from './helpers.mjs';

test('databaseName: the configured db, else the database in db_url, else the driver default (test)', () => {
  assert.equal(databaseName({ db: 'mine', db_url: 'mongodb://h/other' }), 'mine');
  assert.equal(databaseName({ db_url: 'mongodb://h:27017/artemis' }), 'artemis');
  assert.equal(databaseName({ db_url: 'mongodb://u:p@h1:1,h2:2/artemis?replicaSet=rs&w=majority' }), 'artemis');
  assert.equal(databaseName({ db_url: 'mongodb+srv://u:p@cluster.example.net/wf%2Dprod?retryWrites=true' }), 'wf-prod');
  assert.equal(databaseName({ db_url: 'mongodb://h:27017/?retryWrites=true' }), 'test');
  assert.equal(databaseName({ db_url: 'mongodb://h:27017' }), 'test');
  assert.equal(databaseName(undefined), 'test');
});

test('a configuration naming no db: instances, models and locks all use the database of db_url', async () => {
  const store = new MemoryDocumentStore();
  const { server } = await makeServer({
    store,
    extra: { database: { MongoDB: { db_url: 'mongodb://localhost:27017/artemis' } } },
  });
  assert.equal(server.dataStore.dbConfiguration.db, 'artemis');
  const { instance } = await server.engine.start('expense-approval', { amount: 1 });
  assert.equal((await store.find('artemis', 'wf_instances', { id: instance.id }, null)).length, 1);

  await server.dataStore.locker.lock(instance.id);       // the lock is kept with the instances, not in 'bpmn'
  assert.equal((await store.find('artemis', 'wf_locks', { id: instance.id }, null)).length, 1);
  assert.equal((await store.find('bpmn', 'wf_locks', {}, null)).length, 0);
  await server.dataStore.locker.release(instance.id);
  await server.shutdown();
});

test('locks exclude on a database the setup never ran on: the unique index is made on first use', async () => {
  const store = new MemoryDocumentStore();                 // no install(): no unique index yet
  const options = { database: 'fresh', collection: 'wf_locks', retryDelay: 1, maxTries: 2 };
  const a = new InstanceLocker(store, { ...options, owner: 'server-a' });
  const b = new InstanceLocker(store, { ...options, owner: 'server-b' });

  assert.equal(await a.lock('instance-1'), true);
  await assert.rejects(b.lock('instance-1'), /failed to lock instance instance-1: held by server-a/);
  await a.release('instance-1');
  assert.equal(await b.lock('instance-1'), true);           // free again: the other takes it
  assert.equal(await b.claim('timer-1'), true);             // claims (timers) go through the same index
  assert.equal(await a.claim('timer-1'), false);
});

test('when the index cannot be made, locking goes on and the reason is reported once', async () => {
  const store = new MemoryDocumentStore();
  await store.createIndex('db', 'wf_locks', { id: 1 }, { unique: true }); // it exists; making it again fails here
  const warnings = [];
  store.createIndex = async () => { throw new Error('not authorized to create indexes'); };
  const locker = new InstanceLocker(store, { database: 'db', collection: 'wf_locks', owner: 'x', retryDelay: 1, maxTries: 1, logger: { log() {}, warn: (m) => warnings.push(m) } });
  assert.equal(await locker.lock('i1'), true);
  assert.equal(await locker.lock('i2'), true);
  assert.equal(warnings.length, 1);
  assert.match(warnings[0], /not authorized to create indexes/);
});
