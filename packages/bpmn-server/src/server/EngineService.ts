import crypto from 'node:crypto';
import http from 'node:http';
import path from 'node:path';
import { DMNEngine } from '../dmn/DMNEngine.js';
import { canEncrypt } from '../connectors/Secrets.js';
import { Definition } from '../elements/Definition.js';
import type { IExecutionResult } from '../interfaces/engine.js';
import type { BPMNServer } from './BPMNServer.js';

/**
 * What an engine call answers from outside the engine: a JSON copy of where the instance stands, shaped as an execution was
 * read (`.id`, `.status`, `.instance`, with `instance.items` and `instance.tokens`). Nothing in it reaches a running
 * process, and it can cross a network as it is.
 */
export function executionResult(execution): IExecutionResult {
    const { id, name, status, userName, operation, errors, action, instance } = execution;
    return JSON.parse(JSON.stringify({
        id, name, status, userName, operation, errors, action, instance,
        execution: { id, name, status },
    }));
}

/** An answer that may have no execution (no one waited for a message) or several (a signal's). */
function result(answer) {
    if (Array.isArray(answer)) return answer.map(result);
    return answer?.instance ? executionResult(answer) : answer;
}

/** A services provider's names, a level into its objects; what its delegate and the like hold is not a service. */
function serviceNames(provider): string[] {
    const namesOf = (object) => {
        const found = new Set<string>();
        for (let at = object; at && at !== Object.prototype && at !== Function.prototype; at = Object.getPrototypeOf(at))
            for (const key of Object.getOwnPropertyNames(at))
                if (key !== 'constructor' && key !== 'appDelegate' && !key.startsWith('_')) found.add(key);
        return [...found];
    };
    const names = [];
    if (!provider || typeof provider !== 'object') return names;
    for (const name of namesOf(provider)) {
        let value;
        try { value = provider[name]; } catch { continue; }
        if (typeof value === 'function') names.push(name);
        else if (value && typeof value === 'object' && !Array.isArray(value))
            for (const inner of namesOf(value))
                if (typeof value[inner] === 'function') names.push(`${name}.${inner}`);
    }
    return names;
}

/**
 * Everything outside the engine can ask of it, each answering data. It is the whole door, in this process or over the network:
 * what is not here can't be asked.
 */
export function engineCalls(server: BPMNServer): Record<string, (...args: any[]) => Promise<any>> {
    const engine = server.engine as any;
    const running = (method: string) => async (...args: any[]) => result(await engine[method](...args));
    return {
        start: running('start'),
        get: running('get'),
        cancel: running('cancel'),
        retry: running('retry'),
        restart: running('restart'),
        invoke: running('invoke'),
        assign: running('assign'),
        startEvent: running('startEvent'),
        throwMessage: running('throwMessage'),
        throwSignal: running('throwSignal'),
        upgrade: async (...args) => engine.upgrade(...args),
        upgradeRunning: async (...args) => engine.upgradeRunning(...args),
        status: async () => engine.status(),
        deleteInstances: async (query) => engine.deleteInstances(query),
        tagInstance: async (instanceId: string, tag) => engine.tagInstance(instanceId, tag),
        // the locks are the engine's (docs/design/engine-isolation.md): released and claimed here, not by the host
        /** An administrator's release: one instance's lock (`id`), or every lock (none). */
        releaseLocks: async (id?: string) => {
            const locker = server.dataStore.locker as any;
            if (typeof locker.delete !== 'function') throw new Error("This lock manager cannot release other servers' locks");
            await locker.delete(id ? { id } : {});
            return true;
        },
        /** A short claim of one key (a task being claimed through the API): whether this caller has it. */
        claim: async (key: string) => server.dataStore.locker.claim(key),
        // a connector's key and its test are this server's, the engine's: encrypted and kept here (CONNECTORS_KEY)
        setConnectorKey: async (id: string, key: string, userName?: string) => server.connectors.storeKey(id, key, userName),
        clearConnectorKey: async (id: string) => server.connectors.forgetKey(id),
        testConnector: async (id: string, operationId?: string, input = {}) => server.connectors.test(id, operationId, input),
        releaseClaim: async (key: string) => { await server.dataStore.locker.release(`claim:${key}`); return true; },
        /** A decision of the models folder evaluated, as a business rule task does: `ref` is a file's name or a decision's id. */
        invokeDecision: async (ref: string, data = {}) => {
            const found = await DMNEngine.find(server.configuration.definitionsPath, ref);
            const decision = await new DMNEngine().load(found.filePath, found.decision.id);
            return { decision: found.decision.id, file: path.basename(found.filePath), result: decision.evaluate(data) };
        },
        /** What is being run now. */
        live: async () => (server.cache.list() || []).map(execution => {
            const answer: any = executionResult(execution);
            answer.currentItem = execution.item?.id;
            answer.currentElement = execution.item?.elementId;
            answer.execution.data = answer.instance.data;
            return answer;
        }),
        /** What reading and checking a model needs of the application: its extensions, its services' names. */
        facts: async () => {
            let provider = null;
            try { provider = await server.appDelegate.getServicesProvider(null); }
            catch { /* a provider that needs a running execution */ }
            // connectorKeys: whether a connector's key can be stored here (CONNECTORS_KEY is the engine's)
            return { moddleOptions: server.appDelegate.moddleOptions, services: serviceNames(provider), connectorKeys: canEncrypt() };
        },
        /** The application's own checks of a model (appDelegate.verifyModel): its code, so here. */
        checkModel: async (name: string, source: string) => {
            const delegate = server.appDelegate as any;
            if (typeof delegate.verifyModel !== 'function') return [];
            const definition = new Definition(name, source, {
                logger: server.logger, appDelegate: { moddleOptions: delegate.moddleOptions }, listener: { emit: async () => { } },
            } as any);
            await definition.load();
            return delegate.verifyModel({ name, source, definition });
        },
    };
}

