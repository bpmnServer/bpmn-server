// The model editor (modeler/src, built into public/modeler): layout, the properties shaped for bpmn-server,
// and that what the panel writes is saved in the form the engine reads.
//   npm run test:ui
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright';
import { startWebApp, PASSWORD, FIXTURES } from '../support/webApp.mjs';

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

/** A copy of the leave-request model under a new name, so each test edits its own. */
async function copyModel(name) {
    fs.copyFileSync(path.join(FIXTURES, 'leave-request.bpmn'), path.join(web.definitionsPath, name + '.bpmn'));
    await web.bpmnServer.definitions.rebuild();
    return name;
}

/** The editor for a model, signed in as admin, in a window of the given size. */
async function openEditor(model, viewport = { width: 1440, height: 900 }) {
    const context = await browser.newContext({ viewport });
    await context.route('**/*', route => route.request().url().startsWith(web.base) ? route.continue() : route.abort());
    const page = await context.newPage();
    page.setDefaultTimeout(20000);
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    await page.goto(web.base + '/login');
    await page.fill('#userName', 'admin');
    await page.fill('#password', PASSWORD);
    await Promise.all([page.waitForURL(url => !url.pathname.startsWith('/login')), page.click('button[type=submit]')]);
    await page.goto(`${web.base}/model/edit/${model}`);
    await page.waitForSelector('#js-canvas .djs-element[data-element-id="Submit"]');
    return { page, errors, context };
}

const box = (page, selector) => page.locator(selector).first().boundingBox();
// as a click on the canvas does: leave the field being edited, then select
const select = (page, id) => page.evaluate(id => {
    document.activeElement?.blur();
    const registry = window.bpmnModeler.get('elementRegistry');
    window.bpmnModeler.get('selection').select(registry.get(id));
}, id);
const groupHeader = (page, label) => page.locator('.bio-properties-panel-group-header', { hasText: label }).first();

/** Open a properties group, unless the editor has (it opens the groups that have values). */
async function openGroup(page, label) {
    const header = page.locator('.bio-properties-panel-group-header', { hasText: label }).first();
    await page.waitForTimeout(100);      // the panel settles: groups with values open
    if (!/\bopen\b/.test(await header.getAttribute('class')))
        await header.click();
}

async function save(page, model) {
    const saved = page.waitForResponse(r => r.request().method() === 'POST' && r.url().endsWith(`/model/edit/${model}`));
    await page.click('#js-save');
    assert.equal((await saved).status(), 200);
    await page.waitForSelector('#js-save-status:text("Saved")');
    return web.bpmnServer.definitions.getSource(model);
}

test('the editor fills the window with the panel beside the diagram', async () => {
    for (const viewport of [{ width: 1440, height: 900 }, { width: 1024, height: 768 }]) {
        const { page, errors, context } = await openEditor('leave-request', viewport);
        const canvas = await box(page, '#js-canvas');
        const panel = await box(page, '#js-properties-panel');
        assert.equal(Math.round(panel.width), 360, 'default panel width');
        assert.ok(canvas.x + canvas.width <= panel.x, 'the panel does not cover the canvas');
        assert.ok(panel.y + panel.height <= viewport.height + 1, 'the panel ends inside the window');
        const scroll = await page.evaluate(() => [document.documentElement.scrollWidth, document.documentElement.scrollHeight]);
        assert.deepEqual(scroll, [viewport.width, viewport.height], 'the page does not scroll');

        // the whole diagram is in view and clear of the palette
        const palette = await box(page, '#js-canvas .djs-palette');
        const shapes = await page.locator('#js-canvas .djs-shape .djs-visual').evaluateAll(els =>
            els.map(el => el.getBoundingClientRect()).map(r => ({ left: r.left, right: r.right, bottom: r.bottom })));
        assert.ok(shapes.length > 0);
        for (const shape of shapes) {
            assert.ok(shape.left >= palette.x + palette.width, 'shape is right of the palette');
            assert.ok(shape.right <= canvas.x + canvas.width + 1 && shape.bottom <= canvas.y + canvas.height + 1, 'shape is in view');
        }
        assert.deepEqual(errors, []);
        await context.close();
    }
});

test('the panel is resized and hidden, and remembers both', async () => {
    const { page, context } = await openEditor('leave-request');
    const resizer = await box(page, '#js-panel-resizer');
    await page.mouse.move(resizer.x + 3, resizer.y + resizer.height / 2);
    await page.mouse.down();
    await page.mouse.move(resizer.x + 3 - 140, resizer.y + resizer.height / 2, { steps: 5 });
    await page.mouse.up();
    assert.equal(Math.round((await box(page, '#js-properties-panel')).width), 500);

    await page.click('#js-panel-toggle');
    assert.equal(await page.locator('#js-properties-panel').isVisible(), false);
    const canvasWide = await box(page, '#js-canvas');
    assert.ok(canvasWide.width > 1400, 'the canvas takes the space');

    await page.reload();
    await page.waitForSelector('#js-canvas .djs-element[data-element-id="Submit"]');
    assert.equal(await page.locator('#js-properties-panel').isVisible(), false, 'still hidden after reload');
    await page.click('#js-panel-toggle');
    assert.equal(Math.round((await box(page, '#js-properties-panel')).width), 500, 'width remembered');
    await context.close();
});

