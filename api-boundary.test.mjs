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