const same = (a: string, b: string) => {
    const hash = (text: string) => crypto.createHash('sha256').update(text).digest();
    return crypto.timingSafeEqual(hash(a), hash(b));
};

const MAX_BODY = 50 * 1024 * 1024;

/**
 * Serves `engineCalls` to the one who launched the server: POST /engine/call { method, args }, with the key in `x-engine-key`.
 * Private: it listens on this machine alone unless told otherwise, and no one but the host is to reach it.
 * `calls` adds to what can be asked (bpmn-web's tests): they run in here, and answer data as the rest do.
 */
export function startEngineService(server: BPMNServer, { port = 3001, host = '127.0.0.1', key, calls: added }: { port?: number; host?: string; key: string; calls?: (server: BPMNServer) => Record<string, (...args: any[]) => Promise<any>> }): Promise<http.Server> {
    if (!key) throw new Error('The engine needs a key that only its host knows: set ENGINE_KEY');
    const calls = { ...engineCalls(server), ...added?.(server) };
    const send = (response, status: number, body) => {
        response.writeHead(status, { 'Content-Type': 'application/json' });
        response.end(JSON.stringify(body));
    };
    const service = http.createServer((request, response) => {
        if (request.method !== 'POST' || request.url !== '/engine/call') return send(response, 404, { error: { message: 'Not found' } });
        if (!same(String(request.headers['x-engine-key'] ?? ''), key)) return send(response, 401, { error: { message: 'Not allowed' } });
        const chunks = [];
        let size = 0;
        request.on('data', chunk => {
            size += chunk.length;
            // read to its end, kept nowhere: cut off, the caller would get a broken connection and not this answer
            if (size <= MAX_BODY) chunks.push(chunk);
            else chunks.length = 0;
        });
        request.on('end', async () => {
            if (size > MAX_BODY) return send(response, 413, { error: { message: 'Too large' } });
            let method, args;
            try {
                ({ method, args = [] } = JSON.parse(Buffer.concat(chunks).toString('utf8')));
            }
            catch {
                return send(response, 400, { error: { message: 'Not JSON' } });
            }
            if (!Object.hasOwn(calls, method) || !Array.isArray(args)) return send(response, 404, { error: { message: `No call '${method}'` } });
            try {
                send(response, 200, { result: await calls[method](...args) });
            }
            catch (error) {
                send(response, 200, { error: { name: error?.name, message: error?.message ?? String(error), code: error?.code, status: error?.status } });
            }
        });
    });
    return new Promise((resolve, reject) => {
        service.once('error', reject);
        service.listen(port, host, () => resolve(service));
    });
}
