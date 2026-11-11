// @features: setup-wizard
// bpmn-server setup: an application's .env step by step, from bpmn-web's settings schema (docs/design/setup-wizard.md §3).
// The steps are driven with scripted answers; the database is not checked (--no-check) except where a test says.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

import { setup, parseEnv, renderEnv, invalid, checkDatabase } from '../dist/setup.js';
import { init } from '../dist/init.js';

const CLI = fileURLToPath(new URL('../dist/cli.js', import.meta.url));

/** Answers given in order; what was printed kept. */
function scripted(answers) {
  const out = [];
  const next = async prompt => { out.push(prompt); if (!answers.length) throw new Error(`no answer for: ${prompt}`); return answers.shift(); };
  return { out, io: { question: next, secret: next, print: t => out.push(t), close() { } } };
}

/** An application folder with this .env (no install). */
function app(env = '') {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'bpmn-setup-'));
  fs.writeFileSync(path.join(dir, 'package.json'), JSON.stringify({ name: 'a', dependencies: {} }));
  if (env) fs.writeFileSync(path.join(dir, '.env'), env);
  return dir;
}
const readEnv = dir => parseEnv(fs.readFileSync(path.join(dir, '.env'), 'utf8'));

test('setup --yes: a new application, the development profile: memory, new keys, the trace on', async () => {
  const dir = path.join(fs.mkdtempSync(path.join(os.tmpdir(), 'bpmn-setup-')), 'app');
  const r = spawnSync(process.execPath, [CLI, 'setup', dir, '--yes', '--no-install', '--profile', 'development'], { encoding: 'utf8' });
  assert.equal(r.status, 0, r.stdout + r.stderr);
  const env = readEnv(dir);
  assert.equal(env.MONGO_DB_URL, 'memory');
  assert.equal(env.APP_ENV, 'test');
  assert.equal(env.API_TRACE, 'api-trace.jsonl');
  assert.equal(env.REQUIRE_AUTHENTICATION, 'true');
  for (const key of ['API_KEY', 'ADMIN_API_KEY', 'SESSION_SECRET', 'ADMIN_PASSWORD'])
    assert.ok(env[key]?.length >= 16, key);
  assert.ok(JSON.parse(fs.readFileSync(path.join(dir, 'package.json'), 'utf8')).dependencies['mongodb-memory-server'], 'memory needs mongodb-memory-server');
  assert.ok(!fs.existsSync(path.join(dir, '.env.bak')), 'a new application has no .env before it');
});

