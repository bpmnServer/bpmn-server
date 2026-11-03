// What a designer does with connectors in the model editor, step by step: the connector wizard (connectors/Wizard.jsx)
// and the Service group's summary (properties/ConnectorEntries.jsx); and what an administrator's changes do to it: a local "shop" API (OpenAPI 3.1) stands for the connector's server.
//   npm run test:ui
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import { chromium } from 'playwright';
import { startWebApp, PASSWORD } from '../support/webApp.mjs';

const SHOP_DOC = {
    openapi: '3.1.0', info: { title: 'Shop', version: '1' },
    paths: {
        '/customers/{id}': { get: { operationId: 'getCustomer', summary: 'A customer',
            parameters: [{ name: 'id', in: 'path', required: true, description: 'The customer\'s id', schema: { type: 'string' } }],
            responses: { 200: { description: 'The customer', content: { 'application/json': { schema: { type: 'object', properties: { id: { type: 'string' }, tier: { type: 'string' }, since: { type: 'string' } } } } } },
                404: { description: 'No such customer' } } } },
        '/orders': { post: { operationId: 'createOrder', summary: 'An order',
            requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', required: ['customerId', 'amount'],
                properties: { customerId: { type: 'string' }, amount: { type: 'number' }, note: { type: 'string' } } } } } },
            responses: { 201: { description: 'The order', content: { 'application/json': { schema: { type: 'object', properties: { orderId: { type: 'string' }, total: { type: 'number' } } } } } } } } },
        '/items': { get: { operationId: 'listItems', summary: 'Items',
            parameters: [{ name: 'size', in: 'query', schema: { type: 'string', enum: ['S', 'M', 'L'] } }],
            responses: { 200: { description: 'Items', content: { 'application/json': { schema: { type: 'array', items: { type: 'object', properties: { sku: { type: 'string' } } } } } } } } } },
        '/health': { get: { operationId: 'health', responses: { 200: { description: 'OK' } } } },
    },
};

let web, browser, context, page, api, base;
const errors = [];
const MODEL = 'shop-order';      // a model calling the shop, written in the before hook

test.before(async () => {
    process.env.CONNECTORS_KEY ??= 'a test encryption key';
    api = http.createServer((req, res) => {
        const send = (status, body) => { res.writeHead(status, { 'Content-Type': 'application/json' }); res.end(JSON.stringify(body)); };
        const customer = /^\/customers\/([^/?]+)/.exec(req.url);
        if (customer) return decodeURIComponent(customer[1]) === 'C-1' ? send(200, { id: 'C-1', tier: 'gold', since: '2020' }) : send(404, { error: 'none' });
        if (req.url.startsWith('/health')) return send(200, { ok: true });
        send(404, {});
    });
    await new Promise(resolve => api.listen(0, '127.0.0.1', resolve));
    base = `http://127.0.0.1:${api.address().port}`;

    web = await startWebApp();
    const connectors = web.bpmnServer.connectors;
    await connectors.install();
    await connectors.add({ id: 'shop', document: SHOP_DOC, baseUrl: base });
    await connectors.add({ id: 'finance', document: SHOP_DOC, baseUrl: base, groups: ['FINANCE'] });      // not the designer's
    await connectors.add({ id: 'off', document: SHOP_DOC, baseUrl: base, enabled: false });
    fs.writeFileSync(path.join(web.definitionsPath, MODEL + '.bpmn'), model('shop/getCustomer', `
        <camunda:inputParameter name="id">\${data.customerId}</camunda:inputParameter>
        <camunda:outputParameter name="tier">\${output.tier}</camunda:outputParameter>
        <camunda:outputParameter name="custom">\${output.tier + '!'}</camunda:outputParameter>`));
    fs.writeFileSync(path.join(web.definitionsPath, 'gone-connector.bpmn'), model('gone/someOperation', ''));
    await web.bpmnServer.definitions.rebuild();

    browser = await chromium.launch();
    context = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
    await context.route('**/*', route => route.request().url().startsWith(web.base) ? route.continue() : route.abort());
    page = await newPage();
    await page.goto(web.base + '/login');
    await page.fill('#userName', 'designer');
    await page.fill('#password', PASSWORD);
    await Promise.all([page.waitForURL(url => !url.pathname.startsWith('/login')), page.click('button[type=submit]')]);
});
test.after(async () => {
    api?.close();
    await browser?.close();
    await web?.stop();
    setImmediate(() => process.exit(0));
});

