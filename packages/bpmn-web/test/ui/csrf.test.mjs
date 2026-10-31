// Browser checks that the pages send the CSRF token on every path that changes state: plain forms,
// the multipart import (fetch with the header) and the modeler's save (jQuery bundled in the modeler).
//   npm run test:ui
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { chromium } from 'playwright';
import { startWebApp, PASSWORD, FIXTURES } from '../support/webApp.mjs';

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

/** A signed-in admin page that records refused (403) requests and page errors. */
async function signedIn(userName = 'admin') {
  const context = await browser.newContext();
  // only the app itself: external CDNs would make the tests slow and network-dependent
  await context.route('**/*', route => route.request().url().startsWith(web.base) ? route.continue() : route.abort());
  const page = await context.newPage();
  page.setDefaultTimeout(20000);
  const refused = [], errors = [];
  page.on('response', r => { if (r.status() === 403) refused.push(`${r.request().method()} ${new URL(r.url()).pathname}`); });
  page.on('pageerror', e => errors.push(e.message));
  await page.goto(web.base + '/login');
  await page.fill('#userName', userName);
  await page.fill('#password', PASSWORD);
  await Promise.all([page.waitForURL(url => !url.pathname.startsWith('/login')), page.click('button[type=submit]')]);
  return { page, refused, errors, close: () => context.close() };
}

test('the login form signs in (it carries the token)', async () => {
  const { page, refused, close } = await signedIn();
  assert.equal(new URL(page.url()).pathname, '/');
  assert.deepEqual(refused, []);
  await close();
});

test('a task form submits', async () => {
  const { page, refused, close } = await signedIn();
  await page.goto(`${web.base}/execute/${MODEL}`);
  const id = new URL(page.url()).searchParams.get('id');
  const submit = (await web.bpmnServer.dataStore.findInstance({ id }, 'full')).items.find(i => i.elementId === 'Submit');
  await page.goto(`${web.base}/invokeItem?id=${submit.id}&processName=${MODEL}&elementId=Submit`);
  await page.fill('[name=days]', '1');
  await Promise.all([page.waitForNavigation(), page.click('form[name=InvokeForm] [type=submit]')]);
  assert.deepEqual(refused, []);
  assert.equal((await web.bpmnServer.dataStore.findInstance({ id }, 'full')).status, 'end');
  await close();
});

test('the rename form submits', async () => {
  fs.copyFileSync(path.join(FIXTURES, 'leave-request.bpmn'), path.join(web.definitionsPath, 'to-rename.bpmn'));
  await web.bpmnServer.definitions.rebuild();
  const { page, refused, close } = await signedIn();
  await page.goto(`${web.base}/model/rename/to-rename`);
  await page.fill('[name=newName]', 'renamed-in-browser');
  await Promise.all([page.waitForNavigation(), page.click('form [type=submit]')]);
  assert.deepEqual(refused, []);
  const names = (await web.bpmnServer.definitions.getList()).map(m => m.name ?? m);
  assert.ok(names.includes('renamed-in-browser'), names.join(','));
  await close();
});

test('the import page uploads (multipart, token as a header)', async () => {
  const { page, refused, errors, close } = await signedIn();
  const file = path.join(fs.mkdtempSync(path.join(os.tmpdir(), 'ui-import-')), 'browser-import.bpmn');
  fs.copyFileSync(path.join(FIXTURES, 'leave-request.bpmn'), file);
  await page.goto(`${web.base}/model/import`);
  await page.setInputFiles('input[type=file]', file);
  await Promise.all([page.waitForURL(web.base + '/'), page.click('input[type=submit][value=Import]')]);
  assert.deepEqual(refused, []);
  assert.deepEqual(errors, []);
  assert.equal(await page.inputValue('#process'), 'browser-import', 'selected under the file name without its extension');
  await close();
});

test('the modeler saves (its bundled jQuery sends the token)', async () => {
  const { page, refused, errors, close } = await signedIn();
  await page.goto(`${web.base}/model/edit/${MODEL}`);
  await page.waitForSelector('#js-canvas svg .djs-element[data-element-id="Submit"]', { timeout: 30000 });
  const saved = page.waitForResponse(r => r.request().method() === 'POST' && r.url().includes(`/model/edit/${MODEL}`));
  await page.evaluate(() => window.saveDiagramFunct());
  const response = await saved;
  assert.equal(response.status(), 200);
  assert.ok(response.request().headers()['x-csrf-token'], 'the save carries the token header');
  assert.deepEqual(refused, []);
  assert.deepEqual(errors, []);
  await close();
});

test('a forged cross-site form post is refused', async () => {
  const { page, close } = await signedIn();
  // a page elsewhere posting to the app with the user's session cookie but no token
  const status = await page.evaluate(async (base) => {
    const res = await fetch(base + '/resetData', { method: 'POST', headers: { 'content-type': 'application/x-www-form-urlencoded', 'X-CSRF-Token': 'forged' }, body: '' });
    return res.status;
  }, web.base);
  assert.equal(status, 403);
  await close();
});
