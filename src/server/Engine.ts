import { AsyncLocalStorage } from 'node:async_hooks';
import { Execution } from '../engine/Execution.js';
import { ServerComponent } from '../server/ServerComponent.js';
import { EXECUTION_EVENT, EXECUTION_STATUS, ITEM_STATUS } from '../interfaces/Enums.js';
import type { IEngine } from '../interfaces/server.js';

/** Item statuses after which an item is not invoked again. */
const FINAL: string[] = [ITEM_STATUS.end, ITEM_STATUS.terminated, ITEM_STATUS.cancelled, ITEM_STATUS.discard];

/**
 * An engine call on an instance from within a call that already holds it (a service task, a script or
 * a listener calling the engine back on its own instance): refused at once, since it would wait for a
 * lock its own caller holds until the lock's tries ran out.
 */
class ReentrantCallError extends Error {
	readonly code = 'REENTRANT_CALL';
	constructor(readonly instanceId: string) {
		super(`Instance ${instanceId} is already held by the call this one was made from (a service task, script or listener calling the engine back on its own instance): it is not called again until that call returns`);
		this.name = 'ReentrantCallError';
	}
}

/** The instances held by the engine call running now, and by the calls it was made from. */
const held = new AsyncLocalStorage<Set<string>>();
/** The engine's calls: each runs with the instances its callers hold, and adds those it locks. */
const CALLS = ['start', 'restart', 'get', 'cancel', 'assign', 'invoke', 'startRepeatTimerEvent', 'startEvent', 'upgrade'];

/** An invoke of an item that has already ended (completed, terminated, cancelled, discarded). */
class ItemNotWaitingError extends Error {
	readonly code = 'ITEM_NOT_WAITING';
	constructor(readonly itemId: string, readonly status: string) {
		super(`Item ${itemId} is not waiting (it is ${status}): it is not invoked again`);
		this.name = 'ItemNotWaitingError';
	}
}


class Engine extends ServerComponent implements IEngine{

