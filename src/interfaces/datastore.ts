import { IExecution , ILogger , IItemData , IDefinition, IConfiguration } from '../..';
import { EventEmitter } from 'events';
import { BPMNServer } from '../server';

interface IDataStore {
    dbConfiguration: any;
    db: any;
    logger: any;
    execution: IExecution;
    monitorExecution(execution: IExecution): void;
    save(): Promise<void>;
    loadInstance(instanceId: any): Promise<{
        instance: any;
        items: any[];
    }>;
    findItem(query: any): Promise<any>;
    findInstance(query: any, options: any): Promise<any>;
    findInstances(query: any, option: 'summary' | 'full'): Promise<any>;
    /**
     * @param query
     */
    findItems(query: any): Promise<any[]>;
    deleteInstances(query?: any): Promise<void>;
    install(); 
}

interface IModelsDatastore {
    getList(): Promise<string[]>;
    getSource(name: any): Promise<string>;
    getSVG(name: any): Promise<string>;
    save(name: any, bpmn: any, svg?: any): Promise<boolean>;

    load(name: any): Promise<IDefinition>;
    loadModel(name: any): Promise<IBpmnModelData>;
    findEvents(query: any): Promise<any[]>;

    install(); 
    import(data);

    saveModel(model: IBpmnModelData): Promise<boolean>;
    deleteModel(name: any): Promise<void>;
    renameModel(name: any, newName: any): Promise<boolean>;
}

interface IEventData {
    elementId: string;
    processId: string;
    type;
    name;
    subType;
    signalId?: string;
    messageId?: string;
    timeDue?: Date;
}
class EventData implements IEventData  {
    elementId;
    type;
    subType;
    name;
    processId;
    signalId;
    messageId;
    timeDue;
}

interface IBpmnModelData {
    name;
    source;
    svg;
    processes: IProcessData[];
    events: IEventData[];
    saved;
    parse(definition: IDefinition);
}
interface IProcessData {
    id;
    name;
    isExecutable;
}


export {  IDataStore  , IModelsDatastore , IBpmnModelData , IProcessData , IEventData }