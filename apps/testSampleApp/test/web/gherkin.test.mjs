// @features: gherkin-tests
// A feature, run whole in the engine: @login, @start, @find, @invoke, @check, @wait, @stub, @script (docs/design/gherkin-testing.md).
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { load, featureFileTags, unknownFeatureTags } from '../../../../scripts/features.mjs';
import { startWebApp, why } from '../support/webApp.mjs';

const model = (id, body) => `<?xml version="1.0" encoding="UTF-8"?>
<bpmn:definitions xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:camunda="http://camunda.org/schema/1.0/bpmn" id="d_${id}" targetNamespace="urn:t"><bpmn:process id="${id}" isExecutable="true">${body}</bpmn:process></bpmn:definitions>`;
const flows = (...ids) => ids.slice(1).map((to, i) => `<bpmn:sequenceFlow id="f${i}" sourceRef="${ids[i]}" targetRef="${to}" />`).join('');

const MODELS = {
  'order-approval': model('order-approval', `<bpmn:startEvent id="s" /><bpmn:userTask id="approve-order" camunda:candidateGroups="HR-Manager" /><bpmn:endEvent id="e" />${flows('s', 'approve-order', 'e')}`),
  'order-lines': model('order-lines', `<bpmn:startEvent id="s" /><bpmn:userTask id="line"><bpmn:multiInstanceLoopCharacteristics camunda:collection="$(data.lines)" /></bpmn:userTask><bpmn:endEvent id="e" />${flows('s', 'line', 'e')}`),
  'credit-order': model('credit-order', `<bpmn:startEvent id="s" /><bpmn:serviceTask id="check" implementation="credit-check" /><bpmn:intermediateCatchEvent id="wait-3-days"><bpmn:timerEventDefinition><bpmn:timeDuration>P3D</bpmn:timeDuration></bpmn:timerEventDefinition></bpmn:intermediateCatchEvent><bpmn:scriptTask id="decide" scriptFormat="JavaScript"><bpmn:script>data.decision = 'approved';</bpmn:script></bpmn:scriptTask><bpmn:endEvent id="e" />${flows('s', 'check', 'wait-3-days', 'decide', 'e')}`),
  'calls-credit': model('calls-credit', `<bpmn:startEvent id="s" /><bpmn:callActivity id="call" calledElement="credit-only" /><bpmn:endEvent id="e" />${flows('s', 'call', 'e')}`),
  'credit-only': model('credit-only', `<bpmn:startEvent id="s" /><bpmn:serviceTask id="check" implementation="credit-check" /><bpmn:endEvent id="e" />${flows('s', 'check', 'e')}`),
  'waits-then-credit': model('waits-then-credit', `<bpmn:startEvent id="s" /><bpmn:userTask id="u" /><bpmn:serviceTask id="check" implementation="credit-check" /><bpmn:endEvent id="e" />${flows('s', 'u', 'check', 'e')}`),
  'calls-waiting-credit': model('calls-waiting-credit', `<bpmn:startEvent id="s" /><bpmn:callActivity id="call" calledElement="waits-then-credit" /><bpmn:endEvent id="e" />${flows('s', 'call', 'e')}`),
  'mapped-input': model('mapped-input', `<bpmn:startEvent id="s" /><bpmn:serviceTask id="check" implementation="credit-check"><bpmn:extensionElements><camunda:inputOutput><camunda:inputParameter name="orderId">$(data.orderId)</camunda:inputParameter></camunda:inputOutput></bpmn:extensionElements></bpmn:serviceTask><bpmn:endEvent id="e" />${flows('s', 'check', 'e')}`),
  'catches-errors': model('catches-errors', `<bpmn:startEvent id="s" /><bpmn:serviceTask id="check" implementation="credit-check" camunda:exceptionsAsErrors="true" /><bpmn:boundaryEvent id="caught" attachedToRef="check"><bpmn:errorEventDefinition /></bpmn:boundaryEvent><bpmn:endEvent id="e" /><bpmn:endEvent id="handled" />${flows('s', 'check', 'e')}<bpmn:sequenceFlow id="f9" sourceRef="caught" targetRef="handled" />`),
};

