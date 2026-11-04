
import { Execution } from '../engine/Execution.js';
import { Token, TOKEN_TYPE } from '../engine/Token.js';
import { type IBehaviour, Behaviour } from './behaviours/Behaviour.js';
import { NODE_ACTION, FLOW_ACTION, EXECUTION_EVENT, TOKEN_STATUS, ITEM_STATUS } from '../interfaces/Enums.js';
import { Node } from './Node.js';
import { BPMN_TYPE } from './NodeLoader.js';
import { Item } from '../engine/Item.js';
import { label } from './Flow.js';


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
    async getOutbounds(item: Item): Promise<Item[]> {
        const held = await this.flowsThatHold(item);
        const chosen = this.choose(held, item);
        this.explain(item, held, chosen);
        return chosen;
    }

    /** Which of its flows the gateway takes, of those that hold (an exclusive gateway: one). */
    choose(held: Item[], item: Item): Item[] {
        return held;
    }

    /** The decision in words, for the instance's log: the flows taken and why, for a gateway that chooses. */
    explain(item: Item, held: Item[], chosen: Item[]) {
        const flows = this.outbounds.filter(f => f.type !== BPMN_TYPE.MessageFlow);
        if (flows.length < 2) return;
        const names = (list) => list.map(f => label(f.element ?? f)).join(', ');
        const defaultFlow = this.def.default ? flows.find(f => f.id === this.def.default.id) : null;
        const takesDefault = defaultFlow && chosen.some(c => c.element?.id === defaultFlow.id);
        const decide = (action: string, why: (string | string[])[]) =>
            item.token.decision({ seq: item.seq, element: `gateway ${label(this)}`, action, why });
        if (!chosen.length)
            decide('takes no flow', ['none of its conditions held', [names(flows)], 'and it has no default flow']);
        else if (takesDefault)
            decide(`takes its default flow ${label(defaultFlow)}`, ['none of the conditions of its other flows held', [names(flows.filter(f => f !== defaultFlow))]]);
        else if (chosen.length < held.length)
            decide(`takes ${names(chosen)}`, [`the conditions of ${names(held)} held`, 'an exclusive gateway takes one, the first']);
        else
            decide(`takes ${names(chosen)}`, [
                chosen.length < flows.length ? `of ${names(flows)}` : 'all its flows',
                ...(defaultFlow ? [`its default flow ${label(defaultFlow)} only when no other holds`] : []),
            ]);
    }

    /** The outgoing flows whose conditions hold; the default flow when none does. */
    async flowsThatHold(item: Item): Promise<Item[]> {

        if (this.def.default) {

            let defaultFlow;
            const outbounds = [];
            for(const flow of this.outbounds) {
                if (flow.id == this.def.default.id) {
                    defaultFlow = flow;
                }
                else {
                    let flowItem = new Item(flow, item.token);
                    if (await flow.run(flowItem) == FLOW_ACTION.take)
                        outbounds.push(flowItem);
                }
            }

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
                // a running token whose item has ended is on its way to its next node: still to arrive
                if ( (token.id != item.token.id) &&
                    ((token.currentItem.status != ITEM_STATUS.end && token.currentItem.status != ITEM_STATUS.terminated)
                        || (token.status == TOKEN_STATUS.running && !token['joined']))) {

                    let canReach=this.canReach(token.currentNode,this);
                    ex.log(`            ..canReach: ${canReach} - token status: ${token.status} - item status ${token.currentItem.status}` );
                    if (canReach) {
                        // fix to bug #233 -- gateway mixes incoming flow for loops
                        //  loops need to be split by using keys
                        //  Rule: gateway inside a loop only waits of the loop flows
                      if (token.itemsKey!==null && item.token.itemsKey!==null) 
                        {
                        if ((item.token.itemsKey+'.'+token.itemsKey).startsWith(token.itemsKey+'.'))
                        related.push(token);
                        }
                      else  // normal case no keys
                        related.push(token);
                    } 
                        
                }
            }
        });

        related.forEach(t=>{
            ex.log(`    .. related token: ${t.id} ${t.status} ${t.itemsKey}` );
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
            // Branches arriving together: the one that joined them has ended this one; it does not join again
            if (item.token.status == TOKEN_STATUS.end || item.token.status == TOKEN_STATUS.terminated) {
                item.token.log('Gateway(' + item.element.name+'|'+item.element.id +  ').start: token ' + item.token.id + ' was joined already');
                return NODE_ACTION.end;
            }

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
                    item.token.decision({
                        seq: item.seq, element: `gateway ${label(this)}`, action: 'continues',
                        why: ['joins its branches (exclusive): the first to arrive goes on',
                            `the others are cancelled (at ${[...new Set(result.pendingTokens.map(t => label(t.currentNode)))].join(', ')})`],
                    });

                }
                else {
                    item.token.log('Gateway(' + item.element.name + '|' + item.element.id + ').start: result.pendingTokens.length = ' + result.pendingTokens.length + ' > 0 return NODE_ACTION.wait');
                    const at = [...new Set(result.pendingTokens.map(t => label(t.currentNode)))].join(', ');
                    item.token.decision({
                        seq: item.seq, element: `gateway ${label(this)}`, action: 'waits',
                        why: ['joins its branches', `waits for ${result.pendingTokens.length} still on the way (at ${at})`],
                    });
                    return NODE_ACTION.wait;
                }
            }
            else if (item.token.type==TOKEN_TYPE.Diverge){
                // No pending tokens
                let parentToken = item.token.parentToken;
                let convergingGatewayCurrentNode = item.token.currentNode;

                item.token.log('Gateway(' + item.element.name+'|'+item.element.id +  ').start: let us converge now waitingTokens.length=' + result.waitingTokens.length);
                item.token.log('..let us converge now ');
                // The gateway is one item: the branches that waited here gave theirs; this one, which goes on, takes the
                // first one's seq and start (when the first branch arrived), and theirs are dropped
                const arrivedAs = item.seq;
                const logs: any[] = item.token.execution.instance?.logs ?? [];
                for (const t of result.waitingTokens) {
                    item.token.log('Gateway(' + item.element.name+'|'+item.element.id +  ').start: ..converging ending token ' + t.id);
                    item.token.log("..converging ending token #" + t.id);
                    const waited = t.currentItem;
                    waited.status = ITEM_STATUS.end;
                    await t.end(true);
                    //await t.terminate();
                    if (waited !== item && waited.node?.id === this.id) {
                        if (waited.seq != null && (item.seq == null || waited.seq < item.seq)) item.seq = waited.seq;
                        if (waited.startedAt && (!item.startedAt || waited.startedAt < item.startedAt)) item.startedAt = waited.startedAt;
                        const at = t.path.indexOf(waited);
                        if (at >= 0) t.path.splice(at, 1);
                    }
                }
                // the log as one item: this branch's start is its arrival at the gateway
                if (item.seq !== arrivedAs) {
                    const action = (seq, what) => `{"seq":${seq},"type":'${this.type}',"id":'${this.id}',"action":'${what}'}`;
                    const started = logs.findIndex(l => l?.message === action(arrivedAs, 'Started'));
                    if (started >= 0) logs[started].message = action(item.seq, 'Arrived');
                }

                
                // -------------------------------------------------------------------------------------------------
                // Create a new Token at converging  gateway
                // -------------------------------------------------------------------------------------------------
                //item.token.log('Gateway(' + item.element.name+'|'+item.element.id +  ').start: Creating a new Token at converging  gateway ..... ');
                //await Token.startNewToken(TOKEN_TYPE.Primary,item.token.execution, item.token.currentNode, null, item.token, item, null);
                //item.token.log('Gateway(' + item.element.name+'|'+item.element.id +  ').start: new Token created ');

                item.token.log('Gateway(' + item.element.name+'|'+item.element.id +  ').start: converged! all waiting tokens ended');
                item.token.decision({ seq: item.seq, element: `gateway ${label(this)}`, action: 'continues', why: ['joins its branches: all have arrived'] });

                const oldCurrentToken = item.token;
                // it is ended once the parent has gone on: until then, it is not on its way anywhere
                oldCurrentToken['joined'] = true;

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
                    await oldCurrentToken.terminate();
                
                    item.token.log('Gateway(' + item.element.name+'|'+item.element.id +  ').start: all token terminate return NODE_ACTION.end');
                    return NODE_ACTION.end;
                }
            }
            else { // there are still pending tokens need to be cancelled or ended
                result.waitingTokens.forEach(async t => {
                    item.token.log('Gateway(' + item.element.name+'|'+item.element.id +  ').start: ..converging ending token ' + t.id);
                    item.token.log("..converging ending token #" + t.id);
                    t.currentItem.status = ITEM_STATUS.end;
                    await t.end(true);
                    //await t.terminate();
               });
               return NODE_ACTION.continue;
        }

        }
    }

    
}

/**
 *  ExclusiveGatway:
 *      outbounds:  only 1 
 *      inbound:    only 1 - 
 * */
class XORGateway extends Gateway {

    choose(held: Item[], item: Item): Item[] {
        if (held.length > 1) {
            item.token.log('..XORGateway : removed other outbounds , took the first');
            return [held[0]];
        }
        return held;
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
                    endingItem.token.decision({
                        seq: endingItem.seq, element: `event-based gateway ${label(self)}`, action: `cancels ${label(token.currentNode)}`,
                        why: [`${label(endingItem.node)} happened first`],
                    });

                    await token.terminate();
                }
            }
        });
        this.working = false;
    }
}

export {Gateway,XORGateway , EventBasedGateway }