// Test scenarios of the model editor's Test tab (src/testing/scenarios.ts): kept per model, run on the saved
// model, with the steps choosing the path and the expectations checked.
import test from 'node:test';
import assert from 'node:assert/strict';
import { startWebApp, why } from '../support/webApp.mjs';

const SHORT = {
    name: 'Short leave is approved automatically',
    start: { data: { requester: 'sam' } },
    steps: [{ element: 'Submit', data: { days: 2, reason: 'rest' } }],
    expect: { status: 'end', data: { approvedBy: 'system', requester: 'sam' }, passes: ['AutoApprove'], avoids: ['Approve'] }
};
const LONG = {
    name: 'Long leave goes to the manager',
    steps: [{ element: 'Submit', data: { days: 10 } }, { element: 'Approve', data: { approved: true } }],
    expect: { status: 'end', data: { approved: true }, passes: ['Approve'], avoids: ['AutoApprove'] }
};

let web, designer, staff;
test.before(async () => {
    web = await startWebApp();
    [designer, staff] = await Promise.all([web.login('designer'), web.login('staff')]);
});
test.after(async () => { await web?.stop(); setImmediate(() => process.exit(0)); });

const run = body => designer.request('POST', '/model/test/run', { json: { processName: 'leave-request', ...body } });

test('scenarios are kept per model', async () => {
    assert.deepEqual(JSON.parse((await designer.get('/model/scenarios/leave-request')).text).scenarios, []);
    let res = await designer.request('PUT', '/model/scenarios/leave-request', { json: { scenarios: [SHORT, LONG] } });
    assert.equal(res.status, 200, why(res));
    const loaded = JSON.parse((await designer.get('/model/scenarios/leave-request')).text).scenarios;
    assert.deepEqual(loaded.map(s => s.name), [SHORT.name, LONG.name]);

    res = await designer.request('PUT', '/model/scenarios/leave-request', { json: { scenarios: [{ steps: [{}] }] } });
    assert.equal(res.status, 400);
    assert.match(JSON.parse(res.text).error, /has no name.*step 1: no element/);
});

test('the steps choose the path, and what is expected is checked', async () => {
    for (const scenario of [SHORT, LONG]) {
        const res = await run({ scenario });
        assert.equal(res.status, 200, why(res));
        const [result] = JSON.parse(res.text).results;
        assert.equal(result.ok, true, JSON.stringify(result, null, 1));
        assert.ok(result.checks.length >= 4 && result.checks.every(c => c.ok));
        assert.match(result.instance.id, /^test-/);
        assert.equal(result.instance.status, 'end');
        assert.ok(result.instance.logs.length > 0, 'with the log');
    }
});

test('a failed expectation and a step that can not be done are reported', async () => {
    let [result] = JSON.parse((await run({ scenario: { ...SHORT, expect: { data: { approvedBy: 'manager' }, passes: ['Approve'] } } })).text).results;
    assert.equal(result.ok, false);
    assert.deepEqual(result.checks.map(c => [c.what, c.ok, c.actual]), [
        ['data.approvedBy is "manager"', false, 'system'],
        ['passes Approve', false, undefined]
    ]);

    [result] = JSON.parse((await run({ scenario: { name: 'wrong order', steps: [{ element: 'Approve' }] } })).text).results;
    assert.equal(result.ok, false);
    assert.equal(result.steps[0].ok, false);
    assert.match(result.steps[0].error, /Approve is not waiting; waiting: Submit/);
    assert.equal(result.instance.status, 'running');
});

test('all saved scenarios of a model are run', async () => {
    const { results } = JSON.parse((await run({ all: true })).text);
    assert.deepEqual(results.map(r => [r.name, r.ok]), [[SHORT.name, true], [LONG.name, true]]);
});

test('recording: start, then complete what waits, one item at a time', async () => {
    let res = await designer.request('POST', '/model/test/start', { json: { processName: 'leave-request', data: { requester: 'kim' } } });
    assert.equal(res.status, 200, why(res));
    let { instance } = JSON.parse(res.text);
    const submit = instance.items.find(i => i.elementId === 'Submit' && i.status === 'wait');
    assert.ok(submit, JSON.stringify(instance.items));
    res = await designer.request('POST', '/model/test/invoke', { json: { instanceId: instance.id, itemId: submit.id, data: { days: 9 } } });
    ({ instance } = JSON.parse(res.text));
    assert.ok(instance.items.some(i => i.elementId === 'Approve' && i.status === 'wait'));

    // only test instances
    const real = await web.bpmnServer.engine.start('leave-request', {});
    const item = real.instance.items.find(i => i.elementId === 'Submit');
    res = await designer.request('POST', '/model/test/invoke', { json: { instanceId: real.id, itemId: item.id, data: {} } });
    assert.equal(res.status, 400);
});

