/**
 * Connectors (docs/docs/connectors.md): REST APIs, each described by an OpenAPI document, that an administrator adds to
 * the server with an authorization key. A service task names one and an operation, `<connector>/<operationId>`
 * (camunda:connector); the server calls it.
 *
 * A connector is a file in the models folder, `<id>.connector.json`, as a model is (docs/design/connectors-as-files.md):
 * its definition and its OpenAPI document, kept in Git and released with the models that call it, found by their tests.
 * What is one server's alone stays in its `wf_connectors` collection (the storage port): the key, encrypted
 * (Secrets.ts), and the last connection test. The key never leaves the server: not in the file, not in `list` or
 * `get`; a call only puts it in the request it sends. A connector kept whole in the collection before (3.6) is written
 * out to its file the first time it is read, its key kept in the collection.
 */
import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';
import type { IBPMNServer } from '../interfaces/server.js';
import { parseDocument, listOperations, type Operation } from './OpenAPI.js';
import { encrypt, decrypt } from './Secrets.js';

const COLLECTION = 'wf_connectors';
/** A connector's file in the models folder: `<id>.connector.json`. */
const FILE = '.connector.json';
const ID = /^[A-Za-z0-9][A-Za-z0-9_-]{0,63}$/;
const IDEMPOTENT = ['GET', 'HEAD', 'PUT', 'DELETE', 'OPTIONS'];
/** A document kept packed in the collection before (3.6): its JSON, gzipped, in base64. */
const unpack = (packed: string) => JSON.parse(zlib.gunzipSync(Buffer.from(packed, 'base64')).toString('utf8'));

/** What one server keeps of a connector in its collection: the key (encrypted) and the last connection test. */
interface ServerState {
    id: string;
    key?: Pick<ConnectorAuth, 'secret' | 'last4' | 'setAt' | 'setBy'>;
    test?: Connector['test'];
}

export interface ConnectorAuth {
    /** how the key is sent */
    type: 'bearer' | 'apiKey' | 'basic';
    /** apiKey: in a header, the query or a cookie, under this name */
    in?: 'header' | 'query' | 'cookie';
    name?: string;
    /** the securitySchemes entry it came from, when it did */
    scheme?: string;
    /** the key, encrypted (never returned) */
    secret?: string;
    last4?: string;
    setAt?: string;
    setBy?: string;
}

export interface Connector {
    id: string;
    name: string;
    description?: string;
    /** where the document came from and what it is; the document itself in the file (`document(id)` reads it) */
    openapi: { source?: string; version: string; title?: string; fetchedAt: string; bytes: number; document?: any };
    baseUrl: string;
    /** the operations designers may use, by operationId */
    operations: Record<string, boolean>;
    /** the groups that may design with it; empty: every designer */
    groups: string[];
    enabled: boolean;
    timeout?: number;
    retries?: number;
    auth?: ConnectorAuth;
    test?: { at: string; operation: string; ok: boolean; status?: number; message?: string };
    createdAt: string;
    updatedAt: string;
}

/** What `add` takes: the document as text (JSON or YAML) or an object, or its URL. */
export interface ConnectorInput {
    id: string;
    name?: string;
    description?: string;
    /** the document's URL (fetched now, and by refresh) */
    source?: string;
    /** the document itself */
    document?: string | object;
    /** default: the document's first server */
    baseUrl?: string;
    /** default: every operation */
    operations?: Record<string, boolean>;
    groups?: string[];
    enabled?: boolean;
    timeout?: number;
    retries?: number;
}

/** A call answered with a status other than 2xx: a BPMN error HTTP_<status> in a model. */
export class ConnectorError extends Error {
    readonly code: string;
    constructor(readonly status: number, readonly body: any, readonly connector: string) {
        super(`${connector}: HTTP ${status}${body === undefined || body === '' ? '' : ' ' + (typeof body === 'string' ? body : JSON.stringify(body)).slice(0, 300)}`);
        this.name = 'ConnectorError';
        this.code = `HTTP_${status}`;
    }
}

export interface CallResult {
    status: number;
    output: any;
    /** the URL called, the key left out */
    url: string;
    ms: number;
}

const now = () => new Date().toISOString();