	runningCounter=0;
	callsCounter=0;
	/** Executions handed off with `noWait`, still running. */
	private readonly workers = new Set<Promise<unknown>>();
	private closing = false;
	constructor(server) {

		super(server);
		for (const name of CALLS) {
			const call = this[name].bind(this);
			this[name] = (...args) => held.run(new Set(held.getStore() ?? []), () => call(...args));
		}
    }
	/** From now on, new calls are refused; running ones finish. */
	close() { this.closing = true; }
	/** Waits until no call runs and no handed-off execution is running, or `timeout` ms pass; true when idle. */
	async drain(timeout = 10_000): Promise<boolean> {
		const until = Date.now() + timeout;
		while (this.runningCounter > 0 || this.workers.size > 0) {
			if (Date.now() >= until) return false;
			await new Promise(r => setTimeout(r, 25));
		}
		return true;
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
		this.assertOpen();
		this.runningCounter++;
		this.callsCounter++;
		this.logger.log(`^Action:engine.start ${name}`);

		let execution: Execution;
		let handedOff = false;
		try {
			const definitions = this.definitions;
			const source = await definitions.getSource(name);

			execution = new Execution(this.server,name, source);
			// The caller may name the instance (an application whose record of it shares its id); unique, as any id.
			if (options['instanceId']) execution.instance.id = String(options['instanceId']);
			execution.svg = await definitions.getSVG(name);

			if (options['parentItemId']) {
				execution.instance.parentItemId=options['parentItemId'];
			}
			execution.userName = userName;
			execution.operation='start';
			execution.options=options;
			execution.instance.tenantId = options['tenantId'];

			this.cache.add(execution);

			await this.lock(execution.id);
			execution.isLocked = true;


			if (options['noWait'] == true) {
				this.handOff(execution, execution.execute(startNodeId, this.sanitizeData(data), options));
				handedOff = true;
				return execution;
			}
			else {
				await execution.execute(startNodeId, this.sanitizeData(data), options);
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

		this.assertOpen();
		this.logger.log(`^Action:engine.restart`);
		let execution;
		this.runningCounter++;
		this.callsCounter++;

		try {
			const item = await this.server.dataStore.findItem(itemQuery);

			const instance = await this.server.dataStore.findInstance({id:item.instanceId}, 'summary');

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

		this.assertOpen();
		this.runningCounter++;
		try {
			let instance = await this.dataStore.findInstance(instanceQuery, 'summary');
			const execution = await this.restore(instance.id);
			await this.release(execution);
			return execution;
		}
		finally {
			this.runningCounter--;
		}
	}
	/**
	 * Cancels a running instance: its tokens are terminated (their waiting items end as
	 * terminated), its timers on this server are cancelled, `process.terminated` is emitted, and it
	 * is saved as `terminated`: never deleted. An instance that has ended or was cancelled before is
	 * left as it is.
	 *
	 * @param instanceQuery		criteria to fetch the instance, as for `get`
	 */
	async cancel(instanceQuery, userName: string = null, options = {}): Promise<Execution> {

		this.assertOpen();
		this.logger.log(`^Action:engine.cancel`);
		let execution;
		this.runningCounter++;
		this.callsCounter++;
		try {
			const instance = await this.dataStore.findInstance(instanceQuery, 'summary');
			execution = await this.restore(instance.id);
			if (execution.instance.status !== EXECUTION_STATUS.end && execution.instance.status !== EXECUTION_STATUS.terminated) {
				execution.userName = userName;
				execution.operation = 'cancel';
				for (const token of [...execution.tokens.values()]) await token.terminate();
				execution.instance.status = EXECUTION_STATUS.terminated;
				execution.instance.endedAt = new Date();
				this.cron.cancelInstance?.(execution.id);
				await execution.doExecutionEvent(execution, EXECUTION_EVENT.process_terminated, { userName, ...options });
				await execution.save();
			}
			this.cache.remove(execution.id);
			await this.release(execution);
			return execution;
		}
		catch (exc) {
			return await this.exception(exc, execution);
		}
		finally {
			this.runningCounter--;
			if (execution && execution.isLocked)
				await this.release(execution);
		}
	}
	/**
		lock instance
	*/
	private async lock(executionId) {
			const mine = held.getStore();
			if (mine?.has(executionId)) throw new ReentrantCallError(executionId);
			this.logger.log('...locking ..'+executionId);
			await this.lockManager.lock(executionId);
			mine?.add(executionId);

			this.logger.log('   locking complete' + executionId);
	}
	/**
		release instance lock
	*/
	private async release(execution: Execution,id=null) {
		if (id===null)
			id =execution.id;
		this.logger.log('...unlocking ..' + id);
			if (execution)
				execution.isLocked=false;
			held.getStore()?.delete(id);
			await this.lockManager.release(id);
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
			held.getStore()?.delete(instanceId);
			await this.lockManager.release(instanceId);
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

		this.assertOpen();
		this.logger.log(`^Action:engine.assign`);
		this.logger.log(itemQuery);
		let execution;

		this.runningCounter++;
		this.callsCounter++;
		try {

			const item = await this.findOneItem(itemQuery);

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

		this.assertOpen();
		this.logger.log(`^Action:engine.invoke`);
		this.logger.log(itemQuery);
		let execution;
		let handedOff = false;
		this.runningCounter++;
		this.callsCounter++;

		try {

			const item = await this.findOneItem(itemQuery);

			if (item.status !== 'wait') {
				this.logger.log(`*****Item status is not in wait state ${item.status} ${item.elementId}-${item.processName}`)
            }
			execution = await this.restore(item.instanceId);
			// Read again under the lock: an item another call completed, or cancelled, meanwhile is not invoked twice.
			const current = execution.getItems().find(i => i.id === item.id);
			if (!current || FINAL.includes(current.status))
				throw new ItemNotWaitingError(item.id, current ? current.status : 'missing');

			await execution.signalItem(item.id, this.sanitizeData(data),userName,options);

			if (options['noWait'] == true) {
				this.logger.log(`.noWait`);
				this.handOff(execution, (async () => {
					await execution.save();
					return execution.signalItem2(item.id);
				})());
				handedOff = true;
				return execution;
			}
			// not needed to signalItem2 since signal() issues goNext()
			this.logger.log(`.engine.continue ended`);

			await this.release(execution);
			return execution;
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

		this.assertOpen();
		// need to load instance first
		this.logger.log('startRepeatTimeEvent');
		let execution;
		this.runningCounter++;

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
			this.runningCounter--;
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

		this.assertOpen();
		// need to load instance first
		this.logger.log('serverinvokeSignal');
		let execution;
		this.runningCounter++;
		this.callsCounter++;

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
			this.runningCounter--;
			if (execution && execution.isLocked)
				await this.release(execution);
		}

	}
	/**
	 * A message has one receiver (a signal is the broadcast): the first waiting item the matching
	 * query finds (an instance waiting for it: a catch event, a receive task, a boundary event), else,
	 * when none waits, a definition whose start event it is, started. A waiting instance is never
	 * passed over for a new one (the upstream tried the start events first).
	 *
	 * @param messageId		the message's name
	 * @param matchingQuery	what narrows the waiting instances (their id, their data)
	 */
	async throwMessage(messageId, data = {}, matchingQuery = {}): Promise<Execution> {

		this.logger.log('..^Action:engine.throwMessage ', messageId,this.sanitizeData(data),matchingQuery);

		if (!messageId)
			return null;
		const items = await this.waitingFor('messageId', messageId, matchingQuery);
		if (items.length > 0) {
			const item = items[0];
			this.logger.log('..^Action:engine.throwMessage found target ', item.processName, item.id);
			return await this.invoke({ "items.id": item.id }, this.sanitizeData(data));
		}
		const events = await this.definitions.findEvents({ "events.messageId": messageId });
		this.logger.log('..findEvents ' + events.length);
		if (events.length > 0) {
			const event = events[0];
			this.logger.log('..^Action:engine.throwMessage starts ', event.modelName, event.elementId);
			return await this.start(event.modelName, data, event.elementId, null);
		}
		this.logger.log('** engine.throwMessage found no instance waiting and no start event for ', messageId, JSON.stringify(matchingQuery));
		return null;

	}
	/** The items waiting for a message or signal (`kind`: messageId or signalId), the matching query narrowing their instances. */
	async waitingFor(kind: 'messageId' | 'signalId', name: string, matchingQuery = {}) {
		const query = Object.assign({}, matchingQuery ?? {});
		query["items." + kind] = name;
		query["items.status"] = 'wait';
		return this.dataStore.findItems(query);
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
				this.logger.log('..^Action:engine.Throw Signal found target', item.processName,item.id );
				var res=await this.invoke({ "items.id": item.id }, this.sanitizeData(data));
				instances.push({instanceId:res.instance.id,itemId:item.id});
            }
		}
		return instances;
	}
	status() {
		return { running: this.runningCounter, calls: this.callsCounter, handedOff: this.workers.size };
	}

	/**
	 * Points the saved instances of `model` at its current definition source, each under its
	 * instance lock; with `afterNodeIds`, only the instances that have not reached any of them.
	 *
	 * @param model
	 * @param afterNodeIds
	 */
    async upgrade(model:string,afterNodeIds:string[]):Promise<string[]|{errors}> {

		let ds=this.server.dataStore;

		let query={"name":model};

		if (afterNodeIds.length>0) {
			let nors = [];
			afterNodeIds.forEach(node=>{
			nors.push({"items":{"$elemMatch":{"elementId":node}}});
			});
			query["$nor"]=nors;
		}
		let insts=await ds.findInstances(query,{"projection":{"id":1}});

		let source=await this.server.definitions.getSource(model);
		this.logger.log(`^Action:engine.upgrade ${model} instances:${insts.length}`);
		const resIds=[];
		for(let i=0;i<insts.length;i++) {

			let inst=insts[i];
				await this.lock(inst.id);
				try {
					await ds.updateInstanceSource(inst.id, source);
					resIds.push(inst.id);
					}
				catch(exc) {
					return {errors:exc};
				}
				finally {
					await this.release(null,inst.id);

				}
		}
		return resIds;
	}

	/** The one item `itemQuery` names; none, or more than one, is an error. */
	private async findOneItem(itemQuery) {
		const items = await this.server.dataStore.findItems(itemQuery);
		if (items.length > 1)
			throw new Error(`query produced ${items.length} items, expecting only one: ` + JSON.stringify(itemQuery));
		if (items.length == 0)
			throw new Error("query produced no items for " + JSON.stringify(itemQuery));
		return items[0];
	}
	private assertOpen() {
		if (this.closing) throw new Error('BPMN server is shutting down: no new executions');
	}
	/** Keeps a handed-off execution's worker until it settles (then its lock is released); its rejection stays on `execution.worker`, for whoever awaits it, and is reported. */
	private handOff(execution: Execution, run: Promise<unknown>) {
		const worker = run.finally(() => this.release(execution));
		execution.worker = worker;
		this.workers.add(worker);
		worker.then(() => this.workers.delete(worker), error => { this.workers.delete(worker); this.cache.remove(execution.id); this.report(error); });
	}
	private report(error) {
		if (typeof this.logger.reportError === 'function') this.logger.reportError(error);
		else console.error(error);
	}
	/**
	 * A failed call: reported, the execution dropped from the cache (its state in memory may be
	 * part-way; the next call restores it from the store), `process.exception` emitted, and the
	 * error thrown to the caller as it is (the engine has always thrown here).
	 */
	private async exception(exc,execution): Promise<never> {

		this.report(exc);
		if (execution) {
			this.cache.remove(execution.id);
			try {
				await execution.doExecutionEvent(execution,EXECUTION_EVENT.process_exception, { error: exc });
			}
			catch (listenerError) {
				this.report(listenerError);
			}
		}
		throw exc;

	}
	private sanitizeData(data) {
		return data == null ? {} : JSON.parse(JSON.stringify(data));
	}
}


export { Engine, ItemNotWaitingError, ReentrantCallError };
