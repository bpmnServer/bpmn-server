
import { Logger } from '../common/Logger';
const fs = require('fs');

import { Execution } from './Execution';
import { SubProcess ,  LoopBehaviour , Element, Node, Flow } from '../elements/'
import { EXECUTION_EVENT , NODE_ACTION , FLOW_ACTION, TOKEN_STATUS, EXECUTION_STATUS,  ITEM_STATUS, INode, NODE_SUBTYPE} from '../../';
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
enum TOKEN_TYPE {
    Primary = 'Primary', SubProcess = 'SubProcess', Instance = 'Instance', Diverge = 'Diverge',
    EventSubProcess='EventSubProces', BoundaryEvent ='BoundaryEvent'
}
// ---------------------------------------------
class Token implements IToken {
    id;
    type: TOKEN_TYPE;
    execution: IExecution;
    dataPath: string;
    startNodeId;
    parentToken?: Token;
//    branchNode?: Node;
    originItem: Item;
    path: Item[];  //  keep track of all nodes and flow taken 
    loop: Loop;
    currentNode: Node;
    processId;
    status: TOKEN_STATUS;
    input: {};
    output: {};
    messageMatchingKey: {};

    get data():any {
        return this.execution.getData(this.dataPath);
    }
    get currentItem() : Item {
        return this.path[this.path.length - 1];
    }
    get firstItem(): Item {
        return this.path[0];
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
    get childrenTokens(): Token[] {
        const list = [];
        this.execution.tokens.forEach(t => { if (t.parentToken && t.parentToken.id == this.id) list.push(t); });
        return list;
    }
    constructor(type: TOKEN_TYPE, execution: Execution, startNode: Node, dataPath? ,parentToken?: Token, originItem?: Item) {
        this.execution = execution;
        this.type = type;
        if (dataPath)
            this.dataPath = dataPath;
        else
            this.dataPath = '';

        this.startNodeId = startNode.id;
        this.currentNode = startNode;
        this.parentToken = parentToken;
        this.originItem= originItem;
        this.id = execution.getNewId('token');
        this.processId = startNode.processId;
        this.path = [];
    }
    /**
     * 
     * @param execution
     * @param startNode
     * @param dataPath
     * @param parentToken
     * @param originItem
     * @param loop
     * @param data
     */
    static async startNewToken(type: TOKEN_TYPE, execution, startNode, dataPath, parentToken: Token,
        originItem: Item, loop: Loop, data = null, noExecute = false) {
        const token = new Token(type,execution,  startNode ,dataPath, parentToken, originItem);
        token.log('Token(*).startNewToken:  starting new Token with id='+token.id+' start node='+startNode.id);

        token.loop = loop;
        execution.tokens.set(token.id, token);
        token.appendData(data);
        if (noExecute==false)
            await token.execute(data);
        return token;
    } 
    save() {
        let parentToken, originItem, loopId;
        if (this.parentToken)
            parentToken = this.parentToken.id;
        if (this.originItem)
            originItem = this.originItem.id;
        if (this.loop)
            loopId = this.loop.id;

        const items = [];

        this.path.forEach(i => {
            items.push(i.save());
        });

        return {
            id: this.id, type: this.type, status: this.status, dataPath: this.dataPath, loopId,
            parentToken, originItem, startNodeId: this.startNodeId,
            currentNode: this.currentNode.id 
        };
    }
    static load(execution: Execution , da :any ) : Token {
        const startNode = execution.getNodeById(da.startNodeId);
        const parentToken = execution.getToken(da.parentToken);
        const currentNode = execution.getNodeById(da.currentNode);

        const token = new Token(da.type,execution, startNode, da.dataPath, parentToken, null);
        token.id = da.id;
        token.startNodeId = da.startNodeId;
        token.currentNode = currentNode;
        token.status = da.status;
        token.path = [];
        return token;
    }
    stop() {
        
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
    getSubProcessToken() : Token {
        if (this.type==TOKEN_TYPE.SubProcess)
            return this;
        else if (this.parentToken == null)
            return null;
        else
            return this.parentToken.getSubProcessToken();

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
    async execute(input) {
        this.log('Token('+this.id +').execute: input'+JSON.stringify(input));
        if (this.status==TOKEN_STATUS.end) {
            this.log('Token('+this.id +').execute: token status is end: return from execute!');
            return;
        }
        if (!await this.preExecute())  
            return; // loop logic will take care of it

        let ret;
        const item = new Item(this.currentNode,this);
        this.path.push(item);
        this.log('Token('+this.id +').execute: new Item created itemId='+item.id);

        if (input)
            await this.currentNode.setInput(item,input);
            

        this.log('Token('+this.id +').execute: executing currentNodeId='+ this.currentNode.id);

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
        this.log('Token('+this.id +').execute: executing currentNodeId=' + this.currentNode.id+ " itemId=" +item.id + " is done!");

        if (ret == NODE_ACTION.wait) {
            this.status = TOKEN_STATUS.wait;
            return;     // goto sleep for now will call you by signal

        }
        else if (ret == NODE_ACTION.error) {
            await this.processError();
        }
        else if (ret == NODE_ACTION.abort) {
            this.execution.terminate();
            return;     

        }


        const result = await this.goNext();
        return result;

    }
    async processError() {

        let errorHandlerToken = null;
        // two types of error handlers
        //  1.  eventSubProcess 
        //  2.  boundaryEvents  
        let contextItem: Item = this.currentItem;
        let contextToken: Token = this;

        while (contextToken && errorHandlerToken == null) {
            contextToken.childrenTokens.forEach(ct => {
                if ((ct.type == TOKEN_TYPE.EventSubProcess || ct.type == TOKEN_TYPE.BoundaryEvent)
                    && ct.currentNode.subType == NODE_SUBTYPE.error) {
                    errorHandlerToken = ct;
                }
            });
            contextToken = contextToken.parentToken;
        }
        if (errorHandlerToken) {
            await errorHandlerToken.signal(null);
            this.currentItem.status = ITEM_STATUS.end;
            await this.end();
        }
        else {
            this.log("Aborting due to error")
            this.execution.terminate();
            return;
        }

    }
    async processEscalation () {

        let errorHandlerToken = null;
        // two types of error handlers
        //  1.  eventSubProcess 
        //  2.  boundaryEvents  
        let contextItem: Item = this.currentItem;
        let contextToken: Token = this;

        while (contextToken && errorHandlerToken == null) {
            contextToken.childrenTokens.forEach(ct => {
                if ((ct.type == TOKEN_TYPE.EventSubProcess || ct.type == TOKEN_TYPE.BoundaryEvent)
                    && ct.currentNode.subType == NODE_SUBTYPE.escalation) {
                    errorHandlerToken = ct;
                }
            });
            contextToken = contextToken.parentToken;
        }
        if (errorHandlerToken) {
            await errorHandlerToken.signal(null);
        }

    }
    /**
     * 
     *  renamed from applyInput to appendData
     * @param inputData
     */
    appendData(inputData) {
        this.execution.appendData(inputData, this.dataPath);
    }
    /**
     *  is called by Gateways to cancel current token
     *  
     * */
    async terminate() {
        this.log('Token('+this.id +').terminate: terminating ....');
        await this.currentNode.end(this.currentItem);
        await this.end();
        this.log('Token('+this.id +').terminate: terminating is done!');
    }
    /**
     *  is called by events to cancel current token
     *  
     * */
    async continue() {
        await this.currentNode.end (this.currentItem);
        await this.goNext();

    }
    /*
     *  is called to invoke an element like userTask, or trigger an envent or signal
     *  
     */ 
    async signal(data) {
        // check if valid node and valid status
        // find the item
        const item = this.currentItem;
        //this.log(`..token.signal ${this.currentNode.id} ${this.currentNode.type}`);
        this.log('Token('+this.id +').signal: invoking '+this.currentNode.id+' '+this.currentNode.type+' with data='+JSON.stringify(data));

        await this.currentNode.setInput(item, data);
        if (item.status == ITEM_STATUS.wait) {// || item.type=='bpmn:SubProcess') {
            const ret = await this.currentNode.run(item);


            let result = await this.currentNode.continue(item);
            result =await this.goNext();
        }
        else
            this.log(`*** ERROR===== invoking a type of  ${this.currentNode.type} with status of ${item.status}`);

        this.log('Token('+this.id +').signal: invoke '+this.currentNode.id+' '+this.currentNode.type+' finished!');

    }
    /*
     *  is called to mark this token end
     */

    async end() {
        this.log('Token('+this.id +').end: currentNode=' + this.currentNode.id +' status='+this.status+' currentItem.status='+this.currentItem.status);
        if (this.currentItem.status != ITEM_STATUS.end)
            this.log('..**token ended but item is still '+this.currentItem.status);
        this.status = TOKEN_STATUS.end;
        this.execution.tokenEnded(this);
        // check if subprocess then continue parent
        if (this.type==TOKEN_TYPE.SubProcess) {
            this.log('..subprocess token has ended');
            await this.parentToken.signal(null);
        }
        let i;
        const children = this.childrenTokens;
        for (i = 0; i < children.length; i++) {
            const child = children[i];
            if (child.type == TOKEN_TYPE.EventSubProcess) {
                await child.terminate();
            }
        }
        this.log('Token('+this.id +').end(): finished!');
    }

    setCurrentNode(newCurrentNode:Node){
        this.log('Token('+this.id +').goNext():  newCurrentNode.id=' + newCurrentNode.id+' currentNode='+this.currentNode);
        this.currentNode = newCurrentNode;
    
      }
      
    /*
     *  once node is completed the token will move to next action
     *  
     */ 
    async goNext() {
        this.log('Token('+this.id +').goNext(): currentNodeId=' + this.currentNode.id +' type='+this.currentNode.type+' currentItem.status='+this.currentItem.status);
        //this.log(`..token.goNext from ${this.currentNode.id} ${this.currentNode.type}`);

        if (!await this.preNext())
            return;

        const outbounds = this.currentNode.getOutbounds(this.currentItem);

        if (outbounds.length == 0) {
            this.log('Token('+this.id +').goNext(): no more outbounds - ending this token '+this.id);
            return await this.end();
        }

        let thisNode = this.currentNode;
        let thisItem = this.currentItem;
        const self = this;
        const promises = [];
//        if (outbounds.length > 1) {
//            this.end();
//        }
        this.log('Token('+this.id +').goNext(): verify outbonds....');
        outbounds.forEach(async function (flowItem) {
            self.log('Token('+self.id +').goNext(): ... outbonds flowItemId='+flowItem.id);
            /// need to check if next node is converging; therefore no new item``
            flowItem.status = ITEM_STATUS.end;
            self.path.push(flowItem);
            let nextNode = flowItem.element['to'];
            self.log('Token('+self.id +').goNext(): ... currentNodeId(' + self.currentNode.name +'|'+ self.currentNode.id +') processing  Flow(' + flowItem.element.id + ") to " +nextNode.id);
            if (nextNode) {
                if (outbounds.length == 1) {
                    self.currentNode = nextNode;
                    promises.push(self.execute(null));
                }
                else {
                    promises.push(Token.startNewToken(TOKEN_TYPE.Diverge,self.execution, nextNode, null, self, thisItem, null));
               }
            }
        });
        if (outbounds.length > 1) {
            this.end();
        }
        this.log('Token('+this.id +').goNext(): waiting for num promises '+promises.length);
        await Promise.all(promises);
        this.log('Token('+this.id +').goNext(): is done currentNodeId='+this.currentNode.id);
    }
    log(msg) {
        this.execution.log(msg);
    }
    error(msg) {
        this.execution.error(msg);
    }
}

// ---------------------------------------------
export { Token , TOKEN_TYPE }