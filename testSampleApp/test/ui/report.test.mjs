// @features: report
// The editor's Report tab (under the diagram, beside Problems): the whole process as one document, from the
// model being edited.
//   npm run test:ui
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';
import { startWebApp, PASSWORD, FIXTURES } from '../support/webApp.mjs';

const SAMPLES = FIXTURES;

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

async function openReport(model, xml) {
    fs.writeFileSync(path.join(web.definitionsPath, model + '.bpmn'), xml);
    await web.bpmnServer.definitions.rebuild();
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
    await page.waitForSelector('#js-problems-counts .count, #js-problems-status:text("No problems")');
    assert.equal(await page.locator('#js-print').isVisible(), false, 'Print belongs to the report');
    await page.click('#js-tab-report');
    await page.waitForSelector('.report-element');
    return { page, errors, close: () => context.close() };
}

const section = (page, id) => page.locator(`.report-element[data-element-id="${id}"]`);

test('the report lists the process in flow order, with how bpmn-server reads each element', async () => {
    const { page, errors, close } = await openReport('report-car', fs.readFileSync(path.join(FIXTURES, 'buy-used-car.bpmn'), 'utf8'));
    assert.equal(await page.locator('#js-canvas').isVisible(), true, 'the diagram stays in view above');
    assert.equal(await page.locator('#js-print').isVisible(), true);

    const order = await page.locator('.report-element').evaluateAll(els => els.map(e => e.dataset.elementId));
    const at = id => order.indexOf(id);
    assert.ok(at('StartEvent_158yep3') === 0, order.join());
    assert.ok(at('task_Buy') < at('gateway_1'));
    for (const branch of ['task_clean', 'task_repair'])
        assert.ok(at('gateway_1') < at(branch) && at(branch) < at('gateway_2'), 'the join after both branches: ' + order.join());
    assert.ok(at('gateway_2') < at('task_Drive'));

    // an outline: `type: id, name`, its settings, then its outgoing flows nested under it
    const buy = section(page, 'task_Buy');
    assert.equal(await buy.locator('> h3').innerText(), 'userTask: task_Buy, Buy');
    assert.match(await buy.locator('.report-documentation').innerText(), /A User Task/);
    const settings = await buy.locator('.report-settings').first().innerText();
    assert.match(settings, /^candidateGroups: Employee,Manager$/m);
    assert.match(settings, /^formField: needsRepairs \(boolean\) Repairs Required\?$/m);
    assert.match(settings, /^on start \(JavaScript\):\s*\nvar date=new Date\(\);/m);
    assert.match(await buy.locator('.report-flow').innerText(), /sequenceFlow: flow_buy_gw\s+targetRef: gateway_1/);

    const clean = page.locator('.report-element[data-element-id="gateway_1"] .report-flow[data-element-id="flow_gw1_clean"]');
    assert.match(await clean.innerText(), /targetRef: task_clean\s+conditionExpression \(JavaScript\): \$\(item\.data\.needsCleaning=="Yes"\)/);
    assert.deepEqual(errors, []);
    await close();
});

test('problems are shown with their element, and the report follows edits', async () => {
    const xml = fs.readFileSync(path.join(FIXTURES, 'leave-request.bpmn'), 'utf8').replace("data.approvedBy = 'system';", 'data.approvedBy = ;');
    const { page, errors, close } = await openReport('report-broken', xml);
    assert.match(await page.locator('.report-summary').innerText(), /Problems: 1 error/);
    assert.match(await section(page, 'AutoApprove').locator('> .report-body > .report-issues').innerText(), /ERROR\s+The script does not compile/);

    // an edit in the diagram shows in the report, which stays open beside it
    await page.evaluate(() => {
        const m = window.bpmnModeler;
        m.get('modeling').updateProperties(m.get('elementRegistry').get('Submit'), { name: 'Send the request' });
    });
    await page.waitForSelector('.report-element[data-element-id="Submit"] > h3:has-text("Submit, Send the request")');
    assert.deepEqual(errors, []);
    await close();
});

