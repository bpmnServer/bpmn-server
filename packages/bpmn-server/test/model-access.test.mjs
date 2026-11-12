// @features: models-files
// Model access and the engine's index (docs/design/engine-isolation.md): the host changes a model's files with no
// database (a launched server's `models`), and the engine, told by an engine call, updates its own index of the models
// (their start events: what may be started). A model that does not load is refused, and its files stay as they were.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { makeServer } from './helpers.mjs';

const model = (id, start) => `<?xml version="1.0" encoding="UTF-8"?>
<bpmn:definitions xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" id="d" targetNamespace="t">
  <bpmn:process id="${id}" isExecutable="true">
    <bpmn:startEvent id="${start}"><bpmn:outgoing>f1</bpmn:outgoing></bpmn:startEvent>
    <bpmn:endEvent id="E"><bpmn:incoming>f1</bpmn:incoming></bpmn:endEvent>
    <bpmn:sequenceFlow id="f1" sourceRef="${start}" targetRef="E" />
  </bpmn:process>
</bpmn:definitions>`;

/** The engine's index: the start events it knows for a model. */
const indexed = async (server, name) => (await server.definitions.findEvents({ 'events.subType': undefined }))
  .filter(e => e.modelName === name).map(e => e.elementId);

test('a launched server: model access writes the files, the engine indexes them; rename and remove too', async () => {
  const { server, dir } = await makeServer({ launched: true });
  await server.models.save('access-a', model('A', 'Asked'), undefined, 'designer');
  assert.ok(fs.existsSync(path.join(dir, 'access-a.bpmn')), 'the file written');
  assert.deepEqual(await indexed(server, 'access-a'), ['Asked'], 'the engine\'s index has its start event');

  await server.models.save('access-a', model('A', 'Requested'), undefined, 'designer');
  assert.deepEqual(await indexed(server, 'access-a'), ['Requested'], 'a change reaches the index');
  assert.equal((await server.definitions.history('access-a')).length >= 1, true, 'a version kept, by the files');

  await server.models.rename('access-a', 'access-b');
  assert.ok(fs.existsSync(path.join(dir, 'access-b.bpmn')) && !fs.existsSync(path.join(dir, 'access-a.bpmn')));
  assert.deepEqual(await indexed(server, 'access-a'), []);
  assert.deepEqual(await indexed(server, 'access-b'), ['Requested']);

  await server.models.remove('access-b');
  assert.equal(fs.existsSync(path.join(dir, 'access-b.bpmn')), false);
  assert.deepEqual(await indexed(server, 'access-b'), [], 'gone from the index');
  await server.shutdown();
});

test('a model that does not load is refused by model access, before any file is written', async () => {
  const { server, dir } = await makeServer({ launched: true });
  await assert.rejects(server.models.save('broken', '<not a model'));
  assert.equal(fs.existsSync(path.join(dir, 'broken.bpmn')), false);
  await server.shutdown();
});

test('model access alone touches no database: its files only', async () => {
  const { server, dir, store } = await makeServer({ launched: true });
  const writes = [];
  for (const method of ['insert', 'update', 'remove'])
    store[method] = new Proxy(store[method], { apply: (fn, self, args) => { writes.push(`${method} ${args[1]}`); return fn.apply(self, args); } });
  await server.definitions.saveFiles('files-only', model('F', 'Go'));
  await server.definitions.renameFiles('files-only', 'files-only-2');
  await server.definitions.deleteFiles('files-only-2');
  assert.deepEqual(writes.filter(w => w.includes('wf_models')), [], 'no write of the models\' index');
  assert.equal(fs.existsSync(path.join(dir, 'files-only-2.bpmn')), false);
  await server.shutdown();
});
