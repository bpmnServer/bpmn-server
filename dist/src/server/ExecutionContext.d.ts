import { ServerComponent } from "./";
import { IExecution, IItem, IInstanceData, IBPMNServer, IExecutionContext } from "../interfaces";
declare class ExecutionContext extends ServerComponent implements IExecutionContext {
    execution?: IExecution;
    errors: any;
    parentContext?: IExecutionContext;
    process: any;
    item: any;
    input: any;
    output: any;
    messageMatchingKey: any;
    worker: any;
    listener: any;
    tillDone(): Promise<this>;
    error(error: any): IExecutionContext;
    get instance(): IInstanceData;
    constructor(server: IBPMNServer, parentContext?: IExecutionContext);
    get items(): IItem[];
}
export { ExecutionContext };
