// @features: web-security
// The database's address in the log without its password (userAccess/userStore.ts, redactUrl). The Fable Review, M5.
import test from 'node:test';
import assert from 'node:assert/strict';

const { redactUrl } = await import(new URL('../../../../packages/bpmn-web/dist/userAccess/userStore.js', import.meta.url).href);

test('a password in the address is replaced; the rest is kept', () => {
  assert.equal(redactUrl('mongodb://admin:s3cret@db.example:27017/bpmn'), 'mongodb://admin:***@db.example:27017/bpmn');
  assert.equal(redactUrl('mongodb+srv://u:p%40ss@cluster.example/bpmn?retryWrites=true'), 'mongodb+srv://u:***@cluster.example/bpmn?retryWrites=true');
  assert.doesNotMatch(redactUrl('mongodb://a:b@h1:1,h2:2/db'), /:b@/);
});

test('an address with no password, or none, is as it was', () => {
  assert.equal(redactUrl('mongodb://localhost:27017/bpmn'), 'mongodb://localhost:27017/bpmn');
  assert.equal(redactUrl(undefined), undefined);
  assert.equal(redactUrl('memory'), 'memory');
});
