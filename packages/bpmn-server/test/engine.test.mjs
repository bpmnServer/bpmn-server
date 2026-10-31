// The engine through its public API, on the in-memory storage adapter: a workflow end to end,
// recovery across servers, cancellation, versions, locking, timers, lifecycle and shutdown.
import test from 'node:test';
import assert from 'node:assert/strict';
import { MemoryDocumentStore, InstanceLocker, DuplicateKeyError, BPMNServer, ItemNotWaitingError, SecureUser } from '../dist/index.js';
import { makeServer, coverage, until, TestDelegate } from './helpers.mjs';

const waiting = (execution) => execution.instance.items.filter(i => i.status === 'wait').map(i => i.elementId);

test('a covered claim runs end to end: service, gateway, user task with its group, message', async () => {
  const { server } = await makeServer({ services: coverage(true) });
  const started = await server.engine.start('property-claim', { claimId: 'C-1' });
  assert.deepEqual(waiting(started), ['AssessClaim']);
  const task = started.instance.items.find(i => i.elementId === 'AssessClaim');
  assert.equal(task.candidateGroups, 'assessor');

  const assessed = await server.engine.invoke({ 'items.id': task.id }, { assessment: 'pay' }, 'ana');
  assert.deepEqual(waiting(assessed), ['PaymentConfirmed']);
  assert.equal(assessed.instance.data.assessment, 'pay');

  const confirmed = await server.engine.throwMessage('PaymentConfirmed', { paid: 1200 }, { id: started.id });
  assert.equal(confirmed.instance.status, 'end');
  assert.ok(confirmed.instance.items.some(i => i.elementId === 'Settled' && i.status === 'end'));
  await server.shutdown();
});

test('an uncovered claim takes the default flow and is rejected', async () => {
  const { server } = await makeServer({ services: coverage(false) });
  const done = await server.engine.start('property-claim', { claimId: 'C-2' });
  assert.equal(done.instance.status, 'end');
  assert.ok(done.instance.items.some(i => i.elementId === 'Rejected'));
  await server.shutdown();
});

test('a waiting instance survives its server: another server on the same store continues it', async () => {
  const store = new MemoryDocumentStore();
  const a = await makeServer({ store, services: coverage(true), serverId: 'a' });
  const started = await a.server.engine.start('property-claim', { claimId: 'C-3', policy: { id: 'P-9' } });
  const task = started.instance.items.find(i => i.elementId === 'AssessClaim');
  await a.server.shutdown();

  const b = await makeServer({ store, dir: a.dir, services: coverage(true), serverId: 'b' });
  const continued = await b.server.engine.invoke({ 'items.id': task.id }, { assessment: 'pay' });
  assert.deepEqual(waiting(continued), ['PaymentConfirmed']);
  assert.deepEqual(continued.instance.data.policy, { id: 'P-9' });
  assert.equal(continued.instance.source.includes('PropertyClaim'), true, 'the instance keeps the definition it started with');
  await b.server.shutdown();
});

test('each save is one version, starting at 0', async () => {
  const { server, store } = await makeServer({ services: coverage(true) });
  const started = await server.engine.start('property-claim', {});
  const [saved] = await store.find('bpmn_test', 'wf_instances', { id: started.id });
  const task = started.instance.items.find(i => i.elementId === 'AssessClaim');
  await server.engine.invoke({ 'items.id': task.id }, {});
  const [after] = await store.find('bpmn_test', 'wf_instances', { id: started.id });
  assert.equal(typeof saved.version, 'number');
  assert.ok(after.version > saved.version);
  await server.shutdown();
});

test('cancel terminates a waiting instance and keeps it; its task is not invoked afterwards', async () => {
  const { server, store } = await makeServer({ services: coverage(true) });
  const events = [];
  server.onLifecycle({ onEvent: (e) => { if (e.type === 'process.terminated') events.push(e.context.id); } });
  const started = await server.engine.start('property-claim', {});
  const task = started.instance.items.find(i => i.elementId === 'AssessClaim');
  const cancelled = await server.engine.cancel({ id: started.id }, 'admin');
  assert.equal(cancelled.instance.status, 'terminated');
  assert.deepEqual(events, [started.id]);
  const [kept] = await store.find('bpmn_test', 'wf_instances', { id: started.id });
  assert.equal(kept.status, 'terminated');
  assert.notEqual(kept.items.find(i => i.id === task.id).status, 'wait');
  await assert.rejects(server.engine.invoke({ 'items.id': task.id }, {}), ItemNotWaitingError);
  await server.shutdown();
});

