import path from 'node:path';
import fs from 'node:fs';
import { Configuration, Logger, ModelsDatastore, DataStore, ScriptHandler, SandboxScriptHandler, NoCacheManager } from 'bpmn-server';
import type { IAppDelegate, BPMNServer } from 'bpmn-server';
import type { WorkflowApplication } from './runtime/WorkflowApplication.js';
import { WebAppDelegate } from './runtime/WebAppDelegate.js';
import { guestAccess, checkGuestSettings, guestConfiguration } from './guests/guests.js';
import { GuestModelsDatastore } from './guests/GuestModelsDatastore.js';

const PACKAGE_ROOT = path.join(import.meta.dirname, '..');

/** What an application gives start(): its settings, its delegate, and the parts it serves. */
export interface StartOptions {
	/** bpmn-server configuration settings that replace bpmn-web's defaults (definitionsPath, timers, ...). */
	config?: Record<string, any>;
	/** The application's delegate class, usually one extending WebAppDelegate. */
	appDelegate?: new (server: BPMNServer) => IAppDelegate;
	/** The REST APIs (/api, /api2 and their /admin forms); default true. */
	api?: boolean;
	/** The web pages: tasks, instances, the model editor, administration; default true. */
	ui?: boolean;
	/** A folder of element templates for the model editor. */
	elementTemplatesPath?: string;
	/** Prepare the database (indexes, the first user) and stop: an app's `npm run setup`. */
	setupOnly?: boolean;
	/** The console instead of the web server (start processes, tasks, locks, users): an app's `npm run cli`. */
	console?: boolean;
}

function isTrue(param) {
	const val = process.env[param];
	return val && val.toLowerCase().startsWith('true');
}

/**
 * bpmn-web's configuration: models in ./processes, MongoDB at MONGO_DB_URL, the app's delegate;
 * `settings` replace any of them.
 */
export function webConfiguration(settings: Record<string, any> = {}, appDelegate?: StartOptions['appDelegate']) {
	const Delegate = appDelegate ?? WebAppDelegate;
	const guests = guestAccess();
	checkGuestSettings();
	const configuration = new Configuration({
		definitionsPath: path.resolve('processes') + path.sep,
		templatesPath: path.join(PACKAGE_ROOT, 'emailTemplates') + path.sep,
		timers: { precision: 3000 },
		database: {
			MongoDB: {
				db_url: process.env.MONGO_DB_URL,
				Locks_collection: 'wf_locks',
				Instance_collection: 'wf_instances',
				Archive_collection: 'wf_archive',
			},
		},
		apiKey: process.env.API_KEY,
		logger: server => new Logger(server),
		definitions: server => new ModelsDatastore(server),
		appDelegate: server => new Delegate(server),
		dataStore: server => {
			const ds = new DataStore(server);
			ds.enableSavePoints = isTrue('SAVE_POINTS');
			ds.saveLogs = isTrue('SAVE_LOGS');
			// with guests, an instance keeps its model's source: it never depends on a guest's folder
			ds.saveSource = guests || isTrue('SAVE_SOURCE');
			return ds;
		},
		// DEMO_MODE=true: a public demo. Scripts run in a sandbox, timers and service tasks do not run.
		scriptHandler: () => isTrue('DEMO_MODE') ? new SandboxScriptHandler() : new ScriptHandler(),
		demo: isTrue('DEMO_MODE'),
		cacheManager: server => new NoCacheManager(server),
		...settings,
		// GUEST_ACCESS=true: each guest's models in a folder of its own, never cached across guests
		...(guests ? { definitions: server => new GuestModelsDatastore(server), cacheManager: server => new NoCacheManager(server) } : {}),
	} as any);
	return guests ? guestConfiguration(configuration) : configuration;
}

/**
 * The database's indexes, and the first user (admin, password admin) when there is none. Not with guests
 * (GUEST_ACCESS): a public demo has no account with a known password, which would design the models every new
 * guest starts with.
 */
export async function setup(server: BPMNServer) {
	await server.dataStore.install();
	await server.definitions.install();
	if (guestAccess())
		return;
	const { UserService } = await import('./userAccess/UserService.js');
	await new UserService().install();
}

/**
 * MONGO_DB_URL=memory: a MongoDB in this process (the application's mongodb-memory-server), for trying
 * bpmn-web without a database server; what it holds is gone when the process stops.
 */
async function startMemoryDatabase() {
	const name = 'mongodb-memory-server';
	let MongoMemoryServer;
	try {
		({ MongoMemoryServer } = await import(name));
	}
	catch {
		throw new Error('MONGO_DB_URL=memory needs mongodb-memory-server: npm install mongodb-memory-server');
	}
	console.log('starting a MongoDB in memory (the first start downloads it): data is lost when the server stops');
	const mongod = await MongoMemoryServer.create();
	process.env.MONGO_DB_URL = mongod.getUri('bpmn');
	process.once('exit', () => { mongod.stop().catch(() => {}); });
}

/**
 * Start bpmn-web for an application: the engine with the application's configuration and delegate,
 * the database prepared, and the web server listening on PORT (default 3000).
 *
 *   await start({ config, appDelegate: AppDelegate, api: true, ui: true });
 */
export async function start(options: StartOptions = {}) {
	if (process.env.MONGO_DB_URL === 'memory')
		await startMemoryDatabase();
	if (!process.env.MONGO_DB_URL)
		throw new Error('MONGO_DB_URL is not set: name the MongoDB database in .env (MONGO_DB_URL=mongodb://localhost:27017/bpmn), or MONGO_DB_URL=memory to try without one');
	const configuration = webConfiguration(options.config, options.appDelegate);
	// an application without models yet starts with an empty models folder
	if (configuration.definitionsPath)
		fs.mkdirSync(configuration.definitionsPath, { recursive: true });
	const templates = options.elementTemplatesPath ?? path.resolve('elementTemplates');
	const application: WorkflowApplication = {
		configuration,
		api: options.api ?? true,
		ui: options.ui ?? true,
		elementTemplatesPath: fs.existsSync(templates) ? templates : undefined,
		serverOptions: options.setupOnly || options.console ? { cron: false } : {},
	};
	const { WebApp } = await import('./app.js');
	const webApp = new WebApp(application);
	await webApp.bpmnServer.ready;
	await setup(webApp.bpmnServer);
	if (options.setupOnly) {
		console.log(guestAccess()
			? 'setup done: the database is ready; visitors are guests (GUEST_ACCESS), no admin user is made'
			: 'setup done: the database is ready; sign in as admin (password admin) and change the password');
		await webApp.bpmnServer.shutdown();
		process.exit(0);
	}
	if (options.console) {
		const { runConsole } = await import('./console.js');
		await runConsole(webApp.bpmnServer);
		return webApp;
	}
	webApp.start();
	return webApp;
}
