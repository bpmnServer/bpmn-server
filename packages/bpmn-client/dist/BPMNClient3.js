/**
 * The client of API v3 (`/api/v3`, since bpmn-web 3.7): every call acts as one user.
 *
 *   const service = new BPMNClient3({ url: 'https://bpmn.example.com', apiKey: process.env.API_KEY });
 *   const sam = service.as('sam', ['staff']);          // a token for sam, issued and renewed by the client
 *   const { instance, task } = await sam.processes.start('leave-request', { days: 3 });
 *   await sam.tasks.complete(task.id, { reason: 'holiday' });
 *
 * Or with a token the application got itself: new BPMNClient3({ url, token }).
 * The operations, their inputs and answers are the API's document: GET /api/v3/openapi.json.
 */
/** A call the API refused: its status, and the error's code (`TASK_NOT_FOUND`, `TOKEN_INVALID`, ...). */
export class BPMNApiError extends Error {
    status;
    code;
    details;
    body;
    constructor(status, code, message, body) {
        super(`${status} ${code}: ${message}`);
        this.name = 'BPMNApiError';
        this.status = status;
        this.code = code;
        this.details = body?.error?.details;
        this.body = body;
    }
}
/** Renew a token this long before it expires. */
const RENEW_BEFORE_MS = 60_000;
class BPMNClient3 {
    base;
    apiKey;
    token;
    doFetch;
    /** The users' clients `as` made, by user and groups, each with its token. */
    users = new Map();
    issued;
    issue;
    processes;
    tasks;
    instances;
    models;
    rules;
    messages;
    signals;
    admin;
    tokens;
    constructor(options) {
        if (!options || !options.url)
            throw new Error('BPMNClient3: url is required');
        if (!options.apiKey && !options.token)
            throw new Error('BPMNClient3: an apiKey or a token is required');
        const url = options.url.replace(/\/+$/, '');
        this.base = /\/api\/v3$/.test(url) ? url : url + '/api/v3';
        this.apiKey = options.apiKey;
        this.token = options.token;
        this.doFetch = options.fetch ?? globalThis.fetch;
        this.processes = new Processes3(this);
        this.tasks = new Tasks3(this);
        this.instances = new Instances3(this);
        this.models = new Models3(this);
        this.rules = new Rules3(this);
        this.messages = new Messages3(this);
        this.signals = new Signals3(this);
        this.admin = new Admin3(this);
        this.tokens = new Tokens3(this);
    }
    /**
     * A client acting as one of the application's users. Needs the service key: the client asks for the user's
     * token (POST /tokens) on its first call, keeps it, and asks again before it expires, or when the server no
     * longer knows it. The same user and groups give the same client.
     */
    as(userName, groups = [], options = {}) {
        if (!this.apiKey)
            throw new Error('BPMNClient3.as: the service key (apiKey) issues tokens');
        if (!userName)
            throw new Error('BPMNClient3.as: userName is required');
        const key = JSON.stringify([userName, [...groups].sort(), options.minutes ?? null]);
        let user = this.users.get(key);
        if (!user) {
            user = new BPMNClient3({ url: this.base, token: 'issued', fetch: this.doFetch });
            user.issue = () => this.tokens.issue(userName, groups, options.minutes);
            this.users.set(key, user);
        }
        return user;
    }
    /** Revoke every token of a user (sign-out, a disabled user), and forget the clients `as` made for them. */
    async signOut(userName) {
        for (const [key, user] of this.users)
            if (JSON.parse(key)[0] === userName) {
                user.issued = undefined;
                this.users.delete(key);
            }
        return this.tokens.revoke(userName);
    }
    /** Who this client acts as: { userName, groups, credential, may: { start, design, administer } }. */
    me() { return this.call('GET', '/me'); }
    /** The API's OpenAPI document. */
    openapi() { return this.call('GET', '/openapi.json'); }
    /** Every item of a paged list, page after page. */
    async *each(list, options = {}) {
        let cursor = options.cursor;
        do {
            const page = await list({ ...options, cursor });
            for (const item of page.items)
                yield item;
            cursor = page.next;
        } while (cursor);
    }
    async credential(renew = false) {
        if (this.issue) {
            if (renew || !this.issued || this.issued.expiresAt - Date.now() < RENEW_BEFORE_MS) {
                const answer = await this.issue();
                this.issued = { token: answer.token, expiresAt: Date.parse(answer.expiresAt) };
            }
            return { authorization: `Bearer ${this.issued.token}` };
        }
        if (this.token) {
            const token = typeof this.token === 'function' ? await this.token() : this.token;
            return { authorization: `Bearer ${token}` };
        }
        return { 'x-api-key': this.apiKey };
    }
    /** One call: method, path under /api/v3, query, JSON body. Answers the body; a refusal throws BPMNApiError. */
    async call(method, path, options = {}) {
        let answer = await this.send(method, path, options, false);
        // a token the server no longer knows (revoked, or a restart of an older server): ask for a new one, once
        if (answer.status === 401 && this.issue && answer.body?.error?.code === 'TOKEN_INVALID')
            answer = await this.send(method, path, options, true);
        if (answer.status >= 400) {
            const error = answer.body?.error;
            throw new BPMNApiError(answer.status, error?.code ?? 'HTTP_' + answer.status, error?.message ?? (typeof answer.body === 'string' && answer.body.trim() ? answer.body.trim().slice(0, 200) : 'the call failed'), answer.body);
        }
        return answer.body;
    }
    async send(method, path, { query, body }, renew) {
        const url = new URL(this.base + path);
        for (const [name, value] of Object.entries(query ?? {}))
            if (value !== undefined && value !== null)
                url.searchParams.set(name, String(value));
        const headers = { accept: 'application/json', ...(await this.credential(renew)) };
        if (body !== undefined)
            headers['content-type'] = 'application/json';
        let response;
        try {
            response = await this.doFetch(url, { method, headers, body: body === undefined ? undefined : JSON.stringify(body) });
        }
        catch (err) {
            const error = new Error(`${method} ${url.pathname}: ${err?.cause?.code ?? err?.message ?? err}`);
            error.cause = err;
            throw error;
        }
        const text = await response.text();
        let parsed = text;
        if ((response.headers.get('content-type') || '').includes('json') && text) {
            try {
                parsed = JSON.parse(text);
            }
            catch { /* left as text */ }
        }
        else if (/^\s*<(!doctype|html)/i.test(text)) {
            throw new BPMNApiError(response.status, 'NOT_THE_API', 'the server answered with a web page instead of the API: check the url (and that the server has API v3, bpmn-web 3.7 or later)', text);
        }
        return { status: response.status, body: parsed };
    }
}
const enc = encodeURIComponent;
class Area3 {
    client;
    constructor(client) {
        this.client = client;
    }
}
/** The processes this user may start, and starting one. */
class Processes3 extends Area3 {
    /** The start events this user may use, with their forms: { items, next }. */
    startable() { return this.client.call('GET', '/processes/startable'); }
    /** Start a process as this user: { instance, task } (task: their first waiting task in it, or null). */
    start(name, data = {}, options = {}) {
        return this.client.call('POST', `/processes/${enc(name)}/start`, { body: { data, ...options } });
    }
}
/** This user's tasks. */
class Tasks3 extends Area3 {
    /** Waiting tasks this user has a part in (oldest first), or with status 'completed' the ones they completed. */
    list(options = {}) {
        return this.client.call('GET', '/tasks', { query: options });
    }
    /** Every task of the list, page after page. */
    each(options = {}) {
        return this.client.each(page => this.list({ ...options, ...page }), options);
    }
    /** One task, with its instance's data and its form: { ..., form: { fields, formKey } }. */
    get(id) { return this.client.call('GET', `/tasks/${enc(id)}`); }
    /** The task becomes this user's: { task }. */
    claim(id) { return this.client.call('POST', `/tasks/${enc(id)}/claim`); }
    /** Complete the task, recording this user: { task, instance }. */
    complete(id, data = {}) {
        return this.client.call('POST', `/tasks/${enc(id)}/complete`, { body: { data } });
    }
}
/** The instances this user may see. */
class Instances3 extends Area3 {
    /** Newest first: { items, next }. */
    list(options = {}) {
        return this.client.call('GET', '/instances', { query: options });
    }
    each(options = {}) {
        return this.client.each(page => this.list({ ...options, ...page }), options);
    }
    /** One instance, with its data and items. */
    get(id) { return this.client.call('GET', `/instances/${enc(id)}`); }
    /** Why it went the way it did, step by step. */
    rationale(id) { return this.client.call('GET', `/instances/${enc(id)}/rationale`); }
    /** A start event of the running instance: { instance }. */
    startEvent(id, elementId, data = {}) {
        return this.client.call('POST', `/instances/${enc(id)}/events/${enc(elementId)}`, { body: { data } });
    }
    /** Run an item again, and the instance on from it: { instance }. */
    restart(id, itemId, data = {}) {
        return this.client.call('POST', `/instances/${enc(id)}/restart`, { body: { itemId, data } });
    }
    /** Delete it (administrators): { deleted }. */
    delete(id) { return this.client.call('DELETE', `/instances/${enc(id)}`); }
}
/** Models and their tests. Changing them is design: a designer's token, or the service key. */
class Models3 extends Area3 {
    list() { return this.client.call('GET', '/models'); }
    /** { name, source, feature, url }. */
    get(name) { return this.client.call('GET', `/models/${enc(name)}`); }
    /** Create or change a model; checked first, and refused with errors unless force. */
    save(name, source, options = {}) {
        return this.client.call('PUT', `/models/${enc(name)}`, { query: { force: options.force || undefined }, body: { source } });
    }
    delete(name) { return this.client.call('DELETE', `/models/${enc(name)}`); }
    rename(name, newName) {
        return this.client.call('POST', `/models/${enc(name)}/rename`, { body: { newName } });
    }
    /** Check a model without saving it: the source given, else the saved one. */
    verify(name, source) {
        return this.client.call('POST', `/models/${enc(name)}/verify`, { body: source === undefined ? {} : { source } });
    }
    /** One element: its type, name, documentation, lane, assignment and form. */
    element(name, elementId) {
        return this.client.call('GET', `/models/${enc(name)}/elements/${enc(elementId)}`);
    }
    /** The model's tests: { name, text }. */
    feature(name) { return this.client.call('GET', `/models/${enc(name)}/feature`); }
    /** Write the model's tests; with base, only over the text it came from. */
    saveFeature(name, text, options = {}) {
        return this.client.call('PUT', `/models/${enc(name)}/feature`, { body: { text, ...options } });
    }
    /** Run the model's tests (its .feature, or the source given). */
    test(name, options = {}) {
        const { raw, ...body } = options;
        return this.client.call('POST', `/models/${enc(name)}/test`, { query: { raw: raw || undefined }, body });
    }
}
class Rules3 extends Area3 {
    /** Evaluate a decision table with the data given, as a business rule task does; nothing changes. */
    evaluate(name, data = {}) {
        return this.client.call('POST', `/rules/${enc(name)}`, { body: { data } });
    }
}
class Messages3 extends Area3 {
    /** A message, to what waits for it or starts on it (the system): { instance }. */
    throw(id, data = {}, matchingKey) {
        return this.client.call('POST', `/messages/${enc(id)}`, { body: { data, matchingKey } });
    }
}
class Signals3 extends Area3 {
    /** A signal, to everything that waits for it (the system): { signalled }. */
    throw(id, data = {}, matchingKey) {
        return this.client.call('POST', `/signals/${enc(id)}`, { body: { data, matchingKey } });
    }
}
/** Users and settings: an administrator's. */
class Admin3 extends Area3 {
    users() { return this.client.call('GET', '/users'); }
    addUser(user) {
        return this.client.call('POST', '/users', { body: user });
    }
    deleteUser(userName) { return this.client.call('DELETE', `/users/${enc(userName)}`); }
    setGroups(userName, groups) {
        return this.client.call('PUT', `/users/${enc(userName)}/groups`, { body: { groups } });
    }
    setPassword(userName, password) {
        return this.client.call('POST', `/users/${enc(userName)}/password`, { body: { password } });
    }
    settings() { return this.client.call('GET', '/settings'); }
    settingsSchema() { return this.client.call('GET', '/settings/schema'); }
    /** database, engine, url or email: { check, ok, message }. */
    check(name) {
        return this.client.call('POST', `/settings/checks/${enc(name)}`);
    }
}
/** Users' tokens: the service key's. `as` and `signOut` use these. */
class Tokens3 extends Area3 {
    /** { token, expiresAt, userName, groups }; groups may not be SYSTEM, ADMIN or DESIGNER. */
    issue(userName, groups = [], minutes) {
        return this.client.call('POST', '/tokens', { body: { userName, groups, minutes } });
    }
    /** Revoke every token of a user: { revoked }. */
    revoke(userName) {
        return this.client.call('DELETE', '/tokens', { query: { userName } });
    }
}
export { BPMNClient3, Processes3, Tasks3, Instances3, Models3, Rules3, Messages3, Signals3, Admin3, Tokens3 };
//# sourceMappingURL=BPMNClient3.js.map