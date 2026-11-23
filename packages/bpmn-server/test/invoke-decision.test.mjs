// @features: decisions
// A decision evaluated by name (EngineService's invokeDecision, and a scenario's @evaluate): a file of the models
// folder or a decision's id; a policy by its tests' name, <name>.policy (assignment), <name>.security-policy,
// <name>.notification-policy, in its own folder.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { invokeDecision, policyAddOns } from '../dist/index.js';

const TABLE = (id, out) => `<?xml version="1.0" encoding="UTF-8"?>
<definitions xmlns="https://www.omg.org/spec/DMN/20191111/MODEL/" id="d" name="${id}" namespace="t">
  <decision id="${id}" name="${id}"><decisionTable id="t" hitPolicy="FIRST">
    <input id="i"><inputExpression id="e" typeRef="number"><text>days</text></inputExpression></input>
    <output id="o" name="who" typeRef="string" />
    <rule id="r"><inputEntry id="a"><text>&gt; 10</text></inputEntry><outputEntry id="b"><text>"${out}"</text></outputEntry></rule>
  </decisionTable></decision>
</definitions>`;

test('a decision by its file or id; a policy by its tests\' name, from its folder', async () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'bpmn-invoke-decision-'));
  fs.writeFileSync(path.join(dir, 'Plain.dmn.xml'), TABLE('Plain', 'plain'));
  for (const kind of ['assignment', 'security', 'notification']) {
    fs.mkdirSync(path.join(dir, kind), { recursive: true });
    fs.writeFileSync(path.join(dir, kind, 'Leave.dmn.xml'), TABLE('Leave', kind));
  }
  const server = { configuration: { definitionsPath: dir }, addOns: policyAddOns() };   // a policy by its tests' name: the add-ons'
  assert.equal((await invokeDecision(server, 'Plain', { days: 12 })).result.who, 'plain');
  assert.equal((await invokeDecision(server, 'Leave.policy', { days: 12 })).result.who, 'assignment');
  assert.equal((await invokeDecision(server, 'Leave.security-policy', { days: 12 })).result.who, 'security');
  assert.equal((await invokeDecision(server, 'Leave.notification-policy', { days: 12 })).result.who, 'notification');
  await assert.rejects(invokeDecision(server, 'Leave', {}), /not found/);
  // the engine alone knows no policy
  await assert.rejects(invokeDecision({ configuration: { definitionsPath: dir }, addOns: [] }, 'Leave.policy', {}), /not found/);
});
