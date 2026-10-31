import { IInstanceData, IItemData, IDefinitionData } from './DataObjects.js';
export interface IBPMNRequest {
    engine: IEngine;
    datastore: IDatastore;
    definitions: IDefinitions;
}
export interface IEngine {
    start(name: any, data: any, startNodeId: any, userId: any, options: any): Promise<IInstanceData>;
    invoke(query: any, data: any, userId: any): Promise<IInstanceData>;
    assign(query: any, data: any, userId: any, assignment: any): Promise<IInstanceData>;
    throwMessage(messageId: any, data: any, messageMatchingKey: any): any;
    throwSignal(signalId: any, data: any, messageMatchingKey: any): any;
    status(): any;
}
export interface IDatastore {
    findItems(query: any): Promise<IItemData[]>;
    findInstances(query: any): Promise<IInstanceData[]>;
    deleteInstances(query: any): any;
}
export interface IDefinitions {
    import(name: any, pathToBPMN: any, pathToSVG: any): any;
    list(): Promise<string[]>;
    delete(name: any): any;
    rename(name: any, newName: any): any;
    load(name: any): Promise<IDefinitionData>;
}
