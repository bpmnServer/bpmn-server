// @features: assignment-policies, security-policies
// One set of names for every expression (engine/DecisionContext.ts, docs/design/expressions.md): JavaScript and FEEL,
// a business rule task's decision, an assignment policy and a security policy see the same names: `data` (the item's,
// in its scope), `instance`, `item` and `this`, `input`, `output`, `user` (the application's), `actors` (who did what:
// owf:actor), `task`, `appServices`; then the application's facts. And the reverse of a security policy.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { decisionContext, actorsOf, actorElements, actorNamesOf, SecurityPolicy, DMNEngine, ScriptHandler } from '../dist/index.js';
import { makeServer, definitionsFolder } from './helpers.mjs';

const CASE = {
    name: 'Request', userName: 'ann', data: { amount: 50, user: 'spoofed', actors: 'spoofed' },
    items: [
        { seq: 1, type: 'bpmn:StartEvent', elementId: 'S', status: 'end', userName: 'ann' },
        { seq: 2, type: 'bpmn:UserTask', elementId: 'Notes', name: 'Notes', status: 'end', userName: 'bob' },
        { seq: 3, type: 'bpmn:UserTask', elementId: 'Approve', name: 'Approve', status: 'wait', candidateGroups: ['Manager'] },
    ],
};

test('the names: the data by name and whole, prepared inputs over it, the protocol\'s names over both, the application\'s facts last', async () => {
    const context = await decisionContext({ kind: 'security', data: CASE.data, input: { amount: 70, manager: 'mia' },
        user: { userName: 'ann', userGroups: ['Employee'], department: 'Sales' }, instance: CASE, task: 'Approve',
        item: CASE.items[2], elements: new Map([['Notes', 'noter']]), appServices: { double: x => x * 2 } });
    assert.equal(context.amount, 70, 'a prepared input over the data');
    assert.equal(context.data.amount, 50, 'the data whole, as it is');
    assert.equal(context.manager, 'mia');
    assert.deepEqual(context.user, { userName: 'ann', userGroups: ['Employee'], department: 'Sales' }, 'the application\'s user, as it is; not the data\'s "user"');
    assert.deepEqual(context.actors, { initiator: 'ann', noter: 'bob', assignee: null, candidate: 'Manager' }, 'not the data\'s "actors"');
    assert.equal(context.task, 'Approve');
    assert.deepEqual(context.decision, { kind: 'security', name: '' });
    assert.equal(context.item.elementId, 'Approve');
    assert.equal(context.this, context.item, 'this is the item');
    assert.equal(context.item.element.type, 'bpmn:UserTask');
    assert.equal(context.instance.name, 'Request');
    assert.equal(context.appServices.double(4), 8, 'the application\'s functions, as FEEL calls them');

    const logged = [];
    const withFacts = await decisionContext({ kind: 'assignment', name: 'P', data: CASE.data, user: { userName: 'mia' }, instance: CASE,
        appDelegate: { decisionContext: (ctx, about) => ({ managerOf: about.user.userName === 'mia', userGroups: ['Manager'] }) } });
    assert.equal(withFacts.managerOf, true, 'the application\'s fact');
    assert.deepEqual(withFacts.user.userGroups, ['Manager'], 'its groups for the user, where they are read');
    const failing = await decisionContext({ kind: 'decision', name: 'D', data: {}, appDelegate: { decisionContext: () => { throw new Error('down'); } }, log: m => logged.push(m) });
    assert.equal(failing.task, '');
    assert.match(logged.join(), /decisionContext failed \(decision D\): down/);
});

