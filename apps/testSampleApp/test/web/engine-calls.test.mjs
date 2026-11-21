// @features: engine-api
// An application's own engine calls (#294): what it gives bpmn-web (start({ engineCalls })) is added to bpmn-web's own
// calls (the Test tab's), not in place of them. A host route asks for one by name, and it runs in the engine.
import test from 'node:test';
import assert from 'node:assert/strict';
import { startWebApp } from '../support/webApp.mjs';

let web;
test.before(async () => {
    web = await startWebApp({ engineCalls: (server) => ({ 'app.instances': async () => (await server.dataStore.findInstances({}, 'summary')).length }) });
});
test.after(async () => { await web?.stop(); setImmediate(() => process.exit(0)); });

test('the application\'s call runs in the engine; bpmn-web\'s own are still there', async () => {
    assert.equal(typeof await web.bpmnServer.engine.call('app.instances'), 'number');
    // bpmn-web's own: the Test tab's decision tests (a file that isn't there: an answer, or its error, but the call exists)
    const own = await web.bpmnServer.engine.call('runDecisionTests', 'none.dmn', []).then(() => null, e => e);
    assert.ok(!/No call|is not a function/.test(String(own?.message ?? '')), `bpmn-web's calls kept: ${own?.message}`);
});
