/**
 * The Settings page (/dashboard/settings): where an administrator and a designer set up the server
 * (docs/docs/integration-settings.md). One area for each part of the server that is no add-on's (the application's
 * code, its APIs: connectors, the API the application calls, models and scripts, AI agents), and one for each add-on,
 * with the settings its manifest declares (addon.json `settings`), turned on or off there. Each area shows what is in
 * place and its settings, from the settings schema (settings/settings.schema.json).
 *
 * Who changes what: an administrator every setting; a designer the design-side ones (`designer` below). A change is
 * written to the server's .env (the one before kept as .env.bak) and applies when the server restarts. A secret's
 * value is never shown: it is set, replaced, generated or removed. A setting given by the environment (not .env), or
 * an application's own (`hostSettings`), is shown and not changed here.
 */
import FS from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { parseEnv, renderEnv, settingProblem } from 'bpmn-server';
import { settingsSchema } from './api/settings.js';

export type Editor = 'admin' | 'designer';

export interface IntegrationPoint {
    id: string;
    title: string;
    /** What it is, in a sentence. */
    about: string;
    /** Its settings, each changed by `admin` (the default) or by a designer too; `main`, shown first (the rest under More settings). */
    settings: { name: string; label: string; editor?: Editor; main?: boolean }[];
    /** An add-on's area: its name (its manifest's); none, one of the server's */
    addOn?: string;
    /** An add-on's doc page: its full address */
    docs?: string;
    /** An add-on's description in a few words: its card's */
    brief?: string;
    /** Its settings are its options, switched on or off on its card (Model Options) */
    options?: boolean;
}

/** BPMN Server's docs site: an add-on's doc page is a path of it, unless its manifest gives a full address. */
export const DOCS_SITE = 'https://bpmnserver.github.io/bpmn-server/';
const docsAddress = (docs?: string) => !docs ? undefined : /^https?:\/\//.test(docs) ? docs : DOCS_SITE + docs.replace(/^\//, '');

/** An add-on's area: its manifest's title, description and settings. */
export function addOnArea(manifest: { name: string; title: string; description?: string; brief?: string; docs?: string; options?: boolean; settings?: IntegrationPoint['settings'] }): IntegrationPoint {
    return { id: manifest.name, title: manifest.title, about: manifest.description ?? '', settings: manifest.settings ?? [], addOn: manifest.name,
        ...(manifest.brief ? { brief: manifest.brief } : {}), ...(manifest.options ? { options: true } : {}), ...(manifest.docs ? { docs: docsAddress(manifest.docs) } : {}) };
}

