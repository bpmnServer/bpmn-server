// The engine on a real MongoDB, through the default MongoDB adapter (no storage injected): the
// claim workflow across a restart, locking between two servers, and a recovered timer.
// Runs when BPMN_TEST_MONGO_URL is set (CI provides a MongoDB service); skipped otherwise.
import test from 'node:test';
import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import { MongoClient } from 'mongodb';
import { BPMNServer, Configuration, ModelsDatastore, DataStore, NoCacheManager, ScriptHandler } from '../dist/index.js';
import { TestDelegate, definitionsFolder, quiet, coverage, until } from './helpers.mjs';

const URL = process.env.BPMN_TEST_MONGO_URL;
const DB = 'bpmn_it_' + randomUUID().slice(0, 8);

function server(dir, services, serverId, cron = false) {
  const logger = quiet();
  return BPMNServer.create(new Configuration({
    definitionsPath: dir,
    timers: { precision: 1000, pollInterval: 0 },
    database: { MongoDB: { db_url: URL, db: DB } },
    logger, serverId, locks: { retryDelay: 20, maxTries: 25 },
    definitions: (s) => new ModelsDatastore(s),
    appDelegate: (s) => new TestDelegate(s, services),
    dataStore: (s) => new DataStore(s),
    scriptHandler: () => new ScriptHandler(),
    cacheManager: (s) => new NoCacheManager(s),
  }), logger, { cron });
}

test('MongoDB: claim workflow across a restart, locks between servers, a recovered timer', { skip: !URL && 'BPMN_TEST_MONGO_URL is not set' }, async (t) => {
  const dir = definitionsFolder();
  t.after(async () => { const c = new MongoClient(URL); await c.connect(); await c.db(DB).dropDatabase(); await c.close(); });

  const a = await server(dir, coverage(true), 'a');
  await a.dataStore.install();
  await a.definitions.install();
  await a.definitions.rebuild();
  const started = await a.engine.start('property-claim', { claimId: 'M-1' });
  const task = started.instance.items.find(i => i.elementId === 'AssessClaim');
  await a.shutdown();

  const b = await server(dir, coverage(true), 'b');
  const c = await server(dir, coverage(true), 'c');
  const results = await Promise.allSettled([
    b.engine.invoke({ 'items.id': task.id }, { by: 'b' }),
    c.engine.invoke({ 'items.id': task.id }, { by: 'c' }),
  ]);
  assert.equal(results.filter(r => r.status === 'fulfilled').length, 1, 'one completion advances the task');
  assert.equal(results.find(r => r.status === 'rejected').reason.code, 'ITEM_NOT_WAITING');
  const settled = await b.engine.throwMessage('PaymentConfirmed', {}, { id: started.id });
  assert.equal(settled.instance.status, 'end');

  const reminded = [];
  const remind = { remind: async (input, context) => { reminded.push(context.item.token.execution.id); } };
  const d = await server(dir, remind, 'd');
  const waiting = await d.engine.start('reminder', {});
  await d.shutdown();
  const e = await server(dir, remind, 'e', true);
  const f = await server(dir, remind, 'f', true);
  await until(async () => (await e.dataStore.findInstance({ id: waiting.id }, 'summary')).status === 'end', 8000, 'the recovered timer');
  assert.deepEqual(reminded, [waiting.id]);
  for (const s of [b, c, e, f]) await s.shutdown();
});
