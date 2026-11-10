// @features: gherkin-tests
// A test set as a .feature file: what the Test tab keeps, read back as it was; what it has no form for, kept as written.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { startWebApp, why } from '../support/webApp.mjs';

const MODEL = 'leave-request';
const dist = file => new URL(`../../../../packages/bpmn-web/dist/testing/${file}`, import.meta.url).href;
let web, designer, readFeature, writeFeature, convertTestFiles;

const FULL = {
  name: 'Every form: \'quotes\', a | pipe',
  start: { startNodeId: 'Submit', only: true, data: { text: 'a | b\nc\\d', zero: 0, off: false, none: null, empty: '', list: [1, 'x'], deep: { a: { b: 1 } }, 'odd key': 'looks like ${data.x}', number: '5' } },
  steps: [{ element: 'Submit', data: { days: 2 } }, { element: 'A task', data: {} }, { element: 'Submit', data: {} }],
  checks: [
    { kind: 'status', at: 'start', status: 'running' },
    { kind: 'node', at: 'after', step: 'Submit', node: 'Submit', count: 1 },
    { kind: 'data', at: 'after', step: 'A task', path: 'days', op: '>=', value: 2 },
    { kind: 'status', status: 'end' },
    { kind: 'node', node: 'A task', count: 0 },
    { kind: 'node', node: 'Submit', status: 'end' },
    { kind: 'data', path: 'a.b c.0', op: '<>', value: 'x' },
    { kind: 'data', path: 'text', op: '=', value: 'y' },
  ],
  generated: true,
  tags: ['@feature:gherkin-tests'],
};
const WRITTEN = `Feature: leave-request

  @feature:gherkin-tests
  Scenario: with a stub
    # a comment that stays
    Given @stub service:x with
      """javascript
      return {};
      """
    Then @check \${1 === 1}

  Scenario Outline: an outline
    Then @check \${<n> === <n>}

    Examples:
      | n |
      | 1 |
      | 2 |
`;

test.before(async () => {
  web = await startWebApp();
  designer = await web.login('designer');
  await designer.get('/model/list');
  ({ readFeature, writeFeature } = await import(dist('featureFiles.js')));
  ({ convertTestFiles } = await import(dist('scenarios.js')));
});
test.after(async () => { await web?.stop(); setImmediate(() => process.exit(0)); });

test('a scenario reads back as it was written, in every form', () => {
  const text = writeFeature(MODEL, [FULL]);
  assert.deepEqual(readFeature(text), [FULL]);
  assert.match(text, /@start process:leave-request at element:Submit only as :instance/);
  assert.match(text, /@invoke element:"A task" in :instance/);
  assert.match(text, /Then @check :instance status is "end"/);
  assert.equal(text.match(/passed element:Submit 1 times/g).length, 2, 'after each time its step comes');
});

test('a check still being filled in is not written, and does not stop the rest being saved', () => {
  const scenario = { ...FULL, checks: [...FULL.checks, { kind: 'node', node: '' }, { kind: 'data', path: '', op: '=' }, { kind: 'status', status: '' }] };
  assert.deepEqual(readFeature(writeFeature(MODEL, [scenario])), [FULL]);
});

test('a decision\'s test reads back too', () => {
  const tests = [{ name: 'Good', data: { score: 800 }, checks: [
    { kind: 'output', path: 'approvalStatus', op: '=', value: 'Approved' },
    { kind: 'output', path: 'max amount', op: '>', value: 10 },
    { kind: 'matches', op: '=', value: 1 }] }, { name: 'Another decision', decision: 'other', data: {}, checks: [] }];
  const text = writeFeature('loan', tests, { decision: true });
  assert.match(text, /@evaluate decision:loan as :result/);
  assert.deepEqual(readFeature(text, { decision: true, name: 'loan' }), tests);
});

