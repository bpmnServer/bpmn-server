// @features: mcp, rest-api
// The MCP (packages/bpmn-mcp), as an AI client uses it: its own process over stdio, against a real server.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';
import { startWebApp, ADMIN_API_KEY, API_KEY, FIXTURES } from '../support/webApp.mjs';

const MCP = fileURLToPath(new URL('../../../packages/bpmn-mcp/src/index.mjs', import.meta.url));
const cwd = fs.mkdtempSync(path.join(os.tmpdir(), 'bpmn-mcp-test-'));   // no .env here: only what env gives

let web, mcp;
const open = [];

async function connect(env) {
  const { port } = new URL(web.base);
  const transport = new StdioClientTransport({
    command: process.execPath, args: [MCP], cwd, stderr: 'ignore',
    env: { PATH: process.env.PATH, SystemRoot: process.env.SystemRoot, HOST: '127.0.0.1', PORT: port, ...env },
  });
  const client = new Client({ name: 'bpmn-mcp-test', version: '1.0.0' });
  await client.connect(transport);
  open.push(client);
  return client;
}

/** Calls a tool; answers its result as JSON when it is. */
async function call(name, args = {}, client = mcp) {
  const res = await client.callTool({ name, arguments: args });
  const text = res.content?.[0]?.text ?? '';
  let value = text;
  try { value = JSON.parse(text); } catch { /* text, then */ }
  return { error: res.isError === true, text, value };
}
async function ok(name, args, client) {
  const res = await call(name, args, client);
  assert.equal(res.error, false, `${name}: ${res.text.slice(0, 300)}`);
  return res.value;
}

test.before(async () => {
  web = await startWebApp({ env: { API_SERVICE_USER_GROUPS: 'staff,manager,ADMIN,SYSTEM' } });
  mcp = await connect({ API_KEY, ADMIN_API_KEY });
});
test.after(async () => {
  await Promise.allSettled(open.map(c => c.close()));
  await web?.stop();
  fs.rmSync(cwd, { recursive: true, force: true });
  setImmediate(() => process.exit(0));
});

const instanceOf = async id => (await ok('list_instances', { query: { id }, steps: true })).results[0];
const waiting = instance => instance.items.filter(i => i.status === 'wait').map(i => i.elementId);
const SIGNAL_MODEL = `<?xml version="1.0" encoding="UTF-8"?>
<bpmn:definitions xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" id="d" targetNamespace="urn:t">
  <bpmn:signal id="Go" name="Go" />
  <bpmn:process id="WaitsForSignal" isExecutable="true">
    <bpmn:startEvent id="Start" />
    <bpmn:intermediateCatchEvent id="Wait"><bpmn:signalEventDefinition signalRef="Go" /></bpmn:intermediateCatchEvent>
    <bpmn:endEvent id="End" />
    <bpmn:sequenceFlow id="f1" sourceRef="Start" targetRef="Wait" />
    <bpmn:sequenceFlow id="f2" sourceRef="Wait" targetRef="End" />
  </bpmn:process>
</bpmn:definitions>`;

test('every tool is offered, and says whether it changes anything', async () => {
  const { tools } = await mcp.listTools();
  assert.deepEqual(tools.map(t => t.name).sort(), ['assign_task', 'delete_instances', 'delete_model', 'engine_status', 'find_items',
    'get_model', 'invoke_task', 'list_instances', 'list_model_events', 'list_models', 'rename_model', 'restart_instance', 'save_model',
    'start_event', 'start_process', 'throw_message', 'throw_signal', 'validate_model']);
  const hints = Object.fromEntries(tools.map(t => [t.name, t.annotations]));
  assert.equal(hints.list_models.readOnlyHint, true);
  assert.equal(hints.delete_instances.destructiveHint, true);
  assert.equal(hints.start_process.readOnlyHint, false);
});

test('models: list, read, validate, save, rename, delete', async () => {
  assert.match(JSON.stringify(await ok('list_models')), /leave-request/);

  const source = await ok('get_model', { name: 'leave-request' });
  assert.match(source, /id="Submit"/, 'the BPMN XML');

  const xml = fs.readFileSync(path.join(FIXTURES, 'simple.bpmn'), 'utf8');
  assert.equal((await ok('validate_model', { xml })).valid, true);
  assert.equal((await ok('validate_model', { xml: '<not-bpmn/>' })).valid, false);

  assert.equal((await ok('save_model', { name: 'mcp-saved', xml })).saved, true);
  assert.match(JSON.stringify(await ok('list_models')), /mcp-saved/);
  await ok('rename_model', { name: 'mcp-saved', newName: 'mcp-renamed' });
  assert.match(JSON.stringify(await ok('list_models')), /mcp-renamed/);
  await ok('delete_model', { name: 'mcp-renamed' });
  assert.doesNotMatch(JSON.stringify(await ok('list_models')), /mcp-renamed/);
});

