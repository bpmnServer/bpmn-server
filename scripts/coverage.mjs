// Product test coverage: runs the suites with V8 coverage and reports the packages' sources; runs the models' saved scenarios and
// reports what of each model they reach. The summaries are kept in reports/coverage (summary.md, the latest; history.jsonl, a line per
// full run); the browsable report and its data stay in coverage/.
//   npm run test:coverage                       all the suites, then the reports
//   npm run test:coverage -- --report           only the report, from the last run's data
//   npm run test:coverage -- --only=server,web  those suites only
// It fails if a suite fails, or if bpmn-server is under its bar. The browser code (modeler/src) is not measured: it runs in the UI tests' browser.
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const v8toIstanbul = require('v8-to-istanbul');
const libCoverage = require('istanbul-lib-coverage');
const libReport = require('istanbul-lib-report');
const reports = require('istanbul-reports');

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const output = path.join(root, 'coverage');
const raw = path.join(output, 'v8');
const scenarioFile = path.join(output, 'scenarios.json');
const kept = path.join(root, 'reports', 'coverage');
const SERVER_BAR = { lines: 90, functions: 90, branches: 90 };
const PACKAGE_CODE = /\/packages\/[^/]+\/(dist|src)\//;

const SUITES = {
    server: 'npm test -w bpmn-server',
    client: 'npm run test:unit -w bpmn-client',
    unit: 'npm run test:unit -w test-sample-app',
    'sample-client': 'npm run test:client -w test-sample-app',
    engine: 'npm run test:engine -w test-sample-app',
    web: 'npm run test:web -w test-sample-app',
    custom: 'npm run test:custom -w test-sample-app',
    examples: 'npm run test:examples -w test-sample-app',
    issues: 'npm run test:issues -w test-sample-app',
    scenarios: 'npm run test:scenarios -w test-sample-app',
    ui: 'npm run test:ui -w test-sample-app',
    'scenario-coverage': `npm run test:scenario-coverage -w test-sample-app -- "${scenarioFile}"`,
};

const run = (command, env = {}) => spawnSync(command, { cwd: root, stdio: 'inherit', shell: true, env: { ...process.env, ...env } }).status;

function runSuites(names) {
    fs.rmSync(raw, { recursive: true, force: true });
    fs.mkdirSync(raw, { recursive: true });
    if (run('npm run build') !== 0) throw new Error('The build failed');
    if (names.includes('ui') && run('npm run build:modeler -w bpmn-web') !== 0) throw new Error('The modeler build failed');
    return names.filter(name => {
        console.log(`\n=== ${name}`);
        return run(SUITES[name], { NODE_V8_COVERAGE: raw }) !== 0;
    });
}

/** Offsets in a file that has grown within its lines, to offsets in the file itself: the same line, the same column, inside the line. */
function offsetMapper(text, grownLengths) {
    const starts = [], ends = [], grownStarts = [];
    let at = 0, grown = 0;
    text.split('\n').forEach((line, index) => {
        const length = line.endsWith('\r') ? line.length - 1 : line.length;
        starts.push(at);
        ends.push(at + length);
        grownStarts.push(grown);
        grown += (grownLengths[index] ?? length) + line.length - length + 1;
        at += line.length + 1;
    });
    return offset => {
        let low = 0, high = grownStarts.length - 1;
        while (low < high) {
            const middle = (low + high + 1) >> 1;
            if (grownStarts[middle] <= offset) low = middle; else high = middle - 1;
        }
        return Math.min(starts[low] + offset - grownStarts[low], ends[low]);
    };
}

/**
 * One drive letter's case for a file on Windows, the root's (as c8 --all lists the files not loaded): processes started
 * from a shell in `c:\...` report `file:///c:/...`, others `file:///C:/...`, and c8 would count each file twice, once
 * covered and once not.
 */
const sameDrive = url => /^[a-zA-Z]:/.test(root) ? url.replace(/^file:\/\/\/[a-zA-Z]:/i, `file:///${root[0]}:`) : url;

