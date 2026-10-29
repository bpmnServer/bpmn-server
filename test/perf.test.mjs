// Speed and memory guards: what made the engine slow and large, kept from coming back. These check
// structure (no fixed waits, nothing accumulating, one type registry), and one memory ceiling far
// above today's figure; timings are reported by `npm run bench`, not asserted.
import test from 'node:test';
import assert from 'node:assert/strict';
import v8 from 'node:v8';
import vm from 'node:vm';

import { Definition, Logger, CacheManager, DataStore } from '../dist/index.js';
import { makeServer } from './helpers.mjs';

v8.setFlagsFromString('--expose-gc');
const gc = vm.runInNewContext('gc');

/** start, the submit task, the approval task (test/processes/expense-approval.bpmn) */
async function runOne(server) {
  const { instance } = await server.engine.start('expense-approval', { amount: 1 });
  await server.engine.invoke({ id: instance.id, 'items.elementId': 'SubmitExpense' }, { amount: 120 });
  return await server.engine.invoke({ id: instance.id, 'items.elementId': 'ApproveExpense' }, {});
}

test('a process runs without fixed waits between its steps', async () => {
  const { server } = await makeServer();
  await runOne(server);
  const waits = [];
  const realSetTimeout = globalThis.setTimeout;
  globalThis.setTimeout = (f, ms, ...rest) => { if (ms > 0) waits.push(ms); return realSetTimeout(f, ms, ...rest); };
  try {
    const done = await runOne(server);
    assert.equal(done.instance.status, 'end');
  } finally {
    globalThis.setTimeout = realSetTimeout;
  }
  assert.deepEqual(waits, [], 'no timer delays a step (a 10 ms pause per step made a process ~10x slower)');
  await server.shutdown();
});

test('a running process lets other work run between its steps', async () => {
  // release 2.3.3's intent ("avoid code blocking"), kept without its fixed 10 ms per step
  const { server } = await makeServer();
  let turns = 0, running = true;
  const other = () => { if (running) { turns++; setImmediate(other); } };
  setImmediate(other);
  await runOne(server);
  running = false;
  assert.ok(turns >= 4, `other work ran ${turns} times while the process ran`);
  await server.shutdown();
});

test('the logger keeps no messages unless asked', () => {
  const logger = new Logger({ toConsole: false });
  for (let i = 0; i < 1000; i++) logger.log('step', i);
  assert.equal(logger.get().length, 0, 'nothing accumulates (it grew with every step a server ran)');
  assert.equal(logger.log('x').message, 'x', 'a message is still returned to its caller');

  const keeping = new Logger({ toConsole: false, keepMessages: true });
  keeping.log('kept');
  assert.equal(keeping.get().length, 1);
});

test('the per-instance log files still get their messages (logFolder)', () => {
  const before = process.env.logFolder;
  process.env.logFolder = 'some-folder';
  try {
    const logger = new Logger({ toConsole: false });
    logger.log('kept for the file');
    assert.equal(logger.get().length, 1);
  } finally {
    if (before === undefined) delete process.env.logFolder; else process.env.logFolder = before;
  }
});

test('definitions share one BPMN type registry', async () => {
  const { server } = await makeServer();
  const a = await server.definitions.load('expense-approval');
  const b = await server.definitions.load('reminder');
  assert.equal(a.moddle, b.moddle, 'one BpmnModdle (about 190 KB to build) for every definition');
  assert.equal(a.moddle, Definition.moddleFor(server.appDelegate.moddleOptions));
  await server.shutdown();
});

test('an instance keeps its log lines only when they are saved', async () => {
  for (const saveLogs of [true, false]) {
    const { server } = await makeServer({ extra: { dataStore: s => { const ds = new DataStore(s); ds.saveLogs = saveLogs; return ds; } } });
    const done = await runOne(server);
    assert.equal(done.instance.logs.length > 0, saveLogs, `saveLogs=${saveLogs}: lines kept in memory`);
    const [stored] = await server.dataStore.findInstances({ id: done.instance.id }, 'full');
    assert.equal((stored.logs ?? []).length > 0, saveLogs, `saveLogs=${saveLogs}: lines stored`);
    await server.shutdown();
  }
});

test('a cached waiting instance stays small', async () => {
  const { server } = await makeServer({ extra: { cacheManager: s => new CacheManager(s) } });
  for (let i = 0; i < 20; i++) await server.engine.start('expense-approval', {});
  gc(); gc();
  const before = process.memoryUsage().heapUsed;
  const N = 300;
  for (let i = 0; i < N; i++) await server.engine.start('expense-approval', { requester: 'user' + i });
  gc(); gc();
  const perInstance = (process.memoryUsage().heapUsed - before) / N / 1024;
  assert.ok(server.cache.list().length >= N, 'the executions are cached');
  // ~50 KB today (with logs); ~316 KB before the shared registry and the logger fix
  assert.ok(perInstance < 150, `${perInstance.toFixed(1)} KB per cached waiting instance`);
  await server.shutdown();
});