export class Connectors {
    /** each connector's document and operations, read once and kept until the document changes */
    private readonly compiled = new Map<string, { stamp: string; document: any; operations: Map<string, Operation> }>();
    /** each file as last read, kept while it is the same (its time and size) */
    private readonly files = new Map<string, { stamp: string; definition: any }>();

    constructor(private readonly server: IBPMNServer) { }

    /** The connector's document and operations, from the cache while the document is the same. */
    private compile(connector: Connector) {
        const stamp = `${connector.openapi.fetchedAt}:${connector.openapi.bytes}`;
        const cached = this.compiled.get(connector.id);
        if (cached?.stamp === stamp) return cached;
        const document = connector.openapi.document;
        const entry = { stamp, document, operations: listOperations(document).operations };
        this.compiled.set(connector.id, entry);
        return entry;
    }

    private get settings() { return (this.server.configuration as any).connectors ?? {}; }
    private get store() { return this.server.documentStore ?? (this.server.dataStore as any).db; }
    /**
     * The logical database, as the data store has it (ignored by single-database stores). A MongoDB configuration
     * without a `db` leaves it undefined: MongoDB then uses the database its URL names.
     */
    private get database() { return ((this.server.configuration.database as any)?.MongoDB ?? { db: 'bpmn' }).db; }

    // ---- the files: the models folder's <id>.connector.json

    /** The models folder, where the connectors' files are. */
    private get folder(): string { return path.resolve(this.server.configuration.definitionsPath ?? 'processes'); }
    private fileOf(id: string) { return path.join(this.folder, id + FILE); }

    /** A connector's definition from its file, or undefined; read again only when the file changed. */
    private readDefinition(id: string): any | undefined {
        const file = this.fileOf(id);
        let stat: fs.Stats;
        try { stat = fs.statSync(file); }
        catch { this.files.delete(id); return undefined; }
        const stamp = `${stat.mtimeMs}:${stat.size}`;
        const cached = this.files.get(id);
        if (cached?.stamp === stamp) return cached.definition;
        let definition;
        try { definition = JSON.parse(fs.readFileSync(file, 'utf8')); }
        catch (error) { throw new Error(`The connector file ${id}${FILE} can not be read: ${error.message}`); }
        if (definition?.id !== id) throw new Error(`The connector file ${id}${FILE} names the connector '${definition?.id}': its id is its file's name`);
        this.files.set(id, { stamp, definition });
        return definition;
    }

    /** Writes a connector's definition to its file (as the models are written: by the server, into its folder). */
    private writeDefinition(definition: any) {
        fs.mkdirSync(this.folder, { recursive: true });
        fs.writeFileSync(this.fileOf(definition.id), JSON.stringify(definition, null, 2) + '\n');
        this.files.delete(definition.id);
        this.compiled.delete(definition.id);
    }

    /** The ids of the connectors' files. */
    private fileIds(): string[] {
        try { return fs.readdirSync(this.folder).filter(f => f.endsWith(FILE)).map(f => f.slice(0, -FILE.length)); }
        catch { return []; }
    }

    // ---- the server's own: wf_connectors

    private async stateOf(id: string): Promise<any | undefined> {
        const [found] = await this.store.find(this.database, COLLECTION, { id });
        return found;
    }

    private async setState(id: string, set: Record<string, any>, unset?: Record<string, string>) {
        await this.store.update(this.database, COLLECTION, { id }, { $set: { id, ...set }, ...(unset ? { $unset: unset } : {}) }, { upsert: true });
    }

    async install() {
        await this.store.createIndex(this.database, COLLECTION, { id: 1 }, { unique: true });
        // those kept whole in the collection before: written out to their files now
        await this.list();
    }

    // ---- reading

    /** Every connector, without its key. */
    async list(): Promise<Connector[]> {
        const kept = await this.store.find(this.database, COLLECTION, {});
        const ids = new Set([...this.fileIds(), ...kept.filter(k => k.openapi).map(k => k.id)]);
        const all = [];
        for (const id of [...ids].sort()) {
            const connector = await this.load(id);
            if (connector) all.push(this.withoutSecret(connector));
        }
        return all;
    }

