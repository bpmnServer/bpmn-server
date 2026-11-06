// @features: models-files
// A model's name in a URL stays in the models folder: the store makes a path of it, so no route may take one that climbs
// out, whatever it does with it (show, start, export).
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { startWebApp, ADMIN_API_KEY } from '../support/webApp.mjs';

let web, designer, outside;
test.before(async () => {
    web = await startWebApp();
    designer = await web.login('designer');
    outside = path.join(web.definitionsPath, '..', 'outside-the-models');
    const model = '<?xml version="1.0" encoding="UTF-8"?><bpmn:definitions xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" id="d" targetNamespace="urn:test"><bpmn:process id="secret" isExecutable="true"><bpmn:startEvent id="s" /></bpmn:process></bpmn:definitions>';
    fs.writeFileSync(`${outside}.bpmn`, model);
    fs.writeFileSync(`${outside}.svg`, '<svg>secret</svg>');
});
test.after(async () => {
    fs.rmSync(`${outside}.bpmn`, { force: true });
    fs.rmSync(`${outside}.svg`, { force: true });
    await web?.stop();
    setImmediate(() => process.exit(0));
});

const NAMES = ['..%2Foutside-the-models', '..%5Coutside-the-models'];

for (const route of ['/model/edit', '/model/editNoProp', '/model/getSvg', '/model/add', '/model/addNoProp', '/model/delete', '/model/rename', '/model/download', '/model/scenarios',
    '/execute', '/executeInput', '/run', '/user/execute', '/user/executeInput', '/user/select', '/user/run', '/dashboard/start'])
    test(`GET ${route}/<a name that climbs out> is refused`, async () => {
        for (const name of NAMES) {
            const res = await designer.get(`${route}/${name}`);
            assert.equal(res.status, 400, `${route}/${name}: ${res.status} ${res.location ?? ''}`);
            assert.doesNotMatch(res.text ?? '', /secret/);
        }
    });

for (const route of ['/api/engine/start', '/api2/engine/start'])
    test(`POST ${route}/<a name that climbs out> is refused, and starts nothing`, async () => {
        for (const name of NAMES) {
            const res = await web.api('POST', `${route}/${name}`, {});
            assert.equal(res.status, 400, `${route}/${name}: ${res.status}`);
        }
        assert.deepEqual(await web.bpmnServer.dataStore.findInstances({ name: '../outside-the-models' }, 'summary'), []);
    });

test('the administration API refuses one too', async () => {
    for (const name of NAMES) {
        assert.equal((await web.api('GET', `/admin/api2/model/load/${name}`, undefined, ADMIN_API_KEY)).status, 400, name);
        assert.equal((await web.api('POST', `/admin/api2/model/import/${name}`, {}, ADMIN_API_KEY)).status, 400, name);
        assert.equal((await web.api('POST', `/admin/api/definitions/import/${name}`, {}, ADMIN_API_KEY)).status, 400, name);
    }
});

test('a model named properly still opens, spaces and all', async () => {
    fs.copyFileSync(path.join(web.definitionsPath, 'leave-request.bpmn'), path.join(web.definitionsPath, 'leave request (copy).bpmn'));
    await web.bpmnServer.definitions.rebuild();
    for (const route of ['/model/edit', '/model/getSvg', '/model/download'])
        assert.equal((await designer.get(`${route}/${encodeURIComponent(route.endsWith('download') ? 'leave request (copy).bpmn' : 'leave request (copy)')}`)).status, 200, route);
    assert.equal((await designer.get('/model/edit/leave-request')).status, 200);
    assert.equal((await web.api('POST', '/api/engine/start/leave-request', {})).status, 200);
});
