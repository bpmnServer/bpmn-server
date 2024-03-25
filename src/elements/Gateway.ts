
import { Execution } from '../engine/Execution';
import { Token, TOKEN_TYPE } from '../engine/Token';
import { IBehaviour, Behaviour } from "./behaviours";
import { NODE_ACTION, FLOW_ACTION, EXECUTION_EVENT, TOKEN_STATUS, ITEM_STATUS } from '../';
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

    /// Returns a list of node_ids of all potential (future) path for a given node
    getPotentialPath(node,path=null)  {
        if (path==null) 
            path=new Map();
        for (var i = 0; i < node.outbounds.length; i++) {
            let flow = node.outbounds[i];
            let toNode=flow.to;
            if (!path.has(toNode.id)) {
                path.set(toNode.id,toNode);
                this.getPotentialPath(toNode,path);
            }
        }
        return path;
    }
    // checks to see if a node can reach - has a potential path to - another node
    canReach(node,target) {

        if (node.id==target.id)
            return true;
        let path=this.getPotentialPath(node);

        return path.has(target.id);

    }

    getRelatedTokens(item: Item) {
        let related=[];
        var ex=item.token.execution;

        ex.log(`Gateway.getRelatedTokens: for ${item.token.id}` );
        ex.tokens.forEach(token => {
            const branch = token.originItem ? token.originItem.elementId : 'root';
            const parent = token.parentToken ? token.parentToken.id : '-';
            let p='';
            for(var i=0;i<token.path.length;i++)
                {p+=''+token.path[i].node.id+'->'; }
            ex.log(`        ..token: ${token.id} - ${token.status} - ${token.type} current: ${token.currentNode.id} from ${branch} child of ${parent} path: ${p} ` );

            if (token.currentItem) 
            {
                if ( (token.id != item.token.id) &&
                    (token.currentItem.status != ITEM_STATUS.end && token.currentItem.status != ITEM_STATUS.terminated)) {

                    let canReach=this.canReach(token.currentNode,this);
                    ex.log(`            ..canReach: ${canReach} - token status: ${token.status} - item status ${token.currentItem.status}` );
                    if (canReach)
                        related.push(token);
                }
            }
        });

        related.forEach(t=>{
            ex.log(`    .. related token: ${t.id} ` );
        });
        return related;
    }

    analyzeConvergingTokens(item: Item) {
        const waitingTokens: Token[] = [];
        const pendingTokens: Token[] = [];
        const token=item.token;
        const related= this.getRelatedTokens(item);

        related.forEach(t=>{
            if (t.status != TOKEN_STATUS.end && t.status != TOKEN_STATUS.terminated) {
                if ((t.currentNode.id == this.id)) {
                    token.log('Gateway(' +item.element.name+'|'+item.element.id + ').convergeFlows: ... child token '+ t.id+' in current gateway => add to waitingTokens currentNode=' + t.currentNode.id);
                    waitingTokens.push(t);
                } else {
                    token.log('Gateway(' +item.element.name+'|'+item.element.id + ').convergeFlows: ... adding to pendingTokens '+ t.id+' node' + t.currentNode.id+' target '+this.id);
                    pendingTokens.push(t);
                }
            }
        });

        waitingTokens.forEach(t => {
            token.log('Gateway(' +item.element.name+'|'+item.element.id +  ').convergeFlows: ... waitingTokens token id:' + t.id + ' currentNode.id:' + t.currentNode.id);
        });
        token.log('Gateway(' +item.element.name+'|'+item.element.id + ').convergeFlows: '
            +'  pendingTokens:' + pendingTokens.length 
            +'  waitingTokens:' + waitingTokens.length );

        return { pendingTokens, waitingTokens};

    }

    async start(item: Item): Promise<NODE_ACTION> {
        item.token.log('Gateway(' + item.element.name+'|'+item.element.id + ').start: node.type=' + item.node.type);
        if (this.inbounds.length > 1) { // converging .....
            item.token.log('Gateway(' + item.element.name+'|'+item.element.id +  ').start: Starting a converging gateway this.inbounds.length=' + this.inbounds.length);

            let result = this.analyzeConvergingTokens(item);
            // wait for pending tokens
            if (result.pendingTokens.length > 0) {
                if (this.type == BPMN_TYPE.ExclusiveGateway) {

                    item.token.log('Gateway(' + item.element.name + '|' + item.element.id + ').start: cancel other pendingTokens.length=' + result.pendingTokens.length);
                    result.pendingTokens.forEach(async t => {
                        item.token.log("..cancel ending token #" + t.id);
                        t.currentItem.status = ITEM_STATUS.end;
                        await t.terminate();
                    });

                }
                else {
                    item.token.log('Gateway(' + item.element.name + '|' + item.element.id + ').start: result.pendingTokens.length = ' + result.pendingTokens.length + ' > 0 return NODE_ACTION.wait');
                    return NODE_ACTION.wait;
                }
            }
            else if (item.token.type==TOKEN_TYPE.Diverge){
                // No pending tokens
                let parentToken = item.token.parentToken;
                let convergingGatewayCurrentNode = item.token.currentNode;

                item.token.log('Gateway(' + item.element.name+'|'+item.element.id +  ').start: let us converge now waitingTokens.length=' + result.waitingTokens.length);
                item.token.log('..let us converge now ');
                result.waitingTokens.forEach(async t => {
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
                
                            
                    // -------------------------------------------------------------------------------------------------
                    // end current token
                    // -------------------------------------------------------------------------------------------------
                    oldCurrentToken.log('Gateway(' + item.element.name+'|'+item.element.id +  ').start: ending current child token ' + oldCurrentToken.id);
                    oldCurrentToken.currentItem.status = ITEM_STATUS.end;
                    //await convergingGatewayCurrentNode.end(item);
                    //await oldCurrentToken.end();

                    //if (oldCurrentToken.type==TOKEN_TYPE.Diverge)
                        await oldCurrentToken.terminate();
                

                    item.token.log('Gateway(' + item.element.name+'|'+item.element.id +  ').start: all token terminate return NODE_ACTION.end');
                    return NODE_ACTION.end;
                }
            }
        }
        //else
            return NODE_ACTION.continue;
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
        super.resume(item);
    }
    async run(item: Item): Promise<NODE_ACTION> {
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
}

export {Gateway,XORGateway , EventBasedGateway }