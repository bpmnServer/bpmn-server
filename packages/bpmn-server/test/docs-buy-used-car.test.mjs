// The Buy Used Car example as docs/docs/examples/buy-used-car.md runs it from code: start, complete Buy by its item's
// id, then Drive by its case and element; the case ends. The page's code, checked.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { BPMNAPI, SecureUser } from '../dist/index.js';
import { makeServer, definitionsFolder } from './helpers.mjs';

const MODEL = path.join(path.dirname(fileURLToPath(import.meta.url)), '../../../apps/testSampleApp/processes/Buy Used Car.bpmn');

test('the docs\' Buy Used Car, from code: Buy, then Drive, and the case ends', async () => {
    const dir = definitionsFolder();
    fs.copyFileSync(MODEL, path.join(dir, 'Buy Used Car.bpmn'));
    const { server } = await makeServer({ dir });
    try {
        const api = new BPMNAPI(server);
        const buyer = new SecureUser({ userName: 'sam', userGroups: ['Driver'] });

        let execution = await api.engine.start('Buy Used Car', {}, buyer);
        const buy = execution.instance.items.find(item => item.elementId === 'task_Buy' && item.status === 'wait');
        assert.ok(buy, 'the case waits at Buy');

        execution = await api.engine.invoke({ 'items.id': buy.id }, { model: 'Thunderbird', needsCleaning: 'No', needsRepairs: 'No' }, buyer);
        const waiting = execution.instance.items.filter(item => item.status === 'wait').map(item => item.elementId);
        assert.deepEqual(waiting, ['task_Drive'], 'neither cleaning nor repairs: on to Drive');

        execution = await api.engine.invoke({ id: execution.instance.id, 'items.elementId': 'task_Drive' }, {}, buyer);
        assert.equal(execution.instance.status, 'end');
    } finally {
        await server.shutdown();
    }
});

// docs/docs/examples/Business Rules.md: calling a decision table from code, as the page shows it
test('the docs\' business rule example: a decision table evaluated from code', async () => {
    const { DMNEngine } = await import('../dist/index.js');
    const file = path.join(path.dirname(fileURLToPath(import.meta.url)), '../../../apps/testSampleApp/processes/loan_approval.dmn.xml');
    const decision = await new DMNEngine({ log: () => { } }).load(file);
    assert.deepEqual(decision.evaluate({ credit_score: 800, income: 120000 }), { approvalStatus: 'Approved', maxAmount: 5000 });
});
