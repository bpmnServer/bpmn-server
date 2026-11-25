/**
 * bpmn-server init: creates a workflow application on bpmn-server and bpmn-web.
 *
 *   npx bpmn-server init [folder] [--minimal] [--mongo <url> | --memory] [--port <n>] [--api-only | --ui-only]
 *                        [--no-auth] [--no-install] [--yes]
 *
 * The application is the sample application (bpmnServer4's sampleApp: models, services and connectors, the app
 * delegate, settings), or with --minimal a Hello application; .env is written with new keys. bpmn-server,
 * bpmn-web and, with the APIs, bpmn-mcp are its dependencies, so `npm update` upgrades them.
 */
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import readline from 'node:readline/promises';
import { spawnSync } from 'node:child_process';
import { configure, findSchema, terminalIO, type SetupIO } from './setup.js';

const PACKAGE_ROOT = path.join(import.meta.dirname, '..');
/** bpmn-web and bpmn-mcp, as published with this bpmn-server: they are released together, with the same version. */
const bpmnWebVersion = () => `^${ownVersion()}`;

/**
 * The template: templates/app is the sample application, copied there from bpmnServer4's sampleApp when the
 * package is packed (npm run template); in the repository, sampleApp itself. --minimal: templates/minimal.
 */
/** What an application can be started from (docs/design/setup-dialog.md §3.2). */
export type StartFrom = 'sample' | 'hrdemo' | 'minimal';

/**
 * Where a template's files are, or null when this installation does not have it. The sample application is packed
 * into the package (`templates/app`); in the repository it is `apps/sampleApp` itself. The HR demo is only in the
 * repository so far, so an installed package offers it only when it was packed too.
 */
function templateFolder(from: StartFrom): string | null {
    const packed = (name: string) => path.join(PACKAGE_ROOT, 'templates', name);
    const inRepo = (name: string) => path.join(PACKAGE_ROOT, '..', '..', 'apps', name);
    if (from === 'minimal') return packed('minimal');
    const [its, repo] = from === 'hrdemo' ? [packed('hrdemo'), inRepo('hrdemo')] : [packed('app'), inRepo('sampleApp')];
    return fs.existsSync(its) ? its : fs.existsSync(repo) ? repo : null;
}
/** Not copied: what each application has of its own (init writes package.json and .env). */
// Not copied: what each application has of its own (init writes package.json and .env), and what a build makes.
const NOT_COPIED = new Set(['node_modules', 'package.json', 'package-lock.json', '.env', 'dist', '.env.bak',
    'data', 'api-trace.jsonl',
    // a run's leavings, and a nested application a template should never carry into one it makes
    'apps', 'out', 'out2', 'coverage', '.turbo']);

export const INIT_USAGE = `usage: bpmn-server init [folder] [options]

  Creates a workflow application: sample models, the services they call, an app
  delegate, settings and .env, with bpmn-server, bpmn-web and bpmn-mcp as its
  dependencies. .mcp.json registers bpmn-mcp for AI clients.

  At a terminal it asks the folder and what to serve, then the settings step
  by step, as bpmn-server setup does. The options below are for scripts.

  --minimal        a Hello application instead: one model, one service
  --hrdemo         start from the HR demo: its pages, users and API, and the
                   workflows that call them (the repository only, so far)
  --sqlite [file]  the database is a file, nothing to install (default data/bpmn.sqlite)
  --mongo <url>    the MongoDB database (default mongodb://localhost:27017/<folder>)
  --memory         a MongoDB in the application's process, to try it without a
                   database server (mongodb-memory-server; data is lost when it stops)
  --port <n>       the web server's port (default 3000)
  --api-only       the REST APIs without the web pages
  --ui-only        the web pages without the REST APIs, and so without bpmn-mcp
  --no-auth        no sign-in and no security rules (development only); the APIs
                   still need their keys
  --no-install     do not run npm install
  --yes            ask nothing; use the defaults`;

/** The in-process MongoDB of --memory. */
export const MEMORY_SERVER_VERSION = '^10.4.3';

/** Where --sqlite puts the database when no file is named. */
const DEFAULT_SQLITE = 'data/bpmn.sqlite';

interface InitOptions {
    folder: string; mongo: string; memory: boolean; port: string;
    /** DATABASE=sqlite:<file>, chosen in setup's steps. */
    sqlite?: string;
    api: boolean; ui: boolean; auth: boolean; install: boolean; minimal: boolean;
    /** What the application is started from (docs/design/setup-dialog.md §3.2). */
    from: StartFrom;
}

