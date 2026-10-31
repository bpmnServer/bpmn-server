import { IInstanceData, IItemData , IDefinitionData} from './interfaces/DataObjects.js';
import {WebService} from './WebService.js';


class BPMNClient2 extends WebService {
    host;
    port;
    apiKey;
    /** Key of the server's administration API (ADMIN_API_KEY), for model administration. */
    adminApiKey;
    engine: ClientEngine2;
    data: ClientData2;
    model: ClientModel2;

    /**
     * @param apiKey   the server's API_KEY
     * @param options  adminApiKey: the server's ADMIN_API_KEY; model administration is served under
     *                 /admin/api2 with it (defaults to apiKey)
     */
    constructor(host, port, apiKey, options: { adminApiKey?: string } = {}) {
        super();

        this.host = host;
        this.port = port;
        this.apiKey = apiKey;
        this.adminApiKey = options.adminApiKey ?? apiKey;
        this.engine = new ClientEngine2(this);
        this.data = new ClientData2(this);
        this.model = new ClientModel2(this);
    }

    async get(url,params) {
        return await this.request(url, 'GET', params);

    }
    async post(url,params) {
        return await this.request(url, 'POST', params);

    }
    async put(url,params) {
        return await this.request(url, 'PUT', params);

    }
    /** A call to the administration API (/admin/...), with the admin key. */
    async admin(url, method, params = {}) {
        return await this.request(url, method, params, true);
    }
    async del(url, params) {
        return await this.request(url, 'DELETE', params);

    }

    async request(url, method, params, admin = false) {

        var body = JSON.stringify(params);
        var size = Buffer.byteLength(body);
        var contentType = "application/json";

        if (method == 'UPLOAD') {
            contentType = 'multipart/form-data; boundary = ----WebKitFormBoundary7MA4YWxkTrZu0gW';
            method = 'POST';
        }

        var headers = {
            "Content-Type": contentType ,
            "x-api-key": admin ? this.adminApiKey : this.apiKey,
            "Accept": "*/*",
            //                        "User-Agent": "PostmanRuntime/ 7.26.8",
            //                        "Accept-Encoding": "gzip, deflate, br",
            "Connection": "keep-alive"
            //,
            // "Content-Length": Buffer.byteLength(body)
        };


        var options;

        if (params) {
            options = {
                host: this.host,
                port: this.port,
                path: (admin ? '/admin/api2/' : '/api2/') + url,
                method: method,
                headers: headers
            };
        }
        else {
            options = {
                host: this.host,
                port: this.port,
                path: (admin ? '/admin/api2/' : '/api2/') + url,
                method: method
            };
        }

        return await this.invoke(params, options);

    }

}

class ClientEngine2 {
    private client: BPMNClient2;

    constructor(client) {
        this.client = client;
    }
    async start(name, data = {}, user ,options = {}): Promise<IInstanceData> {
        const ret = await this.client.post('engine/start',
            { name, data, user, options });
        if (ret['errors']) {
            console.log(ret['errors']);
            throw new Error(ret['errors']);
        }
        const instance = ret as IInstanceData;
        return instance;
    }
    async invoke(query, data, user,options={}): Promise<IInstanceData> {
        const ret = await this.client.put('engine/invoke',
             { query, data , user ,options });
        if (ret['errors']) {
            console.log(ret['errors']);
            throw new Error(ret['errors']);
        }
        const instance = ret['instance'] as IInstanceData;
        return instance;
    }
    async assign(query, data, assignment,user): Promise<IInstanceData> {
        const ret = await this.client.put('engine/assign',
             { query, data ,assignment, user });
        if (ret['errors']) {
            console.log(ret['errors']);
            throw new Error(ret['errors']);
        }
        const instance = ret['instance'] as IInstanceData;
        return instance;
    }

    async throwMessage(messageId, data = {} , messageMatchingKey = {} ,user, options) {
        const ret = await this.client.post('engine/throwMessage',
             { "messageId": messageId, "data": data, messageMatchingKey,user,options });
        if (ret['errors']) {
            console.log(ret['errors']);
            throw new Error(ret['errors']);
        }
        return ret;
    }
    async throwSignal(signalId, data = {} , messageMatchingKey = {} ,user, options) {
        const ret = await this.client.post('engine/throwSignal', 
            { "signalId": signalId, "data": data, messageMatchingKey,user,options });

            if (ret['errors']) {
            console.log(ret['errors']);
            throw new Error(ret['errors']);
        }
        return ret;
    }

}
class ClientData2 {
    private client: BPMNClient2;

