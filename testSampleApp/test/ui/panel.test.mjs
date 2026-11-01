// The properties panel shaped for bpmn-server: conditions, loops, forms and process settings offer what the
// engine runs, saved as it reads them, and Camunda settings it does not run are listed under Problems.
//   npm run test:ui
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright';
import { startWebApp, PASSWORD, FIXTURES } from '../support/webApp.mjs';

const SAMPLES = path.join(FIXTURES, '..', '..', 'processes');

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

/** A copy of a model (a sample of processes/, or XML) under a new name. */
async function addModel(name, { sample, xml }) {
    xml ??= fs.readFileSync(path.join(SAMPLES, sample + '.bpmn'), 'utf8');
    fs.writeFileSync(path.join(web.definitionsPath, name + '.bpmn'), xml);
    await web.bpmnServer.definitions.rebuild();
    return name;
}

async function openEditor(model) {
    const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
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
    await page.waitForSelector('#js-problems-counts .count, #js-problems-status:text("No problems")');
    return { page, errors, close: () => context.close() };
}

const select = (page, id) => page.evaluate(id => {
    document.activeElement?.blur();
    const registry = window.bpmnModeler.get('elementRegistry');
    const element = registry.get(id) || registry.find(e => e.businessObject?.processRef?.id === id);
    window.bpmnModeler.get('selection').select(element);
}, id);
const groupHeader = (page, label) => page.locator('.bio-properties-panel-group-header', { hasText: label }).first();
const groupTitles = page => page.locator('.bio-properties-panel-group-header-title').allInnerTexts();
async function openGroup(page, label) {
    const header = groupHeader(page, label);
    if (!/\bopen\b/.test(await header.getAttribute('class')))
        await header.click();
}

async function save(page, model) {
    const saved = page.waitForResponse(r => r.request().method() === 'POST' && r.url().endsWith(`/model/edit/${model}`));
    await page.click('#js-save');
    assert.equal((await saved).status(), 200);
    return web.bpmnServer.definitions.getSource(model);
}

test('a flow condition is one JavaScript expression', async () => {
    const model = await addModel('panel-condition', { xml: fs.readFileSync(path.join(FIXTURES, '..', 'fixtures', 'buy-used-car.bpmn'), 'utf8') });     // the tests' copy of the sample
    const { page, errors, close } = await openEditor(model);
    await select(page, 'flow_gw1_clean');
    await openGroup(page, 'Condition');
    const field = page.locator('#bio-properties-panel-conditionExpression');
    assert.equal(await field.innerText(), '$(item.data.needsCleaning=="Yes")');
    // no condition type or script resource to choose; the language the file names is shown
    assert.deepEqual(await page.locator('#js-properties-panel select').evaluateAll(els => els.map(e => e.id)), ['bio-properties-panel-conditionLanguage']);
    assert.equal(await page.inputValue('#bio-properties-panel-conditionLanguage'), 'JavaScript');
    await field.fill('data.needsCleaning == "No"');
    const xml = await save(page, model);
    assert.match(xml, /<bpmn2?:sequenceFlow id="flow_gw1_clean"[^>]*>\s*<bpmn2?:conditionExpression[^>]*>data.needsCleaning == "No"<\/bpmn2?:conditionExpression>/);
    assert.deepEqual(errors, []);
    await close();
});

test('a multi-instance task offers its collection only', async () => {
    const model = await addModel('panel-loop', { sample: 'Users Vote' });
    const { page, errors, close } = await openEditor(model);
    await select(page, 'Activity_A');
    await openGroup(page, 'Multi-instance');
    const group = page.locator('.bio-properties-panel-group', { has: groupHeader(page, 'Multi-instance') });
    assert.deepEqual(await group.locator('[data-entry-id]').evaluateAll(els => els.map(e => e.dataset.entryId)), ['multiInstance-collection']);
    await page.fill('#bio-properties-panel-multiInstance-collection', '$data.voters');
    const xml = await save(page, model);
    assert.match(xml, /multiInstanceLoopCharacteristics[^>]*camunda:collection="\$data.voters"/);
    assert.deepEqual(errors, []);
    await close();
});

test('form fields are started on a task that has none', async () => {
    const model = await addModel('panel-form', { sample: 'Users Vote' });
    const { page, errors, close } = await openEditor(model);
    await select(page, 'Activity_A');
    assert.ok((await groupTitles(page)).includes('Form'));
    await groupHeader(page, 'Form fields').locator('.bio-properties-panel-add-entry').click();
    await page.waitForFunction(() => window.bpmnModeler.get('elementRegistry').get('Activity_A').businessObject
        .extensionElements?.values.some(v => v.$type === 'camunda:FormData'));
    const header = await groupHeader(page, 'Form fields').innerText();
    assert.equal(header.replace(/\s+/g, ' ').trim(), 'Form fields 1', "Camunda's list takes over");
    const xml = await save(page, model);
    assert.match(xml, /<camunda:formData>\s*<camunda:formField id="field1" label="" type="string" \/>\s*<\/camunda:formData>/);
    assert.deepEqual(errors, []);
    await close();
});

test('process settings bpmn-server does not use are not offered, but shown and listed when set', async () => {
    // not offered on a process that does not set them
    const plain = await addModel('panel-process-plain', { sample: 'Users Vote' });
    let editor = await openEditor(plain);
    await select(editor.page, 'Process_1');
    let titles = await groupTitles(editor.page);
    for (const hidden of ['Candidate starter', 'History cleanup', 'Tasklist'])
        assert.ok(!titles.includes(hidden), hidden);
    await editor.close();

    const model = await addModel('panel-process', { sample: 'ad hoc' });
    const { page, errors, close } = await openEditor(model);
    await select(page, 'Process_1');
    titles = await groupTitles(page);
    for (const shown of ['Candidate starter', 'History cleanup'])
        assert.ok(titles.includes(shown), shown + ' shown: the file sets it');
    const notes = await page.locator('#js-problems .problem.severity-info[data-code="not-run-by-bpmn-server"] .message').allInnerTexts();
    assert.deepEqual(notes.map(n => n.split(' is ')[0]).sort(), ['Candidate starter groups', 'Candidate starter users', 'History time to live']);
    assert.deepEqual(errors, []);
    await close();
});

test('Camunda settings bpmn-server does not run are listed and lead to their element', async () => {
    const xml = fs.readFileSync(path.join(FIXTURES, 'leave-request.bpmn'), 'utf8')
        .replace('<bpmn:userTask id="Approve" name="Approve request"', '<bpmn:userTask id="Approve" name="Approve request" camunda:asyncBefore="true"')
        .replace('<camunda:formData>', '<camunda:taskListener event="create" class="org.example.Notify" /><camunda:formData>');
    const model = await addModel('panel-unsupported', { xml });
    const { page, errors, close } = await openEditor(model);
    const warnings = page.locator('#js-problems .problem.severity-warning[data-code="not-run-by-bpmn-server"]');
    const texts = await warnings.allInnerTexts();
    assert.ok(texts.some(t => /Asynchronous before is a Camunda setting bpmn-server does not run/.test(t) && /Approve request/.test(t)), texts.join('\n'));
    assert.ok(texts.some(t => /The 'create' listener has no script/.test(t) && /Submit request/.test(t)), texts.join('\n'));
    await warnings.filter({ hasText: 'Asynchronous before' }).click();
    assert.deepEqual(await page.evaluate(() => window.bpmnModeler.get('selection').get().map(e => e.id)), ['Approve']);
    assert.equal(await page.locator('.djs-element.problem-warning[data-element-id="Approve"]').count(), 1);
    assert.deepEqual(errors, []);
    await close();
});
