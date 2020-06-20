import { Definition } from "../..";
import { ServerComponent } from "./ServerContext";
import { BPMNServer } from "./BPMNServer";

const fs = require('fs');
const Path = require('path')

const BpmnModdle = require('bpmn-moddle');


class ModelsDatastore extends ServerComponent { //implements IModelsDatastore {

    definitionsPath;
    constructor(server: BPMNServer) {
        super(server);
    this.definitionsPath = server.configuration.definitionsPath;
        
    }
    getList(): string[] {

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

        const source = this.getSource(name);

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
    getSource(name): string {

        return this.getFile(name, 'bpmn');

    }
    getSVG(name): string {
        return this.getFile(name, 'svg');
    }

    save(name, bpmn, svg?): boolean {

        this.saveFile(name, 'bpmn', bpmn);
        if (svg)
            this.saveFile(name, 'svg', svg);

        return true;

    }
}

export {ModelsDatastore }