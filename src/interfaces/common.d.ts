import { IItem, IModelsDatastore, IDataStore } from '../..';
interface IConfiguration {
    definitionsPath: string;
    templatesPath: string;
    timers: {
        forceTimersDelay: number;
        precision: number;
    };
    database: {
        MongoDB: {
            db_url: string;
            db: string;
        };
    };
    apiKey: string;
    logger: ILogger;
    definitions(server: any): IModelsDatastore;
    appDelegate(server: any): IAppDelegate;
    dataStore(server: any): IDataStore;
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
    debug(message: any): void;
    warn(message: any): void;
    log(message: any): void;
    error(err: any): void;
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
    moddleOptions: any;
    servicesProvider: any;
    sendEmail(to: any, msg: any, body: any): any;
    executionStarted(execution: any): any;
    messageThrown(signalId: any, data: any, messageMatchingKey: any, item: IItem): any;
    signalThrown(signalId: any, data: any, messageMatchingKey: any, item: IItem): any;
    /**
     *
     * is called when an event throws a message that can not be answered by another process
     *
     * @param messageId
     * @param data
     */
    issueMessage(messageId: any, data: any): any;
    issueSignal(messageId: any, data: any): any;
    /**
     * is called only if the serviceTask has no implementation; otherwise the specified implementation will be called.
     *
     * @param item
     */
    serviceCalled(serviceName: any, data: any, item: IItem): any;
    scopeEval(scope: any, script: any): any;
    scopeJS(scope: any, script: any): any;
}
export { ILogger, IAppDelegate, IConfiguration };
