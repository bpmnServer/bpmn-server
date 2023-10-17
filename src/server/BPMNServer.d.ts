/// <reference types="node" />
import { IConfiguration, ILogger, IAppDelegate, IBPMNServer, IDataStore, ICacheManager } from '../..';
import { Engine } from './Engine';
import { Cron } from './Cron';
import { EventEmitter } from 'events';
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
declare class BPMNServer implements IBPMNServer {
    engine: Engine;
    listener: EventEmitter;
    configuration: IConfiguration;
    logger: ILogger;
    definitions: any;
    appDelegate: IAppDelegate;
    dataStore: IDataStore;
    cache: ICacheManager;
    cron: Cron;
    error: any;
    private static instance;
    /**
     * Server Constructor
     *
     * @param configuration	see
     * @param logger
     */
    constructor(configuration: IConfiguration, logger?: ILogger, options?: {});
    static getVersion(): any;
    static get engine(): Engine;
    static getInstance(): BPMNServer;
}
export { BPMNServer };