test('an invalid model is not saved', async () => {
  assert.equal((await ok('save_model', { name: 'mcp-invalid', xml: '<not-bpmn/>' })).saved, false);
  assert.doesNotMatch(JSON.stringify(await ok('list_models')), /mcp-invalid/);
});

test('a process from start to end: start, find its task, assign it, complete it', async () => {
  const started = await ok('start_process', { name: 'leave-request', data: { marker: 'run-short' } });
  const id = started.id ?? started.instance?.id;
  assert.ok(id, JSON.stringify(started).slice(0, 200));
  assert.deepEqual(waiting(await instanceOf(id)), ['Submit']);

  const { results: items } = await ok('find_items', { query: { id, 'items.status': 'wait' } });
  assert.ok(items.some(i => i.elementId === 'Submit'), JSON.stringify(items).slice(0, 300));

  await ok('assign_task', { query: { id, 'items.elementId': 'Submit' }, assignment: { assignee: 'anna' } });
  assert.equal((await instanceOf(id)).items.find(i => i.elementId === 'Submit').assignee, 'anna');

  await ok('invoke_task', { query: { id, 'items.elementId': 'Submit' }, data: { days: 2, reason: 'rest' } });
  const ended = await instanceOf(id);
  assert.equal(ended.status, 'end');
  assert.equal(ended.data.approvedBy, 'system', 'the short path: approved automatically');
});

test('a longer leave waits for its approval, then a second invoke of the same task is refused', async () => {
  const started = await ok('start_process', { name: 'leave-request', data: {} });
  const id = started.id ?? started.instance?.id;
  await ok('invoke_task', { query: { id, 'items.elementId': 'Submit' }, data: { days: 9 } });
  assert.deepEqual(waiting(await instanceOf(id)), ['Approve']);
  const again = await call('invoke_task', { query: { id, 'items.elementId': 'Submit' }, data: {} });
  assert.equal(again.error, true, again.text.slice(0, 200));
  assert.deepEqual(waiting(await instanceOf(id)), ['Approve'], 'still waiting where it was');
});

test('signals and model events: a throw reaches the process waiting for it', async () => {
  await ok('save_model', { name: 'mcp-signal', xml: SIGNAL_MODEL });
  const started = await ok('start_process', { name: 'mcp-signal' });
  const id = started.id ?? started.instance?.id;
  assert.equal((await instanceOf(id)).status, 'running');
  await ok('throw_signal', { signalId: 'Go' });
  assert.equal((await instanceOf(id)).status, 'end');
  assert.match(JSON.stringify(await ok('list_model_events', {})), /mcp-signal/);
  await ok('delete_model', { name: 'mcp-signal' });
});

test('restart: an instance with save points goes back to a task; one without is refused', async () => {
  const start = async keepSavePoints => {
    const started = await ok('start_process', { name: 'leave-request', data: {}, keepSavePoints });
    const id = started.id ?? started.instance?.id;
    await ok('invoke_task', { query: { id, 'items.elementId': 'Submit' }, data: { days: 9 } });
    return { id, item: (await instanceOf(id)).items.find(i => i.elementId === 'Submit').id };
  };
  const kept = await start(true);
  const refused = await call('restart_instance', { query: { 'items.id': kept.item } });
  assert.equal(refused.error, true, 'still running: it needs rewind');
  await ok('restart_instance', { query: { 'items.id': kept.item }, rewind: true });
  assert.deepEqual(waiting(await instanceOf(kept.id)), ['Submit'], 'back at the task');

  const none = await start(false);
  assert.equal((await call('restart_instance', { query: { 'items.id': none.item }, rewind: true })).error, true, 'no save points');
});

test('a message reaches the process waiting for it', async () => {
  await ok('save_model', { name: 'mcp-message', xml: `<?xml version="1.0" encoding="UTF-8"?>
<bpmn:definitions xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" id="d" targetNamespace="urn:t">
  <bpmn:message id="Paid" name="Paid" />
  <bpmn:process id="WaitsForMessage" isExecutable="true">
    <bpmn:startEvent id="Start" />
    <bpmn:intermediateCatchEvent id="Wait"><bpmn:messageEventDefinition messageRef="Paid" /></bpmn:intermediateCatchEvent>
    <bpmn:endEvent id="End" />
    <bpmn:sequenceFlow id="f1" sourceRef="Start" targetRef="Wait" />
    <bpmn:sequenceFlow id="f2" sourceRef="Wait" targetRef="End" />
  </bpmn:process>
</bpmn:definitions>` });
  const started = await ok('start_process', { name: 'mcp-message' });
  const id = started.id ?? started.instance?.id;
  await ok('throw_message', { messageId: 'Paid' });
  assert.equal((await instanceOf(id)).status, 'end');
  await ok('delete_model', { name: 'mcp-message' });
});

