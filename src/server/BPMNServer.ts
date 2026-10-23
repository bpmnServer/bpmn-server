import { createRequire } from 'module';
const require = createRequire(import.meta.url);
import { fileURLToPath } from 'url';
import { dirname } from 'path';
const __dirname = dirname(fileURLToPath(import.meta.url));
import { Logger } from '../common/Logger.js';
import type { IConfiguration, ILogger, IAppDelegate } from '../interfaces/common.js';
import type { IDataStore, IModelsDatastore } from '../interfaces/datastore.js';
import type { IScriptHandler } from '../interfaces/engine.js';
import type { IBPMNServer, ICacheManager } from '../interfaces/server.js';
import type { IDocumentStore, ILockManager } from '../interfaces/storage.js';
import { Engine } from './Engine.js';
import { Cron } from './Cron.js';
import { Listener } from './Listener.js';
import type { ILifecycleListener } from '../interfaces/lifecycle.js';

/**
 *	The main class of Server Layer
 *	provides the full functionalities:
 *
 *		at start of the app:
 *			const server = await BPMNServer.create(configuration, logger, options);
 *			(or, as before, new BPMNServer(configuration, logger, options), then `await server.ready`)
 *
 *		after that point:
 *
 *			server.engine.start(...)
 *			server.engine.invoke(...)
 *			server.dataStore.findInstances(...)
 *			server.dataStore.findItems(...)
 *
 *		at the end:
 *			await server.shutdown();
 *
 *	Each server is independent: its own engine, cache, listeners, timers and connections. Several
 *	may run in one process. The static accessors (`BPMNServer.getInstance()`, `BPMNServer.engine`)
 *	are kept for code written against one server per process: they answer the most recently
 *	constructed server that has not been shut down.
 */

/** Process-wide error handling belongs to the host. */

class BPMNServer implements IBPMNServer {
    /** Legacy static access retained for existing consumers; new integrations use instances. */
    private static legacyInstance: BPMNServer | undefined;


	engine: Engine;
	listener: Listener;
	configuration: IConfiguration;
	logger: ILogger;
	definitions;
	appDelegate: IAppDelegate;
	dataStore: IDataStore;
	cache: ICacheManager;
	scriptHandler: IScriptHandler;
	cron: Cron;
	/** The configuration's storage adapter, shared by the data stores (absent: each opens MongoDB). */
	documentStore?: IDocumentStore;
	/** The lock port the engine uses. */
	locker: ILockManager;
	error;
	/** Settles when the server has started: the application delegate's start-up, then (unless `cron: false`) the timers. Rejects with the reason it could not start. */
	readonly ready: Promise<void>;
	private shuttingDown: Promise<void> | null = null;

	/**
	 * Builds a server and waits until it is ready.
	 */
	static async create(configuration: IConfiguration, logger?: ILogger, options = {}): Promise<BPMNServer> {
		const server = new BPMNServer(configuration, logger, options);
		await server.ready;
		return server;
	}

	/**
	 * Server Constructor: builds the server's components and starts it; `ready` says when it has started.
	 *
	 * @param configuration	see
	 * @param logger
	 */

	constructor(configuration: IConfiguration, logger?: ILogger, options = {}) {

		if (logger == null) {
			logger = new Logger({});
		}
		this.listener = new Listener();
		this.listener.onSubscriberError = (error) => this.report(error);
		this.logger = logger;
		this.configuration = configuration;
		this.cron = new Cron(this);
		this.engine = new Engine(this);

		// The storage first: the data stores share it.
		this.documentStore = configuration.documentStore ? configuration.documentStore(this) : undefined;
		this.cache = configuration.cacheManager(this);
		this.dataStore = configuration.dataStore(this);
		this.definitions = configuration.definitions(this);
		this.appDelegate = configuration.appDelegate(this);
		this.scriptHandler = configuration.scriptHandler(this);
		this.locker = configuration.locker ? configuration.locker(this) : this.dataStore.locker;

		this.logger.log('bpmn-server version ' + BPMNServer.getVersion());

		BPMNServer.legacyInstance = this;
		this.ready = this.start(options);
		// A failed start is reported here and stays on `ready` for whoever awaits it.
		this.ready.catch(error => { this.error = error; this.report(error); });
	}
	private async start(options) {
		await this.appDelegate.startUp(options);
		if (options['cron'] == false) return;
		await this.cron.start();
	}
	/** Subscribe without coupling the engine to application implementations. */
	onLifecycle(listener: ILifecycleListener): () => void {
		return this.listener.subscribe(listener);
	}
	/**
	 * Stops the server, once however often it is called: new engine calls are refused, its timers
	 * cancelled, running executions given `shutdownTimeout` ms to finish (then left to the locks'
	 * stale age), its cache, listeners and subscriptions cleared, and its connections closed.
	 */
	shutdown(): Promise<void> {
		this.shuttingDown ??= this.stop();
		return this.shuttingDown;
	}
	private async stop() {
		this.engine.close();
		this.cron.stop();
		await this.ready.catch(() => undefined);
		this.cron.stop();
		const idle = await this.engine.drain(this.configuration.shutdownTimeout ?? 10_000);
		if (!idle) this.logger.warn?.('bpmn-server shutdown: executions still running after the timeout; their locks expire after the stale age');
		await this.cache.shutdown();
		this.listener.removeAllListeners();
		this.listener.clearSubscriptions();
		await this.dataStore.close?.();
		await this.definitions?.close?.();
		await this.documentStore?.close();
		if (BPMNServer.legacyInstance === this) BPMNServer.legacyInstance = undefined;
	}
	private report(error) {
		if (typeof this.logger.reportError === 'function') this.logger.reportError(error);
		else console.error(error);
	}
	status() {
		return {
			version: BPMNServer.getVersion(),
			cache: this.cache.list(),
			engineRunning: this.engine.runningCounter,
			engineCalls: this.engine.callsCounter,
			timers: { pending: this.cron.pending, ...this.cron.counters },
			memoryUsage: process.memoryUsage(),
		};
	}
	/** @deprecated Prefer the instance returned by the constructor or `create`. */
	static getInstance(): BPMNServer {
		if (!BPMNServer.legacyInstance) throw new Error('BPMN Server not initialized');
		return BPMNServer.legacyInstance;
	}
	/** @deprecated Prefer server.engine. */
	static get engine(): Engine { return BPMNServer.getInstance().engine; }
	static getVersion() {
		if (typeof __dirname === 'undefined') return 'unknown';
		const configPath = __dirname+'/../../package.json';
		const fs = require('fs');

		if (fs.existsSync(configPath)) {

			var configuration = JSON.parse(fs.readFileSync(configPath, 'utf8'));
			var _version = configuration['version'];
			return _version;
		}
		else
			return 'cannot locate package.json current: ' + __dirname+' path '+configPath;
    }
}

export { BPMNServer };
