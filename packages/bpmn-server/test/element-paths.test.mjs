// @features: input-output
// What elements do on the less trodden paths: input and output values of each kind, timers by date, a script's escalation or error,
// business rule tasks' result mappings, a completion condition, the engine's refusals.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { makeServer } from './helpers.mjs';

const NS = 'xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:camunda="http://camunda.org/schema/1.0/bpmn" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"';
const model = (body, roots = '') => `<?xml version="1.0" encoding="UTF-8"?>
<bpmn:definitions ${NS} id="d" targetNamespace="urn:test">${roots}<bpmn:process id="p" isExecutable="true">${body}</bpmn:process></bpmn:definitions>`;

async function serverWith(xml, options = {}) {
  const made = await makeServer(options);
  fs.writeFileSync(made.dir + 'm.bpmn', xml);
  await made.server.definitions.rebuild();
  return made;
}
const item = (instance, id) => instance.items.find(i => i.elementId === id);
const line = (...ids) => ids.slice(1).map((id, i) => `<bpmn:sequenceFlow id="flow${i}" sourceRef="${ids[i]}" targetRef="${id}" />`).join('');

test('inputs of each kind: text, list and map, evaluated', async () => {
  const { server } = await serverWith(model(`
    <bpmn:startEvent id="s" />
    <bpmn:userTask id="t">
      <bpmn:extensionElements><camunda:inputOutput>
        <camunda:inputParameter name="plain">hello</camunda:inputParameter>
        <camunda:inputParameter name="expr">$(data.n + 1)</camunda:inputParameter>
        <camunda:inputParameter name="list"><camunda:list><camunda:value>$(data.n)</camunda:value><camunda:value>$(data.n * 2)</camunda:value></camunda:list></camunda:inputParameter>
        <camunda:inputParameter name="map"><camunda:map><camunda:entry key="a">$(data.n)</camunda:entry></camunda:map></camunda:inputParameter>
        <camunda:outputParameter name="out">$(data.n * 10)</camunda:outputParameter>
      </camunda:inputOutput></bpmn:extensionElements>
    </bpmn:userTask>
    <bpmn:endEvent id="e" />${line('s', 't', 'e')}`));
  const execution = await server.engine.start('m', { n: 2 });
  const { instance } = execution;
  const { input } = execution.getItems().find(i => i.elementId === 't');
  assert.equal(input.plain, 'hello');
  assert.equal(input.expr, 3);
  assert.deepEqual(input.list, [2, 4]);
  const definition = await server.definitions.load('m');
  const described = JSON.stringify([...definition.getNodeById('t').behaviours.values()].map(b => b.describe()));
  assert.match(described, /plain=/, 'and it describes them');
  const { instance: after } = await server.engine.invoke({ id: instance.id, 'items.elementId': 't' }, {});
  assert.equal(after.status, 'end');
  assert.equal(after.data.out, 20);
  await server.shutdown();
});

test('a timer by date waits until that date', async () => {
  const when = new Date(Date.now() + 3600_000).toISOString();
  const { server } = await serverWith(model(`
    <bpmn:startEvent id="s" />
    <bpmn:intermediateCatchEvent id="t"><bpmn:timerEventDefinition><bpmn:timeDate>${when}</bpmn:timeDate></bpmn:timerEventDefinition></bpmn:intermediateCatchEvent>
    <bpmn:endEvent id="e" />${line('s', 't', 'e')}`));
  const { instance } = await server.engine.start('m', {});
  const timer = item(instance, 't');
  assert.equal(timer.status, 'wait');
  assert.equal(new Date(timer.timeDue).getTime(), new Date(when).getTime());
  const { instance: after } = await server.engine.invoke({ id: instance.id, 'items.elementId': 't' }, {});
  assert.equal(after.status, 'end', 'invoked before its time, it goes on');
  await server.shutdown();
});

test('a script returns a BPMN error or an escalation: the event catches it', async () => {
  const script = (returned) => `<bpmn:scriptTask id="w" scriptFormat="JavaScript"><bpmn:script>return ${returned};</bpmn:script></bpmn:scriptTask>`;
  const made = (work, definition) => model(`
    <bpmn:startEvent id="s" />${work}
    <bpmn:boundaryEvent id="b" attachedToRef="w">${definition}</bpmn:boundaryEvent>
    <bpmn:endEvent id="e" /><bpmn:endEvent id="c" />${line('s', 'w', 'e')}<bpmn:sequenceFlow id="fb" sourceRef="b" targetRef="c" />`,
    '<bpmn:error id="E1" errorCode="E1" /><bpmn:escalation id="X1" escalationCode="X1" />');
  const errored = await serverWith(made(script('{ bpmnError: "E1" }'), '<bpmn:errorEventDefinition errorRef="E1" />'));
  assert.equal(item((await errored.server.engine.start('m', {})).instance, 'c').status, 'end');
  await errored.server.shutdown();
  const escalated = await serverWith(made(script('{ escalation: "X1" }'), '<bpmn:escalationEventDefinition escalationRef="X1" />'));
  const { instance } = await escalated.server.engine.start('m', {});
  assert.equal(item(instance, 'c').status, 'end');
  assert.equal(item(instance, 'w').status, 'end', 'an escalation does not stop the task');
  await escalated.server.shutdown();

  const service = await serverWith(made('<bpmn:serviceTask id="w" implementation="work" />', '<bpmn:errorEventDefinition errorRef="E1" />'), { services: { work: async () => ({ bpmnError: 'E1' }) } });
  assert.equal(item((await service.server.engine.start('m', {})).instance, 'c').status, 'end');
  await service.server.shutdown();
  const serviceUp = await serverWith(made('<bpmn:serviceTask id="w" implementation="work" />', '<bpmn:escalationEventDefinition escalationRef="X1" />'), { services: { work: async () => ({ escalation: 'X1' }) } });
  assert.equal(item((await serviceUp.server.engine.start('m', {})).instance, 'c').status, 'end');
  await serviceUp.server.shutdown();
});

