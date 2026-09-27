import test from 'node:test';
import assert from 'node:assert/strict';
import { Definition } from './dist/elements/Definition.js';

test('loads a BPMN process with no flow elements', async () => {
  const source = `<?xml version="1.0" encoding="UTF-8"?>
    <bpmn:definitions xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL"
      id="Definitions_1" targetNamespace="http://example.com/bpmn">
      <bpmn:process id="Process_1" isExecutable="false" />
    </bpmn:definitions>`;
  const server = {
    appDelegate: { moddleOptions: {} },
    logger: {},
    listener: { emit: async () => {} },
  };
  const definition = new Definition('empty', source, server);

  await definition.load();

  assert.equal(definition.processes.size, 1);
  assert.deepEqual(definition.getStartNodes(), []);
});
