import { Logger } from '../common/Logger';
declare class Definition {
    name: any;
    processes: Map<any, any>;
    elements: any;
    rootElements: any;
    nodes: Map<any, any>;
    flows: any[];
    source: any;
    logger: any;
    constructor(name: string, source: string, logger: Logger);
    private loadProcess;
    load(): Promise<any>;
    getDefinition(source: any, logger: any): Promise<any>;
    getStartNode(): any;
    getNodeById(id: any): any;
    static getType(name: any): any;
}
export { Definition };
