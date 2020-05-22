'use strict';
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
const { v4: uuidv4 } = require('uuid');
class DataStore {
    constructor(configuration, logger) {
        this.dbConfiguration = configuration.database.MongoDB;
        this.db = new MongoDB(this.dbConfiguration, logger);
        this.logger = logger;
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
            let items = yield this.findItems({ instanceId: instanceId });
            this.logger.log("loadItems: for " + items.length + "instanceId :" + instanceId);
            return { instance: instanceData, items };
        });
    }
    // save instance to DB
    saveInstance(instance) {
        return __awaiter(this, void 0, void 0, function* () {
            this.logger.log("Saving...");
            var json = JSON.stringify(instance.state, null, 2);
            fs.writeFileSync('../state.json', json);
            this.logger.log('saving instances');
            var recs;
            var promises = [];
            if (instance.dbAction == 'add') {
                if (instance.id == null)
                    instance.id = uuidv4();
                let dataObject = instance.getDataObject();
                dataObject.state = json;
                dataObject.logs = instance.logs;
                promises.push(this.db.insert(this.dbConfiguration.db, this.dbConfiguration.instance_collection, [dataObject]));
                instance.dbAction = null;
                this.logger.log("inserting instance logs count: " + instance.logs.length);
            }
            else {
                promises.push(this.db.update(this.dbConfiguration.db, this.dbConfiguration.instance_collection, { id: instance.id }, { $set: { state: json, logs: instance.logs, endAt: instance.endAt } }));
                this.logger.log("updating instance logs count:" + instance.logs.length);
            }
            this.logger.log('saving items');
            this.saveItems(instance, promises);
            yield Promise.all(promises);
            this.logger.log('saving Complete');
        });
    }
    //	 invoked at end of run
    // save revised items
    saveItems(instance, promises) {
        return __awaiter(this, void 0, void 0, function* () {
            let newItems = [];
            let i = 0;
            let updates = 0;
            let items = instance.getItems();
            for (i = 0; i < items.length; i++) {
                let item = items[i];
                item.instanceId = instance.id;
                if (item.dbAction == 'add') {
                    newItems.push(item.getDataObject(instance));
                    item.dbAction = null;
                    this.logger.log("	adding item task id " + item.taskId + " status " + item.status);
                }
                else if (item.dbAction == 'update') {
                    promises.push(this.db.update(this.dbConfiguration.db, this.dbConfiguration.item_collection, { id: item.id }, { $set: { status: item.status, endAt: item.endAt } }));
                    updates++;
                    this.logger.log("	updated task id " + item.taskId + " status " + item.status);
                }
            }
            if (newItems.length > 0) {
                promises.push(this.db.insert(this.dbConfiguration.db, this.dbConfiguration.item_collection, newItems));
                this.logger.log("inserted " + newItems.length + " items ");
            }
            instance.items.forEach(item => { item.dbAction = null; });
        });
    }
    findItem(query) {
        return __awaiter(this, void 0, void 0, function* () {
            let results = yield this.findItems(query);
            if (results.length == 0)
                throw Error(" No records found");
            else if (results.length > 1)
                throw Error(" More than one record found " + results.length);
            else
                return results[0];
        });
    }
    findInstance(query, options) {
        return __awaiter(this, void 0, void 0, function* () {
            let results = yield this.findInstances(query, options);
            if (results.length == 0)
                throw Error(" No records found");
            else if (results.length > 1)
                throw Error(" More than one record found " + results.length);
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
            var records = yield this.db.find(this.dbConfiguration.db, this.dbConfiguration.instance_collection, query, projection);
            return records;
        });
    }
    findItems(query) {
        return __awaiter(this, void 0, void 0, function* () {
            var records = yield this.db.find(this.dbConfiguration.db, this.dbConfiguration.item_collection, query);
            return records;
        });
    }
    deleteData(instanceId = null) {
        return __awaiter(this, void 0, void 0, function* () {
            if (instanceId) {
                yield this.db.remove(this.dbConfiguration.db, this.dbConfiguration.item_collection, { instanceId: instanceId });
                yield this.db.remove(this.dbConfiguration.db, this.dbConfiguration.instance_collection, { id: instanceId });
            }
            else {
                yield this.db.remove(this.dbConfiguration.db, this.dbConfiguration.item_collection, {});
                yield this.db.remove(this.dbConfiguration.db, this.dbConfiguration.instance_collection, {});
            }
        });
    }
}
exports.DataStore = DataStore;
//# sourceMappingURL=DataStore.js.map