// @features: users
// Adding users from Administration (and UserService.addUser, which every way of adding one ends in): one rule for a user
// name everywhere (2 to 64 letters, digits or . _ @ -), no second user whose name differs only in case, an email that
// is one, a password of 4 or more. What is refused makes no user.
import test from 'node:test';
import assert from 'node:assert/strict';
import { startWebApp, why } from '../support/webApp.mjs';

const dist = file => new URL(`../../../packages/bpmn-web/dist/userAccess/${file}`, import.meta.url).href;
let web, admin, User, UserService, seq = 0;

test.before(async () => {
  web = await startWebApp();
  admin = await web.login('admin');
  await admin.get('/dashboard/admin');
  ({ default: User } = await import(dist('models/User.js')));
  ({ UserService } = await import(dist('UserService.js')));
});
test.after(async () => { await web?.stop(); setImmediate(() => process.exit(0)); });

/** Administration → Add user; its answer is a redirect with a message. */
async function add(fields) {
  const res = await admin.post('/dashboard/admin/users', { email: `new-${++seq}@example.com`, password: 'pw-12345', ...fields });
  assert.equal(res.status, 302, why(res));
  return decodeURIComponent(res.location);
}
const named = userName => User.findOne({ userName }).lean();

test('a name of letters, digits and . _ @ -, 2 to 64 of them, is added', async () => {
  for (const userName of ['ab', 'ann.lee', 'ann_lee', 'ann-lee', 'ann@example.com', 'A1', 'x'.repeat(64)]) {
    assert.match(await add({ userName }), /User '.*' added/, userName);
    assert.ok(await named(userName), userName);
  }
});

test('any other name is refused, and makes no user', async () => {
  const before = await User.countDocuments();
  for (const userName of ['a', 'ann lee', 'ann,lee', "o'brien", 'ann"', '<b>x</b>', 'ann/lee', 'ann\\lee', 'x'.repeat(65), 'ann\nlee', 'ann\tlee', 'é-accent', 'ann;drop']) {
    const message = await add({ userName });
    assert.match(message, /A user name is 2 to 64 letters, digits or \. _ @ -/, JSON.stringify(userName));
  }
  assert.equal(await User.countDocuments(), before);
});

test('an empty name, email or password is refused', async () => {
  const before = await User.countDocuments();
  for (const fields of [{ userName: '' }, { userName: '   ' }, { userName: 'no-email', email: '' }, { userName: 'no-password', password: '' }])
    assert.match(await add(fields), /needs a user name, an email and a password/, JSON.stringify(fields));
  assert.equal(await User.countDocuments(), before);
});

test('the name is taken as typed, without the spaces around it', async () => {
  assert.match(await add({ userName: '  spaced  ' }), /User 'spaced' added/);
  assert.ok(await named('spaced'));
  assert.equal(await named('  spaced  '), null);
});

test('a name differing only in case is the same user: refused', async () => {
  assert.match(await add({ userName: 'Casey' }), /added/);
  for (const userName of ['casey', 'CASEY', 'cAsEy', 'Admin'])
    assert.match(await add({ userName }), /already exists/, userName);
  assert.equal(await User.countDocuments({ userName: { $in: ['casey', 'CASEY', 'cAsEy', 'Admin'] } }), 0);
});

test('an email that is not one, an email in use, a password under 4 characters: refused', async () => {
  const before = await User.countDocuments();
  assert.match(await add({ userName: 'bad-email', email: 'not-an-email' }), /is not an email address/);
  assert.match(await add({ userName: 'used-email', email: 'admin@test.local' }), /already exists/);
  assert.match(await add({ userName: 'short-pw', password: 'abc' }), /at least 4 characters/);
  assert.equal(await User.countDocuments(), before);
});

test('the groups are a comma list, trimmed, empty ones left out', async () => {
  assert.match(await add({ userName: 'grouped', userGroups: ' Employee , Manager ,, ' }), /added/);
  assert.deepEqual([...(await named('grouped')).userGroups], ['Employee', 'Manager']);
});

/** Signs in on the sign-in form; the client, and where the sign-in sent it. */
async function signIn(userName, password) {
  const client = web.client();
  await client.get('/login');
  const res = await client.post('/login', { userName, password });
  assert.equal(res.status, 302, why(res));
  return { client, to: res.location };
}

test('the added user signs in with the password given, and the pages are theirs', async () => {
  await add({ userName: 'signs-in', password: 'its-own-pw', userGroups: 'Employee' });
  const { client, to } = await signIn('signs-in', 'its-own-pw');
  assert.doesNotMatch(to, /\/login$/, 'signed in');
  const page = await client.get('/dashboard');
  assert.equal(page.status, 200, why(page));
  assert.match(page.text, /signs-in/, 'My work is the new user\'s');
  assert.equal((await client.get('/dashboard/admin')).status, 403, 'an Employee, not an administrator');
});

test('a wrong or empty password, or a name nobody has, signs nobody in', async () => {
  await add({ userName: 'careful', password: 'right-pw' });
  for (const [userName, password] of [['careful', 'wrong-pw'], ['careful', ''], ['nobody-here', 'right-pw']]) {
    const { client, to } = await signIn(userName, password);
    assert.match(to, /\/login$/, `${userName} / ${password}`);
    const page = await client.get('/dashboard');
    assert.equal(page.status, 302, 'still signed out');
  }
});

test('UserService.addUser: a bad name throws; the same name in another case is the user there already', async () => {
  const users = new UserService();
  await assert.rejects(() => users.addUser('bad name', 'bad@example.com', 'pw-12345', []), /A user name is 2 to 64/);
  const existing = await users.addUser('CASEY', 'other-casey@example.com', 'pw-12345', []);
  assert.equal(existing.userName, 'Casey', 'the user there already, not a second one');
  assert.equal(await User.countDocuments({ email: 'other-casey@example.com' }), 0);
});
