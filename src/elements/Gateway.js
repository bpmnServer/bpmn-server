"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventBasedGateway = exports.XORGateway = exports.Gateway = void 0;
const Token_1 = require("../engine/Token");
const __1 = require("../../");
const _1 = require(".");
const Item_1 = require("../engine/Item");
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
class Gateway extends _1.Node {
    /**
      *
      * @param item
      */
    /*  rule: DefaultFlow will only fire if no other flows are valid
     */
    getOutbounds(item) {
        if (this.def.default) {
            let defaultFlow;
            const outbounds = [];
            this.outbounds.forEach(flow => {
                if (flow.id == this.def.default.id) {
                    defaultFlow = flow;
                }
                else {
                    let flowItem = new Item_1.Item(flow, item.token);
                    if (flow.run(flowItem) == __1.FLOW_ACTION.take)
                        outbounds.push(flowItem);
                }
            });
            if (outbounds.length == 0 && defaultFlow) {
                let flowItem = new Item_1.Item(defaultFlow, item.token);
                outbounds.push(flowItem);
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
    findActiveFlows(token) {
        let divergingGateway = null;
        let parentToken = null;
        let pendingTokens = [];
        let waitingTokens = [];
        token.log('Gateway(' + token.currentItem.element.name + '|' + token.currentItem.element.id + ').findActiveFlows: tokenId:' + token.id + ' startNode:' + token.startNodeId);
        if (token.parentToken) {
            token.log('Gateway(' + token.currentItem.element.name + '|' + token.currentItem.element.id + ').findActiveFlows: parentTokenId:' + token.parentToken.id);
        }
        if (token.originItem) {
            token.log('Gateway(' + token.currentItem.element.name + '|' + token.currentItem.element.id + ').findActiveFlows: originItem:' + token.originItem.element.id);
        }
        token.log('Gateway(' + token.currentItem.element.name + '|' + token.currentItem.element.id + ').findActiveFlows: converging  my token ' + token.id);
        if (token.parentToken) { // is a child did i branch from a gatewy
            token.log('Gateway(' + token.currentItem.element.name + '|' + token.currentItem.element.id + ').findActiveFlows: there is a parentToken tokenId=' + token.parentToken.id);
            const siblings = token.parentToken.getChildrenTokens();
            token.log('Gateway(' + token.currentItem.element.name + '|' + token.currentItem.element.id + ').findActiveFlows: siblings tokens=' + token.parentToken.id);
            if (token.originItem.node.type == 'bpmn:InclusiveGateway' ||
                token.originItem.node.type == 'bpmn:ExclusiveGateway' ||
                token.originItem.node.type == 'bpmn:ParallelGateway') {
                divergingGateway = token.originItem.node;
                parentToken = token.parentToken;
                token.log('Gateway(' + token.currentItem.element.name + '|' + token.currentItem.element.id + ').findActiveFlows:     token.originItem.node.type=' + token.originItem.node.type + ' divergingGateway=' + divergingGateway.id);
            }
        }
        else { // do I have a child branching from a gateway
            let childrenTokens = token.getChildrenTokens();
            console.log('Gateway(' + token.currentItem.element.name + '|' + token.currentItem.element.id + ').findActiveFlows: childrenTokens.length=', childrenTokens.length);
            childrenTokens.forEach(t => {
                if (t.originItem.node.type == 'bpmn:InclusiveGateway' ||
                    t.originItem.node.type == 'bpmn:ParallelGateway' ||
                    token.originItem.node.type == 'bpmn:ExclusiveGateway') {
                    divergingGateway = t.originItem.node;
                    parentToken = token;
                    token.log('Gateway(' + token.currentItem.element.name + '|' + token.currentItem.element.id + ').findActiveFlows:     parentToken=' + parentToken.id);
                    token.log('Gateway(' + token.currentItem.element.name + '|' + token.currentItem.element.id + ').findActiveFlows:     divergingGateway=' + divergingGateway.id);
                }
            });
        }
        if (divergingGateway) {
            token.log('Gateway(' + token.currentItem.element.name + '|' + token.currentItem.element.id + ').findActiveFlows: divergingGateway gateway ' + divergingGateway.id);
            //token.log('..converging gateway was : ' + divergingGateway.id);
            // that all branches that are active that passed through this gateway or branch from it
            token.execution.tokens.forEach(t => {
                token.log('Gateway(' + token.currentItem.element.name + '|' + token.currentItem.element.id + ').findActiveFlows:   .. processing token id=' + t.id + ' status=' + t.status);
                /*
                if ((t.status != TOKEN_STATUS.end)
                    && (t.status != TOKEN_STATUS.terminated)
                    && (t.id != token.id)) {*/
                if ((t.status != __1.TOKEN_STATUS.end) && (t.status != __1.TOKEN_STATUS.terminated)) {
                    if (t.currentNode.id == this.id) { // waiting for me
                        waitingTokens.push(t);
                    }
                    else {
                        if (t.originItem && (t.originItem.node.id == divergingGateway.id))
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
        token.log('Gateway(' + token.currentItem.element.name + '|' + token.currentItem.element.id + ').findActiveFlows: number of active tokens pending = ' + pendingTokens.length);
        pendingTokens.forEach(t => {
            token.log('Gateway(' + token.currentItem.element.name + '|' + token.currentItem.element.id + ').findActiveFlows: ..pending token id: ' + t.id + " currentNode.id:" + t.currentNode.id);
        });
        token.log('Gateway(' + token.currentItem.element.name + '|' + token.currentItem.element.id + ').findActiveFlows: number of active tokens waiting = ' + waitingTokens.length);
        waitingTokens.forEach(t => {
            token.log('Gateway(' + token.currentItem.element.name + '|' + token.currentItem.element.id + ').findActiveFlows: ..waitingTokens token id:' + t.id + ' currentNode.id:' + t.currentNode.id);
        });
        return { pendingTokens, waitingTokens };
    }
    // new logic 
    // since all splits causes new token to be created
    convergeFlows(item) {
        const waitingTokens = [];
        const pendingTokens = [];
        const token = item.token;
        token.log('Gateway(' + item.element.name + '|' + item.element.id + ').convergeFlows: token=' + token.id);
        token.log('Gateway(' + item.element.name + '|' + item.element.id + ').convergeFlows: inbounds.length=' + this.inbounds.length);
        if (this.inbounds.length > 1
            && token.originItem
            && (token.originItem.node.type == 'bpmn:InclusiveGateway' ||
                token.originItem.node.type == 'bpmn:ExclusiveGateway' ||
                token.originItem.node.type == 'bpmn:ParallelGateway')) {
            const siblings = token.parentToken ? token.parentToken.getChildrenTokens() : null;
            if (siblings) {
                token.log('Gateway(' + item.element.name + '|' + item.element.id + ').convergeFlows: parent childrenTokens.length=' + siblings.length);
                siblings.forEach(t => {
                    token.log('Gateway(' + item.element.name + '|' + item.element.id + ').convergeFlows: ... child token=' + t.id);
                    // Find children tokens
                    const siblingChildrenTokens = t.getChildrenTokens();
                    let siblingHasActiveChildToken = false;
                    console.log('Gateway(' + item.element.name + '|' + item.element.id + ').convergeFlows: siblingChildrenTokens.length=', siblingChildrenTokens.length);
                    siblingChildrenTokens.forEach(siblingChildToken => {
                        if (siblingChildToken.originItem.node.type == 'bpmn:InclusiveGateway' ||
                            siblingChildToken.originItem.node.type == 'bpmn:ParallelGateway' ||
                            siblingChildToken.originItem.node.type == 'bpmn:ExclusiveGateway') {
                            if (siblingChildToken.status != __1.TOKEN_STATUS.end && siblingChildToken.status != __1.TOKEN_STATUS.terminated) {
                                siblingHasActiveChildToken = true;
                                console.log('Gateway(' + item.element.name + '|' + item.element.id + ').convergeFlows: ... siblingChildToken status=', siblingChildToken.status);
                            }
                        }
                    });
                    //if ((t.id != token.id) && (t.currentNode.id == this.id)) {// waiting for me
                    if ((t.id != token.id)) { // exclude current token
                        if (t.status != __1.TOKEN_STATUS.end && t.status != __1.TOKEN_STATUS.terminated) {
                            if ((t.currentNode.id == this.id)) {
                                //
                                token.log('Gateway(' + item.element.name + '|' + item.element.id + ').convergeFlows: ... child token ' + t.id + ' in current gateway => add to waitingTokens currentNode=' + t.currentNode.id);
                                waitingTokens.push(t);
                            }
                            else {
                                token.log('Gateway(' + item.element.name + '|' + item.element.id + ').convergeFlows: ... child token ' + t.id + ' NOT in current gateway => add to pendingTokens currentNode=' + t.currentNode.id);
                                pendingTokens.push(t);
                            }
                        }
                        if (siblingHasActiveChildToken) {
                            // add token to pending because has children active in another gateway branch
                            token.log('Gateway(' + item.element.name + '|' + item.element.id + ').convergeFlows: ... child token ' + t.id + ' has active children token in a child gateway => add to pendingTokens currentNode=' + t.currentNode.id);
                            pendingTokens.push(t);
                        }
                        /*
                        else{
                            token.log('Gateway(' + item.element.id + ').convergeFlows: child token aad to pendingTokens currentNode='+t.currentNode.id);
                            pendingTokens.push(t);
                        }
                        */
                    }
                    //token.log(`Gateway.convergeFlows: .token waiting for gatewy ${t.id} nod: ${t.currentNode.id}`);
                });
            }
            //token.log('Gateway(' + item.element.id + ').convergeFlows:  # of active tokens pending ' + waitingTokens.length);
        }
        token.log('Gateway(' + item.element.name + '|' + item.element.id + ').convergeFlows: number of active tokens pending = ' + pendingTokens.length);
        pendingTokens.forEach(t => {
            token.log('Gateway(' + item.element.name + '|' + item.element.id + ').convergeFlows: ... pending token id: ' + t.id + " currentNode.id:" + t.currentNode.id);
        });
        token.log('Gateway(' + item.element.name + '|' + item.element.id + ').convergeFlows: number of active tokens waiting = ' + waitingTokens.length);
        waitingTokens.forEach(t => {
            token.log('Gateway(' + item.element.name + '|' + item.element.id + ').convergeFlows: ... waitingTokens token id:' + t.id + ' currentNode.id:' + t.currentNode.id);
        });
        return { pendingTokens, waitingTokens };
    }
    start(item) {
        return __awaiter(this, void 0, void 0, function* () {
            item.token.log('Gateway(' + item.element.name + '|' + item.element.id + ').start: node.type=' + item.node.type);
            if (this.inbounds.length > 1) { // converging .....
                item.token.log('Gateway(' + item.element.name + '|' + item.element.id + ').start: Starting a converging gateway this.inbounds.length=' + this.inbounds.length);
                //item.token.log("..Starting a converging gateway");
                // what is my token
                //let result = this.findActiveFlows(item.token);
                let result = this.convergeFlows(item);
                // wait for pending tokens
                if (result.pendingTokens.length > 0) {
                    item.token.log('Gateway(' + item.element.name + '|' + item.element.id + ').start: result.pendingTokens.length = ' + result.pendingTokens.length + ' > 0 return NODE_ACTION.wait');
                    return __1.NODE_ACTION.wait;
                }
                else {
                    // No pending tokens
                    let parentToken = item.token.parentToken;
                    let convergingGatewayCurrentNode = item.token.currentNode;
                    item.token.log('Gateway(' + item.element.name + '|' + item.element.id + ').start: let us converge now waitingTokens.length=' + result.waitingTokens.length);
                    //item.token.log('..let us converge now ');
                    result.waitingTokens.forEach((t) => __awaiter(this, void 0, void 0, function* () {
                        item.token.log('Gateway(' + item.element.name + '|' + item.element.id + ').start: ..converging ending token ' + t.id);
                        //item.token.log("..converging ending token #" + t.id);
                        t.currentItem.status = __1.ITEM_STATUS.end;
                        yield t.end();
                        //await t.terminate();
                    }));
                    // -------------------------------------------------------------------------------------------------
                    // Create a new Token at converging  gateway
                    // -------------------------------------------------------------------------------------------------
                    //item.token.log('Gateway(' + item.element.name+'|'+item.element.id +  ').start: Creating a new Token at converging  gateway ..... ');
                    //await Token.startNewToken(TOKEN_TYPE.Primary,item.token.execution, item.token.currentNode, null, item.token, item, null);
                    //item.token.log('Gateway(' + item.element.name+'|'+item.element.id +  ').start: new Token created ');
                    item.token.log('Gateway(' + item.element.name + '|' + item.element.id + ').start: converged! all waiting tokens ended');
                    const oldCurrentToken = item.token;
                    // -------------------------------------------------------------------------------------------------
                    // Move the waiting token at diverging gateway
                    // -------------------------------------------------------------------------------------------------
                    if (parentToken) {
                        item.token.log('Gateway(' + item.element.name + '|' + item.element.id + ').start: converged! restart the parent token from this item! parentToken=' + parentToken.id);
                        //item.token.moveToCurrentNode()
                        parentToken.status = __1.TOKEN_STATUS.running;
                        parentToken.setCurrentNode(convergingGatewayCurrentNode);
                        item.token = parentToken;
                        //await item.token.signal(null);
                        const ret = yield parentToken.currentNode.run(item);
                        let result = yield parentToken.currentNode.continue(item);
                        result = yield parentToken.goNext();
                    }
                    // -------------------------------------------------------------------------------------------------
                    // end current token
                    // -------------------------------------------------------------------------------------------------
                    oldCurrentToken.log('Gateway(' + item.element.name + '|' + item.element.id + ').start: ending current child token ' + oldCurrentToken.id);
                    oldCurrentToken.currentItem.status = __1.ITEM_STATUS.end;
                    //await convergingGatewayCurrentNode.end(item);
                    //await oldCurrentToken.end();
                    if (oldCurrentToken.type == Token_1.TOKEN_TYPE.Diverge)
                        yield oldCurrentToken.terminate();
                    //item.token.log('Gateway(' + item.element.id + ').start: converged! divergingGateway=' + result.divergingGateway);
                    //console.log('Gateway(' + item.element.id + ').start: converged! divergingGateway=', result.divergingGateway);
                    item.token.log('Gateway(' + item.element.name + '|' + item.element.id + ').start: all token terminate return NODE_ACTION.end');
                    return __1.NODE_ACTION.end;
                }
            }
            else
                return __1.NODE_ACTION.continue;
        });
    }
}
exports.Gateway = Gateway;
/**
 *  ExclusiveGatway:
 *      outbounds:  only 1
 *      inbound:    only 1 -
 * */
class XORGateway extends Gateway {
    getOutbounds(item) {
        const outbounds = super.getOutbounds(item);
        if (outbounds.length > 1) {
            item.token.log('..XORGateway : removed other outbounds , took the first');
            return [outbounds[0]];
        }
        return outbounds;
    }
}
exports.XORGateway = XORGateway;
/**
 * trick here is once one event is met all others must be cancelled
 *
 * How will I know?
 *      when one of my events is fired shoudl I subscribe to the event or get directly notified?
 * */
class EventBasedGateway extends Gateway {
    constructor() {
        super(...arguments);
        this.working = false;
    }
    restored(item) {
        this.startMonitor(item);
        super.resume(item);
    }
    run(item) {
        return __awaiter(this, void 0, void 0, function* () {
            this.startMonitor(item);
            return __1.NODE_ACTION.end;
        });
    }
    cancelAllBranched(endingItem) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.working)
                return;
            this.working = true;
            const self = this;
            endingItem.token.execution.tokens.forEach(function (token) {
                return __awaiter(this, void 0, void 0, function* () {
                    if (token.status == __1.TOKEN_STATUS.wait && token.currentItem.id != endingItem.id) {
                        if (token.originItem && token.originItem.node.id == self.id) {
                            endingItem.token.log(`..EventBasedGateway:<${self.id}>-- cancelling  ${token.currentNode.id} `);
                            yield token.terminate();
                        }
                    }
                });
            });
            this.working = false;
        });
    }
    startMonitor(item) {
        if (this.listener)
            return;
        item.token.log("..EventBasedGateway is running" + this.id);
        this.listener = item.token.execution.listener;
        const self = this;
        this.listener.on(__1.EXECUTION_EVENT.node_end, function ({ context }) {
            return __awaiter(this, void 0, void 0, function* () {
                const endingItem = context.item;
                const token = endingItem.token;
                const lastItem = token.lastItem;
                if (token.originItem && token.originItem.node.id == self.id) {
                    yield self.cancelAllBranched(endingItem);
                }
            });
        });
    }
}
exports.EventBasedGateway = EventBasedGateway;
//# sourceMappingURL=Gateway.js.map