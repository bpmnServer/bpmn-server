/*
 * Test scenarios for models, run from the model editor's Test tab.
 *
 * A scenario starts the model with some data, then completes the elements that wait (user tasks, receive tasks,
 * catching and boundary events) one after another with the data each step gives: the data decides the
 * branches a gateway takes, and the order of the steps decides which of several waiting elements (an
 * event-based gateway's events, a boundary timer, parallel tasks) happens first. Its checks are optional, each
 * at the end or after a step: the instance's status, a node (how many times it ran, in what status), a data
 * value (=, <>, >, <, >=, <=). The older `expect` (status, data, passes, avoids) is read as checks at the end.
 *
 * Scenarios are kept as files beside the models (below: the test sets). Instances a run starts are real
 * instances, with ids starting test-, so they can be opened on the instance page.
 */
import mongoose from 'mongoose';
import fs from 'node:fs';
import path from 'node:path';
import { randomUUID } from 'node:crypto';
import vm from 'node:vm';
import { runSandboxed, SandboxScriptHandler } from 'bpmn-server';
import { rationaleSteps } from './rationale.js';
import { readFeature, sourceFeature, writeFeature } from './featureFiles.js';

export interface ScenarioStep {
    /** the waiting element to complete */
    element: string;
    data?: Record<string, any>;
}

/** A check of a run: at its start (once it has started), at its end, or after a step (each time that step's element is completed). */
export interface Check {
    at?: 'start' | 'end' | 'after';
    /** at 'after': the step's element, by id or name */
    step?: string;
    kind: 'status' | 'node' | 'data';
    /** status: the instance's; node: its items' (optional) */
    status?: string;
    /** node: the element, by id or name */
    node?: string;
    /** node: how many times it ran (with status: in that status); none: at least once */
    count?: number | null;
    /** data: the value's path in the instance data (a.b.c) */
    path?: string;
    op?: '=' | '<>' | '>' | '<' | '>=' | '<=';
    value?: any;
}

export interface Scenario {
    name: string;
    /** only: the element at startNodeId by itself (a task tested alone): the run ends once it is done */
    start?: { startNodeId?: string; only?: boolean; data?: Record<string, any> };
    steps?: ScenarioStep[];
    checks?: Check[];
    expect?: { status?: string; data?: Record<string, any>; passes?: string[]; avoids?: string[] };
}

// ---- the test sets: a model's scenarios, a decision's tests
//
// Files in the models folder, beside what they test:
//   <model>.feature         a model's scenarios
//   <decision>.dmn.feature  a decision's tests
// (featureFiles.ts). A <model>.tests.json, the JSON they were kept in before, is read until it is converted (convertTestFiles).
// A scenario's last run is not in them: it is its test instance, tagged in the database with { process, scenario, run }.
// A decision's test runs no instance: its runs stay with the page that ran them.

const DECISION = 'decision:';
let modelsFolder: () => string = () => process.env.DEFINITIONS_PATH || path.resolve('processes');

/** Where the test sets are: the server's models folder (WebApp sets it). */
export function useTestsFolder(folder: () => string) {
    modelsFolder = folder;
}

/** A set's name in its files: `<model>`, or `<decision>.dmn` for decision:<decision>. */
function baseName(key: string) {
    const decision = key.startsWith(DECISION);
    const name = decision ? key.slice(DECISION.length) : key;
    if (!name || name.startsWith('.') || /[\\/]/.test(name))
        throw new Error(`not a model or decision name: ${name}`);
    return decision ? `${name}.dmn` : name;
}
/** The file of a set before it was a .feature. */
const fileName = (key: string) => `${baseName(key)}.tests.json`;
const featureName = (key: string) => `${baseName(key)}.feature`;
const setName = (key: string) => key.startsWith(DECISION) ? key.slice(DECISION.length) : key;

function readJson(file: string) {
    try {
        return JSON.parse(fs.readFileSync(file, 'utf8'));
    }
    catch (error) {
        if (error.code === 'ENOENT') return undefined;
        throw new Error(`${file}: ${error.message}`);
    }
}

