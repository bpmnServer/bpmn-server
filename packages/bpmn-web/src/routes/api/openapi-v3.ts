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
const list = (item: object) => ({ type: 'object', required: ['items'], properties: { items: { type: 'array', items: item }, next: { type: 'string', description: 'Absent on the last page' } } });
const ref = (name: string) => ({ $ref: `#/components/schemas/${name}` });
const data = { type: 'object', additionalProperties: true };

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
            '/tasks': { get: { operationId: 'listTasks', summary: 'The waiting tasks this user has a part in, oldest first', parameters: page, responses: { 200: answer('A page', list(ref('Task'))), ...errors(400, 401) } } },
            '/tasks/{id}': { get: { operationId: 'getTask', summary: 'One task, with its instance\'s data and its form', parameters: [id('id', 'The task')], responses: { 200: answer('The task', ref('TaskWithForm')), ...errors(401, 404) } } },
            '/tasks/{id}/claim': { post: { operationId: 'claimTask', summary: 'The task becomes this user\'s', parameters: [id('id', 'The task')], responses: { 200: answer('The task', { type: 'object', properties: { task: ref('Task') } }), ...errors(401, 404, 409) } } },
            '/tasks/{id}/complete': { post: {
                operationId: 'completeTask', summary: 'Complete the task, recording this user', parameters: [id('id', 'The task')],
                requestBody: body({ type: 'object', properties: { data } }),
                responses: { 200: answer('The task and its instance', { type: 'object', properties: { task: ref('Task'), instance: ref('Instance') } }), ...errors(400, 401, 403, 404, 409) },
            } },
            '/instances': { get: {
                operationId: 'listInstances', summary: 'The instances this user may see, newest first',
                parameters: [{ name: 'status', in: 'query', schema: { type: 'string' } }, { name: 'name', in: 'query', schema: { type: 'string' } }, ...page],
                responses: { 200: answer('A page', list(ref('Instance'))), ...errors(400, 401) },
            } },
            '/instances/{id}': {
                get: { operationId: 'getInstance', summary: 'One instance: its data and items', parameters: [id('id', 'The instance')], responses: { 200: answer('The instance', ref('InstanceWithItems')), ...errors(401, 404) } },
                delete: { operationId: 'deleteInstance', summary: 'Delete it (administrators)', parameters: [id('id', 'The instance')], responses: { 200: answer('Deleted', { type: 'object', properties: { deleted: { type: 'string' } } }), ...errors(401, 403, 404) } },
            },
            '/instances/{id}/rationale': { get: { operationId: 'getInstanceRationale', summary: 'Why it went the way it did, step by step', parameters: [id('id', 'The instance')], responses: { 200: answer('Its steps', { type: 'object', properties: { id: { type: 'string' }, name: { type: 'string' }, status: { type: 'string' }, data, steps: { type: 'array', items: { type: 'object' } } } }), ...errors(401, 404) } } },
            '/instances/{id}/events/{elementId}': { post: {
                operationId: 'startEvent', summary: 'A start event of the running instance', parameters: [id('id', 'The instance'), id('elementId', 'The start event')],
                requestBody: body({ type: 'object', properties: { data } }), responses: { 200: answer('The instance', { type: 'object', properties: { instance: ref('Instance') } }), ...errors(401, 404, 422) },
            } },
            '/instances/{id}/restart': { post: {
                operationId: 'restartInstance', summary: 'Run an item again, and the instance on from it', parameters: [id('id', 'The instance')],
                requestBody: body({ type: 'object', required: ['itemId'], properties: { itemId: { type: 'string' }, data } }, true), responses: { 200: answer('The instance', { type: 'object', properties: { instance: ref('Instance') } }), ...errors(400, 401, 404, 422) },
            } },
            '/messages/{id}': { post: {
                operationId: 'throwMessage', summary: 'A message, to what waits for it or starts on it (the system)', parameters: [id('id', 'The message')],
                requestBody: body({ type: 'object', properties: { data, matchingKey: data } }), responses: { 200: answer('The instance it reached, or null', { type: 'object', properties: { instance: { oneOf: [ref('Instance'), { type: 'null' }] } } }), ...errors(401, 403, 422) },
            } },
            '/signals/{id}': { post: {
                operationId: 'throwSignal', summary: 'A signal, to everything that waits for it (the system)', parameters: [id('id', 'The signal')],
                requestBody: body({ type: 'object', properties: { data, matchingKey: data } }), responses: { 200: answer('Signalled', { type: 'object', properties: { signalled: { type: 'string' } } }), ...errors(401, 403) },
            } },
            '/tokens': {
                post: {
                    operationId: 'issueToken', summary: 'A token for one of the application\'s users (the service key)', security: [{ serviceKey: [] }],
                    requestBody: body({ type: 'object', required: ['userName'], properties: { userName: { type: 'string' }, groups: { type: 'array', items: { type: 'string' } }, minutes: { type: 'number', default: 15, maximum: 1440 } } }, true),
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
                Task: { type: 'object', properties: { id: { type: 'string' }, instanceId: { type: 'string' }, processName: { type: 'string' }, elementId: { type: 'string' }, name: { type: 'string' }, status: { type: 'string' }, assignee: { type: 'string' }, candidateUsers: {}, candidateGroups: {}, startedAt: { type: 'string' }, endedAt: { type: 'string' }, dueDate: { type: 'string' }, followUpDate: { type: 'string' }, priority: {}, completedBy: { type: 'string' } } },
                TaskWithForm: { allOf: [ref('Task'), { type: 'object', properties: { data, form: ref('Form') } }] },
                Instance: { type: 'object', properties: { id: { type: 'string' }, name: { type: 'string' }, status: { type: 'string' }, startedAt: { type: 'string' }, endedAt: { type: ['string', 'null'] }, data } },
                InstanceWithItems: { allOf: [ref('Instance'), { type: 'object', properties: { items: { type: 'array', items: { type: 'object' } } } }] },
            },
        },
    };
}
