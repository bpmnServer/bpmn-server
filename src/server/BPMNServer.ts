
import { Logger } from '../common/Logger';


import { IConfiguration, ILogger, DataStore , IAppDelegate, IBPMNServer, IDataStore} from '../..';
import { Engine } from './Engine';
import { CacheManager } from './CacheManager';
import { Cron } from './Cron';

const fs = require('fs');
/**
 *	The main class of Server Layer
 *	provides the full functionalities:
 *	
 *		1.	access to Execution engine
 *		2.	data Presistence through DataStore class
 *		3.	access to models definitions, loading and saving of models
 *		4.	access to BPMN definition details
 *		
 *		primary Use Cases:
 *		a.	execute a process
 *			server= new BPMNServer(...);
 *			server.execute(...);
 *			
 *		b.	invoke a task in an already started process
 *			server= new BPMNServer(...);
 *			server.invoke(...);
 * 
 *		c.	find items (various options)
  *			server= new BPMNServer(...);
 *			server.findItems(...);
*/
class BPMNServer implements IBPMNServer {

	engine: Engine;
	configuration: any;
	logger: ILogger;
	definitions;
	appDelegate: IAppDelegate;
	dataStore: IDataStore;
	cache: CacheManager;
	cron: Cron;

	/**
	 * Server Constructor
	 * 
	 * @param configuration	see 
	 * @param logger
	 */

	constructor(configuration: IConfiguration, logger?: ILogger, options = {}) {

		if (logger == null) {
			logger = new Logger({});
		}
		this.logger = logger;
		this.configuration = configuration;
		this.cron = new Cron(this);
		this.cache = new CacheManager(this);
		this.engine = new Engine(this);
		this.dataStore = configuration.dataStore(this);
		this.definitions = configuration.definitions(this);
		this.appDelegate = configuration.appDelegate(this);

		if (options['cron'] == false)
		{
			return;
        }

		this.cron.start();

	}

}


export { BPMNServer};
