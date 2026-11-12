// @features: connector-admin, connector-wizard
// A service task that calls a connector, in the model editor's Service group (properties/ConnectorEntries.jsx):
// Calls (Service or Connector); Connector opens the connector wizard (connectors/Wizard.jsx): the operation found by a
// search, its required inputs filled in from the data of the same name, the parts of the response ticked and named.
// The group then shows what the task calls.
// A service task keeps its Inputs and Outputs groups.
//   npm run test:ui
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright';
import { startWebApp, PASSWORD } from '../support/webApp.mjs';

const APP = path.join(import.meta.dirname, '..', '..');
let web, browser, page;
const errors = [];
test.before(async () => {
    process.env.CONNECTORS_KEY ??= 'a test encryption key';
    web = await startWebApp();
    fs.copyFileSync(path.join(APP, 'processes', 'GitHub repository.bpmn'), path.join(web.definitionsPath, 'GitHub repository.bpmn'));
    await web.bpmnServer.engine.install({ rebuild: true });
    await web.bpmnServer.connectors.add({ id: 'github', document: fs.readFileSync(path.join(APP, 'connectors', 'openapi', 'github.json'), 'utf8') });
    browser = await chromium.launch();
    const context = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
    await context.route('**/*', route => route.request().url().startsWith(web.base) ? route.continue() : route.abort());
    page = await context.newPage();
    page.setDefaultTimeout(20000);
    page.on('pageerror', e => errors.push(e.message));
    page.on('dialog', dialog => dialog.accept());       // leaving a model not saved
    await page.goto(web.base + '/login');
    await page.fill('#userName', 'designer');
    await page.fill('#password', PASSWORD);
    await Promise.all([page.waitForURL(url => !url.pathname.startsWith('/login')), page.click('button[type=submit]')]);
});
test.after(async () => {
    await browser?.close();
    await web?.stop();
    setImmediate(() => process.exit(0));
});

async function openGroup(label) {
    const header = page.locator('.bio-properties-panel-group-header', { hasText: label }).first();
    if (!/\bopen\b/.test(await header.getAttribute('class')))
        await header.click();
}
/** The value of a field once the panel has re-rendered (it does after each change). */
async function valueOf(selector, expected) {
    await page.waitForFunction(([s, v]) => document.querySelector(s)?.value === v, [selector, expected], { timeout: 3000 }).catch(() => { });
    return page.inputValue(selector);
}
const xml = async () => (await page.evaluate(() => window.bpmnModeler.saveXML({ format: true }))).xml;
const groups = () => page.locator('.bio-properties-panel-group-header-title').allInnerTexts();

test('a new service task calls a connector: set up in the wizard, shown in the Service group', async () => {
    await page.goto(`${web.base}/model/edit/leave-request`);
    await page.waitForSelector('#js-canvas .djs-shape');
    await page.waitForFunction(() => window.bpmnModeler?.get('connectors')?.loaded);
    await page.evaluate(() => {
        const m = window.bpmnModeler;
        const parent = m.get('elementRegistry').filter(e => e.type === 'bpmn:Participant')[0] || m.get('canvas').getRootElement();
        const shape = m.get('modeling').createShape(m.get('elementFactory').createShape({ type: 'bpmn:ServiceTask' }), { x: 700, y: 500 }, parent);
        m.get('selection').select(shape);
    });
    // the panel draws the new element, with this group open, a moment after it is selected
    await page.locator('.bio-properties-panel-group-header.open', { hasText: 'Service' }).waitFor();
    assert.deepEqual(await page.locator('#bio-properties-panel-service-calls option').allInnerTexts(), ['Service', 'Connector']);
    assert.equal(await page.locator('#bio-properties-panel-service-name').count(), 1, 'a service by name, as before');
    assert.ok((await groups()).includes('Outputs'), 'a service task keeps its Outputs group');

    // Connector opens the wizard: the operation found by a search, its inputs, the parts of the response kept
    await page.selectOption('#bio-properties-panel-service-calls', 'connector');
    await page.waitForSelector('#js-connector-wizard');
    await page.fill('#connector-wizard-search', 'repos');
    await page.click('[data-operation="github/repos/get"]');
    assert.equal(await page.inputValue('[id="connector-wizard-in-owner"]'), '${data.owner}', 'a required input, from the data');
    assert.equal(await page.inputValue('[id="connector-wizard-in-repo"]'), '${data.repo}');
    await page.click('#connector-wizard-next');
    for (const field of ['', 'description', 'stargazers_count'])
        assert.equal(await page.locator(`[id="connector-wizard-out-${field || 'response'}"]`).count(), 1, field);
    await page.check('[id="connector-wizard-out-stargazers_count"]');
    assert.equal(await page.inputValue('[id="connector-wizard-name-stargazers_count"]'), 'stargazers_count', 'kept under the field\'s name at first');
    await page.fill('[id="connector-wizard-name-stargazers_count"]', 'stars');
    await page.click('#connector-wizard-done');
    await page.waitForSelector('#js-connector-wizard', { state: 'detached' });
    assert.equal(await page.locator('#bio-properties-panel-service-name').count(), 0);
    assert.match(await page.innerText('#connector-summary'), /stargazers_count\s*→\s*stars/);

    const written = await xml();
    assert.match(written, /<camunda:connectorId>github\/repos\/get<\/camunda:connectorId>/);
    assert.match(written, /<camunda:inputParameter name="owner">\$\{data.owner\}<\/camunda:inputParameter>/);
    assert.match(written, /<camunda:inputParameter name="repo">\$\{data.repo\}<\/camunda:inputParameter>/);
    assert.match(written, /<camunda:outputParameter name="stars">\$\{output.stargazers_count\}<\/camunda:outputParameter>/);
    assert.doesNotMatch(written, /outputParameter name="name"/, 'removed');

    await page.selectOption('#bio-properties-panel-service-calls', 'service');
    assert.doesNotMatch(await xml(), /camunda:connector/, 'back to a service: the connector goes');
    assert.deepEqual(errors, []);
});

test('a task that has a connector opens in this group, not Camunda\'s', async () => {
    // a page of its own: the one before has a model not saved, whose leaving prompt would race the navigation
    const before = page;
    page = await before.context().newPage();
    page.setDefaultTimeout(20000);
    page.on('pageerror', e => errors.push(e.message));
    await before.close({ runBeforeUnload: false });
    await page.goto(`${web.base}/model/edit/GitHub repository`);
    await page.waitForFunction(() => window.bpmnModeler?.get('connectors')?.loaded);
    await page.waitForFunction(() => window.bpmnModeler?.get('elementRegistry').get('GetRepo'));
    await page.evaluate(() => { const m = window.bpmnModeler; m.get('selection').select(m.get('elementRegistry').get('GetRepo')); });
    await openGroup('Service');
    assert.equal(await page.locator('#bio-properties-panel-implementationType').count(), 0, 'no Camunda Type select');
    assert.equal(await valueOf('#bio-properties-panel-service-calls', 'connector'), 'connector');
    await page.waitForSelector('#connector-summary');
    const text = (await page.innerText('#connector-summary')).replace(/\s+/g, ' ');
    assert.match(text, /github\/repos\/get/);
    assert.match(text, /owner = \$\{data.owner\}/);
    assert.match(text, /description → description/);
    assert.match(text, /stargazers_count → starsCount/);
    if (process.env.SHOTS)
        await page.locator('#js-properties-panel').screenshot({ path: path.join(process.env.SHOTS, 'connector-panel.png') });
    assert.deepEqual(errors, []);
});
