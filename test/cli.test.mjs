// The command line: `bpmn-server verify <file-or-folder>... [--json]`, run as a user would run it.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

import { PROCESSES } from './helpers.mjs';

const CLI = fileURLToPath(new URL('../dist/cli.js', import.meta.url));
const run = (...args) => spawnSync(process.execPath, [CLI, ...args], { encoding: 'utf8' });

function broken() {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'bpmn-cli-'));
  const file = path.join(dir, 'broken.bpmn');
  const source = fs.readFileSync(path.join(PROCESSES, 'expense-approval.bpmn'), 'utf8');
  fs.writeFileSync(file, source.replace(/targetRef="ApproveExpense"/, 'targetRef="NoSuchTask"'));
  return file;
}

test('verify: a valid model passes, exit code 0', () => {
  const r = run('verify', path.join(PROCESSES, 'expense-approval.bpmn'));
  assert.equal(r.status, 0, r.stdout + r.stderr);
  assert.match(r.stdout, /expense-approval\.bpmn: 0 errors/);
});

test('verify: a folder checks every model in it', () => {
  const r = run('verify', PROCESSES);
  assert.equal(r.status, 0, r.stdout + r.stderr);
  for (const name of fs.readdirSync(PROCESSES).filter(f => f.endsWith('.bpmn')))
    assert.ok(r.stdout.includes(name), `${name} reported`);
});

test('verify: a model with errors lists them, exit code 1', () => {
  const r = run('verify', broken());
  assert.equal(r.status, 1);
  assert.match(r.stdout, /broken\.bpmn: [1-9]\d* errors/);
  assert.match(r.stdout, /error/);
});

test('verify --json: the results as JSON', () => {
  const r = run('verify', broken(), '--json');
  assert.equal(r.status, 1);
  const [result] = JSON.parse(r.stdout);
  assert.equal(result.valid, false);
  assert.ok(result.errors > 0 && result.issues.some(i => i.severity === 'error'));
});

test('verify: a missing path is an error; no arguments prints the usage', () => {
  const missing = run('verify', 'no-such-file.bpmn');
  assert.equal(missing.status, 1);
  assert.match(missing.stdout, /not-found/);
  const none = run();
  assert.equal(none.status, 2);
  assert.match(none.stderr, /usage: bpmn-server verify/);
  assert.equal(run('--help').status, 0);
});
