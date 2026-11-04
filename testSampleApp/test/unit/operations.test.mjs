// @features: health-operations
// Operating bpmn-web: boot checks, engine settings from the environment, shutdown order,
// model verification on import, and the upgrade:running report. No database needed.
import test from 'node:test';
import assert from 'node:assert/strict';

import { checkBootConfig, reportBootConfig } from '../../../packages/bpmn-web/dist/runtime/bootConfig.js';
import { engineSettingsFromEnv } from '../../../packages/bpmn-web/dist/runtime/engineEnv.js';
import { gracefulShutdown } from '../../../packages/bpmn-web/dist/runtime/shutdown.js';
import { verifyModeFromEnv, checkModel, assertModelAcceptable, ModelRejectedError, verifySavedModels }
  from '../../../packages/bpmn-web/dist/runtime/modelVerification.js';
import { parseUpgradeArgs, summarizeUpgrade, formatUpgradeReport } from '../../../packages/bpmn-web/dist/runtime/upgradeRunning.js';
import { API } from '../../../packages/bpmn-web/dist/routes/api.js';

const quiet = { warn() {}, error() {}, log() {} };
const NS = 'xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL"';
const VALID = `<?xml version="1.0" encoding="UTF-8"?><bpmn:definitions ${NS} id="d" targetNamespace="urn:t">
<bpmn:process id="p" isExecutable="true"><bpmn:startEvent id="s"/><bpmn:task id="t" name="Work"/><bpmn:endEvent id="e"/>
<bpmn:sequenceFlow id="f1" sourceRef="s" targetRef="t"/><bpmn:sequenceFlow id="f2" sourceRef="t" targetRef="e"/></bpmn:process></bpmn:definitions>`;
const BROKEN = '<bpmn:definitions';

const SAFE = { SESSION_SECRET: 's', API_KEY: 'k', API_SERVICE_USER_NAME: 'svc', API_SERVICE_USER_GROUPS: 'SYSTEM' };

// ---- boot checks

test('production refuses missing secrets and disabled sign-in; development only warns', () => {
  const prod = checkBootConfig({ NODE_ENV: 'production', REQUIRE_AUTHENTICATION: 'false' });
  assert.equal(prod.errors.length, 3, prod.errors.join('\n'));
  const dev = checkBootConfig({ REQUIRE_AUTHENTICATION: 'false' });
  assert.equal(dev.errors.length, 0);
  assert.ok(dev.warnings.some(w => w.includes('SESSION_SECRET')));
  assert.ok(dev.warnings.some(w => w.includes('REQUIRE_AUTHENTICATION=false')));
  assert.deepEqual(checkBootConfig({ NODE_ENV: 'production', ...SAFE }), { errors: [], warnings: [] });
});

test('ALLOW_INSECURE_NO_AUTH lets production start without sign-in, with a warning', () => {
  const report = checkBootConfig({ NODE_ENV: 'production', ...SAFE, REQUIRE_AUTHENTICATION: 'false', ALLOW_INSECURE_NO_AUTH: 'true' });
  assert.deepEqual(report.errors, []);
  assert.equal(report.warnings.length, 1);
});

test('API checks apply only with the APIs, the sign-in check only with the pages', () => {
  const env = { NODE_ENV: 'production', SESSION_SECRET: 's', REQUIRE_AUTHENTICATION: 'false' };
  assert.deepEqual(checkBootConfig(env, { api: false, ui: false }).errors, []);
  assert.equal(checkBootConfig(env, { api: false, ui: true }).errors.length, 1);
  assert.equal(checkBootConfig(env, { api: true, ui: false }).errors.length, 1);
});

test('reportBootConfig returns false when there are errors', () => {
  assert.equal(reportBootConfig({ errors: ['x'], warnings: [] }, quiet), false);
  assert.equal(reportBootConfig({ errors: [], warnings: ['y'] }, quiet), true);
});

// ---- engine settings

test('lock and shutdown settings come from the environment; bad values fall back to defaults', () => {
  const s = engineSettingsFromEnv({ LOCK_RETRY_DELAY_MS: '250', LOCK_MAX_TRIES: '40',
    LOCK_STALE_AFTER_MS: '120000', ENGINE_SHUTDOWN_TIMEOUT_MS: '30000', MONGO_DB_NAME: ' bpmn_prod ' });
  assert.deepEqual(s, { invalid: [], locks: { retryDelay: 250, maxTries: 40, staleAfter: 120000 },
    shutdownTimeout: 30000, db: 'bpmn_prod' });
  const bad = engineSettingsFromEnv({ LOCK_MAX_TRIES: 'lots', LOCK_RETRY_DELAY_MS: '-5', ENGINE_SHUTDOWN_TIMEOUT_MS: '1.5' });
  assert.equal(bad.locks, undefined);
  assert.equal(bad.shutdownTimeout, undefined);
  assert.equal(bad.invalid.length, 3);
  assert.deepEqual(engineSettingsFromEnv({}), { invalid: [] });
});

