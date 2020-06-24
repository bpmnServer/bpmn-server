import { Definition, IBpmnModelData, IModelsDatastore } from "../..";
import { ServerComponent } from "../server/ServerContext";
import { BPMNServer } from "../server/BPMNServer";

const fs = require('fs');
const Path = require('path')

const BpmnModdle = require('bpmn-moddle');

class ModelsDatastoreFS extends ServerComponent implements IModelsDatastore {

    definitionsPath;
    constructor(server: BPMNServer) {
        super(server);
    this.definitionsPath = server.configuration.definitionsPath;
        
    }

    async install() {

    }
    async import(data) {

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

        const definition = new Definition(name, source, this.logger);
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

        return true;

    }

    async loadModel(name: any): Promise<IBpmnModelData> {
        throw new Error("not supported");
    }
    async findEvents(query: any): Promise<any[]> {
        throw new Error("not supported");

    }
    async buildCollection(): Promise<any> {
        throw new Error("not supported");
    }
    async saveModel(model: IBpmnModelData): Promise<boolean> {
        throw new Error("not supported");
    }
    async deleteModel(name: any): Promise<void> {
        throw new Error("not supported");
    }
    async renameModel(name: any, newName: any): Promise<boolean> {
        throw new Error("not supported");
    }

}

export {ModelsDatastoreFS  }