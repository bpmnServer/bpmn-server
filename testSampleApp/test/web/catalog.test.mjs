// The model catalog: browse a catalog (CATALOG_URL, here a local folder) and import its models.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { startWebApp, why } from '../support/webApp.mjs';

const CATALOG = fileURLToPath(new URL('../fixtures/catalog/', import.meta.url));
let web, designer, staff;

test.before(async () => {
  web = await startWebApp({ env: { CATALOG_URL: CATALOG } });
  designer = await web.login('designer');
  staff = await web.login('staff');
});
test.after(async () => { await web?.stop(); setImmediate(() => process.exit(0)); });

const message = res => decodeURIComponent(new URL(res.location, web.base).searchParams.get('message') ?? '');

test('designers browse the catalog; other users can not', async () => {
  const page = await designer.get('/dashboard/catalog');
  assert.equal(page.status, 200, why(page));
  assert.match(page.text, /id="catalog-hello"/);
  assert.match(page.text, /A greeting: a start form/);
  assert.match(page.text, /greet/, 'the services it calls');
  assert.equal((await staff.get('/dashboard/catalog')).status, 403);
  assert.equal((await staff.post('/dashboard/catalog/import', { id: 'hello' })).status, 403);
});

test('import a model, then again under another name; an existing name is kept', async () => {
  const imported = await designer.post('/dashboard/catalog/import', { id: 'hello', name: 'Hello' });
  assert.equal(imported.status, 302, why(imported));
  assert.equal(imported.location, '/model/edit/Hello');
  assert.ok(fs.existsSync(path.join(web.definitionsPath, 'Hello.bpmn')));
  assert.ok((await web.bpmnServer.definitions.getList({})).some(m => m.name === 'Hello'));

  const again = await designer.post('/dashboard/catalog/import', { id: 'hello', name: 'Hello' });
  assert.match(message(again), /A model named 'Hello' exists/);
  assert.match((await designer.get('/dashboard/catalog')).text, /Hello \(catalog\)/, 'another name is offered');

  const renamed = await designer.post('/dashboard/catalog/import', { id: 'hello', name: 'Hello 2' });
  assert.equal(renamed.location, '/model/edit/Hello%202');
  const started = await web.bpmnServer.engine.start('Hello 2', { name: 'Ada' });
  assert.ok(started.instance.items.some(i => i.elementId === 'Greet'), 'the imported model runs');
});

test('a file that does not match its checksum, an unknown model and a bad name are refused', async () => {
  assert.match(message(await designer.post('/dashboard/catalog/import', { id: 'tampered' })), /checksum differs/);
  assert.ok(!fs.existsSync(path.join(web.definitionsPath, 'Tampered.bpmn')));
  assert.match(message(await designer.post('/dashboard/catalog/import', { id: 'nope' })), /no model 'nope'/);
  assert.match(message(await designer.post('/dashboard/catalog/import', { id: 'hello', name: '../escape' })), /can not be a model name/);
});
