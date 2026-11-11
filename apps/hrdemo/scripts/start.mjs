// npm start: the HR demo for working on it. The pages are built, then built again whenever src/ changes; the server
// restarts whenever its code changes (index.ts, server/, workflow/'s delegates and settings: tsx watch); an open page
// reloads by itself after either (HR_LIVE_RELOAD, server/pages.js). Saving a model restarts nothing.
// npm run serve: built once, no watching, as a server people use.
import { spawn, spawnSync } from 'node:child_process';
import path from 'node:path';

const root = path.join(import.meta.dirname, '..');
const bin = name => path.join(root, 'node_modules', '.bin', process.platform === 'win32' ? `${name}.cmd` : name);
const run = (name, args, env = {}) => spawn(bin(name), args, { cwd: root, stdio: 'inherit', shell: process.platform === 'win32', env: { ...process.env, ...env } });

// the pages first, so the server has them from its first answer
const built = spawnSync(bin('vite'), ['build', '--logLevel', 'warn'], { cwd: root, stdio: 'inherit', shell: process.platform === 'win32' });
if (built.status !== 0) process.exit(built.status ?? 1);

const children = [
  run('vite', ['build', '--watch', '--logLevel', 'warn']),
  run('tsx', ['watch', '--clear-screen=false', 'index.ts'], { HR_LIVE_RELOAD: '1' }),
];
const stop = () => { for (const child of children) child.kill(); process.exit(0); };
process.on('SIGINT', stop);
process.on('SIGTERM', stop);
for (const child of children) child.on('exit', code => { if (code) { console.error(`stopped: ${code}`); stop(); } });
