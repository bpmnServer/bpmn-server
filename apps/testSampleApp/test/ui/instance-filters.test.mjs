// @features: instance-page
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
    await page.click('#logs-heading');       // the logs, open: by their heading
    return { page, errors, close: () => context.close() };
}

const visible = (page, selector) => page.locator(selector).evaluateAll(trs => trs.filter(tr => !tr.hidden).map(tr => tr.dataset.element ?? tr.textContent));

test('a type shows its elements in the items and the Rationale, and the log lines that name them', async () => {
    const { page, errors, close } = await openInstance();
    // at first: every item, under a header of its own; the Rationale open, above them, each step one line
    assert.equal(await page.inputValue('#filter-type'), '');
    assert.equal(await page.locator('#filter-count').innerText(), '');
    const everything = await visible(page, '#dataTable tbody tr[data-element]');
    assert.ok(everything.length >= 7, everything.join());
    const columns = await page.locator('#dataTable thead th').count();
    assert.equal(await page.locator('#dataTable tbody tr[data-element]').first().locator('td').count(), columns, 'a header for each column');
    assert.equal(await page.locator('#rationale').isVisible(), true);
    const order = await page.locator('main section h2').allInnerTexts();
    assert.ok(order.indexOf('Rationale') >= 0 && order.indexOf('Rationale') < order.indexOf('Instance items'), order.join(' | '));
    assert.equal(await page.locator('.rationale-table tbody.rationale-group tr:not(.rationale-step)').first().isVisible(), false, 'its steps closed');
    // its heading closes and opens it, as its button does
    await page.click('#rationale-heading');
    assert.equal(await page.locator('#rationale').isHidden(), true);
    await page.click('#rationale-heading');
    assert.equal(await page.locator('#rationale').isVisible(), true);
    await page.selectOption('#filter-type', 'bpmn:UserTask');
    // each step closed, its line alone; a click on it opens it
    // (a row the filter shows: Submit's)
    const first = page.locator('.rationale-table tbody.rationale-group').first();
    const submit = first.locator('tr[data-element="Submit"]').first();
    // the filter was chosen before the Rationale was shown: its steps with a row of it are open
    if (await submit.isVisible()) await first.locator('.rationale-step').click();
    assert.equal(await submit.isVisible(), false, 'closed');
    await first.locator('.rationale-step').click();
    assert.equal(await submit.isVisible(), true, 'opened by its line');
    await first.locator('.rationale-step').click();
    assert.equal(await submit.isVisible(), false, 'and closed');
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
    await page.selectOption('#filter-element', 'ToApprove');
    // the steps with a row of it open, the others hidden; in a step, its rows alone
    const rows = await page.locator('.rationale-table tbody:not([hidden]) tr:not(.rationale-step)').evaluateAll(trs => trs.filter(tr => !tr.hidden).map(tr => tr.innerText.replace(/\s+/g, ' ').trim()));
    assert.ok(rows.some(r => /yes \(ToApprove\) bpmn:SequenceFlow taken .*result: true \(days=10\)/.test(r)), rows.join('\n'));
    assert.ok(rows.every(r => /ToApprove/.test(r)), rows.join('\n'));
    const lines = await page.locator('.rationale-table tbody:not([hidden]) .rationale-step').allInnerTexts();
    assert.equal(lines.length, 1, 'the step that took it, alone');
    assert.match(lines[0], /^Step 2 · Invoke Item\s+Submit request\s+by admin/);

    // a step opens and closes on its line (the filter opened the one it showed)
    await page.click('#filter-clear');
    const step2 = page.locator('.rationale-table tbody.rationale-group').nth(1);
    const open = () => step2.locator('tr:not(.rationale-step)').first().isVisible();
    assert.equal(await open(), true);
    await step2.locator('.rationale-step').click();
    assert.equal(await open(), false, 'closed: its line alone');
    await step2.locator('.rationale-step').click();
    assert.equal(await open(), true);
    await close();
});

