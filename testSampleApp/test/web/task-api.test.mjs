// @features: rest-api
// Application integration, phase 1 (docs/docs/application-integration-design.md): the task API an application builds
// its inbox on. Two parts:
//   - "today": what the server does now, which the design has to work with. These pass.
//   - "contract": the routes to build, all in bpmn-web. They are todo until the routes exist: they run and report,
//     without failing the suite. Remove the todo as each one starts to pass.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { BPMNAPI, SecureUser } from 'bpmn-server';
import { startWebApp, WebClient, API_KEY } from '../support/webApp.mjs';

const ACTING_KEY = 'test-acting-user-key';
const NOT_BUILT = 'the task API is not built yet';
const MODEL = 'leave-request';

const definitions = body => `<?xml version="1.0" encoding="UTF-8"?>
<bpmn:definitions xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:camunda="http://camunda.org/schema/1.0/bpmn" id="d" targetNamespace="urn:test">
${body}
</bpmn:definitions>`;

const MODELS = {
    // a message that starts a process, when none waits for it
    'order-message': definitions(`  <bpmn:message id="OrderPlaced" name="OrderPlaced" />
  <bpmn:process id="Order" isExecutable="true">
    <bpmn:startEvent id="Start"><bpmn:messageEventDefinition messageRef="OrderPlaced" /></bpmn:startEvent>
    <bpmn:userTask id="Task" />
    <bpmn:endEvent id="End" />
    <bpmn:sequenceFlow id="f1" sourceRef="Start" targetRef="Task" />
    <bpmn:sequenceFlow id="f2" sourceRef="Task" targetRef="End" />
  </bpmn:process>`),
    // a listener that fails as a notification would, when the application is down
    'failing-listener': definitions(`  <bpmn:process id="Failing" isExecutable="true">
    <bpmn:startEvent id="Start" />
    <bpmn:userTask id="Task">
      <bpmn:extensionElements><camunda:executionListener event="wait"><camunda:script scriptFormat="JavaScript">throw new Error('the application is down');</camunda:script></camunda:executionListener></bpmn:extensionElements>
    </bpmn:userTask>
    <bpmn:sequenceFlow id="f1" sourceRef="Start" targetRef="Task" />
  </bpmn:process>`),
    // what a script can reach, without a change to the engine
    'script-scope': definitions(`  <bpmn:process id="Scope" isExecutable="true">
    <bpmn:startEvent id="Start" />
    <bpmn:scriptTask id="Script" scriptFormat="JavaScript"><bpmn:script>data.call = typeof appDelegate.server.connectors.call;</bpmn:script></bpmn:scriptTask>
    <bpmn:sequenceFlow id="f1" sourceRef="Start" targetRef="Script" />
  </bpmn:process>`),
};

let web;
test.before(async () => {
    web = await startWebApp({ env: { API_ACTING_USER_KEY: ACTING_KEY } });
    for (const [name, xml] of Object.entries(MODELS))
        fs.writeFileSync(path.join(web.definitionsPath, name + '.bpmn'), xml);
    await web.bpmnServer.definitions.rebuild();
});
test.after(async () => { await web?.stop(); setImmediate(() => process.exit(0)); });

const engine = () => web.bpmnServer.engine;
const savedItem = async (instanceId, elementId) =>
    (await web.bpmnServer.dataStore.findInstances({ id: instanceId }, 'full'))[0]?.items.find(i => i.elementId === elementId);
/** A leave request with both of its tasks passed through, so that a manager's Approve waits. */
async function waitingForApproval() {
    const started = await engine().start(MODEL, {});
    await engine().invoke({ id: started.id, 'items.elementId': 'Submit' }, { days: 6 });
    return started.id;
}

// ---- today

test('today: a lifecycle subscriber hears of a waiting task before it is saved', async () => {
    const started = await engine().start(MODEL, {});
    let duringEvent = 'not called';
    const unsubscribe = web.bpmnServer.listener.subscribe({
        async onEvent({ type, context }) {
            if (type === 'wait' && context.item?.elementId === 'Approve')
                duringEvent = await savedItem(context.instance.id, 'Approve') ?? null;
        },
    });
    try {
        await engine().invoke({ id: started.id, 'items.elementId': 'Submit' }, { days: 6 });
    } finally {
        unsubscribe();
    }
    assert.equal(duringEvent, null, 'not in the store while the event is delivered');
    assert.equal((await savedItem(started.id, 'Approve')).status, 'wait', 'saved by the end of the call');
});

