// @features: add-ons
// Add-ons (engine/AddOns.ts, docs/design/add-ons.md): what is built on the engine plugs into its hooks, and the engine
// knows nothing of it. The policies are add-ons, each apart from the others. A server has the configuration's add-ons
// (by default the policies); `addOns: () => []` is the engine alone.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { verifyModel, policyAddOns, Configuration, enabledAddOns, addOnManifests } from '../dist/index.js';
import { makeServer, definitionsFolder } from './helpers.mjs';

const SRC = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'src');
const ADDONS = path.join(SRC, 'addons');
/** Where the add-ons are put together: the package's entry, the command line, and the default configuration. */
const COMPOSITION = ['index.ts', 'cli.ts', path.join('common', 'DefaultConfiguration.ts')];

const sources = (dir) => fs.readdirSync(dir, { withFileTypes: true }).flatMap(e =>
    e.isDirectory() ? sources(path.join(dir, e.name)) : e.name.endsWith('.ts') ? [path.join(dir, e.name)] : []);
const importsOf = (file) => [...fs.readFileSync(file, 'utf8').matchAll(/(?:from|import\()\s*'([^']+)'/g)]
    .map(m => m[1]).filter(s => s.startsWith('.')).map(s => path.resolve(path.dirname(file), s));

test('the engine imports nothing from an add-on; only the package\'s entry, the command line and the default configuration put them together', () => {
    const offending = [];
    for (const file of sources(SRC)) {
        const rel = path.relative(SRC, file);
        if (rel.startsWith('addons' + path.sep) || COMPOSITION.includes(rel)) continue;
        for (const target of importsOf(file))
            if (target.startsWith(ADDONS)) offending.push(`${rel} imports ${path.relative(SRC, target)}`);
    }
    assert.deepEqual(offending, []);
});

test('an add-on imports no other add-on, only the engine', () => {
    const offending = [];
    for (const addOn of fs.readdirSync(ADDONS, { withFileTypes: true }).filter(e => e.isDirectory()).map(e => e.name)) {
        const own = path.join(ADDONS, addOn);
        for (const file of sources(own))
            for (const target of importsOf(file))
                if (target.startsWith(ADDONS) && !target.startsWith(own + path.sep))
                    offending.push(`${path.relative(SRC, file)} imports ${path.relative(SRC, target)}`);
    }
    assert.deepEqual(offending, []);
});

const MODEL = `<?xml version="1.0" encoding="UTF-8"?>
<bpmn:definitions xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:owf="http://omniworkflow.com/schema/owf/1.0"
    id="Defs" targetNamespace="http://bpmn.io/schema/bpmn">
  <bpmn:process id="Request" isExecutable="true" owf:notificationPolicy="Notices">
    <bpmn:startEvent id="Start"><bpmn:outgoing>f1</bpmn:outgoing></bpmn:startEvent>
    <bpmn:userTask id="Approve" name="Approve" owf:assignmentPolicy="Approval"><bpmn:incoming>f1</bpmn:incoming><bpmn:outgoing>f2</bpmn:outgoing></bpmn:userTask>
    <bpmn:endEvent id="End"><bpmn:incoming>f2</bpmn:incoming></bpmn:endEvent>
    <bpmn:sequenceFlow id="f1" sourceRef="Start" targetRef="Approve" /><bpmn:sequenceFlow id="f2" sourceRef="Approve" targetRef="End" />
  </bpmn:process>
</bpmn:definitions>`;

const TABLE = (id, hit, outputs, cells) => `<?xml version="1.0" encoding="UTF-8"?>
<definitions xmlns="https://www.omg.org/spec/DMN/20191111/MODEL/" id="d" name="d">
  <decision id="${id}" name="${id}">
    <decisionTable hitPolicy="${hit}">
      <input id="i1" label="amount"><inputExpression typeRef="number"><text>amount</text></inputExpression></input>
${outputs.map((o, i) => `      <output id="o${i}" name="${o}" typeRef="string" />`).join('\n')}
      <rule id="r1"><inputEntry><text>-</text></inputEntry>${cells.map(c => `<outputEntry><text>${c}</text></outputEntry>`).join('')}</rule>
    </decisionTable>
  </decision>
</definitions>`;

/** A folder with the model, its assignment policy (to "boss") and its notification policy (tell "everyone"). */
function folder() {
    const dir = definitionsFolder();
    fs.writeFileSync(path.join(dir, 'Request.bpmn'), MODEL);
    fs.mkdirSync(path.join(dir, 'policies', 'assignment'), { recursive: true });
    fs.writeFileSync(path.join(dir, 'policies', 'assignment', 'Approval.dmn.xml'), TABLE('Approval', 'FIRST', ['assignee'], ['"boss"']));
    fs.mkdirSync(path.join(dir, 'policies', 'notification'), { recursive: true });
    fs.writeFileSync(path.join(dir, 'policies', 'notification', 'Notices.dmn.xml'), TABLE('Notices', 'COLLECT', ['notify', 'template'], ['"everyone"', '"Hello"']));
    return dir;
}

const notifications = (srv) => srv.documentStore.find('bpmn_test', 'wf_notifications', {});

test('by default a server has the policies: the task is assigned by its policy, and the notifications are kept', async () => {
    assert.deepEqual(new Configuration({}).addOns().map(a => a.name), ['policies', 'labels', 'forms', 'modeling']);
    const { server } = await makeServer({ dir: folder() });
    assert.deepEqual(server.addOns.map(a => a.name), ['policies', 'labels', 'forms', 'modeling']);
    const { id } = await server.engine.start('Request', { amount: 1 }, null, 'ann');
    const [instance] = await server.dataStore.findInstances({ id }, 'full');
    assert.equal(instance.items.find(i => i.elementId === 'Approve').assignee, 'boss');
    assert.deepEqual((await notifications(server)).map(n => n.event), ['assigned'], 'once, as the task starts, after its policy: on the engine\'s assign');
    // a person reassigns it: through the same step, so told again; what decided it is theirs now
    const task = instance.items.find(i => i.elementId === 'Approve');
    await server.engine.assign({ 'items.id': task.id }, {}, { assignee: 'bob' }, 'ann');
    let [after] = await server.dataStore.findInstances({ id }, 'full');
    assert.deepEqual(after.items.find(i => i.elementId === 'Approve').assignment, { userName: 'ann' });
    assert.deepEqual((await notifications(server)).map(n => n.event), ['assigned', 'assigned'], 'the new assignee is told');
    // the same people again (a form sends every field): no one told, and what decided it stays
    await server.engine.assign({ 'items.id': task.id }, {}, { assignee: 'bob' }, 'carl');
    [after] = await server.dataStore.findInstances({ id }, 'full');
    assert.deepEqual(after.items.find(i => i.elementId === 'Approve').assignment, { userName: 'ann' });
    assert.equal((await notifications(server)).length, 2);
    await server.shutdown();
});

test('the engine alone (addOns: () => []): the policies the model names are not asked, and not checked', async () => {
    const dir = folder();
    const { server } = await makeServer({ dir, extra: { addOns: () => [] } });
    const { id } = await server.engine.start('Request', { amount: 1 }, null, 'ann');
    let [instance] = await server.dataStore.findInstances({ id }, 'full');
    const task = instance.items.find(i => i.elementId === 'Approve');
    assert.equal(task.assignee, undefined, 'no policy assigned it');
    assert.equal(task.status, 'wait');
    await server.engine.invoke({ 'items.id': task.id }, {}, 'ann');
    [instance] = await server.dataStore.findInstances({ id }, 'full');
    assert.equal(instance.status, 'end', 'the process runs as BPMN says');
    assert.deepEqual(await notifications(server), [], 'no one told');
    fs.rmSync(path.join(dir, 'policies'), { recursive: true });
    const codes = (await verifyModel(MODEL, server, 'Request')).issues.map(i => i.code);
    assert.ok(!codes.some(c => /policy/.test(c)), codes.join());
    await server.shutdown();
});

test('an application\'s own add-on registers for the engine\'s events: it assigns through the engine as a task starts; one that throws fails nothing', async () => {
    const heard = [];
    const mine = {
        name: 'mine',
        register(server) {
            server.listener.subscribe({
                async onEvent({ type, context, details }) {
                    const item = context.item;
                    if (type === 'start' && item?.elementId === 'Approve') await context.assignItem(item, { assignee: 'mine' });
                    if (['wait', 'assign', 'end'].includes(type) && item?.elementId === 'Approve')
                        heard.push(type === 'assign' ? `assign ${details.before.assignee ?? '-'}>${item.assignee} by ${details.by ?? 'the task'}` : `${type} ${item.assignee}`);
                    if (type === 'process.end') heard.push('process.end');
                },
            });
            server.registrations.addModelCheck({ name: 'mine', verifyNode(check, node, def) { if (node.id === 'Approve') check.add('warning', 'mine', 'Mine', def); } });
        },
    };
    const broken = { name: 'broken', register(server) { server.listener.subscribe({ onEvent() { throw new Error('broken'); } }); } };
    const { server } = await makeServer({ dir: folder(), extra: { addOns: () => [broken, mine] } });
    const { id } = await server.engine.start('Request', { amount: 1 }, null, 'ann');
    let [instance] = await server.dataStore.findInstances({ id }, 'full');
    const task = instance.items.find(i => i.elementId === 'Approve');
    assert.equal(task.assignee, 'mine', 'decided as it starts, saved');
    await server.engine.assign({ 'items.id': task.id }, {}, { assignee: 'bob' }, 'ann');
    await server.engine.invoke({ 'items.id': task.id }, {}, 'bob');
    [instance] = await server.dataStore.findInstances({ id }, 'full');
    assert.equal(instance.status, 'end');
    assert.deepEqual(heard, ['assign ->mine by the task', 'wait mine', 'assign mine>bob by ann', 'end bob', 'process.end']);
    const issues = (await verifyModel(MODEL, server, 'Request')).issues;
    assert.ok(issues.some(i => i.code === 'mine' && i.elementId === 'Approve'));
    assert.ok(!issues.some(i => /policy/.test(i.code)), 'the policies are not this server\'s');
    await server.shutdown();
});

test('a model checked without a server: the add-ons it is given', async () => {
    const dir = folder();
    fs.rmSync(path.join(dir, 'policies', 'assignment'), { recursive: true });
    const codes = async (options) => (await verifyModel(MODEL, undefined, 'Request', { decisionsFolder: dir, ...options })).issues.map(i => i.code);
    assert.ok(!(await codes({})).includes('assignment-policy-not-found'), 'none: the model alone');
    assert.ok((await codes({ addOns: policyAddOns() })).includes('assignment-policy-not-found'));
});

test('what the package exported before the policies moved is still exported, from its entry', async () => {
    const entry = await import('../dist/index.js');
    const before = ['DEFAULT_SECURITY_POLICY', 'FULL_ACCESS', 'NOTIFICATION_COLLECTION', 'NOTIFICATION_EVENTS', 'NOTIFICATION_FOLDER',
        'NOTIFICATION_OUTPUTS', 'NOTIFICATION_TEMPLATES', 'POLICIES_FOLDER', 'POLICY_FIELDS', 'SECURITY_ACTIONS', 'SECURITY_FOLDER',
        'SecurityPolicy', 'applyPolicy', 'builtInSeeConditions', 'combineSeeConditions', 'deliversNotifications', 'evaluatePolicy',
        'findNotifications', 'isExpression', 'notificationPolicyFile', 'notificationPolicyNames', 'notificationTemplateFile',
        'notificationsOf', 'notifyEvent', 'policyFile', 'policyNames', 'reassigned', 'roleNameProblem', 'roleNames', 'roleUses',
        'saveRoleNames', 'seeConditionsOfTable'];
    assert.deepEqual(before.filter(name => entry[name] === undefined), []);
});

test('app-config.json says which add-ons are on: none named, none on; no file, or no addOns, every one', () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'bpmn-app-config-'));
    const file = path.join(dir, 'app-config.json');
    assert.deepEqual(enabledAddOns(file).map(a => a.name), ['policies', 'labels', 'forms', 'modeling'], 'no file: every one, as before');
    fs.writeFileSync(file, JSON.stringify({ addOns: [] }));
    assert.deepEqual(enabledAddOns(file), []);
    const warned = [];
    fs.writeFileSync(file, JSON.stringify({ addOns: ['policies', 'nonsense'] }));
    assert.deepEqual(enabledAddOns(file, m => warned.push(m)).map(a => a.name), ['policies']);
    assert.match(warned[0], /'nonsense', which is not an add-on/);
    fs.writeFileSync(file, JSON.stringify({ other: 1 }));
    assert.deepEqual(enabledAddOns(file).map(a => a.name), ['policies', 'labels', 'forms', 'modeling'], 'no addOns: every one');
    fs.writeFileSync(file, JSON.stringify({ addOns: 'policies' }));
    assert.throws(() => enabledAddOns(file), /addOns is a list/);
    assert.deepEqual(new Configuration({ appConfig: path.join(dir, 'none.json') }).addOns().map(a => a.name), ['policies', 'labels', 'forms', 'modeling']);
});

