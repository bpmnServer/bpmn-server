import fs from 'node:fs';
import path from 'node:path';
import { moddleOptions as defaultModdleOptions } from '../elements/js-bpmn-moddle.js';
import type { BPMNServer } from './BPMNServer.js';
import { engineCalls } from './EngineService.js';

/** Running or testing a process, when nothing can run it: the rest (models, their history, their checks) goes on. */
export class EngineNotRunningError extends Error {
    readonly code = 'ENGINE_NOT_RUNNING';
    constructor(why = 'none is running here') {
        super(`This needs an engine, and ${why}. Models can be edited and saved; running and testing them cannot.`);
        this.name = 'EngineNotRunningError';
    }
}

type EngineCall = (method: string, args: any[]) => Promise<any>;

/** The engine's calls over the network: the private link from a host to its engine. */
const timedOut = (at: string, ms: number) => Object.assign(
    new Error(`The engine at ${at} did not answer within ${ms} ms. It may still be running what it was asked: check before asking again`),
    { name: 'EngineTimeoutError', code: 'ENGINE_TIMEOUT' });

/** How long a host waits for its engine, unless told (`engineTimeout`): what fetch itself allows an answer to take. */
const ENGINE_TIMEOUT = 5 * 60_000;

function remoteCall(at: string, key: string, timeout = ENGINE_TIMEOUT): EngineCall {
    const url = `${at.replace(/\/+$/, '')}/engine/call`;
    return async (method, args) => {
        // an argument left out stays out, for the engine's default
        while (args.length && args[args.length - 1] === undefined) args = args.slice(0, -1);
        let response;
        try {
            response = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json', 'x-engine-key': key ?? '' }, body: JSON.stringify({ method, args }), signal: AbortSignal.timeout(timeout) });
        }
        catch (error) {
            if (error?.name === 'TimeoutError') throw timedOut(at, timeout);
            throw new EngineNotRunningError(`the one at ${at} can not be reached`);
        }
        // nothing here tries again: a call that may have run is not to run twice
        const answer = await response.json().catch(error => {
            if (error?.name === 'TimeoutError') throw timedOut(at, timeout);
            return { error: { message: `The engine answered ${response.status}` } };
        });
        if (answer.error) throw Object.assign(new Error(answer.error.message), answer.error);
        return answer.result;
    };
}

/** The engine, from outside it: what it can be asked (engineCalls), each answering data. */
export class LaunchedEngine {
    #call: EngineCall | null;

