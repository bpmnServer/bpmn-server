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
import { runSandboxed } from 'bpmn-server';
import { asGuest, currentGuest, guestContext } from '../guests/guests.js';

export interface ScenarioStep {
    /** the waiting element to complete */
    element: string;
    data?: Record<string, any>;
}

/** A check of a run: at its end, or after a step (each time that step's element is completed). */
export interface Check {
    at?: 'end' | 'after';
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
    start?: { startNodeId?: string; data?: Record<string, any> };
    steps?: ScenarioStep[];
    checks?: Check[];
    expect?: { status?: string; data?: Record<string, any>; passes?: string[]; avoids?: string[] };
}

// ---- the test sets: a model's scenarios, a decision's tests
//
// Files in the models folder (a guest's, with guests), beside what they test:
//   <model>.tests.json         { "model": "<model>", "scenarios": [ ... ] }   (the format of a scenario file)
//   <decision>.dmn.tests.json  { "decision": "<decision>", "tests": [ ... ] }
// The runs the editors keep of each test are not in them (they point at instances of one server): they are in
// .runs/<model>.runs.json (.runs/<decision>.dmn.runs.json), by the test's name, and put back on load.

const DECISION = 'decision:';
let modelsFolder: () => string = () => process.env.DEFINITIONS_PATH || path.resolve('processes');

/** Where the test sets are: the server's models folder (WebApp sets it; a guest's folder in a guest's request). */
export function useTestsFolder(folder: () => string) {
    modelsFolder = folder;
}

/** A set's file name: `<model>.tests.json`, or `<decision>.dmn.tests.json` for decision:<decision>. */
function fileName(key: string) {
    const decision = key.startsWith(DECISION);
    const name = decision ? key.slice(DECISION.length) : key;
    if (!name || name.startsWith('.') || /[\\/]/.test(name))
        throw new Error(`not a model or decision name: ${name}`);
    return name + (decision ? '.dmn.tests.json' : '.tests.json');
}

/** The file of a set's runs: .runs/<model>.runs.json; one named as its set (before 3.5's release) is moved to it. */
function runsFile(folder: string, name: string) {
    const file = path.join(folder, '.runs', name.replace(/\.tests\.json$/, '.runs.json'));
    const older = path.join(folder, '.runs', name);
    if (!fs.existsSync(file) && fs.existsSync(older))
        fs.renameSync(older, file);
    return file;
}

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
function writeJson(file: string, value: any) {
    if (value === undefined) {
        fs.rmSync(file, { force: true });
        return;
    }
    fs.mkdirSync(path.dirname(file), { recursive: true });
    const temporary = `${file}.${process.pid}.tmp`;
    fs.writeFileSync(temporary, JSON.stringify(value, null, 2) + '\n');
    fs.renameSync(temporary, file);
}

/** The list saved under a key (a model's scenarios, a decision's tests), each with its runs. */
export async function loadTestSet<T = Scenario>(key: string): Promise<T[]> {
    const folder = modelsFolder(), name = fileName(key);
    const set = readJson(path.join(folder, name));
    const list = set?.scenarios ?? set?.tests ?? [];
    const runs = readJson(runsFile(folder, name)) ?? {};
    return list.map(item => runs[item.name]?.length ? { ...item, runs: runs[item.name] } : item);
}

