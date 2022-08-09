import { IExecution, IDefinition } from './';
import { IBpmnModelData } from './';
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
    install(): any;
}
interface IModelsDatastore {
    getList(): Promise<string[]>;
    getSource(name: any): Promise<string>;
    getSVG(name: any): Promise<string>;
    save(name: any, bpmn: any, svg?: any): Promise<boolean>;
    load(name: any): Promise<IDefinition>;
    loadModel(name: any): Promise<IBpmnModelData>;
    findEvents(query: any): Promise<any[]>;
    install(): any;
    import(data: any): any;
    saveModel(model: IBpmnModelData): Promise<boolean>;
    deleteModel(name: any): Promise<void>;
    renameModel(name: any, newName: any): Promise<boolean>;
}
export { IDataStore, IModelsDatastore };
