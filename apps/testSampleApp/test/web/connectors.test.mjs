// @features: connectors
// Connectors in the application (docs/docs/connectors.md): the sample model "GitHub repository" calls the connector
// github (connectors/openapi/github.json), started through the REST API, and keeps the repository's description
// and stars. It calls GitHub itself, so it is skipped when GitHub can not be reached.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { startWebApp, why } from '../support/webApp.mjs';

const APP = path.join(import.meta.dirname, '..', '..');
const MODEL = 'GitHub repository';

let web, reachable = true;
test.before(async () => {
    process.env.CONNECTORS_KEY ??= 'a test encryption key';
    web = await startWebApp();
    fs.copyFileSync(path.join(APP, 'processes', MODEL + '.bpmn'), path.join(web.definitionsPath, MODEL + '.bpmn'));
    await web.bpmnServer.engine.install({ rebuild: true });
    try {
        const probe = await fetch('https://api.github.com/rate_limit', { signal: AbortSignal.timeout(5000) });
        reachable = probe.ok && Number((await probe.json())?.resources?.core?.remaining ?? 0) >= 2;
    } catch {
        reachable = false;
    }
});
test.after(async () => { await web?.stop(); setImmediate(() => process.exit(0)); });

const start = data => web.api('POST', '/api2/engine/start', { name: MODEL, data });

test('the connector is added from the app\'s OpenAPI document', async () => {
    const added = await web.bpmnServer.connectors.add({ id: 'github', document: fs.readFileSync(path.join(APP, 'connectors', 'openapi', 'github.json'), 'utf8') });
    assert.equal(added.baseUrl, 'https://api.github.com', 'from the document\'s server');
    assert.deepEqual(Object.keys(added.operations), ['repos/get']);
});

test('GitHub repository: bpmnServer/bpmn-server\'s description and stars, through the API', async (t) => {
    if (!reachable) return t.skip('GitHub can not be reached, or is rate limiting this address');
    const res = await start({ owner: 'bpmnServer', repo: 'bpmn-server' });
    assert.equal(res.status, 200, why(res));
    const instance = JSON.parse(res.text);
    assert.equal(instance.status, 'end', JSON.stringify(instance).slice(0, 400));
    assert.match(instance.data.description, /BPMN/i);
    assert.equal(typeof instance.data.starsCount, 'number');
    assert.ok(instance.data.starsCount > 0);
});

test('a repository that is not there ends at Not found (HTTP_404, caught)', async (t) => {
    if (!reachable) return t.skip('GitHub can not be reached, or is rate limiting this address');
    const res = await start({ owner: 'bpmnServer', repo: 'no-such-repository-here' });
    const instance = JSON.parse(res.text);
    assert.equal(instance.status, 'end');
    const [saved] = await web.bpmnServer.dataStore.findInstances({ id: instance.id }, 'full');
    assert.ok(saved.items.some(i => i.elementId === 'NotFound' && i.status === 'end'), 'the boundary error event caught it');
    assert.equal(saved.data.starsCount, undefined);
});

test('a disabled connector is refused: the task fails, nothing is called', async () => {
    await web.bpmnServer.connectors.update('github', { enabled: false });
    const res = await start({ owner: 'bpmnServer', repo: 'bpmn-server' });
    assert.match(res.text, /The connector 'github' is disabled/, why(res));
    await web.bpmnServer.connectors.update('github', { enabled: true });
});