let web, designer;
const run = async source => {
  const res = await designer.request('POST', '/model/test/feature', { json: { source } });
  assert.equal(res.status, 200, why(res));
  return JSON.parse(res.text).results[0].elements;
};
const steps = (...lines) => `Feature: F\n  Scenario: S\n${lines.map(l => '    ' + l).join('\n')}\n`;
const failure = element => element.steps.find(s => s.result.status === 'failed')?.result.error_message;
const passes = async (...lines) => {
  const [element] = await run(steps(...lines));
  assert.equal(failure(element), undefined);
  assert.ok(element.steps.every(s => s.result.status === 'passed'));
  return element;
};
const fails = async (pattern, ...lines) => {
  const [element] = await run(steps(...lines));
  assert.match(failure(element) ?? 'it passed', pattern);
  return element;
};

test.before(async () => {
  web = await startWebApp();
  designer = await web.login('designer');
  await designer.get('/model/list');
  for (const [name, source] of Object.entries(MODELS)) await web.bpmnServer.definitions.save(name, source);
});
test.after(async () => { await web?.stop(); setImmediate(() => process.exit(0)); });

test('the full form: find the item by query, then invoke it', async () => {
  const [element] = await run(`@feature:gherkin-tests
Feature: Order approval
  Scenario: The manager approves
    When user:Johnson @login with role of "HR-Manager"
      And @start process:order-approval as :orderInstance
      And @find element:approve-order in :orderInstance as :approveItem
        | item.status | wait |
      And @invoke :approveItem
        | approved | true   |
        | date     | \${now} |
    Then @check :orderInstance status is "end"
      And @check :approveItem status is "end"
      And @check :orderInstance data.approved is true
      And @check :orderInstance passed element:approve-order 1 time
      And @check \${data.date.length > 10}
`);
  assert.equal(failure(element), undefined);
  assert.deepEqual(element.tags, [{ name: '@feature:gherkin-tests' }]);
  assert.deepEqual(element.steps.map(s => s.keyword.trim()).slice(0, 3), ['When', 'And', 'And']);
  assert.match(element.instances[0], /^test-/, 'a test instance, kept out of the lists of work');
});

test('the short form: invoke the element\'s one waiting item', async () => {
  await passes(
    'When user:Johnson @login with role of "HR-Manager"',
    'And @start process:order-approval as :orderInstance',
    'And @invoke element:approve-order in :orderInstance as :approveItem',
    '  | approved | true |',
    'Then @check :orderInstance status is "end"',
    'And @check :approveItem status is "end"');
});

test('a find must match exactly one item, and says what it found', async () => {
  const lines = ['When @start process:order-lines as :i', '  | lines | ["a","b"] |'];
  await fails(/line in :i: found 2 items, not one: line wait key .*line wait key/, ...lines, 'And @find element:line in :i as :x');
  await fails(/found 2 items/, ...lines, 'And @invoke element:line in :i');
  await fails(/found 0 items/, ...lines, 'And @find element:nothing in :i as :x');
});

test('another role finds no item: the engine\'s rules for that user apply', async () => {
  const element = await fails(/approve-order in :i: found 0 items, not one \(as Sam\)/,
    'When user:Sam @login with role of "Sales"',
    'And @start process:order-approval as :i',
    'And @invoke element:approve-order in :i',
    'Then @check :i status is "end"');
  assert.equal(element.steps.at(-1).result.status, 'skipped', 'after a failure, the rest is skipped');
});

test('a check that does not hold fails and says what it read; scenarios stay apart', async () => {
  const [one, two] = await run(`Feature: F
  Scenario: first
    When @start process:order-approval as :i
    Then @check :i status is "end"
  Scenario: second
    Then @check :i status is "end"
`);
  assert.match(failure(one), /status is "running"/);
  assert.match(failure(two), /nothing is named :i/);
});

test('@wait waits for a statement, and says what it last read', async () => {
  await fails(/still status is "running" after 1 seconds/, 'When @start process:order-approval as :i', 'Then @wait :i status is "end" within 1 second');
  await passes('When @start process:order-approval as :i', 'Then @wait :i status is "running"');
});

test('stubs: a service and a timer, the example of the design', async () => {
  const element = await passes(
    'Given @stub service:credit-check with',
    '  """javascript',
    '  if (data.orderId !== 5001) {',
    '    throw new Error(`Expected orderId 5001, received ${data.orderId}`)',
    '  }',
    '  return { approved: true }',
    '  """',
    'And @stub timer:wait-3-days with 1 seconds',
    'When user:Johnson @login with role of "HR-Manager"',
    'And @start process:credit-order as :orderInstance',
    '  | orderId | 5001 |',
    'Then @wait :orderInstance status is "end"',
    'And @check :orderInstance data.decision is "approved"');
  assert.equal(element.steps.length, 6);
});

