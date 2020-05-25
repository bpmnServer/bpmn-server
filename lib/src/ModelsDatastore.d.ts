import { IModelsDatastore } from './API';
declare class ModelsDatastore implements IModelsDatastore {
    definitionsPath: any;
    constructor(definitionsPath: any);
    getList(): string[];
    private getPath;
    private getFile;
    private saveFile;
    getSource(name: any): string;
    getSVG(name: any): string;
    save(name: any, bpmn: any, svg?: any): boolean;
    getElements(name: any): Promise<any[]>;
}
export { ModelsDatastore };
