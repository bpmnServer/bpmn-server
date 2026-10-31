/*
 * Test scenarios for models, run from the model editor's Test tab.
 *
 * A scenario starts the model with some data, then completes the elements that wait (user tasks, receive tasks,
 * catching and boundary events) one after another with the data each step gives: the data decides the
 * branches a gateway takes, and the order of the steps decides which of several waiting elements (an
 * event-based gateway's events, a boundary timer, parallel tasks) happens first. What is expected at the end
 * is optional: the instance's status, values its data must have, elements it must and must not pass.
 *
 * Scenarios are kept per model in the application's MongoDB (the users' database). Instances a run starts
 * are real instances, with ids starting test-, so they can be opened on the instance page.
 */
import mongoose from 'mongoose';
import { randomUUID } from 'node:crypto';

export interface ScenarioStep {
    /** the waiting element to complete */
    element: string;
    data?: Record<string, any>;
}

export interface Scenario {
    name: string;
    start?: { startNodeId?: string; data?: Record<string, any> };
    steps?: ScenarioStep[];
    expect?: { status?: string; data?: Record<string, any>; passes?: string[]; avoids?: string[] };
}

const scenarioSchema = new mongoose.Schema({
    model: { type: String, unique: true },
    scenarios: { type: Array, default: [] },
    updatedAt: Date,
    updatedBy: String,
});
const ScenarioSet = (mongoose.models.TestScenarios as any) || mongoose.model('TestScenarios', scenarioSchema, 'wf_test_scenarios');

export async function loadScenarios(model: string): Promise<Scenario[]> {
    const doc = await ScenarioSet.findOne({ model }).lean();
    return doc?.scenarios ?? [];
}

export async function saveScenarios(model: string, scenarios: Scenario[], userName?: string): Promise<void> {
    await ScenarioSet.updateOne({ model }, { $set: { scenarios, updatedAt: new Date(), updatedBy: userName } }, { upsert: true });
}

/** Each model's scenarios in summary: how many, when and by whom last saved. */
export async function listScenarioSets(): Promise<{ model: string; count: number; updatedAt?: Date; updatedBy?: string }[]> {
    const docs = await ScenarioSet.find({}, { model: 1, scenarios: 1, updatedAt: 1, updatedBy: 1 }).lean();
    return docs.map(d => ({ model: d.model, count: (d.scenarios ?? []).length, updatedAt: d.updatedAt, updatedBy: d.updatedBy }));
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

/** Start an instance of the model for a test (the Test tab's recording, and runScenario). */
export async function startTest(server, model: string, startNodeId: string | undefined, data, userName?: string) {
    const execution = await server.engine.start(model, clone(data), startNodeId || null, userName ?? null,
        { instanceId: `test-${randomUUID()}` });
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
    return server.dataStore.findInstance({ id: instanceId }, 'full');
}

/** Does `actual` have every value of `expected` (objects compared field by field, the rest as JSON)? */
function contains(actual, expected): boolean {
    if (expected && typeof expected === 'object' && !Array.isArray(expected))
        return actual && typeof actual === 'object' && Object.entries(expected).every(([k, v]) => contains(actual[k], v));
    return JSON.stringify(actual) === JSON.stringify(expected);
}

export function checkExpectations(expect: Scenario['expect'], instance) {
    const checks = [];
    if (!expect) return checks;
    const reached = new Set((instance?.items ?? []).map(i => i.elementId));
    if (expect.status)
        checks.push({ what: `status is ${expect.status}`, ok: instance?.status === expect.status, actual: instance?.status });
    for (const [key, value] of Object.entries(expect.data ?? {}))
        checks.push({ what: `data.${key} is ${JSON.stringify(value)}`, ok: contains(instance?.data?.[key], value), actual: instance?.data?.[key] });
    for (const id of expect.passes ?? [])
        checks.push({ what: `passes ${id}`, ok: reached.has(id) });
    for (const id of expect.avoids ?? [])
        checks.push({ what: `does not pass ${id}`, ok: !reached.has(id) });
    return checks;
}

/** Run a scenario: start, complete each step's element, check what is expected. */
export async function runScenario(server, model: string, scenario: Scenario, userName?: string) {
    const steps = [];
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
        }
        catch (err) {
            steps.push({ index, element: step.element, ok: false, error: message(err) });
            error = `Completing ${step.element} failed`;
            // the instance as saved: what ran before the failure
            instance = (await findTest(server, instance.id).catch(() => null)) ?? instance;
            break;
        }
    }
    const checks = checkExpectations(scenario.expect, instance);
    return {
        name: scenario.name,
        ok: !error && checks.every(c => c.ok),
        error, steps, checks,
        instance: summarize(instance),
    };
}
