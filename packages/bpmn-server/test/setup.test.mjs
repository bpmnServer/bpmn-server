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
  assert.equal(env.REQUIRE_AUTHENTICATION, 'true');
  for (const key of ['API_KEY', 'ADMIN_API_KEY', 'SESSION_SECRET'])
    assert.ok(env[key]?.length >= 16, key);
  // the password is made here and printed, so whoever ran setup leaves with it
  assert.ok(env.ADMIN_PASSWORD?.length >= 10, 'a password is made');
  assert.match(r.stdout, new RegExp(`password ${env.ADMIN_PASSWORD.replace(/[.*+?^${}()|[\]\-]/g, '\$&')}`), 'and printed');
  // what the dialog no longer decides (the application's own .env may still carry a default, as EMAIL_ENABLE does)
  for (const key of ['APP_ENV', 'API_TRACE', 'DISABLE_DESIGN', 'DISABLE_SIGNUP', 'AI_ACCESS'])
    assert.equal(env[key], undefined, `${key} is not setup's to write`);
  assert.ok(JSON.parse(fs.readFileSync(path.join(dir, 'package.json'), 'utf8')).dependencies['mongodb-memory-server'], 'memory needs mongodb-memory-server');
  assert.ok(!fs.existsSync(path.join(dir, '.env.bak')), 'a new application has no .env before it');
});

