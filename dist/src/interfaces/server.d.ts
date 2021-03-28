import { IExecutionContext } from '../..';
/**
 * is used as a repsone to server request
 * */
interface IServerContext {
    configuration: any;
    logger: any;
    definitions: any;
    appDelegate: any;
    dataStore: any;
}
interface IBPMNServer {
    configuration: any;
    logger: any;
    dataStore: any;
    engine: any;
    cron: any;
    cache: any;
    definitions: any;
    appDelegate: any;
}
interface IServerComponent {
    server: any;
    configuration: any;
    logger: any;
    dataStore: any;
    engine: any;
    cron: any;
    cache: any;
    definitions: any;
    appDelegate: any;
}
interface IEngine extends IServerComponent {
    /**
     *	loads a definitions  and start execution
     *
     * @param name		name of the process to start
     * @param data		input data
     * @param startNodeId	in process has multiple start node; you need to specify which one
     */
    start(name: any, data?: any, startNodeId?: string, options?: any): Promise<IExecutionContext>;
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
    get(instanceQuery: any): Promise<IExecutionContext>;
    restore(instanceQuery: any): Promise<IExecutionContext>;
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
    invoke(itemQuery: any, data?: {}): Promise<IExecutionContext>;
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
    startEvent(instanceId: any, elementId: any, data?: {}): Promise<IExecutionContext>;
}
export { IBPMNServer, IServerContext, IEngine };