test('actors in a multi-instance: asked from an item, its branch\'s; asked about the instance, everyone\'s, latest first', () => {
    const tokens = [{ id: 0, dataPath: '' }, { id: 1, dataPath: 'Lines.0' }, { id: 2, dataPath: 'Lines.1' }];
    const instance = {
        name: 'Order', tokens,
        items: [
            { seq: 1, type: 'bpmn:StartEvent', elementId: 'S', status: 'end', userName: 'ann', tokenId: 0 },
            { seq: 2, type: 'bpmn:UserTask', elementId: 'Review', status: 'end', userName: 'rob', tokenId: 1 },
            { seq: 3, type: 'bpmn:UserTask', elementId: 'Review', status: 'end', userName: 'sue', tokenId: 2 },
            { seq: 4, type: 'bpmn:UserTask', elementId: 'Ship', status: 'wait', assignee: 'tom', tokenId: 2 },
        ],
    };
    const elements = actorElements('<bpmn:userTask id="Review" name="Review" owf:actor="reviewer" />');
    assert.deepEqual([...elements], [['Review', 'reviewer']]);
    assert.deepEqual(actorsOf({ instance, elements }).reviewer, ['sue', 'rob'], 'the instance: both, latest first');
    assert.equal(actorsOf({ instance, elements, scope: 'Lines.0' }).reviewer, 'rob', 'line 0\'s reviewer');
    assert.equal(actorsOf({ instance, elements, scope: 'Lines.1' }).reviewer, 'sue');
    assert.equal(actorsOf({ instance, elements, scope: 'Lines.0' }).assignee, null, 'line 1\'s waiting task is not line 0\'s');
    assert.equal(actorsOf({ instance, elements, scope: 'Lines.0' }).initiator, 'ann', 'the top is every branch\'s');
    assert.deepEqual(actorNamesOf({ userName: 'sue' }, actorsOf({ instance, elements })), ['reviewer']);
});

test('a list input: tested whole first (count(?) > 1), then by its values ("Manager" in the user\'s groups)', async () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'bpmn-dc-'));
    const file = path.join(dir, 'Lists.dmn.xml');
    fs.writeFileSync(file, `<?xml version="1.0" encoding="UTF-8"?>
<definitions xmlns="https://www.omg.org/spec/DMN/20191111/MODEL/" id="d" name="Lists" namespace="t">
  <decision id="Lists" name="Lists"><decisionTable id="t" hitPolicy="FIRST">
    <input id="i1" label="groups"><inputExpression id="e1" typeRef="string"><text>user.userGroups</text></inputExpression></input>
    <output id="o1" name="answer" typeRef="string" />
    <rule id="r1"><inputEntry id="a"><text>count(?) &gt; 2</text></inputEntry><outputEntry id="b"><text>"many"</text></outputEntry></rule>
    <rule id="r2"><inputEntry id="c"><text>"Manager"</text></inputEntry><outputEntry id="d"><text>"a manager"</text></outputEntry></rule>
  </decisionTable></decision>
</definitions>`);
    const ask = async userGroups => (await new DMNEngine({ listInputs: true }).load(file)).evaluate({ user: { userGroups } })?.answer ?? null;
    assert.equal(await ask(['a', 'b', 'Manager']), 'many', 'the list itself');
    assert.equal(await ask(['Employee', 'Manager']), 'a manager', 'one of its values');
    assert.equal(await ask(['Employee']), null);
});

/**
 * A process: Submit (an actor, the submitter), then a business rule and Approve, whose policy and decision read the
 * same names; a script and a FEEL condition read them too.
 */
