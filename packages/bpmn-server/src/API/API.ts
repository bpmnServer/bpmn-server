
import type { IInstanceData, IItemData } from '../interfaces/DataObjects.js';
import { EXECUTION_EVENT } from '../interfaces/Enums.js';
import type { ISecureUser } from '../interfaces/User.js';
import type { IConfiguration } from '../interfaces/common.js';
import type { IDataStore } from '../interfaces/datastore.js';
import type { IDefinition } from '../interfaces/elements.js';
import type { IExecution } from '../interfaces/engine.js';
import type { IBPMNServer, IEngine } from '../interfaces/server.js';
import { verifyModel, type IModelVerification } from '../elements/verifyModel.js';
import { registrationsOf, listensTo, fireApiEvent } from '../engine/AddOns.js';
import { queryContext, actionContext, narrowed } from '../engine/Context.js';

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
 *  api.model   to read models (list, start events, source, verify)
 *
 *  Changing models (save, delete, rename) is available only through BPMNAdminAPI.
 * 
 * 
 *  api cli:
 *  >api engine start       --name 'Buy Used Car'   --data caseId 1003
 *  >api engine invoke      --query name 'Buy Used Car' items.status wait name 'Buy'     --data carModel 'Mazda 3'
 *  >api data   findItems   --query name 'Buy Used Car' items.status wait
 */
class BPMNAPI {
    server: IBPMNServer;
    engine: APIEngine;
    data: APIData;
    /** Read-only: changing models needs BPMNAdminAPI. */
    model: APIModelReader;

    constructor(server: IBPMNServer) {
        this.server = server;
        this.engine = new APIEngine(this);
        this.data = new APIData(this);
        this.model = new APIModelReader(this);
    }
}

/**
 * Privileged API used by deployment and model-management tooling.
 * Runtime integrations should receive BPMNAPI so they cannot mutate models.
 */
class BPMNAdminAPI extends BPMNAPI {
    declare model: APIModel;

