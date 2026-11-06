// @features: business-rule-task, dmn
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

import { DMNEngine, DMNParser, verifyModel } from '../dist/index.js';
import { makeServer } from './helpers.mjs';

/** A decision table: inputs [label, expression, typeRef], outputs [name, typeRef, values?], rules [[...inputs], [...outputs]]. */
function table({ id = 'd1', name = id, hitPolicy, aggregation, inputs, outputs, rules, requires = [], prefix = '' }) {
  const p = prefix ? prefix + ':' : '';
  return `<${p}decision id="${id}" name="${name}">
    ${requires.map(r => `<${p}informationRequirement><${p}requiredDecision href="#${r}" /></${p}informationRequirement>`).join('')}
    <${p}decisionTable${hitPolicy ? ` hitPolicy="${hitPolicy}"` : ''}${aggregation ? ` aggregation="${aggregation}"` : ''}>
      ${inputs.map(([label, expr, type], i) => `<${p}input id="${id}_i${i}" label="${label}"><${p}inputExpression typeRef="${type}"><${p}text>${expr}</${p}text></${p}inputExpression></${p}input>`).join('')}
      ${outputs.map(([n, type, values], i) => `<${p}output id="${id}_o${i}" name="${n}" typeRef="${type}">${values ? `<${p}outputValues><${p}text>${esc(values)}</${p}text></${p}outputValues>` : ''}</${p}output>`).join('')}
      ${rules.map(([ins, outs], r) => `<${p}rule id="${id}_r${r}">${ins.map(t => `<${p}inputEntry><${p}text>${esc(t)}</${p}text></${p}inputEntry>`).join('')}${outs.map(t => `<${p}outputEntry><${p}text>${esc(t)}</${p}text></${p}outputEntry>`).join('')}</${p}rule>`).join('')}
    </${p}decisionTable>
  </${p}decision>`;
}
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const dmn = (decisions, prefix = '') => prefix
  ? `<?xml version="1.0"?><${prefix}:definitions xmlns:${prefix}="https://www.omg.org/spec/DMN/20191111/MODEL/" id="defs" name="t">${decisions}</${prefix}:definitions>`
  : `<?xml version="1.0"?><definitions xmlns="https://www.omg.org/spec/DMN/20191111/MODEL/" id="defs" name="t">${decisions}</definitions>`;

const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'bpmn-dmn-'));
async function engine(xml, file = 'test') {
  const filePath = path.join(dir, `${file}.dmn.xml`);
  fs.writeFileSync(filePath, xml);
  return new DMNEngine().load(filePath);
}

const LOAN = table({
  id: 'loan', hitPolicy: 'PRIORITY',
  inputs: [['Credit score', 'credit_score', 'integer'], ['Income', 'income', 'integer'], ['Tier', 'tier', 'string']],
  outputs: [['status', 'string', '"Rejected","Approved","Conditional"'], ['maxAmount', 'number']],
  rules: [
    [['< 600', '-', '-'], ['"Rejected"', '0']],
    [['[600..750)', '> 40000', '-'], ['"Conditional"', '10000']],
    [['>= 750', '> 50000', '-'], ['"Approved"', 'income * 0.5']],
    [['-', '-', '"gold","platinum"'], ['"Approved"', '50000']],
    [['-', '-', 'not("blocked")'], ['"Conditional"', '1000']]
  ]
});

