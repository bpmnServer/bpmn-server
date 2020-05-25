import { WFInstance } from "./WFInstance";
const { Engine } = require('bpmn-engine');

import { EventEmitter } from 'events';


import { ItemInstance } from './ItemInstance';
import { BPMNServer } from "./BPMNServer";
import { CustomEngine as DefaultEngine } from "./DefaultEngine";
import { CacheManager } from "./CacheManager";
import { EventType, ILogger } from "./API";
import { DefaultLogger } from "./DefaultLogger";
import { DataStore } from "./DataStore";



/**
 * is invoked when the server is invoked for execute/invoke
 * */


class Processor implements ILogger{
	context;
	dataStore;
    engine;
    instance;
    events=[];
	logger;
	logStart = 0;

	constructor(context, dataStore) {
		this.context = context;
		this.dataStore = dataStore;
		this.logger = context.logger;
	}
	// Ilogger Implementation 
    setOptions(options) {
		return this.logger.setOptions(options);
    }
	log(msg: any) {
		if (this.instance)
			this.instance.logs.push('log:'+msg);
		this.logger.log(msg);
    }
    debug(msg: any) {
		if (this.instance)
			this.instance.logs.push('debug:' + msg);
		this.logger.debug(msg);
    }
    error(msg: any) {
		if (this.instance)
			this.instance.logs.push('error:' + msg);
		this.logger.error(msg);
    }
    clear() {
		return this.logger.clear();
    }
	// Ilogger Implementation 

	result() {
		this.context.instance = this.instance;
		this.context.engine = this.engine;
		this.context.error = null;
		this.context.events = this.events;
	
		return this.context;
//		return { instance: this.instance, engine: this.engine, events: this.events, logs: this.logs , error: null };
	}
	notify(event:EventType, ...args) {

		this.context.notify(event, ...args);
    }
	/**
	 * execute
	 */
	async execute(name, data, source, engineClassPath, callback , services, extensions) {

		this.instance = new WFInstance('add');
		this.log("Action:execute  " + name + "data:" + JSON.stringify(data));

		this.notify(EventType.Instance_create, this.instance);

		try {

			let src = source;
			if (!src)
				src = this.context.configuration.definitions.getSource(name);

			if (src == null)
				this.error('Defintion named:' + name + ' has no source');


			await this.start( this.instance,
				{
					name,
					data,
					source: src,
					engineClassPath,
					callback , services, extensions
				});
			this.log('caching instance ' + this.instance.id);


			return this.result();
		}
		catch (error) {
			this.error(error);
			/*			if (execution == null)
							execution = new Execution(null,null,null);
						execution.error = error;
						return execution; */
		}
		finally {

		}

	}


	/**
	 * start a new process from source
	 * 
	 * @param param0
	 */
	private async start(instance, { name, source, data, engineClassPath, callback ,services , extensions }) {

		instance.data = data;
		instance.name = name;
		this.log('Starting ' + name + JSON.stringify(data));

		let engineClass = DefaultEngine;
		if (engineClassPath)
			engineClass = this.loadEngineClass(engineClassPath);

		this.engine= new engineClass(this);

		this.engine.create({ name, source, services,extensions, variables: data });

		this.notify(EventType.Engine_create, this.engine);

		const listener = new EventEmitter();

		this.setListener(listener, this.engine.getImplemntingEngine());
		this.log("Starting engine");

		let self = this;

		CacheManager.add(this.instance, this.engine);

		await this.engine.execute({listener , variables : data , callback });
		this.notify(EventType.Engine_start, this.engine);

		// do saving here 
		await this.save();
		return this.result();
	}

