/*
 * Models and their tests over /api2, for a client that builds workflows (an AI agent, a script): the operations of
 * routes/api/models.ts (v3 has them too), in /api2's shapes. Read a model, check it, create or change it, its tests as
 * a .feature, run them, and read an instance's Rationale by step. JSON in and out. GET /api2/openapi.json describes these calls and the ones a
 * client needs with them (start, tasks, invoke).
 */
import express from 'express';
import { isSafeModelName } from './middleware/modelName.js';
import { rationaleSteps } from '../testing/rationale.js';
import { ModelOperations, ModelError } from './api/models.js';

/** This site's address as the client used it: behind a proxy (ngrok, nginx) its scheme is the proxy's, https. */
export const originOf = req => `${String(req.get('x-forwarded-proto') ?? req.protocol).split(',')[0].trim()}://${req.get('x-forwarded-host') ?? req.get('host')}`;

/** Where a person opens the model: the editor. */
const editorUrl = (req, name: string) => `${originOf(req)}/model/edit/${encodeURIComponent(name)}`;

export function modelApi(bpmnServer) {
    const router = express.Router();
    const models = new ModelOperations(bpmnServer);
    // whom a call acts as: the door's (routes/api/door.ts): a person's AI key's person, else the service account
    const userOf = req => req.apiUser;
    // the service key is the installation's own: it designs; a person's AI key, if its person may
    const designer = (req, res, next) => { try { models.assertDesign(userOf(req), { service: !req.aiKeyHolder }); next(); } catch (error) { answerError(res, error); } };
    // /api2's errors: { error }, a model's refusal with its check
    const answerError = (res, error) => {
        if (!(error instanceof ModelError)) throw error;
        if (error.code === 'MODEL_INVALID') return res.status(422).json({ name: res.req.params.name, saved: false, ...error.details });
        res.status(error.status).json({ error: error.message });
    };
    const handler = fn => (req, res, next) => fn(req, res).catch(error => { try { answerError(res, error); } catch (other) { next(other); } });

    router.param('name', (req, res, next, value) => isSafeModelName(value) ? next() : res.status(400).json({ error: 'Invalid model name' }));

    router.get('/models', handler(async (req, res) => {
        res.json((await models.list()).map(name => ({ name, url: editorUrl(req, name) })));
    }));

    router.get('/models/:name', handler(async (req, res) => {
        res.json({ ...await models.get(req.params.name), url: editorUrl(req, req.params.name) });
    }));

    /** Create or change a model: checked first; one with errors is not saved unless ?force=true. */
    router.put('/models/:name', designer, handler(async (req, res) => {
        const saved = await models.save(userOf(req), req.params.name, req.body?.source, { force: req.query.force === 'true' });
        const { created, ...rest } = saved;
        res.status(created ? 201 : 200).json({ ...rest, saved: true, created, url: editorUrl(req, saved.name), urlOpensFor: 'a person signed in to the site (not the API key)' });
    }));

    /** Check a model without saving it: the source given, else the saved model. */
    router.post('/models/:name/verify', handler(async (req, res) => {
        res.json(await models.verify(req.params.name, req.body?.source));
    }));

    router.get('/models/:name/feature', handler(async (req, res) => {
        res.json(await models.feature(req.params.name));
    }));

    /** The model's tests: a .feature that reads as tests; with base, only over the text it came from. */
    router.put('/models/:name/feature', designer, handler(async (req, res) => {
        res.json(await models.saveFeature(req.params.name, req.body?.text ?? req.body?.source, req.body?.base));
    }));

    /** Run the model's tests (its .feature, or the one given), in the engine; each scenario's result. */
    router.post('/models/:name/test', designer, handler(async (req, res) => {
        res.json(await models.test(req.params.name, req.body?.source ?? req.body?.text, { raw: req.query.raw === 'true' }));
    }));

    /** An instance's status and its Rationale by step (the engine's log: each operation, its outcome, its decisions). */
    // a run's Rationale is the design's: test runs, and why a model went its way
    router.get('/instances/:id/rationale', designer, handler(async (req, res) => {
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
        info: { title: 'BPMN Server API', version: '3.6', description: `Build, check, test and run BPMN workflows. Start with getGuide (GET /guide, the same as ${originOf(req)}/llms.txt): this site, and how to build workflows (BPMN XML, the tests' Gherkin steps, an example). The key in x-api-key: calls run as the site's service account. Errors answer { error } (a missing or wrong key: { errors }).` },
        servers: [{ url: `${originOf(req)}/api2` }],
        components: { securitySchemes: { apiKey: { type: 'apiKey', in: 'header', name: 'x-api-key' } } },
        security: [{ apiKey: [] }],
        paths: {
            '/guide': { get: { operationId: 'getGuide', summary: 'Read first: this site (its services, groups, environment), its rules, and how to build workflows: BPMN XML, the Gherkin steps of tests, an example', security: [],
                responses: { 200: { description: 'The guide, in Markdown', content: { 'text/markdown': { schema: { type: 'string' } } } } } } },
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
