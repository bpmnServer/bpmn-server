/**
 * bpmn-server setup: an application's settings, step by step (docs/design/setup-wizard.md §3).
 *
 *   bpmn-server setup [folder] [--profile production|development] [--yes] [--no-check] [--no-install] [--minimal]
 *
 * Each step asks for a few settings of bpmn-web's settings schema (settings/settings.schema.json): what each is,
 * its value now, and the profile's suggestion; Enter keeps the value shown. The database is checked. Nothing is
 * written until the summary is confirmed; the .env before is kept as .env.bak. With no application in the folder, one
 * is created first (as init does).
 */
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import readline from 'node:readline';
import { createRequire } from 'node:module';
import { init, MEMORY_SERVER_VERSION } from './init.js';
import { settingProblem } from './common/settingValue.js';

const PACKAGE_ROOT = path.join(import.meta.dirname, '..');

export const SETUP_USAGE = `usage: bpmn-server setup [folder] [options]

  Sets up an application's .env step by step: the database (checked), the
  administrator, the site, sign-in and design, email, the API keys, AI access
  and diagnostics. Enter keeps the value shown; nothing is written until you
  confirm. With no application in the folder, one is created first (as init).

  --profile <p>    production, or development (a developer's machine, a test
                   server): suggests the values; asked when not given
  --yes            ask nothing: the profile's values, new keys where missing
  --no-check       do not check that the database answers
  --no-install     with a new application, do not run npm install
  --minimal        with a new application, the Hello application`;

export type Profile = 'production' | 'development';

/** What a profile suggests (setup-wizard.md §3, Profiles); null: not set. */
export const PROFILES: Record<Profile, Record<string, string | null>> = {
    production: {
        APP_ENV: 'production', REQUIRE_AUTHENTICATION: 'true', ENFORCE_SECURITY: 'true', DISABLE_SIGNUP: 'true',
        DISABLE_DESIGN: 'false', API_TRACE: null,
    },
    development: {
        APP_ENV: 'test', MONGO_DB_URL: 'memory', REQUIRE_AUTHENTICATION: 'true', ENFORCE_SECURITY: 'true',
        DISABLE_SIGNUP: 'false', DISABLE_DESIGN: 'false', API_TRACE: 'api-trace.jsonl',
    },
};

/** How setup asks: a terminal's, or a test's answers. */
export interface SetupIO {
    question(prompt: string): Promise<string>;
    secret(prompt: string): Promise<string>;
    print(text: string): void;
    close(): void;
}

/** A terminal: secrets are typed without being shown. */
export function terminalIO(): SetupIO {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout, terminal: !!process.stdin.isTTY });
    let muted = false;
    const write = (rl as any)._writeToOutput?.bind(rl);
    if (write)
        (rl as any)._writeToOutput = (text: string) => { if (!muted) write(text); else if (text.includes('\n')) write('\n'); };
    // lines are queued: answers piped in arrive before their questions are asked
    const lines: string[] = [], waiting: Array<{ resolve: (line: string) => void, reject: (e: Error) => void }> = [];
    let closed = false;
    const ended = () => new Error('setup: the input ended before the questions did');
    rl.on('line', line => { const w = waiting.shift(); if (w) w.resolve(line); else lines.push(line); });
    rl.on('close', () => { closed = true; for (const w of waiting.splice(0)) w.reject(ended()); });
    const tty = !!process.stdin.isTTY;
    /** Piped answers are shown after their questions, as if typed (a secret's as ***). */
    const echo = (line: string) => { if (!tty) process.stdout.write((muted ? '***' : line) + '\n'); return line; };
    const ask = (prompt: string) => {
        if (tty && !closed) { rl.setPrompt(muted ? '' : prompt); rl.prompt(); }
        else if (!muted) process.stdout.write(prompt);
        if (lines.length) return Promise.resolve(echo(lines.shift()!));
        if (closed) return Promise.reject(ended());
        return new Promise<string>((resolve, reject) => waiting.push({ resolve: line => resolve(echo(line)), reject }));
    };
    return {
        question: ask,
        async secret(prompt) {
            process.stdout.write(prompt);
            muted = true;
            try { return await ask(''); }
            finally { muted = false; }
        },
        print: text => console.log(text),
        close: () => rl.close(),
    };
}