/** Written whole or not at all; removed when there is nothing to keep. */
function writeText(file: string, text: string | undefined) {
    if (text === undefined) {
        fs.rmSync(file, { force: true });
        return;
    }
    fs.mkdirSync(path.dirname(file), { recursive: true });
    const temporary = `${file}.${process.pid}.tmp`;
    fs.writeFileSync(temporary, text);
    fs.renameSync(temporary, file);
}

/** A set's list as its file has it: its .feature, or else its JSON from before. */
function readSet(folder: string, key: string): any[] {
    const file = path.join(folder, featureName(key));
    if (fs.existsSync(file)) {
        try {
            return readFeature(fs.readFileSync(file, 'utf8'), { decision: key.startsWith(DECISION), name: setName(key) });
        }
        catch (error) {
            throw new Error(`${file}: ${error.message}`);
        }
    }
    const set = readJson(path.join(folder, fileName(key)));
    return set?.scenarios ?? set?.tests ?? [];
}

/** The JSON of a set, once its .feature holds it. */
function setAsideJson(folder: string, key: string) {
    const file = path.join(folder, fileName(key));
    if (!fs.existsSync(file)) return;
    fs.rmSync(file);
}

/** A list as what its file has to hold: the fields of a test, not what a run of it left on it. */
function definitions(key: string, all: any[]) {
    // a name as Gherkin reads it
    const list = all.map(item => ({ ...item, name: String(item.name).trim() }));
    if (key.startsWith(DECISION))
        return list.map(({ name, decision, data, checks, source, featureTags, background, tags }) => source !== undefined
            ? { name, source, featureTags, background, tags }
            : { name, ...(decision && decision !== setName(key) ? { decision } : {}), data: data ?? {}, checks: (checks ?? []).map(({ what, ok, actual, ...check }) => check), featureTags, tags });
    return list.map(({ name, start, steps, checks, expect, generated, source, featureTags, background, tags }) => source !== undefined
        ? { name, source, featureTags, background, tags }
        : {
            name,
            start: { data: start?.data ?? {}, ...(start?.startNodeId ? { startNodeId: start.startNodeId } : {}), ...(start?.only ? { only: true } : {}) },
            steps: (steps ?? []).map(({ element, data }) => ({ element, data: data ?? {} })),
            checks: [...expectChecks(expect), ...(checks ?? [])].map(({ what, ok, actual, ...check }: any) => {
                if (check.at === 'end') delete check.at;
                return check;
            }),
            ...(generated ? { generated: true } : {}), featureTags, tags,
        });
}

const sorted = value => Array.isArray(value) ? value.map(sorted)
    : value && typeof value === 'object' ? Object.fromEntries(Object.keys(value).filter(k => value[k] !== undefined).sort().map(k => [k, sorted(value[k])]))
        : value;
const sameJson = (a, b) => JSON.stringify(sorted(a)) === JSON.stringify(sorted(b));

/**
 * Every set still in JSON becomes a .feature, when it reads back as the same tests; the JSON is removed.
 * Those that would not are left as they are, and are read as before. Returns what was done.
 */
export async function convertTestFiles(): Promise<{ converted: string[]; left: { file: string; why: string }[] }> {
    const folder = modelsFolder();
    const converted = [], left = [];
    for (const file of fs.existsSync(folder) ? fs.readdirSync(folder).filter(f => f.endsWith('.tests.json')) : []) {
        const decision = file.endsWith('.dmn.tests.json');
        const name = file.slice(0, -(decision ? '.dmn.tests.json' : '.tests.json').length);
        const key = decision ? DECISION + name : name;
        if (fs.existsSync(path.join(folder, featureName(key)))) continue;
        try {
            const set = readJson(path.join(folder, file));
            const list = definitions(key, set?.scenarios ?? set?.tests ?? []);
            const text = writeFeature(name, list, { decision });
            const back = definitions(key, readFeature(text, { decision, name }));
            if (back.some(item => item.source !== undefined)) throw new Error('a test did not read back in its form');
            if (!sameJson(back, list)) throw new Error('it did not read back the same');
            writeText(path.join(folder, featureName(key)), text);
            setAsideJson(folder, key);
            converted.push(file);
        }
        catch (error) {
            left.push({ file, why: error.message });
        }
    }
    return { converted, left };
}

