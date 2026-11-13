// @features: assignment-policies, security-policies
// One protocol for every decision table (engine/DecisionContext.ts, docs/design/decision-context.md): a business rule
// task's decision, an assignment policy and a security policy read the same context, prepared the same way: the case
// data (by name and as `data`), the task's prepared inputs, who acts and their relation to the case, the application's
// facts. And the reverse of a security policy: who may do what with a case (SecurityPolicy.whoMay).
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { decisionContext, relationsOf, SecurityPolicy, DMNEngine } from '../dist/index.js';
import { makeServer, definitionsFolder } from './helpers.mjs';

const CASE = {
    name: 'Request', userName: 'ann', data: { amount: 50, groups: ['ADMIN'] },
    items: [
        { seq: 1, type: 'bpmn:StartEvent', elementId: 'S', status: 'end', userName: 'ann' },
        { seq: 2, type: 'bpmn:UserTask', elementId: 'Notes', name: 'Notes', status: 'end', userName: 'bob' },
        { seq: 3, type: 'bpmn:UserTask', elementId: 'Approve', name: 'Approve', status: 'wait', candidateGroups: ['Manager'] },
    ],
};

test('the context: the data by name and whole, prepared inputs over it, the protocol over both, the application\'s facts last', async () => {
    const context = await decisionContext({ kind: 'security', data: CASE.data, input: { amount: 70, manager: 'mia' },
        user: { userName: 'ann', userGroups: ['Employee'] }, instance: CASE, task: 'Approve' });
    assert.equal(context.amount, 70, 'a prepared input over the data');
    assert.equal(context.data.amount, 50, 'the data whole, as it is');
    assert.equal(context.manager, 'mia');
    assert.deepEqual(context.groups, ['Employee'], 'the case data can\'t set who the person is: its "groups" field is not theirs');
    assert.deepEqual(context.user, { userName: 'ann', groups: ['Employee'] });
    assert.deepEqual(context.relation.sort(), ['initiator']);
    assert.equal(context.initiator, 'ann');
    assert.equal(context.task, 'Approve');
    assert.deepEqual(context.decision, { kind: 'security', name: '' });

    const logged = [];
    const withFacts = await decisionContext({ kind: 'assignment', name: 'P', data: CASE.data, user: { userName: 'mia' }, instance: CASE,
        appDelegate: { decisionContext: (ctx, about) => ({ managerOf: about.user.userName === 'mia', groups: ['Manager'] }) } });
    assert.equal(withFacts.managerOf, true, 'the application\'s fact');
    assert.deepEqual(withFacts.user.groups, ['Manager'], 'its groups for the person, where they are read');
    assert.deepEqual(withFacts.relation, [], 'mia is not a candidate yet: her groups came after the relations');
    const failing = await decisionContext({ kind: 'decision', name: 'D', data: {}, appDelegate: { decisionContext: () => { throw new Error('down'); } }, log: m => logged.push(m) });
    assert.equal(failing.task, '');
    assert.match(logged.join(), /decisionContext failed \(decision D\): down/);
    assert.deepEqual(relationsOf({ userName: 'bob' }, CASE), ['participant']);
});

test('a list input: tested whole first (count(?) > 1), then by its values ("Manager" in the groups)', async () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'bpmn-dc-'));
    const file = path.join(dir, 'Lists.dmn.xml');
    fs.writeFileSync(file, `<?xml version="1.0" encoding="UTF-8"?>
<definitions xmlns="https://www.omg.org/spec/DMN/20191111/MODEL/" id="d" name="Lists" namespace="t">
  <decision id="Lists" name="Lists"><decisionTable id="t" hitPolicy="FIRST">
    <input id="i1" label="groups"><inputExpression id="e1" typeRef="string"><text>groups</text></inputExpression></input>
    <output id="o1" name="answer" typeRef="string" />
    <rule id="r1"><inputEntry id="a"><text>count(?) &gt; 2</text></inputEntry><outputEntry id="b"><text>"many"</text></outputEntry></rule>
    <rule id="r2"><inputEntry id="c"><text>"Manager"</text></inputEntry><outputEntry id="d"><text>"a manager"</text></outputEntry></rule>
  </decisionTable></decision>
</definitions>`);
    const ask = async groups => (await new DMNEngine({ listInputs: true }).load(file)).evaluate({ groups })?.answer ?? null;
    assert.equal(await ask(['a', 'b', 'Manager']), 'many', 'the list itself');
    assert.equal(await ask(['Employee', 'Manager']), 'a manager', 'one of its values');
    assert.equal(await ask(['Employee']), null);
});

