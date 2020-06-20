
import { Execution } from '../engine/Execution';
import { Token } from '../engine/Token';
import { IBehaviour, Behaviour } from "./behaviours";
import { NODE_ACTION, FLOW_ACTION, EXECUTION_EVENT, TOKEN_STATUS, ITEM_STATUS } from '../../';
import { Node } from '.';
import { Item } from '../engine/Item';


// ---------------------------------------------


/*
 * how do i know when to converge pending tokens:
 *  1.  multi potential inbounds
 *  2.  how many tokens are active that branched off from the corresponding gateway:
 *      a) find the corresponding gateway??
 *            
 *      b) check all brnaches that passed through this gateway
 *      c) check if any still active (other than the calling one)
 *      
 *  Using the calling token: is a child , did it branch from a gateway - take it
 *              did it have a child branching from the gateway
 *              
 */
class Gateway extends Node {

    /**
      * 
      * @param item
      */
    /*  rule: DefaultFlow will only fire if no other flows are valid
     */
    getOutbounds(item: Item): Item[] {
        if (this.def.default) {

            let defaultFlow;
            const outbounds = [];
            this.outbounds.forEach(flow => {
                if (flow.id == this.def.default.id) {
                    defaultFlow = flow;
                }
                else {
                    let flowItem = new Item(flow, item.token);
                    if (flow.run(flowItem) == FLOW_ACTION.take)
                        outbounds.push(flowItem);
                }
            });

            if (outbounds.length == 0 && defaultFlow) {
                let flowItem = new Item(defaultFlow, item.token);
                outbounds.push(flowItem)
            }
            item.token.log('..return outbounds' + outbounds.length);
            return outbounds;
        }
        else
            return super.getOutbounds(item);

    }

    /*
     * we are looking for:
     *      tokens are still active (pending)
     *  and tokens that are being held by the gateway to be converged.     
     */
    findActiveFlows(token: Token) {

        let divergingGateway = null;
        let parentToken = null;
        let pendingTokens = [];
        let waitingTokens = [];

        token.log('..converging .. my token ' + token.id);
        if (token.parentToken) { // is a child did i branch from a gatewy
            if (token.branchNode.type == 'bpmn:InclusiveGateway' ||
                token.branchNode.type == 'bpmn:ExclusiveGateway') {
                divergingGateway = token.branchNode;
                parentToken = token.parentToken;
            }
        }
        else { // do I have a child branching from a gateway
            let childrenTokens = token.getChildrenTokens();
            childrenTokens.forEach(t => {
                if (t.branchNode.type == 'bpmn:InclusiveGateway' ||
                    token.branchNode.type == 'bpmn:ExclusiveGateway') {
                    divergingGateway = t.branchNode;
                    parentToken = token;
                }
            });
        }
        if (divergingGateway) {
            token.log('..converging gateway was : ' + divergingGateway.id);
            // that all branches that are active that passed through this gateway or branch from it
            token.execution.tokens.forEach(t => {
                if ((t.status != TOKEN_STATUS.end)
                    && (t.status != TOKEN_STATUS.terminated)
                    && (t.id != token.id)) {
                    if (t.currentNode.id == this.id) {// waiting for me
                        waitingTokens.push(t);
                    }
                    else {
                        if (t.branchNode && (t.branchNode.id == divergingGateway.id))
                            pendingTokens.push(t);
                        else {
                            t.path.forEach(i => {
                                if (i.element.id == divergingGateway.id)
                                    pendingTokens.push(t);
                            });
                        }
                    }
                }
            });
        }
        token.log('..# of active tokens pending ' + pendingTokens.length);
        pendingTokens.forEach(t => {
            token.log('..token id ' + t.id + " " + t.currentNode.id);
        });

        return { pendingTokens, waitingTokens };
    }
    // new logic 
    // since all splits causes new token to be created
    convergeFlows(item: Item) {

        const token = item.token;
        if (this.inbounds.length > 1
            && token.branchNode
            && (token.branchNode.type == 'bpmn:InclusiveGateway' ||
                token.branchNode.type == 'bpmn:ExclusiveGateway')) {

            const siblings = token.parentToken.getChildrenTokens();
            const waitingTokens = [];
            const pendingTokens = [];

            siblings.forEach(t => {
                if ((t.id != token.id)
                    && (t.currentNode.id == this.id)) {// waiting for me

                    if (t.status != TOKEN_STATUS.end
                        && t.status != TOKEN_STATUS.terminated)
                        waitingTokens.push(t);
                    else
                        pendingTokens.push(t);

                }

                token.log(`..token waiting for gatewy ${t.id} nod: ${t.currentNode.id}`);


            });
            token.log('..# of active tokens pending ' + waitingTokens.length);
        }

    }

    async start(item: Item): Promise<NODE_ACTION> {
        if (this.inbounds.length > 1) { // converging .....
            item.token.log("..Starting a converging gateway");
            // what is my token
            let result = this.findActiveFlows(item.token);
            if (result.pendingTokens.length > 0)
                return NODE_ACTION.wait;
            else {
                item.token.log('..let us converge now ');
                result.waitingTokens.forEach(t => {
                    item.token.log("..converging ending token #" + t.id);
                    t.currentItem.status = ITEM_STATUS.end;
                    t.end();
                });

            }
        }
        else
            return NODE_ACTION.continue;
    }


}

/**
 *  ExclusiveGatway:
 *      outbounds:  only 1 
 *      inbound:    only 1 - 
 *                      first flow arrives should cancel the rest: TODO
 * */
class XORGateway extends Node {

    getOutbounds(item) {

        const outbounds = super.getOutbounds(item);

        if (outbounds.length > 1) {
            item.token.log('..XORGateway : removed other outbounds , took the first');
            return [outbounds[0]];

        }

        return outbounds;
    }

}
/**
 * trick here is once one event is met all others must be cancelled
 * 
 * How will I know?
 *      when one of my events is fired shoudl I subscribe to the event or get directly notified?
 * */
class EventBasedGateway extends Gateway {
    working = false;
    listener;

    restored(item: Item) {
        this.startMonitor(item);
        super.resume(item);
    }
    async run(item: Item): Promise<NODE_ACTION> {
        this.startMonitor(item);
        return NODE_ACTION.end;
    }
    async cancelAllBranched(endingItem: Item) {
        if (this.working)
            return;
        this.working = true;
        const self = this;

        endingItem.token.execution.tokens.forEach(async function (token) {

            if (token.status == TOKEN_STATUS.wait && token.currentItem.id != endingItem.id) {
                if (token.branchNode && token.branchNode.id == self.id)
                     {

                    endingItem.token.log(`..EventBasedGateway:<${self.id}>-- cancelling  ${token.currentNode.id} `);

                    await token.terminate();
                }
            }
        });
        this.working = false;
    }
    startMonitor(item) {
        if (this.listener)
            return;
        item.token.log("..EventBasedGateway is running" + this.id);
        this.listener = item.token.execution.listener;

        const self = this;
        this.listener.on(EXECUTION_EVENT.node_end, async function ({ item: endingItem }) {

            const token = endingItem.token;

            const lastItem = token.lastItem;
            if (token.branchNode && token.branchNode.id == self.id) {

                await self.cancelAllBranched(endingItem);
            }

        });

    }

}

export {Gateway,XORGateway , EventBasedGateway }