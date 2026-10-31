import { IInstanceData, IItemData , IDefinitionData} from './DataObjects.js';


export interface IBPMNRequest {
    engine: IEngine;
    datastore: IDatastore;
    definitions: IDefinitions;
}

export interface IEngine{
     start(name, data , startNodeId ,  userId,options ): Promise<IInstanceData>;
     invoke(query, data, userId): Promise<IInstanceData> ;
     assign(query, data, userId,assignment): Promise<IInstanceData>;
     throwMessage(messageId, data, messageMatchingKey);
     throwSignal(signalId, data, messageMatchingKey);
     status();
}
export interface IDatastore {
     findItems(query): Promise<IItemData[]>; 
     findInstances(query): Promise<IInstanceData[]>;
     deleteInstances(query);
}
export interface IDefinitions {
     import(name, pathToBPMN,pathToSVG);
     list(): Promise<string[]>;
     delete(name) ;
     rename(name,newName);
     load(name): Promise<IDefinitionData>;
}
