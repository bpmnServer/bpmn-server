import { Execution } from '../engine/Execution';
import { IDataStore, IBPMNServer, IInstanceData } from '../interfaces';
import { ServerComponent } from '../server/ServerComponent';
declare class DataStore extends ServerComponent implements IDataStore {
    dbConfiguration: any;
    db: any;
    execution: Execution;
    isModified: boolean;
    isRunning: boolean;
    inSaving: boolean;
    promises: any[];
    constructor(server: IBPMNServer);
    monitorExecution(execution: Execution): void;
    private setListener;
    saveCounter: number;
    save(): Promise<void>;
    check(event: any, item: any): Promise<number>;
    loadInstance(instanceId: any): Promise<{
        instance: any;
        items: any[];
    }>;
    private getItemsFromInstances;
    static seq: number;
    private saveInstance;
    findItem(query: any): Promise<any>;
    findInstance(query: any, options: any): Promise<IInstanceData>;
    convertObj(obj: any, cls: any): any;
    convertColl(coll: any, cls: any): void;
    findInstances(query: any, option?: 'summary' | 'full' | any): Promise<any>;
    /**
            * scenario:
            * itemId			{ items { id : value } }
            * itemKey			{ items {key: value } }
            * instance, task	{ instance: { id: instanceId }, items: { elementId: value }}
            * message			{ items: { messageId: nameofmessage, key: value } {}
            * status			{ items: {status: 'wait' } }
            * custom: { query: query, projection: projection }

    New approach:
        just like MongoDB
            * itemId			{ items { id : value } }
            * itemKey			{ items {key: value } }
            * instance, task	{  id: instanceId , items.elementId: value }
            * message			{ items.messageId: nameofmessage, key: value } {}
            * status			{ items.status: 'wait' } }
            * custom: { query: query, projection: projection }

     Problem with Mongodb:	projection $elematch returns only the first record
     *
     * @param query
     */
    findItems(query: any): Promise<any[]>;
    private translateCriteria;
    private translateCriteria2;
    deleteInstances(query: any): Promise<any>;
    /**
     * first time installation of DB
     *
     * creates a new collection and add an index
     *
     * */
    install(): Promise<any>;
}
export { DataStore };
