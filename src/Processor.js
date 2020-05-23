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
exports.Processor = void 0;
const WFInstance_1 = require("./WFInstance");
const { Engine } = require('bpmn-engine');
const events_1 = require("events");
const ItemInstance_1 = require("./ItemInstance");
const BPMNServer_1 = require("./BPMNServer");
const DefaultEngine_1 = require("./DefaultEngine");
const CacheManager_1 = require("./CacheManager");
const API_1 = require("./API");
const DataStore_1 = require("./DataStore");
/**
 * is invoked when the server is invoked for execute/invoke
 * */
class Processor {
    constructor(context, dataStore) {
        this.events = [];
        this.logStart = 0;
        this.context = context;
        this.dataStore = dataStore;
        this.logger = context.logger;
    }
    // Ilogger Implementation 
    setOptions(options) {
        return this.logger.setOptions(options);
    }
    log(msg) {
        if (this.instance)
            this.instance.logs.push('log:' + msg);
        this.logger.log(msg);
    }
    debug(msg) {
        if (this.instance)
            this.instance.logs.push('debug:' + msg);
        this.logger.debug(msg);
    }
    error(msg) {
        if (this.instance)
            this.instance.logs.push('error:' + msg);
        this.logger.error(msg);
    }
    clear() {
        return this.logger.clear();
    }
    // Ilogger Implementation 
    result() {
        this.context.instance = this.instance;
        this.context.engine = this.engine;
        this.context.error = null;
        this.context.events = this.events;
        return this.context;
        //		return { instance: this.instance, engine: this.engine, events: this.events, logs: this.logs , error: null };
    }
    notify(event, ...args) {
        this.context.notify(event, ...args);
    }
    /**
     * execute
     */
    execute(name, data, source, engineClassPath, callback, services, extensions) {
        return __awaiter(this, void 0, void 0, function* () {
            this.instance = new WFInstance_1.WFInstance('add');
            this.log("Action:execute  " + name + "data:" + JSON.stringify(data));
            this.notify(API_1.EventType.Instance_create, this.instance);
            try {
                let src = source;
                if (!src)
                    src = this.context.configuration.definitions.getSource(name);
                if (src == null)
                    this.error('Defintion named:' + name + ' has no source');
                yield this.start(this.instance, {
                    name,
                    data,
                    source: src,
                    engineClassPath,
                    callback, services, extensions
                });
                this.log('caching instance ' + this.instance.id);
                return this.result();
            }
            catch (error) {
                this.error(error);
                /*			if (execution == null)
                                execution = new Execution(null,null,null);
                            execution.error = error;
                            return execution; */
            }
            finally {
            }
        });
    }
    /**
     * start a new process from source
     *
     * @param param0
     */
    start(instance, { name, source, data, engineClassPath, callback, services, extensions }) {
        return __awaiter(this, void 0, void 0, function* () {
            instance.data = data;
            instance.name = name;
            this.log('Starting ' + name + JSON.stringify(data));
            let engineClass = DefaultEngine_1.CustomEngine;
            if (engineClassPath)
                engineClass = this.loadEngineClass(engineClassPath);
            this.engine = new engineClass(this);
            this.engine.create({ name, source, services, extensions, variables: data });
            this.notify(API_1.EventType.Engine_create, this.engine);
            const listener = new events_1.EventEmitter();
            this.setListener(listener, this.engine.getImplemntingEngine());
            this.log("Starting engine");
            let self = this;
            CacheManager_1.CacheManager.add(this.instance, this.engine);
            yield this.engine.execute({ listener, variables: data, callback });
            this.notify(API_1.EventType.Engine_start, this.engine);
            // do saving here 
            yield this.save();
            return this.result();
        });
    }
    /**
     * restore an existing instance
     * @param instanceId to be restored
     * @param callback
     */
    restore(instanceId, callback) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let cachedEngine = BPMNServer_1.BPMNServer.getLive(instanceId);
                let execution;
                //		let cachedEngine = null;
                if (cachedEngine) {
                    this.log("Found current engine in cache");
                    this.instance = cachedEngine.instance;
                    this.engine = cachedEngine.engine;
                }
                else {
                    this.instance = yield this.loadInstance(instanceId);
                    this.notify(API_1.EventType.Instance_load, this.instance);
                    var stateObj = JSON.parse(this.instance.state);
                    let engineClass = DefaultEngine_1.CustomEngine;
                    if (this.instance.engineClassPath)
                        engineClass = this.loadEngineClass(this.instance.engineClassPath);
                    this.engine = new engineClass(this);
                    this.engine.recover(stateObj);
                    this.notify(API_1.EventType.Engine_recover, this.engine);
                    const listener = new events_1.EventEmitter();
                    this.setListener(listener, this.engine.getImplemntingEngine());
                    let self = this;
                    yield this.engine.resume({ listener: listener }, function () {
                        if (callback)
                            callback(this.engine, listener);
                        self.log(' resumed process completed');
                    });
                    this.notify(API_1.EventType.Engine_resume, this.engine);
                }
                CacheManager_1.CacheManager.add(this.instance, this.engine);
                return this.result();
            }
            catch (error) {
                this.error(error);
                return null;
            }
        });
    }
    /**
     * invoke an item in an existing instance; either currently running in cache or to be restored
     *
     * @param itemQuery
     * @param data
     * @param callback
     */
    invoke(itemQuery, user, data, callback) {
        return __awaiter(this, void 0, void 0, function* () {
            this.log("Action:Starting server invoke ");
            try {
                let invokingItem = yield this.findItemToInvoke(itemQuery);
                if (invokingItem == null)
                    return;
                yield this.restore(invokingItem.instanceId, null);
                this.log("Action:Starting server invoke " + invokingItem.taskId + " Data:" + JSON.stringify(data));
                let item = null;
                let i = 0;
                let items = this.instance.getItems({});
                for (i = 0; i < items.length; i++) {
                    if (items[i].id == invokingItem.id)
                        item = items[i];
                }
                if (item == null) {
                    this.error("Invoked item is not found in instance items id:" + invokingItem.id);
                    return null;
                }
                if (item.status == 'end') {
                    this.error("Item already completed" + item.id);
                    return null;
                }
                if (this.instance.state == null) {
                    this.error("State is not found for instance");
                    return null;
                }
                yield this.invokeItem(item, user, data);
                this.notify(API_1.EventType.Item_invoke, invokingItem);
                yield this.save();
                return this.result();
            }
            catch (error) {
                this.error(error);
                return { error };
            }
        });
    }
    invokeItem(invokingItem, user, itemData) {
        return __awaiter(this, void 0, void 0, function* () {
            this.log('invoke item ' + invokingItem.taskId + " Data:" + JSON.stringify(itemData));
            let item = this.instance.items.get(invokingItem.executionId);
            if (item && item.task != null) {
                let task = item.task;
                this.log(task.id + task.name + ' signalled');
                yield task.signal(itemData);
                item.itemData = itemData;
            }
            else {
                this.log(item);
                this.log(this.instance.getItems({}));
                this.error("**Error Invalid Item to be invoked**");
                return null;
            }
        });
    }
    loadEngineClass(path) {
        if (path) {
            this.log('Loading custom engine ' + path);
            let cls = require(path);
            return cls.CustomEngine;
        }
    }
    loadInstance(instanceId) {
        return __awaiter(this, void 0, void 0, function* () {
            let { instance: instanceData, items } = yield this.dataStore.loadInstance(instanceId);
            let instance = new WFInstance_1.WFInstance();
            instance.fromDataObject(instanceData);
            items.forEach(record => {
                let item = ItemInstance_1.ItemInstance.fromDB(record);
                instance.items.set(item.executionId, item);
            });
            return instance;
        });
    }
    findItemToInvoke(itemQuery) {
        return __awaiter(this, void 0, void 0, function* () {
            this.log(itemQuery);
            let items = yield this.dataStore.findItems(itemQuery);
            if (items.length == 0) {
                let newQuery = itemQuery;
                newQuery['name'] = null;
                newQuery['status'] = null;
                let allItems = yield this.dataStore.findItems(newQuery);
                this.log(" No item found" + JSON.stringify(items));
                this.error("Item not found for this query: " + JSON.stringify(itemQuery) + JSON.stringify(allItems));
                return null;
            }
            const invokingItem = items[0];
            return invokingItem;
        });
    }
    checkForSave() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.instance.modified)
                this.save();
        });
    }
    save() {
        return __awaiter(this, void 0, void 0, function* () {
            let state = yield this.engine.getState();
            this.instance.state = state;
            this.log("saving...");
            let saveDataStore = new DataStore_1.DataStore(this.context.configuration, this);
            yield saveDataStore.saveInstance(this.instance);
            this.notify(API_1.EventType.Instance_save, this.instance);
            this.instance.modified = false;
            this.log("saving ended.");
        });
    }
    ended() {
        return __awaiter(this, void 0, void 0, function* () {
            this.notify(API_1.EventType.Engine_idle, this.engine);
            let state = this.engine.getImplemntingEngine().state;
            this.log("saving and stopping..." + state);
            yield this.save();
            if (state == 'idle') {
                this.engine.stop();
                this.log("engine is now idle will be removed from cache");
                CacheManager_1.CacheManager.remove(this.instance.id);
            }
        });
    }
    /*
     *
     *	tracking items
     *
     *		1.	retrieve all items by instance id place in a map by execution id
     *		2.
     *		track all tasks processed in run (start, waiting and end)
     *			start	- record start time
     *			wait	- nothing
     *			end		- record end time
     *		at end of run
     *			check task status:
     *				insert	- if itemInstance is null
     *				update	- if itemInstance
     *
     */
    setListener(listener, engine) {
        listener.on('activity.timer', (task) => __awaiter(this, void 0, void 0, function* () {
            yield this.trackTask(task, API_1.EventType.Activity_timer);
        }));
        listener.on('activity.enter', (task) => __awaiter(this, void 0, void 0, function* () {
            yield this.trackTask(task, API_1.EventType.Activity_enter);
        }));
        listener.on('activity.end', (task, engine) => __awaiter(this, void 0, void 0, function* () {
            if (task.content.output)
                engine.environment.output[task.id] = task.content.output;
            yield this.trackTask(task, API_1.EventType.Activity_end);
        }));
        listener.on('wait', (task) => __awaiter(this, void 0, void 0, function* () {
            yield this.trackTask(task, API_1.EventType.Activity_wait);
        }));
        listener.on('flow.take', (flow) => __awaiter(this, void 0, void 0, function* () {
            this.recordEvent(API_1.EventType.Flow_take, flow);
        }));
        listener.on('flow.discard', (flow) => __awaiter(this, void 0, void 0, function* () {
            this.recordEvent(API_1.EventType.Flow_discard, flow);
        }));
        engine.once('end', (execution) => __awaiter(this, void 0, void 0, function* () {
            this.instance.endAt = new Date().toISOString();
            this.recordEvent(API_1.EventType.Process_end, execution);
            this.log("end of process execution.environment.output:" + JSON.stringify(execution.environment.output));
            this.log(execution.environment.variables);
            yield this.ended();
        }));
    }
    recordEvent(event, task) {
        this.events.push({ event, id: task.id });
    }
    trackTask(task, event) {
        return __awaiter(this, void 0, void 0, function* () {
            this.recordEvent(event, task);
            let modified = false;
            //		this.log("trackingTask event: " + event + " " + task.id + " execution id" + task.executionId);
            let msg = "event:task." + event + ": " + task.name + " Id: " + task.id + " type: " + task.type + " ";
            let item = this.instance.items.get(task.executionId);
            if (item == null) {
                item = ItemInstance_1.ItemInstance.fromTask(task, this.instance, event);
                let fields = yield this.getFields(task.id);
                if (fields) {
                    item.inputFields = fields;
                }
                item.user = this.context.user;
                if (item.dbAction == null) {
                    item.dbAction = 'add';
                }
                this.instance.items.set(task.executionId, item);
                modified = true;
            }
            else {
                if (item.dbAction == null)
                    item.dbAction = 'update';
                item.task = task;
                item.status = event.toString();
                if (event == API_1.EventType.Activity_end)
                    item.endAt = new Date().toISOString();
                if (event == API_1.EventType.Activity_timer) {
                    item.isoDuration = task.content.isoDuration;
                    item.timeout = task.content.timeout;
                }
                msg += " .item tracked" + item.id + " status: " + item.status + " action:" + item.dbAction;
                modified = true;
            }
            this.log(msg);
            if (modified) {
                this.instance.lastAt = new Date().toISOString();
                this.instance.lastItem = item.id;
                this.instance.lastStatus = item.status;
                if (!this.instance.modified) {
                    this.instance.modified = true;
                    let self = this;
                    setImmediate(function () {
                        checkForSave(self);
                    });
                }
            }
        });
    }
    getFields(taskId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.engine.getFields(taskId);
        });
    }
}
exports.Processor = Processor;
function checkForSave(processor) {
    processor.checkForSave();
}
//# sourceMappingURL=Processor.js.map