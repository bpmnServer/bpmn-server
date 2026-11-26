// @features: export-import
// Export and import of several models at once (docs/docs/export-import.md): the models chosen, what each needs, one
// .zip with a manifest, or one file alone; and the import that shows a package first, takes what is chosen, and
// refuses what a package must not do.
import test from 'node:test';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { startWebApp, why } from '../support/webApp.mjs';
import { zip, unzip, ZipError, isSafeEntryName, kindOf } from 'bpmn-web';

let web, admin, designer;

const DEFINITIONS = 'xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:camunda="http://camunda.org/schema/1.0/bpmn" xmlns:owf="http://omniworkflow.com/schema/owf/1.0" id="d" targetNamespace="t"';
const model = (id, body, attributes = '') => `<?xml version="1.0" encoding="UTF-8"?>
<bpmn:definitions ${DEFINITIONS}>
  <bpmn:process id="${id}" isExecutable="true" ${attributes}>
    ${body}
  </bpmn:process>
</bpmn:definitions>`;
const SIMPLE = id => model(id, `<bpmn:startEvent id="S"><bpmn:outgoing>f</bpmn:outgoing></bpmn:startEvent>
    <bpmn:endEvent id="E"><bpmn:incoming>f</bpmn:incoming></bpmn:endEvent>
    <bpmn:sequenceFlow id="f" sourceRef="S" targetRef="E" />`);

// Parent calls Child (and Missing, which is not there), asks Rule, calls the hr connector, and has a notification policy.
const PARENT = model('Parent', `<bpmn:startEvent id="S"><bpmn:outgoing>f1</bpmn:outgoing></bpmn:startEvent>
    <bpmn:callActivity id="C1" calledElement="Child"><bpmn:incoming>f1</bpmn:incoming><bpmn:outgoing>f2</bpmn:outgoing></bpmn:callActivity>
    <bpmn:callActivity id="C2" calledElement="Missing"><bpmn:incoming>f2</bpmn:incoming><bpmn:outgoing>f3</bpmn:outgoing></bpmn:callActivity>
    <bpmn:businessRuleTask id="B" camunda:decisionRef="Rule" camunda:resultVariable="r"><bpmn:incoming>f3</bpmn:incoming><bpmn:outgoing>f4</bpmn:outgoing></bpmn:businessRuleTask>
    <bpmn:serviceTask id="Svc"><bpmn:extensionElements><camunda:connector><camunda:connectorId>hr/listEmployees</camunda:connectorId></camunda:connector></bpmn:extensionElements>
      <bpmn:incoming>f4</bpmn:incoming><bpmn:outgoing>f5</bpmn:outgoing></bpmn:serviceTask>
    <bpmn:endEvent id="E"><bpmn:incoming>f5</bpmn:incoming></bpmn:endEvent>
    <bpmn:sequenceFlow id="f1" sourceRef="S" targetRef="C1" /><bpmn:sequenceFlow id="f2" sourceRef="C1" targetRef="C2" />
    <bpmn:sequenceFlow id="f3" sourceRef="C2" targetRef="B" /><bpmn:sequenceFlow id="f4" sourceRef="B" targetRef="Svc" />
    <bpmn:sequenceFlow id="f5" sourceRef="Svc" targetRef="E" />`, 'owf:notificationPolicy="Notices"');
const DMN = (name, out = 'plain') => `<?xml version="1.0" encoding="UTF-8"?>
<definitions xmlns="https://www.omg.org/spec/DMN/20191111/MODEL/" id="d" name="${name}" namespace="t">
  <decision id="${name}" name="${name}"><decisionTable id="t" hitPolicy="FIRST">
    <input id="i"><inputExpression id="e" typeRef="string"><text>event</text></inputExpression></input>
    <output id="o" name="template" typeRef="string" />
    <rule id="r"><inputEntry id="a"><text>-</text></inputEntry><outputEntry id="b"><text>"${out}"</text></outputEntry></rule>
  </decisionTable></decision>
</definitions>`;
const CONNECTOR = { id: 'hr', name: 'HR', baseUrl: 'http://hr.example/api', operations: { listEmployees: true },
    auth: { type: 'apiKey', in: 'header', name: 'x-hr-key', secret: 'SHOULD-NOT-LEAVE', last4: 'LEAVE' }, openapi: { version: '3.0.3', fetchedAt: 'now', bytes: 0 } };

