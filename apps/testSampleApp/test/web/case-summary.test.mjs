// @features: security-narrowing
// A case a security policy shows someone as a summary only (see: "summary"): its page is a summary, not a refusal.
// A manager approves a leave, so the task is no longer offered to them, and the policy shows them the case as a line:
// the case page shows its name, status and the tasks they completed in it, none of its data.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { startWebApp, why, WebClient, API_KEY } from '../support/webApp.mjs';

const POLICY = `<?xml version="1.0" encoding="UTF-8"?>
<definitions xmlns="https://www.omg.org/spec/DMN/20191111/MODEL/" id="d" name="default" namespace="t">
  <decision id="default" name="Leave cases"><decisionTable id="t" hitPolicy="COLLECT">
    <input id="i1" label="initiator"><inputExpression id="e1" typeRef="string"><text>actors.initiator</text></inputExpression></input>
    <input id="i2" label="groups"><inputExpression id="e2" typeRef="string"><text>user.userGroups</text></inputExpression></input>
    <output id="o1" name="see" typeRef="string" /><output id="o2" name="data" typeRef="string" />
    <rule id="r1"><description>whoever asked: their case</description>
      <inputEntry id="a1"><text>user.userName</text></inputEntry><inputEntry id="a2"><text>-</text></inputEntry>
      <outputEntry id="a3"><text>"full"</text></outputEntry><outputEntry id="a4"><text>"all"</text></outputEntry></rule>
    <rule id="r2"><description>managers: a line only</description>
      <inputEntry id="b1"><text>-</text></inputEntry><inputEntry id="b2"><text>"manager"</text></inputEntry>
      <outputEntry id="b3"><text>"summary"</text></outputEntry><outputEntry id="b4"><text></text></outputEntry></rule>
  </decisionTable></decision>
</definitions>`;

let web;
const v3 = (method, url, token, body) => new WebClient(web.base).request(method, '/api/v3' + url, {
  json: body, headers: token === 'service' ? { 'x-api-key': API_KEY } : { authorization: `Bearer ${token}` },
});
async function tokenFor(userName, groups) {
  const res = await v3('POST', '/tokens', 'service', { userName, groups });
  assert.equal(res.status, 201, why(res));
  return res.body.token;
}

test.before(async () => {
  web = await startWebApp();
  fs.mkdirSync(path.join(web.definitionsPath, 'security'), { recursive: true });
  fs.writeFileSync(path.join(web.definitionsPath, 'security', 'default.dmn.xml'), POLICY);
});
test.after(async () => { await web?.stop(); setImmediate(() => process.exit(0)); });

test('a case seen as a summary: its page shows it as a line and the tasks you completed, not a refusal', async () => {
  const sam = await tokenFor('sam', ['staff']);
  const started = await v3('POST', '/processes/leave-request/start', sam, { data: { secret: 'sam-only' } });
  assert.equal(started.status, 201, why(started));
  assert.equal((await v3('POST', `/tasks/${started.body.task.id}/complete`, sam, { data: { days: 10, reason: 'holiday' } })).status, 200);
  const id = started.body.instance.id;

  // the manager approves it, as the page's manager
  const mona = await tokenFor('manager', ['manager', 'staff']);
  const approve = (await v3('GET', '/tasks', mona)).body.items.find(t => t.instanceId === id && t.elementId === 'Approve');
  assert.ok(approve, 'the Approve task is offered to the manager');
  const done = await v3('POST', `/tasks/${approve.id}/complete`, mona, { data: { approved: true } });
  assert.equal(done.status, 200, why(done));

  const manager = await web.login('manager');
  const page = await manager.get(`/instanceDetails?id=${id}`);
  assert.equal(page.status, 200, why(page));
  assert.match(page.text, /You see this case as a summary/);
  assert.match(page.text, /<h4>Your tasks in it<\/h4><ul><li>Approve request/);
  assert.doesNotMatch(page.text, /sam-only|holiday/, 'none of its data');
  assert.doesNotMatch(page.text, /not yours to open/);

  // whoever the policy does not show it to at all: refused, as before
  const designer = await web.login('designer');
  assert.equal((await designer.get(`/instanceDetails?id=${id}`)).status, 403);
});
