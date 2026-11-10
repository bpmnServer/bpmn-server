// @features: setup-env
// A server's first start with no users: no admin/admin to guess. Its pages ask for the administrator, with the token the
// server printed; then they go back to signing in. The APIs and the health check work meanwhile.
import test from 'node:test';
import assert from 'node:assert/strict';
import { startWebApp, why } from '../support/webApp.mjs';

const firstRun = await import(new URL('../../../../packages/bpmn-web/dist/userAccess/firstRun.js', import.meta.url).href);

let web, token;
test.before(async () => {
  web = await startWebApp({ users: false });
  token = firstRun.beginFirstRun();
});
test.after(async () => { await web?.stop(); setImmediate(() => process.exit(0)); });

const form = (extra = {}) => ({ token, userName: 'owner', email: 'owner@example.com', password: 'a-good-password', confirmPassword: 'a-good-password', ...extra });

test('every page leads to the setup; the APIs and the health check do not wait for it', async () => {
  const browser = web.client();
  for (const page of ['/', '/login', '/dashboard/mywork', '/model/list']) {
    const res = await browser.get(page);
    assert.equal(res.status, 302, page);
    assert.match(res.location, /\/setup$/, page);
  }
  const setup = await browser.get('/setup?token=' + token);
  assert.equal(setup.status, 200, why(setup));
  assert.match(setup.text, /Set up this server/);
  assert.equal((await web.client().get('/healthz')).status, 200);
  assert.notEqual((await web.api('GET', '/api/datastore/findInstances?query={}')).status, 302, 'the API answers as it would');
});

test('without the token, a weak password or a mismatch, nothing is made', async () => {
  const browser = web.client();
  await browser.get('/setup');
  let res = await browser.post('/setup', form({ token: 'guessed' }));
  assert.equal(res.status, 403);
  res = await browser.post('/setup', form({ password: 'short', confirmPassword: 'short' }));
  assert.equal(res.status, 400);
  assert.match(res.text, /at least 8 characters/);
  res = await browser.post('/setup', form({ confirmPassword: 'something-else' }));
  assert.equal(res.status, 400);
  for (const userName of ['a', 'the owner', '<b>x</b>', 'x'.repeat(65)]) {
    res = await browser.post('/setup', form({ userName }));
    assert.equal(res.status, 400, userName);
    assert.match(res.text, /A user name is 2 to 64 letters, digits or \. _ @ -/, userName);
  }
  assert.equal(firstRun.firstRunPending(), true, 'still waiting');
});

test('the administrator and the sample users are made, the one who set it up is signed in, and setup is over', async () => {
  const browser = web.client();
  await browser.get('/setup');
  const res = await browser.post('/setup', form({ sampleUsers: 'true', samplePassword: 'sample-pass' }));
  assert.equal(res.status, 302, why(res));
  assert.equal(firstRun.firstRunPending(), false);
  const home = await browser.get('/dashboard/admin');
  assert.equal(home.status, 200, 'signed in, as an administrator');

  const { default: User } = await import(new URL('../../../../packages/bpmn-web/dist/userAccess/models/User.js', import.meta.url).href);
  const users = await User.find({}, { userName: 1, userGroups: 1 }).lean();
  assert.deepEqual(users.map(u => [u.userName, u.userGroups.join()]).sort(), [['manager1', 'Employee,Manager'], ['owner', 'ADMIN'], ['user1', 'Employee']]);

  const after = await web.client().get('/setup');
  assert.equal(after.status, 302);
  assert.match(after.location, /\/login$/);
  const late = web.client();
  await late.get('/login');
  assert.equal((await late.post('/setup', form())).status, 404, 'no second administrator through it');
});
