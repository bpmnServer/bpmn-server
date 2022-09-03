
import { Logger } from '../common/Logger';

import { ServerComponent} from './ServerComponent';
import { Engine } from '.';

import { EXECUTION_EVENT, ICacheManager, IExecution } from '../interfaces';

const fs = require('fs');


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
	//	is called to start all instances that were shutdown
	async restart() {
		this.logger.log("Restarting..");
		const list = await this.dataStore.findInstances({ endAt: null });
		const self = this;

		const engine = new Engine(this.server);
		let i;
		for (i = 0; i < list.length; i++) {
			const instance = list[i];
			self.logger.log("..restoring instance " + instance.id);
			await engine.restore({ "id": instance.id });
			self.logger.log("..count :" + this.cache.list().length);
		}

	}
}
export { CacheManager};
