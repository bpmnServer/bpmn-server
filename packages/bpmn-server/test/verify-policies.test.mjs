// @features: verify-model, notification-policies, assignment-policies
// What checking a model says of the policy files it names, and of what it reads in the models folder: a policy that
// cannot be read, a notification policy's output that is not used and its template that is not there; a gateway whose
// every flow has a condition and none is the default; a Python script, which is not checked as JavaScript.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { verifyModel, policyAddOns } from '../dist/index.js';

const NS = 'xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:owf="http://omniworkflow.com/schema/owf/1.0"';
const model = (processAttrs, body) => `<?xml version="1.0" encoding="UTF-8"?>
<bpmn:definitions ${NS} id="d" targetNamespace="urn:test"><bpmn:process id="P" isExecutable="true" ${processAttrs}>${body}</bpmn:process></bpmn:definitions>`;

const table = (outputs, rules) => `<?xml version="1.0" encoding="UTF-8"?>
<definitions xmlns="https://www.omg.org/spec/DMN/20191111/MODEL/" id="d" name="N" namespace="t">
  <decision id="N" name="N"><decisionTable id="t" hitPolicy="COLLECT">
    <input id="i0"><inputExpression id="e0" typeRef="string"><text>event</text></inputExpression></input>
    ${outputs.map((o, i) => `<output id="o${i}" name="${o}" typeRef="string" />`).join('')}
    ${rules.map((r, n) => `<rule id="r${n}"><inputEntry id="r${n}i"><text></text></inputEntry>${r.map((c, i) => `<outputEntry id="r${n}o${i}"><text>${c}</text></outputEntry>`).join('')}</rule>`).join('')}
  </decisionTable></decision>
</definitions>`;

function folder(files) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'bpmn-verify-'));
  for (const [file, text] of Object.entries(files)) {
    fs.mkdirSync(path.dirname(path.join(dir, file)), { recursive: true });
    fs.writeFileSync(path.join(dir, file), text);
  }
  return dir;
}

const linear = '<bpmn:startEvent id="S"><bpmn:outgoing>f1</bpmn:outgoing></bpmn:startEvent><bpmn:userTask id="T" ATTRS><bpmn:incoming>f1</bpmn:incoming><bpmn:outgoing>f2</bpmn:outgoing></bpmn:userTask><bpmn:endEvent id="E"><bpmn:incoming>f2</bpmn:incoming></bpmn:endEvent><bpmn:sequenceFlow id="f1" sourceRef="S" targetRef="T" /><bpmn:sequenceFlow id="f2" sourceRef="T" targetRef="E" />';
const issues = async (source, dir) => (await verifyModel(source, undefined, 'm', { decisionsFolder: dir, addOns: policyAddOns() })).issues;
const find = (list, code) => list.filter(i => i.code === code);

test('a policy file that cannot be read is an error, for an assignment and a notification policy', async () => {
  const dir = folder({ 'assignment/Broken.dmn.xml': '<not xml', 'notification/Broken.dmn.xml': '<not xml' });
  const list = await issues(model('owf:notificationPolicy="Broken"', linear.replace('ATTRS', 'owf:assignmentPolicy="Broken"')), dir);
  assert.equal(find(list, 'assignment-policy-invalid').length, 1, JSON.stringify(list));
  assert.match(find(list, 'assignment-policy-invalid')[0].message, /^Assignment policy 'Broken': /);
  assert.equal(find(list, 'notification-policy-invalid').length, 1, JSON.stringify(list));
});

test('a notification policy: an output that is not used, a template that is not there; a text message is not a template', async () => {
  const dir = folder({
    'notification/Notices.dmn.xml': table(['notify', 'template', 'colour'], [
      ['"managers"', '"approval-request"', '"red"'],     // a template name, with no file
      ['"staff"', '"approved"', '""'],                    // a template name, with its file
      ['"staff"', '"Your request ${data.id} is in"', '""'],  // the message itself
    ]),
    'notification/templates/approved.md': 'Approved.',
  });
  const list = await issues(model('owf:notificationPolicy="Notices"', linear.replace('ATTRS', '')), dir);
  assert.deepEqual(find(list, 'notification-policy-output').map(i => i.message), [
    "Notification policy 'Notices': output 'colour' is not notify, template, channel; it is not used."]);
  const missing = find(list, 'notification-template-not-found');
  assert.equal(missing.length, 1, JSON.stringify(list));
  assert.match(missing[0].message, /rule 1: there is no template 'approval-request'/);
});

test('a notification policy with no template output is not asked for templates', async () => {
  const dir = folder({ 'notification/Plain.dmn.xml': table(['notify', 'channel'], [['"staff"', '"email"']]) });
  const list = await issues(model('owf:notificationPolicy="Plain"', linear.replace('ATTRS', '')), dir);
  assert.deepEqual(list.filter(i => i.code.startsWith('notification-')), []);
});

test('a gateway whose flows all have conditions and none is the default is told it may stop; a Python script is not read as JavaScript', async () => {
  const body = `<bpmn:startEvent id="S"><bpmn:outgoing>f1</bpmn:outgoing></bpmn:startEvent>
    <bpmn:exclusiveGateway id="G"><bpmn:incoming>f1</bpmn:incoming><bpmn:outgoing>a</bpmn:outgoing><bpmn:outgoing>b</bpmn:outgoing></bpmn:exclusiveGateway>
    <bpmn:scriptTask id="Py" scriptFormat="python"><bpmn:incoming>a</bpmn:incoming><bpmn:outgoing>c</bpmn:outgoing><bpmn:script>$py print("not javascript (")</bpmn:script></bpmn:scriptTask>
    <bpmn:endEvent id="E"><bpmn:incoming>b</bpmn:incoming><bpmn:incoming>c</bpmn:incoming></bpmn:endEvent>
    <bpmn:sequenceFlow id="f1" sourceRef="S" targetRef="G" />
    <bpmn:sequenceFlow id="a" sourceRef="G" targetRef="Py"><bpmn:conditionExpression>$(data.x == 1)</bpmn:conditionExpression></bpmn:sequenceFlow>
    <bpmn:sequenceFlow id="b" sourceRef="G" targetRef="E"><bpmn:conditionExpression>$(data.x == 2)</bpmn:conditionExpression></bpmn:sequenceFlow>
    <bpmn:sequenceFlow id="c" sourceRef="Py" targetRef="E" />`;
  const list = await issues(model('', body));
  assert.equal(find(list, 'no-default-flow').length, 1, JSON.stringify(list));
  assert.equal(find(list, 'no-default-flow')[0].severity, 'info');
  assert.deepEqual(list.filter(i => i.elementId === 'Py' && /script/.test(i.code)), [], 'the Python script is not checked');
});