    constructor(call: EngineCall | null) { this.#call = call; }

    /** Whether there is an engine to ask. */
    get running() { return this.#call !== null; }

    async #ask(method: string, args: any[]) {
        if (!this.#call) throw new EngineNotRunningError();
        return this.#call(method, args);
    }

    start(...args: any[]) { return this.#ask('start', args); }
    get(...args: any[]) { return this.#ask('get', args); }
    cancel(...args: any[]) { return this.#ask('cancel', args); }
    retry(...args: any[]) { return this.#ask('retry', args); }
    restart(...args: any[]) { return this.#ask('restart', args); }
    invoke(...args: any[]) { return this.#ask('invoke', args); }
    assign(...args: any[]) { return this.#ask('assign', args); }
    startEvent(...args: any[]) { return this.#ask('startEvent', args); }
    throwMessage(...args: any[]) { return this.#ask('throwMessage', args); }
    throwSignal(...args: any[]) { return this.#ask('throwSignal', args); }
    deleteInstances(query) { return this.#ask('deleteInstances', [query]); }
    tagInstance(instanceId: string, tag) { return this.#ask('tagInstance', [instanceId, tag]); }
    /** Releases one instance's lock (its id), or every lock: an administrator's. */
    releaseLocks(id?: string): Promise<boolean> { return this.#ask('releaseLocks', [id]); }
    /** Claims a key for a moment (a task being claimed): whether this caller has it; releaseClaim gives it back. */
    claim(key: string): Promise<boolean> { return this.#ask('claim', [key]); }
    releaseClaim(key: string): Promise<boolean> { return this.#ask('releaseClaim', [key]); }
    /** The engine's stores set up: their indexes (at setup, at start). */
    install(options: { rebuild?: boolean } = {}) { return this.#ask('install', [options]); }
    /** The engine's index of the models, told what changed in their files. */
    modelSaved(name: string) { return this.#ask('modelSaved', [name]); }
    modelRemoved(name: string) { return this.#ask('modelRemoved', [name]); }
    modelRenamed(name: string, newName: string) { return this.#ask('modelRenamed', [name, newName]); }
    /** A connector's key for this server, stored encrypted by the engine (CONNECTORS_KEY is the engine's). */
    setConnectorKey(id: string, key: string, userName?: string) { return this.#ask('setConnectorKey', [id, key, userName]); }
    clearConnectorKey(id: string) { return this.#ask('clearConnectorKey', [id]); }
    /** A connector's file removed by the host: its key and test go, where the engine keeps them. */
    connectorRemoved(id: string) { return this.#ask('connectorRemoved', [id]); }
    /** A connector's connection tested, from the engine, which makes its calls; the result kept there. */
    testConnector(id: string, operationId?: string, input = {}) { return this.#ask('testConnector', [id, operationId, input]); }
    upgrade(...args: any[]) { return this.#ask('upgrade', args); }
    upgradeRunning(...args: any[]) { return this.#ask('upgradeRunning', args); }
    invokeDecision(...args: any[]) { return this.#ask('invokeDecision', args); }
    facts() { return this.#ask('facts', []); }
    checkModel(name: string, source: string) { return this.#ask('checkModel', [name, source]); }
    /** A call added to the engine's (`calls` of launch, and of startEngineService where the engine is). */
    call(method: string, ...args: any[]) { return this.#ask(method, args); }

    /** What is being run now; nothing when no engine is running. */
    async live(): Promise<any[]> { return this.#call ? this.#call('live', []) : []; }
    async status() { return this.#call ? this.#call('status', []) : { running: 0, calls: 0, handedOff: 0, engine: 'none' }; }
}

/** A provider of nothing but names, as checking a model or a template asks of one: `a.b` is `{ a: { b() {} } }`. */
function providerOf(names: string[]) {
    const provider = {};
    for (const name of names) {
        const parts = name.split('.');
        let at = provider;
        for (const part of parts.slice(0, -1)) at = (at[part] ??= {});
        at[parts[parts.length - 1]] = () => undefined;
    }
    return provider;
}

/**
 * What a launched server knows of its application without any of its code: the names of its services, from the file its
 * scan made (scanServices in bpmn-web) or else from the engine, and the model extensions. The code is inside the engine,
 * which is asked for the application's own checks of a model.
 */
class ApplicationFacts {
    /** What the engine says of the model extensions, once asked. */
    moddleFromEngine;

    constructor(private readonly configuration, private readonly engine: LaunchedEngine) { }

    get moddleOptions() { return this.moddleFromEngine ?? this.configuration.moddleOptions ?? defaultModdleOptions; }

    async getServicesProvider() {
        try {
            const scanned = JSON.parse(fs.readFileSync(this.configuration.servicesFile ?? path.resolve('services.json'), 'utf8'));
            return providerOf([...(scanned.services ?? []), ...(scanned.extra ?? [])]);
        }
        catch {
            // no file: the engine knows, when there is one; else no names, so services are not checked
            if (!this.engine.running) return null;
            return this.engine.facts().then(facts => providerOf(facts.services), () => null);
        }
    }

    /** The application's own checks, which are its code: the engine's to run. Without one, it is said they did not. */
    async verifyModel({ name, source }) {
        const skipped = [{ severity: 'info', code: 'application-checks-skipped', message: 'The application\'s own checks of this model did not run: they need an engine.' }];
        if (!this.engine.running) return skipped;
        try {
            return await this.engine.checkModel(name, source);
        }
        catch (error) {
            if (error?.code === 'ENGINE_NOT_RUNNING') return skipped;
            throw error;
        }
    }
}

/**
 * A view of one of the engine's objects for the host (docs/design/engine-isolation.md): its reads go through; a write
 * of the engine's data throws, saying what to use instead; `hidden` (a way back to the engine, its raw store) is not
 * there.
 */
function view<T extends object>(target: T, refused: Record<string, string>, hidden: string[] = [], more: Record<string, () => any> = {}): T {
    return new Proxy(target, {
        get(object, property) {
            if (typeof property === 'string') {
                if (hidden.includes(property)) return undefined;
                if (property in more) return more[property]();
                if (property in refused)
                    return () => { throw Object.assign(new Error(`${String(property)}: not the host's to do. ${refused[property]} (docs/design/engine-isolation.md)`), { code: 'ENGINE_ONLY' }); };
            }
            const value = Reflect.get(object, property, object);
            return typeof value === 'function' ? value.bind(object) : value;
        },
    });
}

const INSTANCES_ARE_THE_ENGINES = 'Instances are the engine\'s: ask it (server.engine)';
const MODELS_INDEX = 'The engine keeps the models\' index: change the files (server.models), and it is told';
const KEYS_ARE_THE_ENGINES = 'A connector\'s key and test are the engine\'s: server.engine.setConnectorKey, clearConnectorKey, testConnector, connectorRemoved';

/**
 * What `BPMNServer.launch(...)` gives: a server seen from outside its engine, with data only.
 * `new BPMNServer(...)` embeds the engine instead: the caller is inside, and gets running executions.
 *
 * Where its engine is: in this process (by default), at an address (`engine: 'http://...'`, startEngineService there), or
 * nowhere (`engine: 'none'`). All the same from here, but that without one what would run says so.
 *
 * Known gap: `dataStore` and `definitions` are the engine's own classes, each with a `.server` that leads to a server of
 * this process (holding the engine, when it is the one in this process).
 */
export class LaunchedServer {
    #server: BPMNServer;
    #ready;
    readonly engine: LaunchedEngine;
    readonly appDelegate: ApplicationFacts;

    constructor(server: BPMNServer, options: { engine?: string; engineKey?: string; engineTimeout?: number; calls?: (server: BPMNServer) => Record<string, (...args: any[]) => Promise<any>> } = {}) {
        this.#server = server;
        const at = options.engine;
        const calls = at ? null : { ...engineCalls(server), ...options.calls?.(server) };
        this.engine = new LaunchedEngine(at === 'none' ? null : at ? remoteCall(at, options.engineKey, options.engineTimeout) : (method, args) => calls[method](...args));
        this.appDelegate = new ApplicationFacts(server.configuration, this.engine);
        if (!at) this.appDelegate.moddleFromEngine = server.appDelegate.moddleOptions;
        // an engine elsewhere may not have started yet: what is not known of it then falls back on the settings
        this.#ready = at && at !== 'none'
            ? server.ready.then(() => this.engine.facts().then(facts => { this.appDelegate.moddleFromEngine = facts.moddleOptions; }, () => { }))
            : server.ready;
    }

    get ready() { return this.#ready; }
    get configuration() { return this.#server.configuration; }
    get logger() { return this.#server.logger; }
    /**
     * The instance viewer: instances, their items and locks, read only (docs/design/engine-isolation.md). Writing them
     * is the engine's (`engine`); the raw store is not here (`documentStore` is the host's own, for its own data).
     */
    get dataStore() {
        const dataStore = this.#server.dataStore as any;
        const locker = () => dataStore.locker && view(dataStore.locker, {
            lock: INSTANCES_ARE_THE_ENGINES, release: 'Locks are the engine\'s: server.engine.releaseLocks, claim, releaseClaim',
            claim: 'Locks are the engine\'s: server.engine.claim', delete: 'Locks are the engine\'s: server.engine.releaseLocks',
        }, ['server', 'db', 'dataStore']);
        return view(dataStore, {
            save: INSTANCES_ARE_THE_ENGINES, saveInstance: INSTANCES_ARE_THE_ENGINES, deleteInstances: INSTANCES_ARE_THE_ENGINES,
            tagInstance: INSTANCES_ARE_THE_ENGINES, updateInstanceSource: INSTANCES_ARE_THE_ENGINES, archive: INSTANCES_ARE_THE_ENGINES,
            install: 'The engine sets up its stores: server.engine.install',
        }, ['server', 'db', 'monitor'], { locker });
    }
    /** Model access: the models' files (read and written, with no database), and the engine's index read only. */
    get definitions() {
        return view(this.#server.definitions as any, {
            save: MODELS_INDEX, saveModel: MODELS_INDEX, deleteModel: MODELS_INDEX, renameModel: MODELS_INDEX, import: MODELS_INDEX,
            install: 'The engine sets up its stores: server.engine.install', rebuild: MODELS_INDEX, updateTimer: MODELS_INDEX,
            indexModel: MODELS_INDEX, unindexModel: MODELS_INDEX, renameIndex: MODELS_INDEX,
        }, ['server', 'db']);
    }
    /** The connectors: their files (model access's); their keys and tests the engine's. */
    get connectors() {
        const connectors = this.#server.connectors as any;
        return connectors && view(connectors, {
            setKey: KEYS_ARE_THE_ENGINES, clearKey: KEYS_ARE_THE_ENGINES, storeKey: KEYS_ARE_THE_ENGINES, forgetKey: KEYS_ARE_THE_ENGINES,
            test: KEYS_ARE_THE_ENGINES, forget: KEYS_ARE_THE_ENGINES,
            remove: "Remove its file (connectors.removeFile); its key and test are the engine's: server.engine.connectorRemoved", install: 'The engine sets up its stores: server.engine.install',
        }, ['server']);
    }
    /** The host's own store, for what is the host's (users, sessions, API tokens): not the engine's collections. */
    get documentStore() { return (this.#server as any).documentStore ?? (this.#server.dataStore as any).db; }
    /**
     * The models, as the host changes them (docs/design/engine-isolation.md): model access writes their files, with no
     * database, and the engine updates its index of them. Models kept in the database alone (no folder) are saved there.
     */
    get models() {
        const definitions = this.#server.definitions as any;
        const engine = this.engine;
        const files = typeof definitions.saveFiles === 'function';
        // with no engine, nothing runs, and nothing reads the index: the files are the models
        const tell = async (call: () => Promise<any>) => { if (engine.running) await call(); };
        return {
            async save(name: string, source: string, svg?: string, savedBy?: string) {
                if (!files) return definitions.save(name, source, svg, null, savedBy);
                await definitions.saveFiles(name, source, svg, savedBy);
                await tell(() => engine.modelSaved(name));
                return true;
            },
            async rename(name: string, newName: string) {
                if (!files) return definitions.renameModel(name, newName);
                await definitions.renameFiles(name, newName);
                await tell(() => engine.modelRenamed(name, newName));
                return true;
            },
            async remove(name: string) {
                if (!files) return definitions.deleteModel(name);
                await definitions.deleteFiles(name);
                await tell(() => engine.modelRemoved(name));
            },
            /** One saved version gone: the history is the files'. */
            deleteVersion: (name: string, version: number) => definitions.deleteVersion?.(name, version),
        };
    }
    /** Which handler checks a model's scripts, and the variables it adds. */
    get scriptHandler() { return this.#server.scriptHandler; }
    status() { return this.#server.status(); }
    shutdown() { return this.#server.shutdown(); }
}
