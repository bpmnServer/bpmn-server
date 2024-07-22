
import { RemoteModelsDatastore } from '../datastore/RemoteModelsDatastore';
import { DefaultAppDelegate } from '../engine/DefaultAppDelegate';

import { IConfiguration, JSONDataStore, NoCacheManager,ILogger, IModelsDatastore, 
		IAppDelegate, IDataStore} from '../';
import { Logger } from './'

class Configuration implements IConfiguration {
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
		return new RemoteModelsDatastore(server); 
	}
	appDelegate(server) :IAppDelegate {
		return new DefaultAppDelegate(server);
	}
	dataStore(server) {
		return new JSONDataStore(server);
	}
	cacheManager(server) {
		return new NoCacheManager(server);
	}

	env: any;

	constructor({
		definitionsPath, templatesPath, timers, database, apiKey,
		logger,
		definitions,
		appDelegate,
		dataStore,
		cacheManager,
		env=null }) {
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

		if (env==null && process)
			env=process.env;

		this.env=env;

	}

}
var defaultConfiguration = new Configuration(
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
			return new RemoteModelsDatastore(server);
		},
		appDelegate: function (server) {
			return new DefaultAppDelegate(server);
		},
		dataStore: function (server) {
			return new JSONDataStore(server);
		},
		cacheManager: function (server) {
			return new NoCacheManager(server);
		}

	});


export { Configuration, defaultConfiguration}