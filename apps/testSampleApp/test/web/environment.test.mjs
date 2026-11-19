// @features: environment-band, read-only
// The server's environment (runtime/environment.ts): APP_ENV and APP_ENV_LABEL shown as a band on the pages and a
// badge in the editors, and said by API v3's /me. READ_ONLY=true (runtime/readOnly.ts): cases are started and tasks
// completed; the processes and the server's setup are not changed, through a page or an API. The settings are read
// at each request, so one server tries them all.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { startWebApp, why, WebClient, API_KEY } from '../support/webApp.mjs';

const MODEL = 'leave-request';
let web, admin, designer, staff, token;
const v3 = (method, url, body) => new WebClient(web.base).request(method, '/api/v3' + url, { json: body, headers: { authorization: `Bearer ${token}` } });
const setEnv = (values) => { for (const [k, v] of Object.entries(values)) v === undefined ? delete process.env[k] : process.env[k] = v; };

test.before(async () => {
    web = await startWebApp();
    [admin, designer, staff] = await Promise.all([web.login('admin'), web.login('designer'), web.login('staff')]);
    const { Tokens } = await import('../../../../packages/bpmn-web/dist/routes/api/tokens.js');
    token = (await new Tokens(web.bpmnServer).issue({ userName: 'dee', groups: ['DESIGNER'] }, 'dee', { own: true })).token;
});
test.after(async () => {
    setEnv({ APP_ENV: undefined, APP_ENV_LABEL: undefined, READ_ONLY: undefined });
    await web?.stop(); setImmediate(() => process.exit(0));
});

