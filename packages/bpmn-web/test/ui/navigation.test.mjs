// Getting around the editor: the model drop-down opens another model, the element drop-down shows and selects
// an element (and follows the selection), the properties panel opens the groups that have values, and a field's
// description shows on hover.   npm run test:ui
import test from 'node:test';
import assert from 'node:assert/strict';
import { chromium } from 'playwright';
import { startWebApp, PASSWORD } from '../support/webApp.mjs';

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

async function openEditor(model) {
    const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    await context.route('**/*', route => route.request().url().startsWith(web.base) ? route.continue() : route.abort());
    const page = await context.newPage();
    page.setDefaultTimeout(20000);
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    await page.goto(web.base + '/login');
    await page.fill('#userName', 'designer');
    await page.fill('#password', PASSWORD);
    await Promise.all([page.waitForURL(url => !url.pathname.startsWith('/login')), page.click('button[type=submit]')]);
    await page.goto(`${web.base}/model/edit/${model}`);
    await page.waitForSelector('#js-canvas .djs-shape');
    return { page, errors, close: () => context.close() };
}

const selected = page => page.evaluate(() => window.bpmnModeler.get('selection').get().map(e => e.id));

test('the model drop-down opens another model', async () => {
    const { page, errors, close } = await openEditor('leave-request');
    await page.waitForFunction(() => document.querySelectorAll('#js-model-picker option').length > 1);
    const models = await page.locator('#js-model-picker option').allInnerTexts();
    assert.ok(models.includes('leave-request') && models.includes('simple'), models.join());
    assert.equal(await page.locator('#js-model-picker').inputValue(), 'leave-request');
    await Promise.all([page.waitForURL(/\/model\/edit\/simple$/), page.selectOption('#js-model-picker', 'simple')]);
    await page.waitForSelector('#js-canvas .djs-shape');
    assert.equal(await page.locator('#js-model-picker').inputValue(), 'simple');
    assert.deepEqual(errors, []);
    await close();
});

test('the element drop-down selects an element, and follows the selection', async () => {
    const { page, errors, close } = await openEditor('leave-request');
    const options = await page.locator('#js-element-picker option').allInnerTexts();
    assert.ok(options.includes('Submit request (Submit)') && options.includes('More than 5 days? (LongLeave)'), options.join(' | '));
    await page.selectOption('#js-element-picker', 'Approve');
    assert.deepEqual(await selected(page), ['Approve']);

    await page.evaluate(() => { const m = window.bpmnModeler; m.get('selection').select(m.get('elementRegistry').get('Submit')); });
    assert.equal(await page.locator('#js-element-picker').inputValue(), 'Submit');

    // a renamed element is listed by its new name
    await page.evaluate(() => { const m = window.bpmnModeler; m.get('modeling').updateProperties(m.get('elementRegistry').get('Submit'), { name: 'Send it' }); });
    await page.waitForFunction(() => [...document.querySelectorAll('#js-element-picker option')].some(o => o.textContent === 'Send it (Submit)'));
    assert.deepEqual(errors, []);
    await close();
});

test('the properties panel opens the groups that have values; a description shows on hover', async () => {
    const { page, errors, close } = await openEditor('leave-request');
    await page.selectOption('#js-element-picker', 'Submit');
    // Submit has a candidate group and form fields: their groups open by themselves
    await page.waitForFunction(() => [...document.querySelectorAll('#js-properties-panel .bio-properties-panel-group-header.open')].length > 0);
    await page.waitForTimeout(700);      // the panel settles: groups open while it does
    const groups = await page.locator('#js-properties-panel .bio-properties-panel-group-header').evaluateAll(hs => hs.map(h => ({
        title: h.querySelector('.bio-properties-panel-group-header-title')?.textContent?.trim(),
        set: !!h.querySelector('.bio-properties-panel-dot'), open: h.classList.contains('open'),
    })));
    for (const g of groups.filter(g => g.set))
        assert.equal(g.open, true, `${g.title} has values: open`);
    assert.ok(groups.some(g => !g.set && !g.open), 'a group without values stays closed');

    const description = page.locator('#js-properties-panel .bio-properties-panel-entry .bio-properties-panel-description').first();
    if (await description.count()) {
        assert.equal(await description.isVisible(), false, 'hidden until hovered');
        await description.locator('xpath=ancestor::div[contains(@class, "bio-properties-panel-entry")][1]').hover();
        assert.equal(await description.isVisible(), true, 'shown on hover');
    }
    assert.deepEqual(errors, []);
    await close();
});

