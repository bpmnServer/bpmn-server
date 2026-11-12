// Starts testSampleApp (its settings, delegate and connectors on bpmn-web) in-process for the HTTP and UI
// tests: its own MongoDB database (dropped on stop), its own definitions folder (a copy of FIXTURE_MODELS),
// no timers, authentication on, and three users.
//
//   const web = await startWebApp();
//   const admin = await web.login('admin');
//   const res = await admin.get('/model/list');
//   await web.stop();
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawn } from 'node:child_process';
import { randomUUID } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import dotenv from 'dotenv';

const ROOT = fileURLToPath(new URL('../../', import.meta.url));
/** bpmn-web's package: the tests reach its built modules (dist/) as well as its public API. */
const WEB = path.join(ROOT, '..', '..', 'packages', 'bpmn-web');
export const FIXTURES = path.join(ROOT, 'processes');
/** The models a test server starts with: these few, whatever else the folder holds. */
const FIXTURE_MODELS = ['leave-request.bpmn', 'simple.bpmn', 'test-exclusive-gateway.bpmn'];
export const PASSWORD = 'Test-password-1';
export const API_KEY = 'test-api-key';
export const ADMIN_API_KEY = 'test-admin-api-key';

/** The test users: userName -> groups. */
export const USERS = {
    admin: ['ADMIN'],
    designer: ['DESIGNER'],
    staff: ['staff'],
    manager: ['manager', 'staff'],
};

/** The MongoDB server of .env (or localhost), with a database of this test process's own. */
function testDatabaseUrl() {
    let base = process.env.TEST_MONGO_URL;
    if (!base) {
        const envFile = path.join(ROOT, '.env');
        const parsed = fs.existsSync(envFile) ? dotenv.parse(fs.readFileSync(envFile)) : {};
        base = parsed.MONGO_DB_URL || 'mongodb://localhost:27017/bpmn';
    }
    const url = new URL(base);
    // not by the process's id alone: an id comes round again, and a database left behind then has this one's users
    url.pathname = `/bpmn_web_test_${process.pid}_${randomUUID().slice(0, 8)}`;
    return url.toString();
}

/** A catalog folder for a test: a good entry and a tampered one, which the real catalog can not have. */
export function testCatalog() {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'bpmn-catalog-'));
    fs.mkdirSync(path.join(dir, 'models'));
    fs.copyFileSync(path.join(ROOT, 'test', 'support', 'test-catalog.json'), path.join(dir, 'catalog.json'));
    fs.copyFileSync(path.join(FIXTURES, 'hello.bpmn'), path.join(dir, 'models', 'hello.bpmn'));
    return dir + path.sep;
}

function definitionsFolder() {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'bpmn-web-defs-'));
    for (const file of FIXTURE_MODELS)
        fs.copyFileSync(path.join(FIXTURES, file), path.join(dir, file));
    return dir + path.sep;
}

/** The engine in a process of its own, on the same database and models; what ENGINE_AT then points to. */
function startEngineProcess(port = '0') {
    return new Promise((resolve, reject) => {
        const child = spawn(process.execPath, ['--import', 'tsx', 'engine.ts'], { cwd: ROOT, env: { ...process.env, ENGINE_PORT: port }, stdio: ['ignore', 'pipe', 'inherit'] });
        let output = '';
        child.stdout.on('data', chunk => {
            output += chunk;
            const ready = /ENGINE_READY ([\d.]+):(\d+)/.exec(output);
            if (ready) resolve({ child, at: `http://${ready[1]}:${ready[2]}` });
        });
        child.once('exit', code => reject(new Error(`the engine stopped, code ${code}: ${output.slice(-500)}`)));
    });
}

