// The settings page's tables (docs/docs/settings.md, "Everything .env can hold") from bpmn-web's settings schema
// (packages/bpmn-web/settings/settings.schema.json), so the page and the schema can not drift.
//
//   node scripts/settings.mjs            write the tables into the page
//   node scripts/settings.mjs --check    check only: the page out of date fails
//
// npm run features runs it too (and --check with --check). The rest of the page is written by hand.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SCHEMA = path.join(ROOT, 'packages', 'bpmn-web', 'settings', 'settings.schema.json');
const PAGE = path.join(ROOT, 'docs', 'docs', 'settings.md');
const START = '## Everything `.env` can hold';
const END = '## What `settings/config.ts` can hold';

/** The page's sections, in order: the schema's x-group, a title, and what is said before the table. */
const GROUPS = [
    ['server', 'The server'],
    ['database', 'The database *(host and engine)*'],
    ['engine', 'The engine'],
    ['access', 'Signing in and access'],
    ['api', 'REST APIs'],
    ['models', 'Models and connectors'],
    ['email', 'Email'],
    ['diagnostics', 'Diagnostics'],
    ['clients', 'Clients of the server',
        '`bpmn-mcp` and `bpmn-client`\'s command line read their own `.env`, from the folder they start in. An application\'s `.env` already works for them: they read `PORT`, `API_KEY` and `ADMIN_API_KEY` (above), and these.'],
];

const READS = { host: 'Host', engine: 'Engine', both: 'Both' };

/** The tables, from the schema: settings with the same description (and process) share a row. */
export function settingsTables(schema = JSON.parse(fs.readFileSync(SCHEMA, 'utf8'))) {
    const env = Object.entries(schema.properties).filter(([, s]) => s['x-where'] === 'env');
    const known = new Set(GROUPS.map(g => g[0]));
    const stray = env.filter(([, s]) => !known.has(s['x-group'])).map(([n]) => n);
    if (stray.length)
        throw new Error(`settings with a group the page does not have: ${stray.join(', ')}`);
    const out = [START, '', 'All are optional unless marked. Made from bpmn-web\'s settings schema',
        '([settings.schema.json](https://github.com/bpmnServer/bpmn-server/blob/main/packages/bpmn-web/settings/settings.schema.json))',
        'by `npm run features`: edit the schema, not these tables.', ''];
    for (const [group, title, intro] of GROUPS) {
        const rows = new Map();
        for (const [name, s] of env.filter(([, s]) => s['x-group'] === group)) {
            const key = `${s['x-reads'] ?? ''}|${s.description ?? ''}`;
            if (!rows.has(key)) rows.set(key, { names: [], reads: s['x-reads'], description: s.description ?? '' });
            rows.get(key).names.push(name);
        }
        if (!rows.size) continue;
        const withReads = [...rows.values()].some(r => r.reads);
        out.push(`### ${title}`, '');
        if (intro) out.push(intro, '');
        out.push(withReads ? '| Setting | On | Means |' : '| Setting | Means |', withReads ? '|---|---|---|' : '|---|---|');
        for (const r of rows.values()) {
            const names = r.names.map(n => '`' + n + '`').join(', ');
            const means = r.description.replace(/\|/g, '\\|');
            out.push(withReads ? `| ${names} | ${READS[r.reads] ?? ''} | ${means} |` : `| ${names} | ${means} |`);
        }
        out.push('');
    }
    return out.join('\n');
}

/** The page with its tables replaced. */
export function settingsPage(page = fs.readFileSync(PAGE, 'utf8'), tables = settingsTables()) {
    const eol = page.includes('\r\n') ? '\r\n' : '\n';
    const text = page.replace(/\r\n/g, '\n');
    const start = text.indexOf(START), end = text.indexOf(END);
    if (start < 0 || end < start)
        throw new Error(`${PAGE}: the headings "${START}" and "${END}" are needed around the tables`);
    return (text.slice(0, start) + tables + '\n' + text.slice(end)).replace(/\n/g, eol);
}

/** Writes the page, or with check only says whether it is up to date. */
export function run(check = false) {
    const now = fs.readFileSync(PAGE, 'utf8');
    const next = settingsPage(now);
    if (check)
        return now === next ? [] : ['docs/docs/settings.md: its tables differ from the settings schema: run npm run features'];
    if (now !== next) fs.writeFileSync(PAGE, next);
    return [];
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
    const problems = run(process.argv.includes('--check'));
    for (const p of problems) console.error(p);
    process.exit(problems.length ? 1 : 0);
}