    constructor(server: IBPMNServer) {
        super(server);
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
    /**
     * What the add-ons narrow a user's queries by (the Policies add-on: the tasks offered to them). A server that says
     * nothing of add-ons (no registrations, no configuration's addOns): undefined, so the user's own narrowing applies,
     * as before; nothing is opened by not knowing.
     */
    protected get filters() {
        const server: any = this.server;
        return server?.registrations || typeof server?.configuration?.addOns === 'function' ? registrationsOf(server).queryFilters : undefined;
    }
    getUser(user) {
        if (!user) throw new Error('A trusted authenticated principal is required');
        return user;
    }

    /**
     * A query narrowed to what this user may see (docs/design/context-object.md): their tenant's (SecureUser), then
     * `pre-query`, its listeners' conditions all holding. No listener (the Policies add-on off, a server from before
     * add-ons): the user's own built-in narrowing, the tasks offered to them. Not narrowed for an administrator.
     */
    protected async qualify(kind: 'instances' | 'items' | 'startEvents' | 'deleteInstances', user: ISecureUser, query) {
        const method = { instances: 'qualifyInstances', items: 'qualifyItems', startEvents: 'qualifyStartEvents', deleteInstances: 'qualifyDeleteInstances' }[kind];
        const legacy = this.filters;
        // an add-on of before 3.7.5 still filtering (registrations.addQueryFilter): as before
        if (legacy?.length) return user[method](query, legacy);
        // nothing listens (the Policies add-on off): the built-in narrowing, the tasks offered to them
        if (!listensTo(this.server, 'pre-query')) return user[method](query);
        // the tenant, administrators and security turned off: the user's own rules, with no narrowing of theirs
        const base = user[method](query, []);
        if ((user as any).securityBypassed || user.isAdmin() || kind === 'deleteInstances') return base;
        const context = queryContext(kind, user, base);
        await fireApiEvent(this.server, 'pre-query', context);
        return narrowed(base, context.conditions);
    }

    /**
     * Whether this user may do this (the one check of each action: canStart, canInvoke, canAssign, canRestart,
     * canFireEvent, canModifyModel, canDeleteModel): the user's own rule, then `pre-action`, whose listeners may refuse
     * by throwing (the error is the caller's). No listener: the built-in rules only.
     */
    protected async can(action: string, user: ISecureUser, on: { item?: any; instance?: any; element?: any; model?: string; input?: any; assignment?: any } = {}): Promise<boolean> {
        if (action === 'modifyModel' && !(await user.canModifyModel(on.model))) return false;
        if (action === 'deleteModel' && !(await user.canDeleteModel(on.model))) return false;
        if (!listensTo(this.server, 'pre-action')) return true;
        await fireApiEvent(this.server, 'pre-action', actionContext(action, user, on));
        return true;
    }

    /** The waiting items a query finds, each with its case (what a pre-action decides on); none when nothing listens. */
    protected async targets(query): Promise<{ item: any; instance: any }[]> {
        if (!listensTo(this.server, 'pre-action')) return [];
        const items = await this.server.dataStore.findItems(query);
        const ids = [...new Set(items.map(i => i.instanceId).filter(Boolean))];
        const cases = ids.length ? await this.server.dataStore.findInstances({ id: { $in: ids } }, { projection: { id: 1, name: 1, data: 1, items: 1, tokens: 1, userName: 1 } } as any) : [];
        const byId = new Map(cases.map(c => [c.id, c]));
        return items.map(item => ({ item, instance: byId.get(item.instanceId) }));
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
    invoke(query, data: {}, user: ISecureUser, options?:IEngineOptions): Promise<IExecution>;
/**
    provide assignment data to a user task
    Also, updates item data
*/
    assign(query, data, assignment, user: ISecureUser, options?:IEngineOptions): Promise<IExecution>;
/**
    throw a message with an id, system will identify receiving item
*/
    throwMessage(messageId, data, messageMatchingKey, user: ISecureUser, options?:IEngineOptions): Promise<IExecution>;
/**
    throw a signal with an id, system will identify receiving item(s)
*/
    throwSignal(signalId, data, messageMatchingKey, user: ISecureUser, options?:IEngineOptions): Promise<IExecution>;
/**
    start a second event node (in a subprocess) for a running instance
*/
    startEvent(query, elementId, data: {}, user: ISecureUser, options?:IEngineOptions): Promise<IExecution>;


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

/**
 * upgrade running instances with the latest revised bpmn model
 * default behaviour is that running instances will retain the model at start
 * However, this routine will upgrade already started instances with the revised model
 * 
 * @param model     Model Name
 * @param afterNodeIds  list of nodeIds, to check if already started, don't apply the upgrade
 * 
 */
    upgrade(model:string,afterNodeIds:string[], user: ISecureUser):Promise<string[]|{errors}>;



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
     findItems(query, user?: ISecureUser, options?: { lean?: boolean }): Promise<IItemData[]>;
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
        user = this.getUser(user);
        await this.can('start', user, { model: name, element: options['startNodeId'] ? { id: options['startNodeId'] } : undefined, input: data });
        return await this.server.engine.start(name, data, options['startNodeId'], user.userName,
            { ...options, tenantId: user.tenantId });
    }
    public async invoke(query, data = {}, user?: ISecureUser, options:IEngineOptions = {}): Promise<IExecution> {
        user=this.getUser(user);
        query = await this.qualify('items', user, query);
        for (const { item, instance } of await this.targets(query))
            if (item.status === 'wait') await this.can('complete', user, { item, instance, input: data });
        return await this.server.engine.invoke(query, data, user.userName, options);
    }

    public async assign(query, data, assignment, user?: ISecureUser, options:IEngineOptions = {}): Promise<IExecution> {
        user=this.getUser(user);
        query = await this.qualify('items', user, query);
        // who works on it: a person taking it as its assignee, and nothing else, is claiming it; else assigning
        const who = ['assignee', 'candidateUsers', 'candidateGroups'].filter(f => f in (assignment ?? {}));
        if (who.length) {
            const claim = who.length === 1 && who[0] === 'assignee' && assignment.assignee === user.userName;
            for (const { item, instance } of await this.targets(query))
                if (item.status === 'wait') await this.can(claim ? 'claim' : 'assign', user, { item, instance, assignment });
        }
        return await this.server.engine.assign(query, data, assignment, user.userName, options);
    }
    public async throwMessage(messageId, data, messageMatchingKey, user?: ISecureUser, options:IEngineOptions = {}) {
        // Messages and signals can start or resume any matching process; the engine
        // does not currently support tenant-scoped delivery.
        if (!this.getUser(user).isSystem()) throw new Error('System permission is required to throw a message');
        return await this.server.engine.throwMessage(messageId, data, messageMatchingKey);
    }
    public async throwSignal(signalId, data, messageMatchingKey, user?: ISecureUser, options:IEngineOptions = {}) {
        if (!this.getUser(user).isSystem()) throw new Error('System permission is required to throw a signal');
        return await this.server.engine.throwSignal(signalId, data, messageMatchingKey);
    }
    public async startEvent(query, elementId, data = {}, user?: ISecureUser, options:IEngineOptions = {}): Promise<IExecution> {
        user=this.getUser(user);
        const instance = await this.server.dataStore.findInstance(await this.qualify('instances', user, { id: query }), 'summary');
        if (listensTo(this.server, 'pre-action')) {
            const [full] = await this.server.dataStore.findInstances({ id: instance.id }, 'full');
            await this.can('events', user, { instance: full ?? instance, element: { id: elementId }, input: data });
        }
        return await this.server.engine.startEvent(instance.id, elementId, data,user.userName,options);
    }
    /** Runs a failed item's work again (its status `error`), and the instance on from it. */
    public async retry(itemQuery, user?: ISecureUser): Promise<IExecution> {
        user = this.getUser(user);
        return await this.server.engine.retry(await this.qualify('items', user, { ...itemQuery }), user.userName);
    }
    public async restart(itemQuery, data:any,user:ISecureUser, options={}) :Promise<IExecution>  {
        user = this.getUser(user);
        const query = await this.qualify('items', user, { ...itemQuery });
        for (const { item, instance } of await this.targets(query)) await this.can('restart', user, { item, instance, input: data });
        return await this.server.engine.restart(query, data,user.userName, options);

    }
    public async upgrade(model,afterNodeIds,user?: ISecureUser) {
        user = this.getUser(user);
        if (!user.isSystem()) throw new Error('System permission is required to upgrade instances');
        return await this.server.engine.upgrade(model,afterNodeIds)
    }
}
class APIData extends APIComponent {
    /** A query narrowed to what this user may see, as the API's reads narrow theirs (pre-query). */
    public async qualifyQuery(kind: 'instances' | 'items' | 'startEvents', query, user?: ISecureUser) {
        return this.qualify(kind, this.getUser(user), { ...(query ?? {}) });
    }
    public async getPendingUserTasks(query, user?: ISecureUser): Promise<IItemData[]> {

        query['items.status'] = 'wait';
        query['items.type'] = 'bpmn:UserTask';

        return this.findItems(query, user);
    }