    /** One connector, without its key; undefined when there is none. */
    async get(id: string): Promise<Connector | undefined> {
        const found = await this.load(id);
        return found && this.withoutSecret(found);
    }

    /** A connector's operations: every one the document has, and whether designers may use it. */
    async operations(id: string): Promise<(Operation & { enabled: boolean })[]> {
        const connector = await this.required(id);
        return [...this.compile(connector).operations.values()]
            .map(op => ({ ...op, enabled: connector.operations[op.operationId] !== false }));
    }

    /** A connector's OpenAPI document, as it was read. */
    async document(id: string): Promise<any> {
        return this.compile(await this.required(id)).document;
    }

    /** What this server keeps of its connectors (keys encrypted, tests): for a backup. The files are the models'. */
    async backup(): Promise<Record<string, any[]>> {
        return { [COLLECTION]: await this.store.find(this.database, COLLECTION, {}) };
    }

    /** A connector: its file, with this server's key and test. One kept whole in the collection is written out first. */
    private async load(id: string): Promise<Connector | undefined> {
        if (!ID.test(id ?? '')) return undefined;
        let definition = this.readDefinition(id);
        let state = await this.stateOf(id);
        if (!definition && state?.openapi)
            ({ definition, state } = await this.writeOut(state));
        if (!definition) return undefined;
        const auth = definition.auth ? { ...definition.auth, ...(state?.key ?? {}) } : undefined;
        return { ...definition, ...(auth ? { auth } : {}), ...(state?.test ? { test: state.test } : {}) };
    }

    /** A connector kept whole in the collection (3.6): its definition to its file; its key and test stay, alone. */
    private async writeOut(kept: any): Promise<{ definition: any; state: ServerState }> {
        const { _id, auth, test, openapi, ...rest } = kept;
        const document = openapi.document ?? unpack(openapi.packed);
        const { secret, last4, setAt, setBy, ...scheme } = auth ?? {};
        const definition = {
            ...rest,
            ...(auth ? { auth: scheme } : {}),
            openapi: { source: openapi.source, version: openapi.version, title: openapi.title, fetchedAt: openapi.fetchedAt, bytes: openapi.bytes ?? Buffer.byteLength(JSON.stringify(document)), document },
        };
        this.writeDefinition(definition);
        const state: ServerState = { id: kept.id, ...(secret ? { key: { secret, last4, setAt, setBy } } : {}), ...(test ? { test } : {}) };
        await this.store.remove(this.database, COLLECTION, { id: kept.id });
        await this.store.insert(this.database, COLLECTION, [state]);
        this.server.logger.log(`connector '${kept.id}': written out to ${kept.id}${FILE} in the models folder; its key and test stay with this server`);
        return { definition, state };
    }

    private async required(id: string): Promise<Connector> {
        const found = await this.load(id);
        if (!found) throw new Error(`No connector '${id}'`);
        return found;
    }

    /** What callers see: no key, and the document only described (`document(id)` reads it). */
    private withoutSecret(connector: Connector): Connector {
        const { _id, ...rest } = connector as any;
        if (rest.openapi) {
            const { document, packed, ...openapi } = rest.openapi;
            rest.openapi = openapi;
        }
        if (!rest.auth) return rest;
        const { secret, ...auth } = rest.auth;
        return { ...rest, auth };
    }

    // ---- administration

    /** Adds a connector from its OpenAPI document (given, or fetched from `source`): its file in the models folder. */
    async add(input: ConnectorInput, userName?: string): Promise<Connector> {
        if (!ID.test(input.id ?? ''))
            throw new Error(`'${input.id}' can not be a connector id: letters, digits, - and _, starting with a letter or digit`);
        if (await this.load(input.id))
            throw new Error(`A connector '${input.id}' exists`);
        const document = await this.readDocument(input);
        const { operations } = listOperations(document);
        if (!operations.size)
            throw new Error('The OpenAPI document has no operation with an operationId: a model names operations by it');
        const baseUrl = this.checkBaseUrl(input.baseUrl ?? document.servers?.[0]?.url, input.source);
        const connector: Connector = {
            id: input.id,
            name: input.name || document.info?.title || input.id,
            description: input.description ?? document.info?.description,
            openapi: this.openapiOf(document, input.source),
            baseUrl,
            operations: Object.fromEntries([...operations.keys()].map(op => [op, input.operations?.[op] ?? true])),
            groups: input.groups ?? [],
            enabled: input.enabled ?? true,
            timeout: input.timeout,
            retries: input.retries,
            createdAt: now(), updatedAt: now(),
        };
        this.writeDefinition(connector);
        // a key or test left by a connector of that id removed before is not this one's
        await this.store.remove(this.database, COLLECTION, { id: connector.id });
        this.server.logger.log(`connector '${connector.id}' added${userName ? ' by ' + userName : ''}: ${operations.size} operations, ${baseUrl}`);
        return this.withoutSecret(connector);
    }

