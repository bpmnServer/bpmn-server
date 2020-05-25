import { IDataStore } from './API';
declare class DataStore implements IDataStore {
    dbConfiguration: any;
    db: any;
    logger: any;
    constructor(configuration: any, logger: any);
    loadInstance(instanceId: any): Promise<{
        instance: any;
        items: any;
    }>;
    saveInstance(instance: any): Promise<void>;
    saveItems(instance: any, promises: any): Promise<void>;
    findItem(query: any): Promise<any>;
    findInstance(query: any, options: any): Promise<any>;
    findInstances(query: any, option?: 'summary' | 'full' | 'withState'): Promise<any>;
    findItems(query: any): Promise<any>;
    deleteData(instanceId?: any): Promise<void>;
}
export { DataStore };
