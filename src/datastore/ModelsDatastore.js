"use strict";
//import { ModelsDatastoreDB } from "./ModelsDatastoreDB";
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
exports.ModelsDatastore = exports.ModelsDatastoreDB = void 0;
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
            records.forEach(r => { list.push({ name: r.name, saved: r.saved }); });
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
            yield definition.load();
            bpmnModelData.parse(definition);
            yield this.saveModel(bpmnModelData);
            return bpmnModelData;
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
}
exports.ModelsDatastoreDB = ModelsDatastoreDB;
class ModelsDatastore extends ModelsDatastoreDB {
    constructor(server) {
        super(server);
        this.definitionsPath = server.configuration.definitionsPath;
    }
    import(data) {
        const _super = Object.create(null, {
            import: { get: () => super.import }
        });
        return __awaiter(this, void 0, void 0, function* () {
            return yield _super.import.call(this, data);
        });
    }
    getList() {
        return __awaiter(this, void 0, void 0, function* () {
            let files = [];
            fs.readdirSync(this.definitionsPath).forEach(file => {
                if (Path.extname(file) == '.bpmn') {
                    let name = Path.basename(file);
                    name = name.substring(0, name.length - 5);
                    ;
                    files.push(name);
                }
            });
            return files;
        });
    }
    /*
     *	loads a definition
     *
     */
    load(name) {
        return __awaiter(this, void 0, void 0, function* () {
            const source = yield this.getSource(name);
            //const rules = this.getFile(name, 'rules');
            const definition = new elements_1.Definition(name, source, this.server);
            yield definition.load();
            return definition;
        });
    }
    getPath(name, type) {
        return this.definitionsPath + name + '.' + type;
    }
    getFile(name, type) {
        let file = fs.readFileSync(this.getPath(name, type), { encoding: 'utf8', flag: 'r' });
        return file;
    }
    saveFile(name, type, data) {
        let fullpath = this.getPath(name, type);
        fs.writeFile(fullpath, data, function (err) {
            if (err)
                throw err;
            console.log(`Saved ${type} to ${fullpath}`);
        });
    }
    getSource(name) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.getFile(name, 'bpmn');
        });
    }
    getSVG(name) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.getFile(name, 'svg');
        });
    }
    save(name, bpmn, svg) {
        const _super = Object.create(null, {
            save: { get: () => super.save }
        });
        return __awaiter(this, void 0, void 0, function* () {
            this.saveFile(name, 'bpmn', bpmn);
            if (svg)
                this.saveFile(name, 'svg', svg);
            yield _super.save.call(this, name, bpmn, svg);
            return true;
        });
    }
    deleteModel(name) {
        const _super = Object.create(null, {
            deleteModel: { get: () => super.deleteModel }
        });
        return __awaiter(this, void 0, void 0, function* () {
            yield _super.deleteModel.call(this, name);
            yield fs.unlink(this.definitionsPath + name + '.bpmn', function (err) {
                if (err)
                    console.log('ERROR: ' + err);
            });
            yield fs.unlink(this.definitionsPath + name + '.svg', function (err) {
                if (err)
                    console.log('ERROR: ' + err);
            });
        });
    }
    renameModel(name, newName) {
        const _super = Object.create(null, {
            renameModel: { get: () => super.renameModel }
        });
        return __awaiter(this, void 0, void 0, function* () {
            yield _super.renameModel.call(this, name, newName);
            yield fs.rename(this.definitionsPath + name + '.bpmn', this.definitionsPath + newName + '.bpmn', function (err) {
                if (err)
                    console.log('ERROR: ' + err);
            });
            yield fs.rename(this.definitionsPath + name + '.svg', this.definitionsPath + newName + '.svg', function (err) {
                if (err)
                    console.log('ERROR: ' + err);
            });
            return true;
        });
    }
    /**
     *
     * reconstruct the models database from files
     *
     * use when modifying the files manually or importing new environment
     *
     * */
    rebuild(model = null) {
        const _super = Object.create(null, {
            getList: { get: () => super.getList },
            deleteModel: { get: () => super.deleteModel }
        });
        return __awaiter(this, void 0, void 0, function* () {
            if (model)
                return this.rebuildModel(model);
            let filesList = yield this.getList();
            const models = new Map();
            filesList.forEach(f => {
                const path = this.definitionsPath + f + '.bpmn';
                var stats = fs.statSync(path);
                var mtime = stats.mtime;
                models.set(f, mtime);
            });
            const dbList = yield _super.getList.call(this);
            dbList.forEach(model => {
                const name = model['name'];
                const saved = new Date(model['saved']);
                const entry = models.get(name);
                if (entry) {
                    if (saved.getTime() > entry.getTime()) {
                        models.delete(name);
                    }
                }
                else {
                    _super.deleteModel.call(this, name);
                }
            });
            let i;
            for (const entry of models.entries()) {
                const name = entry[0];
                yield this.rebuildModel(name);
            }
        });
    }
    rebuildModel(name) {
        const _super = Object.create(null, {
            save: { get: () => super.save }
        });
        return __awaiter(this, void 0, void 0, function* () {
            console.log("rebuilding " + name);
            let source = yield this.getSource(name);
            let svg;
            try {
                svg = yield this.getSVG(name);
            }
            catch (exc) {
                //console.log(exc);
            }
            yield _super.save.call(this, name, source, svg);
        });
    }
}
exports.ModelsDatastore = ModelsDatastore;
//# sourceMappingURL=ModelsDatastore.js.map