// @features: models-files, parallel-gateway, test-tab
// Test scenarios of the model editor's Test tab (src/testing/scenarios.ts): kept per model, run on the saved
// model, with the steps choosing the path and the expectations checked.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
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

test('scenarios are files beside the model, their runs apart; none left: no file', async () => {
    const file = path.join(web.definitionsPath, 'leave-request.tests.json');
    const runsFile = path.join(web.definitionsPath, '.runs', 'leave-request.runs.json');
    const RUN = { instanceId: 'test-1', at: '2026-11-03T10:00:00.000Z', how: 'run', ok: true };
    let res = await designer.request('PUT', '/model/scenarios/leave-request', { json: { scenarios: [{ ...SHORT, runs: [RUN] }, LONG] } });
    assert.equal(res.status, 200, why(res));
    const saved = JSON.parse(fs.readFileSync(file, 'utf8'));
    assert.equal(saved.model, 'leave-request', 'the format of a scenario file');
    assert.deepEqual(saved.scenarios.map(s => s.name), [SHORT.name, LONG.name]);
    assert.ok(saved.scenarios.every(s => !('runs' in s)), 'no runs in the tests file');
    assert.deepEqual(JSON.parse(fs.readFileSync(runsFile, 'utf8')), { [SHORT.name]: [RUN] });
    const loaded = JSON.parse((await designer.get('/model/scenarios/leave-request')).text).scenarios;
    assert.deepEqual(loaded[0].runs, [RUN], 'the runs put back');
    assert.equal(loaded[1].runs, undefined);

    res = await designer.request('PUT', '/model/scenarios/leave-request', { json: { scenarios: [] } });
    assert.equal(res.status, 200, why(res));
    assert.ok(!fs.existsSync(file) && !fs.existsSync(runsFile));
    // as before, for the tests after this one
    await designer.request('PUT', '/model/scenarios/leave-request', { json: { scenarios: [SHORT, LONG] } });
});

test('every save of a model is kept: listed, read, one deleted, purged; for designers only', async () => {
    const source = fs.readFileSync(path.join(web.definitionsPath, 'leave-request.bpmn'), 'utf8');
    const save = xml => designer.request('POST', '/model/edit/leave-request', { json: { processId: 'leave-request', bpmn: xml, svg: '<svg/>' } });
    assert.equal((await save(source.replace('isExecutable="true"', 'isExecutable="true" '))).status, 200);
    assert.equal((await save(source)).status, 200);
    let versions = JSON.parse((await designer.get('/model/history/leave-request')).text).versions;
    assert.deepEqual(versions.map(v => [v.version, v.savedBy]), [[3, 'designer'], [2, 'designer'], [1, undefined]]);
    const res = await designer.get('/model/history/leave-request/3');
    assert.equal(res.status, 200);
    assert.equal(res.text, source);
    assert.equal((await designer.get('/model/history/leave-request/99')).status, 404);
    assert.equal((await designer.get('/model/history/..%2Fx')).status, 400);
    assert.notEqual((await staff.get('/model/history/leave-request')).status, 200, 'not for staff');

    assert.notEqual((await staff.request('DELETE', '/model/history/leave-request/2')).status, 200, 'staff delete no version');
    // one version deleted; then a version that is not there, and one that is not a number
    assert.equal(JSON.parse((await designer.request('DELETE', '/model/history/leave-request/2')).text).deleted, 2);
    assert.equal((await designer.request('DELETE', '/model/history/leave-request/2')).status, 404);
    assert.equal((await designer.request('DELETE', '/model/history/leave-request/x')).status, 400);
    assert.deepEqual(JSON.parse((await designer.get('/model/history/leave-request')).text).versions.map(v => v.version), [3, 1], 'the others keep their numbers');
    assert.equal(JSON.parse((await designer.request('DELETE', '/model/history/leave-request')).text).purged, 2);
    versions = JSON.parse((await designer.get('/model/history/leave-request')).text).versions;
    assert.deepEqual(versions, []);
});

test('modelHistory off (MODEL_HISTORY=false): saves keep no versions, and the editor has no History tab', async () => {
    const configuration = web.bpmnServer.configuration;
    assert.match((await designer.get('/model/edit/leave-request')).text, /id="js-tab-history"/);
    configuration.modelHistory = false;
    try {
        const source = fs.readFileSync(path.join(web.definitionsPath, 'leave-request.bpmn'), 'utf8');
        const res = await designer.request('POST', '/model/edit/leave-request', { json: { processId: 'leave-request', bpmn: source.replace('isExecutable="true"', 'isExecutable="true" '), svg: '<svg/>' } });
        assert.equal(res.status, 200);
        assert.deepEqual(JSON.parse((await designer.get('/model/history/leave-request')).text).versions, []);
        const page = (await designer.get('/model/edit/leave-request')).text;
        assert.doesNotMatch(page, /js-tab-history|js-history/);
        assert.match(page, /id="js-tab-test"/);
        await designer.request('POST', '/model/edit/leave-request', { json: { processId: 'leave-request', bpmn: source, svg: '<svg/>' } });
    }
    finally {
        configuration.modelHistory = true;
    }
});

