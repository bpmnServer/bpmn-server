import { Logger, ILogger, IAppDelegate, IExecution, Cron, CacheManager, DataStore, Item, IItem, IItemData, IInstanceData } from "../..";
import { IModelsDatastore, IDataStore, IEventsRegistry, IServerContext} from "../interfaces/server";
import { EventEmitter } from "events";
import { Engine } from "./Engine";
import { BPMNServer } from "./BPMNServer";

/**
 * super class for various objects that are part of the server
 * */
class ServerComponent {
	server;
	constructor(server: BPMNServer) {
		this.server = server;
	}
	get configuration() { return this.server.configuration; }
	get logger() { return this.server.logger; }
	get dataStore() { return this.server.dataStore; }
	get eventsRegistry() { return this.server.eventsRegistry; }
	get engine(): Engine { return this.server.engine; };
	get cron(): Cron { return this.server.cron; };
	get cache(): CacheManager { return this.server.cache; };
	get definitions() { return this.server.definitions; }
	get appDelegate() { return this.server.appDelegate; }
}

class ExecutionContext extends ServerComponent {
	execution?: IExecution;
	logger;
	listener;
	dataStore;
	errors;
	get items() : IItem[] {
		if (this.execution)
			return this.execution.getItems();
	}
	error(error) : ExecutionContext {
		this.errors.push(error);
		return this;
    }
}
class ExecutionResponse {
	constructor(execution: IExecution, errors = null) {
		if (execution) {
			this.instance = execution.getState();
			this.instance.source = undefined;
        }
		this.errors = errors;
    }
	instance: IInstanceData;
	get execution() { return this.instance;}
	errors;
	get items(): IItemData[] { return this.instance.items;}
}


export { ServerComponent ,  ExecutionContext , ExecutionResponse }