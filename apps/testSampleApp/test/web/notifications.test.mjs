// @features: notification-policies
// Notification policies through API v3 (docs/design/notification-policies.md): what an instance's policy notified,
// kept in wf_notifications, for whoever sees it; the web app's delegate has no notify, so each is kept as recorded.
// The pages: an instance's Notifications, and the Notifications page (/dashboard/notifications): an administrator's
// all of them, filtered; anyone else's, those to them or their groups.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { startWebApp, why, WebClient, API_KEY } from '../support/webApp.mjs';

const MODEL = 'v3-notices';
const SOURCE = `<?xml version="1.0" encoding="UTF-8"?>
<bpmn:definitions xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:camunda="http://camunda.org/schema/1.0/bpmn"
    xmlns:owf="http://omniworkflow.com/schema/owf/1.0" id="D_V3Notices" targetNamespace="http://bpmn.io/schema/bpmn">
  <bpmn:process id="V3Notices" isExecutable="true" owf:notificationPolicy="V3Notices">
    <bpmn:startEvent id="S"><bpmn:outgoing>f1</bpmn:outgoing></bpmn:startEvent>
    <bpmn:userTask id="Approve" name="Approve" camunda:assignee="manager"><bpmn:incoming>f1</bpmn:incoming><bpmn:outgoing>f2</bpmn:outgoing></bpmn:userTask>
    <bpmn:endEvent id="E"><bpmn:incoming>f2</bpmn:incoming></bpmn:endEvent>
    <bpmn:sequenceFlow id="f1" sourceRef="S" targetRef="Approve" /><bpmn:sequenceFlow id="f2" sourceRef="Approve" targetRef="E" />
  </bpmn:process>
</bpmn:definitions>`;
const POLICY = `<?xml version="1.0" encoding="UTF-8"?>
<definitions xmlns="https://www.omg.org/spec/DMN/20191111/MODEL/" id="d" name="V3Notices" namespace="t">
  <decision id="V3Notices" name="V3Notices"><decisionTable id="t" hitPolicy="COLLECT">
    <input id="i1" label="event"><inputExpression id="e1" typeRef="string"><text>event</text></inputExpression></input>
    <output id="o1" name="notify" typeRef="string" /><output id="o2" name="template" typeRef="string" />
    <rule id="r1"><inputEntry id="a"><text>"assigned"</text></inputEntry><outputEntry id="b"><text>actors.assignee</text></outputEntry><outputEntry id="c"><text>"Please approve \${data.days} days"</text></outputEntry></rule>
  </decisionTable></decision>
</definitions>`;

let web;
const v3 = (method, url, token) => new WebClient(web.base).request(method, '/api/v3' + url, {
    headers: token === 'service' ? { 'x-api-key': API_KEY } : { authorization: `Bearer ${token}` },
});
async function tokenFor(userName, groups) {
    const res = await new WebClient(web.base).request('POST', '/api/v3/tokens', { json: { userName, groups }, headers: { 'x-api-key': API_KEY } });
    assert.equal(res.status, 201, why(res));
    return res.body.token;
}

let instanceId;

test.before(async () => {
    web = await startWebApp();
    fs.mkdirSync(path.join(web.definitionsPath, 'notification'), { recursive: true });
    fs.writeFileSync(path.join(web.definitionsPath, 'notification', 'V3Notices.dmn.xml'), POLICY);
    await web.bpmnServer.models.save(MODEL, SOURCE);
});
test.after(async () => { await web?.stop(); setImmediate(() => process.exit(0)); });

test('an instance\'s notifications: whom, what, kept as recorded (no delivery here); a 404 for an unknown one', async () => {
    const ann = await tokenFor('ann', ['staff']);
    const started = await new WebClient(web.base).request('POST', `/api/v3/processes/${MODEL}/start`, { json: { data: { days: 3 } }, headers: { authorization: `Bearer ${ann}` } });
    assert.equal(started.status, 201, why(started));
    const res = await v3('GET', `/instances/${started.body.instance.id}/notifications`, 'service');
    assert.equal(res.status, 200, why(res));
    assert.equal(res.body.items.length, 1, JSON.stringify(res.body.items));
    const [n] = res.body.items;
    instanceId = started.body.instance.id;
    assert.deepEqual([n.event, n.elementId, n.to, n.message, n.status, n.policy, n.rule], ['assigned', 'Approve', ['manager'], 'Please approve 3 days', 'recorded', 'V3Notices', 1]);
    assert.equal((await v3('GET', '/instances/no-such-instance/notifications', 'service')).status, 404);
});

test('the pages: the instance\'s Notifications; the Notifications page, all for an administrator, their own for anyone else', async () => {
    assert.ok(instanceId, 'the test before started one');
    const [admin, manager, staff] = [await web.login('admin'), await web.login('manager'), await web.login('staff')];
    const row = new RegExp(`data-notification="[^"]+" data-status="recorded" data-event="assigned"`);

    const details = await admin.get(`/instanceDetails?id=${instanceId}`);
    assert.equal(details.status, 200, why(details));
    assert.match(details.text, /id="notifications-heading"/);
    assert.match(details.text, row);
    assert.match(details.text, /Please approve 3 days/);
    assert.match(details.text, /kept, not delivered/);

    const theirs = await manager.get('/dashboard/notifications');
    assert.equal(theirs.status, 200, why(theirs));
    assert.match(theirs.text, row, 'to them: listed');
    assert.ok(theirs.text.includes(`href="/instanceDetails?id=${instanceId}"`), 'with its instance');
    assert.match(theirs.text, /href="\/dashboard\/notifications"/, 'in the menu');
    assert.doesNotMatch((await staff.get('/dashboard/notifications')).text, row, 'to someone else: not listed');
    assert.doesNotMatch((await manager.get('/dashboard/notifications?to=staff')).text, row, 'their own, filtered');

    assert.match((await admin.get('/dashboard/notifications')).text, row, 'an administrator: all of them');
    assert.match((await admin.get('/dashboard/notifications?to=manager&process=v3-notices&status=recorded')).text, row);
    for (const filter of ['to=nobody', 'process=other', 'status=failed'])
        assert.doesNotMatch((await admin.get(`/dashboard/notifications?${filter}`)).text, row, filter);
});
