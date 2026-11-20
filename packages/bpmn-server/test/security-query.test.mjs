// @features: security-narrowing
// A security policy as a condition of the store's query (addons/policies/security/SecurityQuery.ts): a superset of the cases a user may
// see, so a list reads fewer before the policy decides each. Every case the policy shows meets it; it never needs to
// be exact. A rule it can't read leaves it wider.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { SecurityPolicy, QueryTranslator, DocumentQuery, builtInSeeConditions } from '../dist/index.js';

const cell = text => `<text>${text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')}</text>`;
/** inputs: actors.initiator, user.userGroups, task, data.amount; outputs: see */
const table = rules => `<?xml version="1.0" encoding="UTF-8"?>
<definitions xmlns="https://www.omg.org/spec/DMN/20191111/MODEL/" id="d" name="P" namespace="t">
  <decision id="P" name="P"><decisionTable id="t" hitPolicy="COLLECT">
    <input id="i0"><inputExpression id="e0" typeRef="string"><text>actors.initiator</text></inputExpression></input>
    <input id="i1"><inputExpression id="e1" typeRef="string"><text>user.userGroups</text></inputExpression></input>
    <input id="i2"><inputExpression id="e2" typeRef="string"><text>task</text></inputExpression></input>
    <input id="i3"><inputExpression id="e3" typeRef="number"><text>data.amount</text></inputExpression></input>
    <output id="o1" name="see" typeRef="string" />
    ${rules.map((r, n) => `<rule id="r${n}">${r.slice(0, 4).map((c, i) => `<inputEntry id="r${n}i${i}">${cell(c)}</inputEntry>`).join('')}<outputEntry id="r${n}o">${cell(r[4])}</outputEntry></rule>`).join('\n')}
  </decisionTable></decision>
</definitions>`;
const MODEL = attr => `<?xml version="1.0" encoding="UTF-8"?>
<bpmn:definitions xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:owf="http://omniworkflow.com/schema/owf/1.0" id="d" targetNamespace="t">
  <bpmn:process id="P" isExecutable="true" ${attr}><bpmn:startEvent id="S" /><bpmn:userTask id="Approve" /></bpmn:process>
</bpmn:definitions>`;

function folder(policies, models = { Request: 'owf:securityPolicy="Cases"', Other: '' }) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'bpmn-security-query-'));
  for (const [name, attr] of Object.entries(models)) fs.writeFileSync(path.join(dir, `${name}.bpmn`), MODEL(attr));
  fs.mkdirSync(path.join(dir, 'policies', 'security'), { recursive: true });
  for (const [name, xml] of Object.entries(policies)) fs.writeFileSync(path.join(dir, 'policies', 'security', `${name}.dmn.xml`), xml);
  return dir;
}
/** a case of `model` started by `by`, its Approve waiting for `group` (or assigned to `assignee`) */
const aCase = (id, model, by, { group = 'Manager', assignee, amount = 10 } = {}) => ({
  id, name: model, userName: by, data: { amount },
  items: [
    { seq: 1, type: 'bpmn:StartEvent', elementId: 'S', status: 'end', userName: by },
    { seq: 2, type: 'bpmn:UserTask', elementId: 'Approve', status: 'wait', candidateGroups: [group], ...(assignee ? { assignee } : {}) },
  ],
});
const CASES = [
  aCase('1', 'Request', 'ann'), aCase('2', 'Request', 'bob'), aCase('3', 'Request', 'carl', { group: 'HR' }),
  aCase('4', 'Other', 'ann'), aCase('5', 'Other', 'dora', { group: 'HR' }), aCase('6', 'Other', 'eve', { assignee: 'ann' }),
  aCase('7', 'Gone', 'ann'), aCase('8', 'Gone', 'zed', { group: 'Staff' }),
];
const matches = (query, doc) => DocumentQuery.matches(doc, new QueryTranslator('items').translateCriteria(query));

