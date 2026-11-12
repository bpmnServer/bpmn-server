// @features: test-tab
// Coverage in the Test tab: how many of a model's nodes and flows its scenarios' last runs have reached, on the diagram, and what is left.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
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

async function openTestTab(model = 'leave-request') {
    const context = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
    await context.route('**/*', route => route.request().url().startsWith(web.base) ? route.continue() : route.abort());
    await context.addInitScript(() => localStorage.setItem('bpmn-web.modeler.panel', JSON.stringify({ dockHeight: 560 })));
    const page = await context.newPage();
    page.setDefaultTimeout(20000);
    page.on('dialog', d => d.accept());
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    await page.goto(web.base + '/login');
    await page.fill('#userName', 'designer');
    await page.fill('#password', PASSWORD);
    await Promise.all([page.waitForURL(url => !url.pathname.startsWith('/login')), page.click('button[type=submit]')]);
    await page.goto(`${web.base}/model/edit/${model}`);
    await page.waitForSelector('#js-canvas .djs-shape');
    await page.click('#js-tab-test');
    await page.waitForSelector('#js-test .test-panel');
    return { page, errors, close: () => context.close() };
}

async function record(page, name, steps) {
    await page.click('.test-new-menu summary');
    await page.click('.test-new');
    await page.fill('.test-name', name);
    await page.click('.test-run');
    await page.click('.test-start-go');
    for (const [element, data] of steps) {
        const step = page.locator(`.test-step.pending[data-element-id="${element}"]`);
        await step.waitFor();
        await step.locator('.test-form-other').count() && await step.locator('.test-form-other summary').click();
        const area = step.locator('textarea').first();
        for (const [key, value] of Object.entries(data)) {
            const input = step.locator(`[data-field="${key}"]`);
            if (await input.count()) {
                await input.fill(String(value));
                delete data[key];
            }
        }
        if (Object.keys(data).length) await area.fill(JSON.stringify(data));
        await step.locator('.test-step-run').click();
    }
    await page.waitForSelector('.test-summary.ok, .test-summary.failed');
}
const SHORT = [['Submit', { days: 2 }]];
const LONG = [['Submit', { days: 9 }], ['Approve', { approved: true }]];

/** What the tab says: [tested, total], for nodes and flows. */
const counts = async page => {
    const read = async which => (await page.locator(`.test-coverage-${which}`).innerText()).match(/(\d+) of (\d+)/).slice(1).map(Number);
    return { nodes: await read('nodes'), flows: await read('flows') };
};
/** From the model, not the canvas: a flow need not be drawn (this model's are not). */
const totals = page => page.evaluate(() => {
    const all = window.bpmnModeler.getDefinitions().rootElements.filter(e => e.$instanceOf('bpmn:Process')).flatMap(p => p.flowElements);
    return { nodes: all.filter(e => e.$instanceOf('bpmn:FlowNode')).length, flows: all.filter(e => e.$instanceOf('bpmn:SequenceFlow')).length };
});
const gaps = page => page.locator('.test-gap').evaluateAll(rows => rows.map(r => r.dataset.elementId));
const marker = (page, id, name) => page.evaluate(([id, name]) => window.bpmnModeler.get('canvas').hasMarker(id, name), [id, name]);

test('no scenarios: nothing reached; each scenario adds what its run reached, and the gaps go', async () => {
    const { page, errors, close } = await openTestTab();
    assert.equal((await counts(page)).nodes[0], 0);

    await record(page, 'Short', SHORT);
    const total = await totals(page);
    let now = await counts(page);
    assert.equal(now.nodes[1], total.nodes);
    assert.equal(now.flows[1], total.flows);
    assert.ok(now.nodes[0] > 0 && now.nodes[0] < total.nodes, JSON.stringify(now));
    let left = await gaps(page);
    assert.ok(left.includes('Approve'), left.join());
    assert.ok(left.includes('ToApprove'), left.join());
    assert.ok(!left.includes('Submit'), left.join());
    assert.ok(!left.includes('AutoApprove'), left.join());

    const before = now;
    await record(page, 'Long', LONG);
    now = await counts(page);
    assert.ok(now.nodes[0] > before.nodes[0] && now.flows[0] > before.flows[0], JSON.stringify([before, now]));
    left = await gaps(page);
    assert.ok(!left.includes('Approve'), left.join());
    assert.ok(!left.includes('ToApprove'), left.join());
    assert.equal(left.length, total.nodes + total.flows - now.nodes[0] - now.flows[0], 'each gap once');
    assert.deepEqual(errors, []);
    await close();
});

