// Tests the BPMN Server distribution image before it is pushed: the image itself, then the application running through the real
// docker-compose.yml, under a project and a port of its own, so an installation on this machine is not touched.
// Needs Docker and Node.js 20 or later; no packages.
//
//   node test.mjs                                    ralphhanna/bpmn-server:latest, as built here (it is not pulled)
//   node test.mjs ralphhanna/bpmn-server:3.5.2          that image
//   node test.mjs <image> --version 3.5.2            and the version it must hold
//
// The version expected, without --version: the image's tag; for latest or no tag, the latest on npm.
// Exit code: 0 when every check passes.
import { spawnSync } from 'node:child_process';
import crypto from 'node:crypto';
import fs from 'node:fs';
import net from 'node:net';
import os from 'node:os';
import path from 'node:path';

const args = process.argv.slice(2);
const versionAt = args.indexOf('--version');
const versionArg = versionAt >= 0 ? args.splice(versionAt, 2)[1] : undefined;
const image = args[0] ?? 'ralphhanna/bpmn-server:latest';

const results = [];
function check(name, ok, detail = '') {
    results.push(ok);
    console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${detail ? `: ${detail}` : ''}`);
    return ok;
}
function run(command, argv, options = {}) {
    const r = spawnSync(command, argv, { encoding: 'utf8', shell: command === 'npm' && process.platform === 'win32', ...options });
    return { status: r.status, out: `${r.stdout ?? ''}${r.stderr ?? ''}` };
}
const key = () => crypto.randomBytes(16).toString('hex');
const freePort = () => new Promise(resolve => {
    const server = net.createServer().listen(0, () => {
        const { port } = server.address();
        server.close(() => resolve(port));
    });
});

// ---- the image, not running

const inImage = sh => run('docker', ['run', '--rm', '--entrypoint', 'sh', image, '-c', sh]);
if (run('docker', ['image', 'inspect', image]).status !== 0) {
    console.error(`${image} is not on this machine: build it (build.cmd, build.sh) or docker pull it`);
    process.exit(2);
}
const metadata = run('docker', ['image', 'inspect', image, '--format', '{{json .Config.Cmd}}']);
check('image starts npm with exec-form CMD', metadata.status === 0 && metadata.out.trim() === '["npm","start"]', metadata.out.trim());
check('memory database dependency installed', inImage("node -e 'require.resolve(\"mongodb-memory-server\")'").status === 0);
check('MongoDB runtime libcurl available', inImage('test -e /usr/lib/x86_64-linux-gnu/libcurl.so.4 || test -e /usr/lib/aarch64-linux-gnu/libcurl.so.4').status === 0);
const versionOf = pkg => inImage(`grep -m1 '"version"' /app/node_modules/${pkg}/package.json | cut -d'"' -f4`).out.trim();
const server = versionOf('bpmn-server'), web = versionOf('bpmn-web');
const tag = /:([^:/]+)$/.exec(image)?.[1];
const expected = versionArg ?? (tag && /^\d/.test(tag) ? tag : run('npm', ['view', 'bpmn-server', 'version']).out.trim());
check('bpmn-server and bpmn-web are the expected release', server === expected && web === expected,
    `expected ${expected}, bpmn-server ${server || 'none'}, bpmn-web ${web || 'none'}`);
check('no .env in the image: no keys shared by every container', inImage('test ! -e /app/.env').status === 0);
check('it runs in production mode', inImage('test "$NODE_ENV" = production').status === 0);
const open = run('docker', ['run', '--rm', '-e', 'MONGO_DB_URL=mongodb://127.0.0.1:1/x', '--entrypoint', 'npm', image, 'start'], { timeout: 120000 });
check('it refuses to start without SESSION_SECRET and API_KEY', /refusing to start/.test(open.out));

// ---- the application, through docker-compose.yml

const port = await freePort();
// not localhost: on ::1, another program may hold the port Docker publishes on IPv4
const base = `http://127.0.0.1:${port}`;
/** No answer in time is a failure, not a test that never ends. */
const timeout = () => AbortSignal.timeout(15000);
const secrets = { API_KEY: key(), ADMIN_API_KEY: key(), SESSION_SECRET: key(), ADMIN_PASSWORD: key() };
const work = fs.mkdtempSync(path.join(os.tmpdir(), 'bpmn-image-test-'));
const override = path.join(work, 'override.yml');
fs.writeFileSync(override, `services:
  server:
    env_file: !override []
    image: ${image}
    pull_policy: never
    ports: !override
      - ${port}:3000
`);
const composeFile = path.join(import.meta.dirname, '..', 'docker-compose.yml');
const mongoFile = path.join(import.meta.dirname, '..', 'docker-compose.mongo.yml');
const compose = (argv, options = {}) => run('docker', ['compose', '-p', 'bpmn-image-test', '-f', composeFile, '-f', mongoFile, '-f', override, ...argv],
    { env: { ...process.env, ...secrets, MONGO_DB_URL: 'mongodb://mongo:27017/bpmn' }, ...options });

/** Waits for the sign-in page; false when it does not come. */
async function up() {
    for (let i = 0; i < 60; i++) {
        try {
            if ((await fetch(`${base}/login`, { signal: timeout() })).status === 200)
                return true;
        } catch { /* not listening yet */ }
        await new Promise(resolve => setTimeout(resolve, 2000));
    }
    return false;
}

/** A browser's part of a session: its cookies, no redirects followed. */
function browser() {
    const cookies = new Map();
    const request = async (url, init = {}) => {
        const response = await fetch(base + url, { redirect: 'manual', signal: timeout(), ...init, headers: { ...init.headers, cookie: [...cookies].map(c => c.join('=')).join('; ') } });
        for (const cookie of response.headers.getSetCookie()) {
            const [name, ...value] = cookie.split(';')[0].split('=');
            cookies.set(name, value.join('='));
        }
        return response;
    };
    return {
        get: request,
        /** Signs in through the form, with its CSRF token. True when it lets the user in. */
        async signIn(userName, password) {
            const page = await (await request('/login')).text();
            const _csrf = /name="_csrf" value="([^"]*)"/.exec(page)?.[1] ?? '';
            const answer = await request('/login', {
                method: 'POST',
                headers: { 'content-type': 'application/x-www-form-urlencoded' },
                body: new URLSearchParams({ _csrf, userName, password }),
            });
            return answer.status === 302 && !(answer.headers.get('location') ?? '').includes('/login');
        },
    };
}

