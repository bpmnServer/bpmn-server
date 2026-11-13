// @features: assignment-policies
// A user task's assignment policy in the model editor (properties/PolicyEntries.jsx): chosen from the policies of
// the models folder, saved as owf:assignmentPolicy, and previewed with the Test tab's scenario.
//   npm run test:ui
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright';
import { startWebApp, PASSWORD } from '../support/webApp.mjs';

const MODEL = `<?xml version="1.0" encoding="UTF-8"?>
<bpmn:definitions xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" xmlns:dc="http://www.omg.org/spec/DD/20100524/DC" xmlns:di="http://www.omg.org/spec/DD/20100524/DI" id="d" targetNamespace="urn:test">
  <bpmn:process id="Leave" isExecutable="true">
    <bpmn:startEvent id="Start" />
    <bpmn:userTask id="Approve" name="Approve" />
    <bpmn:endEvent id="End" />
    <bpmn:sequenceFlow id="f1" sourceRef="Start" targetRef="Approve" />
    <bpmn:sequenceFlow id="f2" sourceRef="Approve" targetRef="End" />
  </bpmn:process>
  <bpmndi:BPMNDiagram id="dia">
    <bpmndi:BPMNPlane id="plane" bpmnElement="Leave">
      <bpmndi:BPMNShape id="Start_di" bpmnElement="Start"><dc:Bounds x="100" y="100" width="36" height="36" /></bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Approve_di" bpmnElement="Approve"><dc:Bounds x="200" y="78" width="100" height="80" /></bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="End_di" bpmnElement="End"><dc:Bounds x="360" y="100" width="36" height="36" /></bpmndi:BPMNShape>
      <bpmndi:BPMNEdge id="f1_di" bpmnElement="f1"><di:waypoint x="136" y="118" /><di:waypoint x="200" y="118" /></bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="f2_di" bpmnElement="f2"><di:waypoint x="300" y="118" /><di:waypoint x="360" y="118" /></bpmndi:BPMNEdge>
    </bpmndi:BPMNPlane>
  </bpmndi:BPMNDiagram>
</bpmn:definitions>`;

const POLICY = `<?xml version="1.0" encoding="UTF-8"?>
<definitions xmlns="https://www.omg.org/spec/DMN/20191111/MODEL/" id="d" name="LeaveApproval">
  <decision id="LeaveApproval" name="LeaveApproval">
    <decisionTable hitPolicy="FIRST">
      <input id="i1" label="days"><inputExpression typeRef="number"><text>days</text></inputExpression></input>
      <output id="o1" name="candidateGroups" typeRef="string" />
      <rule id="r1"><inputEntry id="e1"><text>&gt; 10</text></inputEntry><outputEntry id="g1"><text>"HR"</text></outputEntry></rule>
      <rule id="r2"><inputEntry id="e2"><text>-</text></inputEntry><outputEntry id="g2"><text>"Manager"</text></outputEntry></rule>
    </decisionTable>
  </decision>
</definitions>`;

const FEATURE = `Feature: Leave

  Scenario: A long leave
    When @start process:"Leave" as :instance
      | days | 15 |
`;

let web, browser;
test.before(async () => {
    web = await startWebApp();
    browser = await chromium.launch();
    fs.writeFileSync(path.join(web.definitionsPath, 'Leave.bpmn'), MODEL);
    fs.writeFileSync(path.join(web.definitionsPath, 'Leave.feature'), FEATURE);
    fs.mkdirSync(path.join(web.definitionsPath, 'policies', 'assignment'), { recursive: true });
    fs.writeFileSync(path.join(web.definitionsPath, 'policies', 'assignment', 'LeaveApproval.dmn.xml'), POLICY);
    await web.bpmnServer.engine.install({ rebuild: true });
});
test.after(async () => {
    await browser?.close();
    await web?.stop();
    setImmediate(() => process.exit(0));
});

test("the User assignment group: the policy chosen from the models folder's, saved, previewed with the Test tab's scenario", async () => {
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
    await page.goto(`${web.base}/model/edit/Leave`);
    await page.waitForSelector('#js-canvas .djs-shape');

    await page.evaluate(() => { const m = window.bpmnModeler; m.get('selection').select(m.get('elementRegistry').get('Approve')); });
    const header = page.locator('.bio-properties-panel-group-header', { hasText: 'User assignment' }).first();
    await page.waitForTimeout(200);
    if (!/\bopen\b/.test(await header.getAttribute('class'))) await header.click();

    const select = page.locator('[data-entry-id="assignment-policy"] select');
    await page.waitForFunction(() => [...document.querySelectorAll('[data-entry-id="assignment-policy"] option')].some(o => o.value === 'LeaveApproval'));
    await select.selectOption('LeaveApproval');
    await page.waitForTimeout(300);
    assert.ok(await page.locator('.bpmn-server-policy-open', { hasText: 'Open LeaveApproval' }).count());
    const preview = page.locator('[data-preview-for="assignment-policy"]');
    assert.match(await preview.innerText(), /Open a scenario in the Test tab/);

    await page.click('#js-tab-test');
    await page.waitForSelector('#js-test .test-panel');
    await page.waitForFunction(() => /Rule 1: offered to HR/.test(document.querySelector('[data-preview-for="assignment-policy"]')?.textContent ?? ''));
    assert.match(await preview.innerText(), /A long leave's start data/);

    const saved = page.waitForResponse(r => r.request().method() === 'POST' && r.url().endsWith('/model/edit/Leave'));
    await page.click('#js-save');
    assert.equal((await saved).status(), 200);
    assert.match(await web.bpmnServer.definitions.getSource('Leave'), /<bpmn:userTask id="Approve"[^>]*owf:assignmentPolicy="LeaveApproval"/);

    // the task, run: the policy's rule assigns it
    const run = await web.bpmnServer.engine.start('Leave', { days: 3 }, null, 'admin');
    assert.deepEqual(run.instance.items.find(i => i.elementId === 'Approve').candidateGroups, ['Manager']);
    assert.deepEqual(errors, []);
    await context.close();
});
