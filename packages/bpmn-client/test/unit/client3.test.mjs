// @features: bpmn-client-v3
// BPMNClient3 (API v3) against a recording HTTP server: what each call sends, which credential, how a user's token is
// issued, kept and renewed, and how refusals come back. test/contract/client3.test.mjs checks it against bpmn-web.
import test from 'node:test';
import assert from 'node:assert/strict';
import http from 'node:http';
import { BPMNClient3, BPMNApiError } from '../../dist/index.js';

let server, base, requests = [], reply;
let issued = 0;
const tokenAnswer = (minutesLeft = 15) => ({ status: 201, body: { token: `t${++issued}`, expiresAt: new Date(Date.now() + minutesLeft * 60_000).toISOString() } });

test.before(async () => {
  server = http.createServer((req, res) => {
    let body = '';
    req.on('data', c => { body += c; });
    req.on('end', () => {
      const url = new URL(req.url, 'http://x');
      const recorded = { method: req.method, path: url.pathname, query: Object.fromEntries(url.searchParams),
        key: req.headers['x-api-key'], auth: req.headers.authorization, body: body ? JSON.parse(body) : undefined };
      requests.push(recorded);
      const { status = 200, body: answer = {}, type = 'application/json' } = reply(recorded);
      res.writeHead(status, { 'content-type': type });
      res.end(typeof answer === 'string' ? answer : JSON.stringify(answer));
    });
  });
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  base = `http://127.0.0.1:${server.address().port}`;
});
test.after(() => server.close());
test.beforeEach(() => {
  requests = []; issued = 0;
  reply = r => r.path.endsWith('/tokens') && r.method === 'POST' ? tokenAnswer() : { body: {} };
});

test('the service key: each area\'s calls, their paths, queries and bodies', async () => {
  const c = new BPMNClient3({ url: base + '/', apiKey: 'k' });
  await c.me();
  await c.processes.startable();
  await c.processes.start('leave request', { days: 3 }, { startNodeId: 'S' });
  await c.tasks.list({ status: 'completed', limit: 5 });
  await c.tasks.get('t/1');
  await c.tasks.claim('t1');
  await c.tasks.complete('t1', { ok: true });
  await c.instances.list({ name: 'x', cursor: 'c1' });
  await c.instances.get('i1');
  await c.instances.rationale('i1');
  await c.instances.startEvent('i1', 'E', { a: 1 });
  await c.instances.restart('i1', 'item1', { b: 2 });
  await c.instances.delete('i1');
  await c.models.save('m', '<xml/>', { force: true });
  await c.models.rename('m', 'n');
  await c.models.verify('m');
  await c.models.element('m', 'E1');
  await c.models.saveFeature('m', 'Feature: x', { base: 'old' });
  await c.models.test('m', { raw: true });
  await c.rules.evaluate('Vacation Days', { age: 40 });
  await c.messages.throw('msg', { a: 1 }, { caseId: 7 });
  await c.signals.throw('sig');
  await c.admin.setGroups('sam', ['staff']);
  await c.admin.check('database');
  await c.tokens.revoke('sam');
  assert.ok(requests.every(r => r.key === 'k' && !r.auth), 'every call carries the service key');
  assert.deepEqual(requests.map(r => `${r.method} ${r.path}`), [
    'GET /api/v3/me', 'GET /api/v3/processes/startable', 'POST /api/v3/processes/leave%20request/start',
    'GET /api/v3/tasks', 'GET /api/v3/tasks/t%2F1', 'POST /api/v3/tasks/t1/claim', 'POST /api/v3/tasks/t1/complete',
    'GET /api/v3/instances', 'GET /api/v3/instances/i1', 'GET /api/v3/instances/i1/rationale',
    'POST /api/v3/instances/i1/events/E', 'POST /api/v3/instances/i1/restart', 'DELETE /api/v3/instances/i1',
    'PUT /api/v3/models/m', 'POST /api/v3/models/m/rename', 'POST /api/v3/models/m/verify', 'GET /api/v3/models/m/elements/E1',
    'PUT /api/v3/models/m/feature', 'POST /api/v3/models/m/test', 'POST /api/v3/rules/Vacation%20Days',
    'POST /api/v3/messages/msg', 'POST /api/v3/signals/sig', 'PUT /api/v3/users/sam/groups',
    'POST /api/v3/settings/checks/database', 'DELETE /api/v3/tokens',
  ]);
  const at = path => requests.find(r => r.path === '/api/v3' + path);
  assert.deepEqual(at('/processes/leave%20request/start').body, { data: { days: 3 }, startNodeId: 'S' });
  assert.deepEqual(at('/tasks').query, { status: 'completed', limit: '5' });
  assert.deepEqual(at('/tasks/t1/complete').body, { data: { ok: true } });
  assert.deepEqual(at('/instances').query, { name: 'x', cursor: 'c1' });
  assert.deepEqual(at('/instances/i1/restart').body, { itemId: 'item1', data: { b: 2 } });
  assert.deepEqual(at('/models/m').query, { force: 'true' });
  assert.deepEqual(at('/models/m/feature').body, { text: 'Feature: x', base: 'old' });
  assert.deepEqual(at('/models/m/test').query, { raw: 'true' });
  assert.deepEqual(at('/rules/Vacation%20Days').body, { data: { age: 40 } });
  assert.deepEqual(at('/messages/msg').body, { data: { a: 1 }, matchingKey: { caseId: 7 } });
  assert.deepEqual(at('/tokens').query, { userName: 'sam' });
});