/** Two tasks in parallel, then a joining gateway. */
const PARALLEL = `<?xml version="1.0" encoding="UTF-8"?>
<bpmn:definitions xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" id="d" targetNamespace="urn:test">
  <bpmn:process id="P" isExecutable="true">
    <bpmn:startEvent id="Start" />
    <bpmn:parallelGateway id="Split" />
    <bpmn:userTask id="A" name="Task A" />
    <bpmn:userTask id="B" name="Task B" />
    <bpmn:parallelGateway id="Join" />
    <bpmn:userTask id="After" name="After both" />
    <bpmn:endEvent id="End" />
    <bpmn:sequenceFlow id="f1" sourceRef="Start" targetRef="Split" />
    <bpmn:sequenceFlow id="f2" sourceRef="Split" targetRef="A" />
    <bpmn:sequenceFlow id="f3" sourceRef="Split" targetRef="B" />
    <bpmn:sequenceFlow id="f4" sourceRef="A" targetRef="Join" />
    <bpmn:sequenceFlow id="f5" sourceRef="B" targetRef="Join" />
    <bpmn:sequenceFlow id="f6" sourceRef="Join" targetRef="After" />
    <bpmn:sequenceFlow id="f7" sourceRef="After" targetRef="End" />
  </bpmn:process>
</bpmn:definitions>`;

test('a joining gateway is not a step: it completes when its branches arrive', async () => {
    const fs = await import('node:fs'), path = await import('node:path');
    fs.writeFileSync(path.join(web.definitionsPath, 'parallel.bpmn'), PARALLEL);
    await web.bpmnServer.definitions.rebuild();
    const post = (url, json) => designer.request('POST', url, { json }).then(r => ({ status: r.status, body: JSON.parse(r.text) }));
    let { body: { instance } } = await post('/model/test/start', { processName: 'parallel' });
    const item = id => instance.items.find(i => i.elementId === id && i.status === 'wait');
    ({ body: { instance } } = await post('/model/test/invoke', { instanceId: instance.id, itemId: item('A').id, data: {} }));
    const join = item('Join');
    assert.ok(join, 'the join waits for B');

    const forced = await post('/model/test/invoke', { instanceId: instance.id, itemId: join.id, data: {} });
    assert.equal(forced.status, 422);
    assert.match(forced.body.error, /completes by itself/);

    ({ body: { instance } } = await post('/model/test/invoke', { instanceId: instance.id, itemId: item('B').id, data: {} }));
    assert.equal(instance.items.filter(i => i.elementId === 'After').length, 1, 'past the join once');

    // Replay does not offer it either
    const [result] = JSON.parse((await run({ processName: 'parallel', scenario: { name: 'join', steps: [{ element: 'A' }, { element: 'Join' }] } })).text).results;
    assert.match(result.steps[1].error, /Join is not waiting; waiting: B/);
});

test('steps are user tasks and events, as the instance page offers them: a timer is forced', async () => {
    const fs = await import('node:fs'), path = await import('node:path');
    fs.writeFileSync(path.join(web.definitionsPath, 'timer.bpmn'), `<?xml version="1.0" encoding="UTF-8"?>
<bpmn:definitions xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" id="d" targetNamespace="urn:test">
  <bpmn:process id="P" isExecutable="true">
    <bpmn:startEvent id="Start" />
    <bpmn:intermediateCatchEvent id="Wait"><bpmn:timerEventDefinition><bpmn:timeDuration>PT1H</bpmn:timeDuration></bpmn:timerEventDefinition></bpmn:intermediateCatchEvent>
    <bpmn:receiveTask id="Receive" />
    <bpmn:endEvent id="End" />
    <bpmn:sequenceFlow id="f1" sourceRef="Start" targetRef="Wait" />
    <bpmn:sequenceFlow id="f2" sourceRef="Wait" targetRef="Receive" />
    <bpmn:sequenceFlow id="f3" sourceRef="Receive" targetRef="End" />
  </bpmn:process>
</bpmn:definitions>`);
    await web.bpmnServer.definitions.rebuild();
    const [result] = JSON.parse((await run({ processName: 'timer', scenario: { name: 'timer', steps: [{ element: 'Wait' }, { element: 'Receive' }] } })).text).results;
    assert.equal(result.steps[0].ok, true, 'the timer is forced');
    assert.equal(result.steps[1].ok, false, 'a receive task is not a step');
    assert.match(result.steps[1].error, /Receive is not waiting; the instance is/);
});

test('testing is for designers', async () => {
    assert.equal((await staff.get('/model/scenarios/leave-request')).status, 403);
    assert.equal((await staff.request('POST', '/model/test/run', { json: { processName: 'leave-request', scenario: SHORT } })).status, 403);
});
