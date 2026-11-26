// The HR application's link to OWF (server/owf.js): what it passes on, and the token it asks for each person.
import test from 'node:test';
import assert from 'node:assert/strict';
import { OwfLink, mayAsk, owfProxy, owfOpenTask, owfOpenStart } from './owf.js';

/** A fake OWF: tokens are asked for with the key; every other call must carry the token. */
function fakeOwf({ revoked = [], startAt = 0 } = {}) {
  const calls = [];
  let issued = startAt;
  const fetcher = async (url, init) => {
    calls.push({ url, init });
    const path = new URL(url).pathname;
    if (path === '/api/v3/tokens') {
      assert.equal(init.headers['x-api-key'], 'the-key');
      const { userName, groups } = JSON.parse(init.body);
      issued++;
      return new Response(JSON.stringify({ token: `t${issued}-${userName}`, expiresAt: new Date(Date.now() + 30 * 60_000).toISOString(), userName, groups }), { status: 201 });
    }
    const token = init.headers.authorization?.replace('Bearer ', '');
    if (!token || revoked.includes(token)) return new Response('{"error":{"code":"UNAUTHORIZED"}}', { status: 401 });
    return new Response(JSON.stringify({ items: [{ id: 'x', for: token }] }), { status: 200, headers: { 'content-type': 'application/json' } });
  };
  return { calls, fetcher };
}
const ann = { userName: 'ann', userGroups: ['Employee', 'ADMIN', 'DESIGNER', 'SYSTEM', 'Employee'] };

test('what may be asked of OWF through this site: tasks, processes to start, cases, who I am; nothing of design or administration', () => {
  for (const [method, path] of [['GET', '/me'], ['GET', '/tasks'], ['GET', '/tasks/7'], ['POST', '/tasks/7/complete'], ['POST', '/tasks/7/claim'],
    ['POST', '/tasks/7/choices/Dept'], ['GET', '/processes/startable'], ['POST', '/processes/Leave%20Application/start'], ['GET', '/instances'], ['GET', '/instances/9/rationale']])
    assert.equal(mayAsk(method, path), true, `${method} ${path}`);
  for (const [method, path] of [['POST', '/tokens'], ['DELETE', '/tokens'], ['GET', '/users'], ['POST', '/users'], ['GET', '/settings'], ['GET', '/models'], ['POST', '/models/x/verify'],
    ['DELETE', '/tasks/7'], ['POST', '/messages/x'], ['POST', '/signals/x'], ['GET', '/tasks/7/../users'], ['POST', '/instances/9/restart']])
    assert.equal(mayAsk(method, path), false, `${method} ${path}`);
});

test('a token for the person, with the groups the application gives them: never OWF\'s own (ADMIN, DESIGNER, SYSTEM); asked for once', async () => {
  const owf = fakeOwf();
  const link = new OwfLink({ url: 'http://owf/', key: 'the-key', fetch: owf.fetcher });
  await link.call(ann, 'GET', '/tasks');
  await link.call(ann, 'GET', '/tasks?status=completed');
  const asked = owf.calls.filter(c => c.url.endsWith('/api/v3/tokens'));
  assert.equal(asked.length, 1, 'kept until it runs out');
  assert.deepEqual(JSON.parse(asked[0].init.body), { userName: 'ann', groups: ['Employee'], minutes: 30 });
  assert.equal(owf.calls[1].url, 'http://owf/api/v3/tasks', 'the trailing slash of OWF_URL does not double');
  assert.equal(owf.calls[1].init.headers.authorization, 'Bearer t1-ann');
});

test('each person has their own token; the service key never goes with a call as a person', async () => {
  const owf = fakeOwf();
  const link = new OwfLink({ url: 'http://owf', key: 'the-key', fetch: owf.fetcher });
  await link.call(ann, 'GET', '/tasks');
  await link.call({ userName: 'bob', userGroups: [] }, 'GET', '/tasks');
  assert.deepEqual(owf.calls.filter(c => !c.url.endsWith('/tokens')).map(c => c.init.headers.authorization), ['Bearer t1-ann', 'Bearer t2-bob']);
  assert.ok(owf.calls.filter(c => !c.url.endsWith('/tokens')).every(c => !c.init.headers['x-api-key']));
});

test('a token OWF no longer knows is asked for again, once', async () => {
  const owf = fakeOwf({ revoked: ['t1-ann'], startAt: 1 });
  const link = new OwfLink({ url: 'http://owf', key: 'the-key', fetch: owf.fetcher });
  link.tokens.set('ann|Employee', { token: 't1-ann', expires: Date.now() + 600_000 });     // as if issued before, and since revoked
  const answer = await link.call(ann, 'GET', '/tasks');
  assert.equal(answer.status, 200);
  assert.equal(owf.calls.at(-1).init.headers.authorization, 'Bearer t2-ann', 'with the new one');
  assert.equal(owf.calls.filter(c => c.url.endsWith('/tokens')).length, 1, 'one new token');
});

/** A response as the middleware writes it, without a server. */
function run(handler, req) {
  return new Promise(resolve => {
    const res = { code: 200, headers: {}, status(c) { this.code = c; return this; }, type(t) { this.headers.type = t; return this; },
      json(b) { resolve({ status: this.code, body: b }); }, send(b) { resolve({ status: this.code, body: b, type: this.headers.type }); } };
    handler({ get: () => undefined, protocol: 'http', ...req }, res);
  });
}