/** The narrowing is a superset: every case the policy shows meets it. Returns the cases it reads. */
async function check(dir, user) {
  const policy = new SecurityPolicy(dir);
  const query = await policy.seeQuery(user, ['Request', 'Other']);
  const read = query ? CASES.filter(c => matches(query, c)) : CASES;
  for (const c of CASES)
    if ((await policy.decide(user, c)).see !== 'none')
      assert.ok(read.includes(c), `case ${c.id} (${c.name}) is shown to ${user.userName}, so the query must read it: ${JSON.stringify(query)}`);
  return { query, read: read.map(c => c.id) };
}

test('a policy whose rules name the initiator: the store reads their cases, the default\'s for the others', async () => {
  const dir = folder({
    Cases: table([['user.userName', '', '', '', '"full"'], ['', '"Auditor"', '', '', '"summary"']]),
    default: table([['user.userName', '', '', '', '"summary"']]),
  });
  const ann = await check(dir, { userName: 'ann', userGroups: ['Staff'] });
  assert.deepEqual(ann.read, ['1', '4', '7'], 'what ann started, of every model');
  // an auditor: the second rule may grant any case of Request
  const audit = await check(dir, { userName: 'aud', userGroups: ['Auditor'] });
  assert.deepEqual(audit.read, ['1', '2', '3'], 'every Request, nothing of the others');
});

test('a rule that tests a task, or a group the user is not in, doesn\'t count; one it can\'t read leaves it wide', async () => {
  const dir = folder({
    Cases: table([['', '', '"Approve"', '', '"full"'], ['', '"Manager"', '', '', '"full"'], ['user.userName', '', '', '', '"full"']]),
    default: table([['', '', '', '> 5', '"summary"']]),
  });
  const staff = await check(dir, { userName: 'bob', userGroups: ['Staff'] });
  assert.equal(staff.query, null, 'the default tests the data only: any case may be seen, no narrowing');
  const dir2 = folder({
    Cases: table([['', '', '"Approve"', '', '"full"'], ['', '"Manager"', '', '', '"full"'], ['user.userName', '', '', '', '"full"']]),
  });
  assert.deepEqual((await check(dir2, { userName: 'bob', userGroups: ['Staff'] })).read, ['2', '8'],
    'Request: only what bob started (not a manager, the task rule not for a list); the built-in default for the others: what he started, or is offered (Staff)');
  assert.deepEqual((await check(dir2, { userName: 'mia', userGroups: ['Manager'] })).read.filter(id => ['1', '2', '3'].includes(id)), ['1', '2', '3'], 'a manager: every Request');
});

test('the built-in default: designers any case; anyone else what they started, did, or is offered or assigned', async () => {
  assert.equal(builtInSeeConditions({ userName: 'dee', userGroups: ['DESIGNER'] }), null);
  const dir = folder({}, { Request: '', Other: '' });
  assert.deepEqual((await check(dir, { userName: 'ann', userGroups: ['Staff'] })).read, ['1', '4', '6', '7', '8'], 'started 1, 4, 7; assigned 6; offered 8 (Staff)');
  assert.equal((await new SecurityPolicy(dir).seeQuery({ userName: 'x', unrestricted: true, userGroups: [] }, [])), null, 'an administrator: no narrowing');
});

test('a policy that grants nothing to see, or a missing one: none of its cases read', async () => {
  const dir = folder({ Cases: table([['user.userName', '', '', '', '"none"']]), default: table([['user.userName', '', '', '', '"summary"']]) });
  assert.deepEqual((await check(dir, { userName: 'ann', userGroups: [] })).read, ['1', '4', '7'], 'Request\'s own grants nothing; the default\'s branch still reads what ann started (a superset)');
  const missing = folder({ default: table([['user.userName', '', '', '', '"summary"']]) }, { Request: 'owf:securityPolicy="Nowhere"' });
  await check(missing, { userName: 'ann', userGroups: [] });
});
