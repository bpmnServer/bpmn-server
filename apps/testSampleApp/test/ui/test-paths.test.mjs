// @features: test-tab
// Closing coverage's gaps in the Test tab: Test all paths tries the model's paths by itself; Fill a gap guides a recording.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright';
import { reachedIn } from '../../../../packages/bpmn-web/src/testing/coverage.js';
import { conditionValues, modelGraph } from '../../../../packages/bpmn-web/modeler/src/testing/paths.js';
import { startWebApp, PASSWORD } from '../support/webApp.mjs';

let web, browser;
test.before(async () => {
    web = await startWebApp();
    browser = await chromium.launch();
    fs.copyFileSync(path.join(process.cwd(), 'processes', 'Error events.bpmn'), path.join(web.definitionsPath, 'Error events.bpmn'));
    fs.writeFileSync(path.join(web.definitionsPath, 'branches.bpmn'), branches());
    await web.bpmnServer.engine.install({ rebuild: true });
});
test.after(async () => {
    await browser?.close();
    await web?.stop();
    setImmediate(() => process.exit(0));
});

/** A task whose form chooses a branch, and a start value that chooses another; a service task on one way. */
function branches() {
    const shape = (id, element, x, y, w = 36, h = 36) => `<bpmndi:BPMNShape id="${id}" bpmnElement="${element}"><dc:Bounds x="${x}" y="${y}" width="${w}" height="${h}" /></bpmndi:BPMNShape>`;
    const edge = (id, flow, points) => `<bpmndi:BPMNEdge id="${id}" bpmnElement="${flow}">${points.map(([x, y]) => `<di:waypoint x="${x}" y="${y}" />`).join('')}</bpmndi:BPMNEdge>`;
    return `<?xml version="1.0" encoding="UTF-8"?>
<bpmn:definitions xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" xmlns:dc="http://www.omg.org/spec/DD/20100524/DC" xmlns:di="http://www.omg.org/spec/DD/20100524/DI" xmlns:camunda="http://camunda.org/schema/1.0/bpmn" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" id="d" targetNamespace="urn:test">
<bpmn:process id="Branches" isExecutable="true">
  <bpmn:startEvent id="start" name="Begin" />
  <bpmn:exclusiveGateway id="size" name="Size" default="toAsk" />
  <bpmn:userTask id="ask" name="Ask"><bpmn:extensionElements><camunda:formData>
    <camunda:formField id="choice" label="Choice" type="enum"><camunda:value id="yes" name="Yes" /><camunda:value id="no" name="No" /></camunda:formField>
  </camunda:formData></bpmn:extensionElements></bpmn:userTask>
  <bpmn:exclusiveGateway id="answer" name="Answer" default="toOther" />
  <bpmn:endEvent id="big" name="Big" />
  <bpmn:endEvent id="yesEnd" name="Yes end" />
  <bpmn:endEvent id="other" name="Other" />
  <bpmn:sequenceFlow id="f0" sourceRef="start" targetRef="size" />
  <bpmn:sequenceFlow id="toBig" sourceRef="size" targetRef="big"><bpmn:conditionExpression xsi:type="bpmn:tFormalExpression">data.amount &gt; 100</bpmn:conditionExpression></bpmn:sequenceFlow>
  <bpmn:sequenceFlow id="toAsk" sourceRef="size" targetRef="ask" />
  <bpmn:sequenceFlow id="f1" sourceRef="ask" targetRef="answer" />
  <bpmn:sequenceFlow id="toYes" sourceRef="answer" targetRef="yesEnd"><bpmn:conditionExpression xsi:type="bpmn:tFormalExpression">data.choice == 'yes'</bpmn:conditionExpression></bpmn:sequenceFlow>
  <bpmn:sequenceFlow id="toOther" sourceRef="answer" targetRef="other" />
</bpmn:process>
<bpmndi:BPMNDiagram id="dia"><bpmndi:BPMNPlane id="plane" bpmnElement="Branches">
  ${shape('s1', 'start', 100, 100)}${shape('s2', 'size', 180, 93, 50, 50)}${shape('s3', 'ask', 280, 78, 100, 80)}${shape('s4', 'answer', 430, 93, 50, 50)}
  ${shape('s5', 'big', 280, 240)}${shape('s6', 'yesEnd', 560, 40)}${shape('s7', 'other', 560, 150)}
  ${edge('e0', 'f0', [[136, 118], [180, 118]])}${edge('e1', 'toBig', [[205, 143], [205, 258], [280, 258]])}${edge('e2', 'toAsk', [[230, 118], [280, 118]])}
  ${edge('e3', 'f1', [[380, 118], [430, 118]])}${edge('e4', 'toYes', [[455, 93], [455, 58], [560, 58]])}${edge('e5', 'toOther', [[455, 143], [455, 168], [560, 168]])}
</bpmndi:BPMNPlane></bpmndi:BPMNDiagram></bpmn:definitions>`;
}

