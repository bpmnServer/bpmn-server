// @features: labels
// The model editor's Label group (docs/design/labels.md): the case's label on the process, an element's label and
// its label once done; a template checked as it is typed; previewed with the Test tab's data; saved in the model,
// and shown in the lists.
//   npm run test:ui
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright';
import { startWebApp, PASSWORD } from '../support/webApp.mjs';

const MODEL = `<?xml version="1.0" encoding="UTF-8"?>
<bpmn:definitions xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" xmlns:dc="http://www.omg.org/spec/DD/20100524/DC" xmlns:di="http://www.omg.org/spec/DD/20100524/DI" id="d" targetNamespace="urn:test">
  <bpmn:process id="Claim" isExecutable="true">
    <bpmn:startEvent id="Start" />
    <bpmn:userTask id="Approve" name="Approve" />
    <bpmn:endEvent id="End" />
    <bpmn:sequenceFlow id="f1" sourceRef="Start" targetRef="Approve" />
    <bpmn:sequenceFlow id="f2" sourceRef="Approve" targetRef="End" />
  </bpmn:process>
  <bpmndi:BPMNDiagram id="dia">
    <bpmndi:BPMNPlane id="plane" bpmnElement="Claim">
      <bpmndi:BPMNShape id="Start_di" bpmnElement="Start"><dc:Bounds x="100" y="100" width="36" height="36" /></bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Approve_di" bpmnElement="Approve"><dc:Bounds x="200" y="78" width="100" height="80" /></bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="End_di" bpmnElement="End"><dc:Bounds x="360" y="100" width="36" height="36" /></bpmndi:BPMNShape>
      <bpmndi:BPMNEdge id="f1_di" bpmnElement="f1"><di:waypoint x="136" y="118" /><di:waypoint x="200" y="118" /></bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="f2_di" bpmnElement="f2"><di:waypoint x="300" y="118" /><di:waypoint x="360" y="118" /></bpmndi:BPMNEdge>
    </bpmndi:BPMNPlane>
  </bpmndi:BPMNDiagram>
</bpmn:definitions>`;

let web, browser;
test.before(async () => {
    web = await startWebApp();
    browser = await chromium.launch();
    fs.writeFileSync(path.join(web.definitionsPath, 'Claim.bpmn'), MODEL);
    await web.bpmnServer.engine.install({ rebuild: true });
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

const select = (page, id) => page.evaluate(id => {
    document.activeElement?.blur();
    const registry = window.bpmnModeler.get('elementRegistry');
    window.bpmnModeler.get('selection').select(id ? registry.get(id) : window.bpmnModeler.get('canvas').getRootElement());
}, id);

async function openGroup(page, label) {
    const header = page.locator('.bio-properties-panel-group-header', { hasText: label }).first();
    await page.waitForTimeout(100);
    if (!/\bopen\b/.test(await header.getAttribute('class')))
        await header.click();
}

async function type(page, entryId, value) {
    const input = page.locator(`[data-entry-id="${entryId}"] input`);
    await input.fill(value);
    await page.waitForTimeout(1200);     // the panel's debounce, then its check
    return page.locator(`[data-entry-id="${entryId}"] .bio-properties-panel-error`);
}

test('the Label group: the case label on the process, a label and a label once done on a task; checked; saved', async () => {
    const { page, errors, close } = await openEditor('Claim');

    await select(page, null);
    await openGroup(page, 'Label');
    await type(page, 'case-label', 'Client: ${Client = data.clientId} · Order: ${Order = data.orderNo}');

    await select(page, 'Approve');
    await openGroup(page, 'Label');
    let error = await type(page, 'element-label', 'Approve ${Amount = data.amount + 1}');
    assert.match(await error.innerText(), /'data\.amount \+ 1' is not a path/, 'checked as typed');
    error = await type(page, 'element-label', 'Approve ${Amount = data.amount}');
    assert.equal(await error.count(), 0, await error.count() ? await error.innerText() : '');
    await type(page, 'element-end-label', 'Approved by ${completedBy}');

    const saved = page.waitForResponse(r => r.request().method() === 'POST' && r.url().endsWith('/model/edit/Claim'));
    await page.click('#js-save');
    assert.equal((await saved).status(), 200);
    const xml = await web.bpmnServer.definitions.getSource('Claim');
    assert.match(xml, /<bpmn:process id="Claim"[^>]*camunda:label="Client: \$\{Client = data.clientId\} · Order: \$\{Order = data.orderNo\}"/);
    assert.match(xml, /<bpmn:userTask id="Approve"[^>]*camunda:label="Approve \$\{Amount = data.amount\}"/);
    assert.match(xml, /camunda:endLabel="Approved by \$\{completedBy\}"/);
    assert.deepEqual(errors, []);
    await close();

    // the lists show them
    const run = await web.bpmnServer.engine.start('Claim', { clientId: 'abc', orderNo: 7, amount: 90 }, null, 'admin');
    const admin = await web.login('admin');
    const home = (await admin.get('/')).text;
    assert.match(home, /<td>Client: abc · Order: 7<\/td>/);
    assert.match(home, /<td>Approve 90 — Client: abc · Order: 7<\/td>/);
    assert.ok(run.id);
});

const FEATURE = `Feature: Claim

  Scenario: Acme claim
    When @start process:"Claim" as :instance
      | clientId | "acme" |
      | orderNo | 1234 |
      | amount | 90 |
`;

const value = (page, entryId) => page.locator(`[data-entry-id="${entryId}"] input`).inputValue();

test("a label's preview from the Test tab's scenario, following the template as it is typed", async () => {
    fs.writeFileSync(path.join(web.definitionsPath, 'Claim.feature'), FEATURE);
    const { page, errors, close } = await openEditor('Claim');

    await select(page, null);
    await openGroup(page, 'Label');
    const casePreview = page.locator('[data-preview-for="case-label"]');
    assert.match(await casePreview.innerText(), /Open a scenario in the Test tab/, 'no scenario shown yet');
    await page.click('#js-tab-test');
    await page.waitForSelector('#js-test .test-panel');
    await page.waitForFunction(() => /Client: acme · Order: 1234/.test(document.querySelector('[data-preview-for="case-label"]')?.textContent ?? ''));
    assert.match(await casePreview.innerText(), /Acme claim's start data/);

    // the preview follows the template
    await type(page, 'case-label', 'caseId: ${data.orderNo}');
    assert.match(await casePreview.innerText(), /caseId: 1234/);
    await type(page, 'case-label', 'Client: ${Client = data.clientId} · No: ${No = data.orderNo}');

    // an element's label sees the case's named values as instance.*
    await select(page, 'Approve');
    await openGroup(page, 'Label');
    await type(page, 'element-label', 'Approve ${Amount = data.amount} for order ${instance.No}');
    assert.match(await page.locator('[data-preview-for="element-label"]').innerText(), /Approve 90 for order 1234/);

    assert.deepEqual(errors, []);
    await close();
});
