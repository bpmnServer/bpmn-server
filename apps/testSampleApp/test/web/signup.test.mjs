// @features: users
// SIGNUP_VERIFY_EMAIL, SIGNUP_GROUPS: signing up sends a verification email; once verified, the account has its groups.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { startWebApp, why, FIXTURES, PASSWORD } from '../support/webApp.mjs';

const SETTINGS = { SIGNUP_VERIFY_EMAIL: 'true', SIGNUP_GROUPS: 'DESIGNER', SITE_URL: 'https://site.example' };
let web, User;

const source = fs.readFileSync(path.join(FIXTURES, 'leave-request.bpmn'), 'utf8');
const SVG = '<svg xmlns="http://www.w3.org/2000/svg"/>';
const save = (client, name) => client.request('POST', `/model/edit/${name}`, { json: { processId: name, bpmn: source, svg: SVG } });
const account = name => User.findOne({ userName: name });

/** Signed up from a page of the editor: not yet verified. */
async function signedUp(name) {
  const client = web.client();
  const url = `/signup?next=${encodeURIComponent('/model/add/mine')}`;
  await client.get(url);
  const res = await client.post(url, { userName: name, email: `${name}@gmail.com`, password: PASSWORD, confirmPassword: PASSWORD });
  assert.equal(res.status, 302, why(res));
  assert.match(res.headers.get('location'), /\/account$/);
  return client;
}

test.before(async () => {
  web = await startWebApp({ env: SETTINGS });
  ({ default: User } = await import(new URL('../../../../packages/bpmn-web/dist/userAccess/models/User.js', import.meta.url).href));
});
test.after(async () => {
  for (const key of Object.keys(SETTINGS)) delete process.env[key];
  await web?.stop();
  setImmediate(() => process.exit(0));
});

test('a visitor who has not signed in is sent to sign in, and is made no account', async () => {
  const before = await User.countDocuments();
  const res = await web.client().get('/dashboard');
  assert.equal(res.status, 302, why(res));
  assert.match(res.headers.get('location'), /\/login$/);
  assert.equal(await User.countDocuments(), before);
});

test('signing up: no design until the email is verified; the token gives it, and goes back to the model', async () => {
  const client = await signedUp('verifying');
  const before = await account('verifying');
  assert.deepEqual([...before.userGroups], []);
  assert.ok(!before.emailVerified);
  assert.match(before.emailVerificationToken, /^[0-9a-f]{32}$/);
  assert.notEqual((await save(client, 'too-soon')).status, 200, 'not verified: no saving');

  const wrong = await client.get('/account/verify/' + 'ab'.repeat(16));
  assert.match(wrong.headers.get('location'), /\/account$/);
  assert.ok(!(await account('verifying')).emailVerified);

  const right = await client.get('/account/verify/' + before.emailVerificationToken);
  assert.equal(right.headers.get('location'), '/model/add/mine');
  const after = await account('verifying');
  assert.equal(after.emailVerified, true);
  assert.deepEqual([...after.userGroups], ['DESIGNER']);

  const saved = await save(client, 'my-model');
  assert.equal(saved.status, 200, why(saved));
  assert.ok(fs.existsSync(path.join(web.definitionsPath, 'my-model.bpmn')));
  const run = await client.request('POST', '/model/test/start', { json: { processName: 'my-model', data: {} } });
  assert.equal(run.status, 200, why(run));
});

test('a user name or email already taken is refused, and no account is made', async () => {
  await signedUp('taken');
  const client = web.client();
  await client.get('/signup');
  for (const body of [{ userName: 'taken', email: 'someone-else@gmail.com' }, { userName: 'someone-else', email: 'taken@gmail.com' }]) {
    const res = await client.post('/signup', { ...body, password: PASSWORD, confirmPassword: PASSWORD });
    assert.match(res.headers.get('location'), /\/signup$/, why(res));
  }
  assert.equal(await User.countDocuments({ userName: 'someone-else' }), 0);
  assert.equal(await User.countDocuments({ email: 'someone-else@gmail.com' }), 0);
});

test('a user who signed up signs in again with the password chosen; a wrong one does not', async () => {
  await signedUp('comes-back');
  const signIn = async password => {
    const client = web.client();
    await client.get('/login');
    const res = await client.post('/login', { userName: 'comes-back', password });
    assert.equal(res.status, 302, why(res));
    return { client, to: res.headers.get('location') };
  };
  const wrong = await signIn('not-the-password');
  assert.match(wrong.to, /\/login$/, 'a wrong password: back to sign in');
  const { client, to } = await signIn(PASSWORD);
  assert.doesNotMatch(to, /\/login$/, 'signed in');
  const page = await client.get('/account');
  assert.equal(page.status, 200, why(page));
  assert.match(page.text, /comes-back/, 'the account page is theirs');
});

test('a user name against the rule, or taken in another case, is refused, and no account is made', async () => {
  await signedUp('Taken-Case');
  const client = web.client();
  await client.get('/signup');
  for (const userName of ['', 'a', 'ann lee', '<b>x</b>', 'x'.repeat(65), 'taken-case', 'TAKEN-CASE']) {
    const email = `name-${userName.length}-${userName.charCodeAt(0) || 0}@gmail.com`;
    const res = await client.post('/signup', { userName, email, password: PASSWORD, confirmPassword: PASSWORD });
    assert.match(res.headers.get('location'), /\/signup$/, `${JSON.stringify(userName)}: ${why(res)}`);
    assert.equal(await User.countDocuments({ email }), 0, JSON.stringify(userName));
  }
});

test('a disposable address is refused', async () => {
  const client = web.client();
  await client.get('/signup');
  const res = await client.post('/signup', { userName: 'throwaway', email: 'x@mailinator.com', password: PASSWORD, confirmPassword: PASSWORD });
  assert.match(res.headers.get('location'), /\/signup$/, why(res));
  assert.equal(await User.countDocuments({ userName: 'throwaway' }), 0);
});
