// API v3's reference page (docs/docs/api-v3.md), made from its OpenAPI document (packages/bpmn-web/src/routes/api/openapi-v3.ts,
// built: run `npm run build` first). The document is what the server serves at /api/v3/openapi.json and what the contract
// tests check against the routes; this page is that document, to read.
//
//   node scripts/api-docs.mjs            write docs/docs/api-v3.md
//   node scripts/api-docs.mjs --check    the page is the document's, or fail (npm run api-docs)
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

export const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const PAGE = path.join(ROOT, 'docs', 'docs', 'api-v3.md');
const DOCUMENT = path.join(ROOT, 'packages', 'bpmn-web', 'dist', 'routes', 'api', 'openapi-v3.js');
const SOURCE = 'packages/bpmn-web/src/routes/api/openapi-v3.ts';
const SITE = 'https://<site>';

/** The areas of the page, in order, by a path's first segment. */
const AREAS = [
    ['me', 'Who am I'], ['processes', 'Processes'], ['tasks', 'Tasks'], ['instances', 'Instances'], ['models', 'Models and their tests'],
    ['rules', 'Rules'], ['messages', 'Messages and signals'], ['signals', 'Messages and signals'], ['users', 'Users'],
    ['settings', 'Settings'], ['tokens', 'Tokens'],
];
const METHODS = ['get', 'post', 'put', 'delete', 'patch'];

/** Text in a table cell: no | or line break; a < is text, not the start of a tag. */
const cell = text => String(text ?? '').replace(/\|/g, '\\|').replace(/\n/g, ' ').replace(/</g, '&lt;');
const anchor = name => name.toLowerCase();

/** A schema in a few words: its type, a link to a named one, or its fields. */
function shape(schema) {
    if (!schema) return '';
    if (schema.$ref) {
        const name = schema.$ref.split('/').pop();
        return `[${name}](#${anchor(name)})`;
    }
    if (schema.allOf) return schema.allOf.map(shape).join(' and ');
    if (schema.oneOf) return schema.oneOf.map(shape).join(' or ');
    if (schema.enum) return schema.enum.map(v => `\`${JSON.stringify(v)}\``).join(' or ');
    if (Array.isArray(schema.type)) return schema.type.join(' or ');
    if (schema.type === 'array') return `list of ${shape(schema.items) || 'any'}`;
    if (schema.type === 'object' && schema.properties)
        return `{ ${Object.entries(schema.properties).map(([name, p]) => `${name}${shapeIfNamed(p)}`).join(', ')} }`;
    if (schema.type === 'object') return 'object';
    return schema.type ?? 'any';
}
const shapeIfNamed = p => p.$ref || p.allOf || p.oneOf ? `: ${shape(p)}` : '';

/** What a schema's value may be: its default and limits. */
function limits(schema = {}) {
    const said = [];
    if (schema.default !== undefined) said.push(`default ${JSON.stringify(schema.default)}`);
    if (schema.minimum !== undefined) said.push(`at least ${schema.minimum}`);
    if (schema.maximum !== undefined) said.push(`at most ${schema.maximum}`);
    if (schema.minLength !== undefined) said.push(`${schema.minLength} characters or more`);
    if (schema.format) said.push(schema.format);
    return said.join(', ');
}

function fields(schema, required = []) {
    const rows = ['| Field | Type | Required | Description |', '|---|---|---|---|'];
    for (const [name, p] of Object.entries(schema.properties ?? {}))
        rows.push(`| \`${name}\` | ${cell(shape(p))} | ${required.includes(name) ? 'yes' : ''} | ${cell([p.description, limits(p)].filter(Boolean).join('; '))} |`);
    return rows;
}

function operation(document, route, method, op) {
    const lines = [`### ${method.toUpperCase()} ${route}`, '', `${op.summary}.`, ''];
    if (op.security) {
        const schemes = op.security.flatMap(s => Object.keys(s)).map(s => document.components.securitySchemes[s]);
        lines.push(`Credential: ${schemes.map(s => s.description).join(', or ')} only.`, '');
    }
    if (op.parameters?.length) {
        lines.push('| Parameter | In | Type | Required | Description |', '|---|---|---|---|---|');
        for (const p of op.parameters)
            lines.push(`| \`${p.name}\` | ${p.in} | ${cell(shape(p.schema))} | ${p.required ? 'yes' : ''} | ${cell([p.description, limits(p.schema)].filter(Boolean).join('; '))} |`);
        lines.push('');
    }
    const body = op.requestBody?.content?.['application/json']?.schema;
    if (body) {
        lines.push(`Body (JSON${op.requestBody.required ? ', required' : ''}):`, '', ...fields(body, body.required), '');
    }
    lines.push('| Answer | Means | Body |', '|---|---|---|');
    for (const [status, answer] of Object.entries(op.responses))
        lines.push(`| ${status} | ${cell(answer.description)} | ${cell(shape(answer.content?.['application/json']?.schema))} |`);
    lines.push('');
    return lines;
}

