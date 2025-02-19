
import { Execution } from './Execution';
import { Node, Behaviour_names } from '../elements/'
import { NODE_ACTION , TOKEN_STATUS, ITEM_STATUS, NODE_SUBTYPE} from '../';
import { Loop } from './Loop';
import { Item } from './Item';
import { IToken, IExecution } from '../interfaces/engine';

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
    EventSubProcess='EventSubProces', BoundaryEvent ='BoundaryEvent' ,AdHoc ='AdHoc'
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
    _currentNode: Node;
    get currentNode():Node {return this._currentNode}
    processId;
    status: TOKEN_STATUS;
    input: {};
    output: {};
    messageMatchingKey: {};
    itemsKey=null; // for loop items

    get data():any {
        return this.execution.getData(this.dataPath);
    }
    get currentItem() : Item {
        return this.path[this.path.length - 1];
    }
    get firstItem(): Item {
        return this.path[0];
    }

    hasNode(nodeId): Boolean {
        let match=false;
        this.path.forEach(i => {
            if(i.node.id == nodeId)
                match=true;
            });
        return match;
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
    getFullPath(path=[]) : Item[] {
        if (this.parentToken)
            path=this.parentToken.getFullPath(path);
        this.path.forEach(i => { path.push(i); });
        return path;       
    }
    constructor(type: TOKEN_TYPE, execution: Execution, startNode: Node, dataPath? ,parentToken?: Token, originItem?: Item) {
        this.execution = execution;
        this.type = type;

        if (dataPath)
            this.dataPath = dataPath;
        else if (parentToken)
            this.dataPath=parentToken.dataPath;
        else
            this.dataPath='';

        this.startNodeId = startNode.id;
        this._currentNode = startNode;
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
        originItem: Item, loop: Loop, data = null, noExecute = false, itemsKey=null) {

            const token = new Token(type,execution,  startNode ,dataPath, parentToken, originItem);
        
        if (parentToken && parentToken.itemsKey)
            token.itemsKey=parentToken.itemsKey;
        
        if (itemsKey!==null) {
            if (token.itemsKey!==null)
                token.itemsKey+='.';
            else 
                token.itemsKey='';
            token.itemsKey+=itemsKey;
        }
        if (loop)
            token.loop = loop;
        else if (parentToken)
            token.loop=parentToken.loop;            


        token.log('Token(*).startNewToken:  starting new Token with id='+token.id+' start node='+startNode.id);



        execution.tokens.set(token.id, token);
        token.appendData(data, originItem);
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

        return {
            id: this.id, type: this.type, status: this.status, dataPath: this.dataPath, loopId,
            parentToken, originItem, startNodeId: this.startNodeId,
            currentNode: this.currentNode.id , itemsKey: this.itemsKey
        };
    }
    static load(execution: Execution , da :any ) : Token {
        const startNode = execution.getNodeById(da.startNodeId);
        const parentToken = execution.getToken(da.parentToken);
        const currentNode = execution.getNodeById(da.currentNode);

        const token = new Token(da.type,execution, startNode, da.dataPath, parentToken, null);
        token.id = da.id;
        token.startNodeId = da.startNodeId;
        token._currentNode = currentNode;
        token.status = da.status;
        token.itemsKey=da.itemsKey;
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
        if (this.type==TOKEN_TYPE.SubProcess || this.type==TOKEN_TYPE.AdHoc)
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
     * this is the primary exectuion method for a token, it executes from current node till:
     *      a node hits a wait
     * 
     * Pre-Conditions:
     *      currentNode is set 
     *      status!= end
     */
    async execute(input) {

        this.logS('Token('+this.id +').execute:start input'+JSON.stringify(input));
        if (this.status==TOKEN_STATUS.end) {
            this.logE('Token(' + this.id + ').execute:end token status is end: return from execute!!');
            return;
            
        }
        this.status=TOKEN_STATUS.running;

        if (!await this.preExecute())  
            return; // loop logic will take care of it

        let ret;
        const item = new Item(this.currentNode, this);
        if (input)
            item.input = input;
        this.addItemToPath(item);
        this.log('Token('+this.id +').execute: new Item created itemId='+item.id);

        if (input)
            await this.currentNode.setInput(item,input);

//        if (!await this.preExecute())  
//            return; // loop logic will take care of it
    
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

        if (ret == NODE_ACTION.wait) {
            this.status = TOKEN_STATUS.wait;
            this.logE('Token('+this.id +').execute:end executing currentNodeId=' + this.currentNode.id+ " item.seq=" +item.seq + " is done!");
            return;     // goto sleep for now will call you by signal

        }
        else if (ret == NODE_ACTION.error) {
            // await this.processError(); done by the event with code
        }
        else if (ret == NODE_ACTION.abort) {
            this.execution.terminate();
            this.logE('Token('+this.id +').execute:end executing currentNodeId=' + this.currentNode.id+ " item.seq=" +item.seq + " is done!");
            return;     

        }
        else if (ret==NODE_ACTION.end) {
            this.status = TOKEN_STATUS.end;
            this.logE('Token('+this.id +').execute:end executing currentNodeId=' + this.currentNode.id+ " item.seq=" +item.seq + " is done!");
            return;     
        }

        // current Node is now completed 
        const result = await this.goNext();
        this.logE('Token('+this.id +').execute:end executing currentNodeId=' + this.currentNode.id+ " item.seq=" +item.seq + " is done!");
        return result;

    }
    addItemToPath(item) {
        this.path.push(item);
        this.setCurrentNode(item.node);

    }
    async processError(errorCode,callingEvent) {

        let errorHandlerToken = this.getScopeCatchEvent('error',errorCode);
        if (errorHandlerToken) {
            this.currentItem.statusDetails={bpmnError:errorCode,errorHandler:errorHandlerToken.currentItem.id,callingEvent:callingEvent.id};
            this.log("bpmnError raised by:"+callingEvent.elementId+" directing flow to:"+ errorHandlerToken.currentNode.id +  "bpmnError:"+ errorCode)
            await errorHandlerToken.signal({errorCode});
            this.currentItem.status = ITEM_STATUS.end;
            await this.end(true);
        }
        else {
            this.currentItem.statusDetails={bpmnError:errorCode,callingEvent:callingEvent.id};
            this.log("Aborting due to bpmnError",errorCode)
            await this.execution.terminate();
            return;
        }

    }
    getScopeCatchEvent(type:'error'|'escalation'|'cancel',code) {
        
        let contextItem: Item = this.currentItem;
        let contextToken: Token = this;
        let handlingEventTokens=[];
        let errorHandlerToken = null;
        let tokens=[];
        try {

        
        // two types of error handlers
        //  1.  eventSubProcess 
        //  2.  boundaryEvents  
        let bhName=Behaviour_names.ErrorEventDefinition;
        let propertyName='errorId';
        let nodeSubType=NODE_SUBTYPE.error;
        if (type=='escalation')
        {
            bhName=Behaviour_names.EscalationEventDefinition;
            propertyName='escalationId';
            nodeSubType=NODE_SUBTYPE.escalation
        }
        else if (type=='cancel')
        {
            bhName=Behaviour_names.CancelEventDefinition;
            propertyName=null;
            nodeSubType=NODE_SUBTYPE.cancel
        }

        let directEvents=contextItem.node.getBoundaryEventItems(contextItem);

        directEvents.forEach(ev=>{
                tokens.push(ev.token);
        });

        let handler=this.checkTokensForError(tokens,bhName,propertyName,code);

        if (handler)
            return handler;

        // second phase 
        tokens=[];
        while (contextToken && errorHandlerToken == null) {
            contextToken.childrenTokens.forEach(ct => {
                if ((ct.type == TOKEN_TYPE.EventSubProcess || ct.type == TOKEN_TYPE.BoundaryEvent)
                    && ct.currentNode.subType == nodeSubType) {

                    tokens.push(ct);
                }
            });
            contextToken = contextToken.parentToken;
        }

        this.execution.tokens.forEach(ct=>{
            if (ct.type == TOKEN_TYPE.EventSubProcess && ct.currentNode.subType == nodeSubType)
                tokens.push(ct);
        });

        return this.checkTokensForError(tokens,bhName,propertyName,code);

    }
    catch (exc) {
        console.log(exc);
        return null;
    }

    }
    private checkTokensForError(tokens,bhName,propertyName,errorCode) {

        let handlingCodeEventToken=null;
        let handlingAllEventToken=null;

        tokens.forEach(ct=>{
            let escl=ct.currentNode.getBehaviour(bhName);
            if (escl)
            {
                let cd=escl[propertyName];
                if (cd==errorCode && handlingCodeEventToken==null)
                    handlingCodeEventToken=ct;
                else if (!cd && handlingAllEventToken==null)
                    handlingAllEventToken=ct;
    
            }
            else
                handlingAllEventToken=ct;

        });

        if (handlingCodeEventToken)
            return handlingCodeEventToken;
        else
            return handlingAllEventToken;

    }
    async processCancel(callingEvent) {

        let errorHandlerToken = this.getScopeCatchEvent('cancel',null);
        if (errorHandlerToken) {
            await errorHandlerToken.signal(null);
        }

    }
    async processEscalation (escalationCode,callingEvent) {

        let errorHandlerToken = this.getScopeCatchEvent('escalation',escalationCode);
        if (errorHandlerToken) {
            let escl=errorHandlerToken.currentNode.getBehaviour(Behaviour_names.EscalationEventDefinition);

            this.log(`Action:"Escalation",Item:${errorHandlerToken.currentItem.seq},Code:"${escalationCode}",By:${callingEvent.seq}`);
            this.log({action:"Escalation",Item:errorHandlerToken.currentItem.seq,Code:escalationCode,By:callingEvent.seq});
            await errorHandlerToken.signal(null);
            if (escl){
                let cancel=escl.definition.$parent.cancelActivity;
                if (cancel==true && errorHandlerToken.type==TOKEN_TYPE.BoundaryEvent)
                    await errorHandlerToken.parentToken.end(true);
            }
        }
        else
            this.log({error:"Escalation not found",By:callingEvent.seq});

    }
    /**
     * 
     *  renamed from applyInput to appendData
     * @param inputData
     */
    appendData(inputData,item) {
        this.execution.appendData(inputData, item, this.dataPath);
    }
    /**
     *  is called by Gateways to cancel current token
     *  
     * */
    async terminate() {
        this.log('Token('+this.id +').terminate: terminating ....');
        //await this.currentNode.end(this.currentItem,true);
        await this.end(true);
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
    async signal(data,options={}) {
        // check if valid node and valid status
        // find the item
        let restart=false
        if (options['restart'])
            restart=options['restart'];
        let recover=false;
        if (options['recover'])
            recover=options['recover'];

        const item = this.currentItem;
        //this.log(`..token.signal ${this.currentNode.id} ${this.currentNode.type}`);
        this.logS('Token('+this.id +').signal: invoking '+this.currentNode.id+' '+this.currentNode.type+' with data='+JSON.stringify(data));

        await this.currentNode.setInput(item, data);
        
        if (restart) { // case when in restart mode  
            if (item.status==ITEM_STATUS.wait)
                return;

            const ret = await this.currentNode.run(item);

            let result = await this.currentNode.continue(item);
            result =await this.goNext();
            }  
        else if (item.status == ITEM_STATUS.wait || recover) {// || item.type=='bpmn:SubProcess') {

            await item.node.validate(item);

            const ret = await this.currentNode.run(item);

            let result = await this.currentNode.continue(item);

            if (options['noWait']==true)
                return;

            result =await this.goNext();
        }
        else
            this.log(`*** ERROR===== invoking item ${this.currentItem.node.id} ${this.currentItem.id} type of  ${this.currentNode.type} with status of ${item.status}`);

        this.logE('Token('+this.id +').signal: invoke '+this.currentNode.id+' '+this.currentNode.type+' finished!');

    }
    /*
     *  is called to invoke an element like userTask, or trigger an envent or signal
     *  
     */ 
    async signal2() {
        // check if valid node and valid status
        // find the item
        let self=this;
        await delay(5,null);
        /*
        await new Promise(function (resolve) {
            setTimeout(async function () {
                await self.goNext();
                }, 5);
        });*/

       await self.goNext();

       return this;

        
    }
    /*
     *  is called to mark this token end

    Child Scenarios:
        diverge
        subprocess/trans/adHoc
        loop

     */

    async end(cancel:Boolean=false) {
        this.logS('Token('+this.id +').end: currentNode=' + this.currentNode.id +' status='+this.status);

        if (this.status ==TOKEN_STATUS.end || this.status==TOKEN_STATUS.terminated)
            return;

        if (this.currentItem.node.id !== this.currentNode.id)
        {
            console.log('========= Node ',this.currentNode.id,'does not mach item',this.currentItem.node.id);
        }
        this.status = TOKEN_STATUS.end;
        if (this.currentItem)
            try {
                await this.currentNode.end(this.currentItem,cancel);
            }
            catch(exc) {
                console.log(exc.message,'current',this.currentNode);
                console.log(exc);
            }
        await this.execution.tokenEnded(this);

        // check if subprocess then continue parent
        const children = this.childrenTokens;
            for (let i = 0; i < children.length; i++) {
                const child = children[i];
                if (this.type==TOKEN_TYPE.SubProcess || this.type==TOKEN_TYPE.AdHoc 
                    || this.type == TOKEN_TYPE.EventSubProcess || this.type == TOKEN_TYPE.Instance
                    || child.type==TOKEN_TYPE.Instance || child.type==TOKEN_TYPE.AdHoc) 
                //if (child.type == TOKEN_TYPE.EventSubProcess || child.type==TOKEN_TYPE.AdHoc || child.type==TOKEN_TYPE.Instance ) 
                {
                    await child.terminate();
                }
            }
    
        if (this.type==TOKEN_TYPE.SubProcess) {
            this.currentItem.status= ITEM_STATUS.end;
            this.log('..subprocess token has ended');

            if (cancel==false)
                await this.parentToken.signal(null);

        }
        this.logE('Token('+this.id +').end(): finished!');
    }

    setCurrentNode(newCurrentNode:Node){
        this.log('Token('+this.id +').setCurrentNode():  newCurrentNode.id=' + newCurrentNode.id+' currentNode='+this.currentNode);
        this._currentNode = newCurrentNode;
    
      }
      
    /*
     *  once node is completed the token will move to next action
     *  
     */ 
    async goNext() {

                /** issue 186:  token with empty path due to loop preceded by gateway */
                if (this.path.length==0) {
                    // borrow item (just temporarly) from first child token
                    let tks=this.getChildrenTokens();
                    let ftkn=tks[0];
                    let titm=ftkn.path[0];
                    this.addItemToPath(titm);
                    // now verify a match
        
                }        

        this.logS('Token('+this.id +').goNext(): currentNodeId=' + this.currentNode.id +' type='+this.currentNode.type+' currentItem.status='+this.currentItem.status);
        if (this.currentItem.status=='wait')
        {
            this.logE('Token('+this.id +').goNext(): currentNodeId=' + this.currentNode.id +' type='+this.currentNode.type+' currentItem.status='+this.currentItem.status);
            return;
        }
        if (this.status==TOKEN_STATUS.terminated)
        {
            this.logE('Token('+this.id +').goNext(): currentNodeId=' + this.currentNode.id +' type='+this.currentNode.type+' status='+this.status+' not going next');
            return await this.end(true);
        }
        this.log('Token('+this.id +').goNext(): currentNodeId=' + this.currentNode.id +' type='+this.currentNode.type+' currentItem.status='+this.currentItem.status);
        //this.log(`..token.goNext from ${this.currentNode.id} ${this.currentNode.type}`);

        if (!await this.preNext()) {
            this.logE('Token('+this.id +').goNext(): no more outbounds - ending this token '+this.id);
            return;
        }

        const outbounds =await this.currentNode.getOutbounds(this.currentItem);

        if (outbounds.length == 0) {
            await this.end();
            this.logE('Token('+this.id +').goNext(): no more outbounds - ending this token '+this.id);
            return;
        }

        let thisNode = this.currentNode;
        let thisItem = this.currentItem;
        const self = this;
        const promises = [];

        // check diverging
        var diverging = false;
        if (outbounds.length > 1 || this.currentNode.outbounds.length > 1)
            diverging = true;


        if (diverging) // multiple nodes; create separate tokens
        {
            this.log('Token(' + this.id + ').goNext(): verify outbonds....');
            outbounds.forEach(async function (flowItem) {
                self.log('Token(' + self.id + ').goNext(): ... outbonds flowItemId=' + flowItem.id);
                /// need to check if next node is converging; therefore no new item``
                flowItem.status = ITEM_STATUS.end;
                self.addItemToPath(flowItem);
                let nextNode = flowItem.element['to'];
                self.log('Token(' + self.id + ').goNext(): ... currentNodeId(' + self.currentNode.name + '|' + self.currentNode.id + ') processing  Flow(' + flowItem.element.id + ") to " + nextNode.id);
                if (nextNode) {
                    promises.push(Token.startNewToken(TOKEN_TYPE.Diverge, self.execution, nextNode, null, self, thisItem, null));
                }
            });
            if (this.type!=TOKEN_TYPE.SubProcess)
                 this.end();// causes problem for sub-process, ends subprocess prematurally
        }
        else // single node 
        {
            this.log('Token(' + this.id + ').goNext(): verify outbonds....');
            outbounds.forEach(async function (flowItem) {
                self.log('Token(' + self.id + ').goNext(): ... outbonds flowItemId=' + flowItem.id);
                /// need to check if next node is converging; therefore no new item``
                flowItem.status = ITEM_STATUS.end;
                self.addItemToPath(flowItem);
                let nextNode = flowItem.element['to'];
                self.log('Token(' + self.id + ').goNext(): ... currentNodeId(' + self.currentNode.name + '|' + self.currentNode.id + ') processing  Flow(' + flowItem.element.id + ") to " + nextNode.id);
                if (nextNode) {
                        self._currentNode = nextNode;
//                        await self.execute(null);
                        promises.push(self.execute(null));
                }
            });
        }

        this.log('Token(' + this.id + ').goNext(): waiting for num promises ' + promises.length);
        await Promise.all(promises);
        this.logE('Token('+this.id +').goNext(): is done currentNodeId='+this.currentNode.id);
    }
    log(...msg) {
        this.execution.log(msg);
    }
    logS(...msg) {
        this.execution.logS(msg);
    }
    logE(...msg) {
        this.execution.logE(msg);
    }
    info(msg) {
        this.execution.info(msg);
    }
    error(msg) {
        this.execution.error(msg);
    }
}
async function delay(time, result) {
    return new Promise(function (resolve) {
        setTimeout(function () {
            resolve(result);
        }, time);
    });
}
// ---------------------------------------------
export { Token , TOKEN_TYPE }