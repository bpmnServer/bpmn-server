import dotenv from 'dotenv';
import { Configuration, ModelsDatastore, ModelsDatastoreDB, DataStore , Logger 
	, NoCacheManager,CacheManager,
	ScriptHandler
} from './index.js';
import { MyAppDelegate } from './appDelegate.js';
import { UserService } from '../userAccess/UserService.js';

const res = dotenv.config();

const templatesPath = import.meta.dirname + '/emailTemplates/';
var configuration = new Configuration(
	{
		definitionsPath: process.env.DEFINITIONS_PATH,
		templatesPath: templatesPath,
		timers: {
			//forceTimersDelay: 1000, 
			precision: 3000,
		},
		database: {
			MongoDB:
			{
				db_url: process.env.MONGO_DB_URL,  //"mongodb://localhost:27017?retryWrites=true&w=majority",
				Locks_collection: "wf_locks",
				Instance_collection: "wf_instances",
				Archive_collection: "wf_archive"
			}
		},
		apiKey: process.env.API_KEY,
		/* Define Server Services */
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
			let ds=new DataStore(server);
			ds.enableSavePoints=isTrue('SAVE_POINTS');
			ds.saveLogs=isTrue('SAVE_LOGS');
			ds.saveSource=isTrue('SAVE_SOURCE');
			return ds;
		},
		scriptHandler: function(server) {
			return new ScriptHandler();
		},
		cacheManager: function (server) {
			return new NoCacheManager(server);
		},

	});
	function isTrue(param){
		const val=process.env[param];
		return val && val.toLowerCase().startsWith('true');
	}


export { configuration}