/** The page, from the document. */
export function render(document) {
    const lines = [
        '# API v3 reference', '',
        `<!-- Made from ${SOURCE} by \`npm run api-docs\`: change the document, not this page. -->`, '',
        `${document.info.description.replace(/See docs\/design\/api-v3\.md\.?/, '').trim()} How to use it: [the client API](client-api.md#api-v3).`, '',
        `The address is \`${document.servers[0].url}\`. The server serves this document at \`/api/v3/openapi.json\`, with no credential: a client, or an agent, can read it there.`, '',
        '**Credentials**', '',
        ...Object.entries(document.components.securitySchemes).map(([name, s]) =>
            `- \`${name}\`: ${s.description} (${s.type === 'http' ? `\`Authorization: ${s.scheme === 'bearer' ? 'Bearer <token>' : s.scheme}\`` : `header \`${s.name}\``}).`),
        '',
        'Errors are `{ "error": { "code", "message" } }`, with the status the error\'s kind gives. Lists are `{ "items", "next" }`: ask for the next page with `?cursor=<next>`; `next` is absent on the last page.', '',
    ];
    const byArea = new Map();
    for (const [route, ops] of Object.entries(document.paths)) {
        const first = route.split('/')[1];
        const area = AREAS.find(([segment]) => segment === first)?.[1] ?? 'Other';
        for (const method of METHODS)
            if (ops[method]) (byArea.get(area) ?? byArea.set(area, []).get(area)).push([route, method, ops[method]]);
    }
    const order = [...new Set([...AREAS.map(([, title]) => title), 'Other'])].filter(title => byArea.has(title));
    lines.push('## Operations', '', '| Operation | Does |', '|---|---|');
    for (const area of order)
        for (const [route, method, op] of byArea.get(area))
            lines.push(`| [${method.toUpperCase()} ${route}](#${anchor(`${method} ${route}`).replace(/[^a-z0-9 _-]/g, '').replace(/ /g, '-')}) | ${cell(op.summary)} |`);
    lines.push('');
    for (const area of order) {
        lines.push(`## ${area}`, '');
        for (const [route, method, op] of byArea.get(area)) lines.push(...operation(document, route, method, op));
    }
    lines.push('## Shapes', '');
    for (const [name, schema] of Object.entries(document.components.schemas)) {
        lines.push(`### ${name}`, '');
        const parts = schema.allOf ?? [schema];
        const named = parts.filter(p => p.$ref).map(shape);
        if (named.length) lines.push(`Everything of ${named.join(' and ')}, and:`, '');
        for (const part of parts.filter(p => !p.$ref)) {
            if (part.properties) lines.push(...fields(part, part.required), '');
            else lines.push(shape(part), '');
        }
    }
    return lines.join('\n').replace(/\n{3,}/g, '\n\n').trimEnd() + '\n';
}

export async function page() {
    if (!fs.existsSync(DOCUMENT)) throw new Error(`${path.relative(ROOT, DOCUMENT)} is not built: npm run build`);
    const { openApiV3 } = await import(pathToFileURL(DOCUMENT).href);
    return render(openApiV3(SITE));
}

/** Whether docs/docs/api-v3.md is the document's. */
export async function upToDate() {
    return fs.existsSync(PAGE) && fs.readFileSync(PAGE, 'utf8').replace(/\r\n/g, '\n') === await page();
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
    if (process.argv.includes('--check')) {
        const ok = await upToDate();
        console.log(ok ? 'docs/docs/api-v3.md is the document\'s' : 'docs/docs/api-v3.md is out of date: npm run api-docs');
        process.exit(ok ? 0 : 1);
    }
    fs.writeFileSync(PAGE, await page());
    console.log(`${path.relative(ROOT, PAGE)} written`);
}
