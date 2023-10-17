import { Definition } from "../elements";
import { BPMNServer } from "../server";
import { ServerComponent } from "../server/ServerComponent";
import { IBpmnModelData, IModelsDatastore, IEventData } from "../interfaces/";
import { BpmnModelData } from "./ModelsData";
declare class ModelsDatastoreDB extends ServerComponent implements IModelsDatastore {
    dbConfiguration: any;
    db: any;
    constructor(server: BPMNServer);
    getList(query?: {}): Promise<string[]>;
    load(name: any, owner?: any): Promise<Definition>;
    getSource(name: any, owner?: any): Promise<any>;
    getSVG(name: any, owner?: any): Promise<any>;
    loadModel(name: any, owner?: any): Promise<BpmnModelData>;
    save(name: any, source: any, svg: any, owner?: any): Promise<any>;
    findEvents(query: any, owner?: any): Promise<IEventData[]>;
    private getProjection;
    /**
     * first time installation of DB
     *
     * creates a new collection and add an index
     *
     * */
    install(): Promise<any>;
    import(data: any, owner?: any): Promise<any>;
    updateTimer(name: any, owner?: any): Promise<boolean>;
    saveModel(model: IBpmnModelData, owner?: any): Promise<boolean>;
    deleteModel(name: any, owner?: any): Promise<void>;
    renameModel(name: any, newName: any, owner?: any): Promise<boolean>;
    export(name: any, folderPath: any, owner?: any): Promise<void>;
    rebuild(model?: any): Promise<void>;
}
export { ModelsDatastoreDB };
