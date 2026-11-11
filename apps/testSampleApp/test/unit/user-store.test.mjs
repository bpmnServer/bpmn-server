// @features: sqlite
// Users and sessions on the engine's document store (bpmn-web's userAccess/userStore.ts, models/User.ts): what the
// pages and APIs call on them, here on the in-memory store; the web tests run them on MongoDB and SQLite
// (npm run test:web, test:web:sqlite).
import test from 'node:test';
import assert from 'node:assert/strict';

import { MemoryDocumentStore } from '../../../../packages/bpmn-server/dist/index.js';
import { useUserStore, DocumentSessionStore } from '../../../../packages/bpmn-web/dist/userAccess/userStore.js';
import User from '../../../../packages/bpmn-web/dist/userAccess/models/User.js';

const store = new MemoryDocumentStore();
useUserStore(store, 'users-test');

const call = (fn, ...args) => new Promise((resolve, reject) => fn(...args, (err, value) => err ? reject(err) : resolve(value)));

test('a user is saved with its password hashed; comparePassword checks it, by callback or promise', async () => {
  const user = await User.create({ userName: 'ann', email: 'ann@example.com', password: 'secret-one', userGroups: ['staff'] });
  assert.ok(user.id);
  const [doc] = await store.find('users-test', 'users', { userName: 'ann' });
  assert.notEqual(doc.password, 'secret-one');
  assert.match(doc.password, /^\$2[aby]\$/);
  assert.ok(doc.createdAt instanceof Date);
  const found = await User.findOne({ userName: 'ann' });
  assert.equal(await found.comparePassword('secret-one'), true);
  assert.equal(await call(found.comparePassword.bind(found), 'wrong'), false);
  assert.equal(found.hasGroup('staff'), true);
  assert.equal(found.isAdmin, false);
  assert.deepEqual(found.profile, {}, 'as mongoose gave it');
});

test('a save hashes a changed password only; a field set to undefined is cleared', async () => {
  const user = await User.findOne({ userName: 'ann' });
  const hash = user.password;
  user.passwordResetToken = 'tok';
  await user.save();
  assert.equal((await User.findOne({ userName: 'ann' })).password, hash, 'not hashed again');
  user.password = 'secret-two';
  user.passwordResetToken = undefined;
  await user.save();
  const again = await User.findById(user.id);
  assert.equal(await again.comparePassword('secret-two'), true);
  assert.equal(again.passwordResetToken ?? null, null);
});

test('queries: any case with collation, lean documents, sort, where().gt(), count, update, delete', async () => {
  await User.create({ userName: 'bob', email: 'bob@example.com', password: 'secret-bob' });
  assert.equal((await User.findOne({ userName: 'ANN' }).collation({ locale: 'en', strength: 2 }))?.userName, 'ann');
  assert.equal(await User.findOne({ userName: 'ANN' }), null, 'without collation the case counts');
  const lean = await User.find({}).sort({ userName: 1 }).lean();
  assert.deepEqual(lean.map(u => u.userName), ['ann', 'bob']);
  assert.equal(typeof lean[0].save, 'undefined', 'lean: plain documents');
  await User.updateOne({ _id: (await User.findOne({ userName: 'bob' })).id }, { passwordResetExpires: new Date(Date.now() + 60_000) });
  assert.equal((await User.findOne({}).where('passwordResetExpires').gt(Date.now()).exec())?.userName, 'bob');
  assert.equal(await User.countDocuments({ userName: { $in: ['ann', 'bob'] } }), 2);
  assert.equal((await User.deleteOne({ _id: (await User.findOne({ userName: 'bob' })).id })).deletedCount, 1);
  assert.equal(await User.countDocuments(), 1);
});

test('a second user with the same name is refused', async () => {
  await assert.rejects(User.create({ userName: 'ann', email: 'other@example.com', password: 'x-password' }));
});

test('sessions: set, get, touch, destroy; an expired one is gone', async () => {
  const sessions = new DocumentSessionStore();
  const sess = { cookie: { expires: new Date(Date.now() + 60_000), originalMaxAge: 60_000 }, passport: { user: 'u1' } };
  await call(sessions.set.bind(sessions), 's1', sess);
  assert.deepEqual((await call(sessions.get.bind(sessions), 's1')).passport, { user: 'u1' });
  await call(sessions.touch.bind(sessions), 's1', sess);
  await call(sessions.destroy.bind(sessions), 's1');
  assert.equal(await call(sessions.get.bind(sessions), 's1'), null);
  await call(sessions.set.bind(sessions), 's2', { cookie: { expires: new Date(Date.now() - 1000) } });
  assert.equal(await call(sessions.get.bind(sessions), 's2'), null, 'expired');
  assert.equal((await store.find('users-test', 'sessions', { _id: 's2' })).length, 0, 'and removed');
});
