// The model editor's Problems list: bpmn-server's checks (verifyModel) on the model being edited, marked on
// the canvas and in the properties panel, and an issue takes the user to its field.
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

/** The leave-request model with three errors: a task script, a 'start' script and an expression. */
async function brokenModel(name) {
    const xml = fs.readFileSync(path.join(FIXTURES, 'leave-request.bpmn'), 'utf8')
        .replace("data.approvedBy = 'system';", 'data.approvedBy = ;')
        .replace('camunda:candidateGroups="staff">', 'camunda:candidateGroups="staff" camunda:candidateUsers="$data.((">')
        .replace('<camunda:formData>',
            '<camunda:executionListener event="start"><camunda:script scriptFormat="JavaScript">this.data.x = (;</camunda:script></camunda:executionListener><camunda:formData>');
    fs.writeFileSync(path.join(web.definitionsPath, name + '.bpmn'), xml);
    await web.bpmnServer.definitions.rebuild();
    return name;
}

async function openEditor(model, userName = 'admin') {
    const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    await context.route('**/*', route => route.request().url().startsWith(web.base) ? route.continue() : route.abort());
    const page = await context.newPage();
    page.setDefaultTimeout(20000);
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    await page.goto(web.base + '/login');
    await page.fill('#userName', userName);
    await page.fill('#password', PASSWORD);
    await Promise.all([page.waitForURL(url => !url.pathname.startsWith('/login')), page.click('button[type=submit]')]);
    await page.goto(`${web.base}/model/edit/${model}`);
    await page.waitForSelector('#js-problems-counts .count, #js-problems-status:text("No problems")');
    return { page, errors, close: () => context.close() };
}

const issues = page => page.locator('#js-problems .problem');
const errorItems = page => page.locator('#js-problems .problem.severity-error');
/** The listed error whose message matches. */
const errorItem = (page, message) => errorItems(page).filter({ has: page.locator('.message', { hasText: message }) });
const selectedIds = page => page.evaluate(() => window.bpmnModeler.get('selection').get().map(e => e.id));

test('a model without errors lists none', async () => {
    const { page, errors, close } = await openEditor('leave-request');
    assert.equal(await errorItems(page).count(), 0);
    assert.equal(await page.locator('#js-problems-counts .count.severity-error').count(), 0, 'no error count shown');
    assert.deepEqual(errors, []);
    await close();
});

test('errors are listed and their elements marked', async () => {
    const { page, errors, close } = await openEditor(await brokenModel('broken-list'));
    const messages = await errorItems(page).locator('.message').allInnerTexts();
    assert.equal(messages.length, 3, messages.join('\n'));
    assert.ok(messages.some(m => /'start' script does not compile/.test(m)));
    assert.ok(messages.some(m => /candidateUsers expression does not compile/.test(m)));
    assert.ok(messages.some(m => /^The script does not compile/.test(m)));
    assert.equal(await page.locator('#js-problems-counts .count.severity-error').innerText(), '3');

    for (const [id, count] of [['Submit', '2'], ['AutoApprove', '1']]) {
        assert.equal(await page.locator(`.djs-element.problem-error[data-element-id="${id}"]`).count(), 1, id + ' outlined');
        assert.equal(await page.locator(`.djs-overlays[data-container-id="${id}"] .problem-badge`).innerText(), count, id + ' badge');
    }
    assert.deepEqual(errors, []);
    await close();
});

test('an issue selects its element and opens its field, marked in the panel', async () => {
    const { page, errors, close } = await openEditor(await brokenModel('broken-reveal'));
    const cases = [
        [/'start' script/, 'Submit', 'bio-properties-panel-Submit-script-0-script'],
        [/candidateUsers/, 'Submit', 'bio-properties-panel-assignment-candidateUsers'],
        [/^The script/, 'AutoApprove', 'bio-properties-panel-script-body']
    ];
    for (const [message, element, field] of cases) {
        await errorItem(page, message).click();
        await page.waitForFunction(id => document.activeElement?.id === id, field);
        assert.deepEqual(await selectedIds(page), [element]);
        const entry = page.locator(`[data-entry-id="${field.replace('bio-properties-panel-', '')}"]`);
        assert.match(await entry.getAttribute('class'), /has-error/, field + ' marked');
        assert.match(await entry.innerText(), /does not compile/);
    }
    assert.deepEqual(errors, []);
    await close();
});