test('a model that uses an add-on that is off: one warning, naming where; its attributes ignored', async () => {
    const manifests = addOnManifests();
    assert.ok(manifests.find(m => m.name === 'policies').attributes.includes('owf:assignmentPolicy'));
    const off = (await verifyModel(MODEL, undefined, 'Request', { addOns: [], manifests })).issues.filter(i => i.code === 'add-on-off');
    assert.equal(off.length, 1);
    assert.match(off[0].message, /uses Policies \(notificationPolicy on Request, assignmentPolicy on Approve\), which is off/);
    assert.equal(off[0].severity, 'warning');
    const on = await verifyModel(MODEL, undefined, 'Request', { addOns: policyAddOns(), manifests });
    assert.ok(!on.issues.some(i => i.code === 'add-on-off'));
});

test('Labels off: a case is shown by its default, a task by its name; its checks and columns are not asked', async () => {
    const { labelInstances, labelFields } = await import('../dist/index.js');
    const LABELLED = MODEL.replace('<bpmn:process id="Request"', '<bpmn:process id="Request" owf:label="Amount: ${data.amount}"');
    const dir = folder();
    fs.writeFileSync(path.join(dir, 'Request.bpmn'), LABELLED);
    const without = await makeServer({ dir, extra: { addOns: () => policyAddOns() } });
    const { id } = await without.server.engine.start('Request', { amount: 7, caseId: 12 }, null, 'ann');
    let [instance] = await labelInstances(without.server, await without.server.dataStore.findInstances({ id }, 'full'));
    assert.equal(instance.label, 'Request #12', 'its default, not its template');
    assert.deepEqual(await labelFields(without.server, ['Request']), [{ name: 'caseId', model: 'Request', path: 'data.caseId' }]);
    const off = (await verifyModel(LABELLED.replace('${data.amount}', '${data.amount + 1}'), without.server, 'Request')).issues;
    assert.ok(!off.some(i => i.code === 'label-template'), 'its checks are not asked');
    assert.ok(off.some(i => i.code === 'add-on-off' && /Labels \(label on Request\)/.test(i.message)));
    await without.server.shutdown();
    const withLabels = await makeServer({ dir });
    const started = await withLabels.server.engine.start('Request', { amount: 7, caseId: 12 }, null, 'ann');
    [instance] = await labelInstances(withLabels.server, await withLabels.server.dataStore.findInstances({ id: started.id }, 'full'));
    assert.equal(instance.label, 'Amount: 7');
    await withLabels.server.shutdown();
});

