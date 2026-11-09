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
import { fileURLToPath } from 'node:url';

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
 * V8 reports offsets in the code that ran, and every process must agree on them for their data to merge; tsx changes what it loads.
 * A dynamic import() gains a call on its line and the file an inline source map: that is put back here. Its CommonJS hook rewrites
 * a whole file, which can't be put back: test:scenarios loads tsx/esm for that, and a file found that way is an error, as the report
 * would be wrong without saying so.
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
        const maps = coverage['source-map-cache'] ?? {};
        coverage.result = coverage.result.filter(script => script.url.startsWith('file:') && PACKAGE_CODE.test(script.url));
        for (const script of coverage.result) {
            const text = textOf(script.url);
            if (Math.max(...script.functions.map(fn => fn.ranges[0].endOffset)) <= text.length) continue;
            const lines = text.split('\n').map(line => line.replace(/\r$/, ''));
            const changed = maps[script.url]?.lineLengths.filter((length, index) => length !== lines[index]?.length).length ?? Infinity;
            // the lines with an import(), and the source map's at the end
            if (changed > text.split('import(').length + 1) {
                rewritten.add(script.url);
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
        coverage['source-map-cache'] = Object.fromEntries(Object.entries(maps).filter(([url]) => PACKAGE_CODE.test(url)));
        fs.writeFileSync(name, JSON.stringify(coverage));
    }
    if (rewritten.size) throw new Error(`Rewritten when they loaded, so their coverage can't be merged:\n${[...rewritten].join('\n')}`);
}

function report() {
    const status = run(['node', '"node_modules/c8/bin/c8.js"', 'report', '--all', `--temp-directory "${raw}"`, `--reports-dir "${output}"`,
        '--reporter=html --reporter=lcovonly --reporter=json-summary --exclude-after-remap',
        '--include "packages/*/src/**" --include "packages/*/dist/**"',
        // what builds and maintains the packages, not what they ship
        '--exclude "packages/*/src/scripts/**" --exclude "packages/bpmn-server/src/arch-map.ts" --exclude "**/*.d.ts"'].join(' '));
    if (status !== 0) throw new Error('The report failed');
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
const { code, under } = report();
keepSummaries(code, !reportOnly && !only && !failed.length);
for (const name of failed) console.error(`The suite ${name} failed`);
for (const message of under) console.error(message);
process.exit(failed.length || under.length ? 1 : 0);
