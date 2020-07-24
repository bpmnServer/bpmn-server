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
const ServerContext_1 = require("../server/ServerContext");
const events_1 = require("events");
const datastore_1 = require("../datastore");
class Engine extends ServerContext_1.ServerComponent {
    /**
     *	loads a definitions  and start execution
     *
     * @param name		name of the process to start
     * @param data		input data
     * @param startNodeId	in process has multiple start node; you need to specify which one
     */
    start(name, data = {}, listener = null, startNodeId = null, options = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            this.logger.log(`Action:engine.start ${name}`);
            const definitions = this.definitions;
            const source = yield definitions.getSource(name);
            if (!listener)
                listener = new events_1.EventEmitter();
            const executionContext = new __1.ExecutionContext(this.server);
            executionContext.listener = listener;
            const execution = new __1.Execution(name, source, executionContext);
            executionContext.execution = execution;
            // new dataStore for every execution to be monitored 
            const newDataStore = new datastore_1.DataStore(executionContext.server);
            executionContext.server.dataStore = newDataStore;
            newDataStore.monitorExecution(execution);
            this.cache.add(executionContext);
            yield execution.execute(startNodeId, data, options);
            yield executionContext.dataStore.save();
            this.logger.log(`.engine.start ended for ${name}`);
            return executionContext;
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
    get(instanceQuery, listener = null) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.restore(instanceQuery, listener);
        });
    }
    restore(instanceQuery, listener = null) {
        return __awaiter(this, void 0, void 0, function* () {
            // need to load instance first
            const instance = yield this.dataStore.findInstance(instanceQuery, 'Full');
            let executionContext;
            const live = this.cache.getInstance(instance.id);
            if (live) {
                executionContext = live;
            }
            else {
                executionContext = new __1.ExecutionContext(this.server);
                if (!listener)
                    listener = new events_1.EventEmitter();
                executionContext.listener = listener;
                const execution = yield __1.Execution.restore(instance, executionContext);
                executionContext.execution = execution;
                // new dataStore for every execution to be monitored 
                const newDataStore = new datastore_1.DataStore(executionContext.server);
                executionContext.server.dataStore = newDataStore;
                newDataStore.monitorExecution(execution);
                this.cache.add(executionContext);
                this.logger.log("restore completed");
            }
            return executionContext;
        });
    }
    invokeItem(itemQuery, data = {}, listener = null) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.invoke(itemQuery, data, listener);
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
    invoke(itemQuery, data = {}, listener = null) {
        return __awaiter(this, void 0, void 0, function* () {
            this.logger.log(`Action:engine.continue`);
            this.logger.log(itemQuery);
            let executionContext;
            try {
                const items = yield this.server.dataStore.findItems(itemQuery);
                if (items.length > 1) {
                    this.logger.error(`query produced more than ${items.length} items expecting only one`);
                }
                const item = items[0];
                if (!item) {
                    this.logger.error(`query produced no items`);
                }
                executionContext = yield this.restore({ "id": item.instanceId }, listener);
                executionContext.execution.log("Action:engineInvoke " + JSON.stringify(itemQuery));
                yield executionContext.execution.signal(item.id, data);
                this.logger.log(`..engine.continue execution ended saving.. `);
                yield executionContext.dataStore.save();
                this.logger.log(`.engine.continue ended`);
                return executionContext;
            }
            catch (exc) {
                return this.error(exc, executionContext);
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
    startEvent(instanceId, elementId, data = {}, listener = null) {
        return __awaiter(this, void 0, void 0, function* () {
            let context;
            // need to load instance first
            this.logger.log('serverinvokeSignal');
            try {
                context = yield this.restore({ "id": instanceId }, listener);
                const execution = context.execution;
                yield execution.signal(elementId, data);
                yield context.dataStore.save();
                this.logger.log("invoke completed");
                return context;
            }
            catch (exc) {
                return this.error(exc, context);
            }
        });
    }
    throwMessage(messageId, data = {}, matchingQuery = {}, listener = null) {
        return __awaiter(this, void 0, void 0, function* () {
            this.logger.log('Action:engine.throwMessage ' + messageId);
            // need to load instance first
            const eventsQuery = { "events.messageId": messageId };
            const events = yield this.definitions.findEvents(eventsQuery);
            this.logger.log('..findEvents ' + events.length);
            console.log(events);
            if (events.length > 0) {
                const event = events[0];
                return yield this.start(event.modelName, data, null, event.elementId);
            }
            let itemsQuery;
            if (matchingQuery)
                itemsQuery = Object.assign({}, matchingQuery);
            itemsQuery["items.messageId"] = messageId;
            const items = yield this.dataStore.findItems(itemsQuery);
            console.log(items);
            if (items.length > 0) {
                const item = items[0];
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
    throwSignal(messageId, data = {}, matchingQuery = {}, listener = null) {
        return __awaiter(this, void 0, void 0, function* () {
            this.logger.log('Action:engine.signal ' + messageId);
            // need to load instance first
            const eventsQuery = { "events.messageId": messageId };
            const events = yield this.definitions.findEvents(eventsQuery);
            this.logger.log('..findEvents ' + events.length);
            console.log(events);
            if (events.length > 0) {
                const event = events[0];
                return yield this.start(event.modelName, data, null, event.elementId);
            }
            let itemsQuery;
            if (matchingQuery)
                itemsQuery = Object.assign({}, matchingQuery);
            itemsQuery["items.messageId"] = messageId;
            const items = yield this.dataStore.findItems(itemsQuery);
            console.log(items);
            if (items.length > 0) {
                const item = items[0];
                return yield this.invoke({ "items.id": item.id }, data);
            }
            return null;
        });
    }
    error(exc, executionContext) {
        if (!executionContext)
            executionContext = new __1.ExecutionContext(this.server);
        executionContext.errors = exc;
        return executionContext;
    }
}
exports.Engine = Engine;
//# sourceMappingURL=Engine.js.map