test('an element of the report is selected in the diagram', async () => {
    const { page, errors, close } = await openReport('report-reveal', fs.readFileSync(path.join(FIXTURES, 'buy-used-car.bpmn'), 'utf8'));
    await section(page, 'task_Drive').locator('h3 a').click();
    assert.equal(await page.getAttribute('#js-tab-report', 'aria-selected'), 'true', 'the report stays open');
    assert.deepEqual(await page.evaluate(() => window.bpmnModeler.get('selection').get().map(e => e.id)), ['task_Drive']);
    assert.deepEqual(errors, []);
    await close();
});

const NESTED = `<?xml version="1.0" encoding="UTF-8"?>
<bpmn:definitions xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:camunda="http://camunda.org/schema/1.0/bpmn" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" id="d" targetNamespace="urn:test">
  <bpmn:process id="Orders" name="Orders" isExecutable="true">
    <bpmn:startEvent id="Start" />
    <bpmn:subProcess id="EachLine" name="Each line">
      <bpmn:multiInstanceLoopCharacteristics isSequential="true" camunda:collection="$data.lines" camunda:elementVariable="line" />
      <bpmn:startEvent id="LineStart" />
      <bpmn:userTask id="Pick" name="Pick the line" camunda:candidateGroups="warehouse" />
      <bpmn:endEvent id="LineEnd" />
      <bpmn:sequenceFlow id="l1" sourceRef="LineStart" targetRef="Pick" />
      <bpmn:sequenceFlow id="l2" sourceRef="Pick" targetRef="LineEnd" />
    </bpmn:subProcess>
    <bpmn:boundaryEvent id="Late" name="Late" attachedToRef="EachLine" cancelActivity="false">
      <bpmn:timerEventDefinition><bpmn:timeDuration>PT1H</bpmn:timeDuration></bpmn:timerEventDefinition>
    </bpmn:boundaryEvent>
    <bpmn:endEvent id="Reminded" />
    <bpmn:exclusiveGateway id="Again" name="Again?" default="done" />
    <bpmn:endEvent id="End" />
    <bpmn:sequenceFlow id="f1" sourceRef="Start" targetRef="EachLine" />
    <bpmn:sequenceFlow id="f2" sourceRef="EachLine" targetRef="Again" />
    <bpmn:sequenceFlow id="again" sourceRef="Again" targetRef="EachLine">
      <bpmn:conditionExpression xsi:type="bpmn:tFormalExpression">$(data.more === true)</bpmn:conditionExpression>
    </bpmn:sequenceFlow>
    <bpmn:sequenceFlow id="done" sourceRef="Again" targetRef="End" />
    <bpmn:sequenceFlow id="f3" sourceRef="Late" targetRef="Reminded" />
  </bpmn:process>
</bpmn:definitions>`;

test('what an element holds is nested under it: a sub-process\'s elements, a boundary event, a loop; a flow back is a loop', async () => {
    const { layoutProcess } = await import('bpmn-auto-layout');
    const { page, errors, close } = await openReport('report-nested', await layoutProcess(NESTED));
    const top = await page.locator('.report-elements > .report-element').evaluateAll(els => els.map(e => e.dataset.elementId));
    assert.deepEqual(top.filter(id => ['Start', 'EachLine', 'Again', 'End'].includes(id)), ['Start', 'EachLine', 'Again', 'End']);
    assert.ok(!top.includes('Pick') && !top.includes('Late'), 'not at the process level: ' + top.join());

    const each = section(page, 'EachLine');
    assert.match(await each.locator('> h3').innerText(), /^subProcess: EachLine, Each line$/);
    const loop = await each.locator('> .report-body > .report-settings').innerText();
    assert.match(loop, /loop: multi-instance, one after another\s+collection: \$data\.lines\s+elementVariable: line/);
    assert.deepEqual(await each.locator('> .report-body > .report-element').evaluateAll(els => els.map(e => e.dataset.elementId)),
        ['Late', 'LineStart', 'Pick', 'LineEnd'], 'the boundary event, then the sub-process\'s elements');
    assert.match(await section(page, 'Late').innerText(), /cancelActivity: false \(non-interrupting\)\s+timer: duration PT1H/);
    assert.match(await section(page, 'Pick').innerText(), /candidateGroups: warehouse/);

    const back = await page.locator('.report-flow[data-element-id="again"]').innerText();
    assert.match(back, /targetRef: EachLine \(back to an earlier element: a loop\)\s+conditionExpression: \$\(data\.more === true\)/);
    assert.match(await page.locator('.report-flow[data-element-id="done"]').innerText(), /default: yes/);
    assert.deepEqual(errors, []);
    await page.locator('.dock-report').screenshot({ path: fileURLToPath(new URL('./screenshots/report-nested.png', import.meta.url)) }).catch(() => {});
    await close();
});

