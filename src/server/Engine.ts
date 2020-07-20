
import { Execution, ExecutionContext } from '../..';
import { ServerComponent } from '../server/ServerContext';

import { EventEmitter } from 'events';
import { DataStore } from '../datastore';


class Engine extends ServerComponent {

	/**
	 *	loads a definitions  and start execution
	 *
	 * @param name		name of the process to start
	 * @param data		input data 
	 * @param startNodeId	in process has multiple start node; you need to specify which one
	 */
	async start(name: any,
		data: any = {}, listener: EventEmitter = null,
		startNodeId: string = null): Promise<ExecutionContext> {

		this.logger.log(`Action:engine.start ${name}`);


		const definitions = this.definitions;
		const source = await definitions.getSource(name);

		if (!listener)
			listener = new EventEmitter();

		const executionContext = new ExecutionContext(this.server);

		executionContext.listener = listener;
		const execution = new Execution(name, source, executionContext);
		executionContext.execution = execution;

		// new dataStore for every execution to be monitored 
		const newDataStore =new DataStore(executionContext.server);
		executionContext.server.dataStore = newDataStore;

		newDataStore.monitorExecution(execution);

		this.cache.add(executionContext);
		await execution.execute(startNodeId, data);

		await executionContext.dataStore.save();

		this.logger.log(`.engine.start ended for ${name}`);
		return executionContext;

	}
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
	async get(instanceQuery,listener: EventEmitter = null): Promise<ExecutionContext> {

		return  await this.restore(instanceQuery, listener);
		
	}
	async restore(instanceQuery, listener: EventEmitter = null): Promise<ExecutionContext> {

		// need to load instance first
		const instance = await this.dataStore.findInstance(instanceQuery, 'Full');
		let executionContext;
		const live = this.cache.getInstance(instance.id);
		if (live) {

			executionContext = live;
		}
		else {

			executionContext = new ExecutionContext(this.server);
			if (!listener)
				listener = new EventEmitter();
			executionContext.listener = listener;
			const execution = await Execution.restore(instance, executionContext);
			executionContext.execution = execution;

			// new dataStore for every execution to be monitored 
			const newDataStore = new DataStore(executionContext.server);
			executionContext.server.dataStore = newDataStore;

			newDataStore.monitorExecution(execution);

			this.cache.add(executionContext);
			this.logger.log("restore completed");
		}

		return executionContext;
	}
	async invokeItem(itemQuery, data = {}, listener: EventEmitter = null): Promise<ExecutionContext> {

		return await this.invoke(itemQuery, data, listener);
	}
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
	async invoke(itemQuery, data = {},listener: EventEmitter = null ) : Promise<ExecutionContext> {

		this.logger.log(`Action:engine.continue`);
		this.logger.log(itemQuery);
		let executionContext;

		try {

			const items = await this.server.dataStore.findItems(itemQuery);
			if (items.length > 1) {
				this.logger.error(`query produced more than ${items.length} items expecting only one`);
			}
			const item = items[0];
			if (!item) {
				this.logger.error(`query produced no items`);
			}

			executionContext = await this.restore({ "id": item.instanceId },listener);

			executionContext.execution.log("Action:engineInvoke " + JSON.stringify(itemQuery));
			await executionContext.execution.signal(item.id, data);

			this.logger.log(`..engine.continue execution ended saving.. `);

			await executionContext.dataStore.save();

			this.logger.log(`.engine.continue ended`);

			return executionContext;
		}
		catch (exc) {
			return this.error(exc,executionContext);

		}
	}
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
	async startEvent(instanceId, elementId, data = {}, listener: EventEmitter = null) : Promise<ExecutionContext> {

		let context;
		// need to load instance first
		this.logger.log('serverinvokeSignal');

		try {

			context = await this.restore({ "id": instanceId },listener);
			const execution = context.execution;

			await execution.signal(elementId, data);

			await context.dataStore.save();

			this.logger.log("invoke completed");

			return context;
		}
		catch (exc) {
			return this.error(exc,context);

		}
	}
	async throwMessage(messageId, data = {}, matchingQuery = {}, listener: EventEmitter = null): Promise<ExecutionContext> {

		this.logger.log('Action:engine.throwMessage ' + messageId);

		// need to load instance first
		const eventsQuery = { "events.messageId": messageId };
		const events = await this.definitions.findEvents(eventsQuery);
		this.logger.log('..findEvents ' + events.length);
		console.log(events);
		if (events.length > 0) {

			const event = events[0];
			return await this.start(event.modelName, data, null, event.elementId);
		}
		let itemsQuery;
		if (matchingQuery)
			itemsQuery = Object.assign({}, matchingQuery);

		itemsQuery["items.messageId"] = messageId;

		const items = await this.dataStore.findItems(itemsQuery);
		console.log(items);
		if (items.length > 0) {

			const item = items[0];
			return await this.invoke({ "items.id": item.id }, data);
		}
		return null;

	}
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
	async throwSignal(messageId, data = {}, matchingQuery = {} ,listener: EventEmitter = null) : Promise<ExecutionContext>{

		this.logger.log('Action:engine.signal '+messageId);

		// need to load instance first
		const eventsQuery = { "events.messageId": messageId };
		const events = await this.definitions.findEvents(eventsQuery);
		this.logger.log('..findEvents '+events.length);
		console.log(events);
		if (events.length > 0) {

			const event = events[0];
			return await this.start(event.modelName, data, null, event.elementId);
        }
		let itemsQuery;
		if (matchingQuery)
			itemsQuery = Object.assign({}, matchingQuery);

		itemsQuery["items.messageId"] = messageId;

		const items = await this.dataStore.findItems(itemsQuery);
		console.log(items);
		if (items.length > 0) {

			const item = items[0];
			return await this.invoke({ "items.id": item.id }, data);
		}
		return null;
	}


	private error(exc, executionContext) {
		if (!executionContext)
			executionContext = new ExecutionContext(this.server);
		executionContext.errors=exc;
		return executionContext;
	}
}


export { Engine};
