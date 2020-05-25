import { IBPMNServer } from './API';
import { IContext } from './API';
declare class BPMNServer implements IBPMNServer {
    configuration: any;
    dataStore: any;
    logger: any;
    constructor(configuration: any, logger?: any);
    /**
    **/
    static getLives(): any[];
    /**
    **/
    static getLive(instanceId: any): any;
    init(): Promise<void>;
    restart(): Promise<void>;
    shutdown(): Promise<void>;
    execute(name: any, user: any, data?: any, source?: string, engineClassPath?: string, callback?: any, services?: any, extensions?: any): Promise<IContext>;
    restore(instanceId: any, callback?: any): Promise<IContext>;
    invoke(itemQuery: any, user: any, data?: {}, callback?: any): Promise<IContext>;
    findItems(query: any): Promise<any>;
    findInstances(query: any, view?: string): Promise<any>;
    deleteData(instanceId?: any): Promise<any>;
}
export { BPMNServer };
