import { IInstanceData, IItemData, IDefinitionData } from './interfaces/DataObjects.js';
import { WebService } from './WebService.js';
declare class BPMNClient2 extends WebService {
    host: any;
    port: any;
    apiKey: any;
    /** Key of the server's administration API (ADMIN_API_KEY), for model administration. */
    adminApiKey: any;
    engine: ClientEngine2;
    data: ClientData2;
    model: ClientModel2;
    /**
     * @param apiKey   the server's API_KEY
     * @param options  adminApiKey: the server's ADMIN_API_KEY; model administration is served under
     *                 /admin/api2 with it (defaults to apiKey)
     */
    constructor(host: any, port: any, apiKey: any, options?: {
        adminApiKey?: string;
    });
    get(url: any, params: any): Promise<any>;
    post(url: any, params: any): Promise<any>;
    put(url: any, params: any): Promise<any>;
    /** A call to the administration API (/admin/...), with the admin key. */
    admin(url: any, method: any, params?: {}): Promise<any>;
    del(url: any, params: any): Promise<any>;
    request(url: any, method: any, params: any, admin?: boolean): Promise<any>;
}
declare class ClientEngine2 {
    private client;
    constructor(client: any);
    start(name: any, data: {}, user: any, options?: {}): Promise<IInstanceData>;
    invoke(query: any, data: any, user: any, options?: {}): Promise<IInstanceData>;
    assign(query: any, data: any, assignment: any, user: any): Promise<IInstanceData>;
    throwMessage(messageId: any, data: {}, messageMatchingKey: {}, user: any, options: any): Promise<any>;
    throwSignal(signalId: any, data: {}, messageMatchingKey: {}, user: any, options: any): Promise<any>;
}
declare class ClientData2 {
    private client;
    constructor(client: any);
    find({ filter, sort, limit, after, projection, lastItem, latestItem, getTotalCount, user }: {
        filter?: Record<string, any>;
        after?: string;
        limit?: number;
        sort?: Record<string, 1 | -1>;
        projection?: Record<string, 0 | 1 | any>;
        lastItem?: Record<string, any>;
        latestItem?: Record<string, any>;
        getTotalCount?: boolean;
        user?: string;
    }): Promise<{
        data?: any[];
        nextCursor?: string | null;
        totalCount?: number;
        error?: string;
    }>;
    findItems(query: any, user: any): Promise<IItemData[]>;
    findInstances(query: any, user: any): Promise<IInstanceData[]>;
    deleteInstances(query: any, user: any): Promise<any>;
}
declare class ClientModel2 {
    private client;
    constructor(client: any);
    import(name: any, pathToBPMN: any, pathToSVG: any, user: any): Promise<any>;
    /**
     * Reads a model route with the runtime key (bpmn-web >= 3.2 serves model reads on /api2);
     * an older server only has them under /admin/api2, with the admin key.
     */
    private read;
    list(): Promise<string[]>;
    /** Start events the service account may use (candidate rules of the start event apply). */
    findStartEvents(query?: {}): Promise<any>;
    findEvents(query?: {}): Promise<any>;
    delete(name: any): Promise<IDefinitionData>;
    rename(name: any, newName: any): Promise<IDefinitionData>;
    load(name: any): Promise<IDefinitionData>;
    checkErrors(res: any): void;
}
export { BPMNClient2, ClientEngine2, ClientData2, ClientModel2 };
