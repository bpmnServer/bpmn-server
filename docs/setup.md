# Setup bpmn Application with bpmn-server

## Configuration

Every project must have a configuration file that is an instance of [Configuration class](./api/classes/configuration.md)

This configuration file is passed to the BPMNServer constructor.

For testing purposes, you can have a different configuration than production in same environemnt by passign a different object.

```javascript 
import { ModelsDatastore, Configuration } from './';
import { MyHandler } from './handler';
import { IConfiguration, DataStore, ILogger, IModelsDatastore, IHandler, IDataStore, IEventsRegistry } from './';
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
		appDelegate: new MyHandler(this),		// object
		dataStore: DataStore,					// class	
		eventsRegistry: EventsRegistry			//class
	});


export { configuration}
```
Example of usage in javascript 
```javascript 
const { configuration }  = require('../configuration.js');

    const server = new BPMNServer(configuration, logger);
```
or in Typesciprt
```javascript 
	import  { configuration }  from '../configuration.js';

    const server = new BPMNServer(configuration, logger);
```

## Processes Folder

This is where the definition files reside, the demo WebApp contains a set of those file for you to start with.

## AppDelegate Class

