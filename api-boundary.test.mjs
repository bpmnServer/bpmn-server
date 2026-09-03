import test from 'node:test';
import assert from 'node:assert/strict';

import { BPMNAPI, BPMNAdminAPI } from './dist/index.js';

const server = {};

test('runtime API does not expose model administration', () => {
    const api = new BPMNAPI(server);
    assert.equal(api.model, undefined);
    assert.ok(api.engine);
    assert.ok(api.data);
});

test('admin API explicitly exposes model administration', () => {
    const api = new BPMNAdminAPI(server);
    assert.ok(api.model);
    assert.ok(api.engine);
    assert.ok(api.data);
});

test('API rejects calls without a trusted principal', async () => {
    const api = new BPMNAPI({ engine: { invoke: () => assert.fail('engine must not be called') } });
    await assert.rejects(() => api.engine.invoke({}, {}), /authenticated principal is required/);
});

test('migrated legacy operations qualify queries before reaching the engine or datastore', async () => {
    const calls = [];
    const principal = {
        userName: 'alice',
        qualifyItems: query => ({ ...query, authorizedItem: true }),
        qualifyInstances: query => ({ ...query, authorizedInstance: true })
    };
    const api = new BPMNAPI({
        engine: {
            get: query => { calls.push(['get', query]); return {}; },
            restart: (query, data, userName) => { calls.push(['restart', query, userName]); return {}; }
        },
        dataStore: {
            find: options => { calls.push(['find', options]); return {}; }
        }
    });

    await api.engine.get({ id: 1 }, principal);
    await api.engine.restart({ id: 2 }, {}, principal);
    await api.data.find({ filter: { status: 'running' } }, principal);

    assert.deepEqual(calls, [
        ['get', { id: 1, authorizedItem: true }],
        ['restart', { id: 2, authorizedItem: true }, 'alice'],
        ['find', { filter: { status: 'running', authorizedInstance: true } }]
    ]);
});
