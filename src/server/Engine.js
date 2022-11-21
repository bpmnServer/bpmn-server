"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Engine = void 0;
const __1 = require("../..");
const ServerComponent_1 = require("../server/ServerComponent");
class Engine extends ServerComponent_1.ServerComponent {
    constructor(server) {
        super(server);
    }
    /**
     *	loads a definitions  and start execution
     *
     * @param name		name of the process to start
     * @param data		input data
     * @param startNodeId	in process has multiple start node; you need to specify which one
     */
    start(name, data = {}, startNodeId = null, userKey = null, options = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            this.logger.log(`Action:engine.start ${name}`);
            const definitions = this.definitions;
            const source = yield definitions.getSource(name);
            const execution = new __1.Execution(this.server, name, source);
            if (userKey) {
                execution.currentUser = this.iam.getCurrentUser(userKey);
            }
            // new dataStore for every execution to be monitored 
            /* const newDataStore =new DataStore(this.server);
            this.server.dataStore = newDataStore;
    
            newDataStore.monitorExecution(execution); */
            this.cache.add(execution);
            execution.worker = execution.execute(startNodeId, data, options);
            if (options['noWait'] == true) {
                return execution;
            }
            else {
                const waiter = yield execution.worker;
                this.logger.log(`.engine.start ended for ${name}`);
                return execution;
            }
        });
    }
    /**
     * restores an instance into memeory or provides you access to a running instance
     *
     * this will also resume execution
     *
     * @param instanceQuery		criteria to fetch the instance
     *
     * query example:	{ id: instanceId}
     *					{ data: {caseId: 1005}}
     *					{ items.item.id : 'abcc111322'}
     *					{ items.item.itemKey : 'businesskey here'}
     *
     */
    get(instanceQuery) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.restore(instanceQuery);
        });
    }
    restore(instanceQuery) {
        return __awaiter(this, void 0, void 0, function* () {
            // need to load instance first
            let execution;
            const instance = yield this.dataStore.findInstance(instanceQuery, 'Full');
            const live = this.cache.getInstance(instance.id);
            if (live) {
                execution = live;
            }
            else {
                execution = yield __1.Execution.restore(this.server, instance);
                /* new dataStore for every execution to be monitored
                const newDataStore = new DataStore(execution.server);
                execution.server.dataStore = newDataStore;
    
                newDataStore.monitorExecution(execution); */
                this.cache.add(execution);
                this.logger.log("restore completed");
            }
            return execution;
        });
    }
    invokeItem(itemQuery, data = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.invoke(itemQuery, data);
        });
    }
    /**
     * Continue an existing item that is in a wait state
     *
     * -------------------------------------------------
     * scenario:
     *		itemId			{itemId: value }
     *		itemKey			{itemKey: value}
     *		instance,task	{instanceId: instanceId, elementId: value }
     *
     * @param itemQuery		criteria to retrieve the item
     * @param data
     */
    invoke(itemQuery, data = {}, userKey = null, options = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            this.logger.log(`Action:engine.invoke`);
            this.logger.log(itemQuery);
            try {
                const items = yield this.server.dataStore.findItems(itemQuery);
                if (items.length > 1) {
                    this.logger.error(`query produced more than ${items.length} items expecting only one`);
                }
                const item = items[0];
                if (!item) {
                    this.logger.error(`query produced no items for ${itemQuery}`);
                }
                const execution = yield this.restore({ "id": item.instanceId });
                if (userKey) {
                    execution.currentUser = this.iam.getCurrentUser(userKey);
                }
                execution.log("Action:engineInvoke " + JSON.stringify(itemQuery));
                execution.worker = execution.signal(item.id, data);
                if (options['noWait'] == true) {
                    return execution;
                }
                else {
                    const waiter = yield execution.worker;
                    this.logger.log(`..engine.continue execution ended saving.. `);
                    this.logger.log(`.engine.continue ended`);
                    return execution;
                }
            }
            catch (exc) {
                return this.logger.error(exc);
            }
        });
    }
    /**
     *
     * Invoking an event (usually start event of a secondary process) against an existing instance
     * or
     * Invoking a start event (of a secondary process) against an existing instance
     * ----------------------------------------------------------------------------
     *	 instance,task
     *```
     *	{instanceId: instanceId, elementId: value }
     *```
     *
     * @param instanceId
     * @param elementId
     * @param data
     */
    startEvent(instanceId, elementId, data = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            // need to load instance first
            this.logger.log('serverinvokeSignal');
            try {
                const execution = yield this.restore({ "id": instanceId });
                yield execution.signal(elementId, data);
                yield this.server.dataStore.save(execution.instance);
                this.logger.log("invoke completed");
                return execution;
            }
            catch (exc) {
                return this.logger.error(exc);
            }
        });
    }
    throwMessage(messageId, data = {}, matchingQuery = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            this.logger.log('..Action:engine.throwMessage ', messageId, data, matchingQuery);
            if (!messageId)
                return null;
            // need to load instance first
            const eventsQuery = { "events.messageId": messageId };
            const events = yield this.definitions.findEvents(eventsQuery);
            this.logger.log('..findEvents ' + events.length);
            if (events.length > 0) {
                const event = events[0];
                this.logger.log('..Action:engine.throwMessage found target event ', event.modelName, data, event.elementId, event.elementId);
                return yield this.start(event.modelName, data, event.elementId, event.elementId);
            }
            let itemsQuery = {};
            if (matchingQuery)
                itemsQuery = Object.assign({}, matchingQuery);
            itemsQuery["items.messageId"] = messageId;
            itemsQuery["items.status"] = 'wait';
            const items = yield this.dataStore.findItems(itemsQuery);
            console.log('throw message itemsQuery:', itemsQuery, items.length);
            if (items.length > 0) {
                const item = items[0];
                console.log(`Throw Signal ${messageId} found target: ${item.processName} ${item.id}`);
                this.logger.log('..Action:engine.throwMessage found target ', item.processName, item.id);
                return yield this.invoke({ "items.id": item.id }, data);
            }
            return null;
        });
    }
    /**
     *
     * signal/message raise a signal or throw a message
     *
     * will seach for a matching event/task given the signalId/messageId
     *
     * that can be againt a running instance or it may start a new instance
     * ----------------------------------------------------------------------------
     * @param messageId		the id of the message or signal as per bpmn definition
     * @param matchingQuery	should match the itemKey (if specified)
     * @param data			message data
     */
    throwSignal(signalId, data = {}, matchingQuery = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            this.logger.log('..Action:engine.Throw Signal ', signalId, data, matchingQuery);
            var instances = [];
            if (!signalId)
                return null;
            // need to load instance first
            const eventsQuery = { "events.signalId": signalId };
            const events = yield this.definitions.findEvents(eventsQuery);
            this.logger.log('..findEvents ' + events.length);
            if (events.length > 0) {
                for (var i = 0; i < events.length; i++) {
                    let event = events[i];
                    this.logger.log('..Action:engine.Throw Signal found target', event.modelName, data, event.elementId);
                    var res = yield this.start(event.modelName, data, event.elementId, null);
                    instances.push(res.instance.id);
                }
            }
            let itemsQuery = {};
            if (matchingQuery)
                itemsQuery = Object.assign({}, matchingQuery);
            itemsQuery["items.signalId"] = signalId;
            itemsQuery["items.status"] = 'wait';
            const items = yield this.dataStore.findItems(itemsQuery);
            console.log('throw signal itemsQuery:', itemsQuery, items.length);
            if (items.length > 0) {
                for (var i = 0; i < items.length; i++) {
                    let item = items[i];
                    console.log(`Throw Signal ${signalId} found target: ${item.processName} ${item.id}`);
                }
                for (var i = 0; i < items.length; i++) {
                    let item = items[i];
                    //				console.log(`Throw Signal ${signalId} found target: ${item.processName} ${item.id}`);
                    this.logger.log('..Action:engine.Throw Signal found target', item.processName, item.id);
                    var res = yield this.invoke({ "items.id": item.id }, data);
                    instances.push(res.instance.id);
                }
            }
            return instances;
        });
    }
}
exports.Engine = Engine;
//# sourceMappingURL=Engine.js.map