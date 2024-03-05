
import {
    IBPMNServer, IEngine, IDefinition, IConfiguration, IDataStore, EXECUTION_EVENT
    , IExecution, IInstanceData, IItemData, ISecureUser
} from '../';

/**
 *  root object to api
 * 
 *  to create:
 * 
 *  api=new BPMNAPI(new BPMNServer(...));
 * 
 *  to use:
 * 
 *  api.engine  to access engine functions (start,invoke..)
 *  api.data    to access dataStore functions (find.. delete)
 *  api.model   to access Model functions (list,save,export..)
 * 
 * 
 *  api cli:
 *  >api engine start       --name 'Buy Used Car'   --data caseId 1003
 *  >api engine invoke      --query name 'Buy Used Car' items.status wait name 'Buy'     --data carModel 'Mazda 3'
 *  >api data   findItems   --query name 'Buy Used Car' items.status wait
 *  >api model  list
 */
class BPMNAPI {
    server: IBPMNServer;
    engine: APIEngine;
    data: APIData;
    model: APIModel;
    defaultUser: ISecureUser;

    constructor(server: IBPMNServer) {
        this.server = server;
        this.engine = new APIEngine(this);
        this.data = new APIData(this);
        this.model = new APIModel(this);
    }
}
class APIComponent {
    api: BPMNAPI;

    constructor(api) {
        this.api = api;
    }
    public get server() {
        return this.api.server;
    }
    getUser(user) {
        console.log('user 1',user);
        if (!user)
            return this.api.defaultUser;
        else
            return user;

    }
}
/**
        common parameters:

        - query:      MongoDB query to locate the target instance or item

        - data:       input Data 

        - user:       an instance of ISecureUser object 

        - options:    various options, this is an open object that is based through the run-time

    Returns IExecution
        containing the instance and the results of the call

*/
export interface IEngineOptions { 
        startNodeId?; 
        noWait?:boolean;
        recover?:boolean;
        [otherOptions: string]: unknown;
    }

export interface IAPIEngine {
/**
    start a new Instance of specified model

@param {String}  modelName - name of the model to start.
@param {ISecureUser}  user - user object {}

*/
    
    start(modelName,
        data: {},
         user: ISecureUser,
         options?:IEngineOptions): Promise<IExecution>;
/**
    continue with the execution of a particular item that is in a wait state, typically a user task
*/
    invoke(query, data: {}, user?: ISecureUser, options?:IEngineOptions): Promise<IExecution>;
/**
    provide assignment data to a user task
    Also, updates item data
*/
    assign(query, data, assignment, user?: ISecureUser, options?:IEngineOptions): Promise<IExecution>;
/**
    throw a message with an id, system will identify receiving item
*/
    throwMessage(messageId, data, messageMatchingKey, user?: ISecureUser, options?:IEngineOptions): Promise<IExecution>;
/**
    throw a signal with an id, system will identify receiving item(s)
*/
    throwSignal(signalId, data, messageMatchingKey, user?: ISecureUser, options?:IEngineOptions): Promise<IExecution>;
/**
    start a second event node (in a subprocess) for a running instance
*/
    startEvent(query, elementId, data: {}, user?: ISecureUser, options?:IEngineOptions): Promise<IExecution>;


/**
 * 
 * restarting an already completed instance at a particular node
 * this function requires `dataStore.enableSavePoints` to be true in configuration.ts
 * this add a savePoint for each item, allowing you to select that item to restore it
 *
 *      
 * @param itemQuery - Query to find a single item
 * @param inputData
 * 
 */
    restart(itemQuery, data:any,userName, options?) :Promise<IExecution>;


}


export interface IAPIData {
/**
    returns list of `User Tasks` that the user has access to

    to get assigned tasks for a user

```ts
    api.data.getPendingUserTasks({"item.assignee":user.userName});
```

*/
     getPendingUserTasks(query, user: ISecureUser): Promise<IItemData[]>;
/**
    returns list of `item`s
*/
     findItems(query, user?: ISecureUser): Promise<IItemData[]>;
     findItem(query, user?: ISecureUser): Promise<IItemData>;
/**
    returns list of `instance`s
*/
     findInstances(query, user?: ISecureUser, options?): Promise<IInstanceData[]>;
/**
    deletes the `instance`s
*/
     deleteInstances(query, user?: ISecureUser);
}
/**
        common parameters:

        - query:      MongoDB query to locate the target instance or item

        - user:       an instance of ISecureUser object 

*/
export interface IAPIModel {

/**
    retrieve Model data
*/
get(query:any ,user: ISecureUser): Promise<object[]>;


/**
    save a model to the modelStore
*/

     save(name, source, svg, user?: ISecureUser);
/**
    list all models authorized to the user
*/
     list(query:any ,user: ISecureUser): Promise<string[]>;
/**
    returns Model Events (like timers) for authorized to the user and based on specifid query
*/

     findEvents(query:any, user?: ISecureUser);
/**
    returns Model Start Events for authorized to the user and based on specifid query
*/

     findStartEvents(query:any, user?: ISecureUser);
/**
    delete the specified model
*/

