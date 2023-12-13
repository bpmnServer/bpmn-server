
import { ModelsDatastore } from '../datastore/ModelsDatastore';
import { DefaultAppDelegate } from '../engine/DefaultAppDelegate';

import { IConfiguration, DataStore, NoCacheManager,ILogger, IModelsDatastore, 
		IAppDelegate, IDataStore} from '../..';
import { Logger } from './'

let definitionsPath = __dirname + '/processes/';

class Configuration implements IConfiguration {
	definitionsPath: string;
	templatesPath: string;
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
	userService(server) {
		return null;	// to be assigned by front-end
	}


	constructor({
		definitionsPath, templatesPath, timers, database, apiKey,
		logger,
		definitions,
		appDelegate,
		dataStore,cacheManager,userService}) {
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
		this.userService = userService;
	}

}
var defaultConfiguration = new Configuration(
	{
		definitionsPath: definitionsPath,
		templatesPath: __dirname +'/emailTemplates',
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
		userService: function (server) {
			return null;
		}

	});


export { Configuration, defaultConfiguration}