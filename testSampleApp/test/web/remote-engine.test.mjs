// The engine in a process of its own, as ENGINE_AT says: what runs, runs there, the host gets data, and only the host can ask.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { startWebApp, why, ADMIN_API_KEY } from '../support/webApp.mjs';

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

test('a test runs whole in the engine: the host asks once, and gets the result', async () => {
  const engine = web.bpmnServer.engine;
  engine.start = engine.invoke = () => { throw new Error('the host ran a step'); };
  try {
    const ran = await designer.request('POST', '/model/test/run', { json: { processName: MODEL, scenario: { name: 'one', steps: [{ element: 'u' }] } } });
    const [result] = JSON.parse(ran.text).results;
    assert.equal(result.ok, true, ran.text);
    assert.equal(result.instance.status, 'end');
    assert.equal(result.instance.data.ranIn, web.enginePid);
  }
  finally {
    delete engine.start;
    delete engine.invoke;
  }
});

test('a test\'s data changes in the engine, and a decision\'s tests run there, each from its own folder', async () => {
  const { instance } = await (await call({ method: 'start', args: [MODEL, {}, null, null, { instanceId: `test-${process.pid}-data` }] })).json().then(a => a.result);
  const changed = await designer.request('POST', '/model/test/data', { json: { instanceId: instance.id, data: { changed: 1 } } });
  assert.equal(changed.status, 200, why(changed));
  assert.deepEqual(JSON.parse(changed.text).instance.data, { changed: 1 });

  fs.copyFileSync(path.join(import.meta.dirname, '..', '..', 'processes', 'loanApproval.dmn.xml'), path.join(web.definitionsPath, 'loanApproval.dmn.xml'));
  const tests = [{ name: 'good', data: { credit_score: 800, income: 90000 }, checks: [{ kind: 'output', path: 'approvalStatus', value: 'Approved' }] }];
  const decided = await designer.request('POST', '/model/decision/loanApproval/tests/run', { json: { tests } });
  assert.equal(JSON.parse(decided.text).results[0].ok, true, decided.text);
  const asked = await (await call({ method: 'runDecisionTests', args: ['loanApproval.dmn.xml', tests] })).json();
  assert.equal(asked.result[0].ok, true, 'the engine answers this itself');
  const outside = await (await call({ method: 'runDecisionTests', args: ['../../loanApproval.dmn.xml', tests] })).json();
  assert.equal(outside.result[0].ok, true, 'a name in its own folder, whatever else it is sent');
});

test('the API stays on the host, and the engine evaluates its decision', async () => {
  const body = { decision: 'loanApproval', data: { credit_score: 800, income: 90000 } };
  const res = await web.api('PUT', '/admin/api/rules/invoke', body, ADMIN_API_KEY);
  assert.equal(res.status, 200, JSON.stringify(res.body));
  assert.equal(res.body.result.approvalStatus, 'Approved');
  const engine = web.bpmnServer.engine;
  const invokeDecision = engine.invokeDecision;
  let asked = 0;
  engine.invokeDecision = (...args) => { asked++; return invokeDecision.apply(engine, args); };
  try {
    assert.equal((await web.api('PUT', '/admin/api2/rules/invoke', body, ADMIN_API_KEY)).status, 200);
    assert.equal(asked, 1);
  }
  finally {
    delete engine.invokeDecision;
  }
  const { result } = await (await call({ method: 'invokeDecision', args: [body.decision, body.data] })).json();
  assert.equal(result.result.approvalStatus, 'Approved', 'the engine answers this itself');
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
  const ran = await designer.request('POST', '/model/test/run', { json: { processName: MODEL, scenario: { name: 'one' } } });
  assert.match(JSON.parse(ran.text).results[0].error, /needs an engine/, why(ran));
  const changed = await designer.request('POST', '/model/test/data', { json: { instanceId: 'test-gone', data: {} } });
  assert.match(changed.text, /needs an engine/, why(changed));
  const decided = await web.api('PUT', '/admin/api/rules/invoke', { decision: 'loanApproval', data: {} }, ADMIN_API_KEY);
  assert.equal(decided.status, 400);
  assert.match(decided.body.errors, /needs an engine/);
});