export async function saveTestSet(key: string, list: any[], userName?: string): Promise<void> {
    const folder = modelsFolder(), name = fileName(key);
    const decision = key.startsWith(DECISION);
    const runs = {};
    const items = list.map(({ runs: kept, ...item }) => {
        if (kept?.length) runs[item.name] = kept;
        return item;
    });
    writeJson(path.join(folder, name), items.length
        ? decision ? { decision: key.slice(DECISION.length), tests: items } : { model: key, scenarios: items }
        : undefined);
    writeJson(runsFile(folder, name), Object.keys(runs).length ? runs : undefined);
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
    const files = fs.existsSync(folder) ? fs.readdirSync(folder).filter(f => f.endsWith('.tests.json')) : [];
    return files.map(file => {
        const decision = file.endsWith('.dmn.tests.json');
        const set = readJson(path.join(folder, file));
        return {
            key: decision ? DECISION + file.slice(0, -'.dmn.tests.json'.length) : file.slice(0, -'.tests.json'.length),
            count: (set?.scenarios ?? set?.tests ?? []).length,
            updatedAt: fs.statSync(path.join(folder, file)).mtime,
        };
    });
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
 * written to its models folder (a guest's to the guest's folder, when it is still there). The collection is
 * left as it was. Returns how many were written.
 */
export async function migrateScenarioSets(): Promise<number> {
    const ScenarioSet = (mongoose.models.TestScenarios as any) || mongoose.model('TestScenarios',
        new mongoose.Schema({ model: String, scenarios: Array }), 'wf_test_scenarios');
    let written = 0;
    for (const doc of await ScenarioSet.find({}).lean()) {
        const guest = /^(guest-[0-9a-f]{12})\/(.*)$/.exec(doc.model);
        const key = guest ? guest[2] : doc.model;
        const write = async () => {
            if (fs.existsSync(path.join(modelsFolder(), fileName(key))) || !(doc.scenarios ?? []).length)
                return;
            await saveTestSet(key, doc.scenarios);
            written++;
        };
        try {
            if (!guest)
                await write();
            else if (fs.existsSync(guestContext(guest[1]).folder))
                await asGuest(guestContext(guest[1]), write);
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
    };
}

/**
 * The waiting items a scenario completes, as the instance page offers them: a user task (Execute) and an event
 * (Force: a message, signal or timer arriving). Other items wait on the process itself (a joining gateway for
 * its other branches, a sub-process or call activity for what runs inside) and complete by themselves;
 * completing one by hand would force the process past where it waits.
 */
export function isStep(item): boolean {
    return item?.status === 'wait' && (item.type === 'bpmn:UserTask' || String(item.type).includes('Event'));
}

const clone = value => JSON.parse(JSON.stringify(value ?? {}));
const message = err => String(err?.message ?? err);

/**
 * Start an instance of the model for a test (the Test tab's recording, and runScenario): its flags keep save points
 * (the debugger restarts it at a step) and its log (the decisions the engine took), whatever the data store's settings.
 */
export async function startTest(server, model: string, startNodeId: string | undefined, data, userName?: string) {
    const execution = await server.engine.start(model, clone(data), startNodeId || null, userName ?? null,
        { instanceId: `test-${randomUUID()}`, flags: { savePoints: true, saveLogs: true }, tenantId: currentGuest()?.id });
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
    // a guest's: only its own (its tenant)
    const guest = currentGuest();
    // null when there is none (findInstance throws)
    const [instance] = await server.dataStore.findInstances(guest ? { id: instanceId, tenantId: guest.id } : { id: instanceId }, 'full');
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
    const where = check.at === 'after' ? `after ${check.step}: ` : '';
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

/** A check on an instance: { what, ok, actual }. */
export function evaluateCheck(check: Check, instance) {
    const what = describeCheck(check);
    if (check.kind === 'status')
        return { what, ok: instance?.status === check.status, actual: instance?.status };
    if (check.kind === 'node') {
        const runs = (instance?.items ?? []).filter(i => (i.elementId === check.node || i.name === check.node) && (!check.status || i.status === check.status));
        const ok = hasCount(check) ? runs.length === Number(check.count) : runs.length > 0;
        return { what, ok, actual: hasCount(check) && Number(check.count) > 0 ? runs.length : undefined };
    }
    const actual = valueAt(instance?.data, check.path);
    return { what, ok: compare(actual, check.op, check.value), actual };
}

/** The checks due at the end, or after a step on an element (by id or name). */
export function checksAt(checks: Check[], at: 'end' | { element: string; name?: string }, instance) {
    return checks
        .filter(c => at === 'end' ? (c.at ?? 'end') === 'end' : c.at === 'after' && (c.step === at.element || (at.name && c.step === at.name)))
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
 * designers (the /model routes), as the scripts in their models are; with configuration.demo it runs in QuickJS.
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
    if (server.configuration.demo) {
        // a public demo: in QuickJS, like the models' scripts (node:vm is not a security boundary)
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
        await setTestData(server, instanceId, data);
    const execution = await server.engine.restart({ id: instanceId, 'items.id': itemId }, {}, userName ?? null, { rewind: true });
    return execution.instance;
}

/** Run a scenario: start, complete each step's element (with its checks after it), check the end. */
export async function runScenario(server, model: string, scenario: Scenario, userName?: string) {
    const steps = [];
    const all = scenarioChecks(scenario);
    const checks = [];
    let instance, error = null;
    try {
        instance = await startTest(server, model, scenario.start?.startNodeId, scenario.start?.data, userName);
    }
    catch (err) {
        return { name: scenario.name, ok: false, error: `Starting failed: ${message(err)}`, steps, checks: [], instance: null };
    }
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
