/// <reference types="node" />
import { IExecution, ILogger, IDefinition, IConfiguration, IAppDelegate, IDataStore } from '../..';
import { EventEmitter } from 'events';
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
    cache: any;
    appDelegate: IAppDelegate;
    engine: any;
    dataStore: IDataStore;
    definitions: any;
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
}
interface IUser {
    userId: any;
    name: any;
    email: any;
    userGroups: any;
    password: any;
}
interface IIAM {
    login(userId: any, password: any): any;
    getRemoteUser(userId: any): any;
    getCurrentUser(key: any): IUser;
    getUser(userId: any): Promise<IUser>;
    getUsersForGroup(userGroup: any): Promise<IUser[]>;
    addUser(userId: any, name: any, email: any, userGroups: any, password: any): Promise<IUser>;
}
interface IACL {
    listener: EventEmitter;
    canPerform(operation: any, object: any): any;
}
interface ICron {
    checkTimers(duration: any): any;
    start(): any;
    startTimers(): any;
}
interface ICacheManager {
    list(): any;
    add(execution: IExecution): any;
    remove(instanceId: any): any;
    shutdown(): any;
    restart(): any;
}
export { IBPMNServer, IEngine, IACL, IUser, IIAM, ICron, ICacheManager, IServerComponent };
