const { Engine } = require('bpmn-engine');

import { DefaultLogger } from './DefaultLogger';

const Timer = require('./timer.js')

import { DataStore }  from  './DataStore';
import { Processor } from './Processor';
import { CacheManager } from './CacheManager';
import { EventType, IBPMNServer } from './API';
import { EventEmitter } from 'events';
import { IContext, IInstance, ILogger, IConfiguration, IInstanceItem } from './API';




class ServerContext implements IContext {
	instance?: IInstance;
	engine?;
	events?: any;
	logger: ILogger;
	serverListener?: any;
	configuration: IConfiguration;
	notifier: any;
	itemsProcessed: IInstanceItem[];
	message?: string;
	user: string;
	error?: any;



	constructor(configuration, user, logger = null) {
		this.configuration = configuration;
		if (logger == null)
			logger = new DefaultLogger({});
		this.user = user;
		this.logger = logger;
		this.notifier = new ServerNotifier();
	}
	notify(event: EventType, ...args) {
		this.logger.log(">>Event: " + event);
		this.notifier.notify(event, ...args);
	}
}
/*
const serverNotifier = new ServerNotifier();
serverNotifier.on('event', () => {
    console.log('an event occurred!');
});
serverNotifier.notify(EventType.Server_Start);

 */
class ServerNotifier extends EventEmitter {

	notify(event: EventType, ...args: any[]): boolean {
		return this.emit(event.toString(), args);
	}
}


class BPMNServer implements IBPMNServer  {

	configuration;
	dataStore;
	logger;

	constructor(configuration, logger =null) {
		this.configuration = configuration;
		if (logger == null) {
			logger = new DefaultLogger({});
        }
		this.dataStore = new DataStore(configuration, logger);
		this.logger = logger;
		this.logger.log("new Server");
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
//		let items = Timer.getDueTimers(this.definitions, this.configuration);
//		items.forEach(timer => {
//		});
	}
	//	is called to start all instances that were shutdown
	async restart() {
		this.logger.log("Restarting..");
		let list = await this.findInstances({ endAt: null });
		let self = this;
		let i;
		for (i = 0; i < list.length; i++) {
			let instance = list[i];
			self.logger.log("..restoring instance " + instance.id);
			await self.restore(instance.id);
			self.logger.log("..count :" + CacheManager.getList().length);
        }
		
    }
	//	shutsdown all instances that are still live
	async shutdown() {

		this.logger.log("Shutdown..");
		let instannces = CacheManager.liveInstances;
		let i = 0;
		let list = [];
		instannces.forEach(item => { list.push(item); });
		for (i = 0; i < list.length; i++) {

			let engine = list[i].engine;
			await engine.stop();
			this.logger.log("shutdown engine " + engine.name + " status : " + engine.state);
			instannces.delete(list[i].instance.id);
        }
	}
	async execute(name:any,
		user: any,
		data:any = {},
		source: string = null,
		engineClassPath:string  = this.configuration.engineClassPath,
		callback: any = null,
		services: any = null,
		extensions: any = null) : Promise<IContext>  {

		let context = new ServerContext(this.configuration, user, this.logger);

		let processor= new Processor(context, this.dataStore);

		context = await processor.execute(name, data, source, engineClassPath, callback ,services, extensions);

		return context;


	}
	async restore(instanceId,
		callback = null) : Promise<IContext> {

		let context = new ServerContext(this.configuration, null , this.logger);
		let processor = new Processor(context, this.dataStore);

		context = await processor.restore(instanceId, callback);

		return context;

	}
	async invoke(itemQuery,
		user,
		data = {},
		callback: any = null) :Promise<IContext> {

		let context = new ServerContext(this.configuration, null, this.logger);
		let processor = new Processor(context, this.dataStore);

		context = await processor.invoke(itemQuery, user, data, callback);

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
