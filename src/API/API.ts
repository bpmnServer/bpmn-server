
import {
    IBPMNServer, IEngine, IDefinition, IConfiguration, IDataStore, EXECUTION_EVENT
    , IExecution, IInstanceData, IItemData, ISecureUser
} from '../';


class BPMNAPI {
    server: IBPMNServer;
    engine: APIEngine;
    data: APIData;
    model: APIModel;

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
interface IAPIEngine {
/**
    start a new Instance of specified model
*/
    start(modelName, data: {}, user: ISecureUser, options?: {}): Promise<IExecution>;
/**
    continue with the execution of a particular item that is in a wait state, typically a user task
*/
    invoke(query, data: {}, user: ISecureUser, options?: {}): Promise<IExecution>;
/**
    provide assignment data to a user task
*/
    assign(query, data, assignment, user: ISecureUser, options?: {}): Promise<IExecution>;
/**
    throw a message with an id, system will identify receiving item
*/
    throwMessage(messageId, data, messageMatchingKey, user: ISecureUser, options?: {}): Promise<IExecution>;
/**
    throw a signal with an id, system will identify receiving item(s)
*/
    throwSignal(signalId, data, messageMatchingKey, user: ISecureUser, options?: {}): Promise<IExecution>;
/**
    start a second event node (in a subprocess) for a running instance
*/
    startEvent(query, elementId, data: {}, user: ISecureUser, options?: {}): Promise<IExecution>;
}


interface IAPIData {
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
     findItems(query, user: ISecureUser): Promise<IItemData[]>;
     findItem(query, user: ISecureUser): Promise<IItemData>;
/**
    returns list of `instance`s
*/
     findInstances(query, user: ISecureUser, options): Promise<IInstanceData[]>;
/**
    deletes the `instance`s
*/
     deleteInstances(query, user: ISecureUser);
}
/**
        common parameters:

        - query:      MongoDB query to locate the target instance or item

        - user:       an instance of ISecureUser object 

*/
interface IAPIModel {
/**
    save a model to the modelStore
*/

     save(name, source, svg, user: ISecureUser);
/**
    list all models authorized to the user
*/
     list(user: ISecureUser): Promise<string[]>;
/**
    returns Model Events (like timers) for authorized to the user and based on specifid query
*/

     findEvents(query, user: ISecureUser);
/**
    returns Model Start Events for authorized to the user and based on specifid query
*/

     findStartEvents(query, user: ISecureUser);
/**
    delete the specified model
*/

     delete(name, user: ISecureUser);
/**
    delete the specified model
*/
     rename(name, newName, user: ISecureUser);
/**
    returns the bpmn (xml) for the model
*/
     getSource(name, user: ISecureUser);
/**
    load a model 
*/
     load(name, user: ISecureUser);
/**
     export the specified models based on a query to a folder
*/
     export(query, folder, user: ISecureUser) ;
}



class APIEngine extends APIComponent implements IAPIEngine {

    public async start(name, data = {}, user: ISecureUser, options = {}): Promise<IExecution> {

        return await this.server.engine.start(name, data, options['startNodeId'], user.userName, options);
    }
    public async invoke(query, data = {}, user: ISecureUser, options = {}): Promise<IExecution> {
        query = user.qualifyItems(query);
        return await this.server.engine.invoke(query, data, user.userName, options);
    }

    public async assign(query, data, assignment, user: ISecureUser, options = {}): Promise<IExecution> {
        query = user.qualifyItems(query);
        return await this.server.engine.assign(query, data, assignment, user.userName, options);
    }
    public async throwMessage(messageId, data, messageMatchingKey, user: ISecureUser, options = {}) {
        return await this.server.engine.throwMessage(messageId, data, messageMatchingKey);
    }
    public async throwSignal(signalId, data, messageMatchingKey, user: ISecureUser, options = {}) {
        return await this.server.engine.throwSignal(signalId, data, messageMatchingKey);
    }
    public async startEvent(query, elementId, data = {}, user: ISecureUser, options = {}): Promise<IExecution> {
        return await this.server.engine.startEvent(query, elementId, data);
    }
}
class APIData extends APIComponent {
    public async getPendingUserTasks(query, user: ISecureUser): Promise<IItemData[]> {

        query['items.status'] = 'wait';
        query['items.type'] = 'bpmn:UserTask';

        return this.findItems(query, user);
    }

    public async findItems(query, user: ISecureUser): Promise<IItemData[]> {
        query = user.qualifyInstances(query);
        return await this.server.dataStore.findItems(query);
    }
    public async findItem(query, user: ISecureUser): Promise<IItemData> {
        query = user.qualifyInstances(query);
        const items = await this.server.dataStore.findItems(query);
        return items[0];
    }
    public async findInstances(query, user: ISecureUser, options): Promise<IInstanceData[]> {
        query = user.qualifyInstances(query);
        return await this.server.dataStore.findInstances(query, options);
    }
    public async deleteInstances(query, user: ISecureUser) {
        query = user.qualifyDeleteInstances(query);
        return await this.server.dataStore.deleteInstances(query)
    }
}
class APIModel extends APIComponent {

    public async save(name, source, svg, user: ISecureUser) {

        if (await user.canModifyModel(name))
            return await this.server.definitions.save(name, source, svg, user.modelsOwner);
        else
            return false;
    }
    public async list(user: ISecureUser): Promise<string[]> {

        const query = {};
        if (user.tenantId)
            query['owner'] = user.modelsOwner;
        return await this.server.definitions.getList(query);
    }
    public async findEvents(query, user: ISecureUser) {

        return await this.server.definitions.findEvents(query, user.modelsOwner);
    }
    public async findStartEvents(query, user: ISecureUser) {
        query['events.subType'] = null;
        query = user.qualifyStartEvents(query);
        return await this.server.definitions.findEvents(query, user.modelsOwner);
    }
    public async delete(name, user: ISecureUser) {
        if (await user.canDeleteModel(name))
            return await this.server.definitions.deleteModel(name, user.modelsOwner);
        return false;
    }
    public async rename(name, newName, user: ISecureUser) {
        if (await user.canModifyModel(name))
            return await this.server.definitions.renameModel(name, newName, user.modelsOwner);
        return false;
    }
    public async getSource(name, user: ISecureUser) {
        return await this.server.definitions.getSource(name, user.modelsOwner);
    }
    public async load(name, user: ISecureUser) {
        return await this.server.definitions.load(name, user.modelsOwner);
    }
    public async export(query, folder, user: ISecureUser) {

    }
}

export { BPMNAPI, APIEngine, APIData, APIModel ,IAPIEngine ,IAPIData,IAPIModel  }
