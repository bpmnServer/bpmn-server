/*
 * Tests for decisions (DMN): the decision editor's Test tab, as the model editor's is for processes, and the
 * Design dashboard's Run.
 *
 * A decision's tests are kept per file (`<name>.dmn.xml`), with the models' scenarios (testing/scenarios.ts,
 * under decision:<name>):
 *   { name, decision?: '<decision id>' (default: the file's top decision), data: { ...inputs }, checks, runs }
 * A run evaluates the decision with the data, as a business rule task does (DMNEngine): its result is
 * { output: value } for a rule, a list of them for a multi-hit table, null when no rule matches. Its checks:
 *   { kind: 'output', path: 'approvalStatus', op: '=', value: 'Approved' }   an output (a.b, 0.name in a list)
 *   { kind: 'matches', op: '=', value: 0 }                                  how many rules matched (0: none)
 * compared as a scenario's data checks are (testing/scenarios.ts compare). A test without checks passes when the
 * decision evaluates. `runs` (the editor's history of runs) is the editor's: kept, not read here.
 */
import * as bpmnServerPackage from 'bpmn-server';
import { loadTestSet, saveTestSet, decisionTestKey, compare, valueAt } from './scenarios.js';
import { sourceFeature } from './featureFiles.js';

export interface DecisionCheck {
    kind: 'output' | 'matches';
    /** output: the output's name, or a path into the result (a.b; 0.name in a list) */
    path?: string;
    op?: '=' | '<>' | '>' | '<' | '>=' | '<=';
    value?: any;
}

export interface DecisionTest {
    name: string;
    /** a decision of the file, by id; none: the file's top decision */
    decision?: string;
    data?: Record<string, any>;
    checks?: DecisionCheck[];
    runs?: any[];
}

export interface DecisionTestResult {
    name: string;
    ok: boolean;
    decision?: string;
    result?: any;
    checks: { what: string; ok: boolean; actual?: any }[];
    /** the engine's log: the rules each decision matched */
    log: string[];
    error?: string;
}

export async function loadDecisionTests(name: string): Promise<DecisionTest[]> {
    return loadTestSet<DecisionTest>(decisionTestKey(name));
}

export async function saveDecisionTests(name: string, tests: DecisionTest[], userName?: string): Promise<void> {
    await saveTestSet(decisionTestKey(name), tests, userName);
}

const KINDS = ['output', 'matches'];

/** Whether a body is a list of decision tests; the reasons when it is not. */
export function checkDecisionTests(tests): string[] {
    if (!Array.isArray(tests))
        return ['tests must be a list'];
    const problems = [];
    tests.forEach((t, i) => {
        const at = `test ${i + 1}${t?.name ? ` (${t.name})` : ''}`;
        if (!t || typeof t !== 'object') return problems.push(`${at} is not an object`);
        if (typeof t.name !== 'string' || !t.name.trim()) problems.push(`${at} has no name`);
        if (t.data !== undefined && (t.data === null || typeof t.data !== 'object' || Array.isArray(t.data))) problems.push(`${at}: data must be an object`);
        if (t.decision !== undefined && typeof t.decision !== 'string') problems.push(`${at}: decision must be a decision's id`);
        if (t.checks !== undefined && !Array.isArray(t.checks)) problems.push(`${at}: checks must be a list`);
        (Array.isArray(t.checks) ? t.checks : []).forEach((c, j) => {
            if (!KINDS.includes(c?.kind)) problems.push(`${at}, check ${j + 1}: kind must be ${KINDS.join(' or ')}`);
        });
    });
    return problems;
}

/** How many rules a result says matched: none (null), one (an object), or the list's. */
export const matched = result => result == null ? 0 : Array.isArray(result) ? result.length : 1;

/** An output's value: at the path in the result; in a list, the given rule's (0.name), else the first that has it. */
export function outputAt(result, path: string) {
    if (Array.isArray(result) && !/^\d+(\.|$)/.test(path ?? '')) {
        const found = result.map(r => valueAt(r, path)).find(v => v !== undefined);
        return found;
    }
    return valueAt(result, path);
}

/** What a check says, in words. */
export function describeDecisionCheck(check: DecisionCheck): string {
    const op = check.op ?? '=';
    const words = op === '=' ? 'is' : op === '<>' ? 'is not' : op;
    if (check.kind === 'matches')
        return `rules matched ${words} ${JSON.stringify(check.value)}`;
    return `${check.path} ${words} ${JSON.stringify(check.value)}`;
}

/** A check on a result: { what, ok, actual }. */
export function evaluateDecisionCheck(check: DecisionCheck, result) {
    const what = describeDecisionCheck(check);
    const actual = check.kind === 'matches' ? matched(result) : outputAt(result, check.path);
    return { what, ok: compare(actual, check.op, check.value), actual };
}

/** Runs the tests from outside the engine, on its file of that name: all in there. Without an engine each failed, saying so. */
export async function runDecisionTestsInEngine(server, file: string, tests: DecisionTest[]): Promise<DecisionTestResult[]> {
    try {
        return await server.engine.call('runDecisionTests', file, tests);
    }
    catch (err) {
        return tests.map(test => ({ name: test.name, decision: test.decision, checks: [], log: [], ok: false, error: String(err?.message ?? err) }));
    }
}

/** Runs each test on the file `filePath` (as saved): one result per test, in order. */
export async function runDecisionTests(filePath: string, tests: DecisionTest[], server?): Promise<DecisionTestResult[]> {
    const DMNEngine = (bpmnServerPackage as any).DMNEngine;
    const results: DecisionTestResult[] = [];
    for (const test of tests) {
        const log: string[] = [];
        try {
            if ((test as any).source !== undefined) {
                const { runFeature } = await import('./gherkin.js');
                const [{ elements }] = await runFeature(server, sourceFeature(test), test.name);
                const failed = elements.flatMap(element => element.steps).find(step => step.result.status === 'failed');
                results.push({ name: test.name, checks: [], log, ok: !failed, ...(failed ? { error: `${failed.name}: ${failed.result.error_message}` } : {}) });
                continue;
            }
            // the engine's lines on what each decision matched (not that the file was loaded)
            const keep = line => { if (!/ loaded from /.test(line)) log.push(String(line).replace(/^\.+/, '')); };
            const engine = await new DMNEngine({ log: keep }).load(filePath, test.decision);
            if (test.decision && engine.decision.id !== test.decision)
                throw new Error(`no decision '${test.decision}' in the file`);
            const result = engine.evaluate(test.data ?? {});
            const checks = (test.checks ?? []).map(c => evaluateDecisionCheck(c, result));
            results.push({ name: test.name, decision: engine.decision.id, result, checks, log, ok: checks.every(c => c.ok) });
        }
        catch (err) {
            results.push({ name: test.name, decision: test.decision, checks: [], log, ok: false, error: String(err?.message ?? err) });
        }
    }
    return results;
}
