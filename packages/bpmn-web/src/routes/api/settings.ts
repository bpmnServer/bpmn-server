import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

/*
 * The settings, as an administrator (or an administer-level AI link) reads them: each from the schema
 * (settings/settings.schema.json), with its value and where it comes from, secrets as *** (never their values); and
 * the checks that show a setting works. Nothing here changes a setting: a person does, through the setup
 * (docs/design/setup-wizard.md §5).
 */
const SCHEMA_FILE = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', '..', '..', 'settings', 'settings.schema.json');
let schema: any;
export const settingsSchema = () => schema ??= JSON.parse(fs.readFileSync(SCHEMA_FILE, 'utf8'));

export class SettingsError extends Error {
    constructor(readonly status: number, message: string, readonly code: string) { super(message); }
}

/** A value at a dotted path of an object (the configuration's timers.precision). */
const at = (object, dotted: string) => dotted.split('.').reduce((value, key) => value?.[key], object);

export class SettingsOperations {
    constructor(readonly server) { }

    /** Every setting by group: its value (a secret's as ***), where it comes from, and what the schema says of it. */
    list() {
        const groups: Record<string, any[]> = {};
        for (const [name, s] of Object.entries<any>(settingsSchema().properties)) {
            let value, source;
            if (s['x-where'] === 'env') {
                const raw = process.env[name];
                source = raw === undefined ? ('default' in s ? 'default' : 'unset') : '.env';
                value = raw === undefined ? s.default : s['x-secret'] ? '***' : raw;
            }
            else {
                const raw = at(this.server.configuration, name.slice('config:'.length));
                source = raw === undefined ? ('default' in s ? 'default' : 'unset') : 'settings/config.ts';
                value = raw === undefined ? s.default : typeof raw === 'function' ? '(code)' : raw;
            }
            (groups[s['x-group']] ??= []).push({
                name, value, source, type: s.type, description: s.description,
                ...(s['x-secret'] ? { secret: true } : {}), ...(s['x-restart'] ? { restart: true } : {}), ...(s['x-check'] ? { check: s['x-check'] } : {}),
            });
        }
        return { groups };
    }

    /** One check: { check, ok, message }. */
    async check(name: string) {
        const ok = (message: string) => ({ check: name, ok: true, message });
        const failed = (message: string) => ({ check: name, ok: false, message });
        switch (name) {
            case 'database':
                try { await this.server.dataStore.findInstances({ id: '__settings-check__' }, 'summary'); return ok('The database answers'); }
                catch (error) { return failed(`The database does not answer: ${error?.message ?? error}`); }
            case 'engine':
                try { const status = await this.server.status(); return ok(`The engine answers${status ? '' : ' (no status)'}`); }
                catch (error) { return failed(`The engine does not answer: ${error?.message ?? error}`); }
            case 'url': {
                const url = process.env.SITE_URL;
                if (!url) return failed('SITE_URL is not set');
                try {
                    const res = await fetch(url, { method: 'GET', redirect: 'manual', signal: AbortSignal.timeout(5000) });
                    return ok(`${url} answers ${res.status}`);
                }
                catch (error) { return failed(`${url} does not answer: ${error?.message ?? error}`); }
            }
            case 'email':
                return failed('Not checked yet: sending a test email to the administrator comes with the setup wizard');
            default:
                throw new SettingsError(404, `No check ${name}: database, engine, url or email`, 'NO_CHECK');
        }
    }
}