test('setup: the answers are written; comments and other settings kept; secrets masked in the summary', async () => {
  const dir = app('# mine\nPORT=3000\nMONGO_DB_URL=memory\nAPI_KEY=old-key\nADMIN_API_KEY=old-admin\nSESSION_SECRET=old-session\n#SMTP_USER=\nCUSTOM=kept\n');
  const { io, out } = scripted([
    '1',                               // profile: 1 production
    'mongodb://db.example:27017/a',    // database: an address instead of 1, 2 or 3
    '2', 'chosen-password',            // administrator: 2 chooses one
    '3100', '',                        // port; the address follows it
    'no', 'yes', 'no',                 // keys: a new ADMIN_API_KEY only
    'yes',                             // write
  ]);
  assert.equal(await setup([dir, '--no-check'], io), 0, out.join('\n'));
  const env = readEnv(dir);
  assert.equal(env.MONGO_DB_URL, 'mongodb://db.example:27017/a');
  assert.equal(env.PORT, '3100');
  assert.equal(env.SITE_URL, 'http://localhost:3100');
  assert.equal(env.ADMIN_PASSWORD, 'chosen-password', 'the one chosen, not one made');
  assert.equal(env.API_KEY, 'old-key');
  assert.notEqual(env.ADMIN_API_KEY, 'old-admin');
  assert.equal(env.CUSTOM, 'kept');
  // the dialog no longer asks these, and does not write them
  for (const key of ['DISABLE_DESIGN', 'DISABLE_SIGNUP', 'AI_ACCESS', 'APP_ENV', 'API_TRACE', 'SMTP_USER'])
    assert.equal(env[key], undefined, `${key} is not asked`);
  const text = fs.readFileSync(path.join(dir, '.env'), 'utf8');
  assert.match(text, /^# mine$/m);
  // the password is printed on purpose, so whoever ran setup leaves with it; what is typed is still masked
  assert.ok(out.join('\n').includes('password chosen-password'), 'the password is stated');
  assert.equal(fs.readFileSync(path.join(dir, '.env.bak'), 'utf8').includes('old-admin'), true);
});

test('init, asked: what to start from, then the same steps as setup; the next steps follow the answers', async () => {
  const dir = path.join(fs.mkdtempSync(path.join(os.tmpdir(), 'bpmn-setup-')), 'app');
  const { io, out } = scripted([
    '1',                        // start from: 1 the sample application
    '2',                        // the database: 2 in memory
    '',                         // administrator: 1, a password made here
    '3200', '',                 // port, address
    '',                         // write
  ]);
  const logged = [], log = console.log;
  console.log = (...a) => logged.push(a.join(' '));
  try { assert.equal(await init([dir, '--no-install'], { io }), 0, out.join('\n')); }
  finally { console.log = log; }
  const env = readEnv(dir);
  assert.equal(env.MONGO_DB_URL, 'memory');
  assert.equal(env.PORT, '3200');
  assert.ok(env.ADMIN_PASSWORD?.length >= 10, 'a password is made here');
  assert.ok(out.join('\n').includes(`password ${env.ADMIN_PASSWORD}`), 'and printed');
  assert.ok(!out.some(line => /make a new one/.test(line)), 'a new application\'s keys are not offered again');
  assert.ok(!fs.existsSync(path.join(dir, 'docker-compose.yml')), 'memory: no MongoDB container');
  assert.match(logged.join('\n'), /http:\/\/localhost:3200/);
  assert.doesNotMatch(logged.join('\n'), /docker compose up/);
});

test('setup: production refuses memory; a wrong value is asked again; nothing written when not confirmed', async () => {
  const dir = app('MONGO_DB_URL=mongodb://h/a\nAPI_KEY=k\nADMIN_API_KEY=k\nSESSION_SECRET=k\n');
  const { io, out } = scripted([
    '1', '2', 'mongodb://h/a',   // production; 2 is in memory, refused; an address instead
    '1',                         // administrator: a password made here
    'abc', '3000', '',           // the port must be a number: asked again
    'no', 'no', 'no',            // the keys that are set: keep each
    'no',                        // write: no
  ]);
  assert.equal(await setup([dir, '--no-check'], io), 1);
  const said = out.join('\n');
  assert.match(said, /production needs a database that keeps its data/);
  assert.match(said, /PORT is a number/);
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

test('setup: sqlite:<file> is a database too: DATABASE is set, its folder checked; a wrong answer is asked again', async () => {
  const dir = app('MONGO_DB_URL=mongodb://h/a\nAPI_KEY=k\nADMIN_API_KEY=k\nSESSION_SECRET=k\n');
  const { io, out } = scripted([
    'production', 'postgres://x', 'sqlite:./data/app.sqlite',   // not a database setup knows; then SQLite
    'none', '', '', '', '', '', '', 'no', 'no', 'no', '', '', '', 'yes',
  ]);
  assert.equal(await setup([dir], io), 0, out.join('\n'));
  assert.match(out.join('\n'), /a mongodb:\/\/ URL, memory, or sqlite:<file>/);
  assert.match(out.join('\n'), /ok: .*app\.sqlite: its folder can be written/);
  const env = readEnv(dir);
  assert.equal(env.DATABASE, 'sqlite:./data/app.sqlite');
  assert.ok(fs.existsSync(path.join(dir, 'data')), 'its folder made');
  assert.ok(!JSON.parse(fs.readFileSync(path.join(dir, 'package.json'), 'utf8')).dependencies['mongodb-memory-server']);
});

/** terminalIO in a process of its own, answers piped in: what it printed, and how it ended. */
function piped(script, input) {
  const code = `import { terminalIO } from ${JSON.stringify(new URL('../dist/setup.js', import.meta.url).href)};
const io = terminalIO();
try { ${script} } catch (error) { console.log('ERROR ' + error.message); }
io.close();`;
  return spawnSync(process.execPath, ['--input-type=module', '-e', code], { input, encoding: 'utf8' });
}

test('the terminal, piped: answers given before their questions wait for them, shown after; a secret as ***', () => {
  const run = piped(`
    const name = await io.question('Name? ');
    const key = await io.secret('Key? ');
    io.print('got ' + name + ' and ' + key.length + ' characters');`, 'Ann\ns3cret\n');
  assert.equal(run.status, 0, run.stderr);
  assert.match(run.stdout, /Name\? Ann\n/, 'the answer after its question');
  assert.match(run.stdout, /Key\? \*\*\*\n/, 'the secret not shown');
  assert.ok(!run.stdout.includes('s3cret'));
  assert.match(run.stdout, /got Ann and 6 characters/);
});

test('the terminal, piped: input that ends before the questions do is said, for a question waiting and one asked after', () => {
  const run = piped(`
    await io.question('One? ');
    await new Promise(resolve => setTimeout(resolve, 50));
    await io.question('Two? ');`, 'only\n');
  assert.match(run.stdout, /ERROR setup: the input ended before the questions did/);
  const waiting = piped(`await io.question('One? '); await io.question('Two? ');`, 'only\n');
  assert.match(waiting.stdout, /ERROR setup: the input ended before the questions did/);
});

test('setup stopped part way (the answers ran out): it says so, and writes nothing', async () => {
  const dir = app('PORT=3000\nMONGO_DB_URL=memory\n');
  const before = fs.readFileSync(path.join(dir, '.env'), 'utf8');
  const { io } = scripted(['production']);
  const errors = [];
  const error = console.error;
  console.error = (...args) => errors.push(args.join(' '));
  try { assert.equal(await setup([dir, '--no-check'], io), 1); }
  finally { console.error = error; }
  assert.match(errors.join('\n'), /no answer for: .*; nothing written/);
  assert.equal(fs.readFileSync(path.join(dir, '.env'), 'utf8'), before);
});

test('the database check: a SQLite file whose folder can not be made, a MongoDB that does not answer, one that does', async () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'bpmn-setup-'));
  fs.writeFileSync(path.join(dir, 'a-file'), '');
  const sqlite = await checkDatabase('sqlite:a-file/app.db', dir);
  assert.equal(sqlite.ok, false);
  assert.match(sqlite.message, /can not be written/);
  const nowhere = await checkDatabase('mongodb://127.0.0.1:9/app');
  assert.equal(nowhere.ok, false);
  assert.match(nowhere.message, /does not answer/);
  if (process.env.BPMN_TEST_MONGO_URL) {
    const there = await checkDatabase(process.env.BPMN_TEST_MONGO_URL);
    assert.equal(there.ok, true, there.message);
  }
});
