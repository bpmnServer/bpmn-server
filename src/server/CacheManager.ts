import { ServerComponent} from './ServerComponent';
import { EXECUTION_EVENT, ICacheManager, IExecution } from '../interfaces';

class NoCacheManager extends ServerComponent implements ICacheManager {

	constructor(server)  {
		super(server);
    }

	list() {return  [];	}
	/**
	**/
	getInstance(instanceId) {	return null; }

	add(execution:IExecution) { return null; }
	remove(instanceId) {return null;	}
	//	shutsdown all instances that are still live
	shutdown() {	}
	restart() {		}
}

class CacheManager extends ServerComponent implements ICacheManager {
	static liveInstances = new Map();

	constructor(server)  {
		super(server);

		var self = this;
		server.listener.on(EXECUTION_EVENT.process_end,
			function ({ context, event, }) {
//				console.log(`--->Cache Event: ${event} Removing Instance:`, context.instance.id);
				self.remove(context.instance.id);
			});

    }

	list() {
		const items = [];
		CacheManager.liveInstances.forEach(item => { items.push(item); });
		return items;

	}
	/**
	**/
	getInstance(instanceId) {

		const instance = CacheManager.liveInstances.get(instanceId);
		return instance;
	}

	add(execution:IExecution) {

		CacheManager.liveInstances.set(execution.id, execution);
	}
	remove(instanceId) {
		CacheManager.liveInstances.delete(instanceId);
	}
	//	shutsdown all instances that are still live
	async shutdown() {

		this.logger.log("Shutdown..");
		const instances = CacheManager.liveInstances;
		let i = 0;
		const list = [];
		instances.forEach(item => { list.push(item); });
		for (i = 0; i < list.length; i++) {

			const engine = list[i];
			//await engine.stop();
			this.logger.log("shutdown engine " + engine.execution.name + " status : " + engine.execution.state);
			instances.delete(list[i].execution.id);
		}
	}
}
export { CacheManager , NoCacheManager};
