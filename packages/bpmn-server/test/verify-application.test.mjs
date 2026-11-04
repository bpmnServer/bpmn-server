// @features: verify-model
// appDelegate.verifyModel: an application's own checks, reported with verifyModel's.
import test from 'node:test';
import assert from 'node:assert/strict';

import { verifyModel } from '../dist/index.js';

const NS = 'xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL"';
const MODEL = `<?xml version="1.0" encoding="UTF-8"?><bpmn:definitions ${NS} id="d" targetNamespace="urn:t">
<bpmn:process id="p" isExecutable="true"><bpmn:startEvent id="s"/><bpmn:task id="t" name="Work"/><bpmn:endEvent id="e"/>
<bpmn:sequenceFlow id="f1" sourceRef="s" targetRef="t"/><bpmn:sequenceFlow id="f2" sourceRef="t" targetRef="e"/></bpmn:process></bpmn:definitions>`;

const serverWith = (verify) => ({ appDelegate: { verifyModel: verify } });

test('the application\'s issues are reported; an error makes the model invalid', async () => {
  let seen;
  const result = await verifyModel(MODEL, serverWith(async (model) => {
    seen = model;
    return [{ code: 'house-rule', message: 'tasks need an owner', elementId: 't' }, { severity: 'warning', code: 'naming', message: 'x' }];
  }), 'M');
  assert.equal(seen.name, 'M');
  assert.equal(seen.source, MODEL);
  assert.ok(seen.definition?.nodes, 'gets the loaded definition');
  const house = result.issues.find(i => i.code === 'house-rule');
  assert.equal(house.severity, 'error');
  assert.equal(house.elementId, 't');
  assert.equal(result.valid, false);
  assert.ok(result.warnings >= 1);
});

test('no hook, an empty answer, or a hook that throws (a warning) leaves the model valid', async () => {
  assert.equal((await verifyModel(MODEL, { appDelegate: {} })).valid, true);
  assert.equal((await verifyModel(MODEL, serverWith(() => []))).valid, true);
  const failed = await verifyModel(MODEL, serverWith(() => { throw new Error('boom'); }));
  assert.equal(failed.valid, true);
  assert.match(failed.issues.find(i => i.code === 'application-check-failed').message, /boom/);
});

test('the hook is not called for a model the engine cannot read', async () => {
  let called = false;
  await verifyModel('<bpmn:definitions', serverWith(() => { called = true; return []; }));
  assert.equal(called, false);
});
