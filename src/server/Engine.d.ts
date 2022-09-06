import { Execution } from '../..';
import { ServerComponent } from '../server/ServerComponent';
import { IEngine } from "../interfaces";
declare class Engine extends ServerComponent implements IEngine {
    constructor(server: any);
    /**
     *	loads a definitions  and start execution
     *
     * @param name		name of the process to start
     * @param data		input data
     * @param startNodeId	in process has multiple start node; you need to specify which one
     */
    start(name: any, data?: any, startNodeId?: string, userKey?: string, options?: {}): Promise<Execution>;
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
    get(instanceQuery: any): Promise<Execution>;
    restore(instanceQuery: any): Promise<Execution>;
    invokeItem(itemQuery: any, data?: {}): Promise<Execution>;
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
    invoke(itemQuery: any, data?: {}, userKey?: string, options?: {}): Promise<Execution>;
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
    startEvent(instanceId: any, elementId: any, data?: {}): Promise<Execution>;
    throwMessage(messageId: any, data?: {}, matchingQuery?: {}): Promise<Execution>;
    /**
     *
     * signal/message raise a signal or throw a message
     *
     * will seach for a matching event/task given the signalId/messageId
     *
     * that can be againt a running instance or it may start a new instance
     * ----------------------------------------------------------------------------
     * @param messageId		the id of the message or signal as per bpmn definition
     * @param matchingQuery	should match the itemKey (if specified)
     * @param data			message data
     */
    throwSignal(signalId: any, data?: {}, matchingQuery?: {}): Promise<Execution>;
}
export { Engine };
