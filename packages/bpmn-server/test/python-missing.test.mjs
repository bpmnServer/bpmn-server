// @features: script-task
// A `$py` script on a server without Python: the script fails, the server does not. Before, the spawn's ENOENT had no
// handler, so it was an uncaught exception that ended the whole process (found running the coverage suite on Linux,
// where `python` is not installed: testSampleApp's WebService model took the scenario-coverage run down with it).
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { makeServer, definitionsFolder } from './helpers.mjs';

const model = `<?xml version="1.0" encoding="UTF-8"?>
<bpmn:definitions xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" id="D_Py" targetNamespace="http://bpmn.io/schema/bpmn">
  <bpmn:process id="Py" isExecutable="true">
    <bpmn:startEvent id="S"><bpmn:outgoing>f1</bpmn:outgoing></bpmn:startEvent>
    <bpmn:scriptTask id="Run" scriptFormat="JavaScript"><bpmn:incoming>f1</bpmn:incoming><bpmn:outgoing>f2</bpmn:outgoing>
      <bpmn:script>$py print("hello")</bpmn:script></bpmn:scriptTask>
    <bpmn:userTask id="Next"><bpmn:incoming>f2</bpmn:incoming></bpmn:userTask>
    <bpmn:sequenceFlow id="f1" sourceRef="S" targetRef="Run" />
    <bpmn:sequenceFlow id="f2" sourceRef="Run" targetRef="Next" />
  </bpmn:process>
</bpmn:definitions>`;

test('a $py script with no Python to run it fails the script, and the server goes on', async (t) => {
  const before = process.env.PYTHON_CMD;
  process.env.PYTHON_CMD = 'no-such-python-' + process.pid;
  t.after(() => { if (before === undefined) delete process.env.PYTHON_CMD; else process.env.PYTHON_CMD = before; });
  const uncaught = [];
  const listener = err => uncaught.push(err);
  process.on('uncaughtException', listener);
  t.after(() => process.off('uncaughtException', listener));

  const dir = definitionsFolder();
  fs.writeFileSync(path.join(dir, 'Py.bpmn'), model);
  const { server } = await makeServer({ dir });
  let failure;
  try {
    const { instance } = await server.engine.start('Py', {});
    failure = instance;
  } catch (err) { failure = err; }
  await new Promise(resolve => setTimeout(resolve, 50));   // an ENOENT is reported on a later tick
  assert.deepEqual(uncaught, [], 'nothing uncaught');
  assert.match(String(failure?.message ?? JSON.stringify(failure)), /Python could not be started/);

  const again = await server.engine.start('Py', {}).catch(err => err);   // the server still runs processes
  assert.ok(again);
  await server.shutdown();
});