/** A model: start, a service task calling `ref` with these parameters (boundary HTTP_404 to NotFound), end. */
function model(ref, params) {
    return `<?xml version="1.0" encoding="UTF-8"?>
<bpmn:definitions xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" xmlns:dc="http://www.omg.org/spec/DD/20100524/DC" xmlns:di="http://www.omg.org/spec/DD/20100524/DI" xmlns:camunda="http://camunda.org/schema/1.0/bpmn" id="d" targetNamespace="http://bpmn.io/schema/bpmn">
  <bpmn:error id="E404" name="Not found" errorCode="HTTP_404" />
  <bpmn:process id="P" isExecutable="true">
    <bpmn:startEvent id="Start"><bpmn:outgoing>f1</bpmn:outgoing></bpmn:startEvent>
    <bpmn:serviceTask id="Call" name="Call the shop">
      <bpmn:extensionElements><camunda:connector><camunda:connectorId>${ref}</camunda:connectorId>
        <camunda:inputOutput>${params}</camunda:inputOutput></camunda:connector></bpmn:extensionElements>
      <bpmn:incoming>f1</bpmn:incoming><bpmn:outgoing>f2</bpmn:outgoing>
    </bpmn:serviceTask>
    <bpmn:boundaryEvent id="Missing" attachedToRef="Call"><bpmn:outgoing>f3</bpmn:outgoing><bpmn:errorEventDefinition errorRef="E404" /></bpmn:boundaryEvent>
    <bpmn:endEvent id="Done"><bpmn:incoming>f2</bpmn:incoming></bpmn:endEvent>
    <bpmn:endEvent id="NotFound"><bpmn:incoming>f3</bpmn:incoming></bpmn:endEvent>
    <bpmn:sequenceFlow id="f1" sourceRef="Start" targetRef="Call" />
    <bpmn:sequenceFlow id="f2" sourceRef="Call" targetRef="Done" />
    <bpmn:sequenceFlow id="f3" sourceRef="Missing" targetRef="NotFound" />
  </bpmn:process>
  <bpmndi:BPMNDiagram id="dia"><bpmndi:BPMNPlane id="plane" bpmnElement="P">
    <bpmndi:BPMNShape id="Start_di" bpmnElement="Start"><dc:Bounds x="100" y="100" width="36" height="36" /></bpmndi:BPMNShape>
    <bpmndi:BPMNShape id="Call_di" bpmnElement="Call"><dc:Bounds x="200" y="78" width="100" height="80" /></bpmndi:BPMNShape>
    <bpmndi:BPMNShape id="Missing_di" bpmnElement="Missing"><dc:Bounds x="232" y="140" width="36" height="36" /></bpmndi:BPMNShape>
    <bpmndi:BPMNShape id="Done_di" bpmnElement="Done"><dc:Bounds x="360" y="100" width="36" height="36" /></bpmndi:BPMNShape>
    <bpmndi:BPMNShape id="NotFound_di" bpmnElement="NotFound"><dc:Bounds x="360" y="220" width="36" height="36" /></bpmndi:BPMNShape>
    <bpmndi:BPMNEdge id="f1_di" bpmnElement="f1"><di:waypoint x="136" y="118" /><di:waypoint x="200" y="118" /></bpmndi:BPMNEdge>
    <bpmndi:BPMNEdge id="f2_di" bpmnElement="f2"><di:waypoint x="300" y="118" /><di:waypoint x="360" y="118" /></bpmndi:BPMNEdge>
    <bpmndi:BPMNEdge id="f3_di" bpmnElement="f3"><di:waypoint x="250" y="176" /><di:waypoint x="250" y="238" /><di:waypoint x="360" y="238" /></bpmndi:BPMNEdge>
  </bpmndi:BPMNPlane></bpmndi:BPMNDiagram>
</bpmn:definitions>`;
}