	/**
	 * restore an existing instance
	 * @param instanceId to be restored
	 * @param callback 
	 */
	async restore(instanceId, callback) {
		try {

			let cachedEngine = BPMNServer.getLive(instanceId);
			let execution;
			//		let cachedEngine = null;
			if (cachedEngine) {
				this.log("Found current engine in cache");
				this.instance = cachedEngine.instance;
				this.engine = cachedEngine.engine;
			}
			else {
				this.instance = await this.loadInstance(instanceId);

				this.notify(EventType.Instance_load, this.instance);

				var stateObj = JSON.parse(this.instance.state);
				let engineClass = DefaultEngine;
				if (this.instance.engineClassPath)
					engineClass = this.loadEngineClass(this.instance.engineClassPath);

				this.engine = new engineClass(this);

				this.engine.recover(stateObj);
				this.notify(EventType.Engine_recover, this.engine);

				const listener = new EventEmitter();

				this.setListener(listener, this.engine.getImplemntingEngine());
				let self = this;
				await this.engine.resume({ listener: listener }, function () {
					if (callback)
						callback(this.engine, listener)
					self.log(' resumed process completed');
				});
				this.notify(EventType.Engine_resume, this.engine);

			}

			CacheManager.add(this.instance, this.engine);

			return this.result();

		}
		catch (error) {
			this.error(error);
			return null;

		}
	}
	
	/**
	 * invoke an item in an existing instance; either currently running in cache or to be restored
	 * 
	 * @param itemQuery
	 * @param data
	 * @param callback 
	 */
	async invoke(itemQuery, user, data, callback) {

		this.log("Action:Starting server invoke ");

		try {

			let invokingItem = await this.findItemToInvoke(itemQuery);
			if (invokingItem == null)
				return;

			await this.restore(invokingItem.instanceId, null);

			this.log("Action:Starting server invoke " + invokingItem.taskId + " Data:" + JSON.stringify(data));

			let item = null;
			let i = 0;
			let items = this.instance.getItems({});
			for (i = 0; i < items.length; i++) {
				if (items[i].id == invokingItem.id)
					item = items[i];
			}

			if (item == null) {
				this.error("Invoked item is not found in instance items id:" + invokingItem.id);
				return null;
			}
			if (item.status == 'end') {
				this.error("Item already completed" + item.id);
				return null;
			}
			if (this.instance.state == null) {
				this.error("State is not found for instance");
				return null;
			}

			await this.invokeItem(item, user, data);
			this.notify(EventType.Item_invoke,invokingItem);

			await this.save();

			return this.result();
		}
		catch (error) {
			this.error(error);
			return { error }

		}
	}

	async invokeItem(invokingItem, user, itemData) {
		this.log('invoke item '+invokingItem.taskId + " Data:" +JSON.stringify(itemData));

		let item = this.instance.items.get(invokingItem.executionId);
		if (item && item.task != null) {

			let task = item.task;
			this.log(task.id + task.name + ' signalled');
			await task.signal(itemData);
			this.log('task.environment.output'+JSON.stringify(task.environment.output));
			this.log('task.environment.variables.input' + JSON.stringify(task.environment.variables.input));
			item.itemData = itemData;

		}
		else {
			this.log(item);
			this.log(this.instance.getItems({}));
			this.error("**Error Invalid Item to be invoked**");
			return null;
		}

	}
	loadEngineClass(path) {
		if (path) {
			this.log('Loading custom engine ' + path);
			let cls = require(path);
			return cls.CustomEngine;
		}
	}

	async loadInstance(instanceId) {

		let { instance: instanceData , items }  = await this.dataStore.loadInstance(instanceId);
		let instance = new WFInstance();
		instance.fromDataObject(instanceData);

		items.forEach(record => {
			let item = ItemInstance.fromDB(record);
			instance.items.set(item.executionId, item);
		});
		return instance;
	}

	async findItemToInvoke(itemQuery) {

		this.log(itemQuery);
		let items = await this.dataStore.findItems(itemQuery);
		if (items.length == 0) {
			this.log(" No item found" + JSON.stringify(items));
			this.error("Item not found for this query: "+ JSON.stringify(itemQuery));
			return null;
		}

		const invokingItem = items[0];

		return invokingItem;
	}

	async checkForSave() {
		if(this.instance.modified)
			this.save();
	}

