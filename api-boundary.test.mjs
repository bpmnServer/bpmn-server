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