    /** Changes a connector's name, description, base URL, operations, groups, enabled, timeout or retries. */
    async update(id: string, patch: Partial<Pick<Connector, 'name' | 'description' | 'baseUrl' | 'operations' | 'groups' | 'enabled' | 'timeout' | 'retries'>>): Promise<Connector> {
        await this.required(id);
        const definition = { ...this.readDefinition(id) };
        const allowed = ['name', 'description', 'baseUrl', 'operations', 'groups', 'enabled', 'timeout', 'retries'];
        const set: any = { updatedAt: now() };
        for (const key of allowed)
            if (patch[key] !== undefined) set[key] = patch[key];
        if (set.baseUrl !== undefined) set.baseUrl = this.checkBaseUrl(set.baseUrl);
        if (set.operations) set.operations = { ...definition.operations, ...set.operations };
        this.writeDefinition({ ...definition, ...set });
        return this.get(id);
    }

    /**
     * Reads the document again (from its source, or the one given): operations it no longer has are dropped,
     * new ones are enabled. Returns what changed.
     */
    async refresh(id: string, document?: string | object): Promise<{ added: string[]; removed: string[] }> {
        const connector = await this.required(id);
        const fresh = await this.readDocument(document ? { id, document } : { id, source: connector.openapi.source });
        const before = new Set(Object.keys(connector.operations));
        const after = [...listOperations(fresh).operations.keys()];
        const operations = Object.fromEntries(after.map(op => [op, connector.operations[op] ?? true]));
        this.writeDefinition({ ...this.readDefinition(id), openapi: this.openapiOf(fresh, connector.openapi.source), operations, updatedAt: now() });
        return { added: after.filter(op => !before.has(op)), removed: [...before].filter(op => !after.includes(op)) };
    }

    /** What is kept of a document: where it came from, its version and title, and itself, as JSON. */
    private openapiOf(document: any, source?: string): Connector['openapi'] {
        return { source, version: document.openapi, title: document.info?.title, fetchedAt: now(), bytes: Buffer.byteLength(JSON.stringify(document)), document };
    }

    /** Removes a connector: its file, and this server's key and test. */
    async remove(id: string): Promise<boolean> {
        this.compiled.delete(id);
        await this.load(id);   // one kept whole in the collection: written out first, so it is removed as a file too
        let existed = false;
        if (ID.test(id ?? '')) {
            try { fs.unlinkSync(this.fileOf(id)); existed = true; } catch { /* no file */ }
            this.files.delete(id);
        }
        const { deletedCount } = await this.store.remove(this.database, COLLECTION, { id });
        return existed || deletedCount > 0;
    }

    /**
     * Sets (or replaces) the connector's authorization key, stored encrypted with this server. `how` is a securitySchemes
     * name of the document, or a scheme given here; none: the document's only scheme. For basic, the key is
     * `user:password`. The scheme goes in the file; the key stays with this server.
     */
    async setKey(id: string, key: string, how: string | Omit<ConnectorAuth, 'secret' | 'last4' | 'setAt' | 'setBy'> = undefined, userName?: string): Promise<Connector> {
        const connector = await this.required(id);
        if (typeof key !== 'string' || !key)
            throw new Error('The key is empty');
        const auth = this.authScheme(connector, how);
        if (auth.type === 'basic' && !key.includes(':'))
            throw new Error('A basic key is user:password');
        const definition = this.readDefinition(id);
        if (JSON.stringify(definition.auth ?? null) !== JSON.stringify(auth))
            this.writeDefinition({ ...definition, auth, updatedAt: now() });
        await this.setState(id, { key: { secret: encrypt(key), last4: key.slice(-4), setAt: now(), ...(userName ? { setBy: userName } : {}) } });
        return this.get(id);
    }

