/// <reference types="node" />
import { IConfiguration, ILogger, IAppDelegate, IBPMNServer, IDataStore } from '../..';
import { Engine } from './Engine';
import { CacheManager } from './CacheManager';
import { Cron } from './Cron';
import { EventEmitter } from 'events';
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
declare class BPMNServer implements IBPMNServer {
    engine: Engine;
    listener: EventEmitter;
    configuration: any;
    logger: ILogger;
    definitions: any;
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
    constructor(configuration: IConfiguration, logger?: ILogger, options?: {});
    static getVersion(): string;
}
export { BPMNServer };
