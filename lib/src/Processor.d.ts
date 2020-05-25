import { WFInstance } from "./WFInstance";
import { EventType, ILogger } from "./API";
/**
 * is invoked when the server is invoked for execute/invoke
 * */
declare class Processor implements ILogger {
    context: any;
    dataStore: any;
    engine: any;
    instance: any;
    events: any[];
    logger: any;
    logStart: number;
    constructor(context: any, dataStore: any);
    setOptions(options: any): any;
    log(msg: any): void;
    debug(msg: any): void;
    error(msg: any): void;
    clear(): any;
    result(): any;
    notify(event: EventType, ...args: any[]): void;
    /**
     * execute
     */
    execute(name: any, data: any, source: any, engineClassPath: any, callback: any, services: any, extensions: any): Promise<any>;
    /**
     * start a new process from source
     *
     * @param param0
     */
    private start;
    /**
     * restore an existing instance
     * @param instanceId to be restored
     * @param callback
     */
    restore(instanceId: any, callback: any): Promise<any>;
    /**
     * invoke an item in an existing instance; either currently running in cache or to be restored
     *
     * @param itemQuery
     * @param data
     * @param callback
     */
    invoke(itemQuery: any, user: any, data: any, callback: any): Promise<any>;
    invokeItem(invokingItem: any, user: any, itemData: any): Promise<any>;
    loadEngineClass(path: any): any;
    loadInstance(instanceId: any): Promise<WFInstance>;
    findItemToInvoke(itemQuery: any): Promise<any>;
    checkForSave(): Promise<void>;
    save(): Promise<void>;
    ended(): Promise<void>;
    setListener(listener: any, engine: any): void;
    recordEvent(event: any, task: any): void;
    trackTask(task: any, event: any): Promise<void>;
    getFields(taskId: any): Promise<any>;
}
export { Processor };
