// A connector called by hand: a REST API described by OpenAPI, added to the server with its key, then called from
// code with `server.connectors.call('<connector>/<operationId>', inputs)`, the call a service task makes for
// camunda:connector. A local server plays the API here; a real one is added the same way, by its document's URL.
//
// Shows: connectors.add and setKey; the operations of a connector; call with path, query and body inputs; a status
// other than 2xx as a ConnectorError (the BPMN error HTTP_<status> in a model).
import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import http from 'node:http';
import type { AddressInfo } from 'node:net';
import { ConnectorError } from 'bpmn-server';
import { testApp, type TestApp } from '../test/support/testApp.js';

process.env.CONNECTORS_KEY ??= 'the key that encrypts connector keys';      // in .env for a real server
const TOKEN = 'crm-token-1234';

/** The API's description: two operations, by operationId. */
const CRM = {
    openapi: '3.0.3',
    info: { title: 'CRM', version: '1.0' },
    components: { securitySchemes: { bearer: { type: 'http', scheme: 'bearer' } } },
    security: [{ bearer: [] }],
    paths: {
        '/customers/{id}': {
            get: {
                operationId: 'getCustomer',
                parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
                responses: { 200: { description: 'the customer' }, 404: { description: 'no such customer' } },
            },
        },
        '/notes': {
            post: {
                operationId: 'addNote',
                parameters: [{ name: 'notify', in: 'query', schema: { type: 'boolean' } }],
                requestBody: { content: { 'application/json': { schema: { type: 'object', properties: { customer: { type: 'string' }, text: { type: 'string' } } } } } },
                responses: { 201: { description: 'the note' } },
            },
        },
    },
};

/** The API itself. */
const api = http.createServer((req, res) => {
    const send = (status: number, body: any) => { res.writeHead(status, { 'Content-Type': 'application/json' }); res.end(JSON.stringify(body)); };
    if (req.headers.authorization !== `Bearer ${TOKEN}`) return send(401, { error: 'unauthorized' });
    const url = new URL(req.url!, 'http://crm');
    const customer = /^\/customers\/([^/]+)$/.exec(url.pathname);
    if (customer) return customer[1] === 'C-1' ? send(200, { id: 'C-1', name: 'Ann Lee', tier: 'gold' }) : send(404, { error: 'no such customer' });
    if (url.pathname === '/notes' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => body += chunk);
        req.on('end', () => send(201, { id: 'N-7', notified: url.searchParams.get('notify') === 'true', ...JSON.parse(body) }));
        return;
    }
    send(404, { error: 'no route' });
});

let app: TestApp;
before(async () => {
    await new Promise<void>(resolve => api.listen(0, '127.0.0.1', resolve));
    const baseUrl = `http://127.0.0.1:${(api.address() as AddressInfo).port}`;

    app = await testApp({ quiet: true });
    const connectors = app.server.connectors;
    await connectors.install();
    // a real API: { id: 'crm', source: 'https://crm.example.com/openapi.json' } (its document's URL)
    await connectors.add({ id: 'crm', name: 'CRM', document: CRM, baseUrl });
    await connectors.setKey('crm', TOKEN);          // kept encrypted; never returned
});
after(async () => {
    await app.stop();
    api.close();
});

test('the connector and its operations', async () => {
    const connector = await app.server.connectors.get('crm');
    assert.equal(connector?.name, 'CRM');
    assert.equal(connector?.auth?.last4, '1234', 'the key is not returned, only its last 4');
    const operations = await app.server.connectors.operations('crm');
    assert.deepEqual(operations.map(o => o.operationId).sort(), ['addNote', 'getCustomer']);
});

test('a call: the path parameter by name; the answer is the output', async () => {
    const { status, output, url } = await app.server.connectors.call('crm/getCustomer', { id: 'C-1' });
    assert.equal(status, 200);
    assert.deepEqual(output, { id: 'C-1', name: 'Ann Lee', tier: 'gold' });
    assert.match(url, /\/customers\/C-1$/);
});

test('a call with a query parameter and a JSON body (its fields as body.<field>)', async () => {
    const { status, output } = await app.server.connectors.call('crm/addNote', {
        notify: true,
        'body.customer': 'C-1',
        'body.text': 'Called about the renewal',
    });
    assert.equal(status, 201);
    assert.deepEqual(output, { id: 'N-7', notified: true, customer: 'C-1', text: 'Called about the renewal' });
});

test('a status other than 2xx throws a ConnectorError: HTTP_404, as a model sees it', async () => {
    await assert.rejects(app.server.connectors.call('crm/getCustomer', { id: 'nobody' }), (err: any) => {
        assert.ok(err instanceof ConnectorError);
        assert.equal(err.status, 404);
        assert.equal(err.code, 'HTTP_404');           // the BPMN error a boundary error event catches
        assert.deepEqual(err.body, { error: 'no such customer' });
        return true;
    });
});
