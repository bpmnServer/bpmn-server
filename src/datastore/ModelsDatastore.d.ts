import { Definition } from "../elements";
import { BPMNServer } from "../server";
import { ModelsDatastoreDB } from "./ModelsDatastoreDB";
import { IModelsDatastore } from "../interfaces/";
declare class ModelsDatastore extends ModelsDatastoreDB implements IModelsDatastore {
    definitionsPath: any;
    constructor(server: BPMNServer);
    import(data: any, owner?: any): Promise<any>;
    getList(query?: any): Promise<string[]>;
    load(name: any, owner?: any): Promise<Definition>;
    private getPath;
    private getFile;
    private saveFile;
    getSource(name: any, owner?: any): Promise<string>;
    getSVG(name: any, owner?: any): Promise<string>;
    save(name: any, bpmn: any, svg?: any, owner?: any): Promise<boolean>;
    deleteModel(name: any, owner?: any): Promise<void>;
    renameModel(name: any, newName: any, owner?: any): Promise<boolean>;
    /**
     *
     * reconstruct the models database from files
     *
     * use when modifying the files manually or importing new environment
     *
     * */
    rebuild(model?: any): Promise<void>;
    private rebuildModel;
}
export { ModelsDatastore };