test('runs kept under the older name (.runs/<model>.tests.json) are moved to .runs/<model>.runs.json', async () => {
    const runs = path.join(web.definitionsPath, '.runs');
    const RUN = { instanceId: 'test-old', at: '2026-11-01T10:00:00.000Z', how: 'run', ok: true };
    fs.rmSync(path.join(runs, 'leave-request.runs.json'), { force: true });
    fs.mkdirSync(runs, { recursive: true });
    fs.writeFileSync(path.join(runs, 'leave-request.tests.json'), JSON.stringify({ [SHORT.name]: [RUN] }));
    const loaded = JSON.parse((await designer.get('/model/scenarios/leave-request')).text).scenarios;
    assert.deepEqual(loaded.find(s => s.name === SHORT.name).runs, [RUN]);
    assert.ok(fs.existsSync(path.join(runs, 'leave-request.runs.json')));
    assert.ok(!fs.existsSync(path.join(runs, 'leave-request.tests.json')));
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

test('checks after a step and at the end: a node\'s count and status, data compared', async () => {
    const scenario = {
        name: 'Long leave, checked as it goes',
        steps: [{ element: 'Submit', data: { days: 10 } }, { element: 'Approve', data: { approved: true } }],
        checks: [
            { at: 'after', step: 'Submit', kind: 'node', node: 'Approve', status: 'wait', count: 1 },
            { at: 'after', step: 'Submit', kind: 'data', path: 'days', op: '>', value: 5 },
            { at: 'after', step: 'Submit request', kind: 'node', node: 'AutoApprove', count: 0 },
            { kind: 'data', path: 'approved', op: '=', value: true },
            { kind: 'data', path: 'days', op: '<>', value: '10' },
            { kind: 'node', node: 'Approve request', status: 'end', count: 1 },
        ],
    };
    const [result] = JSON.parse((await run({ scenario })).text).results;
    assert.deepEqual(result.checks.map(c => [c.what, c.ok]), [
        ['after Submit: passes Approve, wait, 1 time', true],
        ['after Submit: data.days > 5', true],
        ['after Submit request: does not pass AutoApprove', true],
        ['data.approved is true', true],
        ['data.days is not "10"', false],            // 10 and "10" are the same number
        ['passes Approve request, end, 1 time', true],
    ]);
    assert.equal(result.ok, false);
    const decisions = result.instance.logs.filter(l => /\naction: taken\n[^]*\n    result: true \(days=10\)$/.test(l));
    assert.equal(decisions.length, 1, 'the log gives the gateway\'s reason');
});

test('the debugger: the variables changed, then the run restarted at an earlier step', async () => {
    const start = await designer.request('POST', '/model/test/start', { json: { processName: 'leave-request', data: { requester: 'sam' } } });
    let { instance } = JSON.parse(start.text);
    const submit = instance.items.find(i => i.elementId === 'Submit');
    ({ instance } = JSON.parse((await designer.request('POST', '/model/test/invoke', { json: { instanceId: instance.id, itemId: submit.id, data: { days: 10 } } })).text));
    assert.ok(instance.items.some(i => i.elementId === 'Approve' && i.status === 'wait'), 'a long leave waits for the manager');

    const changed = await designer.request('POST', '/model/test/data', { json: { instanceId: instance.id, data: { ...instance.data, requester: 'kim' } } });
    assert.equal(changed.status, 200, why(changed));
    assert.equal(JSON.parse(changed.text).instance.data.requester, 'kim');

    // back to Submit, as a short leave this time
    const restarted = await designer.request('POST', '/model/test/restart', { json: { instanceId: instance.id, itemId: submit.id, data: { requester: 'kim', days: 2 } } });
    assert.equal(restarted.status, 200, why(restarted));
    ({ instance } = JSON.parse(restarted.text));
    assert.deepEqual(instance.items.filter(i => i.status === 'wait').map(i => i.elementId), ['Submit'], 'Submit waits again');
    assert.ok(!instance.items.some(i => i.elementId === 'Approve'), 'what came after it is gone');
    ({ instance } = JSON.parse((await designer.request('POST', '/model/test/invoke', { json: { instanceId: instance.id, itemId: submit.id, data: { days: 2 } } })).text));
    assert.equal(instance.status, 'end');
    assert.ok(instance.items.some(i => i.elementId === 'AutoApprove'));

    assert.equal((await designer.request('POST', '/model/test/data', { json: { instanceId: 'real-1', data: {} } })).status, 400, 'test instances only');
    assert.equal((await designer.request('POST', '/model/test/restart', { json: { instanceId: 'real-1', itemId: 'x' } })).status, 400);
});
