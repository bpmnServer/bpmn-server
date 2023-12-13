import {
    IExecution, IItem, NODE_ACTION, FLOW_ACTION, IModelsDatastore,
    IDataStore, ICacheManager,IUserService
} from '../';


interface IConfiguration 
{
    definitionsPath: string,
    templatesPath: string,
    timers: {
        forceTimersDelay: number,
        precision: number,
    },
    database: {
        MongoDB:
        {
            db_url: string,
            db: string,
        },
        loopbackRepositories?:any
    },
    apiKey: string,
    logger: ILogger,
    definitions(server): IModelsDatastore,
    appDelegate(server): IAppDelegate,
    dataStore(server): IDataStore,
    cacheManager(server): ICacheManager,
    userService(server): IUserService
}

/**
 * A logging tool to take various message for monitoring and debugging
 * 
 * it can also keep the message in memory till saved later through saveToFile
 * msgs can be cleared by the clean method
 * 
 * */
interface ILogger {
    /**
     * 
     * @param toConsole boolean 
     *  writes to the output console
     * @param toFile string 
     * writes to file
     *
     */

    setOptions({ toConsole, toFile, callback }: {
        toConsole: any;
        toFile: any;
        callback: any;
    }): void;
    clear(): void;
    get(): any[];
    debug(...message: any): void;
    warn(...message: any): void;
    log(...message: any): void;
    error(err: any): void;
    reportError(err: any): void;
    save(filename: any): Promise<void>;
}
/**
 *  Application Delegate Object to respond to various events and services:
 *  
 *  1.  receive all events from workflow
 *  2.  receive service calls
 *  3.  receive message and signal calls 
 *  4.  execute scripts 
 *  
 * */
interface IAppDelegate {
    moddleOptions;
    getServicesProvider(IExecution): any;       // to respond to all named services
    sendEmail(to, msg, body);
    executionStarted(execution);
    startUp(options); // start of server
    messageThrown(signalId, data, messageMatchingKey: any, item: IItem);
    signalThrown(signalId, data, messageMatchingKey: any, item: IItem);
    /**
     * 
     * is called when an event throws a message that can not be answered by another process
     * 
     * @param messageId
     * @param data
     */
    issueMessage(messageId, data);
    issueSignal(messageId, data);
    /**
     * is called only if the serviceTask has no implementation; otherwise the specified implementation will be called.
     * 
     * @param item
     */
    serviceCalled(serviceName,data,item: IItem);


}

export { ILogger ,IAppDelegate , IConfiguration }