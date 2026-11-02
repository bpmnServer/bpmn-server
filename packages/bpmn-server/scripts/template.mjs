// Copies bpmnServer4's sampleApp into templates/app, the template `bpmn-server init` creates applications from
// (npm run template; run by prepack, so the published package has it). Its own files stay out: node_modules,
// package-lock.json, .env; .gitignore is written as gitignore (npm leaves .gitignore out of packages).
import fs from 'node:fs';
import path from 'node:path';

const root = path.join(import.meta.dirname, '..');
const from = path.join(root, '..', '..', 'sampleApp');
const to = path.join(root, 'templates', 'app');
const SKIP = new Set(['node_modules', 'package-lock.json', '.env']);

if (!fs.existsSync(from)) {
    console.error(`no sample application at ${from}`);
    process.exit(1);
}
fs.rmSync(to, { recursive: true, force: true });
fs.cpSync(from, to, {
    recursive: true,
    filter: source => !SKIP.has(path.basename(source)),
});
fs.renameSync(path.join(to, '.gitignore'), path.join(to, 'gitignore'));
console.log(`template: ${path.relative(root, to)} from ${path.relative(root, from)}`);
