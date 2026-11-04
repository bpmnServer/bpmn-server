// The Connectors pages of the administration dashboard (docs/docs/connectors.md): a connector added from its OpenAPI
// document, its key set (never shown again), its operations chosen, its connection tested, and deleted. Only
// administrators reach them. A local API stands for the connector's server.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import os from 'node:os';
import { startWebApp, why } from '../support/webApp.mjs';

const APP = path.join(import.meta.dirname, '..', '..');
const KEY = 'secret-token-9876';
const STATUS_DOC = JSON.stringify({
    openapi: '3.0.3', info: { title: 'Status API', version: '1' },
    components: { securitySchemes: { bearerAuth: { type: 'http', scheme: 'bearer' } } },
    security: [{ bearerAuth: [] }],
    paths: {
        '/health': { get: { operationId: 'health', summary: 'Is it up', responses: { 200: { description: 'OK' } } } },
        '/items/{id}': { get: { operationId: 'getItem', parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }], responses: { 200: { description: 'OK' } } } },
    },
});

let web, admin, designer, api, base;
test.before(async () => {
    process.env.CONNECTORS_KEY ??= 'a test encryption key';
    api = http.createServer((req, res) => {
        if (req.url === '/openapi.json') { res.writeHead(200, { 'Content-Type': 'application/json' }); return res.end(JSON.stringify({ ...JSON.parse(STATUS_DOC), servers: [{ url: base }] })); }
        const ok = req.headers.authorization === `Bearer ${KEY}`;
        res.writeHead(ok ? 200 : 401, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ ok }));
    });
    await new Promise(resolve => api.listen(0, '127.0.0.1', resolve));
    base = `http://127.0.0.1:${api.address().port}`;
    // a connector catalog of the test's own: one API, served by the local server
    process.env.CONNECTOR_CATALOG_URL = path.join(fs.mkdtempSync(path.join(os.tmpdir(), 'connector-catalog-')), 'api-catalog.json');
    fs.writeFileSync(process.env.CONNECTOR_CATALOG_URL, JSON.stringify([
        { id: 'catalog-status', name: 'Catalog status', url: `${base}/openapi.json`, defaultAuth: 'bearer' },
        { id: 'not-a-url', name: 'Left out', url: 'file:///etc/passwd' },
    ]));
    web = await startWebApp();
    fs.copyFileSync(path.join(APP, 'processes', 'GitHub repository.bpmn'), path.join(web.definitionsPath, 'GitHub repository.bpmn'));
    await web.bpmnServer.connectors.install();
    [admin, designer] = await Promise.all([web.login('admin'), web.login('designer')]);
});
test.after(async () => { api?.close(); await web?.stop(); setImmediate(() => process.exit(0)); });

const message = res => decodeURIComponent(String(res.location ?? '')).replace(/^.*message=/, '').replace(/\+/g, ' ');

test('the administration dashboard has a Connectors card; the pages are for administrators only', async () => {
    const page = (await admin.get('/dashboard/admin')).text;
    assert.match(page, /id="connectors"/);
    assert.match(page, /No connectors yet/);
    assert.match(page, /href="\/dashboard\/admin\/connectors"/);
    assert.equal((await admin.get('/dashboard/admin/connectors')).status, 200);
    assert.equal((await designer.get('/dashboard/admin/connectors')).status, 403);
    assert.equal((await designer.post('/dashboard/admin/connectors', { id: 'x', document: STATUS_DOC })).status, 403);
});

test('added from a pasted document; errors come back as the page\'s message', async () => {
    let res = await admin.post('/dashboard/admin/connectors', { id: 'status', document: STATUS_DOC, baseUrl: base });
    assert.equal(res.status, 302, why(res));
    assert.match(res.location, /\/dashboard\/admin\/connectors\/status\?/);
    assert.match(message(res), /Connector 'status' added: 2 operations/);

    res = await admin.post('/dashboard/admin/connectors', { id: 'status', document: STATUS_DOC, baseUrl: base });
    assert.match(message(res), /A connector 'status' exists/);
    res = await admin.post('/dashboard/admin/connectors', { id: 'gh', document: '{ "swagger": "2.0" }' });
    assert.match(message(res), /Swagger 2.0 documents are not supported yet/);
    res = await admin.post('/dashboard/admin/connectors', { id: 'github', document: fs.readFileSync(path.join(APP, 'connectors', 'openapi', 'github.json'), 'utf8') });
    assert.match(message(res), /Connector 'github' added/);

    const list = (await admin.get('/dashboard/admin/connectors')).text;
    assert.match(list, /Status API/);
    assert.match(list, /https:\/\/api\.github\.com/);
    assert.match(list, /GitHub repository/, 'the models that use it');
});

