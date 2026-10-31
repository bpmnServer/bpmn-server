/**
 * bpmn-server init: creates a workflow application on bpmn-server and bpmn-web.
 *
 *   npx bpmn-server init [folder] [--mongo <url>] [--port <n>] [--api-only | --ui-only] [--no-install] [--yes]
 *
 * The application owns its models (processes/), its delegate (src/appDelegate.ts), its settings
 * (src/config.ts) and .env; bpmn-server and bpmn-web are its dependencies, so `npm update` upgrades them.
 */
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import readline from 'node:readline/promises';
import { spawnSync } from 'node:child_process';

const PACKAGE_ROOT = path.join(import.meta.dirname, '..');
const TEMPLATE = path.join(PACKAGE_ROOT, 'templates', 'app');
/** The first bpmn-web with start(). */
const BPMN_WEB_VERSION = '^3.1.0';

export const INIT_USAGE = `usage: bpmn-server init [folder] [options]

  Creates a workflow application: models, an app delegate, settings and .env,
  with bpmn-server and bpmn-web as its dependencies.

  --mongo <url>    the MongoDB database (default mongodb://localhost:27017/<folder>)
  --port <n>       the web server's port (default 3000)
  --api-only       the REST APIs without the web pages
  --ui-only        the web pages without the REST APIs
  --no-install     do not run npm install
  --yes            ask nothing; use the defaults`;

interface InitOptions { folder: string; mongo: string; port: string; api: boolean; ui: boolean; install: boolean }

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
        if (!flags.has('--mongo'))
            options.mongo = await question('MongoDB', `mongodb://localhost:27017/${dbName(options.folder)}`);
        if (!flags.has('--port'))
            options.port = await question('Port', options.port);
        if (!flags.has('--api-only') && !flags.has('--ui-only')) {
            const parts = (await question('Serve: both, api or ui', 'both')).toLowerCase();
            options.api = parts !== 'ui';
            options.ui = parts !== 'api';
        }
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
    copyTemplate(TEMPLATE, dir, { __NAME__: name, __PORT__: options.port, __API__: String(options.api), __UI__: String(options.ui) });

    const pkg = {
        name: name.toLowerCase().replace(/[^a-z0-9._-]/g, '-'),
        version: '1.0.0',
        private: true,
        type: 'module',
        scripts: {
            start: 'tsx src/index.ts',
            dev: 'tsx watch src/index.ts',
            setup: 'tsx src/index.ts --setup',
            verify: 'bpmn-server verify processes',
        },
        dependencies: {
            'bpmn-server': `^${ownVersion()}`,
            'bpmn-web': BPMN_WEB_VERSION,
            'tsx': '^4.20.0',
        },
        devDependencies: {
            '@types/node': '^22.0.0',
        },
    };
    fs.writeFileSync(path.join(dir, 'package.json'), JSON.stringify(pkg, null, 2) + '\n');

    const tsconfig = {
        compilerOptions: { module: 'NodeNext', moduleResolution: 'NodeNext', target: 'ES2022', strict: false, skipLibCheck: true, noEmit: true, types: ['node'] },
        include: ['src'],
    };
    fs.writeFileSync(path.join(dir, 'tsconfig.json'), JSON.stringify(tsconfig, null, 2) + '\n');

    const env = `# ${name}: machine settings and secrets. Not committed (.gitignore).
PORT=${options.port}
MONGO_DB_URL=${options.mongo}

# REST API keys (x-api-key): API_KEY runs processes, ADMIN_API_KEY also changes models
API_KEY=${randomKey()}
ADMIN_API_KEY=${randomKey()}
# who /api2 calls run as
API_SERVICE_USER_NAME=integration
API_SERVICE_USER_GROUPS=SYSTEM

SESSION_SECRET=${randomKey()}
REQUIRE_AUTHENTICATION=true
ENFORCE_SECURITY=true

# notifications: EMAIL_ENABLE=true sends them through gmail
EMAIL_ENABLE=false
#SMTP_USER=
#SMTP_PASSWORD=
#EMAIL_FROM=
`;
    fs.writeFileSync(path.join(dir, '.env'), env);
    return dir;
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
    const options: InitOptions = {
        folder: positional[0] ?? 'my-app',
        mongo: (flags.get('--mongo') as string) || '',
        port: (flags.get('--port') as string) || '3000',
        api: !flags.has('--ui-only'),
        ui: !flags.has('--api-only'),
        install: !flags.has('--no-install'),
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
  docker compose up -d     # a MongoDB at ${options.mongo}, if you do not have one
  npm run setup            # the database's indexes and the first user (admin, password admin)
  npm start                # http://localhost:${options.port}
`);
    return 0;
}
