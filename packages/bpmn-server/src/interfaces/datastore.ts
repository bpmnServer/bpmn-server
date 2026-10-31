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
    /** Releases the store's connections. */
    close?(): Promise<void>;
    loadInstance(instanceId: any,options:any): Promise<{
        instance: any;
        items: any[];
    }>;
    findItem(query: any): Promise<IItemData>;
    findInstance(query: any, options: any): Promise<IInstanceData>;
    findInstances(query: any, option: 'summary' | 'full'|any): Promise<IInstanceData[]>;
    findItems(query: any): Promise<IItemData[]>;
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
    save(name: any, bpmn: any, svg?: any,owner?): Promise<boolean>;

    load(name: any,owner?): Promise<IDefinition>;
    loadModel(name: any,owner?): Promise<IBpmnModelData>;
    findEvents(query: any,owner?): Promise<any[]>;
    rebuild(model?: any): Promise<void>

    install(); 
    import(data);
    saveModel(model: IBpmnModelData): Promise<boolean>;
    deleteModel(name: any,owner?): Promise<void>;
    renameModel(name: any,newName: any,owner?): Promise<boolean>;
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