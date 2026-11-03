// The model editor's History tab (modeler/src/history): every save of the model listed, two versions (or a
// version and the editor's model) compared by their report text and their layout, the history purged.
//   npm run test:ui
import test from 'node:test';
import assert from 'node:assert/strict';
import { chromium } from 'playwright';
import { startWebApp, PASSWORD } from '../support/webApp.mjs';

let web, browser, page;
const errors = [];
test.before(async () => {
    web = await startWebApp();
    browser = await chromium.launch();
    const context = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
    await context.route('**/*', route => route.request().url().startsWith(web.base) ? route.continue() : route.abort());
    page = await context.newPage();
    page.setDefaultTimeout(15000);
    page.on('pageerror', e => errors.push(e.message));
    page.on('dialog', dialog => dialog.accept());
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

/** Changes the model in the editor: the element's name, as the panel would. */
const rename = (id, name) => page.evaluate(([id, name]) => {
    const m = window.bpmnModeler;
    m.get('modeling').updateProperties(m.get('elementRegistry').get(id), { name });
}, [id, name]);
async function save() {
    await page.click('#js-save');
    await page.waitForFunction(() => document.getElementById('js-save-status')?.textContent === 'Saved');
}
/** The History tab's rows: [version, by]. */
const rows = async () => (await page.locator('.history-versions tbody tr').evaluateAll(trs =>
    trs.map(tr => [tr.children[1].textContent, tr.children[3].textContent])));
const tick = version => page.check(`.history-tick[data-version="${version}"]`);

test('each save is listed with who saved it; two versions compared by their report text; a move is in the layout', async () => {
    await page.goto(`${web.base}/model/edit/leave-request`);
    await page.waitForSelector('#js-canvas .djs-shape');
    const task = await page.evaluate(() => window.bpmnModeler.get('elementRegistry').filter(e => e.type === 'bpmn:UserTask')[0].id);
    const before = await page.evaluate(id => window.bpmnModeler.get('elementRegistry').get(id).businessObject.name, task);

    await page.click('#js-tab-history');
    await page.waitForSelector('.history-versions');
    assert.deepEqual(await rows(), [['Current', '']], 'nothing saved yet: the editor\'s model only');
    assert.match(await page.innerText('#js-history'), /No saved versions yet/);

    await rename(task, 'Check the request');
    await save();
    await page.waitForFunction(() => document.querySelectorAll('.history-versions tbody tr').length === 3);
    assert.deepEqual(await rows(), [['Current', ''], ['2', 'designer'], ['1', '']], 'the file as it was, then the save');

    // two ticked: compared, the older first
    assert.equal(await page.isDisabled('.history-compare'), true);
    await tick(2);
    await tick(1);
    await page.click('.history-compare');
    await page.waitForSelector('.history-comparison h4');
    assert.equal(await page.innerText('.history-comparison h4'), 'Version 1 → Version 2');
    // the report's text: the changed line, under the element and the process it is in
    const lines = kind => page.locator(`.history-text .line.${kind}`).allInnerTexts();
    const esc = text => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    assert.ok((await lines('removed')).some(l => new RegExp(`userTask: ${task}, ${esc(before)}$`).test(l.trim())), (await lines('removed')).join('|'));
    assert.ok((await lines('added')).some(l => new RegExp(`userTask: ${task}, Check the request$`).test(l.trim())), (await lines('added')).join('|'));
    assert.ok((await lines('same')).some(l => /process: /.test(l)), 'the process it is in');
    assert.equal(await page.locator('.history-changes.moved').count(), 0, 'the layout did not change');

    // a third ticked: the earliest ticked goes; the editor's model (not saved) against the last save
    await tick('current');
    assert.deepEqual(await page.locator('.history-tick:checked').evaluateAll(b => b.map(x => x.dataset.version)), ['current', '1']);
    await page.uncheck('.history-tick[data-version="1"]');
    await tick(2);
    await page.click('.history-compare');
    await page.waitForFunction(() => document.querySelector('.history-comparison h4')?.textContent === 'Version 2 → Current');
    assert.match(await page.innerText('.history-comparison'), /No differences/);

    await page.evaluate(() => {
        const m = window.bpmnModeler;
        const parent = m.get('elementRegistry').filter(e => e.type === 'bpmn:Participant')[0] || m.get('canvas').getRootElement();
        m.get('modeling').createShape(m.get('elementFactory').createShape({ type: 'bpmn:ServiceTask' }), { x: 700, y: 520 }, parent);
    });
    const shape = await page.evaluate(() => window.bpmnModeler.get('elementRegistry').filter(e => e.type === 'bpmn:StartEvent')[0].id);
    await page.evaluate(id => { const m = window.bpmnModeler; m.get('modeling').moveElements([m.get('elementRegistry').get(id)], { x: 0, y: 40 }); }, shape);
    await page.click('.history-compare');
    await page.waitForSelector('.history-changes.moved');
    assert.ok((await lines('added')).some(l => /^\s*serviceTask: \S+$/.test(l.replace(/^\+ /, ''))), (await lines('added')).join('|'));
    assert.match(await page.innerText('.history-changes.moved'), new RegExp(shape), 'moved: in the layout, not in the text');
    // the moved element's link selects it on the diagram
    await page.click(`.history-changes.moved .history-element[data-id="${shape}"]`);
    assert.deepEqual(await page.evaluate(() => window.bpmnModeler.get('selection').get().map(e => e.id)), [shape]);
});

test('a save that changes nothing adds no version; Purge history empties the list', async () => {
    await save();       // the changes of the test before
    await page.waitForFunction(() => document.querySelectorAll('.history-versions tbody tr').length === 4);
    await save();
    await page.waitForTimeout(500);
    assert.equal((await rows()).length, 4, 'unchanged: no new version');
    await page.click('.history-purge');
    await page.waitForFunction(() => document.querySelectorAll('.history-versions tbody tr').length === 1);
    assert.match(await page.innerText('#js-history'), /No saved versions yet/);
    assert.equal(await page.isDisabled('.history-purge'), true);
    assert.deepEqual(errors, []);
});
