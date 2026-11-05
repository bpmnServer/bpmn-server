// @features: expressions, test-tab
// A condition in FEEL in the editor: its field and language follow it, and the Problems tab has no complaint; the Test tab runs it.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright';
import { startWebApp, PASSWORD } from '../support/webApp.mjs';

const FEEL = 'amount > 1000 and approved = true';
const flowEdge = 'BPMNEdge';
const diagram = `<bpmndi:BPMNDiagram id="dia"><bpmndi:BPMNPlane id="plane" bpmnElement="feelModel">
  <bpmndi:BPMNShape id="s1" bpmnElement="start"><dc:Bounds x="100" y="100" width="36" height="36" /></bpmndi:BPMNShape>
  <bpmndi:BPMNShape id="s2" bpmnElement="gw"><dc:Bounds x="200" y="93" width="50" height="50" /></bpmndi:BPMNShape>
  <bpmndi:BPMNShape id="s3" bpmnElement="high"><dc:Bounds x="350" y="50" width="36" height="36" /></bpmndi:BPMNShape>
  <bpmndi:BPMNShape id="s4" bpmnElement="low"><dc:Bounds x="350" y="150" width="36" height="36" /></bpmndi:BPMNShape>
  <bpmndi:${flowEdge} id="e0" bpmnElement="f0"><di:waypoint x="136" y="118" /><di:waypoint x="200" y="118" /></bpmndi:${flowEdge}>
  <bpmndi:${flowEdge} id="e1" bpmnElement="toHigh"><di:waypoint x="225" y="93" /><di:waypoint x="225" y="68" /><di:waypoint x="350" y="68" /></bpmndi:${flowEdge}>
  <bpmndi:${flowEdge} id="e2" bpmnElement="toLow"><di:waypoint x="225" y="143" /><di:waypoint x="225" y="168" /><di:waypoint x="350" y="168" /></bpmndi:${flowEdge}>
</bpmndi:BPMNPlane></bpmndi:BPMNDiagram>`;
const MODEL = `<?xml version="1.0" encoding="UTF-8"?>
<bpmn:definitions xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" xmlns:dc="http://www.omg.org/spec/DD/20100524/DC" xmlns:di="http://www.omg.org/spec/DD/20100524/DI" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" id="d" targetNamespace="urn:test">
<bpmn:process id="feelModel" isExecutable="true">
  <bpmn:startEvent id="start" />
  <bpmn:exclusiveGateway id="gw" default="toLow" />
  <bpmn:endEvent id="high" />
  <bpmn:endEvent id="low" />
  <bpmn:sequenceFlow id="f0" sourceRef="start" targetRef="gw" />
  <bpmn:sequenceFlow id="toHigh" sourceRef="gw" targetRef="high"><bpmn:conditionExpression xsi:type="bpmn:tFormalExpression" language="FEEL">${FEEL.replace('>', '&gt;')}</bpmn:conditionExpression></bpmn:sequenceFlow>
  <bpmn:sequenceFlow id="toLow" sourceRef="gw" targetRef="low" />
</bpmn:process>${diagram}</bpmn:definitions>`;

let web, browser;
test.before(async () => {
  web = await startWebApp();
  fs.writeFileSync(path.join(web.definitionsPath, 'feel-model.bpmn'), MODEL);
  await web.bpmnServer.definitions.rebuild();
  browser = await chromium.launch();
});
test.after(async () => {
  await browser?.close();
  await web?.stop();
  setImmediate(() => process.exit(0));
});

