// @features: engine-api
// What a user may see and do (API/SecureUser.ts), and the filter its rules are applied through (datastore/QueryTranslator.ts).
import test from 'node:test';
import assert from 'node:assert/strict';
import { SecureUser, QueryTranslator } from '../dist/index.js';

const sam = () => new SecureUser({ userName: 'sam', userGroups: ['staff', 'sales'] }, { enforceSecurity: true });
const admin = () => new SecureUser({ userName: 'ada', userGroups: ['ADMIN'] }, { enforceSecurity: true });
const system = () => SecureUser.SystemUser();
const open = () => new SecureUser({ userName: 'x', userGroups: [] }, { enforceSecurity: false });

test('roles: groups, admin and system; security turned off for one user is that user only', () => {
  assert.equal(sam().isAdmin(), false);
  assert.equal(sam().isSystem(), false);
  assert.equal(admin().isAdmin(), true);
  assert.equal(admin().isSystem(), false);
  assert.equal(system().isAdmin(), true);
  assert.equal(system().isSystem(), true);
  assert.equal(sam().inGroup('sales'), true);
  assert.equal(sam().inGroup('finance'), false);

  const off = open();
  assert.equal(off.securityBypassed, true);
  assert.equal(off.isAdmin(), true);
  assert.equal(off.isSystem(), true);
  assert.equal(off.inGroup('anything'), true);
  assert.equal(sam().securityBypassed, false, 'another user keeps the rules');
});

test('models: only an administrator changes them; a user with an owner sees that owner\'s', () => {
  assert.equal(sam().canModifyModel('m'), false);
  assert.equal(sam().canDeleteModel('m'), false);
  assert.equal(admin().canModifyModel('m'), true);
  assert.equal(admin().canDeleteModel('m'), true);
  assert.deepEqual(sam().qualifyModels({ name: 'm' }), { name: 'm' });
  const owned = new SecureUser({ userName: 'o', userGroups: [], modelsOwner: 'acme' }, { enforceSecurity: true });
  assert.deepEqual(owned.qualifyModels({ name: 'm' }), { name: 'm', owner: 'acme' });
});

test('deleting instances: an administrator\'s query goes through, anyone else\'s is refused', () => {
  assert.equal(sam().qualifyDeleteInstances({ name: 'm' }), false);
  assert.deepEqual(admin().qualifyDeleteInstances({ name: 'm' }), { name: 'm' });
});

test('invoking and assigning a task: its assignee, its candidates, or nobody named', () => {
  const task = (fields) => ({ assignee: undefined, candidateUsers: undefined, candidateGroups: undefined, ...fields });
  assert.equal(sam().canInvoke(task({ assignee: 'sam' })), true);
  assert.equal(sam().canInvoke(task({ assignee: 'lee' })), false);
  assert.equal(admin().canInvoke(task({ assignee: 'lee' })), true);

  assert.equal(admin().canAssign(task({ assignee: 'lee' })), true);
  assert.equal(sam().canAssign(task({ assignee: 'sam' })), true);
  assert.equal(sam().canAssign(task({ candidateUsers: ['sam'] })), true);
  assert.equal(sam().canAssign(task({ candidateGroups: ['sales'] })), true);
  assert.equal(sam().canAssign(task({ candidateGroups: ['finance'] })), false);
  assert.equal(sam().canAssign(task({ candidateUsers: ['lee'] })), false);
  assert.equal(sam().canAssign(task({})), true, 'nobody named: anyone');
});

test('filtering a list of items: paths, nulls, arrays', () => {
  const translator = new QueryTranslator('items');
  const passes = (item, condition) => translator.filterItem(item, { items: { $elemMatch: condition } });
  assert.equal(passes({ a: { b: 1 } }, { 'a.b': 1 }), true);
  assert.equal(passes({}, { 'a.b': 1 }), false, 'no parent on the path: no value there');
  assert.equal(passes({ a: null }, { 'a.b': null }), true);
  assert.equal(passes({ tags: ['x', 'y'] }, { tags: 'x' }), true);
  assert.equal(passes({ tags: ['x', 'y'] }, { tags: 'z' }), false);
  assert.equal(passes({ tags: ['x', 'y'] }, { tags: ['z', 'y'] }), true);
  assert.equal(passes({ tags: ['x', 'y'] }, { tags: ['z'] }), false);
  assert.equal(passes({ s: 'a' }, { s: 'b' }), false);
});

test('filtering a list of items: comparisons', () => {
  const passes = (val, condition) => new QueryTranslator('items').filterItem({ val }, { items: { $elemMatch: { val: condition } } });
  assert.equal(passes(5, { $gte: 5 }), true);
  assert.equal(passes(4, { $gte: 5 }), false);
  assert.equal(passes(6, { $gt: 5 }), true);
  assert.equal(passes(5, { $gt: 5 }), false);
  assert.equal(passes(5, { $eq: 5 }), true);
  assert.equal(passes(6, { $eq: 5 }), false);
  assert.equal(passes(5, { $lte: 5 }), true);
  assert.equal(passes(6, { $lte: 5 }), false);
  assert.equal(passes(4, { $lt: 5 }), true);
  assert.equal(passes(5, { $lt: 5 }), false);
  assert.equal(passes(1, { $exists: true }), true);
  assert.equal(passes(undefined, { $exists: true }), false);
  assert.equal(passes(undefined, { $exists: false }), true);
  assert.equal(passes(2, { $in: [1, 2] }), true);
  assert.equal(passes(3, { $in: [1, 2] }), false);
  assert.equal(passes(2, { $unknown: 2 }), false, 'an operator it does not know does not pass');
});

test('filtering a list of items: every comparison of a condition must hold', () => {
  const passes = (val, condition) => new QueryTranslator('items').filterItem({ val }, { items: { $elemMatch: { val: condition } } });
  assert.equal(passes(7, { $gte: 5, $lt: 10 }), true);
  assert.equal(passes(3, { $gte: 5, $lt: 10 }), false, 'under the first, though under the last');
  assert.equal(passes(12, { $gte: 5, $lt: 10 }), false);
  assert.equal(passes(3, { $in: [1, 2], $lt: 10 }), false);
});
