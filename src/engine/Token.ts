
import { Logger } from '../common/Logger';
const fs = require('fs');

import { Execution } from './Execution';
import { SubProcess , Behaviour_names, LoopBehaviour , Element, Node, Flow } from '../elements/'
import { EXECUTION_EVENT , NODE_ACTION , FLOW_ACTION, TOKEN_STATUS, EXECUTION_STATUS,  ITEM_STATUS, INode} from '../../';
import { EventEmitter } from 'events';
import { Loop } from './Loop';
import { Item } from './Item';
import { IToken, IExecution, IItem } from '../interfaces/engine';


/*
 *  Tokens:
 *          Start                       End                     data
 *          
 *      1 start of execution              end of execution          execution
 *      2 start of sbuexecution           end of subexecution       own (new object)
 *      3 start of multi-instances      end of instance         own (new object)
 *      4 diverging                     at converge             parent
 *      
 *  Rules:
 *      Node acts synchronisly
 *      
 *      parent token go on 'HOLD' waiting for children to finish
 *      
 *      token;  parent 
 *              holdingForCount   when 0 it proceeds to next node
 *              
 *   scenario 1:
 *      Event1 -> Task1->GW1 ->     task1      ->gw2            task 3
 *                                  task2      ->gw2
 *       t1         t1    t1(wait)                
 *                                  t2          t2 end -t1 wait
 *                                  t3          t3 end -t1 go
 *                                  
 *          when t2 arrives at gw2 - it ends and t1 count--
 *          when t3 arrives at gw2 - it ends and t1 count--
 *              since count==0 t1 will proceed
 *       gw2 logic t2 is from t1- waits for t1 counter to be 
 *       
 *       
 *       ------- Data ----
 *       
 *  execution Data execution.data
 *  nodeData
 *  
 *  
 */
// ---------------------------------------------

// ---------------------------------------------
class Token implements IToken {
    id;
    execution: IExecution;
    dataPath: string;
    startNodeId;
    parentToken?: Token;
    branchNode?: Node;
    path: Item[];  //  keep track of all nodes and flow taken 
    loop: Loop;

    currentNode: Node;
    processId;

    status: TOKEN_STATUS;

