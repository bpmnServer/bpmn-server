// @features: form-lookups
// A form field's list and lookup in a browser (public/javascripts/formLookup.js, docs/design/form-lookups.md): the
// start form's drop-down filled from its source, the search box answering as the person types and filtered by the
// department just picked, the key saved with its label beside it; the task's form showing what was chosen.
//   npm run test:ui
import test from 'node:test';
import assert from 'node:assert/strict';
import { chromium } from 'playwright';
import { formFieldLookup } from 'bpmn-server';
import { startWebApp, PASSWORD } from '../support/webApp.mjs';

const MODEL = 'form-lookups-ui';
const FIELDS = `
        <camunda:formField id="department" label="Department" type="string">
          <owf:list source="service:departments" key="code" display="title" />
        </camunda:formField>
        <camunda:formField id="approver" label="Approver" type="string">
          <owf:lookup source="service:employees" display="name" filter="\${data.department}" />
        </camunda:formField>`;
const XML = `<?xml version="1.0" encoding="UTF-8"?>
<bpmn:definitions xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:camunda="http://camunda.org/schema/1.0/bpmn"
  xmlns:owf="http://omniworkflow.com/schema/owf/1.0" id="d" targetNamespace="urn:test">
  <bpmn:process id="FormLookups" isExecutable="true">
    <bpmn:startEvent id="Begin"><bpmn:extensionElements><camunda:formData>${FIELDS}</camunda:formData></bpmn:extensionElements>
      <bpmn:outgoing>f1</bpmn:outgoing></bpmn:startEvent>
    <bpmn:userTask id="Review" name="Review" camunda:candidateGroups="staff"><bpmn:extensionElements><camunda:formData>${FIELDS}</camunda:formData></bpmn:extensionElements>
      <bpmn:incoming>f1</bpmn:incoming><bpmn:outgoing>f2</bpmn:outgoing></bpmn:userTask>
    <bpmn:endEvent id="Done"><bpmn:incoming>f2</bpmn:incoming></bpmn:endEvent>
    <bpmn:sequenceFlow id="f1" sourceRef="Begin" targetRef="Review" />
    <bpmn:sequenceFlow id="f2" sourceRef="Review" targetRef="Done" />
  </bpmn:process>
</bpmn:definitions>`;

let web, browser;
test.before(async () => {
    web = await startWebApp();
    browser = await chromium.launch();
    await web.bpmnServer.models.save(MODEL, XML);
});
test.after(async () => {
    await browser?.close();
    await web?.stop();
    setImmediate(() => process.exit(0));
});

const optionsOf = (page, selector) => page.locator(selector).evaluate(el => [...el.options].map(o => [o.value, o.textContent]));

