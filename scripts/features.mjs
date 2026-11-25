// The feature catalog (docs/features.yaml): checks its references, tags the tests it names, writes the docs page.
//
//   node scripts/features.mjs            check, tag the tests ("// @features: a, b" at the top), write docs/docs/features.md
//                                        and the settings page's tables (scripts/settings.mjs)
//   node scripts/features.mjs --check    check only: a broken reference, or a test's tags out of date, fails
//
// A test is tagged by the catalog (its `tests`), so the tags and the catalog agree; a test may also name a feature
// in its title, "@feature:<id>", which counts for that feature too.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import YAML from 'yaml';
import { run as settingsPage } from './settings.mjs';

export const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const CATALOG = path.join(ROOT, 'docs', 'features.yaml');
const PAGE = path.join(ROOT, 'docs', 'docs', 'features.md');
const REPO = 'https://github.com/bpmnServer/bpmn-server/blob/main/';
const STATUSES = ['supported', 'partial', 'not-supported'];
const TAG_LINE = /^\/\/ @features: .*$/m;

export function load() {
    return YAML.parse(fs.readFileSync(CATALOG, 'utf8'));
}

/** The catalog's problems (each a line), and per test file the feature ids that name it. */
export function check(catalog = load()) {
    const problems = [];
    const ids = new Set();
    const byTest = new Map();
    for (const f of catalog.features) {
        const at = `feature ${f.id}`;
        if (!f.id || !/^[a-z0-9-]+$/.test(f.id)) problems.push(`${at}: an id of lower-case words joined by -`);
        if (ids.has(f.id)) problems.push(`${at}: the id is used twice`);
        ids.add(f.id);
        if (!catalog.areas[f.area]) problems.push(`${at}: no area '${f.area}'`);
        if (f.status && !STATUSES.includes(f.status)) problems.push(`${at}: status is one of ${STATUSES.join(', ')}`);
        if (!f.name || !f.what) problems.push(`${at}: a name and what it does`);
        for (const marker of f.xml ?? []) {
            try { parseMarker(String(marker)); } catch (error) { problems.push(`${at}: xml ${error.message}`); }
        }
        for (const kind of ['docs', 'code', 'tests', 'examples'])
            for (const ref of f[kind] ?? []) {
                const [file, anchor] = ref.split('#');
                const full = path.join(ROOT, file);
                if (!fs.existsSync(full)) { problems.push(`${at}: ${kind} ${ref} is not there`); continue; }
                if (anchor && !headings(full).includes(anchor)) problems.push(`${at}: ${ref} has no heading #${anchor}`);
                // a .feature says what it covers by its own tags, not by a "// @features:" line
                if (kind === 'tests' && !file.endsWith('.feature')) byTest.set(file, [...(byTest.get(file) ?? []), f.id]);
            }
    }
    return { problems, byTest };
}

