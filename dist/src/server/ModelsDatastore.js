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
const __1 = require("../..");
const ServerContext_1 = require("./ServerContext");
const fs = require('fs');
const Path = require('path');
const BpmnModdle = require('bpmn-moddle');
class ModelsDatastore extends ServerContext_1.ServerComponent {
    constructor(server) {
        super(server);
        this.definitionsPath = server.configuration.definitionsPath;
    }
    getList() {
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
    }
    /*
     *	loads a definition
     *
     */
    load(name) {
        return __awaiter(this, void 0, void 0, function* () {
            const source = this.getSource(name);
            const definition = new __1.Definition(name, source, this.logger);
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
        return this.getFile(name, 'bpmn');
    }
    getSVG(name) {
        return this.getFile(name, 'svg');
    }
    save(name, bpmn, svg) {
        this.saveFile(name, 'bpmn', bpmn);
        if (svg)
            this.saveFile(name, 'svg', svg);
        return true;
    }
}
exports.ModelsDatastore = ModelsDatastore;
//# sourceMappingURL=ModelsDatastore.js.map