     delete(name, user?: ISecureUser);
/**
    delete the specified model
*/
     rename(name, newName, user?: ISecureUser);
/**
    returns the bpmn (xml) for the model
*/
     getSource(name, user?: ISecureUser);
/**
    load a model 
*/
     load(name, user?: ISecureUser);
/**
    Exports the specified models based on a query to a folder
*/
     export(query, folder, user?: ISecureUser) ;
}


class APIEngine extends APIComponent implements IAPIEngine {

    public async start(name, data = {}, user?: ISecureUser, options: IEngineOptions = {}): Promise<IExecution> {

        return await this.server.engine.start(name, data, options['startNodeId'], this.getUser(user).userName, options);
    }
    public async invoke(query, data = {}, user?: ISecureUser, options:IEngineOptions = {}): Promise<IExecution> {
        user=this.getUser(user);
        query = user.qualifyItems(query);
        return await this.server.engine.invoke(query, data, user.userName, options);
    }

    public async assign(query, data, assignment, user?: ISecureUser, options:IEngineOptions = {}): Promise<IExecution> {
        user=this.getUser(user);
        query = user.qualifyItems(query);
        return await this.server.engine.assign(query, data, assignment, user.userName, options);
    }
    public async throwMessage(messageId, data, messageMatchingKey, user?: ISecureUser, options:IEngineOptions = {}) {
        return await this.server.engine.throwMessage(messageId, data, messageMatchingKey);
    }
    public async throwSignal(signalId, data, messageMatchingKey, user?: ISecureUser, options:IEngineOptions = {}) {
        return await this.server.engine.throwSignal(signalId, data, messageMatchingKey);
    }
    public async startEvent(query, elementId, data = {}, user?: ISecureUser, options:IEngineOptions = {}): Promise<IExecution> {
        return await this.server.engine.startEvent(query, elementId, data,user.userName,options);
    }
    public async restart(itemQuery, data:any,user:ISecureUser, options={}) :Promise<IExecution>  {
        return await this.server.engine.restart(itemQuery, data,user.userName, options);

    }

}
class APIData extends APIComponent {
    public async getPendingUserTasks(query, user?: ISecureUser): Promise<IItemData[]> {

        query['items.status'] = 'wait';
        query['items.type'] = 'bpmn:UserTask';

        return this.findItems(query, user);
    }

    public async findItems(query, user?: ISecureUser): Promise<IItemData[]> {
        user=this.getUser(user);
        query = user.qualifyInstances(query);
        return await this.server.dataStore.findItems(query);
    }
    public async findItem(query, user?: ISecureUser): Promise<IItemData> {
        user=this.getUser(user);
        query = user.qualifyInstances(query);
        const items = await this.server.dataStore.findItems(query);
        return items[0];
    }
    public async findInstances(query, user?: ISecureUser, options?): Promise<IInstanceData[]> {
        user=this.getUser(user);
        query = user.qualifyInstances(query);
        return await this.server.dataStore.findInstances(query, options);
    }
    public async deleteInstances(query, user?: ISecureUser) {
        user=this.getUser(user);
        query = user.qualifyDeleteInstances(query);
        return await this.server.dataStore.deleteInstances(query)
    }
}
class APIModel extends APIComponent {

    public async get(query:any ,user: ISecureUser): Promise<object[]> {
        user=this.getUser(user);
        if (user.tenantId)
            query['owner'] = user.modelsOwner;
        const list=await this.server.definitions.get(query);

        return list;

    }


    public async save(name, source, svg, user?: ISecureUser) {

        user=this.getUser(user);
        if (await user.canModifyModel(name))
            return await this.server.definitions.save(name, source, svg, user.modelsOwner);
        else
            return false;
    }
    public async list(query,user?: ISecureUser): Promise<string[]> {

        user=this.getUser(user);
        if (user.tenantId)
            query['owner'] = user.modelsOwner;
        return await this.server.definitions.getList(query);
    }
    public async findEvents(query, user?: ISecureUser) {

        user=this.getUser(user);
        return await this.server.definitions.findEvents(query, user.modelsOwner);
    }
    public async findStartEvents(query, user?: ISecureUser) {

        user=this.getUser(user);
        query['events.subType'] = null;
        query = user.qualifyStartEvents(query);
        return await this.server.definitions.findEvents(query, user.modelsOwner);
    }
    public async delete(name, user?: ISecureUser) {
        if (await user.canDeleteModel(name))
            return await this.server.definitions.deleteModel(name, user.modelsOwner);
        return false;
    }
    public async rename(name, newName, user?: ISecureUser) {

        user=this.getUser(user);
        if (await user.canModifyModel(name))
            return await this.server.definitions.renameModel(name, newName, user.modelsOwner);
        return false;
    }
    public async getSource(name, user?: ISecureUser) {
        return await this.server.definitions.getSource(name, user.modelsOwner);
    }
    public async load(name, user?: ISecureUser) {
        return await this.server.definitions.load(name, user.modelsOwner);
    }
    public async export(query, folder, user?: ISecureUser) {

    }
}

export { BPMNAPI, APIEngine, APIData, APIModel  }
