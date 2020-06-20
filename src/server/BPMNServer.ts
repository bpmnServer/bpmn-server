
import { Logger } from '../common/Logger';

import { DefaultAppDelegate } from '../engine/DefaultAppDelegate';

import { DataStore }  from  './DataStore';
//import { EventType, IBPMNServer } from './API';
import { EventEmitter } from 'events';
import { Execution } from '../engine/Execution';
import { Item } from '../engine/Item';
import { Definition } from '../elements/Definition';
import { exec } from 'child_process';
import { Event } from '../elements';
import { EventsRegistry } from './EventsRegistry';
import { IConfiguration, ILogger, ServerComponent, ModelsDatastore, IAppDelegate } from '../..';
import { IServerContext, IBPMNServer, IEventData, IEventsRegistry } from '../interfaces/server';
import { Engine } from './Engine';
import { CacheManager } from './CacheManager';
import { Cron } from './Cron';

const fs = require('fs');
/*
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
class BPMNServer { // implements IBPMNServer {

	engine: Engine;
	configuration: any;
	logger: ILogger;
	definitions;
	appDelegate: IAppDelegate;
	dataStore: DataStore;
	eventsRegistry: IEventsRegistry;
	cache: CacheManager;
	cron: Cron;

	/**
	 * Server Constructor
	 * 
	 * @param configuration	see 
	 * @param logger
	 */

	constructor(configuration: IConfiguration, logger?: ILogger)
	{

		if (logger == null) {
			logger = new Logger({});
		}
		this.logger = logger;
		this.configuration = configuration;
		this.cron = new Cron(this);
		this.cron.start();
		this.dataStore= new DataStore(this);
		this.cache = new CacheManager(this);
		this.engine = new Engine(this);
		this.eventsRegistry = new EventsRegistry(this);
		this.definitions = new ModelsDatastore(this);
		this.appDelegate = configuration.appDelegate;
	}

}


export { BPMNServer};