test('the middleware: not connected, not signed in, not passed on, from another site, and a call that goes through', async () => {
  const owf = fakeOwf();
  const connected = owfProxy(new OwfLink({ url: 'http://owf', key: 'the-key', fetch: owf.fetcher }));
  assert.equal((await run(owfProxy(new OwfLink({ url: '', key: '' })), { method: 'GET', path: '/tasks', url: '/tasks', user: ann })).status, 404, 'no OWF');
  assert.equal((await run(connected, { method: 'GET', path: '/tasks', url: '/tasks' })).status, 401, 'nobody signed in');
  assert.equal((await run(connected, { method: 'GET', path: '/users', url: '/users', user: ann })).status, 403, 'not passed on');
  const other = await run(connected, { method: 'POST', path: '/tasks/7/complete', url: '/tasks/7/complete', user: ann, body: {}, get: h => h === 'sec-fetch-site' ? 'cross-site' : undefined });
  assert.equal(other.status, 403);
  assert.equal(other.body.error.code, 'CROSS_SITE');
  const ok = await run(connected, { method: 'GET', path: '/tasks', url: '/tasks?limit=50', user: ann });
  assert.equal(ok.status, 200);
  assert.match(String(ok.body), /t1-ann/);
  assert.equal(owf.calls.at(-1).url, 'http://owf/api/v3/tasks?limit=50', 'the query goes with it');
});

// ---- opening a task in OWF's own form: a handoff

test('a handoff is asked for with the service key, for the person and the task, and where to come back to', async () => {
  const calls = [];
  const link = new OwfLink({ url: 'http://owf', key: 'the-key', fetch: async (url, init) => {
    calls.push({ url, init });
    return new Response(JSON.stringify({ url: 'http://owf/embed/task/7?handoff=bph_x' }), { status: 201 });
  } });
  const url = await link.handoff(ann, { type: 'task', id: '7' }, 'http://hr/hr/employees');
  assert.equal(url, 'http://owf/embed/task/7?handoff=bph_x');
  assert.equal(calls[0].url, 'http://owf/api/v3/handoffs');
  assert.equal(calls[0].init.headers['x-api-key'], 'the-key');
  assert.deepEqual(JSON.parse(calls[0].init.body), { userName: 'ann', groups: ['Employee'], page: { type: 'task', id: '7' }, returnTo: 'http://hr/hr/employees' });
});

/** The middleware's answer, with a redirect too. */
function open(handler, req) {
  return new Promise(resolve => {
    const res = { code: 200, status(c) { this.code = c; return this; }, json(b) { resolve({ status: this.code, body: b }); }, redirect(to) { resolve({ status: 302, to }); } };
    handler({ get: name => ({ host: 'hr.example:3200' })[name], protocol: 'http', query: {}, params: { id: '7' }, ...req }, res);
  });
}

test('opening a task in OWF: not connected, not signed in, a return address that is not a page of this site, and a link', async () => {
  const sent = [];
  const link = new OwfLink({ url: 'http://owf', key: 'the-key', fetch: async (url, init) => {
    sent.push(JSON.parse(init.body));
    return new Response(JSON.stringify({ url: 'http://owf/embed/task/7?handoff=bph_x' }), { status: 201 });
  } });
  const handler = owfOpenTask(link);
  assert.equal((await open(owfOpenTask(new OwfLink({ url: '', key: '' })), { user: ann })).status, 404);
  assert.equal((await open(handler, {})).status, 401, 'nobody signed in');
  for (const returnTo of ['http://evil.example/', '//evil.example/x', 'hr/employees', '/hr/a b', '/hr' + String.fromCharCode(92) + 'x'])
    assert.equal((await open(handler, { user: ann, query: { returnTo } })).status, 400, returnTo);
  const ok = await open(handler, { user: ann, query: { returnTo: '/hr/assignments?x=1' } });
  assert.equal(ok.status, 302);
  assert.equal(ok.to, 'http://owf/embed/task/7?handoff=bph_x');
  assert.equal(sent.at(-1).returnTo, 'http://hr.example:3200/hr/assignments?x=1', 'back to this site, as the browser reached it');
  assert.equal((await open(handler, { user: ann })).status, 302, 'no returnTo: the home page');
  assert.equal(sent.at(-1).returnTo, 'http://hr.example:3200/hr/');
});

test('opening a start form in OWF: the process and, when it says, its start event, for the person signed in', async () => {
  const sent = [];
  const link = new OwfLink({ url: 'http://owf', key: 'the-key', fetch: async (url, init) => {
    sent.push(JSON.parse(init.body));
    return new Response(JSON.stringify({ url: 'http://owf/embed/start/Leave?handoff=bph_x' }), { status: 201 });
  } });
  const handler = owfOpenStart(link);
  assert.equal((await open(handler, {})).status, 401, 'nobody signed in');
  assert.equal((await open(handler, { user: ann, params: { process: 'Leave' }, query: { returnTo: 'http://evil.example/' } })).status, 400);
  const first = await open(handler, { user: ann, params: { process: 'Leave' }, query: { returnTo: '/hr/start' } });
  assert.deepEqual([first.status, first.to], [302, 'http://owf/embed/start/Leave?handoff=bph_x']);
  assert.deepEqual(sent.at(-1).page, { type: 'start', process: 'Leave' });
  assert.equal(sent.at(-1).returnTo, 'http://hr.example:3200/hr/start');
  await open(handler, { user: ann, params: { process: 'Leave' }, query: { startNodeId: 'Begin', returnTo: '/hr/start' } });
  assert.deepEqual(sent.at(-1).page, { type: 'start', process: 'Leave', startNodeId: 'Begin' });
});
