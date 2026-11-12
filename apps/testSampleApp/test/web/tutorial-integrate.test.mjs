// @features: api-v3
// The tutorial "Integrate an existing application" (docs/docs/tutorial/tutorial-integrate.md), as it is written: its
// code, against a server. An application with its own users asks API v3 for a token for each, then starts the leave
// request, lists and completes tasks as them.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { startWebApp, API_KEY } from '../support/webApp.mjs';

// the tutorial's model: the sample application's (what bpmn-server init creates)
const MODEL = path.join(import.meta.dirname, '..', '..', '..', 'sampleApp', 'processes', 'Leave Application.bpmn');
let web;

test.before(async () => {
  web = await startWebApp({ env: { APP_ENV: 'production', API_TRACE: '' } });
  fs.copyFileSync(MODEL, path.join(web.definitionsPath, 'Leave Application.bpmn'));
  await web.bpmnServer.engine.install({ rebuild: true });
});
test.after(async () => { await web?.stop(); setImmediate(() => process.exit(0)); });

test('the tutorial\'s code: tokens for user1 and manager1; the request started, requested and approved as them', async () => {
  // ---- as in the tutorial (its BASE is http://localhost:3000/api/v3; its key, process.env.API_KEY)
  const BASE = `${web.base}/api/v3`;
  const key = API_KEY;
  async function call(path, { token, method = 'GET', body } = {}) {
    const response = await fetch(BASE + path, {
      method,
      headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : { 'x-api-key': key }) },
      body: body && JSON.stringify(body),
    });
    const answer = await response.json();
    if (!response.ok) throw new Error(`${response.status} ${answer.error.code}: ${answer.error.message}`);
    return answer;
  }
  const tokenFor = async (userName, groups) =>
    (await call('/tokens', { method: 'POST', body: { userName, groups, minutes: 15 } })).token;

  const user1 = await tokenFor('user1', ['Employee']);
  const { instance, task } = await call(`/processes/${encodeURIComponent('Leave Application')}/start`, { token: user1, method: 'POST' });
  // ---- what the tutorial says it gives
  assert.equal(instance.data.requester, 'user1', 'user1 is the requester');
  assert.equal(task.elementId, 'Request', 'their first task');

  // ---- as in the tutorial
  await call(`/tasks/${task.id}/complete`, {
    token: user1, method: 'POST',
    body: { data: { LeaveType: 'Vacation', StartDate: '2026-12-01', EndDate: '2026-12-05', RequestReason: 'Holidays' } },
  });

  const manager1 = await tokenFor('manager1', ['Employee', 'Manager']);
  const { items } = await call('/tasks', { token: manager1 });
  const approve = items.find(t => t.instanceId === instance.id && t.elementId === 'Approve');
  assert.ok(approve, 'manager1 sees Approve');

  // what the tutorial says of user1: the manager's task is not there for them
  await assert.rejects(call(`/tasks/${approve.id}/complete`, { token: user1, method: 'POST', body: { data: {} } }), /404 TASK_NOT_FOUND/);

  await call(`/tasks/${approve.id}/complete`, { token: manager1, method: 'POST', body: { data: { approval: 'A' } } });
  const { status } = await call(`/instances/${instance.id}`, { token: user1 });
  assert.equal(status, 'end');

  // the tutorial's "who is who": the service key alone is the service account (here not in Employee), never a user
  const started = await call(`/processes/${encodeURIComponent('Leave Application')}/start`, { method: 'POST' }).catch(error => error);
  if (started instanceof Error) assert.match(started.message, /404 NOT_STARTABLE/);
  else assert.equal(started.instance.data.requester, 'api-service');
});