	async save() {
		let state = await this.engine.getState();
		this.instance.state = state;

		this.log("saving...");

		let saveDataStore = new DataStore(this.context.configuration,this);
		await saveDataStore.saveInstance(this.instance);

		this.notify(EventType.Instance_save, this.instance);

		this.instance.modified = false;
		this.log("saving ended.");
	}

	async ended() {

		this.notify(EventType.Engine_idle, this.engine);
		 
		let state = this.engine.getImplemntingEngine().state;
		this.log("saving and stopping..." + state);
		await this.save();


		if (state == 'idle') {
			this.engine.stop();
			this.log("engine is now idle will be removed from cache");
			CacheManager.remove(this.instance.id);
		}
	}

/*
 *
 *	tracking items
 *
 *		1.	retrieve all items by instance id place in a map by execution id
 *		2.
 *		track all tasks processed in run (start, waiting and end)
 *			start	- record start time
 *			wait	- nothing
 *			end		- record end time
 *		at end of run
 *			check task status:
 *				insert	- if itemInstance is null
 *				update	- if itemInstance
 *
 */
	setListener(listener,engine) {

		listener.on('activity.timer', async (task) => {
			await this.trackTask(task,EventType.Activity_timer);
		});
		listener.on('activity.enter',async (task) => {
			await this.trackTask(task, EventType.Activity_enter);
		});
		listener.on('activity.end', async (task,engine) => {

			if (task.content.output)
				engine.environment.output[task.id] = task.content.output;

			await this.trackTask(task, EventType.Activity_end);
		});

		listener.on('wait',async (task) => {
			await this.trackTask(task, EventType.Activity_wait);

		});

		listener.on('flow.take', async (flow) => {
			this.recordEvent(EventType.Flow_take, flow );
		});
		listener.on('flow.discard',async (flow) => {
			this.recordEvent(EventType.Flow_discard, flow);
		});

		engine.once('end', async (execution) => {
			this.instance.endAt = new Date().toISOString();

			this.recordEvent(EventType.Process_end, execution);

			this.log("end of process execution.environment.output:" + JSON.stringify(execution.environment.output));

			this.log(execution.environment.variables);

			await this.ended();
		});
	}
	recordEvent(event,task) {
		this.events.push({ event, id: task.id });
    }
	async trackTask(task, event) {

		this.recordEvent(event, task);

		let modified = false;
		//		this.log("trackingTask event: " + event + " " + task.id + " execution id" + task.executionId);
		let msg = "event:task." + event + ": " + task.name + " Id: " + task.id + " type: " + task.type + " ";
		let item = this.instance.items.get(task.executionId);
		if (item == null) {
			item = ItemInstance.fromTask(task, this.instance, event);

			let fields =  await this.getFields(task.id);
			if (fields) {
				item.inputFields = fields;
            }
			item.user = this.context.user;

			if (item.dbAction == null) {
				item.dbAction = 'add';
			}
			this.instance.items.set(task.executionId, item);
			modified = true;
		}
		else {
			if (item.dbAction == null)
				item.dbAction = 'update';

			item.task = task;
			item.status = event.toString();

			if (event == EventType.Activity_end)
				item.endAt = new Date().toISOString();
			if (event == EventType.Activity_timer) {
				item.isoDuration = task.content.isoDuration;
				item.timeout = task.content.timeout;
			}
			msg += " .item tracked" + item.id + " status: " + item.status + " action:" + item.dbAction;
			modified = true;
		}
		this.log(msg);

		if (modified) {

			this.instance.lastAt = new Date().toISOString();
			this.instance.lastItem = item.id;
			this.instance.lastStatus = item.status;

			if (!this.instance.modified) {
				this.instance.modified = true;
				let self = this;
				setImmediate(function () {
					checkForSave(self);
				});
			}
		}
	}
	async getFields( taskId) {

		return await this.engine.getFields(taskId);
	}

}
function checkForSave(processor) {
	
	processor.checkForSave();
}



export { Processor };
