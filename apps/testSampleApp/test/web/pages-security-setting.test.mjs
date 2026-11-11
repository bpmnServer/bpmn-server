// @features: dashboards, roles
// The pages agree on the security rules: with ENFORCE_SECURITY=false (development only), My work (through API v3's
// operations) applies them as every other page does (BPMNAPI), instead of keeping them on; the pages no longer differ by
// which way they reach the engine (the Fable Review, M2). API v3 itself keeps the rules on for its clients.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { startWebApp, why } from '../support/webApp.mjs';

// a process only managers may start
const MANAGERS_ONLY = `<?xml version="1.0" encoding="UTF-8"?>
<bpmn:definitions xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:camunda="http://camunda.org/schema/1.0/bpmn" id="d" targetNamespace="urn:test">
  <bpmn:process id="ManagersOnly" name="Managers only" isExecutable="true">
    <bpmn:startEvent id="Asked" name="Asked by a manager" camunda:candidateGroups="manager" />
    <bpmn:endEvent id="Done" />
    <bpmn:sequenceFlow id="f1" sourceRef="Asked" targetRef="Done" />
  </bpmn:process>
</bpmn:definitions>`;

let web, staff;
test.before(async () => {
  web = await startWebApp({ env: { ENFORCE_SECURITY: 'false' } });
  fs.writeFileSync(path.join(web.definitionsPath, 'managers-only.bpmn'), MANAGERS_ONLY);
  await web.bpmnServer.definitions.rebuild();
  staff = await web.login('staff');
});
test.after(async () => { await web?.stop(); setImmediate(() => process.exit(0)); });

test('with the rules off, My work offers what the other pages let staff start: a process only managers may start', async () => {
  const mine = await staff.get('/dashboard');
  assert.equal(mine.status, 200, why(mine));
  assert.match(mine.text, /managers-only|Managers only/, 'My work offers it, as the rules are off');
  const started = await staff.get('/execute/managers-only');
  assert.ok([200, 302].includes(started.status), `the start page lets staff start it too: ${why(started)}`);
});
