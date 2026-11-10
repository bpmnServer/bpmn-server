import test from 'node:test';
import assert from 'node:assert/strict';
import { loadClientScript } from './load.mjs';

const sb = loadClientScript('descriptions.js', {}, ['bpmn_descriptions']);
const D = sb.bpmn_descriptions;

test('bpmn_descriptions exposes the core BPMN element types', () => {
  for (const k of ['Task', 'UserTask', 'ServiceTask', 'StartEvent', 'EndEvent',
                   'ExclusiveGateway', 'ParallelGateway', 'SequenceFlow']) {
    assert.ok(D[k], `has entry for ${k}`);
  }
});

test('every description entry has name/desc/start/completion', () => {
  for (const [k, v] of Object.entries(D)) {
    for (const field of ['name', 'desc', 'start', 'completion']) {
      assert.ok(typeof v[field] === 'string' && v[field].length > 0, `${k}.${field} is a non-empty string`);
    }
  }
});

test('lookup key used by SVGHelper (type without bpmn: prefix) resolves', () => {
  // displayDescription does: bpmn_descriptions[element.type.replace('bpmn:','')]
  assert.equal(D['UserTask'].name, 'userTask');
  assert.equal('bpmn:ExclusiveGateway'.replace('bpmn:', '') in D, true);
});