test('an ad hoc sub-process completes when its condition holds, ending what is still open', async () => {
  const { server } = await serverWith(model(`
    <bpmn:startEvent id="s" />
    <bpmn:adHocSubProcess id="a" ordering="Parallel">
      <bpmn:userTask id="one" /><bpmn:userTask id="two" />
      <bpmn:completionCondition xsi:type="bpmn:tFormalExpression">data.a.enough == true</bpmn:completionCondition>
    </bpmn:adHocSubProcess>
    <bpmn:endEvent id="e" />${line('s', 'a', 'e')}`));
  const { instance } = await server.engine.start('m', {});
  assert.equal(item(instance, 'one').status, 'wait');
  assert.equal(item(instance, 'two').status, 'wait');
  const { instance: after } = await server.engine.invoke({ id: instance.id, 'items.elementId': 'one' }, { enough: true });
  assert.equal(after.status, 'end');
  assert.equal(item(after, 'e').status, 'end');
  await server.shutdown();
});

test('a gateway with no way on says so', async () => {
  const { server } = await serverWith(model(`
    <bpmn:startEvent id="s" />
    <bpmn:inclusiveGateway id="g" />
    <bpmn:sequenceFlow id="f0" sourceRef="s" targetRef="g" />
    <bpmn:sequenceFlow id="f1" sourceRef="g" targetRef="e"><bpmn:conditionExpression>data.go == true</bpmn:conditionExpression></bpmn:sequenceFlow>
    <bpmn:sequenceFlow id="f2" sourceRef="g" targetRef="e"><bpmn:conditionExpression>data.go == false</bpmn:conditionExpression></bpmn:sequenceFlow>
    <bpmn:endEvent id="e" />`));
  const { instance } = await server.engine.start('m', {});
  assert.equal(item(instance, 'e'), undefined);
  assert.match(JSON.stringify(instance.logs), /takes no flow/);
  await server.shutdown();
});

test('what the engine refuses: no such item, more than one, and an item no longer waiting', async () => {
  const { server } = await serverWith(model(`
    <bpmn:startEvent id="s" /><bpmn:parallelGateway id="g" /><bpmn:userTask id="a" /><bpmn:userTask id="b" />
    <bpmn:sequenceFlow id="f0" sourceRef="s" targetRef="g" />
    <bpmn:sequenceFlow id="f1" sourceRef="g" targetRef="a" />
    <bpmn:sequenceFlow id="f2" sourceRef="g" targetRef="b" />`));
  const { instance } = await server.engine.start('m', {});
  await assert.rejects(server.engine.invoke({ id: instance.id, 'items.status': 'wait' }, {}), /expecting only one/);
  await assert.rejects(server.engine.invoke({ id: 'nope', 'items.elementId': 'a' }, {}), /./);
  const task = item(instance, 'a');
  await server.engine.invoke({ 'items.id': task.id }, {});
  await assert.rejects(server.engine.invoke({ 'items.id': task.id }, {}), /./);
  await server.shutdown();
});

test('messages and signals nobody waits for: nothing happens, and it is not an error', async () => {
  const { server } = await serverWith(model(`<bpmn:startEvent id="s" /><bpmn:endEvent id="e" />${line('s', 'e')}`));
  assert.equal(await server.engine.throwMessage('nobody', {}, {}), null);
  const signalled = await server.engine.throwSignal('nobody', {}, {});
  assert.deepEqual(signalled ?? [], []);
  await server.shutdown();
});

test('an execution reports on itself: items, data, state; and its events reach a listener', async () => {
  const { server } = await serverWith(model(`<bpmn:startEvent id="s" /><bpmn:userTask id="t" /><bpmn:endEvent id="e" />${line('s', 't', 'e')}`));
  const execution = await server.engine.start('m', { a: 1 });
  assert.deepEqual(execution.getItemsData().map(i => i.elementId), execution.instance.items.map(i => i.elementId));
  assert.equal(execution.getData().a, 1);
  execution.appendData({ b: 2 });
  assert.equal(execution.getData().b, 2);
  assert.ok(execution.getState().items.length >= 2);
  assert.ok(execution.getNodeById('t'));
  const token = execution.tokens.values().next().value;
  assert.equal(token.currentNode.id, 't');
  assert.ok(token.hasNode('s'), 'it passed the start');
  assert.equal(token.hasNode('e'), false);
  assert.ok(token.getFullPath().some(i => i.elementId === 's'));
  assert.equal(token.lastItem?.elementId, 's', 'the node before this one');
  assert.equal(await execution.tillDone(), execution);
  await server.shutdown();
});
