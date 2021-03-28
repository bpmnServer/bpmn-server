import { ServerComponent } from "./";
import { IExecution, IItem, IInstanceData, IBPMNServer, IExecutionContext } from "../interfaces";
import { EventEmitter } from "events";


class ExecutionContext extends ServerComponent implements IExecutionContext {
	execution?: IExecution;
	errors;
	// scope
	parentContext?: IExecutionContext;
	process;
	item;
	input;
	output;
	messageMatchingKey;
	worker;
	listener;

	async tillDone() {
		const res = await this.worker;
		return this;
    }
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
		this.listener = new EventEmitter();
    }
	get items() : IItem[] {
		if (this.execution)
			return this.execution.getItems();
	}
}

export { ExecutionContext }