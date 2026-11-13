// @features: notification-policies
// Notification policies (docs/design/notification-policies.md): a process (or a user task) names one; asked when a user
// task waits (assigned), is completed, and when the instance ends; every matching rule notifies whom its `notify` says,
// with its `template` (a file's name, or the text), filled in. The application delivers (appDelegate.notify); every
// notification is kept in wf_notifications, and only kept with NOTIFICATIONS=record (and for a test run's instance).
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { notificationsOf, verifyModel } from '../dist/index.js';
import { makeServer, definitionsFolder } from './helpers.mjs';

const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
/** A COLLECT table: inputs event, task; outputs as given. Rules: [event, task, ...outputs]. */
const POLICY = (rules, outputs = ['notify', 'template', 'channel']) => `<?xml version="1.0" encoding="UTF-8"?>
<definitions xmlns="https://www.omg.org/spec/DMN/20191111/MODEL/" id="d" name="Notices" namespace="t">
  <decision id="Notices" name="Notices"><decisionTable id="t" hitPolicy="COLLECT">
    <input id="i1" label="event"><inputExpression id="e1" typeRef="string"><text>event</text></inputExpression></input>
    <input id="i2" label="task"><inputExpression id="e2" typeRef="string"><text>task</text></inputExpression></input>
${outputs.map((o, n) => `    <output id="o${n}" name="${o}" typeRef="string" />`).join('\n')}
${rules.map((r, n) => `    <rule id="r${n}">${r.slice(0, 2).map((c, i) => `<inputEntry id="r${n}i${i}"><text>${esc(c)}</text></inputEntry>`).join('')}${r.slice(2).map((c, i) => `<outputEntry id="r${n}o${i}"><text>${esc(c)}</text></outputEntry>`).join('')}</rule>`).join('\n')}
  </decisionTable></decision>
</definitions>`;

const NOTICES = POLICY([
    ['"assigned"', '"Approve"', 'actors.assignee', '"approval-request"', '"email"'],
    ['"completed"', '"Approve"', 'actors.initiator', '"Your leave: ${data.decision} by ${actors.approver}"', '"inbox"'],
    ['"ended"', '-', '[actors.initiator, actors.approver]', '"Closed: ${data.days} days"', ''],
    ['"completed"', '"Approve"', '$(appServices.managerOf(data.requester))', '"FYI ${item.name} done by ${item.userName}"', ''],
]);

const MODEL = (processAttrs = 'owf:notificationPolicy="Notices"') => `<?xml version="1.0" encoding="UTF-8"?>
<bpmn:definitions xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:camunda="http://camunda.org/schema/1.0/bpmn"
    xmlns:owf="http://omniworkflow.com/schema/owf/1.0" id="D" targetNamespace="t">
  <bpmn:process id="Leave" isExecutable="true" ${processAttrs}>
    <bpmn:startEvent id="Start" />
    <bpmn:userTask id="Approve" name="Approve" camunda:assignee="bob" owf:actor="approver" />
    <bpmn:endEvent id="End" />
    <bpmn:sequenceFlow id="f1" sourceRef="Start" targetRef="Approve" />
    <bpmn:sequenceFlow id="f2" sourceRef="Approve" targetRef="End" />
  </bpmn:process>
</bpmn:definitions>`;

async function server({ model = MODEL(), policy = NOTICES, notify } = {}) {
    const dir = definitionsFolder();
    fs.writeFileSync(path.join(dir, 'Leave.bpmn'), model);
    fs.mkdirSync(path.join(dir, 'policies', 'notification', 'templates'), { recursive: true });
    if (policy) fs.writeFileSync(path.join(dir, 'policies', 'notification', 'Notices.dmn.xml'), policy);
    fs.writeFileSync(path.join(dir, 'policies', 'notification', 'templates', 'approval-request.md'),
        '# Please approve ${data.days} days\n\nHello ${item.assignee}: ${actors.initiator} asks for leave.\n');
    const delivered = [];
    const services = { managerOf: id => `manager-of-${id}`, notify: notify ?? (n => { delivered.push(n); }) };
    return { ...(await makeServer({ dir, services })), delivered };
}

test('asked at each event: whom, with what message (a template file, or the text), delivered and kept', async () => {
    const { server: srv, delivered } = await server();
    const { id } = await srv.engine.start('Leave', { requester: 'ann', days: 3 }, null, 'ann');

    assert.equal(delivered.length, 1, 'assigned: Approve waits for bob');
    const [assigned] = delivered;
    assert.deepEqual([assigned.event, assigned.elementId, assigned.to, assigned.channel], ['assigned', 'Approve', ['bob'], 'email']);
    assert.equal(assigned.template, 'approval-request');
    assert.equal(assigned.subject, 'Please approve 3 days', 'its first line, the subject, filled in');
    assert.equal(assigned.message, 'Hello bob: ann asks for leave.', 'item and actors, filled in');
    assert.deepEqual([assigned.policy, assigned.rule, assigned.status], ['Notices', 1, 'sent']);

    await srv.engine.invoke({ id, 'items.elementId': 'Approve' }, { decision: 'approved' }, 'bob');
    const byRule = n => delivered.find(d => d.rule === n);
    assert.deepEqual([byRule(2).event, byRule(2).to, byRule(2).message, byRule(2).subject], ['completed', ['ann'], 'Your leave: approved by bob', 'Your leave: approved by bob'],
        'a text: the message, its first line the subject');
    assert.deepEqual(byRule(4).to, ['manager-of-ann'], 'a $(...) notify: the application\'s service');
    assert.equal(byRule(4).message, 'FYI Approve done by bob');
    assert.deepEqual([byRule(3).event, byRule(3).to, byRule(3).message], ['ended', ['ann', 'bob'], 'Closed: 3 days'], 'the instance ended: its actors');

    const kept = await notificationsOf(srv, id);
    assert.deepEqual(kept.map(n => `${n.event} ${n.rule} ${n.status}`), ['assigned 1 sent', 'completed 2 sent', 'completed 4 sent', 'ended 3 sent'], 'all kept, in order');
    const [instance] = await srv.dataStore.findInstances({ id }, 'full');
    const said = instance.logs.filter(l => l.type === 'decision').map(l => l.message).join('\n');
    assert.match(said, /action: notified bob\nwhy:\n\s+policy Notices, rule 1\n\s+template approval-request\n\s+delivered/);
    await srv.shutdown();
});

