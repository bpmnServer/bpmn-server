// @features: app-delegate, service-task
// serviceTask: add (inputs v1=5, v2=3), then "Add 2 Using scripts" (its input script sets v1, v2; its end
// script uses the output), then service1 (a slow service: here replaced by a stub).
import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { testApp, type TestApp } from '../support/testApp.js';

let app: TestApp;
const calls = [];
before(async () => {
    app = await testApp({
        services: {
            // service1 waits 5 seconds and returns { text }: the stub answers at once, and records its input
            async service1(input) { calls.push(input); return { seq: 7, text: 'from the stub' }; },
        },
    });
});
after(async () => { await app.stop(); });

test('service tasks call the app\'s services; a stub replaces one', async () => {
    const run = await app.start('serviceTask');
    assert.equal(run.status, 'end');

    // add: its return value is the item's output; the second add's end script adds 100 to it
    assert.equal(run.item('Task_1gpov6r').output, 8, '5 + 3');
    assert.equal(run.data.result2, 33 + 25 + 100, 'the input script\'s values, then the end script');

    // service1, through the stub: its inputs evaluated, its outputs mapped into the data
    assert.equal(calls.length, 1);
    assert.equal(calls[0].repeat, '100');
    assert.equal(calls[0].inputVar2, 8, 'an input parameter computed by a script: data.result, which the first add set');
    assert.equal(run.data.sequence, 7);
    assert.equal(run.data.returnText, 'out text:from the stub');
});