test('the key: set, shown only by its last characters, used by the calls, replaced and removed', async () => {
    let page = (await admin.get('/dashboard/admin/connectors/status')).text;
    assert.match(page, /No key: calls go without authorization/);
    assert.match(page, /bearerAuth: http bearer/, 'the document\'s schemes offered');
    let res = await admin.post('/dashboard/admin/connectors/status/test', { operation: 'health' });
    assert.match(message(res), /Test of health: failed, status\/health: HTTP 401/);

    res = await admin.post('/dashboard/admin/connectors/status/key', { scheme: 'bearerAuth', key: KEY });
    assert.match(message(res), /Key set \(bearer, ending 9876\)/);
    page = (await admin.get('/dashboard/admin/connectors/status')).text;
    assert.match(page, /ending <code>9876<\/code>/);
    assert.ok(!page.includes(KEY), 'the key is never shown');
    assert.ok(!(await admin.get('/dashboard/admin/connectors')).text.includes(KEY));

    res = await admin.post('/dashboard/admin/connectors/status/test', {});
    assert.match(message(res), /Test of health: OK, HTTP 200/, 'a GET without input, chosen');
    res = await admin.post('/dashboard/admin/connectors/status/test', { operation: 'getItem', input: '{ "id": "A-1" }' });
    assert.match(message(res), /Test of getItem: OK, HTTP 200/, 'an operation that needs input, with it');
    res = await admin.post('/dashboard/admin/connectors/status/test', { operation: 'getItem', input: '{ id: ' });
    assert.match(message(res), /The inputs are not JSON/);
    page = (await admin.get('/dashboard/admin/connectors')).text;
    assert.match(page, /is-ok[^>]*>OK</, 'the last test listed');

    res = await admin.post('/dashboard/admin/connectors/status/key', { scheme: 'apiKey', apiKeyName: '', key: 'k' });
    assert.match(message(res), /An apiKey needs the name of its header/);
    res = await admin.post('/dashboard/admin/connectors/status/key', { clear: '1' });
    assert.match(message(res), /Key removed/);
});

test('the catalog: an API added in one step, then marked added; an unreadable catalog leaves the form', async () => {
    let page = (await admin.get('/dashboard/admin/connectors')).text;
    assert.match(page, /id="connector-catalog"/);
    assert.match(page, /Catalog status/);
    assert.doesNotMatch(page, /Left out/, 'an entry whose document is not on the web is left out');
    let res = await admin.post('/dashboard/admin/connectors', { id: 'catalog-status', name: 'Catalog status', source: `${base}/openapi.json` });
    assert.match(message(res), /Connector 'catalog-status' added: 2 operations/);
    page = (await admin.get('/dashboard/admin/connectors')).text;
    assert.match(page, /href="\/dashboard\/admin\/connectors\/catalog-status">added</);
    assert.equal((await web.bpmnServer.connectors.get('catalog-status')).openapi.source, `${base}/openapi.json`, 'refresh reads it from there');

    const saved = process.env.CONNECTOR_CATALOG_URL;
    process.env.CONNECTOR_CATALOG_URL = path.join(os.tmpdir(), 'no-such-catalog.json');
    try {
        page = (await admin.get('/dashboard/admin/connectors')).text;
        assert.match(page, /The catalog could not be read/);
        assert.match(page, /id="add-connector"/, 'another API can still be added');
    } finally {
        process.env.CONNECTOR_CATALOG_URL = saved;
    }
});

test('settings, operations and enabled; delete', async () => {
    let res = await admin.post('/dashboard/admin/connectors/status/settings', { name: 'Status', baseUrl: base, groups: 'DESIGNER, ops', timeout: '5000', retries: '', enabled: 'on' });
    assert.match(message(res), /Settings saved/);
    const saved = await web.bpmnServer.connectors.get('status');
    assert.deepEqual([saved.name, saved.groups, saved.timeout, saved.retries], ['Status', ['DESIGNER', 'ops'], 5000, null]);

    res = await admin.post('/dashboard/admin/connectors/status/operations', { operation: 'health' });
    assert.match(message(res), /1 of 2 operations enabled/);
    assert.deepEqual((await web.bpmnServer.connectors.get('status')).operations, { health: true, getItem: false });

    res = await admin.post('/dashboard/admin/connectors/status/enabled', { enabled: 'false', list: '1' });
    assert.match(res.location, /\/dashboard\/admin\/connectors\?/);
    assert.equal((await web.bpmnServer.connectors.get('status')).enabled, false);

    const page = (await admin.get('/dashboard/admin/connectors/github')).text;
    assert.match(page, /Used by 1 model:/);
    res = await admin.post('/dashboard/admin/connectors/status/delete', {});
    assert.match(message(res), /Connector 'status' deleted/);
    assert.equal(await web.bpmnServer.connectors.get('status'), undefined);
    res = await admin.get('/dashboard/admin/connectors/status');
    assert.match(message(res), /No connector 'status'/);
});
