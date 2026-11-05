// @features: guests
// GUEST_SAVE=false, SIGNUP_VERIFY_EMAIL, SIGNUP_GROUPS (the public demo): a visitor runs the models and saves nothing; signing
// up sends a verification email; once verified, the account saves models of its own, in its own tenant.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { startWebApp, why, FIXTURES, PASSWORD } from '../support/webApp.mjs';

const GUESTS = fs.mkdtempSync(path.join(os.tmpdir(), 'bpmn-guests-'));
const DEMO = { GUEST_ACCESS: 'true', DEMO_MODE: 'true', DISABLE_ADMIN: 'true', GUESTS_PATH: GUESTS, GUEST_RATE_LIMIT: '1000',
  GUEST_SAVE: 'false', SIGNUP_VERIFY_EMAIL: 'true', SIGNUP_GROUPS: 'DESIGNER', SITE_URL: 'https://demo.example' };
let web, User;

const source = fs.readFileSync(path.join(FIXTURES, 'leave-request.bpmn'), 'utf8');
const SVG = '<svg xmlns="http://www.w3.org/2000/svg"/>';
const save = (client, name) => client.request('POST', `/model/edit/${name}`, { json: { processId: name, bpmn: source, svg: SVG } });
const account = name => User.findOne({ userName: name });

async function visitor() {
  const client = web.client();
  assert.equal((await client.follow('/dashboard')).status, 200);
  return client;
}
/** A visitor who signed up from the editor: not yet verified. */
async function signedUp(name) {
  const client = await visitor();
  const url = `/signup?next=${encodeURIComponent('/model/add/mine')}`;
  await client.get(url);
  const res = await client.post(url, { userName: name, email: `${name}@gmail.com`, password: PASSWORD, confirmPassword: PASSWORD });
  assert.equal(res.status, 302, why(res));
  assert.match(res.headers.get('location'), /\/account$/);
  return client;
}
async function verified(name) {
  const client = await signedUp(name);
  await client.get('/account/verify/' + (await account(name)).emailVerificationToken);
  return client;
}

test.before(async () => {
  web = await startWebApp({ env: DEMO });
  ({ default: User } = await import(new URL('../../../packages/bpmn-web/dist/userAccess/models/User.js', import.meta.url).href));
});
test.after(async () => {
  for (const key of Object.keys(DEMO)) delete process.env[key];
  await web?.stop();
  fs.rmSync(GUESTS, { recursive: true, force: true });
  setImmediate(() => process.exit(0));
});

test('a visitor saves nothing, whichever way it tries; the server says to sign up', async () => {
  const guest = await visitor();
  const refused = [
    await save(guest, 'mine'),
    await guest.request('POST', '/model/add/mine', { json: { processId: 'mine', bpmn: source, svg: SVG } }),
    await guest.post('/model/delete', { processName: 'leave-request' }),
    await guest.post('/model/rename', { process: 'leave-request', newName: 'x' }),
    await guest.request('PUT', '/model/lint-rules', { json: { rules: {} } }),
    await guest.request('PUT', '/model/scenarios/leave-request', { json: { scenarios: [] } }),
    await guest.request('DELETE', '/model/history/leave-request'),
  ];
  for (const res of refused) assert.equal(res.status, 403, why(res));
  assert.match(refused[0].text, /Sign up to save/);
  for (const folder of fs.readdirSync(GUESTS))
    assert.ok(!fs.existsSync(path.join(GUESTS, folder, 'mine.bpmn')));
});

test('a visitor runs the models as they are, opens a new model in the editor, and is offered sign-up', async () => {
  const guest = await visitor();
  const started = await guest.request('POST', '/model/test/start', { json: { processName: 'leave-request', data: {} } });
  assert.equal(started.status, 200, why(started));
  assert.match(JSON.parse(started.text).instance.id, /^test-/);
  const made = await guest.post('/model/new', { processName: 'mine' });
  assert.equal(made.status, 302, why(made));
  const editor = await guest.get('/model/add/mine');
  assert.equal(editor.status, 200, why(editor));
  assert.match(editor.text, /data-read-only="true"/);
  assert.match(editor.text, /id="js-signup"[^>]*href="\/signup\?next=%2Fmodel%2Fadd%2Fmine"/);
  assert.ok(!editor.text.includes('id="js-save"'));
  assert.match(editor.text, /id="js-download"/);
});

test('signing up: no design until the email is verified; the token gives it, and goes back to the model', async () => {
  const client = await signedUp('verifying');
  const before = await account('verifying');
  assert.deepEqual([...before.userGroups], []);
  assert.ok(!before.emailVerified);
  assert.match(before.emailVerificationToken, /^[0-9a-f]{32}$/);
  assert.match(before.tenantId, /^user-[0-9a-f]{12}$/);
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
  assert.ok(fs.existsSync(path.join(GUESTS, after.tenantId, 'my-model.bpmn')), 'in its own folder');
  const run = await client.request('POST', '/model/test/start', { json: { processName: 'my-model', data: {} } });
  assert.equal(run.status, 200, why(run));
  const id = JSON.parse(run.text).instance.id;

  const other = await verified('other-user');
  assert.equal((await other.get(`/model/test/instance/${id}`)).status, 404, 'another account has no sight of it');
  assert.ok(!fs.existsSync(path.join(GUESTS, (await account('other-user')).tenantId, 'my-model.bpmn')));
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

test('a disposable address is refused', async () => {
  const client = web.client();
  await client.get('/signup');
  const res = await client.post('/signup', { userName: 'throwaway', email: 'x@mailinator.com', password: PASSWORD, confirmPassword: PASSWORD });
  assert.match(res.headers.get('location'), /\/signup$/, why(res));
  assert.equal(await User.countDocuments({ userName: 'throwaway' }), 0);
});