async function openTestTab(model) {
    const context = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
    await context.route('**/*', route => route.request().url().startsWith(web.base) ? route.continue() : route.abort());
    await context.addInitScript(() => localStorage.setItem('bpmn-web.modeler.panel', JSON.stringify({ dockHeight: 560 })));
    const page = await context.newPage();
    page.setDefaultTimeout(60000);
    page.on('dialog', d => d.accept());
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    await page.goto(web.base + '/login');
    await page.fill('#userName', 'designer');
    await page.fill('#password', PASSWORD);
    await Promise.all([page.waitForURL(url => !url.pathname.startsWith('/login')), page.click('button[type=submit]')]);
    await page.goto(`${web.base}/model/edit/${encodeURIComponent(model)}`);
    await page.waitForSelector('#js-canvas .djs-shape');
    await page.click('#js-tab-test');
    await page.waitForSelector('#js-test .test-coverage');
    return { page, errors, close: () => context.close() };
}

const counts = async page => {
    const read = async which => (await page.locator(`.test-coverage-${which} strong`).innerText()).split(' of ').map(Number);
    return { nodes: await read('nodes'), flows: await read('flows') };
};
const gaps = page => page.locator('.test-coverage .test-gap').evaluateAll(rows => rows.map(r => r.dataset.elementId));

async function testAllPaths(page) {
    await page.click('.test-explore-open');
    await page.click('.test-explore-go');
    await page.waitForSelector('.test-explore-report');
    return page.locator('.test-explore-report').innerText();
}

test('what a condition turns on, read off it', () => {
    const one = text => conditionValues(text);
    assert.deepEqual(one('data.var1==1'), [{ path: 'var1', when: 1, otherwise: 2 }]);
    assert.deepEqual(one("$(data.status === 'Open')"), [{ path: 'status', when: 'Open', otherwise: 'not Open' }]);
    assert.deepEqual(one('(item.data.reminderCounter < 1)'), [{ path: 'reminderCounter', when: 0, otherwise: 1 }]);
    assert.deepEqual(one('data.subProcess.Cancel==true'), [{ path: 'subProcess.Cancel', when: true, otherwise: false }]);
    assert.deepEqual(one('!data.approved'), [{ path: 'approved', when: false, otherwise: true }]);
    assert.deepEqual(one('$(claimCovered == true)'), [{ path: 'claimCovered', when: true, otherwise: false }]);
    assert.deepEqual(one('(item.data.a=="Yes") || item.data.a').map(v => v.when), ['Yes', true]);
    assert.deepEqual(one('appDelegate.isOk(data)'), [], 'a call says nothing');
    assert.deepEqual(one(''), []);
});

test('the way to an element: an error reaches who catches it; what cannot be reached says so', () => {
    const graph = modelGraph([
        { id: 'start', isStart: true }, { id: 'a' }, { id: 'f1', source: 'start', target: 'a' },
        { id: 'throw', throws: ['error:E1'] }, { id: 'toThrow', source: 'a', target: 'throw', condition: 'data.x == 1' },
        { id: 'handler', triggered: true }, { id: 'catch', parent: 'handler', isStart: true, catches: ['error:E1'] },
        { id: 'end' }, { id: 'toEnd', source: 'a', target: 'end' },
    ]);
    assert.deepEqual(graph.way(['start'], 'catch'), ['start', 'f1', 'a', 'toThrow', 'throw', 'catch']);
    assert.deepEqual(graph.valuesOn(graph.way(['start'], 'catch')), { x: 1 });
    assert.equal(graph.canReach(['end'], 'throw'), false);
    assert.equal(graph.canReach(['a'], 'throw'), true);
});