function parse(argv: string[]) {
    const flags = new Map<string, string | true>();
    const positional: string[] = [];
    for (let i = 0; i < argv.length; i++) {
        const arg = argv[i];
        if (arg === '--mongo' || arg === '--port')
            flags.set(arg, argv[++i] ?? '');
        else if (arg.startsWith('--'))
            flags.set(arg, true);
        else
            positional.push(arg);
    }
    return { flags, positional };
}

const randomKey = () => crypto.randomBytes(24).toString('hex');
const ownVersion = () => JSON.parse(fs.readFileSync(path.join(PACKAGE_ROOT, 'package.json'), 'utf8')).version;

/** init's own questions: when bpmn-web's settings schema is not found (setup's steps need it). */
async function ask(options: InitOptions, folderGiven: boolean, flags: Map<string, string | true>) {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
    const question = async (q: string, def: string) => (await rl.question(`${q} [${def}]: `)).trim() || def;
    /** What the answer just given means, so a choice is not made blind. */
    const means = (...lines: string[]) => console.log(lines.map(l => `      ${l}`).join('\n'));
    try {
        if (!folderGiven)
            options.folder = await question('Folder', options.folder);
        if (!flags.has('--mongo') && !flags.has('--memory') && !flags.has('--sqlite')) {
            // S a file, nothing to install; M a MongoDB server; X a MongoDB in this process, emptied when it stops
            const said = (await question('Database  S)qlite  M)ongoDB  X) in memory', 'S')).toLowerCase();
            options.memory = said.startsWith('x');
            if (!said.startsWith('m')) options.sqlite = DEFAULT_SQLITE;
            means(options.sqlite ? `the database is the file ${DEFAULT_SQLITE}; nothing to install`
                : options.memory ? 'a MongoDB inside this process; everything is lost when it stops'
                : 'a MongoDB server you run; docker-compose.yml can bring one up');
        }
        if (!options.memory && !options.sqlite && !flags.has('--mongo'))
            options.mongo = await question('MongoDB', `mongodb://localhost:27017/${dbName(options.folder)}`);
        if (!flags.has('--port'))
            options.port = await question('Port', options.port);
        if (!flags.has('--api-only') && !flags.has('--ui-only')) {
            console.log('');
            console.log('What this server serves:');
            console.log('  1) REST APIs only           your application calls it; no web pages');
            console.log('  2) REST APIs and web pages  the task lists, the model editor, administration');
            console.log('  3) Web pages only           no REST APIs, and no bpmn-mcp for AI clients');
            const parts = await question('  1, 2 or 3', '2');
            options.api = parts !== '3';
            options.ui = parts !== '1';
        }
        if (!flags.has('--no-auth')) {
            // what each one does, before it is answered
            console.log('');
            console.log('What is this server for?');
            console.log('  1) Production   a server people rely on: sign-in required, the security rules');
            console.log('                  enforced, and the administrator made with a password it prints');
            console.log('  2) Development  your own machine: no sign-in and no security rules, so anyone');
            console.log('                  reaching it administers it. Turn both on in .env before anyone can');
            const said = (await question('  1 or 2', '1')).toLowerCase();
            options.auth = !(said.startsWith('2') || said.startsWith('d'));
        }
    }
    finally {
        rl.close();
    }
}

/** Before setup's steps: what shapes the files, the folder and what the application serves. */
/**
 * Before setup's steps: the folder, and what the application is started from (docs/design/setup-dialog.md §3.2).
 * What it serves is not asked — both, unless --api-only or --ui-only says otherwise.
 */
async function askShape(io: SetupIO, options: InitOptions, folderGiven: boolean, flags: Map<string, string | true>) {
    const question = async (q: string, def: string) => (await io.question(`${q} [${def}]: `)).trim() || def;
    if (!folderGiven)
        options.folder = await question('  Folder', options.folder);
    if (flags.has('--minimal') || flags.has('--hrdemo')) return;
    // what it starts from: the HR demo only where this installation has it
    const hrdemo = templateFolder('hrdemo');
    io.print('');
    io.print('Start from');
    io.print('  1) Sample application  a few models, the services they call, no pages of its own');
    if (hrdemo) {
        io.print('  2) HR demo             an HR application with its own pages, users and API, and');
        io.print('                         the workflows that call them');
    }
    const said = await question('  ' + (hrdemo ? '1 or 2' : '1'), '1');
    options.from = hrdemo && said.startsWith('2') ? 'hrdemo' : 'sample';
}

