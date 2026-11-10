import FS from 'node:fs';
import path from 'node:path';
import { layoutModel } from '../layout.js';
import { bpmnToSvg } from '../bpmnToSvg.js';
import { isSafeModelName } from '../middleware/modelName.js';
import { checkModel } from '../../runtime/modelVerification.js';
import { loadFeatureText, saveFeatureText } from '../../testing/scenarios.js';
import { designDisabled, canDesign } from '../../userAccess/roles.js';
import { formOf } from './tasks.js';

/*
 * The model operations, once (docs/design/api-v3.md): what a client building workflows does with models and their
 * tests (an AI agent, a script, the editor): read, check, save (laid out when it has no diagram), the .feature, run
 * it. /api2 (routes/modelApi.ts) and /api/v3 map them. Changing models and running tests is design: off with
 * DISABLE_DESIGN; a user's token designs only if its user may; the service key is the installation's own.
 */

export class ModelError extends Error {
    constructor(readonly status: number, message: string, readonly code: string, readonly details?: object) { super(message); }
}

/** A model's check: valid, its errors and warnings, each with its code, element and message. */
const asCheck = check => ({
    valid: check.errors.length === 0,
    errors: check.errors.map(i => ({ code: i.code, element: i.elementId ?? null, message: i.message })),
    warnings: check.warnings.map(i => ({ code: i.code, element: i.elementId ?? null, message: i.message })),
});

/** Cucumber's JSON of a run: each scenario, passed or not, and where and why it stopped. */
export function summarize(results) {
    const scenarios = [];
    for (const feature of results ?? [])
        for (const element of feature.elements ?? []) {
            const failed = element.steps.find(step => step.result.status === 'failed');
            const skipped = element.tags?.some(tag => tag.name === '@skip');
            scenarios.push({
                name: element.name,
                status: skipped ? 'skipped' : failed ? 'failed' : 'passed',
                ...(failed ? { failedStep: `${failed.keyword}${failed.name}`.trim(), error: failed.result.error_message } : {}),
                instances: element.instances ?? [],
            });
        }
    const count = status => scenarios.filter(s => s.status === status).length;
    return { passed: count('passed'), failed: count('failed'), skipped: count('skipped'), scenarios };
}

const listOf = value => Array.isArray(value) ? value : typeof value === 'string' && value.trim() ? value.split(',').map(v => v.trim()) : [];

export class ModelOperations {
    constructor(readonly server) { }

    private get definitions() { return this.server.definitions; }
    private featureFile(name: string) { return path.join(this.server.configuration.definitionsPath, `${name}.feature`); }

    /** A model's name, safe as a file name, or a 400. */
    assertName(name: string) {
        if (!isSafeModelName(name)) throw new ModelError(400, 'Invalid model name', 'BAD_NAME');
    }
    /** Design may go on: it is on, and this user may (the service key may; a user's token if its user designs). */
    assertDesign(user, { service = false } = {}) {
        if (designDisabled()) throw new ModelError(404, 'Design is turned off on this server (DISABLE_DESIGN)', 'DESIGN_OFF');
        if (!service && !canDesign(user))
            throw new ModelError(403, `${user.userName} may not design models: a designer's or an administrator's is needed`, 'DESIGN_REFUSED');
    }

    async exists(name: string) {
        return (await this.definitions.getList()).some(m => (typeof m === 'string' ? m : m.name) === name);
    }
    private async assertExists(name: string) {
        this.assertName(name);
        if (!(await this.exists(name))) throw new ModelError(404, `No model ${name}`, 'MODEL_NOT_FOUND');
    }

    async list(): Promise<string[]> {
        return (await this.definitions.getList()).map(m => (typeof m === 'string' ? m : m.name));
    }

    /** A model: its BPMN XML, and its .feature if it has one. */
    async get(name: string) {
        await this.assertExists(name);
        const file = this.featureFile(name);
        return { name, source: await this.definitions.getSource(name), feature: FS.existsSync(file) ? FS.readFileSync(file, 'utf8') : null };
    }

