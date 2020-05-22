
//
//-----------------------------------------------------------

import { Processor } from "./Processor";

class CacheManager
{
	static liveInstances = new Map();

	static getList() {
		let items = [];
		CacheManager.liveInstances.forEach(item => { items.push(item); });
		return items;

	}
	/**
	**/
	static getInstance(instanceId) {
		let instance = CacheManager.liveInstances.get(instanceId);
		return instance;
	}

	static add(instance,engine) {

		CacheManager.liveInstances.set(instance.id, { instance, engine });
    }
	static remove(instanceId) {
		CacheManager.liveInstances.delete(instanceId);
	}
}

export { CacheManager };