test('condition and timer issues open their fields', async () => {
    const SAMPLES = path.join(FIXTURES, '..', '..', 'processes');
    const cases = [
        ['Buy Used Car.bpmn', s => s.replace('$(item.data.needsCleaning=="Yes")', '$(item.data.needsCleaning=="Yes"'),
            /condition expression/, 'flow_gw1_clean', 'bio-properties-panel-conditionExpression'],
        ['Invoice.bpmn.bpmn', s => s.replace('<bpmn2:timeDuration>PT2S<', '<bpmn2:timeDuration>soon<'),
            /Timer duration 'soon'/, 'event_timer', 'bio-properties-panel-timerEventDefinitionValue']
    ];
    for (const [file, change, message, element, field] of cases) {
        const name = 'broken-' + element;
        fs.writeFileSync(path.join(web.definitionsPath, name + '.bpmn'), change(fs.readFileSync(path.join(SAMPLES, file), 'utf8')));
        await web.bpmnServer.definitions.rebuild();
        const { page, close } = await openEditor(name);
        await errorItem(page, message).click();
        await page.waitForFunction(id => document.activeElement?.id === id, field);
        assert.deepEqual(await selectedIds(page), [element]);
        await close();
    }
});

test('an issue shows the properties panel when it is hidden', async () => {
    const { page, close } = await openEditor(await brokenModel('broken-hidden'));
    await page.click('#js-panel-toggle');
    assert.equal(await page.locator('#js-properties-panel').isVisible(), false);
    await errorItem(page, /^The script/).click();
    await page.waitForFunction(() => document.activeElement?.id === 'bio-properties-panel-script-body');
    assert.equal(await page.locator('#js-properties-panel').isVisible(), true);
    await close();
});

test('fixing the field clears the issue', async () => {
    const { page, errors, close } = await openEditor(await brokenModel('broken-fix'));
    await errorItem(page, /^The script/).click();
    await page.waitForFunction(() => document.activeElement?.id === 'bio-properties-panel-script-body');
    await page.fill('#bio-properties-panel-script-body', "data.approvedBy = 'system';");
    await page.waitForFunction(() => document.querySelectorAll('#js-problems .problem.severity-error').length === 2);
    assert.equal(await page.locator('.djs-element.problem-error[data-element-id="AutoApprove"]').count(), 0, 'no longer outlined');
    assert.match(await page.locator('[data-entry-id="script-body"]').getAttribute('class'), /^(?!.*has-error)/);
    assert.deepEqual(errors, []);
    await close();
});

test('a designer gets the same checks', async () => {
    const { page, errors, close } = await openEditor(await brokenModel('broken-designer'), 'designer');
    assert.equal(await errorItems(page).count(), 3);
    await errorItem(page, /candidateUsers/).click();
    await page.waitForFunction(() => document.activeElement?.id === 'bio-properties-panel-assignment-candidateUsers');
    assert.deepEqual(errors, []);
    await close();
});

test('Problems and Report are tabs under the diagram: resized, hidden, and remembered', async () => {
    const { page, close } = await openEditor(await brokenModel('broken-dock'));
    const body = () => page.locator('.dock-body').boundingBox();
    assert.equal(Math.round((await body()).height), 220, 'default height');
    assert.equal(await page.getAttribute('#js-tab-problems', 'aria-selected'), 'true');

    // drag the handle up: taller dock, shorter canvas
    const canvasBefore = (await page.locator('#js-canvas').boundingBox()).height;
    const handle = await page.locator('#js-dock-resizer').boundingBox();
    await page.mouse.move(handle.x + 200, handle.y + 2);
    await page.mouse.down();
    await page.mouse.move(handle.x + 200, handle.y + 2 - 100, { steps: 5 });
    await page.mouse.up();
    assert.equal(Math.round((await body()).height), 320);
    assert.ok((await page.locator('#js-canvas').boundingBox()).height < canvasBefore - 90, 'the canvas gives the room');

    // the Report tab, then hide the dock
    await page.click('#js-tab-report');
    await page.waitForSelector('.report-element');
    assert.equal(await issues(page).first().isVisible(), false, 'the problems list is behind its tab');
    await page.click('#js-dock-toggle');
    assert.equal(await page.locator('.dock-body').isVisible(), false);
    assert.equal(await page.getAttribute('#js-dock-toggle', 'aria-expanded'), 'false');

    // remembered: hidden, on Report, 320px; a tab opens it again
    await page.reload();
    await page.waitForSelector('#js-problems-counts .count');
    assert.equal(await page.locator('.dock-body').isVisible(), false);
    await page.click('#js-tab-report');
    await page.waitForSelector('.report-element');
    assert.equal(Math.round((await body()).height), 320);
    await page.click('#js-tab-problems');
    assert.equal(await issues(page).first().isVisible(), true);
    await close();
});