/** A process: Submit (by its starter), then a business rule and Approve, whose policy and decision read the same context. */
const MODEL = `<?xml version="1.0" encoding="UTF-8"?>
<bpmn:definitions xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:camunda="http://camunda.org/schema/1.0/bpmn" id="D" targetNamespace="t">
  <bpmn:process id="Ctx" isExecutable="true">
    <bpmn:startEvent id="Start" />
    <bpmn:userTask id="Submit" name="Submit" />
    <bpmn:businessRuleTask id="Route" camunda:decisionRef="Route" camunda:resultVariable="route" camunda:mapDecisionResult="singleResult">
      <bpmn:extensionElements><camunda:inputOutput>
        <camunda:inputParameter name="boss">$(appServices.managerOf(this.data.requester))</camunda:inputParameter>
      </camunda:inputOutput></bpmn:extensionElements>
    </bpmn:businessRuleTask>
    <bpmn:userTask id="Approve" name="Approve" camunda:assignmentPolicy="Approval">
      <bpmn:extensionElements><camunda:inputOutput>
        <camunda:inputParameter name="boss">$(appServices.managerOf(this.data.requester))</camunda:inputParameter>
      </camunda:inputOutput></bpmn:extensionElements>
    </bpmn:userTask>
    <bpmn:endEvent id="End" />
    <bpmn:sequenceFlow id="f1" sourceRef="Start" targetRef="Submit" />
    <bpmn:sequenceFlow id="f2" sourceRef="Submit" targetRef="Route" />
    <bpmn:sequenceFlow id="f3" sourceRef="Route" targetRef="Approve" />
    <bpmn:sequenceFlow id="f4" sourceRef="Approve" targetRef="End" />
  </bpmn:process>
</bpmn:definitions>`;
/** One table, read by both: who acts, their relation, who started it, a prepared input, the application's fact. */
const TABLE = (name, outputs) => `<?xml version="1.0" encoding="UTF-8"?>
<definitions xmlns="https://www.omg.org/spec/DMN/20191111/MODEL/" id="${name}_d" name="${name}" namespace="t">
  <decision id="${name}" name="${name}"><decisionTable id="${name}_t" hitPolicy="FIRST">
    <input id="${name}_i1" label="relation"><inputExpression id="${name}_e1" typeRef="string"><text>relation</text></inputExpression></input>
    <input id="${name}_i2" label="initiator"><inputExpression id="${name}_e2" typeRef="string"><text>initiator</text></inputExpression></input>
    <input id="${name}_i3" label="tier"><inputExpression id="${name}_e3" typeRef="string"><text>tier</text></inputExpression></input>
${outputs.map((o, n) => `    <output id="${name}_o${n}" name="${o}" typeRef="string" />`).join('\n')}
    <rule id="${name}_r1"><inputEntry id="${name}_a"><text>"initiator"</text></inputEntry><inputEntry id="${name}_b"><text>"ann"</text></inputEntry><inputEntry id="${name}_c"><text>"gold"</text></inputEntry>
${outputs.map((o, n) => `      <outputEntry id="${name}_r1o${n}"><text>${n ? '"Directors"' : 'boss'}</text></outputEntry>`).join('\n')}</rule>
    <rule id="${name}_r2"><inputEntry id="${name}_d"><text>-</text></inputEntry><inputEntry id="${name}_e"><text>-</text></inputEntry><inputEntry id="${name}_f"><text>-</text></inputEntry>
${outputs.map((o, n) => `      <outputEntry id="${name}_r2o${n}"><text>"nobody"</text></outputEntry>`).join('\n')}</rule>
  </decisionTable></decision>
</definitions>`;

