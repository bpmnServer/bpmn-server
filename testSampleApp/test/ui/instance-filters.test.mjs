// The instance page's filters: a type of element, then an element of it; the items, the Rationale and the logs
// show only their rows.
//   npm run test:ui
import test from 'node:test';
import assert from 'node:assert/strict';
import { chromium } from 'playwright';
import { startWebApp, PASSWORD } from '../support/webApp.mjs';

let web, browser, instanceId;
test.before(async () => {
    web = await startWebApp();
    browser = await chromium.launch();
    const { instance } = await web.bpmnServer.engine.start('leave-request', {});
    await web.bpmnServer.engine.invoke({ id: instance.id, 'items.elementId': 'Submit' }, { days: 10 }, 'admin');
    instanceId = instance.id;
});
test.after(async () => {
    await browser?.close();
    await web?.stop();
    setImmediate(() => process.exit(0));
});

async function openInstance() {
    const context = await browser.newContext({ viewport: { width: 1400, height: 1000 } });
    await context.route('**/*', route => route.request().url().startsWith(web.base) ? route.continue() : route.abort());
    const page = await context.newPage();
    page.setDefaultTimeout(20000);
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    await page.goto(web.base + '/login');
    await page.fill('#userName', 'admin');
    await page.fill('#password', PASSWORD);
    await Promise.all([page.waitForURL(url => !url.pathname.startsWith('/login')), page.click('button[type=submit]')]);
    await page.goto(`${web.base}/instanceDetails?id=${instanceId}`);
    await page.click('#showHide');           // the logs, open
    return { page, errors, close: () => context.close() };
}

const visible = (page, selector) => page.locator(selector).evaluateAll(trs => trs.filter(tr => !tr.hidden).map(tr => tr.dataset.element ?? tr.textContent));

test('a type shows its elements in the items and the Rationale, and the log lines that name them', async () => {
    const { page, errors, close } = await openInstance();
    // at first: the user tasks; the Rationale closed
    assert.equal(await page.inputValue('#filter-type'), 'bpmn:UserTask');
    assert.equal(await page.locator('#rationale').isHidden(), true);
    await page.click('#showRationale');
    assert.equal(await page.locator('#rationale').isVisible(), true);
    assert.deepEqual(await visible(page, '#dataTable tbody tr[data-element]'), ['Submit', 'Approve']);
    assert.deepEqual([...new Set(await visible(page, '.rationale-table tbody tr[data-element]'))], ['Submit', 'Approve']);
    const options = await page.locator('#filter-element option').evaluateAll(os => os.filter(o => !o.hidden).map(o => o.value));
    assert.deepEqual(options, ['', 'Submit', 'Approve'], 'the elements of the type');
    assert.match(await page.locator('#filter-count').innerText(), /^2 of \d+ items$/);
    const logs = await visible(page, '#logs tr.log-row');
    assert.ok(logs.length > 0 && logs.every(l => /\bSubmit\b|\bApprove\b/.test(l)), 'only lines that name them');

    await page.selectOption('#filter-element', 'Submit');
    assert.deepEqual(await visible(page, '#dataTable tbody tr[data-element]'), ['Submit']);
    assert.ok((await visible(page, '#logs tr.log-row')).every(l => /\bSubmit\b/.test(l) && !/'Approve'/.test(l)));

    await page.click('#filter-clear');
    const allItems = await visible(page, '#dataTable tbody tr[data-element]');
    assert.ok(allItems.length >= 7, allItems.join());
    assert.equal(await page.locator('#filter-count').innerText(), '');
    assert.deepEqual(errors, []);
    await close();
});

test('a flow: the gateway\'s choice of it is not its row, its condition is', async () => {
    const { page, close } = await openInstance();
    await page.click('#filter-clear');
    await page.click('#showRationale');
    await page.selectOption('#filter-element', 'ToApprove');
    const rows = await page.locator('.rationale-table tbody tr').evaluateAll(trs => trs.filter(tr => !tr.hidden).map(tr => tr.innerText.replace(/\s+/g, ' ').trim()));
    assert.ok(rows.some(r => /flow 'yes' \(ToApprove\) taken .*result: true \(days=10\)/.test(r)), rows.join('\n'));
    assert.ok(rows.every(r => /ToApprove/.test(r)));
    await close();
});

test('the diagram numbers its elements by their items\' seq, as the items table; the replay runs', async () => {
    const { page, errors, close } = await openInstance();
    // the shapes' items (a flow has no badge)
    const seqs = await page.locator('#dataTable tbody tr[data-element]').evaluateAll(trs => trs
        .filter(tr => !/bpmn:SequenceFlow/.test(tr.innerText)).map(tr => tr.cells[0].innerText.trim()));
    await page.waitForSelector('[id^="seq_"]', { state: 'attached' });
    const badges = await page.locator('[id^="seq_"]').evaluateAll(els => els.map(e => e.id.slice(4)));
    assert.deepEqual([...badges].sort((a, b) => a - b), [...seqs].sort((a, b) => a - b), 'a badge per item, by its seq');
    const submit = await page.locator('#seq_3').evaluate(e => e.textContent.trim());
    assert.equal(submit, '3', "Submit's badge is its seq (from 1)");
    await page.click('#startAnimation');
    await page.waitForFunction(() => /Replay complete/.test(document.getElementById('animationStatus')?.textContent || ''), null, { timeout: 30000 });
    assert.deepEqual(errors, []);
    await close();
});
