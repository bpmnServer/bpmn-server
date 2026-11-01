// The script events the model editor offers (modeler/src/properties/ScriptsGroup.jsx) are the ones bpmn-server
// runs: a model with a script on each is run, and each script must have run. Scripts the editor does not offer
// (on sequence flows, on transformOutput) must still not run; if bpmn-server starts running them, offer them.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { startWebApp } from '../support/webApp.mjs';

const OFFERED = { userTask: ['enter', 'start', 'wait', 'end', 'assign', 'validate', 'transformInput'], process: ['start', 'end'] };

const listener = (event, code) =>
    `<camunda:executionListener event="${event}"><camunda:script scriptFormat="JavaScript">${code}</camunda:script></camunda:executionListener>`;

const MODEL = `<?xml version="1.0" encoding="UTF-8"?>
<bpmn:definitions xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:camunda="http://camunda.org/schema/1.0/bpmn" id="d" targetNamespace="urn:test">
  <bpmn:process id="Events" isExecutable="true">
    <bpmn:extensionElements>${OFFERED.process.map(e => listener(e, `instance.data.process_${e} = true;`)).join('')}</bpmn:extensionElements>
    <bpmn:startEvent id="Start" />
    <bpmn:userTask id="Task">
      <bpmn:extensionElements>${[...OFFERED.userTask, 'transformOutput'].map(e => listener(e, `this.data.task_${e} = true;`)).join('')}</bpmn:extensionElements>
    </bpmn:userTask>
    <bpmn:endEvent id="End" />
    <bpmn:sequenceFlow id="f1" sourceRef="Start" targetRef="Task">
      <bpmn:extensionElements>${listener('take', 'instance.data.flow_take = true;')}</bpmn:extensionElements>
    </bpmn:sequenceFlow>
    <bpmn:sequenceFlow id="f2" sourceRef="Task" targetRef="End" />
  </bpmn:process>
</bpmn:definitions>`;

let web;
test.before(async () => { web = await startWebApp(); });
test.after(async () => { await web?.stop(); setImmediate(() => process.exit(0)); });

test('scripts run on the events the editor offers, and only those', async () => {
    fs.writeFileSync(path.join(web.definitionsPath, 'script-events.bpmn'), MODEL);
    await web.bpmnServer.definitions.rebuild();
    const engine = web.bpmnServer.engine;
    const started = await engine.start('script-events', {});
    await engine.assign({ id: started.id, 'items.elementId': 'Task' }, {}, { assignee: 'someone' }, 'admin');
    const ended = await engine.invoke({ id: started.id, 'items.elementId': 'Task' }, {});
    assert.equal(ended.instance.status, 'end');
    const data = ended.instance.data;

    for (const event of OFFERED.process)
        assert.equal(data[`process_${event}`], true, `process ${event} script ran`);
    for (const event of OFFERED.userTask)
        assert.equal(data[`task_${event}`], true, `user task ${event} script ran`);
    assert.equal(data.task_transformOutput, undefined, 'transformOutput is not fired');
    assert.equal(data.flow_take, undefined, 'scripts on sequence flows are not run');
});
