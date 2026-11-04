// @features: modeler
// Element templates in the model editor: the chooser offers the catalog's templates for the selected element,
// and a task made from one runs on bpmn-server as the template says.
//   npm run test:ui
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright';
import { startWebApp, PASSWORD, FIXTURES } from '../support/webApp.mjs';

/** Open a properties group, unless the editor has (it opens the groups that have values). */
async function openGroup(page, label) {
    const header = page.locator('.bio-properties-panel-group-header', { hasText: label }).first();
    await page.waitForTimeout(100);      // the panel settles: groups with values open
    if (!/\bopen\b/.test(await header.getAttribute('class')))
        await header.click();
}

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

/** Start, a plain service task, end: drawn, so the editor can select the task. */
const SERVICE_MODEL = `<?xml version="1.0" encoding="UTF-8"?>
<bpmn:definitions xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" xmlns:dc="http://www.omg.org/spec/DD/20100524/DC" xmlns:di="http://www.omg.org/spec/DD/20100524/DI" id="d" targetNamespace="urn:test">
  <bpmn:process id="Sum" isExecutable="true">
    <bpmn:startEvent id="Start" />
    <bpmn:serviceTask id="Calc" name="Calculate" />
    <bpmn:endEvent id="End" />
    <bpmn:sequenceFlow id="f1" sourceRef="Start" targetRef="Calc" />
    <bpmn:sequenceFlow id="f2" sourceRef="Calc" targetRef="End" />
  </bpmn:process>
  <bpmndi:BPMNDiagram id="dia">
    <bpmndi:BPMNPlane id="plane" bpmnElement="Sum">
      <bpmndi:BPMNShape id="Start_di" bpmnElement="Start"><dc:Bounds x="100" y="100" width="36" height="36" /></bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Calc_di" bpmnElement="Calc"><dc:Bounds x="200" y="78" width="100" height="80" /></bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="End_di" bpmnElement="End"><dc:Bounds x="360" y="100" width="36" height="36" /></bpmndi:BPMNShape>
      <bpmndi:BPMNEdge id="f1_di" bpmnElement="f1"><di:waypoint x="136" y="118" /><di:waypoint x="200" y="118" /></bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="f2_di" bpmnElement="f2"><di:waypoint x="300" y="118" /><di:waypoint x="360" y="118" /></bpmndi:BPMNEdge>
    </bpmndi:BPMNPlane>
  </bpmndi:BPMNDiagram>
</bpmn:definitions>`;

async function addModel(name, xml) {
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
    await page.fill('#userName', 'designer');
    await page.fill('#password', PASSWORD);
    await Promise.all([page.waitForURL(url => !url.pathname.startsWith('/login')), page.click('button[type=submit]')]);
    await page.goto(`${web.base}/model/edit/${model}`);
    await page.waitForSelector('#js-canvas .djs-shape');
    await page.waitForFunction(() => window.bpmnModeler.get('elementTemplates').getAll().length > 0);
    return { page, errors, close: () => context.close() };
}

const select = (page, id) => page.evaluate(id => {
    document.activeElement?.blur();
    const registry = window.bpmnModeler.get('elementRegistry');
    window.bpmnModeler.get('selection').select(registry.get(id));
}, id);

/** Open the chooser for the selected element; the names it offers. */
async function openChooser(page) {
    await page.locator('.bio-properties-panel-group-header', { hasText: 'Template' }).getByRole('button', { name: /Select/ }).click();
    await page.waitForSelector('.element-template-chooser .entry');
    return page.locator('.element-template-chooser .djs-popup-label').allInnerTexts();
}

async function save(page, model) {
    const saved = page.waitForResponse(r => r.request().method() === 'POST' && r.url().endsWith(`/model/edit/${model}`));
    await page.click('#js-save');
    assert.equal((await saved).status(), 200);
    return web.bpmnServer.definitions.getSource(model);
}

test('a service task made from a template calls its service and stores the result', async () => {
    const model = await addModel('template-sum', SERVICE_MODEL);
    const { page, errors, close } = await openEditor(model);
    await select(page, 'Calc');
    assert.deepEqual((await openChooser(page)).sort(), ['Add two numbers', 'Echo'], 'the service task templates only');
    await page.locator('.element-template-chooser .entry', { hasText: 'Add two numbers' }).click();

    await openGroup(page, 'Custom properties');
    await page.getByLabel('First number').fill('2');
    await page.getByLabel('Second number').fill('$data.fee');
    const xml = await save(page, model);
    assert.match(xml, /camunda:modelerTemplate="bpmn-web.sample.add"/);
    assert.match(xml, /camunda:delegateExpression="add"/);

    const started = await web.bpmnServer.engine.start(model, { fee: 3 });
    assert.equal(started.instance.status, 'end');
    assert.equal(started.instance.data.sum, 5);
    assert.deepEqual(errors, []);
    await close();
});

test('a user task made from a template is assigned, dated and scripted as the template says', async () => {
    const model = await addModel('template-approval', fs.readFileSync(path.join(FIXTURES, 'leave-request.bpmn'), 'utf8'));
    const { page, errors, close } = await openEditor(model);
    await select(page, 'Approve');
    assert.deepEqual((await openChooser(page)).sort(), ['Manager approval', 'Review by requester']);
    await page.locator('.element-template-chooser .entry', { hasText: 'Manager approval' }).click();
    await openGroup(page, 'Custom properties');
    await page.getByLabel('Priority').selectOption('80');
    const xml = await save(page, model);
    assert.match(xml, /<bpmn:userTask id="Approve"[^>]*camunda:candidateGroups="manager"/);
    assert.match(xml, /<camunda:executionListener event="end">\s*<camunda:script scriptFormat="JavaScript">this.data.approvedAt/);

    let execution = await web.bpmnServer.engine.start(model, {});
    execution = await web.bpmnServer.engine.invoke({ id: execution.id, 'items.elementId': 'Submit' }, { days: 10 });
    const approve = execution.instance.items.find(i => i.elementId === 'Approve');
    assert.equal(approve.status, 'wait');
    assert.equal(String(approve.priority), '80');
    const due = new Date(approve.dueDate).getTime() - Date.now();
    assert.ok(due > 47 * 3600e3 && due <= 48 * 3600e3, 'due in two days');

    execution = await web.bpmnServer.engine.invoke({ id: execution.id, 'items.elementId': 'Approve' }, {});
    assert.equal(execution.instance.status, 'end');
    assert.ok(execution.instance.data.approvedAt, 'the end script ran');
    assert.deepEqual(errors, []);
    await close();
});
