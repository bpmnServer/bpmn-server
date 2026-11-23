import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mayOpenWorkflow } from './workflowAccess.js';

const employee = { design: false, administer: false };
const designer = { design: true, administer: false };
const admin = { design: false, administer: true };

test('Settings is for administrators and designers only, as in BPMN Server\'s own menu', () => {
  for (const path of ['/workflow/dashboard/settings', '/workflow/dashboard/settings/assignment', '/workflow/dashboard/integration']) {
    assert.equal(mayOpenWorkflow(path, employee), false, path);
    assert.equal(mayOpenWorkflow(path, designer), true, path);
    assert.equal(mayOpenWorkflow(path, admin), true, path);
  }
});

test("AI Agent is everyone's while the AI Agents add-on is on (/api/v3/me: may.aiLink)", () => {
  assert.equal(mayOpenWorkflow('/workflow/ai/key', { ...employee, aiLink: true }), true);
  assert.equal(mayOpenWorkflow('/workflow/ai/key', employee), false, 'add-on off');
});

test('My Work and Notifications are everyone\'s; Administration the administrators\'; Design the designers\'', () => {
  assert.equal(mayOpenWorkflow('/workflow/dashboard', employee), true);
  assert.equal(mayOpenWorkflow('/workflow/dashboard/notifications', employee), true);
  assert.equal(mayOpenWorkflow('/workflow/dashboard/admin', designer), false);
  assert.equal(mayOpenWorkflow('/workflow/dashboard/admin', admin), true);
  assert.equal(mayOpenWorkflow('/workflow/dashboard/design', employee), false);
  assert.equal(mayOpenWorkflow('/workflow/dashboard/design', designer), true);
  assert.equal(mayOpenWorkflow('/workflow', employee), false);
});
