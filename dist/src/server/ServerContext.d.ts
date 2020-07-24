import { IExecution, Cron, CacheManager, IItem, IInstanceData, IEngine, IBPMNServer, IExecutionContext } from "../..";
/**
 * super class for various objects that are part of the server
 * */
declare class ServerComponent {
    server: any;
    constructor(server: IBPMNServer);
    get configuration(): any;
    get logger(): any;
    get dataStore(): any;
    get engine(): IEngine;
    get cron(): Cron;
    get cache(): CacheManager;
    get definitions(): any;
    get appDelegate(): any;
}
declare class ExecutionContext extends ServerComponent implements IExecutionContext {
    execution?: IExecution;
    logger: any;
    listener: any;
    dataStore: any;
    errors: any;
    parentContext?: IExecutionContext;
    process: any;
    item: any;
    input: any;
    output: any;
    messageMatchingKey: any;
    error(error: any): IExecutionContext;
    get instance(): IInstanceData;
    constructor(server: IBPMNServer, parentContext?: IExecutionContext);
    get items(): IItem[];
}
export { ServerComponent, ExecutionContext };
