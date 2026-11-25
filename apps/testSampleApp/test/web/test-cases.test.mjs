// @features: test-cases
// Test cases (testing/testCases.ts, docs/docs/environments.md#test-cases): in development and test, a scenario's run
// makes an ordinary case, listed with the others and marked `test`, and its last case is also saved as a file beside
// the models (test-cases/<model>/<scenario>.json). Production (APP_ENV=production) runs no tests and shows those files,
// read-only, marked when the model has changed since.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { startWebApp, why, WebClient, API_KEY } from '../support/webApp.mjs';

const MODEL = 'leave-request';
let web, designer, staff;
const casesFolder = () => path.join(web.definitionsPath, 'test-cases', MODEL);

test.before(async () => {
    web = await startWebApp({ env: { APP_ENV: 'development' } });
    [designer, staff] = await Promise.all([web.login('designer'), web.login('staff')]);
});
test.after(async () => { process.env.APP_ENV = 'development'; await web?.stop(); setImmediate(() => process.exit(0)); });

test('development: a scenario\'s case is an ordinary case, listed and marked test, and saved as a file with the models', async () => {
    await designer.get('/dashboard/design');
    const scenario = { name: 'Short leave: approved by itself', start: { data: { days: 2 } }, steps: [{ element: 'Submit', data: { days: 2, reason: 'rest' } }] };
    assert.equal((await designer.request('PUT', `/model/scenarios/${MODEL}`, { json: { scenarios: [scenario] } })).status, 200);
    const run = await designer.post('/dashboard/design/tests', { model: MODEL });
    assert.equal(run.status, 302, why(run));

    const files = fs.readdirSync(casesFolder());
    assert.deepEqual(files, ['Short leave_ approved by itself.json']);
    const saved = JSON.parse(fs.readFileSync(path.join(casesFolder(), files[0]), 'utf8'));
    assert.equal(saved.format, 'owf-test-case');
    assert.equal(saved.scenario, scenario.name);
    assert.ok(saved.instance.id.startsWith('test-') && saved.instance.items.length, 'the case as it ran');
    assert.ok(saved.source.includes('<bpmn:process') && /^[0-9a-f]{64}$/.test(saved.modelHash), 'its model, and the model\'s fingerprint');

    // listed with the other cases, marked; not filtered out
    const listed = await new WebClient(web.base).request('GET', '/api/v3/instances?limit=200', { headers: { 'x-api-key': API_KEY } });
    const mine = listed.body.items.find(i => i.id === saved.instance.id);
    assert.ok(mine, 'the test case is in the list');
    assert.equal(mine.test, true);
    assert.match((await designer.get('/')).text, /<span class="test-mark"[^>]*>test<\/span>/, 'marked on the Workbench');
    assert.equal((await designer.get('/instanceDetails?id=' + saved.instance.id)).status, 200, 'its page, as any case\'s');
});

test('test cases from their files: a list, and a case\'s page, read-only; out of date once the model changes', async () => {
    let list = (await staff.get(`/test-cases/${MODEL}`)).text;
    assert.match(list, /Short leave: approved by itself/);
    assert.match(list, /passed/);
    assert.match(list, /as it is now/);
    const page = await staff.get(`/test-cases/${MODEL}/${encodeURIComponent('Short leave_ approved by itself')}`);
    assert.equal(page.status, 200, why(page));
    assert.match(page.text, /<h1>Test case<\/h1>/);
    assert.match(page.text, /Scenario:<\/b> Short leave: approved by itself/);
    assert.doesNotMatch(page.text, /href="\/invokeItem|action="\/retryItem"/, 'nothing to act on');
    assert.equal((await staff.get(`/test-cases/${MODEL}/nothing-here`)).status, 404);
    assert.equal((await staff.get(`/test-cases/${MODEL}/..%2F..%2Fsecret`)).status, 404);

    const file = path.join(web.definitionsPath, MODEL + '.bpmn');
    fs.writeFileSync(file, fs.readFileSync(file, 'utf8').replace('name="Submit request"', 'name="Submit it"'));
    list = (await staff.get(`/test-cases/${MODEL}`)).text;
    assert.match(list, /changed since/);
    assert.match((await staff.get(`/test-cases/${MODEL}/${encodeURIComponent('Short leave_ approved by itself')}`)).text, /The model was changed after this ran/);
});

test('production: no test runs, through a page or an API; the test cases still shown from their files', async () => {
    process.env.APP_ENV = 'production';
    try {
        await designer.get('/dashboard/design');
        for (const [method, url, body] of [
            ['POST', '/dashboard/design/tests', { form: { model: MODEL } }],
            ['POST', '/model/test/run', { json: { processName: MODEL, all: true } }],
            ['POST', '/model/test/start', { json: { processName: MODEL } }],
            ['POST', '/model/decision/anything/tests/run', { json: {} }],
        ]) {
            const res = await designer.request(method, url, body);
            assert.equal(res.status, 403, `${method} ${url}: ${why(res)}`);
            assert.match(res.text, /Tests don't run in production/);
        }
        const api = await new WebClient(web.base).request('POST', `/api/v3/models/${MODEL}/test`, { json: {}, headers: { 'x-api-key': API_KEY } });
        assert.equal(api.status, 403, why(api));
        assert.equal(api.body.error.code, 'TESTS_OFF');
        assert.equal((await staff.get(`/test-cases/${MODEL}`)).status, 200);
        assert.match((await staff.get('/test-cases')).text, /Tests don't run on this server/);
    }
    finally { process.env.APP_ENV = 'development'; }
});