const dbName = (folder: string) => path.basename(path.resolve(folder)).replace(/[^A-Za-z0-9_-]/g, '_') || 'bpmn';

/** Copies the template, filling in its placeholders; `gitignore` becomes `.gitignore` (npm drops .gitignore from packages). */
function copyTemplate(from: string, to: string, values: Record<string, string>) {
    fs.mkdirSync(to, { recursive: true });
    const inside = path.resolve(to) + path.sep;
    for (const entry of fs.readdirSync(from, { withFileTypes: true })) {
        if (NOT_COPIED.has(entry.name))
            continue;
        const source = path.join(from, entry.name);
        // the new application is inside the template's own tree: do not copy it into itself
        if ((path.resolve(source) + path.sep).startsWith(inside))
            continue;
        const target = path.join(to, entry.name === 'gitignore' ? '.gitignore' : entry.name);
        if (entry.isDirectory()) {
            copyTemplate(source, target, values);
            continue;
        }
        let text = fs.readFileSync(source, 'utf8');
        for (const [key, value] of Object.entries(values))
            text = text.split(key).join(value);
        fs.writeFileSync(target, text);
    }
}

function writeApplication(options: InitOptions) {
    const dir = path.resolve(options.folder);
    const name = path.basename(dir);
    const template = templateFolder(options.from);
    if (!template)
        throw new Error(options.from === 'hrdemo'
            ? 'The HR demo is not in this installation: clone the repository (apps/hrdemo), or start from the sample application.'
            : `No template for '${options.from}' in ${PACKAGE_ROOT}`);
    copyTemplate(template, dir, {
        __NAME__: name, __PORT__: options.port, __API__: String(options.api), __UI__: String(options.ui),
        __RUN__: runSteps(options).join('\n'),
        __SIGNIN__: options.auth
            ? 'The server makes its administrator the first time it starts, and prints the password once where it runs: sign in as `admin` with it. Set `ADMIN_PASSWORD` (and `ADMIN_EMAIL`) in `.env` before that first start to choose them yourself.'
            : 'Sign-in is off (`REQUIRE_AUTHENTICATION=false` in `.env`): for development only. Set it and\n`ENFORCE_SECURITY` to `true` before anyone else can reach the server.',
    });
    // no MongoDB to run: nothing for docker-compose to bring up
    if (options.memory || options.sqlite)
        fs.rmSync(path.join(dir, 'docker-compose.yml'), { force: true });
    // the sample application's README is titled sampleApp: the application's name instead
    const readme = path.join(dir, 'README.md');
    if (fs.existsSync(readme))
        fs.writeFileSync(readme, fs.readFileSync(readme, 'utf8').replace(/^# sampleApp$/m, `# ${name}`));

    // the template's scripts and dependencies (the sample application's), bpmn-server and bpmn-web as published
    const own = path.join(template, 'package.json');
    const from = fs.existsSync(own) ? JSON.parse(fs.readFileSync(own, 'utf8')) : {
        scripts: {
            start: 'tsx src/index.ts',
            dev: 'tsx watch src/index.ts',
            setup: 'bpmn-server setup && tsx src/index.ts --setup',
            cli: 'tsx src/index.ts --cli',
            mcp: 'bpmn-mcp',
            verify: 'bpmn-server verify processes',
        },
        dependencies: { 'tsx': '^4.20.0' },
        devDependencies: { '@types/node': '^22.0.0' },
    };
    // bpmn-mcp talks to the REST APIs: without them it has nothing to do
    const { mcp, ...scripts } = from.scripts;
    const { 'bpmn-mcp': _, ...dependencies } = from.dependencies;
    const pkg = {
        name: name.toLowerCase().replace(/[^a-z0-9._-]/g, '-'),
        version: '1.0.0',
        private: true,
        type: 'module',
        scripts: options.api ? { ...scripts, mcp: mcp ?? 'bpmn-mcp' } : scripts,
        dependencies: {
            ...dependencies,
            'bpmn-server': `^${ownVersion()}`,
            'bpmn-web': bpmnWebVersion(),
            ...(options.api ? { 'bpmn-mcp': bpmnWebVersion() } : {}),
            ...(options.memory ? { 'mongodb-memory-server': MEMORY_SERVER_VERSION } : {}),
        },
        devDependencies: from.devDependencies ?? {},
    };
    fs.writeFileSync(path.join(dir, 'package.json'), JSON.stringify(pkg, null, 2) + '\n');
    if (!fs.existsSync(path.join(dir, 'tsconfig.json')))
        writeTsconfig(dir);
    fs.writeFileSync(path.join(dir, '.env'), envFile(name, options));
    if (options.api)
        fs.writeFileSync(path.join(dir, '.mcp.json'), mcpConfig());
    return dir;
}

/** Registers bpmn-mcp with AI clients that read .mcp.json. They start it in this folder, where it reads .env; no keys here. */
function mcpConfig(): string {
    return JSON.stringify({ mcpServers: { bpmn: { command: 'node', args: ['node_modules/bpmn-mcp/src/index.mjs'] } } }, null, 2) + '\n';
}

function writeTsconfig(dir: string) {
    const tsconfig = {
        compilerOptions: { module: 'NodeNext', moduleResolution: 'NodeNext', target: 'ES2022', strict: false, skipLibCheck: true, noEmit: true, types: ['node'] },
        include: ['src'],
    };
    fs.writeFileSync(path.join(dir, 'tsconfig.json'), JSON.stringify(tsconfig, null, 2) + '\n');
}

/** .env: the machine's settings, new keys. */
export function envFile(name: string, options: InitOptions): string {
    return `# ${name}: machine settings and secrets. Not committed (.gitignore).
PORT=${options.port}
${options.sqlite
        ? `# sqlite: the database is this file, nothing to install; MONGO_DB_URL with a mongodb://... URL instead for a server
DATABASE=sqlite:${options.sqlite}`
        : `${options.memory ? '# memory: a MongoDB in the process, emptied when it stops; a mongodb://... URL keeps the data\n' : ''}MONGO_DB_URL=${options.memory ? 'memory' : options.mongo}`}
${options.from === 'hrdemo' ? '# the HR demo lists its accounts and their password; whoever wants one types it on the sign-in page\nHR_DEMO_SIGN_IN_AS=false\n' : ''}# both, api (the REST APIs only) or ui (the web pages only)
SERVE=${options.api && options.ui ? 'both' : options.api ? 'api' : 'ui'}

# REST API keys (x-api-key): API_KEY runs processes, ADMIN_API_KEY also changes models
API_KEY=${randomKey()}
ADMIN_API_KEY=${randomKey()}
# who /api2 calls run as
API_SERVICE_USER_NAME=integration
API_SERVICE_USER_GROUPS=SYSTEM

SESSION_SECRET=${randomKey()}
# false: no sign-in and no security rules, for development only
REQUIRE_AUTHENTICATION=${options.auth}
ENFORCE_SECURITY=${options.auth}

# notifications: EMAIL_ENABLE=true sends them through gmail
EMAIL_ENABLE=false
#SMTP_USER=
#SMTP_PASSWORD=
#EMAIL_FROM=
`;
}

/** quiet: no "Next:" steps (setup goes on to the settings). io: the answers (a test's), as if at a terminal. */
export async function init(argv: string[], { quiet = false, io: given }: { quiet?: boolean, io?: SetupIO } = {}): Promise<number> {
    const { flags, positional } = parse(argv);
    if (flags.has('--help')) {
        console.log(INIT_USAGE);
        return 0;
    }
    if (flags.has('--api-only') && flags.has('--ui-only')) {
        console.error('--api-only and --ui-only: choose one');
        return 2;
    }
    const dbFlags = ['--mongo', '--memory', '--sqlite'].filter(f => flags.has(f));
    if (dbFlags.length > 1) {
        console.error(`${dbFlags.join(' and ')}: choose one`);
        return 2;
    }
    const options: InitOptions = {
        folder: positional[0] ?? 'my-app',
        mongo: (flags.get('--mongo') as string) || '',
        memory: flags.has('--memory'),
        // --sqlite, or --sqlite=<file>: the database is a file of its own (DATABASE=sqlite:<file>)
        sqlite: flags.has('--sqlite') ? (flags.get('--sqlite') === true ? DEFAULT_SQLITE : String(flags.get('--sqlite'))) : undefined,
        port: (flags.get('--port') as string) || '3000',
        api: !flags.has('--ui-only'),
        ui: !flags.has('--api-only'),
        auth: !flags.has('--no-auth'),
        install: !flags.has('--no-install'),
        minimal: flags.has('--minimal'),
        // --minimal wins, as it always did; --hrdemo starts from the HR demo
        from: flags.has('--minimal') ? 'minimal' : flags.has('--hrdemo') ? 'hrdemo' : 'sample',
    };
    // asked: setup's steps (setup.ts), from bpmn-web's settings schema; without the schema, init's own questions
    const interactive = !!given || (!flags.has('--yes') && !!process.stdin.isTTY);
    const io = interactive && findSchema(path.resolve(options.folder)) ? given ?? terminalIO() : null;
    try {
        if (io)
            await askShape(io, options, positional.length > 0, flags);
        else if (interactive)
            await ask(options, positional.length > 0, flags);
        options.mongo ||= `mongodb://localhost:27017/${dbName(options.folder)}`;

        const dir = path.resolve(options.folder);
        if (fs.existsSync(dir) && fs.readdirSync(dir).length) {
            console.error(`${dir} is not empty: choose a new folder`);
            return 1;
        }
        writeApplication(options);
        if (io) {
            // the settings, asked and written into the .env just made. Nothing was agreed (Write them: no): the
            // folder goes again, so a cancelled dialog leaves nothing behind.
            const { code, env } = await configure(dir, {
                io, schema: findSchema(dir), created: true, keepDatabase: flags.has('--mongo') || flags.has('--memory'),
            });
            if (code !== 0) {
                // cancelled: the folder it was about to fill goes with it, so nothing is left half made
                fs.rmSync(dir, { recursive: true, force: true });
                console.log(`
Cancelled. Nothing was created: ${dir} does not exist.`);
                return code;
            }
            // what the steps chose: the next steps say it
            options.sqlite = env.DATABASE?.startsWith('sqlite:') ? env.DATABASE.slice('sqlite:'.length) : undefined;
            options.memory = !options.sqlite && env.MONGO_DB_URL === 'memory';
            options.mongo = env.MONGO_DB_URL ?? options.mongo;
            options.port = env.PORT ?? options.port;
            options.auth = env.REQUIRE_AUTHENTICATION !== 'false';
            if (options.memory || options.sqlite)
                fs.rmSync(path.join(dir, 'docker-compose.yml'), { force: true });
        }
        console.log(`created ${dir}`);
    }
    catch (error) {
        console.error(`\n${error?.message ?? error}`);
        return 1;
    }
    finally {
        io?.close();
    }
    const dir = path.resolve(options.folder);

    if (options.install) {
        console.log('npm install ...');
        // npm is npm.cmd on Windows, which only runs through cmd.exe. Passing arguments to a command with `shell: true`
        // is what Node deprecates (DEP0190), so cmd.exe is the command and the line it runs is fixed.
        const npm = process.platform === 'win32'
            ? spawnSync('cmd.exe', ['/d', '/s', '/c', 'npm install'], { cwd: dir, stdio: 'inherit' })
            : spawnSync('npm', ['install'], { cwd: dir, stdio: 'inherit' });
        if (npm.status !== 0) {
            console.error('npm install failed; run it in the folder once the problem is fixed');
            return 1;
        }
    }
    if (quiet)
        return 0;
    const cd = path.relative(process.cwd(), dir) || '.';
    console.log(`
Next:
  cd ${cd}${options.install ? '' : '\n  npm install'}
${runSteps(options).map(s => '  ' + s).join('\n')}
${options.api ? '\nAI clients: .mcp.json registers bpmn-mcp, with what the keys in .env allow. See README.md.\n' : ''}`);
    return 0;
}

/** The commands that run the new application, with what each is for. */
function runSteps(options: InitOptions): string[] {
    const open = `npm start                # http://localhost:${options.port}`;
    const signIn = options.auth ? ", then sign in as admin with the password it printed" : '';
    if (options.memory)
        return [`${open}${signIn}; a MongoDB in memory, emptied when it stops`];
    if (options.sqlite)
        return [`${open}${signIn}; the database is the file ${options.sqlite}`];
    return [
        `docker compose up -d     # a MongoDB at ${options.mongo}, if you do not have one`,
        `${open}${signIn}`,
    ];
}