// ---- .env: read, and changed in place (comments and other settings kept)

/** NAME=value lines; a value's quotes taken off. */
export function parseEnv(text: string): Record<string, string> {
    const values: Record<string, string> = {};
    for (const line of text.split(/\r?\n/)) {
        const m = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=(.*)$/);
        if (!m) continue;
        let value = m[2].trim();
        if (/^(["']).*\1$/.test(value)) value = value.slice(1, -1);
        values[m[1]] = value;
    }
    return values;
}

const quote = (value: string) => /[\s#"']/.test(value) ? JSON.stringify(value) : value;

/** The .env with the changes: a setting's line replaced (or its commented #NAME= line), else added; null removes it. */
export function renderEnv(text: string, changes: Record<string, string | null>): string {
    const lines = text.split(/\r?\n/);
    if (lines.length && lines[lines.length - 1] === '') lines.pop();
    const added: string[] = [];
    for (const [name, value] of Object.entries(changes)) {
        const active = lines.findIndex(l => new RegExp(`^\\s*${name}\\s*=`).test(l));
        if (value === null) {
            if (active >= 0) lines.splice(active, 1);
            continue;
        }
        const line = `${name}=${quote(value)}`;
        const commented = lines.findIndex(l => new RegExp(`^\\s*#\\s*${name}\\s*=`).test(l));
        if (active >= 0) lines[active] = line;
        else if (commented >= 0) lines[commented] = line;
        else added.push(line);
    }
    if (added.length)
        lines.push('', '# set by bpmn-server setup', ...added);
    return lines.join('\n') + '\n';
}

// ---- the schema

/** bpmn-web's settings schema: the application's bpmn-web, else the copy packed with bpmn-server, else the repository's. */
export function findSchema(dir: string): any | null {
    const candidates: string[] = [];
    try {
        const pkg = createRequire(path.join(dir, 'package.json')).resolve('bpmn-web/package.json');
        candidates.push(path.join(path.dirname(pkg), 'settings', 'settings.schema.json'));
    }
    catch { /* not installed */ }
    candidates.push(path.join(PACKAGE_ROOT, 'templates', 'settings.schema.json'));   // packed with bpmn-server (npm run template)
    candidates.push(path.join(PACKAGE_ROOT, '..', 'bpmn-web', 'settings', 'settings.schema.json'));
    const found = candidates.find(f => fs.existsSync(f));
    return found ? JSON.parse(fs.readFileSync(found, 'utf8')) : null;
}

/** Why a value does not fit its schema entry, or null (common/settingValue.ts). */
export const invalid = settingProblem;

const newKey = () => crypto.randomBytes(24).toString('hex');
const newPassword = () => crypto.randomBytes(12).toString('base64url');
const yes = (answer: string) => /^y/i.test(answer.trim());
/** The description without its markdown, for a prompt. */
const plain = (text = '') => text.replace(/\*\*/g, '').replace(/`/g, '').replace(/\[([^\]]+)\]\([^)]*\)/g, '$1');

/** Whether the database answers: memory always; a MongoDB URL, pinged. */
export async function checkDatabase(url: string, dir = process.cwd()): Promise<{ ok: boolean, message: string }> {
    if (url === 'memory')
        return { ok: true, message: 'memory: a MongoDB in the process, emptied when it stops' };
    if (url.startsWith('sqlite:')) {
        const [major, minor] = process.versions.node.split('.').map(Number);
        if (major < 22 || (major === 22 && minor < 5))
            return { ok: false, message: `SQLite needs Node 22.5 or later (node:sqlite); this is ${process.versions.node}` };
        const file = path.resolve(dir, url.slice('sqlite:'.length).trim());
        try {
            fs.mkdirSync(path.dirname(file), { recursive: true });
            fs.accessSync(path.dirname(file), fs.constants.W_OK);
            return { ok: true, message: `${file}: its folder can be written` };
        }
        catch (error) {
            return { ok: false, message: `${file} can not be written: ${error?.message ?? error}` };
        }
    }
    let client;
    try {
        const { MongoClient } = await import('mongodb');
        client = new MongoClient(url, { serverSelectionTimeoutMS: 4000 });
        await client.connect();
        await client.db().command({ ping: 1 });
        return { ok: true, message: `${url} answers` };
    }
    catch (error) {
        return { ok: false, message: `${url} does not answer: ${error?.message ?? error}` };
    }
    finally {
        await client?.close().catch(() => { });
    }
}

// ---- the steps

interface Context {
    io: SetupIO; schema: any; env: Record<string, string>; changes: Record<string, string | null>;
    profile: Profile; auto: boolean; check: boolean; name: string;
    /** The application's folder: a SQLite file is relative to it. */
    dir: string;
    /** Created by this run: init's database is not a choice of the person's. */
    created: boolean;
    /** A new application: its keys are new already. */
    isNew: boolean;
}

/** The value now: changed in this run, else .env's. */
const current = (c: Context, name: string) => name in c.changes ? c.changes[name] ?? undefined : c.env[name];

/** One setting: its description, the value proposed; Enter keeps it. Checked against the schema. */
async function ask(c: Context, name: string, proposed: string | undefined, label?: string): Promise<string> {
    const entry = c.schema.properties[name];
    if (c.auto) return proposed ?? '';
    for (; ;) {
        const answer = (await c.io.question(`  ${label ?? name}${proposed !== undefined && proposed !== '' ? ` [${proposed}]` : ''}: `)).trim();
        const value = answer || proposed || '';
        const why = invalid(value, entry);
        if (!why) return value;
        c.io.print(`    ${name} is ${why}`);
    }
}

async function confirm(c: Context, prompt: string, proposed: boolean): Promise<boolean> {
    if (c.auto) return proposed;
    const answer = await c.io.question(`  ${prompt} [${proposed ? 'yes' : 'no'}]: `);
    return answer.trim() ? yes(answer) : proposed;
}

function set(c: Context, name: string, value: string | null) {
    const before = c.env[name];
    if ((value ?? undefined) === before) delete c.changes[name];
    else c.changes[name] = value;
}

function heading(c: Context, title: string, ...names: string[]) {
    c.io.print(`\n${title}`);
    if (!c.auto)
        for (const name of names) {
            const description = plain(c.schema.properties[name]?.description);
            if (description) c.io.print(`  (${name}: ${description})`);
        }
}

const STEPS: Array<(c: Context) => Promise<void>> = [
    async function database(c) {
        heading(c, '1. The database', 'MONGO_DB_URL', 'DATABASE');
        // DATABASE=sqlite:<file> wins over MONGO_DB_URL
        const now = current(c, 'DATABASE')?.startsWith('sqlite:') ? current(c, 'DATABASE') : current(c, 'MONGO_DB_URL');
        const suggested = (c.created ? undefined : now) || PROFILES[c.profile].MONGO_DB_URL || `mongodb://localhost:27017/${c.name}`;
        for (; ;) {
            const url = await ask(c, 'MONGO_DB_URL', c.profile === 'production' && suggested === 'memory' ? `mongodb://localhost:27017/${c.name}` : suggested,
                'a MongoDB URL, memory, or sqlite:<file> (one file, no database server)');
            if (c.profile === 'production' && url === 'memory') {
                c.io.print('    production needs a database that keeps its data: a mongodb:// URL, or sqlite:<file>');
                if (c.auto) return;
                continue;
            }
            if (url !== 'memory' && !/^(mongodb(\+srv)?:\/\/\S+|sqlite:\S+)$/.test(url)) {
                c.io.print('    a mongodb:// URL, memory, or sqlite:<file>, such as sqlite:./data/bpmn.sqlite');
                if (c.auto) return;
                continue;
            }
            if (c.check) {
                const result = await checkDatabase(url, c.dir);
                c.io.print(`    ${result.ok ? 'ok' : 'FAILED'}: ${result.message}`);
                if (!result.ok && !c.auto && !(await confirm(c, 'Keep it anyway?', false)))
                    continue;
            }
            if (url.startsWith('sqlite:'))
                set(c, 'DATABASE', url);
            else {
                set(c, 'MONGO_DB_URL', url);
                set(c, 'DATABASE', null);
            }
            return;
        }
    },
    async function administrator(c) {
        heading(c, '2. The first administrator', 'ADMIN_PASSWORD');
        const has = !!current(c, 'ADMIN_PASSWORD');
        const how = c.auto ? (has ? 'keep' : 'generate')
            : (await c.io.question(`  ${has ? 'keep, ' : ''}generate, enter, or none (the first page asks, with a setup token) [${has ? 'keep' : 'generate'}]: `)).trim().toLowerCase() || (has ? 'keep' : 'generate');
        if (how.startsWith('g')) {
            const password = newPassword();
            set(c, 'ADMIN_PASSWORD', password);
            c.io.print(`    the user admin, password ${password} (on a server with no users yet)`);
        }
        else if (how.startsWith('e'))
            set(c, 'ADMIN_PASSWORD', (await c.io.secret('  password: ')).trim() || null);
        else if (how.startsWith('n'))
            set(c, 'ADMIN_PASSWORD', null);
    },
    async function site(c) {
        heading(c, '3. The site', 'PORT', 'SITE_URL');
        const port = await ask(c, 'PORT', current(c, 'PORT') ?? '3000', 'port');
        set(c, 'PORT', port);
        // a local address follows the port
        const now = current(c, 'SITE_URL')?.replace(/^(https?:\/\/(localhost|127\.0\.0\.1)):\d+/, `$1:${port}`);
        const url = await ask(c, 'SITE_URL', now ?? `http://localhost:${port}`, 'its address, as people reach it');
        set(c, 'SITE_URL', url || null);
    },
    async function access(c) {
        heading(c, '4. Sign-in and design');
        const profile = PROFILES[c.profile];
        const auth = await confirm(c, 'Sign-in and security rules (no: for development only)',
            (current(c, 'REQUIRE_AUTHENTICATION') ?? profile.REQUIRE_AUTHENTICATION) !== 'false');
        set(c, 'REQUIRE_AUTHENTICATION', String(auth));
        set(c, 'ENFORCE_SECURITY', String(auth));
        const design = await confirm(c, 'Design models on this server (the editor and test runs)',
            (current(c, 'DISABLE_DESIGN') ?? profile.DISABLE_DESIGN) !== 'true');
        set(c, 'DISABLE_DESIGN', String(!design));
        const signup = await confirm(c, 'Let people sign themselves up',
            (current(c, 'DISABLE_SIGNUP') ?? profile.DISABLE_SIGNUP) !== 'true');
        set(c, 'DISABLE_SIGNUP', String(!signup));
    },
    async function email(c) {
        heading(c, '5. Email', 'EMAIL_ENABLE');
        const on = await confirm(c, 'Send notifications by email', current(c, 'EMAIL_ENABLE') === 'true');
        set(c, 'EMAIL_ENABLE', String(on));
        if (!on) return;
        const user = await ask(c, 'SMTP_USER', current(c, 'SMTP_USER'), 'the account they are sent through');
        set(c, 'SMTP_USER', user || null);
        const has = !!current(c, 'SMTP_PASSWORD');
        const password = c.auto ? '' : (await c.io.secret(`  its password${has ? ' [Enter keeps it]' : ''}: `)).trim();
        if (password) set(c, 'SMTP_PASSWORD', password);
        set(c, 'EMAIL_FROM', (await ask(c, 'EMAIL_FROM', current(c, 'EMAIL_FROM') ?? user, 'from')) || null);
        c.io.print('    (a test message comes with a later version of setup)');
    },
    async function keys(c) {
        heading(c, '6. Keys', 'API_KEY', 'ADMIN_API_KEY', 'SESSION_SECRET');
        for (const name of ['API_KEY', 'ADMIN_API_KEY', 'SESSION_SECRET']) {
            if (!current(c, name)) {
                set(c, name, newKey());
                c.io.print(`    ${name}: generated`);
            }
            else if (!c.auto && !c.isNew && await confirm(c, `${name} is set: make a new one (what uses the old one stops working)`, false))
                set(c, name, newKey());
        }
    },
    async function ai(c) {
        heading(c, '7. AI access', 'AI_ACCESS');
        for (; ;) {
            const value = await ask(c, 'AI_ACCESS', current(c, 'AI_ACCESS') ?? 'all', 'all, off, or some of work,design,administer');
            const levels = value.split(',').map(s => s.trim()).filter(Boolean);
            if (value === 'all' || value === 'off' || levels.every(l => ['work', 'design', 'administer'].includes(l))) {
                set(c, 'AI_ACCESS', value === 'all' ? null : value === 'off' ? 'off' : levels.join(','));
                return;
            }
            c.io.print('    all, off, or some of work, design, administer');
            if (c.auto) return;
        }
    },
    async function diagnostics(c) {
        heading(c, '8. Environment and diagnostics', 'APP_ENV', 'API_TRACE');
        const profile = PROFILES[c.profile];
        set(c, 'APP_ENV', await ask(c, 'APP_ENV', profile.APP_ENV ?? current(c, 'APP_ENV'), 'environment: production, or test (the test services)'));
        const trace = await confirm(c, 'Record every API call to a file (API_TRACE)', !!(current(c, 'API_TRACE') ?? profile.API_TRACE));
        set(c, 'API_TRACE', trace ? (current(c, 'API_TRACE') || 'api-trace.jsonl') : null);
    },
];

// ---- the command

function parse(argv: string[]) {
    const flags = new Map<string, string | true>();
    const positional: string[] = [];
    for (let i = 0; i < argv.length; i++) {
        if (argv[i] === '--profile') flags.set('--profile', argv[++i] ?? '');
        else if (argv[i].startsWith('--')) flags.set(argv[i], true);
        else positional.push(argv[i]);
    }
    return { flags, positional };
}

export interface ConfigureOptions {
    io: SetupIO; schema: any; profile?: Profile; auto?: boolean; check?: boolean;
    /** Just created: its .env is init's defaults, not the person's choices. */
    created?: boolean;
    /** Created with a database given (init --mongo, --memory): it is offered, not the profile's. */
    keepDatabase?: boolean;
}

/**
 * The steps on an application's .env: the profile, each step, the summary; written once confirmed (.env.bak kept).
 * Answers 0 and the settings as written, or 1 when nothing was written.
 */
export async function configure(dir: string, options: ConfigureOptions): Promise<{ code: number, env: Record<string, string> }> {
    const { io, schema, auto = false, created = false } = options;
    const envFile = path.join(dir, '.env');
    const before = fs.existsSync(envFile) ? fs.readFileSync(envFile, 'utf8') : '';
    const env = parseEnv(before);
    let profile = options.profile;
    if (!profile) {
        const guess: Profile = env.APP_ENV === 'test' || env.MONGO_DB_URL === 'memory' ? 'development' : 'production';
        profile = guess;
        if (!auto) {
            io.print(`\nSetting up ${dir}\n\nProfile: production (a server people rely on), or development (a developer's machine, a test server)`);
            const answer = (await io.question(`  profile [${guess}]: `)).trim().toLowerCase();
            if (answer) profile = answer.startsWith('d') ? 'development' : 'production';
        }
    }
    const c: Context = {
        io, schema, env, changes: {}, profile, auto, check: options.check ?? true, dir,
        name: path.basename(dir).replace(/[^A-Za-z0-9_-]/g, '_') || 'bpmn', created: created && !options.keepDatabase, isNew: created,
    };
    for (const step of STEPS)
        await step(c);

    const names = Object.keys(c.changes);
    if (!names.length) {
        io.print('\nNothing changed.');
        return { code: 0, env };
    }
    io.print('\nChanges to .env:');
    for (const name of names) {
        const value = c.changes[name];
        const secret = schema.properties[name]?.['x-secret'] && name !== 'ADMIN_PASSWORD';
        io.print(`  ${name.padEnd(24)} ${value === null ? '(removed)' : secret ? '*** (new)' : value}`);
    }
    if (!auto && !(await confirm(c, 'Write them', true))) {
        io.print('Nothing written.');
        return { code: 1, env };
    }
    const backup = !!before && !created;
    if (backup)
        fs.writeFileSync(envFile + '.bak', before);
    const text = renderEnv(before, c.changes);
    fs.writeFileSync(envFile, text);
    if (c.changes.MONGO_DB_URL === 'memory' && !parseEnv(text).DATABASE?.startsWith('sqlite:')) addMemoryServer(dir);
    io.print(`\nWrote ${envFile}${backup ? ' (the one before: .env.bak)' : ''}.`);
    return { code: 0, env: parseEnv(text) };
}

export async function setup(argv: string[], io?: SetupIO): Promise<number> {
    const { flags, positional } = parse(argv);
    if (flags.has('--help')) {
        console.log(SETUP_USAGE);
        return 0;
    }
    const profileFlag = flags.get('--profile');
    if (profileFlag !== undefined && profileFlag !== 'production' && profileFlag !== 'development') {
        console.error('--profile: production or development');
        return 2;
    }
    const dir = path.resolve(positional[0] ?? '.');
    const created = !fs.existsSync(path.join(dir, 'package.json'));
    if (created) {
        if (!positional[0]) {
            console.error(`No application in ${dir}: bpmn-server setup <folder> creates one`);
            return 1;
        }
        const made = await init([dir, '--yes', ...['--no-install', '--minimal'].filter(f => flags.has(f))], { quiet: true });
        if (made !== 0) return made;
    }
    const schema = findSchema(dir);
    if (!schema) {
        console.error('The settings schema was not found: setup needs bpmn-web 3.7 or later (npm install bpmn-web@latest)');
        return 1;
    }
    if (!io && !flags.has('--yes') && !process.stdin.isTTY) {
        // no one to ask (install.sh, Docker, CI run npm run setup): nothing changed, the database is prepared next
        console.log("setup: no terminal, nothing asked (--yes for the profile's values)");
        return 0;
    }
    io ??= terminalIO();
    try {
        const { code, env } = await configure(dir, {
            io, schema, profile: profileFlag as Profile | undefined, auto: flags.has('--yes'), check: !flags.has('--no-check'), created,
        });
        if (code !== 0) return code;
        const install = !fs.existsSync(path.join(dir, 'node_modules')) || (env.MONGO_DB_URL === 'memory' && !fs.existsSync(path.join(dir, 'node_modules', 'mongodb-memory-server')));
        io.print(`\nNext, in ${dir}:${install ? '\n  npm install' : ''}\n  npm start               # http://localhost:${env.PORT ?? 3000}`);
        return 0;
    }
    catch (error) {
        console.error(`\n${error?.message ?? error}; nothing written`);
        return 1;
    }
    finally {
        io.close();
    }
}

/** A memory database needs mongodb-memory-server among the application's dependencies: added if missing. */
export function addMemoryServer(dir: string): boolean {
    const file = path.join(dir, 'package.json');
    const pkg = JSON.parse(fs.readFileSync(file, 'utf8'));
    if (pkg.dependencies?.['mongodb-memory-server']) return false;
    pkg.dependencies = { ...pkg.dependencies, 'mongodb-memory-server': MEMORY_SERVER_VERSION };
    fs.writeFileSync(file, JSON.stringify(pkg, null, 2) + '\n');
    return true;
}
