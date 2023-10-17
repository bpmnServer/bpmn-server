import { IDefinition } from './';
import { IBpmnModelData } from './';
interface IDataStore {
    dbConfiguration: any;
    db: any;
    logger: any;
    save(instance: any): Promise<void>;
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
    getList(query: any): Promise<string[]>;
    getSource(name: any, owner: any): Promise<string>;
    getSVG(name: any, owner: any): Promise<string>;
    save(name: any, bpmn: any, svg?: any, owner?: any): Promise<boolean>;
    load(name: any, owner: any): Promise<IDefinition>;
    loadModel(name: any, owner: any): Promise<IBpmnModelData>;
    findEvents(query: any, owner: any): Promise<any[]>;
    install(): any;
    import(data: any): any;
    saveModel(model: IBpmnModelData): Promise<boolean>;
    deleteModel(name: any, owner: any): Promise<void>;
    renameModel(name: any, newName: any, owner: any): Promise<boolean>;
}
export { IDataStore, IModelsDatastore };
