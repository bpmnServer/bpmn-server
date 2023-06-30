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
exports.ModelsDatastoreDB = void 0;
const elements_1 = require("../elements");
const fs = require('fs');
const Path = require('path');
const BpmnModdle = require('bpmn-moddle');
const ServerComponent_1 = require("../server/ServerComponent");
const ModelsData_1 = require("./ModelsData");
const MongoDB = require('./MongoDB').MongoDB;
const Definition_collection = 'wf_models';
const Events_collection = 'wf_events';
class ModelsDatastoreDB extends ServerComponent_1.ServerComponent {
    constructor(server) {
        super(server);
        this.dbConfiguration = this.configuration.database.MongoDB;
        this.db = new MongoDB(this.dbConfiguration, this.logger);
    }
    getList() {
        return __awaiter(this, void 0, void 0, function* () {
            var records = yield this.db.find(this.dbConfiguration.db, Definition_collection, {}, {});
            this.logger.log('find events for ' + " recs:" + records.length);
            const list = [];
            records.forEach(r => { list.push(r.name); });
            return list;
        });
    }
    /*
     *	loads a definition
     *
     */
    load(name) {
        return __awaiter(this, void 0, void 0, function* () {
            let data = yield this.loadModel(name);
            const definition = new elements_1.Definition(name, data.source, this.server);
            yield definition.load();
            return definition;
        });
    }
    getSource(name) {
        return __awaiter(this, void 0, void 0, function* () {
            let model = yield this.loadModel(name);
            return model.source;
        });
    }
    getSVG(name) {
        return __awaiter(this, void 0, void 0, function* () {
            let model = yield this.loadModel(name);
            return model.svg;
        });
    }
    /*
     *	loads a definition data record from DB
     *
     */
    loadModel(name) {
        return __awaiter(this, void 0, void 0, function* () {
            var records = yield this.db.find(this.dbConfiguration.db, Definition_collection, { name: name }, {});
            this.logger.log('find model for  ' + name + " recs:" + records.length);
            return records[0];
        });
    }
    save(name, source, svg) {
        return __awaiter(this, void 0, void 0, function* () {
            let bpmnModelData = new ModelsData_1.BpmnModelData(name, source, svg, null, null);
            let definition = new elements_1.Definition(bpmnModelData.name, bpmnModelData.source, this.server);
            try {
                yield definition.load();
                bpmnModelData.parse(definition);
                yield this.saveModel(bpmnModelData);
                return bpmnModelData;
            }
            catch (exc) {
                console.log('error in save', exc);
                throw exc;
                return null;
            }
        });
    }
    findEvents(query) {
        return __awaiter(this, void 0, void 0, function* () {
            let projection = {}; // this.getProjection(query);
            var records = yield this.db.find(this.dbConfiguration.db, Definition_collection, query, projection);
            this.logger.log('...find events for ' + JSON.stringify(query) + " recs:" + records.length);
            const events = [];
            records.forEach(rec => {
                rec.events.forEach(ev => {
                    let pass = true;
                    if (query) {
                        const keys = Object.keys(query);
                        keys.forEach(key => {
                            let prop = key.replace('events.', '');
                            if (ev[prop] !== query[key])
                                pass = false;
                        });
                    }
                    if (pass) {
                        ev.modelName = rec.name;
                        ev._id = rec._id;
                        events.push(ev);
                    }
                });
            });
            return events;
        });
    }
    getProjection(query) {
        let match = {};
        let projection = {};
        {
            Object.keys(query).forEach(key => {
                if (key.startsWith('events.')) {
                    let val = query[key];
                    key = key.replace('events.', '');
                    match[key] = val;
                }
            });
            if (Object.keys(match).length == 0)
                projection = { id: 1, name: 1 };
            else
                projection = { id: 1, name: 1, "events": { $elemMatch: match } };
        }
        return projection;
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
            return yield this.db.createIndex(this.dbConfiguration.db, Definition_collection, { name: 1 }, { unique: true });
        });
    }
    import(data) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('inserting');
            return yield this.db.insert(this.dbConfiguration.db, Definition_collection, data);
        });
    }
    updateTimer(name) {
        return __awaiter(this, void 0, void 0, function* () {
            const source = yield this.getSource(name);
            let model = new ModelsData_1.BpmnModelData(name, source, null, null, null);
            let definition = new elements_1.Definition(model.name, model.source, this.server);
            yield definition.load();
            model.parse(definition);
            yield this.db.update(this.dbConfiguration.db, Definition_collection, { name: model.name }, {
                $set: {
                    events: model.events
                }
            }, { upsert: false });
            this.logger.log("updating model");
            this.logger.log('DataStore:saving Complete');
            return true;
        });
    }
    saveModel(model) {
        return __awaiter(this, void 0, void 0, function* () {
            this.logger.log("Saving Model " + model.name);
            var recs;
            model.saved = new Date().toISOString();
            yield this.db.update(this.dbConfiguration.db, Definition_collection, { name: model.name }, {
                $set: {
                    name: model.name, saved: model.saved, source: model.source, svg: model.svg, processes: model.processes, events: model.events
                }
            }, { upsert: true });
            return true;
        });
    }
    deleteModel(name) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.db.remove(this.dbConfiguration.db, Definition_collection, { name: name });
        });
    }
    renameModel(name, newName) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.db.update(this.dbConfiguration.db, Definition_collection, { name: name }, {
                $set: {
                    name: newName
                }
            }, { upsert: false });
            this.logger.log("updating model");
            this.logger.log('DataStore:saving Complete');
            return true;
        });
    }
    export(name, folderPath) {
        return __awaiter(this, void 0, void 0, function* () {
            let model = yield this.loadModel(name);
            let fullpath = folderPath + "/" + name + ".bpmn";
            fs.writeFile(fullpath, model.source, function (err) {
                if (err)
                    throw err;
                console.log(`Saved bpmn to ${fullpath}`);
            });
            fullpath = folderPath + "/" + name + ".svg";
            fs.writeFile(fullpath, model.svg, function (err) {
                if (err)
                    throw err;
                console.log(`Saved svg to ${fullpath}`);
            });
        });
    }
    rebuild(model = null) {
        return __awaiter(this, void 0, void 0, function* () {
        });
    }
}
exports.ModelsDatastoreDB = ModelsDatastoreDB;
//# sourceMappingURL=ModelsDatastoreDB.js.map