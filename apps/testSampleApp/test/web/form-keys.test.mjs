// @features: app-contract
// Form keys (docs/design/form-keys.md): the address owf sends a person to when a task or a start event names the
// application's own page. The key is its address (§3), and owf adds identifiers only — never case data (§4).
import test from 'node:test';
import assert from 'node:assert/strict';
import { hasFormKey, formKeyAddress, withIdentifiers } from 'bpmn-web';

test('a form key is a key only when it says something', () => {
  assert.equal(hasFormKey('/hr/forms/assignment'), true);
  assert.equal(hasFormKey(''), false);
  assert.equal(hasFormKey('   '), false);
  assert.equal(hasFormKey(undefined), false);
  assert.equal(hasFormKey(null), false);
});

test('a plain address is used as it stands', () => {
  assert.equal(formKeyAddress('/hr/forms/assignment'), '/hr/forms/assignment');
  assert.equal(formKeyAddress('  https://hr.example.com/forms/leave '), 'https://hr.example.com/forms/leave', 'a full URL too, trimmed');
});

test('a blank key is no address, so the task keeps its fields (section 3)', () => {
  assert.equal(formKeyAddress(''), null);
  assert.equal(formKeyAddress('   '), null);
});

test('owf adds identifiers only: a task by its instance and item (section 4)', () => {
  const address = withIdentifiers('/hr/forms/assignment', { instanceId: 'i-1', itemId: 't-9', returnTo: '/dashboard' });
  const url = new URL(address, 'http://x');
  assert.equal(url.pathname, '/hr/forms/assignment');
  assert.equal(url.searchParams.get('instance'), 'i-1');
  assert.equal(url.searchParams.get('item'), 't-9');
  assert.equal(url.searchParams.get('returnTo'), '/dashboard');
  assert.equal(url.searchParams.get('data'), null, 'no case data travels in the address');
});

// Every user-startable event is listed for the person to pick (not a timer, message or signal: getStartNodes's
// userInvokable); one whose form is the application's page carries that address, the rest their fields.
test('a start event by its process and element, which is all there is before an instance (flow E)', () => {
  const url = new URL(withIdentifiers('/hr/forms/leave-request', { processName: 'Leave', startNodeId: 'Request', returnTo: '/dashboard' }), 'http://x');
  assert.equal(url.searchParams.get('process'), 'Leave');
  assert.equal(url.searchParams.get('start'), 'Request');
  assert.equal(url.searchParams.get('item'), null, 'there is no item yet');
  assert.equal(url.searchParams.get('instance'), null, 'nor an instance');
});

test("the page's own query is kept, and returnTo is left out when there is none", () => {
  const url = new URL(withIdentifiers('/hr/forms/assignment?mode=compact', { instanceId: 'i-1', itemId: 't-9' }), 'http://x');
  assert.equal(url.searchParams.get('mode'), 'compact', "the application's own parameter stays");
  assert.equal(url.searchParams.get('item'), 't-9');
  assert.equal(url.searchParams.get('returnTo'), null);
});