test('Forms off: a form field with a list is a plain field; the model is told the add-on is off', async () => {
    const withList = `<?xml version="1.0" encoding="UTF-8"?>
<bpmn:definitions xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:camunda="http://camunda.org/schema/1.0/bpmn"
    xmlns:owf="http://omniworkflow.com/schema/owf/1.0" id="Defs" targetNamespace="http://bpmn.io/schema/bpmn">
  <bpmn:process id="Pick" isExecutable="true">
    <bpmn:startEvent id="Start"><bpmn:outgoing>f1</bpmn:outgoing></bpmn:startEvent>
    <bpmn:userTask id="Choose"><bpmn:extensionElements><camunda:formData><camunda:formField id="color" type="string">
      <owf:list source="service:noSuchService" /></camunda:formField></camunda:formData></bpmn:extensionElements>
      <bpmn:incoming>f1</bpmn:incoming><bpmn:outgoing>f2</bpmn:outgoing></bpmn:userTask>
    <bpmn:endEvent id="End"><bpmn:incoming>f2</bpmn:incoming></bpmn:endEvent>
    <bpmn:sequenceFlow id="f1" sourceRef="Start" targetRef="Choose" /><bpmn:sequenceFlow id="f2" sourceRef="Choose" targetRef="End" />
  </bpmn:process>
</bpmn:definitions>`;
    const { server } = await makeServer({ extra: { addOns: () => policyAddOns() } });
    const issues = (await verifyModel(withList, server, 'Pick')).issues;
    assert.ok(issues.some(i => i.code === 'add-on-off' && /Forms and display \(list\)/.test(i.message)), JSON.stringify(issues.map(i => i.code)));
    assert.ok(!issues.some(i => /^lookup-/.test(i.code)), 'its checks are not asked');
    await server.shutdown();
});
