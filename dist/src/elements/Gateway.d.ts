import { Token } from '../engine/Token';
import { NODE_ACTION } from '../engine/Enums';
import { Node } from './Elements';
import { Item } from '../engine/Item';
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
export { Gateway, XORGateway };
