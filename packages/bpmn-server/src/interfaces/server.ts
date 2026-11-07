import type { Connectors } from '../connectors/Connectors.js';
import type { ILogger, IConfiguration, IAppDelegate } from './common.js';
import type { IDataStore, IModelsDatastore } from './datastore.js';
import type { IExecution, IItem, IScriptHandler } from './engine.js';
import type { EventEmitter } from 'eventemitter3';
import type { EventEmitter as NodeEventEmitter } from 'events';
import type { IDocumentStore, ILockManager } from './storage.js';

interface IBPMNServer {

    engine: IEngine;
    listener: EventEmitter | NodeEventEmitter;
    configuration: IConfiguration;
    logger: ILogger;
    definitions: IModelsDatastore;
    appDelegate: IAppDelegate;
    dataStore: IDataStore;
    cache: ICacheManager;
    cron: ICron;
    /** The lock port the engine uses: the configuration's `locker`, else the data store's. */
    locker?: ILockManager;
    /** The storage adapter the configuration's `documentStore` supplied, shared by the data stores; absent for the MongoDB default. */
    documentStore?: IDocumentStore;
    scriptHandler?: IScriptHandler;
    /** The connectors an administrator added: REST APIs that service tasks call (camunda:connector). */
    connectors?: Connectors;
    /** What the tests running in here replace. */
    testStubs?: any;

}

interface IServerComponent {
    server: IBPMNServer;
    configuration: IConfiguration;
    logger: ILogger;
    cron: any;
    cache;
    appDelegate: IAppDelegate;
    engine: any;
    dataStore: IDataStore;
    scriptHandler: IScriptHandler;
    definitions;

}

interface IEngine {
    /**
     *	loads a definitions  and start execution
     *
     * @param name		name of the process to start
     * @param data		input data
     * @param startNodeId	in process has multiple start node; you need to specify which one
     */
    start(name: any, data?: any, startNodeId?: string, userName?: string, options?: any): Promise<IExecution>;
    /**
     * restores an instance into memeory or provides you access to a running instance
     *
     * this will also resume execution
     *
     * @param instanceQuery		criteria to fetch the instance
     *
     * query example:
     * 
     * ```jsonl
     * { id: instanceId}
     * { data: {caseId: 1005}}
     * { items.id : 'abcc111322'}
     * { items.itemKey : 'businesskey here'}
     * ```
     *
     */
    get(instanceQuery: any): Promise<IExecution>;
    /**
     * Continue an existing item that is in a wait state
     *
     * -------------------------------------------------
     * 
     * scenario:
     * 
     * ```
     * itemId 	{itemId: value }
     * itemKey 	{itemKey: value}
     * instance,task	{instanceId: instanceId, elementId: value }
     * ```
     *
     * @param itemQuery		criteria to retrieve the item
     * @param data
     */
    invoke(itemQuery: any, data: {}, userName?: string, options?: {}): Promise<IExecution>;

    assign(itemQuery: any, data: {}, assignment: {}, userName: string,options?:{}): Promise<IExecution>;


	startRepeatTimerEvent(instanceId, prevItem: IItem, data: {},options?:{}) : Promise<IExecution>;

    /** Removes the instances a query matches, each under its lock and with its timers. */
    deleteInstances(query: any): Promise<{ deletedCount: number }>;
    /** Marks a saved instance with a tag of the caller's. */
    tagInstance(instanceId: string, tag: any): Promise<void>;

    /**
     *
     * Invoking an event (usually start event of a secondary process) against an existing instance
     * or
     * Invoking a start event (of a secondary process) against an existing instance
     * ----------------------------------------------------------------------------
     *	 instance,task
     *```
     *	{instanceId: instanceId, elementId: value }
     *```

     *
     * @param instanceId
     * @param elementId
     * @param data
     */
    startEvent(instanceId: any, elementId: any, data?: {},userName?: string,options?:{}): Promise<IExecution>;
    /**
     *
     * signal/message raise a signal or throw a message
     *
     * will seach for a matching event/task given the signalId/messageId
     *
     * that can be againt a running instance or it may start a new instance
     * ----------------------------------------------------------------------------
     * @param messageId		the id of the message or signal as per bpmn definition
     * @param matchingKey	should match the itemKey (if specified)
     * @param data			message data
     */
    //signal(messageId: any, matchingKey: any, data?: {}): Promise<IExecution>;
    throwMessage(messageId, data: {}, matchingQuery: {}): Promise<IExecution>;
    throwSignal(signalId, data: {}, matchingQuery: {}, from?: IItem);
    /** Runs a failed item's work again (an item whose status is `error`), and the instance on from it. */
    retry(itemQuery, userName?: string): Promise<IExecution>;
    restart(itemQuery, data:any,userName, options) :Promise<IExecution>;
    /** Cancels a running instance: terminated and saved, never deleted. */
    cancel(instanceQuery: any, userName?: string, options?: {}): Promise<IExecution>;

    upgrade(model:string,afterNodeIds:string[]):Promise<string[]|{errors}>;
    /** Moves the instances that have not ended onto their model's current saved source (see Engine.upgradeRunning). */
    upgradeRunning(models?: string[], options?: { dryRun?: boolean }): Promise<IUpgradeReport[]>;

}

/** What upgradeRunning did with an instance. */
type IUpgradeOutcome = 'upgraded' | 'would-upgrade' | 'current' | 'ended' | 'stranded' | 'busy' | 'failed';

interface IUpgradeInstanceReport {
    model: string;
    instanceId: string;
    outcome: IUpgradeOutcome;
    detail?: string;
}

interface IUpgradeReport {
    model: string;
    /** why none of the model's instances was considered: no saved model, or one with errors */
    refused?: string;
    instances: IUpgradeInstanceReport[];
}

interface ICron {

	checkTimers(duration?);
	start();
	startTimers();
	stop?(): void;

}


interface ICacheManager {
    list();
    /** The live execution of an instance this cache holds, or null/undefined. */
    getInstance(instanceId): IExecution | null | undefined;
    add(execution: IExecution);
    remove(instanceId);
    shutdown();
}


export { IBPMNServer , IEngine , ICron ,ICacheManager , IServerComponent, IUpgradeOutcome, IUpgradeInstanceReport, IUpgradeReport }