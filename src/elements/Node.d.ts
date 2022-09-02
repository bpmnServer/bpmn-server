import { Element, Flow } from '.';
import { NODE_ACTION, EXECUTION_EVENT, ITEM_STATUS } from '../interfaces/Enums';
import { Item } from '../engine/Item';
declare class Node extends Element {
    name: any;
    process: any;
    def: any;
    outbounds: Flow[];
    inbounds: Flow[];
    attachments: Node[];
    attachedTo: Node;
    messageId: any;
    signalId: any;
    scripts: Map<any, any>;
    get processId(): any;
    constructor(id: any, process: any, type: any, def: any);
    doEvent(item: Item, event: EXECUTION_EVENT, newStatus: ITEM_STATUS): Promise<any>;
    /**
     * is Called after execution
     * transform data using input rules
     * todo
     * @param item
     */
    setInput(item: Item, input: any): Promise<void>;
    getInput(item: Item, input: any): Promise<any>;
    /**
     * transform data using output rules
     * todo
     * @param item
     */
    getOutput(item: Item): Promise<any>;
    enter(item: Item): void;
    get requiresWait(): boolean;
    get canBeInvoked(): boolean;
    get isCatching(): boolean;
    /**
     * this is the primary exectuion method for a node
     *
     * considerations: the following are handled by Token
     *      1.  Loops we are inside a loop already (if any)
     *      2.  Gatways
     *      3.  Subprocess the parent node is fired as normal
     *              run method will fire the subprocess invoking a new token and will go into wait
     */
    execute(item: Item): Promise<void | NODE_ACTION.wait | NODE_ACTION.error | NODE_ACTION.abort>;
    continue(item: Item): Promise<void>;
    start(item: Item): Promise<NODE_ACTION>;
    run(item: Item): Promise<NODE_ACTION>;
    end(item: Item): Promise<void>;
    /**
     * is called by the token after an execution resume for every active (in wait) item
     * different than init, which is called for all items
     * @param item
     */
    resume(item: Item): void;
    init(item: Item): void;
    getOutbounds(item: Item): Item[];
    startBoundaryEvents(item: any, token: any): Promise<void>;
}
export { Node };
