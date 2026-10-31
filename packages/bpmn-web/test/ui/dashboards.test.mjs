// The dashboards in a browser: each opens without failed requests or page errors, and a process
// starts from the start form.   npm run test:ui
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright';
import { fileURLToPath } from 'node:url';
import { startWebApp, PASSWORD } from '../support/webApp.mjs';

const SHOTS = fileURLToPath(new URL('./screenshots/', import.meta.url));
let web, browser;
test.before(async () => {
  web = await startWebApp();
  browser = await chromium.launch();
  fs.mkdirSync(SHOTS, { recursive: true });
});
test.after(async () => {
  await browser?.close();
  await web?.stop();
  setImmediate(() => process.exit(0));
});

async function signIn(userName, width = 1440) {
  const context = await browser.newContext({ viewport: { width, height: 900 } });
  await context.route('**/*', route => route.request().url().startsWith(web.base) ? route.continue() : route.abort());
  const page = await context.newPage();
  const problems = [];
  page.on('pageerror', e => problems.push(e.message));
  page.on('response', r => r.status() >= 400 && problems.push(`${r.status()} ${new URL(r.url()).pathname}`));
  await page.goto(web.base + '/login');
  await page.fill('#userName', userName);
  await page.fill('#password', PASSWORD);
  await Promise.all([page.waitForURL(url => !url.pathname.startsWith('/login')), page.click('button[type=submit]')]);
  return { page, problems, close: () => context.close() };
}

test('a user starts a process from the start form and finds its task', async () => {
  const { page, problems, close } = await signIn('staff');
  await page.goto(web.base + '/dashboard');
  const start = page.locator('#start-events details', { hasText: 'leave-request' }).first();
  await start.locator('summary').click();
  await Promise.all([page.waitForURL(/\/instanceDetails\?id=/), start.locator('button[type=submit]').click()]);
  // the instance page's own requests are not the dashboard's (it asks /model for the diagram, a designer route)
  await page.waitForLoadState('networkidle');
  problems.length = 0;
  await page.goto(web.base + '/dashboard');
  assert.match(await page.locator('#available-tasks').innerText(), /Submit request/);
  await page.screenshot({ path: path.join(SHOTS, 'dashboard-user.png'), fullPage: true });
  assert.deepEqual(problems, []);
  await close();
});

test('the design and administration dashboards open', async () => {
  const { page, problems, close } = await signIn('admin');
  await page.goto(web.base + '/dashboard/design');
  assert.ok(await page.locator('#models tr').count() > 1, 'the models');
  await page.screenshot({ path: path.join(SHOTS, 'dashboard-design.png'), fullPage: true });
  await page.goto(web.base + '/dashboard/admin');
  assert.match(await page.locator('#users').innerText(), /admin/);
  await page.screenshot({ path: path.join(SHOTS, 'dashboard-admin.png'), fullPage: true });
  assert.deepEqual(problems, []);
  await close();
});

test('the dashboards fit a phone', async () => {
  const { page, problems, close } = await signIn('admin', 390);
  for (const url of ['/dashboard', '/dashboard/design', '/dashboard/admin']) {
    await page.goto(web.base + url);
    const overflow = await page.evaluate(() => document.querySelector('main.dash').scrollWidth - document.querySelector('main.dash').clientWidth);
    assert.ok(overflow <= 1, `${url} scrolls sideways by ${overflow}px`);
  }
  assert.deepEqual(problems, []);
  await close();
});