test('the drawn forms: a drop-down, a search as one types filtered by the form, the key and its label saved', async () => {
    const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
    await context.route('**/*', route => route.request().url().startsWith(web.base) ? route.continue() : route.abort());
    const page = await context.newPage();
    page.setDefaultTimeout(20000);
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    await page.goto(web.base + '/login');
    await page.fill('#userName', 'staff');
    await page.fill('#password', PASSWORD);
    await Promise.all([page.waitForURL(url => !url.pathname.startsWith('/login')), page.click('button[type=submit]')]);

    // the start form: the list filled from service:departments
    await page.goto(`${web.base}/dashboard/start/${MODEL}`);
    const department = '#Begin-department', approver = '#Begin-approver';
    await page.waitForFunction(sel => document.querySelector(sel).options.length > 1, department);
    assert.deepEqual(await optionsOf(page, department), [['', ''], ['HR', 'Human Resources'], ['IT', 'Technology'], ['FIN', 'Finance']]);
    await page.selectOption(department, 'IT');
    assert.equal(await page.inputValue('#Begin-department-display'), 'Technology', 'the label beside the key');

    // the lookup: searched as one types, by the department just picked
    await page.fill(approver, 'da');
    await page.waitForFunction(() => document.querySelectorAll('#Begin-approver-choices option').length > 0);
    assert.deepEqual(await page.locator('#Begin-approver-choices option').evaluateAll(os => os.map(o => o.value)), ['Dana Scott'], 'IT only');

    // text that is not a choice: no key, and the form does not submit
    await page.fill(approver, 'Nobody');
    assert.equal(await page.inputValue('#Begin-approver-key'), '');
    assert.equal(await page.locator(approver).evaluate(el => el.checkValidity()), false);

    await page.fill(approver, 'Dana Scott');
    await page.waitForFunction(() => document.querySelector('#Begin-approver-key').value === 'dana.scott');
    assert.equal(await page.inputValue('#Begin-approver-display'), 'Dana Scott');
    assert.equal(await page.locator(approver).evaluate(el => el.checkValidity()), true);

    await Promise.all([page.waitForURL(url => !url.pathname.startsWith('/dashboard/start')), page.click('form.dash-start-form button[type=submit]')]);
    const [instance] = await web.bpmnServer.dataStore.findInstances({ name: MODEL }, 'full');
    assert.deepEqual(
        { department: instance.data.department, departmentDisplay: instance.data.departmentDisplay, approver: instance.data.approver, approverDisplay: instance.data.approverDisplay },
        { department: 'IT', departmentDisplay: 'Technology', approver: 'dana.scott', approverDisplay: 'Dana Scott' });

    // the task's form: what was chosen shown; changed, then completed
    const item = instance.items.find(i => i.elementId === 'Review' && i.status === 'wait');
    await page.goto(`${web.base}/invokeItem?id=${item.id}&processName=${MODEL}&elementId=Review`);
    await page.waitForFunction(() => document.querySelector('select[name=department]').options.length > 1);
    assert.equal(await page.inputValue('select[name=department]'), 'IT', 'the chosen department selected');
    assert.equal(await page.inputValue('#approver-text'), 'Dana Scott', 'the chosen approver shown by name');
    assert.equal(await page.inputValue('#approver-key'), 'dana.scott');

    await page.selectOption('select[name=department]', 'FIN');
    await page.fill('#approver-text', 'mi');
    await page.waitForFunction(() => [...document.querySelectorAll('#approver-choices option')].some(o => o.value === 'Michael Brown'));
    await page.fill('#approver-text', 'Michael Brown');
    await page.waitForFunction(() => document.querySelector('#approver-key').value === 'michael.brown');
    await Promise.all([page.waitForURL(url => !url.pathname.startsWith('/invokeItem')), page.click('form[name=InvokeForm] button[type=submit]')]);

    const done = await web.bpmnServer.dataStore.findInstance({ id: instance.id }, 'full');
    assert.equal(done.status, 'end', 'completed');
    assert.deepEqual([done.data.department, done.data.departmentDisplay, done.data.approver, done.data.approverDisplay],
        ['FIN', 'Finance', 'michael.brown', 'Michael Brown']);
    assert.deepEqual(errors, []);
    await context.close();
});

// the editor: a model with a lookup opened and saved keeps it; a field's Choices set in the properties panel
const EDITOR_XML = `<?xml version="1.0" encoding="UTF-8"?>
<bpmn:definitions xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" xmlns:dc="http://www.omg.org/spec/DD/20100524/DC" xmlns:di="http://www.omg.org/spec/DD/20100524/DI" xmlns:camunda="http://camunda.org/schema/1.0/bpmn" xmlns:owf="http://omniworkflow.com/schema/owf/1.0" id="d" targetNamespace="urn:test">
  <bpmn:process id="Edited" isExecutable="true">
    <bpmn:startEvent id="Begin"><bpmn:outgoing>f1</bpmn:outgoing></bpmn:startEvent>
    <bpmn:userTask id="Review" name="Review"><bpmn:extensionElements><camunda:formData>
        <camunda:formField id="department" label="Department" type="string" />
        <camunda:formField id="approver" label="Approver" type="string">
          <owf:lookup source="connector:hr/searchPeople" text="q" key="userName" display="name" filter="\${data.department}" filterInput="dept" items="results" />
        </camunda:formField>
      </camunda:formData></bpmn:extensionElements>
      <bpmn:incoming>f1</bpmn:incoming><bpmn:outgoing>f2</bpmn:outgoing></bpmn:userTask>
    <bpmn:endEvent id="Done"><bpmn:incoming>f2</bpmn:incoming></bpmn:endEvent>
    <bpmn:sequenceFlow id="f1" sourceRef="Begin" targetRef="Review" />
    <bpmn:sequenceFlow id="f2" sourceRef="Review" targetRef="Done" />
  </bpmn:process>
  <bpmndi:BPMNDiagram id="dia">
    <bpmndi:BPMNPlane id="plane" bpmnElement="Edited">
      <bpmndi:BPMNShape id="Begin_di" bpmnElement="Begin"><dc:Bounds x="100" y="100" width="36" height="36" /></bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Review_di" bpmnElement="Review"><dc:Bounds x="200" y="78" width="100" height="80" /></bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Done_di" bpmnElement="Done"><dc:Bounds x="360" y="100" width="36" height="36" /></bpmndi:BPMNShape>
      <bpmndi:BPMNEdge id="f1_di" bpmnElement="f1"><di:waypoint x="136" y="118" /><di:waypoint x="200" y="118" /></bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="f2_di" bpmnElement="f2"><di:waypoint x="300" y="118" /><di:waypoint x="360" y="118" /></bpmndi:BPMNEdge>
    </bpmndi:BPMNPlane>
  </bpmndi:BPMNDiagram>
</bpmn:definitions>`;

