// @features: sandbox, script-task
// Scripts in a sandbox whose calls to appServices and appUtils run (callServices): JSON copies both ways, the script's
// time limit not counting what it waits for, and only the services' methods within reach.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

import { SandboxScriptHandler, runSandboxed } from '../dist/index.js';
import { makeServer } from './helpers.mjs';

const later = (ms, value) => new Promise(resolve => setTimeout(() => resolve(value), ms));

class Delegate { server = { secret: () => 'the server' }; secret() { return 'the delegate'; } }
class Services {
  appDelegate = new Delegate();
  plain = { nested: { twice: x => x * 2 } };
  seen = [];
  rate = 3;
  async echo(input) { this.seen.push(input); return input; }
  times(x) { return x * this.rate; }
  nothing() { }
  when() { return new Date('2026-01-02T03:04:05Z'); }
  slow(ms) { return later(ms, 'slow'); }
  async refuses() { throw new RangeError('not today'); }
  throws() { throw new Error('at once'); }
}
const services = new Services();
const run = (body, options = {}) => runSandboxed({ data: {} }, body, { services: { appServices: services, appUtils: { add: (a, b) => a + b } }, timeLimit: 100, ...options });

test('a service runs, and its value comes back: awaited or at once, in a nested object, as JSON', async () => {
  assert.deepEqual((await run('return await appServices.echo({ a: 1 });')).result, { a: 1 });
  assert.deepEqual(services.seen.at(-1), { a: 1 });
  assert.equal((await run('return appServices.times(2);')).result, 6, 'a method has its object');
  assert.equal((await run('return appServices.plain.nested.twice(4);')).result, 8);
  assert.equal((await run('return appUtils.add(1, 2);')).result, 3);
  assert.equal((await run('return typeof appServices.nothing();')).result, 'undefined');
  assert.equal((await run('return appServices.when();')).result, '2026-01-02T03:04:05.000Z');
  assert.deepEqual((await run('return await Promise.all([appServices.echo(1), appServices.slow(5), appServices.echo(2)]);')).result, [1, 'slow', 2]);
});

test('a service that fails: the script can catch it, else the script fails with it', async () => {
  assert.equal((await run('try { await appServices.refuses(); } catch (e) { return e.name + ": " + e.message; }')).result, 'RangeError: not today');
  assert.equal((await run('try { appServices.throws(); } catch (e) { return e.message; }')).result, 'at once');
  await assert.rejects(run('await appServices.refuses();', { name: 'task' }), /task: not today/);
});

test('only the services\' methods are within reach', async () => {
  for (const path of ['appServices.appDelegate.server.secret', 'appServices.appDelegate.secret', 'appServices.constructor', 'appServices.__proto__.constructor', 'appServices.echo.call',
    'appServices.echo.constructor', 'appServices.toString', 'appServices.plain.constructor', 'appServices.plain.hasOwnProperty'])
    await assert.rejects(run(`return ${path}('return process')`), /is not a (service|function)/, path);
  await assert.rejects(run('return appServices.rate()'), /appServices\.rate is not a function/, 'a value is not a method');
  await assert.rejects(run('return appServices()'), /appServices is not a function/);
});

test('the time limit is the script\'s own: not what it waits for a service; a script that keeps busy is still stopped', async () => {
  assert.equal((await run('return await appServices.slow(300);', { timeLimit: 50 })).result, 'slow');
  await assert.rejects(run('await appServices.slow(10); while (true) {}', { timeLimit: 50 }), /stopped after 50 ms/);
  await assert.rejects(run('appServices.slow(10); while (true) {}', { timeLimit: 50 }), /stopped after 50 ms/, 'with a call still running');
  await assert.rejects(run('const spin = async () => { for (;;) await 0; }; await spin();', { timeLimit: 50 }), /stopped after 50 ms/, 'in its jobs');
});

test('a script that does not wait for its service ends; the service\'s end comes to nothing', async () => {
  assert.equal((await run('appServices.slow(20); appServices.refuses(); return 1;')).result, 1);
  await later(40);
});

test('without services it runs nothing, and says which', async () => {
  const { result, calls } = await runSandboxed({}, 'return appServices.echo(1);', {});
  assert.equal(result, undefined);
  assert.deepEqual(calls, ['appServices.echo']);
});

test('in a model: a script task and a condition call the application\'s services, and a service task runs, with the timers off: each is its own setting', async () => {
  const NS = 'xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:camunda="http://camunda.org/schema/1.0/bpmn" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"';
  const charged = [];
  const { server, dir } = await makeServer({
    services: { charge: async input => { charged.push(input); return { charged: true }; }, limit: () => 100 },
    extra: { runTimers: false, scriptHandler: () => new SandboxScriptHandler({ callServices: true }) },
  });
  fs.writeFileSync(`${dir}sb-app.bpmn`, `<?xml version="1.0" encoding="UTF-8"?>
<bpmn:definitions ${NS} id="d" targetNamespace="urn:test"><bpmn:process id="sbApp" isExecutable="true">
  <bpmn:startEvent id="start" />
  <bpmn:scriptTask id="run" scriptFormat="javascript"><bpmn:script>data.result = await appServices.charge({ amount: data.amount });</bpmn:script></bpmn:scriptTask>
  <bpmn:serviceTask id="pay" camunda:delegateExpression="charge" />
  <bpmn:exclusiveGateway id="gw" default="toLow" />
  <bpmn:userTask id="high" />
  <bpmn:userTask id="low" />
  <bpmn:sequenceFlow id="f0" sourceRef="start" targetRef="run" />
  <bpmn:sequenceFlow id="f1" sourceRef="run" targetRef="pay" />
  <bpmn:sequenceFlow id="f2" sourceRef="pay" targetRef="gw" />
  <bpmn:sequenceFlow id="toHigh" sourceRef="gw" targetRef="high"><bpmn:conditionExpression xsi:type="bpmn:tFormalExpression">\${data.amount &gt; appServices.limit()}</bpmn:conditionExpression></bpmn:sequenceFlow>
  <bpmn:sequenceFlow id="toLow" sourceRef="gw" targetRef="low" />
</bpmn:process></bpmn:definitions>`);
  await server.definitions.rebuild();
  const execution = await server.engine.start('sb-app', { amount: 500 });
  assert.deepEqual(execution.instance.data.result, { charged: true });
  assert.equal(charged.length, 2, 'from the script and from the service task');
  assert.deepEqual(charged[0], { amount: 500 });
  assert.ok(execution.instance.items.some(i => i.elementId === 'high' && i.status === 'wait'), 'the condition called its service');
  await server.shutdown?.();
});