const MODEL = `<?xml version="1.0" encoding="UTF-8"?>
<bpmn:definitions xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:camunda="http://camunda.org/schema/1.0/bpmn"
    xmlns:owf="http://omniworkflow.com/schema/owf/1.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" id="D" targetNamespace="t">
  <bpmn:process id="Ctx" isExecutable="true">
    <bpmn:startEvent id="Start" />
    <bpmn:userTask id="Submit" name="Submit" owf:actor="submitter" />
    <bpmn:businessRuleTask id="Route" camunda:decisionRef="Route" camunda:resultVariable="route" camunda:mapDecisionResult="singleResult">
      <bpmn:extensionElements><camunda:inputOutput>
        <camunda:inputParameter name="boss">$(appServices.managerOf(this.data.requester))</camunda:inputParameter>
      </camunda:inputOutput></bpmn:extensionElements>
    </bpmn:businessRuleTask>
    <bpmn:userTask id="Approve" name="Approve" owf:assignmentPolicy="Approval">
      <bpmn:extensionElements><camunda:inputOutput>
        <camunda:inputParameter name="boss">$(appServices.managerOf(this.data.requester))</camunda:inputParameter>
      </camunda:inputOutput></bpmn:extensionElements>
    </bpmn:userTask>
    <bpmn:scriptTask id="Note" scriptFormat="JavaScript"><bpmn:script>data.noted = actors.submitter + ' for ' + user.userName + ', approved by ' + actors.approver;</bpmn:script></bpmn:scriptTask>
    <bpmn:exclusiveGateway id="Big" default="small" />
    <bpmn:endEvent id="BigEnd" /><bpmn:endEvent id="SmallEnd" />
    <bpmn:sequenceFlow id="f1" sourceRef="Start" targetRef="Submit" />
    <bpmn:sequenceFlow id="f2" sourceRef="Submit" targetRef="Route" />
    <bpmn:sequenceFlow id="f3" sourceRef="Route" targetRef="Approve" />
    <bpmn:sequenceFlow id="f4" sourceRef="Approve" targetRef="Note" />
    <bpmn:sequenceFlow id="f5" sourceRef="Note" targetRef="Big" />
    <bpmn:sequenceFlow id="big" sourceRef="Big" targetRef="BigEnd"><bpmn:conditionExpression xsi:type="bpmn:tFormalExpression" language="feel">this.data.amount &gt; 100 and appServices.isBig(data.amount) and actors.initiator = "ann"</bpmn:conditionExpression></bpmn:sequenceFlow>
    <bpmn:sequenceFlow id="small" sourceRef="Big" targetRef="SmallEnd" />
  </bpmn:process>
</bpmn:definitions>`;
// Approve's own actor: the approver (owf:actor on it too)
const WITH_APPROVER = MODEL.replace('owf:assignmentPolicy="Approval"', 'owf:assignmentPolicy="Approval" owf:actor="approver"');

/** One table, read by both: the initiator and the submitter (actors), the application's fact, an async service, a prepared input. */
const TABLE = (name, outputs) => `<?xml version="1.0" encoding="UTF-8"?>
<definitions xmlns="https://www.omg.org/spec/DMN/20191111/MODEL/" id="${name}_d" name="${name}" namespace="t">
  <decision id="${name}" name="${name}"><decisionTable id="${name}_t" hitPolicy="FIRST">
    <input id="${name}_i1" label="initiator"><inputExpression id="${name}_e1" typeRef="string"><text>actors.initiator</text></inputExpression></input>
    <input id="${name}_i2" label="submitter"><inputExpression id="${name}_e2" typeRef="string"><text>actors.submitter</text></inputExpression></input>
    <input id="${name}_i3" label="tier"><inputExpression id="${name}_e3" typeRef="string"><text>tier</text></inputExpression></input>
    <input id="${name}_i4" label="region"><inputExpression id="${name}_e4" typeRef="string"><text>appServices.regionOf(data.requester)</text></inputExpression></input>
${outputs.map((o, n) => `    <output id="${name}_o${n}" name="${o}" typeRef="string" />`).join('\n')}
    <rule id="${name}_r1"><inputEntry id="${name}_a"><text>"ann"</text></inputEntry><inputEntry id="${name}_b"><text>user.userName</text></inputEntry><inputEntry id="${name}_c"><text>"gold"</text></inputEntry><inputEntry id="${name}_g"><text>"EU"</text></inputEntry>
${outputs.map((o, n) => `      <outputEntry id="${name}_r1o${n}"><text>${n ? '"Directors"' : 'boss'}</text></outputEntry>`).join('\n')}</rule>
    <rule id="${name}_r2"><inputEntry id="${name}_d"><text>-</text></inputEntry><inputEntry id="${name}_e"><text>-</text></inputEntry><inputEntry id="${name}_f"><text>-</text></inputEntry><inputEntry id="${name}_h"><text>-</text></inputEntry>
${outputs.map((o, n) => `      <outputEntry id="${name}_r2o${n}"><text>"nobody"</text></outputEntry>`).join('\n')}</rule>
  </decisionTable></decision>
</definitions>`;

