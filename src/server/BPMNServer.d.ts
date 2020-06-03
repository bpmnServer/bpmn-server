import { Logger } from '../common/Logger';
import { Execution, Item } from '../engine';
import { Definition } from '../elements/Definition';
declare class ServerContext {
    instance?: Execution;
    logger: Logger;
    serverListener?: any;
    configuration: any;
    itemsProcessed: Item[];
    message?: string;
    user: string;
    error?: any;
    constructor(configuration: any, user: any, logger?: any);
}
declare class BPMNServer {
    configuration: any;
    logger: any;
    dataStore: any;
    /**
     * Server Constructor
     *
     * @param configuration	see
     * @param logger
     */
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
    loadDefinition(name: any, source?: any): Promise<Definition>;
    execute(name: any, user: any, data?: any, source?: string, engineClassPath?: string, callback?: any, services?: any, extensions?: any): Promise<ServerContext>;
    restore(instanceId: any, callback?: any): Promise<ServerContext>;
    invoke(itemId: any, user: any, data?: {}): Promise<ServerContext>;
    findItems(query: any): Promise<any>;
    findInstances(query: any, view?: string): Promise<any>;
    deleteData(instanceId?: any): Promise<any>;
}
export { BPMNServer };
