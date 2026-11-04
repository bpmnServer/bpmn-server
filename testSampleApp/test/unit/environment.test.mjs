// @features: setup-env
// The environment's contract (docs/docs/environment.md): every variable the code reads, and every one in the sample
// .env.example files, has its row on the page; and the page lists none the code has stopped reading.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.join(import.meta.dirname, '..', '..', '..');
const PAGE = fs.readFileSync(path.join(ROOT, 'docs', 'docs', 'environment.md'), 'utf8');
const SOURCES = [
    'packages/bpmn-server/src', 'packages/bpmn-web/src', 'packages/bpmn-client/src',
    'testSampleApp/delegates', 'testSampleApp/settings', 'testSampleApp/connectors', 'testSampleApp/index.ts', 'sampleApp/index.ts',
];
// process.env.NAME, process.env['NAME'], env.NAME and env['NAME'] (an Env passed in), isTrue('NAME'), positiveInt(env, 'NAME')
const READS = /\benv(?:\.([A-Z][A-Z0-9_]+)|\[\s*['"]([A-Z][A-Z0-9_]+)['"]\s*\])|isTrue\(\s*['"]([A-Z][A-Z0-9_]+)['"]|positiveInt\(\s*env,\s*['"]([A-Z][A-Z0-9_]+)['"]/g;

function files(entry) {
    const full = path.join(ROOT, entry);
    if (!fs.existsSync(full)) return [];
    if (fs.statSync(full).isFile()) return [full];
    return fs.readdirSync(full, { recursive: true }).map(f => path.join(full, f))
        .filter(f => /\.(ts|mts|js|mjs)$/.test(f) && !f.endsWith('.d.ts'));
}

function read() {
    const names = new Map();
    for (const file of SOURCES.flatMap(files))
        for (const m of fs.readFileSync(file, 'utf8').matchAll(READS)) {
            const name = m.slice(1).find(Boolean);
            if (!names.has(name)) names.set(name, path.relative(ROOT, file));
        }
    return names;
}

const documented = new Set([...PAGE.matchAll(/^\| `([A-Z][A-Z0-9_]+)` \|/gm)].map(m => m[1]));

test('every variable the code reads is on the environment page', () => {
    const missing = [...read()].filter(([name]) => !documented.has(name)).map(([name, file]) => `${name} (${file})`);
    assert.deepEqual(missing, [], 'add a row to docs/docs/environment.md');
});

test('every variable of the sample .env.example files is on the environment page', () => {
    for (const example of ['testSampleApp/.env.example', 'sampleApp/.env.example']) {
        const names = [...fs.readFileSync(path.join(ROOT, example), 'utf8').matchAll(/^#?\s*([A-Z][A-Z0-9_]+)=/gm)].map(m => m[1]);
        assert.deepEqual(names.filter(name => !documented.has(name)), [], example);
    }
});

test('the page lists no variable the code no longer reads', () => {
    const names = read();
    assert.deepEqual([...documented].filter(name => !names.has(name)), [], 'remove its row, or read it');
});
