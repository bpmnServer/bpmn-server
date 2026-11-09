// @features: logging
// The server's log (common/Logger.ts): where messages go, what is kept, how values are written.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { Logger } from '../dist/index.js';

const folder = fs.mkdtempSync(path.join(os.tmpdir(), 'bpmn-log-'));

test('a callback hears every message, with its type; a file gets each one', () => {
  const heard = [], file = path.join(folder, 'to-file.log');
  const logger = new Logger({ toConsole: false, toFile: file, callback: (message, type) => heard.push([type, message]) });
  logger.log('one');
  logger.info('two');
  logger.debug('three');
  logger.warn('four');
  logger.decision('five');
  assert.deepEqual(heard, [['log', 'one'], ['info', 'two'], ['debug', 'three'], ['warn', 'four'], ['decision', 'five']]);
  assert.equal(fs.readFileSync(file, 'utf8'), 'onetwothreefourfive');
});

test('messages are kept only when asked, and cleared', () => {
  const quiet = new Logger({ toConsole: false });
  quiet.log('gone');
  assert.deepEqual(quiet.get(), []);
  const keeping = new Logger({ toConsole: false, keepMessages: true });
  keeping.log('kept');
  assert.deepEqual(keeping.get().map(m => m.message), ['kept']);
  keeping.clear();
  assert.deepEqual(keeping.get(), []);
});

test('values are written as text: undefined, objects, several', () => {
  const logger = new Logger({ toConsole: false });
  assert.equal(logger.toString('a', 1), 'a ,Number 1');
  assert.equal(logger.toString(undefined), 'undefined');
  assert.equal(logger.toString(['only']), 'only', 'a list of one: the one');
  assert.equal(logger.toString([['a', 'b']]), '["a","b"]');
  assert.equal(logger.toString({ a: 1 }), "Object " + JSON.stringify({ a: 1 }, null, 2));
  assert.equal(logger.toString('^top'), 'top', 'a ^ goes back to the first level');
});

test('an error stops the caller; a message reported as an error does not', () => {
  const heard = [];
  const logger = new Logger({ toConsole: false, callback: (message, type) => heard.push(type) });
  assert.throws(() => logger.error('it failed'), /it failed/);
  logger.reportError('only a message');
  assert.deepEqual(heard, ['error']);
  logger.reportError(new Error('with a stack'));
  assert.ok(heard.includes('log'), 'the stack is logged');
});

test('saved to a file: the errors first, then everything, and cleared', async () => {
  const logger = new Logger({ toConsole: false, keepMessages: true });
  logger.log('step');
  logger.msg('bad', 'error');
  const file = path.join(folder, 'saved.log');
  await logger.save(file);
  const text = fs.readFileSync(file, 'utf8');
  assert.match(text, /^Started at: /);
  assert.match(text, /error: at line 2 bad/);
  assert.ok(text.indexOf('error: at line 2 bad') < text.indexOf('step'), 'errors first');
  assert.deepEqual(logger.get(), []);
});

test('an instance\'s log goes to logFolder, when there is one', async (t) => {
  const logger = new Logger({ toConsole: false, keepMessages: true });
  logger.log('step');
  await logger.saveForInstance('no-folder');
  assert.equal(logger.get().length, 1, 'no logFolder: not saved');
  process.env.logFolder = folder;
  t.after(() => { delete process.env.logFolder; });
  await logger.saveForInstance('inst-1');
  assert.match(fs.readFileSync(path.join(folder, 'inst-1.log'), 'utf8'), /step/);
  assert.equal(new Logger({ toConsole: false }).keepMessages, true, 'a logFolder needs the messages kept');
});
