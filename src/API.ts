const { Engine } = require('bpmn-engine');
import { EventEmitter } from 'events';



/**
 *  Entry point for the API
 *  Presistence:    None
 *  Scope:  as desired
 * */
interface IBPMNServer {
    execute(
        name: any,
        user: any,
        data?: any,
        source?: string,
        engineClassPath?,
        callback?: any,
        services?: any ,
        extensions?: any): Promise<IContext>;

    invoke(
        itemQuery,
        user,
        data?,
        callback?): Promise<IContext>;

    restore(instanceId,
        callback?): Promise<IContext>;

}
/**
 * Provides a logging mechanism
 * also holds logs if needed
 * Presistence:    not in its own, but Instances may hold the logs
 * Scope:   as desired , but usually per transaction
 * 
 * */
interface ILogger {
    setOptions({ });
    log(msg);
    debug(msg);
    error(msg);
    clear();
    save(file: string);
}
/**
 * Provides a environemnt information
 * 
 * Presistence:    In js file
 * Scope:   Entire Application, except otherwise defined
 *
 * */

interface IConfiguration { }// plain java object
/**
 * various information defining the work context
 * 
 * Presistence:    No
 * Scope:   as desired , but usually per transaction
 *
 * */

interface IContext {
    instance?: IInstance;
    engine?;
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

    clear(); // removes all instances from cache
    load(conditon); //  load oustanding instanes into cache
    list(): IInstance[];     //  show list of current instnaces
    get(id): IInstance; // return the instnace from cache
    remove(id);

    //  private to package
    add(instnace: IInstance);
}

/**
 * A representation of the BPMN Element for the Instance
 * 
 * Presistence:    Yes
 * Scope:          part of instance
 *
 * */

interface IInstanceItem {
    id;
    taskId;
    name;
    startAt;
    endAt;

    //... more .. //

    getAPIUrl(): string;  // returns a unique string for callback
}


interface IInstanceRecord {
    id;
    name;
    //... more .. //

    findItems(query?): IInstanceItem[];

}

/**
 * A Presentation of the Workflow Instance, is created everytime a process starts
 * 
 * Presistence:    Yes
 * Scope:           -
 *
 * */

interface IInstance {
    id;
    name;
    status;
    startAt;
    endAt;
    data;
    state;
    lastAt;
    lastItem;
    lastStatus;
    items;
    logs;
    engineClassPath;

    getItems(): IInstanceItem[];

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
    save(name, bpmn, svg?): boolean;
    getSource(name): string;
    getSVG(name): string;
}
/**
 * A Instance Data Store, providing access to Workflow instances and activities
 *
 * Presistence:    Is a Presistence Provider for workflow
 * Scope:          Entire App
 *
 * */

interface IDataStore {
    findItem(query: any);
    findItems(query: any);
    findInstances(query: any, option: 'summary' | 'full' | 'withState');
    findInstance(query: any , option: 'summary' | 'full' | 'withState');
    deleteData(instanceId?);

    // private to package
    saveInstance(instance: IInstance);
}

    enum EventType {
        Server_start = 'Server_start',
        Server_shutdown = 'Server_shutdown',

        Engine_create = 'Engine_create',
        Engine_recover = 'Engine_recover',
        Engine_start = 'Engine_start',
        Engine_resume = 'Engine_resume',
        Engine_idle = 'Engine_idle',


        Instance_create = 'Instance_create',
        Instance_load = 'Instance_load',
        Instance_modify = 'Instance_modify',
        Instance_idle = 'Instance_idle',
        Instance_save = 'Instance_save',

        Item_invoke = 'Item_invoke',
        Item_add = 'Item_add',
        Item_modify = 'Item_modify',
        Item_save = 'Item_save',


        Process_start = 'Process_start',
        Process_end = 'Process_end',

        Activity_enter = 'enter',
        Activity_start = 'start',
        Activity_wait = 'wait',
        Activity_timer = 'timer',
        Activity_end = 'end',

        Flow_take = 'take',
        Flow_discard = 'discard'

    }

    interface IEngine {

        create(BpmnCreateOptions);
        execute(BpmnExecuteOptions);

        invoke(task, data)
        stop();
        resume(listener, callback);

        getState();
        recover(state);

        getImplemntingEngine();

        getModdleOptions();
        getServices();
        getExtensions();

    }


    /* from bpmn-engine.d.ts
     */

    interface BpmnCreateOptions {
        name?: string;
        id?: string;
        source?: string;
        variables?: any;

        Logger?: any;

        scripts?: any;

        listener?: EventEmitter;

        services?: { [name: string]: Function };

        elements?: any;

        typeResolver?: <R>(...elements: any) => R;
        moddleOptions?: any;
        extensions?: any;
    }

    /* end */

    interface BpmnExecutionOptions {
        variables?: any;
        listener?: EventEmitter;
        services?: { [name: string]: Function };
        extensions?: any;
        Logger?: any;
        callback?: any;
    }

    export {
        IEngine, BpmnCreateOptions,
        BpmnExecutionOptions, EventType,
        IContext, IDataStore, IModelsDatastore,
        IBPMNServer, ILogger, ICacheManager, IConfiguration,
        IInstance, IInstanceItem
    }
