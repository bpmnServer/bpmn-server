import test from 'node:test';
import assert from 'node:assert/strict';
import { loadClientScript } from './load.mjs';

const sb = loadClientScript('SVGHelper.js');

test('getItemElement finds an element by id in jsonData.elements', () => {
  sb.jsonData = {
    flows: [{ id: 'f1', type: 'bpmn:SequenceFlow' }],
    elements: [{ id: 'e1', type: 'bpmn:Task', name: 'T' }],
  };
  assert.equal(sb.getItemElement('e1').name, 'T');
});

test('getItemElement finds a flow by id in jsonData.flows', () => {
  sb.jsonData = {
    flows: [{ id: 'f1', type: 'bpmn:SequenceFlow' }],
    elements: [{ id: 'e1', type: 'bpmn:Task' }],
  };
  assert.equal(sb.getItemElement('f1').type, 'bpmn:SequenceFlow');
});

test('getItemElement returns undefined for an unknown id', () => {
  sb.jsonData = { flows: [], elements: [] };
  assert.equal(sb.getItemElement('nope'), undefined);
});

test('getDescAttribute wraps a scalar value with pre/post', () => {
  assert.equal(sb.getDescAttribute({ a: 'x' }, 'a', '<b>', '</b>'), '<b>x</b>');
});

test('getDescAttribute renders an array as a <ul>', () => {
  const html = sb.getDescAttribute({ opts: ['x', 'y'] }, 'opts', '<p>', '</p>');
  assert.match(html, /<ul><li>x<\/li><li>y<\/li><\/ul>/);
});

test('getDescAttribute returns empty string for missing/empty attribute', () => {
  assert.equal(sb.getDescAttribute({}, 'a', '<b>', '</b>'), '');
});

test('getItemDescription builds an HTML table with id and type rows', () => {
  const desc = { title: 'Task', desc: 'work', start: 's', completion: 'c' };
  const el = { id: 'e1', type: 'bpmn:Task' };
  const html = sb.getItemDescription(desc, el);
  assert.match(html, /<table/);
  assert.match(html, /id:<\/td><td>e1/);
  assert.match(html, /type:<\/td><td>bpmn:Task/);
  assert.match(html, /Starts:<\/td><td>s/);
  // title row must be a closed table row (was previously left unclosed)
  assert.match(html, /<tr><td><b>Task<\/b><\/td><\/tr>/);
});

test('getItemDescription returns empty string when desc is null', () => {
  assert.equal(sb.getItemDescription(null, { id: 'x' }), '');
});

test('Show Animation plays the selected element and restarts cleanly', () => {
  const timelines = [];
  const element = { classList: { remove() {} } };
  const gsap = {
    registerPlugin() {},
    killTweensOf() {},
    timeline(options) {
      const timeline = {
        options, targets: [], plays: 0, killed: false,
        to(target) { this.targets.push(target); return this; },
        call() { return this; },
        play() { this.plays++; },
        kill() { this.killed = true; },
      };
      timelines.push(timeline);
      return timeline;
    },
  };
  const document = {
    addEventListener() {},
    querySelectorAll() { return []; },
    querySelector(selector) { return selector === '[data-element-id="StartEvent_1"]' ? element : null; },
    getElementById(id) {
      if (id === 'jsonInfo') return { textContent: JSON.stringify([
        { message: "{'id':'StartEvent_1','seq':1,'action':'Started'}" },
      ]) };
      return null;
    },
  };
  const script = loadClientScript('SVGHelper.js', {
    gsap, document, CSS: { escape: value => value },
  });

  script.startAnimation();
  assert.equal(timelines[0].options.paused, true);
  assert.deepEqual(timelines[0].targets, [element]);
  assert.equal(timelines[0].plays, 1);

  script.startAnimation();
  assert.equal(timelines[0].killed, true);
  assert.equal(timelines[1].plays, 1);
});

test('Show Animation does not throw if an item is absent from the diagram', () => {
  const script = loadClientScript('SVGHelper.js', {
    document: { addEventListener() {}, querySelector: () => null },
  });
  assert.doesNotThrow(() => script.endAnimation('missing', 1, 'Ended'));
});

test('Show Animation uses saved items and native animation when GSAP is unavailable', async () => {
  let pulses = 0;
  const classes = new Set();
  const element = {
    classList: {
      add(name) { classes.add(name); },
      remove(name) { classes.delete(name); },
    },
    animate() { pulses++; return { finished: Promise.resolve() }; },
  };
  const status = { textContent: '' };
  const document = {
    addEventListener() {},
    querySelectorAll() { return []; },
    querySelector(selector) { return selector === '[data-element-id="start"]' ? element : null; },
    getElementById(id) {
      if (id === 'jsonInfo') return { textContent: '[]' };
      if (id === 'animationItems') return { textContent: JSON.stringify([{ id: 'start', seq: 1, type: 'bpmn:StartEvent', status: 'end' }]) };
      if (id === 'animationStatus') return status;
      return null;
    },
  };
  const script = loadClientScript('SVGHelper.js', {
    document, gsap: undefined, CSS: { escape: value => value },
    setTimeout(callback) { callback(); },
  });
  script.startAnimation();
  await new Promise(resolve => setImmediate(resolve));
  assert.equal(pulses, 1);
  assert.match(status.textContent, /Replay complete/);
});