/** The list saved under a key (a model's scenarios, a decision's tests). */
export async function loadTestSet<T = Scenario>(key: string): Promise<T[]> {
    return readSet(modelsFolder(), key);
}

export async function saveTestSet(key: string, list: any[], userName?: string): Promise<void> {
    const folder = modelsFolder();
    const items = definitions(key, list);
    // the same tests, as after a run: the file stays as it is, with what was typed in it
    if (!sameAsFile(folder, key, items))
        writeText(path.join(folder, featureName(key)), items.length ? writeFeature(setName(key), items, { decision: key.startsWith(DECISION) }) : undefined);
    setAsideJson(folder, key);
}

/** The model's tagged test instances: each scenario's runs, newest first. */
export async function withRuns(server, model: string, scenarios: any[]) {
    const tagged = await server.dataStore.findInstances({ 'tag.process': model }, { projection: { id: 1, tag: 1 } });
    const newestFirst = tagged.map(({ id, tag }) => ({ scenario: tag.scenario, run: { instanceId: id, ...tag.run } }))
        .sort((a, b) => String(b.run.at).localeCompare(String(a.run.at)));
    return scenarios.map(scenario => {
        const runs = newestFirst.filter(one => one.scenario === String(scenario.name).trim()).map(one => one.run);
        return runs.length ? { ...scenario, runs } : scenario;
    });
}

/** The scenarios' runs as tags on their test instances. The instances of a scenario no longer there go with it. */
export async function saveRuns(server, model: string, scenarios: any[]) {
    const names = new Set(scenarios.map(scenario => String(scenario.name).trim()));
    for (const scenario of scenarios)
        for (const { instanceId, ...run } of scenario.runs ?? [])
            if (String(instanceId).startsWith('test-'))
                await server.engine.tagInstance(instanceId, { process: model, scenario: String(scenario.name).trim(), run });
    const tagged = await server.dataStore.findInstances({ 'tag.process': model }, { projection: { id: 1, tag: 1 } });
    for (const { id, tag } of tagged)
        if (!names.has(tag.scenario) && String(id).startsWith('test-'))
            await server.engine.deleteInstances({ id });
}

/** Whether the set's .feature already holds these tests. */
function sameAsFile(folder: string, key: string, items: any[]) {
    if (!fs.existsSync(path.join(folder, featureName(key)))) return false;
    try {
        return sameJson(definitions(key, readSet(folder, key)), items);
    }
    catch {
        return false;
    }
}

const unixLines = (text: string) => text.replace(/\r\n/g, '\n');

/** A model's tests as text, for Edit as text: its .feature as it is, comments and all. It is not parsed: a file that does not parse can be corrected. */
export async function loadFeatureText(model: string): Promise<string> {
    const folder = modelsFolder();
    const file = path.join(folder, featureName(model));
    return fs.existsSync(file) ? fs.readFileSync(file, 'utf8') : writeFeature(setName(model), definitions(model, readSet(folder, model)));
}

/**
 * Saves a model's .feature as typed, if it reads as tests and the file is still the one the text came from (base).
 * Returns what stopped it.
 */
