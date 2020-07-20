
import { Configuration, ModelsDatastore } from './';
import { MyAppDelegate } from './appDelegate';
import { IConfiguration, DataStore, ILogger } from './';
import { Logger } from './'


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