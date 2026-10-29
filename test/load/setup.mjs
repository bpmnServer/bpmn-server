// What the load suites share: the processes they run, and servers on the in-memory store or, with
// LOAD_MONGO_URL set, on MongoDB (database bpmn_load_test, dropped when a suite asks for a fresh one).
// LOAD_SCALE multiplies every count; ENABLE_PROFILER=true prints the time of each MongoDB operation.
import v8 from 'node:v8';
import vm from 'node:vm';

import { MemoryDocumentStore, MongoDB } from '../../dist/index.js';
import { makeServer, quiet } from '../helpers.mjs';

export const MONGO_URL = process.env.LOAD_MONGO_URL;
export const DB = MONGO_URL ? 'bpmn_load_test' : 'bpmn_test';
export const STORE = MONGO_URL ? 'MongoDB' : 'in-memory store';
export const SCALE = Number(process.env.LOAD_SCALE || 1);
export const n = count => Math.max(1, Math.round(count * SCALE));
export const sleep = ms => new Promise(r => setTimeout(r, ms));

v8.setFlagsFromString('--expose-gc');
const gcOnce = vm.runInNewContext('gc');
/** heap in use after full collections */
export function heapUsed() { gcOnce(); gcOnce(); return process.memoryUsage().heapUsed; }
export const mb = bytes => (bytes / 1048576).toFixed(1) + ' MB';

/** A new, empty store: in memory, or the load-test database emptied. */
export async function freshStore() {
  if (!MONGO_URL) return new MemoryDocumentStore();
  const store = new MongoDB({ db_url: MONGO_URL }, quiet());
  await (await store.getClient()).db(DB).dropDatabase();
  return store;
}

/** test/helpers' server, on `store` (a fresh one when absent) */
export async function loadServer({ store, ...options } = {}) {
  store ??= await freshStore();
  const database = { MongoDB: { db_url: MONGO_URL ?? 'unused://', db: DB } };
  return makeServer({ ...options, store, extra: { database, ...options.extra } });
}

/** start, the submit task, the approval task (test/processes/expense-approval.bpmn); `via` spreads the calls over servers */
export async function expense(server, i, via = [server]) {
  const at = k => via[(i + k) % via.length];
  const { instance } = await at(0).engine.start('expense-approval', { requester: 'user' + i });
  await at(1).engine.invoke({ id: instance.id, 'items.elementId': 'SubmitExpense' }, { amount: i });
  const done = await at(2).engine.invoke({ id: instance.id, 'items.elementId': 'ApproveExpense' }, { approvedBy: 'boss' + i });
  return done.instance.id;
}

/** the claim: a service task, a gateway on its answer, a user task, a message (test/processes/property-claim.bpmn) */
export async function claim(server, i) {
  const { instance } = await server.engine.start('property-claim', { claimNo: i, covered: i % 2 === 0 });
  if (instance.status === 'end') return instance.id;   // not covered: rejected at the gateway
  await server.engine.invoke({ id: instance.id, 'items.elementId': 'AssessClaim' }, { assessed: i });
  await server.engine.invoke({ id: instance.id, 'items.elementId': 'PaymentConfirmed' }, { paid: i });
  return instance.id;
}

export async function payment(server, i) {
  const { instance } = await server.engine.start('payment-intake', { ref: 'p' + i });
  await server.engine.invoke({ id: instance.id, 'items.elementId': 'FilePayment' }, { filed: i });
  return instance.id;
}

/** The claim's coverage check: answers what the claim was started with, after `io()` ms of simulated I/O. */
export const coverageAfter = (io = () => 0) => ({
  verifyCoverage: async (input, context) => {
    const ms = typeof io === 'function' ? io() : io;
    if (ms) await sleep(ms);
    const covered = context.item.token.data.covered;
    context.item.token.appendData({ covered }, context.item);
    return { covered };
  },
});

/** the time per call of `fn` and its CPU, the median over `rounds` */
export async function timed(fn, { rounds = 5, calls = 50 } = {}) {
  const wall = [], cpu = [];
  for (let r = 0; r < rounds; r++) {
    const c0 = process.cpuUsage(), t0 = performance.now();
    for (let i = 0; i < calls; i++) await fn(i);
    wall.push((performance.now() - t0) / calls);
    const c = process.cpuUsage(c0);
    cpu.push((c.user + c.system) / 1000 / calls);
  }
  const median = xs => [...xs].sort((a, b) => a - b)[Math.floor(xs.length / 2)];
  return { ms: median(wall), cpu: median(cpu) };
}
