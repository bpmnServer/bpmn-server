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
const { Engine } = require('bpmn-engine');
const DefaultLogger_1 = require("./DefaultLogger");
const Timer = require('./timer.js');
const DataStore_1 = require("./DataStore");
const Processor_1 = require("./Processor");
const CacheManager_1 = require("./CacheManager");
const events_1 = require("events");
class ServerContext {
    constructor(configuration, user, logger = null) {
        this.configuration = configuration;
        if (logger == null)
            logger = new DefaultLogger_1.DefaultLogger({});
        this.user = user;
        this.logger = logger;
        this.notifier = new ServerNotifier();
    }
    notify(event, ...args) {
        this.logger.log(">>Event: " + event);
        this.notifier.notify(event, ...args);
    }
}
/*
const serverNotifier = new ServerNotifier();
serverNotifier.on('event', () => {
    console.log('an event occurred!');
});
serverNotifier.notify(EventType.Server_Start);

 */
class ServerNotifier extends events_1.EventEmitter {
    notify(event, ...args) {
        return this.emit(event.toString(), args);
    }
}
class BPMNServer {
    constructor(configuration, logger = null) {
        this.configuration = configuration;
        if (logger == null) {
            logger = new DefaultLogger_1.DefaultLogger({});
        }
        this.dataStore = new DataStore_1.DataStore(configuration, logger);
        this.logger = logger;
        this.logger.log("new Server");
    }
    /**
    **/
    static getLives() {
        return CacheManager_1.CacheManager.getList();
    }
    /**
    **/
    static getLive(instanceId) {
        return CacheManager_1.CacheManager.getInstance(instanceId);
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            //		let items = Timer.getDueTimers(this.definitions, this.configuration);
            //		items.forEach(timer => {
            //		});
        });
    }
    //	is called to start all instances that were shutdown
    restart() {
        return __awaiter(this, void 0, void 0, function* () {
            this.logger.log("Restarting..");
            let list = yield this.findInstances({ endAt: null });
            let self = this;
            let i;
            for (i = 0; i < list.length; i++) {
                let instance = list[i];
                self.logger.log("..restoring instance " + instance.id);
                yield self.restore(instance.id);
                self.logger.log("..count :" + CacheManager_1.CacheManager.getList().length);
            }
        });
    }
    //	shutsdown all instances that are still live
    shutdown() {
        return __awaiter(this, void 0, void 0, function* () {
            this.logger.log("Shutdown..");
            let instannces = CacheManager_1.CacheManager.liveInstances;
            let i = 0;
            let list = [];
            instannces.forEach(item => { list.push(item); });
            for (i = 0; i < list.length; i++) {
                let engine = list[i].engine;
                yield engine.stop();
                this.logger.log("shutdown engine " + engine.name + " status : " + engine.state);
                instannces.delete(list[i].instance.id);
            }
        });
    }
    execute(name, user, data = {}, source = null, engineClassPath = this.configuration.engineClassPath, callback = null, services = null, extensions = null) {
        return __awaiter(this, void 0, void 0, function* () {
            let context = new ServerContext(this.configuration, user, this.logger);
            let processor = new Processor_1.Processor(context, this.dataStore);
            context = yield processor.execute(name, data, source, engineClassPath, callback, services, extensions);
            return context;
        });
    }
    restore(instanceId, callback = null) {
        return __awaiter(this, void 0, void 0, function* () {
            let context = new ServerContext(this.configuration, null, this.logger);
            let processor = new Processor_1.Processor(context, this.dataStore);
            context = yield processor.restore(instanceId, callback);
            return context;
        });
    }
    invoke(itemQuery, user, data = {}, callback = null) {
        return __awaiter(this, void 0, void 0, function* () {
            let context = new ServerContext(this.configuration, null, this.logger);
            let processor = new Processor_1.Processor(context, this.dataStore);
            context = yield processor.invoke(itemQuery, user, data, callback);
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
                    CacheManager_1.CacheManager.remove(instanceId);
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