test('setup: the answers are written; comments and other settings kept; secrets masked in the summary', async () => {
  const dir = app('# mine\nPORT=3000\nMONGO_DB_URL=memory\nAPI_KEY=old-key\nADMIN_API_KEY=old-admin\nSESSION_SECRET=old-session\n#SMTP_USER=\nCUSTOM=kept\n');
  const { io, out } = scripted([
    'production',                      // profile
    'mongodb://db.example:27017/a',    // database
    'none',                            // administrator: the first page asks
    '3100', '',                        // port; the address follows it
    'yes', 'no', 'no',                 // sign-in on, design off, sign-up off
    'yes', 'mail@example.com', 'smtp-secret', '',   // email
    'no', 'yes', 'no',                 // keys: a new ADMIN_API_KEY only
    'work,design',                     // AI access
    '', 'no',                          // environment: production; no trace
    'yes',                             // write
  ]);
  assert.equal(await setup([dir, '--no-check'], io), 0, out.join('\n'));
  const env = readEnv(dir);
  assert.equal(env.MONGO_DB_URL, 'mongodb://db.example:27017/a');
  assert.equal(env.PORT, '3100');
  assert.equal(env.SITE_URL, 'http://localhost:3100');
  assert.equal(env.DISABLE_DESIGN, 'true');
  assert.equal(env.DISABLE_SIGNUP, 'true');
  assert.equal(env.EMAIL_ENABLE, 'true');
  assert.equal(env.SMTP_USER, 'mail@example.com');
  assert.equal(env.SMTP_PASSWORD, 'smtp-secret');
  assert.equal(env.EMAIL_FROM, 'mail@example.com');
  assert.equal(env.AI_ACCESS, 'work,design');
  assert.equal(env.APP_ENV, 'production');
  assert.equal(env.API_KEY, 'old-key');
  assert.notEqual(env.ADMIN_API_KEY, 'old-admin');
  assert.equal(env.CUSTOM, 'kept');
  assert.equal(env.ADMIN_PASSWORD, undefined);
  const text = fs.readFileSync(path.join(dir, '.env'), 'utf8');
  assert.match(text, /^# mine$/m);
  assert.match(text, /^SMTP_USER=mail@example\.com$/m, 'the commented #SMTP_USER= line is the one set');
  assert.ok(!out.join('\n').includes('smtp-secret'), 'a secret is never shown back');
  assert.equal(fs.readFileSync(path.join(dir, '.env.bak'), 'utf8').includes('old-admin'), true);
});

test('init, asked: what it serves, then the same steps as setup; the next steps follow the answers', async () => {
  const dir = path.join(fs.mkdtempSync(path.join(os.tmpdir(), 'bpmn-setup-')), 'app');
  const { io, out } = scripted([
    'api',                      // serve: the REST APIs only
    'development',              // profile
    '',                         // the database: memory, the profile's
    '',                         // administrator: generated
    '3200', '',                 // port, address
    '', '', '',                 // sign-in, design, sign-up
    '',                         // email off
    '',                         // AI access: all
    '', '',                     // environment test, trace on
    '',                         // write
  ]);
  const logged = [], log = console.log;
  console.log = (...a) => logged.push(a.join(' '));
  try { assert.equal(await init([dir, '--no-install'], { io }), 0, out.join('\n')); }
  finally { console.log = log; }
  const env = readEnv(dir);
  assert.equal(env.SERVE, 'api');
  assert.equal(env.MONGO_DB_URL, 'memory');
  assert.equal(env.PORT, '3200');
  assert.equal(env.APP_ENV, 'test');
  assert.ok(env.ADMIN_PASSWORD);
  assert.ok(!out.some(line => /make a new one/.test(line)), 'a new application\'s keys are not offered again');
  assert.ok(!fs.existsSync(path.join(dir, 'docker-compose.yml')), 'memory: no MongoDB container');
  assert.match(logged.join('\n'), /http:\/\/localhost:3200/);
  assert.doesNotMatch(logged.join('\n'), /docker compose up/);
});

test('setup: production refuses memory; a wrong value is asked again', async () => {
  const dir = app('MONGO_DB_URL=mongodb://h/a\nAPI_KEY=k\nADMIN_API_KEY=k\nSESSION_SECRET=k\n');
  const { io, out } = scripted([
    'production', 'memory', 'mongodb://h/a',  // memory refused, asked again
    'keep-or-not', 'abc', '3000', '',         // administrator: anything else keeps; the port must be a number
    '', '', '', '', 'no', 'no', 'no', 'everything', 'all', '', '', 'no',
  ]);
  assert.equal(await setup([dir, '--no-check'], io), 1);
  const said = out.join('\n');
  assert.match(said, /production needs a database that keeps its data/);
  assert.match(said, /PORT is a number/);
  assert.match(said, /all, off, or some of work, design, administer/);
  assert.match(said, /Nothing written/);
  assert.equal(readEnv(dir).MONGO_DB_URL, 'mongodb://h/a', 'not confirmed: .env as it was');
});

test('setup: no application and no folder named is an error; a wrong profile is refused', () => {
  const empty = fs.mkdtempSync(path.join(os.tmpdir(), 'bpmn-setup-'));
  const none = spawnSync(process.execPath, [CLI, 'setup', '--yes'], { cwd: empty, encoding: 'utf8' });
  assert.equal(none.status, 1);
  assert.match(none.stderr, /No application in/);
  assert.equal(spawnSync(process.execPath, [CLI, 'setup', empty, '--profile', 'staging'], { encoding: 'utf8' }).status, 2);
  assert.match(spawnSync(process.execPath, [CLI, 'setup', '--help'], { encoding: 'utf8' }).stdout, /usage: bpmn-server setup/);
});

test('setup with no terminal (install.sh, Docker: npm run setup): nothing asked, nothing changed, exit 0', () => {
  const dir = app('PORT=3000\n');
  const r = spawnSync(process.execPath, [CLI, 'setup', dir], { encoding: 'utf8', input: '' });
  assert.equal(r.status, 0, r.stdout + r.stderr);
  assert.match(r.stdout, /no terminal, nothing asked/);
  assert.equal(fs.readFileSync(path.join(dir, '.env'), 'utf8'), 'PORT=3000\n');
});

test('renderEnv and invalid: the .env changed in place; values checked against the schema', () => {
  assert.equal(renderEnv('A=1\n#B=\nC=3\n', { A: '2', B: 'x y', C: null, D: '4' }),
    'A=2\nB="x y"\n\n# set by bpmn-server setup\nD=4\n');
  assert.deepEqual(parseEnv('A="x y"\n# c\nB=2'), { A: 'x y', B: '2' });
  assert.equal(invalid('yes', { type: 'boolean' }), 'true or false');
  assert.equal(invalid('true', { type: 'boolean' }), null);
  assert.equal(invalid('x', { type: 'string', enum: ['both', 'api'] }), 'one of both, api');
  assert.equal(invalid('localhost', { type: 'string', format: 'uri' }), 'an http:// or https:// address');
});

test('checkDatabase: memory answers; a MongoDB that is not there does not', async () => {
  assert.equal((await checkDatabase('memory')).ok, true);
  const missing = await checkDatabase('mongodb://127.0.0.1:1/none');
  assert.equal(missing.ok, false);
  assert.match(missing.message, /does not answer/);
});