async function newPage() {
    const p = await context.newPage();
    p.setDefaultTimeout(15000);
    p.on('pageerror', e => errors.push(e.message));
    p.on('dialog', dialog => dialog.accept());
    return p;
}
/** A page of its own for each test: the one before may have a model not saved. */
async function fresh() {
    const before = page;
    page = await newPage();
    await before.close({ runBeforeUnload: false });
}
async function openModel(name) {
    await page.goto(`${web.base}/model/edit/${encodeURIComponent(name)}`);
    await page.waitForSelector('#js-canvas .djs-shape');
    await page.waitForFunction(() => window.bpmnModeler?.get('connectors')?.loaded);
}
async function select(id) {
    await page.waitForFunction(id => window.bpmnModeler?.get('elementRegistry').get(id), id);
    await page.evaluate(id => { const m = window.bpmnModeler; m.get('selection').select(m.get('elementRegistry').get(id)); }, id);
    const header = page.locator('.bio-properties-panel-group-header', { hasText: 'Service' }).first();
    await header.waitFor();
    if (!/\bopen\b/.test(await header.getAttribute('class')))
        await header.click();
}
/** A new service (or send) task on the canvas, selected, its Service group open. */
async function newTask(type = 'bpmn:ServiceTask') {
    const id = await page.evaluate(type => {
        const m = window.bpmnModeler;
        const parent = m.get('elementRegistry').filter(e => e.type === 'bpmn:Participant')[0] || m.get('canvas').getRootElement();
        return m.get('modeling').createShape(m.get('elementFactory').createShape({ type }), { x: 700, y: 520 }, parent).id;
    }, type);
    await select(id);
    return id;
}
const SUMMARY = '#connector-summary';
const WIZARD = '#js-connector-wizard';
const wizIn = name => `[id="connector-wizard-in-${name}"]`;
const wizOut = field => `[id="connector-wizard-out-${field || 'response'}"]`;
const wizName = field => `[id="connector-wizard-name-${field || 'response'}"]`;
const options = selector => page.locator(`${selector} option`).allInnerTexts();
const xml = async () => (await page.evaluate(() => window.bpmnModeler.saveXML({ format: true }))).xml;
/** The connector element of a task in the XML. */
const connectorXml = async () => { const x = await xml(); const a = x.indexOf('<camunda:connector>'); return a < 0 ? '' : x.slice(a, x.indexOf('</camunda:connector>', a)); };
/** The operations the wizard lists, as <connector>/<operationId>. */
const listed = () => page.locator(`${WIZARD} .connector-wizard-operation`).evaluateAll(list => list.map(b => b.dataset.operation));
/** Calls: Connector, on a task with none: the wizard opens. */
async function callConnector() {
    await page.selectOption('#bio-properties-panel-service-calls', 'connector');
    await page.waitForSelector(WIZARD);
}
async function edit() {
    await page.click(`${SUMMARY}-edit`);
    await page.waitForSelector(WIZARD);
}
const step = n => page.click(`#connector-wizard-step-${n}`);
async function pick(ref) {
    await page.click(`${WIZARD} [data-operation="${ref}"]`);
    await page.waitForSelector('#connector-wizard-step-1.current');
}
async function done() {
    await page.click('#connector-wizard-done');
    await page.waitForSelector(WIZARD, { state: 'detached' });
}
async function cancel() {
    await page.click('#connector-wizard-cancel');
    await page.waitForSelector(WIZARD, { state: 'detached' });
}
/** The Service group's summary of the connector, its white space as single spaces. */
const summary = async () => (await page.innerText(SUMMARY)).replace(/\s+/g, ' ');