    constructor(client) {
        this.client = client;
    }
    async find({
        filter,
        sort,
        limit,
        after,
        projection,
        lastItem,
		latestItem,
        getTotalCount,
        user}:
        {
            filter?: Record<string, any>;
            after?: string;
            limit?: number;
            sort?: Record<string, 1 | -1>;
            projection?: Record<string, 0 | 1| any>;
            lastItem?: Record<string, any>;
            latestItem?: Record<string,any>;
            getTotalCount?: boolean; // if true, return total count of items in the result set
            user?:string;
          }            
        )
    : Promise<   { data?: any[];
                nextCursor?: string | null;
                totalCount?: number;
                error?: string; }> {
    var res = await this.client.get('datastore/find',
        {filter,after,limit,sort,projection,lastItem,latestItem,getTotalCount,user}
    );
    if (res.error) {
        console.log(res.error);
        throw new Error(res.error);
        
        throw new Error(res['errors']);
    }
    return res;

    }

    async findItems(query,user): Promise<IItemData[]> {
        var res = await this.client.post('data/findItems', 
            {query,user});

        if (res['errors']) {
            console.log(res['errors']);
            throw new Error(res['errors']);
        }
        const items = res['items'] as IItemData[];
        return items;

    }
    async findInstances(query,user): Promise<IInstanceData[]> {
        const res = await this.client.get('data/findInstances', 
            {query,user});

        if (res['errors']) {
            console.log(res['errors']);
            throw new Error(res['errors']);
        }
        const instances = res['instances'] as IInstanceData[];
        return instances;
    }
    async deleteInstances(query,user) {
        return await this.client.del('data/deleteInstances', 
            {query,user});
    }
}
class ClientModel2 {
    private client: BPMNClient2;

    constructor(client) {
        this.client = client;
    }
    
    async import(name, pathToBPMN,pathToSVG=null,user) {

        var options = {
            'method': 'POST',
            'host': this.client.host,
            'port': this.client.port,
            'path': '/admin/api2/model/import/' + encodeURIComponent(name),
            'headers': {
                'x-api-key': this.client.adminApiKey
            },
            'maxRedirects': 20
        };

        var res = await this.client.upload(name,pathToBPMN,pathToSVG,options);
        this.checkErrors(res);
        return res;

    }
    /**
     * Reads a model route with the runtime key (bpmn-web >= 3.2 serves model reads on /api2);
     * an older server only has them under /admin/api2, with the admin key.
     */
    private async read(route, params = {}) {
        try {
            return await this.client.get(route, params);
        }
        catch (error) {
            // older servers: 404, or (before API 404s) the UI's login page
            if (error.status === 404 || error.isWebPage)
                return await this.client.admin(route, 'GET', params);
            throw error;
        }
    }
    async list(): Promise<string[]> {
        return await this.read('model/list') as string[];
    }
    /** Start events the service account may use (candidate rules of the start event apply). */
    async findStartEvents(query = {}) {
        return await this.read('model/findStartEvents', { query });
    }
    async findEvents(query = {}) {
        return await this.read('model/findEvents', { query });
    }
    async delete(name) {
        const res = await this.client.admin('model/delete', 'POST', { name });
        if (res['errors']) {
            console.log(res['errors']);
            throw new Error(res['errors']);
        }
        return res as IDefinitionData;

    }
    async rename(name,newName) {
        const res = await this.client.admin('model/rename', 'POST', { name , newName });
        if (res['errors']) {
            console.log(res['errors']);
            throw new Error(res['errors']);
        }
        return res as IDefinitionData;

    }
    async load(name): Promise<IDefinitionData> {
        const res = await this.client.admin(encodeURI('model/load/' + name), 'GET', { name });
        if (res['errors']) {
            console.log(res['errors']);
            throw new Error(res['errors']);
        }
        return res as IDefinitionData;
    }
    checkErrors(res) {
        if (res['errors']) {
            console.log(res['errors']);
            throw new Error(res['errors']);
        }
    }
}


export { BPMNClient2 , ClientEngine2,ClientData2 , ClientModel2}