    /** Removes the connector's key: its calls go without authorization. */
    async clearKey(id: string): Promise<Connector> {
        await this.required(id);
        const { auth, ...definition } = this.readDefinition(id);
        if (auth) this.writeDefinition({ ...definition, updatedAt: now() });
        await this.setState(id, {}, { key: '' });
        return this.get(id);
    }

    /** How a key is sent: from the document's securitySchemes (by name, or its only one), or as given. */
    private authScheme(connector: Connector, how): ConnectorAuth {
        if (how && typeof how === 'object') {
            if (!['bearer', 'apiKey', 'basic'].includes(how.type)) throw new Error(`Unknown authorization type '${how.type}': bearer, apiKey or basic`);
            if (how.type === 'apiKey' && (!how.name || !['header', 'query', 'cookie'].includes(how.in ?? 'header')))
                throw new Error('An apiKey needs the name of its header (or query parameter, or cookie)');
            return how.type === 'apiKey' ? { type: 'apiKey', in: how.in ?? 'header', name: how.name } : { type: how.type };
        }
        const schemes = this.compile(connector).document.components?.securitySchemes ?? {};
        const supported = Object.entries<any>(schemes).filter(([, s]) => this.fromScheme(s));
        const name = typeof how === 'string' ? how : supported.length === 1 ? supported[0][0] : undefined;
        if (!name) {
            if (typeof how === 'string') throw new Error(`The document has no security scheme '${how}'`);
            throw new Error(supported.length
                ? `Name the security scheme: ${supported.map(([n]) => n).join(', ')}`
                : 'The document has no security scheme this server can send (bearer, apiKey or basic): give the type');
        }
        if (!schemes[name]) throw new Error(`The document has no security scheme '${name}'`);
        const auth = this.fromScheme(schemes[name]);
        if (!auth) throw new Error(`The security scheme '${name}' (${schemes[name].type}) is not supported yet: bearer, apiKey or basic`);
        return { ...auth, scheme: name };
    }

    private fromScheme(scheme): ConnectorAuth | undefined {
        if (scheme?.type === 'http' && /^bearer$/i.test(scheme.scheme)) return { type: 'bearer' };
        if (scheme?.type === 'http' && /^basic$/i.test(scheme.scheme)) return { type: 'basic' };
        if (scheme?.type === 'apiKey' && scheme.name) return { type: 'apiKey', in: scheme.in ?? 'header', name: scheme.name };
        return undefined;
    }

    /** Tests the connection: calls an operation (none named: a GET that needs no input) with the inputs given, and keeps the answer. */
    async test(id: string, operationId?: string, input: Record<string, any> = {}): Promise<Connector['test']> {
        const ops = await this.operations(id);
        const op = operationId ? ops.find(o => o.operationId === operationId)
            : ops.find(o => o.method === 'GET' && !o.parameters.some(p => p.required));
        if (!op) throw new Error(operationId ? `No operation '${operationId}'` : 'Name an operation to test with: none is a GET without required parameters');
        let result: Connector['test'];
        try {
            const { status } = await this.call(`${id}/${op.operationId}`, input ?? {}, { test: true });
            result = { at: now(), operation: op.operationId, ok: true, status, message: `HTTP ${status}` };
        }
        catch (error) {
            result = { at: now(), operation: op.operationId, ok: false, status: error.status, message: error.message };
        }
        await this.setState(id, { test: result });
        return result;
    }

    // ---- calling

