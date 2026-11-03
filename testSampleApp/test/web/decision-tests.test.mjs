// Tests for decisions (src/testing/decisionTests.ts), kept per decision file and run on the saved file, and the
// Design dashboard running a model's, a decision's or every test.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { startWebApp, why } from '../support/webApp.mjs';

const DECISION = 'loanApproval';
const output = (path, value, op = '=') => ({ kind: 'output', path, op, value });
const GOOD = { name: 'A good applicant is approved', data: { credit_score: 800, income: 90000 }, checks: [output('approvalStatus', 'Approved'), output('maxAmount', 5000, '>=')] };
const POOR = { name: 'A score below every rule matches none', data: { credit_score: 550, income: 20000 }, checks: [{ kind: 'matches', op: '=', value: 0 }] };
const WRONG = { name: 'Expects the wrong status', data: { credit_score: 800, income: 90000 }, checks: [output('approvalStatus', 'Rejected')] };
const SCENARIO = {
    name: 'Short leave is approved automatically',
    start: { data: { requester: 'sam' } },
    steps: [{ element: 'Submit', data: { days: 2 } }],
    expect: { status: 'end', passes: ['AutoApprove'] }
};

let web, designer, staff;
test.before(async () => {
    web = await startWebApp();
    fs.copyFileSync(path.join(import.meta.dirname, '..', '..', 'processes', DECISION + '.dmn.xml'), path.join(web.definitionsPath, DECISION + '.dmn.xml'));
    [designer, staff] = await Promise.all([web.login('designer'), web.login('staff')]);
});
test.after(async () => { await web?.stop(); setImmediate(() => process.exit(0)); });

const url = `/model/decision/${DECISION}/tests`;
const json = res => JSON.parse(res.text);

test('a decision\'s tests are kept, checked and run on the saved file', async () => {
    assert.deepEqual(json(await designer.get(url)).tests, []);
    let res = await designer.request('PUT', url, { json: { tests: [GOOD, POOR] } });
    assert.equal(res.status, 200, why(res));
    assert.deepEqual(json(await designer.get(url)).tests.map(t => t.name), [GOOD.name, POOR.name]);

    res = await designer.request('PUT', url, { json: { tests: [{ data: [], checks: [{ kind: 'node' }] }] } });
    assert.equal(res.status, 400);
    assert.match(json(res).error, /has no name.*data must be an object.*check 1: kind must be output or matches/);

    res = await designer.request('POST', url + '/run', { json: {} });
    assert.equal(res.status, 200, why(res));
    const results = json(res).results;
    assert.deepEqual(results.map(r => r.ok), [true, true], JSON.stringify(results, null, 1));
    assert.equal(results[0].decision, DECISION);
    assert.deepEqual(results[0].checks.map(c => c.what), ['approvalStatus is "Approved"', 'maxAmount >= 5000']);
    assert.equal(results[1].result, null, 'no rule matches');
    assert.match(results[0].log.join('\n'), /rules matched: 3/, 'why: the rules matched');
    assert.doesNotMatch(results[0].log.join('\n'), /loaded from/);

    // unsaved tests from the editor; a failed check, a decision the file does not have, no checks
    res = await designer.request('POST', url + '/run', { json: { tests: [WRONG, { name: 'no such', decision: 'nope', data: {} }, { name: 'no checks', data: { credit_score: 1 } }] } });
    const [wrong, missing, open] = json(res).results;
    assert.equal(wrong.ok, false);
    assert.deepEqual(wrong.checks, [{ what: 'approvalStatus is "Rejected"', ok: false, actual: 'Approved' }]);
    assert.match(missing.error, /no decision 'nope'/);
    assert.equal(open.ok, true, 'without checks, a test passes when the decision evaluates');

    res = await designer.request('POST', '/model/decision/no-such-file/tests/run', { json: { tests: [GOOD] } });
    assert.equal(res.status, 404);
    assert.equal((await staff.get(url)).status, 403, 'designers only');
});

test('the Design dashboard runs a model\'s tests, a decision\'s, or all, and shows the last run', async () => {
    await designer.request('PUT', '/model/scenarios/leave-request', { json: { scenarios: [SCENARIO] } });
    await designer.request('PUT', url, { json: { tests: [GOOD, WRONG] } });
    let page = (await designer.get('/dashboard/design')).text;
    assert.match(page, /Run all tests/);
    assert.match(page, new RegExp(`href="/model/decision/${DECISION}#tests">2 tests`));

    let res = await designer.post('/dashboard/design/tests', { model: 'leave-request' });
    assert.equal(res.status, 302, why(res));
    assert.match(decodeURIComponent(res.location), /leave-request: 1 passed, 0 failed/);

    res = await designer.post('/dashboard/design/tests', { decision: DECISION });
    assert.match(decodeURIComponent(res.location), new RegExp(`${DECISION}: 1 passed, 1 failed`));
    page = (await designer.get('/dashboard/design')).text;
    assert.match(page, /1 passed/, 'the model\'s last run');
    assert.match(page, /1 of 2 failed/, 'the decision\'s last run');
    assert.match(page, /Expects the wrong status: approvalStatus is &quot;Rejected&quot; \(was &quot;Approved&quot;\)/, 'why it failed');

    res = await designer.post('/dashboard/design/tests', {});
    assert.match(decodeURIComponent(res.location), /All tests: 2 passed, 1 failed/);
    assert.equal((await staff.post('/dashboard/design/tests', {})).status, 403);
});
