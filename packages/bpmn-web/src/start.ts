import path from 'node:path';
import fs from 'node:fs';
import dotenv from 'dotenv';
import { Configuration, Logger, ModelsDatastore, DataStore, ScriptHandler, SandboxScriptHandler, NoCacheManager, SqliteDocumentStore, settingsProblems } from 'bpmn-server';
import type { IAppDelegate, BPMNServer } from 'bpmn-server';
import type { WorkflowApplication } from './runtime/WorkflowApplication.js';
import type { IUserManager } from './userAccess/IUserManager.js';
import type { UserService } from './userAccess/UserService.js';
import { WebAppDelegate } from './runtime/WebAppDelegate.js';
import { engineSettingsFromEnv } from './runtime/engineEnv.js';
import { runSetting } from './runtime/runSettings.js';
import { checkBootConfig, reportBootConfig } from './runtime/bootConfig.js';
import { settingsSchema } from './routes/api/settings.js';

const PACKAGE_ROOT = path.join(import.meta.dirname, '..');

/** DATABASE=sqlite:<file>: the file, relative to the application's folder; else undefined (MongoDB at MONGO_DB_URL). */
export function sqliteFile(value = process.env.DATABASE): string | undefined {
	if (!value?.startsWith('sqlite:')) return undefined;
	const file = value.slice('sqlite:'.length).trim();
	if (!file) throw new Error('DATABASE=sqlite: names no file: DATABASE=sqlite:./data/bpmn.sqlite');
	return path.resolve(file);
}

/** One SQLite store per file in a process: the engine, the users and the sessions share it. */
const sqliteStores = new Map<string, SqliteDocumentStore>();
function sqliteStore(file: string) {
	if (!sqliteStores.has(file)) {
		fs.mkdirSync(path.dirname(file), { recursive: true });
		sqliteStores.set(file, new SqliteDocumentStore(file));
	}
	return sqliteStores.get(file);
}

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
	/** The application's own routes, mounted before bpmn-web's (WorkflowApplication.routes). */
	routes?: WorkflowApplication['routes'];
	/**
	 * Who signs in: the application's own users, sessions and sign-in (IUserManager, WorkflowApplication.userManager).
	 * Without it, bpmn-web's own.
	 */
	userManager?: IUserManager;
	/** The API's settings (keys, service account, impersonation) of this server; default `.env`'s (runtime/hostSettings.ts). */
	hostSettings?: WorkflowApplication['hostSettings'];
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
	// LOCK_*, ENGINE_SHUTDOWN_TIMEOUT_MS, MONGO_DB_NAME (runtime/engineEnv.ts)
	const { invalid, db, ...engineEnv } = engineSettingsFromEnv();
	invalid.forEach(message => console.warn('[config] ' + message));
	const configuration = new Configuration({
		definitionsPath: path.resolve('processes') + path.sep,
		templatesPath: path.join(PACKAGE_ROOT, 'emailTemplates') + path.sep,
		timers: { precision: 3000 },
		database: {
			MongoDB: {
				db_url: process.env.MONGO_DB_URL,
				...(db ? { db } : {}),
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
			ds.saveSource = isTrue('SAVE_SOURCE');
			return ds;
		},
		// each by its own setting; DEMO_MODE only says what they are when not set (runtime/runSettings.ts)
		scriptHandler: () => runSetting('SCRIPT_SANDBOX') ? new SandboxScriptHandler({ callServices: runSetting('SCRIPT_SANDBOX_SERVICES') }) : new ScriptHandler(),
		runTimers: runSetting('TIMERS'),
		runServiceTasks: runSetting('SERVICE_TASKS'),
		// MODEL_HISTORY=false: saves keep no versions, and the editor has no History tab
		modelHistory: process.env.MODEL_HISTORY?.toLowerCase() !== 'false',
		cacheManager: server => new NoCacheManager(server),
		// DATABASE=sqlite:<file>: everything in one SQLite file (instances, models, locks, users, sessions)
		...(sqliteFile() ? { documentStore: () => sqliteStore(sqliteFile()) } : {}),
		...engineEnv,
		...settings,
	} as any);
	return configuration;
}

/**
 * The database's indexes, and the first user (admin, password ADMIN_PASSWORD) when there are no users at all; without
 * ADMIN_PASSWORD, the server's first page asks for the administrator.
 */