/** The files a package is made of, in a models folder. */
function lay(folder) {
  const put = (file, text) => { const target = path.join(folder, ...file.split('/')); fs.mkdirSync(path.dirname(target), { recursive: true }); fs.writeFileSync(target, text); };
  put('Parent.bpmn', PARENT); put('Parent.svg', '<svg/>'); put('Parent.feature', 'Feature: Parent\n');
  put('Child.bpmn', SIMPLE('Child')); put('Child.feature', 'Feature: Child\n');
  put('Rule.dmn.xml', DMN('Rule')); put('Rule.dmn.feature', 'Feature: Rule\n');
  put('notification/Notices.dmn.xml', DMN('Notices', 'approval')); put('notification/templates/approval.md', 'Subject\nBody\n');
  put('connectors/hr.connector.json', JSON.stringify(CONNECTOR, null, 2));
  put('security/Rules.dmn.xml', DMN('Rules'));
  put('test-cases/Parent/Happy path.json', JSON.stringify({ format: 'owf-test-case', scenario: 'Happy path', ranAt: 'now', ok: true }));
  put('Alone.bpmn', SIMPLE('Alone'));
}

/** The models folder as a server that has none of it: what lay() made, gone (the packages were taken from it before). */
function wipe(folder) {
  for (const entry of ['Parent', 'Child', 'Rule', 'Alone', 'Lone'])
    for (const file of fs.readdirSync(folder).filter(f => f.startsWith(entry + '.'))) fs.rmSync(path.join(folder, file), { force: true });
  for (const dir of ['notification', 'connectors', 'security', 'test-cases']) fs.rmSync(path.join(folder, dir), { recursive: true, force: true });
}

test.before(async () => {
  web = await startWebApp();
  lay(web.definitionsPath);
  admin = await web.login('admin');
  designer = await web.login('designer');
  // a page is read once, as a person does, for the CSRF cookie that goes with the session
  for (const client of [admin, designer]) await client.get('/model/export');
});
test.after(async () => { await web?.stop(); setImmediate(() => process.exit(0)); });

/** A download as bytes: the harness's client reads text. */
async function download(client, site, url, json) {
  const csrf = decodeURIComponent(client.cookies.get('_csrf') ?? '');
  const res = await fetch(site.base + url, { method: 'POST', headers: { cookie: client.cookieHeader, 'content-type': 'application/json', 'x-csrf-token': csrf }, body: JSON.stringify(json) });
  return { status: res.status, headers: res.headers, data: Buffer.from(await res.arrayBuffer()) };
}
const PACKAGES = {};
const namesOf = zipped => unzip(zipped).map(e => e.name).sort();
const upload = (client, name, data) => client.request('POST', '/model/import', { multipart: { fileUploaded: { content: data, filename: name } } });
const tokenOf = page => page.match(/name="token" value="([0-9a-f]+)"/)?.[1];

test('a model with what it needs: the models it calls, its decision, policy, template, connector, tests and diagram', async () => {
  const res = await admin.request('POST', '/model/export/plan', { json: { items: ['process:Parent'], dependencies: true, companions: true } });
  assert.equal(res.status, 200, why(res));
  const files = res.body.files.map(f => f.path);
  for (const expected of ['Parent.bpmn', 'Parent.svg', 'Parent.feature', 'Child.bpmn', 'Child.feature', 'Rule.dmn.xml', 'Rule.dmn.feature',
    'notification/Notices.dmn.xml', 'notification/templates/approval.md', 'connectors/hr.connector.json'])
    assert.ok(files.includes(expected), `${expected}: ${files.join(', ')}`);
  assert.ok(files.includes('test-cases/Parent/Happy path.json'), 'the case its scenario made, which the guide links to');
  assert.ok(!files.includes('Alone.bpmn') && !files.includes('security/Rules.dmn.xml'), 'what nothing needs stays');
  const child = res.body.files.find(f => f.path === 'Child.bpmn');
  assert.deepEqual(child.requiredBy, ['Parent.bpmn']);
  assert.equal(child.selected, false);
  assert.equal(res.body.files.find(f => f.path === 'Parent.bpmn').selected, true);
  assert.ok(res.body.gaps.some(g => g.what === 'Missing.bpmn' && g.neededBy === 'Parent.bpmn'), 'a model it calls that is not there is said');
});