test('the wizard lists the operations of the connectors this designer may use, enabled ones only, and finds them by a search', async () => {
    await openModel('leave-request');
    await newTask();
    await callConnector();
    assert.deepEqual((await listed()).sort(), ['shop/createOrder', 'shop/getCustomer', 'shop/health', 'shop/listItems'], 'not finance (another group\'s), not off (disabled)');
    assert.equal(await page.evaluate(() => document.activeElement?.id), 'connector-wizard-search', 'the search has the focus');
    await page.fill('#connector-wizard-search', 'customer');
    assert.deepEqual(await listed(), ['shop/getCustomer']);
    await page.fill('#connector-wizard-search', 'post orders');
    assert.deepEqual(await listed(), ['shop/createOrder'], 'every word matched: method and path');
    await page.fill('#connector-wizard-search', 'nothing like it');
    assert.deepEqual(await listed(), []);
    assert.match(await page.innerText(WIZARD), /0 operations/);
    // one found: Enter picks it
    await page.fill('#connector-wizard-search', 'GETCUSTOMER');
    await page.press('#connector-wizard-search', 'Enter');
    await page.waitForSelector('#connector-wizard-step-1.current');
    assert.equal(await page.inputValue(wizIn('id')), '${data.id}');
    // Cancel: nothing changed, still a service
    await cancel();
    assert.equal(await connectorXml(), '');
    assert.equal(await page.inputValue('#bio-properties-panel-service-calls'), 'service');
    // Escape is Cancel too
    await callConnector();
    await page.keyboard.press('Escape');
    await page.waitForSelector(WIZARD, { state: 'detached' });
    assert.equal(await connectorXml(), '');
});

test('an operation chosen fills its inputs; Done writes it; another operation chosen later changes the inputs', async () => {
    await fresh();
    await openModel('leave-request');
    await newTask();
    await callConnector();
    assert.equal(await page.isDisabled('#connector-wizard-done'), true, 'nothing to write before an operation');
    assert.equal(await page.isDisabled('#connector-wizard-step-1'), true);
    await pick('shop/getCustomer');
    assert.equal(await page.inputValue(wizIn('id')), '${data.id}', 'a required input, from the data');
    await done();
    assert.match(await connectorXml(), /<camunda:connectorId>shop\/getCustomer<\/camunda:connectorId>/);
    assert.match(await connectorXml(), /<camunda:inputParameter name="id">\$\{data.id\}<\/camunda:inputParameter>/);
    await page.waitForSelector(SUMMARY);
    assert.match(await summary(), /shop\/getCustomer GET \/customers\/\{id\}: A customer/);
    assert.match(await summary(), /id = \$\{data.id\}/);
    assert.match(await summary(), /404 \(HTTP_404\)/, 'the errors it answers');

    // opened again: at the inputs, the operation marked in the list
    await edit();
    assert.equal(await page.getAttribute('#connector-wizard-step-1', 'class'), 'current');
    await step(0);
    assert.equal(await page.locator(`${WIZARD} .connector-wizard-operation.picked`).getAttribute('data-operation'), 'shop/getCustomer');
    await pick('shop/createOrder');
    assert.equal(await page.inputValue(wizIn('body.customerId')), '${data.customerId}', 'a required body field, from the data');
    assert.equal(await page.inputValue(wizIn('body.amount')), '${data.amount}');
    assert.equal(await page.inputValue(wizIn('body.note')), '', 'an optional field: empty');
    assert.equal(await page.locator(wizIn('id')).count(), 0, 'the other operation\'s input gone');
    await done();
    const x = await connectorXml();
    assert.doesNotMatch(x, /name="id"/);
    assert.doesNotMatch(x, /name="body.note"/, 'empty: not written');
    assert.match(x, /<camunda:inputParameter name="body.customerId">\$\{data.customerId\}<\/camunda:inputParameter>/);

    await edit();
    await step(0);
    await pick('shop/health');
    assert.match(await page.innerText(WIZARD), /takes no input/);
    await done();
    assert.doesNotMatch(await connectorXml(), /inputParameter/, 'no input left over');
});

