import { Definition } from "../elements";
import { BPMNServer } from "../server";
import { ServerComponent } from "../server/ServerComponent";
import { IBpmnModelData, IModelsDatastore, IEventData } from "../interfaces/";
import { BpmnModelData } from "./ModelsData";
declare class ModelsDatastoreDB extends ServerComponent implements IModelsDatastore {
    dbConfiguration: any;
    db: any;
    constructor(server: BPMNServer);
    getList(): Promise<string[]>;
    load(name: any): Promise<Definition>;
    getSource(name: any): Promise<any>;
    getSVG(name: any): Promise<any>;
    loadModel(name: any): Promise<BpmnModelData>;
    save(name: any, source: any, svg: any): Promise<any>;
    findEvents(query: any): Promise<IEventData[]>;
    private getProjection;
    /**
     * first time installation of DB
     *
     * creates a new collection and add an index
     *
     * */
    install(): Promise<any>;
    import(data: any): Promise<any>;
    updateTimer(name: any): Promise<boolean>;
    saveModel(model: IBpmnModelData): Promise<boolean>;
    deleteModel(name: any): Promise<void>;
    renameModel(name: any, newName: any): Promise<boolean>;
    export(name: any, folderPath: any): Promise<void>;
}
export { ModelsDatastoreDB };
declare class ModelsDatastore extends ModelsDatastoreDB implements IModelsDatastore {
    definitionsPath: any;
    constructor(server: BPMNServer);
    import(data: any): Promise<any>;
    getList(): Promise<string[]>;
    load(name: any): Promise<Definition>;
    private getPath;
    private getFile;
    private saveFile;
    getSource(name: any): Promise<string>;
    getSVG(name: any): Promise<string>;
    save(name: any, bpmn: any, svg?: any): Promise<boolean>;
    deleteModel(name: any): Promise<void>;
    renameModel(name: any, newName: any): Promise<boolean>;
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