    /**
     * Calls `<connector>/<operationId>` with the inputs: the operation's parameters by name, the JSON body as `body`
     * or its fields as `body.<field>`. Answers { status, output }; a status other than 2xx throws a ConnectorError.
     */
    async call(ref: string, input: Record<string, any> = {}, options: { signal?: AbortSignal; test?: boolean; log?: (line: string) => void } = {}): Promise<CallResult> {
        const slash = String(ref ?? '').indexOf('/');
        if (slash <= 0)
            throw new Error(`'${ref}' does not name a connector's operation: <connector>/<operationId>`);
        const id = ref.slice(0, slash), operationId = ref.slice(slash + 1);
        const connector = await this.load(id);
        if (!connector) throw new Error(`No connector '${id}'`);
        if (!connector.enabled && !options.test) throw new Error(`The connector '${id}' is disabled`);
        const op = this.compile(connector).operations.get(operationId);
        if (!op) throw new Error(`The connector '${id}' has no operation '${operationId}'`);
        if (connector.operations[operationId] === false && !options.test) throw new Error(`The operation '${ref}' is disabled`);

        const request = this.buildRequest(connector, op, input ?? {});
        const timeout = connector.timeout ?? this.settings.timeout ?? 30_000;
        const tries = 1 + (IDEMPOTENT.includes(op.method) ? (connector.retries ?? this.settings.retries ?? 2) : 0);
        const started = Date.now();
        let response: Response;
        for (let attempt = 1; ; attempt++) {
            const signal = options.signal ? AbortSignal.any([options.signal, AbortSignal.timeout(timeout)]) : AbortSignal.timeout(timeout);
            try {
                response = await fetch(request.url, { method: op.method, headers: request.headers, body: request.body, signal, redirect: 'manual' });
                if (attempt < tries && (response.status === 429 || response.status >= 500)) {
                    await response.body?.cancel();
                    await this.backoff(attempt);
                    continue;
                }
                break;
            }
            catch (error) {
                if (error?.name === 'TimeoutError')
                    throw new Error(`${ref}: no answer within ${timeout} ms`);
                if (attempt >= tries || options.signal?.aborted)
                    throw new Error(`${ref}: ${error?.cause?.message ?? error.message}`);
                await this.backoff(attempt);
            }
        }
        const output = await this.readBody(response, ref);
        const ms = Date.now() - started;
        options.log?.(`connector ${ref}: ${op.method} ${request.logUrl} → ${response.status} in ${ms} ms`);
        if (response.status < 200 || response.status > 299)
            throw new ConnectorError(response.status, output, ref);
        return { status: response.status, output, url: request.logUrl, ms };
    }

    private backoff(attempt: number) {
        const delay = (this.settings.retryDelay ?? 200) * 2 ** (attempt - 1);
        return new Promise(resolve => setTimeout(resolve, delay));
    }

    /** The request: the base URL joined with the operation's path, its parameters in place, the body, the key. */
    private buildRequest(connector: Connector, op: Operation, input: Record<string, any>) {
        let path = op.path;
        const query = new URLSearchParams();
        const headers: Record<string, string> = { Accept: 'application/json' };
        const cookies: string[] = [];
        for (const p of op.parameters) {
            const value = input[p.name];
            if (value === undefined || value === null || value === '') {
                if (p.required) throw new Error(`${connector.id}/${op.operationId}: the input '${p.name}' is required`);
                continue;
            }
            const text = typeof value === 'object' ? JSON.stringify(value) : String(value);
            if (p.in === 'path') {
                if (text === '.' || text === '..') throw new Error(`${connector.id}/${op.operationId}: '${text}' can not be the path parameter '${p.name}'`);
                path = path.split(`{${p.name}}`).join(encodeURIComponent(text));
            }
            else if (p.in === 'query') {
                for (const one of Array.isArray(value) ? value : [value]) query.append(p.name, typeof one === 'object' ? JSON.stringify(one) : String(one));
            }
            else if (p.in === 'header') headers[p.name] = text;
            else if (p.in === 'cookie') cookies.push(`${p.name}=${encodeURIComponent(text)}`);
        }

        let body: string | undefined;
        if (op.body) {
            let value = input.body;
            const fields = Object.keys(input).filter(k => k.startsWith('body.'));
            if (fields.length) {
                value = value && typeof value === 'object' ? { ...value } : {};
                for (const field of fields) value[field.slice(5)] = input[field];
            }
            if (value === undefined && op.body.required)
                throw new Error(`${connector.id}/${op.operationId}: the input 'body' is required`);
            if (value !== undefined) {
                body = typeof value === 'string' ? value : JSON.stringify(value);
                headers['Content-Type'] = op.body.contentType;
            }
        }

        // the key, as its scheme sends it; logUrl leaves it out
        let keyInQuery: string | undefined;
        if (connector.auth?.secret) {
            const key = decrypt(connector.auth.secret);
            const auth = connector.auth;
            if (auth.type === 'bearer') headers.Authorization = `Bearer ${key}`;
            else if (auth.type === 'basic') headers.Authorization = `Basic ${Buffer.from(key, 'utf8').toString('base64')}`;
            else if (auth.in === 'query') { query.set(auth.name, key); keyInQuery = auth.name; }
            else if (auth.in === 'cookie') cookies.push(`${auth.name}=${encodeURIComponent(key)}`);
            else headers[auth.name] = key;
        }
        if (cookies.length) headers.Cookie = cookies.join('; ');

        const base = new URL(connector.baseUrl);
        this.checkHost(base);
        const url = new URL(base.href.replace(/\/+$/, '') + path);
        if (url.origin !== base.origin) throw new Error(`${connector.id}/${op.operationId}: the path leaves the connector's server`);
        url.search = query.toString();
        const logged = new URL(url.href);
        if (keyInQuery) logged.searchParams.set(keyInQuery, '***');
        return { url: url.href, headers, body, logUrl: logged.href };
    }

