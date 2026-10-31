// The model editor's element templates: the catalog is checked against what bpmn-server runs, and is
// served to designers only.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { startWebApp, why } from '../support/webApp.mjs';

const ROOT = path.resolve(import.meta.dirname, '..', '..');
const { checkTemplate, loadTemplateCatalog } = await import(pathToFileURL(path.join(ROOT, 'dist', 'routes', 'elementTemplates.js')));

const template = (...properties) => ({ id: 't', name: 'T', appliesTo: ['bpmn:ServiceTask'], properties });
const services = { add() { }, notify: { email() { } } };

let web, designer, staff;
test.before(async () => {
    web = await startWebApp();
    [designer, staff] = await Promise.all([web.login('designer'), web.login('staff')]);
});
test.after(async () => { await web?.stop(); setImmediate(() => process.exit(0)); });

test('what bpmn-server runs is accepted', () => {
    const { problems, warnings } = checkTemplate(template(
        { type: 'Hidden', value: 'add', binding: { type: 'property', name: 'camunda:delegateExpression' } },
        { type: 'String', binding: { type: 'camunda:inputParameter', name: 'v1' } },
        { type: 'String', value: 'sum', binding: { type: 'camunda:outputParameter', source: 'output' } },
        { type: 'Hidden', value: 'this.data.x = 1;', binding: { type: 'camunda:executionListener', event: 'end', scriptFormat: 'JavaScript' } },
        { type: 'String', binding: { type: 'property', name: 'camunda:candidateGroups' } }
    ), services);
    assert.deepEqual(problems, []);
    assert.deepEqual(warnings, []);
});

test('what bpmn-server does not run is refused, with the reason', () => {
    const cases = [
        [{ label: 'Class', binding: { type: 'property', name: 'camunda:class' } }, /sets camunda:class, which bpmn-server does not read/],
        [{ label: 'Async', binding: { type: 'property', name: 'camunda:asyncBefore' } }, /camunda:asyncBefore/],
        [{ label: 'Field', binding: { type: 'camunda:field', name: 'url' } }, /camunda:field binding/],
        [{ label: 'Prop', binding: { type: 'camunda:property', name: 'x' } }, /camunda:property binding/],
        [{ label: 'In', binding: { type: 'camunda:in', target: 'x' } }, /camunda:in binding/],
        [{ label: 'Job', binding: { type: 'zeebe:taskDefinition', property: 'type' } }, /zeebe:taskDefinition binding/],
        [{ label: 'Listener', binding: { type: 'camunda:executionListener', event: 'start' } }, /implemented in Java/],
        [{ label: 'Groovy', binding: { type: 'camunda:inputParameter', name: 'x', scriptFormat: 'groovy' } }, /groovy script; bpmn-server runs JavaScript/]
    ];
    for (const [property, reason] of cases) {
        const { problems } = checkTemplate(template(property));
        assert.equal(problems.length, 1, JSON.stringify(property));
        assert.match(problems[0], reason);
    }
    assert.match(checkTemplate({ ...template(), scopes: [{ type: 'camunda:Connector' }] }).problems.join(), /scopes/);
    assert.match(checkTemplate({ properties: [] }).problems.join(), /no id.*no name.*appliesTo/);
});

test('a service the application does not provide is a warning, not a refusal', () => {
    const named = name => template({ label: 'Service', type: 'Hidden', value: name, binding: { type: 'property', name: 'camunda:delegateExpression' } });
    assert.deepEqual(checkTemplate(named('notify.email'), services).warnings, []);
    const { problems, warnings } = checkTemplate(named('missing'), services);
    assert.deepEqual(problems, []);
    assert.match(warnings[0], /names the service 'missing', which the application does not provide/);
});

test('a folder of templates: refused ones are left out, broken files reported', () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'templates-'));
    fs.writeFileSync(path.join(dir, 'good.json'), JSON.stringify([template(), { ...template(), id: 'other' }]));
    fs.writeFileSync(path.join(dir, 'java.json'), JSON.stringify({ ...template({ binding: { type: 'property', name: 'camunda:class' } }), id: 'java' }));
    fs.writeFileSync(path.join(dir, 'broken.json'), '{ not json');
    const catalog = loadTemplateCatalog(dir);
    assert.deepEqual(catalog.templates.map(t => t.id), ['t', 'other']);
    assert.deepEqual(catalog.rejected.map(r => [r.file, r.id]), [['broken.json', undefined], ['java.json', 'java']]);
    assert.deepEqual(loadTemplateCatalog(path.join(dir, 'none')), { templates: [], rejected: [], warnings: [] });
});

test('the sample catalog runs on bpmn-server and names services the sample provides', async () => {
    const res = await designer.get('/model/templates');
    assert.equal(res.status, 200, why(res));
    const catalog = JSON.parse(res.text);
    assert.deepEqual(catalog.rejected, []);
    // service names are checked against these (a failing lookup would skip the check)
    const provider = await web.bpmnServer.appDelegate.getServicesProvider(null);
    assert.equal(typeof provider.add, 'function');
    assert.equal(typeof provider.echo, 'function');
    assert.deepEqual(catalog.warnings, []);
    assert.deepEqual(catalog.templates.map(t => t.id).sort(),
        ['bpmn-web.sample.add', 'bpmn-web.sample.echo', 'bpmn-web.sample.manager-approval', 'bpmn-web.sample.requester-review']);
});

test('the catalog is for designers', async () => {
    assert.equal((await staff.get('/model/templates')).status, 403);
});
