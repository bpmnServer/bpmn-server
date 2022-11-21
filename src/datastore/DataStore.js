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
const ServerComponent_1 = require("../server/ServerComponent");
const acl_1 = require("../acl/");
const fs = require('fs');
const MongoDB = require('./MongoDB').MongoDB;
const Instance_collection = 'wf_instances';
const Events_collection = 'wf_events';
class DataStore extends ServerComponent_1.ServerComponent {
    constructor(server) {
        super(server);
        this.isModified = false;
        this.isRunning = false;
        this.inSaving = false;
        this.promises = [];
        this.dbConfiguration = this.configuration.database.MongoDB;
        this.db = new MongoDB(this.dbConfiguration, this.logger);
    }
    /*monitorExecution(execution: Execution) {
        this.execution = execution;
        const listener = execution.listener;
    } */
    save(instance) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.saveInstance(instance);
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
            //		this.logger.log(" instance obj found" + instanceData.id);
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
                    i['instanceId'] = instance.id;
                    items.push(i);
                }
            });
        });
        return items.sort(function (a, b) { return (a.seq - b.seq); });
    }
    saveInstance(instance) {
        return __awaiter(this, void 0, void 0, function* () {
            //		this.logger.log("Saving...");
            //var json = JSON.stringify(instance.state, null, 2);
            const tokensCount = instance.tokens.length;
            let itemsCount = instance.items.length;
            //		this.logger.log('saving instance ' + tokensCount + " tokens and items: " + itemsCount);
            var recs;
            if (!instance.saved) {
                instance.saved = new Date().toISOString();
                //this.promises.push(this.db.insert(this.dbConfiguration.db, Instance_collection, [instance]));
                //this.promises.push(this.db.insert(this.dbConfiguration.db, Instance_collection, [instance]));
                yield this.db.insert(this.dbConfiguration.db, Instance_collection, [instance]);
                //			this.logger.log("inserting instance");
            }
            else {
                this.promises.push(this.db.update(this.dbConfiguration.db, Instance_collection, { id: instance.id }, {
                    $set: {
                        tokens: instance.tokens, items: instance.items, loops: instance.loops,
                        endedAt: instance.endedAt, status: instance.status, saved: instance.saved,
                        logs: instance.logs, data: instance.data,
                        involvements: instance.involvements,
                        authorizations: instance.authorizations
                    }
                }));
                //			this.logger.log("updating instance");
            }
            /*t fileName = instance.name + '_' + DataStore.seq++ + '.state';
            await fs.writeFile(fileName, JSON.stringify(instance), function (err) {
                if (err) throw err;
            });*/
            yield Promise.all(this.promises);
            this.logger.log('..DataStore:saving Complete');
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
            const rec = results[0];
            this.convertColl(rec.authorizations, acl_1.Authorization);
            this.convertColl(rec.involvements, acl_1.Involvement);
            rec.items.forEach(item => {
                this.convertColl(item.authorizations, acl_1.Authorization);
                this.convertColl(item.assignments, acl_1.Assignment);
                this.convertColl(item.notifications, acl_1.Notification);
            });
            return rec;
        });
    }
    convertObj(obj, cls) {
        return Object.assign(new cls, obj);
    }
    convertColl(coll, cls) {
        if (coll) {
            for (let i = 0; i < coll.length; i++) {
                const el = coll[i];
                coll[i] = Object.assign(new cls, el);
            }
        }
    }
    findInstances(query, option = 'summary') {
        return __awaiter(this, void 0, void 0, function* () {
            let projection;
            if (option == 'summary')
                projection = { source: 0, logs: 0 };
            else
                projection = {};
            var records = yield this.db.find(this.dbConfiguration.db, Instance_collection, query, projection);
            return records;
        });
    }
    /**
            * scenario:
            * itemId			{ items { id : value } }
            * itemKey			{ items {key: value } }
            * instance, task	{ instance: { id: instanceId }, items: { elementId: value }}
            * message			{ items: { messageId: nameofmessage, key: value } {}
            * status			{ items: {status: 'wait' } }
            * custom: { query: query, projection: projection }

    New approach:
        just like MongoDB
            * itemId			{ items { id : value } }
            * itemKey			{ items {key: value } }
            * instance, task	{  id: instanceId , items.elementId: value }
            * message			{ items.messageId: nameofmessage, key: value } {}
            * status			{ items.status: 'wait' } }
            * custom: { query: query, projection: projection }

     Problem with Mongodb:	projection $elematch returns only the first record
     *
     * @param query
     */
    findItems(query) {
        return __awaiter(this, void 0, void 0, function* () {
            // let us rebuild the query form {status: value} to >  "tokens.items.status": "wait" 
            const result = this.translateCriteria(query);
            var records = yield this.db.find(this.dbConfiguration.db, Instance_collection, result.query, result.projection);
            this.logger.log('...find items for ' + JSON.stringify(query) + " result :" + JSON.stringify(result) + " recs:" + records.length);
            return this.getItemsFromInstances(records, result.match);
        });
    }
    translateCriteria(query) {
        let match = {};
        let hasMatch = false;
        let projection = {};
        {
            let newQuery = {};
            Object.keys(query).forEach(key => {
                let val = query[key];
                if (key.startsWith('items.')) {
                    key = key.replace('items.', '');
                    match[key] = val;
                    hasMatch = true;
                }
                else
                    newQuery[key] = val;
            });
            if (hasMatch) {
                newQuery['items'] = { $elemMatch: match };
                projection = { id: 1, data: 1, name: 1, "items": 1 }; // { $elemMatch: match } };
                query = newQuery;
            }
            else
                projection = { id: 1, data: 1, name: 1, "items": 1 };
        }
        return { query: query, projection: projection, match };
    }
    translateCriteria2(criteria) {
        let match = {};
        let query = {};
        let projection = {};
        if (criteria.query) {
            let query = criteria.query;
            let projection;
            if (!criteria.projection) {
                Object.keys(query).forEach(key => {
                    if (key.startsWith('items.')) {
                        let val = query[key];
                        key = key.replace('items.', '');
                        match[key] = val;
                    }
                });
                if (Object.keys(match).length == 0)
                    projection = { id: 1, data: 1, name: 1 };
                else
                    projection = { id: 1, data: 1, name: 1, "items": { $elemMatch: match } };
            }
            else
                projection = criteria.projection;
            return { query: criteria.query, projection: projection };
        }
        const instance = criteria.instance;
        const items = criteria.items;
        if (instance) {
            Object.keys(instance).forEach(key => {
                query[key] = instance[key];
            });
        }
        if (items && Object.keys(items).length > 0) {
            Object.keys(items).forEach(key => {
                match[key] = items[key];
                query["items." + key] = items[key];
            });
            projection = { id: 1, data: 1, name: 1, "items": { $elemMatch: match } };
        }
        return { query, projection };
        // { "items": { $elemMatch: { type: 'bpmn:StartEvent' } } }
        Object.keys(criteria).forEach(key => {
            query[key] = criteria[key];
            if (key.startsWith("items.")) {
                match[key] = criteria[key];
            }
        });
        projection = { id: 1, data: 1, name: 1, "items": { $elemMatch: match } };
        return { query, projection };
        if (criteria.itemId) {
            query = { "items.id": criteria.itemId };
            projection = { id: 1, data: 1, name: 1, "items": { $elemMatch: { id: criteria.itemId } } };
        }
        else if (criteria.status) {
            query = { "items.status": criteria.status };
            projection = { id: 1, data: 1, name: 1, "items": { $elemMatch: { status: criteria.status } } };
        }
        else if (criteria.itemKey) {
            query = { "items.itemKey": criteria.itemKey };
            projection = { id: 1, data: 1, name: 1, "items": { $elemMatch: { itemKey: criteria.itemKey } } };
        }
        else if (criteria.data) {
            query = { "data": criteria.data };
            projection = { id: 1, data: 1, name: 1, "items": { $elemMatch: { itemKey: criteria.itemKey } } };
        }
        else if (criteria.instanceId) {
            query = { "id": criteria.instanceId };
            projection = { id: 1, data: 1, name: 1, "items": { $elemMatch: { "elementId": criteria.elementId } } };
        }
        else
            return { query: null, projection: null };
        return { query, projection };
    }
    deleteInstances(query) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.cache.shutdown();
            return yield this.db.remove(this.dbConfiguration.db, Instance_collection, query);
        });
    }
    // db.collection.createIndex({ "a.loc": 1, "a.qty": 1 }, { unique: true })
    /**
     * first time installation of DB
     *
     * creates a new collection and add an index
     *
     * */
    install() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db.createIndex(this.dbConfiguration.db, Instance_collection, { id: 1 }, { unique: true });
        });
    }
}
exports.DataStore = DataStore;
// save instance to DB
DataStore.seq = 0;
//# sourceMappingURL=DataStore.js.map