/*
 * Models and their tests over the API, for a client that builds workflows (an AI agent, a script): read a model, check
 * it, create or change it, its tests as a .feature, run them, and read an instance's Rationale by step. Under /api2
 * with its key (the service account), JSON in and out. GET /api2/openapi.json describes these calls and the ones a
 * client needs with them (start, tasks, invoke).
 */
import express from 'express';
import FS from 'node:fs';
import path from 'node:path';
import { layoutProcess } from 'bpmn-auto-layout';
import { bpmnToSvg } from './bpmnToSvg.js';
import { isSafeModelName } from './middleware/modelName.js';
import { checkModel } from '../runtime/modelVerification.js';
import { loadFeatureText, saveFeatureText } from '../testing/scenarios.js';
import { rationaleSteps } from '../testing/rationale.js';
import { designDisabled } from '../userAccess/roles.js';

const handler = fn => (req, res, next) => fn(req, res).catch(next);

/** Where a person opens the model: the editor. */
const editorUrl = (req, name: string) => `${req.protocol}://${req.get('host')}/model/edit/${encodeURIComponent(name)}`;

/** A model's check, as the API answers it. */
const answerCheck = check => ({
    valid: check.errors.length === 0,
    errors: check.errors.map(i => ({ code: i.code, element: i.elementId ?? null, message: i.message })),
    warnings: check.warnings.map(i => ({ code: i.code, element: i.elementId ?? null, message: i.message })),
});