test('without dependencies and without tests: only what was chosen', async () => {
  const res = await admin.request('POST', '/model/export/plan', { json: { items: ['process:Parent'], dependencies: false, companions: false, cases: false } });
  assert.deepEqual(res.body.files.map(f => f.path), ['Parent.bpmn']);
  const noCases = await admin.request('POST', '/model/export/plan', { json: { items: ['process:Parent'], dependencies: false, cases: false } });
  assert.ok(!noCases.body.files.some(f => f.path.startsWith('test-cases/')), 'cases are an option of their own');
  assert.ok(noCases.body.files.some(f => f.path === 'Parent.feature'), 'the scenarios stay');
});

test('one decision, with its tests; and a choice that is not one is ignored', async () => {
  const res = await admin.request('POST', '/model/export/plan', { json: { items: ['decision:Rule.dmn.xml', 'process:../../etc/passwd', 'nonsense'] } });
  assert.deepEqual(res.body.files.map(f => f.path).sort(), ['Rule.dmn.feature', 'Rule.dmn.xml']);
});

test('a designer is not given a connector or a security policy: it is said, not silently left out', async () => {
  const res = await designer.request('POST', '/model/export/plan', { json: { items: ['process:Parent'] } });
  assert.ok(!res.body.files.some(f => f.path.startsWith('connectors/')), 'no connector');
  assert.ok(res.body.gaps.some(g => g.what === 'connectors/hr.connector.json' && /administrator/.test(g.why)));
  const policy = await designer.request('POST', '/model/export/plan', { json: { items: ['policy:security/Rules.dmn.xml'] } });
  assert.deepEqual(policy.body.files, [], 'a security policy is an administrator\'s');
  assert.equal((await admin.request('POST', '/model/export/plan', { json: { items: ['policy:security/Rules.dmn.xml'] } })).body.files.length, 1);
});

test('the .zip: the files, a manifest with each checksum, and a connector without its key', async () => {
  const res = await download(admin, web, '/model/export/package', { items: ['process:Parent'] });
  assert.equal(res.status, 200);
  assert.match(res.headers.get('content-type'), /zip/);
  assert.match(res.headers.get('content-disposition'), /Parent\.zip/);
  const entries = unzip(res.data);
  assert.ok(entries.some(e => e.name === 'manifest.json'));
  assert.ok(entries.some(e => e.name === 'Child.bpmn'));
  const manifest = JSON.parse(entries.find(e => e.name === 'manifest.json').data.toString());
  assert.equal(manifest.format, 'owf-package');
  assert.equal(manifest.version, 1);
  assert.deepEqual(manifest.chosen, ['process:Parent']);
  for (const file of manifest.files)
    assert.equal(crypto.createHash('sha256').update(entries.find(e => e.name === file.path).data).digest('hex'), file.sha256, file.path);
  const connector = entries.find(e => e.name === 'connectors/hr.connector.json').data.toString();
  assert.ok(!connector.includes('SHOULD-NOT-LEAVE') && !connector.includes('LEAVE"'), 'the key does not go with it');
  assert.equal(JSON.parse(connector).auth.name, 'x-hr-key', 'how it is sent does');
  assert.ok(fs.readFileSync(path.join(web.definitionsPath, 'connectors', 'hr.connector.json'), 'utf8').includes('SHOULD-NOT-LEAVE'), 'and the server\'s own file is as it was');
});

