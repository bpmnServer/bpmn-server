
import { ModelsDatastoreDB, ModelsDatastore } from '../datastore/ModelsDatastore';
import { DefaultAppDelegate } from '../engine/DefaultAppDelegate';

import { IConfiguration, DataStore, ILogger, IModelsDatastore, IAppDelegate, IDataStore } from '../..';
import { Logger } from './'
import { ACL, IAM } from '../server/ACL';

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
		return new ModelsDatastoreDB(server); 
	}
	appDelegate(server) :IAppDelegate {
		return new DefaultAppDelegate(server);
	}
	dataStore(server) {
		return new DataStore(server);
	}

	constructor({
		definitionsPath, templatesPath, timers, database, apiKey,
		logger,
		definitions,
		appDelegate,
		dataStore,
		IAM,
		ACL}) {
		this.definitionsPath = definitionsPath;
		this.templatesPath = templatesPath;
		this.timers = timers;
		this.database = database;
		this.apiKey = apiKey;
		this.logger = logger;
		this.definitions = definitions;
		this.appDelegate = appDelegate;
		this.dataStore = dataStore;
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
		IAM: function (server) {
			return new IAM(server);
		},
		ACL: function (server) {
			return new ACL(server);
		}
	});


export { Configuration, defaultConfiguration}