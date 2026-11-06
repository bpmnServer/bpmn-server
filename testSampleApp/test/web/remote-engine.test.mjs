// The engine in a process of its own, as ENGINE_AT says: what runs, runs there, the host gets data, and only the host can ask.
import test from 'node:test';
import assert from 'node:assert/strict';
import { startWebApp, why } from '../support/webApp.mjs';

const MODEL = 'where-it-runs';
const SOURCE = `<?xml version="1.0" encoding="UTF-8"?>
<bpmn:definitions xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" id="d" targetNamespace="urn:t"><bpmn:process id="p" isExecutable="true">
  <bpmn:startEvent id="s" /><bpmn:scriptTask id="w" scriptFormat="JavaScript"><bpmn:script>data.ranIn = process.pid;</bpmn:script></bpmn:scriptTask><bpmn:userTask id="u" /><bpmn:endEvent id="e" />
  <bpmn:sequenceFlow id="f0" sourceRef="s" targetRef="w" /><bpmn:sequenceFlow id="f1" sourceRef="w" targetRef="u" /><bpmn:sequenceFlow id="f2" sourceRef="u" targetRef="e" />
</bpmn:process></bpmn:definitions>`;

let web, designer;
test.before(async () => {
  web = await startWebApp({ remoteEngine: true });
  designer = await web.login('designer');
  await web.bpmnServer.definitions.save(MODEL, SOURCE);
});
test.after(async () => { await web?.stop(); setImmediate(() => process.exit(0)); });

const call = (body, key = process.env.ENGINE_KEY, method = 'POST', url = '/engine/call') =>
  fetch(web.engineAt + url, { method, headers: { 'x-engine-key': key, 'Content-Type': 'application/json' }, ...(method === 'POST' ? { body: JSON.stringify(body) } : {}) });

test('a process runs in the engine\'s process, and the host gets data', async () => {
  const started = await web.bpmnServer.engine.start(MODEL, {});
  assert.equal(started.instance.data.ranIn, web.enginePid);
  assert.notEqual(web.enginePid, process.pid);
  assert.equal(typeof started.getItems, 'undefined');
  const task = started.instance.items.find(i => i.elementId === 'u');
  const done = await web.bpmnServer.engine.invoke({ 'items.id': task.id }, { ok: true });
  assert.equal(done.status, 'end');
  const saved = await web.bpmnServer.dataStore.findInstance({ id: started.id }, 'summary');
  assert.equal(saved.status, 'end', 'the host reads what the engine saved');
});

test('through the host\'s own pages and API too', async () => {
  await designer.get(`/model/edit/${MODEL}`);
  const ran = await designer.request('POST', '/model/test/run', { json: { processName: MODEL, scenario: { name: 'one', steps: [{ element: 'u' }] } } });
  assert.equal(ran.status, 200, why(ran));
  const [result] = JSON.parse(ran.text).results;
  assert.equal(result.ok, true, ran.text);
  assert.equal(result.instance.data.ranIn, web.enginePid);
  const { services } = JSON.parse((await designer.get('/model/services')).text);
  assert.ok(services.some(s => s.name === 'echo'));
});

test('a mistake in the engine reaches the host as it was', async () => {
  await assert.rejects(web.bpmnServer.engine.start('no such model', {}), /no such model/i);
  const started = await web.bpmnServer.engine.start(MODEL, {});
  const task = started.instance.items.find(i => i.elementId === 'u');
  await web.bpmnServer.engine.invoke({ 'items.id': task.id }, {});
  await assert.rejects(web.bpmnServer.engine.invoke({ 'items.id': task.id }, {}), e => e.code === 'ITEM_NOT_WAITING');
});

test('the engine is private: this machine only, its host\'s key, and only what it is there to answer', async () => {
  assert.match(web.engineAt, /^http:\/\/127\.0\.0\.1:/);
  assert.equal((await call({ method: 'status' }, 'wrong')).status, 401);
  assert.equal((await call({ method: 'status' }, '')).status, 401);
  assert.equal((await call({ method: 'status' })).status, 200);
  assert.equal((await call({ method: 'close' })).status, 404, 'not one of its calls');
  assert.equal((await call({ method: 'constructor' })).status, 404);
  assert.equal((await call({}, undefined, 'GET')).status, 404);
  assert.equal((await call({}, undefined, 'GET', '/')).status, 404);
});

test('with the engine gone the designer goes on; what would run says so', async () => {
  await web.stopEngine();
  assert.equal((await designer.get(`/model/edit/${MODEL}`)).status, 200);
  assert.match(await web.bpmnServer.definitions.getSource(MODEL), /where|process/);
  await assert.rejects(web.bpmnServer.engine.start(MODEL, {}), e => e.code === 'ENGINE_NOT_RUNNING' && /can not be reached/.test(e.message));
  const started = await designer.request('POST', '/model/test/start', { json: { processName: MODEL, data: {} } });
  assert.match(started.text, /needs an engine/, why(started));
});