/** A model with its flows drawn: small goes low, large goes high. */
function drawnFlows() {
    const edge = (id, flow, points) => `<bpmndi:BPMNEdge id="${id}" bpmnElement="${flow}">${points.map(([x, y]) => `<di:waypoint x="${x}" y="${y}" />`).join('')}</bpmndi:BPMNEdge>`;
    const shape = (id, element, x, y, w = 36, h = 36) => `<bpmndi:BPMNShape id="${id}" bpmnElement="${element}"><dc:Bounds x="${x}" y="${y}" width="${w}" height="${h}" /></bpmndi:BPMNShape>`;
    return `<?xml version="1.0" encoding="UTF-8"?>
<bpmn:definitions xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" xmlns:dc="http://www.omg.org/spec/DD/20100524/DC" xmlns:di="http://www.omg.org/spec/DD/20100524/DI" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" id="d" targetNamespace="urn:test">
<bpmn:process id="Drawn" isExecutable="true">
  <bpmn:startEvent id="start" name="Begin" />
  <bpmn:exclusiveGateway id="gw" name="Which" default="toLow" />
  <bpmn:endEvent id="high" name="High" />
  <bpmn:endEvent id="low" name="Low" />
  <bpmn:sequenceFlow id="f0" sourceRef="start" targetRef="gw" />
  <bpmn:sequenceFlow id="toHigh" name="large" sourceRef="gw" targetRef="high"><bpmn:conditionExpression xsi:type="bpmn:tFormalExpression">data.amount &gt; 100</bpmn:conditionExpression></bpmn:sequenceFlow>
  <bpmn:sequenceFlow id="toLow" sourceRef="gw" targetRef="low" />
</bpmn:process>
<bpmndi:BPMNDiagram id="dia"><bpmndi:BPMNPlane id="plane" bpmnElement="Drawn">
  ${shape('s1', 'start', 100, 100)}${shape('s2', 'gw', 200, 93, 50, 50)}${shape('s3', 'high', 350, 50)}${shape('s4', 'low', 350, 150)}
  ${edge('e0', 'f0', [[136, 118], [200, 118]])}${edge('e1', 'toHigh', [[225, 93], [225, 68], [350, 68]])}${edge('e2', 'toLow', [[225, 143], [225, 168], [350, 168]])}
</bpmndi:BPMNPlane></bpmndi:BPMNDiagram></bpmn:definitions>`;
}
/** A scenario of the drawn model, which runs from its start data to the end. */
async function recordStart(page, name, data) {
    await page.click('.test-new-menu summary');
    await page.click('.test-new');
    await page.fill('.test-name', name);
    await page.click('.test-run');
    await page.locator('.test-start textarea').fill(JSON.stringify(data));
    await page.click('.test-start-go');
    await page.waitForSelector('.test-summary.ok');
}

test('on the diagram: taken is green, not taken is marked, nodes and flows; a gap says where it goes, and is selected; it stays until asked otherwise', async () => {
    fs.writeFileSync(path.join(web.definitionsPath, 'drawn-flows.bpmn'), drawnFlows());
    await web.bpmnServer.engine.install({ rebuild: true });
    const { page, errors, close } = await openTestTab('drawn-flows');
    await recordStart(page, 'Small', { amount: 5 });

    assert.deepEqual(await counts(page), { nodes: [3, 4], flows: [2, 3] });
    // one percentage, beside Coverage: nodes and flows together (5 of 7), as the Design dashboard rounds it
    assert.match(await page.locator('.test-coverage h5').innerText(), /^Coverage 71%$/);
    assert.deepEqual((await gaps(page)).sort(), ['high', 'toHigh']);
    assert.match(await page.locator('.test-gap[data-element-id="toHigh"]').innerText(), /'large': Which → High/);

    await page.click('.test-coverage-show');
    for (const [id, name] of [['gw', 'test-passed'], ['toLow', 'test-passed'], ['high', 'test-untested'], ['toHigh', 'test-untested']])
        assert.equal(await marker(page, id, name), true, `${id} ${name}`);
    await page.locator('.test-gap[data-element-id="toHigh"]').click();
    assert.deepEqual(await page.evaluate(() => window.bpmnModeler.get('selection').get().map(e => e.id)), ['toHigh']);
    assert.match(await page.locator('.test-coverage-show').innerText(), /Hide on diagram/);

    // hidden: the run shown is back
    await page.click('.test-coverage-show');
    assert.equal(await marker(page, 'high', 'test-untested'), false);
    await page.click('.test-coverage-show');
    assert.equal(await marker(page, 'high', 'test-untested'), true);

    // a scenario chosen: the diagram is its run again
    await page.locator('.test-tree-row', { hasText: 'Small' }).click();
    assert.equal(await marker(page, 'high', 'test-untested'), false);
    assert.deepEqual(errors, []);
    await close();
});

