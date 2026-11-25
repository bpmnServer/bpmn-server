// @features: list-columns
// The column picker in a browser (views/includes/listColumns.pug, javascripts/list-columns.js): ← moves a column,
// unchecking hides one, Show sends them in their order, and the list follows.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright';
import { startWebApp, PASSWORD, FIXTURES } from '../support/webApp.mjs';

let web, browser;
test.before(async () => {
    web = await startWebApp();
    fs.copyFileSync(path.join(FIXTURES, 'Buy Used Car.bpmn'), path.join(web.definitionsPath, 'Buy Used Car.bpmn'));
    await web.bpmnServer.engine.start('Buy Used Car', { carModel: 'Civic' }, null, 'staff');
    browser = await chromium.launch();
});
test.after(async () => {
    await browser?.close();
    await web?.stop();
    setImmediate(() => process.exit(0));
});

test('the picker: Case moved first, Ended hidden; the list shows them so', async () => {
    const context = await browser.newContext({ viewport: { width: 1300, height: 900 } });
    await context.route('**/*', route => route.request().url().startsWith(web.base) ? route.continue() : route.abort());
    const page = await context.newPage();
    page.setDefaultTimeout(20000);
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    await page.goto(web.base + '/login');
    await page.fill('#userName', 'admin');
    await page.fill('#password', PASSWORD);
    await Promise.all([page.waitForURL(url => !url.pathname.startsWith('/login')), page.click('button[type=submit]')]);
    await page.goto(`${web.base}/?columns_set=1#instances`);
    const picker = page.locator('#instances details.list-columns');
    await picker.locator('summary').click();
    await picker.getByRole('button', { name: 'Move Case left' }).click();
    await picker.locator('input[value="@ended"]').uncheck();
    if (process.env.SHOT) await picker.screenshot({ path: process.env.SHOT });
    await Promise.all([page.waitForURL(/columns_layout=1/), picker.getByRole('button', { name: 'Show' }).click()]);
    await page.waitForSelector('#instances table th');
    const headings = (await page.locator('#instances table').last().locator('th').allInnerTexts()).map(t => t.replace(/[↕▲▼]/g, '').trim()).filter(Boolean);
    assert.deepEqual(headings.slice(0, 3), ['Case', 'Process', 'Started']);
    assert.ok(!headings.includes('Ended'), headings.join(', '));
    assert.deepEqual(errors, []);
    await context.close();
});
