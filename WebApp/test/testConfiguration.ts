
import { ModelsDatastore, Configuration} from '../';
import { MyAppDelegate } from './appDelegate';
import { IConfiguration, DataStore, ILogger } from '../';
import { Logger } from '../'
import { IAM, ACL } from '../';

const dotenv = require('dotenv');
const res = dotenv.config();

let definitionsPath = __dirname + '/../processes/';
var configuration = new Configuration(
	{
		definitionsPath: definitionsPath,
		templatesPath: __dirname + '/../emailTemplates',
		timers: {
			forceTimersDelay: 1000,
			precision: 3000,
		},
		database: {
			MongoDB:
			{
				db_url: process.env.MONGO_DB_URL,
				db: 'bpmn'
			}
		},
		apiKey: process.env.API_KEY,
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
		},
		IAM: function (server) {
			return new IAM(server);
		},
		ACL: function (server) {
			return new ACL(server);
		}
	});


export { configuration}