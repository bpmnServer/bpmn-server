// Starts bpmn-web in-process for the HTTP and UI tests: its own MongoDB database (dropped on stop),
// its own definitions folder (a copy of test/processes), no timers, authentication on, and three users.
//
//   const web = await startWebApp();
//   const admin = await web.login('admin');
//   const res = await admin.get('/model/list');
//   await web.stop();
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import dotenv from 'dotenv';

const ROOT = fileURLToPath(new URL('../../', import.meta.url));
export const FIXTURES = path.join(ROOT, 'test', 'processes');
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
    url.pathname = '/bpmn_web_test_' + process.pid;
    return url.toString();
}

function definitionsFolder() {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'bpmn-web-defs-'));
    for (const file of fs.readdirSync(FIXTURES))
        fs.copyFileSync(path.join(FIXTURES, file), path.join(dir, file));
    return dir + path.sep;
}

export async function startWebApp({ env = {} } = {}) {
    const dbUrl = testDatabaseUrl();
    const definitionsPath = definitionsFolder();
    // the app reads its settings from the environment; dotenv never overrides these
    Object.assign(process.env, {
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
    }, env);

    const quiet = !process.env.TEST_VERBOSE;
    const restoreConsole = quiet ? silenceConsole() : () => { };

    const { WebApp } = await import(fileUrl('dist/app.js'));
    const { sampleWorkflowApplication } = await import(fileUrl('dist/sample-app/index.js'));
    const { default: User } = await import(fileUrl('dist/userAccess/models/User.js'));
    const mongoose = (await import('mongoose')).default;

    const webApp = new WebApp({ ...sampleWorkflowApplication, serverOptions: { cron: false } });
    const bpmnServer = webApp.bpmnServer;
    await bpmnServer.ready;
    await bpmnServer.dataStore.install?.();
    await bpmnServer.definitions.rebuild();

    for (const [userName, userGroups] of Object.entries(USERS))
        await User.create({ userName, email: `${userName}@test.local`, password: PASSWORD, userGroups });

    webApp.start();
    await new Promise((resolve, reject) => {
        if (webApp.server.listening) return resolve();
        webApp.server.once('listening', resolve);
        webApp.server.once('error', reject);
    });
    const base = `http://127.0.0.1:${webApp.server.address().port}`;

    const web = {
        base, webApp, bpmnServer, definitionsPath, dbUrl,
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
            try {
                await mongoose.connection.db?.dropDatabase();
            } catch { /* best effort */ }
            await mongoose.disconnect().catch(() => { });
            fs.rmSync(definitionsPath, { recursive: true, force: true });
            restoreConsole();
        },
    };
    return web;
}

function fileUrl(relative) {
    return 'file:///' + path.join(ROOT, relative).replace(/\\/g, '/');
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
