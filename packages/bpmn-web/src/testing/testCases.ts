/**
 * Test cases (docs/docs/environments.md#test-cases): each scenario's last run, its case, saved as a file beside the
 * models, `test-cases/<model>/<scenario>.json`, when its run is saved (saveRuns: the Test tab, the Design page's Run
 * tests). In development and test the case is also in the database, as any other; the files go with the models to
 * production, which runs no tests and shows them from there, read-only.
 *
 * A file holds the case as it ran (its items, logs, data, tokens), the model's source then, and its fingerprint: a
 * case whose model has changed since is shown as out of date.
 */
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

export const TEST_CASES_FOLDER = 'test-cases';
const FORMAT = 'owf-test-case';

export interface TestCaseFile {
    format: typeof FORMAT;
    version: 1;
    model: string;
    scenario: string;
    /** when it ran, and how it came out */
    ranAt: string;
    ok: boolean;
    error?: string | null;
    /** sha256 of the model's .bpmn it ran against */
    modelHash: string;
    /** the case, as the engine kept it */
    instance: any;
    /** the model's source it ran against: its diagram, even after the model changed */
    source: string;
}

/** A scenario's name as a file name: what a path can't hold replaced, at most 100 characters. */
export function caseFileName(scenario: string): string {
    const name = String(scenario).trim().replace(/[^\w .()-]+/g, '_').replace(/\s+/g, ' ').slice(0, 100).trim();
    return (name || 'scenario') + '.json';
}

export const fingerprint = (source: string) => crypto.createHash('sha256').update(source ?? '').digest('hex');

const folderOf = (modelsFolder: string, model: string) => path.join(modelsFolder, TEST_CASES_FOLDER, model);

/**
 * The scenarios' last runs written as files, each with its case (`findCase`: the case by its id, from the store):
 * a scenario without a run keeps its file; a file whose scenario is gone is removed.
 */
export async function saveTestCases(modelsFolder: string, model: string, scenarios: any[], findCase: (id: string) => Promise<any>) {
    const bpmn = path.join(modelsFolder, model + '.bpmn');
    if (!fs.existsSync(bpmn)) return;
    const source = fs.readFileSync(bpmn, 'utf8');
    const folder = folderOf(modelsFolder, model);
    const kept = new Set<string>();
    for (const scenario of scenarios) {
        const name = String(scenario.name ?? '').trim();
        if (!name) continue;
        const file = caseFileName(name);
        kept.add(file);
        const last = [...(scenario.runs ?? [])].sort((a, b) => String(b.at).localeCompare(String(a.at)))[0];
        if (!last?.instanceId) continue;
        const instance = await findCase(last.instanceId).catch(() => null);
        if (!instance) continue;
        const { _id, ...plain } = instance;
        const content: TestCaseFile = {
            format: FORMAT, version: 1, model, scenario: name, ranAt: String(last.at ?? new Date().toISOString()),
            ok: last.ok !== false, error: last.error ?? null, modelHash: fingerprint(source), instance: plain, source,
        };
        fs.mkdirSync(folder, { recursive: true });
        fs.writeFileSync(path.join(folder, file), JSON.stringify(content, null, 1) + '\n');
    }
    if (fs.existsSync(folder))
        for (const file of fs.readdirSync(folder))
            if (file.endsWith('.json') && !kept.has(file)) fs.rmSync(path.join(folder, file));
}

export interface TestCaseSummary {
    model: string; scenario: string; file: string; ranAt: string; ok: boolean; error?: string | null;
    /** whether the model is as it was when it ran */
    current: boolean;
    status: string; instanceId: string;
}

/** A model's test cases, from their files: what each scenario's last run did, and whether its model has changed. */
export function listTestCases(modelsFolder: string, model: string): TestCaseSummary[] {
    const folder = folderOf(modelsFolder, model);
    if (!fs.existsSync(folder)) return [];
    const bpmn = path.join(modelsFolder, model + '.bpmn');
    const now = fs.existsSync(bpmn) ? fingerprint(fs.readFileSync(bpmn, 'utf8')) : null;
    return fs.readdirSync(folder).filter(f => f.endsWith('.json')).sort().flatMap(file => {
        const c = readFile(path.join(folder, file));
        return c ? [{ model, scenario: c.scenario, file: file.slice(0, -'.json'.length), ranAt: c.ranAt, ok: c.ok, error: c.error,
            current: c.modelHash === now, status: c.instance?.status, instanceId: c.instance?.id }] : [];
    });
}

/** The models that have test cases. */
export function modelsWithTestCases(modelsFolder: string): string[] {
    const folder = path.join(modelsFolder, TEST_CASES_FOLDER);
    return fs.existsSync(folder) ? fs.readdirSync(folder, { withFileTypes: true }).filter(e => e.isDirectory()).map(e => e.name).sort() : [];
}

/** One test case, by its file's name (without .json): the file, and whether its model is as it was; null when there is none. */
export function readTestCase(modelsFolder: string, model: string, file: string): (TestCaseFile & { current: boolean }) | null {
    if (/[\\/]|\.\./.test(model) || /[\\/]|\.\./.test(file)) return null;
    const c = readFile(path.join(folderOf(modelsFolder, model), file + '.json'));
    if (!c) return null;
    const bpmn = path.join(modelsFolder, model + '.bpmn');
    return { ...c, current: fs.existsSync(bpmn) && fingerprint(fs.readFileSync(bpmn, 'utf8')) === c.modelHash };
}

function readFile(file: string): TestCaseFile | null {
    try {
        const c = JSON.parse(fs.readFileSync(file, 'utf8'));
        return c?.format === FORMAT ? c : null;
    }
    catch {
        return null;
    }
}
