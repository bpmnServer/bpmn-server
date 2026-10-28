// Speed: budgets for the engine's main operations, set well above today's figures so that only a real
// regression fails them (the figures themselves are printed). CPU time is asserted rather than elapsed
// time where possible, since elapsed time on a shared machine varies about 2x from run to run.
// Settings in ./setup.mjs (LOAD_SCALE, LOAD_MONGO_URL).
import test from 'node:test';
import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import { performance } from 'node:perf_hooks';

import { DB, STORE, MONGO_URL, n, loadServer, expense, claim, coverageAfter, timed } from './setup.mjs';

// today: ~10 ms CPU a process in memory; on a local MongoDB the driver adds its own share
const PROCESS_CPU_BUDGET = MONGO_URL ? 80 : 40;

test(`a process takes little CPU from start to end (${STORE})`, async (t) => {
  const { server } = await loadServer({ services: coverageAfter() });
  for (let i = 0; i < 30; i++) await expense(server, i);   // warm up

  const expenseRun = await timed(i => expense(server, i));
  const claimRun = await timed(i => claim(server, i * 2));   // covered: the service, the gateway, the task, the message
  t.diagnostic(`expense (start + 2 tasks): ${expenseRun.ms.toFixed(1)} ms, CPU ${expenseRun.cpu.toFixed(1)} ms`);
  t.diagnostic(`claim (start + service + gateway + task + message): ${claimRun.ms.toFixed(1)} ms, CPU ${claimRun.cpu.toFixed(1)} ms`);
  assert.ok(expenseRun.cpu < PROCESS_CPU_BUDGET, `expense: ${expenseRun.cpu.toFixed(1)} ms CPU`);
  assert.ok(claimRun.cpu < PROCESS_CPU_BUDGET * 1.5, `claim: ${claimRun.cpu.toFixed(1)} ms CPU`);
  await server.shutdown();
});

test('a model loads quickly', async (t) => {
  const { server } = await loadServer();
  await server.definitions.load('property-claim');
  const run = await timed(() => server.definitions.load('property-claim'), { calls: 100 });
  t.diagnostic(`property-claim: ${run.ms.toFixed(2)} ms a load (read + parse), CPU ${run.cpu.toFixed(2)} ms`);
  assert.ok(run.cpu < 10, `${run.cpu.toFixed(2)} ms CPU a load (2.4 ms before the shared type registry)`);
  await server.shutdown();
});

/** `count` copies of a finished instance, written to the store directly (much faster than running them) */
async function fillStore(server, store, count) {
  const id = await expense(server, 0);
  const [doc] = await store.find(DB, 'wf_instances', { id });
  delete doc._id;
  for (let done = 0; done < count; done += 500) {
    const batch = Array.from({ length: Math.min(500, count - done) }, () => ({
      ...structuredClone(doc), id: randomUUID(), items: doc.items.map(it => ({ ...it, id: randomUUID() })),
    }));
    await store.insert(DB, 'wf_instances', batch);
  }
}

test('a process costs about the same however many instances the store holds', {
  todo: MONGO_URL ? false : 'the in-memory store checks every document on each query and insert; it is meant for tests and small embedded use',
}, async (t) => {
  const { server, store } = await loadServer();
  for (let i = 0; i < 30; i++) await expense(server, i);
  const small = await timed(i => expense(server, i), { rounds: 3, calls: 30 });
  await fillStore(server, store, n(5000));
  const large = await timed(i => expense(server, i), { rounds: 3, calls: 30 });
  t.diagnostic(`with ~30 instances stored: ${small.ms.toFixed(1)} ms a process (CPU ${small.cpu.toFixed(1)}); with ${n(5000)} more: ${large.ms.toFixed(1)} ms (CPU ${large.cpu.toFixed(1)})`);
  assert.ok(large.ms < small.ms * 2 + 5, `${large.ms.toFixed(1)} ms against ${small.ms.toFixed(1)} ms`);
  await server.shutdown();
});

test('finding the waiting tasks among many instances', async (t) => {
  const { server } = await loadServer();
  const N = n(1000);
  for (let i = 0; i < N; i += 50)
    await Promise.all(Array.from({ length: Math.min(50, N - i) }, () => server.engine.start('expense-approval', {})));

  const t0 = performance.now();
  const items = await server.dataStore.findItems({ 'items.elementId': 'SubmitExpense', 'items.status': 'wait' });
  const findMs = performance.now() - t0;
  const t1 = performance.now();
  const instances = await server.dataStore.findInstances({ name: 'expense-approval', status: 'running' }, 'summary');
  const listMs = performance.now() - t1;
  t.diagnostic(`${N} instances waiting: the waiting tasks found in ${findMs.toFixed(0)} ms, the instances listed in ${listMs.toFixed(0)} ms`);
  assert.equal(items.length, N);
  assert.equal(instances.length, N);
  assert.ok(findMs < N * 2, `${findMs.toFixed(0)} ms to find ${N} waiting tasks`);
  assert.ok(listMs < N * 2, `${listMs.toFixed(0)} ms to list ${N} instances`);
  await server.shutdown();
});