test('the environment: a band on the pages, a badge in the editors, said by /me; none when not declared or production', async () => {
    setEnv({ APP_ENV: undefined, APP_ENV_LABEL: undefined, READ_ONLY: undefined });
    assert.doesNotMatch((await staff.get('/dashboard')).text, /class="env-band/);
    assert.deepEqual((await v3('GET', '/me')).body.environment, { name: null, label: null, readOnly: false, shown: false });

    setEnv({ APP_ENV: 'test' });
    let page = (await staff.get('/dashboard')).text;
    assert.match(page, /<div class="env-band env-test" role="note" data-environment="test"><b class="env-name">Test<\/b><\/div>/);
    assert.ok(page.indexOf('env-band') < page.indexOf('navbar-default'), 'above the menu bar');
    assert.match((await designer.get(`/model/edit/${MODEL}`)).text, /<span class="env-badge env-test"[^>]*>Test<\/span>/);
    assert.deepEqual((await v3('GET', '/me')).body.environment, { name: 'test', label: 'Test', readOnly: false, shown: true });

    setEnv({ APP_ENV: 'development' });
    assert.match((await staff.get('/dashboard')).text, /env-band env-development[^>]*><b class="env-name">Development</);

    setEnv({ APP_ENV: 'production' });
    assert.doesNotMatch((await staff.get('/dashboard')).text, /class="env-band/);
    setEnv({ APP_ENV_LABEL: 'Staging' });
    assert.match((await staff.get('/dashboard')).text, /env-band env-production[^>]*><b class="env-name">Staging</);
    setEnv({ APP_ENV: undefined, APP_ENV_LABEL: undefined });
});

test('read-only: the band says so; the editors\' Save is off; every change to the processes or the setup is refused', async () => {
    setEnv({ READ_ONLY: 'true' });
    const page = (await designer.get('/dashboard')).text;
    assert.match(page, /env-read-only">Read-only: you can start cases and complete tasks, not change the processes/);
    const editor = (await designer.get(`/model/edit/${MODEL}`)).text;
    assert.match(editor, /<button[^>]*id="js-save"[^>]*disabled>/);
    assert.equal((await v3('GET', '/me')).body.environment.readOnly, true);

    const source = fs.readFileSync(path.join(web.definitionsPath, MODEL + '.bpmn'), 'utf8');
    const refused = [
        [designer, 'POST', `/model/edit/${MODEL}`, { form: { source } }],
        [designer, 'POST', '/model/rename', { form: { from: MODEL, to: 'other' } }],
        [designer, 'POST', '/model/delete', { form: { name: MODEL } }],
        [designer, 'PUT', '/model/lint-rules', { json: { rules: {} } }],
        [designer, 'POST', '/model/decision/anything', { json: { xml: '<definitions/>' } }],
        [designer, 'POST', '/model/security-policy/anything', { json: { xml: '<definitions/>' } }],
        [designer, 'PUT', `/model/scenarios/${MODEL}`, { json: { scenarios: [] } }],
        [designer, 'POST', '/dashboard/integration/forms', { form: { FORM_RULES: 'false' } }],
        [admin, 'POST', '/dashboard/admin/roles', { form: { name: 'Visitor' } }],
        [admin, 'POST', '/dashboard/admin/connectors', { form: { id: 'x', document: '{}' } }],
        [admin, 'POST', '/dashboard/admin/restart', { form: {} }],
        [admin, 'POST', '/resetData', { form: {} }],
        [staff, 'POST', '/account/password', { form: { password: 'Another-pass-1', confirmPassword: 'Another-pass-1' } }],
    ];
    for (const [who, method, url, body] of refused) {
        await who.get('/dashboard');      // a page first, as a browser: its CSRF token
        const res = await who.request(method, url, body);
        assert.equal(res.status, 403, `${method} ${url}: ${why(res)}`);
        assert.match(res.text, /read-only/i, `${method} ${url} says why`);
    }
    // the APIs: API v3, the REST API v2's models, as a person or with the key
    let res = await v3('PUT', `/models/${MODEL}`, { source });
    assert.equal(res.status, 403, why(res));
    assert.equal(res.body.error.code, 'READ_ONLY');
    res = await new WebClient(web.base).request('PUT', `/api2/models/${MODEL}`, { json: { source }, headers: { 'x-api-key': API_KEY } });
    assert.equal(res.status, 403, why(res));
    res = await new WebClient(web.base).request('POST', '/api/v3/users', { json: { userName: 'x' }, headers: { 'x-api-key': API_KEY } });
    assert.equal(res.status, 403, why(res));
    assert.ok(fs.readFileSync(path.join(web.definitionsPath, MODEL + '.bpmn'), 'utf8') === source, 'the model is as it was');
});

test('read-only: cases still run: started, their tasks completed; models checked and read', async () => {
    setEnv({ READ_ONLY: 'true' });
    const started = await new WebClient(web.base).request('POST', `/api/v3/processes/${MODEL}/start`, { json: { data: {} }, headers: { 'x-api-key': API_KEY } });
    assert.equal(started.status, 201, why(started));
    assert.equal((await v3('GET', `/models/${MODEL}`)).status, 200);
    const checked = await v3('POST', `/models/${MODEL}/verify`, {});
    assert.notEqual(checked.status, 403, why(checked));
    setEnv({ READ_ONLY: undefined });
});

test('which requests READ_ONLY refuses: changes to the processes and the setup, never a read or a case', async () => {
    const { refusedWhenReadOnly } = await import('../../../../packages/bpmn-web/dist/runtime/readOnly.js');
    const refused = ['POST /model/new', 'POST /model/import', 'POST /model/add/X', 'POST /model/editNoProp/X', 'PUT /model/decision/X/tests',
        'PUT /model/policy/X/tests', 'POST /model/notification-policy/X', 'DELETE /model/history/X/2', 'PUT /model/scenarios/X/feature',
        'POST /dashboard/catalog/import', 'POST /dashboard/admin/users', 'POST /dashboard/admin/roles/delete',
        'POST /dashboard/admin/connectors/hr/key', 'POST /dashboard/admin/connectors/hr/delete', 'POST /account/delete', 'POST /forgot',
        'DELETE /api/v3/models/X', 'POST /api/v3/models/X/rename', 'PUT /api/v3/models/X/feature', 'DELETE /api/v3/users/u',
        'POST /api/definitions/import/X', 'POST /admin/api/model/save', 'POST /api2/model/delete', 'PUT /admin/api2/models/X/feature'];
    const allowed = ['GET /model/edit/X', 'POST /model/test/run', 'POST /model/verify', 'POST /model/decision/X/tests/run',
        'POST /model/policy/X/preview', 'POST /dashboard/design/tests', 'POST /dashboard/admin/connectors/hr/test',
        'POST /dashboard/start', 'POST /invokeItem', 'POST /api/v3/processes/X/start', 'POST /api/v3/tasks/1/complete',
        'POST /api/v3/models/X/verify', 'POST /api/v3/models/X/test', 'POST /api2/tasks/1/complete', 'PUT /api/engine/invoke',
        'POST /login', 'POST /ai/revoke', 'POST /api/v3/tokens'];
    for (const r of refused) assert.equal(refusedWhenReadOnly(...r.split(' ')), true, r);
    for (const r of allowed) assert.equal(refusedWhenReadOnly(...r.split(' ')), false, r);
});
