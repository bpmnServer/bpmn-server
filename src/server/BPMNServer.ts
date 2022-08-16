
import { Logger } from '../common/Logger';


import { IConfiguration, ILogger, DataStore , IAppDelegate, IBPMNServer, IDataStore, IIAM, IACL} from '../..';
import { Engine } from './Engine';
import { CacheManager } from './CacheManager';
import { Cron } from './Cron';
import { EventEmitter } from 'events';
import { ACL, IAM } from './ACL';


const fs = require('fs');
/**
 *	The main class of Server Layer
 *	provides the full functionalities:
 *	
 *		at start of the app:
 *			new BPMNServer(configuration,options);
 *			
 *		after that point:
 *		
 *			BPMNServer.engine.start(...)
 *			BPMNServer.engine.invoke(...)
 *			BPMNServer.dataStore.findInstances(...)
 *			BPMNServer.dataStore.findItems(...)
 */

class BPMNServer implements IBPMNServer {

	engine: Engine;
	listener: EventEmitter;
	configuration: IConfiguration;
	logger: ILogger;
	definitions;
	appDelegate: IAppDelegate;
	dataStore: IDataStore;
	cache: CacheManager;
	cron: Cron;
	acl: IACL;
	iam: IIAM;

	private static instance: BPMNServer;

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
		this.listener = new EventEmitter();
		this.logger = logger;
		this.configuration = configuration;
		this.cron = new Cron(this);
		this.cache = new CacheManager(this);
		this.engine = new Engine(this);
		this.dataStore = configuration.dataStore(this);
		this.definitions = configuration.definitions(this);
		this.appDelegate = configuration.appDelegate(this);

		this.acl = new ACL(this);
		this.iam = new IAM(this);
		console.log("bpmn-server version " + BPMNServer.getVersion());

		BPMNServer.instance=this;

		if (options['cron'] == false)
		{
			return;
        }

		this.cron.start();
	}

	static getVersion() {

		const configPath = __dirname+'/../../package.json';

		if (fs.existsSync(configPath)) {

			var configuration = JSON.parse(fs.readFileSync(configPath, 'utf8'));
			var _version = configuration['version'];
			return _version;
		}
		else
			return 'cannot locate package.json current: ' + __dirname+' path '+configPath;


    }
	public static get engine() {
		return BPMNServer.getInstance().engine;
    }
	public static getInstance(): BPMNServer {
		if (!BPMNServer.instance) {
			throw Error("BPMN Server Not initialized");
		}

		return BPMNServer.instance;
	}
}


export { BPMNServer};