test('the editor: a lookup kept when the model is saved; a field\'s choices set in the properties panel', async () => {
    await web.bpmnServer.models.save('form-lookups-edited', EDITOR_XML);
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
    await page.goto(`${web.base}/model/edit/form-lookups-edited`);
    await page.waitForSelector('#js-canvas .djs-shape');

    await page.evaluate(() => { const m = window.bpmnModeler; m.get('selection').select(m.get('elementRegistry').get('Review')); });
    const group = page.locator('.bio-properties-panel-group-header', { hasText: 'Form fields' }).first();
    await page.waitForTimeout(200);
    if (!/\bopen\b/.test(await group.getAttribute('class'))) await group.click();

    // the approver's lookup, shown: a connector's, so its inputs too
    await page.locator('.bio-properties-panel-collapsible-entry-header', { hasText: 'approver' }).click();
    assert.equal(await page.inputValue('#bio-properties-panel-Review-formField-1-choices'), 'lookup');
    assert.equal(await page.inputValue('#bio-properties-panel-Review-formField-1-choices-source'), 'connector:hr/searchPeople');
    assert.equal(await page.inputValue('#bio-properties-panel-Review-formField-1-choices-text'), 'q');
    assert.equal(await page.inputValue('#bio-properties-panel-Review-formField-1-choices-items'), 'results');

    // the department: made a list of a service's choices
    await page.locator('.bio-properties-panel-collapsible-entry-header', { hasText: 'department' }).click();
    await page.selectOption('#bio-properties-panel-Review-formField-0-choices', 'list');
    await page.fill('#bio-properties-panel-Review-formField-0-choices-source', 'service:departments');
    await page.fill('#bio-properties-panel-Review-formField-0-choices-key', 'code');
    await page.fill('#bio-properties-panel-Review-formField-0-choices-display', 'title');
    assert.equal(await page.locator('#bio-properties-panel-Review-formField-0-choices-text').count(), 0, 'a service: no inputs to name');
    await page.waitForTimeout(400);

    const saved = page.waitForResponse(r => r.request().method() === 'POST' && r.url().endsWith('/model/edit/form-lookups-edited'));
    await page.click('#js-save');
    assert.equal((await saved).status(), 200);
    const source = await web.bpmnServer.definitions.getSource('form-lookups-edited');
    assert.match(source, /<camunda:formField id="department"[^>]*>\s*<owf:list source="service:departments" key="code" display="title" \/>/);
    assert.match(source, /<owf:lookup source="connector:hr\/searchPeople" key="userName" display="name" filter="\$\{data.department\}" filterInput="dept" text="q" items="results" \/>/,
        'the lookup kept, every attribute');

    // the model as the engine reads it: both fields have their choices
    const { fields } = (await web.bpmnServer.definitions.load('form-lookups-edited')).getNodeInfo('Review');
    assert.deepEqual(fields.map(f => formFieldLookup(f)?.kind), ['list', 'lookup']);
    assert.deepEqual(errors, []);
    await context.close();
});