test('webConfiguration passes the environment settings to the engine; code settings win', async () => {
  const saved = { ...process.env };
  Object.assign(process.env, { MONGO_DB_URL: 'mongodb://h:27017', MONGO_DB_NAME: 'named',
    LOCK_MAX_TRIES: '7', ENGINE_SHUTDOWN_TIMEOUT_MS: '2500' });
  try {
    const { webConfiguration } = await import('../../../packages/bpmn-web/dist/start.js');
    const c = webConfiguration();
    assert.deepEqual(c.locks, { maxTries: 7 });
    assert.equal(c.shutdownTimeout, 2500);
    assert.equal(c.database.MongoDB.db, 'named');
    assert.equal(webConfiguration({ shutdownTimeout: 99 }).shutdownTimeout, 99);
  }
  finally {
    for (const k of Object.keys(process.env)) if (!(k in saved)) delete process.env[k];
    Object.assign(process.env, saved);
  }
});

// ---- shutdown

test('shutdown stops taking requests, stops the engine, then closes the database', async () => {
  const order = [];
  let finishRequests;
  const server = { close(cb) { order.push('http:close'); finishRequests = () => { order.push('http:closed'); cb(); }; } };
  const bpmnServer = { async shutdown() { order.push('engine:start'); await new Promise(r => setTimeout(r, 5)); finishRequests(); order.push('engine:done'); } };
  const result = await gracefulShutdown({ server, bpmnServer, closeDatabase: async () => order.push('db'), log: quiet });
  assert.equal(result.clean, true);
  assert.deepEqual(order, ['http:close', 'engine:start', 'http:closed', 'engine:done', 'db']);
});

test('a stuck engine or request is cut off and reported; the database still closes', async () => {
  let dbClosed = false;
  const result = await gracefulShutdown({
    server: { close() {} },                              // never calls back
    bpmnServer: { shutdown: () => new Promise(() => {}) }, // never finishes
    closeDatabase: () => { dbClosed = true; },
    engineTimeoutMs: 10, graceMs: 10, log: quiet,
  });
  assert.equal(result.clean, false);
  assert.equal(result.problems.length, 2);
  assert.equal(dbClosed, true);
});

// ---- model verification on import

test('VERIFY_MODELS_ON_IMPORT defaults to warn', () => {
  assert.equal(verifyModeFromEnv({}), 'warn');
  assert.equal(verifyModeFromEnv({ VERIFY_MODELS_ON_IMPORT: 'ENFORCE' }), 'enforce');
  assert.equal(verifyModeFromEnv({ VERIFY_MODELS_ON_IMPORT: 'off' }), 'off');
  assert.equal(verifyModeFromEnv({ VERIFY_MODELS_ON_IMPORT: 'nonsense' }), 'warn');
});

test('warn saves a broken model, enforce refuses it, off does not look', async () => {
  const warned = [];
  const log = { warn: m => warned.push(m) };
  assert.equal((await checkModel(undefined, 'm', BROKEN, 'warn', log)).accept, true);
  assert.equal(warned.length, 1);
  await assert.rejects(assertModelAcceptable(undefined, 'm', BROKEN, 'enforce', quiet), ModelRejectedError);
  assert.equal((await checkModel(undefined, 'm', BROKEN, 'off', log)).verification, undefined);
  assert.equal((await assertModelAcceptable(undefined, 'm', VALID, 'enforce', quiet)).accept, true);
});

function fakeServer(models) {
  const saved = [];
  return {
    saved,
    definitions: {
      async save(name, source) { saved.push(name); models[name] = source; },
      async getSource(name) { if (!(name in models)) throw new Error('none'); return models[name]; },
      async getList() { return Object.keys(models).map(name => ({ name })); },
    },
  };
}
const route = (router, path) => router.stack.find(l => l.route?.path === path).route.stack.at(-1).handle;
function response() {
  const r = { statusCode: 200, body: undefined };
  r.status = c => { r.statusCode = c; return r; };
  r.json = b => { r.body = b; return r; };
  r.send = b => { r.body = b; return r; };
  return r;
}

