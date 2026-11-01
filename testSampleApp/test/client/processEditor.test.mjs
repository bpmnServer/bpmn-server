import test from 'node:test';
import assert from 'node:assert/strict';
import { loadClientScript } from './load.mjs';

// processEditor.js references bpmn_descriptions (defined in descriptions.js); inject a stub.
const sb = loadClientScript('processEditor.js', {
  bpmn_descriptions: { Task: { title: 'Task', desc: 'work', start: 's', completion: 'c' } },
});

test('getPropertyFromField strips the form_input_ prefix', () => {
  assert.equal(sb.getPropertyFromField('form_input_color'), 'color');
});

test('getPropertyFromField returns the name unchanged when no prefix', () => {
  assert.equal(sb.getPropertyFromField('somethingElse'), 'somethingElse');
});

test('getDescAttribute wraps scalar / renders array / empty for missing', () => {
  assert.equal(sb.getDescAttribute({ a: 'x' }, 'a', '<b>', '</b>'), '<b>x</b>');
  assert.match(sb.getDescAttribute({ o: ['x', 'y'] }, 'o', '<p>', '</p>'), /<ul><li>x<\/li><li>y<\/li><\/ul>/);
  assert.equal(sb.getDescAttribute({}, 'a', '<b>', '</b>'), '');
});

test('getItemDescription resolves type via itemId and builds HTML (no TDZ / undefined-item throw)', () => {
  sb.jsonData = { elements: [{ id: 'e1', type: 'bpmn:Task' }] };
  // before the fix this threw: TDZ on `desc` and a reference to an undefined `item`
  const html = sb.getItemDescription('e1');
  assert.match(html, /<table/);
  assert.match(html, /<tr><td><b>Task<\/b><\/td><\/tr>/);
});

test('getItemDescription returns undefined for an unknown id (no matching element)', () => {
  sb.jsonData = { elements: [] };
  assert.equal(sb.getItemDescription('nope'), undefined);
});
