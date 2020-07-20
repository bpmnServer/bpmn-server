import { IExecution, Cron, CacheManager, IItem,  IInstanceData, IEngine, IBPMNServer, IExecutionContext } from "../..";
//import { IModelsDatastore, IDataStore, IServerContext} from "../..";


/**
 * super class for various objects that are part of the server
 * */
class ServerComponent {
	server;
	constructor(server: IBPMNServer) {
		this.server = server;
	}
	get configuration() { return this.server.configuration; }
	get logger() { return this.server.logger; }
	get dataStore() { return this.server.dataStore; }
	get engine(): IEngine { return this.server.engine; };
	get cron(): Cron { return this.server.cron; };
	get cache(): CacheManager { return this.server.cache; };
	get definitions() { return this.server.definitions; }
	get appDelegate() { return this.server.appDelegate; }
}

class ExecutionContext extends ServerComponent implements IExecutionContext {
	execution?: IExecution;
	logger;
	listener;
	dataStore;
	errors;
	// scope
	parentContext?: IExecutionContext;
	process;
	item;
	input;
	output;
	messageMatchingKey;

	error(error): IExecutionContext {
		return this;
    }
	get instance(): IInstanceData {
		if (this.execution)
			return this.execution.getState();
	}
	constructor(server: IBPMNServer,parentContext: IExecutionContext =null) {
		super(server);
		this.parentContext = parentContext;
//		this.errors = [];
    }
	get items() : IItem[] {
		if (this.execution)
			return this.execution.getItems();
	}
}

export { ServerComponent ,  ExecutionContext }