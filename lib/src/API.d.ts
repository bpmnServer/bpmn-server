/// <reference types="node" />
import { EventEmitter } from 'events';
/**
 *  Entry point for the API
 *  Presistence:    None
 *  Scope:  as desired
 * */
interface IBPMNServer {
    execute(name: any, user: any, data?: any, source?: string, engineClassPath?: any, callback?: any, services?: any, extensions?: any): Promise<IContext>;
    invoke(itemQuery: any, user: any, data?: any, callback?: any): Promise<IContext>;
    restore(instanceId: any, callback?: any): Promise<IContext>;
}
/**
 * Provides a logging mechanism
 * also holds logs if needed
 * Presistence:    not in its own, but Instances may hold the logs
 * Scope:   as desired , but usually per transaction
 *
 * */
interface ILogger {
    setOptions({}: {}): any;
    log(msg: any): any;
    debug(msg: any): any;
    error(msg: any): any;
    clear(): any;
    save(file: string): any;
}
/**
 * Provides a environemnt information
 *
 * Presistence:    In js file
 * Scope:   Entire Application, except otherwise defined
 *
 * */
interface IConfiguration {
}
/**
 * various information defining the work context
 *
 * Presistence:    No
 * Scope:   as desired , but usually per transaction
 *
 * */
interface IContext {
    instance?: IInstance;
    engine?: any;
    events?: any;
    logger: ILogger;
    serverListener?: any;
    configuration: IConfiguration;
    notifier: any;
    itemsProcessed: IInstanceItem[];
    message?: string;
    user: string;
    error?: any;
}
/**
 * Manages Caching of Workflow
 *
 * Presistence:    It is the presistence engine for the workflow
 * Scope:   entire App
 *
 * */
interface ICacheManager {
    clear(): any;
    load(conditon: any): any;
    list(): IInstance[];
    get(id: any): IInstance;
    remove(id: any): any;
    add(instnace: IInstance): any;
}
/**
 * A representation of the BPMN Element for the Instance
 *
 * Presistence:    Yes
 * Scope:          part of instance
 *
 * */
interface IInstanceItem {
    id: any;
    taskId: any;
    name: any;
    startAt: any;
    endAt: any;
    getAPIUrl(): string;
}
/**
 * A Presentation of the Workflow Instance, is created everytime a process starts
 *
 * Presistence:    Yes
 * Scope:           -
 *
 * */
interface IInstance {
    id: any;
    name: any;
    status: any;
    startAt: any;
    endAt: any;
    data: any;
    state: any;
    lastAt: any;
    lastItem: any;
    lastStatus: any;
    items: any;
    logs: any;
    engineClassPath: any;
    getItems({}: {}): IInstanceItem[];
}
/**
 * A Model Store, providing access to Workflow Definitions
 *
 * Presistence:    Is a Presistence Provider for Model
 * Scope:          Entire App
 *
 * Implemetation:   Currently is working form files ,but can be easily support MongoDB
 *
 * */
interface IModelsDatastore {
    getList(): string[];
    save(name: any, bpmn: any, svg?: any): boolean;
    getSource(name: any): string;
    getSVG(name: any): string;
}
/**
 * A Instance Data Store, providing access to Workflow instances and activities
 *
 * Presistence:    Is a Presistence Provider for workflow
 * Scope:          Entire App
 *
 * */
interface IDataStore {
    findItem(query: any): any;
    findItems(query: any): any;
    findInstances(query: any, option: 'summary' | 'full' | 'withState'): any;
    findInstance(query: any, option: 'summary' | 'full' | 'withState'): any;
    deleteData(instanceId?: any): any;
    saveInstance(instance: IInstance): any;
}
declare enum EventType {
    Server_start = "Server_start",
    Server_shutdown = "Server_shutdown",
    Engine_create = "Engine_create",
    Engine_recover = "Engine_recover",
    Engine_start = "Engine_start",
    Engine_resume = "Engine_resume",
    Engine_idle = "Engine_idle",
    Instance_create = "Instance_create",
    Instance_load = "Instance_load",
    Instance_modify = "Instance_modify",
    Instance_idle = "Instance_idle",
    Instance_save = "Instance_save",
    Item_invoke = "Item_invoke",
    Item_add = "Item_add",
    Item_modify = "Item_modify",
    Item_save = "Item_save",
    Process_start = "Process_start",
    Process_end = "Process_end",
    Activity_enter = "enter",
    Activity_start = "start",
    Activity_wait = "wait",
    Activity_timer = "timer",
    Activity_end = "end",
    Flow_take = "take",
    Flow_discard = "discard"
}
interface IEngine {
    create(BpmnCreateOptions: any): any;
    execute(BpmnExecuteOptions: any): any;
    invoke(task: any, data: any): any;
    stop(): any;
    resume(listener: any, callback: any): any;
    getState(): any;
    recover(state: any): any;
    getImplemntingEngine(): any;
    getModdleOptions(): any;
    getServices(): any;
    getExtensions(): any;
}
interface BpmnCreateOptions {
    name?: string;
    id?: string;
    source?: string;
    variables?: any;
    Logger?: any;
    scripts?: any;
    listener?: EventEmitter;
    services?: {
        [name: string]: Function;
    };
    elements?: any;
    typeResolver?: <R>(...elements: any) => R;
    moddleOptions?: any;
    extensions?: any;
}
interface BpmnExecutionOptions {
    variables?: any;
    listener?: EventEmitter;
    services?: {
        [name: string]: Function;
    };
    extensions?: any;
    Logger?: any;
    callback?: any;
}
export { IEngine, BpmnCreateOptions, BpmnExecutionOptions, EventType, IContext, IDataStore, IModelsDatastore, IBPMNServer, ILogger, ICacheManager, IConfiguration, IInstance, IInstanceItem };
