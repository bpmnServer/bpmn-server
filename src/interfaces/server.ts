import { IExecution , ILogger , IItemData , IDefinition, IConfiguration } from '../..';
import { EventEmitter } from 'events';
import { BPMNServer } from '../server';

interface IDataStore {
    dbConfiguration: any;
    db: any;
    logger: any;
    execution: IExecution;
    isModified: boolean;
    isRunning: boolean;
    inSaving: boolean;
    promises: any[];
    monitorExecution(execution: IExecution): void;
    setListener(listener: any): void;
    saveCounter: number;
    save(): Promise<void>;
    check(): Promise<void>;
    loadInstance(instanceId: any): Promise<{
        instance: any;
        items: any[];
    }>;
    saveInstance(instance: any, items: any): Promise<void>;
    findItem(query: any): Promise<any>;
    findInstance(query: any, options: any): Promise<any>;
    findInstances(query: any, option: 'summary' | 'full'): Promise<any>;
    /**
            * scenario:
            * itemId			{ items { id : value } }
            * itemKey			{ items {key: value } }
            * instance, task	{ instance: { id: instanceId }, items: { elementId: value }}
            * message			{ items: { messageId: nameofmessage, key: value } {}
            * status			{ items: {status: 'wait' } }
            * custom: { query: query, projection: projection }
            *
     *
     * @param query
     */
    findItems(query: any): Promise<any[]>;
    deleteData(instanceId?: any): Promise<void>;
}

/**
 * is used as a repsone to server request
 * */
interface IServerContext {
    configuration: any;
    logger;
    definitions;
    appDelegate;
    dataStore;
    eventsRegistry;
}

interface IBPMNServer {
    configuration: any;
    logger: any;
    dataStore: any;
    init(): Promise<void>;
    restart(): Promise<void>;
    shutdown(): Promise<void>;
    loadDefinition(name: any, source?: any): Promise<IDefinition>;
    findItems(query: any): Promise<any>;
    findInstances(query: any, view?: string): Promise<any>;
    deleteData(instanceId?: any): Promise<any>;
    findEvents(query);
    findEventById(signalId: string): any;
}

interface IModelsDatastore {
    definitionsPath: any;
    getList(): string[];
    getSource(name: any): string;
    getSVG(name: any): string;
    save(name: any, bpmn: any, svg?: any): boolean;
}

interface IEventData {
    _id: any;
    signalId?: string;
    timeDue?: Date;
    processName: string;
    elementId: string;
}


interface IEventsRegistry {
    configuration;
    addEvent(event: IEventData);
    deleteEvents(query);
}

interface IServerComponent {
    server;
    configuration;
    logger;
    dataStore;
    eventsRegistry;
    engine: any;
    cron: any;
    cache;
    definitions;
    appDelegate;
}


export { IBPMNServer ,IServerContext , IDataStore  , IModelsDatastore , IEventData, IEventsRegistry }