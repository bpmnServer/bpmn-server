// @features: catalog
// The model catalog in a browser: filter it, see a model's problems, import it into the editor.
import test from 'node:test';
import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';
import { startWebApp, PASSWORD } from '../support/webApp.mjs';

const CATALOG = fileURLToPath(new URL('../fixtures/catalog/', import.meta.url));
let web, browser;
test.before(async () => {
  web = await startWebApp({ env: { CATALOG_URL: CATALOG } });
  browser = await chromium.launch();
});
test.after(async () => {
  await browser?.close();
  await web?.stop();
  setImmediate(() => process.exit(0));
});

test('filter the catalog, read a model\'s problems, import one into the editor', async () => {
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  await context.route('**/*', route => route.request().url().startsWith(web.base) ? route.continue() : route.abort());
  const page = await context.newPage();
  const problems = [];
  page.on('pageerror', e => problems.push(e.message));
  page.on('response', r => r.status() >= 400 && problems.push(`${r.status()} ${new URL(r.url()).pathname}`));
  await page.goto(web.base + '/login');
  await page.fill('#userName', 'designer');
  await page.fill('#password', PASSWORD);
  await Promise.all([page.waitForURL(url => !url.pathname.startsWith('/login')), page.click('button[type=submit]')]);

  await page.goto(web.base + '/dashboard/catalog');
  assert.equal(await page.locator('.catalog-entry:visible').count(), 2);
  await page.selectOption('#catalog-tag', 'test');
  assert.equal(await page.locator('.catalog-entry:visible').count(), 1);
  const badge = page.locator('#catalog-tampered .dash-badge.is-error');
  assert.ok(await badge.isVisible(), 'the error badge shows');
  assert.equal(await badge.innerText(), '1 error');
  await page.selectOption('#catalog-tag', '');
  await page.fill('#catalog-search', 'greeting');
  assert.equal(await page.locator('.catalog-entry:visible').count(), 1);

  await Promise.all([page.waitForURL(/\/model\/edit\/Hello$/), page.locator('#catalog-hello button[type=submit]').click()]);
  await page.waitForSelector('#js-canvas .djs-shape');
  assert.deepEqual(problems, []);
  await context.close();
});