test('every expression reads the same names: a business rule, an assignment policy, a script, a FEEL condition', async () => {
    const dir = definitionsFolder();
    fs.writeFileSync(path.join(dir, 'Ctx.bpmn'), WITH_APPROVER);
    fs.writeFileSync(path.join(dir, 'Route.dmn.xml'), TABLE('Route', ['who']));
    fs.mkdirSync(path.join(dir, 'policies', 'assignment'), { recursive: true });
    fs.writeFileSync(path.join(dir, 'policies', 'assignment', 'Approval.dmn.xml'), TABLE('Approval', ['assignee', 'candidateGroups']));
    const { server } = await makeServer({ dir, services: {
        managerOf: id => `manager-of-${id}`,
        regionOf: async id => id === 'ann' ? 'EU' : 'US',
        isBig: amount => amount > 100,
        decisionContext: (context, about) => ({ tier: about.user.userName === 'ann' ? 'gold' : 'basic' }),
    } });
    const { id } = await server.engine.start('Ctx', { requester: 'ann', amount: 500 }, null, 'ann');
    await server.engine.invoke({ id, 'items.elementId': 'Submit' }, {}, 'ann');
    let [instance] = await server.dataStore.findInstances({ id }, 'full');
    assert.deepEqual(instance.data.route, { who: 'manager-of-ann' },
        'the decision: ann started it and submitted it (actors), is acting (user), a gold customer, in the EU (an async service); the prepared boss');
    const approve = instance.items.find(i => i.elementId === 'Approve');
    assert.equal(approve.assignee, 'manager-of-ann', 'the policy, the same rule: its assignee the prepared input');
    assert.deepEqual(approve.candidateGroups, ['Directors']);
    assert.deepEqual(approve.assignment, { policy: 'Approval', rule: 1 });

    await server.engine.invoke({ id, 'items.elementId': 'Approve' }, {}, 'mia');
    [instance] = await server.dataStore.findInstances({ id }, 'full');
    assert.equal(instance.data.noted, 'ann for mia, approved by mia', 'a script: actors and user');
    assert.equal(instance.items.find(i => i.elementId === 'BigEnd')?.status, 'end',
        'a FEEL condition: this.data, data, an application\'s service and an actor');
    await server.shutdown();
});

test('a process\'s own script reads data: the instance\'s; a script that declares its own `user` keeps it', async () => {
    const execution = { tokens: new Map(), instance: { id: 'i', name: 'P', data: { x: 7 } }, appDelegate: { appUtils: {} }, servicesProvider: {}, userName: 'ann' };
    const handler = new ScriptHandler();
    assert.equal(await handler.executeScript(execution, 'return data.x + 1'), 8);
    assert.equal(await handler.executeScript(execution, 'return user.userName'), 'ann');
    assert.equal(await handler.executeScript(execution, 'const user = "own"; return user'), 'own');
    assert.equal(await handler.evaluateFeel(execution, 'x + data.x'), 14, 'FEEL, at the top: the instance\'s data');
});