/** The server's areas, no add-on's, in the page's order (each add-on's follow, from its manifest). */
export const INTEGRATION_POINTS: IntegrationPoint[] = [
    {
        id: 'contract', title: "The application's contract",
        about: 'What the application publishes in app-contract.json (its APIs, pages, roles and functions), and how it is connected to this server.',
        settings: [],
    },
    {
        id: 'roles', title: 'Roles',
        about: 'The roles lanes and tasks are given to, and that policies name (the application\'s app-contract.json): the server\'s, whichever add-ons are on. What each role is allowed to do is on Security.',
        settings: [],
    },
    {
        id: 'secure', title: 'Security',
        about: 'Who can reach this server, what each of them may do, and what its models are allowed to run (docs/design/security-profiles.md): the three are separate. The effective configuration is below, with a warning for a combination that is not safe.',
        settings: [
            // 1. access and authentication: who can reach the server
            { name: 'SESSION_SECRET', label: 'Session secret' },
            { name: 'SECURE_COOKIES', label: 'Cookies only over HTTPS' },
            { name: 'AUTH_RATE_LIMIT', label: 'Sign-in attempts a minute per address' },
            { name: 'DISABLE_SIGNUP', label: 'Self-registration off' },
            { name: 'SIGNUP_VERIFY_EMAIL', label: 'A new account verifies its email' },
            { name: 'SIGNUP_GROUPS', label: 'Groups a new account gets' },
            { name: 'ADMIN_PASSWORD', label: "The first administrator's password" },
            // 2. roles and permissions: what each role is allowed to do is the table above; DISABLE_ADMIN,
            // DISABLE_DESIGN, READ_ONLY and ENFORCE_SECURITY are not offered here — they take a permission from
            // everyone, which the table says, and they stay settable in .env
            // 3. API and AI credentials: the identities that are not people
            { name: 'API_KEY', label: 'Service key (API v3)' },
            { name: 'ADMIN_API_KEY', label: 'Administration key' },
            { name: 'API_ACTING_USER_KEY', label: 'Task API key (acting for a user)' },
            { name: 'API_IMPERSONATION', label: 'Impersonation (the frozen /api)' },
            { name: 'API_RATE_LIMIT', label: 'API calls a minute per address' },
            { name: 'AI_ACCESS', label: 'What an AI agent may do' },
            { name: 'AI_KEY_TTL_GROUPS', label: 'How long an AI link lasts, by group' },
            // 4. execution safety: what the models are allowed to run
            { name: 'SCRIPT_SANDBOX', label: 'Scripts run in a sandbox', main: true },
            { name: 'SCRIPT_SANDBOX_SERVICES', label: 'Sandboxed scripts may call appServices' },
            { name: 'SERVICE_TASKS', label: 'Service tasks run' },
            { name: 'TIMERS', label: 'Timers run' },
            { name: 'DEMO_MODE', label: 'Public demo: sandboxed scripts, no timers, no service tasks' },
            { name: 'CONNECTORS_ALLOW_HOSTS', label: 'Hosts connectors may call' },
        ],
    },
    {
        id: 'application', title: 'The application',
        about: 'Its code: the delegate, whose functions (appServices) scripts and expressions call, and its hooks (notify, loadDataObject, the events).',
        settings: [
            { name: 'APP_ENV', label: 'Environment', main: true },
            { name: 'APP_ENV_LABEL', label: 'Environment label' },
            { name: 'SITE_URL', label: 'Site address', main: true },
        ],
    },
    {
        id: 'connectors', title: 'Connectors: the application\'s APIs',
        about: 'REST APIs, each described by an OpenAPI document, that service and send tasks call by name. Their keys stay on this server.',
        settings: [
            { name: 'SECRETS_KEY', label: 'Key that encrypts the stored secrets (the connectors\' keys)', main: true },
            { name: 'CONNECTOR_CATALOG_URL', label: 'Connector catalog' },
        ],
    },
    {
        id: 'api', title: 'The API the application calls',
        about: 'How the application starts processes and acts on tasks: API v3, the task API for acting for its users, and the keys.',
        settings: [
            { name: 'API_SERVICE_USER_NAME', label: 'Service account' },
            { name: 'API_SERVICE_USER_GROUPS', label: 'Service account\'s groups' },
            { name: 'API_SERVICE_TENANT_ID', label: 'Service account\'s tenant' },
            { name: 'API_SERVICE_MODELS_OWNER', label: 'Service account\'s models owner' },
        ],
    },
    {
        id: 'models', title: 'Models and scripts',
        about: 'How forms are checked, how models are checked and found, and how scripts reach the application. What the model editor offers is Model Options\'.',
        settings: [
            { name: 'FORM_RULES', label: 'Form rules checked', editor: 'designer', main: true },
            { name: 'VERIFY_MODELS_ON_IMPORT', label: 'Models checked when saved through the APIs', editor: 'designer' },
            { name: 'CATALOG_URL', label: 'Model catalog' },
        ],
    },
];

/** The API's settings: the application's own (`hostSettings`) when it gives them, not .env's. */
const HOST_SETTINGS = new Set(['API_KEY', 'ADMIN_API_KEY', 'API_ACTING_USER_KEY', 'API_IMPERSONATION',
    'API_SERVICE_USER_NAME', 'API_SERVICE_USER_GROUPS', 'API_SERVICE_TENANT_ID', 'API_SERVICE_MODELS_OWNER']);

