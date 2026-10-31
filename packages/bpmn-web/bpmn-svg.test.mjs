import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { layoutProcess } from 'bpmn-auto-layout';
import { bpmnToSvg } from './dist/routes/bpmnToSvg.js';

const simple = fs.readFileSync('test/processes/test-exclusive-gateway.bpmn', 'utf8');

test('renders an SVG preview from diagram information', async () => {
  const svg = await bpmnToSvg(simple);
  assert.match(svg, /^<\?xml[^>]*>\n<svg xmlns="http:\/\/www.w3.org\/2000\/svg"/);
  assert.match(svg, /viewBox="-?\d+ -?\d+ \d+ \d+"/);
  assert.ok(svg.includes('<circle'), 'events drawn');
  assert.ok(svg.includes('<polygon'), 'gateway drawn');
  assert.ok(svg.includes('marker-end="url(#arrow)"'), 'sequence flows drawn');
});

test('returns null for a model without diagram information', async () => {
  const noDi = simple.replace(/<bpmndi:BPMNDiagram[\s\S]*<\/bpmndi:BPMNDiagram>/, '');
  assert.equal(await bpmnToSvg(noDi), null);
});

test('renders auto-laid-out models and escapes names', async () => {
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<bpmn:definitions xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" id="d" targetNamespace="x">
  <bpmn:process id="p" isExecutable="true">
    <bpmn:startEvent id="s"><bpmn:outgoing>f1</bpmn:outgoing></bpmn:startEvent>
    <bpmn:userTask id="t" name="Review &lt;claim&gt; &amp; pay"><bpmn:incoming>f1</bpmn:incoming></bpmn:userTask>
    <bpmn:sequenceFlow id="f1" sourceRef="s" targetRef="t" />
  </bpmn:process>
</bpmn:definitions>`;
  const svg = await bpmnToSvg(await layoutProcess(xml));
  assert.ok(svg.includes('&lt;claim&gt;'));
  assert.ok(!svg.includes('<claim>'));
});

test('wraps elements like bpmn-js so decorations and the replay animation find them', async () => {
  const svg = await bpmnToSvg(simple);
  const ids = [...svg.matchAll(/class="djs-element djs-(shape|connection)" data-element-id="([^"]+)"/g)].map(m => m[2]);
  assert.ok(ids.length > 0);
  for (const id of ids.filter(i => !i.endsWith('_label')))
    assert.ok(simple.includes(`id="${id}"`), `${id} is a model element`);
  assert.match(svg, /djs-shape" data-element-id="[^"]+" transform="matrix\(1 0 0 1 [\d.-]+ [\d.-]+\)"><g class="djs-visual">/);
  assert.match(svg, /djs-connection" data-element-id="[^"]+"><g class="djs-visual"><path /);
});
