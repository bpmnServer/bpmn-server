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

const PACKAGE_ROOT = path.join(import.meta.dirname, '..');
/** bpmn-web and bpmn-mcp, as published with this bpmn-server: they are released together, with the same version. */
const bpmnWebVersion = () => `^${ownVersion()}`;

/**
 * The template: templates/app is the sample application, copied there from bpmnServer4's sampleApp when the
 * package is packed (npm run template); in the repository, sampleApp itself. --minimal: templates/minimal.
 */
function templateFolder(minimal: boolean): string {
    if (minimal)
        return path.join(PACKAGE_ROOT, 'templates', 'minimal');
    const packed = path.join(PACKAGE_ROOT, 'templates', 'app');
    return fs.existsSync(packed) ? packed : path.join(PACKAGE_ROOT, '..', '..', 'sampleApp');
}
/** Not copied: what each application has of its own (init writes package.json and .env). */
const NOT_COPIED = new Set(['node_modules', 'package.json', 'package-lock.json', '.env']);

export const INIT_USAGE = `usage: bpmn-server init [folder] [options]

  Creates a workflow application: sample models, the services they call, an app
  delegate, settings and .env, with bpmn-server, bpmn-web and bpmn-mcp as its
  dependencies. .mcp.json registers bpmn-mcp for AI clients.

  --minimal        a Hello application instead: one model, one service
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
const MEMORY_SERVER_VERSION = '^10.4.3';

interface InitOptions {
    folder: string; mongo: string; memory: boolean; port: string;
    api: boolean; ui: boolean; auth: boolean; install: boolean; minimal: boolean;
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

async function ask(options: InitOptions, folderGiven: boolean, flags: Map<string, string | true>) {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
    const question = async (q: string, def: string) => (await rl.question(`${q} (${def}): `)).trim() || def;
    try {
        if (!folderGiven)
            options.folder = await question('Folder', options.folder);
        if (!flags.has('--mongo') && !flags.has('--memory'))
            options.memory = (await question('Database: mongodb, or memory to try without one', 'mongodb')).toLowerCase().startsWith('mem');
        if (!options.memory && !flags.has('--mongo'))
            options.mongo = await question('MongoDB', `mongodb://localhost:27017/${dbName(options.folder)}`);
        if (!flags.has('--port'))
            options.port = await question('Port', options.port);
        if (!flags.has('--api-only') && !flags.has('--ui-only')) {
            const parts = (await question('Serve: both, api or ui', 'both')).toLowerCase();
            options.api = parts !== 'ui';
            options.ui = parts !== 'api';
        }
        if (!flags.has('--no-auth'))
            options.auth = !(await question('Require sign-in and security rules? yes, or no for development', 'yes')).toLowerCase().startsWith('n');
    }
    finally {
        rl.close();
    }
}

const dbName = (folder: string) => path.basename(path.resolve(folder)).replace(/[^A-Za-z0-9_-]/g, '_') || 'bpmn';

/** Copies the template, filling in its placeholders; `gitignore` becomes `.gitignore` (npm drops .gitignore from packages). */
function copyTemplate(from: string, to: string, values: Record<string, string>) {
    fs.mkdirSync(to, { recursive: true });
    for (const entry of fs.readdirSync(from, { withFileTypes: true })) {
        if (NOT_COPIED.has(entry.name))
            continue;
        const source = path.join(from, entry.name);
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
    const template = templateFolder(options.minimal);
    copyTemplate(template, dir, {
        __NAME__: name, __PORT__: options.port, __API__: String(options.api), __UI__: String(options.ui),
        __RUN__: runSteps(options).join('\n'),
        __SIGNIN__: options.auth
            ? 'Sign in as `admin`, password `admin`, and **change the password**.'
            : 'Sign-in is off (`REQUIRE_AUTHENTICATION=false` in `.env`): for development only. Set it and\n`ENFORCE_SECURITY` to `true` before anyone else can reach the server.',
    });
    if (options.memory)
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
            setup: 'tsx src/index.ts --setup',
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
function envFile(name: string, options: InitOptions): string {
    return `# ${name}: machine settings and secrets. Not committed (.gitignore).
PORT=${options.port}
${options.memory ? '# memory: a MongoDB in the process, emptied when it stops; a mongodb://... URL keeps the data\n' : ''}MONGO_DB_URL=${options.memory ? 'memory' : options.mongo}
# both, api (the REST APIs only) or ui (the web pages only)
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

export async function init(argv: string[]): Promise<number> {
    const { flags, positional } = parse(argv);
    if (flags.has('--help')) {
        console.log(INIT_USAGE);
        return 0;
    }
    if (flags.has('--api-only') && flags.has('--ui-only')) {
        console.error('--api-only and --ui-only: choose one');
        return 2;
    }
    if (flags.has('--mongo') && flags.has('--memory')) {
        console.error('--mongo and --memory: choose one');
        return 2;
    }
    const options: InitOptions = {
        folder: positional[0] ?? 'my-app',
        mongo: (flags.get('--mongo') as string) || '',
        memory: flags.has('--memory'),
        port: (flags.get('--port') as string) || '3000',
        api: !flags.has('--ui-only'),
        ui: !flags.has('--api-only'),
        auth: !flags.has('--no-auth'),
        install: !flags.has('--no-install'),
        minimal: flags.has('--minimal'),
    };
    if (!flags.has('--yes') && process.stdin.isTTY)
        await ask(options, positional.length > 0, flags);
    options.mongo ||= `mongodb://localhost:27017/${dbName(options.folder)}`;

    const dir = path.resolve(options.folder);
    if (fs.existsSync(dir) && fs.readdirSync(dir).length) {
        console.error(`${dir} is not empty: choose a new folder`);
        return 1;
    }
    writeApplication(options);
    console.log(`created ${dir}`);

    if (options.install) {
        console.log('npm install ...');
        // one command line, no arguments: Windows runs npm.cmd only through a shell
        const npm = spawnSync('npm install', { cwd: dir, stdio: 'inherit', shell: true });
        if (npm.status !== 0) {
            console.error('npm install failed; run it in the folder once the problem is fixed');
            return 1;
        }
    }
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
    const signIn = options.auth ? ', then sign in as admin (password admin)' : '';
    if (options.memory)
        return [`${open}${signIn}; a MongoDB in memory, emptied when it stops`];
    return [
        `docker compose up -d     # a MongoDB at ${options.mongo}, if you do not have one`,
        `npm run setup            # the database's indexes and the first user (admin, password admin)`,
        `${open}${signIn}`,
    ];
}
