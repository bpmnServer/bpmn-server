// @features: bpmn-client-v3
// BPMNClient3 (API v3) against a real bpmn-web, as an application uses it: the service key issues each user's token
// (client.as), each user works as themselves. The process is bpmn-web's leave-request fixture:
//   Submit request (staff, form: days, reason) -> more than 5 days? -> Approve request (manager) | automatic approval
import test from 'node:test';
import assert from 'node:assert/strict';
import { BPMNClient3, BPMNApiError } from '../../dist/index.js';
import { startServer, skip } from './server.mjs';

const MODEL = 'leave-request';
let server, service;

test.before(async () => {
  if (skip) return;
  server = await startServer();
  service = new BPMNClient3({ url: `http://${server.host}:${server.port}`, apiKey: server.apiKey });
});
test.after(async () => { await server?.web.stop(); setImmediate(() => process.exit(0)); });

test('who each credential acts as', { skip }, async () => {
  const me = await service.me();
  assert.equal(me.credential, 'service');
  const sam = await service.as('sam', ['staff']).me();
  assert.deepEqual([sam.userName, sam.groups, sam.credential], ['sam', ['staff'], 'token']);
});

test('a leave request from start to approval, each step as its user', { skip }, async () => {
  const sam = service.as('sam', ['staff']);
  const mia = service.as('mia', ['manager']);

  const startable = await sam.processes.startable();
  assert.ok(startable.items.some(i => i.processName === MODEL));

  const { instance, task } = await sam.processes.start(MODEL, { requestedBy: 'sam' });
  assert.equal(task.elementId, 'Submit');
  const withForm = await sam.tasks.get(task.id);
  assert.deepEqual(withForm.form.fields.map(f => f.id), ['days', 'reason']);
  const done = await sam.tasks.complete(task.id, { days: 6, reason: 'holiday' });
  assert.equal(done.task.completedBy, 'sam');

  let approve;
  for await (const t of mia.tasks.each({ limit: 1 })) if (t.instanceId === instance.id) approve = t;
  assert.equal(approve?.elementId, 'Approve', 'the manager has the approval, found page by page');
  await assert.rejects(sam.tasks.get(approve.id), e => e instanceof BPMNApiError && e.status === 404 && e.code === 'TASK_NOT_FOUND');

  assert.equal((await mia.tasks.claim(approve.id)).task.assignee, 'mia');
  const approved = await mia.tasks.complete(approve.id, { approved: true });
  assert.equal(approved.task.completedBy, 'mia');

  const seen = await service.instances.get(instance.id);
  assert.equal(seen.id, instance.id);
  assert.ok((await service.instances.rationale(instance.id)).steps.length > 0);
});

test('signOut ends the user\'s tokens; the client asks for a new one on the next call', { skip }, async () => {
  const lee = service.as('lee', ['staff']);
  await lee.me();
  const { revoked } = await service.signOut('lee');
  assert.ok(revoked >= 1);
  assert.equal((await service.as('lee', ['staff']).me()).userName, 'lee');
});

test('a token revoked behind the client\'s back is issued again', { skip }, async () => {
  const kim = service.as('kim', ['staff']);
  await kim.me();
  await service.tokens.revoke('kim');
  assert.equal((await kim.me()).userName, 'kim');
});

test('a token given by the application, and the service key\'s refusals', { skip }, async () => {
  const { token } = await service.tokens.issue('ann', ['staff']);
  const ann = new BPMNClient3({ url: `http://${server.host}:${server.port}/api/v3`, token });
  assert.equal((await ann.me()).userName, 'ann');
  await assert.rejects(service.tokens.issue('eve', ['ADMIN']), e => e.status === 403 && e.code === 'GROUP_REFUSED');
  await assert.rejects(new BPMNClient3({ url: `http://${server.host}:${server.port}`, token: 'nope' }).me(),
    e => e.status === 401 && e.code === 'TOKEN_INVALID');
});

test('models, as the service account', { skip }, async () => {
  const list = await service.models.list();
  assert.ok(list.items.some(m => m.name === MODEL));
  const model = await service.models.get(MODEL);
  assert.match(model.source, /<bpmn:definitions|<definitions/);
  const element = await service.models.element(MODEL, 'Submit');
  assert.ok(element.form.fields.length > 0);
});