/**
 * V8 reports offsets in the code that ran, and every process must agree on them for their data to merge; tsx changes what it loads.
 * A dynamic import() gains a call on its line and the file an inline source map: that is put back here. Its CommonJS hook rewrites
 * a whole file, which can't be put back: test:scenarios loads tsx/esm for that. A copy found loaded that way is left out of the
 * report, which says so: the same file loaded as a module, in that process and the others, is counted.
 */
function normalize() {
    const texts = new Map();
    const textOf = url => {
        if (!texts.has(url)) texts.set(url, fs.readFileSync(fileURLToPath(url), 'utf8'));
        return texts.get(url);
    };
    const rewritten = new Set();
    for (const file of fs.readdirSync(raw)) {
        const name = path.join(raw, file);
        const coverage = JSON.parse(fs.readFileSync(name, 'utf8'));
        // the maps' sources are file URLs too, and name the files the report counts
        const maps = Object.fromEntries(Object.entries(coverage['source-map-cache'] ?? {}).map(([url, map]) => {
            if (Array.isArray(map.data?.sources)) map.data.sources = map.data.sources.map(sameDrive);
            return [sameDrive(url), map];
        }));
        coverage.result = coverage.result.filter(script => script.url.startsWith('file:') && PACKAGE_CODE.test(script.url));
        for (const script of coverage.result) {
            script.url = sameDrive(script.url);
            const text = textOf(script.url);
            if (Math.max(...script.functions.map(fn => fn.ranges[0].endOffset)) <= text.length) continue;
            const lines = text.split('\n').map(line => line.replace(/\r$/, ''));
            const changed = maps[script.url]?.lineLengths.filter((length, index) => length !== lines[index]?.length).length ?? Infinity;
            // the lines with an import(), and the source map's at the end
            if (changed > text.split('import(').length + 1) {
                rewritten.add(script.url);
                script.rewritten = true;
                continue;
            }
            const toFile = offsetMapper(text, maps[script.url].lineLengths);
            for (const fn of script.functions)
                for (const range of fn.ranges) {
                    range.startOffset = toFile(range.startOffset);
                    range.endOffset = toFile(range.endOffset);
                }
            delete maps[script.url];
        }
        coverage.result = coverage.result.filter(script => !script.rewritten);
        coverage['source-map-cache'] = Object.fromEntries(Object.entries(maps).filter(([url]) => PACKAGE_CODE.test(url)));
        fs.writeFileSync(name, JSON.stringify(coverage));
    }
    if (rewritten.size)
        console.warn(`Left out of the report: copies tsx's CommonJS hook rewrote where they loaded, their offsets not the file's (the copies loaded as modules are counted):\n${[...rewritten].join('\n')}`);
}

/** A packages' source the report counts: not what builds and maintains the packages, nor type declarations. */
const reported = file => {
    const p = file.split(path.sep).join('/');
    return /\/packages\/[^/]+\/src\//.test(p) && !/\/packages\/[^/]+\/src\/scripts\//.test(p)
        && !p.endsWith('/packages/bpmn-server/src/arch-map.ts') && !p.endsWith('.d.ts');
};

/** The files under a folder, recursively. */
const filesUnder = dir => fs.existsSync(dir) ? fs.readdirSync(dir, { withFileTypes: true, recursive: true })
    .filter(entry => entry.isFile()).map(entry => path.join(entry.parentPath ?? entry.path, entry.name)) : [];

/**
 * Each process's data converted on its own (v8-to-istanbul, as c8 converts) and the counts added (istanbul's merge).
 * c8 merges the processes' V8 ranges first, and on this suite's data that loses counts: on Linux, the web and UI
 * suites together reported bpmn-web's lines at 69.9%, what the web suite reaches alone, where the UI suite alone
 * reached 59.2% of them and adding both gives 86.9%; merged synchronously, it overflowed the stack. Here nothing is merged
 * but counts. Then every built file once more with nothing run (c8's --all): a file no process loaded counts as untested.
 */
