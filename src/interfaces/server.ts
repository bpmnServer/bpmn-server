import { IExecution , ILogger , IItemData , IDefinition, IConfiguration, IAppDelegate, IDataStore } from '../..';
import { EventEmitter } from 'events';
import { BPMNServer } from '../server';


interface IBPMNServer {

    engine: IEngine;
    listener: EventEmitter;
    configuration: IConfiguration;
    logger: ILogger;
    definitions: IDefinition;
    appDelegate: IAppDelegate;
    dataStore: IDataStore;
    cache: ICacheManager;
    cron: ICron;
    acl: IACL;
    iam: IIAM;

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

interface IEngine extends IServerComponent {
    /**
     *	loads a definitions  and start execution
     *
     * @param name		name of the process to start
     * @param data		input data
     * @param startNodeId	in process has multiple start node; you need to specify which one
     */
    start(name: any, data?: any, startNodeId?: string, userKey?: string, options?: any): Promise<IExecution>;
    /**
     * restores an instance into memeory or provides you access to a running instance
     *
     * this will also resume execution
     *
     * @param instanceQuery		criteria to fetch the instance
     *
     * query example:	{ id: instanceId}
     *					{ data: {caseId: 1005}}
     *					{ items.item.id : 'abcc111322'}
     *					{ items.item.itemKey : 'businesskey here'}
     *
     */
    get(instanceQuery: any): Promise<IExecution>;
    restore(instanceQuery: any): Promise<IExecution>;
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
    invoke(itemQuery: any, data?: {}, userKey?: string, options?: {}): Promise<IExecution>;
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

}interface IUser {
    userId;
    name;
    email;
    userGroups;
    password;
}
interface IIAM {
    login(userId, password);
    getRemoteUser(userId); 
    getCurrentUser(key): IUser;
    getUser(userId): Promise<IUser>;
    getUsersForGroup(userGroup): Promise<IUser[]>;
    addUser(userId, name, email, userGroups, password): Promise<IUser>;

}

interface IACL {
    listener: EventEmitter;
    canPerform(operation, object);
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
    restart();
}


export { IBPMNServer , IEngine , IACL, IUser , IIAM, ICron ,ICacheManager , IServerComponent }