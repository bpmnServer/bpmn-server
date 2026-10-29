// Stress: many requests at once. Each test checks that every instance comes out right (its own data,
// its own path, no lock left behind); the last one measures how throughput and latency hold up as more
// requests run together. Settings in ./setup.mjs (LOAD_SCALE, LOAD_MONGO_URL).
import test from 'node:test';
import assert from 'node:assert/strict';
import { performance } from 'node:perf_hooks';

import { ItemNotWaitingError } from '../../dist/index.js';
import { DB, STORE, n, loadServer, freshStore, expense, claim, payment, coverageAfter } from './setup.mjs';

async function noLocksLeft(store) {
  assert.deepEqual(await store.find(DB, 'wf_locks', { kind: 'lock' }), [], 'every instance lock was released');
}

const elements = doc => doc.items.map(it => it.elementId);

test(`hundreds of processes run at once, each with its own data (${STORE})`, async () => {
  const { server, store } = await loadServer();
  const N = n(300);
  const ids = await Promise.all(Array.from({ length: N }, (_, i) => expense(server, i)));
  assert.equal(new Set(ids).size, N);

  const docs = await server.dataStore.findInstances({ name: 'expense-approval' }, 'full');
  assert.equal(docs.length, N);
  for (const doc of docs) {
    const i = Number(doc.data.requester.slice(4));
    assert.equal(doc.status, 'end', `instance of user${i} ended`);
    assert.deepEqual(doc.data, { requester: 'user' + i, amount: i, approvedBy: 'boss' + i }, 'no data from another instance');
    assert.deepEqual(elements(doc), ['ExpenseRaised', 'toSubmit', 'SubmitExpense', 'toApprove', 'ApproveExpense', 'toPaid', 'ExpensePaid']);
  }
  await noLocksLeft(store);
  await server.shutdown();
});

test('different processes mixed together, with service tasks awaiting I/O, each take their own path', async () => {
  const { server, store } = await loadServer({ services: coverageAfter(5) });
  const N = n(100);
  const runs = [];
  for (let i = 0; i < N; i++) runs.push(expense(server, i), claim(server, i), payment(server, i));
  await Promise.all(runs);

  const claims = await server.dataStore.findInstances({ name: 'property-claim' }, 'full');
  assert.equal(claims.length, N);
  for (const doc of claims) {
    const i = doc.data.claimNo;
    assert.equal(doc.status, 'end');
    assert.equal(doc.data.covered, i % 2 === 0, `claim ${i} kept its own coverage answer`);
    assert.ok(elements(doc).includes(i % 2 === 0 ? 'Settled' : 'Rejected'), `claim ${i} ended on its own branch`);
    if (i % 2 === 0) assert.equal(doc.data.paid, i);
  }
  const payments = await server.dataStore.findInstances({ name: 'payment-intake' }, 'full');
  assert.equal(payments.length, N);
  for (const doc of payments) assert.equal(doc.data.filed, Number(doc.data.ref.slice(1)));
  assert.equal((await server.dataStore.findInstances({ name: 'expense-approval', status: 'end' })).length, N);
  await noLocksLeft(store);
  await server.shutdown();
});

test('service tasks awaiting I/O overlap across instances instead of queueing', async (t) => {
  let io = 0;
  const { server } = await loadServer({ services: coverageAfter(() => io) });
  const N = n(50), IO = 20;
  const burst = async () => {
    const t0 = performance.now();
    await Promise.all(Array.from({ length: N }, (_, i) => server.engine.start('property-claim', { claimNo: i, covered: true })));
    return performance.now() - t0;
  };
  await burst();   // warm up
  io = 0; const without = await burst();
  io = IO; const withIO = await burst();
  t.diagnostic(`${N} claims at once: ${without.toFixed(0)} ms; ${withIO.toFixed(0)} ms when each service waits ${IO} ms`);
  // one after another the waits would add N x IO ms; overlapped, they add about one wait
  assert.ok(withIO - without < N * IO / 4, `the waits added ${(withIO - without).toFixed(0)} ms (queued they would add ${N * IO} ms)`);
  await server.shutdown();
});

