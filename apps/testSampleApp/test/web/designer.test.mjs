// @features: roles
// The model designer: list, import (with layout and preview), modeler save, rename, delete, export,
// the model check, and that only designers and administrators reach it.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { startWebApp, why, FIXTURES } from '../support/webApp.mjs';

let web, admin, designer, staff;
test.before(async () => {
  web = await startWebApp();
  [admin, designer, staff] = await Promise.all([web.login('admin'), web.login('designer'), web.login('staff')]);
});
test.after(async () => { await web?.stop(); setImmediate(() => process.exit(0)); });

const modelNames = async () => (await web.bpmnServer.definitions.getList()).map(m => m.name ?? m);

/** A process without diagram information, as exported by tools that only write the process. */
const NO_DIAGRAM = `<?xml version="1.0" encoding="UTF-8"?>
<bpmn:definitions xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" id="d" targetNamespace="urn:test">
  <bpmn:process id="Plain" isExecutable="true">
    <bpmn:startEvent id="s" name="Start" />
    <bpmn:userTask id="t" name="Do it" />
    <bpmn:endEvent id="e" name="Done" />
    <bpmn:sequenceFlow id="f1" sourceRef="s" targetRef="t" />
    <bpmn:sequenceFlow id="f2" sourceRef="t" targetRef="e" />
  </bpmn:process>
</bpmn:definitions>`;

const upload = (client, filename, content) =>
  client.request('POST', '/model/import', { multipart: { file: { filename, content, type: 'application/xml' } } });

test('the designer is for designers and administrators only', async () => {
  for (const url of ['/model/list', '/model/import', '/model/new', '/model/edit/leave-request'])
    assert.equal((await staff.get(url)).status, 403, url);
  assert.equal((await upload(staff, 'x.bpmn', NO_DIAGRAM)).status, 403);
  assert.equal((await staff.request('POST', '/model/verify', { json: { bpmn: NO_DIAGRAM } })).status, 403);
});

test('a designer edits, checks and saves models', async () => {
  for (const url of ['/model/list', '/model/import', '/model/new', '/model/edit/leave-request'])
    assert.equal((await designer.get(url)).status, 200, url);
  const bpmn = fs.readFileSync(path.join(FIXTURES, 'leave-request.bpmn'), 'utf8');
  const check = await designer.request('POST', '/model/verify', { json: { bpmn, processName: 'leave-request' } });
  assert.equal(check.status, 200, why(check));
  assert.equal(JSON.parse(check.text).valid, true, check.text);
  const save = await designer.request('POST', '/model/edit/designer-copy', { json: { processId: 'designer-copy', bpmn, svg: '<svg xmlns="http://www.w3.org/2000/svg"/>' } });
  assert.equal(save.status, 200, why(save));
  assert.ok((await modelNames()).includes('designer-copy'));
});

test('the home page shows model actions to designers, not to other users', async () => {
  for (const [client, expected] of [[admin, true], [designer, true], [staff, false]]) {
    const home = await client.get('/');
    assert.equal(home.text.includes('href="/model/new"'), expected, 'New model');
    assert.equal(home.text.includes('id="modelLink"'), expected, 'Open model');
  }
});

test('a designer is not an administrator', async () => {
  assert.equal((await designer.post('/resetData', {})).status, 403);
  const adminPage = await designer.get('/admin');
  assert.equal(adminPage.status, 302, 'sent away from the user admin page');
});

test('the model list shows the definitions', async () => {
  const res = await admin.get('/model/list');
  assert.equal(res.status, 200, why(res));
  assert.match(res.text, /leave-request/);
});

test('importing a model without a diagram lays it out, previews it and selects it', async () => {
  const res = await upload(admin, 'plain.bpmn', NO_DIAGRAM);
  assert.equal(res.status, 302, why(res));
  assert.equal(res.location, '/');
  const name = 'plain';
  assert.ok((await modelNames()).includes(name), 'listed under the file name without its extension');

  const source = await web.bpmnServer.definitions.getSource(name);
  assert.match(source, /BPMNDiagram/, 'diagram information added');

  const svg = await admin.get('/model/getSvg/' + encodeURIComponent(name));
  assert.match(svg.text, /data-element-id="t"/, 'preview generated');

  const home = await admin.get('/');
  assert.match(home.text, /data-current-process="plain"/, 'imported model is selected');
});

test('importing a model with a diagram keeps it as it is', async () => {
  const original = fs.readFileSync(path.join(FIXTURES, 'leave-request.bpmn'), 'utf8');
  const res = await upload(admin, 'leave-copy.bpmn', original);
  assert.equal(res.status, 302, why(res));
  assert.ok((await modelNames()).includes('leave-copy'));
  assert.equal(await web.bpmnServer.definitions.getSource('leave-copy'), original);
});

test('import refuses unsafe file names', async () => {
  const res = await upload(admin, '..\\..\\evil.bpmn', NO_DIAGRAM);
  assert.ok(!(await modelNames()).some(n => n.includes('evil') && n.includes('..')));
  assert.ok([302, 400].includes(res.status), why(res));
});

test('the modeler lays out a saved model without a diagram, without changing the file', async () => {
  fs.writeFileSync(path.join(web.definitionsPath, 'no-diagram.bpmn'), NO_DIAGRAM);
  await web.bpmnServer.engine.install({ rebuild: true });
  const res = await designer.get('/model/edit/no-diagram');
  assert.equal(res.status, 200, why(res));
  const modelJson = /<script id="model-source" type="application\/json">([\s\S]*?)<\/script>/.exec(res.text)[1];
  assert.match(JSON.parse(modelJson), /BPMNDiagram/, 'the editor gets diagram information');
  assert.equal(await web.bpmnServer.definitions.getSource('no-diagram'), NO_DIAGRAM, 'the file is unchanged until saved');
});