test('FEEL cells: ranges, lists, not(), quoted text and output expressions; PRIORITY by the output values', async () => {
  const d = await engine(dmn(LOAN));
  assert.deepEqual(d.evaluate({ credit_score: 800, income: 60000, tier: 'standard' }), { status: 'Approved', maxAmount: 30000 });
  assert.deepEqual(d.evaluate({ credit_score: 650, income: 45000, tier: 'standard' }), { status: 'Conditional', maxAmount: 10000 });
  // rules 1 and 4 match: Rejected is listed first, so it wins whatever the rule order
  assert.deepEqual(d.evaluate({ credit_score: 500, income: 0, tier: 'gold' }), { status: 'Rejected', maxAmount: 0 });
  assert.deepEqual(d.evaluate({ credit_score: 700, income: 0, tier: 'gold' }), { status: 'Approved', maxAmount: 50000 });
  assert.equal(d.evaluate({ credit_score: 700, income: 0, tier: 'blocked' }), null, 'no rule matches: null');
  // form fields arrive as text: an integer column reads them as numbers
  assert.deepEqual(d.evaluate({ credit_score: '800', income: '60000', tier: 'x' }), { status: 'Approved', maxAmount: 30000 });
  // the inputs' values in order
  assert.deepEqual(d.evaluate([800, 60000, 'x']), { status: 'Approved', maxAmount: 30000 });
});

test('columns are read by their input expression, not their label; namespace prefixes are read', async () => {
  const xml = dmn(table({
    prefix: 'dmn', id: 'p',
    inputs: [['Customer age', 'customer.age', 'number']], outputs: [['band', 'string']],
    rules: [[['< 18'], ['"minor"']], [['>= 18'], ['"adult"']]]
  }), 'dmn');
  const d = await engine(xml, 'prefixed');
  assert.deepEqual(d.evaluate({ customer: { age: 30 } }), { band: 'adult' });
  assert.deepEqual(d.evaluate({ customer: { age: 12 } }), { band: 'minor' });
});

test('hit policies: UNIQUE, FIRST, ANY, COLLECT and its aggregations, RULE ORDER, OUTPUT ORDER', async () => {
  const rules = [[['> 10'], ['"big"', '3']], [['> 5'], ['"medium"', '2']], [['-'], ['"any"', '1']]];
  const t = (hitPolicy, aggregation, outs = [['size', 'string', '"any","medium","big"'], ['points', 'number']]) =>
    engine(dmn(table({ id: 'h', hitPolicy, aggregation, inputs: [['n', 'n', 'number']], outputs: outs, rules })), `h-${hitPolicy}-${aggregation}`);

  await assert.rejects(async () => (await t('UNIQUE')).evaluate({ n: 20 }), /UNIQUE\): rules 1, 2, 3 all match/);
  assert.deepEqual((await t('UNIQUE')).evaluate({ n: 1 }), { size: 'any', points: 1 });
  assert.deepEqual((await t('FIRST')).evaluate({ n: 7 }), { size: 'medium', points: 2 });
  await assert.rejects(async () => (await t('ANY')).evaluate({ n: 7 }), /ANY\): rules 2, 3 match with different outputs/);
  assert.deepEqual((await t('COLLECT')).evaluate({ n: 7 }), [{ size: 'medium', points: 2 }, { size: 'any', points: 1 }]);
  assert.deepEqual((await t('COLLECT')).evaluate({ n: -1 }).length, 1);
  assert.deepEqual((await t('RULE ORDER')).evaluate({ n: 20 }).map(r => r.size), ['big', 'medium', 'any']);
  assert.deepEqual((await t('OUTPUT ORDER')).evaluate({ n: 20 }).map(r => r.size), ['any', 'medium', 'big']);
  const points = [['points', 'number']];
  const sum = await engine(dmn(table({ id: 's', hitPolicy: 'COLLECT', aggregation: 'SUM', inputs: [['n', 'n', 'number']], outputs: points, rules: rules.map(([i, o]) => [i, [o[1]]]) })), 'sum');
  assert.deepEqual(sum.evaluate({ n: 20 }), { points: 6 });
  const max = await engine(dmn(table({ id: 'm', hitPolicy: 'COLLECT', aggregation: 'MAX', inputs: [['n', 'n', 'number']], outputs: points, rules: rules.map(([i, o]) => [i, [o[1]]]) })), 'max');
  assert.deepEqual(max.evaluate({ n: 7 }), { points: 2 });
  // hitPolicy="SUM", as files written for the earlier evaluator have it
  const legacy = await engine(dmn(table({ id: 'l', hitPolicy: 'SUM', inputs: [['n', 'n', 'number']], outputs: points, rules: rules.map(([i, o]) => [i, [o[1]]]) })), 'legacy-sum');
  assert.deepEqual(legacy.evaluate({ n: 7 }), { points: 3 });
});