test('a token given, or a function giving one: calls act as that user', async () => {
  await new BPMNClient3({ url: base + '/api/v3', token: 'abc' }).me();
  await new BPMNClient3({ url: base, token: async () => 'fresh' }).me();
  assert.deepEqual(requests.map(r => [r.path, r.auth, r.key]),
    [['/api/v3/me', 'Bearer abc', undefined], ['/api/v3/me', 'Bearer fresh', undefined]]);
});

test('as(): the user\'s token is issued with the service key once, and used on every call', async () => {
  const service = new BPMNClient3({ url: base, apiKey: 'k' });
  const sam = service.as('sam', ['staff'], { minutes: 30 });
  assert.equal(service.as('sam', ['staff'], { minutes: 30 }), sam, 'the same user and groups: the same client');
  await sam.tasks.list();
  await sam.tasks.list();
  assert.deepEqual(requests.map(r => `${r.method} ${r.path} ${r.key ?? r.auth}`),
    ['POST /api/v3/tokens k', 'GET /api/v3/tasks Bearer t1', 'GET /api/v3/tasks Bearer t1']);
  assert.deepEqual(requests[0].body, { userName: 'sam', groups: ['staff'], minutes: 30 });
});

test('as(): a token about to expire is renewed before the call', async () => {
  reply = r => r.path.endsWith('/tokens') ? tokenAnswer(0.5) : { body: {} };
  const sam = new BPMNClient3({ url: base, apiKey: 'k' }).as('sam');
  await sam.me();
  await sam.me();
  assert.deepEqual(requests.map(r => r.auth ?? 'issue'), ['issue', 'Bearer t1', 'issue', 'Bearer t2']);
});

test('as(): a token the server no longer knows is issued again, once; then the refusal is thrown', async () => {
  reply = r => r.path.endsWith('/tokens') ? tokenAnswer()
    : r.auth === 'Bearer t1' ? { status: 401, body: { error: { code: 'TOKEN_INVALID', message: 'revoked' } } } : { body: { userName: 'sam' } };
  const sam = new BPMNClient3({ url: base, apiKey: 'k' }).as('sam');
  assert.deepEqual(await sam.me(), { userName: 'sam' });
  assert.deepEqual(requests.map(r => r.auth ?? 'issue'), ['issue', 'Bearer t1', 'issue', 'Bearer t2']);

  requests = [];
  reply = r => r.path.endsWith('/tokens') ? tokenAnswer() : { status: 401, body: { error: { code: 'TOKEN_INVALID', message: 'no' } } };
  const mia = new BPMNClient3({ url: base, apiKey: 'k' }).as('mia');
  await assert.rejects(mia.me(), e => e instanceof BPMNApiError && e.status === 401 && e.code === 'TOKEN_INVALID');
  assert.equal(requests.filter(r => r.path.endsWith('/me')).length, 2, 'renewed once, not in a loop');
});

test('signOut revokes the user\'s tokens, and the next call issues a new one', async () => {
  const service = new BPMNClient3({ url: base, apiKey: 'k' });
  await service.as('sam').me();
  await service.signOut('sam');
  await service.as('sam').me();
  assert.deepEqual(requests.map(r => `${r.method} ${r.path.replace('/api/v3', '')} ${r.auth ?? ''}`.trim()),
    ['POST /tokens', 'GET /me Bearer t1', 'DELETE /tokens', 'POST /tokens', 'GET /me Bearer t2']);
});

test('refusals are BPMNApiError with the status and code; a web page is not taken for an answer', async () => {
  const c = new BPMNClient3({ url: base, apiKey: 'k' });
  reply = () => ({ status: 404, body: { error: { code: 'TASK_NOT_FOUND', message: 'No such task', details: { id: 'x' } } } });
  await assert.rejects(c.tasks.get('x'), e => e instanceof BPMNApiError && e.status === 404 && e.code === 'TASK_NOT_FOUND'
    && e.details.id === 'x' && /No such task/.test(e.message));
  reply = () => ({ status: 200, type: 'text/html', body: '<!DOCTYPE html><html></html>' });
  await assert.rejects(c.me(), e => e.code === 'NOT_THE_API');
  reply = () => ({ status: 502, type: 'text/plain', body: 'Bad gateway' });
  await assert.rejects(c.me(), e => e.status === 502 && e.code === 'HTTP_502' && /Bad gateway/.test(e.message));
});

test('each() reads every page by its cursor', async () => {
  reply = r => ({ body: r.query.cursor === 'p2' ? { items: [3] } : { items: [1, 2], next: 'p2' } });
  const c = new BPMNClient3({ url: base, apiKey: 'k' });
  const all = [];
  for await (const task of c.tasks.each({ limit: 2 })) all.push(task);
  assert.deepEqual(all, [1, 2, 3]);
  assert.deepEqual(requests.map(r => r.query), [{ limit: '2' }, { limit: '2', cursor: 'p2' }]);
});

test('a credential is required, and as() needs the service key', () => {
  assert.throws(() => new BPMNClient3({ url: base }), /apiKey or a token/);
  assert.throws(() => new BPMNClient3({ url: base, token: 't' }).as('sam'), /service key/);
});
