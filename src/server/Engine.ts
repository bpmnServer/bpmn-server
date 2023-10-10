
import { Execution } from '../..';
import { ServerComponent } from '../server/ServerComponent';
import { IEngine} from "../interfaces";

import { DataStore } from '../datastore';


class Engine extends ServerComponent implements IEngine{


	constructor(server) {
		super(server);
    }

	/**
	 *	loads a definitions  and start execution
	 *
	 * @param name		name of the process to start
	 * @param data		input data 
	 * @param startNodeId	in process has multiple start node; you need to specify which one
	 */
	async start(name: any,
		data: any = {}, 
		startNodeId: string = null,
		userId: string=null,
		options = {}): Promise<Execution> {

		this.logger.log(`Action:engine.start ${name}`);


		const definitions = this.definitions;
		const source = await definitions.getSource(name);

		const execution = new Execution(this.server,name, source);
		execution.userId = userId;
	
		// new dataStore for every execution to be monitored 
		/* const newDataStore =new DataStore(this.server);
		this.server.dataStore = newDataStore;

		newDataStore.monitorExecution(execution); */
		this.cache.add(execution);

		await this.lock(execution.instance.id);

		execution.worker = execution.execute(startNodeId, data, options);

		if (options['noWait'] == true) {
				execution.worker.then(obj=>{ 
					this.logger.log('after worker is done releasing ..'+execution.instance.id);
					this.release(execution.instance.id);
					});
			return execution;
		}
		else {
			const waiter = await execution.worker;
			await this.release(execution.instance.id);
			this.logger.log(`.engine.start ended for ${name}`);
			return execution;
		}

		
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
	async get(instanceQuery): Promise<Execution> {

		const instance=await this.restore(instanceQuery);
		await this.release(instance.id);
		return instance;
	}
	/**
		lock instance 
	*/
	private async lock(instanceId) {
			this.logger.log('===============locking ..'+instanceId);
			await this.server.dataStore.locker.lock(instanceId);
	}
	/**
		release instance lock
	*/
	private async release(instanceId) {
			this.logger.log('---------------releasing ..'+instanceId);
			await this.server.dataStore.locker.release(instanceId);
	}
	/***
		Loads instance into memory for purpose of execution
		Locks instance first if required
		check if in cache
	*/
	private async restore(instanceQuery): Promise<Execution> {

		// need to load instance first
		let execution;
		const instance = await this.dataStore.findInstance(instanceQuery, 'Full');

		await this.lock(instance.id);	// if fails throws exception

		const live = this.cache.getInstance(instance.id);
		if (live) {

			execution = live;
		}
		else {
			execution = await Execution.restore(this.server,instance);


			/* new dataStore for every execution to be monitored 
			const newDataStore = new DataStore(execution.server);
			execution.server.dataStore = newDataStore;

			newDataStore.monitorExecution(execution); */


			this.cache.add(execution);
			this.logger.log("restore completed");

		}

		return execution;
	}
	async invokeItem(itemQuery, data = {}): Promise<Execution> {

		return await this.invoke(itemQuery, data);
	}
	/**
	 * update an existing item that is in a wait state with an assignment
	 * can modify data or assignment or both
	 * 
	 * -------------------------------------------------
	 *		
	 * @param itemQuery		criteria to retrieve the item
	 * @param data
	 */
	async assign(itemQuery, data = {}, userId: string = null, assignment = {}): Promise<Execution> {
		
		this.logger.log(`Action:engine.assign`);
		this.logger.log(itemQuery);

		try {

			const items = await this.server.dataStore.findItems(itemQuery);
			if (items.length > 1) {
				this.logger.error(`query produced more than ${items.length} items expecting only one`);
			}
			const item = items[0];
			if (!item) {
				this.logger.error("query produced no items for "+JSON.stringify(itemQuery));
			}

			const execution = await this.restore({ "id": item.instanceId });

			execution.worker = execution.assign(item.id, data,userId,assignment);

			await this.release(item.instanceId);

			return execution;
		}
		catch (exc) {
			return this.logger.error(exc);

		}
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
	async invoke(itemQuery, data = {}, userId: string = null, options = {}): Promise<Execution> {

		this.logger.log(`Action:engine.invoke`);
		this.logger.log(itemQuery);

		try {

			const items = await this.server.dataStore.findItems(itemQuery);
			if (items.length > 1) {
				this.logger.error(`query produced more than ${items.length} items expecting only one`);
			}
			const item = items[0];
			if (!item) {
				this.logger.error("query produced no items for "+JSON.stringify(itemQuery));
			}

			const execution = await this.restore({ "id": item.instanceId });
			execution.userId=userId;

			execution.worker = execution.signal(item.id, data,options);

			try {
				if (options['noWait'] == true) {
					this.logger.log(`.noWait`);
					execution.worker.then(obj=>{ 
						this.logger.log('after worker is done releasing ..'+item.instanceId);
						this.release(item.instanceId);
						});
					return execution;
				}
				else {
					const waiter = await execution.worker;
					this.logger.log(`.engine.continue ended`);

					await this.release(item.instanceId);
					return execution;
				}
			}
			catch(exc)
			{
					await this.release(item.instanceId);
					throw exc;
			}


		}
		catch (exc) {
			return this.logger.error(exc);

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
	async startEvent(instanceId, elementId, data = {}) : Promise<Execution> {

		// need to load instance first
		this.logger.log('serverinvokeSignal');

		try {

			const execution= await this.restore({ "id": instanceId });

			await execution.signal(elementId, data);

			await this.server.dataStore.save(execution.instance);

			await this.release(instanceId);

			this.logger.log("invoke completed");

			return execution;
		}
		catch (exc) {
			return this.logger.error(exc);

		}
	}
	async throwMessage(messageId, data = {}, matchingQuery = {}): Promise<Execution> {

		this.logger.log('..Action:engine.throwMessage ', messageId,data,matchingQuery);

		if (!messageId)
			return null;
		// need to load instance first
		const eventsQuery = { "events.messageId": messageId };
		const events = await this.definitions.findEvents(eventsQuery);

		this.logger.log('..findEvents ' + events.length);
		if (events.length > 0) {

			const event = events[0];
			this.logger.log('..Action:engine.throwMessage found target event ', event.modelName, JSON.stringify(data), event.elementId, event.elementId);
			let ret = await this.start(event.modelName, data, event.elementId, event.elementId);
			this.logger.log('..Action:engine.throwMessage ended', event.modelName, JSON.stringify(data), event.elementId, event.elementId);
			return ret;
		}
		let itemsQuery = {};
		if (matchingQuery)
			itemsQuery = Object.assign({}, matchingQuery);

		itemsQuery["items.messageId"] = messageId;
		itemsQuery["items.status"] = 'wait';


		const items = await this.dataStore.findItems(itemsQuery);

		if (items.length > 0) {

			const item = items[0];
			this.logger.log(`Throw Signal ${messageId} found target: ${item.processName} ${item.id}`);

			this.logger.log('..Action:engine.throwMessage found target ', item.processName, item.id);
			return await this.invoke({ "items.id": item.id }, data);
		}
		else {
			this.logger.log('** engine.throwMessage failed to find a target for ',JSON.stringify(itemsQuery));
			console.log('** engine.throwMessage failed to find a target for ', JSON.stringify(itemsQuery));

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
	async throwSignal(signalId, data = {}, matchingQuery = {} ) {

		this.logger.log('..Action:engine.Throw Signal ',signalId,data,matchingQuery);

		var instances = [];
		if (!signalId)
			return null;

		// need to load instance first
		const eventsQuery = { "events.signalId": signalId };
		const events = await this.definitions.findEvents(eventsQuery);
		this.logger.log('..findEvents '+events.length);
		if (events.length > 0) {
			for (var i = 0; i < events.length; i++) {
				let event = events[i];
				this.logger.log('..Action:engine.Throw Signal found target', event.modelName, data, event.elementId);
				
				var res = await this.start(event.modelName, data, event.elementId, null);
				this.logger.log('Signal end data',res.instance.data)
				instances.push(res.instance.id);
			}
        }
		let itemsQuery = {};
		if (matchingQuery)
			itemsQuery = Object.assign({}, matchingQuery);

		itemsQuery["items.signalId"] = signalId;
		itemsQuery["items.status"] = 'wait';

		const items = await this.dataStore.findItems(itemsQuery);
		console.log('throw signal itemsQuery:', itemsQuery,items.length);
		if (items.length > 0) {
			for (var i = 0; i < items.length; i++) {
				let item = items[i];
				console.log(`Throw Signal ${signalId} found target: ${item.processName} ${item.id}`);
			}

			for (var i = 0; i < items.length; i++) {
				let item = items[i];
//				console.log(`Throw Signal ${signalId} found target: ${item.processName} ${item.id}`);
				this.logger.log('..Action:engine.Throw Signal found target', item.processName,item.id );
				var res=await this.invoke({ "items.id": item.id }, data);
				instances.push(res.instance.id);
            }
		}
		return instances;
	}



}


export { Engine};
