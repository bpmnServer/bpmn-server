import test from 'node:test';
import assert from 'node:assert/strict';
import User from './dist/userAccess/models/User.js';
import { UserController } from './dist/userAccess/controllers/user.js';

test('self-service account updates ignore a forged target ID and group claim', async () => {
  const findById = User.findById;
  const deleteOne = User.deleteOne;
  const found = [];
  const deleted = [];
  const account = {
    id: 'self', userName: 'self', email: 'self@example.com',
    userGroups: ['staff'], profile: {}, save: async function () { return this; },
  };
  User.findById = async id => { found.push(id); return account; };
  User.deleteOne = async query => { deleted.push(query); return { deletedCount: 1 }; };
  const redirects = [];
  const req = {
    user: { id: 'self' },
    body: { id: 'victim', email: 'self@example.com', userGroups: 'SYSTEM',
      password: 'valid-password', confirmPassword: 'valid-password' },
    flash: () => {}, logout: cb => cb(),
  };
  const res = { redirect: target => { redirects.push(target); } };
  try {
    await UserController.postUpdateProfile(req, res, assert.fail);
    assert.deepEqual(account.userGroups, ['staff']);
    await UserController.postUpdatePassword(req, res, assert.fail);
    await UserController.postDeleteAccount(req, res, assert.fail);
    assert.deepEqual(found, ['self', 'self']);
    assert.deepEqual(deleted, [{ _id: 'self' }]);
    assert.deepEqual(redirects, ['/account', '/account', '/']);
  } finally {
    User.findById = findById;
    User.deleteOne = deleteOne;
  }
});
