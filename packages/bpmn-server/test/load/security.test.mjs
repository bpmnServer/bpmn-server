// @features: performance
// Security policies under load (docs/docs/performance.md#security-policies): what one case's check costs, with the
// built-in default, with a decision table, and with an application's decisionContext hook that waits (as one that
// asks another system does), one case at a time and several at once, as a list's page asks them.
// Settings in ./setup.mjs (LOAD_SCALE).
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { SecurityPolicy } from '../../dist/index.js';
import { n } from './setup.mjs';

const MODEL = (attr) => `<?xml version="1.0" encoding="UTF-8"?>
<bpmn:definitions xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:owf="http://omniworkflow.com/schema/owf/1.0" id="d" targetNamespace="t">
  <bpmn:process id="P" isExecutable="true" ${attr}>
    <bpmn:startEvent id="S" /><bpmn:userTask id="Approve" /><bpmn:userTask id="Notes" owf:actor="noter" />
  </bpmn:process>
</bpmn:definitions>`;
const POLICY = `<?xml version="1.0" encoding="UTF-8"?>
<definitions xmlns="https://www.omg.org/spec/DMN/20191111/MODEL/" id="d" name="Cases" namespace="t">
  <decision id="Cases" name="Cases"><decisionTable id="t" hitPolicy="COLLECT">
    <input id="i0" label="initiator"><inputExpression id="e0" typeRef="string"><text>actors.initiator</text></inputExpression></input>
    <input id="i1" label="groups"><inputExpression id="e1" typeRef="string"><text>user.userGroups</text></inputExpression></input>
    <input id="i2" label="task"><inputExpression id="e2" typeRef="string"><text>task</text></inputExpression></input>
    <output id="o1" name="see" typeRef="string" /><output id="o2" name="data" typeRef="string" /><output id="o3" name="complete" typeRef="string" />
    <rule id="r1"><inputEntry id="a1"><text></text></inputEntry><inputEntry id="b1"><text>"Manager"</text></inputEntry><inputEntry id="c1"><text></text></inputEntry><outputEntry id="d1"><text>"full"</text></outputEntry><outputEntry id="e1o"><text>"forms"</text></outputEntry><outputEntry id="f1"><text></text></outputEntry></rule>
    <rule id="r2"><inputEntry id="a2"><text>user.userName</text></inputEntry><inputEntry id="b2"><text></text></inputEntry><inputEntry id="c2"><text></text></inputEntry><outputEntry id="d2"><text>"full"</text></outputEntry><outputEntry id="e2o"><text>"forms"</text></outputEntry><outputEntry id="f2"><text></text></outputEntry></rule>
    <rule id="r3"><inputEntry id="a3"><text>user.userName</text></inputEntry><inputEntry id="b3"><text></text></inputEntry><inputEntry id="c3"><text>"Approve"</text></inputEntry><outputEntry id="d3"><text></text></outputEntry><outputEntry id="e3o"><text></text></outputEntry><outputEntry id="f3"><text>"deny"</text></outputEntry></rule>
  </decisionTable></decision>
</definitions>`;

function folder(policy) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'bpmn-security-load-'));
  fs.writeFileSync(path.join(dir, 'Request.bpmn'), MODEL(policy ? 'owf:securityPolicy="Cases"' : ''));
  fs.mkdirSync(path.join(dir, 'security'), { recursive: true });
  if (policy) fs.writeFileSync(path.join(dir, 'security', 'Cases.dmn.xml'), POLICY);
  return dir;
}

/** `count` cases, each started by one of 50 people, its Approve waiting for the managers. */
const cases = count => Array.from({ length: count }, (_, i) => ({
  id: `c${i}`, name: 'Request', data: { reason: 'rest', days: i % 20 },
  items: [
    { seq: 1, type: 'bpmn:StartEvent', elementId: 'S', status: 'end', userName: `user${i % 50}` },
    { seq: 2, type: 'bpmn:UserTask', elementId: 'Notes', status: 'end', userName: 'bob' },
    { seq: 3, type: 'bpmn:UserTask', elementId: 'Approve', status: 'wait', candidateGroups: ['Manager'] },
  ],
}));
const mia = { userName: 'mia', userGroups: ['Employee', 'Manager'] };

/** each case decided, `width` at a time: ms per case */
async function measure(policy, list, width = 1) {
  const start = process.hrtime.bigint();
  for (let i = 0; i < list.length; i += width)
    await Promise.all(list.slice(i, i + width).map(c => policy.decide(mia, c)));
  return Number(process.hrtime.bigint() - start) / 1e6 / list.length;
}

test('one case\'s check: the built-in default and a decision table, each well under a millisecond or two', async (t) => {
  const list = cases(n(1000));
  const builtIn = new SecurityPolicy(folder(false)), table = new SecurityPolicy(folder(true));
  await measure(builtIn, list.slice(0, 50)); await measure(table, list.slice(0, 50));       // warm up
  const a = await measure(builtIn, list), b = await measure(table, list);
  t.diagnostic(`${list.length} cases: built-in default ${a.toFixed(3)} ms a case, a decision table (3 rules) ${b.toFixed(3)} ms a case`);
  assert.ok(a < 2, `the built-in default: ${a.toFixed(3)} ms a case`);
  assert.ok(b < 5, `a decision table: ${b.toFixed(3)} ms a case`);
  // a page of 50 cases, as API v3 lists them
  t.diagnostic(`a page of 50 cases: ${(a * 50).toFixed(1)} ms (built-in), ${(b * 50).toFixed(1)} ms (decision table)`);
});

test('an application hook that waits: several cases at once, not one after another', async (t) => {
  const WAIT = 5;
  const appDelegate = { decisionContext: () => new Promise(resolve => setTimeout(() => resolve({ region: 'east' }), WAIT)) };
  const policy = new SecurityPolicy(folder(true), appDelegate);
  const list = cases(n(100));
  await measure(policy, list.slice(0, 10), 10);
  const one = await measure(policy, list, 1), sixteen = await measure(policy, list, 16);
  t.diagnostic(`a hook that waits ${WAIT} ms: ${one.toFixed(2)} ms a case one at a time, ${sixteen.toFixed(2)} ms a case 16 at a time; a page of 50: ${(one * 50).toFixed(0)} ms against ${(sixteen * 50).toFixed(0)} ms`);
  assert.ok(one >= WAIT * 0.8, 'one at a time waits for each');
  assert.ok(sixteen < one / 4, `16 at a time: ${sixteen.toFixed(2)} ms against ${one.toFixed(2)} ms`);
});
