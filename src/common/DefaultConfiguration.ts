
import { ModelsDatastoreDB } from '../datastore/ModelsDatastoreDB';
import { DefaultAppDelegate } from '../engine/DefaultAppDelegate';

import { IConfiguration, DataStore, ILogger, IModelsDatastore, IAppDelegate, IDataStore } from '../..';
import { Logger } from './'

let definitionsPath = __dirname + '/processes/';

class Configuration implements IConfiguration {
	definitionsPath: string;
	timers: { forceTimersDelay: number; precision: number; };
	database: { MongoDB: { db_url: string; db: string; }; };
	logger: ILogger;
	definitions(server)  {
		return new ModelsDatastoreDB(server); 
	}
	appDelegate(server) {
		return new DefaultAppDelegate(server);
	}
	dataStore(server) {
		return new DataStore(server);
	}

	constructor({
		definitionsPath, timers, database,
		logger,
		definitions,
		appDelegate,
		dataStore }) {
		this.definitionsPath = definitionsPath;
		this.timers = timers;
		this.database = database;
		this.logger = logger;
		this.definitions = definitions;
		this.appDelegate = appDelegate;
		this.dataStore = dataStore;
	}
}
var defaultConfiguration = new Configuration(
	{
		definitionsPath: definitionsPath,
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
		logger: Logger,							// class
		definitions: ModelsDatastoreDB,			// class
		appDelegate: new DefaultAppDelegate(),		// object
		dataStore: DataStore				// class	
	});


export { Configuration, defaultConfiguration}