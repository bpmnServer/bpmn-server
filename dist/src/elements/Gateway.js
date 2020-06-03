"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.XORGateway = exports.Gateway = void 0;
const Enums_1 = require("../engine/Enums");
const Elements_1 = require("./Elements");
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
class Gateway extends Elements_1.Node {
    /*
     * we are looking for:
     *      tokens are still active (pending)
     *  and tokens that are being held by the gateway to be converged.
     */
    findActiveFlows(token) {
        let divergingGateway = null;
        let parentToken = null;
        const pendingTokens = [];
        const waitingTokens = [];
        token.log('converging .. my token ' + token.id);
        if (token.parentToken) { // is a child did i branch from a gatewy
            if (token.branchNode.type == 'bpmn:InclusiveGateway' ||
                token.branchNode.type == 'bpmn:ExclusiveGateway') {
                divergingGateway = token.branchNode;
                parentToken = token.parentToken;
            }
        }
        else { // do I have a child branching from a gateway
            const childrenTokens = token.getChildrenTokens();
            childrenTokens.forEach(t => {
                if (t.branchNode.type == 'bpmn:InclusiveGateway' ||
                    token.branchNode.type == 'bpmn:ExclusiveGateway') {
                    divergingGateway = t.branchNode;
                    parentToken = token;
                }
            });
        }
        token.log('   converging gateway was : ' + divergingGateway.id);
        if (divergingGateway) {
            // that all branches that are active that passed through this gateway or branch from it
            token.execution.tokens.forEach(t => {
                if ((t.status != Enums_1.TOKEN_STATUS.end)
                    && (t.status != Enums_1.TOKEN_STATUS.terminated)
                    && (t.id != token.id)) {
                    if (t.currentNode.id == this.id) { // waiting for me
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
        token.log('   # of active tokens pending ' + pendingTokens.length);
        pendingTokens.forEach(t => {
            token.log('    token id ' + t.id + " " + t.currentNode.id);
        });
        return { pendingTokens, waitingTokens };
    }
    start(item) {
        if (this.inbounds.length > 1) { // converging .....
            item.token.log("Starting a converging gateway");
            // what is my token
            const result = this.findActiveFlows(item.token);
            if (result.pendingTokens.length > 0)
                return Enums_1.NODE_ACTION.wait;
            else {
                item.token.log('let us converge now ');
                result.waitingTokens.forEach(t => {
                    item.token.log("converging ending token #" + t.id);
                    t.currentItem.status = Enums_1.ITEM_STATUS.end;
                    t.end();
                });
            }
        }
        else
            return Enums_1.NODE_ACTION.continue;
    }
}
exports.Gateway = Gateway;
/**
 *  ExclusiveGatway:
 *      outbounds:  only 1
 *      inbound:    only 1 -
 *                      first flow arrives should cancel the rest: TODO
 * */
class XORGateway extends Elements_1.Node {
    getOutbounds(item) {
        const outbounds = super.getOutbounds(item);
        if (outbounds.length > 1) {
            item.token.log('XORGateway : removed other outbounds , took the first');
            return [outbounds[0]];
        }
        return outbounds;
    }
}
exports.XORGateway = XORGateway;
//# sourceMappingURL=Gateway.js.map