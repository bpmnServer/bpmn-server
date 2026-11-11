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

export type TokenSource = string | (() => string | Promise<string>);

export interface BPMNClient3Options {
    /** The server, e.g. https://bpmn.example.com; /api/v3 is added unless given. */
    url: string;
    /** The service key (API_KEY): calls act as the service account; it also issues users' tokens (`as`). */
    apiKey?: string;
    /** A user's token, or a function that gives one: calls act as that user. */
    token?: TokenSource;
    /** Another fetch (tests, proxies). */
    fetch?: typeof fetch;
}

export interface Page<T = any> { items: T[]; next?: string }
export interface PageOptions { limit?: number; cursor?: string }

/** A call the API refused: its status, and the error's code (`TASK_NOT_FOUND`, `TOKEN_INVALID`, ...). */
export class BPMNApiError extends Error {
    status: number;
    code: string;
    details: any;
    body: any;
    constructor(status: number, code: string, message: string, body?: any) {
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
    readonly base: string;
    private readonly apiKey?: string;
    private readonly token?: TokenSource;
    private readonly doFetch: typeof fetch;
    /** The users' clients `as` made, by user and groups, each with its token. */
    private readonly users = new Map<string, BPMNClient3>();
    private issued?: { token: string; expiresAt: number };
    private issue?: () => Promise<{ token: string; expiresAt: string }>;

    readonly processes: Processes3;
    readonly tasks: Tasks3;
    readonly instances: Instances3;
    readonly models: Models3;
    readonly rules: Rules3;
    readonly messages: Messages3;
    readonly signals: Signals3;
    readonly admin: Admin3;
    readonly tokens: Tokens3;

    constructor(options: BPMNClient3Options) {
        if (!options || !options.url) throw new Error('BPMNClient3: url is required');
        if (!options.apiKey && !options.token) throw new Error('BPMNClient3: an apiKey or a token is required');
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
    as(userName: string, groups: string[] = [], options: { minutes?: number } = {}): BPMNClient3 {
        if (!this.apiKey) throw new Error('BPMNClient3.as: the service key (apiKey) issues tokens');
        if (!userName) throw new Error('BPMNClient3.as: userName is required');
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
    async signOut(userName: string): Promise<{ revoked: number }> {
        for (const [key, user] of this.users)
            if (JSON.parse(key)[0] === userName) { user.issued = undefined; this.users.delete(key); }
        return this.tokens.revoke(userName);
    }

    /** Who this client acts as: { userName, groups, credential, may: { start, design, administer } }. */
    me(): Promise<any> { return this.call('GET', '/me'); }

    /** The API's OpenAPI document. */
    openapi(): Promise<any> { return this.call('GET', '/openapi.json'); }

    /** Every item of a paged list, page after page. */
    async *each<T = any>(list: (page: PageOptions) => Promise<Page<T>>, options: PageOptions = {}): AsyncGenerator<T> {
        let cursor = options.cursor;
        do {
            const page = await list({ ...options, cursor });
            for (const item of page.items) yield item;
            cursor = page.next;
        } while (cursor);
    }

    private async credential(renew = false): Promise<Record<string, string>> {
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
    async call(method: string, path: string, options: { query?: Record<string, any>; body?: any } = {}): Promise<any> {
        let answer = await this.send(method, path, options, false);
        // a token the server no longer knows (revoked, or a restart of an older server): ask for a new one, once
        if (answer.status === 401 && this.issue && answer.body?.error?.code === 'TOKEN_INVALID')
            answer = await this.send(method, path, options, true);
        if (answer.status >= 400) {
            const error = answer.body?.error;
            throw new BPMNApiError(answer.status, error?.code ?? 'HTTP_' + answer.status,
                error?.message ?? (typeof answer.body === 'string' && answer.body.trim() ? answer.body.trim().slice(0, 200) : 'the call failed'),
                answer.body);
        }
        return answer.body;
    }

    private async send(method: string, path: string, { query, body }: { query?: Record<string, any>; body?: any }, renew: boolean) {
        const url = new URL(this.base + path);
        for (const [name, value] of Object.entries(query ?? {}))
            if (value !== undefined && value !== null) url.searchParams.set(name, String(value));
        const headers: Record<string, string> = { accept: 'application/json', ...(await this.credential(renew)) };
        if (body !== undefined) headers['content-type'] = 'application/json';
        let response: Response;
        try {
            response = await this.doFetch(url, { method, headers, body: body === undefined ? undefined : JSON.stringify(body) });
        } catch (err) {
            const error: any = new Error(`${method} ${url.pathname}: ${err?.cause?.code ?? err?.message ?? err}`);
            error.cause = err;
            throw error;
        }
        const text = await response.text();
        let parsed: any = text;
        if ((response.headers.get('content-type') || '').includes('json') && text) {
            try { parsed = JSON.parse(text); } catch { /* left as text */ }
        } else if (/^\s*<(!doctype|html)/i.test(text)) {
            throw new BPMNApiError(response.status, 'NOT_THE_API',
                'the server answered with a web page instead of the API: check the url (and that the server has API v3, bpmn-web 3.7 or later)', text);
        }
        return { status: response.status, body: parsed };
    }
}

const enc = encodeURIComponent;

class Area3 {
    constructor(protected client: BPMNClient3) { }
}

/** The processes this user may start, and starting one. */
class Processes3 extends Area3 {
    /** The start events this user may use, with their forms: { items, next }. */
    startable(): Promise<Page> { return this.client.call('GET', '/processes/startable'); }
    /** Start a process as this user: { instance, task } (task: their first waiting task in it, or null). */
    start(name: string, data: object = {}, options: { startNodeId?: string } = {}): Promise<{ instance: any; task: any }> {
        return this.client.call('POST', `/processes/${enc(name)}/start`, { body: { data, ...options } });
    }
}

/** This user's tasks. */
class Tasks3 extends Area3 {
    /** Waiting tasks this user has a part in (oldest first), or with status 'completed' the ones they completed. */
    list(options: PageOptions & { status?: 'waiting' | 'completed' } = {}): Promise<Page> {
        return this.client.call('GET', '/tasks', { query: options });
    }
    /** Every task of the list, page after page. */
    each(options: { status?: 'waiting' | 'completed'; limit?: number } = {}) {
        return this.client.each(page => this.list({ ...options, ...page }), options);
    }
    /** One task, with its instance's data and its form: { ..., form: { fields, formKey } }. */
    get(id: string): Promise<any> { return this.client.call('GET', `/tasks/${enc(id)}`); }
    /** The task becomes this user's: { task }. */
    claim(id: string): Promise<{ task: any }> { return this.client.call('POST', `/tasks/${enc(id)}/claim`); }
    /** Complete the task, recording this user: { task, instance }. */
    complete(id: string, data: object = {}): Promise<{ task: any; instance: any }> {
        return this.client.call('POST', `/tasks/${enc(id)}/complete`, { body: { data } });
    }
}

/** The instances this user may see. */
class Instances3 extends Area3 {
    /** Newest first: { items, next }. */
    list(options: PageOptions & { status?: string; name?: string } = {}): Promise<Page> {
        return this.client.call('GET', '/instances', { query: options });
    }
    each(options: { status?: string; name?: string; limit?: number } = {}) {
        return this.client.each(page => this.list({ ...options, ...page }), options);
    }
    /** One instance, with its data and items. */
    get(id: string): Promise<any> { return this.client.call('GET', `/instances/${enc(id)}`); }
    /** Why it went the way it did, step by step. */
    rationale(id: string): Promise<any> { return this.client.call('GET', `/instances/${enc(id)}/rationale`); }
    /** A start event of the running instance: { instance }. */
    startEvent(id: string, elementId: string, data: object = {}): Promise<{ instance: any }> {
        return this.client.call('POST', `/instances/${enc(id)}/events/${enc(elementId)}`, { body: { data } });
    }
    /** Run an item again, and the instance on from it: { instance }. */
    restart(id: string, itemId: string, data: object = {}): Promise<{ instance: any }> {
        return this.client.call('POST', `/instances/${enc(id)}/restart`, { body: { itemId, data } });
    }
    /** Delete it (administrators): { deleted }. */
    delete(id: string): Promise<{ deleted: any }> { return this.client.call('DELETE', `/instances/${enc(id)}`); }
}

/** Models and their tests. Changing them is design: a designer's token, or the service key. */
class Models3 extends Area3 {
    list(): Promise<Page> { return this.client.call('GET', '/models'); }
    /** { name, source, feature, url }. */
    get(name: string): Promise<any> { return this.client.call('GET', `/models/${enc(name)}`); }
    /** Create or change a model; checked first, and refused with errors unless force. */
    save(name: string, source: string, options: { force?: boolean } = {}): Promise<any> {
        return this.client.call('PUT', `/models/${enc(name)}`, { query: { force: options.force || undefined }, body: { source } });
    }
    delete(name: string): Promise<{ deleted: any }> { return this.client.call('DELETE', `/models/${enc(name)}`); }
    rename(name: string, newName: string): Promise<{ name: string; renamedFrom: string }> {
        return this.client.call('POST', `/models/${enc(name)}/rename`, { body: { newName } });
    }
    /** Check a model without saving it: the source given, else the saved one. */
    verify(name: string, source?: string): Promise<any> {
        return this.client.call('POST', `/models/${enc(name)}/verify`, { body: source === undefined ? {} : { source } });
    }
    /** One element: its type, name, documentation, lane, assignment and form. */
    element(name: string, elementId: string): Promise<any> {
        return this.client.call('GET', `/models/${enc(name)}/elements/${enc(elementId)}`);
    }
    /** The model's tests: { name, text }. */
    feature(name: string): Promise<{ name: string; text: string }> { return this.client.call('GET', `/models/${enc(name)}/feature`); }
    /** Write the model's tests; with base, only over the text it came from. */
    saveFeature(name: string, text: string, options: { base?: string } = {}): Promise<any> {
        return this.client.call('PUT', `/models/${enc(name)}/feature`, { body: { text, ...options } });
    }
    /** Run the model's tests (its .feature, or the source given). */
    test(name: string, options: { source?: string; raw?: boolean } = {}): Promise<any> {
        const { raw, ...body } = options;
        return this.client.call('POST', `/models/${enc(name)}/test`, { query: { raw: raw || undefined }, body });
    }
}

class Rules3 extends Area3 {
    /** Evaluate a decision table with the data given, as a business rule task does; nothing changes. */
    evaluate(name: string, data: object = {}): Promise<any> {
        return this.client.call('POST', `/rules/${enc(name)}`, { body: { data } });
    }
}

class Messages3 extends Area3 {
    /** A message, to what waits for it or starts on it (the system): { instance }. */
    throw(id: string, data: object = {}, matchingKey?: object): Promise<{ instance: any }> {
        return this.client.call('POST', `/messages/${enc(id)}`, { body: { data, matchingKey } });
    }
}

class Signals3 extends Area3 {
    /** A signal, to everything that waits for it (the system): { signalled }. */
    throw(id: string, data: object = {}, matchingKey?: object): Promise<{ signalled: any }> {
        return this.client.call('POST', `/signals/${enc(id)}`, { body: { data, matchingKey } });
    }
}

/** Users and settings: an administrator's. */
class Admin3 extends Area3 {
    users(): Promise<Page> { return this.client.call('GET', '/users'); }
    addUser(user: { userName: string; password: string; email?: string; groups?: string[] }): Promise<any> {
        return this.client.call('POST', '/users', { body: user });
    }
    deleteUser(userName: string): Promise<{ deleted: any }> { return this.client.call('DELETE', `/users/${enc(userName)}`); }
    setGroups(userName: string, groups: string[]): Promise<any> {
        return this.client.call('PUT', `/users/${enc(userName)}/groups`, { body: { groups } });
    }
    setPassword(userName: string, password: string): Promise<any> {
        return this.client.call('POST', `/users/${enc(userName)}/password`, { body: { password } });
    }
    settings(): Promise<{ groups: any }> { return this.client.call('GET', '/settings'); }
    settingsSchema(): Promise<any> { return this.client.call('GET', '/settings/schema'); }
    /** database, engine, url or email: { check, ok, message }. */
    check(name: string): Promise<{ check: string; ok: boolean; message: string }> {
        return this.client.call('POST', `/settings/checks/${enc(name)}`);
    }
}

/** Users' tokens: the service key's. `as` and `signOut` use these. */
class Tokens3 extends Area3 {
    /** { token, expiresAt, userName, groups }; groups may not be SYSTEM, ADMIN or DESIGNER. */
    issue(userName: string, groups: string[] = [], minutes?: number): Promise<{ token: string; expiresAt: string; userName: string; groups: string[] }> {
        return this.client.call('POST', '/tokens', { body: { userName, groups, minutes } });
    }
    /** Revoke every token of a user: { revoked }. */
    revoke(userName: string): Promise<{ revoked: number }> {
        return this.client.call('DELETE', '/tokens', { query: { userName } });
    }
}

export { BPMNClient3, Processes3, Tasks3, Instances3, Models3, Rules3, Messages3, Signals3, Admin3, Tokens3 };