async function coverageMap() {
    const map = libCoverage.createCoverageMap();
    const add = async (file, sources, functions, into = map) => {
        const converter = v8toIstanbul(file, 0, sources, source => !reported(source));
        await converter.load();
        converter.applyCoverage(functions);
        into.merge(converter.toIstanbul());
    };
    let failures = 0;
    for (const name of fs.readdirSync(raw)) {
        const coverage = JSON.parse(fs.readFileSync(path.join(raw, name), 'utf8'));
        const maps = coverage['source-map-cache'] ?? {};
        for (const script of coverage.result) {
            const entry = maps[script.url];
            const sources = entry?.data ? { sourceMap: { sourcemap: entry.data },
                ...(entry.lineLengths ? { source: entry.lineLengths.map(length => ''.padEnd(length, '.')).join('\n') + '\n' } : {}) } : {};
            try { await add(fileURLToPath(script.url), sources, script.functions); }
            catch (error) { failures++; if (failures <= 5) console.warn(`Not converted: ${script.url}: ${error?.message ?? error}`); }
        }
    }
    // nothing run, for the files no process loaded: the built files (their source maps lead back to src), then any source
    // with no built file. Made apart and only added when missing: istanbul merges a file's counts statement by statement,
    // and a file read from disk need not have the statements its loaded copy had.
    const loaded = new Set(map.files().map(f => path.resolve(f)));
    const unloaded = libCoverage.createCoverageMap();
    const nothingRun = file => [{ functionName: '', isBlockCoverage: true, ranges: [{ startOffset: 0, endOffset: fs.readFileSync(file, 'utf8').length, count: 0 }] }];
    for (const dist of fs.readdirSync(path.join(root, 'packages')).map(name => path.join(root, 'packages', name, 'dist')))
        for (const file of filesUnder(dist).filter(f => f.endsWith('.js')))
            await add(file, {}, nothingRun(file), unloaded).catch(() => { });
    for (const src of fs.readdirSync(path.join(root, 'packages')).map(name => path.join(root, 'packages', name, 'src')))
        for (const file of filesUnder(src).filter(f => /\.(ts|js|mjs)$/.test(f) && reported(f) && !unloaded.files().some(u => path.resolve(u) === path.resolve(f))))
            await add(file, {}, nothingRun(file), unloaded).catch(() => { });
    for (const file of unloaded.files())
        if (!loaded.has(path.resolve(file))) map.addFileCoverage(unloaded.fileCoverageFor(file));
    if (failures) console.warn(`${failures} scripts could not be converted`);
    map.filter(file => reported(file));
    return map;
}

