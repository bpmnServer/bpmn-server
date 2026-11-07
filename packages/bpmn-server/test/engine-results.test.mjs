// @features: engine-api
// Embedding the engine and launching it are two different calls. `new BPMNServer` is inside the engine and gets running executions;
// `BPMNServer.launch` is outside it and gets data only (server/LaunchedServer.ts): it can cross a network as it is, and nothing in it reaches a process.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { CacheManager, verifyModel } from '../dist/index.js';
import { makeLaunched, makeServer, coverage, TestDelegate, PROCESSES } from './helpers.mjs';

const anyFunction = (value, seen = new Set()) => {
  if (typeof value === 'function') return true;
  if (!value || typeof value !== 'object' || seen.has(value)) return false;
  seen.add(value);
  return Object.values(value).some(v => anyFunction(v, seen));
};

test('launched, what runs a process answers plain data, read as an execution was', async () => {
  const server = await makeLaunched({ services: coverage(true) });
  const started = await server.engine.start('property-claim', { claimId: 'R-1' }, null, 'clerk');
  assert.equal(anyFunction(started), false, 'nothing to call');
  assert.deepEqual(JSON.parse(JSON.stringify(started)), started, 'the same after JSON');
  assert.equal(started.id, started.instance.id);
  assert.equal(started.status, 'running');
  assert.deepEqual(started.execution, { id: started.id, name: started.instance.name, status: 'running' });
  assert.ok(started.instance.items.length > 0, 'its items are there, as data');
  assert.ok(started.instance.tokens.length > 0, 'and its tokens');
  for (const live of ['tokens', 'worker', 'server', 'appDelegate', 'getItems', 'save', 'isLocked'])
    assert.equal(started[live], undefined, live);

  const task = started.instance.items.find(i => i.elementId === 'AssessClaim');
  const invoked = await server.engine.invoke({ 'items.id': task.id }, { assessment: 'pay' }, 'ana');
  assert.equal(anyFunction(invoked), false);
  const read = await server.engine.get({ id: started.id });
  assert.equal(anyFunction(read), false);
  assert.equal(read.instance.data.assessment, 'pay');
  const paid = await server.engine.throwMessage('PaymentConfirmed', { paid: 1 }, { id: started.id });
  assert.equal(anyFunction(paid), false);
  assert.equal(paid.instance.status, 'end');
  await server.shutdown();
});

test('what a caller changes in an answer changes nothing in the process', async () => {
  const server = await makeLaunched({ services: coverage(true) });
  const started = await server.engine.start('property-claim', { claimId: 'R-2' });
  started.instance.data.claimId = 'changed';
  started.instance.items.length = 0;
  const read = await server.engine.get({ id: started.id });
  assert.equal(read.instance.data.claimId, 'R-2');
  assert.ok(read.instance.items.length > 0);
  await server.shutdown();
});

test('what nobody waits for answers nothing, and a failure is still thrown', async () => {
  const server = await makeLaunched();
  assert.equal(await server.engine.throwMessage('nobody', {}, {}), null);
  await assert.rejects(server.engine.start('no such model'), /no such model/i);
  await server.shutdown();
});

test('launched, there is no way to the running engine; a service inside the engine still gets the live execution', async () => {
  let inside;
  const server = await makeLaunched({ services: { verifyCoverage: async (input, context) => { inside = typeof context.item.token.execution.getItems; return { covered: true }; } } });
  assert.deepEqual(Object.keys(server), ['engine', 'appDelegate']);
  assert.deepEqual(Object.keys(server.engine), []);
  for (const way of ['cache', 'listener', 'cron', 'locker'])
    assert.equal(server[way], undefined, `${way}: its executions are live`);
  assert.equal(typeof server.appDelegate.getServicesProvider, 'function');
  assert.equal(server.appDelegate.executionStarted, undefined, 'facts about the application, none of its code');
  await server.engine.start('property-claim', { claimId: 'R-3' });
  assert.equal(inside, 'function', 'the delegate and services are inside');
  await server.shutdown();
});

