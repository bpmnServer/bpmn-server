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
exports.ModelsDatastore = void 0;
const elements_1 = require("../elements");
const ModelsDatastoreDB_1 = require("./ModelsDatastoreDB");
const fs = require('fs');
const Path = require('path');
const BpmnModdle = require('bpmn-moddle');
class ModelsDatastore extends ModelsDatastoreDB_1.ModelsDatastoreDB {
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
                    files.push({ name, saved: null });
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
            try {
                if (model)
                    return this.rebuildModel(model);
                let filesList = yield this.getList();
                const models = new Map();
                filesList.forEach(f => {
                    const path = this.definitionsPath + f['name'] + '.bpmn';
                    var stats = fs.statSync(path);
                    var mtime = stats.mtime;
                    models.set(f['name'], mtime);
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
            }
            catch (exc) {
                console.log('rebuild error');
                throw exc;
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