test('files left out are left out; one file left is that file alone, not a .zip', async () => {
  const less = await download(admin, web, '/model/export/package', { items: ['process:Parent'], skip: ['Child.bpmn', 'Child.feature'] });
  assert.ok(!namesOf(less.data).includes('Child.bpmn'));
  const one = await download(admin, web, '/model/export/package', { items: ['process:Alone'], dependencies: false, companions: false, cases: false });
  assert.equal(one.status, 200);
  assert.doesNotMatch(one.headers.get('content-type'), /zip/);
  assert.match(one.headers.get('content-disposition'), /Alone\.bpmn/);
  assert.equal(one.data.toString(), SIMPLE('Alone'));
  assert.equal((await download(admin, web, '/model/export/package', { items: [] })).status, 400, 'nothing chosen');
});

test('the export page lists the models, the decisions and the policies', async () => {
  const page = (await admin.get('/model/export')).text;
  assert.match(page, /value="process:Parent"/);
  assert.match(page, /value="decision:Rule\.dmn\.xml"/);
  assert.match(page, /value="policy:notification\/Notices\.dmn\.xml"/);
  assert.match(page, /value="policy:security\/Rules\.dmn\.xml"/, 'an administrator sees the security policies');
  assert.doesNotMatch((await designer.get('/model/export')).text, /policy:security/, 'a designer does not');
});

test('import: the package is shown first, nothing is written until it is applied', async () => {
  const zipped = (await download(admin, web, '/model/export/package', { items: ['process:Parent'] })).data;
  PACKAGES.parent = zipped;
  PACKAGES.security = (await download(admin, web, '/model/export/package', { items: ['policy:security/Rules.dmn.xml', 'decision:Rule.dmn.xml'] })).data;
  wipe(web.definitionsPath);
  const shown = await upload(admin, 'Parent.zip', zipped);
  assert.equal(shown.status, 200, why(shown));
  for (const file of ['Parent.bpmn', 'Child.bpmn', 'Rule.dmn.xml', 'notification/Notices.dmn.xml', 'connectors/hr.connector.json'])
    assert.ok(shown.text.includes(file), file);
  assert.ok(!fs.existsSync(path.join(web.definitionsPath, 'Parent.bpmn')), 'nothing is written by the upload');
  assert.ok(tokenOf(shown.text));
});

test('import: what is taken is written, the rest is not; a connector arrives without a key; a second time it is already here', async () => {
  const zipped = PACKAGES.parent;
  const token = tokenOf((await upload(admin, 'Parent.zip', zipped)).text);
  const take = ['test-cases/Parent/Happy path.json', 'Parent.bpmn', 'Child.bpmn', 'Rule.dmn.xml', 'connectors/hr.connector.json', 'notification/Notices.dmn.xml', 'notification/templates/approval.md'];
  const applied = await admin.request('POST', '/model/import/apply', { json: { token, take } });
  assert.equal(applied.status, 200, why(applied));
  for (const file of take) assert.ok(fs.existsSync(path.join(web.definitionsPath, ...file.split('/'))), `${file} is there`);
  assert.ok(!fs.existsSync(path.join(web.definitionsPath, 'Parent.feature')), 'a file not taken is not written');
  assert.ok(fs.existsSync(path.join(web.definitionsPath, 'test-cases', 'Parent', 'Happy path.json')), 'the case is written beside the models');
  assert.ok(!fs.readFileSync(path.join(web.definitionsPath, 'connectors', 'hr.connector.json'), 'utf8').includes('SHOULD-NOT-LEAVE'));
  assert.equal((await admin.request('POST', '/model/import/apply', { json: { token, take } })).status, 200, 'a spent token says so, on a page');
  assert.match((await admin.request('POST', '/model/import/apply', { json: { token, take } })).text, /not kept any longer/);

  // again: the same, so nothing to take
  const again = await upload(admin, 'Parent.zip', zipped);
  assert.match(again.text, /the same/);
  assert.match(again.text, /Parent\.feature/, 'what was not taken is still offered');
});

