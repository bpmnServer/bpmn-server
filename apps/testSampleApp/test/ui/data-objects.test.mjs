// @features: data-objects
// Data objects in the model editor: what a data object is in the instance data and what loads it (the panel),
// data.client in completion, and the data objects in the Report.
//   npm run test:ui
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright';
import { startWebApp, PASSWORD } from '../support/webApp.mjs';

/** Start (loads client) -> Price (script) -> End; and a data object 'note' connected to nothing. Drawn. */
const MODEL = `<?xml version="1.0" encoding="UTF-8"?>
<bpmn:definitions xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" xmlns:dc="http://www.omg.org/spec/DD/20100524/DC" xmlns:di="http://www.omg.org/spec/DD/20100524/DI" id="d" targetNamespace="urn:test">
  <bpmn:process id="P" isExecutable="true">
    <bpmn:dataObject id="DO_client" />
    <bpmn:dataObjectReference id="ClientRef" name="client" dataObjectRef="DO_client" />
    <bpmn:dataObject id="DO_note" />
    <bpmn:dataObjectReference id="NoteRef" name="note" dataObjectRef="DO_note" />
    <bpmn:startEvent id="Start" name="Order placed">
      <bpmn:dataOutputAssociation id="a1"><bpmn:targetRef>ClientRef</bpmn:targetRef></bpmn:dataOutputAssociation>
    </bpmn:startEvent>
    <bpmn:scriptTask id="Price" name="Price"><bpmn:script>data.discount = 10;</bpmn:script></bpmn:scriptTask>
    <bpmn:endEvent id="End" />
    <bpmn:sequenceFlow id="f1" sourceRef="Start" targetRef="Price" />
    <bpmn:sequenceFlow id="f2" sourceRef="Price" targetRef="End" />
  </bpmn:process>
  <bpmndi:BPMNDiagram id="dia"><bpmndi:BPMNPlane id="plane" bpmnElement="P">
    <bpmndi:BPMNShape id="Start_di" bpmnElement="Start"><dc:Bounds x="100" y="100" width="36" height="36" /></bpmndi:BPMNShape>
    <bpmndi:BPMNShape id="Price_di" bpmnElement="Price"><dc:Bounds x="200" y="78" width="100" height="80" /></bpmndi:BPMNShape>
    <bpmndi:BPMNShape id="End_di" bpmnElement="End"><dc:Bounds x="360" y="100" width="36" height="36" /></bpmndi:BPMNShape>
    <bpmndi:BPMNShape id="ClientRef_di" bpmnElement="ClientRef"><dc:Bounds x="100" y="220" width="36" height="50" /></bpmndi:BPMNShape>
    <bpmndi:BPMNShape id="NoteRef_di" bpmnElement="NoteRef"><dc:Bounds x="360" y="220" width="36" height="50" /></bpmndi:BPMNShape>
    <bpmndi:BPMNEdge id="f1_di" bpmnElement="f1"><di:waypoint x="136" y="118" /><di:waypoint x="200" y="118" /></bpmndi:BPMNEdge>
    <bpmndi:BPMNEdge id="f2_di" bpmnElement="f2"><di:waypoint x="300" y="118" /><di:waypoint x="360" y="118" /></bpmndi:BPMNEdge>
    <bpmndi:BPMNEdge id="a1_di" bpmnElement="a1"><di:waypoint x="118" y="136" /><di:waypoint x="118" y="220" /></bpmndi:BPMNEdge>
  </bpmndi:BPMNPlane></bpmndi:BPMNDiagram>
</bpmn:definitions>`;

let web, browser, page, context;
test.before(async () => {
    web = await startWebApp();
    browser = await chromium.launch();
    fs.writeFileSync(path.join(web.definitionsPath, 'orders.bpmn'), MODEL);
    await web.bpmnServer.engine.install({ rebuild: true });
    context = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
    await context.route('**/*', route => route.request().url().startsWith(web.base) ? route.continue() : route.abort());
    page = await context.newPage();
    page.setDefaultTimeout(20000);
    await page.goto(web.base + '/login');
    await page.fill('#userName', 'designer');
    await page.fill('#password', PASSWORD);
    await Promise.all([page.waitForURL(url => !url.pathname.startsWith('/login')), page.click('button[type=submit]')]);
    await page.goto(`${web.base}/model/edit/orders`);
    await page.waitForSelector('#js-canvas .djs-shape');
});
test.after(async () => {
    await browser?.close();
    await web?.stop();
    setImmediate(() => process.exit(0));
});

const select = id => page.evaluate(id => {
    document.activeElement?.blur();
    const m = window.bpmnModeler;
    m.get('selection').select(m.get('elementRegistry').get(id));
}, id);
async function openGroup(label) {
    const header = page.locator('.bio-properties-panel-group-header', { hasText: label }).first();
    await page.waitForTimeout(100);      // the panel settles: the editor opens the groups that have values
    if (!/\bopen\b/.test(await header.getAttribute('class')))
        await header.click();
}

test('a data object shows its field in the instance data and what loads it', async () => {
    await select('ClientRef');
    await openGroup('Data object');
    assert.equal(await page.inputValue('#bio-properties-panel-dataObject-field'), 'data.client');
    assert.equal(await page.inputValue('#bio-properties-panel-dataObject-loaders'), 'Order placed (Start)');

    await select('NoteRef');
    await openGroup('Data object');
    assert.equal(await page.inputValue('#bio-properties-panel-dataObject-loaders'), '—');
    assert.match(await page.locator('[data-entry-id="dataObject-loaders"]').innerText(), /Nothing: connect it to an element/);
});

test('scripts complete data.client', async () => {
    await select('Price');
    await openGroup('Script');
    await page.click('#bio-properties-panel-script-body');
    await page.keyboard.press('Control+End');
    await page.keyboard.type('\ndata.');
    await page.waitForSelector('.cm-tooltip-autocomplete li');
    const options = await page.locator('.cm-tooltip-autocomplete .cm-completionLabel').allInnerTexts();
    assert.ok(options.includes('client') && options.includes('note'), options.join());
    await page.keyboard.press('Escape');
});

test('the Report lists the data objects and what loads them', async () => {
    await page.click('#js-tab-report');
    await page.waitForSelector('.report-data-objects');
    const rows = await page.locator('.report-data-objects tbody tr').evaluateAll(trs => trs.map(tr => [...tr.cells].map(td => td.innerText)));
    assert.deepEqual(rows, [['client', 'data.client', 'Order placed'], ['note', 'data.note', 'nothing: never loaded']]);
    assert.match(await page.locator('.report-element[data-element-id="Start"] .report-loads').innerText(), /Loads data\.client/);
    const listed = await page.locator('.report-element').evaluateAll(els => els.map(e => e.dataset.elementId));
    assert.ok(!listed.includes('ClientRef'), 'data objects are not in the flow');
});
