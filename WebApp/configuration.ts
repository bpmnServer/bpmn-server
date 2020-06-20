
import { ModelsDatastore, Configuration } from './';
import { MyAppDelegate } from './appDelegate';
import { IConfiguration, DataStore, ILogger, IModelsDatastore, IAppDelegate, IDataStore, IEventsRegistry } from './';
import { EventsRegistry } from './';
import { Logger } from './'


let definitionsPath = __dirname + '/processes/';
var configuration = new Configuration(
	{definitionsPath: definitionsPath,
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
		appDelegate: new MyAppDelegate(this),		// object
		dataStore: DataStore,					// class	
		eventsRegistry: EventsRegistry			//class
	});


export { configuration}