test('the reverse of a security policy: who may see the case and do what with its waiting task', async () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'bpmn-who-'));
    fs.writeFileSync(path.join(dir, 'Request.bpmn'), `<?xml version="1.0" encoding="UTF-8"?>
<bpmn:definitions xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:owf="http://omniworkflow.com/schema/owf/1.0" id="d" targetNamespace="t">
  <bpmn:process id="P" isExecutable="true" owf:securityPolicy="Cases"><bpmn:startEvent id="S" /><bpmn:userTask id="Notes" owf:actor="noter" /><bpmn:userTask id="Approve" /></bpmn:process>
</bpmn:definitions>`);
    fs.mkdirSync(path.join(dir, 'policies', 'security'), { recursive: true });
    const row = (id, cells) => `<rule id="${id}">${cells.map((c, i) => i < 3
        ? `<inputEntry id="${id}i${i}"><text>${c}</text></inputEntry>` : `<outputEntry id="${id}o${i}"><text>${c}</text></outputEntry>`).join('')}</rule>`;
    fs.writeFileSync(path.join(dir, 'policies', 'security', 'Cases.dmn.xml'), `<?xml version="1.0" encoding="UTF-8"?>
<definitions xmlns="https://www.omg.org/spec/DMN/20191111/MODEL/" id="d" name="Cases" namespace="t">
  <decision id="Cases" name="Cases"><decisionTable id="t" hitPolicy="COLLECT">
    <input id="i1" label="initiator"><inputExpression id="e1" typeRef="string"><text>actors.initiator</text></inputExpression></input>
    <input id="i2" label="groups"><inputExpression id="e2" typeRef="string"><text>user.userGroups</text></inputExpression></input>
    <input id="i3" label="task"><inputExpression id="e3" typeRef="string"><text>task</text></inputExpression></input>
    <output id="o1" name="see" typeRef="string" /><output id="o2" name="complete" typeRef="string" /><output id="o3" name="restart" typeRef="string" />
    ${row('r1', ['user.userName', '-', '-', '"full"', '', ''])}
    ${row('r2', ['-', '"Manager"', '-', '"full"', '', ''])}
    ${row('r3', ['user.userName', '-', '"Approve"', '', '"deny"', ''])}
    ${row('r4', ['-', '"HR"', '-', '"summary"', '', '"allow"'])}
  </decisionTable></decision>
</definitions>`);
    const answers = await new SecurityPolicy(dir).whoMay(CASE, {
        users: [{ userName: 'ann', userGroups: ['Employee', 'Manager'] }, { userName: 'mia', userGroups: ['Manager'] }, { userName: 'root', userGroups: ['ADMIN'] }],
        roles: ['HR'], admins: ['root'],
    });
    const of = label => answers.find(a => a.who.label === label);
    const approve = label => of(label).tasks.find(t => t.elementId === 'Approve');
    assert.equal(of('root').who.kind, 'administrators');
    assert.equal(approve('root').complete, true);
    assert.equal(of('ann').access.see, 'full');
    assert.match(of('ann').who.because, /started it/);
    assert.equal(approve('ann').offered, true, 'a manager: offered it');
    assert.equal(approve('ann').complete, false, 'but she asked for it: rule 3');
    assert.equal(approve('mia').complete, true, 'another manager: offered, not denied');
    assert.equal(of('HR').who.kind, 'role');
    assert.equal(of('HR').access.see, 'summary');
    assert.equal(of('HR').access.restart, true);
    assert.equal(approve('HR').complete, false, 'not offered to HR');
    assert.equal(of('Manager').access.see, 'full', 'the group its task is offered to, as a role');
    assert.equal(of('anyone else').access.see, 'none');
    assert.equal(of('bob').access.see, 'none', 'named by the case (he completed Notes): no rule shows it to him');
    assert.match(of('bob').who.because, /completed Notes, actor noter/, 'the actor he is');
});

test('a security policy deciding about a task reads its item\'s data, in its branch', async () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'bpmn-scope-'));
    fs.writeFileSync(path.join(dir, 'Order.bpmn'), `<?xml version="1.0" encoding="UTF-8"?>
<bpmn:definitions xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:owf="http://omniworkflow.com/schema/owf/1.0" id="d" targetNamespace="t">
  <bpmn:process id="P" isExecutable="true" owf:securityPolicy="Lines"><bpmn:startEvent id="S" /><bpmn:userTask id="Approve" /></bpmn:process>
</bpmn:definitions>`);
    fs.mkdirSync(path.join(dir, 'policies', 'security'), { recursive: true });
    fs.writeFileSync(path.join(dir, 'policies', 'security', 'Lines.dmn.xml'), `<?xml version="1.0" encoding="UTF-8"?>
<definitions xmlns="https://www.omg.org/spec/DMN/20191111/MODEL/" id="d" name="Lines" namespace="t">
  <decision id="Lines" name="Lines"><decisionTable id="t" hitPolicy="COLLECT">
    <input id="i1" label="amount"><inputExpression id="e1" typeRef="number"><text>data.amount</text></inputExpression></input>
    <output id="o1" name="complete" typeRef="string" />
    <rule id="r1"><inputEntry id="a"><text>&gt; 100</text></inputEntry><outputEntry id="b"><text>"deny"</text></outputEntry></rule>
  </decisionTable></decision>
</definitions>`);
    const instance = {
        name: 'Order', data: { Approve: [{ amount: 5 }, { amount: 500 }] },
        tokens: [{ id: 0, dataPath: '' }, { id: 1, dataPath: 'Approve.0' }, { id: 2, dataPath: 'Approve.1' }],
        items: [
            { id: 'a', seq: 1, type: 'bpmn:UserTask', elementId: 'Approve', status: 'wait', tokenId: 1 },
            { id: 'b', seq: 2, type: 'bpmn:UserTask', elementId: 'Approve', status: 'wait', tokenId: 2 },
        ],
    };
    const policy = new SecurityPolicy(dir);
    const mia = { userName: 'mia', userGroups: [] };
    assert.equal((await policy.decide(mia, instance, { elementId: 'Approve', itemId: 'a' })).complete, null, 'line 0: 5');
    assert.equal((await policy.decide(mia, instance, { elementId: 'Approve', itemId: 'b' })).complete, false, 'line 1: 500');
});