test('two completions of one task: the second is refused, the process advances once', async () => {
  const store = new MemoryDocumentStore();
  const a = await makeServer({ store, services: coverage(true), serverId: 'a' });
  const b = await makeServer({ store, dir: a.dir, services: coverage(true), serverId: 'b' });
  const started = await a.server.engine.start('property-claim', {});
  const task = started.instance.items.find(i => i.elementId === 'AssessClaim');
  const results = await Promise.allSettled([
    a.server.engine.invoke({ 'items.id': task.id }, { by: 'a' }),
    b.server.engine.invoke({ 'items.id': task.id }, { by: 'b' }),
  ]);
  assert.equal(results.filter(r => r.status === 'fulfilled').length, 1);
  assert.ok(results.find(r => r.status === 'rejected').reason instanceof ItemNotWaitingError);
  const [saved] = await store.find('bpmn_test', 'wf_instances', { id: started.id });
  assert.equal(saved.items.filter(i => i.elementId === 'PaymentConfirmed').length, 1);
  await a.server.shutdown(); await b.server.shutdown();
});

test('locks: one owner at a time, released only by the owner, a stale lock taken over', async () => {
  const store = new MemoryDocumentStore();
  const a = new InstanceLocker(store, { database: 'd', owner: 'a', retryDelay: 5, maxTries: 3, staleAfter: 60_000 });
  const b = new InstanceLocker(store, { database: 'd', owner: 'b', retryDelay: 5, maxTries: 3, staleAfter: 60_000 });
  await a.install();
  await a.lock('i1');
  await assert.rejects(b.lock('i1'), /held by a/);
  await b.release('i1');                       // not b's: nothing released
  await assert.rejects(b.lock('i1'), /held by a/);
  await a.release('i1');
  assert.equal(await b.lock('i1'), true);

  const impatient = new InstanceLocker(store, { database: 'd', owner: 'c', retryDelay: 5, maxTries: 2, staleAfter: 0 });
  await new Promise(r => setTimeout(r, 5));
  assert.equal(await impatient.lock('i1'), true, 'a lock older than the stale age is taken over');
});

test('locks: a storage failure is thrown as it is, not retried as contention', async () => {
  let inserts = 0;
  const broken = Object.assign(new MemoryDocumentStore(), { insert: async () => { inserts++; throw new Error('connection reset'); } });
  const locker = new InstanceLocker(broken, { database: 'd', owner: 'a', retryDelay: 5, maxTries: 5 });
  await assert.rejects(locker.lock('i1'), /connection reset/);
  assert.equal(inserts, 1);
});

test('claims: one claimant per key, across owners', async () => {
  const store = new MemoryDocumentStore();
  await new InstanceLocker(store, { database: 'd', owner: 'a' }).install();
  const claims = await Promise.all(['a', 'b', 'c'].map(o => new InstanceLocker(store, { database: 'd', owner: o }).claim('timer:x:1')));
  assert.deepEqual(claims.filter(Boolean).length, 1);
});

test('a timer fires once and the process continues; scheduled by the server, counted by it', async () => {
  const reminded = [];
  const { server } = await makeServer({ services: { remind: async (input, context) => { reminded.push(context.item.token.execution.id); } } });
  const started = await server.engine.start('reminder', {});
  assert.deepEqual(waiting(started), ['Wait']);
  assert.equal(server.cron.pending, 1);
  await until(async () => (await server.dataStore.findInstance({ id: started.id }, 'summary')).status === 'end', 5000, 'the timer');
  assert.deepEqual(reminded, [started.id]);
  assert.equal(server.cron.counters.fired, 1);
  await server.shutdown();
});

test('a timer left by a stopped server is fired by another, once, though two servers recover it', async () => {
  const store = new MemoryDocumentStore();
  const reminded = [];
  const services = { remind: async (input, context) => { reminded.push(context.item.token.execution.id); } };
  const a = await makeServer({ store, services, serverId: 'a' });
  const started = await a.server.engine.start('reminder', {});
  await a.server.shutdown();                   // its timer is cancelled with it
  assert.equal(a.server.cron.pending, 0);

  const b = await makeServer({ store, dir: a.dir, services, serverId: 'b', cron: true });
  const c = await makeServer({ store, dir: a.dir, services, serverId: 'c', cron: true });
  await until(async () => (await b.server.dataStore.findInstance({ id: started.id }, 'summary')).status === 'end', 6000, 'the recovered timer');
  await new Promise(r => setTimeout(r, 300));
  assert.deepEqual(reminded, [started.id]);
  assert.equal(b.server.cron.counters.fired + c.server.cron.counters.fired, 1);
  await b.server.shutdown(); await c.server.shutdown();
});