test('what the tab has no form for stays as written, comments too, through a read and a write', () => {
  const list = readFeature(WRITTEN);
  assert.deepEqual(list.map(item => item.name), ['with a stub', 'an outline']);
  assert.ok(list.every(item => item.source));
  assert.match(list[0].source, /# a comment that stays/);
  const again = writeFeature('leave-request', list);
  assert.deepEqual(readFeature(again).map(item => item.source), list.map(item => item.source));
});

test('with a background, every scenario stays as written, and the background once', () => {
  const list = readFeature(`@feature:gherkin-tests\nFeature: F\n\n  Background:\n    Given @script\n      """\n      context.a = 1;\n      """\n\n  Scenario: S\n    When @start process:x as :instance\n`);
  assert.equal(list[0].source.includes('@start'), true);
  const text = writeFeature('F', list);
  assert.equal(text.match(/Background:/g).length, 1);
  assert.match(text, /^@feature:gherkin-tests\nFeature: F/);
});

test('the Test tab\'s API reads and writes the .feature; a run that left things on a scenario is not in it', async () => {
  const file = path.join(web.definitionsPath, `${MODEL}.feature`);
  const scenario = { name: 'Short', start: { data: { requester: 'sam' } }, steps: [{ element: 'Submit', data: { days: 2 }, itemId: 'x', after: { a: 1 }, checks: [] }], checks: [{ kind: 'status', status: 'end', what: 'status is end', ok: true }] };
  const saved = await designer.request('PUT', `/model/scenarios/${MODEL}`, { json: { scenarios: [scenario] } });
  assert.equal(saved.status, 200, why(saved));
  const text = fs.readFileSync(file, 'utf8');
  assert.doesNotMatch(text, /itemId|what/);
  const { scenarios } = JSON.parse((await designer.get(`/model/scenarios/${MODEL}`)).text);
  assert.deepEqual(scenarios[0].steps, [{ element: 'Submit', data: { days: 2 } }]);
  assert.deepEqual(scenarios[0].checks, [{ kind: 'status', status: 'end' }]);

  const res = await designer.request('POST', '/model/test/feature', { json: { processName: MODEL } });
  assert.equal(res.status, 200, why(res));
  assert.ok(JSON.parse(res.text).results[0].elements[0].steps.every(s => s.result.status === 'passed'), res.text);
  await designer.request('PUT', `/model/scenarios/${MODEL}`, { json: { scenarios: [] } });
  assert.ok(!fs.existsSync(file), 'nothing to keep: no file');
});

test('a scenario kept as written runs from the Test tab, and a save leaves it as it was', async () => {
  const file = path.join(web.definitionsPath, `${MODEL}.feature`);
  fs.writeFileSync(file, `Feature: ${MODEL}\n\n  Scenario: written\n    # stays\n    When @start process:leave-request as :i\n    Then @check \${instance.status === "running"}\n\n  Scenario: fails\n    Then @check \${1 === 2}\n`);
  const { scenarios } = JSON.parse((await designer.get(`/model/scenarios/${MODEL}`)).text);
  assert.ok(scenarios.every(s => s.source));
  const run = async scenario => JSON.parse((await designer.request('POST', '/model/test/run', { json: { processName: MODEL, scenario } })).text).results[0];
  const passed = await run(scenarios[0]);
  assert.equal(passed.ok, true, JSON.stringify(passed));
  assert.equal(passed.instance.status, 'running');
  const failed = await run(scenarios[1]);
  assert.equal(failed.ok, false);
  assert.match(failed.error, /1 === 2/);
  assert.equal((await designer.request('PUT', `/model/scenarios/${MODEL}`, { json: { scenarios } })).status, 200);
  assert.match(fs.readFileSync(file, 'utf8'), /# stays/);
  fs.rmSync(file);
});

test('Edit as text: the file as it is; saved when it reads as tests and has not changed; a run leaves it as typed', async () => {
  const file = path.join(web.definitionsPath, `${MODEL}.feature`);
  const url = `/model/scenarios/${MODEL}/feature`;
  const put = json => designer.request('PUT', url, { json });
  fs.rmSync(file, { force: true });
  const base = JSON.parse((await designer.get(url)).text).text;
  assert.match(base, new RegExp(`Feature: ${MODEL}`), 'with no file yet, an empty one to start from');

  const typed = `# a comment at the top\nFeature: ${MODEL}\n\n  Scenario: typed\n    # a comment in it\n    When @start process:leave-request as :instance\n    Then @check :instance status is "wait"\n`;
  const bad = await put({ text: `Feature: x\n\n  Scenario: a\n    When @check\n    Nonsense here\n`, base });
  assert.equal(bad.status, 400);
  assert.match(JSON.parse(bad.text).error, /\(5:/, 'says which line');
  assert.equal((await put({ text: 'no feature', base })).status, 400);
  assert.ok(!fs.existsSync(file), 'what does not read is not saved');

  assert.equal((await put({ text: typed, base })).status, 200);
  assert.equal(fs.readFileSync(file, 'utf8'), typed);
  assert.equal(JSON.parse((await designer.get(url)).text).text, typed);

  const changed = await put({ text: `Feature: ${MODEL}\n`, base });
  assert.equal(changed.status, 409, 'the file is no longer what the text came from');
  assert.equal(fs.readFileSync(file, 'utf8'), typed);

  const { scenarios } = JSON.parse((await designer.get(`/model/scenarios/${MODEL}`)).text);
  assert.equal(scenarios[0].name, 'typed');
  scenarios[0].runs = [{ instanceId: 'test-kept', ok: true }];
  assert.equal((await designer.request('PUT', `/model/scenarios/${MODEL}`, { json: { scenarios } })).status, 200);
  assert.equal(fs.readFileSync(file, 'utf8'), typed, 'only its runs changed: the file stays as typed');
  fs.rmSync(file);
});

test('@skip keeps a scenario without running it; an engine file is not the Test tab\'s', async () => {
  const res = await designer.request('POST', '/model/test/feature', { json: { source: 'Feature: F\n\n  @skip\n  Scenario: S\n    Then @check ${1 === 2}\n' } });
  const [element] = JSON.parse(res.text).results[0].elements;
  assert.equal(element.steps[0].result.status, 'skipped');
  const file = path.join(web.definitionsPath, 'only-engine.engine.feature');
  fs.writeFileSync(file, 'Feature: F\n\n  Scenario: S\n    Then @check ${1 === 1}\n');
  const { listScenarioSets } = await import(dist('scenarios.js'));
  assert.ok(!(await listScenarioSets()).some(set => set.model.includes('only-engine')));
  fs.rmSync(file);
});

test('a test file in JSON is read until it is converted; the conversion leaves what would not read back', async () => {
  const folder = web.definitionsPath;
  const json = path.join(folder, `${MODEL}.tests.json`);
  const scenario = { name: 'Old', start: { data: {} }, steps: [], expect: { status: 'running', passes: ['Submit'] } };
  fs.writeFileSync(json, JSON.stringify({ model: MODEL, scenarios: [scenario] }));
  assert.equal(JSON.parse((await designer.get(`/model/scenarios/${MODEL}`)).text).scenarios[0].name, 'Old', 'JSON, before it is converted');

  const bad = path.join(folder, 'simple.tests.json');
  fs.writeFileSync(bad, JSON.stringify({ model: 'simple', scenarios: [{ name: 'Bad', start: { data: {} }, steps: [], checks: [{ kind: 'status', at: 'after', step: 'no such step', status: 'x' }] }] }));

  const { asFolder } = await import(dist('scenarios.js')).then(m => ({ asFolder: m.useTestsFolder }));
  asFolder(() => folder);
  const { converted, left } = await convertTestFiles();
  assert.deepEqual(converted, [`${MODEL}.tests.json`]);
  assert.equal(left[0].file, 'simple.tests.json');
  assert.match(left[0].why, /names no step/);
  assert.ok(fs.existsSync(bad), 'one that would not read back stays');
  assert.ok(!fs.existsSync(json));
  const { scenarios } = JSON.parse((await designer.get(`/model/scenarios/${MODEL}`)).text);
  assert.deepEqual(scenarios[0].checks, [{ kind: 'status', status: 'running' }, { kind: 'node', node: 'Submit' }], 'the older expect, as checks');
  fs.rmSync(bad);
  fs.rmSync(path.join(folder, `${MODEL}.feature`));
});
