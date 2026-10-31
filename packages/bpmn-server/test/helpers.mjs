// Builds servers for the engine's tests: the public constructor and configuration, with the
// storage port given (an in-memory store, shared between servers to stand for one database).
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  BPMNServer, Configuration, ModelsDatastore, DataStore, NoCacheManager, Logger,
  DefaultAppDelegate, ScriptHandler, MemoryDocumentStore,
} from '../dist/index.js';

export const PROCESSES = fileURLToPath(new URL('./processes/', import.meta.url));
export const quiet = () => new Logger({ toConsole: false });

/** An application delegate whose services the test supplies: each `services[name](input, context)` is a service task's implementation. */
export class TestDelegate extends DefaultAppDelegate {
  constructor(server, services = {}) {
    super(server);
    this.services = services;
    for (const [name, fn] of Object.entries(services)) this[name] = fn;
  }
  startUp() { }
}

/** A definitions folder of its own, with the test processes in it. */
export function definitionsFolder() {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'bpmn-defs-')) + path.sep;
  for (const file of fs.readdirSync(PROCESSES)) fs.copyFileSync(path.join(PROCESSES, file), dir + file);
  return dir;
}

/**
 * A server on `store` (a new in-memory store when absent), its definitions in `dir`.
 * `cron: false` unless asked; locks retry quickly.
 */
export async function makeServer({ store = new MemoryDocumentStore(), dir = definitionsFolder(), services = {}, serverId, cron = false, locks = {}, timers = {}, logger = quiet(), extra = {} } = {}) {
  const configuration = new Configuration({
    definitionsPath: dir,
    timers: { precision: 1000, pollInterval: 0, ...timers },
    database: { MongoDB: { db_url: 'unused://', db: 'bpmn_test' } },
    logger,
    serverId,
    locks: { retryDelay: 20, maxTries: 10, ...locks },
    documentStore: () => store,
    definitions: (s) => new ModelsDatastore(s),
    appDelegate: (s) => new TestDelegate(s, services),
    dataStore: (s) => new DataStore(s),
    scriptHandler: () => new ScriptHandler(),
    cacheManager: (s) => new NoCacheManager(s),
    ...extra,
  });
  const server = new BPMNServer(configuration, logger, { cron });
  await server.ready;
  await server.dataStore.install();
  if (!cron) await server.definitions.rebuild();   // the cron's start does it otherwise
  return { server, store, dir };
}

/** Waits until `check()` is truthy, or fails after `ms`. */
export async function until(check, ms = 5000, what = 'the condition') {
  const end = Date.now() + ms;
  for (;;) {
    const value = await check();
    if (value) return value;
    if (Date.now() > end) throw new Error(`timed out waiting for ${what}`);
    await new Promise(r => setTimeout(r, 25));
  }
}

/** The covered/not covered service of the claim fixture: its answer appended to the instance's data. */
export const coverage = (covered, calls = []) => ({
  verifyCoverage: async (input, context) => { calls.push(context.instance?.id ?? context.item?.token?.execution?.id); context.item.token.appendData({ covered }, context.item); return { covered }; },
});