test('NOTIFICATIONS=record: kept, not delivered; a notify that throws: kept as failed, and the process goes on', async () => {
    process.env.NOTIFICATIONS = 'record';
    try {
        const { server: srv, delivered } = await server();
        const { id } = await srv.engine.start('Leave', { requester: 'ann', days: 3 }, null, 'ann');
        assert.equal(delivered.length, 0, 'not delivered');
        assert.deepEqual((await notificationsOf(srv, id)).map(n => n.status), ['recorded']);
        await srv.shutdown();
    }
    finally { delete process.env.NOTIFICATIONS; }

    const { server: srv } = await server({ notify: () => { throw new Error('mail server down'); } });
    const { id } = await srv.engine.start('Leave', { requester: 'ann', days: 3 }, null, 'ann');
    await srv.engine.invoke({ id, 'items.elementId': 'Approve' }, { decision: 'approved' }, 'bob');
    const [instance] = await srv.dataStore.findInstances({ id }, 'full');
    assert.equal(instance.status, 'end', 'the process went on');
    const kept = await notificationsOf(srv, id);
    assert.ok(kept.length && kept.every(n => n.status === 'failed' && /mail server down/.test(n.error)), JSON.stringify(kept.map(n => n.status)));
    await srv.shutdown();
});

test('no policy file: notifies no one, said; the process goes on', async () => {
    const { server: srv, delivered } = await server({ policy: null });
    const { id } = await srv.engine.start('Leave', { requester: 'ann', days: 3 }, null, 'ann');
    const [instance] = await srv.dataStore.findInstances({ id }, 'full');
    assert.equal(delivered.length, 0);
    assert.equal(instance.items.find(i => i.elementId === 'Approve').status, 'wait');
    assert.ok(instance.logs.some(l => l.action === 'notifies no one' && /there is no policies\/notification\/Notices\.dmn\.xml/.test(l.message)));
    await srv.shutdown();
});

test('verifyModel: a policy not there, an output not used, a template name with no file', async () => {
    let { server: srv } = await server({ policy: null });
    let { issues } = await verifyModel(MODEL(), srv, 'Leave');
    assert.ok(issues.some(i => i.code === 'notification-policy-not-found' && i.severity === 'error'), JSON.stringify(issues));
    await srv.shutdown();

    ({ server: srv } = await server({ policy: POLICY([['"assigned"', '-', 'actors.assignee', '"no-such-template"', '', '"x"']], ['notify', 'template', 'channel', 'urgency']) }));
    ({ issues } = await verifyModel(MODEL(), srv, 'Leave'));
    const codes = issues.map(i => `${i.code}: ${i.message}`).join('\n');
    assert.match(codes, /notification-policy-output: .*output 'urgency'/);
    assert.match(codes, /notification-template-not-found: .*rule 1: there is no template 'no-such-template'/);
    assert.doesNotMatch(codes, /notification-policy-not-found/);
    await srv.shutdown();
});

test('the HR demo\'s LeaveNotices (docs/docs/notification-policies.md\'s example): a request, its approval, its record', async () => {
    // the demo's own models folder (apps/hrdemo), copied: the documented example, as it is
    const dir = definitionsFolder();
    fs.cpSync(new URL('../../../apps/hrdemo/workflow/processes', import.meta.url), dir, { recursive: true });
    const sent = [];
    const { server: srv } = await makeServer({ dir, services: { notify: n => { sent.push(n); }, notifyUsers: () => ({}), recordLeave: () => ({ recordId: 'LV-9' }) } });
    const { issues } = await verifyModel(fs.readFileSync(path.join(dir, 'Leave Application.bpmn'), 'utf8'), srv, 'Leave Application');
    assert.deepEqual(issues.filter(i => /notification|actor/.test(i.code)), [], 'its policy and templates check');
    const { id } = await srv.engine.start('Leave Application', {}, null, 'user1');
    await srv.engine.invoke({ id, 'items.elementId': 'Request' }, { LeaveType: 'Vacation', StartDate: '2026-12-01', EndDate: '2026-12-05', RequestReason: 'Holidays' }, 'user1');
    await srv.engine.invoke({ id, 'items.elementId': 'Approve' }, { approval: 'A', comment: 'Enjoy' }, 'manager1');
    assert.deepEqual(sent.map(n => [n.event, n.rule, n.to, n.subject]), [
        ['assigned', 1, ['Manager'], 'Leave to approve: Vacation, 5 days'],
        ['completed', 2, ['user1'], 'Your leave is approved'],
        ['ended', 4, ['HR', 'manager1'], 'Leave LV-9 recorded for user1, approved by manager1'],
    ]);
    assert.equal(sent[1].message, 'Your Vacation leave from 2026-12-01 to 2026-12-05 is approved by manager1.\n\nEnjoy');
    await srv.shutdown();
});