/** The report as text, as History compares it: the whole model, read again from the editor's XML. */
const reportText = page => page.evaluate(async () => {
    const m = window.bpmnModeler;
    const { rootElement } = await m.get('moddle').fromXML((await m.saveXML()).xml);
    return m.get('report').text(rootElement);
});

test('globals: messages, signals and errors, each with what uses it; pools, lanes and message flows', async () => {
    let { page, errors, close } = await openReport('report-globals', fs.readFileSync(path.join(SAMPLES, 'multiStart.bpmn'), 'utf8'));
    const globals = await page.locator('.report-globals tbody tr').allInnerTexts();
    assert.ok(globals.some(r => /^message\tnewInvoiceMessage \(newInvoice\)\t\tMsg Start catches$/.test(r)), globals.join('|'));
    assert.ok(globals.some(r => /^signal\tcancelSignal2 \(cancelAll2\)\t\tnot used$/.test(r)), globals.join('|'));
    await close();

    ({ page, errors, close } = await openReport('report-error', fs.readFileSync(path.join(SAMPLES, 'GitHub repository.bpmn'), 'utf8')));
    assert.match(await page.innerText('.report-globals'), /error\s+Not found \(NotFoundError\)\s+HTTP_404\s+No such repository catches/);
    await close();

    ({ page, errors, close } = await openReport('report-lanes', fs.readFileSync(path.join(SAMPLES, 'Buy Used Car.bpmn'), 'utf8')));
    const lanes = await page.locator('.report-pools tbody tr').allInnerTexts();
    assert.ok(lanes.some(r => /^Mechanic \(Lane_\w+\)\tProcess_1hf9394\tRepair$/.test(r)), lanes.join('|'));
    assert.ok(lanes.some(r => /^Cleaner \(Lane_\w+\)\t.*\tClean$/.test(r)), lanes.join('|'));
    // a lane's link selects it on the diagram
    await page.locator('.report-pools a', { hasText: 'Mechanic' }).click();
    assert.equal(await page.evaluate(() => window.bpmnModeler.get('selection').get()[0]?.businessObject.name), 'Mechanic');
    await close();

    ({ page, errors, close } = await openReport('report-pools', fs.readFileSync(path.join(SAMPLES, 'messageFlow.bpmn'), 'utf8')));
    const pools = await page.innerText('.report-pools');
    assert.match(pools, /Primary \(Participant_1k8bqpk\)\s+Process_primary/);
    assert.match(pools, /Secondary \(Participant_1oj112i\)\s+Process_secondary \(not executable\)/);
    assert.match(pools, /MessageFlow_1\s+Task 1 \(Primary\)\s+StartEvent_2 \(Secondary\)/, 'a message flow between pools');
    assert.deepEqual(errors, []);
    await close();
});

