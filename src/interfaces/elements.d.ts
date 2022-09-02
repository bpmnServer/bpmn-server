import { IItem, ILogger, NODE_ACTION, EXECUTION_EVENT, ITEM_STATUS, Node } from "../..";
interface IDefinition {
    name: any;
    processes: Map<any, any>;
    rootElements: any;
    nodes: Map<any, any>;
    flows: any[];
    source: any;
    logger: any;
    accessRules: any[];
    load(): Promise<any>;
    getJson(): string;
    getDefinition(source: any, logger: ILogger): Promise<any>;
    getStartNode(): Node;
    getNodeById(id: any): Node;
}
interface IElement {
    id: any;
    type: any;
    name: any;
    behaviours: Map<any, any>;
    continue(item: IItem): void;
    describe(): string[][];
    restored(item: IItem): void;
    resume(item: IItem): void;
    /**
     * respond by providing behaviour attributes beyond item and node information
     *  ex: timer due , input/outupt , fields
     * */
    hasBehaviour(name: any): boolean;
    getBehaviour(name: any): any;
    addBehaviour(nane: any, behavriour: any): void;
}
interface IFlow extends IElement {
}
interface INode extends IElement {
    name: any;
    processId: any;
    def: any;
    outbounds: any[];
    inbounds: any[];
    doEvent(item: IItem, event: EXECUTION_EVENT, newStatus: ITEM_STATUS): Promise<void>;
    enter(item: IItem): void;
    requiresWait(): boolean;
    canBeInvoked(): boolean;
    /**
     * this is the primary exectuion method for a node
     *
     * considerations: the following are handled by Token
     *      1.  Loops we are inside a loop already (if any)
     *      2.  Gatways
     *      3.  Subprocess the parent node is fired as normal
     *              run method will fire the subprocess invoking a new token and will go into wait
     */
    execute(item: IItem): Promise<void | NODE_ACTION.error | NODE_ACTION.abort | NODE_ACTION.wait>;
    continue(item: IItem): Promise<void>;
    start(item: IItem): Promise<NODE_ACTION>;
    run(item: IItem): Promise<NODE_ACTION>;
    end(item: IItem): Promise<void>;
    /**
     * is called by the token after an execution resume for every active (in wait) item
     * different than init, which is called for all items
     * @param item
     */
    resume(item: IItem): void;
    init(item: IItem): void;
    getOutbounds(item: IItem): IItem[];
}
export { IDefinition, IElement, INode, IFlow };