let exitCode = 1;
try {
    compose(['down', '-v', '--remove-orphans']);
    const started = compose(['up', '-d']);
    const running = await up();
    if (!check('the server starts through docker-compose.yml', running, running ? base : started.out.trim().slice(-300)))
        console.log(compose(['logs', '--tail', '40']).out);
    else {
        const admin = browser();
        check('admin signs in with ADMIN_PASSWORD', await admin.signIn('admin', secrets.ADMIN_PASSWORD));
        check('admin/admin is refused', !await browser().signIn('admin', 'admin'));

        const editor = await admin.get('/model/edit/Hello');
        const html = await editor.text();
        check('a model opens in the editor', editor.status === 200 && html.includes('modeler.js'), `status ${editor.status}`);
        check("the editor's script is served", (await admin.get('/modeler/modeler.js')).status === 200);
        check('the administration pages answer', (await admin.get('/dashboard/admin/connectors')).status === 200);
        check('the pages need a sign-in', (await browser().get('/model/edit/Hello')).status === 302);

        const refused = await fetch(`${base}/api2/model/list`, { signal: timeout() });
        check('the API refuses a call without its key', refused.status === 401 || refused.status === 403, `status ${refused.status}`);
        const models = await fetch(`${base}/api2/model/list`, { signal: timeout(), headers: { 'x-api-key': secrets.API_KEY } });
        check('the API lists the models with its key', models.status === 200 && (await models.text()).includes('Hello'), `status ${models.status}`);

        compose(['restart', 'server']);
        check('it starts again after a restart', await up());
        check('a restart adds no user', /already has users/.test(compose(['logs', 'server', '--since', '2m']).out));
        check('the password still works after a restart', await browser().signIn('admin', secrets.ADMIN_PASSWORD));

        const cli = compose(['exec', '-T', 'server', 'npm', 'run', 'cli'], { input: 'q\n', timeout: 60000 });
        check('the console runs', /Enter Command/.test(cli.out));
    }
    exitCode = results.every(Boolean) ? 0 : 1;
} finally {
    compose(['down', '-v', '--remove-orphans']);
    fs.rmSync(work, { recursive: true, force: true });
}
console.log(`\n${results.filter(Boolean).length} of ${results.length} checks passed: ${image}`);
process.exit(exitCode);
