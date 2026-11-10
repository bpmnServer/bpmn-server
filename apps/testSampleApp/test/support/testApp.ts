// This application (its settings, delegate and services) on bpmn-web's configuration, in memory: no MongoDB,
// no timers, the models of processes/ (or another folder). For tests that drive models, in TypeScript or from
// scenario files, and debug them (VS Code: Test: current file).
//
//   const app = await testApp();
//   const run = await app.start('Buy Used Car', { caseId: 1 }, 'buyer');
//   await run.complete('task_Buy', { needsRepairs: 'No', needsCleaning: 'No' });
//   assert.equal(run.item('task_Drive').status, 'wait');
//   await app.stop();
import { BPMNServer, Logger, MemoryDocumentStore, webConfiguration } from 'bpmn-web';
import { config } from '../../settings/config.js';
import { AppDelegate } from '../../delegates/appDelegate.js';

export interface TestAppOptions {
    /** The models folder (default: the app's, processes/). */
    models?: string;
    /** Services that replace the app's for this app, by name: a stub for an external service. */
    services?: Record<string, (input, context) => any>;
    /** Silence the engine's console output (default false: what it prints helps when debugging). */
    quiet?: boolean;
}

/** An instance of a model, as the test drives it; `instance` is the latest state. */
export class Run {
    constructor(private app: TestApp, public instance) { }

    get id(): string { return this.instance.id; }
    get status(): string { return this.instance.status; }
    get data(): Record<string, any> { return this.instance.data; }

    /** Every item of an element, in the order they ran (none: []). */
    items(elementId: string) {
        return (this.instance.items ?? []).filter(i => i.elementId === elementId);
    }
    /** The element's latest item, or undefined when it has not run. */
    item(elementId: string) {
        return this.items(elementId).at(-1);
    }
    /** The elements waiting (user tasks, receive tasks, catching and boundary events), by id. */
    waiting(): string[] {
        return [...new Set((this.instance.items ?? []).filter(i => i.status === 'wait').map(i => i.elementId))];
    }

    /** Complete the waiting element with data, as `user`; fails when it is not waiting. */
    async complete(elementId: string, data: Record<string, any> = {}, user?: string): Promise<Run> {
        const item = (this.instance.items ?? []).find(i => i.elementId === elementId && i.status === 'wait');
        if (!item)
            throw new Error(`${elementId} is not waiting; waiting: ${this.waiting().join(', ') || 'nothing'} (the instance is ${this.status})`);
        return this.update(await this.app.server.engine.invoke({ id: this.id, 'items.id': item.id }, data, user ?? null));
    }
    /** Send a message (by its name) to this instance. */
    async message(name: string, data: Record<string, any> = {}): Promise<Run> {
        return this.update(await this.app.server.engine.throwMessage(name, data, { id: this.id }));
    }
    /** Throw a signal (by its name) to this instance. */
    async signal(name: string, data: Record<string, any> = {}): Promise<Run> {
        await this.app.server.engine.throwSignal(name, data, { id: this.id });
        return this.refresh();
    }
    /** Read the instance again (after something outside this run changed it). */
    async refresh(): Promise<Run> {
        this.instance = await this.app.server.dataStore.findInstance({ id: this.id }, 'full');
        return this;
    }
    /** The engine's log of this instance: what ran, and why each gateway went the way it did. */
    log(): string[] {
        return (this.instance.logs ?? []).map(l => typeof l === 'string' ? l : l.message);
    }

    private async update(execution): Promise<Run> {
        if (execution?.instance) this.instance = execution.instance;
        else await this.refresh();
        return this;
    }
}

export interface TestApp {
    server: BPMNServer;
    /** Start a model by name, as `user`; `startNodeId` picks one of several start events. */
    start(name: string, data?: Record<string, any>, user?: string, startNodeId?: string): Promise<Run>;
    /** Send a message (by its name): to the instance waiting for it, else starting the model whose start event it is. */
    message(name: string, data?: Record<string, any>): Promise<Run | null>;
    stop(): Promise<void>;
}

export async function testApp(options: TestAppOptions = {}): Promise<TestApp> {
    const stubs = options.services;
    class Delegate extends AppDelegate {
        async getServicesProvider(context) {
            const services = await super.getServicesProvider(context);
            // the stubs first; the app's own services behind them
            return stubs ? Object.assign(Object.create(services), stubs) : services;
        }
    }
    const store = new MemoryDocumentStore();
    const logger = () => new Logger({ toConsole: false });
    const configuration = webConfiguration({
        ...config(),
        ...(options.models ? { definitionsPath: options.models } : {}),
        timers: { precision: 1000, pollInterval: 0 },
        documentStore: () => store,
        logger,
    }, Delegate);
    const restore = options.quiet ? silenceConsole() : () => { };
    const server = new BPMNServer(configuration, logger(), { cron: false });
    await server.ready;
    await server.dataStore.install();
    await server.definitions.rebuild();

    const app: TestApp = {
        server,
        async start(name, data = {}, user, startNodeId) {
            const execution = await server.engine.start(name, data, startNodeId ?? null, user ?? null);
            return new Run(app, execution.instance);
        },
        async message(name, data = {}) {
            const execution = await server.engine.throwMessage(name, data);
            return execution?.instance ? new Run(app, execution.instance) : null;
        },
        async stop() {
            await server.shutdown();
            restore();
        },
    };
    return app;
}

function silenceConsole() {
    const saved = { log: console.log, info: console.info, debug: console.debug };
    console.log = console.info = console.debug = () => { };
    return () => Object.assign(console, saved);
}
