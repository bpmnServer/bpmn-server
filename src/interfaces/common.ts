import type { IDocumentStore, ILockManager } from './storage.js';
import { NODE_ACTION, FLOW_ACTION } from './Enums.js';
import type { IModelsDatastore, IDataStore } from './datastore.js';
import type { IExecution, IItem, IScriptHandler } from './engine.js';
import type { ICacheManager } from './server.js';


interface IConfiguration 
{
    definitionsPath?: string,
    templatesPath?: string,
    timers: {
        forceTimersDelay?: number,
        precision?: number,
        /** Milliseconds between re-reads of waiting timers, so a timer another server scheduled is fired here when that server is gone (0: never; default 60000). */
        pollInterval?: number,
    },
    database: IMongoDBDatabaseConfiguration | ISQLiteDatabaseConfiguration,
    apiKey: string,
    logger: ILogger,
    definitions(server): IModelsDatastore,
    appDelegate(server): IAppDelegate,
    dataStore(server): IDataStore,
    scriptHandler(server): IScriptHandler,
    cacheManager(server): ICacheManager,
    /** The storage adapter both data stores use (MongoDB when absent): an in-memory store, an application's database. */
    documentStore?(server): IDocumentStore,
    /** The lock adapter (the data store's own when absent). */
    locker?(server): ILockManager,
    /** This process's identity as a lock owner (default `SERVER_ID`, else host, process id and a random suffix). */
    serverId?: string,
    locks?: {
        /** Milliseconds between lock tries (1500). */
        retryDelay?: number,
        /** Tries before a lock gives up (20). */
        maxTries?: number,
        /** Milliseconds after which a lock or a timer claim is stale (300000). */
        staleAfter?: number,
    },
    /** How long `shutdown()` waits for running executions, in milliseconds (10000). */
    shutdownTimeout?: number,
}

interface IDatabaseConfigurationBase {
    loopbackRepositories?:any
}
interface IMongoDBDatabaseConfiguration extends IDatabaseConfigurationBase {
    MongoDB: {
        db_url: string,
        db: string,
        Locks_collection:string,
        Instance_collection:string,
        Archive_collection:string
    }
}
interface ISQLiteDatabaseConfiguration extends IDatabaseConfigurationBase {
    SQLite: {
        db_connection: string,
    },
}


/**
 * A logging tool to take various message for monitoring and debugging
 * 
 * it can also keep the message in memory till saved later through saveToFile
 * msgs can be cleared by the clean method
 * 
 * */
interface ILogger {
    /**
     * 
     * @param toConsole boolean 
     *  writes to the output console
     * @param toFile string 
     * writes to file
     *
     */

    setOptions({ toConsole, toFile, callback }: {
        toConsole: any;
        toFile: any;
        callback: any;
    }): void;
    clear(): void;
    get(): any[];
    debug(...message: any): void;
    warn(...message: any): void;
    log(...message: any): void;
    error(err: any): void;
    reportError(err: any): void;
    save(filename: any): Promise<void>;
    saveForInstance(instanceId:string);
}

/**
 * Object to respond to all named services
 */
interface IServiceProvider {
    [serviceName: string]: CallableFunction | IServiceProvider;
}

/**
 *  Application Delegate Object to respond to various events and services:
 *  
 *  1.  receive all events from workflow
 *  2.  receive service calls
 *  3.  receive message and signal calls 
 *  4.  execute scripts 
 *  
 * */
interface IAppDelegate {
    moddleOptions;
    /**
     * Get the service task handlers, default to `this`, so you can add handlers on this class directly.
     */
    getServicesProvider(execution: IExecution): IServiceProvider | Promise<IServiceProvider>;
    sendEmail(to, msg, body);
    executionStarted(execution: IExecution);
    startUp(options); // start of server
    messageThrown(signalId: string, data, messageMatchingKey: any, item: IItem);
    signalThrown(signalId: string, data, messageMatchingKey: any, item: IItem);
    /**
     * 
     * is called when an event throws a message that can not be answered by another process
     * 
     * @param messageId
     * @param data
     */
    issueMessage(messageId: string, data);
    issueSignal(messageId: string, data);
    /**
     * is called only if the serviceTask has no implementation; otherwise the specified implementation will be called.
     * 
     * @param item
     */
    serviceCalled(input: Record<string, unknown>, execution: IExecution, item: IItem): unknown;
}

export { ILogger, IAppDelegate, IConfiguration, IServiceProvider }