    /** `lean`: without the instances' data (for lists): see IDataStore.findItems. */
    public async findItems(query, user?: ISecureUser, options?: { lean?: boolean }): Promise<IItemData[]> {
        user=this.getUser(user);
        query = await this.qualify('items', user, query);
        return await this.server.dataStore.findItems(query, options);
    }
    public async findItem(query, user?: ISecureUser): Promise<IItemData> {
        user=this.getUser(user);
        query = await this.qualify('items', user, query);
        const items = await this.server.dataStore.findItems(query);
        return items[0];
    }
    public async findInstances(query, user?: ISecureUser, options?): Promise<IInstanceData[]> {
        user=this.getUser(user);
        query = await this.qualify('instances', user, query);
        // The same visibility as findItems (qualifyInstances): an instance the principal may see is
        // returned whole. 3.1.0 stripped data and items for non-admins, which findItems still returned.
        return await this.server.dataStore.findInstances(query, options);
    }
    public async deleteInstances(query, user?: ISecureUser) {
        user=this.getUser(user);
        query = await this.qualify('deleteInstances', user, query);
        // the engine's to do, under each instance's lock and with its timers, wherever it runs
        return await this.server.engine.deleteInstances(query)
    }
}
/**
 * Reading models: what runtime clients need to offer and run processes (the processes a user may
 * start, documentation, task forms, diagrams). Scoped to the principal's tenant (modelsOwner).
 */
class APIModelReader extends APIComponent {

