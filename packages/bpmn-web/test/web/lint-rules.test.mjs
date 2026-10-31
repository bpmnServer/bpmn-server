// The team's modeling rules (bpmnlint levels): read and saved by designers, in bpmnlint.json of the models folder.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { startWebApp } from '../support/webApp.mjs';

let web, designer, staff;
test.before(async () => {
    web = await startWebApp();
    [designer, staff] = await Promise.all([web.login('designer'), web.login('staff')]);
});
test.after(async () => { await web?.stop(); setImmediate(() => process.exit(0)); });

test('no changes: the editor\'s defaults', async () => {
    const res = await designer.get('/model/lint-rules');
    assert.equal(res.status, 200);
    assert.deepEqual(res.body, { rules: {} });
});

test('a designer changes rule levels for everyone, saved in the models folder', async () => {
    const rules = { 'label-required': 'off', 'superfluous-gateway': 'error' };
    const saved = await designer.request('PUT', '/model/lint-rules', { json: { rules } });
    assert.equal(saved.status, 200);
    assert.deepEqual(saved.body, { rules });
    assert.deepEqual(JSON.parse(fs.readFileSync(path.join(web.definitionsPath, 'bpmnlint.json'), 'utf8')), { rules });
    assert.deepEqual((await designer.get('/model/lint-rules')).body, { rules });
});

test('levels and rule names are checked; staff can not change them', async () => {
    const put = (client, rules) => client.request('PUT', '/model/lint-rules', { json: { rules } });
    assert.equal((await put(designer, { 'label-required': 'loud' })).status, 400);
    assert.equal((await put(designer, { '../x': 'off' })).status, 400);
    assert.equal((await put(designer, ['off'])).status, 400);
    assert.equal((await put(staff, { 'label-required': 'off' })).status, 403);
    assert.equal((await staff.get('/model/lint-rules')).status, 403);
});
