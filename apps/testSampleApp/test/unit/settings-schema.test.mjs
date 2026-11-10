// @features: setup-env
// The settings' schema (packages/bpmn-web/settings/settings.schema.json) names every setting the code reads: a setting
// added to the code and not to the schema fails here. Each entry says what it is (docs/design/setup-wizard.md).
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', '..', '..', '..');
const schema = JSON.parse(fs.readFileSync(path.join(ROOT, 'packages', 'bpmn-web', 'settings', 'settings.schema.json'), 'utf8'));
const settings = schema.properties;

/** Set by the platform, not by anyone setting the server up. */
const PLATFORM = new Set(['INVOCATION_ID', 'OPENSHIFT_NODEJS_IP', 'OPENSHIFT_NODEJS_PORT']);

function sources(dir, found = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) { if (!['node_modules', 'dist', 'test'].includes(entry.name)) sources(full, found); }
    else if (/\.(ts|mts|js|mjs)$/.test(entry.name) && !/\.d\.ts$/.test(entry.name)) found.push(full);
  }
  return found;
}

/** Every setting a package's code reads: process.env.X, env.X, env['X'], and a name given to a reader (positiveInt(env, 'X')). */
function settingsRead() {
  const read = new Map();
  for (const pkg of ['bpmn-server', 'bpmn-web', 'bpmn-client', 'bpmn-mcp'])
    for (const file of sources(path.join(ROOT, 'packages', pkg, 'src'))) {
      const text = fs.readFileSync(file, 'utf8');
      for (const re of [/\b(?:process\.)?env\.([A-Z][A-Z0-9_]+)\b/g, /\benv\[['"]([A-Z][A-Z0-9_]+)['"]\]/g, /\(env, '([A-Z][A-Z0-9_]+)'/g])
        for (const [, name] of text.matchAll(re))
          if (!PLATFORM.has(name)) read.set(name, path.relative(ROOT, file));
    }
  return read;
}

test('every setting the code reads is in the schema', () => {
  const missing = [...settingsRead()].filter(([name]) => !settings[name]).map(([name, file]) => `${name} (${file})`);
  assert.deepEqual(missing, [], 'add them to settings.schema.json');
});

test('each entry says what it is, where it goes, and its group', () => {
  for (const [name, s] of Object.entries(settings)) {
    assert.ok(['string', 'integer', 'boolean', 'object'].includes(s.type), `${name}: a type`);
    assert.ok(s.description?.length > 3, `${name}: a description`);
    assert.ok(['env', 'config'].includes(s['x-where']), `${name}: x-where`);
    assert.equal(name.startsWith('config:'), s['x-where'] === 'config', `${name}: config:<path> for settings/config.ts`);
    assert.ok(s['x-group'], `${name}: a group`);
    if (s['x-where'] === 'env') assert.match(name, /^[A-Z][A-Z0-9_]+$/, `${name}: an environment variable's name`);
    if ('default' in s) {
      assert.ok(!s['x-secret'], `${name}: a secret has no default`);
      const type = typeof s.default === 'number' ? 'integer' : typeof s.default;
      assert.equal(type, s.type, `${name}: its default is a ${s.type}`);
    }
    if (s.enum && 'default' in s) assert.ok(s.enum.includes(s.default), `${name}: its default is one of its values`);
  }
});

test('the keys and passwords are secrets the wizard can make', () => {
  for (const name of ['API_KEY', 'ADMIN_API_KEY', 'API_ACTING_USER_KEY', 'SESSION_SECRET', 'ENGINE_KEY', 'CONNECTORS_KEY', 'ADMIN_PASSWORD'])
    assert.ok(settings[name]['x-secret'] && settings[name]['x-generate'], name);
  assert.ok(settings.SMTP_PASSWORD['x-secret']);
});