test('a listener counts only if it fired: a flow left it', () => {
    const listeners = new Map([['boundary', ['out']], ['catch', ['caught']]]);
    const items = [{ elementId: 'task', status: 'end' }, { elementId: 'boundary', status: 'end' }, { elementId: 'catch', status: 'end' }, { elementId: 'caught', status: 'end' }, { elementId: 'gone', status: 'cancelled' }];
    assert.deepEqual([...reachedIn(items, listeners)], ['task', 'catch', 'caught']);
});

test('Test all paths, nothing recorded: every way found, scenarios saved as generated; counted apart until reviewed', async () => {
    const { page, errors, close } = await openTestTab('branches');
    assert.deepEqual(await counts(page), { nodes: [0, 7], flows: [0, 6] });

    const report = await testAllPaths(page);
    assert.match(report, /3 scenarios added/);
    assert.match(report, /Nothing is left unreached/);
    assert.deepEqual(await counts(page), { nodes: [7, 7], flows: [6, 6] });
    assert.deepEqual(await gaps(page), []);
    assert.equal(await page.locator('.test-explore-open').count(), 0);
    assert.match(await page.locator('.test-coverage-generated').innerText(), /13 of these only by generated scenarios/);

    const names = await page.locator('.test-tree-name').allInnerTexts();
    assert.deepEqual([...names].sort(), ['Path to Big', 'Path to Other', 'Path to Yes end']);
    assert.equal(await page.locator('.test-tree-generated').count(), 3);

    // only the kept runs are left
    const left = await web.bpmnServer.dataStore.findInstances({ name: 'branches' }, 'summary');
    assert.equal(left.filter(i => String(i.id).startsWith('test-')).length, 3);

    // reviewed: tested, and no longer counted apart
    const big = page.locator('.test-tree-row', { hasText: 'Path to Big' });
    await big.click();
    await page.click('.test-generated-review');
    await page.waitForFunction(() => /^8 of these/.test(document.querySelector('.test-coverage-generated')?.textContent));
    assert.equal(await page.locator('.test-tree-generated').count(), 2);

    // the rest deleted, with their runs: the gaps are back, and the reviewed one stays
    await page.click('.test-list-menu summary');
    await page.click('.test-delete-generated');
    await page.waitForFunction(() => document.querySelectorAll('.test-tree-generated').length === 0);
    assert.deepEqual(await page.locator('.test-tree-name').allInnerTexts(), ['Path to Big']);
    assert.ok((await gaps(page)).includes('yesEnd'));
    assert.deepEqual(errors, []);
    await close();
});

test('Fill a gap: its goal, the data filled in; reached, saved, and off the list', async () => {
    const { page, errors, close } = await openTestTab('branches');
    assert.ok((await gaps(page)).includes('yesEnd'));

    await page.locator('.test-gap[data-element-id="yesEnd"] .test-gap-fill').click();
    assert.match(await page.locator('.test-goal').innerText(), /Goal: reach Yes end/);
    assert.equal(await page.locator('.test-name').inputValue(), 'Reach Yes end (yesEnd)');
    await page.click('.test-start-go');
    await page.waitForSelector('.test-step.pending[data-element-id="ask"]');
    assert.match(await page.locator('.test-goal').innerText(), /Next: Ask/);
    assert.equal(await page.locator('[data-field="choice"]').inputValue(), 'yes', 'the choice the way there asks');

    await page.locator('.test-step-run').click();
    await page.waitForSelector('.test-goal.reached');
    assert.match(await page.locator('.test-goal').innerText(), /Reached Yes end/);
    await page.waitForFunction(() => !document.querySelector('.test-gap[data-element-id="yesEnd"]'));
    assert.deepEqual(errors, []);
    await close();
});

test('Fill a gap: a value not in any form goes in the start data; a run that goes another way can try again', async () => {
    const { page, errors, close } = await openTestTab('branches');
    // what is left to reach here: Big, by its start value
    await page.click('.test-list-menu summary');
    await page.click('.test-clear-all');
    await page.waitForFunction(() => document.querySelector('.test-gap[data-element-id="big"]'));
    await page.locator('.test-gap[data-element-id="big"] .test-gap-fill').click();
    const data = JSON.parse(await page.locator('.test-start textarea').first().inputValue());
    assert.equal(data.amount, 101);

    // the other way: this run cannot get there any more
    await page.locator('.test-start textarea').first().fill('{"amount":5}');
    await page.click('.test-start-go');
    await page.waitForSelector('.test-step.pending[data-element-id="ask"]');
    await page.waitForSelector('.test-goal.lost');
    assert.match(await page.locator('.test-goal').innerText(), /can no longer be reached/);
    await page.click('.test-goal-again');
    await page.waitForSelector('.test-start');
    assert.deepEqual(errors, []);
    await close();
});