async function report() {
    const map = await coverageMap();
    const context = libReport.createContext({ dir: output, coverageMap: map, defaultSummarizer: 'nested' });
    for (const kind of ['html', 'lcovonly', 'json-summary'])
        reports.create(kind).execute(context);
    const summary = JSON.parse(fs.readFileSync(path.join(output, 'coverage-summary.json'), 'utf8'));
    const totals = new Map();
    for (const [file, data] of Object.entries(summary)) {
        const packageName = file.split(path.sep).join('/').match(/packages\/([^/]+)\//)?.[1];
        if (!packageName) continue;
        const total = totals.get(packageName) ?? { files: 0, lines: [0, 0], functions: [0, 0], branches: [0, 0] };
        total.files++;
        for (const metric of ['lines', 'functions', 'branches']) {
            total[metric][0] += data[metric].covered;
            total[metric][1] += data[metric].total;
        }
        totals.set(packageName, total);
    }
    const percent = ([covered, count]) => count ? 100 * covered / count : 100;
    console.log('\npackage        files  lines  functions  branches');
    for (const [name, total] of totals)
        console.log(`${name.padEnd(14)} ${String(total.files).padStart(5)}  ${percent(total.lines).toFixed(1).padStart(5)}  ${percent(total.functions).toFixed(1).padStart(9)}  ${percent(total.branches).toFixed(1).padStart(8)}`);
    console.log(`\nThe report: ${path.join(output, 'index.html')}`);
    const server = totals.get('bpmn-server');
    const code = Object.fromEntries([...totals].map(([name, total]) => [name, {
        files: total.files, lines: round(percent(total.lines)), functions: round(percent(total.functions)), branches: round(percent(total.branches)),
    }]));
    return { code, under: Object.entries(SERVER_BAR).filter(([metric, bar]) => percent(server[metric]) < bar).map(([metric, bar]) => `bpmn-server ${metric} are under ${bar}%`) };
}

const round = value => Math.round(value * 10) / 10;

/** The summaries kept in the repository: the latest as a page, and a line of totals for each full run. */
function keepSummaries(code, full) {
    const scenarios = fs.existsSync(scenarioFile) ? JSON.parse(fs.readFileSync(scenarioFile, 'utf8')) : { models: [] };
    const tested = scenarios.models.filter(m => m.scenarios);
    const sum = (list, group, key) => list.reduce((all, m) => all + m[group][key], 0);
    const share = (covered, total) => total ? round(100 * covered / total) : 0;
    const scenarioTotals = {
        models: scenarios.models.length, withScenarios: tested.length,
        scenarios: tested.reduce((all, m) => all + m.scenarios, 0), failed: tested.reduce((all, m) => all + m.failed.length, 0),
        nodes: share(sum(tested, 'nodes', 'tested'), sum(tested, 'nodes', 'total')), flows: share(sum(tested, 'flows', 'tested'), sum(tested, 'flows', 'total')),
    };
    const commit = spawnSync('git rev-parse --short HEAD', { cwd: root, shell: true, encoding: 'utf8' }).stdout.trim();
    const at = new Date().toISOString();
    const row = (...cells) => `| ${cells.join(' | ')} |`;
    const page = [
        '# Test coverage', '',
        `Written by \`npm run test:coverage\`: ${at}, at commit ${commit}. Tested lines ran during the tests; that does not say the tests checked them.`, '',
        '## The code', '',
        'The server side of each package, from all the suites. The editor\'s browser code is not measured. The browsable report is in `coverage/` after a run.', '',
        row('Package', 'Files', 'Lines', 'Functions', 'Branches'), row('---', '---:', '---:', '---:', '---:'),
        ...Object.entries(code).map(([name, c]) => row(name, c.files, `${c.lines}%`, `${c.functions}%`, `${c.branches}%`)), '',
        '## The scenarios', '',
        `What each model's saved scenarios reach, by the Test tab's rules: an element counts when a scenario that passed reached it. ${tested.length} of ${scenarios.models.length} models have scenarios.`, '',
        row('Model', 'Scenarios', 'Failed', 'Nodes', 'Flows', 'Not covered'), row('---', '---:', '---:', '---:', '---:', '---'),
        ...tested.map(m => row(m.model, m.scenarios, m.failed.length, `${m.nodes.tested} of ${m.nodes.total}`, `${m.flows.tested} of ${m.flows.total}`, m.notCovered.join(', ') || '')), '',
        ...(tested.some(m => m.failed.length) ? ['### Scenarios that failed', '', ...tested.flatMap(m => m.failed.map(f => `- **${m.model}**, ${f.name}: ${String(f.error).replace(/\s+/g, ' ')}`)), ''] : []),
        `Models with no scenarios: ${scenarios.models.filter(m => !m.scenarios).map(m => m.model).join(', ') || 'none'}.`, '',
    ].join('\n');
    fs.mkdirSync(kept, { recursive: true });
    fs.writeFileSync(path.join(kept, 'summary.md'), page);
    if (full) fs.appendFileSync(path.join(kept, 'history.jsonl'), JSON.stringify({ at, commit, code, scenarios: scenarioTotals }) + '\n');
    console.log(`Scenarios: ${scenarioTotals.withScenarios} of ${scenarioTotals.models} models have some; ${scenarioTotals.nodes}% of their nodes and ${scenarioTotals.flows}% of their flows are covered; ${scenarioTotals.failed} of ${scenarioTotals.scenarios} failed`);
    console.log(`Kept: ${path.join(kept, 'summary.md')}`);
}

const only = process.argv.find(arg => arg.startsWith('--only='))?.slice('--only='.length).split(',');
const reportOnly = process.argv.includes('--report');
const failed = reportOnly ? [] : runSuites(only ?? Object.keys(SUITES));
normalize();
const { code, under } = await report();
keepSummaries(code, !reportOnly && !only && !failed.length);
for (const name of failed) console.error(`The suite ${name} failed`);
for (const message of under) console.error(message);
process.exit(failed.length || under.length ? 1 : 0);
