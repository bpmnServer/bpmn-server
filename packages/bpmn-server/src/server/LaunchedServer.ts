import fs from 'node:fs';
import path from 'node:path';
import { moddleOptions as defaultModdleOptions } from '../elements/js-bpmn-moddle.js';
import type { IExecutionResult } from '../interfaces/engine.js';
import type { BPMNServer } from './BPMNServer.js';
import type { Engine } from './Engine.js';

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

/** Running or testing a process, when nothing can run it: the rest (models, their history, their checks) goes on. */
export class EngineNotRunningError extends Error {
    readonly code = 'ENGINE_NOT_RUNNING';
    constructor() {
        super('This needs an engine, and none is running here. Models can be edited and saved; running and testing them cannot.');
        this.name = 'EngineNotRunningError';
    }
}

/** The engine, from outside it: its calls, each answering data. */
export class LaunchedEngine {
    #engine: Engine | null;
    #server: BPMNServer;

    constructor(server: BPMNServer, engine: Engine | null) {
        this.#server = server;
        this.#engine = engine;
    }

    /** Whether there is an engine to run processes. */
    get running() { return this.#engine !== null; }

    #required(): Engine {
        if (!this.#engine) throw new EngineNotRunningError();
        return this.#engine;
    }

    async start(...args: Parameters<Engine['start']>) { return result(await this.#required().start(...args)); }
    async get(...args: Parameters<Engine['get']>) { return result(await this.#required().get(...args)); }
    async cancel(...args: Parameters<Engine['cancel']>) { return result(await this.#required().cancel(...args)); }
    async retry(...args: Parameters<Engine['retry']>) { return result(await this.#required().retry(...args)); }
    async restart(...args: Parameters<Engine['restart']>) { return result(await this.#required().restart(...args)); }
    async invoke(...args: Parameters<Engine['invoke']>) { return result(await this.#required().invoke(...args)); }
    async assign(...args: Parameters<Engine['assign']>) { return result(await this.#required().assign(...args)); }
    async startEvent(...args: Parameters<Engine['startEvent']>) { return result(await this.#required().startEvent(...args)); }
    async throwMessage(...args: Parameters<Engine['throwMessage']>) { return result(await this.#required().throwMessage(...args)); }
    async throwSignal(...args: Parameters<Engine['throwSignal']>) { return result(await this.#required().throwSignal(...args)); }
    async upgrade(...args: Parameters<Engine['upgrade']>) { return this.#required().upgrade(...args); }
    async upgradeRunning(...args: Parameters<Engine['upgradeRunning']>) { return this.#required().upgradeRunning(...args); }

    /** What is being run now, as data; nothing when no engine is running. */
    live(): any[] {
        return this.#engine ? runningList(this.#server) : [];
    }
    status() { return this.#engine ? this.#engine.status() : { running: 0, calls: 0, handedOff: 0, engine: 'none' }; }
}

/** The server's live executions, as data. */
function runningList(server: BPMNServer) {
    return (server.cache.list() || []).map(execution => {
        const answer: any = executionResult(execution);
        answer.currentItem = execution.item?.id;
        answer.currentElement = execution.item?.elementId;
        answer.execution.data = answer.instance.data;
        return answer;
    });
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
 * What a launched server knows of its application without any of its code: the names of its services, from the file its scan
 * made (scanServices in bpmn-web), and the model extensions. The application's own code is inside the engine.
 * No file: no names, so services are not checked.
 */
class ApplicationFacts {
    constructor(private readonly configuration) { }
    get moddleOptions() { return this.configuration.moddleOptions ?? defaultModdleOptions; }
    async getServicesProvider() {
        const file = this.configuration.servicesFile ?? path.resolve('services.json');
        let scanned;
        try {
            scanned = JSON.parse(fs.readFileSync(file, 'utf8'));
        }
        catch {
            return null;
        }
        return providerOf([...(scanned.services ?? []), ...(scanned.extra ?? [])]);
    }
}

/**
 * What `BPMNServer.launch(...)` gives: a server seen from outside its engine, with data only.
 * `new BPMNServer(...)` embeds the engine instead: the caller is inside, and gets running executions.
 * For now a launched engine runs in this process, or, with `{ engine: 'none' }`, not at all.
 *
 * Known gaps, until the engine runs elsewhere: `dataStore` and `definitions` are the engine's own objects, each with a
 * `.server` that leads to it; and the Test tab's Evaluate runs here.
 */
export class LaunchedServer {
    #server: BPMNServer;
    readonly engine: LaunchedEngine;
    readonly appDelegate: ApplicationFacts;

    constructor(server: BPMNServer, options: { engine?: 'none' } = {}) {
        this.#server = server;
        this.engine = new LaunchedEngine(server, options.engine === 'none' ? null : server.engine);
        this.appDelegate = new ApplicationFacts(server.configuration);
    }

    get ready() { return this.#server.ready; }
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