/** A Markdown file's headings, as anchors (lower case, words joined by -). */
function headings(file) {
    return [...fs.readFileSync(file, 'utf8').matchAll(/^#+\s+(.+)$/gm)]
        .map(m => m[1].trim().toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-'));
}

/** The tag line a test file should have; and whether it has it. */
function tagLine(ids) {
    return `// @features: ${[...new Set(ids)].sort().join(', ')}`;
}
export function tagsUpToDate(byTest) {
    const stale = [];
    for (const [file, ids] of byTest) {
        const text = fs.readFileSync(path.join(ROOT, file), 'utf8');
        if (!text.includes(tagLine(ids))) stale.push(file);
    }
    return stale;
}
function writeTags(byTest) {
    for (const [file, ids] of byTest) {
        const full = path.join(ROOT, file);
        let text = fs.readFileSync(full, 'utf8');
        const line = tagLine(ids);
        if (TAG_LINE.test(text)) text = text.replace(TAG_LINE, line);
        else if (text.startsWith('#!')) text = text.replace(/^(#!.*\n)/, `$1${line}\n`);
        else text = `${line}\n${text}`;
        fs.writeFileSync(full, text);
    }
}

// ---- where a feature appears in a model's XML (a feature's `xml`), and the models that use a feature: the matcher is
// bpmn-web's (packages/bpmn-web/src/modelFeatures.js), which its Design dashboard uses with the catalog's markers
// written into it (src/modelFeatureCatalog.ts, by `npm run features`)
export { parseXml, parseMarker, find } from '../packages/bpmn-web/src/modelFeatures.js';
import { parseMarker, modelFeatures as featuresOf } from '../packages/bpmn-web/src/modelFeatures.js';

const MARKERS_FILE = path.join(ROOT, 'packages', 'bpmn-web', 'src', 'modelFeatureCatalog.ts');
/** bpmn-web's copy of the features that show in models, and their markers: the catalog's, as code. */
export function markersSource(catalog = load()) {
    const features = catalog.features.filter(f => f.xml?.length).map(({ id, name, area, xml }) => ({ id, name, area, xml }));
    return `// Made from docs/features.yaml by \`npm run features\`: edit the catalog, not this file.
// The features that show in a model's XML, and what shows them (modelFeatures.js): the Design dashboard's filter.
export const MODEL_FEATURES: { id: string, name: string, area: string, xml: string[] }[] = ${JSON.stringify(features, null, 4)};
`;
}

/** The catalog's features a model uses: [{ id, name, at: [element ids] }], by the features' `xml` markers. */
export function modelFeatures(xml, catalog = load()) {
    return featuresOf(xml, catalog.features);
}

/** The model files (.bpmn, .dmn) at a path: a file, or a folder and the folders in it. */
function modelFiles(where) {
    const full = path.resolve(where);
    if (!fs.existsSync(full)) throw new Error(`${where} is not there`);
    if (fs.statSync(full).isFile()) return [full];
    const files = [];
    const walk = dir => {
        for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
            const file = path.join(dir, e.name);
            if (e.isDirectory()) { if (!['node_modules', 'dist', '.git', '.history'].includes(e.name)) walk(file); }
            else if (/\.(bpmn|dmn)$/i.test(e.name) || e.name.endsWith('.dmn.xml')) files.push(file);
        }
    };
    walk(full);
    return files.sort();
}

/** Each model at `where` and the features it uses; with `feature`, only the models that use it, and where. */
export function searchModels(where, feature, catalog = load()) {
    if (feature && !catalog.features.some(f => f.id === feature)) throw new Error(`no feature '${feature}' (docs/features.yaml)`);
    const found = [];
    for (const file of modelFiles(where)) {
        const used = modelFeatures(fs.readFileSync(file, 'utf8'), catalog).filter(u => !feature || u.id === feature);
        if (used.length || !feature) found.push({ file: path.relative(process.cwd(), file).replaceAll('\\', '/'), features: used });
    }
    return found;
}

const TEST_FOLDERS =['packages/bpmn-server/test', 'apps/testSampleApp/test', 'apps/testSampleApp/examples', 'apps/testSampleApp/processes', 'apps/sampleApp/processes'];

/** Every .feature file's "@feature:<id>" tags, as [file, id], in these folders. */
export function featureFileTags(folders = TEST_FOLDERS.map(dir => path.join(ROOT, dir))) {
    const found = [];
    const walk = dir => {
        for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
            const full = path.join(dir, e.name);
            if (e.isDirectory()) { if (!['node_modules', 'dist', '.git'].includes(e.name)) walk(full); continue; }
            if (!e.name.endsWith('.feature')) continue;
            for (const line of fs.readFileSync(full, 'utf8').split(/\r?\n/).filter(l => l.trim().startsWith('@')))
                for (const [, id] of line.matchAll(/@feature:(\S+)/g)) found.push([path.relative(ROOT, full).replaceAll('\\', '/'), id]);
        }
    };
    for (const dir of folders) if (fs.existsSync(dir)) walk(dir);
    return found;
}

/** A .feature's tag that names no feature of the catalog. */
export function unknownFeatureTags(catalog, tags = featureFileTags()) {
    const ids = new Set(catalog.features.map(f => f.id));
    return tags.filter(([, id]) => !ids.has(id)).map(([file, id]) => `${file}: @feature:${id} names no feature`);
}

/** Every test file's tags: its "// @features:" line and "@feature:<id>" in its titles; a .feature's tags. */
function taggedTests() {
    const found = new Map();
    for (const [file, id] of featureFileTags())
        found.set(id, [...(found.get(id) ?? []), file]);
    const walk = dir => {
        for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
            const full = path.join(dir, e.name);
            if (e.isDirectory()) { if (!['node_modules', 'dist', '.git'].includes(e.name)) walk(full); continue; }
            if (!/\.(m?js|ts)$/.test(e.name)) continue;
            const text = fs.readFileSync(full, 'utf8');
            const ids = [...(TAG_LINE.exec(text)?.[0].slice('// @features: '.length).split(/,\s*/) ?? []),
                ...[...text.matchAll(/@feature:([a-z0-9-]+)/g)].map(m => m[1])];
            for (const id of ids) found.set(id, [...(found.get(id) ?? []), path.relative(ROOT, full).replaceAll('\\', '/')]);
        }
    };
    for (const dir of ['packages/bpmn-server/test', 'apps/testSampleApp/test', 'apps/testSampleApp/examples'])
        if (fs.existsSync(path.join(ROOT, dir))) walk(path.join(ROOT, dir));
    return found;
}

function page(catalog, tagged) {
    const link = (ref, text) => {
        const [file, anchor] = ref.split('#');
        if (file.startsWith('docs/docs/')) return `[${text}](${path.relative('docs/docs', file).replaceAll('\\', '/')}${anchor ? '#' + anchor : ''})`;
        return `[${text}](${REPO}${encodeURI(file)})`;
    };
    const short = ref => path.basename(ref.split('#')[0]).replace(/\.(test\.)?(m?js|ts|md|pug)$/, '');
    const lines = ['# Features', '',
        'What bpmn-server, bpmn-web and bpmn-client do, area by area, each with where it is documented, its code and its tests.',
        'Made from [docs/features.yaml](' + REPO + 'docs/features.yaml) by `npm run features`; edit the catalog, not this page.', '',
        '**In the model** says what in a model\'s XML shows the feature is used: an element (`bpmn:userTask`), an attribute',
        '(`[camunda:formKey]`), one inside another (`bpmn:startEvent > bpmn:timerEventDefinition`). To find the models that use',
        'a feature: `npm run features -- --models <folder> --feature <id>`; without `--feature`, each model and the features it uses.', ''];
    const gaps = { tests: [], docs: [], unsupported: [] };
    for (const [area, title] of Object.entries(catalog.areas)) {
        const features = catalog.features.filter(f => f.area === area);
        if (!features.length) continue;
        // an area whose features appear in models has a column for where: what to search a model's XML for
        const inModels = features.some(f => f.xml?.length);
        lines.push(`## ${title}`, '', `| Feature | What it does |${inModels ? ' In the model |' : ''} Docs | Tests | Code |`, `|---|---|${inModels ? '---|' : ''}---|---|---|`);
        for (const f of features) {
            const status = f.status === 'not-supported' ? ' **(not supported)**' : f.status === 'partial' ? ' *(partial)*' : '';
            const tests = [...new Set([...(f.tests ?? []), ...(f.examples ?? []), ...(tagged.get(f.id) ?? [])])];
            const xml = inModels ? ` ${(f.xml ?? []).map(m => '`' + m.replaceAll('|', '\\|') + '`').join(', ')} |` : '';
            lines.push(`| **${f.name}**${status} | ${f.what}${f.note ? ` *${f.note}*` : ''} |${xml} ${(f.docs ?? []).map(d => link(d, short(d))).join(', ')} | ${tests.map(t => link(t, short(t))).join(', ')} | ${(f.code ?? []).map(c => link(c, short(c))).join(', ')} |`);
            if (f.status === 'not-supported') gaps.unsupported.push(f.name);
            else {
                if (!tests.length) gaps.tests.push(f.name);
                if (!(f.docs ?? []).length) gaps.docs.push(f.name);
            }
        }
        lines.push('');
    }
    lines.push('## Gaps', '',
        `- **Not supported (loaded, not run):** ${gaps.unsupported.join(', ') || 'none'}`,
        `- **No test:** ${gaps.tests.join(', ') || 'none'}`,
        `- **No documentation:** ${gaps.docs.join(', ') || 'none'}`, '');
    return lines.join('\n');
}

/** --models <path> [--feature <id>] [--json]: the models that use a feature, and where; or each model's features. */
function searchCommand(argv) {
    const value = name => { const i = argv.indexOf(name); return i < 0 ? undefined : argv[i + 1]; };
    const where = value('--models'), feature = value('--feature');
    if (!where || where.startsWith('--')) { console.error('--models <a model file, or a folder of them>'); process.exit(2); }
    let found;
    try { found = searchModels(where, feature); }
    catch (error) { console.error(error.message); process.exit(2); }
    if (argv.includes('--json')) { console.log(JSON.stringify(found, null, 2)); return; }
    if (!found.length) { console.log(feature ? `No model at ${where} uses ${feature}` : `No models at ${where}`); return; }
    for (const { file, features } of found) {
        console.log(file);
        if (!features.length) console.log('    (no feature of the catalog found)');
        for (const f of features) console.log(`    ${f.id.padEnd(22)} ${f.at.join(', ')}`);
    }
    if (feature) console.log(`${found.length} model(s) use ${feature}`);
}

if (process.argv[1] === fileURLToPath(import.meta.url) && process.argv.includes('--models')) searchCommand(process.argv);
else if (process.argv[1] === fileURLToPath(import.meta.url)) {
    const catalog = load();
    const { problems, byTest } = check(catalog);
    problems.push(...unknownFeatureTags(catalog));
    for (const p of problems) console.error('  ' + p);
    if (process.argv.includes('--check')) {
        const stale = tagsUpToDate(byTest);
        for (const f of stale) console.error(`  ${f}: its "// @features:" line is not the catalog's (npm run features)`);
        // bpmn-web's copy of the markers (its Design dashboard's filter)
        if (!fs.existsSync(MARKERS_FILE) || fs.readFileSync(MARKERS_FILE, 'utf8') !== markersSource(catalog)) {
            const problem = `${path.relative(ROOT, MARKERS_FILE)}: not the catalog's markers (npm run features)`;
            console.error('  ' + problem);
            stale.push(problem);
        }
        // the settings page's tables, from the settings schema (scripts/settings.mjs)
        for (const p of settingsPage(true)) { console.error('  ' + p); stale.push(p); }
        console.log(`${catalog.features.length} features; ${problems.length + stale.length} problem(s)`);
        process.exit(problems.length + stale.length ? 1 : 0);
    }
    if (problems.length) process.exit(1);
    writeTags(byTest);
    fs.writeFileSync(PAGE, page(catalog, taggedTests()));
    fs.writeFileSync(MARKERS_FILE, markersSource(catalog));
    settingsPage();
    console.log(`${catalog.features.length} features; ${byTest.size} test files tagged; ${path.relative(ROOT, PAGE)} written`);
}
