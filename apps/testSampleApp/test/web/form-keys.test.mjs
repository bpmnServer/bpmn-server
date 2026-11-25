// @features: app-contract
// Form keys (docs/design/form-keys.md): the address owf sends a person to when a task or a start event names the
// application's own page. The key may hold an expression worked out from the application's variables (§3), and owf
// adds identifiers only — never case data (§4).
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

test('a plain address is used as it stands', async () => {
  const address = await formKeyAddress('/hr/forms/assignment', { appDelegate: null });
  assert.equal(address, '/hr/forms/assignment');
});

test("an expression is worked out from the application's variables (section 3)", async () => {
  class Vars { hrForms() { return '/hr/forms'; } }
  const server = { appDelegate: { appVarsClass: Vars } };
  assert.equal(await formKeyAddress('${appVars.hrForms}/assignment', server), '/hr/forms/assignment');
  assert.equal(await formKeyAddress('${ appVars.hrForms }/leave', server), '/hr/forms/leave', 'spaces inside are fine');
  // A full URL works the same way: the application may be served from another host.
  class Host { base() { return 'https://hr.example.com/forms'; } }
  assert.equal(await formKeyAddress('${appVars.base}/assignment', { appDelegate: { appVarsClass: Host } }), 'https://hr.example.com/forms/assignment');
});

test('an expression that works out to nothing: no address, so the task keeps its fields (section 3)', async () => {
  class Vars { hrForms() { return undefined; } }
  assert.equal(await formKeyAddress('${appVars.hrForms}', { appDelegate: { appVarsClass: Vars } }), null);
  // Only the model's own path left: still somewhere to go.
  assert.equal(await formKeyAddress('${appVars.hrForms}/assignment', { appDelegate: { appVarsClass: Vars } }), '/assignment');
  // An unknown variable, and a delegate with none at all, are the same: nothing to put in.
  assert.equal(await formKeyAddress('${appVars.missing}', { appDelegate: { appVarsClass: Vars } }), null);
  assert.equal(await formKeyAddress('${appVars.hrForms}', { appDelegate: null }), null);
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