test('lifecycle subscribers: told of waits with the item; a failing one neither aborts the execution nor stops the others', async () => {
  const reported = [];
  const logger = { log() {}, info() {}, debug() {}, warn() {}, error(e) { throw e; }, reportError(e) { reported.push(String(e.message ?? e)); }, setOptions() {}, clear() {}, get: () => [], save: async () => {}, saveForInstance: async () => {}, logS() {}, logE() {} };
  const { server } = await makeServer({ services: coverage(true), logger });
  const waits = [];
  server.onLifecycle({ onEvent: () => { throw new Error('subscriber broke'); } });
  const unsubscribe = server.onLifecycle({ onEvent: (e) => { if (e.type === 'wait') waits.push(e.context.item.elementId); } });
  const started = await server.engine.start('property-claim', {});
  assert.deepEqual(waiting(started), ['AssessClaim']);
  assert.deepEqual(waits, ['AssessClaim']);
  assert.ok(reported.some(m => m.includes('subscriber broke')));
  unsubscribe();
  await server.engine.invoke({ 'items.id': started.instance.items.find(i => i.elementId === 'AssessClaim').id }, {});
  assert.deepEqual(waits, ['AssessClaim']);
  await server.shutdown();
});

test('servers are independent: their own listeners, timers and engines', async () => {
  const a = await makeServer({ services: coverage(true) });
  const b = await makeServer({ services: coverage(true) });
  const seen = [];
  a.server.onLifecycle({ onEvent: (e) => { if (e.type === 'process.start') seen.push('a'); } });
  await b.server.engine.start('property-claim', {});
  assert.deepEqual(seen, []);
  assert.notEqual(a.server.engine, b.server.engine);
  assert.notEqual(a.server.cron, b.server.cron);
  await a.server.shutdown(); await b.server.shutdown();
});

test('shutdown: once however often called; waits for a handed-off execution; refuses new calls', async () => {
  let release;
  const gate = new Promise(r => { release = r; });
  const { server, store } = await makeServer({ services: { verifyCoverage: async (input, context) => { await gate; context.item.token.appendData({ covered: false }, context.item); } } });
  const execution = await server.engine.start('property-claim', {}, null, null, { noWait: true });
  const first = server.shutdown();
  const second = server.shutdown();
  assert.equal(first, second);
  await assert.rejects(server.engine.start('property-claim', {}), /shutting down/);
  release();
  await first;
  await execution.worker;
  const [saved] = await store.find('bpmn_test', 'wf_instances', { id: execution.id });
  assert.equal(saved.status, 'end');
  assert.deepEqual(await store.find('bpmn_test', 'wf_locks', {}), [], 'its lock was released');
});

test('a failed start rejects `ready`, and `BPMNServer.create` throws it', async () => {
  const failing = { rebuild: async () => {}, findEvents: async () => { throw new Error('models unreachable'); } };
  await assert.rejects(makeServer({ cron: true, extra: { definitions: () => failing } }), /models unreachable/);
  const { server } = await makeServer();
  const configuration = Object.assign(Object.create(Object.getPrototypeOf(server.configuration)), server.configuration,
    { timers: { pollInterval: 0 }, definitions: () => failing, documentStore: () => new MemoryDocumentStore() });
  await server.shutdown();
  await assert.rejects(BPMNServer.create(configuration, server.logger), /models unreachable/);
});

test('legacy: the constructor, static accessors and a MongoDB default configuration still construct', async () => {
  const { server } = await makeServer();
  assert.equal(BPMNServer.getInstance(), server);
  assert.equal(BPMNServer.engine, server.engine);
  await server.shutdown();
  assert.throws(() => BPMNServer.getInstance(), /not initialized/);
});

test('a failing execution is thrown to the caller as itself, and its lock released', async () => {
  const { server, store } = await makeServer({ services: { verifyCoverage: async () => { throw new TypeError('coverage service down'); } } });
  await assert.rejects(server.engine.start('property-claim', {}), (e) => e instanceof TypeError && /coverage service down/.test(e.message));
  assert.deepEqual(await store.find('bpmn_test', 'wf_locks', { kind: 'lock' }), []);
  await server.shutdown();
});

test('DuplicateKeyError recognises MongoDB-coded errors', () => {
  assert.equal(DuplicateKeyError.is(new DuplicateKeyError()), true);
  assert.equal(DuplicateKeyError.is({ code: 11000 }), true);
  assert.equal(DuplicateKeyError.is(new Error('x')), false);
});

