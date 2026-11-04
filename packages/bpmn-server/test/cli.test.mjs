// @features: bpmn-server-cli, new-app
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

// init: an application on bpmn-server and bpmn-web, written without installing anything
function init(...args) {
  const dir = path.join(fs.mkdtempSync(path.join(os.tmpdir(), 'bpmn-init-')), 'app');
  const r = run('init', dir, '--yes', '--no-install', ...args);
  assert.equal(r.status, 0, r.stdout + r.stderr);
  const read = file => fs.readFileSync(path.join(dir, file), 'utf8');
  return { dir, r, read, exists: file => fs.existsSync(path.join(dir, file)) };
}

test('init: the sample application, on MongoDB with sign-in, by default', () => {
  const app = init('--port', '3050');
  for (const file of ['package.json', '.env', '.gitignore', 'README.md', 'docker-compose.yml', 'tsconfig.json', 'index.ts',
    'settings/config.ts', 'delegates/appDelegate.ts', 'connectors/appServices.ts', 'connectors/echo.json',
    'processes/Hello.bpmn', 'processes/Buy Used Car.bpmn', 'processes/Leave Application.bpmn'])
    assert.ok(app.exists(file), file);
  assert.ok(!app.exists('test') && !app.exists('node_modules'), 'no tests, no node_modules');
  const env = app.read('.env');
  assert.match(env, /^MONGO_DB_URL=mongodb:\/\/localhost:27017\/app$/m);
  assert.match(env, /^SERVE=both$/m);
  assert.match(env, /^REQUIRE_AUTHENTICATION=true$/m);
  assert.match(env, /^API_KEY=[0-9a-f]{48}$/m);
  assert.match(env, /^PORT=3050$/m);
  const pkg = JSON.parse(app.read('package.json'));
  assert.equal(pkg.name, 'app');
  assert.match(pkg.dependencies['bpmn-server'], /^\^\d/, 'the published bpmn-server, not the workspace\'s "*"');
  assert.match(pkg.dependencies['bpmn-web'], /^\^\d/);
  assert.ok(pkg.dependencies.axios && pkg.dependencies.dayjs, 'the sample application\'s own dependencies');
  assert.equal(pkg.dependencies['mongodb-memory-server'], undefined);
  assert.equal(pkg.scripts.start, 'tsx index.ts');
  assert.match(app.read('README.md'), /^# app$/m, 'titled with the application\'s name');
  assert.match(app.r.stdout, /docker compose up -d/);
  assert.equal(run('verify', path.join(app.dir, 'processes')).status, 0, 'the sample models pass');
});

test('init: --memory, --no-auth and --api-only', () => {
  const app = init('--memory', '--no-auth', '--api-only');
  const env = app.read('.env');
  assert.match(env, /^MONGO_DB_URL=memory$/m);
  assert.match(env, /^SERVE=api$/m);
  assert.match(env, /^REQUIRE_AUTHENTICATION=false$/m);
  assert.match(env, /^ENFORCE_SECURITY=false$/m);
  assert.ok(JSON.parse(app.read('package.json')).dependencies['mongodb-memory-server']);
  assert.ok(!app.exists('docker-compose.yml'), 'no MongoDB to run');
  assert.doesNotMatch(app.r.stdout, /npm run setup|docker compose/);
});

test('init --minimal: a Hello application', () => {
  const app = init('--minimal', '--port', '3050', '--ui-only');
  for (const file of ['package.json', '.env', '.gitignore', 'README.md', 'tsconfig.json',
    'src/index.ts', 'src/config.ts', 'src/appDelegate.ts', 'processes/Hello.bpmn'])
    assert.ok(app.exists(file), file);
  assert.ok(!app.exists('connectors'), 'not the sample application');
  assert.equal(JSON.parse(app.read('package.json')).scripts.start, 'tsx src/index.ts');
  assert.match(app.read('src/index.ts'), /api: false,[\s\S]*ui: true,/);
  assert.match(app.read('README.md'), /npm run setup[\s\S]*http:\/\/localhost:3050/);
  assert.equal(run('verify', path.join(app.dir, 'processes')).status, 0, 'the Hello model passes');
});

test('init: conflicting options and a folder in use are refused', () => {
  assert.equal(run('init', 'x', '--memory', '--mongo', 'mongodb://h/db').status, 2);
  assert.equal(run('init', 'x', '--api-only', '--ui-only').status, 2);
  const app = init();
  const again = run('init', app.dir, '--yes', '--no-install');
  assert.equal(again.status, 1);
  assert.match(again.stderr, /not empty/);
});