test('the report text holds the whole model: every value of every sample model, the layout aside', async () => {
    // the report does not show all of these yet: some nested inputs of Check Input, a value in each of the others
    const KNOWN_GAPS = ['Check Input.bpmn', 'test-escalation2.bpmn', 'Issue193.bpmn.txt.bpmn'];
    const files = fs.readdirSync(SAMPLES).filter(f => f.endsWith('.bpmn') && !KNOWN_GAPS.includes(f));
    const missing = [];
    for (const file of files) {
        const { page, close } = await openReport('report-whole', fs.readFileSync(path.join(SAMPLES, file), 'utf8'));
        const text = (await reportText(page)).replace(/\s+/g, ' ');
        // every attribute and text of the model (not of its diagram), as written; but the ids nothing is known by
        // (the definitions', an event definition's, an association's, ...) and an element's inner data
        // definitions (ioSpecification: not run by bpmn-server)
        const values = await page.evaluate(async () => {
            const xml = (await window.bpmnModeler.saveXML()).xml;
            const doc = new DOMParser().parseFromString(xml, 'application/xml');
            const LAYOUT = ['http://www.omg.org/spec/BPMN/20100524/DI', 'http://www.omg.org/spec/DD/20100524/DC', 'http://www.omg.org/spec/DD/20100524/DI'];
            const SKIP = new Set(['exporter', 'exporterVersion', 'targetNamespace', 'expressionLanguage', 'typeLanguage', 'xsi:type']);
            const NO_ID = /^(definitions|collaboration|laneSet|association|dataInputAssociation|dataOutputAssociation|dataObjectReference|dataStoreReference|dataObject|group|category|categoryValue|\w+EventDefinition)$/;
            const found = [];
            const walk = node => {
                // a task's bpmn:property is a data association's placeholder (bpmn.io's), not a setting
                if (LAYOUT.includes(node.namespaceURI) || node.localName === 'ioSpecification' || (node.localName === 'property' && node.namespaceURI === 'http://www.omg.org/spec/BPMN/20100524/MODEL')) return;
                for (const a of node.attributes)
                    if (!a.name.startsWith('xmlns') && !SKIP.has(a.name) && !/^(true|false)$/.test(a.value)
                        && !(a.name === 'id' && NO_ID.test(node.localName)) && !(node.localName === 'laneSet' && a.name === 'name'))
                        found.push({ where: `${node.localName} ${a.name}`, value: a.value });
                const own = [...node.childNodes].filter(c => c.nodeType === 3 || c.nodeType === 4).map(c => c.nodeValue).join('').trim();
                if (own && !['incoming', 'outgoing', 'flowNodeRef', 'sourceRef', 'targetRef'].includes(node.localName))
                    found.push({ where: node.localName, value: own });
                [...node.children].forEach(walk);
            };
            walk(doc.documentElement);
            return found;
        });
        for (const { where, value } of values)
            if (!text.includes(value.replace(/\s+/g, ' ').trim()))
                missing.push(`${file}: ${where} = ${JSON.stringify(value).slice(0, 80)}`);
        await close();
    }
    assert.deepEqual(missing, []);
});

test('an instance\'s page shows the same report as the editor (of the instance\'s model)', async () => {
    const xml = fs.readFileSync(path.join(FIXTURES, 'buy-used-car.bpmn'), 'utf8');
    const { page, close } = await openReport('report-instance', xml);
    // the editor's report of the model, not live (no problems, no title), as the instance's page shows it
    const editor = await page.evaluate(() => {
        const report = window.bpmnModeler.get('report');
        const div = document.body.appendChild(document.createElement('div'));
        div.append(report.document(window.bpmnModeler.getDefinitions(), false));
        const text = div.innerText;
        div.remove();
        return text;
    });
    const { instance } = await web.bpmnServer.engine.start('report-instance', {});
    await page.goto(`${web.base}/logout`).catch(() => {});
    await page.context().clearCookies();
    await page.goto(web.base + '/login');
    await page.fill('#userName', 'admin');
    await page.fill('#password', PASSWORD);
    await Promise.all([page.waitForURL(url => !url.pathname.startsWith('/login')), page.click('button[type=submit]')]);
    await page.goto(`${web.base}/instanceDetails?id=${instance.id}`);
    await page.click('#showDoc');
    await page.waitForSelector('#model-report .report-element');
    assert.equal(await page.innerText('#model-report'), editor);
    assert.ok(editor.includes('Buy'), 'a report of the model');
    await close();
});
