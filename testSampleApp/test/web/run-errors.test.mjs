// @features: failed-retry
// A process that fails while running is answered with what went wrong and what the model's checks find,
// not an error 500 (src/routes/runErrors.ts).
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { startWebApp, why } from '../support/webApp.mjs';

/** Start, a flow whose condition does not compile, end: starting it fails at the condition. */
const BROKEN = `<?xml version="1.0" encoding="UTF-8"?>
<bpmn:definitions xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" id="d" targetNamespace="urn:test">
  <bpmn:process id="Broken" isExecutable="true">
    <bpmn:startEvent id="Start" />
    <bpmn:exclusiveGateway id="Check" name="Check" />
    <bpmn:endEvent id="End" />
    <bpmn:sequenceFlow id="f1" sourceRef="Start" targetRef="Check" />
    <bpmn:sequenceFlow id="Bad" name="bad condition" sourceRef="Check" targetRef="End">
      <bpmn:conditionExpression xsi:type="bpmn:tFormalExpression">data.amount &gt;</bpmn:conditionExpression>
    </bpmn:sequenceFlow>
  </bpmn:process>
</bpmn:definitions>`;

let web, admin, staff;
test.before(async () => {
    web = await startWebApp();
    [admin, staff] = await Promise.all([web.login('admin'), web.login('staff')]);
    fs.writeFileSync(path.join(web.definitionsPath, 'broken-run.bpmn'), BROKEN);
    await web.bpmnServer.definitions.rebuild();
});
test.after(async () => { await web?.stop(); setImmediate(() => process.exit(0)); });

test('a process that fails to run shows the error and the model\'s problems', async () => {
    const res = await admin.get('/execute/broken-run');
    assert.equal(res.status, 422, why(res));
    assert.match(res.text, /The process stopped with an error/);
    assert.match(res.text, /broken-run/);
    assert.match(res.text, /What the checks find in the model/);
    assert.match(res.text, /expression-syntax|condition expression does not compile/, 'the failing condition is named');
    assert.match(res.text, /bad condition/, 'with its element');
    assert.match(res.text, /href="\/model\/edit\/broken-run"/, 'a designer is offered the model');
    assert.doesNotMatch(res.text, /at Token\.|node_modules/, 'no stack trace');
});

test('users who can not design are not offered the model', async () => {
    const res = await staff.get('/execute/broken-run');
    assert.equal(res.status, 422, why(res));
    assert.doesNotMatch(res.text, /href="\/model\/edit\//);
});

test('an API-style request gets the same as JSON', async () => {
    const res = await admin.request('GET', '/execute/broken-run', { headers: { accept: 'application/json', 'x-requested-with': 'XMLHttpRequest' } });
    assert.equal(res.status, 422, why(res));
    assert.equal(res.body.error, 'ProcessRunError');
    assert.equal(res.body.processName, 'broken-run');
    assert.ok(res.body.issues.some(i => i.elementId === 'Bad'), JSON.stringify(res.body.issues));
});

test('completing a task that is no longer waiting says so', async () => {
    const started = await web.bpmnServer.engine.start('leave-request', {});
    const submit = started.instance.items.find(i => i.elementId === 'Submit');
    let res = await admin.post('/invokeItem', { itemId: submit.id, days: '1' });
    assert.ok([200, 302].includes(res.status), why(res));
    res = await admin.post('/invokeItem', { itemId: submit.id, days: '1' });
    assert.equal(res.status, 409, why(res));
    assert.match(res.text, /This task can not be completed/);
    assert.match(res.text, /is not waiting/);
});

/** Start, a script task that throws until a time, end: whichever process runs it. */
const FLAKY = upAt => `<?xml version="1.0" encoding="UTF-8"?>
<bpmn:definitions xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" id="d2" targetNamespace="urn:test">
  <bpmn:process id="Flaky" isExecutable="true">
    <bpmn:startEvent id="Start" />
    <bpmn:scriptTask id="Work" name="Call out" scriptFormat="JavaScript"><bpmn:script>if (Date.now() &lt; ${upAt}) throw new Error('service down');</bpmn:script></bpmn:scriptTask>
    <bpmn:endEvent id="End" />
    <bpmn:sequenceFlow id="f1" sourceRef="Start" targetRef="Work" />
    <bpmn:sequenceFlow id="f2" sourceRef="Work" targetRef="End" />
  </bpmn:process>
</bpmn:definitions>`;

test('a task whose work threw: the instance page says it failed and why, and Retry runs it again', async () => {
    const upAt = Date.now() + 5000;
    fs.writeFileSync(path.join(web.definitionsPath, 'flaky.bpmn'), FLAKY(upAt));
    await web.bpmnServer.definitions.rebuild();
    await assert.rejects(web.bpmnServer.engine.start('flaky', {}), /service down/);
    const [instance] = await web.bpmnServer.dataStore.findInstances({ name: 'flaky' }, 'full');
    const failed = instance.items.find(i => i.elementId === 'Work');
    assert.equal(failed.status, 'error');

    let page = (await admin.get('/instanceDetails?id=' + instance.id)).text;
    assert.match(page, /failed at Call out/);
    assert.match(page, /class="item-error">service down/);
    assert.match(page, /action="\/retryItem"/);

    let res = await staff.post('/retryItem', { itemId: failed.id });
    assert.notEqual(res.status, 302, 'administrators only');

    await new Promise(resolve => setTimeout(resolve, Math.max(upAt - Date.now(), 0) + 50));
    res = await admin.post('/retryItem', { itemId: failed.id });
    assert.ok([200, 302].includes(res.status), why(res));
    const [after] = await web.bpmnServer.dataStore.findInstances({ id: instance.id }, 'full');
    assert.equal(after.status, 'end');
    assert.equal(after.items.find(i => i.elementId === 'Work').status, 'end');
    page = (await admin.get('/instanceDetails?id=' + instance.id)).text;
    assert.doesNotMatch(page, /retryItem|failed at/);
});
