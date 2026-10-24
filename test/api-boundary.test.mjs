import test from 'node:test';
import assert from 'node:assert/strict';

import { BPMNAPI, BPMNAdminAPI } from '../dist/index.js';

const server = {};

test('runtime API reads models but does not expose model administration', () => {
    const api = new BPMNAPI(server);
    assert.ok(api.engine);
    assert.ok(api.data);
    assert.ok(api.model, 'runtime clients read models (start events, forms, documentation)');
    for (const write of ['save', 'delete', 'rename', 'export'])
        assert.equal(api.model[write], undefined, write);
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
