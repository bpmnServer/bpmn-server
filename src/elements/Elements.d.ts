import { Token } from '../engine/Token';
import { NODE_ACTION, FLOW_ACTION, EXECUTION_EVENT, ITEM_STATUS } from '../engine/Enums';
import { Item } from '../engine/Item';
import { Process } from './Process';
declare class Element {
    id: any;
    type: any;
    name: any;
    behaviours: Map<any, any>;
    continue(item: Item): void;
    resume(item: Item): void;
    /**
     * respond by providing behaviour attributes beyond item and node information
     *  ex: timer due , input/outupt , fields
     * */
    hasBehaviour(name: any): boolean;
    getBehaviour(name: any): any;
    addBehaviour(nane: any, behavriour: any): void;
}
declare class Flow extends Element {
    from: Node;
    to: Node;
    def: any;
    constructor(id: any, type: any, from: any, to: any, def: any);
    run(item: Item): FLOW_ACTION;
}
declare class Node extends Element {
    name: any;
    processId: any;
    def: any;
    outbounds: Flow[];
    inbounds: Flow[];
    static loadNode(el: any, processId: any): Node;
    constructor(id: any, processId: any, type: any, def: any);
    doEvent(item: Item, event: EXECUTION_EVENT, newStatus: ITEM_STATUS): void;
    enter(item: Item): void;
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
    execute(item: Item): Promise<void | NODE_ACTION.error | NODE_ACTION.abort | NODE_ACTION.wait>;
    continue(item: Item): void;
    start(item: Item): NODE_ACTION;
    run(item: Item): Promise<NODE_ACTION>;
    end(item: Item): void;
    resume(item: Item): void;
    getOutbounds(item: Item): Item[];
}
declare class Gateway extends Node {
    findActiveFlows(token: Token): {
        pendingTokens: any[];
        waitingTokens: any[];
    };
    start(item: Item): NODE_ACTION;
}
/**
 *  ExclusiveGatway:
 *      outbounds:  only 1
 *      inbound:    only 1 -
 *                      first flow arrives should cancel the rest: TODO
 * */
declare class XORGateway extends Node {
    getOutbounds(item: any): Item[];
}
declare class SubProcess extends Node {
    childProcess: Process;
    requiresWait(): boolean;
    canBeInvoked(): boolean;
}
export { Gateway, XORGateway };
export { Element, Node, Flow, Process, SubProcess };
