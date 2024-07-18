
import { Definition } from "../elements";
import { BPMNServer, ServerComponent } from "../server";

import { IBpmnModelData, IDefinition, IModelsDatastore } from "../interfaces/";

class RemoteModelsDatastore extends ServerComponent implements IModelsDatastore {
    definitionsPath;
    constructor(server: BPMNServer) {
        super(server);
    this.definitionsPath = server.configuration.definitionsPath;
        
    }
    private async read(url,type) : Promise<string> {

        const fs = require('fs');
        let path=""+this.definitionsPath+"/"+url+"."+type;
        let contents=await fs.readFileSync(path,'utf8');
        return contents;

    }

    get(query: any): Promise<object[]> {
        throw new Error("Method not implemented.");
    }
    async getList(query: any): Promise<string[]> {
        let contents=await this.read('','list');
        return contents.split('\n');

    }
    async getSource(name: any, owner: any): Promise<string> {
        return await this.read(name,'bpmn');
    }
    async getSVG(name: any, owner: any): Promise<string> {
        return await this.read(name,'svg');
    }
    save(name: any, bpmn: any, svg?: any, owner?: any): Promise<boolean> {
        throw new Error("Method not implemented.");
    }
    async load(name: any, owner: any): Promise<IDefinition> {
        throw new Error("Method not implemented.");
    }
    async loadModel(name: any, owner: any): Promise<IBpmnModelData> {
        throw new Error("Method not implemented.");
    }
    async findEvents(query: any, owner: any): Promise<any[]> {
        throw new Error("Method not implemented.");
    }
    rebuild(model?: any): Promise<void> {
        throw new Error("Method not implemented.");
    }
    install() {
        throw new Error("Method not implemented.");
    }
    import(data: any) {
        throw new Error("Method not implemented.");
    }
    saveModel(model: IBpmnModelData): Promise<boolean> {
        throw new Error("Method not implemented.");
    }
    deleteModel(name: any, owner: any): Promise<void> {
        throw new Error("Method not implemented.");
    }
    renameModel(name: any, newName: any, owner: any): Promise<boolean> {
        throw new Error("Method not implemented.");
    }
    
}

export {RemoteModelsDatastore  }