import { ServerComponent} from './ServerComponent.js';
import { EXECUTION_EVENT } from '../interfaces/Enums.js';
import type { IExecution } from '../interfaces/engine.js';
import type { ICacheManager } from '../interfaces/server.js';

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
	private readonly liveInstances = new Map<string, IExecution>();
	/** Drops an ended or cancelled execution: nothing more runs in it. */
	private readonly onEnded = ({ context }) => { this.remove(context.instance.id); };

	constructor(server)  {
		super(server);
		server.listener.on(EXECUTION_EVENT.process_end, this.onEnded);
		server.listener.on(EXECUTION_EVENT.process_terminated, this.onEnded);
    }

	list() {
		const items = [];
		this.liveInstances.forEach(item => { items.push(item); });
		return items;

	}
	/**
	**/
	getInstance(instanceId) {

		const instance = this.liveInstances.get(instanceId);
		return instance;
	}

	add(execution:IExecution) {

		this.liveInstances.set(execution.id, execution);
	}
	remove(instanceId) {
		this.liveInstances.delete(instanceId);
	}
	/** Clear only this server's cached executions. */
	async shutdown() {
		this.logger.log('Shutdown execution cache');
		this.liveInstances.clear();
		this.server.listener.off(EXECUTION_EVENT.process_end, this.onEnded);
		this.server.listener.off(EXECUTION_EVENT.process_terminated, this.onEnded);
	}

}
export { CacheManager , NoCacheManager};
