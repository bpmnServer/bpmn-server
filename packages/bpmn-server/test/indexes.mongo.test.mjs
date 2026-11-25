// @features: mongodb
// The instances' indexes on MongoDB: install() makes them, and the queries of task lists and dashboards use them,
// reading only the instances that match rather than every instance (the ended ones too). Many ended instances and
// a few waiting are stored as copies of real ones, then each query's plan is read with explain().
// Runs when BPMN_TEST_MONGO_URL is set (CI provides a MongoDB service); skipped otherwise. LOAD_SCALE (test/load)
// multiplies the counts; the times are printed.
import test from 'node:test';
import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import { performance } from 'node:perf_hooks';
import { MongoClient } from 'mongodb';
import { DataStore, MongoDB, QueryTranslator } from '../dist/index.js';
import { makeServer, quiet } from './helpers.mjs';

const URL = process.env.BPMN_TEST_MONGO_URL;
const DB = 'bpmn_idx_' + randomUUID().slice(0, 8);
const SCALE = Number(process.env.LOAD_SCALE || 1);
const ENDED = Math.round(5000 * SCALE), WAITING = Math.round(100 * SCALE);

const items = query => new QueryTranslator('items').translateCriteria(structuredClone(query));
// the task list of a user who is not an administrator, as SecureUser.qualifyItems makes it
const userTasks = { 'items.status': 'wait', 'items.type': 'bpmn:UserTask', $or: [
  { 'items.assignee': null, 'items.candidateUsers': null, 'items.candidateGroups': null },
  { 'items.assignee': 'ann' }, { 'items.candidateUsers': 'ann' }, { 'items.candidateGroups': 'staff' }] };

const QUERIES = [
  // what, the MongoDB filter, the call that sends it, the index expected
  ['the waiting items of an element', items({ 'items.status': 'wait', 'items.elementId': 'SubmitExpense' }),
    s => s.dataStore.findItems({ 'items.status': 'wait', 'items.elementId': 'SubmitExpense' }), 'items.status_1_items.elementId_1'],
  ['the task list, an administrator', items({ 'items.status': 'wait', 'items.type': 'bpmn:UserTask' }),
    s => s.dataStore.findItems({ 'items.status': 'wait', 'items.type': 'bpmn:UserTask' }, { lean: true }), 'items.status_1_items.type_1'],
  ['the task list, a user', items(userTasks),
    s => s.dataStore.findItems(structuredClone(userTasks), { lean: true }), 'items.status_1_items.type_1'],
  ["a process's running instances", { name: 'expense-approval', status: 'running' },
    s => s.dataStore.findInstances({ name: 'expense-approval', status: 'running' }, 'summary'), 'name_1_status_1'],
  ['the count of instances waiting', items({ 'items.status': 'wait' }),
    s => s.dataStore.countInstances({ 'items.status': 'wait' }), 'items.status_1_'],
  ['the count of running instances', { status: 'running' },
    s => s.dataStore.countInstances({ status: 'running' }), 'status_1'],
];

/** the names of the indexes a plan scans, and whether it scans the collection */
function scans(plan) {
  const text = JSON.stringify(plan);
  return { indexes: [...text.matchAll(/"indexName":"([^"]+)"/g)].map(m => m[1]), collscan: text.includes('"COLLSCAN"') };
}

test('MongoDB: the common queries use indexes, not a scan of every instance', { skip: !URL && 'BPMN_TEST_MONGO_URL is not set' }, async (t) => {
  const client = new MongoClient(URL);
  await client.connect();
  t.after(async () => { await client.db(DB).dropDatabase(); await client.close(); });
  const store = new MongoDB({ db_url: URL }, quiet());
  const { server } = await makeServer({ store, extra: { database: { MongoDB: { db_url: URL, db: DB } } } });
  t.after(async () => { await server.shutdown(); await (await store.getClient()).close(); });
  const instances = client.db(DB).collection('wf_instances');

  const names = (await instances.indexes()).map(i => i.name);
  for (const index of DataStore.QUERY_INDEXES)
    assert.ok(names.includes(Object.entries(index).map(([k, v]) => `${k}_${v}`).join('_')), `install() made ${JSON.stringify(index)}`);

  // one ended instance and one waiting at its first task, stored many times over
  const waiting = (await server.engine.start('expense-approval', { amount: 1 })).instance.id;
  const ended = (await server.engine.start('expense-approval', { amount: 1 })).instance.id;
  await server.engine.invoke({ id: ended, 'items.elementId': 'SubmitExpense' }, { amount: 2 });
  await server.engine.invoke({ id: ended, 'items.elementId': 'ApproveExpense' }, {});
  const [endedDoc] = await instances.find({ id: ended }).toArray();
  const [waitingDoc] = await instances.find({ id: waiting }).toArray();
  await instances.deleteMany({});
  const copy = ({ _id, ...doc }) => ({ ...doc, id: randomUUID(), items: doc.items.map(it => ({ ...it, id: randomUUID() })) });
  for (let i = 0; i < ENDED; i += 5000)
    await instances.insertMany(Array.from({ length: Math.min(5000, ENDED - i) }, () => copy(endedDoc)));
  await instances.insertMany(Array.from({ length: WAITING }, () => copy(waitingDoc)));

  for (const [what, filter, run, index] of QUERIES) {
    const t0 = performance.now();
    const found = await run(server);
    const ms = performance.now() - t0;
    const count = Array.isArray(found) ? found.length : found;
    assert.equal(count, WAITING, `${what}: what it finds`);

    const { queryPlanner, executionStats } = await instances.find(filter).explain('executionStats');
    const { indexes, collscan } = scans(queryPlanner.winningPlan);
    t.diagnostic(`${what}: ${ms.toFixed(0)} ms, ${executionStats.totalDocsExamined} of ${ENDED + WAITING} read, index ${indexes.join(', ') || 'none'}`);
    assert.ok(!collscan && indexes.some(name => name.startsWith(index)), `${what}: an index (${index}), not a collection scan: ${indexes.join(', ') || 'COLLSCAN'}`);
    assert.ok(executionStats.totalDocsExamined <= WAITING, `${what}: only the matching instances read, not ${executionStats.totalDocsExamined}`);
  }
});