const behaviour = page => page.locator('#js-element-behaviour').innerText();

test('above the properties panel: what the selected element does, when it starts and completes', async () => {
    const { page, errors, close } = await openEditor('leave-request');
    assert.match(await behaviour(page), /The process/);

    await page.selectOption('#js-element-picker', 'LongLeave');
    const gateway = await behaviour(page);
    assert.match(gateway, /Controls the flow of the process: this gateway splits\./);
    assert.match(gateway, /type\s*bpmn:ExclusiveGateway/);
    assert.match(gateway, /Completes\s*Completes as soon as it arrives/);
    assert.match(gateway, /Takes one flow: the first whose condition holds, else its default flow\./);

    await page.selectOption('#js-element-picker', 'Submit');
    const task = await behaviour(page);
    assert.match(task, /type\s*bpmn:UserTask/);
    assert.match(task, /Starts\s*When a flow arrives at it/);
    assert.match(task, /Completes\s*When a user completes it/);
    assert.deepEqual(errors, []);
    await close();
});

test('a joining gateway: its behaviour follows its flows', async () => {
    const { layoutProcess } = await import('bpmn-auto-layout');
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<bpmn:definitions xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" id="d" targetNamespace="urn:test">
  <bpmn:process id="P" isExecutable="true">
    <bpmn:startEvent id="S"><bpmn:outgoing>f1</bpmn:outgoing></bpmn:startEvent>
    <bpmn:parallelGateway id="Split"><bpmn:incoming>f1</bpmn:incoming><bpmn:outgoing>f2</bpmn:outgoing><bpmn:outgoing>f3</bpmn:outgoing></bpmn:parallelGateway>
    <bpmn:task id="A"><bpmn:incoming>f2</bpmn:incoming><bpmn:outgoing>f4</bpmn:outgoing></bpmn:task>
    <bpmn:task id="B"><bpmn:incoming>f3</bpmn:incoming><bpmn:outgoing>f5</bpmn:outgoing></bpmn:task>
    <bpmn:parallelGateway id="Join"><bpmn:incoming>f4</bpmn:incoming><bpmn:incoming>f5</bpmn:incoming><bpmn:outgoing>f6</bpmn:outgoing></bpmn:parallelGateway>
    <bpmn:endEvent id="E"><bpmn:incoming>f6</bpmn:incoming></bpmn:endEvent>
    <bpmn:sequenceFlow id="f1" sourceRef="S" targetRef="Split" /><bpmn:sequenceFlow id="f2" sourceRef="Split" targetRef="A" />
    <bpmn:sequenceFlow id="f3" sourceRef="Split" targetRef="B" /><bpmn:sequenceFlow id="f4" sourceRef="A" targetRef="Join" />
    <bpmn:sequenceFlow id="f5" sourceRef="B" targetRef="Join" /><bpmn:sequenceFlow id="f6" sourceRef="Join" targetRef="E" />
  </bpmn:process>
</bpmn:definitions>`;
    const fs = await import('node:fs');
    const path = await import('node:path');
    fs.writeFileSync(path.join(web.definitionsPath, 'join-behaviour.bpmn'), await layoutProcess(xml));
    await web.bpmnServer.definitions.rebuild();
    const { page, errors, close } = await openEditor('join-behaviour');
    await page.selectOption('#js-element-picker', 'Join');
    const join = await behaviour(page);
    assert.match(join, /this gateway joins\./);
    assert.match(join, /Starts\s*Waits for all its incoming flows/);
    await page.selectOption('#js-element-picker', 'Split');
    assert.match(await behaviour(page), /Takes every outgoing flow/);
    // a flow (drawn here) says when it is taken
    await page.evaluate(() => { const m = window.bpmnModeler; m.get('selection').select(m.get('elementRegistry').get('f2')); });
    assert.match(await behaviour(page), /Starts\s*When Split completes\s*Completes\s*Taken/);
    assert.deepEqual(errors, []);
    await close();
});