test('a stub gets the task\'s input, as a service does, and the instance\'s data', async () => {
  const stubbed = [
    'Given @stub service:credit-check with', '  """javascript',
    '  if (input.orderId !== 5001) fail(`input has ${JSON.stringify(input)}`);',
    '  if (data.orderId !== 5001) fail(`data has ${JSON.stringify(data)}`);',
    '  return {};', '  """'];
  await passes(...stubbed, 'When @start process:mapped-input as :i', '  | orderId | 5001 |', 'Then @check :i status is "end"');
  await fails(/input has \{\}/, ...stubbed, 'When @start process:credit-only as :i', '  | orderId | 5001 |');
});

const STUB = code => ['Given @stub service:credit-check with', '  """', ...code.map(c => '  ' + c), '  """'];

test('a throw in a stub is a service\'s exception: it fails the step, or the model\'s error event takes it', async () => {
  await fails(/not this one/, ...STUB(['throw new Error("not this one")']), 'When @start process:credit-only as :i');
  await passes(...STUB(['throw new Error("not this one")']), 'When @start process:catches-errors as :i', 'Then @check :i passed element:handled');
});

test('fail() in a stub fails the scenario, whatever the model does with it', async () => {
  await fails(/expected this/, ...STUB(['fail("expected this")']), 'When @start process:catches-errors as :i', 'Then @check :i passed element:handled');
});

test('a stub reaches what its instance calls, and no other instance', async () => {
  const before = await passes(...STUB(['return { from: "the stub" }']), 'When @start process:calls-credit as :i', 'Then @check :i status is "end"');
  const instance = await web.bpmnServer.engine.start('credit-only', {});
  assert.notEqual(instance.instance.items.find(i => i.elementId === 'check').output?.from, 'the stub');
  assert.ok(before);
});

test('an instance that outlives its test does not reach the real service it stubbed, nor does what it calls', async () => {
  const ranReal = async id => {
    const [instance] = await web.bpmnServer.dataStore.findInstances({ id }, 'full');
    assert.deepEqual(instance.items.filter(i => i.elementId === 'check').map(i => i.status), ['end']);
    return JSON.stringify(instance.logs).includes('invoking service:credit-check');
  };
  const [own] = await run(steps(...STUB(['return { from: "the stub" }']), 'When @start process:waits-then-credit as :i', 'Then @check :i status is "running"'));
  assert.equal(failure(own), undefined);
  await web.bpmnServer.engine.invoke({ id: own.instances[0], 'items.elementId': 'u' }, {});
  assert.equal(await ranReal(own.instances[0]), false);

  const [parent] = await run(steps(...STUB(['return { from: "the stub" }']), 'When @start process:calls-waiting-credit as :i', 'Then @check :i status is "running"'));
  assert.equal(failure(parent), undefined);
  const [child] = await web.bpmnServer.dataStore.findInstances({ name: 'waits-then-credit', 'flags.stubbed': 'credit-check', status: 'running' }, 'summary');
  assert.ok(child, 'what it called carries the mark');
  await web.bpmnServer.engine.invoke({ id: child.id, 'items.elementId': 'u' }, {});
  assert.equal(await ranReal(child.id), false);

  // the control: with no test at all, the same model does reach it
  const { id } = await web.bpmnServer.engine.start('waits-then-credit', {}, null, null, { flags: { saveLogs: true } });
  await web.bpmnServer.engine.invoke({ id, 'items.elementId': 'u' }, {}).catch(() => { });
  const [plain] = await web.bpmnServer.dataStore.findInstances({ id }, 'full');
  assert.ok(JSON.stringify(plain.logs).includes('invoking service:credit-check'));
});

test('two scenarios at once, each with its own stub: each instance gets its own', async () => {
  const one = (name) => run(steps(...STUB([`return { from: "${name}" }`]), 'When @start process:credit-only as :i', `Then @check :i status is "end"`));
  const results = await Promise.all(['a', 'b', 'c', 'd'].map(one));
  const froms = [];
  for (const [element] of results) {
    assert.equal(failure(element), undefined);
    const [instance] = await web.bpmnServer.dataStore.findInstances({ id: element.instances[0] }, 'full');
    froms.push(instance.items.find(i => i.elementId === 'check').output?.from);
  }
  assert.deepEqual(froms, ['a', 'b', 'c', 'd']);
});

