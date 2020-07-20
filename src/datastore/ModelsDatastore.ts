import { ModelsDatastoreDB } from "./ModelsDatastoreDB";

import { Definition } from "../elements";
import { BPMNServer } from "../server";
import { IModelsDatastore} from "../interfaces/datastore";



const fs = require('fs');
const Path = require('path')

const BpmnModdle = require('bpmn-moddle');

class ModelsDatastore extends ModelsDatastoreDB implements IModelsDatastore {

    definitionsPath;
    constructor(server: BPMNServer) {
        super(server);
    this.definitionsPath = server.configuration.definitionsPath;
        
    }

    async import(data) {
        return await super.import(data);

    }

    async getList(): Promise<string[]> {

        let files = [];

        fs.readdirSync(this.definitionsPath).forEach(file => {
            if (Path.extname(file) == '.bpmn') {
                let name = Path.basename(file);
                name = name.substring(0, name.length - 5);;
                files.push(name);
            }
        });
  
        return files;
    }

	/*
	 *	loads a definition
	 *	
	 */
    async load(name) : Promise<Definition> {

        const source = await this.getSource(name);

        const definition = new Definition(name, source, this.server);
        await definition.load();
        return definition;
    }

    private getPath(name, type) {

        return this.definitionsPath + name + '.' + type;
    }

    private getFile(name, type) {

        let file = fs.readFileSync(this.getPath(name,type),
            { encoding: 'utf8', flag: 'r' });
        return file;

    }
    private saveFile(name, type , data) {
        let fullpath = this.getPath(name, type);

        fs.writeFile(fullpath, data, function (err) {
            if (err) throw err;
            console.log(`Saved ${type} to ${fullpath}`);
        });

    }
    async getSource(name): Promise<string> {

        return this.getFile(name, 'bpmn');

    }
    async getSVG(name): Promise<string> {
        return this.getFile(name, 'svg');
    }

    async save(name, bpmn, svg?): Promise<boolean> {

        this.saveFile(name, 'bpmn', bpmn);
        if (svg)
            this.saveFile(name, 'svg', svg);

        await super.save(name, bpmn, svg);

        return true;

    }

    async deleteModel(name: any): Promise<void> {

        await super.deleteModel(name);
        await fs.unlink(this.definitionsPath + name + '.bpmn',  function (err) {
            if (err) console.log('ERROR: ' + err);
        });
        await fs.unlink(this.definitionsPath + name + '.svg',function (err) {
            if (err) console.log('ERROR: ' + err);
        });
    }
    async renameModel(name: any, newName: any): Promise<boolean> {

        await super.renameModel(name, newName);
        await fs.rename(this.definitionsPath + name + '.bpmn', this.definitionsPath + newName + '.bpmn', function (err) {
            if (err) console.log('ERROR: ' + err);
        });
        await fs.rename(this.definitionsPath + name + '.svg', this.definitionsPath + newName + '.svg', function (err) {
            if (err) console.log('ERROR: ' + err);
        });
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

        if (model)
            return this.rebuildModel(model);
        let filesList = await this.getList();
        const models = new Map();

        filesList.forEach(f => {
            const path=this.definitionsPath + f + '.bpmn';

            var stats = fs.statSync(path);
            var mtime = stats.mtime;
            models.set(f, mtime);
        });
        const dbList = await super.getList();
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
                super.deleteModel(name);
            }
        });
        let i;

        for (const entry of models.entries()) {
            const name = entry[0];
            await this.rebuildModel(name);
        }
    }
    private async rebuildModel(name) {
        console.log("rebuilding " + name);
        let source = await this.getSource(name);
        let svg = await this.getSVG(name);
        await super.save(name, source, svg);

    }

}

export {ModelsDatastore  }