test('a service calling the engine back on its own instance is refused at once, not left waiting for the lock', async () => {
  const seen = [];
  const { server } = await makeServer({
    locks: { retryDelay: 200, maxTries: 50 },
    services: {
      remind: async (input, context) => {
        const began = Date.now();
        try { await server.engine.get({ id: context.item.token.execution.id }); seen.push('allowed'); }
        catch (error) { seen.push([error.name, Date.now() - began < 1000]); }
      },
    },
  });
  const started = await server.engine.start('reminder', {});
  await until(() => seen.length > 0, 5000, 'the service');
  assert.deepEqual(seen, [['ReentrantCallError', true]]);
  await until(async () => (await server.dataStore.findInstance({ id: started.id }, 'summary')).status === 'end', 5000, 'the instance to end');
  await server.shutdown();
});

test('a service is called as its provider\'s method: `this` is the provider', async () => {
  class Provider { constructor() { this.calls = 0; } async remind() { this.calls++; } }
  const provider = new Provider();
  const { server } = await makeServer({ extra: { appDelegate: (s) => Object.assign(new TestDelegate(s), { getServicesProvider: async () => provider }) } });
  const started = await server.engine.start('reminder', {});
  await until(async () => (await server.dataStore.findInstance({ id: started.id }, 'summary')).status === 'end', 5000, 'the timer');
  assert.equal(provider.calls, 1);
  await server.shutdown();
});

test('security rules: the environment\'s bypass is each user\'s own, not latched for the process', () => {
  const before = process.env.ENFORCE_SECURITY;
  try {
    process.env.ENFORCE_SECURITY = 'false';
    const open = new SecureUser({ userName: 'a', userGroups: [] });
    delete process.env.ENFORCE_SECURITY;
    const closed = new SecureUser({ userName: 'b', userGroups: [] });
    assert.equal(open.isAdmin(), true);
    assert.equal(closed.isAdmin(), false, 'a user made after it was turned off is not bypassed');
    assert.equal(new SecureUser({ userName: 'c', userGroups: [] }, { enforceSecurity: false }).isAdmin(), true);
  }
  finally { if (before === undefined) delete process.env.ENFORCE_SECURITY; else process.env.ENFORCE_SECURITY = before; }
});

test('a message goes to the instance waiting for it, not to a start event; with none waiting, it starts one', async () => {
  const { server, store } = await makeServer({ services: coverage(true) });
  const claim = await server.engine.start('property-claim', {});
  await server.engine.invoke({ 'items.id': claim.instance.items.find(i => i.elementId === 'AssessClaim').id }, {});
  const delivered = await server.engine.throwMessage('PaymentConfirmed', { paid: 10 }, { id: claim.id });
  assert.equal(delivered.id, claim.id);
  assert.equal(delivered.instance.status, 'end');
  assert.equal((await store.find('bpmn_test', 'wf_instances', { name: 'payment-intake' })).length, 0, 'no instance started over the waiting one');
  const started = await server.engine.throwMessage('PaymentConfirmed', { paid: 20 }, {});
  assert.equal(started.instance.name, 'payment-intake', 'none waits: the start event takes it');
  assert.equal(started.instance.data.paid, 20);
  await server.shutdown();
});

test('a message has one receiver; a signal reaches every instance waiting for it', async () => {
  const { server } = await makeServer({ services: coverage(true) });
  const waiting = [];
  for (let i = 0; i < 2; i++) {
    const c = await server.engine.start('property-claim', {});
    await server.engine.invoke({ 'items.id': c.instance.items.find(x => x.elementId === 'AssessClaim').id }, {});
    waiting.push(c.id);
  }
  await server.engine.throwMessage('PaymentConfirmed', {}, {});
  const still = await server.engine.waitingFor('messageId', 'PaymentConfirmed');
  assert.equal(still.length, 1, 'one of the two received it');
  await server.shutdown();
});

test('start may name the instance (instanceId); the id is unique, as any', async () => {
  const { server } = await makeServer({ services: coverage(true) });
  const named = await server.engine.start('property-claim', {}, null, null, { instanceId: 'wi-42' });
  assert.equal(named.id, 'wi-42');
  assert.equal((await server.dataStore.findInstance({ id: 'wi-42' }, 'summary')).name, 'property-claim');
  await assert.rejects(server.engine.start('property-claim', {}, null, null, { instanceId: 'wi-42' }));
  await server.shutdown();
});