test('the modeler saves a model with its diagram', async () => {
  const bpmn = fs.readFileSync(path.join(FIXTURES, 'leave-request.bpmn'), 'utf8').replace('name="Leave request"', 'name="Leave request v2"');
  const res = await admin.request('POST', '/model/edit/leave-request', { json: { processId: 'leave-request', bpmn, svg: '<svg xmlns="http://www.w3.org/2000/svg"><g data-element-id="Submit"/></svg>' } });
  assert.equal(res.status, 200, why(res));
  assert.match(await web.bpmnServer.definitions.getSource('leave-request'), /Leave request v2/);
  assert.match((await admin.get('/model/getSvg/leave-request')).text, /data-element-id="Submit"/);
});

test('a new model opens the modeler with an empty diagram', async () => {
  const res = await admin.post('/model/new', { processName: 'brand-new' });
  assert.equal(res.status, 302);
  assert.equal(res.location, '/model/add/brand-new');
  const modeler = await admin.get(res.location);
  assert.equal(modeler.status, 200, why(modeler));
  assert.match(modeler.text, /bpmn/i);
});

test('models are renamed and deleted', async () => {
  await upload(admin, 'to-rename.bpmn', NO_DIAGRAM);
  const name = (await modelNames()).find(n => /^to-rename/.test(n));
  let res = await admin.post('/model/rename', { processName: name, newName: 'renamed' });
  assert.equal(res.status, 302, why(res));
  let names = await modelNames();
  assert.ok(names.includes('renamed') && !names.includes(name), names.join(','));

  res = await admin.post('/model/delete', { processName: 'renamed' });
  assert.equal(res.status, 302, why(res));
  assert.ok(!(await modelNames()).includes('renamed'));
});

test('model names with path separators are refused', async () => {
  const res = await admin.post('/model/rename', { processName: 'leave-request', newName: '../escape' });
  assert.equal(res.status, 400);
  assert.ok((await modelNames()).includes('leave-request'));
});

test('the modeler checks a model it is editing without saving it', async () => {
  const bpmn = fs.readFileSync(path.join(FIXTURES, 'leave-request.bpmn'), 'utf8').replace("data.approvedBy = 'system';", 'data.approvedBy = ;');
  const res = await admin.request('POST', '/model/verify', { json: { bpmn, processName: 'leave-request' } });
  assert.equal(res.status, 200, why(res));
  const result = JSON.parse(res.text);
  assert.equal(result.valid, false);
  assert.ok(result.issues.some(i => i.code === 'script-syntax' && i.elementId === 'AutoApprove'), res.text);
  assert.doesNotMatch(await web.bpmnServer.definitions.getSource('leave-request'), /approvedBy = ;/, 'not saved');

  // with how bpmn-server reads each element, as the instance page's model documentation does
  const descriptions = result.descriptions;
  assert.ok(descriptions.Submit.some(([label, value]) => label === 'candidateGroups' && value === 'staff'), JSON.stringify(descriptions.Submit));
  assert.ok(descriptions.ToApprove.some(([label, value]) => /condition/.test(label) && /days/.test(value)), JSON.stringify(descriptions.ToApprove));
  const unreadable = await admin.request('POST', '/model/verify', { json: { bpmn: '<not-bpmn/>' } });
  assert.deepEqual(JSON.parse(unreadable.text).descriptions, {}, 'none when the model does not load');

  assert.equal((await admin.request('POST', '/model/verify', { json: {} })).status, 400);
  assert.equal((await staff.request('POST', '/model/verify', { json: { bpmn } })).status, 403);
});

test("the editor lists the application's services for completion", async () => {
  const res = await designer.get('/model/services');
  assert.equal(res.status, 200, why(res));
  const names = JSON.parse(res.text).services.map(s => `${s.name}:${s.kind}`);
  for (const name of ['add:function', 'echo:function', 'getApprovers:function'])
    assert.ok(names.includes(name), names.join());
  assert.equal((await staff.get('/model/services')).status, 403);
});

test('models are exported for download', async () => {
  const page = await admin.get('/model/export');
  assert.equal(page.status, 200);
  assert.match(page.text, /leave-request/);
  const file = await admin.get('/model/download/leave-request.bpmn');
  assert.equal(file.status, 200, why(file));
  assert.match(file.text, /<bpmn:definitions/);
});

test('all the models download as a .zip, with their tests; the export page lists a model\'s tests', async () => {
  fs.writeFileSync(path.join(web.definitionsPath, 'leave-request.feature'), 'Feature: leave-request\n');
  try {
    const res = await designer.get('/model/download-all');
    assert.equal(res.status, 200, why(res));
    assert.match(res.headers.get('content-type'), /zip/);
    assert.ok(res.text.startsWith('PK'));
    assert.ok(res.text.includes('leave-request.bpmn'));
    assert.ok(res.text.includes('leave-request.feature'), 'its tests too');
    const page = await designer.get('/model/export');
    assert.equal(page.status, 200, why(page));
    assert.match(page.text, /href="\/model\/download\/leave-request\.feature"/);
  } finally {
    fs.rmSync(path.join(web.definitionsPath, 'leave-request.feature'), { force: true });
  }
});
