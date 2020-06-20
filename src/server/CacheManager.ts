
import { Logger } from '../common/Logger';

import { ServerComponent} from './ServerContext';
import { ExecutionContext } from '.';

const fs = require('fs');


class CacheManager extends ServerComponent {
	static liveInstances = new Map();

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

	add(executionContext:ExecutionContext) {

		CacheManager.liveInstances.set(executionContext.execution.id, executionContext);
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
		let i;
		for (i = 0; i < list.length; i++) {
			const instance = list[i];
			self.logger.log("..restoring instance " + instance.id);
			await self.engine.restore({ "id": instance.id });
			self.logger.log("..count :" + this.cache.list().length);
		}

	}
}
export { CacheManager};
