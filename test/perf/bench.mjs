// npm run bench [-- --rounds 5 --processes 100 --waiting 1000]
// Speed and memory of the engine on the in-memory store, with test/processes/expense-approval.bpmn:
// a process = start, the submit task, the approval task. Speed is the median of several rounds (a
// single run varies with the machine's load); memory is per instance waiting at its first task.
import fs from 'node:fs';
import v8 from 'node:v8';
import vm from 'node:vm';
import { performance } from 'node:perf_hooks';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

import { DataStore, CacheManager } from '../../dist/index.js';
import { makeServer as makeTestServer } from '../helpers.mjs';

if (!globalThis.gc) v8.setFlagsFromString('--expose-gc');   // the memory children run with --expose-gc
const gc = globalThis.gc ?? vm.runInNewContext('gc');
const arg = (name, value) => { const at = process.argv.indexOf('--' + name); return at > 0 ? Number(process.argv[at + 1]) : value; };
const ROUNDS = arg('rounds', 5), PROCESSES = arg('processes', 100), WAITING = arg('waiting', 1000);

/** The test suite's server (test/helpers.mjs), with the live-instance cache and saved logs as asked. */
async function makeServer({ cache = false, saveLogs = true } = {}) {
    const extra = { dataStore: s => { const ds = new DataStore(s); ds.saveLogs = saveLogs; return ds; } };
    if (cache) extra.cacheManager = s => new CacheManager(s);
    const { server, dir } = await makeTestServer({ extra });
    return { server, dir };
}

async function runOne(server) {
    const { instance } = await server.engine.start('expense-approval', { amount: 1 });
    await server.engine.invoke({ id: instance.id, 'items.elementId': 'SubmitExpense' }, { amount: 120 });
    await server.engine.invoke({ id: instance.id, 'items.elementId': 'ApproveExpense' }, {});
}

const median = xs => [...xs].sort((a, b) => a - b).at(Math.floor(xs.length / 2));
const kb = b => (b / 1024).toFixed(1) + ' KB';

// memory per waiting instance: each measurement in a process of its own, so none inherits another's heap
const MEMORY = { 'no cache': { cache: false }, 'cache': { cache: true }, 'cache, logs not saved': { cache: true, saveLogs: false } };
const part = process.argv.indexOf('--memory');
if (part > 0) {
    const label = process.argv[part + 1], options = MEMORY[label];
    const { server, dir } = await makeServer(options);
    for (let i = 0; i < 20; i++) await server.engine.start('expense-approval', {});
    gc(); gc();
    const before = process.memoryUsage().heapUsed;
    for (let i = 0; i < WAITING; i++) await server.engine.start('expense-approval', { requester: 'user' + i });
    gc(); gc();
    const perInstance = (process.memoryUsage().heapUsed - before) / WAITING;   // read before the lookup below copies every document
    const [stored] = await server.dataStore.findInstances({ name: 'expense-approval' }, 'full');
    console.log(`memory (${label}): ${kb(perInstance)} heap per waiting instance (${WAITING}); stored document ${kb(JSON.stringify(stored).length)}`);
    await server.shutdown();
    fs.rmSync(dir, { recursive: true, force: true });
    process.exit(0);
}

// speed: a fresh server per round, so the store does not grow across rounds
const wall = [], cpu = [];
for (let r = 0; r < ROUNDS; r++) {
    const { server, dir } = await makeServer();
    for (let i = 0; i < 20; i++) await runOne(server);
    const c0 = process.cpuUsage(), t0 = performance.now();
    for (let i = 0; i < PROCESSES; i++) await runOne(server);
    wall.push((performance.now() - t0) / PROCESSES);
    const c = process.cpuUsage(c0);
    cpu.push((c.user + c.system) / 1000 / PROCESSES);
    await server.shutdown();
    fs.rmSync(dir, { recursive: true, force: true });
}
console.log(`speed: ${median(wall).toFixed(2)} ms per process (median of ${ROUNDS} x ${PROCESSES}; ${(1000 / median(wall)).toFixed(0)} processes/s), CPU ${median(cpu).toFixed(2)} ms`);

for (const label of Object.keys(MEMORY)) {
    const child = spawnSync(process.execPath, ['--expose-gc', fileURLToPath(import.meta.url), '--memory', label, '--waiting', String(WAITING)], { encoding: 'utf8' });
    process.stdout.write(child.stdout || child.stderr);
}
process.exit(0);