    /** The body: JSON when it is, else text; refused past the size limit. */
    private async readBody(response: Response, ref: string) {
        const limit = this.settings.maxResponseBytes ?? 5 * 1024 * 1024;
        const declared = Number(response.headers.get('content-length'));
        if (declared > limit) {
            await response.body?.cancel();
            throw new Error(`${ref}: the answer is ${declared} bytes, more than ${limit}`);
        }
        const bytes = Buffer.from(await response.arrayBuffer());
        if (bytes.length > limit) throw new Error(`${ref}: the answer is ${bytes.length} bytes, more than ${limit}`);
        const text = bytes.toString('utf8');
        if (!text) return undefined;
        if (/json/i.test(response.headers.get('content-type') ?? '') || /^\s*[[{]/.test(text)) {
            try { return JSON.parse(text); } catch { /* text, then */ }
        }
        return text;
    }

    // ---- documents and addresses

    private async readDocument(input: { id: string; source?: string; document?: string | object }) {
        if (input.document !== undefined) return parseDocument(input.document);
        if (!input.source) throw new Error('Give the OpenAPI document, or its URL');
        let response: Response;
        try {
            response = await fetch(input.source, { signal: AbortSignal.timeout(this.settings.timeout ?? 30_000) });
        }
        catch (error) {
            throw new Error(`The OpenAPI document could not be fetched from ${input.source}: ${error?.cause?.message ?? error.message}`);
        }
        if (!response.ok) throw new Error(`The OpenAPI document could not be fetched from ${input.source}: HTTP ${response.status}`);
        return parseDocument(await response.text());
    }

    /** An http(s) URL on an allowed host; a relative server URL is read against the document's URL. */
    private checkBaseUrl(value: string, source?: string): string {
        if (!value) throw new Error('Give the base URL: the document names no server');
        let url: URL;
        try {
            url = new URL(value, source);
        }
        catch {
            throw new Error(`'${value}' is not a URL${source ? '' : ' (a relative server URL needs the document\'s URL)'}`);
        }
        if (!/^https?:$/.test(url.protocol)) throw new Error(`The base URL must be http or https: ${value}`);
        this.checkHost(url);
        return url.href.replace(/\/+$/, '');
    }

    /** CONNECTORS_ALLOW_HOSTS (a comma list; *.example.com for its subdomains), when set, limits the hosts. */
    private checkHost(url: URL) {
        const allowed = (process.env.CONNECTORS_ALLOW_HOSTS ?? '').split(',').map(h => h.trim().toLowerCase()).filter(Boolean);
        if (!allowed.length) return;
        const host = url.hostname.toLowerCase();
        if (!allowed.some(a => a === host || (a.startsWith('*.') && host.endsWith(a.slice(1)))))
            throw new Error(`${host} is not in CONNECTORS_ALLOW_HOSTS`);
    }
}
