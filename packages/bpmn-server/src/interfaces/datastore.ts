import type { IInstanceData } from './DataObjects.js';
import type { IDefinition } from './elements.js';
import type { IDocumentStore, ILockManager } from './storage.js';
import type { IBpmnModelData, IItemData, IEventData } from './DataObjects.js';

export interface FindParams {
	filter?: Record<string, any>;
	after?: string;
	limit?: number;
	sort?: Record<string, 1 | -1>;
	projection?: Record<string, 0 | 1| any>;
  lastItem?: Record<string, any>;
  latestItem?: Record<string, any>;
  getTotalCount?: boolean; // if true, return total count of items in the result set
  }
  
  export interface FindResult<T = any> {
	data?: any[];
	nextCursor?: string | null;
  totalCount?: number;
	error?: string;
  }

interface IDataStore {
    /** @deprecated MongoDB's settings, for code written against the MongoDB data store; engine code does not read it. */
    dbConfiguration?: any;
    /** @deprecated The data store's storage adapter; engine code uses the operations below. */
    db?: IDocumentStore | any;
    logger: any;
    /** The data store's own lock adapter; the engine uses the server's (`server.locker`), which is this one unless the configuration supplies another. */
    locker: ILockManager;
    save(instance:any,options:any): Promise<void>;
    saveInstance(instance:any,options?:any): Promise<void>;
    /** Replaces a saved instance's definition source (upgrading it to a newer model); the caller holds the instance's lock. */
    updateInstanceSource(instanceId: string, source: string): Promise<void>;
    /** Marks a saved instance with a tag of the caller's, which the engine's saves leave as it is. */
    tagInstance(instanceId: string, tag: any): Promise<void>;
    /** Releases the store's connections. */
    close?(): Promise<void>;
    loadInstance(instanceId: any,options:any): Promise<{
        instance: any;
        items: any[];
    }>;
    findItem(query: any): Promise<IItemData>;
    findInstance(query: any, options: any): Promise<IInstanceData>;
    findInstances(query: any, option: 'summary' | 'full'|any): Promise<IInstanceData[]>;
    /** `lean`: each item's instance read without its data, tokens and logs (`data` and `instanceData` absent): for lists. */
    findItems(query: any, options?: { lean?: boolean }): Promise<IItemData[]>;
    /** How many instances match `query`. */
    countInstances(query: any): Promise<number>;
    /** Every document the data store keeps, by collection name: for a backup. */
    backup?(): Promise<Record<string, any[]>>;
    deleteInstances(query?: any): Promise<void>;
    install(); 
    archive(query);
    find(FindParams) : Promise<FindResult>;
}

interface IModelsDatastore {
    get(query): Promise<object[]>;
    getList(query): Promise<string[]>;
    getSource(name: any,owner?): Promise<string>;
    getSVG(name: any,owner?): Promise<string>;
    /** `savedBy`: who saves it, kept in the model's history (files-based datastores) */
    save(name: any, bpmn: any, svg?: any,owner?, savedBy?: string): Promise<boolean>;

    load(name: any,owner?): Promise<IDefinition>;
    loadModel(name: any,owner?): Promise<IBpmnModelData>;
    findEvents(query: any,owner?): Promise<any[]>;
    rebuild(model?: any): Promise<void>
    /** Every document the models datastore keeps, by collection name: for a backup. */
    backup?(): Promise<Record<string, any[]>>;

    install();
    import(data);
    saveModel(model: IBpmnModelData): Promise<boolean>;
    deleteModel(name: any,owner?): Promise<void>;
    renameModel(name: any,newName: any,owner?): Promise<boolean>;
    /** A model's saved versions, newest first (files-based datastores: ModelHistory). */
    history?(name: string): Promise<{ version: number; savedAt: string; savedBy?: string; size: number }[]>;
    /** A saved version of a model, or null. */
    historySource?(name: string, version: number): Promise<string | null>;
    /** Removes one saved version of a model; false when there is none. */
    deleteVersion?(name: string, version: number): Promise<boolean>;
    /** Removes a model's history; returns how many versions it had. */
    purgeHistory?(name: string): Promise<number>;
}


class EventData implements IEventData  {
    elementId;
    type;
    subType;
    name;
    processId;
    signalId;
    messageId;
    // timer info
    expression;
    expressionFormat; // cron/iso
    referenceDateTime; //        start time of event   or last time timer ran
    maxRepeat;
    repeatCount;
    timeDue?: Date;
}


export {  IDataStore  , IModelsDatastore  }