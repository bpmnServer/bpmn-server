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
import { settingProblem, parseEnv, renderEnv } from './common/settingValue.js';

// the .env's reading and writing, kept here too for setup's callers
export { parseEnv, renderEnv };

const PACKAGE_ROOT = path.join(import.meta.dirname, '..');

export const SETUP_USAGE = `usage: bpmn-server setup [folder] [options]

  Sets up an application's .env step by step: the database (checked) and the
  site. Sign-in, the security rules and the keys are set without asking; the
  administrator is made, and its password printed, when the server first
  starts; the rest is on Dashboard > Settings. Enter keeps the value shown;
  nothing is written until you confirm. With no application in the folder, one
  is created first (as init).

  --profile <p>    production, or development (a developer's machine, a test
                   server): suggests the values; asked of an existing
                   application when not given (init makes a development one)
  --yes            ask nothing: the profile's values, new keys where missing
  --explain        each setting's own description beside the questions
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
        if (tty && !closed) { rl.setPrompt(prompt); rl.prompt(); }
        else process.stdout.write(prompt);   // piped: the question is written, its answer echoed after (*** for a secret)
        if (lines.length) return Promise.resolve(echo(lines.shift()!));
        if (closed) return Promise.reject(ended());
        return new Promise<string>((resolve, reject) => waiting.push({ resolve: line => resolve(echo(line)), reject }));
    };
    return {
        question: ask,
        /**
         * A password: the prompt is readline's, so a terminal redrawing the line keeps it — writing it ourselves and
         * then prompting with '' erased it, and the question looked like a server that had stopped. What is typed is
         * not shown (muted).
         */
        async secret(prompt) {
            muted = true;
            try { return await ask(prompt); }
            finally { muted = false; }
        },
        print: text => console.log(text),
        close: () => rl.close(),
    };
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
    /** --explain: each setting's own description, the reference text, beside the questions. */
    explain: boolean;
}

/** The value now: changed in this run, else .env's. */
const current = (c: Context, name: string) => name in c.changes ? c.changes[name] ?? undefined : c.env[name];

/** One setting: its description, the value proposed; Enter keeps it. Checked against the schema. */
/** A question is asked at most this many times; then its default is taken, so the dialog can never spin. */
const TRIES = 3;

async function ask(c: Context, name: string, proposed: string | undefined, label?: string): Promise<string> {
    const entry = c.schema.properties[name];
    if (c.auto) return proposed ?? '';
    for (let left = TRIES; ; left--) {
        const answer = (await c.io.question(`  ${label ?? name}${proposed !== undefined && proposed !== '' ? ` [${proposed}]` : ''}: `)).trim();
        const value = answer || proposed || '';
        const why = invalid(value, entry);
        if (!why) return value;
        c.io.print(`    ${name} is ${why}`);
        if (left <= 1) {
            c.io.print(`    taking ${proposed ?? 'nothing'}; change it at Dashboard > Settings`);
            return proposed ?? '';
        }
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

/** Where SQLite keeps everything when the file is not named (init's --sqlite uses the same). */
const DEFAULT_SQLITE_FILE = './data/bpmn.sqlite';

/** What each step is for, in one line. A setting's own description is reference text: --explain prints those. */
const ABOUT: Record<string, string> = {
    'The database': 'where instances, models and users are kept',
    'The site': 'the port it listens on, and the address people reach it at',
    'Sign-in and design': 'who may design models here, and sign themselves up',
    'Email': 'whether notifications are sent, and the account they go through',
    'Keys': 'the secrets its APIs and sessions use',
    'AI access': 'what an AI agent may do with a link from this server',
    'Environment and diagnostics': 'which environment this is, and whether API calls are recorded',
};

/**
 * A step's heading, with one line saying what it is for. The settings' own descriptions are several sentences each,
 * written as reference for the documentation and the Settings page: between two questions they are noise, so they
 * are printed only with --explain.
 */
function heading(c: Context, title: string, ...names: string[]) {
    c.io.print(`\n${title}`);
    if (c.auto) return;
    const about = ABOUT[title.replace(/^\d+\.\s*/, '')];
    if (about) c.io.print(`  ${about}`);
    if (!c.explain) return;
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
        // the three kinds, numbered: a URL can still be typed, but nobody has to know sqlite:<file>
        const CHOICES = [
            { pick: '1', url: `mongodb://localhost:27017/${c.name}`, title: 'MongoDB    a server you run; docker compose up -d brings one up' },
            { pick: '2', url: 'memory', title: 'In memory  a MongoDB inside this process; everything is lost when it stops' },
            { pick: '3', url: `sqlite:${DEFAULT_SQLITE_FILE}`, title: 'SQLite     one file, no database server to run (small installs)' },
        ];
        const of = (u: string) => u.startsWith('sqlite:') ? '3' : u === 'memory' ? '2' : '1';
        if (!c.auto) {
            for (const choice of CHOICES) c.io.print(`  ${choice.pick}) ${choice.title}`);
            c.io.print('     or a mongodb:// URL, or sqlite:<file>, to say exactly where');
        }
        for (let left = TRIES; ; left--) {
            const giveUp = left <= 1;
            const wanted = c.profile === 'production' && suggested === 'memory' ? `mongodb://localhost:27017/${c.name}` : suggested;
            const said = await ask(c, 'MONGO_DB_URL', of(wanted), '1, 2, 3 or an address');
            const url = CHOICES.find(choice => choice.pick === said)?.url ?? said;
            if (c.profile === 'production' && url === 'memory') {
                c.io.print('    production needs a database that keeps its data: a mongodb:// URL, or sqlite:<file>');
                if (c.auto || giveUp) return;
                continue;
            }
            if (url !== 'memory' && !/^(mongodb(\+srv)?:\/\/\S+|sqlite:\S+)$/.test(url)) {
                c.io.print('    a mongodb:// URL, memory, or sqlite:<file>, such as sqlite:./data/bpmn.sqlite');
                if (c.auto || giveUp) return;
                continue;
            }
            if (c.check) {
                const result = await checkDatabase(url, c.dir);
                c.io.print(`    ${result.ok ? 'ok' : 'FAILED'}: ${result.message}`);
                if (!result.ok && !c.auto && !giveUp && !(await confirm(c, 'Keep it anyway?', false)))
                    continue;
            }
            if (url.startsWith('sqlite:')) {
                set(c, 'DATABASE', url);
                // the file is the database: a MONGO_DB_URL beside it (init's template wrote one) only misleads
                if (current(c, 'MONGO_DB_URL')) set(c, 'MONGO_DB_URL', null);
            }
            else {
                set(c, 'MONGO_DB_URL', url);
                set(c, 'DATABASE', null);
            }
            return;
        }
    },
    async function site(c) {
        heading(c, '2. The site', 'PORT', 'SITE_URL');
        const port = await ask(c, 'PORT', current(c, 'PORT') ?? '3000', 'port');
        set(c, 'PORT', port);
        // a local address follows the port
        const now = current(c, 'SITE_URL')?.replace(/^(https?:\/\/(localhost|127\.0\.0\.1)):\d+/, `$1:${port}`);
        const url = await ask(c, 'SITE_URL', now ?? `http://localhost:${port}`, 'its address, as people reach it');
        set(c, 'SITE_URL', url || null);
    },
    async function keys(c) {
        // No heading and no question on a new application: the keys are made, and `access` says so with the rest.
        // An existing one is offered a new key for each that is set, which is a real question.
        for (const name of ['API_KEY', 'ADMIN_API_KEY', 'SESSION_SECRET']) {
            if (!current(c, name))
                set(c, name, newKey());
            else if (!c.auto && !c.isNew && await confirm(c, `${name} is set: make a new one (what uses the old one stops working)`, false))
                set(c, name, newKey());
        }
    },
    async function access(c) {
        // Sign-in and the security rules: on, and not a question. Everything else a profile used to set — who may
        // design, who may sign themselves up, whether API calls are recorded — is left out of .env entirely: the
        // defaults are right, and the Security page changes them on the running server.
        for (const name of ['REQUIRE_AUTHENTICATION', 'ENFORCE_SECURITY'])
            if (current(c, name) === undefined) set(c, name, 'true');
        if (c.auto) return;
        c.io.print('');
        c.io.print('  Sign-in is required, and the security rules enforced.');
        c.io.print('  The administrator, admin, is made the first time the server starts, and its password');
        c.io.print('  printed once where it runs. Change it on My account.');
        c.io.print('  Everything else is at Dashboard > Settings.');
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
    /** --explain: each setting's own description beside the questions. */
    explain?: boolean;
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
        // init makes a development server and does not ask: production comes after integration, and belongs to the
        // application the workflows run inside (docs/design/setup-dialog.md). setup on an existing one still asks.
        if (created) profile = 'development';
        else if (!auto) {
            io.print(`\nSetting up ${dir}\n`);
            // what each one does, before it is answered
            io.print('What is this server for?');
            io.print('  1) Production   a server people rely on: a real database, nobody signs');
            io.print('                  themselves up, and nothing records the API calls');
            io.print('  2) Development  your own machine or a test server: the database in memory,');
            io.print('                  people may sign themselves up, and API calls are recorded');
            io.print('     Both require signing in. Every answer below can differ from the profile.');
            const answer = (await io.question(`  1 or 2 [${guess === 'development' ? '2' : '1'}]: `)).trim().toLowerCase();
            if (answer) profile = answer.startsWith('2') || answer.startsWith('d') ? 'development' : 'production';
        }
    }
    const c: Context = {
        io, schema, env, changes: {}, profile, auto, check: options.check ?? true, dir,
        name: path.basename(dir).replace(/[^A-Za-z0-9_-]/g, '_') || 'bpmn', created: created && !options.keepDatabase, isNew: created,
        explain: options.explain ?? false,
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
        const secret = schema.properties[name]?.['x-secret'];
        io.print(`  ${name.padEnd(24)} ${value === null ? '(removed)' : secret ? '*** (new)' : value}`);
    }
    if (!auto && !(await confirm(c, 'Write them', true))) {
        // the caller says what that means for it: init removes the folder it was about to fill
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
    const explain = flags.has('--explain');
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
            io, schema, profile: profileFlag as Profile | undefined, auto: flags.has('--yes'), check: !flags.has('--no-check'), created, explain,
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