test('a run that failed: what only it reached is not tested, but it is not a gap either', async () => {
    const { page, errors, close } = await openTestTab('drawn-flows');
    await recordStart(page, 'Large', { amount: 500 });
    assert.deepEqual(await counts(page), { nodes: [4, 4], flows: [3, 3] });
    assert.equal(await page.locator('.test-coverage-total').innerText(), '100%');
    assert.deepEqual(await gaps(page), []);

    // the same scenario, with a check that fails
    await page.click('.test-check-add');
    const row = page.locator('.test-check-row').last();
    await row.locator('.test-check-kind').selectOption('data');
    await row.locator('.test-check-path').fill('amount');
    await row.locator('.test-check-value').fill('999');
    await row.locator('.test-check-done').click();
    await page.waitForTimeout(800);
    await page.click('.test-run');
    await page.click('.test-start-go');
    await page.waitForSelector('.test-summary.failed');
    await page.waitForFunction(() => /2 reached, but not in a run that passed/.test(document.querySelector('.test-coverage').textContent));
    assert.deepEqual(await counts(page), { nodes: [3, 4], flows: [2, 3] }, 'what Small also reached stays tested');
    assert.deepEqual(await gaps(page), [], 'reached is not a gap');

    await page.click('.test-coverage-show');
    for (const [id, name] of [['high', 'test-reached'], ['toHigh', 'test-reached'], ['gw', 'test-passed'], ['low', 'test-passed']])
        assert.equal(await marker(page, id, name), true, `${id} ${name}`);
    assert.deepEqual(errors, []);
    await close();
});

test('coverage comes from the kept runs after a reload; a scenario with no instance counts for nothing; an edit says it may be out of date', async () => {
    const { page, errors, close } = await openTestTab();
    await page.waitForFunction(() => /\d+ of \d+/.test(document.querySelector('.test-coverage-nodes')?.textContent ?? ''));
    await page.waitForFunction(() => !document.querySelector('.test-coverage-loading'));
    const kept = await counts(page);
    assert.ok(kept.nodes[0] > 0, JSON.stringify(kept));

    await page.click('.test-new-menu summary');
    await page.click('.test-new');
    await page.waitForFunction(() => /1 scenario has not run/.test(document.querySelector('.test-coverage').textContent));
    assert.deepEqual(await counts(page), kept, 'written, not run: nothing added');

    assert.equal(await page.locator('.test-coverage-stale').count(), 0);
    await page.evaluate(() => {
        const modeler = window.bpmnModeler;
        modeler.get('modeling').updateLabel(modeler.get('elementRegistry').get('Submit'), 'Submit it');
    });
    await page.waitForSelector('.test-coverage-stale');

    // Run all brings it up to date
    await page.click('.test-run-all');
    await page.waitForFunction(() => !document.querySelector('.test-coverage-stale'));
    assert.deepEqual(errors, []);
    await close();
});

test('its runs deleted: nothing is covered', async () => {
    const { page, errors, close } = await openTestTab();
    await page.click('.test-list-menu summary');
    await page.click('.test-clear-all');
    await page.waitForSelector('.test-status:text("runs cleared")');
    const none = await counts(page);
    assert.equal(none.nodes[0], 0);
    assert.equal(none.flows[0], 0);
    assert.deepEqual(errors, []);
    await close();
});