test("today: a subscriber's failure does not reach the execution", async () => {
    const started = await engine().start(MODEL, {});
    const unsubscribe = web.bpmnServer.listener.subscribe({ onEvent() { throw new Error('delivery failed'); } });
    try {
        await engine().invoke({ id: started.id, 'items.elementId': 'Submit' }, { days: 6 });
    } finally {
        unsubscribe();
    }
    assert.equal((await savedItem(started.id, 'Approve')).status, 'wait');
});

test("today: a model listener's failure stops the execution", async () => {
    await assert.rejects(engine().start('failing-listener', {}), /the application is down/);
});

/** Runs fn with the API's service account in the SYSTEM group: the account is read from the environment at each call. */
async function asSystemAccount(fn) {
    const groups = process.env.API_SERVICE_USER_GROUPS;
    process.env.API_SERVICE_USER_GROUPS = 'SYSTEM';
    try {
        return await fn();
    } finally {
        process.env.API_SERVICE_USER_GROUPS = groups;
    }
}
const MESSAGE = { messageId: 'OrderPlaced', data: { orderId: 1 }, messageMatchingKey: { 'data.orderId': 1 } };

test('today: an ordinary service account cannot throw a message: it answers 200 with errors', async () => {
    const answer = await web.api('POST', '/api2/engine/throwMessage', MESSAGE);
    assert.equal(answer.status, 200);
    assert.match(answer.body.errors, /System permission/);
});

test('today: a message nothing waits for starts a process, each time it is delivered', async () => {
    const instances = async () => (await web.bpmnServer.dataStore.findInstances({ name: 'order-message' }, 'summary')).length;
    const before = await instances();
    await asSystemAccount(async () => {
        assert.equal((await web.api('POST', '/api2/engine/throwMessage', MESSAGE)).status, 200);
        assert.equal((await web.api('POST', '/api2/engine/throwMessage', MESSAGE)).status, 200);
    });
    assert.equal(await instances(), before + 2, 'a retry is a second order');
});

test('today: a message nothing waits for and nothing starts on answers 200 with nothing', async () => {
    const answer = await asSystemAccount(() => web.api('POST', '/api2/engine/throwMessage', { messageId: 'NoSuchMessage', data: {} }));
    assert.equal(answer.status, 200);
    assert.deepEqual(answer.body, {});
});

test('today: a failed invoke through /api2 answers 200 with errors', async () => {
    const started = await engine().start(MODEL, {});
    const query = { id: started.id, 'items.elementId': 'Submit' };
    await engine().invoke(query, {});
    const again = await web.api('PUT', '/api2/engine/invoke', { query, data: {} });
    assert.equal(again.status, 200);
    assert.match(again.body.errors, /not waiting/);
});

const person = (userName, ...userGroups) => new SecureUser({ userName, userGroups }, { enforceSecurity: true });
const invokeApprove = (id, user) => new BPMNAPI(web.bpmnServer).engine.invoke({ id, 'items.elementId': 'Approve' }, {}, user);

test("today: BPMNAPI's security narrows to the item: a user with no part in a task cannot complete it", async () => {
    const id = await waitingForApproval();
    await assert.rejects(invokeApprove(id, person('outsider', 'nobody')), /no items/);
    assert.equal((await savedItem(id, 'Approve')).status, 'wait');
    await invokeApprove(id, person('mia', 'manager'));
    assert.equal((await savedItem(id, 'Approve')).status, 'end');
});

test("today: BPMNAPI lets another candidate complete a task assigned to someone", async () => {
    const id = await waitingForApproval();
    await new BPMNAPI(web.bpmnServer).engine.assign({ id, 'items.elementId': 'Approve' }, {}, { assignee: 'mia' }, person('mia', 'manager'));
    assert.equal((await savedItem(id, 'Approve')).assignee, 'mia');
    assert.equal(person('max', 'manager').canInvoke(await savedItem(id, 'Approve')), false, "the item's own rule says no");
    await invokeApprove(id, person('max', 'manager'));
    assert.equal((await savedItem(id, 'Approve')).status, 'end');
});

test('today: a script reaches the connectors through appDelegate', async () => {
    const { instance } = await engine().start('script-scope', {});
    assert.equal(instance.data.call, 'function');
});

// ---- contract

/** Calls the task API as `user` (groups: comma separated), with the acting-user key unless given. */
const tasks = (method, url, { user, groups, body, key = ACTING_KEY } = {}) => new WebClient(web.base).request(method, '/api2/tasks' + url, {
    json: body,
    headers: { 'x-api-key': key, ...(user ? { 'x-acting-user': user } : {}), ...(groups ? { 'x-acting-groups': groups } : {}) },
});
const STAFF = { user: 'sam', groups: 'staff' };
const MANAGER = { user: 'mia', groups: 'manager' };
const MANAGER2 = { user: 'max', groups: 'manager' };
const OUTSIDER = { user: 'olga', groups: 'finance' };
const approveId = async id => (await savedItem(id, 'Approve')).id;