test('an actor is the user who completes a user task or starts the process at a start event; elsewhere ignored, and warned of', async () => {
    const xml = `<bpmn:process id="P"><bpmn:startEvent id="Ask" owf:actor="requester" /><bpmn:userTask id="Ok" owf:actor="approver" /><bpmn:serviceTask id="Svc" owf:actor="robot" /></bpmn:process>`;
    assert.deepEqual([...actorElements(xml)], [['Ask', 'requester'], ['Ok', 'approver']], 'not the service task');
    const instance = { items: [
        { seq: 1, type: 'bpmn:StartEvent', elementId: 'Ask', status: 'end', userName: 'ann' },
        { seq: 2, type: 'bpmn:UserTask', elementId: 'Ok', status: 'end', userName: 'bob' },
    ] };
    assert.deepEqual(actorsOf({ instance, elements: actorElements(xml) }), { initiator: 'ann', requester: 'ann', approver: 'bob', assignee: null, candidate: null });
});

test('a column whose label is a plain name is the table\'s own variable: its outputs read it; never a protocol name', async () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'bpmn-var-'));
    const file = path.join(dir, 'Own.dmn.xml');
    let calls = 0;
    fs.writeFileSync(file, `<?xml version="1.0" encoding="UTF-8"?>
<definitions xmlns="https://www.omg.org/spec/DMN/20191111/MODEL/" id="d" name="Own" namespace="t">
  <decision id="Own" name="Own"><decisionTable id="t" hitPolicy="FIRST">
    <input id="i1" label="employeeManager"><inputExpression id="e1" typeRef="string"><text>appServices.managerOf(actors.initiator)</text></inputExpression></input>
    <input id="i2" label="user"><inputExpression id="e2" typeRef="string"><text>data.who</text></inputExpression></input>
    <output id="o1" name="assignee" typeRef="string" /><output id="o2" name="asking" typeRef="string" />
    <rule id="r1"><inputEntry id="a"><text>not(null)</text></inputEntry><inputEntry id="b"><text>-</text></inputEntry>
      <outputEntry id="c"><text>employeeManager</text></outputEntry><outputEntry id="d2"><text>user.userName</text></outputEntry></rule>
  </decisionTable></decision>
</definitions>`);
    const context = await decisionContext({ kind: 'assignment', data: { who: 'x', employeeManager: 'from the data' }, user: { userName: 'mia' },
        instance: { items: [{ seq: 1, type: 'bpmn:StartEvent', elementId: 'S', status: 'end', userName: 'david.kim' }] },
        appServices: { managerOf: id => { calls++; return id === 'david.kim' ? 'sarah.chen' : null; } } });
    const result = await (await new DMNEngine({ listInputs: true }).load(file)).evaluateAsync(context);
    assert.deepEqual(result, { assignee: 'sarah.chen', asking: 'mia' }, 'the column\'s value over a data field; "user" stays the protocol\'s');
    assert.equal(calls, 1, 'worked out once');
});