/** A schema description as plain text: its markdown marks taken off. */
const plain = (text = '') => text.replace(/\*\*/g, '').replace(/`/g, '').replace(/\[([^\]]+)\]\([^)]*\)/g, '$1');

/** The names of an application's services provider: functions and properties, one level into objects (the editor's completion too). */
export function appServiceNames(provider): { name: string; kind: 'function' | 'property' }[] {
    const names = (obj) => {
        const found = new Set<string>();
        for (let o = obj; o && o !== Object.prototype && o !== Function.prototype; o = Object.getPrototypeOf(o))
            for (const key of Object.getOwnPropertyNames(o))
                if (key !== 'constructor' && !key.startsWith('_')) found.add(key);
        return [...found];
    };
    const services = [];
    if (provider && typeof provider === 'object') {
        for (const name of names(provider)) {
            let value;
            try { value = provider[name]; } catch { continue; }
            services.push({ name, kind: typeof value === 'function' ? 'function' : 'property' });
            if (value && typeof value === 'object' && !Array.isArray(value) && name !== 'appDelegate')
                for (const inner of names(value).slice(0, 50))
                    services.push({ name: `${name}.${inner}`, kind: typeof value[inner] === 'function' ? 'function' : 'property' });
        }
    }
    return services;
}

/**
 * The .env the page writes, and what the server started with: a value in the process that .env did not give at the
 * start came from the environment (Docker, systemd, the shell), and a .env line would not change it.
 */
export class EnvFile {
    private atStart: Record<string, string> | null = null;
    constructor(readonly file: string) { }

    read(): Record<string, string> {
        try { return parseEnv(FS.readFileSync(this.file, 'utf8')); } catch { return {}; }
    }
    /** .env as the server started with it: read once, before the page first changes it. */
    started(): Record<string, string> {
        return this.atStart ??= this.read();
    }
    fromEnvironment(name: string): boolean {
        const running = process.env[name];
        return running !== undefined && this.started()[name] !== running;
    }
    write(changes: Record<string, string | null>) {
        this.started();
        const before = FS.existsSync(this.file) ? FS.readFileSync(this.file, 'utf8') : '';
        if (before) FS.writeFileSync(this.file + '.bak', before);
        FS.mkdirSync(path.dirname(this.file), { recursive: true });
        FS.writeFileSync(this.file, renderEnv(before, changes, 'the Settings page'));
    }
}

export interface Viewer { isAdmin: boolean; isDesigner: boolean; }

const count = (n: number, one: string, many = one + 's') => `${n} ${n === 1 ? one : many}`;
/** A setting's value as a summary says it: its value, else its default, else not set; a secret only set or not. */
const valueOf = (settings: any[], name: string) => {
    const s = settings.find(x => x.name === name);
    if (!s) return undefined;
    if (s.secret) return s.set ? 'set' : 'not set';
    return s.value !== '' ? s.value : s.default !== undefined ? String(s.default) : 'not set';
};

/** The rows the Security area's table always has: this server's own, beside whatever the application declares. */
export const SERVER_ROLES = ['PUBLIC', 'User', 'SYSTEM'] as const;

/** The permissions a role may hold (docs/design/security-profiles.md): the columns of the Security area's table. */
export const PERMISSIONS = [
    { id: 'user', title: 'User', about: 'Start permitted workflows, view authorized instances, and complete assigned tasks' },
    { id: 'designer', title: 'Designer', about: 'Create, edit, validate, and test workflow models' },
    { id: 'administrator', title: 'Administrator', about: 'Manage users, permissions, models, credentials, and configuration' },
] as const;

/**
 * Which permissions each role holds, as the rules decide it now (userAccess/roles.ts): a row for each role, a column
 * for each permission. PUBLIC (nobody signed in) and SYSTEM (the server itself) are always rows; the rest are the
 * application's own, from its contract.
 *
 * A role is the user group of the same name, so a role holds Designer or Administrator by being one of the groups the
 * code matches on (ADMIN, SYSTEM, DESIGNER) — an application's role gets them only where it is spelled the same.
 * A deployment-wide restriction (DISABLE_ADMIN, DISABLE_DESIGN, READ_ONLY) empties a column for every role,
 * administrators included, and is given as the reason.
 */
export function rolePermissions(appRoles: string[] = [], granted: Map<string, readonly string[]> = new Map()): {
    permissions: { id: string; title: string; about: string; off?: string }[];
    roles: { name: string; of: 'server' | 'application'; note?: string; editable?: boolean; byDefault?: string[]; has: Record<string, boolean> }[];
    restrictions: string[];
} {
    const on = (name: string) => /^(true|on|1|yes)$/i.test(String(process.env[name] ?? '').trim());
    const adminOff = on('DISABLE_ADMIN'), designOff = on('DISABLE_DESIGN'), readOnly = on('READ_ONLY');
    const anonymous = String(process.env.REQUIRE_AUTHENTICATION ?? '').trim() === 'false';

    const restrictions: string[] = [];
    if (adminOff) restrictions.push('DISABLE_ADMIN: nobody administers this server, whatever their role');
    if (designOff) restrictions.push('DISABLE_DESIGN: nobody designs models in the pages, whatever their role');
    if (readOnly) restrictions.push('READ_ONLY: the processes and the setup stay as they are; cases still run');
    if (anonymous) restrictions.push('REQUIRE_AUTHENTICATION=false: anyone reaching this server is treated as an administrator');

    // a column, and what turns it off for everyone
    const permissions = PERMISSIONS.map(p => ({ ...p,
        ...(p.id === 'designer' && (designOff || readOnly) ? { off: designOff ? 'DISABLE_DESIGN' : 'READ_ONLY' } : {}),
        ...(p.id === 'administrator' && adminOff ? { off: 'DISABLE_ADMIN' } : {}) }));
    const held = (wanted: Record<string, boolean>) => Object.fromEntries(
        permissions.map(p => [p.id, !p.off && !!wanted[p.id]]));

    const roles: { name: string; of: 'server' | 'application'; note?: string; editable?: boolean; byDefault?: string[]; has: Record<string, boolean> }[] = [];
    // PUBLIC: nobody signed in. With sign-in required it holds nothing; without it, what the code does today is give
    // everyone an administrator's rights, which is said as it is rather than as it should be.
    const serverSaid = (name: string, fallback: Record<string, boolean>) => {
        const said = granted.get(name);
        return said ? Object.fromEntries(PERMISSIONS.map(p => [p.id, said.includes(p.id)])) : fallback;
    };
    roles.push({ name: 'PUBLIC', of: 'server', editable: true,
        note: anonymous
            ? 'not signed in — and no sign-in is required here, so anyone reaching this server has these'
            : 'not signed in',
        has: held(serverSaid('PUBLIC', { user: anonymous, designer: anonymous, administrator: anonymous })) });
    // User: the catch-all, anyone signed in whatever their application role
    roles.push({ name: 'User', of: 'server', editable: true, note: 'anyone signed in, whatever their role',
        byDefault: ['user'],
        has: held(serverSaid('User', { user: true, designer: false, administrator: false })) });
    roles.push({ name: 'SYSTEM', of: 'server', editable: true, note: 'the server itself, and its service account',
        byDefault: ['user', 'designer', 'administrator'],
        has: held(serverSaid('SYSTEM', { user: true, designer: true, administrator: true })) });
    const own = new Set(roles.map(r => r.name));
    for (const name of appRoles.filter(n => !own.has(n))) {
        // the default: the group names this server matches on. The contract may change it either way, so a row the
        // contract mentions shows what it says; one it does not shows the default, and ticking it writes the contract.
        const byName = ['ADMIN', 'SYSTEM'].includes(name) ? ['designer', 'administrator']
            : name === 'DESIGNER' ? ['designer'] : [];
        const said = granted.get(name);
        const holds = (p: string) => said ? said.includes(p) : byName.includes(p);
        roles.push({ name, of: 'application', editable: true,
            byDefault: ['user', ...byName],
            has: held({ user: said ? said.includes('user') : true, designer: holds('designer'), administrator: holds('administrator') }) });
    }
    return { permissions, roles, restrictions };
}

/** One of the contract's APIs, as this server has it: the connector made from it, and how that connector stands. */
export interface ContractApi { id: string; openapi: string; connector: boolean; enabled?: boolean; keyed?: boolean; tested?: { ok: boolean; at: string; message?: string }; state: string }
export interface ContractCard {
    found: boolean;
    name?: string;
    description?: string;
    apis: ContractApi[];
    pages: { id: string; url: string; title?: string }[];
    roles: string[];
    functions: number;
    problems: string[];
    /** how the application and this server reach each other */
    connection: { api: string; serviceKey: boolean; siteAddress: string; signIn: string };
}

/**
 * The application's contract (app-contract.json) as a card of the Settings page: who it is, its APIs each with the
 * connector made from it and how that stands (made, enabled, key set, last test), its pages, roles and functions, what is
 * wrong with the file, and how the application and this server reach each other (the API it calls, and the address the
 * links this server sends, a handoff's among them, begin with). No contract: found is false, and the card says so.
 */
export function contractCard(contract: any, problems: string[], connectors: any[], { hostUsers = false, origin = '', env = process.env }: { hostUsers?: boolean; origin?: string; env?: Record<string, string | undefined> } = {}): ContractCard {
    const connection = {
        api: `${origin}/api/v3`,
        serviceKey: !!String(env.API_KEY ?? '').trim(),
        siteAddress: String(env.SITE_URL ?? '').trim() || 'not set: links begin with the address a request came to',
        signIn: hostUsers ? 'the application signs its people in (its user manager)' : "this server's own users",
    };
    if (!contract) return { found: false, apis: [], pages: [], roles: [], functions: 0, problems: [], connection };
    const apis: ContractApi[] = (Array.isArray(contract.apis) ? contract.apis : []).map(a => {
        const connector = connectors.find(c => c.id === a.id);
        const test = connector?.test;
        const keyed = !!connector?.auth?.last4;
        const tested = test ? { ok: !!test.ok, at: test.at, message: test.message } : undefined;
        const state = !connector ? 'no connector made'
            : connector.enabled === false ? 'off'
            : !keyed && connector.auth ? 'no key'
            : tested ? (tested.ok ? 'connected' : 'last test failed')
            : 'not tested';
        return { id: a.id, openapi: a.openapi, connector: !!connector, enabled: connector?.enabled, keyed, tested, state };
    });
    return {
        found: true, name: contract.name, description: contract.description, apis,
        pages: (Array.isArray(contract.pages) ? contract.pages : []).map(p => ({ id: p.id, url: p.url, ...(p.title ? { title: p.title } : {}) })),
        roles: (Array.isArray(contract.roles) ? contract.roles : []).map(r => r.name),
        functions: (Array.isArray(contract.expressions) ? contract.expressions : []).filter(e => e.kind === 'function').length,
        problems, connection,
    };
}

/**
 * What an integration point has, in a few words, for the Settings page's overview: { lines, attention } (attention:
 * something to set up, said so). From what the page knows of it (`info`) and its settings.
 */
export function summaryOf(id: string, info: any, settings: any[]): { lines: string[]; attention?: string } {
    switch (id) {
        // the three questions, in plain words: who can reach it, what they may do, what its models may run
        case 'secure': {
            // the settings this area offers come from its list; the restrictions it no longer offers (they take a
            // permission from everyone: the table says so) are read from the environment as the server runs
            const is = (name: string, value = 'true') => valueOf(settings, name) === value;
            const env = (name: string, value = 'true') => String(process.env[name] ?? '').trim().toLowerCase() === value;
            const signIn = env('REQUIRE_AUTHENTICATION', 'false')
                ? 'No sign-in: everyone is anonymous'
                : `Sign-in required${env('ENFORCE_SECURITY', 'false') ? ', security rules NOT enforced' : ''}`;
            const off = [env('DISABLE_ADMIN') && 'administration', env('DISABLE_DESIGN') && 'model design'].filter(Boolean);
            const may = env('READ_ONLY')
                ? 'Read-only: cases run, nothing is changed'
                : off.length ? `Off for everyone: ${off.join(' and ')}` : 'Roles decide what each person may do';
            const runs = is('DEMO_MODE')
                ? 'Public demo: scripts sandboxed, no timers, no service tasks'
                : `Scripts ${is('SCRIPT_SANDBOX') ? 'in a sandbox' : 'run as they are'}`
                  + `${is('SERVICE_TASKS', 'false') ? ', service tasks off' : ''}${is('TIMERS', 'false') ? ', timers off' : ''}`;
            // a combination that is not safe: no sign-in is the one that gives everyone an administrator's rights
            const open = env('REQUIRE_AUTHENTICATION', 'false') && !env('DISABLE_ADMIN') && !env('READ_ONLY');
            return { lines: [signIn, may, runs], attention: open
                ? 'No sign-in, and administration is on: anyone reaching this server administers it'
                : env('REQUIRE_AUTHENTICATION', 'false') && !is('SCRIPT_SANDBOX')
                    ? 'No sign-in, and scripts are not sandboxed: a model anyone saves runs as this server'
                    : valueOf(settings, 'SESSION_SECRET') === 'not set' && !env('REQUIRE_AUTHENTICATION', 'false')
                        ? 'Sign-in is required but no session secret is set'
                        : undefined };
        }
        case 'contract': {
            const card = info as ContractCard;
            if (!card.found) return { lines: ['No contract: the application publishes none (app-contract.json)'] };
            const connected = card.apis.filter(a => a.state === 'connected').length;
            return { lines: [
                `${card.name ?? 'The application'}: ${count(card.apis.length, 'API')}${card.apis.length ? ` (${connected} connected)` : ''}, ${count(card.pages.length, 'page')}, ${count(card.roles.length, 'role')}`,
            ], attention: card.problems.length ? `${count(card.problems.length, 'problem')} in app-contract.json`
                : card.apis.some(a => a.state === 'no connector made') ? 'An API in the contract has no connector yet'
                : card.apis.some(a => a.state === 'no key' || a.state === 'last test failed') ? 'An API in the contract needs its key or fails its test'
                : !card.connection.serviceKey ? 'No service key: the application cannot call this server' : undefined };
        }
        case 'application': {
            const functions = (info.services ?? []).filter(s => s.kind === 'function').length;
            return { lines: [
                info.delegate ? `Delegate ${info.delegate}, ${count(functions, 'function')} for scripts` : 'No delegate of its own',
                `Environment: ${valueOf(settings, 'APP_ENV') === 'not set' ? 'not declared' : valueOf(settings, 'APP_ENV')}${valueOf(settings, 'READ_ONLY') === 'true' ? ', read-only' : ''}`,
            ], attention: valueOf(settings, 'SITE_URL') === 'not set' ? "Site address not set: emails can't link to it" : undefined };
        }
        case 'connectors': {
            const list = info.list ?? [];
            const keyless = list.filter(c => !c.auth?.last4).length;
            return { lines: [list.length ? `${count(list.length, 'connector')}${keyless ? `, ${keyless} without a key` : ''}` : 'No connectors yet'],
                attention: list.length && !info.canEncrypt ? 'Connector keys need the encryption key' : undefined };
        }
        case 'roles': {
            const roles = info.roles;
            if (!roles || roles.error) return { lines: [roles?.error ?? ''] };
            return { lines: [count(roles.list?.length ?? 0, 'role')],
                attention: roles.unlisted?.length ? `${count(roles.unlisted.length, 'role')} used but not listed` : undefined };
        }
        // the policies' add-ons: what each has, known while it is on
        case 'assignment':
            return { lines: info.assignment ? [count(info.assignment.length, 'assignment policy', 'assignment policies')] : [] };
        case 'security':
            return { lines: info.security ? [`${count(info.security.length, 'security policy', 'security policies')}${info.security.length ? (info.securityOn ? ' (on)' : ' (off)') : ''}`] : [] };
        case 'notification':
            if (!info.notification) return { lines: [] };
            return { lines: [count(info.notification.length, 'notification policy', 'notification policies'),
                `Delivered by ${info.notify ? 'the application' : 'email'}; ${count(info.total ?? 0, 'notification')} kept`],
                attention: !info.notify && valueOf(settings, 'EMAIL_ENABLE') !== 'true' ? 'Email is off: notifications are kept, not sent' : undefined };
        case 'modeling':
            return { lines: [] };     // its options are its card's switches
        case 'api':
            return { lines: [`API v3; service key ${valueOf(settings, 'API_KEY') ?? "the application's"}`, `Task API (acting for a user) ${info.taskApi ? 'on' : 'off'}`] };
        case 'models':
            return { lines: [`Form rules ${valueOf(settings, 'FORM_RULES') === 'false' ? 'not checked' : 'checked'}; scripts ${valueOf(settings, 'SCRIPT_SANDBOX') === 'true' ? 'in a sandbox' : 'run as they are'}`] };
        case 'ai': {
            const levels = valueOf(settings, 'AI_ACCESS');
            return { lines: [levels && levels !== 'not set' ? `AI links: ${levels}` : "AI links: as people's rights allow"] };
        }
    }
    return { lines: [] };
}

const mayChange = (viewer: Viewer, editor: Editor = 'admin') => viewer.isAdmin || (editor === 'designer' && viewer.isDesigner);

/** Each setting of a point as the page shows it to this viewer. */
export function settingsOf(point: IntegrationPoint, viewer: Viewer, env: EnvFile, appHostSettings: boolean) {
    const schema = settingsSchema().properties;
    const inFile = env.read();
    return point.settings.map(({ name, label, editor, main }) => {
        const entry = schema[name] ?? {};
        const secret = !!entry['x-secret'];
        const running = process.env[name];
        const file = inFile[name];
        const fromEnvironment = env.fromEnvironment(name);
        const byApplication = appHostSettings && HOST_SETTINGS.has(name);
        // what runs now, and whether .env holds something else that a restart will bring
        const pending = !fromEnvironment && (file ?? '') !== (env.started()[name] ?? '');
        const source = byApplication ? 'the application' : fromEnvironment ? 'the environment' : running !== undefined && running !== '' ? '.env' : 'default';
        return {
            name, label, secret, editor: editor ?? 'admin', main: !!main,
            description: plain(entry.description),
            type: entry.type, choices: entry.enum ?? (entry.type === 'boolean' ? ['true', 'false'] : null),
            default: entry.default, examples: entry.examples ?? [],
            generate: entry['x-generate'] === 'key',
            // a secret: only whether it is set
            value: secret ? undefined : running ?? '',
            set: !!running,
            fileValue: secret ? undefined : file,
            source, pending,
            editable: mayChange(viewer, editor) && !fromEnvironment && !byApplication,
        };
    });
}

/**
 * The changes a section's form asks for: { changes, problems }. Only the settings this viewer may change, and each
 * checked against the schema. A field left out changes nothing; empty, back to the default (a secret: kept, unless
 * `clear:` asks); `generate:` a new random key.
 */
export function changesFrom(point: IntegrationPoint, body, viewer: Viewer, env: EnvFile, appHostSettings: boolean) {
    const schema = settingsSchema().properties;
    const inFile = env.read();
    const changes: Record<string, string | null> = {};
    const problems: string[] = [];
    for (const s of settingsOf(point, viewer, env, appHostSettings)) {
        if (!s.editable) {
            // the page shows no field for it: one sent anyway is refused, not ignored
            if (['', 'generate:', 'clear:'].some(p => body[p + s.name] !== undefined))
                problems.push(`${s.label} (${s.name}): not changed here`);
            continue;
        }
        let value: string | null | undefined;
        if (s.secret) {
            if (body['generate:' + s.name]) value = crypto.randomBytes(24).toString('hex');
            else if (body['clear:' + s.name]) value = null;
            else if (String(body[s.name] ?? '') !== '') value = String(body[s.name]);
        }
        else if (body[s.name] !== undefined) {
            const v = String(body[s.name]).trim();
            value = v === '' ? null : v;
        }
        if (value === undefined || value === (inFile[s.name] ?? null)) continue;
        const problem = value === null ? null : settingProblem(value, schema[s.name]);
        if (problem) { problems.push(`${s.label} (${s.name}): ${problem}`); continue; }
        changes[s.name] = value;
    }
    // the task API's key must not be the service key (the start's checks refuse it)
    const after = { ...inFile, ...changes };
    if ('API_ACTING_USER_KEY' in changes && after.API_ACTING_USER_KEY && after.API_ACTING_USER_KEY === (after.API_KEY ?? process.env.API_KEY))
        problems.push('Task API key: must differ from the service key');
    return { changes, problems };
}