test('a business rule task and an assignment policy read the same context: relation, initiator, a prepared input, the application\'s fact', async () => {
    const dir = definitionsFolder();
    fs.writeFileSync(path.join(dir, 'Ctx.bpmn'), MODEL);
    fs.writeFileSync(path.join(dir, 'Route.dmn.xml'), TABLE('Route', ['who']));
    fs.mkdirSync(path.join(dir, 'policies', 'assignment'), { recursive: true });
    fs.writeFileSync(path.join(dir, 'policies', 'assignment', 'Approval.dmn.xml'), TABLE('Approval', ['assignee', 'candidateGroups']));
    const { server } = await makeServer({ dir, services: {
        managerOf: id => `manager-of-${id}`,
        decisionContext: (context, about) => ({ tier: about.user.userName === 'ann' ? 'gold' : 'basic' }),
    } });
    const { id } = await server.engine.start('Ctx', { requester: 'ann' }, null, 'ann');
    await server.engine.invoke({ id, 'items.elementId': 'Submit' }, {}, 'ann');
    const [instance] = await server.dataStore.findInstances({ id }, 'full');
    assert.deepEqual(instance.data.route, { who: 'manager-of-ann' }, 'the decision: ann, who started it, a gold customer; the prepared boss');
    const approve = instance.items.find(i => i.elementId === 'Approve');
    assert.equal(approve.assignee, 'manager-of-ann', 'the policy, the same rule: its assignee the prepared input');
    assert.deepEqual(approve.candidateGroups, ['Directors']);
    assert.deepEqual(approve.assignment, { policy: 'Approval', rule: 1 });
    await server.shutdown();
});

test('the reverse of a security policy: who may see the case and do what with its waiting task', async () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'bpmn-who-'));
    fs.writeFileSync(path.join(dir, 'Request.bpmn'), `<?xml version="1.0" encoding="UTF-8"?>
<bpmn:definitions xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:owf="http://omniworkflow.com/schema/owf/1.0" id="d" targetNamespace="t">
  <bpmn:process id="P" isExecutable="true" owf:securityPolicy="Cases"><bpmn:startEvent id="S" /><bpmn:userTask id="Approve" /></bpmn:process>
</bpmn:definitions>`);
    fs.mkdirSync(path.join(dir, 'policies', 'security'), { recursive: true });
    fs.writeFileSync(path.join(dir, 'policies', 'security', 'Cases.dmn.xml'), `<?xml version="1.0" encoding="UTF-8"?>
<definitions xmlns="https://www.omg.org/spec/DMN/20191111/MODEL/" id="d" name="Cases" namespace="t">
  <decision id="Cases" name="Cases"><decisionTable id="t" hitPolicy="COLLECT">
    <input id="i1" label="relation"><inputExpression id="e1" typeRef="string"><text>relation</text></inputExpression></input>
    <input id="i2" label="groups"><inputExpression id="e2" typeRef="string"><text>groups</text></inputExpression></input>
    <input id="i3" label="task"><inputExpression id="e3" typeRef="string"><text>task</text></inputExpression></input>
    <output id="o1" name="see" typeRef="string" /><output id="o2" name="complete" typeRef="string" /><output id="o3" name="restart" typeRef="string" />
    <rule id="r1"><inputEntry id="a1"><text>"initiator"</text></inputEntry><inputEntry id="a2"><text>-</text></inputEntry><inputEntry id="a3"><text>-</text></inputEntry><outputEntry id="a4"><text>"full"</text></outputEntry><outputEntry id="a5"><text></text></outputEntry><outputEntry id="a6"><text></text></outputEntry></rule>
    <rule id="r2"><inputEntry id="b1"><text>-</text></inputEntry><inputEntry id="b2"><text>"Manager"</text></inputEntry><inputEntry id="b3"><text>-</text></inputEntry><outputEntry id="b4"><text>"full"</text></outputEntry><outputEntry id="b5"><text></text></outputEntry><outputEntry id="b6"><text></text></outputEntry></rule>
    <rule id="r3"><inputEntry id="c1"><text>"initiator"</text></inputEntry><inputEntry id="c2"><text>-</text></inputEntry><inputEntry id="c3"><text>"Approve"</text></inputEntry><outputEntry id="c4"><text></text></outputEntry><outputEntry id="c5"><text>"deny"</text></outputEntry><outputEntry id="c6"><text></text></outputEntry></rule>
    <rule id="r4"><inputEntry id="d1"><text>-</text></inputEntry><inputEntry id="d2"><text>"HR"</text></inputEntry><inputEntry id="d3"><text>-</text></inputEntry><outputEntry id="d4"><text>"summary"</text></outputEntry><outputEntry id="d5"><text></text></outputEntry><outputEntry id="d6"><text>"allow"</text></outputEntry></rule>
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
    assert.match(of('bob').who.because, /completed Notes/);
});