test('cells written for the earlier evaluator still work: == and != tests, unquoted text', async () => {
  const d = await engine(dmn(table({
    id: 'old', hitPolicy: 'FIRST', inputs: [['status', 'status', 'string'], ['n', 'n', 'number']], outputs: [['result', 'string']],
    rules: [[['Approved', '== 5'], ['Yes']], [['-', '!= 5'], ['No']], [['-', '-'], ['Maybe']]]
  })), 'old');
  assert.deepEqual(d.evaluate({ status: 'Approved', n: 5 }), { result: 'Yes' });
  assert.deepEqual(d.evaluate({ status: 'Approved', n: 6 }), { result: 'No' });
  assert.deepEqual(d.evaluate({ status: 'Other', n: 5 }), { result: 'Maybe' });
});

test('a decision that requires others, and a literal expression decision', async () => {
  const xml = dmn(`
    ${table({ id: 'risk', hitPolicy: 'FIRST', inputs: [['score', 'score', 'number']], outputs: [['risk', 'string']], rules: [[['< 600'], ['"high"']], [['-'], ['"low"']]] })}
    <decision id="limit" name="Limit">
      <informationRequirement><requiredDecision href="#risk" /></informationRequirement>
      <variable name="limit" typeRef="number" />
      <literalExpression><text>if risk = "high" then 1000 else income * 2</text></literalExpression>
    </decision>`);
  const d = await engine(xml, 'drd');
  assert.equal(d.decision.id, 'limit', 'the decision no other requires');
  assert.deepEqual(d.evaluate({ score: 500, income: 9000 }), { limit: 1000 });
  assert.deepEqual(d.evaluate({ score: 700, income: 9000 }), { limit: 18000 });
});

test('a decision is found by its file name or its id; a missing one says where it looked', async () => {
  const folder = fs.mkdtempSync(path.join(os.tmpdir(), 'bpmn-dmn-find-'));
  fs.writeFileSync(path.join(folder, 'loan_approval.dmn.xml'), dmn(LOAN));
  assert.equal((await DMNEngine.find(folder, 'loan_approval')).decision.id, 'loan');
  assert.equal((await DMNEngine.find(folder, 'loan')).decision.id, 'loan', 'by decision id');
  assert.equal((await DMNEngine.find(folder, 'LOAN_approval')).decision.id, 'loan', 'case aside');
  await assert.rejects(DMNEngine.find(folder, 'nothing'), /Decision 'nothing' not found: no nothing.dmn.xml and no decision with that id in /);
});

test('DMNParser.check: hit policy, cell counts and FEEL that does not parse', async () => {
  const bad = await DMNParser.parse(dmn(table({
    id: 'bad', hitPolicy: 'PRIORITY', inputs: [['n', 'n', 'number']], outputs: [['r', 'string']],
    rules: [[['[1..'], ['"x"']], [['-', '-'], ['"y"']], [['> 1'], ['"unclosed']]]
  })));
  const messages = DMNParser.check(bad).map(i => i.message);
  assert.ok(messages.some(m => /PRIORITY hit policy needs the output values listed/.test(m)), messages.join('\n'));
  assert.ok(messages.some(m => /rule 1: '\[1\.\.' \(n\) is not a FEEL test/.test(m)), messages.join('\n'));
  assert.ok(messages.some(m => /rule 2 has 2 input and 1 output cells; the table has 1 and 1/.test(m)), messages.join('\n'));
  assert.ok(messages.some(m => /rule 3: '"unclosed' \(r\) does not parse as FEEL/.test(m)), messages.join('\n'));
  assert.deepEqual(DMNParser.check(await DMNParser.parse(dmn(LOAN))), [], 'a good table');
});

