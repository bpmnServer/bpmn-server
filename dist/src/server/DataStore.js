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
exports.DataStore = void 0;
const fs = require('fs');
const MongoDB = require('./MongoDB').MongoDB;
//import { IDataStore } from './API';
/*
 * Data Query:
 *
 * { "items": { $elemMatch: { type: 'bpmn:StartEvent' } } }
 *
 */
const Instance_collection = 'wf_instances';
class DataStore {
    constructor(configuration, logger) {
        this.isModified = false;
        this.isRunning = false;
        this.inSaving = false;
        this.promises = [];
        this.saveCounter = 0;
        this.logger = logger;
        this.dbConfiguration = configuration.database.MongoDB;
        this.db = new MongoDB(this.dbConfiguration, this.logger);
    }
    monitorExecution(execution) {
        this.execution = execution;
        const listener = execution.listener;
        this.setListener(listener);
    }
    setListener(listener) {
        let self = this;
        listener.on('end', function (event, object) {
            return __awaiter(this, void 0, void 0, function* () {
                if (!self.isRunning) {
                    yield self.check();
                }
            });
        });
        listener.on('wait', function (event, object) {
            return __awaiter(this, void 0, void 0, function* () {
                if (!self.isRunning) {
                    yield self.check();
                }
            });
        });
        /* done by the server
        listener.on(EXECUTION_EVENT.execution_invoke, function (event, object) {
            self.isModified = true;
            self.isRunning = true;
        });
        listener.on(EXECUTION_EVENT.execution_execute, function (event, object) {
            self.isModified = true;
            self.isRunning = true;
        });
        listener.on(EXECUTION_EVENT.execution_invoked,async function (event, object) {
            self.isRunning = false;
            await self.save();

        });
        listener.on(EXECUTION_EVENT.execution_executed,async function (event, object) {
            self.isRunning = false;
            await self.save();
        });
        */
    }
    save() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.inSaving) {
                // come back please
                this.saveCounter++; /// will do it after I am done
                this.logger.log(" in saving take a number #" + this.saveCounter);
                return;
                //			await Promise.all(this.promises);
                //			this.inSaving = false;
            }
            let currentCounter = this.saveCounter;
            this.inSaving = true;
            if (this.isModified) {
                this.logger.log('DataStore: saving ');
                let state = yield this.execution.getState();
                if (state.saved !== this.execution.saved) {
                    console.log("********* ERROR OLD State****");
                }
                yield this.saveInstance(state, this.execution.getItems());
                this.execution.saved = new Date().toISOString();
                ;
                this.logger.log('DataStore: saved ' + this.execution.saved);
                while (this.saveCounter > currentCounter) { // will do it again
                    this.logger.log('DataStore:while i was busy other changes happended' + this.saveCounter);
                    currentCounter = this.saveCounter;
                    state = yield this.execution.getState();
                    yield this.saveInstance(state, this.execution.getItems());
                    this.execution.saved = new Date().toISOString();
                    ;
                    this.logger.log('DataStore: saved again ' + this.execution.saved);
                }
                this.isModified = false;
            }
            this.inSaving = false;
        });
    }
    check() {
        return __awaiter(this, void 0, void 0, function* () {
            this.logger.log('DataStore: instance modified...');
            this.isModified = true;
            setTimeout(this.save.bind(this), 500);
        });
    }
    loadInstance(instanceId) {
        return __awaiter(this, void 0, void 0, function* () {
            const recs = yield this.findInstances({ id: instanceId }, 'full');
            if (recs.length == 0) {
                this.logger.error("Instance is not found for this item");
                return null;
            }
            const instanceData = recs[0];
            this.logger.log(" instance obj found" + instanceData.id);
            return { instance: instanceData, items: this.getItemsFromInstances([instanceData]) };
        });
    }
    getItemsFromInstances(instances, condition = null) {
        const items = [];
        instances.forEach(instance => {
            instance.items.forEach(i => {
                let pass = true;
                if (condition) {
                    const keys = Object.keys(condition);
                    keys.forEach(key => {
                        if (i[key] != condition[key])
                            pass = false;
                    });
                }
                if (pass) {
                    i['processName'] = instance.name;
                    i['data'] = instance.data;
                    items.push(i);
                }
            });
        });
        return items.sort(function (a, b) { return (a.seq - b.seq); });
    }
    // save instance to DB
    saveInstance(instance, items) {
        return __awaiter(this, void 0, void 0, function* () {
            this.logger.log("Saving...");
            //var json = JSON.stringify(instance.state, null, 2);
            const tokensCount = instance.tokens.length;
            let itemsCount = instance.items.length;
            this.logger.log('saving instance ' + tokensCount + " tokens and items: " + itemsCount);
            var recs;
            if (!instance.saved) {
                instance.saved = new Date().toISOString();
                ;
                //this.promises.push(this.db.insert(this.dbConfiguration.db, Instance_collection, [instance]));
                this.promises.push(this.db.insert(this.dbConfiguration.db, Instance_collection, [instance]));
                this.logger.log("inserting instance");
            }
            else {
                this.promises.push(this.db.update(this.dbConfiguration.db, Instance_collection, { id: instance.id }, {
                    $set: {
                        tokens: instance.tokens, items: instance.items, loops: instance.loops,
                        endedAt: instance.endedAt, status: instance.status, saved: instance.saved, logs: instance.logs, data: instance.data
                    }
                }));
                this.logger.log("updating instance");
            }
            yield Promise.all(this.promises);
            this.logger.log('DataStore:saving Complete');
        });
    }
    findItem(query) {
        return __awaiter(this, void 0, void 0, function* () {
            let results = yield this.findItems(query);
            if (results.length == 0)
                throw Error(" No items found for " + JSON.stringify(query));
            else if (results.length > 1)
                throw Error(" More than one record found " + results.length + JSON.stringify(query));
            else
                return results[0];
        });
    }
    findInstance(query, options) {
        return __awaiter(this, void 0, void 0, function* () {
            let results = yield this.findInstances(query, options);
            if (results.length == 0)
                throw Error(" No instance found for " + JSON.stringify(query));
            else if (results.length > 1)
                throw Error(" More than one record found " + results.length + JSON.stringify(query));
            else
                return results[0];
        });
    }
    findInstances(query, option = 'summary') {
        return __awaiter(this, void 0, void 0, function* () {
            let projection;
            if (option == 'summary')
                projection = { state: 0, logs: 0 };
            else if (option == 'full')
                projection = { state: 0 };
            else
                projection = {};
            var records = yield this.db.find(this.dbConfiguration.db, Instance_collection, query, projection);
            return records;
        });
    }
    findItems(query) {
        return __awaiter(this, void 0, void 0, function* () {
            // let us rebuild the query form {status: value} to >  "tokens.items.status": "wait" 
            let newQuery = { "items.status": query.status };
            var records = yield this.db.find(this.dbConfiguration.db, Instance_collection, newQuery);
            return this.getItemsFromInstances(records, query);
        });
    }
    deleteData(instanceId = null) {
        return __awaiter(this, void 0, void 0, function* () {
            if (instanceId) {
                yield this.db.remove(this.dbConfiguration.db, Instance_collection, { id: instanceId });
            }
            else {
                yield this.db.remove(this.dbConfiguration.db, Instance_collection, {});
            }
        });
    }
}
exports.DataStore = DataStore;
//# sourceMappingURL=DataStore.js.map