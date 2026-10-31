import { createRequire } from 'module';
const require = createRequire(import.meta.url);

import { Definition } from '../elements/Definition.js';
import type { IBPMNServer } from '../interfaces/server.js';
import {ModelsDatastoreDB} from "./ModelsDatastoreDB.js";

import type { IModelsDatastore } from '../interfaces/datastore.js';


class ModelsDatastore extends ModelsDatastoreDB implements IModelsDatastore {

    constructor(server: IBPMNServer) {
        super(server);
        
    }
    get definitionsPath() { return this.server.configuration.definitionsPath; }


    async import(data,owner=null) {
        return await super.import(data);

    }

    async getList(query=null): Promise<string[]> {

        let files = [];
        const fs = require('fs');
        fs.readdirSync(this.definitionsPath).forEach(file => {
            const path = require('path')
            if (path.extname(file) == '.bpmn') {
                let name = path.basename(file);
                name = name.substring(0, name.length - 5);;
                files.push({name,saved:null});
            }
        });
  
        return files;
    }
       /* moved to superclass
    async loadFromInstance(instance,owner=null): Promise<Definition> {
        if (instance.source) {
            return this.loadDefinition(instance.name, instance.source);
        }
        else {
            return this.load(instance.name,owner);
        }
    }
    async load(name,owner=null) : Promise<Definition> {

        const source = await this.getSource(name);
        return this.loadDefinition(name, source);
    }
 
    private async loadDefinition(name, source): Promise<Definition> {
        
        const definition = new Definition(name, source, this.server);
        await definition.load();
        return definition;
    }
    */
    private getPath(name, type,owner=null) {

        return this.definitionsPath + name + '.' + type;
    }

    /** A model file's text; null only when it does not exist (an unreadable file throws). */
    private async getFile(name, type,owner=null) {
        const fs = require('fs');
        try {
            return await fs.promises.readFile(this.getPath(name,type), 'utf8');
        }
        catch (error) {
            if (error.code === 'ENOENT') return null;
            throw error;
        }

    }
    /** Writes a model file whole or not at all: to a temporary file beside it, then renamed over it. */
    private async saveFile(name, type , data,owner=null) {
        let fullpath = this.getPath(name, type);
        const fs = require('fs');
        const temporary = fullpath + '.' + process.pid + '.tmp';
        await fs.promises.writeFile(temporary, data);
        await fs.promises.rename(temporary, fullpath);

    }
    async getSource(name,owner=null): Promise<string> {

        const source = await this.getFile(name, 'bpmn');
        if (source == null) throw new Error(`No process definition named ${name} in ${this.definitionsPath}`);
        return source;

    }
    /** The model's diagram, or null when it has none (the SVG is optional). */
    async getSVG(name,owner=null): Promise<string> {
        return this.getFile(name, 'svg');
    }

    async save(name, bpmn, svg?,owner=null): Promise<boolean> {

        // The database's record first: it parses the model, so a model that does not load leaves the files as they were.
        await super.save(name, bpmn, svg);
        await this.saveFile(name, 'bpmn', bpmn);
        if (svg)
            await this.saveFile(name, 'svg', svg);

        return true;

    }

    async deleteModel(name: any,owner=null): Promise<void> {
        const fs = require('fs');
        await super.deleteModel(name);
        for (const extension of ['bpmn', 'svg']) {
            try { await fs.promises.unlink(this.definitionsPath + name + '.' + extension); }
            catch (error) { if (error.code !== 'ENOENT') throw error; }
        }
    }
    async renameModel(name: any, newName: any,owner=null): Promise<boolean> {
        const fs = require('fs');
        await super.renameModel(name, newName);
        for (const extension of ['bpmn', 'svg']) {
            try { await fs.promises.rename(this.definitionsPath + name + '.' + extension, this.definitionsPath + newName + '.' + extension); }
            catch (error) { if (error.code !== 'ENOENT') throw error; }
        }
        return true;
    }
    /**
     * 
     * reconstruct the models database from files
     * 
     * use when modifying the files manually or importing new environment
     * 
     * */
    async rebuild(model=null) {

        try {
        if (model)
            return this.rebuildModel(model);
        let filesList = await this.getList();
        const models = new Map();

        filesList.forEach(f => {
            const path=this.definitionsPath + f['name'] + '.bpmn';
            const fs = require('fs');
            var stats = fs.statSync(path);
            var mtime = stats.mtime;
            models.set(f['name'], mtime);
        });
        const dbList = await super.get();
        for (const model of dbList) {
            const name = model['name'];
            const saved = new Date(model['saved']);
            const entry = models.get(name);
            if (entry) {
                if (saved.getTime() > entry.getTime()) {
                    models.delete(name);
                }
            }
            else {
                await super.deleteModel(name);
            }
        }
        let i;

        for (const entry of models.entries()) {
            const name = entry[0];
            await this.rebuildModel(name);
        }
        }
        catch(exc)
        {
            this.logger.log('rebuild error');
            throw exc;
        }
    }
    private async rebuildModel(name) {
        this.logger.log("rebuilding " + name);
        let source = await this.getSource(name);
        const svg = await this.getSVG(name);
        await super.save(name, source, svg);

    }

}

export {ModelsDatastore  }