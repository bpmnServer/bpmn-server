// Checks the models of a folder with the editor's modeling rules (bpmnlint): modeler/src/lint/bpmnlintrc.json,
// with the team's changes from the folder's bpmnlint.json (the editor's Rules dialog saves them there).
//   node modeler/lint-models.mjs [folder]      the folder: DEFINITIONS_PATH, else processes/
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { createRequire } from 'node:module';

const root = path.resolve(import.meta.dirname, '..');
const folder = path.resolve(process.argv[2] || process.env.DEFINITIONS_PATH || path.join(root, 'processes'));
const base = JSON.parse(fs.readFileSync(path.join(root, 'modeler', 'src', 'lint', 'bpmnlintrc.json'), 'utf8'));
let team = {};
try {
    team = JSON.parse(fs.readFileSync(path.join(folder, 'bpmnlint.json'), 'utf8')).rules || {};
} catch {
    team = {};
}
const config = path.join(fs.mkdtempSync(path.join(os.tmpdir(), 'bpmnlint-')), '.bpmnlintrc');
fs.writeFileSync(config, JSON.stringify({ ...base, rules: { ...base.rules, ...team } }, null, 2));

const cli = createRequire(import.meta.url).resolve('bpmnlint/bin/bpmnlint.js');
// the folder's models and its sub-folders', not the saved versions (.history) or anything else in a dot folder
const models = dir => fs.readdirSync(dir, { withFileTypes: true }).flatMap(e => e.name.startsWith('.') || e.name === 'node_modules' ? []
    : e.isDirectory() ? models(path.join(dir, e.name)) : e.name.endsWith('.bpmn') ? [path.join(dir, e.name)] : []);
const files = models(folder);
if (!files.length) {
    console.log(`no models in ${folder}`);
    fs.rmSync(path.dirname(config), { recursive: true, force: true });
    process.exit(0);
}
const { status } = spawnSync(process.execPath, [cli, '--config', config, ...files], { stdio: 'inherit' });
fs.rmSync(path.dirname(config), { recursive: true, force: true });
process.exit(status ?? 1);