test('inputs: a value typed is kept, emptied it goes; a required one missing is said; an enum is offered', async () => {
    await fresh();
    await openModel('leave-request');
    await newTask();
    await callConnector();
    await pick('shop/listItems');
    assert.equal(await page.getAttribute(wizIn('size'), 'placeholder'), 'S | M | L');
    assert.deepEqual(await page.locator('[id="connector-wizard-enum-size"] option').evaluateAll(o => o.map(x => x.value)), ['S', 'M', 'L']);
    await page.fill(wizIn('size'), 'M');
    await done();
    assert.match(await connectorXml(), /<camunda:inputParameter name="size">M<\/camunda:inputParameter>/);
    await edit();
    assert.equal(await page.inputValue(wizIn('size')), 'M', 'opened again: as written');
    await page.fill(wizIn('size'), '');
    await done();
    assert.doesNotMatch(await connectorXml(), /name="size"/, 'emptied: no input');

    // a required input emptied: said, and "from data" fills it back
    await edit();
    await step(0);
    await pick('shop/getCustomer');
    await page.fill(wizIn('id'), '');
    assert.match(await page.innerText(`${WIZARD} .connector-wizard-footer`), /Required: id/);
    await page.locator(`${WIZARD} tr`, { has: page.locator(wizIn('id')) }).locator('.connector-wizard-small').click();
    assert.equal(await page.inputValue(wizIn('id')), '${data.id}');
    assert.doesNotMatch(await page.innerText(`${WIZARD} .connector-wizard-footer`), /Required/);
    // Cancel: the model keeps listItems
    await cancel();
    assert.match(await connectorXml(), /shop\/listItems/);
    // a value kept when the operation is chosen again
    await edit();
    await step(0);
    await pick('shop/getCustomer');
    await page.fill(wizIn('id'), 'C-42');
    await done();
    await edit();
    await step(0);
    await pick('shop/getCustomer');
    assert.equal(await page.inputValue(wizIn('id')), 'C-42');
    await cancel();
});

test('outputs: every part of the response with a check box and the name it is kept under', async () => {
    await fresh();
    await openModel('leave-request');
    await newTask();
    await callConnector();
    await pick('shop/getCustomer');
    await page.click('#connector-wizard-next');
    const fields = await page.locator(`${WIZARD} tbody input[type=checkbox]`).evaluateAll(list => list.map(b => b.dataset.field));
    assert.deepEqual(fields, ['', 'id', 'tier', 'since'], 'the whole response, then its fields');
    assert.equal(await page.isDisabled(wizName('tier')), true, 'named once ticked');

    // All ticks every one; one unticked; one renamed
    await page.check('#connector-wizard-out-all');
    for (const f of fields) assert.equal(await page.isChecked(wizOut(f)), true);
    await page.uncheck(wizOut(''));
    assert.equal(await page.isChecked('#connector-wizard-out-all'), false);
    assert.equal(await page.inputValue(wizName('tier')), 'tier', 'the field\'s own name at first');
    await page.fill(wizName('tier'), 'customerTier');
    await done();
    let x = await connectorXml();
    assert.match(x, /<camunda:outputParameter name="customerTier">\$\{output.tier\}<\/camunda:outputParameter>/);
    assert.match(x, /<camunda:outputParameter name="id">\$\{output.id\}<\/camunda:outputParameter>/);
    assert.equal((x.match(/outputParameter name=/g) ?? []).length, 3);
    assert.match(await summary(), /tier → customerTier/);

    // opened again: as kept; one unticked, the whole response ticked
    await edit();
    await step(2);
    assert.equal(await page.inputValue(wizName('tier')), 'customerTier');
    assert.equal(await page.isChecked(wizOut('since')), true);
    await page.uncheck(wizOut('id'));
    await page.check(wizOut(''));
    await done();
    x = await connectorXml();
    assert.doesNotMatch(x, /outputParameter name="id"/, 'unticked: removed');
    assert.match(x, /<camunda:outputParameter name="response">\$\{output\}<\/camunda:outputParameter>/);
    assert.match(await summary(), /the whole response → response/);

    // an array response: its items' fields are offered
    await edit();
    await step(0);
    await pick('shop/listItems');
    await step(2);
    assert.equal(await page.locator(wizOut('sku')).count(), 1, 'an array response: its items\' fields');
    await cancel();
});