export async function saveFeatureText(model: string, text: string, base: string): Promise<{ status: number; error: string } | undefined> {
    let list;
    try {
        list = readFeature(text, { name: setName(model) });
    }
    catch (error) {
        return { status: 400, error: error.message };
    }
    if (!/^\s*Feature:/m.test(text))
        return { status: 400, error: 'A test file starts with Feature: and a name' };
    const problems = checkScenarios(list);
    if (problems.length)
        return { status: 400, error: problems.join('; ') };
    if (unixLines(await loadFeatureText(model)) !== unixLines(base))
        return { status: 409, error: 'The file changed since it was opened: Cancel, open it again and redo the change' };
    const folder = modelsFolder();
    writeText(path.join(folder, featureName(model)), text);
    setAsideJson(folder, model);
}

export async function loadScenarios(model: string): Promise<Scenario[]> {
    return loadTestSet(model);
}

export async function saveScenarios(model: string, scenarios: Scenario[], userName?: string): Promise<void> {
    await saveTestSet(model, scenarios, userName);
}

/** Every test set of the models folder: its key, how many tests, when last saved. */
async function ownSets() {
    const folder = modelsFolder();
    const files = fs.existsSync(folder) ? fs.readdirSync(folder).filter(f => /\.(feature|tests\.json)$/.test(f) && !f.endsWith('.engine.feature')) : [];
    const keys = new Map<string, string>();
    for (const file of files) {
        const base = file.replace(/\.(feature|tests\.json)$/, '');
        const key = base.endsWith('.dmn') ? DECISION + base.slice(0, -'.dmn'.length) : base;
        // a .feature, where there are both
        if (file.endsWith('.feature') || !keys.has(key)) keys.set(key, file);
    }
    return [...keys].map(([key, file]) => ({ key, count: readSet(folder, key).length, updatedAt: fs.statSync(path.join(folder, file)).mtime }));
}

/** Each model's scenarios in summary: how many, when last saved. */
export async function listScenarioSets(): Promise<{ model: string; count: number; updatedAt?: Date }[]> {
    return (await ownSets()).filter(s => !s.key.startsWith(DECISION)).map(({ key, ...s }) => ({ model: key, ...s }));
}

/** Each decision's tests in summary, as {@link listScenarioSets}. */
export async function listDecisionTestSets(): Promise<{ decision: string; count: number; updatedAt?: Date }[]> {
    return (await ownSets()).filter(s => s.key.startsWith(DECISION)).map(({ key, ...s }) => ({ decision: key.slice(DECISION.length), ...s }));
}

/** The key a decision's tests are saved under. */
export const decisionTestKey = (decision: string) => DECISION + decision;

/**
 * Test sets were kept in MongoDB (wf_test_scenarios) before 3.5: each one there whose file is not made yet is
 * written to the models folder; a guest's, from when there were guests, is not. The collection is
 * left as it was. Returns how many were written.
 */
