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

test('a scenario with a start and no steps runs: started, then what is expected checked; saved and read back as it was', async () => {
    const STARTED = { name: 'Started, waiting for the request', start: { data: { requester: 'sam' } }, steps: [], expect: { status: 'running' } };
    const res = await run({ scenario: STARTED });
    assert.equal(res.status, 200, why(res));
    const [result] = JSON.parse(res.text).results;
    assert.equal(result.ok, true, JSON.stringify(result));
    assert.ok(result.instance?.id, 'an instance was started');

    const saved = await designer.request('PUT', '/model/scenarios/leave-request', { json: { scenarios: [STARTED] } });
    assert.equal(saved.status, 200, why(saved));
    const [back] = JSON.parse((await designer.get('/model/scenarios/leave-request')).text).scenarios;
    assert.equal(back.source, undefined, 'read back as a recorded scenario, which the Test tab runs');
    assert.deepEqual(back.steps ?? [], []);
    assert.ok(back.start, 'with its start: what makes it runnable');
    await designer.request('PUT', '/model/scenarios/leave-request', { json: { scenarios: [] } });
});

test('scenarios are files beside the model; a run is a tag on its test instance, kept by its saves; none left: no file', async () => {
    const file = path.join(web.definitionsPath, 'leave-request.feature');
    const started = JSON.parse((await designer.request('POST', '/model/test/start', { json: { processName: 'leave-request' } })).text).instance;
    const RUN = { instanceId: started.id, at: '2026-11-03T10:00:00.000Z', how: 'run', ok: true };
    let res = await designer.request('PUT', '/model/scenarios/leave-request', { json: { scenarios: [{ ...SHORT, runs: [RUN] }, LONG] } });
    assert.equal(res.status, 200, why(res));
    const saved = fs.readFileSync(file, 'utf8');
    assert.match(saved, /^Feature: leave-request/, 'the format of a scenario file');
    assert.ok(saved.includes(`Scenario: ${SHORT.name}`) && saved.includes(`Scenario: ${LONG.name}`));
    assert.ok(!saved.includes(started.id), 'no runs in the tests file');
    assert.ok(!fs.existsSync(path.join(web.definitionsPath, '.runs')), 'no runs in files at all');
    const stored = await web.bpmnServer.dataStore.findInstances({ id: started.id }, 'summary');
    assert.deepEqual(stored[0].tag.process, 'leave-request');
    assert.deepEqual(stored[0].tag.scenario, SHORT.name);
    let loaded = JSON.parse((await designer.get('/model/scenarios/leave-request')).text).scenarios;
    assert.equal(loaded[0].runs[0].instanceId, started.id, 'the run read from the tag');
    assert.equal(loaded[0].runs[0].ok, true);
    assert.equal(loaded[1].runs, undefined);

    const waiting = started.items.find(i => i.status === 'wait');
    assert.equal((await designer.request('POST', '/model/test/invoke', { json: { instanceId: started.id, itemId: waiting.id, data: {} } })).status, 200);
    loaded = JSON.parse((await designer.get('/model/scenarios/leave-request')).text).scenarios;
    assert.equal(loaded[0].runs?.[0]?.instanceId, started.id, 'the engine saving the instance leaves its tag');

    const renamed = { ...loaded[0], name: 'Renamed' };
    assert.equal((await designer.request('PUT', '/model/scenarios/leave-request', { json: { scenarios: [renamed, LONG] } })).status, 200);
    loaded = JSON.parse((await designer.get('/model/scenarios/leave-request')).text).scenarios;
    assert.equal(loaded[0].runs?.[0]?.instanceId, started.id, 'a rename takes its run along');

    res = await designer.request('PUT', '/model/scenarios/leave-request', { json: { scenarios: [] } });
    assert.equal(res.status, 200, why(res));
    assert.ok(!fs.existsSync(file));
    assert.equal((await web.bpmnServer.dataStore.findInstances({ id: started.id }, 'summary')).length, 0, 'a scenario gone: its instance too');
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

test('a test instance is not in the lists of instances and work; it opens by its id', async () => {
    const waitingId = instance => instance.items.find(i => i.status === 'wait').id;
    const real = (await web.bpmnServer.engine.start('leave-request', {}, null, 'designer')).instance;
    const res = await designer.request('POST', '/model/test/start', { json: { processName: 'leave-request', data: {} } });
    assert.equal(res.status, 200, why(res));
    const instance = JSON.parse(res.text).instance;
    const tested = instance.id;
    assert.match(tested, /^test-/);
    // the waiting task is the staff's
    for (const [url, user] of [['/', designer], ['/dashboard', staff], ['/tasks', staff]]) {
        const page = await user.get(url);
        assert.equal(page.status, 200, `${url}: ${why(page)}`);
        // a list of instances has their ids, a list of tasks the tasks'
        assert.ok(![tested, waitingId(instance)].some(id => page.text.includes(id)), `${url} does not list the test instance`);
        assert.ok([real.id, waitingId(real)].some(id => page.text.includes(id)), `${url} lists the real one`);
    }
    assert.equal((await designer.get(`/instanceDetails?id=${tested}`)).status, 200);
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
        ['passes Approve', false, 0]
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
    await web.bpmnServer.engine.install({ rebuild: true });
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

test('steps are user tasks, receive tasks and events: a timer is forced, a receive task gets its message', async () => {
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
    await web.bpmnServer.engine.install({ rebuild: true });
    const [result] = JSON.parse((await run({ processName: 'timer', scenario: { name: 'timer', steps: [{ element: 'Wait' }, { element: 'Receive' }] } })).text).results;
    assert.equal(result.steps[0].ok, true, 'the timer is forced');
    assert.equal(result.steps[1].ok, true, 'a receive task is a step');
    assert.equal(result.instance.status, 'end');
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

test('the checks of a run step by step: at the start, after a step (by id or name), at the end, the older expect; test instances only', async () => {
    const check = body => designer.request('POST', '/model/test/check', { json: body });
    let { instance } = JSON.parse((await designer.request('POST', '/model/test/start', { json: { processName: 'leave-request', data: { requester: 'sam' } } })).text);
    const checks = [
        { at: 'start', kind: 'status', status: 'running' },
        { at: 'after', step: 'Submit', kind: 'data', path: 'days', op: '=', value: 9 },
        { at: 'after', step: 'Submit request', kind: 'node', node: 'Approve', status: 'wait', count: 1 },
        { kind: 'status', status: 'running' },
    ];
    let res = await check({ instanceId: instance.id, checks, at: 'start' });
    assert.equal(res.status, 200, why(res));
    assert.deepEqual(JSON.parse(res.text).checks.map(c => [c.what, c.ok]), [['at the start: status is running', true]]);

    const submit = instance.items.find(i => i.elementId === 'Submit' && i.status === 'wait');
    ({ instance } = JSON.parse((await designer.request('POST', '/model/test/invoke', { json: { instanceId: instance.id, itemId: submit.id, data: { days: 9 } } })).text));
    res = await check({ instanceId: instance.id, checks, after: { element: 'Submit', name: 'Submit request' } });
    const after = JSON.parse(res.text);
    assert.deepEqual(after.checks.map(c => [c.what, c.ok]), [['after Submit: data.days is 9', true], ['after Submit request: passes Approve, wait, 1 time', true]],
        'the step\'s checks, by its id and by its name');
    assert.equal(after.instance.id, instance.id, 'with the instance as it is now');

    res = await check({ instanceId: instance.id, checks, expect: { data: { requester: 'sam' } } });
    assert.deepEqual(JSON.parse(res.text).checks.map(c => [c.what, c.ok]), [['data.requester is "sam"', true], ['status is running', true]], 'at the end: the older expect, then the checks');

    assert.equal((await check({ instanceId: 'real-1', checks })).status, 404, 'test instances only');
    assert.equal((await check({ instanceId: 'test-no-such', checks })).status, 404);
});

test('a test instance, as the Test tab shows a kept run: its items, log and Rationale; none: 404', async () => {
    const { instance: started } = JSON.parse((await designer.request('POST', '/model/test/start', { json: { processName: 'leave-request', data: {} } })).text);
    const res = await designer.get(`/model/test/instance/${started.id}`);
    assert.equal(res.status, 200, why(res));
    const { instance } = JSON.parse(res.text);
    assert.equal(instance.id, started.id);
    assert.ok(instance.items.some(i => i.elementId === 'Submit' && i.status === 'wait'));
    assert.ok(Array.isArray(instance.logs) && instance.logs.length);
    assert.ok(Array.isArray(instance.steps), 'the Rationale by its steps');
    assert.equal((await designer.get('/model/test/instance/real-1')).status, 404);
    assert.equal((await designer.get('/model/test/instance/test-no-such')).status, 404);
});

test('a check after a step the scenario no longer has: the save does not fail, and it is checked at the end; one by the step\'s name is kept by its id', async () => {
    const scenario = {
        name: 'Short leave, its later step removed',
        steps: [{ element: 'Submit', data: { days: 2 } }],
        checks: [
            { at: 'after', step: 'Approve', kind: 'node', node: 'Approve', count: 0 },
            { at: 'after', step: 'Submit request', kind: 'data', path: 'days', op: '=', value: 2 },
        ],
    };
    const res = await designer.request('PUT', '/model/scenarios/leave-request', { json: { scenarios: [scenario] } });
    assert.equal(res.status, 200, why(res));
    const [saved] = JSON.parse((await designer.get('/model/scenarios/leave-request')).text).scenarios;
    // read back in the file's order: after its step, then at the end
    assert.deepEqual(saved.checks, [
        { at: 'after', step: 'Submit', kind: 'data', path: 'days', op: '=', value: 2 },
        { kind: 'node', node: 'Approve', count: 0 },
    ]);
    await designer.request('PUT', '/model/scenarios/leave-request', { json: { scenarios: [] } });
});

test('the scenarios of a model whose name is not one: 400', async () => {
    assert.equal((await designer.get('/model/scenarios/a..b')).status, 400);
    assert.equal((await designer.request('PUT', '/model/scenarios/a..b', { json: { scenarios: [] } })).status, 400);
});