/** Cucumber's JSON of a run, as the API answers it: each scenario, passed or not, and where and why it stopped. */
function summarize(results) {
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

export function modelApi(bpmnServer) {
    const router = express.Router();
    const definitions = bpmnServer.definitions;
    const userName = () => process.env.API_SERVICE_USER_NAME || 'api';

    router.param('name', (req, res, next, value) => isSafeModelName(value) ? next() : res.status(400).json({ error: 'Invalid model name' }));
    // changing models and running their tests is design: off with DISABLE_DESIGN, as in the editor
    const design = (req, res, next) => designDisabled() ? res.status(404).json({ error: 'Design is turned off on this server (DISABLE_DESIGN)' }) : next();

    const exists = async (name: string) => (await definitions.getList()).some(m => (typeof m === 'string' ? m : m.name) === name);

    router.get('/models', handler(async (req, res) => {
        const names = (await definitions.getList()).map(m => (typeof m === 'string' ? m : m.name));
        res.json(names.map(name => ({ name, url: editorUrl(req, name) })));
    }));

    router.get('/models/:name', handler(async (req, res) => {
        const name = req.params.name;
        if (!(await exists(name))) return res.status(404).json({ error: `No model ${name}` });
        const featureFile = path.join(bpmnServer.configuration.definitionsPath, `${name}.feature`);
        res.json({ name, source: await definitions.getSource(name), feature: FS.existsSync(featureFile) ? FS.readFileSync(featureFile, 'utf8') : null,
            url: editorUrl(req, name) });
    }));

    /** Create or change a model: checked first; one with errors is not saved unless ?force=true. */
    router.put('/models/:name', design, handler(async (req, res) => {
        const name = req.params.name;
        let source = req.body?.source;
        if (typeof source !== 'string' || !source.trim()) return res.status(400).json({ error: 'source, the model\'s BPMN XML, is required' });
        const check = await checkModel(bpmnServer, name, source, 'warn');
        const answer = answerCheck(check);
        if (!answer.valid && req.query.force !== 'true')
            return res.status(422).json({ name, saved: false, ...answer });
        // as the editor's import: a model without a diagram is laid out (its warning no longer holds); the picture is drawn
        let laidOut = false;
        if (!/<(\w+:)?BPMNDiagram[\s>]/.test(source)) {
            try { source = await layoutProcess(source); laidOut = true; } catch { /* saved as it is */ }
        }
        if (laidOut) answer.warnings = answer.warnings.filter(w => w.code !== 'no-diagram');
        let svg = null;
        try { svg = await bpmnToSvg(source); } catch { /* no picture */ }
        const created = !(await exists(name));
        await definitions.save(name, source, svg, null, userName());
        res.status(created ? 201 : 200).json({ name, saved: true, created, laidOut, ...answer, url: editorUrl(req, name), urlOpensFor: 'a person signed in to the site (not the API key)' });
    }));

    /** Check a model without saving it: the source given, else the saved model. */
    router.post('/models/:name/verify', handler(async (req, res) => {
        const name = req.params.name;
        let source = req.body?.source;
        if (typeof source !== 'string') {
            if (!(await exists(name))) return res.status(404).json({ error: `No model ${name}` });
            source = await definitions.getSource(name);
        }
        const answer = answerCheck(await checkModel(bpmnServer, name, source, 'warn'));
        // saved through this API, a model without a diagram is laid out: say so
        for (const w of answer.warnings)
            if (w.code === 'no-diagram') w.message += ' Saved with PUT /models/{name}, it is laid out: nothing to do.';
        res.json({ name, ...answer });
    }));

    router.get('/models/:name/feature', handler(async (req, res) => {
        res.json({ name: req.params.name, text: await loadFeatureText(req.params.name) });
    }));

    /** The model's tests: a .feature that reads as tests; with base, only over the text it came from. */
    router.put('/models/:name/feature', design, handler(async (req, res) => {
        // text, or source as for a model
        const { base } = req.body ?? {};
        const text = req.body?.text ?? req.body?.source;
        if (typeof text !== 'string') return res.status(400).json({ error: 'text (or source), the .feature file, is required' });
        const stopped = await saveFeatureText(req.params.name, text, typeof base === 'string' ? base : await loadFeatureText(req.params.name));
        if (stopped) return res.status(stopped.status).json({ error: stopped.error });
        res.json({ name: req.params.name, saved: true });
    }));

    /** Run the model's tests (its .feature, or the one given), in the engine; each scenario's result. */
    router.post('/models/:name/test', design, handler(async (req, res) => {
        const name = req.params.name;
        const file = path.join(bpmnServer.configuration.definitionsPath, `${name}.feature`);
        const given = req.body?.source ?? req.body?.text;
        const source = typeof given === 'string' ? given : FS.existsSync(file) ? FS.readFileSync(file, 'utf8') : null;
        if (source === null) return res.status(404).json({ error: `No ${name}.feature: write one (PUT /models/${name}/feature) or give it as source` });
        try {
            const results = await bpmnServer.engine.call('runFeature', source, `${name}.feature`);
            res.json({ name, ...summarize(results), ...(req.query.raw === 'true' ? { results } : {}) });
        }
        catch (error) {
            res.status(422).json({ error: String(error?.message ?? error) });
        }
    }));

    /** An instance's status and its Rationale by step (the engine's log: each operation, its outcome, its decisions). */
    router.get('/instances/:id/rationale', handler(async (req, res) => {
        const instance = await bpmnServer.dataStore.findInstance({ id: req.params.id }, 'full').catch(() => null);
        if (!instance) return res.status(404).json({ error: `No instance ${req.params.id}` });
        res.json({ id: instance.id, name: instance.name, status: instance.status, data: instance.data,
            steps: rationaleSteps(instance.logs, instance.items, instance.startedAt) });
    }));

    return router;
}

/** The OpenAPI document of what a client building workflows calls: the calls above, and start, tasks and invoke. */
export function openApiDocument(req) {
    const json = (schema, description = 'OK') => ({ description, content: { 'application/json': { schema } } });
    const error = { type: 'object', properties: { error: { type: 'string' } } };
    const name = { name: 'name', in: 'path', required: true, schema: { type: 'string' }, description: 'The model\'s name' };
    const issue = { type: 'object', properties: { code: { type: 'string' }, element: { type: 'string', nullable: true }, message: { type: 'string' } } };
    const check = { valid: { type: 'boolean' }, errors: { type: 'array', items: issue }, warnings: { type: 'array', items: issue } };
    return {
        openapi: '3.1.0',
        info: { title: 'BPMN Server API', version: '3.6', description: `Build, check, test and run BPMN workflows. Start with ${req.protocol}://${req.get('host')}/llms.txt: this site, and how to build workflows (BPMN XML, the tests' Gherkin steps, an example). The key in x-api-key: calls run as the site's service account. Errors answer { error } (a missing or wrong key: { errors }).` },
        servers: [{ url: `${req.protocol}://${req.get('host')}/api2` }],
        components: { securitySchemes: { apiKey: { type: 'apiKey', in: 'header', name: 'x-api-key' } } },
        security: [{ apiKey: [] }],
        paths: {
            '/models': { get: { operationId: 'listModels', summary: 'The models: each its name and editor URL', responses: { 200: json({ type: 'array', items: { type: 'object', properties: { name: { type: 'string' }, url: { type: 'string' } } } }) } } },
            '/models/{name}': {
                get: { operationId: 'getModel', summary: 'A model: its BPMN XML, its .feature, its editor URL', parameters: [name],
                    responses: { 200: json({ type: 'object', properties: { name: { type: 'string' }, source: { type: 'string' }, feature: { type: 'string', nullable: true }, url: { type: 'string' } } }), 404: json(error, 'No such model') } },
                put: { operationId: 'saveModel', summary: 'Create or change a model from its BPMN XML: checked first; not saved with errors unless force=true', parameters: [name, { name: 'force', in: 'query', schema: { type: 'boolean' } }],
                    requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', required: ['source'], properties: { source: { type: 'string' } } } } } },
                    responses: { 200: json({ type: 'object', properties: { name: { type: 'string' }, saved: { type: 'boolean' }, created: { type: 'boolean' }, ...check, url: { type: 'string' } } }, 'Saved'),
                        201: json({ type: 'object' }, 'Created'), 422: json({ type: 'object', properties: { saved: { type: 'boolean' }, ...check } }, 'Not saved: it has errors'), 404: json(error, 'Design is turned off') } },
            },
            '/models/{name}/verify': { post: { operationId: 'verifyModel', summary: 'Check a model without saving it: the source given, else the saved model', parameters: [name],
                requestBody: { content: { 'application/json': { schema: { type: 'object', properties: { source: { type: 'string' } } } } } },
                responses: { 200: json({ type: 'object', properties: check }) } } },
            '/models/{name}/feature': {
                get: { operationId: 'getModelTests', summary: 'The model\'s tests, as a .feature file', parameters: [name], responses: { 200: json({ type: 'object', properties: { text: { type: 'string' } } }) } },
                put: { operationId: 'saveModelTests', summary: 'Save the model\'s tests: Gherkin with bpmn-server\'s steps (@start, @invoke, @check, @wait, @stub, ...); with base, only over that text',
                    parameters: [name], requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', properties: { text: { type: 'string', description: 'the .feature (or as source)' }, source: { type: 'string' }, base: { type: 'string' } } } } } },
                    responses: { 200: json({ type: 'object' }), 400: json(error, 'It does not read as tests'), 409: json(error, 'Changed since base') } },
            },
            '/models/{name}/test': { post: { operationId: 'runModelTests', summary: 'Run the model\'s tests (or the .feature given) in the engine: each scenario, and where and why it failed', parameters: [name],
                requestBody: { content: { 'application/json': { schema: { type: 'object', properties: { source: { type: 'string' } } } } } },
                responses: { 200: json({ type: 'object', properties: { passed: { type: 'integer' }, failed: { type: 'integer' }, skipped: { type: 'integer' },
                    scenarios: { type: 'array', items: { type: 'object', properties: { name: { type: 'string' }, status: { type: 'string', enum: ['passed', 'failed', 'skipped'] }, failedStep: { type: 'string' }, error: { type: 'string' }, instances: { type: 'array', items: { type: 'string' } } } } } } }),
                    404: json(error, 'No tests'), 422: json(error, 'The .feature does not read') } } },
            '/instances/{id}/rationale': { get: { operationId: 'getInstanceRationale', summary: 'An instance\'s status, data and Rationale by step: each operation, its outcome, and why', parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
                responses: { 200: json({ type: 'object' }), 404: json(error, 'No such instance') } } },
            '/engine/start/{name}': { post: { operationId: 'startProcess', summary: 'Start a process with its data', parameters: [name],
                requestBody: { content: { 'application/json': { schema: { type: 'object', properties: { data: { type: 'object' }, options: { type: 'object' } } } } } }, responses: { 200: json({ type: 'object' }) } } },
            '/engine/invoke': { put: { operationId: 'invokeItem', summary: 'Complete a waiting item (a task, an event) with data',
                requestBody: { content: { 'application/json': { schema: { type: 'object', properties: { query: { type: 'object' }, data: { type: 'object' } } } } } }, responses: { 200: json({ type: 'object' }) } } },
            '/tasks': { get: { operationId: 'listTasks', summary: 'Waiting tasks (its own key: API_ACTING_USER_KEY, with x-acting-user)', responses: { 200: json({ type: 'array', items: {} }) } } },
        },
    };
}
