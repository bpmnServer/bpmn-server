// Copies bpmnServer4's sampleApp into templates/app (and bpmn-web's settings schema beside it), the template `bpmn-server init` creates applications from
// (npm run template; run by prepack, so the published package has it). Its own files stay out: node_modules,
// package-lock.json, .env; .gitignore is written as gitignore (npm leaves .gitignore out of packages).
import fs from 'node:fs';
import path from 'node:path';

const root = path.join(import.meta.dirname, '..');
const from = path.join(root, '..', '..', 'apps', 'sampleApp');
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

// bpmn-web's settings schema: init asks setup's steps from it before the application's bpmn-web is installed
const schema = path.join(root, '..', 'bpmn-web', 'settings', 'settings.schema.json');
fs.copyFileSync(schema, path.join(root, 'templates', 'settings.schema.json'));
console.log('template: templates/settings.schema.json from bpmn-web');
