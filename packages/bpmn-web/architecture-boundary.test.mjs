import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

import { WebApp, defineWorkflowApplication } from './dist/index.js';

test('public package exports reusable composition API', () => {
  assert.equal(typeof WebApp, 'function');
  assert.equal(typeof WebApp.prototype.start, 'function');

  const application = { configuration: {} };
  assert.equal(defineWorkflowApplication(application), application);
});

test('reusable WebApp does not import the bundled sample application', () => {
  const source = fs.readFileSync(new URL('./src/app.ts', import.meta.url), 'utf8');
  assert.doesNotMatch(source, /from ['"][^'"]*(?:\/sample-app\/|\/WorkflowApp\/)[^'"]*['"]/);
});
