// @features: api-v3, dmn
// API v3's rules (POST /api/v3/rules/{name}): a decision table of the models folder, evaluated with the data given,
// by anyone the door lets in (a user's token, an AI link, the service key); nothing changes. One that is not there is
// 404, data that is not an object 400, a decision that fails on it 422.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { startWebApp, why, WebClient, API_KEY } from '../support/webApp.mjs';

const SAMPLE = path.join(import.meta.dirname, '..', '..', 'processes', 'loan_approval.dmn.xml');
let web, Tokens, staff;
const v3 = (method, url, credential, body) => new WebClient(web.base).request(method, '/api/v3' + url, {
  json: body, headers: credential === 'service' ? { 'x-api-key': API_KEY } : { authorization: `Bearer ${credential}` },
});
const own = async (userName, groups, scope) => (await new Tokens(web.bpmnServer).issue({ userName, groups }, userName, { own: true, scope })).token;

test.before(async () => {
  web = await startWebApp({ env: { APP_ENV: 'production', API_TRACE: '' } });
  fs.copyFileSync(SAMPLE, path.join(web.definitionsPath, 'loan_approval.dmn.xml'));
  ({ Tokens } = await import('../../../../packages/bpmn-web/dist/routes/api/tokens.js'));
  staff = await own('staff', ['staff']);
});
test.after(async () => { await web?.stop(); setImmediate(() => process.exit(0)); });

const LOAN = { decision: 'loanApproval', file: 'loan_approval.dmn.xml', result: { approvalStatus: 'Approved', maxAmount: 5000 } };

test('a user, an AI link and the service key evaluate a rule, by its file or its id', async () => {
  const data = { credit_score: 800, income: 90000 };
  const byUser = await v3('POST', '/rules/loan_approval', staff, { data });
  assert.equal(byUser.status, 200, why(byUser));
  assert.deepEqual(byUser.body, LOAN);
  assert.deepEqual((await v3('POST', '/rules/loanApproval', staff, { data })).body, LOAN, 'by the decision\'s id');
  assert.deepEqual((await v3('POST', '/rules/loan_approval', 'service', { data })).body, LOAN);
  const link = await own('staff', ['staff'], 'work');
  assert.deepEqual((await v3('POST', '/rules/loan_approval', link, { data })).body, LOAN, 'an AI link at the work level');
});

test('what can not be evaluated says why: no such rule, data that is not an object, a decision that fails', async () => {
  const missing = await v3('POST', '/rules/no_such_rule', staff, { data: {} });
  assert.equal(missing.status, 404, why(missing));
  assert.equal(missing.body.error.code, 'RULE_NOT_FOUND');

  const list = await v3('POST', '/rules/loan_approval', staff, { data: [1, 2] });
  assert.equal(list.status, 400, why(list));
  assert.equal(list.body.error.code, 'BAD_DATA');

  fs.writeFileSync(path.join(web.definitionsPath, 'broken.dmn.xml'), '<definitions>not a decision</definitions>');
  const broken = await v3('POST', '/rules/broken', staff, { data: {} });
  assert.equal(broken.status, 422, why(broken));
  assert.equal(broken.body.error.code, 'RULE_FAILED');

  assert.equal((await new WebClient(web.base).request('POST', '/api/v3/rules/loan_approval', { json: { data: {} } })).status, 401, 'no credential');
});