    get data():any {
        return this.execution.getData(this.dataPath);
    }
    get currentItem() : Item {
        return this.path[this.path.length - 1];
    }
    get lastItem() : Item {
        let nodes = this.path.filter(function (value) {
            return (value.element.type == 'bpmn:SequenceFlow') ? false : true;
        });

        if (nodes.length > 1)
            return nodes[nodes.length - 2];
        else
            return null;
    }
    constructor(execution: Execution, startNode: Node, dataPath? ,parentToken?: Token, branchNode?: Node) {
        this.execution = execution;
        if (dataPath)
            this.dataPath = dataPath;
        else
            this.dataPath = '';

        this.startNodeId = startNode.id;
        this.currentNode = startNode;
        this.parentToken = parentToken;
        this.branchNode = branchNode;
        this.id = execution.getNewId('token');
        this.processId = startNode.processId;
        this.path = [];
    }/*
    static newToken(execution:Execution, startNode, dataPath, parentToken: Token, branchNode: Node, loop: Loop, data = null) {
        const token = new Token(execution, startNode, dataPath, parentToken, branchNode);
        token.loop = loop;
        execution.tokens.set(token.id, token);
        token.applyInput(data);
        execution.addToQueue(token);
        return token;
    }*/
    static async startNewToken(execution, startNode, dataPath, parentToken: Token, branchNode: Node, loop: Loop , data=null) {
        const token = new Token(execution,  startNode ,dataPath, parentToken, branchNode);
        token.loop = loop;
        execution.tokens.set(token.id, token);
        token.applyInput(data);
        const result = await token.execute();
        return token;
    } 
    save() {
        let parentToken, branchNode, loopId;
        if (this.parentToken)
            parentToken = this.parentToken.id;
        if (this.branchNode)
            branchNode = this.branchNode.id;
        if (this.loop)
            loopId = this.loop.id;

        const items = [];

        this.path.forEach(i => {
            items.push(i.save());
        });

        return {
            id: this.id, status: this.status, dataPath: this.dataPath, loopId,
            parentToken, branchNode, startNodeId: this.startNodeId,
            currentNode: this.currentNode.id 
        };
    }
    static load(execution: Execution , da :any ) : Token {
        const startNode = execution.getNodeById(da.startNodeId);
        const parentToken = execution.getToken(da.parentToken);
        const branchNode = execution.getNodeById(da.branchNode);
        const currentNode = execution.getNodeById(da.currentNode);

        const token = new Token(execution, startNode, da.dataPath, parentToken, branchNode);
        token.id = da.id;
        token.startNodeId = da.startNodeId;
        token.currentNode = currentNode;
        token.status = da.status;
        token.path = [];
        return token;
    }
    /*
     * is fired once after the execution is resumed from restrt 
     * 
     *  fire resume for all existing items to wakeup the timers
     *  
     */
    resume() {
        this.currentNode.resume(this.currentItem);

    }
    restored() {
        this.path.forEach(item => {
            item.element.restored(item);
        });
    }
    getChildrenTokens() {
        const children = [];
        this.execution.tokens.forEach(token => {
            if (token.parentToken && (token.parentToken.id == this.id))
                children.push(token);
        });
        return children;
    }
    /*
     *  is called before Node execute and before an item is created
     *  
     */
    async preExecute() {
        // loop
        return await Loop.checkStart(this);
    }
    /*
     * is called just before moving to next item in the flow
     */
    async preNext() {

        return await Loop.checkNext(this);

    }
    /**
     * this is the primary exectuion method for a token
     */
    async execute() {

        if (!await this.preExecute())  
            return; // loop logic will take care of it

        let ret;
        const item = new Item(this.currentNode,this);
        this.path.push(item);
        this.log('.executing item:' + this.currentNode.id + " "+ item.id);

        ret = await this.currentNode.execute(item);
/*
        // check for subprocess 
        if (this.currentNode.type == 'bpmn:SubProcess') {
            this.log('..executing a sub process item:' + this.currentNode.id + " " + item.id + " is done");
            const subProcess = this.currentNode as SubProcess;
            const proc = subProcess.childProcess;
            const startNode = proc.getStartNode();

            const newToken = await Token.startNewToken(this.execution, startNode, null, this, this.currentNode, null);

        }
*/
        this.log('..executing item:' + this.currentNode.id+ " " +item.id + " is done");

        if (ret == NODE_ACTION.wait) {
            this.status = TOKEN_STATUS.wait;
            return;     // goto sleep for now will call you by signal

        }

        const result = await this.goNext();
        return result;

    }
    applyInput(inputData) {
        this.execution.applyInput(inputData, this.dataPath);
    }
    /**
     *  is called by Gateways to cancel current token
     *  
     * */
    terminate() {
        this.currentNode.end(this.currentItem);
        this.end();

    }
    /*
     *  is called to invoke an element like userTask, or trigger an envent or signal
     *  
     */ 
    async signal(data) {
        // check if valid node and valid status
        // find the item
        const item = this.currentItem;
        this.log(`..token.invoke ${this.currentNode.id} ${this.currentNode.type}`);

        this.applyInput(data);
        if (item.status == ITEM_STATUS.wait) {
            const ret = await this.currentNode.run(item);


            let result = await this.currentNode.continue(item);
            result =await this.goNext();
        }
        else
            this.log(`*** ERROR===== invoking a type of  ${this.currentNode.type} with status of ${item.status}`);

        this.log(`..token.invoke ended ${this.currentNode.id} ${this.currentNode.type}`);

    }
    /*
     *  is called to mark this token end
     */

    async end() {
        if (this.currentItem.status != ITEM_STATUS.end)
            this.log('..**token ended but item is still '+this.currentItem.status);
        this.status = TOKEN_STATUS.end;
        this.execution.tokenEnded(this);
        // check if subprocess then continue parent
        if (this.branchNode && this.branchNode.type == 'bpmn:SubProcess') {
            this.log('..subprocess token has ended');
            await this.parentToken.signal(null);
        }
    }
    /*
     *  once node is completed the token will move to next action
     *  
     */ 
    async goNext() {

        this.log(`..token.goNext ${this.currentNode.id} ${this.currentNode.type}`);
        if (!await this.preNext())
            return;

        const outbounds = this.currentNode.getOutbounds(this.currentItem);

        if (outbounds.length == 0) {
            this.log('...no more outbounds - ending token '+this.id);
            return await this.end();
        }

        let thisNode = this.currentNode;
        const self = this;
        const promises = [];
        if (outbounds.length > 1) {
            this.end();
        }
        outbounds.forEach(async function (flowItem) {

            /// need to check if next node is converging; therefore no new item``
            flowItem.status = ITEM_STATUS.end;
            self.path.push(flowItem);
            let nextNode = flowItem.element['to'];
            self.log('...processing flow' + flowItem.element.id + " to " +nextNode.id);
            if (nextNode) {
                if (outbounds.length == 1) {
                    self.currentNode = nextNode;
                    promises.push(self.execute());
                }
                else {
                    promises.push(Token.startNewToken(self.execution, nextNode, null, self, thisNode, null));
               }
            }
        });
        this.log(`... waiting for ${promises.length}`);
        await Promise.all(promises);
        this.log(`..token.goNext is done ${this.currentNode.id} ${this.currentNode.type}`);
    }
    log(msg) {
        this.execution.log(msg);
    }
}

// ---------------------------------------------
export { Token  }