export async function migrateScenarioSets(): Promise<number> {
    const ScenarioSet = (mongoose.models.TestScenarios as any) || mongoose.model('TestScenarios',
        new mongoose.Schema({ model: String, scenarios: Array }), 'wf_test_scenarios');
    let written = 0;
    for (const doc of await ScenarioSet.find({}).lean()) {
        if (/^guest-[0-9a-f]{12}\//.test(doc.model) || fs.existsSync(path.join(modelsFolder(), fileName(doc.model))) || !(doc.scenarios ?? []).length)
            continue;
        try {
            await saveTestSet(doc.model, doc.scenarios);
            written++;
        }
        catch (error) {
            console.error(`test set '${doc.model}' not moved to a file: ${error.message}`);
        }
    }
    return written;
}

/** Whether a body is a list of scenarios; the reasons when it is not. */
export function checkScenarios(scenarios): string[] {
    if (!Array.isArray(scenarios))
        return ['scenarios must be a list'];
    const problems = [];
    scenarios.forEach((s, i) => {
        const at = `scenario ${i + 1}${s?.name ? ` (${s.name})` : ''}`;
        if (!s || typeof s !== 'object') return problems.push(`${at} is not an object`);
        if (typeof s.name !== 'string' || !s.name.trim()) problems.push(`${at} has no name`);
        if (s.start?.data !== undefined && (typeof s.start.data !== 'object' || Array.isArray(s.start.data))) problems.push(`${at}: start data must be an object`);
        (s.steps ?? []).forEach((step, j) => {
            if (!step?.element) problems.push(`${at}, step ${j + 1}: no element`);
            if (step?.data !== undefined && (typeof step.data !== 'object' || Array.isArray(step.data))) problems.push(`${at}, step ${j + 1}: data must be an object`);
        });
        if (s.checks !== undefined && !Array.isArray(s.checks)) problems.push(`${at}: checks must be a list`);
        (Array.isArray(s.checks) ? s.checks : []).forEach((check, j) => {
            if (!['status', 'node', 'data'].includes(check?.kind)) problems.push(`${at}, check ${j + 1}: kind must be status, node or data`);
            if (check?.op !== undefined && !OPS.includes(check.op)) problems.push(`${at}, check ${j + 1}: op must be one of ${OPS.join(' ')}`);
        });
    });
    return problems;
}

/** What the Test tab shows of an instance. */
export function summarize(instance) {
    if (!instance) return null;
    return {
        id: instance.id,
        name: instance.name,
        status: instance.status,
        data: instance.data,
        items: (instance.items ?? []).map(i => ({
            id: i.id, seq: i.seq, elementId: i.elementId, name: i.name, type: i.type, status: i.status,
            startedAt: i.startedAt, endedAt: i.endedAt, assignee: i.assignee
        })),
        logs: (instance.logs ?? []).slice(-300).map(l => typeof l === 'string' ? l : `${' '.repeat(Math.max(0, l.level ?? 0))}${l.message}`),
        // why the engine took its path: the log's decision entries, in order
        decisions: (instance.logs ?? []).filter(l => l?.type === 'decision').map(l => l.message),
        // the Rationale by the steps that drove the instance: what each caused, and why
        steps: rationaleSteps(instance.logs, instance.items, instance.startedAt),
    };
}

/**
 * The waiting items a scenario completes: a user task, a receive task (its message arriving) and an event (a message,
 * signal or timer arriving). Other items wait on the process itself (a joining gateway for
 * its other branches, a sub-process or call activity for what runs inside) and complete by themselves;
 * completing one by hand would force the process past where it waits.
 */
export function isStep(item): boolean {
    return item?.status === 'wait' && (item.type === 'bpmn:UserTask' || item.type === 'bpmn:ReceiveTask' || String(item.type).includes('Event'));
}

const clone = value => JSON.parse(JSON.stringify(value ?? {}));
const message = err => String(err?.message ?? err);

/** For the lists of work and instances: not the Test tab's instances (they open by their id, as any other). */
export const notATest = { id: { $not: { $regex: '^test-' } } };

/**
 * Start an instance of the model for a test (the Test tab's recording, and runScenario): its flags keep save points
 * (the debugger restarts it at a step) and its log (the decisions the engine took), whatever the data store's settings.
 */
export async function startTest(server, model: string, startNodeId: string | undefined, data, userName?: string, only = false) {
    if (only && !startNodeId)
        throw new Error('A task by itself: which task (startNodeId)?');
    const flags = { savePoints: true, saveLogs: true, ...(only ? { only: startNodeId } : {}) };
    const execution = await server.engine.start(model, clone(data), startNodeId || null, userName ?? null,
        { instanceId: `test-${randomUUID()}`, flags });
    return execution.instance;
}

/** Complete a waiting item of a test instance with data. */
export async function completeTest(server, instanceId: string, itemId: string, data, userName?: string) {
    const saved = await findTest(server, instanceId);
    const item = saved?.items?.find(i => i.id === itemId);
    if (item && !isStep(item))
        throw new Error(`${item.name || item.elementId} completes by itself (${item.type.replace('bpmn:', '')} waiting on the process); it is not a step`);
    const execution = await server.engine.invoke({ id: instanceId, 'items.id': itemId }, clone(data), userName ?? null);
    return execution.instance;
}

export async function findTest(server, instanceId: string) {
    // null when there is none (findInstance throws)
    const [instance] = await server.dataStore.findInstances({ id: instanceId }, 'full');
    return instance ?? null;
}

/** Does `actual` have every value of `expected` (objects compared field by field, the rest as JSON)? */
function contains(actual, expected): boolean {
    if (expected && typeof expected === 'object' && !Array.isArray(expected))
        return actual && typeof actual === 'object' && Object.entries(expected).every(([k, v]) => contains(actual[k], v));
    return JSON.stringify(actual) === JSON.stringify(expected);
}

const OPS = ['=', '<>', '>', '<', '>=', '<='];

/** The older `expect`, as checks at the end. */
export function expectChecks(expect: Scenario['expect']): Check[] {
    if (!expect) return [];
    return [
        ...(expect.status ? [{ kind: 'status' as const, status: expect.status }] : []),
        ...Object.entries(expect.data ?? {}).map(([path, value]) => ({ kind: 'data' as const, path, op: '=' as const, value })),
        ...(expect.passes ?? []).map(node => ({ kind: 'node' as const, node })),
        ...(expect.avoids ?? []).map(node => ({ kind: 'node' as const, node, count: 0 })),
    ];
}

/** Every check of a scenario: its checks, and its older expect. */
export const scenarioChecks = (scenario: Scenario): Check[] => [...expectChecks(scenario?.expect), ...(scenario?.checks ?? [])];

/** A value at a path of the data: a.b.c, items.0.name */
export function valueAt(data, path: string) {
    return String(path ?? '').split('.').filter(Boolean).reduce((value, key) => value == null ? undefined : value[key], data);
}

/** Equal: numbers as numbers (5 and "5"), objects field by field (the expected ones), the rest as JSON. */
function same(actual, expected): boolean {
    const numbers = [actual, expected].every(v => v !== '' && v !== null && typeof v !== 'boolean' && typeof v !== 'object' && Number.isFinite(Number(v)));
    if (numbers && (typeof actual === 'number' || typeof expected === 'number'))
        return Number(actual) === Number(expected);
    return contains(actual, expected);
}

export function compare(actual, op: string, expected): boolean {
    switch (op ?? '=') {
        case '=': return same(actual, expected);
        case '<>': return !same(actual, expected);
    }
    if (actual === undefined || actual === null) return false;
    const numeric = Number.isFinite(Number(actual)) && Number.isFinite(Number(expected));
    const [a, b] = numeric ? [Number(actual), Number(expected)] : [String(actual), String(expected)];
    return op === '>' ? a > b : op === '<' ? a < b : op === '>=' ? a >= b : op === '<=' ? a <= b : false;
}

/** What a check says, in words. */
export function describeCheck(check: Check): string {
    const where = check.at === 'after' ? `after ${check.step}: ` : check.at === 'start' ? 'at the start: ' : '';
    if (check.kind === 'status') return `${where}status is ${check.status}`;
    if (check.kind === 'node') {
        const status = check.status ? `, ${check.status},` : '';
        if (!hasCount(check)) return `${where}passes ${check.node}${status ? ` (${check.status})` : ''}`;
        if (Number(check.count) === 0) return `${where}does not pass ${check.node}${status ? ` (${check.status})` : ''}`;
        return `${where}passes ${check.node}${status} ${check.count} time${Number(check.count) === 1 ? '' : 's'}`;
    }
    const op = check.op ?? '=';
    return `${where}data.${check.path} ${op === '=' ? 'is' : op === '<>' ? 'is not' : op} ${JSON.stringify(check.value)}`;
}

const hasCount = (check: Check) => check.count !== undefined && check.count !== null && check.count !== ('' as any);

/** A check on an instance: { what, ok, actual, check }. A node's actual is how many times it ran, in that status. */
export function evaluateCheck(check: Check, instance) {
    const what = describeCheck(check);
    if (check.kind === 'status')
        return { what, ok: instance?.status === check.status, actual: instance?.status, check };
    if (check.kind === 'node') {
        const runs = (instance?.items ?? []).filter(i => (i.elementId === check.node || i.name === check.node) && (!check.status || i.status === check.status));
        const ok = hasCount(check) ? runs.length === Number(check.count) : runs.length > 0;
        return { what, ok, actual: runs.length, check };
    }
    const actual = valueAt(instance?.data, check.path);
    return { what, ok: compare(actual, check.op, check.value), actual, check };
}

/** The checks due at the start, at the end, or after a step on an element (by id or name). */
export function checksAt(checks: Check[], at: 'start' | 'end' | { element: string; name?: string }, instance) {
    return checks
        .filter(c => at === 'start' ? c.at === 'start' : at === 'end' ? (c.at ?? 'end') === 'end' : c.at === 'after' && (c.step === at.element || (at.name && c.step === at.name)))
        .map(c => evaluateCheck(c, instance));
}

/** The older call: what `expect` and `checks` ask at the end. */
export function checkExpectations(expect: Scenario['expect'], instance, checks: Check[] = []) {
    return checksAt([...expectChecks(expect), ...checks], 'end', instance);
}

/** A value as JSON can show it: undefined, functions, cycles and big values described instead. */
function shown(value) {
    if (value === undefined) return { type: 'undefined' };
    if (typeof value === 'function') return { type: 'function', text: String(value).slice(0, 200) };
    const seen = new WeakSet();
    const text = JSON.stringify(value, (key, v) => {
        if (typeof v === 'object' && v !== null) {
            if (seen.has(v)) return '[circular]';
            seen.add(v);
        }
        return typeof v === 'function' ? `[function ${v.name || ''}]` : v;
    }, 2);
    return text.length > 20000 ? { type: typeof value, text: text.slice(0, 20000) + '\n…' } : { type: Array.isArray(value) ? 'array' : typeof value, json: JSON.parse(text) };
}

/**
 * The debugger's Evaluate: a JavaScript expression run against a copy of a test instance, to look at its values:
 * `data` (its data), `items` (its items), `instance` (its summary). With `return`, statements (a function's body).
 * It gets copies, so it changes nothing, and stops after a second. node:vm is not a security boundary: this is for
 * designers (the /model routes), as the scripts in their models are; with scripts in a sandbox it runs in QuickJS.
 */
export async function evaluateOnTest(server, instanceId: string, expression: string) {
    if (typeof expression !== 'string' || !expression.trim())
        throw new Error('an expression is required, e.g. data.amount * 2');
    const instance = await findTest(server, instanceId);
    if (!instance) throw new Error(`no test instance ${instanceId}`);
    const summary = summarize(instance);
    const sandbox = { data: clone(instance.data), items: clone(summary.items), instance: clone({ ...summary, logs: undefined }) };
    const body = expression.trim().replace(/;\s*$/, '');
    const code = /\breturn\b/.test(body) ? `(() => { ${body} })()` : `(${body})`;
    if (server.scriptHandler instanceof SandboxScriptHandler) {
        // in QuickJS, like the models' scripts (node:vm is not a security boundary)
        const { result } = await runSandboxed(sandbox, /return/.test(body) ? body : `return (${body});`, { name: 'evaluate', timeLimit: 1000 });
        return shown(result);
    }
    const value = vm.runInNewContext(code, sandbox, { timeout: 1000, filename: 'evaluate' });
    return shown(await Promise.resolve(value));
}

/** Change a test instance's data (the Test tab's debugger): under its lock, saved as a new version. */
export async function setTestData(server, instanceId: string, data) {
    if (!data || typeof data !== 'object' || Array.isArray(data))
        throw new Error('the data must be an object');
    const locker = server.dataStore.locker;
    await locker.lock(instanceId);
    try {
        const loaded = await server.dataStore.loadInstance(instanceId);
        if (!loaded) throw new Error(`no instance ${instanceId}`);
        loaded.instance.data = clone(data);
        await server.dataStore.saveInstance(loaded.instance);
    }
    finally {
        await locker.release(instanceId);
    }
    return findTest(server, instanceId);
}

/**
 * The debugger's Restart here: the test instance goes back to an item (engine.restart, with rewind, from the save
 * point its flags keep where the item waited): a step waits again, another element runs again; what came after it is gone.
 * With `data`, the instance's data is replaced first (the variables as they are to be at that point).
 */
export async function restartTest(server, instanceId: string, itemId: string, data?, userName?: string) {
    if (data !== undefined)
        await server.engine.call('setTestData', instanceId, data);
    const execution = await server.engine.restart({ id: instanceId, 'items.id': itemId }, {}, userName ?? null, { rewind: true });
    return execution.instance;
}

/** Run a scenario from outside the engine: all of it in there. Without an engine it is a run that failed, saying so. */
export async function runScenarioInEngine(server, model: string, scenario: Scenario, userName?: string) {
    try {
        return await server.engine.call('runScenario', model, scenario, userName);
    }
    catch (err) {
        return { name: scenario.name, ok: false, error: `Running failed: ${message(err)}`, steps: [], checks: [], instance: null };
    }
}

/** A scenario kept as it was written: as a feature, the result in the form of the others'. */
async function runWritten(server, scenario) {
    const { runFeature } = await import('./gherkin.js');
    let elements;
    try {
        [{ elements }] = await runFeature(server, sourceFeature(scenario), scenario.name);
    }
    catch (err) {
        return { name: scenario.name, ok: false, error: message(err), steps: [], checks: [], instance: null };
    }
    const failed = elements.flatMap(element => element.steps).find(step => step.result.status === 'failed');
    const [instanceId] = elements.flatMap(element => element.instances);
    return {
        name: scenario.name, ok: !failed, error: failed ? `${failed.name}: ${failed.result.error_message}` : null, steps: [], checks: [],
        instance: instanceId ? summarize(await findTest(server, instanceId)) : null,
    };
}

/** Run a scenario: start, complete each step's element (with its checks after it), check the end. */
export async function runScenario(server, model: string, scenario: Scenario, userName?: string) {
    if ((scenario as any).source !== undefined) return runWritten(server, scenario);
    const steps = [];
    const all = scenarioChecks(scenario);
    const checks = [];
    let instance, error = null;
    try {
        instance = await startTest(server, model, scenario.start?.startNodeId, scenario.start?.data, userName, !!scenario.start?.only);
    }
    catch (err) {
        return { name: scenario.name, ok: false, error: `Starting failed: ${message(err)}`, steps, checks: [], instance: null };
    }
    checks.push(...checksAt(all, 'start', instance));
    for (const [index, step] of (scenario.steps ?? []).entries()) {
        const waiting = (instance.items ?? []).filter(isStep);
        const item = waiting.find(i => i.elementId === step.element);
        if (!item) {
            steps.push({ index, element: step.element, ok: false, error: waiting.length
                ? `${step.element} is not waiting; waiting: ${[...new Set(waiting.map(i => i.elementId))].join(', ')}`
                : `${step.element} is not waiting; the instance is ${instance.status}` });
            error = 'A step could not be done';
            break;
        }
        try {
            instance = await completeTest(server, instance.id, item.id, step.data, userName);
            steps.push({ index, element: step.element, ok: true });
            checks.push(...checksAt(all, { element: item.elementId, name: item.name }, instance));
        }
        catch (err) {
            steps.push({ index, element: step.element, ok: false, error: message(err) });
            error = `Completing ${step.element} failed`;
            // the instance as saved: what ran before the failure
            instance = (await findTest(server, instance.id).catch(() => null)) ?? instance;
            break;
        }
    }
    checks.push(...checksAt(all, 'end', instance));
    return {
        name: scenario.name,
        ok: !error && checks.every(c => c.ok),
        error, steps, checks,
        instance: summarize(instance),
    };
}
