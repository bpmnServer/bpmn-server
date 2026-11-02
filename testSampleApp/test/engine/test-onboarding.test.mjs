import test from 'node:test';
import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';
import { BPMNServer, Configuration, ModelsDatastore, DataStore, NoCacheManager, Logger, ScriptHandler } from '../../../packages/bpmn-web/dist/index.js';
import { AppDelegate } from '../../delegates/appDelegate.ts';
import { MemoryMongoDB } from './MemoryMongoDB.mjs';

const logger = new Logger({ toConsole: false });
const server = new BPMNServer(new Configuration({ definitionsPath: fileURLToPath(new URL('../../processes/', import.meta.url)), timers: { precision: 1000 }, database: { MongoDB: { db_url: 'memory://', db: 'bpmn' } }, logger: (s) => new Logger(s), definitions: (s) => new ModelsDatastore(s), appDelegate: (s) => new AppDelegate(s), dataStore: (s) => { const ds = new DataStore(s); ds.db = new MemoryMongoDB(ds.dbConfiguration, logger); return ds; }, scriptHandler: () => new ScriptHandler(), cacheManager: (s) => new NoCacheManager(s) }), logger, { cron: false });
const item = (resp, id) => resp.instance.items.find(i => i.elementId === id);
test.before(async () => { await server.dataStore.install(); });
test('test-onboarding completes the approved employee path', async () => {
  let resp = await server.engine.start('test-onboarding', { caseId: 1 });
  assert.equal(item(resp, 'submitDetails').status, 'wait');
  resp = await server.engine.invoke({ id: resp.instance.id, 'items.elementId': 'submitDetails' }, { employeeName: 'Alex', department: 'Engineering', startDate: '2026-11-15' });
  resp = await server.engine.invoke({ id: resp.instance.id, 'items.elementId': 'managerReview' }, { approved: true });
  assert.equal(item(resp, 'itSetup').status, 'wait');
  assert.equal(item(resp, 'hrSetup').status, 'wait');
  resp = await server.engine.invoke({ id: resp.instance.id, 'items.elementId': 'itSetup' }, {});
  resp = await server.engine.invoke({ id: resp.instance.id, 'items.elementId': 'hrSetup' }, {});
  assert.equal(item(resp, 'onboardingComplete').status, 'end');
});
test.after(() => { setImmediate(() => process.exit(0)); });
