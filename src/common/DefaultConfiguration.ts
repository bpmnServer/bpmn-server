import { fileURLToPath } from 'url';
import { dirname } from 'path';
const __dirname = dirname(fileURLToPath(import.meta.url));

import { ModelsDatastore } from '../datastore/ModelsDatastore.js';
import { DefaultAppDelegate } from '../engine/DefaultAppDelegate.js';

import { DataStore } from '../datastore/DataStore.js';
import { ScriptHandler } from '../engine/ScriptHandler.js';
import type { IConfiguration, ILogger, IAppDelegate } from '../interfaces/common.js';
import type { IModelsDatastore, IDataStore } from '../interfaces/datastore.js';
import { NoCacheManager } from '../server/CacheManager.js';
import { Logger } from './Logger.js';import type { IDocumentStore, ILockManager } from '../interfaces/storage.js';

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


	documentStore?(server): IDocumentStore;
	locker?(server): ILockManager;
	serverId?: string;
	locks?: { retryDelay?: number; maxTries?: number; staleAfter?: number; };
	shutdownTimeout?: number;

	/** Each factory given replaces the default one; one left out keeps it. */
	constructor({
		definitionsPath = undefined, templatesPath = undefined, timers = { forceTimersDelay: 1000, precision: 3000 }, database = undefined, apiKey = undefined,
		logger = undefined,
		definitions = undefined,
		appDelegate = undefined,
		dataStore = undefined, cacheManager = undefined, scriptHandler = undefined,
		documentStore = undefined, locker = undefined, serverId = undefined, locks = undefined, shutdownTimeout = undefined }: any) {
		this.definitionsPath = definitionsPath;
		this.templatesPath = templatesPath;
		this.timers = timers;
		this.database = database;
		this.apiKey = apiKey;
		this.logger = logger;
		if (definitions) this.definitions = definitions;
		if (appDelegate) this.appDelegate = appDelegate;
		if (dataStore) this.dataStore = dataStore;
		if (cacheManager) this.cacheManager = cacheManager;
		if (scriptHandler) this.scriptHandler = scriptHandler;
		if (documentStore) this.documentStore = documentStore;
		if (locker) this.locker = locker;
		this.serverId = serverId;
		this.locks = locks;
		this.shutdownTimeout = shutdownTimeout;
	
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
