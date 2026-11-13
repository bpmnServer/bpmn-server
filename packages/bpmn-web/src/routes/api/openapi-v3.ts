/*
 * API v3's OpenAPI document, served at /api/v3/openapi.json (no credential needed). Each route of v3.ts is here and
 * each path here is a route: test/web/api-v3-contract.test.mjs checks both ways.
 */
const error = { $ref: '#/components/schemas/Error' };
const answer = (description: string, schema?: object) => ({ description, ...(schema ? { content: { 'application/json': { schema } } } : {}) });
const errors = (...codes: number[]) => Object.fromEntries(codes.map(code => [String(code), answer({
    400: 'The input is not right', 401: 'No credential, or an unknown, expired or revoked token', 403: 'Not this user\'s to do',
    404: 'No such thing, or not this user\'s to see', 409: 'It is not waiting, or it is someone else\'s', 422: 'The engine refused it',
}[code] ?? 'An error', error)]));
const body = (schema: object, required = false) => ({ required, content: { 'application/json': { schema } } });
const id = (name: string, description: string) => ({ name, in: 'path', required: true, schema: { type: 'string' }, description });
const page = [
    { name: 'limit', in: 'query', schema: { type: 'integer', minimum: 1, maximum: 200, default: 50 } },
    { name: 'cursor', in: 'query', schema: { type: 'string' }, description: 'A page\'s `next`' },
];
/** The pages' filter by label (docs/design/labels.md): on the data paths the models' case labels name. */
const byLabel = [
    { name: 'field', in: 'query', schema: { type: 'string' }, description: 'A value the models\' case labels show: a named one by its name (`${Client = data.clientId}` is Client), a plain one by its path\'s last name (`${data.caseId}` is caseId); none: any of them' },
    { name: 'op', in: 'query', schema: { enum: ['contains', 'is'], default: 'contains' }, description: 'contains: any case; is: exactly (a number also matches as a number)' },
    { name: 'value', in: 'query', schema: { type: 'string' } },
    { name: 'search', in: 'query', schema: { type: 'string' }, description: 'Contained in any named value' },
];
const list = (item: object) => ({ type: 'object', required: ['items'], properties: { items: { type: 'array', items: item }, next: { type: 'string', description: 'Absent on the last page' } } });
const ref = (name: string) => ({ $ref: `#/components/schemas/${name}` });
const data = { type: 'object', additionalProperties: true };
const model = { name: 'name', in: 'path', required: true, schema: { type: 'string' }, description: 'The model' };

