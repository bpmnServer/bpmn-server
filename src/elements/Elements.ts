
import { Execution } from '../engine/Execution';
import { Token } from '../engine/Token';
import { IBehaviour, Behaviour} from './Behaviour';
import { NODE_ACTION, FLOW_ACTION, EXECUTION_EVENT, TOKEN_STATUS, ITEM_STATUS } from '../engine/Enums';
//import { Gateway } from './Gateway';
import { Item } from '../engine/Item';
import { Process } from './Process';

/**
 *  defines the context of execution
 *      primarly the execution itself or a subprocess or loop or an instance
 *      it holds the data 
 * */
function scopeEval(scope, script) {
    let result;
    try {
        result = Function('"use strict";return (' + script + ')').bind(scope)();
    }
    catch (exc) {
        console.log(exc);
    }
    return result;
}
async function scopeJS(scope, script) {
    const AsyncFunction = Object.getPrototypeOf(async function () { }).constructor;

    let result;
    try {
        scope.token.log("executing js " + scope.id);
//        result = await new AsyncFunction('"use strict";' + script).bind(scope)();
        scope.token.log("executing js is done " + scope.id);
    }
    catch (exc) {
        console.log(exc);
    }
    return result;

}

class Element {
    id;
    type;
    name;
    behaviours = new Map();
/* is called after the execution is restarted */

    continue(item: Item) { }
    resume(item: Item) { }
    /**
     * respond by providing behaviour attributes beyond item and node information
     *  ex: timer due , input/outupt , fields 
     * */
    hasBehaviour(name): boolean {

        return this.behaviours.has(name);
    }
    getBehaviour(name) {
        return this.behaviours.get(name);
    }
    addBehaviour(nane,behavriour) {
        this.behaviours.set(nane,behavriour);
    }

}
class Flow extends Element {
    from: Node;
    to: Node;
    def;
    constructor(id, type, from, to, def) {
        super();
        this.id = id;
        this.type = type;
        this.from = from;
        this.to = to;
        this.def = def;
        this.name = def.name;
    }
    run(item: Item) {

        let action = FLOW_ACTION.take;
        if (this.def.conditionExpression) {
            // conditionExpression:{"$type":"bpmn:Expression","body":"true"}
            let expression = this.def.conditionExpression.body;
            item.token.log('conditionExpression:' + JSON.stringify(this.def.conditionExpression));
            item.token.log(JSON.stringify(item.token.data));
            let result = scopeEval(item.token.data, expression);
            item.token.log('conditionExpression:' + expression + " result: " + result);
            if (result == false) {
                action = FLOW_ACTION.discard;
            }
        }
        else {
            action = item.token.execution.handler.flowResponse(item);

        }
        item.token.log('Flow -' + this.id + ' goting to ' + this.to.id + " action : " + action);
        return action;
    }
}
// ---------------------------------------------
// ---------------------------------------------

class Node  extends Element{
    name;
    processId;
    def;
    outbounds: Flow[];
    inbounds: Flow[];

    static loadNode(el,processId): Node {

        switch (el.$type) {
            case 'bpmn:UserTask':
                   return new UserTask(el.id, processId, el.$type, el);
                    break;
            case  'bpmn:ScriptTask':
                return new ScriptTask(el.id, processId, el.$type, el);
                    break;
            case  'bpmn:ServiceTask':
                return new ServiceTask(el.id, processId, el.$type, el);
                    break;
            case 'bpmn:SendTask':
                return new SendTask(el.id, processId, el.$type, el);
                break;
            case  'bpmn:ReceiveTask':
                return new ReceiveTask(el.id, processId, el.$type, el);
                    break;
            case 'bpmn:ParallelGateway' :
                return new Gateway(el.id, processId, el.$type, el);
                    break;
            case  'bpmn:InclusiveGateway':
                return new Gateway(el.id, processId, el.$type, el);
                    break;
            case 'bpmn:ExclusiveGateway':
                return new Gateway(el.id, processId, el.$type, el);
                break;
            default:
                return new Node(el.id, processId, el.$type, el);
                    break;
        }
    } 
    constructor(id, processId, type, def) {
        super();
        this.id = id;
        this.processId = process;
        this.type = type;
        this.def = def;
        this.inbounds = [];
        this.outbounds = [];
        this.name = def.name;

        Behaviour.scan(this);
    }

    doEvent(item: Item, event :EXECUTION_EVENT,newStatus: ITEM_STATUS) {
        item.status = newStatus;
        item.token.log('>'+event+ ' ' + this.id);
        item.token.execution.doItemEvent(item, event);

    }
    enter(item:Item) {
        item.startedAt = new Date().toISOString();;

    }
    /*
     * does the need require to go into wait 
     * tasks like UserTasks, receiveTask, timer 
     */
    requiresWait() { return false; }
    /* 
     * Can the Node be invoked externally (not from the workflow)
     * tasks like UserTasks, receiveTask, or events like receive,signal can be invoked
     */
    canBeInvoked() { return false; }


