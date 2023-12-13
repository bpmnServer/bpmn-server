import { IExecution , ILogger , IItemData , IDefinition, IConfiguration, IAppDelegate, IDataStore,IModelsDatastore } from '..';
import { EventEmitter } from 'events';
import { BPMNServer } from '../server';


interface IBPMNServer {

    engine: IEngine;
    listener: EventEmitter;
    configuration: IConfiguration;
    logger: ILogger;
    definitions: IModelsDatastore;
    appDelegate: IAppDelegate;
    dataStore: IDataStore;
    cache: ICacheManager;
    cron: ICron;
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
    start(name: any, data?: any, startNodeId?: string, userId?: string, options?: any): Promise<IExecution>;
    /**
     * restores an instance into memeory or provides you access to a running instance
     *
     * this will also resume execution
     *
     * @param instanceQuery		criteria to fetch the instance
     *
     * query example:	{ id: instanceId}
     *					{ data: {caseId: 1005}}
     *					{ items.id : 'abcc111322'}
     *					{ items.itemKey : 'businesskey here'}
     *
     */
    get(instanceQuery: any): Promise<IExecution>;
    /**
     * Continue an existing item that is in a wait state
     *
     * -------------------------------------------------
     * scenario:
     *		itemId			{itemId: value }
     *		itemKey			{itemKey: value}
     *		instance,task	{instanceId: instanceId, elementId: value }
     *
     * @param itemQuery		criteria to retrieve the item
     * @param data
     */
    invoke(itemQuery: any, data?: {}, userId?: string, options?: {}): Promise<IExecution>;

    assign(itemQuery: any, data?: {}, userId?: string, assignment?:{}): Promise<IExecution>;



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
    startEvent(instanceId: any, elementId: any, data?: {}): Promise<IExecution>;
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
	throwMessage(messageId, data : {}, matchingQuery :{}): Promise<IExecution>;

	throwSignal(signalId, data :{}, matchingQuery :{} );

}

interface ICron {

	checkTimers(duration);
	start();
	startTimers();

}


interface ICacheManager {
    list();
    add(execution: IExecution);
    remove(instanceId);
    shutdown();
}


export { IBPMNServer , IEngine ,  ICron ,ICacheManager , IServerComponent }