test('a scenario that fails with its instance still going leaves nothing behind that reaches the real service', async () => {
  const [element] = await run(steps(...STUB(['return { from: "the stub" }']), 'When @start process:waits-then-credit as :i', 'Then @check ${1 === 2}'));
  assert.ok(failure(element));
  const id = element.instances[0];
  await web.bpmnServer.engine.invoke({ id, 'items.elementId': 'u' }, {});
  const [instance] = await web.bpmnServer.dataStore.findInstances({ id }, 'full');
  assert.ok(!JSON.stringify(instance.logs).includes('invoking service:credit-check'));
  assert.equal(instance.status, 'end');
});

test('a script that never finishes fails its step, and does not hold the engine', async () => {
  const started = Date.now();
  const [element] = await run(steps('Given @script', '  """', '  await new Promise(() => {});', '  """'));
  assert.match(failure(element), /did not finish within 1000 ms/);
  assert.ok(Date.now() - started < 5000);
});

test('with design off the engine has no test calls: a key to it runs no @script', async () => {
  const { engineTests } = await import(new URL('../../../../packages/bpmn-web/dist/testing/engineTests.js', import.meta.url).href);
  assert.ok(Object.keys(engineTests(web.embedded ?? web.bpmnServer)).includes('runFeature'));
  process.env.DISABLE_DESIGN = 'true';
  try { assert.deepEqual(engineTests(web.embedded ?? web.bpmnServer), {}); }
  finally { delete process.env.DISABLE_DESIGN; }
});

test('a stub that names nothing in the model fails, so the real one can not stay on unseen', async () => {
  await fails(/@stub service:gone: no task of credit-only calls it/, 'Given @stub service:gone with', '  """', '  return {}', '  """', 'When @start process:credit-only as :i');
  await fails(/@stub timer:gone: no such timer/, 'Given @stub timer:gone with 1 seconds', 'When @start process:credit-only as :i');
});

test('stubs can not be set from outside a test', async () => {
  const started = await web.bpmnServer.engine.start('credit-only', {}, null, null, { testStubs: { services: { 'credit-check': 'return { from: "outside" }' } }, flags: { stubs: {} } });
  assert.notEqual(started.instance.items.find(i => i.elementId === 'check').output?.from, 'outside');
});

test('@script keeps what it puts in context for the next steps', async () => {
  await passes('Given @script', '  """', '  context.amount = 2 * 21;', '  """', 'Then @check ${context.amount === 42}');
});

test('what a feature can not say is the step\'s failure, or the request\'s', async () => {
  await fails(/no command @nothing/, 'When @nothing');
  await fails(/no @command/, 'When something');
  await fails(/@start: @start process/, 'When @start nonsense here');
  const bad = await designer.request('POST', '/model/test/feature', { json: { source: 'not gherkin' } });
  assert.equal(bad.status, 422, why(bad));
  assert.match(bad.text, /expected/i);
  assert.equal((await designer.request('POST', '/model/test/feature', { json: {} })).status, 400);
  assert.equal((await designer.request('POST', '/model/test/feature', { json: { processName: 'no-such' } })).status, 404);
});

test('a .feature file names its features by tags, and the catalog check reads them', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'bpmn-feature-tags-'));
  fs.writeFileSync(path.join(dir, 'x.feature'), '@feature:gherkin-tests @other\nFeature: F\n  @feature:no-such-feature\n  Scenario: S\n    When @start process:x\n    # @feature:a-comment\n');
  const tags = featureFileTags([dir]);
  assert.deepEqual(tags.map(([, id]) => id), ['gherkin-tests', 'no-such-feature']);
  const problems = unknownFeatureTags(load(), tags);
  assert.equal(problems.length, 1);
  assert.match(problems[0], /@feature:no-such-feature names no feature/);
  fs.rmSync(dir, { recursive: true, force: true });
});

test('a model\'s own .feature file runs by its name; only designers ask', async () => {
  fs.writeFileSync(path.join(web.definitionsPath, 'order-approval.feature'), steps('When @start process:order-approval as :i', 'Then @check :i status is "running"'));
  const res = await designer.request('POST', '/model/test/feature', { json: { processName: 'order-approval' } });
  assert.equal(res.status, 200, why(res));
  const [{ uri, elements }] = JSON.parse(res.text).results;
  assert.equal(uri, 'order-approval.feature');
  assert.equal(elements[0].steps[1].result.status, 'passed');
  const staff = await web.login('staff');
  assert.equal((await staff.request('POST', '/model/test/feature', { json: { processName: 'order-approval' } })).status, 403);
});
