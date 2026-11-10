// @features: console
// The console's command from the command line (npm run cli -- cod asana): the words after --cli.
import test from 'node:test';
import assert from 'node:assert/strict';
import { commandLineArgs } from '../../../../packages/bpmn-web/dist/console.js';

test('the words after --cli are the command and its answers; none: the menu', () => {
    assert.deepEqual(commandLineArgs(['node', 'index.ts', '--cli', 'cod', 'asana']), ['cod', 'asana']);
    assert.deepEqual(commandLineArgs(['node', 'index.ts', '--cli', '--', 'co']), ['co'], 'npm\'s -- left out');
    assert.deepEqual(commandLineArgs(['node', 'index.ts', '--cli']), []);
    assert.deepEqual(commandLineArgs(['node', 'index.ts']), []);
});