test('contract: off unless API_ACTING_USER_KEY is set', { todo: NOT_BUILT }, async () => {
    const key = process.env.API_ACTING_USER_KEY;
    delete process.env.API_ACTING_USER_KEY;
    try {
        assert.equal((await tasks('GET', '', { ...STAFF })).status, 404);
    } finally {
        process.env.API_ACTING_USER_KEY = key;
    }
});

test('contract: API_KEY does not open the task API', { todo: NOT_BUILT }, async () => {
    assert.equal((await tasks('GET', '', { ...STAFF, key: API_KEY })).status, 401);
});

test('the acting-user key opens no other route', async () => {
    assert.equal((await web.api('GET', '/api2/model/list', undefined, ACTING_KEY)).status, 401);
});

test('contract: a call needs an acting user', { todo: NOT_BUILT }, async () => {
    assert.equal((await tasks('GET', '')).status, 400);
});

test('contract: an acting user cannot claim an administrative role', { todo: NOT_BUILT }, async () => {
    for (const groups of ['ADMIN', 'SYSTEM', 'DESIGNER', 'staff,ADMIN'])
        assert.equal((await tasks('GET', '', { user: 'sam', groups })).status, 403, groups);
});

test('contract: the list holds the tasks this user can work on', { todo: NOT_BUILT }, async () => {
    const task = await approveId(await waitingForApproval());
    const ids = async who => (await tasks('GET', '?limit=100', who)).body.tasks.map(t => t.id);
    assert.ok((await ids(MANAGER)).includes(task));
    assert.ok(!(await ids(STAFF)).includes(task));
    assert.ok(!(await ids(OUTSIDER)).includes(task));
});

test('contract: a task the user has no part in is not found, as one that does not exist', { todo: NOT_BUILT }, async () => {
    const id = await waitingForApproval();
    const task = await approveId(id);
    assert.equal((await tasks('GET', `/${task}`, MANAGER)).status, 200);
    assert.equal((await tasks('GET', `/${task}`, OUTSIDER)).status, 404);
    assert.equal((await tasks('POST', `/${task}/complete`, { ...OUTSIDER, body: {} })).status, 404);
    assert.equal((await tasks('GET', '/no-such-task', MANAGER)).status, 404);
    assert.equal((await savedItem(id, 'Approve')).status, 'wait');
});

test('contract: only a user task is a task', { todo: NOT_BUILT }, async () => {
    const id = await waitingForApproval();
    assert.equal((await tasks('GET', `/${(await savedItem(id, 'LongLeave')).id}`, MANAGER)).status, 404);
});

test('contract: a candidate completes the task, and it records who did', { todo: NOT_BUILT }, async () => {
    const id = await waitingForApproval();
    const answer = await tasks('POST', `/${await approveId(id)}/complete`, { ...MANAGER, body: { data: { approved: true } } });
    assert.equal(answer.status, 200, JSON.stringify(answer.body));
    assert.equal(answer.body.instance.id, id);
    const saved = await savedItem(id, 'Approve');
    assert.equal(saved.status, 'end');
    assert.equal(saved.userName, 'mia');
});

test('contract: completing a task twice answers 409, and runs nothing again', { todo: NOT_BUILT }, async () => {
    const id = await waitingForApproval();
    const task = await approveId(id);
    assert.equal((await tasks('POST', `/${task}/complete`, { ...MANAGER, body: {} })).status, 200);
    const again = await tasks('POST', `/${task}/complete`, { ...MANAGER, body: {} });
    assert.equal(again.status, 409);
    assert.equal(again.body.code, 'ITEM_NOT_WAITING');
});

test('contract: once claimed, the task is that user\'s alone', { todo: NOT_BUILT }, async () => {
    const id = await waitingForApproval();
    const task = await approveId(id);
    assert.equal((await tasks('POST', `/${task}/claim`, { ...MANAGER, body: {} })).status, 200);
    assert.equal((await savedItem(id, 'Approve')).assignee, 'mia');
    assert.equal((await tasks('POST', `/${task}/claim`, { ...MANAGER2, body: {} })).status, 409);
    assert.equal((await tasks('POST', `/${task}/complete`, { ...MANAGER2, body: {} })).status, 403);
    assert.equal((await savedItem(id, 'Approve')).status, 'wait');
    assert.equal((await tasks('POST', `/${task}/complete`, { ...MANAGER, body: {} })).status, 200);
});