test('start_event starts a second start event of a running instance', async () => {
  await ok('save_model', { name: 'mcp-two-starts', xml: `<?xml version="1.0" encoding="UTF-8"?>
<bpmn:definitions xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" id="d" targetNamespace="urn:t">
  <bpmn:process id="TwoStarts" isExecutable="true">
    <bpmn:startEvent id="First" />
    <bpmn:userTask id="Task" />
    <bpmn:endEvent id="End1" />
    <bpmn:startEvent id="Second" />
    <bpmn:endEvent id="End2" />
    <bpmn:sequenceFlow id="f1" sourceRef="First" targetRef="Task" />
    <bpmn:sequenceFlow id="f2" sourceRef="Task" targetRef="End1" />
    <bpmn:sequenceFlow id="f3" sourceRef="Second" targetRef="End2" />
  </bpmn:process>
</bpmn:definitions>` });
  const started = await ok('start_process', { name: 'mcp-two-starts' });
  const id = started.id ?? started.instance?.id;
  await ok('start_event', { instanceId: id, startNodeId: 'Second' });
  const items = (await instanceOf(id)).items.map(i => i.elementId);
  assert.ok(items.includes('End2'), JSON.stringify(items));
  await ok('delete_model', { name: 'mcp-two-starts' });
});

test('delete_instances deletes what its query matches, and nothing else', async () => {
  const keep = await ok('start_process', { name: 'leave-request', data: { marker: 'keep' } });
  const gone = await ok('start_process', { name: 'leave-request', data: { marker: 'delete-me' } });
  await ok('delete_instances', { query: { 'data.marker': 'delete-me' } });
  assert.equal(await instanceOf(gone.id ?? gone.instance?.id), undefined);
  assert.ok(await instanceOf(keep.id ?? keep.instance?.id));
});

test('listings stay short: the newest, the total, and no steps unless asked', async () => {
  const marker = 'listing';
  const ids = [];
  for (let n = 0; n < 3; n++) {
    const started = await ok('start_process', { name: 'leave-request', data: { marker } });
    ids.push(started.id ?? started.instance?.id);
  }
  const query = { 'data.marker': marker };

  const all = await ok('list_instances', { query });
  assert.equal(all.total, 3);
  assert.equal(all.returned, 3);
  for (const instance of all.results) {
    assert.equal(instance.items, undefined, 'no steps');
    assert.equal(instance.tokens, undefined);
    assert.equal(instance.data.marker, marker);
    assert.ok(instance.status);
  }
  assert.ok((await ok('list_instances', { query, steps: true })).results.every(i => i.items.length > 0));

  const one = await ok('list_instances', { query, limit: 1 });
  assert.deepEqual([one.total, one.returned, one.results.length], [3, 1, 1]);
  assert.equal(one.results[0].id, ids[2], 'the newest');

  const waitingHere = await ok('list_instances', { query: { ...query, 'items.status': 'wait' } });
  assert.equal(waitingHere.total, 3, 'a filter on steps still works without returning them');

  const items = await ok('find_items', { query: { ...query, 'items.status': 'wait' }, limit: 2 });
  assert.deepEqual([items.total, items.returned, items.results.length], [3, 2, 2]);

  await ok('delete_instances', { query });
});

test('engine_status answers', async () => {
  assert.ok(await ok('engine_status'));
});

test('a failure is a tool error, and the connection survives it: nothing printed reached the protocol', async () => {
  const unknown = await call('start_process', { name: 'no-such-model' });
  assert.equal(unknown.error, true);
  assert.match(unknown.text, /no-such-model|not found|ENOENT/i);
  assert.equal((await call('get_model', { name: '../secrets' })).error, true, 'a path is not a model name');
  assert.match(JSON.stringify(await ok('list_models')), /leave-request/, 'still answering');
});

test('.env decides what it may do: no admin key, no model administration; a wrong key, nothing', async () => {
  const runtimeOnly = await connect({ API_KEY });
  const xml = fs.readFileSync(path.join(FIXTURES, 'simple.bpmn'), 'utf8');
  assert.equal((await call('save_model', { name: 'mcp-denied', xml }, runtimeOnly)).error, true, 'saving needs the admin key');
  assert.match(JSON.stringify(await ok('list_models', {}, runtimeOnly)), /leave-request/, 'reading does not');
  assert.match(await ok('get_model', { name: 'leave-request' }, runtimeOnly), /id="Submit"/, 'nor does reading a model');
  const missing = await call('get_model', { name: 'no-such-model' }, runtimeOnly);
  assert.equal(missing.error, true);
  assert.match(missing.text, /No process definition named no-such-model/, 'says what is wrong, not that the key is');
  assert.doesNotMatch(JSON.stringify(await ok('list_models')), /mcp-denied/);

  const wrong = await connect({ API_KEY: 'wrong-key' });
  assert.equal((await call('list_models', {}, wrong)).error, true);
});