test('import: a file that is different is left unless Replace is chosen', async () => {
  const zipped = zip(unzip(PACKAGES.parent).filter(e => e.name === 'Rule.dmn.xml' || e.name === 'Rule.dmn.feature'));
  const local = path.join(web.definitionsPath, 'Rule.dmn.xml');
  fs.writeFileSync(local, DMN('Rule').replace('plain', 'changed'));
  const shown = await upload(admin, 'Rule.zip', zipped);
  assert.match(shown.text, /different/);
  const kept = await admin.request('POST', '/model/import/apply', { json: { token: tokenOf(shown.text), take: ['Rule.dmn.xml'] } });
  assert.match(kept.text, /left as it is/);
  assert.match(fs.readFileSync(local, 'utf8'), /changed/);
  const replaced = await admin.request('POST', '/model/import/apply', { json: { token: tokenOf((await upload(admin, 'Rule.zip', zipped)).text), take: ['Rule.dmn.xml'], overwrite: ['Rule.dmn.xml'] } });
  assert.match(replaced.text, /replaced/);
  assert.doesNotMatch(fs.readFileSync(local, 'utf8'), /changed/);
});

test('import: a designer is not let import a connector or a security policy', async () => {
  const zipped = PACKAGES.security;
  const withConnector = zip([...unzip(zipped), { name: 'connectors/hr.connector.json', data: Buffer.from(JSON.stringify(CONNECTOR)) }].filter(e => e.name !== 'manifest.json'));
  fs.rmSync(path.join(web.definitionsPath, 'security'), { recursive: true, force: true });
  fs.rmSync(path.join(web.definitionsPath, 'connectors'), { recursive: true, force: true });
  const shown = await upload(designer, 'Mixed.zip', withConnector);
  assert.match(shown.text, /only an administrator imports it/);
  const applied = await designer.request('POST', '/model/import/apply', { json: { token: tokenOf(shown.text), take: ['security/Rules.dmn.xml', 'connectors/hr.connector.json', 'Rule.dmn.xml'] } });
  assert.ok(!fs.existsSync(path.join(web.definitionsPath, 'security', 'Rules.dmn.xml')), 'not written');
  assert.ok(!fs.existsSync(path.join(web.definitionsPath, 'connectors', 'hr.connector.json')), 'not written');
  assert.match(applied.text, /refused/);
});