test('the application\'s own checks and model extensions are the engine\'s to answer', async () => {
  const asked = [];
  const server = await makeLaunched({ extra: { appDelegate: s => Object.assign(new TestDelegate(s), { verifyModel: async ({ name, definition }) => { asked.push(name, typeof definition.getNodeById); return [{ code: 'mine', message: 'Mine', severity: 'warning' }]; } }) } });
  const result = await verifyModel(fs.readFileSync(PROCESSES + 'reminder.bpmn', 'utf8'), server, 'reminder');
  assert.deepEqual(asked, ['reminder', 'function']);
  assert.ok(result.issues.some(i => i.code === 'mine'), JSON.stringify(result.issues));
  await server.shutdown();
});

test('what is running now is data too', async () => {
  const server = await makeLaunched({ services: coverage(true), extra: { cacheManager: s => new CacheManager(s) } });
  const { id } = await server.engine.start('property-claim', { claimId: 'R-5' });
  const live = await server.engine.live();
  assert.deepEqual(live.map(one => one.id), [id]);
  assert.equal(anyFunction(live), false);
  assert.equal(live[0].execution.data.claimId, 'R-5');
  await server.shutdown();
});

test('with no engine: models read and save, and what would run says so', async () => {
  const called = [];
  const server = await makeLaunched({ services: { verifyCoverage: async () => called.push('service') }, engine: 'none' });
  assert.equal(server.engine.running, false);
  assert.match(await server.definitions.getSource('property-claim'), /PropertyClaim/);
  for (const run of [() => server.engine.start('property-claim', {}), () => server.engine.invoke({}, {}), () => server.engine.throwMessage('m', {}, {})])
    await assert.rejects(run, e => e.code === 'ENGINE_NOT_RUNNING' && /needs an engine/.test(e.message));
  assert.deepEqual(await server.engine.live(), []);
  assert.deepEqual((await server.appDelegate.verifyModel({ name: 'm', source: '' })).map(i => i.code), ['application-checks-skipped']);
  assert.equal(called.length, 0);
  await server.shutdown();
});

test('the application is known by the names its scan left in a file, not by its code', async (t) => {
  const file = path.join(fs.mkdtempSync(path.join(os.tmpdir(), 'bpmn-services-')), 'services.json');
  fs.writeFileSync(file, JSON.stringify({ services: ['echo', 'billing.charge'], extra: ['madeAsItRuns'] }));
  const server = await makeLaunched({ extra: { servicesFile: file } });
  const provider = await server.appDelegate.getServicesProvider();
  assert.equal(typeof provider.echo, 'function');
  assert.equal(typeof provider.billing.charge, 'function');
  assert.equal(typeof provider.madeAsItRuns, 'function');
  assert.equal(provider.other, undefined);
  const asksEngine = await makeLaunched({ services: { fromTheEngine: async () => { } }, extra: { servicesFile: file + '.none' } });
  assert.equal(typeof (await asksEngine.appDelegate.getServicesProvider()).fromTheEngine, 'function', 'no file: the engine knows');
  const missing = await makeLaunched({ engine: 'none', extra: { servicesFile: file + '.none' } });
  assert.equal(await missing.appDelegate.getServicesProvider(), null, 'no file and no engine: no names, so nothing is checked');
  await server.shutdown();
  await asksEngine.shutdown();
  await missing.shutdown();
});

test('a launched server still has a way in: dataStore and definitions are the engine\'s own objects', { todo: 'until the engine runs elsewhere, and they are core\'s' }, async () => {
  const server = await makeLaunched();
  await server.shutdown();
  assert.equal(server.dataStore.server, undefined);
});

test('embedding stays as it was: the running execution', async () => {
  const { server } = await makeServer({ services: coverage(true) });
  const execution = await server.engine.start('property-claim', { claimId: 'R-4' });
  assert.equal(typeof execution.getItems, 'function');
  assert.equal(typeof execution.instance.items, 'object');
  await server.shutdown();
});
