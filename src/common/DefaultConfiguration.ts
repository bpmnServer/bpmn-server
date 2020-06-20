
import { ModelsDatastore } from '../server/ModelsDatastore';
import { DefaultAppDelegate } from '../engine/DefaultAppDelegate';

import { IConfiguration, DataStore, ILogger, IModelsDatastore, IAppDelegate, IDataStore, IEventsRegistry } from '../..';
import { EventsRegistry } from '../..';
import { Logger } from './'

let definitionsPath = __dirname + '/processes/';

class Configuration implements IConfiguration {
	definitionsPath: string;
	timers: { forceTimersDelay: number; precision: number; };
	database: { MongoDB: { db_url: string; db: string; }; };
	logger: ILogger;
	definitions: IModelsDatastore;
	appDelegate: IAppDelegate;
	dataStore: IDataStore;
	eventsRegistry: IEventsRegistry;

	constructor({
		definitionsPath, timers, database,
		logger,
		definitions,
		appDelegate,
		dataStore,
		eventsRegistry }) {
		this.definitionsPath = definitionsPath;
		this.timers = timers;
		this.database = database;
		this.logger = logger;
		this.definitions = definitions;
		this.appDelegate = appDelegate;
		this.dataStore = dataStore;
		this.eventsRegistry = eventsRegistry;
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
		definitions: ModelsDatastore,			// class
		appDelegate: new DefaultAppDelegate(),		// object
		dataStore: DataStore,					// class	
		eventsRegistry: EventsRegistry			//class
	});


export { Configuration, defaultConfiguration}