test('a user task shows bpmn-server\'s fields and not Camunda engine ones', async () => {
    const { page, errors, context } = await openEditor('leave-request');
    await select(page, 'Submit');
    const panel = page.locator('#js-properties-panel');
    for (const label of ['General', 'User assignment', 'Scripts'])
        assert.ok(await groupHeader(page, label).isVisible(), label);
    for (const label of ['Asynchronous continuations', 'Job execution', 'External task', 'Extension properties', 'Field injections', 'Task listeners', 'Execution listeners'])
        assert.equal(await panel.getByText(label, { exact: true }).count(), 0, label);
    assert.deepEqual(errors, []);
    await context.close();
});

test('user assignment and start permissions are saved as the engine reads them', async () => {
    const model = await copyModel('edit-assignment');
    const { page, errors, context } = await openEditor(model);

    await select(page, 'Submit');
    await openGroup(page, 'User assignment');
    await page.fill('#bio-properties-panel-assignment-candidateUsers', 'alice,bob');
    await page.fill('#bio-properties-panel-assignment-dueDate', '$data.dueDate');

    const start = await page.evaluate(() => window.bpmnModeler.get('elementRegistry').filter(e => e.type === 'bpmn:StartEvent')[0].id);
    await select(page, start);
    await openGroup(page, 'Who can start');
    await page.fill('#bio-properties-panel-start-candidateGroups', 'staff');

    const xml = await save(page, model);
    assert.match(xml, /<bpmn:userTask id="Submit"[^>]*camunda:candidateUsers="alice,bob"/);
    assert.match(xml, /<bpmn:userTask id="Submit"[^>]*camunda:dueDate="\$data.dueDate"/);
    assert.match(xml, new RegExp(`<bpmn:startEvent id="${start}"[^>]*camunda:candidateGroups="staff"`));

    // the engine reads them back
    const definition = await web.bpmnServer.definitions.load(model);
    const startNode = definition.getNodeById(start);
    assert.equal(startNode.def.$attrs['camunda:candidateGroups'], 'staff');
    assert.deepEqual(errors, []);
    await context.close();
});

test('a script added in the panel runs on its event', async () => {
    const model = await copyModel('edit-scripts');
    const { page, errors, context } = await openEditor(model);
    await select(page, 'Submit');
    await page.locator('.bio-properties-panel-group-header', { hasText: 'Scripts' }).locator('.bio-properties-panel-add-entry').click();
    await page.selectOption('[id$="-script-0-event"] select, select[id$="-script-0-event"]', 'end');
    await page.fill('[id$="-script-0-script"]', 'this.data.scripted = "yes";');
    const xml = await save(page, model);
    assert.match(xml, /<camunda:executionListener event="end">\s*<camunda:script scriptFormat="JavaScript">this.data.scripted = "yes";<\/camunda:script>/);

    const { execution } = await runToEnd(model);
    assert.equal(execution.instance.data.scripted, 'yes');
    assert.deepEqual(errors, []);
    await context.close();
});

/** Start the model and complete its Submit task. */
async function runToEnd(model) {
    const started = await web.bpmnServer.engine.start(model, { days: 1 });
    return { execution: await web.bpmnServer.engine.invoke({ id: started.id, 'items.elementId': 'Submit' }, { days: 1 }) };
}

test('the classic modeler is still there with MODELER=classic', async () => {
    process.env.MODELER = 'classic';
    try {
        const { page, context } = await openEditor('leave-request');
        assert.equal(await page.locator('script[src="/javascripts/modeller-withPropertyPanel.js"]').count(), 1);
        await context.close();
    } finally {
        delete process.env.MODELER;
    }
});

test('after a save, an edit shows the model has unsaved changes', async () => {
    const model = await copyModel('edit-status');
    const { page, context } = await openEditor(model);
    await page.click('#js-save');
    await page.waitForSelector('#js-save-status:text("Saved")');
    await page.evaluate(() => {
        const m = window.bpmnModeler;
        m.get('modeling').updateProperties(m.get('elementRegistry').get('Submit'), { name: 'Changed' });
    });
    assert.equal(await page.locator('#js-save-status').innerText(), 'Unsaved changes');
    await context.close();
});
