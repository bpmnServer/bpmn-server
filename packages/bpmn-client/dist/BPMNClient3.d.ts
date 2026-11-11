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
export interface Page<T = any> {
    items: T[];
    next?: string;
}
export interface PageOptions {
    limit?: number;
    cursor?: string;
}
/** A call the API refused: its status, and the error's code (`TASK_NOT_FOUND`, `TOKEN_INVALID`, ...). */
export declare class BPMNApiError extends Error {
    status: number;
    code: string;
    details: any;
    body: any;
    constructor(status: number, code: string, message: string, body?: any);
}
declare class BPMNClient3 {
    readonly base: string;
    private readonly apiKey?;
    private readonly token?;
    private readonly doFetch;
    /** The users' clients `as` made, by user and groups, each with its token. */
    private readonly users;
    private issued?;
    private issue?;
    readonly processes: Processes3;
    readonly tasks: Tasks3;
    readonly instances: Instances3;
    readonly models: Models3;
    readonly rules: Rules3;
    readonly messages: Messages3;
    readonly signals: Signals3;
    readonly admin: Admin3;
    readonly tokens: Tokens3;
    constructor(options: BPMNClient3Options);
    /**
     * A client acting as one of the application's users. Needs the service key: the client asks for the user's
     * token (POST /tokens) on its first call, keeps it, and asks again before it expires, or when the server no
     * longer knows it. The same user and groups give the same client.
     */
    as(userName: string, groups?: string[], options?: {
        minutes?: number;
    }): BPMNClient3;
    /** Revoke every token of a user (sign-out, a disabled user), and forget the clients `as` made for them. */
    signOut(userName: string): Promise<{
        revoked: number;
    }>;
    /** Who this client acts as: { userName, groups, credential, may: { start, design, administer } }. */
    me(): Promise<any>;
    /** The API's OpenAPI document. */
    openapi(): Promise<any>;
    /** Every item of a paged list, page after page. */
    each<T = any>(list: (page: PageOptions) => Promise<Page<T>>, options?: PageOptions): AsyncGenerator<T>;
    private credential;
    /** One call: method, path under /api/v3, query, JSON body. Answers the body; a refusal throws BPMNApiError. */
    call(method: string, path: string, options?: {
        query?: Record<string, any>;
        body?: any;
    }): Promise<any>;
    private send;
}
declare class Area3 {
    protected client: BPMNClient3;
    constructor(client: BPMNClient3);
}
/** The processes this user may start, and starting one. */
declare class Processes3 extends Area3 {
    /** The start events this user may use, with their forms: { items, next }. */
    startable(): Promise<Page>;
    /** Start a process as this user: { instance, task } (task: their first waiting task in it, or null). */
    start(name: string, data?: object, options?: {
        startNodeId?: string;
    }): Promise<{
        instance: any;
        task: any;
    }>;
}
/** This user's tasks. */
declare class Tasks3 extends Area3 {
    /** Waiting tasks this user has a part in (oldest first), or with status 'completed' the ones they completed. */
    list(options?: PageOptions & {
        status?: 'waiting' | 'completed';
    }): Promise<Page>;
    /** Every task of the list, page after page. */
    each(options?: {
        status?: 'waiting' | 'completed';
        limit?: number;
    }): AsyncGenerator<any, any, any>;
    /** One task, with its instance's data and its form: { ..., form: { fields, formKey } }. */
    get(id: string): Promise<any>;
    /** The task becomes this user's: { task }. */
    claim(id: string): Promise<{
        task: any;
    }>;
    /** Complete the task, recording this user: { task, instance }. */
    complete(id: string, data?: object): Promise<{
        task: any;
        instance: any;
    }>;
}
/** The instances this user may see. */
declare class Instances3 extends Area3 {
    /** Newest first: { items, next }. */
    list(options?: PageOptions & {
        status?: string;
        name?: string;
    }): Promise<Page>;
    each(options?: {
        status?: string;
        name?: string;
        limit?: number;
    }): AsyncGenerator<any, any, any>;
    /** One instance, with its data and items. */
    get(id: string): Promise<any>;
    /** Why it went the way it did, step by step. */
    rationale(id: string): Promise<any>;
    /** A start event of the running instance: { instance }. */
    startEvent(id: string, elementId: string, data?: object): Promise<{
        instance: any;
    }>;
    /** Run an item again, and the instance on from it: { instance }. */
    restart(id: string, itemId: string, data?: object): Promise<{
        instance: any;
    }>;
    /** Delete it (administrators): { deleted }. */
    delete(id: string): Promise<{
        deleted: any;
    }>;
}
/** Models and their tests. Changing them is design: a designer's token, or the service key. */
declare class Models3 extends Area3 {
    list(): Promise<Page>;
    /** { name, source, feature, url }. */
    get(name: string): Promise<any>;
    /** Create or change a model; checked first, and refused with errors unless force. */
    save(name: string, source: string, options?: {
        force?: boolean;
    }): Promise<any>;
    delete(name: string): Promise<{
        deleted: any;
    }>;
    rename(name: string, newName: string): Promise<{
        name: string;
        renamedFrom: string;
    }>;
    /** Check a model without saving it: the source given, else the saved one. */
    verify(name: string, source?: string): Promise<any>;
    /** One element: its type, name, documentation, lane, assignment and form. */
    element(name: string, elementId: string): Promise<any>;
    /** The model's tests: { name, text }. */
    feature(name: string): Promise<{
        name: string;
        text: string;
    }>;
    /** Write the model's tests; with base, only over the text it came from. */
    saveFeature(name: string, text: string, options?: {
        base?: string;
    }): Promise<any>;
    /** Run the model's tests (its .feature, or the source given). */
    test(name: string, options?: {
        source?: string;
        raw?: boolean;
    }): Promise<any>;
}
declare class Rules3 extends Area3 {
    /** Evaluate a decision table with the data given, as a business rule task does; nothing changes. */
    evaluate(name: string, data?: object): Promise<any>;
}
declare class Messages3 extends Area3 {
    /** A message, to what waits for it or starts on it (the system): { instance }. */
    throw(id: string, data?: object, matchingKey?: object): Promise<{
        instance: any;
    }>;
}
declare class Signals3 extends Area3 {
    /** A signal, to everything that waits for it (the system): { signalled }. */
    throw(id: string, data?: object, matchingKey?: object): Promise<{
        signalled: any;
    }>;
}
/** Users and settings: an administrator's. */
declare class Admin3 extends Area3 {
    users(): Promise<Page>;
    addUser(user: {
        userName: string;
        password: string;
        email?: string;
        groups?: string[];
    }): Promise<any>;
    deleteUser(userName: string): Promise<{
        deleted: any;
    }>;
    setGroups(userName: string, groups: string[]): Promise<any>;
    setPassword(userName: string, password: string): Promise<any>;
    settings(): Promise<{
        groups: any;
    }>;
    settingsSchema(): Promise<any>;
    /** database, engine, url or email: { check, ok, message }. */
    check(name: string): Promise<{
        check: string;
        ok: boolean;
        message: string;
    }>;
}
/** Users' tokens: the service key's. `as` and `signOut` use these. */
declare class Tokens3 extends Area3 {
    /** { token, expiresAt, userName, groups }; groups may not be SYSTEM, ADMIN or DESIGNER. */
    issue(userName: string, groups?: string[], minutes?: number): Promise<{
        token: string;
        expiresAt: string;
        userName: string;
        groups: string[];
    }>;
    /** Revoke every token of a user: { revoked }. */
    revoke(userName: string): Promise<{
        revoked: number;
    }>;
}
export { BPMNClient3, Processes3, Tasks3, Instances3, Models3, Rules3, Messages3, Signals3, Admin3, Tokens3 };
