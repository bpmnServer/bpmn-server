import { WebService } from './WebService.js';
class BPMNClient extends WebService {
    host;
    port;
    apiKey;
    /** Key of the server's administration API (ADMIN_API_KEY), for model administration. */
    adminApiKey;
    engine;
    datastore;
    definitions;
    /**
     * @param apiKey   the server's API_KEY
     * @param options  adminApiKey: the server's ADMIN_API_KEY; model administration is served under
     *                 /admin/api with it (defaults to apiKey)
     */
    constructor(host, port, apiKey, options = {}) {
        super();
        this.host = host;
        this.port = port;
        this.apiKey = apiKey;
        this.adminApiKey = options.adminApiKey ?? apiKey;
        this.engine = new ClientEngine(this);
        this.datastore = new ClientDatastore(this);
        this.definitions = new ClientDefinitions(this);
    }
    async get(url, data = {}) {
        return await this.request(url, 'GET', data);
    }
    async post(url, data = {}) {
        return await this.request(url, 'POST', data);
    }
    async put(url, data = {}) {
        return await this.request(url, 'PUT', data);
    }
    /** A call to the administration API (/admin/...), with the admin key. */
    async admin(url, method, params = {}) {
        return await this.request(url, method, params, true);
    }
    async del(url, data = {}) {
        return await this.request(url, 'DELETE', data);
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
            "Content-Type": contentType,
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
                path: (admin ? '/admin/api/' : '/api/') + url,
                method: method,
                headers: headers
            };
        }
        else {
            options = {
                host: this.host,
                port: this.port,
                path: (admin ? '/admin/api/' : '/api/') + url,
                method: method
            };
        }
        return await this.invoke(params, options);
    }
}
class ClientEngine {
    client;
    constructor(client) {
        this.client = client;
    }
    async start(name, data = {}, startNodeId = null, userId = null, options = {}) {
        const ret = await this.client.post('engine/start', { name, data, startNodeId, userId, options });
        if (ret['errors']) {
            console.log(ret['errors']);
            throw new Error(ret['errors']);
        }
        const instance = ret;
        return instance;
    }
    async invoke(query, data, userId = null, options = {}) {
        const ret = await this.client.put('engine/invoke', { query, data, userId, options });
        if (ret['errors']) {
            console.log(ret['errors']);
            throw new Error(ret['errors']);
        }
        const instance = ret['instance'];
        return instance;
    }
    async assign(query, data, userId = null, assignment) {
        const ret = await this.client.put('engine/assign', { query, data, userId, assignment });
        if (ret['errors']) {
            console.log(ret['errors']);
            throw new Error(ret['errors']);
        }
        const instance = ret['instance'];
        return instance;
    }
    async restart(query, data, userId = null, options = {}) {
        const ret = await this.client.put('engine/restart', { query, data, userId, options });
        if (ret['errors']) {
            console.log(ret['errors']);
            throw new Error(ret['errors']);
        }
        const instance = ret['instance'];
        return instance;
    }
    async throwMessage(messageId, data = {}, messageMatchingKey = {}) {
        const ret = await this.client.post('engine/throwMessage', { "messageId": messageId, "data": data, messageMatchingKey });
        if (ret['errors']) {
            console.log(ret['errors']);
            throw new Error(ret['errors']);
        }
        return ret;
    }
    async throwSignal(signalId, data = {}, messageMatchingKey = {}) {
        const ret = await this.client.post('engine/throwSignal', { "signalId": signalId, "data": data, messageMatchingKey });
        if (ret['errors']) {
            console.log(ret['errors']);
            throw new Error(ret['errors']);
        }
        return ret;
    }
    async startEvent(instanceId, startNodeId, data = {}, userId = null, options = {}) {
        const ret = await this.client.put('engine/startEvent', { "instanceId": instanceId, "startNodeId": startNodeId, "data": data, "userName": userId, "options": options });
        if (ret['errors']) {
            console.log(ret['errors']);
            throw new Error(ret['errors']);
        }
        return ret;
    }
    async get(query) {
        const ret = await this.client.get('engine/get', query);
        if (ret['errors']) {
            console.log(ret['errors']);
            throw new Error(ret['errors']);
        }
        const instance = ret['instance'];
        return instance;
    }
    async status() {
        const ret = await this.client.get('engine/status', {});
        if (ret['errors']) {
            console.log(ret['errors']);
            throw new Error(ret['errors']);
        }
        return ret;
    }
}
class ClientDatastore {
    client;
    constructor(client) {
        this.client = client;
    }
    async find({ filter, sort, limit, after, projection, lastItem, latestItem, getTotalCount }) {
        var res = await this.client.get('datastore/find', { filter, after, limit, sort, projection, lastItem, latestItem, getTotalCount });
        if (res.error) {
            console.log(res.error);
            throw new Error(res.error);
            throw new Error(res['errors']);
        }
        return res;
    }
    async findItems(query) {
        var res = await this.client.get('datastore/findItems', query);
        if (res['errors']) {
            console.log(res['errors']);
            throw new Error(res['errors']);
        }
        const items = res['items'];
        return items;
    }
    async findInstances(query, projection = {}) {
        const res = await this.client.get('datastore/findInstances', { query, projection });
        if (res['errors']) {
            console.log(res['errors']);
            throw new Error(res['errors']);
        }
        const instances = res['instances'];
        return instances;
    }
    async deleteInstances(query) {
        return await this.client.admin('datastore/deleteInstances', 'DELETE', query); // /admin/api
    }
}
class ClientDefinitions {
    client;
    constructor(client) {
        this.client = client;
    }
    async import(name, pathToBPMN, pathToSVG = null) {
        var options = {
            'method': 'POST',
            'host': this.client.host,
            'port': this.client.port,
            'path': '/admin/api/definitions/import/' + encodeURIComponent(name),
            'headers': {
                'x-api-key': this.client.adminApiKey
            },
            'maxRedirects': 20
        };
        var res = await this.client.upload(name, pathToBPMN, pathToSVG, options);
        this.checkErrors(res);
        return res;
    }
    async list() {
        var res = await this.client.admin('definitions/list', 'GET', []);
        if (res['errors']) {
            console.log(res['errors']);
            throw new Error(res['errors']);
        }
        return res;
    }
    async delete(name) {
        const res = await this.client.admin('definitions/delete', 'POST', { name });
        if (res['errors']) {
            console.log(res['errors']);
            throw new Error(res['errors']);
        }
        return res;
    }
    async rename(name, newName) {
        const res = await this.client.admin('definitions/rename', 'POST', { name, newName });
        if (res['errors']) {
            console.log(res['errors']);
            throw new Error(res['errors']);
        }
        return res;
    }
    /** The model's BPMN XML source (the legacy API returns the source, /api2 the parsed definition). */
    async load(name) {
        const res = await this.client.admin(encodeURI('definitions/load/' + name), 'GET', { name });
        if (res['errors']) {
            console.log(res['errors']);
            throw new Error(res['errors']);
        }
        return res;
    }
    checkErrors(res) {
        if (res['errors']) {
            console.log(res['errors']);
            throw new Error(res['errors']);
        }
    }
}
export { BPMNClient, ClientEngine, ClientDatastore, ClientDefinitions };
//# sourceMappingURL=BPMNClient.js.map