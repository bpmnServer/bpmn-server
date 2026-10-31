// Decisions (DMN) in the models folder: listed for the editor, opened and saved in the decision editor (designers
// only), and evaluated by PUT /admin/api/rules/invoke.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { startWebApp, ADMIN_API_KEY } from '../support/webApp.mjs';

const ROOT = path.resolve(import.meta.dirname, '..', '..');
const SAMPLE = path.join(ROOT, 'processes', 'loan_approval.dmn.xml');

let web, designer, staff;
test.before(async () => {
    web = await startWebApp();
    fs.copyFileSync(SAMPLE, path.join(web.definitionsPath, 'loan_approval.dmn.xml'));
    [designer, staff] = await Promise.all([web.login('designer'), web.login('staff')]);
});
test.after(async () => { await web?.stop(); setImmediate(() => process.exit(0)); });

test('the decision files are listed for designers, with their XML', async () => {
    const res = await designer.get('/model/decisions');
    assert.equal(res.status, 200);
    const loan = res.body.decisions.find(d => d.name === 'loan_approval');
    assert.equal(loan.file, 'loan_approval.dmn.xml');
    assert.match(loan.xml, /<decision id="loanApproval"/);
    assert.equal((await staff.get('/model/decisions')).status, 403);
});

test('the decision editor opens a file, or a new one, and saves it in the models folder', async () => {
    const page = await designer.get('/model/decision/loan_approval');
    assert.equal(page.status, 200);
    assert.match(page.text, /data-exists="true"/);
    assert.match(page.text, /\/modeler\/decision\.js/);

    const fresh = await designer.get('/model/decision/discounts');
    assert.match(fresh.text, /data-exists="false"/);
    assert.match(fresh.text, /decision id=\\"discounts\\"/, 'a new table, named for the file');

    const xml = fs.readFileSync(SAMPLE, 'utf8').replace('name="Loan Approval"', 'name="Discounts"');
    const saved = await designer.request('POST', '/model/decision/discounts', { json: { xml } });
    assert.equal(saved.status, 200);
    assert.deepEqual(saved.body, { saved: 'discounts.dmn.xml' });
    assert.equal(fs.readFileSync(path.join(web.definitionsPath, 'discounts.dmn.xml'), 'utf8'), xml);

    assert.equal((await designer.request('POST', '/model/decision/discounts', { json: { xml: 'nope' } })).status, 400);
    assert.equal((await designer.request('POST', '/model/decision/..%5Cx', { json: { xml } })).status, 400);
    assert.equal((await staff.request('POST', '/model/decision/discounts', { json: { xml } })).status, 403);
});

test('PUT /admin/api/rules/invoke and /admin/api2/rules/invoke evaluate a decision, or says why it can not', async () => {
    for (const api of ['/admin/api', '/admin/api2']) {
        const res = await web.api('PUT', api + '/rules/invoke', { decision: 'loan_approval', data: { credit_score: 800, income: 90000 } }, ADMIN_API_KEY);
        if (res.status === 200)
            assert.deepEqual(res.body, { decision: 'loanApproval', file: 'loan_approval.dmn.xml', result: { approvalStatus: 'Approved', maxAmount: 5000 } });
        else    // an earlier bpmn-server, without DMNEngine
            assert.deepEqual([res.status, res.body.errors], [400, 'Decisions need bpmn-server 3.3 or later (DMNEngine); this server runs an earlier one.']);
        const unnamed = await web.api('PUT', api + '/rules/invoke', { data: {} }, ADMIN_API_KEY);
        assert.equal(unnamed.status, 400);
    }
});