/** Start -> Prepare (script) -> Decide (business rule task) -> End. */
const PROCESS = (attrs, io = '') => `<?xml version="1.0" encoding="UTF-8"?>
<bpmn:definitions xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:camunda="http://camunda.org/schema/1.0/bpmn" id="d" targetNamespace="urn:test">
  <bpmn:process id="P" isExecutable="true">
    <bpmn:startEvent id="Start" />
    <bpmn:businessRuleTask id="Decide" ${attrs}>${io ? `<bpmn:extensionElements><camunda:inputOutput>${io}</camunda:inputOutput></bpmn:extensionElements>` : ''}</bpmn:businessRuleTask>
    <bpmn:endEvent id="End" />
    <bpmn:sequenceFlow id="f1" sourceRef="Start" targetRef="Decide" />
    <bpmn:sequenceFlow id="f2" sourceRef="Decide" targetRef="End" />
  </bpmn:process>
</bpmn:definitions>`;

async function serverWith(models) {
  const made = await makeServer({ services: {} });
  fs.writeFileSync(path.join(made.dir, 'loan_approval.dmn.xml'), dmn(LOAN));
  for (const [name, xml] of Object.entries(models))
    fs.writeFileSync(path.join(made.dir, name + '.bpmn'), xml);
  await made.server.definitions.rebuild();
  return made;
}

test('a business rule task reads the instance data and its input parameters; the result is saved by a result variable or output parameters', async () => {
  const { server } = await serverWith({
    byVariable: PROCESS('camunda:decisionRef="loan_approval" camunda:resultVariable="loan"'),
    byParams: PROCESS('camunda:decisionRef="loan"',
      '<camunda:inputParameter name="credit_score">$data.score</camunda:inputParameter><camunda:outputParameter name="status">$item.output.status</camunda:outputParameter>'),
    entry: PROCESS('camunda:decisionRef="loan_approval" camunda:resultVariable="status" camunda:mapDecisionResult="singleEntry"')
  });
  let run = await server.engine.start('byVariable', { credit_score: 800, income: 60000, tier: 'x' });
  assert.deepEqual(run.instance.data.loan, { status: 'Approved', maxAmount: 30000 });
  assert.ok(run.instance.logs.some(l => /decision loan \(PRIORITY\): credit_score=800, income=60000, tier="x"; rules matched: 3, 5/.test(l.message ?? l)), 'the log says which rules matched');

  run = await server.engine.start('byParams', { score: 500, income: 1, tier: 'x' });
  assert.equal(run.instance.data.status, 'Rejected', 'the input parameter takes precedence');

  run = await server.engine.start('entry', { credit_score: 800, income: 60000, tier: 'x' });
  assert.equal(run.instance.data.status, 'Approved', 'singleEntry: the first output');
  await server.shutdown();
});

test('a business rule task whose decision is missing stops with a clear message', async () => {
  const { server } = await serverWith({ missing: PROCESS('camunda:decisionRef="LoanApproval"') });
  const err = await server.engine.start('missing', {}).catch(e => e);
  assert.match(String(err?.message ?? JSON.stringify(err?.instance?.logs ?? '')), /Decision 'LoanApproval' not found/);
  await server.shutdown();
});