export async function startWebApp({ env = {}, remoteEngine = !!process.env.TEST_REMOTE_ENGINE && !env.ENGINE_AT, users = true, userManager, hostSettings } = {}) {
    const dbUrl = testDatabaseUrl();
    // TEST_DATABASE=sqlite: the same tests on a SQLite file of this app's own (DATABASE=sqlite:<file>)
    const sqliteDir = process.env.TEST_DATABASE === 'sqlite' ? fs.mkdtempSync(path.join(os.tmpdir(), 'bpmn-web-sqlite-')) : null;
    const definitionsPath = definitionsFolder();
    // the app reads its settings from the environment; dotenv never overrides these
    Object.assign(process.env, {
        // no test reaches a real mail server, whatever the folder's .env says
        SMTP_USER: '', SMTP_PASSWORD: '',
        NODE_ENV: 'production',
        PORT: '0',
        MONGO_DB_URL: dbUrl,
        DEFINITIONS_PATH: definitionsPath,
        SESSION_SECRET: 'test-session-secret',
        API_KEY,
        ADMIN_API_KEY,
        API_SERVICE_USER_NAME: 'api-service',
        API_SERVICE_USER_GROUPS: 'staff,manager',
        REQUIRE_AUTHENTICATION: 'true',
        ENFORCE_SECURITY: 'true',
        AUTH_RATE_LIMIT: '1000',
        SAVE_LOGS: 'true',
        DATABASE: sqliteDir ? `sqlite:${path.join(sqliteDir, 'bpmn.sqlite')}` : '',
    }, env);

    let engineProcess;
    if (remoteEngine) {
        process.env.ENGINE_KEY = `test-${randomUUID()}`;
        delete process.env.ENGINE_AT;
        engineProcess = await startEngineProcess();
        process.env.ENGINE_AT = engineProcess.at;
    }

    const quiet = !process.env.TEST_VERBOSE;
    const restoreConsole = quiet ? silenceConsole() : () => { };

    const { WebApp } = await import(fileUrl(WEB, 'dist/app.js'));
    const { webConfiguration } = await import(fileUrl(WEB, 'dist/start.js'));
    const { default: User } = await import(fileUrl(WEB, 'dist/userAccess/models/User.js'));
    const { config, connectorsPath } = await import(fileUrl(ROOT, 'settings/config.ts'));
    const { AppDelegate } = await import(fileUrl(ROOT, 'delegates/appDelegate.ts'));
    const mongoose = (await import('mongoose')).default;

    // what a test needs from inside the engine, as an application's delegate has it
    let embedded;
    class TestDelegate extends AppDelegate {
        constructor(server) { super(server); embedded = server; }
    }
    const webApp = new WebApp({
        configuration: webConfiguration(config(), TestDelegate),
        elementTemplatesPath: connectorsPath,
        serverOptions: { cron: false },
        // an application's own sign-in (IUserManager): bpmn-web then keeps no users of its own
        userManager,
        // the API's settings of this server (keys, service account), else .env's
        hostSettings,
    });
    const bpmnServer = webApp.bpmnServer;
    await bpmnServer.ready;
    // the engine sets up its own stores and its index of the models (docs/design/engine-isolation.md)
    if (bpmnServer.engine.running) await bpmnServer.engine.install({ rebuild: true });

    // users: false, a server's first start: no users at all
    for (const [userName, userGroups] of users && !userManager ? Object.entries(USERS) : [])
        await User.create({ userName, email: `${userName}@test.local`, password: PASSWORD, userGroups });

    webApp.start();
    await new Promise((resolve, reject) => {
        if (webApp.server.listening) return resolve();
        webApp.server.once('listening', resolve);
        webApp.server.once('error', reject);
    });
    const base = `http://127.0.0.1:${webApp.server.address().port}`;

    const web = {
        base, webApp, bpmnServer, definitionsPath, dbUrl, embedded,
        engineAt: engineProcess?.at, enginePid: engineProcess?.child.pid,
        /** Killed, not asked to stop: what a crash leaves behind. */
        async killEngine() {
            engineProcess.child.removeAllListeners('exit');
            await new Promise(resolve => { engineProcess.child.once('exit', resolve); engineProcess.child.kill('SIGKILL'); });
        },
        /** Back on its port, where ENGINE_AT says it is. */
        async startEngineAgain() {
            engineProcess = await startEngineProcess(new URL(engineProcess.at).port);
            web.enginePid = engineProcess.child.pid;
        },
        async stopEngine() {
            // killed: on Windows it never gets an exit code
            if (!engineProcess || engineProcess.child.killed || engineProcess.child.exitCode !== null) return;
            engineProcess.child.removeAllListeners('exit');
            await new Promise(resolve => { engineProcess.child.once('exit', resolve); engineProcess.child.kill(); });
        },
        client: () => new WebClient(base),
        /** A client logged in as one of USERS. */
        async login(userName) {
            const client = new WebClient(base);
            await client.get('/login');
            const res = await client.post('/login', { userName, password: PASSWORD });
            if (res.status !== 302 || res.location.endsWith('/login'))
                throw new Error(`login as ${userName} failed: ${why(res)}`);
            client.userName = userName;
            return client;
        },
        /** Calls the API with a key (API_KEY unless given). */
        api: (method, url, body, key = API_KEY) => new WebClient(base).request(method, url, { json: body, headers: { 'x-api-key': key } }),
        async stop() {
            // close fetch's keep-alive connections first: exiting while they close crashes Node on
            // Windows ("Assertion failed: !(handle->flags & UV_HANDLE_CLOSING)")
            await globalThis[Symbol.for('undici.globalDispatcher.1')]?.close?.().catch(() => { });
            webApp.server.closeAllConnections?.();
            await new Promise(resolve => webApp.server.close(() => resolve()));
            await bpmnServer.shutdown?.();
            await web.stopEngine();
            try {
                await mongoose.connection.db?.dropDatabase();
            } catch { /* best effort */ }
            await mongoose.disconnect().catch(() => { });
            fs.rmSync(definitionsPath, { recursive: true, force: true });
            if (sqliteDir) {
                // what the store's last writes started ends first: exiting on it crashes Node on Windows (UV_HANDLE_CLOSING)
                await new Promise(resolve => setTimeout(resolve, 200));
                fs.rmSync(sqliteDir, { recursive: true, force: true });
            }
            restoreConsole();
        },
    };
    return web;
}

