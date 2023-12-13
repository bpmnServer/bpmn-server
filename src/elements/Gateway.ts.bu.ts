
import { Execution } from '../engine/Execution';
import { Token, TOKEN_TYPE } from '../engine/Token';
import { IBehaviour, Behaviour } from "./behaviours";
import { NODE_ACTION, FLOW_ACTION, EXECUTION_EVENT, TOKEN_STATUS, ITEM_STATUS } from '..';
import { BPMN_TYPE, Node } from '.';
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

        token.log('Gateway(' + token.currentItem.element.name + '|'+token.currentItem.element.id+ ').findActiveFlows: tokenId:'+token.id+ ' startNode:'+ token.startNodeId);
        if (token.parentToken) {
            token.log('Gateway(' + token.currentItem.element.name + '|'+token.currentItem.element.id+ ').findActiveFlows: parentTokenId:'+ token.parentToken.id);
        }
        if (token.originItem) {
            token.log('Gateway(' + token.currentItem.element.name + '|'+token.currentItem.element.id+ ').findActiveFlows: originItem:'+ token.originItem.element.id);
        }
        
        token.log('Gateway(' + token.currentItem.element.name + '|'+token.currentItem.element.id+ ').findActiveFlows: converging  my token ' + token.id);
        if (token.parentToken) { // is a child did i branch from a gatewy
            token.log('Gateway(' + token.currentItem.element.name + '|'+token.currentItem.element.id+ ').findActiveFlows: there is a parentToken tokenId='+ token.parentToken.id);
            const siblings = token.parentToken.getChildrenTokens();
            token.log('Gateway(' + token.currentItem.element.name + '|'+token.currentItem.element.id+ ').findActiveFlows: siblings tokens='+ token.parentToken.id);
            if (token.originItem.node.type == 'bpmn:InclusiveGateway' ||
                token.originItem.node.type == 'bpmn:ExclusiveGateway' ||
                token.originItem.node.type == 'bpmn:ParallelGateway') {
                divergingGateway = token.originItem.node;
                parentToken = token.parentToken;
                token.log('Gateway(' + token.currentItem.element.name + '|'+token.currentItem.element.id+ ').findActiveFlows:     token.originItem.node.type=' + token.originItem.node.type+' divergingGateway=' + divergingGateway.id);
            }
        }
        else { // do I have a child branching from a gateway
            let childrenTokens = token.getChildrenTokens();
            token.log('Gateway(' + token.currentItem.element.name + '|'+token.currentItem.element.id+ ').findActiveFlows: childrenTokens.length='+ childrenTokens.length);
            childrenTokens.forEach(t => {
                if (t.originItem.node.type == 'bpmn:InclusiveGateway' ||
                    t.originItem.node.type == 'bpmn:ParallelGateway' ||
                    token.originItem.node.type == 'bpmn:ExclusiveGateway') {
                    divergingGateway = t.originItem.node;
                    parentToken = token;
                    token.log('Gateway(' + token.currentItem.element.name + '|'+token.currentItem.element.id+ ').findActiveFlows:     parentToken=' + parentToken.id);
                    token.log('Gateway(' + token.currentItem.element.name + '|'+token.currentItem.element.id+ ').findActiveFlows:     divergingGateway=' + divergingGateway.id);
                }
            });
        }
        if (divergingGateway) {
            token.log('Gateway(' + token.currentItem.element.name + '|'+token.currentItem.element.id+ ').findActiveFlows: divergingGateway gateway ' + divergingGateway.id);
            //token.log('..converging gateway was : ' + divergingGateway.id);
            // that all branches that are active that passed through this gateway or branch from it
            token.execution.tokens.forEach(t => {
                token.log('Gateway(' + token.currentItem.element.name + '|'+token.currentItem.element.id+ ').findActiveFlows:   .. processing token id=' + t.id + ' status=' + t.status);
                /*
                if ((t.status != TOKEN_STATUS.end)
                    && (t.status != TOKEN_STATUS.terminated)
                    && (t.id != token.id)) {*/
                if ((t.status != TOKEN_STATUS.end) && (t.status != TOKEN_STATUS.terminated)) {
                    if (t.currentNode.id == this.id) {// waiting for me
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

        token.log('Gateway(' + token.currentItem.element.name + '|'+token.currentItem.element.id+').findActiveFlows: number of active tokens pending = ' + pendingTokens.length);
        pendingTokens.forEach(t => {
            token.log('Gateway(' + token.currentItem.element.name + '|'+token.currentItem.element.id+').findActiveFlows: ..pending token id: ' + t.id + " currentNode.id:" + t.currentNode.id);
        });

        token.log('Gateway(' + token.currentItem.element.name+'|'+token.currentItem.element.id +  ').findActiveFlows: number of active tokens waiting = ' + waitingTokens.length);
        waitingTokens.forEach(t => {
            token.log('Gateway(' + token.currentItem.element.name+'|'+token.currentItem.element.id + ').findActiveFlows: ..waitingTokens token id:' + t.id + ' currentNode.id:' + t.currentNode.id);
        });

        return { pendingTokens, waitingTokens };
    }
    // new logic 
    // since all splits causes new token to be created
    analyzeConvergeFlows(item: Item) {
        const waitingTokens: Token[] = [];
        const pendingTokens: Token[] = [];

        const token = item.token;
        let  siblings;
        token.log('Gateway(' +item.element.name+'|'+item.element.id + ').convergeFlows: token ' + token.id
                    +' origin.Item '+ token.originItem.node.id + ' type '+ token.originItem.node.type);
        token.log('Gateway(' +item.element.name+'|'+item.element.id + ').convergeFlows: inbounds.length=' + this.inbounds.length);
        if (this.inbounds.length > 1
            && token.originItem
            && (token.originItem.node.type == 'bpmn:InclusiveGateway' ||
                token.originItem.node.type == 'bpmn:ExclusiveGateway' ||
                token.originItem.node.type == 'bpmn:ParallelGateway')) {

            siblings = token.parentToken ? token.parentToken.getChildrenTokens() : [];

            if (siblings) {
                siblings.forEach(t => {
                    token.log('Gateway(' +item.element.name+'|'+item.element.id + ').convergeFlows: ... sibling token:' + t.id + ' current node:'+t.currentNode.id);
                    // Find children tokens
                    const siblingChildrenTokens = t.getChildrenTokens();
                    let siblingHasActiveChildToken=false;
                    token.log('Gateway(' +item.element.name+'|'+item.element.id + ').convergeFlows: siblingChildrenTokens.length='+ siblingChildrenTokens.length);
                    siblingChildrenTokens.forEach(siblingChildToken => {
                        token.log('Gateway(' +item.element.name+'|'+item.element.id + ').convergeFlows: ... siblingChildToken:'+ siblingChildToken.id + " status: "+siblingChildToken.status);
                        if (siblingChildToken.originItem.node.type == 'bpmn:InclusiveGateway' ||
                        siblingChildToken.originItem.node.type == 'bpmn:ParallelGateway' ||
                        siblingChildToken.originItem.node.type == 'bpmn:ExclusiveGateway') {
                            if (siblingChildToken.status!= TOKEN_STATUS.end && siblingChildToken.status != TOKEN_STATUS.terminated) {
                                siblingHasActiveChildToken = true;
                                token.log('Gateway(' +item.element.name+'|'+item.element.id + ').convergeFlows: ... siblingChildToken status='+ siblingChildToken.status);
                            }
                        }
                    });
                    //if ((t.id != token.id) && (t.currentNode.id == this.id)) {// waiting for me
                    if ((t.id != token.id)) {// exclude current token
                        if (t.status != TOKEN_STATUS.end && t.status != TOKEN_STATUS.terminated) {
                            if ((t.currentNode.id == this.id)) {
                                //
                                token.log('Gateway(' +item.element.name+'|'+item.element.id + ').convergeFlows: ... child token '+ t.id+' in current gateway => add to waitingTokens currentNode=' + t.currentNode.id);
                                waitingTokens.push(t);
                            } else {
                                token.log('Gateway(' +item.element.name+'|'+item.element.id + ').convergeFlows: ... child token '+ t.id+' NOT in current gateway => add to pendingTokens currentNode=' + t.currentNode.id);
                                pendingTokens.push(t);
                            }

                        }
                        if (siblingHasActiveChildToken) {
                            // add token to pending because has children active in another gateway branch
                            token.log('Gateway(' +item.element.name+'|'+item.element.id + ').convergeFlows: ... child token '+ t.id+' has active children token in a child gateway => add to pendingTokens currentNode=' + t.currentNode.id);
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
        // get active inbound flows:
        var activeFlows=[];
        this.inbounds.forEach(inb =>{
            token.log('--->inbound flow:'+inb.type + ' ' +inb.id+' from '+inb.from.id+' to '+inb.to.id+ ' checking '+inb.type + ' ' +inb.id+' def '+ inb.def);
            if (inb.evaluateCondition(item))
                activeFlows.push(inb);
        });

        // get pending flows:
        var pendingFlows=[];

        activeFlows.forEach(inb =>{
            token.log('--->inbound active flow:'+inb.type + ' ' +inb.id+' from '+inb.from.id+' to '+inb.to.id);
            var match=false;
            if (siblings) {
                siblings.forEach(t => {
                    //if (inb.from.id == t.currentNode.id) 
                    {
                        let p='';
                        for(var i=0;i<t.path.length;i++)
                            {p+=''+t.path[i].node.id+'->'; }
                        let lastId=null;
                        if (t.path.length>1)
                            lastId=t.path[t.path.length-1].node.id;
                        token.log('Gateway(' +item.element.name+'|'+item.element.id + ').convergeFlows: ... matching...  token id: ' + t.id + " currentNode.id:" + t.currentNode.id+' lastId: '+lastId+ ' path:'+ p );

                        if (t.hasNode(inb.id)) {
                            token.log('Gateway(' +item.element.name+'|'+item.element.id + ').convergeFlows: ... matched...  token id: ' + t.id + " currentNode.id:" + t.currentNode.id+' lastId: '+lastId+ ' path:'+ p );
                            match=true;
                            }
                    }
                    });
                }
            if (!match)
                pendingFlows.push(inb);
        });

        pendingFlows.forEach(f => {
            token.log('Gateway(' +item.element.name+'|'+item.element.id + ').convergeFlows: ... pending flow id: ' + f.id + " from.id:" + f.from.id);
        });

        pendingTokens.forEach(t => {
            token.log('Gateway(' +item.element.name+'|'+item.element.id + ').convergeFlows: ... pending token id: ' + t.id + " currentNode.id:" + t.currentNode.id);
        });

        waitingTokens.forEach(t => {
            token.log('Gateway(' +item.element.name+'|'+item.element.id +  ').convergeFlows: ... waitingTokens token id:' + t.id + ' currentNode.id:' + t.currentNode.id);
        });
        token.log('Gateway(' +item.element.name+'|'+item.element.id + ').convergeFlows: '
            +'  pendingTokens:' + pendingTokens.length 
            +'  waitingTokens:' + waitingTokens.length 
            +'  activeFlows:' + activeFlows.length 
            +'  pendingFlows:' + pendingFlows.length );

        return { pendingTokens, waitingTokens ,activeFlows, pendingFlows  };

    }

    async start(item: Item): Promise<NODE_ACTION> {
        item.token.log('Gateway(' + item.element.name+'|'+item.element.id + ').start: node.type=' + item.node.type);

        if (!(this.inbounds.length > 1)) 
            return NODE_ACTION.continue;

        // check converging gateway
        item.token.log('Gateway(' + item.element.name+'|'+item.element.id +  ').start: Starting a converging gateway this.inbounds.length=' + this.inbounds.length);
        //item.token.log("..Starting a converging gateway");
        // what is my token
        //let result = this.findActiveFlows(item.token);
        let result = this.analyzeConvergeFlows(item);
        //  pendingTokens:  Tokens that are waiting for execution
        //  activeFlows:   incoming Flows that have no condition or condition == true
        //  pendingFlows:   incoming Flows that are waiting for execution
        //  waitingTokens:  Tokens that are completed - but waiting for others at the gateway
        // wait for pending tokens


//        if (!(result.activeFlows.length > 1))
//            return NODE_ACTION.continue;

        if ((result.pendingTokens.length > 0)
             && (this.type == BPMN_TYPE.ExclusiveGateway)) {

                item.token.log('Gateway(' + item.element.name + '|' + item.element.id + ').start: cancel other pendingTokens.length=' + result.pendingTokens.length);
                result.pendingTokens.forEach(async t => {
                    item.token.log("..cancel ending token #" + t.id);
                    t.currentItem.status = ITEM_STATUS.end;
                    await t.end();
                });
                return NODE_ACTION.end;
         }
         else if (result.pendingTokens.length > 0) { // (result.pendingFlows.length > 0 ) {// 
                item.token.log('Gateway(' + item.element.name + '|' + item.element.id + ').start: result.pendingTokens.length = ' + result.pendingTokens.length + ' > 0 return NODE_ACTION.wait');
                return NODE_ACTION.wait;
        }
        else {
            // No pending tokens
            return await this.converge(item,result.waitingTokens);
        }
    }

    async converge(item,waitingTokens) {

                let parentToken = item.token.parentToken;
                let convergingGatewayCurrentNode = item.token.currentNode;

                item.token.log('Gateway(' + item.element.name+'|'+item.element.id +  ').start: let us converge now waitingTokens.length=' + waitingTokens.length);
                item.token.log('..let us converge now ');
                waitingTokens.forEach(async t => {
                    item.token.log('Gateway(' + item.element.name+'|'+item.element.id +  ').start: ..converging ending token ' + t.id);
                    item.token.log("..converging ending token #" + t.id);
                    t.currentItem.status = ITEM_STATUS.end;
                    await t.end();
                    //await t.terminate();
                });

                
                // -------------------------------------------------------------------------------------------------
                // Create a new Token at converging  gateway
                // -------------------------------------------------------------------------------------------------
                //item.token.log('Gateway(' + item.element.name+'|'+item.element.id +  ').start: Creating a new Token at converging  gateway ..... ');
                //await Token.startNewToken(TOKEN_TYPE.Primary,item.token.execution, item.token.currentNode, null, item.token, item, null);
                //item.token.log('Gateway(' + item.element.name+'|'+item.element.id +  ').start: new Token created ');

                item.token.log('Gateway(' + item.element.name+'|'+item.element.id +  ').start: converged! all waiting tokens ended');

                const oldCurrentToken = item.token;

                // -------------------------------------------------------------------------------------------------
                // Move the waiting token at diverging gateway
                // -------------------------------------------------------------------------------------------------
                if (parentToken) {
                    item.token.log('Gateway(' + item.element.name+'|'+item.element.id +  ').start: converged! restart the parent token from this item! parentToken='+parentToken.id);
                    //item.token.moveToCurrentNode()
                    parentToken.status = TOKEN_STATUS.running;
                    parentToken.setCurrentNode(convergingGatewayCurrentNode);
                    item.token = parentToken;
                    //await item.token.signal(null);
                    const ret = await parentToken.currentNode.run(item);
                    let result = await parentToken.currentNode.continue(item);
                    result = await parentToken.goNext();
                }
                
                            
                // -------------------------------------------------------------------------------------------------
                // end current token
                // -------------------------------------------------------------------------------------------------
                oldCurrentToken.log('Gateway(' + item.element.name+'|'+item.element.id +  ').start: ending current child token ' + oldCurrentToken.id);
                oldCurrentToken.currentItem.status = ITEM_STATUS.end;
                //await convergingGatewayCurrentNode.end(item);
                //await oldCurrentToken.end();

                //if (oldCurrentToken.type==TOKEN_TYPE.Diverge)
                    await oldCurrentToken.terminate();
                

                //item.token.log('Gateway(' + item.element.id + ').start: converged! divergingGateway=' + result.divergingGateway);
                //console.log('Gateway(' + item.element.id + ').start: converged! divergingGateway=', result.divergingGateway);

                item.token.log('Gateway(' + item.element.name+'|'+item.element.id +  ').start: all token terminate return NODE_ACTION.end');
                return NODE_ACTION.end;

    }
}

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
                if (token.originItem && token.originItem.node.id == self.id)
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
        this.listener.on(EXECUTION_EVENT.node_end, async function ({ context}) {
            const endingItem = context.item;
            const token = endingItem.token;

            const lastItem = token.lastItem;
            if (token.originItem && token.originItem.node.id == self.id) {

                await self.cancelAllBranched(endingItem);
            }

        });

    }

}

export {Gateway,XORGateway , EventBasedGateway }