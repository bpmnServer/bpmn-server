// Timers further away than setTimeout can wait (2^31-1 ms, about 24.8 days). Node runs a longer delay after
// 1 ms, so a 30-day start timer would start an instance every millisecond; timers are waited out in steps.
import test, { mock } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { makeServer } from './helpers.mjs';

const MAX_DELAY = 2 ** 31 - 1;

const model = (id, body) => `<?xml version="1.0" encoding="UTF-8"?>
<bpmn:definitions xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" id="d_${id}" targetNamespace="urn:test">
  <bpmn:process id="${id}" isExecutable="true">${body}</bpmn:process>
</bpmn:definitions>`;

/** Starts itself every 30 days. */
const MONTHLY = model('Monthly', `
    <bpmn:startEvent id="Start"><bpmn:timerEventDefinition><bpmn:timeDuration>P30D</bpmn:timeDuration></bpmn:timerEventDefinition></bpmn:startEvent>
    <bpmn:endEvent id="End" />
    <bpmn:sequenceFlow id="f1" sourceRef="Start" targetRef="End" />`);

/** Waits 40 days. */
const WAITING = model('Waiting', `
    <bpmn:startEvent id="Start" />
    <bpmn:intermediateCatchEvent id="Wait"><bpmn:timerEventDefinition><bpmn:timeDuration>P40D</bpmn:timeDuration></bpmn:timerEventDefinition></bpmn:intermediateCatchEvent>
    <bpmn:endEvent id="End" />
    <bpmn:sequenceFlow id="f1" sourceRef="Start" targetRef="Wait" />
    <bpmn:sequenceFlow id="f2" sourceRef="Wait" targetRef="End" />`);

test('timers more than 24.8 days away are not fired early: setTimeout is never asked for more than it takes', async () => {
  const delays = [];
  const realSetTimeout = globalThis.setTimeout;
  mock.method(globalThis, 'setTimeout', (fn, ms, ...args) => {
    delays.push(ms);
    return realSetTimeout(fn, ms, ...args);
  });
  const made = await makeServer({ cron: false });
  try {
    fs.writeFileSync(path.join(made.dir, 'monthly.bpmn'), MONTHLY);
    fs.writeFileSync(path.join(made.dir, 'waiting.bpmn'), WAITING);
    await made.server.definitions.rebuild();
    await made.server.cron.start();
    const waiting = await made.server.engine.start('waiting', {});
    await new Promise(resolve => realSetTimeout(resolve, 300));

    assert.equal((await made.server.dataStore.findInstances({ name: 'monthly' }, 'summary')).length, 0, 'the start timer has not started the process');
    const stored = (await made.server.dataStore.findInstances({ id: waiting.id }, 'full'))[0];
    assert.equal(stored.status, 'running', 'the 40-day timer still waits');
    assert.equal(made.server.cron.counters.fired, 0);
    assert.deepEqual(delays.filter(ms => ms > MAX_DELAY), [], 'no delay longer than setTimeout takes');
    assert.ok(delays.filter(ms => ms === MAX_DELAY).length >= 2, 'both are waited out in steps of the longest');
  } finally {
    mock.restoreAll();
    await made.server.shutdown();
  }
});
