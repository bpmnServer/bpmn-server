
import { Logger } from '../common/Logger';


import { Execution } from '../engine/Execution';

import { ServerComponent } from './ServerContext';
import { DataStore } from './DataStore';
import { ExecutionContext, ExecutionResponse } from '.';
import { EventEmitter } from 'events';


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
		startNodeId: string = null): Promise<ExecutionResponse> {

		this.logger.log(`Action:engine.start ${name}`);


		const definitions = this.definitions;
		const source = definitions.getSource(name);

		const executionContext = new ExecutionContext(this.server);
		if (!listener)
			listener = new EventEmitter();
		executionContext.listener = listener;
		const execution = new Execution(name, source, executionContext);
		executionContext.execution = execution;
		executionContext.dataStore.monitorExecution(execution);

		this.cache.add(executionContext);
		await execution.execute(startNodeId, data);

		const state = await execution.getState();

		await executionContext.dataStore.save();

		this.logger.log(`.engine.start ended for ${name}`);
		return new ExecutionResponse(execution);

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
	async get(instanceQuery,listener: EventEmitter = null): Promise<ExecutionResponse> {

		const executionContext = await this.restore(instanceQuery, listener);
		return new ExecutionResponse(executionContext.execution);
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
			executionContext.dataStore.monitorExecution(execution);

			this.cache.add(executionContext);
			this.logger.log("restore completed");
		}

		return executionContext;
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
	async invoke(itemQuery, data = {},listener: EventEmitter = null ) : Promise<ExecutionResponse> {

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

			await executionContext.execution.signal(item.id, data);

			this.logger.log(`..engine.continue execution ended saving.. `);

			await executionContext.dataStore.save();

			this.logger.log(`.engine.continue ended`);

			return new ExecutionResponse(executionContext.execution);
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
	async startEvent(instanceId, elementId, data = {}, listener: EventEmitter = null) : Promise<ExecutionResponse> {

		// need to load instance first
		this.logger.log('serverinvokeSignal');

		try {

			const context = await this.restore({ "id": instanceId },listener);
			const execution = context.execution;

			await execution.signal(elementId, data);

			await context.dataStore.save();

			this.logger.log("invoke completed");

			return new ExecutionResponse(context.execution);
		}
		catch (exc) {
			return this.error(exc);

		}
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
	 * @param matchingKey	should match the itemKey (if specified)
	 * @param data			message data
	 */
	async signal(messageId, matchingKey, data = {}, listener: EventEmitter = null) {

		// need to load instance first
		this.logger.log('serverinvokeSignal');

		try {

		}
		catch (exc) {
			return this.error(exc);

		}
	}


	private error(exc, executionContext = null) {

		return new ExecutionResponse((executionContext)?executionContext.execution:null, exc);
	}
}


export { Engine};