test('undo and redo: the wizard\'s change is one step', async () => {
    await fresh();
    await openModel('leave-request');
    await newTask();
    await callConnector();
    await pick('shop/getCustomer');
    await step(2);
    await page.check(wizOut('tier'));
    await done();
    const undo = () => page.evaluate(() => window.bpmnModeler.get('commandStack').undo());
    const redo = () => page.evaluate(() => window.bpmnModeler.get('commandStack').redo());
    await undo();
    assert.equal(await connectorXml(), '', 'one undo: a service task again');
    await redo();
    const x = await connectorXml();
    assert.match(x, /shop\/getCustomer/);
    assert.match(x, /inputParameter name="id"[\s\S]*outputParameter name="tier"/);
    await page.waitForSelector(SUMMARY);
    assert.match(await summary(), /tier → tier/);
});

test('a send task calls a connector too; a service name is dropped when it does, kept when the wizard is cancelled', async () => {
    await fresh();
    await openModel('leave-request');
    await newTask('bpmn:SendTask');
    assert.deepEqual(await options('#bio-properties-panel-service-calls'), ['Service', 'Connector']);
    await page.fill('#bio-properties-panel-service-name', 'notifyManager');
    await page.locator('#bio-properties-panel-service-name').press('Tab');
    await page.waitForTimeout(400);
    assert.match(await xml(), /delegateExpression="notifyManager"/);
    await callConnector();
    await cancel();
    assert.match(await xml(), /delegateExpression="notifyManager"/, 'cancelled: the service stays');
    await callConnector();
    await pick('shop/health');
    await done();
    assert.doesNotMatch(await xml(), /notifyManager/, 'the service goes');
    await page.selectOption('#bio-properties-panel-service-calls', 'service');
    assert.equal(await connectorXml(), '');
    await page.waitForSelector('#bio-properties-panel-service-name');
    assert.equal(await page.inputValue('#bio-properties-panel-service-name'), '', 'back to a service: none named');
});

test('a model naming what the server does not have says so, and keeps it', async () => {
    await fresh();
    await openModel('gone-connector');
    await select('Call');
    await page.waitForSelector(SUMMARY);
    assert.match(await summary(), /gone\/someOperation/);
    assert.match(await page.innerText(`${SUMMARY}-problem`), /no connector 'gone'/);
    await edit();
    assert.equal(await page.getAttribute('#connector-wizard-step-0', 'class'), 'current', 'an operation to choose');
    assert.equal(await page.isDisabled('#connector-wizard-done'), true);
    await cancel();
    assert.match(await connectorXml(), /gone\/someOperation/, 'not changed by opening it');
});

test('a saved model opens as it was: the connector, its inputs and outputs (an expression of its own kept)', async () => {
    await fresh();
    await openModel(MODEL);
    await select('Call');
    await page.waitForSelector(SUMMARY);
    const titles = await page.locator('.bio-properties-panel-group-header-title').allInnerTexts();
    assert.ok(!titles.includes('Inputs') && !titles.includes('Outputs'), 'the task\'s own Inputs and Outputs groups are not shown again: ' + titles.join(', '));
    const text = await summary();
    assert.match(text, /id = \$\{data.customerId\}/);
    assert.match(text, /tier → tier/);
    assert.match(text, /\$\{output.tier \+ '!'\} → custom/, 'shown as written');
    assert.equal(await page.locator(`${SUMMARY}-problem`).count(), 0);
    await edit();
    assert.equal(await page.inputValue(wizIn('id')), '${data.customerId}');
    await step(2);
    assert.match(await page.innerText(WIZARD), /Kept as written: custom = \$\{output.tier \+ '!'\}/);
    await page.fill(wizName('tier'), 'level');
    await done();
    assert.match(await connectorXml(), /name="custom">\$\{output.tier \+ '!'\}</, 'an expression of its own kept');
    await page.click('#js-save');
    await page.waitForSelector('#js-save-status:text("Saved")').catch(() => { });
    await page.reload();
    await page.waitForFunction(() => window.bpmnModeler?.get('connectors')?.loaded);
    await select('Call');
    await page.waitForSelector(SUMMARY);
    assert.match(await summary(), /tier → level/, 'saved');
});