test('the diagram numbers its elements by their items\' seq, as the items table; Simulate shows the run as the editor does', async () => {
    const { page, errors, close } = await openInstance();
    // the shapes' items (a flow has no badge)
    const seqs = await page.locator('#dataTable tbody tr[data-element]').evaluateAll(trs => trs
        .filter(tr => !/bpmn:SequenceFlow/.test(tr.innerText)).map(tr => tr.cells[0].innerText.trim()));
    await page.waitForSelector('[id^="seq_"]', { state: 'attached' });
    const badges = await page.locator('[id^="seq_"]').evaluateAll(els => els.map(e => e.id.slice(4)));
    assert.deepEqual([...badges].sort((a, b) => a - b), [...seqs].sort((a, b) => a - b), 'a badge per item, by its seq');
    const submit = await page.locator('#seq_3').evaluate(e => e.textContent.trim());
    assert.equal(submit, '3', "Submit's badge is its seq (from 1)");
    // Simulate, as the editor's: paused on the first change; Step; details from the Rationale; Play the rest; Stop
    await page.waitForSelector('#startSimulation:not([disabled])');
    await page.click('#startSimulation');
    const panel = page.locator('#simulation .test-sim-panel');
    assert.equal(await panel.isVisible(), true);
    assert.match(await panel.locator('.test-sim-text').innerText(), /^1 of \d+: .*started$/);
    assert.equal(await page.locator('[id^="seq_"]').evaluateAll(bs => bs.filter(b => b.style.display !== 'none').length), 1, 'the first item\'s number alone');
    assert.equal(await page.locator('.djs-element.test-started').count(), 1);
    await panel.locator('.test-sim-step').click();
    await panel.locator('.test-sim-step').click();
    assert.match(await panel.locator('.test-sim-text').innerText(), /^3 of \d+: /);
    await panel.locator('.test-sim-back').click();
    assert.match(await panel.locator('.test-sim-text').innerText(), /^2 of \d+: /);
    // Show details: what the Rationale says of the change shown
    assert.equal(await panel.locator('.test-sim-details').isVisible(), false);
    await panel.locator('.test-sim-details-on').check();
    assert.equal(await panel.locator('.test-sim-details').isVisible(), true);
    assert.ok((await panel.locator('.test-sim-details li').count()) > 0);
    assert.match(await panel.locator('.test-sim-details .test-sim-details-item').innerText(), /^#\d+ \S/, 'which item: its number first');
    await panel.locator('.test-sim-play').click();
    await page.waitForFunction(() => /^Done \(/.test(document.querySelector('#simulation .test-sim-text')?.textContent || ''), null, { timeout: 30000 });
    assert.ok(await page.locator('.djs-element.test-passed').count() > 0, 'done: green');
    assert.equal(await page.locator('.djs-element.test-waiting').count(), 1, 'Approve still waits: orange');
    await panel.locator('.test-sim-stop').click();
    assert.equal(await panel.isVisible(), false);
    assert.equal(await page.locator('.djs-element.test-passed, .djs-element.test-waiting, .djs-element.test-started').count(), 0, 'the diagram as it was');
    assert.deepEqual(errors, []);
    await close();
});

test('the Model report and the logs open by their headings', async () => {
    const { page, errors, close } = await openInstance();
    assert.equal(await page.locator('#logs').isVisible(), true, 'opened by its heading');
    assert.equal(await page.locator('#docs').isHidden(), true);
    await page.click('#docs-heading');
    assert.equal(await page.locator('#docs').isVisible(), true);
    assert.equal(await page.locator('#showDoc').getAttribute('aria-expanded'), 'true');
    await page.click('#docs-heading');
    assert.equal(await page.locator('#docs').isHidden(), true);
    assert.deepEqual(errors, []);
    await close();
});

test('a click on an element of the diagram: its popup says what the Model report says of it, and what this run did', async () => {
    const { page, errors, close } = await openInstance();
    await page.waitForSelector('#model-report .report-element[data-element-id="Submit"]', { state: 'attached' });
    await page.locator('.instance-diagram .djs-element[data-element-id="Submit"]').click();
    const popup = page.locator('.report-popup-dialog .report-popup');
    await popup.waitFor();
    const reportSettings = await page.locator('#model-report .report-element[data-element-id="Submit"] .report-settings').first().evaluate(e => e.textContent);
    assert.equal(await popup.locator('.report-settings').first().evaluate(e => e.textContent), reportSettings, 'the report\'s settings');
    assert.match(await popup.locator('h3').first().innerText(), /Submit/);
    assert.match(await popup.locator('.report-popup-run').innerText(), /In this run: #3 ended/);
    assert.equal(await popup.locator('.report-flow').count(), 0, 'the popup leaves out its outgoing flows (the Model report keeps them)');
    // another element: the same popup, now of it
    await page.locator('.instance-diagram .djs-element[data-element-id="Approve"]').click();
    await page.waitForFunction(() => /#\d+ waits/.test(document.querySelector('.report-popup-run')?.textContent || ''));
    assert.equal(await page.locator('.report-popup-dialog').count(), 1);
    assert.deepEqual(errors, []);
    await close();
});