export function openApiV3(origin: string) {
    return {
        openapi: '3.1.0',
        info: {
            title: 'BPMN Server API v3',
            version: '3',
            description: 'Every call acts as one user: a user\'s token (`Authorization: Bearer`), or the service key (`x-api-key`) for the service account. See docs/design/api-v3.md.',
        },
        servers: [{ url: `${origin}/api/v3` }],
        security: [{ token: [] }, { serviceKey: [] }],
        paths: {
            '/me': { get: { operationId: 'me', summary: 'Who this call acts as, and what they may do', responses: { 200: answer('The user', ref('Me')), ...errors(401) } } },
            '/processes/startable': { get: { operationId: 'startableProcesses', summary: 'The start events this user may use, with their forms', responses: { 200: answer('A list', list(ref('Startable'))), ...errors(401) } } },
            '/processes/{name}/start': { post: {
                operationId: 'startProcess', summary: 'Start a process as this user', parameters: [id('name', 'The model')],
                requestBody: body({ type: 'object', properties: { data, startNodeId: { type: 'string' } } }),
                responses: { 201: answer('The instance, and this user\'s first task in it', { type: 'object', properties: { instance: ref('Instance'), task: { oneOf: [ref('Task'), { type: 'null' }] } } }), ...errors(400, 401, 404) },
            } },
            '/tasks': { get: { operationId: 'listTasks', summary: 'The waiting tasks this user has a part in, oldest first; with status=completed, the ones they completed, newest first', parameters: [...page, { name: 'status', in: 'query', schema: { enum: ['waiting', 'completed'] }, description: 'completed: the latest this user completed (limit, default 10)' }, { name: 'model', in: 'query', schema: { type: 'string' }, description: 'Only this model\'s tasks; its named values for field and search' }, ...byLabel], responses: { 200: answer('A page', list(ref('Task'))), ...errors(400, 401) } } },
            '/tasks/{id}': { get: { operationId: 'getTask', summary: 'One task, with its instance\'s data and its form', parameters: [id('id', 'The task')], responses: { 200: answer('The task', ref('TaskWithForm')), ...errors(401, 404) } } },
            '/tasks/{id}/claim': { post: { operationId: 'claimTask', summary: 'The task becomes this user\'s', parameters: [id('id', 'The task')], responses: { 200: answer('The task', { type: 'object', properties: { task: ref('Task') } }), ...errors(401, 404, 409) } } },
            '/tasks/{id}/complete': { post: {
                operationId: 'completeTask', summary: 'Complete the task, recording this user', parameters: [id('id', 'The task')],
                requestBody: body({ type: 'object', properties: { data } }),
                responses: { 200: answer('The task and its instance', { type: 'object', properties: { task: ref('Task'), instance: ref('Instance') } }), ...errors(400, 401, 403, 404, 409) },
            } },
            '/instances': { get: {
                operationId: 'listInstances', summary: 'The instances this user may see, newest first',
                parameters: [{ name: 'status', in: 'query', schema: { type: 'string' } }, { name: 'name', in: 'query', schema: { type: 'string' }, description: 'Only this model\'s instances; its named values for field and search' }, ...page, ...byLabel],
                responses: { 200: answer('A page', list(ref('Instance'))), ...errors(400, 401) },
            } },
            '/instances/{id}': {
                get: { operationId: 'getInstance', summary: 'One instance: its data and items', parameters: [id('id', 'The instance')], responses: { 200: answer('The instance', ref('InstanceWithItems')), ...errors(401, 404) } },
                delete: { operationId: 'deleteInstance', summary: 'Delete it (administrators)', parameters: [id('id', 'The instance')], responses: { 200: answer('Deleted', { type: 'object', properties: { deleted: { type: 'string' } } }), ...errors(401, 403, 404) } },
            },
            '/instances/{id}/access': { get: { operationId: 'getInstanceAccess', summary: 'Who was given its tasks, and who may do what with it (administrators)', description: 'Each user task: who it was offered to, its assignee, what decided it (a policy\'s rule, or who reassigned it), its assignment as the log tells it, who completed it. While security policies are on, the case\'s policy asked for each person and role: who may see it and its data, restart it, fire its start events, and claim, complete and assign each waiting task.', parameters: [id('id', 'The instance')], responses: { 200: answer('Its assignment and access', { type: 'object', properties: { id: { type: 'string' }, name: { type: 'string' }, on: { type: 'boolean', description: 'Whether security policies decide' }, cases: { type: 'array', items: { type: 'object' } }, tasks: { type: 'array', items: { type: 'object' } } } }), ...errors(401, 403, 404) } } },
            '/instances/{id}/notifications': { get: { operationId: 'getInstanceNotifications', summary: 'What its notification policies notified: whom, with what message, delivered or kept', parameters: [id('id', 'The instance')], responses: { 200: answer('Its notifications, oldest first', { type: 'object', properties: { id: { type: 'string' }, name: { type: 'string' }, status: { type: 'string' }, items: { type: 'array', items: { type: 'object', properties: { id: { type: 'string' }, event: { type: 'string' }, elementId: { type: 'string' }, policy: { type: 'string' }, rule: { type: 'integer' }, to: { type: 'array', items: { type: 'string' } }, template: { type: 'string' }, subject: { type: 'string' }, message: { type: 'string' }, channel: { type: 'string' }, status: { type: 'string', enum: ['recorded', 'sent', 'failed'] }, error: { type: 'string' }, test: { type: 'boolean' }, createdAt: { type: 'string' } } } } } }), ...errors(401, 404) } } },
            '/instances/{id}/rationale': { get: { operationId: 'getInstanceRationale', summary: 'Why it went the way it did, step by step', parameters: [id('id', 'The instance')], responses: { 200: answer('Its steps', { type: 'object', properties: { id: { type: 'string' }, name: { type: 'string' }, status: { type: 'string' }, data, steps: { type: 'array', items: { type: 'object' } } } }), ...errors(401, 404) } } },
            '/instances/{id}/events/{elementId}': { post: {
                operationId: 'startEvent', summary: 'A start event of the running instance', parameters: [id('id', 'The instance'), id('elementId', 'The start event')],
                requestBody: body({ type: 'object', properties: { data } }), responses: { 200: answer('The instance', { type: 'object', properties: { instance: ref('Instance') } }), ...errors(401, 404, 422) },
            } },
            '/instances/{id}/restart': { post: {
                operationId: 'restartInstance', summary: 'Run an item again, and the instance on from it', parameters: [id('id', 'The instance')],
                requestBody: body({ type: 'object', required: ['itemId'], properties: { itemId: { type: 'string' }, data } }, true), responses: { 200: answer('The instance', { type: 'object', properties: { instance: ref('Instance') } }), ...errors(400, 401, 404, 422) },
            } },
            '/models': { get: { operationId: 'listModels', summary: 'The models, with where a person opens each', responses: { 200: answer('A list', list({ type: 'object', properties: { name: { type: 'string' }, url: { type: 'string' } } })), ...errors(401) } } },
            '/models/{name}': {
                get: { operationId: 'getModel', summary: 'A model: its BPMN XML, its .feature, where a person opens it', parameters: [model], responses: { 200: answer('The model', { type: 'object', properties: { name: { type: 'string' }, source: { type: 'string' }, feature: { type: ['string', 'null'] }, url: { type: 'string' } } }), ...errors(400, 401, 404) } },
                put: {
                    operationId: 'saveModel', summary: 'Create or change a model: checked first (with errors, refused unless force=true); laid out when it has no diagram (design)', parameters: [model, { name: 'force', in: 'query', schema: { type: 'boolean' } }],
                    requestBody: body({ type: 'object', required: ['source'], properties: { source: { type: 'string', description: 'The BPMN XML' } } }, true),
                    responses: { 200: answer('Changed', ref('ModelSaved')), 201: answer('Created', ref('ModelSaved')), ...errors(400, 401, 403, 404, 422) },
                },
                delete: { operationId: 'deleteModel', summary: 'Delete a model (design)', parameters: [model], responses: { 200: answer('Deleted', { type: 'object', properties: { deleted: { type: 'string' } } }), ...errors(401, 403, 404) } },
            },
            '/models/{name}/rename': { post: {
                operationId: 'renameModel', summary: 'Rename a model (design)', parameters: [model], requestBody: body({ type: 'object', required: ['newName'], properties: { newName: { type: 'string' } } }, true),
                responses: { 200: answer('Renamed', { type: 'object', properties: { name: { type: 'string' }, renamedFrom: { type: 'string' } } }), ...errors(400, 401, 403, 404, 409) },
            } },
            '/models/{name}/verify': { post: {
                operationId: 'verifyModel', summary: 'Check a model without saving it: the source given, else the saved model', parameters: [model],
                requestBody: body({ type: 'object', properties: { source: { type: 'string' } } }), responses: { 200: answer('Its check', ref('Check')), ...errors(400, 401, 404) },
            } },
            '/models/{name}/elements/{elementId}': { get: {
                operationId: 'getModelElement', summary: 'One element: its type, name, documentation, lane, assignment and form', parameters: [model, id('elementId', 'The element')],
                responses: { 200: answer('The element', { type: 'object', properties: { id: { type: 'string' }, type: { type: 'string' }, name: { type: ['string', 'null'] }, documentation: { type: 'string' }, lane: { type: 'string' }, assignment: { type: 'object' }, form: ref('Form') } }), ...errors(400, 401, 404) },
            } },
            '/models/{name}/feature': {
                get: { operationId: 'getModelTests', summary: 'The tests of the model: its .feature', parameters: [model], responses: { 200: answer('The text', { type: 'object', properties: { name: { type: 'string' }, text: { type: ['string', 'null'] } } }), ...errors(400, 401) } },
                put: {
                    operationId: 'saveModelTests', summary: 'Write the tests of the model: a .feature that reads as tests; with base, only over the text it came from (design)', parameters: [model],
                    requestBody: body({ type: 'object', required: ['text'], properties: { text: { type: 'string' }, base: { type: 'string' } } }, true),
                    responses: { 200: answer('Saved', { type: 'object', properties: { name: { type: 'string' }, saved: { type: 'boolean' } } }), ...errors(400, 401, 403, 409) },
                },
            },
            '/models/{name}/test': { post: {
                operationId: 'runModelTests', summary: 'Run the tests of the model (its .feature, or the one given), in the engine (design)', parameters: [model, { name: 'raw', in: 'query', schema: { type: 'boolean' } }],
                requestBody: body({ type: 'object', properties: { source: { type: 'string', description: 'A .feature, not saved' } } }),
                responses: { 200: answer('Each scenario', ref('TestRun')), ...errors(400, 401, 403, 404, 422) },
            } },
            '/settings': { get: { operationId: 'listSettings', summary: 'Every setting by group: its value (secrets as ***), where it comes from (an administrator; an AI link at the administer level)', responses: { 200: answer('The settings', { type: 'object', properties: { groups: { type: 'object', additionalProperties: { type: 'array', items: { type: 'object' } } } } }), ...errors(401, 403) } } },
            '/settings/schema': { get: { operationId: 'getSettingsSchema', summary: 'The settings’ schema: each setting’s type, default, description, group, and whether it is a secret', responses: { 200: answer('The JSON Schema', { type: 'object' }), ...errors(401, 403) } } },
            '/settings/checks/{name}': { post: {
                operationId: 'checkSettings', summary: 'Run a check: database, engine, url (SITE_URL) or email', parameters: [id('name', 'The check')],
                responses: { 200: answer('Its result', { type: 'object', properties: { check: { type: 'string' }, ok: { type: 'boolean' }, message: { type: 'string' } } }), ...errors(401, 403, 404) },
            } },
            '/users': {
                get: { operationId: 'listUsers', summary: 'The users (an administrator; never an AI link)', responses: { 200: answer('A list', list(ref('User'))), ...errors(401, 403) } },
                post: {
                    operationId: 'addUser', summary: 'Add a user (an administrator)', requestBody: body({ type: 'object', required: ['userName', 'password'], properties: { userName: { type: 'string' }, email: { type: 'string' }, password: { type: 'string', minLength: 8 }, groups: { type: 'array', items: { type: 'string' } } } }, true),
                    responses: { 201: answer('The user', ref('User')), ...errors(400, 401, 403, 409) },
                },
            },
            '/users/{userName}': { delete: { operationId: 'deleteUser', summary: 'Delete a user, and end their tokens (an administrator; not themselves)', parameters: [id('userName', 'The user')], responses: { 200: answer('Deleted', { type: 'object', properties: { deleted: { type: 'string' } } }), ...errors(401, 403, 404, 409) } } },
            '/users/{userName}/groups': { put: {
                operationId: 'setUserGroups', summary: 'Set a user’s groups, and end their tokens (an administrator)', parameters: [id('userName', 'The user')],
                requestBody: body({ type: 'object', required: ['groups'], properties: { groups: { type: 'array', items: { type: 'string' } } } }, true), responses: { 200: answer('The user', ref('User')), ...errors(400, 401, 403, 404) },
            } },
            '/users/{userName}/password': { post: {
                operationId: 'setUserPassword', summary: 'Set a user’s password (an administrator)', parameters: [id('userName', 'The user')],
                requestBody: body({ type: 'object', required: ['password'], properties: { password: { type: 'string', minLength: 8 } } }, true), responses: { 200: answer('Set', { type: 'object', properties: { userName: { type: 'string' }, passwordSet: { type: 'boolean' } } }), ...errors(400, 401, 403, 404) },
            } },
            '/messages/{id}': { post: {
                operationId: 'throwMessage', summary: 'A message, to what waits for it or starts on it (the system)', parameters: [id('id', 'The message')],
                requestBody: body({ type: 'object', properties: { data, matchingKey: data } }), responses: { 200: answer('The instance it reached, or null', { type: 'object', properties: { instance: { oneOf: [ref('Instance'), { type: 'null' }] } } }), ...errors(401, 403, 422) },
            } },
            '/signals/{id}': { post: {
                operationId: 'throwSignal', summary: 'A signal, to everything that waits for it (the system)', parameters: [id('id', 'The signal')],
                requestBody: body({ type: 'object', properties: { data, matchingKey: data } }), responses: { 200: answer('Signalled', { type: 'object', properties: { signalled: { type: 'string' } } }), ...errors(401, 403) },
            } },
            '/rules/{name}': { post: {
                operationId: 'evaluateRule', summary: 'Evaluate a decision table of the models folder with the data given, as a business rule task does; nothing changes', parameters: [id('name', 'A file <name>.dmn.xml, or a decision\'s id')],
                requestBody: body({ type: 'object', properties: { data: { ...data, description: 'The decision\'s inputs, by name' } } }),
                responses: { 200: answer('What it decided', ref('RuleResult')), ...errors(400, 401, 404, 422) },
            } },
            '/tokens': {
                post: {
                    operationId: 'issueToken', summary: 'A token for one of the application\'s users (the service key)', security: [{ serviceKey: [] }],
                    requestBody: body({ type: 'object', required: ['userName'], properties: { userName: { type: 'string' }, groups: { type: 'array', items: { type: 'string' }, description: 'The groups the application gives the user: not SYSTEM, ADMIN or DESIGNER' }, minutes: { type: 'number', default: 15, maximum: 1440 } } }, true),
                    responses: { 201: answer('The token: keep it secret', { type: 'object', properties: { token: { type: 'string' }, expiresAt: { type: 'string', format: 'date-time' }, userName: { type: 'string' }, groups: { type: 'array', items: { type: 'string' } } } }), ...errors(400, 401, 403) },
                },
                delete: {
                    operationId: 'revokeTokens', summary: 'Revoke every token of a user (the service key)', security: [{ serviceKey: [] }],
                    parameters: [{ name: 'userName', in: 'query', required: true, schema: { type: 'string' } }],
                    responses: { 200: answer('How many went', { type: 'object', properties: { revoked: { type: 'integer' } } }), ...errors(400, 401, 403) },
                },
            },
        },
        components: {
            securitySchemes: {
                token: { type: 'http', scheme: 'bearer', description: 'A user\'s token, from POST /tokens' },
                serviceKey: { type: 'apiKey', in: 'header', name: 'x-api-key', description: 'The service key (API_KEY): the service account' },
            },
            schemas: {
                Error: { type: 'object', required: ['error'], properties: { error: { type: 'object', required: ['code', 'message'], properties: { code: { type: 'string' }, message: { type: 'string' } } } } },
                Me: { type: 'object', properties: { userName: { type: 'string' }, groups: { type: 'array', items: { type: 'string' } }, credential: { enum: ['token', 'service'] }, may: { type: 'object', properties: { start: { type: 'boolean' }, design: { type: 'boolean' }, administer: { type: 'boolean' } } } } },
                Form: { type: 'object', properties: { fields: { type: 'array', items: { type: 'object', properties: { id: { type: 'string' }, label: { type: 'string' }, type: { type: 'string' }, defaultValue: {}, values: { type: 'array', items: { type: 'object', properties: { id: { type: 'string' }, name: { type: 'string' } } } }, validation: { type: 'array', items: { type: 'object' } } } } }, formKey: { type: 'string' } } },
                Startable: { type: 'object', properties: { processName: { type: 'string' }, startNodeId: { type: 'string' }, name: { type: 'string' }, documentation: { type: 'string' }, form: ref('Form') } },
                Task: { type: 'object', properties: { id: { type: 'string' }, instanceId: { type: 'string' }, processName: { type: 'string' }, elementId: { type: 'string' }, name: { type: 'string' }, status: { type: 'string' }, assignee: { type: 'string' }, candidateUsers: {}, candidateGroups: {}, startedAt: { type: 'string' }, endedAt: { type: 'string' }, dueDate: { type: 'string' }, followUpDate: { type: 'string' }, priority: {}, completedBy: { type: 'string' },
                    assignedBy: { type: 'object', description: 'What decided who works on it, when something did: its assignment policy and rule, or who reassigned it', properties: { policy: { type: 'string' }, rule: { type: 'integer' }, userName: { type: 'string' } } },
                    label: { type: 'string', description: 'Its own label, else its name and its case\'s; filled in when answered' }, labelValues: { type: 'array', items: ref('LabelValue') },
                    caseLabel: { type: 'string', description: 'Its case\'s label' }, caseLabelValues: { type: 'array', items: ref('LabelValue') } } },
                LabelValue: { type: 'object', description: 'A named value of a label', properties: { name: { type: 'string' }, path: { type: 'string', description: 'The data path it reads' }, value: {} } },
                TaskWithForm: { allOf: [ref('Task'), { type: 'object', properties: { data, form: ref('Form') } }] },
                Instance: { type: 'object', properties: { id: { type: 'string' }, name: { type: 'string' }, status: { type: 'string' }, startedAt: { type: 'string' }, endedAt: { type: ['string', 'null'] }, data,
                    label: { type: 'string', description: 'Its label (the model\'s owf:label, the application\'s, else <model> #<caseId>): on the lists, one instance, a start and a completion' }, labelValues: { type: 'array', items: ref('LabelValue') } } },
                User: { type: 'object', properties: { userName: { type: 'string' }, email: { type: ['string', 'null'] }, groups: { type: 'array', items: { type: 'string' } } } },
                Issue: { type: 'object', properties: { code: { type: 'string' }, element: { type: ['string', 'null'] }, message: { type: 'string' } } },
                Check: { type: 'object', properties: { name: { type: 'string' }, valid: { type: 'boolean' }, errors: { type: 'array', items: ref('Issue') }, warnings: { type: 'array', items: ref('Issue') } } },
                ModelSaved: { allOf: [ref('Check'), { type: 'object', properties: { created: { type: 'boolean' }, laidOut: { type: 'boolean' }, url: { type: 'string' } } }] },
                TestRun: { type: 'object', properties: { name: { type: 'string' }, passed: { type: 'integer' }, failed: { type: 'integer' }, skipped: { type: 'integer' }, scenarios: { type: 'array', items: { type: 'object', properties: { name: { type: 'string' }, status: { enum: ['passed', 'failed', 'skipped'] }, failedStep: { type: 'string' }, error: { type: 'string' }, instances: { type: 'array', items: { type: 'string' } } } } } } },
                RuleResult: { type: 'object', properties: { decision: { type: 'string', description: 'The decision\'s id' }, file: { type: 'string' }, result: { description: 'Its output: an object, or a list of them for a table with several hits' } } },
                InstanceWithItems:{ allOf: [ref('Instance'), { type: 'object', properties: { items: { type: 'array', items: { type: 'object', properties: { label: { type: 'string', description: 'When its element has a label' }, labelValues: { type: 'array', items: ref('LabelValue') } } } } } }] },
            },
        },
    };
}
