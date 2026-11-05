// @features: guests
// The editor for a visitor that saves nothing (GUEST_SAVE=false): edits stay in the browser, Download gives the file, Sign up
// to save takes them through sign-up and verification, back to the model, to save it.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { chromium } from 'playwright';
import { startWebApp, PASSWORD } from '../support/webApp.mjs';

const GUESTS = fs.mkdtempSync(path.join(os.tmpdir(), 'bpmn-guests-'));
const DEMO = { GUEST_ACCESS: 'true', DEMO_MODE: 'true', DISABLE_ADMIN: 'true', GUESTS_PATH: GUESTS, GUEST_RATE_LIMIT: '1000',
  GUEST_SAVE: 'false', SIGNUP_VERIFY_EMAIL: 'true', SIGNUP_GROUPS: 'DESIGNER' };
let web, browser, User;

test.before(async () => {
  web = await startWebApp({ env: DEMO });
  browser = await chromium.launch();
  ({ default: User } = await import(new URL('../../../packages/bpmn-web/dist/userAccess/models/User.js', import.meta.url).href));
});
test.after(async () => {
  for (const key of Object.keys(DEMO)) delete process.env[key];
  await browser?.close();
  await web?.stop();
  fs.rmSync(GUESTS, { recursive: true, force: true });
  setImmediate(() => process.exit(0));
});

async function openEditor(model) {
  const context = await browser.newContext({ viewport: { width: 1440, height: 1000 }, acceptDownloads: true });
  await context.route('**/*', route => route.request().url().startsWith(web.base) ? route.continue() : route.abort());
  const page = await context.newPage();
  page.setDefaultTimeout(20000);
  page.on('dialog', d => d.accept());
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  await page.goto(`${web.base}/${model}`);
  await page.waitForSelector('#js-canvas .djs-shape');
  return { page, errors, close: () => context.close() };
}
/** An edit on the diagram: the first task renamed, through the model. */
const rename = (page, name) => page.evaluate(name => {
  const modeler = window.bpmnModeler;
  const task = modeler.get('elementRegistry').filter(e => e.type === 'bpmn:UserTask')[0];
  modeler.get('modeling').updateProperties(task, { name });
}, name);
/** A new scenario: New, or New and its first choice, as the Test tab has it. */
async function newScenario(page) {
  const menu = page.locator('.test-new-menu summary');
  if (await menu.count()) await menu.click();
  await page.click('.test-new');
}
const xmlOf = page => page.evaluate(async () => (await window.bpmnModeler.saveXML({ format: true })).xml);
const statusIs = async (page, text) => {
  await page.waitForFunction(text => document.getElementById('js-save-status').textContent.includes(text), text, { timeout: 8000 })
    .catch(async () => assert.fail(`status "${await page.locator('#js-save-status').innerText()}", expected ${text}, at ${page.url()}`));
};

test('a visitor edits and does not save: Ctrl+S says so, the Test tab does not run changes; Download gives what is edited', async () => {
  const { page, errors, close } = await openEditor('model/edit/leave-request');
  assert.equal(await page.locator('#js-save').count(), 0);
  assert.match(await page.locator('#js-signup').innerText(), /Sign up to save/);
  await rename(page, 'Edited by a visitor');

  await page.keyboard.press('Control+s');
  await statusIs(page, 'sign up to save');

  const [download] = await Promise.all([page.waitForEvent('download'), page.click('#js-download')]);
  assert.equal(download.suggestedFilename(), 'leave-request.bpmn');
  assert.match(fs.readFileSync(await download.path(), 'utf8'), /Edited by a visitor/);

  // what it edited does not run: nothing of it reached the server
  await page.click('#js-tab-test');
  await page.waitForSelector('#js-test .test-panel');
  await newScenario(page);
  await page.click('.test-run');
  await page.click('.test-start-go');
  await page.waitForSelector('.test-status:text("sign up to save and run")');
  assert.deepEqual(errors, []);
  await close();
});

test('a visitor runs the model as it is, in the Test tab; its scenario is not kept', async () => {
  const { page, errors, close } = await openEditor('model/edit/leave-request');
  let saved = 0;
  page.on('request', request => { if (request.method() === 'PUT' && request.url().includes('/model/scenarios/')) saved++; });
  await page.click('#js-tab-test');
  await page.waitForSelector('#js-test .test-panel');
  await newScenario(page);
  await page.fill('.test-name', 'Mine');
  await page.click('.test-run');
  await page.click('.test-start-go');
  await page.waitForSelector('.test-step.pending');
  await page.waitForTimeout(800);
  assert.equal(saved, 0);
  assert.deepEqual(errors, []);
  await close();
});

test('a draft outlives a reload, and sign-up and verification: back at the model, Save keeps it, in the account\'s own folder', async () => {
  const { page, errors, close } = await openEditor('model/add/my-first-model');
  // a new model has no task yet: add one
  await page.evaluate(() => {
    const modeler = window.bpmnModeler;
    const shape = modeler.get('elementFactory').createShape({ type: 'bpmn:UserTask' });
    const root = modeler.get('canvas').getRootElement();
    modeler.get('modeling').createShape(shape, { x: 400, y: 200 }, root);
    modeler.get('modeling').updateProperties(shape, { name: 'Before signing up' });
  });
  await page.waitForFunction(() => localStorage.getItem('bpmn-web.modeler.draft')?.includes('Before signing up'));

  await page.reload();
  await page.waitForSelector('#js-canvas .djs-shape');
  await statusIs(page, 'kept in this browser');
  assert.match(await xmlOf(page), /Before signing up/);

  // the last change, right before signing up, is in the draft too
  await rename(page, 'Before signing up, at the last moment');
  await page.click('#js-signup');
  await page.waitForSelector('#signup-form');
  await page.fill('[name=userName]', 'drafter');
  await page.fill('[name=email]', 'drafter@gmail.com');
  await page.fill('[name=password]', PASSWORD);
  await page.fill('[name=confirmPassword]', PASSWORD);
  await page.click('#signup-form [type=submit]');
  await page.waitForURL(url => url.pathname === '/account');

  const { emailVerificationToken, tenantId } = await User.findOne({ userName: 'drafter' });
  await page.goto(`${web.base}/account/verify/${emailVerificationToken}`);
  await page.waitForURL(url => url.pathname === '/model/add/my-first-model');
  await page.waitForSelector('#js-canvas .djs-shape');
  await statusIs(page, 'Save to keep them');
  assert.match(await xmlOf(page), /Before signing up, at the last moment/);

  await page.click('#js-save');
  await statusIs(page, 'Saved');
  assert.match(fs.readFileSync(path.join(GUESTS, tenantId, 'my-first-model.bpmn'), 'utf8'), /at the last moment/);
  assert.equal(await page.evaluate(() => localStorage.getItem('bpmn-web.modeler.draft')), null);
  assert.deepEqual(errors, []);
  await close();
});
