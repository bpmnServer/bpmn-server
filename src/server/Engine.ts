
import { Execution } from '../index.js';
import { ServerComponent } from '../server/ServerComponent.js';
import { EXECUTION_EVENT, IEngine} from "../interfaces/index.js";

import { DataStore } from '../datastore/index.js';
import { exec } from 'child_process';


class Engine extends ServerComponent implements IEngine{

	runningCounter=0;
	callsCounter=0;
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
		this.runningCounter++;
		this.logger.log(`^Action:engine.start ${name}`);
		

		const definitions = this.definitions;
		const source = await definitions.getSource(name);

		const execution = new Execution(this.server,name, source);
		execution.svg = await definitions.getSVG(name);

		if (options['parentItemId']) {
			execution.instance.parentItemId=options['parentItemId'];
		}
		execution.userName = userName;
		execution.operation='start';
		execution.options=options;
		execution.instance.tenantId = options['tenantId'];
	
		this.cache.add(execution);

		let handedOff = false;
		try {
			await this.lock(execution.id);
			execution.isLocked = true;


			if (options['noWait'] == true) {
				execution.worker = execution.execute(startNodeId, this.sanitizeData(data), options)
					.finally(() => this.release(execution));
				// Preserve the rejection on worker while preventing an unhandled rejection.
				execution.worker.catch(err => this.logger.log(err));
				handedOff = true;
				return execution;
			}
			else {
				const waiter = await execution.execute(startNodeId, this.sanitizeData(data), options);
				await this.release(execution);
				this.logger.log(`.engine.start ended for ${name}`);
				return execution;
			}
		}
		catch(exc) {
			return await this.exception(exc,execution); 
		}
		finally {
			this.runningCounter--;
			if (!handedOff && execution && execution.isLocked)
				await this.release(execution);
		}
		
	}

	public async restart(itemQuery, data:any,userName, options={}) :Promise<Execution>  {
	
		this.logger.log(`^Action:engine.restart`);
		let execution;
		this.runningCounter++;
		this.callsCounter++;

		try {
			const item = await this.server.dataStore.findItem(itemQuery);

			const instance = await this.server.dataStore.findInstance({id:item.instanceId});

			execution= await this.restore(instance.id,item.id);

			await execution.restart(item.id, this.sanitizeData(data),userName, options);

			await this.release(execution);

			return execution;
		}
		catch (exc) {
			return await this.exception(exc,execution); 
		}
		finally {
			this.runningCounter--;
			if (execution && execution.isLocked)
				await this.release(execution);
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
	private async release(execution: Execution,id=null) {
		if (id===null)
			id =execution.id;
		this.logger.log('...unlocking ..' + id);
			await this.server.dataStore.locker.release(id);
			if (execution)
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
		try {
			const instance = await this.dataStore.findInstance({ id: instanceId }, 'full');
			const live = this.cache.getInstance(instance.id);
			if (live) {
				execution = live;
			} else {
				execution = await Execution.restore(this.server, instance, itemId);
				this.cache.add(execution);
				this.logger.log("restore completed: " + instance.saved);
			}
			execution.isLocked = true;
			return execution;
		} catch (error) {
			await this.server.dataStore.locker.release(instanceId);
			throw error;
		}
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
		
		this.logger.log(`^Action:engine.assign`);
		this.logger.log(itemQuery);
		let execution;

		this.runningCounter++;
		this.callsCounter++;
		try {

			const items = await this.server.dataStore.findItems(itemQuery);
			if (items.length > 1) {
				this.logger.error(`query produced more than ${items.length} items expecting only one`+JSON.stringify(itemQuery));
			}
			const item = items[0];
			if (!item) {
				this.logger.error("query produced no items for "+JSON.stringify(itemQuery));
			}

			execution = await this.restore(item.instanceId);

			await execution.assign(item.id, this.sanitizeData(data), assignment, userName,options);

			await this.release(execution);

			return execution;
		}
		catch (exc) {
			return await this.exception(exc,execution); 

		}
		finally {
			this.runningCounter--;
			if (execution && execution.isLocked)
				await this.release(execution);
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

		this.logger.log(`^Action:engine.invoke`);
		this.logger.log(itemQuery);
		let execution;
		let handedOff = false;
		this.runningCounter++;
		this.callsCounter++;

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
			execution = await this.restore(item.instanceId);

			await execution.signalItem(item.id, this.sanitizeData(data),userName,options);
			let exeItem=execution.item;

			try {
				if (options['noWait'] == true) {
					this.logger.log(`.noWait`);
					let self=this;
					execution.worker=(async () => {
						await execution.save();
						return execution.signalItem2(item.id);
					})().finally(() => self.release(execution));
					execution.worker.catch(err => self.logger.log(err));
					handedOff = true;
					return execution;
				}
				else {
					// await execution.signalItem2(item.id); not needed since signal() issues goNext()
					
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

			finally {
				if (!handedOff && execution && execution.isLocked)
					await this.release(execution);
			}
			}
		catch (exc) {
			return await this.exception(exc,execution); 
		}
		finally {
			this.runningCounter--;
			if (!handedOff && execution && execution.isLocked)
				await this.release(execution);
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
		let execution;

		try {

			execution= await this.restore(instanceId);

			await execution.signalRepeatTimerEvent(instanceId,prevItem,this.sanitizeData(data),options);

			await this.release(execution);

			this.logger.log("StartRepeatTimerEvent completed "+execution.isLocked);

			return execution;
		}
		catch (exc) {
			return await this.exception(exc,execution); 

		}
		finally {
			if (execution && execution.isLocked)
				await this.release(execution);
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
		let execution;

		try {

			execution= await this.restore(instanceId);

			await execution.signalEvent(elementId, this.sanitizeData(data),userName,options);

			await this.release(execution);

			this.logger.log("Engine.StartEvent completed "+execution.isLocked);

			return execution;
		}
		catch (exc) {
			return await this.exception(exc,execution); 

		}
		finally {
			if (execution && execution.isLocked)
				await this.release(execution);
		}

	}
	async throwMessage(messageId, data = {}, matchingQuery = {}): Promise<Execution> {

		this.logger.log('..^Action:engine.throwMessage ', messageId,this.sanitizeData(data),matchingQuery);

		if (!messageId)
			return null;
		// need to load instance first
		const eventsQuery = { "events.messageId": messageId };
		const events = await this.definitions.findEvents(eventsQuery);

		this.logger.log('..findEvents ' + events.length);
		if (events.length > 0) {

			const event = events[0];
			this.logger.log('..^Action:engine.throwMessage found target event ', event.modelName, JSON.stringify(data), event.elementId, event.elementId);
			let ret = await this.start(event.modelName, data, event.elementId, event.elementId);
			this.logger.log('..^Action:engine.throwMessage ended', event.modelName, JSON.stringify(data), event.elementId, event.elementId);
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

			this.logger.log('..^Action:engine.throwMessage found target ', item.processName, item.id);
			return await this.invoke({ "items.id": item.id }, this.sanitizeData(data));
		}
		else {
			this.logger.log('** engine.throwMessage failed to find a target for ',JSON.stringify(itemsQuery));

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

		this.logger.log('..^Action:engine.Throw Signal ',signalId,this.sanitizeData(data),matchingQuery);

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
				this.logger.log('..^Action:engine.Throw Signal found target', event.modelName, data, event.elementId);
				
				var res = await this.start(event.modelName, this.sanitizeData(data), event.elementId, null);
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
		this.logger.log('^Action:engine.throwSignal ' + signalId + ' targets:' + items.length);
		if (items.length > 0) {
			for (var i = 0; i < items.length; i++) {
				let item = items[i];
				this.logger.log(`..throwSignal ${signalId} found target: ${item.processName} ${item.id}`);
			}

			for (var i = 0; i < items.length; i++) {
				let item = items[i];
//				console.log(`Throw Signal ${signalId} found target: ${item.processName} ${item.id}`);
				this.logger.log('..^Action:engine.Throw Signal found target', item.processName,item.id );
				var res=await this.invoke({ "items.id": item.id }, this.sanitizeData(data));
				instances.push({instanceId:res.instance.id,itemId:item.id});
            }
		}
		return instances;
	}
	status() {
		return { running: this.runningCounter, calls: this.callsCounter };
	}
	
	/**
 * 
 * @param model 
 * @param afterNodeIds
 */
    async upgrade(model:string,afterNodeIds:string[]):Promise<string[]|{errors}> {
    
		let ds=this.server.dataStore;

	//    {"name":"boundary-event","$nor":[{"items":{"$elemMatch":{"elementId":"Reminder-Timer"}}}]}
		let query={"name":model};

		if (afterNodeIds.length>0) {
			let nors = [];
			afterNodeIds.forEach(node=>{
			nors.push({"items":{"elemMatch":{"elementId":node}}});
			});
			query["$nor"]=nors;
		}
		let insts=await ds.findInstances(query,{"projection":{"id":1}});

		let source=await this.server.definitions.getSource(model);
		this.logger.log(`^Action:engine.upgrade ${model} instances:${insts.length}`);
		const resIds=[];
		let self=this;
		for(let i=0;i<insts.length;i++) {

			let inst=insts[i];
				await self.lock(inst.id);
				try {
					await ds.db.update(ds.dbConfiguration.db,ds.dbConfiguration.Instance_collection,
						{ id: inst.id },
						{
							$set: {source}
						});
					resIds.push(inst.id);
					}
				catch(exc) {
					return {errors:exc};
				}
				finally {
					await self.release(null,inst.id);
			
				}
		}
		return resIds;
	}

	private async exception(exc,execution) {

		console.log("Exception: stack",exc.stack);
		if (execution)
			await execution.doExecutionEvent(execution,EXECUTION_EVENT.process_exception);

		return this.logger.error(exc);

	}
	private sanitizeData(data) {
		return JSON.parse(JSON.stringify(data));
	}
}


export { Engine};
