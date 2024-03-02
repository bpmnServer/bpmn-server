
import { Execution } from '../';
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
		userName: string=null,
		options = {}): Promise<Execution> {

		this.logger.log(`Action:engine.start ${name}`);
		

		const definitions = this.definitions;
		const source = await definitions.getSource(name);

		const execution = new Execution(this.server,name, source);
		execution.userName = userName;
		execution.operation='start';
		execution.options=options;
	
		this.cache.add(execution);

		try {
			await this.lock(execution.id);
			execution.isLocked = true;

			execution.worker = execution.execute(startNodeId, data, options);

			if (options['noWait'] == true) {
					execution.worker.then(obj=>{ 
						this.logger.log('after worker is done releasing ..'+execution.instance.id);
						this.release(execution);
						});
				return execution;
			}
			else {
				const waiter = await execution.worker;
				await this.release(execution);
				this.logger.log(`.engine.start ended for ${name}`);
				return execution;
			}
		}
		catch(exc) {
			return this.logger.error(exc);
		}
		finally {
			if (execution.isLocked)
				await this.release(execution);
			execution.isLocked=false;
		}
		
	}

	public async restart(instanceId,itemId, data:any,userName, options={}) :Promise<Execution>  {
	
		this.logger.log(`Action:engine.restart`);

		try {

			const instance = await this.server.dataStore.findInstance({id:instanceId});

			const execution:Execution = await this.restore(instance.id,itemId);

			await execution.restart(itemId, data,userName, options);

			await this.release(execution);

			return execution;
		}
		catch (exc) {
			return this.logger.error(exc);

		}
			
	}
	
	
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
	 */
	async get(instanceQuery): Promise<Execution> {

		let instance = await this.dataStore.findInstance(instanceQuery);
		const execution = await this.restore(instance.id);
		await this.release(execution);
		return execution;
	}
	/**
		lock instance 
	*/
	private async lock(executionId) {
			this.logger.log('...locking ..'+executionId);
			await this.server.dataStore.locker.lock(executionId);
			
			this.logger.log('   locking complete' + executionId);
	}
	/**
		release instance lock
	*/
	private async release(execution: Execution) {
		this.logger.log('...unlocking ..' + execution.id);
			await this.server.dataStore.locker.release(execution.id);
			execution.isLocked=false;
	}
	/***
		Loads instance into memory for purpose of execution
		Locks instance first if required
		check if in cache
	*/
	/*static restorePromise = null;
	private async restore(instanceId): Promise<Execution> {

		if (Engine.restorePromise)
			await Engine.restorePromise;

		Engine.restorePromise = this.doRestore(instanceId);

		let ret=await Engine.restorePromise;

		Engine.restorePromise = null;
		return ret;
	}
	 */
	private async restore(instanceId,itemId=null): Promise<Execution> {

		// need to load instance first
		let execution;

		await this.lock(instanceId);	// if fails throws exception

		let instance = await this.dataStore.findInstance({ id: instanceId }, 'Full');

		const live = this.cache.getInstance(instance.id);
		if (live) {

			execution = live;
		}
		else {
			execution = await Execution.restore(this.server,instance,itemId);

			execution.isLocked = true;
			/* new dataStore for every execution to be monitored 
			const newDataStore = new DataStore(execution.server);
			execution.server.dataStore = newDataStore;

			newDataStore.monitorExecution(execution); */


			this.cache.add(execution);
			this.logger.log("restore completed: "+instance.saved);

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
	async assign(itemQuery, data = {}, assignment = {}, userName: string,options= {}): Promise<Execution> {
		
		this.logger.log(`Action:engine.assign`);
		this.logger.log(itemQuery);

		try {

			const items = await this.server.dataStore.findItems(itemQuery);
			if (items.length > 1) {
				this.logger.error(`query produced more than ${items.length} items expecting only one`+JSON.stringify(itemQuery));
			}
			const item = items[0];
			if (!item) {
				this.logger.error("query produced no items for "+JSON.stringify(itemQuery));
			}

			const execution = await this.restore(item.instanceId);

			execution.worker = execution.assign(item.id, data, assignment, userName,options);

			await this.release(execution);

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
	async invoke(itemQuery, data = {}, userName: string = null, options = {}): Promise<Execution> {

		this.logger.log(`Action:engine.invoke`);
		this.logger.log(itemQuery);

		try {

			const items = await this.server.dataStore.findItems(itemQuery);
			if (items.length > 1) {
				this.logger.error(`query produced more than ${items.length} items expecting only one`+JSON.stringify(itemQuery));
			}
			const item = items[0];
			if (!item) {
				this.logger.error("query produced no items for "+JSON.stringify(itemQuery));
			}

			if (item.status !== 'wait') {
				this.logger.log(`*****Item status is not in wait state ${item.status} ${item.elementId}-${item.processName}`)
                    //this.logger.error(`Item status is not in wait state`);
            }
			const execution = await this.restore(item.instanceId);

			execution.worker = execution.signalItem(item.id, data,userName,options);

			try {
				if (options['noWait'] == true) {
					this.logger.log(`.noWait`);
					execution.worker.then(obj=>{ 
						this.logger.log('after worker is done releasing ..'+item.instanceId);
						this.release(execution);
						});
					return execution;
				}
				else {
					const waiter = await execution.worker;
					this.logger.log(`.engine.continue ended`);

					await this.release(execution);
					return execution;
				}
			}
			catch(exc)
			{
					await this.release(execution);
					throw exc;
			}


		}
		catch (exc) {
			return this.logger.error(exc);

		}
	}
	/**
	 * 
	 *	Repeat Timers need to create new Item
	 * @param instanceId
	 * @param elementId
	 * @param data
	 */
	async startRepeatTimerEvent(instanceId, prevItem, data = {},options={}) : Promise<Execution> {

		// need to load instance first
		this.logger.log('startRepeatTimeEvent');

		try {

			const execution= await this.restore(instanceId);

			await execution.signalRepeatTimerEvent(instanceId,prevItem,data,options);

			await this.release(execution);

			this.logger.log("StartRepeatTimerEvent completed "+execution.isLocked);

			return execution;
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
	async startEvent(instanceId, elementId, data = {},userName: string = null, options = {}) : Promise<Execution> {

		// need to load instance first
		this.logger.log('serverinvokeSignal');

		try {

			const execution= await this.restore(instanceId);

			await execution.signalEvent(elementId, data,userName,options);

			await this.release(execution);

			this.logger.log("Engine.StartEvent completed "+execution.isLocked);

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