    public async get(query: any, user: ISecureUser): Promise<object[]> {
        user=this.getUser(user);
        query = { ...(query ?? {}) };
        if (user.tenantId)
            query['owner'] = user.modelsOwner;
        return await this.server.definitions.get(query);
    }
    public async list(query, user?: ISecureUser): Promise<string[]> {
        user=this.getUser(user);
        query = { ...(query ?? {}) };
        if (user.tenantId)
            query['owner'] = user.modelsOwner;
        return await this.server.definitions.getList(query);
    }
    public async findEvents(query, user?: ISecureUser) {
        user=this.getUser(user);
        return await this.server.definitions.findEvents({ ...(query ?? {}) }, user.modelsOwner);
    }
    /** Start events the principal may use: candidate starter users/groups apply. */
    public async findStartEvents(query, user?: ISecureUser) {
        user=this.getUser(user);
        query = { ...(query ?? {}) };
        query['events.subType'] = null;
        query = await this.qualify('startEvents', user, query);
        return await this.server.definitions.findEvents(query, user.modelsOwner);
    }
    public async getSource(name, user?: ISecureUser) {
        user=this.getUser(user);
        return await this.server.definitions.getSource(name, user.modelsOwner);
    }
    public async load(name, user?: ISecureUser) {
        user=this.getUser(user);
        return await this.server.definitions.load(name, user.modelsOwner);
    }
    /**
     * Checks a model for errors and likely mistakes without running it.
     * @param nameOrSource  a saved model's name, or BPMN XML
     */
    public async verifyModel(nameOrSource: string, user?: ISecureUser): Promise<IModelVerification> {
        user=this.getUser(user);
        let name = 'model';
        let source = nameOrSource;
        if (!String(nameOrSource || '').trim().startsWith('<')) {
            name = nameOrSource;
            try {
                source = await this.server.definitions.getSource(name, user.modelsOwner);
            }
            catch (exc) {
                source = null;
            }
            if (!source)
                return { valid: false, errors: 1, warnings: 0,
                    issues: [{ severity: 'error', code: 'model-not-found', message: `Model '${name}' was not found.` }] };
        }
        return await verifyModel(source, this.server, name);
    }
}

/** Changing models: deployment and model-management tooling only (BPMNAdminAPI). */
class APIModel extends APIModelReader {

    /**
     * The host's models (a launched server's `models`: model access writes the files, the engine is told;
     * docs/design/engine-isolation.md); an embedded server, or a model with an owner (tenants: the owner is in the
     * index), as before.
     */
    private modelsOf(user: ISecureUser) {
        const models = (this.server as any).models;
        return models && !user.modelsOwner ? models : null;
    }

    public async save(name, source, svg, user?: ISecureUser) {
        user=this.getUser(user);
        if (await this.can('modifyModel', user, { model: name }))
            return await (this.modelsOf(user)?.save(name, source, svg, user.userName) ?? this.server.definitions.save(name, source, svg, user.modelsOwner, user.userName));
        else
            return false;
    }
    public async delete(name, user?: ISecureUser) {
        user=this.getUser(user);
        if (await this.can('deleteModel', user, { model: name }))
            return await (this.modelsOf(user)?.remove(name) ?? this.server.definitions.deleteModel(name, user.modelsOwner));
        return false;
    }
    public async rename(name, newName, user?: ISecureUser) {
        user=this.getUser(user);
        if (await this.can('modifyModel', user, { model: name }))
            return await (this.modelsOf(user)?.rename(name, newName) ?? this.server.definitions.renameModel(name, newName, user.modelsOwner));
        return false;
    }
    public async export(query, folder, user?: ISecureUser) {

    }
}

export { BPMNAPI, BPMNAdminAPI, APIEngine, APIData, APIModelReader, APIModel }