test('admin model/save: enforce answers 422 with the errors and saves nothing', async () => {
  const server = fakeServer({});
  const router = new API({ bpmnServer: server }).adminConfig();
  const save = route(router, '/model/save');
  const old = process.env.VERIFY_MODELS_ON_IMPORT;
  const warn = console.warn; console.warn = () => {};
  try {
    process.env.VERIFY_MODELS_ON_IMPORT = 'enforce';
    let res = response();
    await save({ body: { name: 'bad', xml: BROKEN } }, res, assert.fail);
    assert.equal(res.statusCode, 422);
    assert.ok(res.body.issues.some(i => i.code === 'invalid-xml'));
    assert.deepEqual(server.saved, []);
    res = response();
    await save({ body: { name: 'good', xml: VALID } }, res, assert.fail);
    assert.equal(res.statusCode, 200);
    process.env.VERIFY_MODELS_ON_IMPORT = 'warn';
    await save({ body: { name: 'bad', xml: BROKEN } }, response(), assert.fail);
    assert.deepEqual(server.saved, ['good', 'bad']);
  }
  finally {
    console.warn = warn;
    if (old === undefined) delete process.env.VERIFY_MODELS_ON_IMPORT; else process.env.VERIFY_MODELS_ON_IMPORT = old;
  }
});

test('admin definitions/verify checks a saved model or a source without saving', async () => {
  const server = fakeServer({ good: VALID, bad: BROKEN });
  const verify = route(new API({ bpmnServer: server }).adminConfig(), '/definitions/verify');
  const warn = console.warn; console.warn = () => {};
  try {
    let res = response();
    await verify({ body: { name: 'bad' } }, res, assert.fail);
    assert.equal(res.body.valid, false);
    res = response();
    await verify({ body: { source: VALID } }, res, assert.fail);
    assert.equal(res.body.valid, true);
    res = response();
    await verify({ body: { name: 'missing' } }, res, assert.fail);
    assert.equal(res.statusCode, 404);
    res = response();
    await verify({ body: {} }, res, assert.fail);
    assert.equal(res.statusCode, 400);
    assert.deepEqual(server.saved, []);
  }
  finally { console.warn = warn; }
});

test('verifySavedModels checks every saved model, or the ones named', async () => {
  const server = fakeServer({ good: VALID, bad: BROKEN });
  const all = await verifySavedModels(server);
  assert.deepEqual(all.map(r => [r.name, r.valid]), [['good', true], ['bad', false]]);
  const one = await verifySavedModels(server, ['missing']);
  assert.equal(one[0].issues[0].code, 'unreadable');
});

test('an import refused under enforce answers 200 { errors, issues }, as bpmn-client callers expect', async () => {
  const { sendModelRejection } = await import('../../../packages/bpmn-web/dist/runtime/modelVerification.js');
  const res = response();
  const exc = new ModelRejectedError('bad', [{ severity: 'error', code: 'invalid-xml', message: 'x' }]);
  assert.equal(sendModelRejection(res, exc), true);
  assert.equal(res.statusCode, 200);
  assert.match(res.body.errors, /not saved/);
  assert.equal(res.body.issues.length, 1);
  assert.equal(sendModelRejection(response(), new Error('other')), false);
});

// ---- upgrade:running

test('upgrade:running arguments', () => {
  assert.deepEqual(parseUpgradeArgs(['--dry-run', 'A', 'B C', '--json']),
    { models: ['A', 'B C'], dryRun: true, json: true, help: false, unknown: [] });
  assert.deepEqual(parseUpgradeArgs(['--force']).unknown, ['--force']);
});

test('upgrade:running report: counts, attention, and only the instances worth reading', () => {
  const reports = [
    { model: 'A', instances: [
      { model: 'A', instanceId: 'i1', outcome: 'upgraded' },
      { model: 'A', instanceId: 'i2', outcome: 'current' },
      { model: 'A', instanceId: 'i3', outcome: 'stranded', detail: 'open step gone: t9' }] },
    { model: 'B', refused: 'the model has errors', instances: [] },
  ];
  const summary = summarizeUpgrade(reports);
  assert.deepEqual(summary.counts, { upgraded: 1, current: 1, stranded: 1 });
  assert.equal(summary.attention, true);
  const text = formatUpgradeReport(reports, false);
  assert.match(text, /i1 upgraded/);
  assert.doesNotMatch(text, /i2/);
  assert.match(text, /i3 stranded - open step gone: t9/);
  assert.match(text, /B: refused/);
  assert.equal(summarizeUpgrade([{ model: 'A', instances: [{ outcome: 'upgraded' }] }]).attention, false);
});

test.after(() => { setImmediate(() => process.exit(0)); });
