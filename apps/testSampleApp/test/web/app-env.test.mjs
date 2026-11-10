// @features: ai-remote-development
// The test environment (APP_ENV=test): its own services class (TestServices), the same names as AppServices, nothing
// sent or recorded; /llms.txt says which environment a site is.
import test from 'node:test';
import assert from 'node:assert/strict';
import { startWebApp } from '../support/webApp.mjs';

let web;
test.before(async () => { web = await startWebApp({ env: { APP_ENV: 'test' } }); });
test.after(async () => { await web?.stop(); delete process.env.APP_ENV; setImmediate(() => process.exit(0)); });

const MODEL = `<?xml version="1.0" encoding="UTF-8"?>
<bpmn:definitions xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:camunda="http://camunda.org/schema/1.0/bpmn" id="d" targetNamespace="urn:test">
  <bpmn:process id="Told" isExecutable="true">
    <bpmn:startEvent id="s" />
    <bpmn:serviceTask id="Tell" name="Tell" camunda:delegateExpression="notifyUsers">
      <bpmn:extensionElements><camunda:inputOutput>
        <camunda:inputParameter name="users">emp1</camunda:inputParameter>
        <camunda:inputParameter name="subject">Approved</camunda:inputParameter>
      </camunda:inputOutput></bpmn:extensionElements>
    </bpmn:serviceTask>
    <bpmn:endEvent id="e" />
    <bpmn:sequenceFlow id="f1" sourceRef="s" targetRef="Tell" />
    <bpmn:sequenceFlow id="f2" sourceRef="Tell" targetRef="e" />
  </bpmn:process>
</bpmn:definitions>`;

test('a test site\'s services are TestServices: the same names, nothing sent; /llms.txt says so', async () => {
  assert.equal((await web.api('PUT', '/api2/models/told', { source: MODEL })).status, 201);
  const run = await web.api('POST', '/api2/models/told/test', { source: 'Feature: told\n  Scenario: told\n    When @start process:told as :t\n    Then @check :t status is "end"\n' });
  assert.equal(run.body.passed, 1, JSON.stringify(run.body));
  const instance = await web.bpmnServer.dataStore.findInstance({ id: run.body.scenarios[0].instances[0] }, 'full');
  const tell = instance.items.find(i => i.elementId === 'Tell');
  assert.deepEqual(tell.output, { sent: ['emp1'], at: 'test' }, 'TestServices.notifyUsers: whom, nothing sent');
  assert.match((await web.client().get('/llms.txt')).text, /Environment: \*\*test\*\* \(APP_ENV=test\)/);
});