test('without API_KEY it does not start', async () => {
  await assert.rejects(connect({}));
});

test('reading a model stays in the models folder, with either key', async () => {
  const outside = path.join(web.definitionsPath, '..', 'outside-the-models.bpmn');
  fs.writeFileSync(outside, '<secret />');
  try {
    for (const name of ['..%2Foutside-the-models', '..%5Coutside-the-models']) {
      const runtime = await web.api('GET', `/api/definitions/load/${name}`);
      assert.equal(runtime.status, 400, name);
      assert.doesNotMatch(runtime.text ?? '', /secret/);
      const admin = await web.api('GET', `/admin/api/definitions/load/${name}`, undefined, ADMIN_API_KEY);
      assert.equal(admin.status, 400, name);
      assert.doesNotMatch(admin.text ?? '', /secret/);
    }
    assert.equal((await web.api('GET', '/api/definitions/load/leave-request')).status, 200);
  } finally {
    fs.rmSync(outside, { force: true });
  }
  assert.equal((await call('get_model', { name: '../outside-the-models' })).error, true);
});

test('delete_instances with an empty query deletes nothing, unless all says so', async () => {
  await ok('start_process', { name: 'leave-request', data: { marker: 'kept-by-refusal' } });
  const count = async () => (await ok('list_instances', {})).total;
  const before = await count();
  const refused = await call('delete_instances', { query: {} });
  assert.equal(refused.error, true);
  assert.match(refused.text, /all=true/);
  assert.equal(await count(), before);
  await ok('delete_instances', { query: {}, all: true });
  assert.equal(await count(), 0);
});

test('a model that does not exist is an error, and a rename does not replace another', async () => {
  assert.match((await call('delete_model', { name: 'no-such-model' })).text, /No model named no-such-model/);
  assert.equal((await call('delete_model', { name: 'no-such-model' })).error, true);
  assert.equal((await call('rename_model', { name: 'no-such-model', newName: 'x' })).error, true);

  const xml = fs.readFileSync(path.join(FIXTURES, 'simple.bpmn'), 'utf8');
  await ok('save_model', { name: 'mcp-rename-a', xml });
  await ok('save_model', { name: 'mcp-rename-b', xml });
  const refused = await call('rename_model', { name: 'mcp-rename-a', newName: 'mcp-rename-b' });
  assert.equal(refused.error, true);
  assert.match(refused.text, /already a model/);
  assert.deepEqual((await ok('delete_model', { name: 'mcp-rename-a' })), { deleted: 'mcp-rename-a' });
  await ok('delete_model', { name: 'mcp-rename-b' });
});

test('a query can not run code in the database, however deep', async () => {
  for (const q of [{ $where: 'function () { return true; }' }, { $or: [{ $where: 'true' }] }, { data: { $function: { body: 'x' } } }]) {
    for (const tool of ['list_instances', 'find_items', 'delete_instances', 'invoke_task']) {
      const res = await call(tool, { query: q });
      assert.equal(res.error, true, `${tool} ${JSON.stringify(q)}`);
      assert.match(res.text, /can not use/, `${tool}: ${res.text.slice(0, 120)}`);
    }
  }
  assert.equal((await call('list_instances', { query: { 'data.days': { $gt: 1 } } })).error, false, 'other operators are fine');
});

test('a large answer is cut to fit, and says so; an item does not say its data twice', async () => {
  const blob = 'x'.repeat(70_000);
  for (let i = 0; i < 2; i++) await ok('start_process', { name: 'leave-request', data: { blob } });
  const items = await ok('find_items', { query: { 'data.blob': blob, 'items.status': 'wait' } });
  assert.equal(items.total, 2);
  assert.equal(items.returned, 1);
  assert.match(items.truncated, /cut to fit/);
  assert.equal(items.results[0].instanceData, undefined);

  const huge = await ok('start_process', { name: 'leave-request', data: { huge: 'y'.repeat(150_000) } });
  const id = huge.id ?? huge.instance?.id;
  const one = await call('list_instances', { query: { id } });
  assert.ok(one.text.length < 100_500, String(one.text.length));
  const row = JSON.parse(one.text);
  assert.equal(row.results[0].id, id);
  assert.equal(row.results[0].data, undefined);
  assert.equal(row.results[0].dataOmitted, 'too large to return');
  await ok('delete_instances', { query: { 'data.blob': blob } });
  await ok('delete_instances', { query: { id } });
});