test('import: a file that is not what a package has, one that does not match the manifest, and a connector that is not one are refused', async () => {
  const good = unzip(PACKAGES.parent);
  const tampered = good.map(e => e.name === 'Rule.dmn.xml' ? { ...e, data: Buffer.from(e.data.toString().replace('plain', 'tampered')) } : e);
  const shown = await upload(admin, 'Odd.zip', zip([...tampered, { name: 'run.exe', data: Buffer.from('x') }, { name: 'connectors/xx.connector.json', data: Buffer.from('{"id":"yy"}') },
    { name: 'test-cases/Rule/x.json', data: Buffer.from('{"not":"a case"}') }]));
  assert.match(shown.text, /not a test case file/);
  assert.match(shown.text, /does not match the manifest/);
  assert.match(shown.text, /not a file a package has/);
  assert.match(shown.text, /its id is its file&#39;s name|its id is its file's name/);
});

test('import: a name that leaves the folder, a damaged or unsupported .zip, and a package of a newer version are refused whole', async () => {
  for (const name of ['../evil.bpmn', '/abs.bpmn', 'a/../../b.bpmn', 'C:/x.bpmn', 'back\\slash.bpmn']) {
    const res = await upload(admin, 'Bad.zip', zip([{ name, data: Buffer.from('x') }]));
    assert.equal(res.status, 400, `${name}: ${why(res)}`);
    assert.match(res.text, /not allowed/);
  }
  assert.equal((await upload(admin, 'Bad.zip', Buffer.from('this is not a zip file at all'))).status, 400);
  const good = zip([{ name: 'Alone.bpmn', data: Buffer.from(SIMPLE('Alone')) }]);
  const flipped = Buffer.from(good); flipped[40] ^= 0xff;
  assert.equal((await upload(admin, 'Bad.zip', flipped)).status, 400, 'a damaged one');
  const newer = zip([{ name: 'manifest.json', data: Buffer.from(JSON.stringify({ format: 'owf-package', version: 2, files: [] })) }, { name: 'Alone.bpmn', data: Buffer.from(SIMPLE('Alone')) }]);
  assert.match((await upload(admin, 'Newer.zip', newer)).text, /version 2/);
  assert.ok(!fs.existsSync(path.join(web.definitionsPath, '..', 'evil.bpmn')), 'nothing outside');
});

test('import: a lone .bpmn is imported at once, as it always was; a lone decision is shown first', async () => {
  const res = await upload(admin, 'Alone.bpmn', Buffer.from(SIMPLE('Alone')));
  assert.equal(res.status, 302);
  assert.ok(fs.existsSync(path.join(web.definitionsPath, 'Alone.bpmn')));
  const decision = await upload(admin, 'Lone.dmn.xml', Buffer.from(DMN('Lone')));
  assert.equal(decision.status, 200);
  assert.match(decision.text, /Lone\.dmn\.xml/);
  assert.ok(!fs.existsSync(path.join(web.definitionsPath, 'Lone.dmn.xml')));
});

test('the .zip reader: its limits, its checksums, and what a name may be', () => {
  const two = zip([{ name: 'a.bpmn', data: Buffer.from('<a/>') }, { name: 'b/c.svg', data: Buffer.from('<s/>') }]);
  assert.deepEqual(unzip(two).map(e => e.name), ['a.bpmn', 'b/c.svg']);
  assert.throws(() => unzip(two, { files: 1 }), ZipError, 'too many files');
  assert.throws(() => unzip(zip([{ name: 'big.bpmn', data: Buffer.alloc(2000, 'x') }]), { entryBytes: 1000 }), /larger than/);
  assert.throws(() => unzip(zip([{ name: 'a.bpmn', data: Buffer.alloc(600, 'x') }, { name: 'b.bpmn', data: Buffer.alloc(600, 'y') }]), { totalBytes: 1000 }), /unpacks to more/);
  assert.throws(() => unzip(zip([{ name: 'a.bpmn', data: Buffer.from('1') }, { name: 'a.bpmn', data: Buffer.from('2') }])), /twice/);
  assert.throws(() => unzip(Buffer.from('nope')), /not a \.zip/);
  for (const bad of ['', '../x', 'a/../b', '/x', 'C:/x', 'a\\b', 'a//b', './x']) assert.equal(isSafeEntryName(bad), false, JSON.stringify(bad));
  for (const good of ['a.bpmn', 'notification/templates/x.md', 'Leave Application.bpmn']) assert.equal(isSafeEntryName(good), true, good);
});

test('what a package may hold: the models folder\'s own layout, and nothing hidden or outside it', () => {
  for (const [file, kind] of [['Leave Application.bpmn', 'process'], ['x.svg', 'diagram'], ['x.feature', 'test'], ['x.engine.feature', 'test'], ['x.dmn.tests.json', 'test'],
    ['x.dmn', 'decision'], ['x.dmn.xml', 'decision'], ['test-cases/Leave Application/Happy path.json', 'case'], ['assignment/x.dmn.xml', 'policy'], ['security/x.dmn.xml', 'policy'],
    ['notification/templates/x.md', 'template'], ['connectors/hr.connector.json', 'connector']])
    assert.equal(kindOf(file), kind, file);
  for (const file of ['x.exe', '.env', '.history/x.bpmn', 'test-cases/y.json', 'test-cases/a/b/c.json', 'test-cases/x/y.txt', 'other/x.dmn.xml', 'connectors/a b.connector.json', 'users.json', '../x.bpmn', 'a/../x.bpmn'])
    assert.equal(kindOf(file), null, file);
});
