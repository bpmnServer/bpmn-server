// Browser tests of the workbench: what users do, in Chromium (Playwright), against an in-process
// bpmn-web (test/support/webApp.mjs). Every page also fails the test on a script error or a missing
// local asset. Screenshots go to test/ui/screenshots/.   npm run test:ui
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';
import { startWebApp, PASSWORD } from '../support/webApp.mjs';

const SHOTS = fileURLToPath(new URL('./screenshots/', import.meta.url));
fs.mkdirSync(SHOTS, { recursive: true });
const MODEL = 'leave-request';

let web, browser;
test.before(async () => {
  web = await startWebApp();
  browser = await chromium.launch();
});
test.after(async () => {
  await browser?.close();
  await web?.stop();
  setImmediate(() => process.exit(0));
});

/** A signed-in page that records script errors and failed local assets. */
async function signedIn(userName) {
  const context = await browser.newContext();
  // only the app itself: external CDNs (fonts, styles) would make the tests slow and network-dependent
  await context.route('**/*', route => route.request().url().startsWith(web.base) ? route.continue() : route.abort());
  const page = await context.newPage();
  page.setDefaultTimeout(20000);
  const problems = [];
  page.on('pageerror', e => problems.push('script error: ' + e.message));
  page.on('response', r => {
    if (r.status() >= 400 && r.url().startsWith(web.base) && /\/(javascripts|stylesheets|js|vendor|webfonts)\//.test(r.url()))
      problems.push(`${r.status()} ${new URL(r.url()).pathname}`);
  });
  await page.goto(web.base + '/login');
  await page.fill('#userName', userName);
  await page.fill('#password', PASSWORD);
  await Promise.all([page.waitForURL(url => !url.pathname.startsWith('/login')), page.click('button[type=submit]')]);
  return { page, problems, close: () => context.close() };
}

const instance = (id) => web.bpmnServer.dataStore.findInstance({ id }, 'full');
const waitingItem = async (id, elementId) => (await instance(id)).items.find(i => i.elementId === elementId && i.status === 'wait');
const instanceIdOf = (page) => new URL(page.url()).searchParams.get('id');

test('a wrong password stays on the login page', async () => {
  const page = await browser.newPage();
  await page.route('**/*', route => route.request().url().startsWith(web.base) ? route.continue() : route.abort());
  await page.goto(web.base + '/login');
  await page.fill('#userName', 'staff');
  await page.fill('#password', 'wrong');
  await Promise.all([page.waitForURL(/\/login/), page.click('button[type=submit]')]);
  assert.match(page.url(), /\/login$/);
  await page.close();
});

test('the workbench: pick a model, see its preview, search the catalog, zoom', async () => {
  const { page, problems, close } = await signedIn('admin');
  await page.waitForSelector('#process');
  await page.selectOption('#process', MODEL);
  assert.equal(await page.textContent('#selected-model-name'), MODEL);
  assert.match(await page.getAttribute('#execLink', 'href'), new RegExp(`/execute/${MODEL}/`));
  assert.match(await page.getAttribute('#modelLink', 'href'), new RegExp(`/model/edit/${MODEL}/`));
  await page.waitForFunction(() => document.getElementById('svg').naturalWidth > 0, null, { timeout: 10000 });

  await page.click('#diagram-zoom-in');
  assert.equal(await page.textContent('#diagram-zoom-reset'), '125%');
  await page.click('#diagram-zoom-reset');
  assert.equal(await page.textContent('#diagram-zoom-reset'), '100%');

  await page.fill('#model-search', 'zzz-no-match');
  assert.equal(await page.isVisible('#model-empty'), true);
  await page.fill('#model-search', 'leave');
  assert.equal(await page.isVisible('#model-empty'), false);
  assert.match(await page.textContent('#model-count'), /of \d+ models/);

  await page.screenshot({ path: SHOTS + 'workbench.png', fullPage: true });
  assert.deepEqual(problems, []);
  await close();
});

test('regular users get no designer or administration controls', async () => {
  const { page, problems, close } = await signedIn('staff');
  await page.waitForSelector('#process');
  assert.equal(await page.locator('a[href="/model/new"]').count(), 0, 'no New model');
  assert.equal(await page.locator('a[href="/model/import"]').count(), 0, 'no Import');
  assert.equal(await page.locator('#modelLink').count(), 0, 'no Open model');
  assert.equal(await page.locator('form[action="/resetData"]').count(), 0, 'no Delete All');
  assert.equal(await page.locator('a[href="/admin"]').count(), 0, 'no Admin link');
  assert.match(await page.textContent('#execLink'), /Start process/);
  assert.deepEqual(problems, []);
  await close();
});

test('run a process, then complete its task from the task list', async () => {
  const { page, problems, close } = await signedIn('admin');
  await page.selectOption('#process', MODEL);
  await Promise.all([page.waitForURL(/\/instanceDetails\?id=/), page.click('#execLink')]);
  const id = instanceIdOf(page);
  assert.match(await page.textContent('h1'), /Instance Details/);

  const submit = await waitingItem(id, 'Submit');
  await page.goto(`${web.base}/tasks`);
  await Promise.all([page.waitForURL(/\/invokeItem/), page.click(`a[href*="invokeItem?id=${submit.id}"]`)]);
  await page.fill('[name=days]', '2');
  await page.fill('[name=reason]', 'browser test');
  await page.screenshot({ path: SHOTS + 'task-form.png', fullPage: true });
  await Promise.all([page.waitForNavigation(), page.click('form[name=InvokeForm] [type=submit]')]);

  const done = await instance(id);
  assert.equal(done.status, 'end');
  assert.equal(done.data.reason, 'browser test');
  assert.equal(done.data.approvedBy, 'system');
  assert.deepEqual(problems, []);
  await close();
});

test('start with input data from the start form', async () => {
  const { page, problems, close } = await signedIn('admin');
  await page.goto(`${web.base}/executeInput/${MODEL}`);
  await page.fill('[name=field1]', 'requester');
  await page.fill('[name=value1]', 'pat');
  await Promise.all([page.waitForURL(/\/instanceDetails\?id=/), page.click('form[name=ExecuteForm] [type=submit]')]);
  assert.equal((await instance(instanceIdOf(page))).data.requester, 'pat');
  assert.deepEqual(problems, []);
  await close();
});

test('a long leave: staff submits, the manager approves from their own list', async () => {
  const admin = await signedIn('admin');
  await admin.page.goto(`${web.base}/execute/${MODEL}`);
  const id = instanceIdOf(admin.page);
  const submit = await waitingItem(id, 'Submit');
  await admin.page.goto(`${web.base}/assign?id=${submit.id}&processName=${MODEL}&elementId=Submit`);
  await admin.page.fill('[name=assignee]', 'staff');
  await Promise.all([admin.page.waitForNavigation(), admin.page.click('form[name=InvokeForm] [type=submit]')]);

  const staff = await signedIn('staff');
  await staff.page.goto(`${web.base}/tasks`);
  await Promise.all([staff.page.waitForURL(/\/invokeItem/), staff.page.click(`a[href*="invokeItem?id=${submit.id}"]`)]);
  await staff.page.fill('[name=days]', '8');
  await Promise.all([staff.page.waitForNavigation(), staff.page.click('form[name=InvokeForm] [type=submit]')]);
  const approve = await waitingItem(id, 'Approve');
  assert.ok(approve, 'waits for approval');

  await staff.page.goto(`${web.base}/tasks`);
  assert.equal(await staff.page.locator(`a[href*="id=${approve.id}"]`).count(), 0, 'staff does not see the approval');

  await admin.page.goto(`${web.base}/assign?id=${approve.id}&processName=${MODEL}&elementId=Approve`);
  await admin.page.fill('[name=assignee]', 'manager');
  await Promise.all([admin.page.waitForNavigation(), admin.page.click('form[name=InvokeForm] [type=submit]')]);

  const manager = await signedIn('manager');
  await manager.page.goto(`${web.base}/tasks`);
  await Promise.all([manager.page.waitForNavigation(), manager.page.click(`a[href*="invokeItem?id=${approve.id}"]`)]);
  assert.equal((await instance(id)).status, 'end', 'approved (a task without a form completes on open)');
  assert.deepEqual([...admin.problems, ...staff.problems, ...manager.problems], []);
  for (const s of [admin, staff, manager]) await s.close();
});

test('candidates execute a task from every task list, assigned or not (assignment is optional)', async () => {
  const admin = await signedIn('admin');
  await admin.page.goto(`${web.base}/execute/${MODEL}`);
  const id = instanceIdOf(admin.page);
  const submit = await waitingItem(id, 'Submit');

  const staff = await signedIn('staff');
  for (const url of ['/tasks', '/', '/user']) {
    await staff.page.goto(web.base + url);
    assert.equal(await staff.page.locator(`a[href*="invokeItem?id=${submit.id}"]`).count(), 1, `${url}: Execute`);
  }
  await Promise.all([staff.page.waitForURL(/\/invokeItem/), staff.page.click(`a[href*="invokeItem?id=${submit.id}"]`)]);
  await staff.page.fill('[name=days]', '1');
  await Promise.all([staff.page.waitForNavigation(), staff.page.click('form[name=InvokeForm] [type=submit]')]);
  assert.equal((await instance(id)).status, 'end', 'completed without being assigned');

  const manager = await signedIn('manager');
  await manager.page.goto(`${web.base}/`);
  assert.equal(await manager.page.locator(`a[href*="invokeItem?id=${submit.id}"]`).count(), 0, 'a completed task is no longer listed');
  assert.deepEqual([...admin.problems, ...staff.problems, ...manager.problems], []);
  for (const s of [admin, staff, manager]) await s.close();
});

test('tasks of other groups are not listed', async () => {
  const admin = await signedIn('admin');
  await admin.page.goto(`${web.base}/execute/${MODEL}`);
  const id = instanceIdOf(admin.page);
  await web.api('PUT', '/api2/engine/invoke', { query: { id, 'items.elementId': 'Submit' }, data: { days: 9 } });
  const approve = await waitingItem(id, 'Approve');
  assert.ok(approve, 'waits for the manager');
  const staff = await signedIn('staff');
  for (const url of ['/tasks', '/', '/user']) {
    await staff.page.goto(web.base + url);
    assert.equal(await staff.page.locator(`a[href*="id=${approve.id}"]`).count(), 0, `${url}: no manager task for staff`);
  }
  await admin.close();
  await staff.close();
});

test('the instance page decorates the diagram, toggles tokens and replays the instance', async () => {
  const { page, problems, close } = await signedIn('admin');
  await page.goto(`${web.base}/execute/${MODEL}`);
  await page.waitForSelector('[data-element-id="Submit"]');
  assert.ok(await page.locator('.Pending[data-element-id="Submit"]').count() > 0, 'the waiting task is decorated');
  assert.ok(await page.locator('[id^="seq_"]').count() > 0, 'step numbers');

  const tokens = page.locator('.decor-token').first();
  const before = await tokens.isVisible();
  await page.click('#showTokens');
  assert.notEqual(await tokens.isVisible(), before, 'tokens toggle');

  await page.click('#startAnimation');
  await page.waitForFunction(() => /complete/i.test(document.getElementById('animationStatus').textContent), null, { timeout: 30000 });
  assert.ok(await page.locator('.Pending[data-element-id="Submit"]').count() > 0, 'the replay ends on the waiting task');

  await page.click('#showHide');
  assert.equal(await page.isVisible('#logs'), true, 'logs open');
  await page.screenshot({ path: SHOTS + 'instance-details.png', fullPage: true });
  assert.deepEqual(problems, []);
  await close();
});

test('an administrator deletes an instance from the instance list', async () => {
  const { page, problems, close } = await signedIn('admin');
  await page.goto(`${web.base}/execute/${MODEL}`);
  const id = instanceIdOf(page);
  await page.goto(`${web.base}/#instances`);
  await Promise.all([page.waitForNavigation(), page.click(`form[action="/deleteInstance"]:has(input[value="${id}"]) button`)]);
  assert.equal((await web.bpmnServer.dataStore.findInstances({ id }, 'summary')).length, 0);
  assert.deepEqual(problems, []);
  await close();
});

test('the modeler opens a model with the properties panel', async () => {
  const { page, problems, close } = await signedIn('admin');
  await page.goto(`${web.base}/model/edit/${MODEL}`);
  await page.waitForSelector('#js-canvas svg .djs-element[data-element-id="Submit"]', { timeout: 30000 });
  // select the task through the modeler (a click can land on an overlay); the panel shows it
  await page.evaluate(() => {
    const registry = window.BPMNModeler.get('elementRegistry');
    window.BPMNModeler.get('selection').select(registry.get('Submit'));
  });
  await page.waitForFunction(() => /Submit/.test(document.getElementById('js-properties-panel').textContent), null, { timeout: 10000 });
  await page.screenshot({ path: SHOTS + 'modeler.png', fullPage: true });
  assert.deepEqual(problems, []);
  await close();
});

test('the modeler without the properties panel opens too', async () => {
  const { page, problems, close } = await signedIn('admin');
  await page.goto(`${web.base}/model/editNoProp/${MODEL}`);
  await page.waitForSelector('#js-canvas svg .djs-element[data-element-id="Submit"]', { timeout: 30000 });
  assert.deepEqual(problems, []);
  await close();
});

test('the end-user home lists processes, tasks and instances', async () => {
  const { page, problems, close } = await signedIn('staff');
  await page.goto(`${web.base}/user`);
  await page.waitForSelector('#processes');
  assert.match(await page.content(), new RegExp(MODEL));
  await page.screenshot({ path: SHOTS + 'end-user-home.png', fullPage: true });
  assert.deepEqual(problems, []);
  await close();
});

test('the account page shows the user, and logging out ends the session', async () => {
  const { page, problems, close } = await signedIn('staff');
  await page.goto(`${web.base}/account`);
  assert.match(await page.content(), /staff/);
  await page.goto(`${web.base}/logout`);
  await page.goto(`${web.base}/tasks`);
  assert.match(page.url(), /\/login$/, 'signed out');
  assert.deepEqual(problems, []);
  await close();
});

test('a missing instance shows the error details page', async () => {
  const { page, close } = await signedIn('admin');
  const response = await page.goto(`${web.base}/instanceDetails?id=does-not-exist`);
  assert.ok(response.status() >= 400);
  assert.doesNotMatch(await page.content(), /at .*\.js:\d+/, 'no stack trace');
  await close();
});
