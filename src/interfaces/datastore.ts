import { IExecution, ILogger,  IDefinition, IConfiguration, IInstanceData } from './';
import { IBpmnModelData, IItemData, IEventData } from './';
import { EventEmitter } from 'events';
import { BPMNServer } from '../server';

interface IDataStore {
    dbConfiguration: any;
    db: any;
    logger: any;
    locker: any;
    save(instance:any,options:any): Promise<void>;
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
}

interface IModelsDatastore {
    get(query): Promise<object[]>;
    getList(query): Promise<string[]>;
    getSource(name: any,owner): Promise<string>;
    getSVG(name: any,owner): Promise<string>;
    save(name: any, bpmn: any, svg?: any,owner?): Promise<boolean>;

    load(name: any,owner): Promise<IDefinition>;
    loadModel(name: any,owner): Promise<IBpmnModelData>;
    findEvents(query: any,owner): Promise<any[]>;

    install(); 
    import(data);

    saveModel(model: IBpmnModelData): Promise<boolean>;
    deleteModel(name: any,owner): Promise<void>;
    renameModel(name: any,newName: any,owner): Promise<boolean>;
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