export async function setup(server: BPMNServer, users: UserService | null = undefined) {
	await server.dataStore.install();
	await server.definitions.install();
	await server.connectors?.install();
	const { installTokens } = await import('./routes/api/v3.js');
	await installTokens(server);
	// the Test tabs' tests, kept in MongoDB before 3.5, become files beside the models
	try {
		const { migrateScenarioSets } = await import('./testing/scenarios.js');
		const { onMongoDB } = await import('./userAccess/userStore.js');
		const moved = onMongoDB() ? await migrateScenarioSets() : 0;
		if (moved)
			console.log(`${moved} test set(s) moved from the database to files beside the models (*.tests.json)`);
	}
	catch (error) {
		console.error('the test sets in the database were not moved to files:', error.message);
	}
	// a model's tests in JSON become its .feature, as they read back the same
	try {
		const { convertTestFiles } = await import('./testing/scenarios.js');
		const { converted, left } = await convertTestFiles();
		if (converted.length)
			console.log(`${converted.length} test file(s) converted to .feature`);
		for (const { file, why } of left)
			console.error(`${file} stays as it is: ${why}`);
	}
	catch (error) {
		console.error('the test files were not converted:', error.message);
	}
	// an application that manages its own users (start({ userManager }) without users): none to make here
	if (users === null) return false;
	return await (users ?? new (await import('./userAccess/UserService.js')).UserService()).install();
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
	// each setting's value against the settings schema, and a name in .env that is close to a setting: one line each
	try {
		const envFile = path.resolve('.env');
		const names = fs.existsSync(envFile) ? Object.keys(dotenv.parse(fs.readFileSync(envFile))) : [];
		for (const problem of settingsProblems(process.env, settingsSchema(), names))
			console.warn('[config] ' + problem);
	}
	catch (error) {
		console.warn(`[config] the settings were not checked: ${error?.message ?? error}`);
	}
	// the web server: in production an unsafe setting stops it here, elsewhere it is a warning (runtime/bootConfig.ts)
	if (!options.setupOnly && !options.console
		&& !reportBootConfig(checkBootConfig(process.env, { api: options.api ?? true, ui: options.ui ?? true })))
		throw new Error('bpmn-web refused to start: unsafe settings for production (see the [config] messages above)');
	if (options.setupOnly && process.env.MONGO_DB_URL === 'memory' && !sqliteFile()) {
		// a database in memory is gone when this stops: nothing to prepare
		console.log('setup done: the database is in memory, made at each start: npm start');
		process.exit(0);
	}
	if (process.env.MONGO_DB_URL === 'memory' && !sqliteFile())
		await startMemoryDatabase();
	if (!process.env.MONGO_DB_URL && !sqliteFile())
		throw new Error('MONGO_DB_URL is not set: name the MongoDB database in .env (MONGO_DB_URL=mongodb://localhost:27017/bpmn), MONGO_DB_URL=memory to try without one, or DATABASE=sqlite:./data/bpmn.sqlite for one file');
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
		routes: options.routes,
		userManager: options.userManager,
		hostSettings: options.hostSettings,
		serverOptions: options.setupOnly || options.console ? { cron: false } : {},
	};
	const { WebApp } = await import('./app.js');
	const webApp = new WebApp(application);
	await webApp.bpmnServer.ready;
	// the users bpmn-web manages: its own, the application's user manager's, or none (the application's own)
	const { ownUsers } = await import('./userAccess/UserManager.js');
	const users = ownUsers(webApp.userManager);
	const madeAdmin = await setup(webApp.bpmnServer, users);
	if (options.setupOnly) {
		console.log(madeAdmin
			? 'setup done: the database is ready; sign in as admin with the password ADMIN_PASSWORD gave'
			: !users
				? 'setup done: the database is ready; the application manages its users'
			: await usersNow(users) > 0
				? 'setup done: the database is ready; it already has users, none was added'
				: 'setup done: the database is ready; no users yet: start the server, and its first page asks for the administrator');
		await webApp.bpmnServer.shutdown();
		process.exit(0);
	}
	if (options.console) {
		const { runConsole } = await import('./console.js');
		await runConsole(webApp.bpmnServer);
		return webApp;
	}
	// no users, and sign-in on: the pages ask for the administrator, with a token printed here
	if (users && process.env.REQUIRE_AUTHENTICATION !== 'false' && await usersNow(users) === 0) {
		const { beginFirstRun } = await import('./userAccess/firstRun.js');
		beginFirstRun(webApp.app);
	}
	webApp.start();
	return webApp;
}

async function usersNow(users: UserService) {
	return users.count();
}