test('many requests for the same task at once: exactly one goes through', async () => {
  const { server, store } = await loadServer({ locks: { retryDelay: 5, maxTries: 400 } });
  const ROUNDS = n(20), CALLERS = 20;
  for (let r = 0; r < ROUNDS; r++) {
    const { instance } = await server.engine.start('expense-approval', {});
    const results = await Promise.allSettled(Array.from({ length: CALLERS }, (_, c) =>
      server.engine.invoke({ id: instance.id, 'items.elementId': 'SubmitExpense' }, { caller: c })));
    const won = results.filter(x => x.status === 'fulfilled');
    assert.equal(won.length, 1, 'one caller completed the task');
    for (const lost of results.filter(x => x.status === 'rejected'))
      assert.ok(lost.reason instanceof ItemNotWaitingError, `the others are told the task is done: ${lost.reason?.message}`);

    const [doc] = await server.dataStore.findInstances({ id: instance.id }, 'full');
    assert.equal(doc.items.filter(it => it.elementId === 'SubmitExpense').length, 1, 'the task ran once');
    assert.equal(doc.items.filter(it => it.elementId === 'ApproveExpense').length, 1, 'the next task was created once');
    assert.equal(typeof doc.data.caller, 'number');
  }
  await noLocksLeft(store);
  await server.shutdown();
});

test('servers sharing one database take turns on the same instances', async () => {
  const store = await freshStore();
  const servers = [];
  for (const serverId of ['s1', 's2', 's3']) servers.push((await loadServer({ store, serverId, locks: { retryDelay: 5, maxTries: 400 } })).server);
  const N = n(150);
  // each process moves between servers: started on one, its tasks completed on the others
  await Promise.all(Array.from({ length: N }, (_, i) => expense(servers[0], i, servers)));
  const docs = await servers[1].dataStore.findInstances({ name: 'expense-approval' }, 'full');
  assert.equal(docs.length, N);
  for (const doc of docs) {
    assert.equal(doc.status, 'end');
    assert.equal(doc.data.amount, Number(doc.data.requester.slice(4)));
  }
  await noLocksLeft(store);
  for (const s of servers) await s.shutdown();
});

test('throughput holds up as more requests run together', async (t) => {
  const TOTAL = n(300), rows = [];
  for (const concurrency of [1, 10, 50, 200]) {
    // a server of its own per level, so the store's size is the same for each
    const { server } = await loadServer();
    for (let i = 0; i < 30; i++) await expense(server, i);   // warm up
    const latencies = [];
    let next = 0;
    const worker = async () => {
      while (next < TOTAL) {
        const i = next++;
        const t0 = performance.now();
        await expense(server, i);
        latencies.push(performance.now() - t0);
      }
    };
    const t0 = performance.now();
    await Promise.all(Array.from({ length: concurrency }, worker));
    const seconds = (performance.now() - t0) / 1000;
    latencies.sort((a, b) => a - b);
    const p = q => latencies[Math.min(latencies.length - 1, Math.floor(latencies.length * q))];
    rows.push({ concurrency, perSecond: TOTAL / seconds, p50: p(0.5), p95: p(0.95), max: latencies.at(-1) });
    await server.shutdown();
  }
  for (const r of rows)
    t.diagnostic(`${String(r.concurrency).padStart(3)} at once: ${r.perSecond.toFixed(0)} processes/s, latency p50 ${r.p50.toFixed(1)} ms, p95 ${r.p95.toFixed(1)} ms, max ${r.max.toFixed(0)} ms`);

  const alone = rows[0].perSecond;
  for (const r of rows.slice(1))
    assert.ok(r.perSecond > alone * 0.5, `${r.concurrency} at once: ${r.perSecond.toFixed(0)}/s against ${alone.toFixed(0)}/s one at a time`);
  // one thread shares its time: a request waits for the others in flight, but not much longer than that
  const last = rows.at(-1);
  const share = last.concurrency / last.perSecond * 1000;
  assert.ok(last.p95 < share * 3, `p95 ${last.p95.toFixed(0)} ms with ${last.concurrency} in flight (${share.toFixed(0)} ms is their fair share)`);
});
