/**
 * The Integration page (/dashboard/integration): where an administrator and a designer set up how the workflows meet
 * the application (docs/docs/integration-settings.md). One section per integration point: the application's code,
 * its APIs (connectors), roles and policies, notifications, the API the application calls, forms and scripts, AI
 * agents. Each shows what is in place and its settings, from the settings schema (settings/settings.schema.json).
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
    /** Its settings, each changed by `admin` (the default) or by a designer too. */
    settings: { name: string; label: string; editor?: Editor }[];
}

/** The integration points, in the page's order. */
export const INTEGRATION_POINTS: IntegrationPoint[] = [
    {
        id: 'application', title: 'The application',
        about: 'Its code: the delegate, whose functions (appServices) scripts and expressions call, and its hooks (notify, loadDataObject, the events).',
        settings: [
            { name: 'APP_ENV', label: 'Environment' },
            { name: 'SITE_URL', label: 'Site address' },
        ],
    },
    {
        id: 'connectors', title: 'Connectors: the application\'s APIs',
        about: 'REST APIs, each described by an OpenAPI document, that service and send tasks call by name. Their keys stay on this server.',
        settings: [
            { name: 'SERVICE_TASKS', label: 'Service tasks run' },
            { name: 'CONNECTORS_KEY', label: 'Key that encrypts connector keys' },
            { name: 'CONNECTORS_ALLOW_HOSTS', label: 'Hosts connectors may call' },
            { name: 'CONNECTOR_CATALOG_URL', label: 'Connector catalog' },
        ],
    },
    {
        id: 'policies', title: 'Roles and policies',
        about: 'The roles lanes and tasks are given to, and the decision tables that assign tasks, secure instances and choose notifications.',
        settings: [
            { name: 'SECURITY_POLICY', label: 'Security policies' },
            { name: 'ENFORCE_SECURITY', label: 'Sign-in and security enforced' },
        ],
    },
    {
        id: 'notifications', title: 'Notifications',
        about: 'What the notification policies send: kept by BPMN Server, delivered by the application\'s notify, or by email.',
        settings: [
            { name: 'NOTIFICATIONS', label: 'Delivery' },
            { name: 'EMAIL_ENABLE', label: 'Email sent' },
            { name: 'EMAIL_FROM', label: 'Sender' },
            { name: 'SMTP_USER', label: 'Mail account' },
            { name: 'SMTP_PASSWORD', label: 'Mail password' },
            { name: 'EMAIL_LOG', label: 'Email log' },
        ],
    },
    {
        id: 'api', title: 'The API the application calls',
        about: 'How the application starts processes and acts on tasks: API v3, the task API for acting for its users, and the keys.',
        settings: [
            { name: 'API_KEY', label: 'Service key' },
            { name: 'ADMIN_API_KEY', label: 'Administration key' },
            { name: 'API_ACTING_USER_KEY', label: 'Task API key (acting for a user)' },
            { name: 'API_SERVICE_USER_NAME', label: 'Service account' },
            { name: 'API_SERVICE_USER_GROUPS', label: 'Service account\'s groups' },
            { name: 'API_SERVICE_TENANT_ID', label: 'Service account\'s tenant' },
            { name: 'API_SERVICE_MODELS_OWNER', label: 'Service account\'s models owner' },
            { name: 'API_IMPERSONATION', label: 'Impersonation (/api)' },
            { name: 'API_RATE_LIMIT', label: 'Calls a minute per address' },
        ],
    },
    {
        id: 'forms', title: 'Forms, scripts and the model editor',
        about: 'How forms are checked, what the model editor offers and keeps, and how scripts reach the application.',
        settings: [
            { name: 'FORM_RULES', label: 'Form rules checked', editor: 'designer' },
            { name: 'ELEMENT_TEMPLATES', label: 'Element templates offered', editor: 'designer' },
            { name: 'VERIFY_MODELS_ON_IMPORT', label: 'Models checked when saved through the APIs', editor: 'designer' },
            { name: 'MODEL_HISTORY', label: 'Saved versions of models kept', editor: 'designer' },
            { name: 'CATALOG_URL', label: 'Model catalog' },
            { name: 'SCRIPT_SANDBOX', label: 'Scripts run in a sandbox' },
            { name: 'SCRIPT_SANDBOX_SERVICES', label: 'Sandboxed scripts may call appServices' },
            { name: 'TIMERS', label: 'Timers run' },
        ],
    },
    {
        id: 'ai', title: 'AI agents',
        about: 'The links an AI agent works with (Link for an AI agent), and this site\'s own guide for them in /llms.txt.',
        settings: [
            { name: 'AI_ACCESS', label: 'AI link levels offered' },
            { name: 'AI_GUIDE', label: 'Guide for AI agents' },
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
        FS.writeFileSync(this.file, renderEnv(before, changes, 'the Integration page'));
    }
}

export interface Viewer { isAdmin: boolean; isDesigner: boolean; }

const mayChange = (viewer: Viewer, editor: Editor = 'admin') => viewer.isAdmin || (editor === 'designer' && viewer.isDesigner);

/** Each setting of a point as the page shows it to this viewer. */
export function settingsOf(point: IntegrationPoint, viewer: Viewer, env: EnvFile, appHostSettings: boolean) {
    const schema = settingsSchema().properties;
    const inFile = env.read();
    return point.settings.map(({ name, label, editor }) => {
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
            name, label, secret, editor: editor ?? 'admin',
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