test('verifyModel checks business rule tasks: decision named, found, valid, and its result saved', async () => {
  const folder = fs.mkdtempSync(path.join(os.tmpdir(), 'bpmn-dmn-verify-'));
  fs.writeFileSync(path.join(folder, 'loan_approval.dmn.xml'), dmn(LOAN));
  fs.writeFileSync(path.join(folder, 'broken.dmn.xml'), dmn(table({ id: 'broken', inputs: [['n', 'n', 'number']], outputs: [['r', 'string']], rules: [[['[1..'], ['"x"']]] })));
  const codes = async (attrs, io) => (await verifyModel(PROCESS(attrs, io), undefined, 'm', { decisionsFolder: folder })).issues
    .filter(i => i.code.startsWith('decision-')).map(i => `${i.severity} ${i.code}`);

  assert.deepEqual(await codes('camunda:decisionRef="loan_approval" camunda:resultVariable="loan"'), []);
  assert.deepEqual(await codes(''), ['warning decision-not-named']);
  assert.deepEqual(await codes('camunda:decisionRef="loan_approval"'), ['warning decision-result-not-saved']);
  assert.deepEqual(await codes('camunda:decisionRef="LoanApprovals" camunda:resultVariable="x"'), ['error decision-not-found']);
  assert.deepEqual(await codes('camunda:decisionRef="broken" camunda:resultVariable="x"'), ['error decision-invalid']);
  assert.deepEqual(await codes('camunda:decisionRef="loan"', '<camunda:inputParameter name="credit_score">$data.score</camunda:inputParameter><camunda:outputParameter name="loan" />'),
    ['info decision-input-from-data', 'info decision-input-from-data'], 'income and tier come from the data');
  // without a folder, the files are not checked
  const plain = await verifyModel(PROCESS('camunda:decisionRef="nothing" camunda:resultVariable="x"'));
  assert.equal(plain.issues.filter(i => i.code.startsWith('decision-')).length, 0);
});

test('the Business Rules sample runs: loan approval by its decision table', async () => {
  const samples = path.join(import.meta.dirname, 'fixtures', 'dmn');
  const made = await makeServer({ services: {} });
  fs.copyFileSync(path.join(samples, 'Business Rules.bpmn.bpmn'), path.join(made.dir, 'business-rules.bpmn'));
  fs.copyFileSync(path.join(samples, 'loanApproval.dmn.xml'), path.join(made.dir, 'loanApproval.dmn.xml'));
  await made.server.definitions.rebuild();
  const cases = [
    [{}, { approvalStatus: 'Conditional Approval', maxAmount: 4500 }],
    [{ creditScore: 800, income: 90000 }, { approvalStatus: 'Approved', maxAmount: 5000 }],
    [{ creditScore: 650, income: 90000 }, { approvalStatus: 'Rejected', maxAmount: 0 }],
    [{ creditScore: 500, income: 90000 }, null]
  ];
  for (const [data, loan] of cases) {
    const run = await made.server.engine.start('business-rules', data);
    assert.equal(run.instance.status, 'end');
    assert.deepEqual(run.instance.data.loan, loan, JSON.stringify(data));
  }
  await made.server.shutdown();
});

test('verifyModel: a parameter written like an expression but without its $ is text', async () => {
  const result = await verifyModel(PROCESS('camunda:decisionRef="x" camunda:resultVariable="r"',
    '<camunda:inputParameter name="score">data.creditScore</camunda:inputParameter><camunda:inputParameter name="ok">$data.income</camunda:inputParameter>'));
  const issues = result.issues.filter(i => i.code === 'parameter-is-text');
  assert.deepEqual(issues.map(i => i.message), ["Parameter 'score' is the text 'data.creditScore', not its value: write $data.creditScore to read it."]);
});

const simple = (hitPolicy, rules, extra = {}) => table({ id: 'd', hitPolicy, inputs: [['A', 'a', 'integer']], outputs: [['r', 'integer']], rules, ...extra });

test('no rule matches: null from the hit policies that give one answer, an empty list from those that give many', async () => {
  const rules = [[['1'], ['10']]];
  for (const policy of ['UNIQUE', 'FIRST', 'ANY', 'PRIORITY'])
    assert.equal((await engine(dmn(simple(policy, rules)))).evaluate({ a: 2 }), null, policy);
  for (const policy of ['OUTPUT ORDER', 'RULE ORDER', 'COLLECT'])
    assert.deepEqual((await engine(dmn(simple(policy, rules)))).evaluate({ a: 2 }), [], policy);
});

