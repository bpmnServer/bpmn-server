// @features: add-ons, modeler
// The model editor with add-ons off (docs/design/add-ons.md): only the add-ons that are on bring their parts. With
// Policies, Labels and Forms off and Modeling tools on, a task, a start event and the process have no User assignment,
// Who can start, Policies or Label group; the Test tab is there; and the editor runs without an error.
//   npm run test:ui
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { chromium } from 'playwright';
import { startWebApp, PASSWORD } from '../support/webApp.mjs';

const MODEL = 'AddOnsOff';
const XML = `<?xml version="1.0" encoding="UTF-8"?>
<bpmn:definitions xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" xmlns:dc="http://www.omg.org/spec/DD/20100524/DC" xmlns:di="http://www.omg.org/spec/DD/20100524/DI" id="d" targetNamespace="urn:t">
<bpmn:process id="p" isExecutable="true">
<bpmn:startEvent id="s"><bpmn:outgoing>f0</bpmn:outgoing></bpmn:startEvent>
<bpmn:userTask id="t" name="Review"><bpmn:incoming>f0</bpmn:incoming></bpmn:userTask>
<bpmn:sequenceFlow id="f0" sourceRef="s" targetRef="t" />
</bpmn:process>
<bpmndi:BPMNDiagram id="di"><bpmndi:BPMNPlane id="pl" bpmnElement="p">
<bpmndi:BPMNShape id="s_di" bpmnElement="s"><dc:Bounds x="100" y="100" width="36" height="36" /></bpmndi:BPMNShape>
<bpmndi:BPMNShape id="t_di" bpmnElement="t"><dc:Bounds x="200" y="78" width="100" height="80" /></bpmndi:BPMNShape>
<bpmndi:BPMNEdge id="f0_di" bpmnElement="f0"><di:waypoint x="136" y="118" /><di:waypoint x="200" y="118" /></bpmndi:BPMNEdge>
</bpmndi:BPMNPlane></bpmndi:BPMNDiagram></bpmn:definitions>`;

let web, browser;
test.before(async () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'bpmn-web-addons-ui-'));
    fs.writeFileSync(path.join(dir, 'app-config.json'), JSON.stringify({ addOns: ['modeling'] }));
    web = await startWebApp({ envFile: path.join(dir, '.env') });
    fs.writeFileSync(path.join(web.definitionsPath, MODEL + '.bpmn'), XML);
    await web.bpmnServer.engine.install({ rebuild: true });
    browser = await chromium.launch();
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
    await page.fill('#userName', 'admin');
    await page.fill('#password', PASSWORD);
    await Promise.all([page.waitForURL(url => !url.pathname.startsWith('/login')), page.click('button[type=submit]')]);
    await page.goto(`${web.base}/model/edit/${model}`);
    await page.waitForSelector('#js-problems-counts .count, #js-problems-status:text("No problems")');
    return { page, errors, close: () => context.close() };
}

const select = (page, id) => page.evaluate(id => {
    document.activeElement?.blur();
    const registry = window.bpmnModeler.get('elementRegistry');
    const element = registry.get(id) || registry.find(e => e.businessObject?.processRef?.id === id || e.businessObject?.id === id);
    window.bpmnModeler.get('selection').select(element);
}, id);
async function groupsOf(page, id) {
    await select(page, id);
    await page.waitForSelector('.bio-properties-panel-group-header-title');
    return page.locator('.bio-properties-panel-group-header-title').allInnerTexts();
}

test('with Policies, Labels and Forms off: no group of theirs; Modeling tools on: the Test tab', async () => {
    const { page, errors, close } = await openEditor(MODEL);
    try {
        const task = await groupsOf(page, 't');
        assert.ok(task.length, 'the task has groups');
        for (const off of ['User assignment', 'Label'])
            assert.ok(!task.includes(off), `no ${off} on a task: ${task.join(', ')}`);
        const start = await groupsOf(page, 's');
        assert.ok(!start.includes('Who can start'), `no Who can start: ${start.join(', ')}`);
        const process = await groupsOf(page, 'p');
        for (const off of ['Policies', 'Label'])
            assert.ok(!process.includes(off), `no ${off} on the process: ${process.join(', ')}`);
        assert.equal(await page.locator('#js-tab-test').count(), 1, 'the Test tab: Modeling tools is on');
        assert.deepEqual(errors, [], 'no page errors');
    }
    finally { await close(); }
});
