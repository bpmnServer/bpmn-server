/*
 * A test set as a .feature file (docs/design/gherkin-testing.md): the editors' tests, written as Gherkin and read back.
 *
 * What the Test tab can show and edit is read into its form: a start, steps, checks. A scenario it can not (a @stub, a @find,
 * an expression, an outline) is kept as it was written, as `source`, and goes on running as it is.
 */
import { AstBuilder, GherkinClassicTokenMatcher, Parser } from '@cucumber/gherkin';
import { IdGenerator } from '@cucumber/messages';

const NAME = '("[^"]+"|[^\\s"]+)';
const OP = '(is not|is|<>|>=|<=|=|>|<)';
const VALUE = '(.+)';
const INSTANCE = ':instance';
const RESULT = ':result';
const unquoted = (name: string) => name.replace(/^"|"$/g, '');
const words = (op: string) => ({ '=': 'is', '<>': 'is not' })[op ?? '='] ?? op;
const symbol = (word: string) => ({ is: '=', 'is not': '<>' })[word] ?? word;

function ref(name: string) {
    if (!name || name.includes('"')) throw new Error(`'${name}' can not be named in a .feature`);
    return /\s/.test(name) ? `"${name}"` : name;
}
/** A path of a value: a.b.c, with a part in quotes when it is not a plain word. */
const pathText = (path: string) => String(path).split('.').map(part => /^\w+$/.test(part) ? part : `"${part}"`).join('.');
const pathOf = (text: string) => text.replace(/"/g, '');
const json = (value) => JSON.stringify(value ?? null);
const cell = (text: string) => text.replace(/\\/g, '\\\\').replace(/\|/g, '\\|').replace(/\n/g, '\\n');

function table(data, indent: string): string[] {
    return Object.entries(data ?? {}).map(([key, value]) => `${indent}| ${cell(key)} | ${cell(json(value))} |`);
}

/** A cell's value as written here: JSON; anything else (an expression, a bare word) is not this form. */
function cellValue(text: string) {
    return JSON.parse(text);
}

function rowsOf(step): Record<string, any> {
    const data = {};
    for (const { cells } of step.dataTable?.rows ?? []) {
        if (cells.length !== 2) throw new Error('a table of two columns');
        data[cells[0].value] = cellValue(cells[1].value);
    }
    return data;
}

// ---- a model's scenarios

function checkText(check, element?: string) {
    if (check.kind === 'status') return `${INSTANCE} status is ${json(check.status)}`;
    if (check.kind === 'node') {
        const count = check.count !== undefined && check.count !== null && check.count !== '' ? ` ${Number(check.count)} times` : '';
        return `${INSTANCE} passed element:${ref(check.node)}${count}${check.status ? ` with status ${json(check.status)}` : ''}`;
    }
    if (check.kind === 'data') return `${INSTANCE} data.${pathText(check.path)} ${words(check.op)} ${json(check.value)}`;
    throw new Error(`no check of kind '${check.kind}'${element ? ` after ${element}` : ''}`);
}

function readCheck(text: string) {
    const passed = new RegExp(`^${INSTANCE} passed element:${NAME}(?: (\\d+) times)?(?: with status (".*"))?$`).exec(text);
    if (passed) {
        const check: any = { kind: 'node', node: unquoted(passed[1]) };
        if (passed[2] !== undefined) check.count = Number(passed[2]);
        if (passed[3] !== undefined) check.status = JSON.parse(passed[3]);
        return check;
    }
    const status = new RegExp(`^${INSTANCE} status is (".*")$`).exec(text);
    if (status) return { kind: 'status', status: JSON.parse(status[1]) };
    const data = new RegExp(`^${INSTANCE} data\\.((?:[\\w.]|"[^"]*")+) ${OP} ${VALUE}$`).exec(text);
    if (data) return { kind: 'data', path: pathOf(data[1]), op: symbol(data[2]), value: JSON.parse(data[3]) };
    throw new Error(`not a check of this form: ${text}`);
}

function scenarioLines(model: string, scenario, tags: string[]): string[] {
    const lines = tags.length ? [`  ${tags.join(' ')}`] : [];
    lines.push(`  Scenario: ${scenario.name}`);
    const start = scenario.start ?? {};
    const checks = scenario.checks ?? [];
    const at = (when) => checks.filter(when);
    for (const check of at(c => c.at === 'after'))
        if (!(scenario.steps ?? []).some(s => s.element === check.step))
            throw new Error(`the check after '${check.step}' names no step of ${scenario.name}`);
    lines.push(`    When @start process:${ref(model)}${start.startNodeId ? ` at element:${ref(start.startNodeId)}` : ''}${start.only ? ' only' : ''} as ${INSTANCE}`);
    lines.push(...table(start.data, '      '));
    for (const check of at(c => c.at === 'start')) lines.push(`    And @check ${checkText(check)}`);
    for (const step of scenario.steps ?? []) {
        lines.push(`    And @invoke element:${ref(step.element)} in ${INSTANCE}`);
        lines.push(...table(step.data, '      '));
        for (const check of at(c => c.at === 'after' && c.step === step.element)) lines.push(`    And @check ${checkText(check, step.element)}`);
    }
    at(c => (c.at ?? 'end') === 'end').forEach((check, i) => lines.push(`    ${i ? 'And' : 'Then'} @check ${checkText(check)}`));
    return lines;
}

/** A scenario in the form the Test tab edits; throws when it is not that. */
function readScenario(ast) {
    if (ast.examples?.length) throw new Error('an outline');
    const scenario: any = { name: ast.name, start: { data: {} }, steps: [], checks: [] };
    let started = false, last = null, atEnd = false;
    for (const step of ast.steps) {
        const text = step.text.trim();
        if (step.docString) throw new Error('a doc string');
        const start = new RegExp(`^@start process:${NAME}(?: at element:${NAME})?( only)? as ${INSTANCE}$`).exec(text);
        const invoke = new RegExp(`^@invoke element:${NAME} in ${INSTANCE}$`).exec(text);
        const check = /^@check (.+)$/.exec(text);
        if (start && !started) {
            started = true;
            scenario.start = { data: rowsOf(step) };
            if (start[2]) scenario.start.startNodeId = unquoted(start[2]);
            if (start[3]) scenario.start.only = true;
        }
        else if (invoke && started && !atEnd) {
            last = unquoted(invoke[1]);
            scenario.steps.push({ element: last, data: rowsOf(step) });
        }
        else if (check && started) {
            atEnd = atEnd || step.keyword.trim() === 'Then';
            const read = readCheck(check[1]);
            const placed = atEnd ? read : last ? { ...read, at: 'after', step: last } : { ...read, at: 'start' };
            // a check after a step is written after each time it comes; it is one check
            if (!scenario.checks.some(c => JSON.stringify(c) === JSON.stringify(placed))) scenario.checks.push(placed);
        }
        else throw new Error(`not a step of this form: ${text}`);
    }
    if (!started) throw new Error('no @start');
    return scenario;
}

// ---- a decision's tests

function decisionLines(decision: string, test, tags: string[]): string[] {
    const lines = tags.length ? [`  ${tags.join(' ')}`] : [];
    lines.push(`  Scenario: ${test.name}`);
    lines.push(`    When @evaluate decision:${ref(test.decision ?? decision)} as ${RESULT}`);
    lines.push(...table(test.data, '      '));
    (test.checks ?? []).forEach((check, i) => {
        const what = check.kind === 'matches' ? 'rules' : `output.${pathText(check.path)}`;
        lines.push(`    ${i ? 'And' : 'Then'} @check ${RESULT} ${what} ${words(check.op)} ${json(check.value)}`);
    });
    return lines;
}

function readDecisionTest(ast, decision: string) {
    if (ast.examples?.length) throw new Error('an outline');
    const test: any = { name: ast.name, data: {}, checks: [] };
    let started = false;
    for (const step of ast.steps) {
        const text = step.text.trim();
        if (step.docString) throw new Error('a doc string');
        const evaluate = new RegExp(`^@evaluate decision:${NAME} as ${RESULT}$`).exec(text);
        const check = new RegExp(`^@check ${RESULT} (rules|output\\.(?:[\\w.]|"[^"]*")+) ${OP} ${VALUE}$`).exec(text);
        if (evaluate && !started) {
            started = true;
            test.data = rowsOf(step);
            if (unquoted(evaluate[1]) !== decision) test.decision = unquoted(evaluate[1]);
        }
        else if (check && started) {
            const value = JSON.parse(check[3]);
            test.checks.push(check[1] === 'rules' ? { kind: 'matches', op: symbol(check[2]), value }
                : { kind: 'output', path: pathOf(check[1].slice('output.'.length)), op: symbol(check[2]), value });
        }
        else throw new Error(`not a step of this form: ${text}`);
    }
    if (!started) throw new Error('no @evaluate');
    return test;
}

// ---- the file

const OWN_TAGS = ['@generated'];

/** The file of a set: `name` is the model's or the decision's. */
export function writeFeature(name: string, list: any[], { decision = false } = {}): string {
    const featureTags = [...new Set(list.flatMap(item => item.featureTags ?? []))];
    const background = list.find(item => item.background)?.background;
    const parts = [...(featureTags.length ? [featureTags.join(' ')] : []), `Feature: ${name}`];
    if (background) parts.push('', background);
    for (const item of list) {
        parts.push('');
        if (item.source !== undefined) { parts.push(item.source); continue; }
        const tags = [...(item.generated ? ['@generated'] : []), ...(item.tags ?? [])];
        parts.push(...(decision ? decisionLines(name, item, tags) : scenarioLines(name, item, tags)));
    }
    return parts.join('\n') + '\n';
}

const parser = () => new Parser(new AstBuilder(IdGenerator.uuid()), new GherkinClassicTokenMatcher());

/** Those lines of the file, as written: from a child's first tag to where the next one starts. */
function slice(lines: string[], from: number, to: number) {
    return lines.slice(from - 1, to - 1).join('\n').replace(/\s+$/, '');
}

const firstLine = (node) => Math.min(node.location.line, ...(node.tags ?? []).map(tag => tag.location.line));

/** A set's list, from its file. */
export function readFeature(text: string, { decision = false, name = '' } = {}): any[] {
    const { feature } = parser().parse(text);
    if (!feature) return [];
    const lines = text.replace(/\r\n/g, '\n').split('\n');
    const children = feature.children ?? [];
    const featureTags = (feature.tags ?? []).map(tag => tag.name);
    const shared = featureTags.length ? { featureTags } : {};
    const startOf = (child) => firstLine(child.background ?? child.rule ?? child.scenario);
    const endOf = (i: number) => i + 1 < children.length ? startOf(children[i + 1]) : lines.length + 1;
    const backgroundAt = children.findIndex(child => child.background);
    const background = backgroundAt >= 0 ? slice(lines, startOf(children[backgroundAt]), endOf(backgroundAt)) : undefined;
    const list = [];
    children.forEach((child, i) => {
        if (child.background) return;
        const source = slice(lines, startOf(child), endOf(i));
        if (child.rule) return list.push({ name: child.rule.name, source, ...shared, ...(background ? { background } : {}) });
        const tags = child.scenario.tags.map(tag => tag.name);
        try {
            // with a background, its steps are part of each scenario: only as written
            if (background) throw new Error('a background');
            const item = decision ? readDecisionTest(child.scenario, name) : readScenario(child.scenario);
            const others = tags.filter(tag => !OWN_TAGS.includes(tag));
            list.push({ ...item, ...(tags.includes('@generated') ? { generated: true } : {}), ...(others.length ? { tags: others } : {}), ...shared });
        }
        catch {
            list.push({ name: child.scenario.name, source, ...(tags.length ? { tags } : {}), ...shared, ...(background ? { background } : {}) });
        }
    });
    return list;
}

/** A scenario kept as written, as a feature to run by itself. */
export function sourceFeature(item): string {
    return [...(item.featureTags?.length ? [item.featureTags.join(' ')] : []), `Feature: ${item.name}`, '', ...(item.background ? [item.background, ''] : []), item.source, ''].join('\n');
}
