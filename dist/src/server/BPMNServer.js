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
exports.BPMNServer = void 0;
const Logger_1 = require("../common/Logger");
const DefaultHandler_1 = require("../common/DefaultHandler");
const DataStore_1 = require("./DataStore");
const engine_1 = require("../engine");
const Definition_1 = require("../elements/Definition");
const fs = require('fs');
// import { IContext, IInstance, ILogger, IConfiguration, IInstanceItem } from './API';
let CacheManager = /** @class */ (() => {
    class CacheManager {
        static getList() {
            const items = [];
            CacheManager.liveInstances.forEach(item => { items.push(item); });
            return items;
        }
        /**
        **/
        static getInstance(instanceId) {
            const instance = CacheManager.liveInstances.get(instanceId);
            return instance;
        }
        static add(execution) {
            CacheManager.liveInstances.set(execution.id, execution);
        }
        static remove(instanceId) {
            CacheManager.liveInstances.delete(instanceId);
        }
    }
    CacheManager.liveInstances = new Map();
    return CacheManager;
})();
class ServerContext {
    constructor(configuration, user, logger = null) {
        this.configuration = configuration;
        if (logger == null)
            logger = new Logger_1.Logger({});
        this.user = user;
        this.logger = logger;
    }
}
/*
 *	The main class of Server Layer
 *	provides the full functionalities:
 *
 *		1.	access to Execution engine
 *		2.	data Presistence through DataStore class
 *		3.	access to models definitions, loading and saving of models
 *		4.	access to BPMN definition details
 *
 *		primary Use Cases:
 *		a.	execute a process
 *			server= new BPMNServer(...);
 *			server.execute(...);
 *
 *		b.	invoke a task in an already started process
 *			server= new BPMNServer(...);
 *			server.invoke(...);
 *
 *		c.	find items (various options)
  *			server= new BPMNServer(...);
 *			server.findItems(...);
*/
class BPMNServer {
    /**
     * Server Constructor
     *
     * @param configuration	see
     * @param logger
     */
    constructor(configuration, logger = null) {
        this.configuration = configuration;
        if (logger == null) {
            logger = new Logger_1.Logger({});
        }
        this.logger = logger;
        this.logger.log("new Server");
        this.dataStore = new DataStore_1.DataStore(configuration, logger);
    }
    /**
    **/
    static getLives() {
        return CacheManager.getList();
    }
    /**
    **/
    static getLive(instanceId) {
        return CacheManager.getInstance(instanceId);
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            //		const items = Timer.getDueTimers(this.definitions, this.configuration);
            //		items.forEach(timer => {
            //		});
        });
    }
    //	is called to start all instances that were shutdown
    restart() {
        return __awaiter(this, void 0, void 0, function* () {
            this.logger.log("Restarting..");
            const list = yield this.findInstances({ endAt: null });
            const self = this;
            let i;
            for (i = 0; i < list.length; i++) {
                const instance = list[i];
                self.logger.log("..restoring instance " + instance.id);
                yield self.restore({ "id": instance.id });
                self.logger.log("..count :" + CacheManager.getList().length);
            }
        });
    }
    //	shutsdown all instances that are still live
    shutdown() {
        return __awaiter(this, void 0, void 0, function* () {
            this.logger.log("Shutdown..");
            const instannces = CacheManager.liveInstances;
            let i = 0;
            const list = [];
            instannces.forEach(item => { list.push(item); });
            for (i = 0; i < list.length; i++) {
                const engine = list[i];
                yield engine.stop();
                this.logger.log("shutdown engine " + engine.name + " status : " + engine.state);
                instannces.delete(list[i].id);
            }
        });
    }
    /*
     *	loads a definition
     *
     */
    loadDefinition(name, source) {
        return __awaiter(this, void 0, void 0, function* () {
            const definitions = this.configuration.definitions;
            if (!source) {
                source = definitions.getSource(name);
            }
            const definition = new Definition_1.Definition(name, source, this.logger);
            yield definition.load();
            return definition;
        });
    }
    /*
     *	loads a definitions and start execution
     *
     */
    execute(name, user, data = {}, source = null, engineClassPath = this.configuration.engineClassPath, callback = null, services = null, extensions = null) {
        return __awaiter(this, void 0, void 0, function* () {
            const definitions = this.configuration.definitions;
            if (!source)
                source = definitions.getSource(name);
            const context = new ServerContext(this.configuration, user, this.logger);
            const execution = new engine_1.Execution(name, source, this.configuration.appDelegate, this.logger);
            const ds = new DataStore_1.DataStore(this.configuration, this.logger);
            ds.monitorExecution(execution);
            CacheManager.add(execution);
            yield execution.execute(null, data);
            const state = yield execution.getState();
            yield fs.writeFile('state.txt', JSON.stringify(state), function (err) {
                if (err)
                    throw err;
            });
            yield ds.save();
            context.execution = execution;
            context.dataStore = ds;
            console.log("returning execute");
            return context;
        });
    }
    restore(query) {
        return __awaiter(this, void 0, void 0, function* () {
            // need to load instance first
            const instance = yield this.dataStore.findInstance(query);
            const context = new ServerContext(this.configuration, null, this.logger);
            const execution = yield engine_1.Execution.restore(instance, new DefaultHandler_1.DefaultHandler(this.logger), this.logger);
            const ds = new DataStore_1.DataStore(this.configuration, this.logger);
            ds.monitorExecution(execution);
            CacheManager.add(execution);
            context.execution = execution;
            context.dataStore = ds;
            console.log("restore completed");
            return context;
        });
    }
    invoke(itemId, user, data = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            // need to load instance first
            console.log(itemId);
            const context = yield this.restore({ "items.id": itemId });
            const execution = context.execution;
            yield execution.signal(itemId, data);
            yield context.dataStore.save();
            console.log("invoke completed");
            return context;
        });
    }
    findItems(query) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.dataStore.findItems(query);
            }
            catch (err) {
                Error(err);
            }
        });
    }
    findInstances(query, view = 'summary') {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.dataStore.findInstances(query, view);
            }
            catch (err) {
                Error(err);
            }
        });
    }
    deleteData(instanceId = null) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (instanceId == null)
                    this.shutdown();
                else
                    CacheManager.remove(instanceId);
                return yield this.dataStore.deleteData(instanceId);
            }
            catch (err) {
                Error(err);
            }
        });
    }
}
exports.BPMNServer = BPMNServer;
//# sourceMappingURL=BPMNServer.js.map