# Setup bpmn Application with bpmn-server

## Configuration

Every project must have a configuration file that is an instance of [Configuration class](./api/classes/configuration.md)

This configuration file is passed to the BPMNServer constructor.

For testing purposes, you can have a different configuration than production in same environemnt by passign a different object.

```javascript 

import { Configuration, ModelsDatastore, DataStore , Logger } from './';
import { MyAppDelegate } from './appDelegate';


let definitionsPath = __dirname + '/processes/';
var configuration = new Configuration(
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
		/* Define Server Components */
		logger: function (server) {
			new Logger(server);
		},							
		definitions: function (server) {
			return new ModelsDatastore(server);
		},			
		appDelegate: function (server) {
			return new MyAppDelegate(server);
		},		
		dataStore: function (server) {
			return new DataStore(server);
		}		
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

