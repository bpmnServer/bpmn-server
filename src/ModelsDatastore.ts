
const fs = require('fs');
const Path = require('path')

const BpmnModdle = require('bpmn-moddle');

console.log("Defintions.ts");



import { IModelsDatastore } from './API';


class ModelsDatastore implements IModelsDatastore {

    definitionsPath;
    constructor(definitionsPath) {
        this.definitionsPath = definitionsPath;
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

    async getElements(name) {

        let source = this.getSource(name);
        const moddle = new BpmnModdle();

        const result = await moddle.fromXML(source);
        let keys = Object.keys(result.elementsById);

        let elements = [];

        keys.forEach(key => {
            let el = result.elementsById[key];
            elements.push({ type: el.$type, id: el.id });
        });
        return elements;
}
}

export {ModelsDatastore }