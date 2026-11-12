// @features: gherkin-tests
// A feature on a server whose scripts are in a sandbox, without service tasks: expressions and stubs run in the sandbox too.
import test from 'node:test';
import assert from 'node:assert/strict';
import { startWebApp, why } from '../support/webApp.mjs';

const SOURCE = `<?xml version="1.0" encoding="UTF-8"?>
<bpmn:definitions xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" id="d" targetNamespace="urn:t"><bpmn:process id="sand" isExecutable="true">
  <bpmn:startEvent id="s" /><bpmn:serviceTask id="check" implementation="credit-check" /><bpmn:endEvent id="e" />
  <bpmn:sequenceFlow id="f0" sourceRef="s" targetRef="check" /><bpmn:sequenceFlow id="f1" sourceRef="check" targetRef="e" />
</bpmn:process></bpmn:definitions>`;
const SETTINGS = { SCRIPT_SANDBOX: 'true', SERVICE_TASKS: 'false' };
let web, designer;
const run = async source => {
  const res = await designer.request('POST', '/model/test/feature', { json: { source } });
  assert.equal(res.status, 200, why(res));
  return JSON.parse(res.text).results[0].elements[0];
};
const failure = element => element.steps.find(s => s.result.status === 'failed')?.result.error_message;
const scenario = (...lines) => `Feature: F\n  Scenario: S\n${lines.map(l => '    ' + l).join('\n')}\n`;
const stub = (...code) => ['Given @stub service:credit-check with', '  """', ...code.map(c => '  ' + c), '  """'];

test.before(async () => {
  web = await startWebApp({ env: SETTINGS });
  designer = await web.login('designer');
  await designer.get('/model/list');
  await web.bpmnServer.models.save('sand', SOURCE);
});
test.after(async () => {
  for (const key of Object.keys(SETTINGS)) delete process.env[key];
  await web?.stop();
  setImmediate(() => process.exit(0));
});

test('a stub service runs where service tasks do not, in the sandbox', async () => {
  const element = await run(scenario(...stub('return { ran: typeof process };'), 'When @start process:sand as :i', 'Then @check :i status is "end"', 'And @check ${instance.items.find(i => i.elementId === "check").status === "end"}'));
  assert.equal(failure(element), undefined);
});

test('fail() and a throw come out of the sandbox with their message', async () => {
  assert.match(failure(await run(scenario(...stub('fail("expected this");'), 'When @start process:sand as :i'))), /expected this/);
  assert.match(failure(await run(scenario(...stub('throw new Error("a service failed");'), 'When @start process:sand as :i'))), /a service failed/);
});

test('an expression has no way out of the sandbox', async () => {
  assert.equal(failure(await run(scenario('Then @check ${typeof process === "undefined" && typeof require === "undefined"}'))), undefined);
});