test('COLLECT aggregates', async () => {
  const rules = [[['-'], ['3']], [['-'], ['5']], [['-'], ['5']]];
  const of = async (aggregation) => (await engine(dmn(simple('COLLECT', rules, { aggregation })))).evaluate({ a: 1 });
  assert.deepEqual(await of('SUM'), { r: 13 });
  assert.deepEqual(await of('MIN'), { r: 3 });
  assert.deepEqual(await of('MAX'), { r: 5 });
  assert.deepEqual(await of('COUNT'), { r: 2 }, 'how many different values');
  const none = (aggregation) => engine(dmn(simple('COLLECT', [[['1'], ['3']]], { aggregation })));
  assert.deepEqual((await none('MIN')).evaluate({ a: 2 }), { r: null }, 'nothing to take the least of');
  assert.deepEqual((await none('MAX')).evaluate({ a: 2 }), { r: null });
});

test('what can not be evaluated says which decision and why', async () => {
  const unique = await engine(dmn(simple('UNIQUE', [[['-'], ['1']], [['-'], ['2']]])));
  assert.throws(() => unique.evaluate({ a: 1 }), /\(UNIQUE\): rules 1, 2 all match/);
  const any = await engine(dmn(simple('ANY', [[['-'], ['1']], [['-'], ['2']]])));
  assert.throws(() => any.evaluate({ a: 1 }), /\(ANY\): rules 1, 2 match with different outputs/);
  assert.deepEqual((await engine(dmn(simple('ANY', [[['-'], ['1']], [['-'], ['1']]])))).evaluate({ a: 1 }), { r: 1 }, 'the same outputs are one answer');
  assert.throws(() => new DMNEngine().evaluate({}), /Must load a decision first/);
});

test('decisions that require others: a cycle or one missing is refused', async () => {
  const one = (id, requires) => table({ id, hitPolicy: 'FIRST', requires, inputs: [['A', 'a', 'integer']], outputs: [[`${id}_out`, 'integer']], rules: [[['-'], ['1']]] });
  const cycle = await engine(dmn(one('x', ['y']) + one('y', ['x'])));
  assert.throws(() => cycle.evaluate({ a: 1 }), /requires itself: /);
  const missing = await engine(dmn(one('x', ['nope'])));
  assert.throws(() => missing.evaluate({ a: 1 }), /requires 'nope', which is not in the file/);
});

test('a decision found in a folder: by file or id, the file that does not parse is skipped, a folder that can not be read is said', async () => {
  const folder = fs.mkdtempSync(path.join(os.tmpdir(), 'bpmn-dmn-find-'));
  fs.writeFileSync(path.join(folder, 'broken.dmn.xml'), 'this is not xml');
  fs.writeFileSync(path.join(folder, 'rates.dmn.xml'), dmn(simple('FIRST', [[['-'], ['7']]])));
  assert.equal((await DMNEngine.find(folder, 'd')).decision.id, 'd', 'by its id, past the file that does not parse');
  assert.equal((await DMNEngine.find(folder, 'RATES')).decision.id, 'd', 'a file name in another case');
  assert.equal((await DMNEngine.find(folder, 'D')).decision.id, 'd', 'an id in another case');
  await assert.rejects(DMNEngine.find(folder, 'nope'), /no nope\.dmn\.xml and no decision with that id/);
  await assert.rejects(DMNEngine.find(path.join(folder, 'missing'), 'd'), /the folder .* can not be read/);
  const definitions = { decisions: [{ id: 'a', requires: ['b'] }, { id: 'b', requires: ['a'] }] };
  assert.equal(DMNEngine.topDecision(definitions).id, 'a', 'each required by the other: the first');
});

test('columns read form text as their type: true and false as booleans', async () => {
  const d = await engine(dmn(table({ id: 'b', hitPolicy: 'FIRST', inputs: [['Ok', 'ok', 'boolean']], outputs: [['r', 'string']], rules: [[['true'], ['"yes"']], [['false'], ['"no"']]] })));
  assert.deepEqual(d.evaluate({ ok: 'TRUE' }), { r: 'yes' });
  assert.deepEqual(d.evaluate({ ok: 'false' }), { r: 'no' });
  assert.deepEqual(d.evaluate({ ok: true }), { r: 'yes' });
});