test('a receive task is a step: recorded, repeated by Run, and Test all paths goes past it', async () => {
    const shape = (id, element, x, w = 36, h = 36) => `<bpmndi:BPMNShape id="${id}" bpmnElement="${element}"><dc:Bounds x="${x}" y="100" width="${w}" height="${h}" /></bpmndi:BPMNShape>`;
    const edge = (id, flow, a, b) => `<bpmndi:BPMNEdge id="${id}" bpmnElement="${flow}"><di:waypoint x="${a}" y="118" /><di:waypoint x="${b}" y="118" /></bpmndi:BPMNEdge>`;
    for (const name of ['receives', 'receives-2'])
        fs.writeFileSync(path.join(web.definitionsPath, `${name}.bpmn`), `<?xml version="1.0" encoding="UTF-8"?>
<bpmn:definitions xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" xmlns:dc="http://www.omg.org/spec/DD/20100524/DC" xmlns:di="http://www.omg.org/spec/DD/20100524/DI" id="d" targetNamespace="urn:test">
<bpmn:process id="Receives" isExecutable="true">
  <bpmn:startEvent id="start" /><bpmn:receiveTask id="payment" name="Got Payment" /><bpmn:endEvent id="end" />
  <bpmn:sequenceFlow id="f0" sourceRef="start" targetRef="payment" /><bpmn:sequenceFlow id="f1" sourceRef="payment" targetRef="end" />
</bpmn:process>
<bpmndi:BPMNDiagram id="dia"><bpmndi:BPMNPlane id="plane" bpmnElement="Receives">
  ${shape('s1', 'start', 100)}${shape('s2', 'payment', 200, 100, 36)}${shape('s3', 'end', 350)}${edge('e0', 'f0', 136, 200)}${edge('e1', 'f1', 300, 350)}
</bpmndi:BPMNPlane></bpmndi:BPMNDiagram></bpmn:definitions>`);
    await web.bpmnServer.engine.install({ rebuild: true });

    const { page, errors, close } = await openTestTab('receives');
    await page.click('.test-new-menu summary');
    await page.click('.test-new');
    await page.click('.test-run');
    await page.click('.test-start-go');
    const step = page.locator('.test-step.pending[data-element-id="payment"]');
    await step.waitFor();
    assert.equal(await page.locator('.test-inside').count(), 0, 'not "also waiting"');
    assert.equal(await step.locator('.test-step-run').innerText(), 'Receive');
    await step.locator('.test-step-run').click();
    await page.waitForSelector('.test-summary.ok');
    await page.click('.test-replay');
    await page.waitForFunction(() => /passed/.test(document.querySelector('.test-status').textContent));
    assert.match(await page.locator('.test-status').innerText(), /passed/);
    assert.deepEqual(await gaps(page), []);
    assert.deepEqual(errors, []);
    await close();

    const other = await openTestTab('receives-2');
    assert.match(await testAllPaths(other.page), /Nothing is left unreached/);
    assert.deepEqual(other.errors, []);
    await other.close();
});

test('Test all paths on Error events: its conditions and form reach all of it, the error outside a sub-process too', async () => {
    const { page, errors, close } = await openTestTab('Error events');
    // the three event sub-processes have no item of their own, so they are not counted: what is inside them is
    assert.deepEqual(await counts(page), { nodes: [0, 28], flows: [0, 22] });
    const report = await testAllPaths(page);
    process.stderr.write(`Error events: ${JSON.stringify(await counts(page))}\n${report}\nleft: ${JSON.stringify(await gaps(page))}\n`);
    assert.deepEqual(await gaps(page), []);
    assert.deepEqual(await counts(page), { nodes: [28, 28], flows: [22, 22] });
    assert.match(report, /Nothing is left unreached/);
    assert.doesNotMatch(report, /failed/);
    assert.deepEqual(errors, []);
    await close();
});
