// @features: add-ons
// Add-ons (engine/AddOns.ts, docs/design/add-ons.md): what is built on the engine plugs into its hooks, and the engine
// knows nothing of it. The policies are add-ons, each apart from the others. A server has the configuration's add-ons
// (by default the policies); `addOns: () => []` is the engine alone.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { verifyModel, policyAddOns, Configuration } from '../dist/index.js';
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
    assert.deepEqual(new Configuration({}).addOns().map(a => a.name), ['assignment', 'notification', 'security']);
    const { server } = await makeServer({ dir: folder() });
    assert.deepEqual(server.addOns.map(a => a.name), ['assignment', 'notification', 'security']);
    const { id } = await server.engine.start('Request', { amount: 1 }, null, 'ann');
    const [instance] = await server.dataStore.findInstances({ id }, 'full');
    assert.equal(instance.items.find(i => i.elementId === 'Approve').assignee, 'boss');
    assert.deepEqual((await notifications(server)).map(n => n.event), ['assigned']);
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

test('an application\'s own add-on: its hooks in order, it may assign; one that throws fails nothing', async () => {
    const heard = [];
    const mine = {
        name: 'mine',
        taskStarting(item) { heard.push('taskStarting'); item.assignee = 'mine'; },
        taskWaiting(item) { heard.push(`taskWaiting ${item.assignee}`); },
        taskCompleted() { heard.push('taskCompleted'); },
        taskReassigned(execution, item, before, changed, userName) { heard.push(`taskReassigned ${before.assignee}>${item.assignee} by ${userName}`); },
        executionEnded() { heard.push('executionEnded'); },
        verifyNode(check, node, def) { if (node.id === 'Approve') check.add('warning', 'mine', 'Mine', def); },
    };
    const broken = { name: 'broken', taskStarting() { throw new Error('broken'); }, executionEnded() { throw new Error('broken'); } };
    const { server } = await makeServer({ dir: folder(), extra: { addOns: () => [broken, mine] } });
    const { id } = await server.engine.start('Request', { amount: 1 }, null, 'ann');
    let [instance] = await server.dataStore.findInstances({ id }, 'full');
    const task = instance.items.find(i => i.elementId === 'Approve');
    assert.equal(task.assignee, 'mine');
    await server.engine.assign({ 'items.id': task.id }, {}, { assignee: 'bob' }, 'ann');
    await server.engine.invoke({ 'items.id': task.id }, {}, 'bob');
    [instance] = await server.dataStore.findInstances({ id }, 'full');
    assert.equal(instance.status, 'end');
    assert.deepEqual(heard, ['taskStarting', 'taskWaiting mine', 'taskReassigned mine>bob by ann', 'taskCompleted', 'executionEnded']);
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