    /**
     * Saves a model, checked first: one with errors is refused (422 MODEL_INVALID, its check) unless force. One
     * without a diagram is laid out, as the editor's import does. { name, created, laidOut, valid, errors, warnings }.
     */
    async save(user, name: string, source: unknown, { force = false } = {}) {
        this.assertName(name);
        if (typeof source !== 'string' || !source.trim())
            throw new ModelError(400, 'source, the model\'s BPMN XML, is required', 'BAD_SOURCE');
        const check = asCheck(await checkModel(this.server, name, source, 'warn'));
        if (!check.valid && !force)
            throw new ModelError(422, `${name} has ${check.errors.length} error(s): not saved`, 'MODEL_INVALID', check);
        let xml = source, laidOut = false;
        if (!/<(\w+:)?BPMNDiagram[\s>]/.test(xml)) {
            try { xml = await layoutModel(xml); laidOut = true; } catch { /* saved as it is */ }
        }
        if (laidOut) check.warnings = check.warnings.filter(w => w.code !== 'no-diagram');
        let svg = null;
        try { svg = await bpmnToSvg(xml); } catch { /* no picture */ }
        const created = !(await this.exists(name));
        await this.definitions.save(name, xml, svg, null, user.userName);
        return { name, created, laidOut, ...check };
    }

    /** A model checked, without saving it: the source given, else the saved model. */
    async verify(name: string, source?: unknown) {
        this.assertName(name);
        let xml = source;
        if (typeof xml !== 'string') {
            await this.assertExists(name);
            xml = await this.definitions.getSource(name);
        }
        const check = asCheck(await checkModel(this.server, name, xml as string, 'warn'));
        // saved through the API, a model without a diagram is laid out: say so
        for (const w of check.warnings)
            if (w.code === 'no-diagram') w.message += ' Saved through the API, it is laid out: nothing to do.';
        return { name, ...check };
    }

    async feature(name: string) {
        this.assertName(name);
        return { name, text: await loadFeatureText(name) };
    }

    /** The model's tests: a .feature that reads as tests; with base, only over the text it came from. */
    async saveFeature(name: string, text: unknown, base?: unknown) {
        this.assertName(name);
        if (typeof text !== 'string') throw new ModelError(400, 'text, the .feature file, is required', 'BAD_TEXT');
        const stopped = await saveFeatureText(name, text, typeof base === 'string' ? base : await loadFeatureText(name));
        if (stopped) throw new ModelError(stopped.status, stopped.error, stopped.status === 409 ? 'FEATURE_CHANGED' : 'BAD_FEATURE');
        return { name, saved: true };
    }

    /** Runs the model's tests (its .feature, or the one given) in the engine: each scenario's result. */
    async test(name: string, given?: unknown, { raw = false } = {}) {
        this.assertName(name);
        const file = this.featureFile(name);
        const source = typeof given === 'string' ? given : FS.existsSync(file) ? FS.readFileSync(file, 'utf8') : null;
        if (source === null)
            throw new ModelError(404, `No ${name}.feature: write one, or give it as source`, 'NO_FEATURE');
        let results;
        try { results = await this.server.engine.call('runFeature', source, `${name}.feature`); }
        catch (error) { throw new ModelError(422, String(error?.message ?? error), 'TEST_FAILED_TO_RUN'); }
        return { name, ...summarize(results), ...(raw ? { results } : {}) };
    }

    async rename(name: string, newName: unknown) {
        await this.assertExists(name);
        if (typeof newName !== 'string') throw new ModelError(400, 'newName is required', 'BAD_NAME');
        this.assertName(newName);
        if (await this.exists(newName)) throw new ModelError(409, `There is a model ${newName} already`, 'MODEL_EXISTS');
        await this.definitions.renameModel(name, newName);
        return { name: newName, renamedFrom: name };
    }

    async remove(name: string) {
        await this.assertExists(name);
        await this.definitions.deleteModel(name);
        return { deleted: name };
    }

    /** One element of a model: its type, name, documentation, form, and who it is for. */
    async element(name: string, elementId: string) {
        await this.assertExists(name);
        const definition = await this.definitions.load(name);
        const node = definition.getNodeById(elementId);
        if (!node) throw new ModelError(404, `No element ${elementId} in ${name}`, 'ELEMENT_NOT_FOUND');
        const attrs = node.def?.$attrs ?? {};
        const documentation = (node.def?.documentation ?? []).map(d => d.text).join('\n') || undefined;
        return {
            id: node.id, type: node.type, name: node.name ?? null, documentation,
            lane: node.lane || undefined,
            assignment: {
                assignee: attrs['camunda:assignee'], candidateUsers: listOf(attrs['camunda:candidateUsers']),
                candidateGroups: listOf(attrs['camunda:candidateGroups']),
            },
            form: formOf(definition, elementId),
        };
    }
}
