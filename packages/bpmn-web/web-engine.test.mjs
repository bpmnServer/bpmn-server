import test from 'node:test';
import assert from 'node:assert/strict';
// Everything pulled through bpmn-web's OWN index barrel -> proves the bpmn-web -> bpmn-server v3 ESM link
import { BPMNServer, Configuration, ModelsDatastore, DataStore, NoCacheManager, Logger, ScriptHandler } from './dist/index.js';
import { MyAppDelegate } from './dist/sample-app/appDelegate.js';
import { MemoryMongoDB } from './MemoryMongoDB.mjs';
import { fileURLToPath } from 'node:url';

const PROC = fileURLToPath(new URL('./test/processes/', import.meta.url));
const logger = new Logger({ toConsole: false });

const configuration = new Configuration({
  definitionsPath: PROC,
  timers: { precision: 1000 },
  database: { MongoDB: { db_url: 'memory://', db: 'bpmn' } },
  logger: (s) => new Logger(s),
  definitions: (s) => new ModelsDatastore(s),
  appDelegate: (s) => new MyAppDelegate(s),      // <-- bpmn-web's delegate
  dataStore: (s) => { const ds = new DataStore(s); ds.db = new MemoryMongoDB(ds.dbConfiguration, logger); return ds; },
  scriptHandler: () => new ScriptHandler(),
  cacheManager: (s) => new NoCacheManager(s),
});
const server = new BPMNServer(configuration, logger, { cron: false });

test.before(async () => { await server.dataStore.install(); });

test('bpmn-web config + MyAppDelegate drive the migrated engine end-to-end', async () => {
  const resp = await server.engine.start('simple', { caseId: 100 });
  assert.ok(resp.execution, 'execution returned through bpmn-web wiring');
  assert.ok(resp.instance.id);
  const loaded = await server.dataStore.findInstances({ id: resp.instance.id }, 'full');
  assert.equal(loaded.length, 1, 'instance persisted + retrievable via bpmn-web datastore path');
});

test('bpmn-web wiring runs a gateway process', async () => {
  const resp = await server.engine.start('test-exclusive-gateway', { caseId: 101 });
  assert.ok(resp.instance.items.length >= 2, 'gateway process advanced through nodes');
});

test.after(() => { setImmediate(() => process.exit(0)); });