    /**
     * this is the primary exectuion method for a node
     * 
     * considerations: the following are handled by Token
     *      1.  Loops we are inside a loop already (if any)
     *      2.  Gatways 
     *      3.  Subprocess the parent node is fired as normal
     *              run method will fire the subprocess invoking a new token and will go into wait
     */
    async execute(item:Item) {


        //  2  enter
        //  --------
        this.doEvent(item, EXECUTION_EVENT.node_enter, ITEM_STATUS.enter);

        this.enter(item);   // no choice

        //  3   start
        //  --------

        this.doEvent(item, EXECUTION_EVENT.node_start, ITEM_STATUS.start);

        let ret = this.start(item);

        let wait=ret==NODE_ACTION.wait;
        this.behaviours.forEach(b => {
            if (b.start(item) == NODE_ACTION.wait) {
                item.token.log("behaviour returned wait");
                wait = true;
            }
            
        });

        if (wait) {
            this.doEvent(item, EXECUTION_EVENT.node_wait, ITEM_STATUS.wait);
            return NODE_ACTION.wait;     
        }
        //  4   run  perform the work
        //  --------

        item.token.log('>run ' + this.id);

        ret = await this.run(item);
        switch (ret) {
            case NODE_ACTION.error:
                return ret;
                break;
            case NODE_ACTION.abort:
                return ret;
                break;
        }
        //  5   continue    that will fire: 
        //  --------
        //          end

        return this.continue(item);

    }
    /*
     *  called by execute or by token.invoke to continue work already started
     */ 
    continue(item: Item) {

        this.end(item);
        item.endedAt = new Date().toISOString();;
        this.behaviours.forEach(b => { b.end(item); });
        this.doEvent(item, EXECUTION_EVENT.node_end, ITEM_STATUS.end);
        return;
    }

    start(item:Item): NODE_ACTION {

        if (this.requiresWait()) {
            return NODE_ACTION.wait;
        }
        return NODE_ACTION.continue;
    }

    async run(item: Item): Promise<NODE_ACTION> {

        return NODE_ACTION.end;
    }
    end(item:Item) {

    }
    resume(item: Item) {

    }
    /* to be overwritten by XOR gateway */

    getOutbounds(item: Item) : Item[] {
        const outbounds = [];
        this.outbounds.forEach(flow => {
            let flowItem = new Item(flow, item.token);
            if (flow.run(flowItem) == FLOW_ACTION.take)
                outbounds.push(flowItem);
        });
        item.token.log('return outbounds' + outbounds.length);
        return outbounds;
    }
}

// ---------------------------------------------
class ScriptTask extends Node {
    async run(item): Promise<NODE_ACTION> {

        if (this.def.script) {
            item.token.log(this.def.script);
            await scopeJS(item, this.def.script);
        }
        return NODE_ACTION.end;
    }
}
/* * TODO: should also call it by just name
 * 
 *      foo[method]();
 *      
 *      await this.token.handler[serviceName](data);
 */ 
class ServiceTask extends Node {
    async run(item): Promise<NODE_ACTION> {
        item.token.log(this.def.implementation);
        if (this.def.implementation) {
            item.token.log('invoking service call '+this.id+" "+item.id);
            await scopeJS(item, this.def.implementation);
            //await item.token.execution.handler[this.def.implementation](item);
            item.token.log('returned from service call '+this.id+ " "+item.id);
        }
//        console.log(' returning at service task');
        return NODE_ACTION.end;
    }
}
class SendTask extends ServiceTask {

}
class UserTask extends Node {

    requiresWait() { return true;}
    canBeInvoked() { return true; }
}
class ReceiveTask extends Node {

    requiresWait() { return true; }
    canBeInvoked() { return true; }
}


class Event extends Node {

    /**
     * 
     * 	using token: check if fromEventBasedGateway;	if yes cancel all other events
     * 	
     * @param item
     */
    start(item: Item): NODE_ACTION {
        return super.start(item);
    }

    end(item: Item){
        return super.end(item);
    }
    canBeInvoked() { return true;}

}
/*  TODO
    <endEvent id="EndEvent_2" name="Tweet rejected">
      <terminateEventDefinition id="TerminateEventDefinition_1"/>

    <endEvent>
 /process>
 */
class EndEvent extends Event {

    end(item: Item) {
        return super.end(item);
    }
}
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

        token.log('converging .. my token ' + token.id);
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
            token.log('   converging gateway was : ' + divergingGateway.id);
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
        token.log('   # of active tokens pending ' + pendingTokens.length);
        pendingTokens.forEach(t => {
            token.log('    token id ' + t.id + " " + t.currentNode.id);
        });

        return { pendingTokens, waitingTokens };
    }

    start(item: Item): NODE_ACTION {
        if (this.inbounds.length > 1) { // converging .....
            item.token.log("Starting a converging gateway");
            // what is my token
            let result = this.findActiveFlows(item.token);
            if (result.pendingTokens.length > 0)
                return NODE_ACTION.wait;
            else {
                item.token.log('let us converge now ');
                result.waitingTokens.forEach(t => {
                    item.token.log("converging ending token #" + t.id);
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
            item.token.log('XORGateway : removed other outbounds , took the first');
            return [outbounds[0]];

        }

        return outbounds;
    }

}
class SubProcess extends Node {
    childProcess: Process;
    requiresWait() { return true; }
    canBeInvoked() { return false; }
}
export { Gateway, XORGateway }
export { Element, Node, Flow ,  Process , SubProcess}