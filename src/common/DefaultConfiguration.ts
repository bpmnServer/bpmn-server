
import { ModelsDatastore } from '../datastore/ModelsDatastore';
import { DefaultAppDelegate } from '../engine/DefaultAppDelegate';

import { IConfiguration, DataStore, NoCacheManager,ILogger, IModelsDatastore, 
		IAppDelegate, IDataStore,
		ScriptHandler} from '../';
import { Logger } from './'
import { Script } from 'vm';

export class Configuration implements IConfiguration {
	definitionsPath?: string;
	templatesPath?: string;
	timers: { forceTimersDelay: number; precision: number; };
	database: { 
		MongoDB: { db_url: string; db: string; }; 
		loopbackRepositories?:any;
	};
	logger: ILogger;
	apiKey: string;
	sendGridAPIKey: string;
	definitions(server) {
		return new ModelsDatastore(server); 
	}
	appDelegate(server) :IAppDelegate {
		return new DefaultAppDelegate(server);
	}
	dataStore(server) {
		return new DataStore(server);
	}
	cacheManager(server) {
		return new NoCacheManager(server);
	}
	scriptHandler(server) {
		return new ScriptHandler();
	}


	constructor({
		definitionsPath, templatesPath, timers, database, apiKey,
		logger,
		definitions,
		appDelegate,
		dataStore,cacheManager,scriptHandler}) {
		this.definitionsPath = definitionsPath;
		this.templatesPath = templatesPath;
		this.timers = timers;
		this.database = database;
		this.apiKey = apiKey;
		this.logger = logger;
		this.definitions = definitions;
		this.appDelegate = appDelegate;
		this.dataStore = dataStore;
		this.cacheManager = cacheManager;
		this.scriptHandler=scriptHandler;
	
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
		logger: function (server) {
			new Logger(server);
		},
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