function fileUrl(base, relative) {
    return 'file:///' + path.join(base, relative).replace(/\\/g, '/');
}

/** The app logs every request and engine step; keep the test output readable. */
function silenceConsole() {
    const saved = {};
    for (const name of ['log', 'info', 'debug', 'warn', 'error']) {
        saved[name] = console[name];
        console[name] = () => { };
    }
    return () => Object.assign(console, saved);
}

/** A short description of a response for assertion messages: the error page's message when it is one. */
export function why(res) {
    const message = /<th>message<\/th><td>([^<]*)<\/td>/.exec(res.text || '');
    const what = message ? message[1] : (res.location ? '-> ' + res.location : String(res.text || '').slice(0, 160));
    return `${res.status} ${what}`;
}

/** A cookie-keeping HTTP client that does not follow redirects. */
export class WebClient {
    constructor(base) {
        this.base = base;
        this.cookies = new Map();
    }
    get cookieHeader() {
        return [...this.cookies].map(([k, v]) => `${k}=${v}`).join('; ');
    }
    async request(method, url, { form, json, multipart, headers = {} } = {}) {
        const init = { method, redirect: 'manual', headers: { ...headers } };
        if (this.cookies.size) init.headers.cookie = this.cookieHeader;
        const csrf = this.cookies.get('_csrf');
        // scripts send the CSRF token as a header (public/javascripts/csrf.js); forms also as _csrf
        if (csrf && !/^(GET|HEAD)$/i.test(method) && !('x-csrf-token' in init.headers) && this.sendCsrf !== false)
            init.headers['x-csrf-token'] = decodeURIComponent(csrf);
        if (form) {
            const params = new URLSearchParams();
            for (const [k, v] of Object.entries(form)) params.append(k, String(v));
            if (csrf && !('_csrf' in form) && this.sendCsrf !== false) params.append('_csrf', decodeURIComponent(csrf));
            init.body = params;
        }
        else if (multipart) {
            const data = new FormData();
            if (csrf && this.sendCsrf !== false) data.append('_csrf', decodeURIComponent(csrf));
            for (const [k, v] of Object.entries(multipart))
                if (v && v.content !== undefined) data.append(k, new Blob([v.content], { type: v.type || 'application/octet-stream' }), v.filename);
                else data.append(k, String(v));
            init.body = data;
        }
        else if (json !== undefined) {
            init.headers['content-type'] = 'application/json';
            init.body = JSON.stringify(json);
        }
        init.signal = AbortSignal.timeout(Number(process.env.TEST_REQUEST_TIMEOUT) || 15000);
        let response;
        try {
            response = await fetch(this.base + url, init);
        }
        catch (error) {
            // a page that never answers is a failure to report, not a hung test run
            return { status: 0, location: '', headers: new Headers(), text: `no response: ${error.name}`, body: null };
        }
        for (const cookie of response.headers.getSetCookie?.() || []) {
            const [pair] = cookie.split(';');
            const i = pair.indexOf('=');
            this.cookies.set(pair.slice(0, i).trim(), pair.slice(i + 1).trim());
        }
        const text = await response.text();
        let body = text;
        if ((response.headers.get('content-type') || '').includes('json')) {
            try { body = JSON.parse(text); } catch { /* keep text */ }
        }
        return { status: response.status, location: response.headers.get('location') || '', headers: response.headers, text, body };
    }
    get(url, options) { return this.request('GET', url, options); }
    post(url, form, options = {}) { return this.request('POST', url, { ...options, form }); }
    /** GET, following redirects within the app. */
    async follow(url, max = 5) {
        let res = await this.get(url);
        while (res.status >= 300 && res.status < 400 && res.location && max-- > 0)
            res = await this.get(res.location.replace(this.base, ''));
        return res;
    }
}
