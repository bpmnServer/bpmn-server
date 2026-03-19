
import { Execution } from '../';
import { ServerComponent } from '../server/ServerComponent';
import { EXECUTION_EVENT, IEngine} from "../interfaces";

import { DataStore } from '../datastore';
import { exec } from 'child_process';


/**
 * Core orchestrator for BPMN process execution.
 *
 * Manages the full lifecycle of process instances: starting new processes,
 * resuming waiting items, handling signals/messages, and timer events.
 * All operations acquire an instance lock before modifying state and release it on completion.
 */
class Engine extends ServerComponent implements IEngine{

	runningCounter=0;
	callsCounter=0;
	/**
	 * Creates an Engine instance bound to the given server context.
	 *
	 * @param server	the server providing dataStore, definitions, cache, and appDelegate
	 */
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
	
		this.cache.add(execution);

		try {
			await this.lock(execution.id);
			execution.isLocked = true;


			if (options['noWait'] == true) {
				execution.worker = execution.execute(startNodeId, this.sanitizeData(data), options);
				execution.worker.then(async (obj)=>{ 
						this.logger.log('after worker is done releasing ..'+execution.instance.id);
						await this.release(execution);
						});
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
			if (execution && execution.isLocked)
				await this.release(execution);
		}
		
	}

	/**
	 * Restarts a completed or terminated item, allowing re-execution from that point.
	 *
	 * @param itemQuery		criteria to locate the item to restart
	 * @param data			input data for the restarted item
	 * @param userName		user performing the restart
	 * @param options		execution options
	 */
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
	 * Restores an instance into memory and returns the execution.
	 *
	 * @param instanceQuery		criteria to fetch the instance
	 *
	 * Query examples:
	 * ```
	 * { id: instanceId }
	 * { data: { caseId: 1005 } }
	 * { "items.id": "abcc111322" }
	 * { "items.itemKey": "businesskey here" }
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

			this.cache.add(execution);
			this.logger.log("restore completed: "+instance.saved);

		}

		return execution;
	}
	/**
	 * Convenience wrapper around {@link invoke} for signaling a single waiting item.
	 *
	 * @param itemQuery		criteria to retrieve the item
	 * @param data			data to pass to the item
	 */
	async invokeItem(itemQuery, data = {}): Promise<Execution> {

		return await this.invoke(itemQuery, data);
	}
	/**
	 * Updates an existing item that is in a wait state with an assignment.
	 * Can modify data, assignment, or both without completing the item.
	 *
	 * @param itemQuery		criteria to retrieve the item
	 * @param data			data to merge into the item
	 * @param assignment	assignment fields (e.g. assignee, candidateGroups)
	 * @param userName		user performing the assignment
	 * @param options		execution options
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

			execution.worker = execution.assign(item.id, this.sanitizeData(data), assignment, userName,options);

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
	 * Continues a waiting item by signaling its token with input data.
	 *
	 * Uses a two-phase signal when `options.noWait` is true:
	 *   - Phase 1 (`signalItem`): sets up context, passes data to the token, saves, and returns immediately.
	 *   - Phase 2 (`signalItemContinue`): runs in the background to complete execution and release the lock.
	 *
	 * Query examples:
	 * ```
	 * { itemId: value }
	 * { itemKey: value }
	 * { instanceId: instanceId, elementId: value }
	 * ```
	 *
	 * @param itemQuery		criteria to retrieve the item
	 * @param data			input data to pass to the item
	 * @param userName		user performing the invocation
	 * @param options		execution options; set `noWait: true` for async two-phase signal
	 */
	async invoke(itemQuery, data = {}, userName: string = null, options = {}): Promise<Execution> {

		this.logger.log(`^Action:engine.invoke`);
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

			if (item.status !== 'wait') {
				this.logger.log(`*****Item status is not in wait state ${item.status} ${item.elementId}-${item.processName}`)
            }
			execution = await this.restore(item.instanceId);

			await execution.signalItem(item.id, this.sanitizeData(data),userName,options);
			let exeItem=execution.item;

				try {
				if (options['noWait'] == true) {
					this.logger.log(`.noWait`);
					let self=this;
					execution.save();
					execution.worker=execution.signalItemContinue(item.id);
					execution.worker.then(async function (obj) {
						self.logger.log('after worker is done releasing ..'+item.instanceId);
						self.release(execution);
					});
					return execution;
				}
				else {
					this.logger.log(`.engine.continue ended`);
					await this.release(execution);
					return execution;
				}
			}
			catch(exc) {
				await this.release(execution);
				throw exc;
			}
			finally {
				if (execution && execution.isLocked)
					await this.release(execution);
			}
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
	 * Creates a new item for a repeating timer event on an existing instance.
	 *
	 * Called by the Cron scheduler when a repeat-cycle timer fires again.
	 *
	 * @param instanceId	the instance to attach the new timer item to
	 * @param prevItem		the previous timer item that triggered this repeat
	 * @param data			input data for the new timer item
	 * @param options		execution options
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
	 * Invokes a start event (typically from a secondary process) against an existing instance.
	 *
	 * Used when a signal or message triggers a new event subprocess or secondary
	 * start event within an already-running instance.
	 *
	 * @param instanceId	the running instance to target
	 * @param elementId		the start event element id to invoke
	 * @param data			input data for the event
	 * @param userName		user triggering the event
	 * @param options		execution options
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
	/**
	 * Throws a BPMN message event.
	 *
	 * First checks model definitions for a matching start event to launch a new instance.
	 * If none found, searches running instances for a waiting item with the given messageId.
	 *
	 * @param messageId		the message id as defined in the BPMN model
	 * @param data			message payload
	 * @param matchingQuery	additional criteria to narrow down the target item
	 */
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
		console.log('throw signal itemsQuery:', itemsQuery,items.length);
		if (items.length > 0) {
			for (var i = 0; i < items.length; i++) {
				let item = items[i];
				console.log(`Throw Signal ${signalId} found target: ${item.processName} ${item.id}`);
			}

			for (var i = 0; i < items.length; i++) {
				let item = items[i];
				this.logger.log('..^Action:engine.Throw Signal found target', item.processName,item.id );
				var res=await this.invoke({ "items.id": item.id }, this.sanitizeData(data));
				instances.push({instanceId:res.instance.id,itemId:item.id});
            }
		}
		return instances;
	}
	/**
	 * Returns current engine status counters.
	 */
	status() {
		return { running: this.runningCounter, calls: this.callsCounter };
	}
	
	/**
	 * Upgrades running instances to a new model source.
	 *
	 * Finds all instances of the given model that have not yet reached any of
	 * the specified nodes, then replaces their stored BPMN source with the latest version.
	 *
	 * @param model			name of the BPMN model to upgrade
	 * @param afterNodeIds	exclude instances that have already passed through these nodes
	 * @returns				list of upgraded instance ids, or an error object
	 */
	async upgrade(model:string,afterNodeIds:string[]):Promise<string[]|{errors}> {

		let ds=this.server.dataStore;
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
		console.log(source);

		console.log(insts);
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

	/**
	 * Centralized exception handler for engine operations.
	 * Fires a process_exception event and logs the error.
	 */
	private async exception(exc,execution) {

		console.log("Exception: stack",exc.stack);
		if (execution)
			await execution.doExecutionEvent(execution,EXECUTION_EVENT.process_exception);

		return this.logger.error(exc);

	}
	/**
	 * Deep-clones data to prevent mutation of caller's objects during execution.
	 */
	private sanitizeData(data) {
		return JSON.parse(JSON.stringify(data));
	}
}


export { Engine};