test('run from the Test tab: the start data reaches the connector, the answer is kept, a 404 takes the error path', async () => {
    await fresh();
    await openModel(MODEL);
    await page.waitForSelector('#js-canvas .djs-shape');
    await page.click('#js-tab-test');
    await page.waitForSelector('#js-test .test-panel');
    await page.click('#js-test .test-new');
    await page.click('#js-test .test-design .test-run');
    await page.waitForSelector('.test-start');
    const data = page.locator('.test-start textarea');
    assert.equal(await data.count(), 1, 'the start asks for its data');
    await data.fill('{ "customerId": "C-1" }');
    await page.click('.test-start-go');
    await page.waitForSelector('.test-finished');
    assert.match(await page.innerText('.test-finished'), /instance is end/);
    const runs = await web.bpmnServer.dataStore.findInstances({ name: MODEL }, 'full');
    const stored = runs.at(-1);
    // the outputs as the test before saved them: tier kept as level, and an expression of its own
    assert.deepEqual([stored.data.level, stored.data.custom], ['gold', 'gold!'], JSON.stringify(runs.map(r => ({ id: r.id, status: r.status, data: r.data, items: r.items.map(i => i.elementId + ':' + i.status) }))));
    assert.ok(stored.items.some(i => i.elementId === 'Done'));

    await page.click('#js-test .test-tab-design');
    await page.click('#js-test .test-design .test-run');
    await page.locator('.test-start textarea').fill('{ "customerId": "nobody" }');
    await page.click('.test-start-go');
    await page.waitForSelector('.test-finished');
    const missing = (await web.bpmnServer.dataStore.findInstances({ name: MODEL }, 'full')).at(-1);
    assert.ok(missing.items.some(i => i.elementId === 'NotFound'), 'HTTP_404 caught');
});

test('the administrator\'s changes reach the editor: an operation disabled, a connector disabled', async () => {
    await fresh();
    await web.bpmnServer.connectors.update('shop', { operations: { listItems: false } });
    await openModel('leave-request');
    await newTask();
    await callConnector();
    assert.ok(!(await listed()).includes('shop/listItems'), 'a disabled operation is not offered');
    await pick('shop/getCustomer');
    await done();
    await web.bpmnServer.connectors.update('shop', { enabled: false });
    await page.evaluate(() => window.bpmnModeler.get('connectors').load());       // as the page does when it gets the focus back
    await page.waitForFunction(() => /no connector 'shop'/.test(document.querySelector('#connector-summary-problem')?.textContent ?? ''));
    assert.match(await connectorXml(), /shop\/getCustomer/, 'chosen before, kept');
    await web.bpmnServer.connectors.update('shop', { enabled: true, operations: { listItems: true } });
});

test('the Problems tab: a connector task is checked as one (not "a Camunda setting", not "names no service")', async () => {
    await fresh();
    const problems = async () => {
        await page.waitForSelector('#js-problems-counts .count, #js-problems-status:text("No problems")');
        await page.waitForTimeout(800);       // the server's check, after the editor's own
        return page.locator('#js-problems .problem').allInnerTexts();
    };
    await openModel(MODEL);
    let found = (await problems()).join(' | ');
    assert.doesNotMatch(found, /Camunda setting/, found);
    assert.doesNotMatch(found, /does not name a service/, found);
    assert.doesNotMatch(found, /needs the input/, found);

    // a required input emptied: the panel and the check say so
    await select('Call');
    await edit();
    await page.fill(wizIn('id'), '');
    await done();
    assert.match(await page.innerText(`${SUMMARY}-problem`), /Required inputs with no value: id/);
    await page.click('#js-save');
    await page.waitForTimeout(800);
    found = (await problems()).join(' | ');
    assert.match(found, /needs the input 'id'/, found);
    await edit();
    await page.fill(wizIn('id'), '${data.customerId}');
    await done();
    await page.click('#js-save');

    await openModel('gone-connector');
    found = (await problems()).join(' | ');
    assert.match(found, /no connector 'gone'/, found);
});

test('no page errors', () => {
    assert.deepEqual(errors, []);
});
