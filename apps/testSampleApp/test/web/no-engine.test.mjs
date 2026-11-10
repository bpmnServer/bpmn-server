// @features: verify-model
// A server with no engine (ENGINE_AT=none): everything but running and testing a model works, and those say why they can't.
// And the names of services, as the scan of an application's source gives them, against what its code really has.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { startWebApp, why } from '../support/webApp.mjs';

const MODEL = 'leave-request';
let web, designer;
test.before(async () => {
  web = await startWebApp({ env: { ENGINE_AT: 'none' } });
  designer = await web.login('designer');
});
test.after(async () => { await web?.stop(); delete process.env.ENGINE_AT; setImmediate(() => process.exit(0)); });

test('the designer works: the editor, saving, history, checking, services, the dashboard', async () => {
  assert.equal(web.embedded, undefined, 'the application\'s delegate was not even made');
  assert.equal((await designer.get(`/model/edit/${MODEL}`)).status, 200);
  const source = await web.bpmnServer.definitions.getSource(MODEL);
  const saved = await designer.request('POST', `/model/edit/${MODEL}`, { json: { processId: MODEL, bpmn: source.replace('name="Submit request"', 'name="Submit it"'), svg: '<svg/>' } });
  assert.equal(saved.status, 200, why(saved));
  assert.match(await web.bpmnServer.definitions.getSource(MODEL), /Submit it/);
  assert.ok(JSON.parse((await designer.get(`/model/history/${MODEL}`)).text).versions.length >= 1);
  assert.equal((await designer.request('POST', '/model/verify', { json: { processName: MODEL, bpmn: source } })).status, 200);
  const { services } = JSON.parse((await designer.get('/model/services')).text);
  assert.ok(services.some(s => s.name === 'echo'), 'from services.json, with no application code');
  assert.equal((await designer.get('/dashboard/design')).status, 200);
});

test('running and testing say an engine is needed', async () => {
  const started = await designer.request('POST', '/model/test/start', { json: { processName: MODEL, data: {} } });
  assert.match(started.text, /needs an engine/, why(started));
  const ran = await designer.request('POST', '/model/test/run', { json: { processName: MODEL, scenario: { name: 'one' } } });
  assert.match(ran.text, /needs an engine/, why(ran));
});

test('the scan finds what the application\'s services really are', async () => {
  const { scanServices } = await import(new URL('../../../../packages/bpmn-web/dist/scanServices.js', import.meta.url).href);
  const { AppServices } = await import('../../connectors/appServices.ts');
  const scanned = await scanServices('delegates/appDelegate.ts');
  const real = Object.getOwnPropertyNames(AppServices.prototype).filter(name => name !== 'constructor' && !name.startsWith('_'));
  assert.deepEqual(scanned.services, [...real].sort());
  assert.equal(scanned.partial, false);
  const kept = JSON.parse(fs.readFileSync('services.json', 'utf8'));
  assert.deepEqual(kept.services, scanned.services, 'services.json is up to date: npm run services');
});
