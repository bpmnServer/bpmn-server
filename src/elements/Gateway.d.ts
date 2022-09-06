import { Token } from '../engine/Token';
import { NODE_ACTION } from '../../';
import { Node } from '.';
import { Item } from '../engine/Item';
declare class Gateway extends Node {
    /**
      *
      * @param item
      */
    getOutbounds(item: Item): Item[];
    findActiveFlows(token: Token): {
        pendingTokens: any[];
        waitingTokens: any[];
    };
    convergeFlows(item: Item): void;
    start(item: Item): Promise<NODE_ACTION>;
}
/**
 *  ExclusiveGatway:
 *      outbounds:  only 1
 *      inbound:    only 1 -
 * */
declare class XORGateway extends Gateway {
    getOutbounds(item: any): Item[];
}
/**
 * trick here is once one event is met all others must be cancelled
 *
 * How will I know?
 *      when one of my events is fired shoudl I subscribe to the event or get directly notified?
 * */
declare class EventBasedGateway extends Gateway {
    working: boolean;
    listener: any;
    restored(item: Item): void;
    run(item: Item): Promise<NODE_ACTION>;
    cancelAllBranched(endingItem: Item): Promise<void>;
    startMonitor(item: any): void;
}
export { Gateway, XORGateway, EventBasedGateway };