async function openEditor() {
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
  await page.goto(`${web.base}/model/edit/feel-model`);
  await page.waitForSelector('#js-canvas .djs-shape');
  return { page, errors, close: () => context.close() };
}
const selectFlow = page => page.evaluate(() => {
  const modeler = window.bpmnModeler;
  modeler.get('selection').select(modeler.get('elementRegistry').get('toHigh'));
});
const field = page => page.locator('[data-entry-id="conditionExpression"]');
const language = page => page.locator('select[name="conditionLanguage"], #bio-properties-panel-conditionLanguage').first();
const noError = async page => {
  await page.waitForTimeout(700);     // the check runs after a pause
  return (await field(page).locator('.cm-lintRange-error, .cm-lint-marker-error').count()) === 0;
};
const type = async (page, text) => {
  await field(page).locator('.cm-content').click();
  await page.keyboard.press('Control+a');
  await page.keyboard.type(text);
};

test('the Condition field follows the language: FEEL is not marked as JavaScript, JavaScript still is', async () => {
  const { page, errors, close } = await openEditor();
  await selectFlow(page);
  await field(page).waitFor();
  assert.match(await field(page).textContent(), /A FEEL expression/);
  assert.match(await field(page).locator('.cm-content').innerText(), /amount > 1000 and approved/);
  assert.equal(await language(page).inputValue(), 'FEEL');
  assert.equal(await noError(page), true, 'valid FEEL, though not JavaScript');

  // JavaScript: the same text is marked, and the hint says JavaScript
  await language(page).selectOption('JavaScript');
  await page.waitForFunction(() => /A JavaScript expression/.test(document.querySelector('[data-entry-id="conditionExpression"]').textContent));
  assert.equal(await noError(page), false, 'not JavaScript');

  // and back: FEEL again
  await language(page).selectOption('FEEL');
  await type(page, FEEL);
  assert.equal(await noError(page), true);
  assert.deepEqual(errors, []);
  await close();
});

test('the language stays when the condition is edited, and is saved; the Problems tab has no complaint about FEEL', async () => {
  const { page, errors, close } = await openEditor();
  await selectFlow(page);
  await field(page).waitFor();
  await type(page, 'amount > 5');
  await page.waitForTimeout(500);     // written after a pause in typing
  await page.click('#js-save');
  await page.waitForFunction(() => document.getElementById('js-save-status').textContent.includes('Saved'));
  const saved = fs.readFileSync(path.join(web.definitionsPath, 'feel-model.bpmn'), 'utf8');
  fs.writeFileSync(path.join(web.definitionsPath, 'feel-model.bpmn'), MODEL);     // as it was, for the next test
  assert.match(saved, /language="FEEL"[^>]*>amount &gt; 5</);

  await page.reload();
  await page.waitForSelector('#js-canvas .djs-shape');
  await page.click('#js-tab-problems');
  await page.waitForTimeout(1500);
  const problems = await page.locator('#js-problems').innerText();
  assert.doesNotMatch(problems, /condition|language|FEEL|does not compile|reads '/i, problems);
  assert.deepEqual(errors, []);
  await close();
});

test('the Test tab runs a FEEL condition: the data chooses the path', async () => {
  const { page, errors, close } = await openEditor();
  await page.click('#js-tab-test');
  await page.waitForSelector('#js-test .test-panel');

  const run = async (name, data, reached, passed) => {
    await page.click('.test-new-menu summary');
    await page.click('.test-new');
    await page.fill('.test-name', name);
    await page.click('.test-run');
    await page.locator('.test-start textarea').fill(JSON.stringify(data));
    await page.click('.test-start-go');
    await page.waitForSelector('.test-summary.ok, .test-summary.failed');
    await page.waitForSelector(`.test-items tbody tr[data-element-id="${reached}"]`);
    assert.equal(await page.locator(`.test-items tbody tr[data-element-id="${passed}"]`).count(), 0, name);
  };
  await run('Large and approved', { amount: 2000, approved: true }, 'high', 'low');
  await run('Large, not approved', { amount: 2000, approved: false }, 'low', 'high');
  await run('Small', { amount: 10, approved: true }, 'low', 'high');

  // the Rationale says which way, and shows the FEEL it read
  assert.match(await page.locator('.test-rationale').innerText(), /amount > 1000 and approved/);
  assert.deepEqual(errors, []);
  await close();
});
