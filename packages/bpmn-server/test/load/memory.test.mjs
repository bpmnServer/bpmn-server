// Memory: nothing kept after work is done (no leaks), and what is kept while it runs stays bounded.
// Heap is read after full collections. Settings in ./setup.mjs (LOAD_SCALE, LOAD_MONGO_URL).
import test from 'node:test';
import assert from 'node:assert/strict';

import { CacheManager } from '../../dist/index.js';
import { STORE, MONGO_URL, n, sleep, heapUsed, mb, loadServer, expense, claim, coverageAfter } from './setup.mjs';

const kb = bytes => (bytes / 1024).toFixed(1) + ' KB';

/** runs `count` of `fn` with `width` in flight at a time */
async function inBatches(count, width, fn) {
  for (let i = 0; i < count; i += width)
    await Promise.all(Array.from({ length: Math.min(width, count - i) }, (_, k) => fn(i + k)));
}

test(`nothing is left behind once the instances are deleted (${STORE})`, async (t) => {
  const { server } = await loadServer({ services: coverageAfter() });
  await inBatches(50, 25, i => expense(server, i));   // warm up: code compiled, models parsed
  await server.dataStore.deleteInstances({});
  const before = heapUsed();

  const N = n(1000);
  await inBatches(N, 50, async i => { await expense(server, i); await claim(server, i); });
  const during = heapUsed();
  await server.dataStore.deleteInstances({});
  await sleep(50);
  const after = heapUsed();
  t.diagnostic(`${N * 2} processes: heap ${mb(before)} before, ${mb(during)} with them stored, ${mb(after)} once deleted`);
  assert.ok(after - before < 5 * 1048576, `${mb(after - before)} still held after deleting ${N * 2} instances`);
  await server.shutdown();
});

test('starting and stopping servers does not accumulate memory', async (t) => {
  const cycle = async () => {
    const { server } = await loadServer({ services: coverageAfter() });
    await inBatches(20, 10, i => claim(server, i));
    await server.shutdown();
  };
  for (let i = 0; i < 3; i++) await cycle();
  const before = heapUsed();
  const CYCLES = n(20);
  for (let i = 0; i < CYCLES; i++) await cycle();
  const after = heapUsed();
  t.diagnostic(`${CYCLES} servers started, used and shut down: heap ${mb(before)} -> ${mb(after)}`);
  assert.ok(after - before < 5 * 1048576, `${mb(after - before)} more after ${CYCLES} servers`);
});

test('cached instances leave the cache, and memory, when they end', async (t) => {
  const { server } = await loadServer({ extra: { cacheManager: s => new CacheManager(s) } });
  await inBatches(20, 10, i => expense(server, i));
  const before = heapUsed();
  const N = n(500);
  const ids = [];
  await inBatches(N, 50, async i => ids.push((await server.engine.start('expense-approval', { requester: 'user' + i })).instance.id));
  const waiting = heapUsed();
  assert.ok(server.cache.list().length >= N, 'the waiting instances are cached');

  await inBatches(N, 50, async i => {
    await server.engine.invoke({ id: ids[i], 'items.elementId': 'SubmitExpense' }, { amount: i });
    await server.engine.invoke({ id: ids[i], 'items.elementId': 'ApproveExpense' }, {});
  });
  assert.equal(server.cache.list().length, 0, 'ended instances are dropped from the cache');
  await server.dataStore.deleteInstances({});
  const after = heapUsed();
  t.diagnostic(`${N} cached waiting: ${kb((waiting - before) / N)} each; once ended and deleted, heap ${mb(before)} -> ${mb(after)}`);
  assert.ok(after - before < 5 * 1048576, `${mb(after - before)} still held`);
  await server.shutdown();
});

test('a waiting instance costs the server little memory', async (t) => {
  const { server } = await loadServer();
  await inBatches(20, 10, () => server.engine.start('expense-approval', {}));
  const before = heapUsed();
  const N = n(1000);
  await inBatches(N, 50, i => server.engine.start('expense-approval', { requester: 'user' + i }));
  const perInstance = (heapUsed() - before) / N;
  t.diagnostic(`${kb(perInstance)} of heap per waiting instance (${N}, no cache)`);
  // in memory the store itself holds the documents (~28 KB each today); MongoDB holds them out of the process
  const budget = MONGO_URL ? 5 * 1024 : 80 * 1024;
  assert.ok(perInstance < budget, `${kb(perInstance)} per waiting instance`);
  await server.shutdown();
});

test('a burst of concurrent requests uses bounded memory', async (t) => {
  const { server } = await loadServer({ services: coverageAfter(5) });
  await inBatches(20, 10, i => claim(server, i));
  await server.dataStore.deleteInstances({});
  const before = heapUsed();
  let peak = 0;
  const sampler = setInterval(() => { peak = Math.max(peak, process.memoryUsage().heapUsed); }, 2);
  const N = n(500);
  await Promise.all(Array.from({ length: N }, (_, i) => claim(server, i * 2)));   // all covered: every step taken
  clearInterval(sampler);
  const stored = heapUsed() - before;
  await server.dataStore.deleteInstances({});
  const after = heapUsed();
  t.diagnostic(`${N} claims at once: heap peak ${mb(peak)} (${kb((peak - before) / N)} per request in flight, garbage included); ${mb(stored)} stored; ${mb(after)} after`);
  assert.ok((peak - before) / N < 1024 * 1024, `${kb((peak - before) / N)} per request in flight`);
  assert.ok(after - before < 5 * 1048576, `${mb(after - before)} still held after the burst`);
  await server.shutdown();
});
