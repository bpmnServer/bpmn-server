
import { Logger } from '../common/Logger';

import { DefaultHandler } from '../common/DefaultHandler';

import { DataStore }  from  './DataStore';
//import { EventType, IBPMNServer } from './API';
import { EventEmitter } from 'events';
import { Execution , Item } from '../engine';
import { Definition } from '../elements/Definition';

const fs = require('fs');

// import { IContext, IInstance, ILogger, IConfiguration, IInstanceItem } from './API';



class CacheManager {
	static liveInstances = new Map();

	static getList() {
		const items = [];
		CacheManager.liveInstances.forEach(item => { items.push(item); });
		return items;

	}
	/**
	**/
	static getInstance(instanceId) {
		const instance = CacheManager.liveInstances.get(instanceId);
		return instance;
	}

	static add(instance, engine) {

		CacheManager.liveInstances.set(instance.id, { instance, engine });
	}
	static remove(instanceId) {
		CacheManager.liveInstances.delete(instanceId);
	}
}


class ServerContext { // implements IContext {
	instance?: Execution;
	logger: Logger;
	serverListener?: any;
	configuration: any;
	itemsProcessed: Item[];
	message?: string;
	user: string;
	error?: any;

	constructor(configuration, user, logger = null) {
		this.configuration = configuration;
		if (logger == null)
			logger = new Logger({});
		this.user = user;
		this.logger = logger;
	}
}
/*
 *	The main class of Server Layer
 *	provides the full functionalities:
 *	
 *		1.	access to Execution engine
 *		2.	data Presistence through DataStore class
 *		3.	access to models definitions, loading and saving of models
 *		4.	access to BPMN definition details
 *		
 *		primary Use Cases:
 *		a.	execute a process
 *			server= new BPMNServer(...);
 *			server.execute(...);
 *			
 *		b.	invoke a task in an already started process
 *			server= new BPMNServer(...);
 *			server.invoke(...);
 * 
 *		c.	find items (various options)
  *			server= new BPMNServer(...);
 *			server.findItems(...);
*/
class BPMNServer  {

	configuration;
	logger;
	dataStore;
	/**
	 * Server Constructor
	 * 
	 * @param configuration	see 
	 * @param logger
	 */
	constructor(configuration, logger =null) {
		this.configuration = configuration;
		if (logger == null) {
			logger = new Logger({});
        }
		this.logger = logger;
		this.logger.log("new Server");
		this.dataStore = new DataStore(configuration,logger);
	}
	/**
	**/
	static getLives() {
		return CacheManager.getList();
	}
	/**
	**/
	static getLive(instanceId) {
		return CacheManager.getInstance(instanceId);
    }
	async init() {
//		const items = Timer.getDueTimers(this.definitions, this.configuration);
//		items.forEach(timer => {
//		});
	}
	//	is called to start all instances that were shutdown
	async restart() {
		this.logger.log("Restarting..");
		const list = await this.findInstances({ endAt: null });
		const self = this;
		let i;
		for (i = 0; i < list.length; i++) {
			const instance = list[i];
			self.logger.log("..restoring instance " + instance.id);
			await self.restore(instance.id);
			self.logger.log("..count :" + CacheManager.getList().length);
        }
		
    }
	//	shutsdown all instances that are still live
	async shutdown() {

		this.logger.log("Shutdown..");
		const instannces = CacheManager.liveInstances;
		let i = 0;
		const list = [];
		instannces.forEach(item => { list.push(item); });
		for (i = 0; i < list.length; i++) {

			const engine = list[i].engine;
			await engine.stop();
			this.logger.log("shutdown engine " + engine.name + " status : " + engine.state);
			instannces.delete(list[i].instance.id);
        }
	}
	/*
	 *	loads a definition
	 *	
	 */
	async loadDefinition(name, source?) {

		const definitions = this.configuration.definitions;
		if (!source) {
			source = definitions.getSource(name);
		}

		const definition = new Definition(name, source, this.logger);
		await definition.load();
		return definition;
    }
	/*	
	 *	loads a definitions and start execution
	 *	
	 */
	async execute(name: any,
		user: any,
		data: any = {},
		source: string = null,
		engineClassPath: string = this.configuration.engineClassPath,
		callback: any = null,
		services: any = null,
		extensions: any = null): Promise<ServerContext> {

		const definitions = this.configuration.definitions;
		if (!source)
			source = definitions.getSource(name);


		const context = new ServerContext(this.configuration, user, this.logger);

		const execution = new Execution(name,source, this.configuration.appDelegate, this.logger);
		const ds = new DataStore(this.configuration,this.logger);
		ds.monitorExecution(execution);

		await execution.execute(null, data);

		const state = await execution.getState();

		await fs.writeFile('state.txt', JSON.stringify(state), function (err) {
			if (err) throw err;
		});
		await ds.save();

		context.instance = execution;

		console.log("returning execute");
		return context;

	}
	async restore(instanceId, callback = null) : Promise<ServerContext> {

		/*
		const context = new ServerContext(this.configuration, null , this.logger);
		const processor = new Processor(context, this.dataStore);

		context = await processor.restore(instanceId, callback);

		return context;
		*/
		return null;
	}
	async invoke(itemId, user, data = {}) {

		// need to load instance first
		console.log(itemId);

		const query = { "items.id": itemId };

		const instance = await this.dataStore.findInstance(query);
		
		const context = new ServerContext(this.configuration, user, this.logger);

		const execution = await Execution.restore(instance, new DefaultHandler(this.logger), this.logger);
		const ds = new DataStore(this.configuration,this.logger);
		ds.monitorExecution(execution);

		await execution.signal(itemId, data);

		await ds.save();

		context.instance = execution;
		console.log("invoke completed");
		
		return context;
	}
	async findItems(query) {
		try {

			return await this.dataStore.findItems(query);
		}
		catch (err) {
			Error(err);
        }

	}
	async findInstances(query,view ='summary') {
		try {

			return await this.dataStore.findInstances(query,view);
		}
		catch (err) {
			Error(err);
		}
	}
	async deleteData(instanceId = null) {
		try {
			if (instanceId == null)
				this.shutdown();
			else
				CacheManager.remove(instanceId);

			return await this.dataStore.deleteData(instanceId);

		}
		catch (err) {
			Error(err);
		}
	}
}


export { BPMNServer};
