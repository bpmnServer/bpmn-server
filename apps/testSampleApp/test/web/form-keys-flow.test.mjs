// @features: app-contract
// Form keys end to end (docs/design/form-keys.md): a model names the application's own page, the application declares
// where its forms are served as a variable of its own (appVars), and the task list answers the address worked out —
// so the application's own list opens that page itself (flow A), and the start page links to it (flow E).
import test from 'node:test';
import assert from 'node:assert/strict';
import { formKeyAddress, withIdentifiers } from 'bpmn-web';

/** The HR application's variable, as apps/hrdemo/workflow/delegates/appVars.ts has it. */
class HrVars {
  hrForms() { return process.env.HR_FORMS_URL ?? '/forms'; }
}
const hrServer = { appDelegate: { appVarsClass: HrVars } };

test("the HR demo's form key becomes the page's address", async () => {
  // what apps/hrdemo/workflow/processes/Assign Employee.bpmn carries on its start event
  const key = '${appVars.hrForms}/assignment';
  assert.equal(await formKeyAddress(key, hrServer), '/forms/assignment',
    "the HR app's route, which src/App.jsx serves as /forms/assignment");
});

test('HR_FORMS_URL moves the forms without touching a model', async () => {
  const was = process.env.HR_FORMS_URL;
  process.env.HR_FORMS_URL = '/hr/forms';
  try {
    assert.equal(await formKeyAddress('${appVars.hrForms}/assignment', hrServer), '/hr/forms/assignment');
  } finally {
    if (was === undefined) delete process.env.HR_FORMS_URL; else process.env.HR_FORMS_URL = was;
  }
});

test('flow E: the start page links to the page with the process and element', async () => {
  const address = await formKeyAddress('${appVars.hrForms}/assignment', hrServer);
  const url = new URL(withIdentifiers(address, { processName: 'Assign Employee', startNodeId: 'Asked', returnTo: '/assignments' }), 'http://x');
  assert.equal(url.pathname, '/forms/assignment');
  assert.equal(url.searchParams.get('process'), 'Assign Employee');
  assert.equal(url.searchParams.get('start'), 'Asked');
  assert.equal(url.searchParams.get('returnTo'), '/assignments');
  assert.equal(url.searchParams.get('item'), null, 'nothing is waiting yet');
});

test("flow A: the application's own list opens it with the task's identifiers, and no case data", async () => {
  const address = await formKeyAddress('${appVars.hrForms}/assignment', hrServer);
  // as apps/hrdemo/src/components/TaskPanel.jsx builds it from form.formKey
  const url = new URL(withIdentifiers(address, { instanceId: 'i-7', itemId: 't-3', returnTo: '/assignments' }), 'http://x');
  assert.equal(url.searchParams.get('instance'), 'i-7');
  assert.equal(url.searchParams.get('item'), 't-3');
  for (const named of ['employeeId', 'projectId', 'data'])
    assert.equal(url.searchParams.get(named), null, `${named} is read through API v3, not carried in the address`);
});
