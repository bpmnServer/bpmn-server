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
    get dataStore() { return this.#server.dataStore; }
    get definitions() { return this.#server.definitions; }
    get connectors() { return this.#server.connectors; }
    /** Which handler checks a model's scripts, and the variables it adds. */
    get scriptHandler() { return this.#server.scriptHandler; }
    status() { return this.#server.status(); }
    shutdown() { return this.#server.shutdown(); }
}
