/**
 * Settings' values checked against their entries in bpmn-web's settings schema (settings/settings.schema.json): what
 * `bpmn-server setup` asks and what bpmn-web says at start. A wrong value is one line naming the setting; nothing
 * here stops a server.
 */

/** Why a value does not fit its schema entry, or null. An empty value is unset, and fits. */
export function settingProblem(value: string, entry: any): string | null {
    if (!entry || value === '' || value === undefined || value === null) return null;
    if (entry.type === 'boolean' && !/^(true|false)$/i.test(value)) return 'true or false';
    if ((entry.type === 'integer' || entry.type === 'number') && !/^-?\d+(\.\d+)?$/.test(value)) return 'a number';
    if (entry.type === 'integer' && entry.minimum !== undefined && Number(value) < entry.minimum) return `at least ${entry.minimum}`;
    if (entry.enum && !entry.enum.includes(value)) return `one of ${entry.enum.join(', ')}`;
    if (entry.minLength && value.length < entry.minLength) return `at least ${entry.minLength} characters`;
    if (entry.format === 'uri' && !/^https?:\/\/\S+$/.test(value)) return 'an http:// or https:// address';
    if (entry.pattern && !new RegExp(entry.pattern).test(value)) return `like ${entry.examples?.[0] ?? entry.pattern}`;
    return null;
}

/** How many single-letter edits turn a into b (Levenshtein), to know a misspelt name. */
function distance(a: string, b: string): number {
    const row = Array.from({ length: b.length + 1 }, (_, i) => i);
    for (let i = 1; i <= a.length; i++) {
        let previous = row[0];
        row[0] = i;
        for (let j = 1; j <= b.length; j++) {
            const kept = row[j];
            row[j] = Math.min(row[j] + 1, row[j - 1] + 1, previous + (a[i - 1] === b[j - 1] ? 0 : 1));
            previous = kept;
        }
    }
    return row[b.length];
}

/**
 * The settings' problems, one line each: a value of the wrong kind (`PORT=abc: PORT is a number`), and among `names`
 * (those the .env file sets) one that is not a setting but close to one (`SESSON_SECRET: not a setting; SESSION_SECRET?`).
 * A name far from every setting is the application's own, and not reported.
 */
export function settingsProblems(env: Record<string, string | undefined>, schema: any, names: string[] = []): string[] {
    const settings = Object.entries<any>(schema?.properties ?? {}).filter(([, s]) => s['x-where'] === 'env');
    const known = new Set(settings.map(([name]) => name));
    const problems: string[] = [];
    for (const [name, entry] of settings) {
        const why = settingProblem(env[name], entry);
        if (why) problems.push(`${name}=${entry['x-secret'] ? '***' : env[name]}: ${name} is ${why}`);
    }
    for (const name of names) {
        if (known.has(name)) continue;
        const near = [...known].find(k => distance(name.toUpperCase(), k) <= (k.length > 8 ? 2 : 1));
        if (near) problems.push(`${name}: not a setting; ${near}?`);
    }
    return problems;
}
