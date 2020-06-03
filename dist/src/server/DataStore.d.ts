import { Execution } from '../engine/Execution';
import { Logger } from '../common/Logger';
declare class DataStore {
    dbConfiguration: any;
    db: any;
    logger: any;
    execution: Execution;
    isModified: boolean;
    isRunning: boolean;
    inSaving: boolean;
    promises: any[];
    constructor(configuration: any, logger: Logger);
    monitorExecution(execution: Execution): void;
    setListener(listener: any): void;
    saveCounter: number;
    save(): Promise<void>;
    check(): Promise<void>;
    loadInstance(instanceId: any): Promise<{
        instance: any;
        items: any[];
    }>;
    private getItemsFromInstances;
    saveInstance(instance: any, items: any): Promise<void>;
    findItem(query: any): Promise<any>;
    findInstance(query: any, options: any): Promise<any>;
    findInstances(query: any, option?: 'summary' | 'full' | 'withState'): Promise<any>;
    findItems(query: any): Promise<any[]>;
    deleteData(instanceId?: any): Promise<void>;
}
export { DataStore };
