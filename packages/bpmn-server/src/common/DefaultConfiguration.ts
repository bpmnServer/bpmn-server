import { fileURLToPath } from 'url';
import { dirname } from 'path';
const __dirname = dirname(fileURLToPath(import.meta.url));

import { ModelsDatastore } from '../datastore/ModelsDatastore.js';
import { DefaultAppDelegate } from '../engine/DefaultAppDelegate.js';

import { DataStore } from '../datastore/DataStore.js';
import { ScriptHandler } from '../engine/ScriptHandler.js';
import type { IConfiguration, IConnectorsConfiguration, ILogger, IAppDelegate } from '../interfaces/common.js';
import type { IModelsDatastore, IDataStore } from '../interfaces/datastore.js';
import { NoCacheManager } from '../server/CacheManager.js';
import { Logger } from './Logger.js';
import { enabledAddOns, addOnManifests } from '../addons/index.js';
import type { IAddOn, IAddOnManifest } from '../engine/AddOns.js';import type { IDocumentStore, ILockManager } from '../interfaces/storage.js';

export class Configuration implements IConfiguration {
	definitionsPath?: string;
	templatesPath?: string;
	timers: { forceTimersDelay: number; precision: number; };
	database: { 
		MongoDB: {
			 db_url: string; 
			 db: string; 
			 Locks_collection:'wf_locks';
			 Instance_collection:'wf_instances';
			 Archive_collection:'wf_archives';
			 }; 
		loopbackRepositories?:any;
	};
	logger: ILogger;
	apiKey: string;
	moddleOptions?: any;
	servicesFile?: string;
	delegateFile?: string;
	serviceNames?: string[] | null | Promise<string[] | null>;
	sendGridAPIKey: string;
	definitions(server)/* :IModelsDatastore */{
		return new ModelsDatastore(server); 
	}
	appDelegate(server) :IAppDelegate {
		return new DefaultAppDelegate(server);
	}
	dataStore(server) :IDataStore {
		return new DataStore(server);
	}
	cacheManager(server) {
		return new NoCacheManager(server);
	}
	scriptHandler(server) {
		return new ScriptHandler();
	}
	/** Where the application's app-config.json is (which add-ons are on); the working folder's by default. */
	appConfig?: string;
	/** Where the application's app-contract.json is (its roles, variables, functions, pages); the working folder's by default. */
	appContract?: string;
	/** The add-ons that are on (engine/AddOns.ts): those app-config.json names, every one without it; unless the configuration gives its own. */
	addOns(server): IAddOn[] {
		return enabledAddOns(this.appConfig);
	}
	/** Every add-on bpmn-server comes with, on or off: their manifests. */
	addOnManifests(): IAddOnManifest[] {
		return addOnManifests();
	}


	documentStore?(server): IDocumentStore;
	locker?(server): ILockManager;
	serverId?: string;
	locks?: { retryDelay?: number; maxTries?: number; staleAfter?: number; };
	shutdownTimeout?: number;
	demo?: boolean;
	runTimers?: boolean;
	runServiceTasks?: boolean;
	connectors?: IConnectorsConfiguration;
	modelHistory?: boolean;
	/** false: a form's rules are not checked (elements/FormRules.ts). Default true. */
	formRules?: boolean;

	/** Each factory given replaces the default one; one left out keeps it. */
	constructor({
		definitionsPath = undefined, templatesPath = undefined, timers = { forceTimersDelay: 1000, precision: 3000 }, database = undefined, apiKey = undefined, moddleOptions = undefined, servicesFile = undefined, delegateFile = undefined, serviceNames = undefined,
		logger = undefined,
		definitions = undefined,
		appDelegate = undefined,
		dataStore = undefined, cacheManager = undefined, scriptHandler = undefined, addOns = undefined, appConfig = undefined, appContract = undefined,
		runTimers = undefined, runServiceTasks = undefined,
		documentStore = undefined, locker = undefined, serverId = undefined, locks = undefined, shutdownTimeout = undefined, demo = undefined, connectors = undefined, modelHistory = undefined, formRules = undefined }: any) {
		this.definitionsPath = definitionsPath;
		this.templatesPath = templatesPath;
		this.timers = timers;
		this.database = database;
		this.apiKey = apiKey;
		this.moddleOptions = moddleOptions;
		this.servicesFile = servicesFile;
		this.delegateFile = delegateFile;
		this.serviceNames = serviceNames;
		this.logger = logger;
		if (definitions) this.definitions = definitions;
		if (appDelegate) this.appDelegate = appDelegate;
		if (dataStore) this.dataStore = dataStore;
		if (cacheManager) this.cacheManager = cacheManager;
		if (scriptHandler) this.scriptHandler = scriptHandler;
		if (addOns) this.addOns = addOns;
		this.appConfig = appConfig;
		this.appContract = appContract;
		if (documentStore) this.documentStore = documentStore;
		if (locker) this.locker = locker;
		this.serverId = serverId;
		this.locks = locks;
		this.shutdownTimeout = shutdownTimeout;
		this.demo = demo;
		this.runTimers = runTimers ?? !demo;
		this.runServiceTasks = runServiceTasks ?? !demo;
		this.connectors = connectors;
		this.modelHistory = modelHistory;
		this.formRules = formRules;
	
	}

}
export const defaultConfiguration = new Configuration(
	{
		definitionsPath: typeof __dirname !== 'undefined' ? __dirname + '/processes/' : undefined,
		templatesPath: typeof __dirname !== 'undefined' ? __dirname +'/emailTemplates' : undefined,
		timers: {
			forceTimersDelay: 1000,
			precision: 3000,
		},
		database: {
			MongoDB:
			{
				db_url: "mongodb://localhost:27017?retryWrites=true&w=majority",
				db: 'bpmn'
			}
		},
		apiKey: '1234',
		logger: new Logger({}),
		definitions: function (server) {
			return new ModelsDatastore(server);
		},
		appDelegate: function (server) {
			return new DefaultAppDelegate(server);
		},
		dataStore: function (server) {
			return new DataStore(server);
		},
		cacheManager: function (server) {
			return new NoCacheManager(server);
		},
		scriptHandler: function (server) {
			return new ScriptHandler();
		}

	});
