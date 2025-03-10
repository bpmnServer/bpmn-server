import { v4 as uuid } from '@lukeed/uuid';
import { Item } from './Item';
import { Token, TOKEN_TYPE  } from './Token';
import { Loop} from './Loop';
import { Definition, CallActivity, Process } from '../elements/'
import { EXECUTION_EVENT, TOKEN_STATUS, EXECUTION_STATUS, IDefinition ,NODE_ACTION } from '../';
import { IInstanceData, IExecution, DataHandler } from '../';
import { ServerComponent } from '../server';
import { InstanceObject } from './Model';

/**
 *  is accessed two ways:
 *      execute - start process
 *      signal  - invoke a node (userTask, event, etc.) 
 * */
// ---------------------------------------------

class Execution extends ServerComponent implements IExecution {
    instance: InstanceObject;
    tokens = new Map();
    definition: IDefinition;
    process : Process;
    errors;
    item;
    messageMatchingKey;
    worker;
    userName;
    promises = [];
    servicesProvider;
    isLocked: boolean = false;
    options;
    operation;

    get id() { return this.instance.id; }
    get name() { return this.instance.name; }
    get status():EXECUTION_STATUS { return this.instance.status;}
    get execution() { return this;} // backward compatible
    // TODO: this is not updated
    action = NODE_ACTION.stop;

    async tillDone() {
        const res = await this.worker;
        return this;
    }
    
    // end move from ExecutionContext;
    get listener() {
        return this.server.listener;
    }


    /**
     * 
     * @param name          process name
     * @param source        bpmn source
     */
    constructor(server,name:string, source , state=null ) {
        super(server);
        if (state == null) {
            this.instance = new InstanceObject();
            this.instance.id = this.getUUID();
            this.instance.name = name;
            this.instance.source = source;
        }
        else
            this.instance = state;

        this.definition = new Definition(name, source, this.server);

    }
    public getNodeById(id)  {
        return this.definition.getNodeById(id);
    }
    public getToken(id: number): Token {
        return this.tokens.get(id);
    }
    private async checkEnd() {
        let active = 0;
        this.tokens.forEach(t => { 
            if (t.status != TOKEN_STATUS.end 
                && t.status != TOKEN_STATUS.terminated
                && t.type !==TOKEN_TYPE.EventSubProcess) 
                active++ 
        });

        if (active == 0) {
            this.end();
        }
    }
    async end() {
        this.log(".execution ended.");
        this.info("execution ended.");
        this.instance.endedAt = new Date();
        this.instance.status = EXECUTION_STATUS.end;
        if (this.instance.parentItemId) {
            CallActivity.executionEnded(this);
        }
        await this.process.end(this);
        await this.doExecutionEvent(this.process,EXECUTION_EVENT.process_end);
    }
    /**
     * 
     * causes the execution to stop from running any further
     * */
    terminate() {
        this.tokens.forEach(t => {
            t.terminate();
        });

    }
    /**
     * 
     * causes the execution to stop from running any further
     * */
    stop() {
        this.tokens.forEach(t =>
        {
            t.stop();
        });

    }
    public async execute(startNodeId = null, inputData = {}, options = {}) {

        this.log('^ACTION:execute:');
        this.info('execution started');
        this.operation='execute';
        this.options=options;
        await this.definition.load();
        this.servicesProvider = await this.appDelegate.getServicesProvider();        

        this.instance.status = EXECUTION_STATUS.running;
        this.appDelegate.executionStarted(this);

        
        if (inputData)
            this.instance.data = Object.assign({}, inputData);
        else
            this.instance.data = {};

        this.instance.startedAt = new Date();

        let startNode;
        if (!startNodeId)
            startNode = this.definition.getStartNode();
        else
            startNode = this.getNodeById(startNodeId);
        if (!startNode) {

            this.error("No Start Node");
            return;

        }

        this.process = startNode.process;
        //await this.doExecutionEvent(this, EXECUTION_EVENT.process_loaded);

        await this.doExecutionEvent(this, EXECUTION_EVENT.process_start);

        this.log('..starting at :' + startNode.id);
        let token = await Token.startNewToken(TOKEN_TYPE.Primary,this, startNode, null, null, null, null,inputData,true);

        // start all event sub processes for the process

        const proc = startNode.process;
        await proc.start(this, token);
        await token.execute(inputData);

        await this.checkEnd();
        
        await Promise.all(this.promises);
        this.log('.execute returned');
        await this.doExecutionEvent(this.process, EXECUTION_EVENT.process_wait);

        this.report();
        await Promise.all(this.promises);
        await this.save();

    }
    /**
     * @param executionId
     * @param inputData
     * 
     */
    public async assign(executionId, inputData: any, assignment = {}, userName,options={}) {

        this.log('Execution(' + this.name + ').assign: executionId=' + executionId + ' data ' + JSON.stringify(inputData));
        this.userName = userName;
        this.operation = 'assign';
        this.options=options;
        this.servicesProvider = await this.appDelegate.getServicesProvider();        
        this.getItems().forEach(i => {
            if (i.id==executionId)
            {
                this.item=i;
            }
        });
        Object.keys(assignment).forEach(key => {
            this.item[key]=assignment[key];
        });

        this.appendData(inputData, this.item, null, assignment);

        await this.item.node.doEvent(this.item, EXECUTION_EVENT.node_assign);

        await this.item.node.validate(this.item);
        this.info(`Task ${this.item.node.name} -${this.item.node.id} Assigned by ${this.userName} to:${assignment}`);
        await this.save();
        this.log('Execution('+this.name+').assign: finished!');
    }
    /**
     * 
     * invoke scenarios:
     *      itemId
     *      elementId   - but only one is active
     *      elementId   - for a startEvent in a secondary process
     *      
     * @param executionId
     * @param inputData
     * 
     */
    public async signalItem(itemId, inputData:any,userName, options={}) :Promise<IExecution>  {
        this.log('Execution('+this.name+').signalItem: executionId=' + itemId + ' data '+JSON.stringify(inputData));
        this.operation = 'signal';
        this.options=options;
        this.userName=userName;
        let token = null;

        this.servicesProvider = await this.appDelegate.getServicesProvider();        

        // get process
        let firstToken=this.tokens.get(0);
        this.process=firstToken.path[0].node.process;
        //
        this.appDelegate.executionStarted(this);
        await this.doExecutionEvent(this.process,EXECUTION_EVENT.process_invoke);

        this.tokens.forEach(t => {
            if (t.currentItem && t.currentItem.id == itemId /*&& t.status=='wait' */) {
                this.item = t.currentItem;
                token = t;
            }
        });

        if (token) {
            this.log('Execution('+this.name+').signal: .. launching a token signal');

            let result=await token.signal(inputData,options);

            if (options['noWait']==true)
                return this;
            
            this.log('Execution('+this.name+').signalItem: .. signal token is done');
        }   
             
        this.log('Execution('+this.name+').signalItem: returning .. waiting for promises status:' + this.instance.status + " id: " + itemId);
        
        await this.checkEnd();

        await Promise.all(this.promises);


        await this.doExecutionEvent(this.process,EXECUTION_EVENT.process_invoked);

        this.log('Execution('+this.name+').signalItem: returned process  status:' + this.instance.status + " id: " + itemId);

        this.report();

        await Promise.all(this.promises);
        await this.save();
        this.log('Execution('+this.name+').signalItem: finished!');

        return this;
    }
    public async signalItem2(itemId) :Promise<IExecution>  {
        this.log('Execution('+this.name+').signalItem2: executionId=' + itemId);
        this.operation = 'signal2';
        let token = null;
        this.tokens.forEach(t => {
            if (t.currentItem && t.currentItem.id == itemId /*&& t.status=='wait' */) {
                this.item = t.currentItem;
                token = t;
            }
        });

        if (token) {
            this.log('Execution('+this.name+').signal2: .. launching a token signal');

            let result=await token.signal2();
            
            this.log('Execution('+this.name+').signalItem2: .. signal token is done');
        }   
             
        this.log('Execution('+this.name+').signalItem: returning .. waiting for promises status:' + this.instance.status + " id: " + itemId);
        await this.checkEnd();

        await Promise.all(this.promises);


        await this.doExecutionEvent(this.process,EXECUTION_EVENT.process_invoked);

        this.log('Execution('+this.name+').signalItem: returned process  status:' + this.instance.status + " id: " + itemId);

        this.report();

        await Promise.all(this.promises);
        await this.save();
        this.log('Execution('+this.name+').signalItem: finished!');

        return this;
    }

    /**
     * 
     * restarting an already completed instance at a particular node
     *      
     * @param itemId
     * @param inputData
     * 
     */

public async restart(itemId, inputData:any,userName, options={}) :Promise<IExecution>  {

    this.log('Execution('+this.name+').restart: from item: ' + itemId+ ' data '+JSON.stringify(inputData));
    this.operation = 'signal';
    this.options=options;
    this.userName=userName;

    this.log('..restarting at :' + itemId);

    // check if instance has ended
    if (this.instance.status!==EXECUTION_STATUS.end)
    {
        this.error("***ERROR*** restart must be for an instance with end status, current instance has status of"+this.instance.status);
    }
    
    this.instance.status=EXECUTION_STATUS.running;
    this.instance.endedAt=null;

    await this.signalItem(itemId,inputData,userName,{restart:true});
    this.log('Execution('+this.name+').restart: finished!');
    
    return this;
}


    public async signalEvent(executionId, inputData:any,userName,options={}) :Promise<IExecution> {
        this.log('Execution('+this.name+').signal: executionId=' + executionId + ' data '+JSON.stringify(inputData));
        this.operation = 'signal';
        this.options=options;
        let token = null;

        this.servicesProvider = await this.appDelegate.getServicesProvider();        

        this.appDelegate.executionStarted(this);
        await this.doExecutionEvent(this.process,EXECUTION_EVENT.process_invoke);


        if (!token) {
            this.tokens.forEach(t => {
                if (t.currentNode && t.currentNode.id == executionId /*&& t.status=='wait' */)
                    token = t;
            });
        }

        if (token) {
            this.log('Execution('+this.name+').signal: .. launching a token signal');
            let result=await token.signal(inputData,options);
            this.log('Execution('+this.name+').signal: .. signal token is done');
        }   
             
        else 
            {
            //  checking for node
            let node;
                 // check for startEvent of a secondary process
                const startedNodeId = this.tokens.get(0).path[0].elementId;
                let restart=false;
                if (options['restart'] && options['restart']==true )
                    restart=true;

                if (this.instance.status==EXECUTION_STATUS.end && restart==false)
                    this.error('*** ERROR **** can not start a completed process');

                this.definition.processes.forEach(proc => {

                    let starts=proc.getStartNodes();
                    starts.forEach(start=>{
                        if (start.id !== startedNodeId &&
                            start.id == executionId)
                        {
                            node = this.getNodeById(executionId);
                            this.log('..starting at :' + executionId,this.instance.status);
                        }                        

                    });




                });

                if (node) {
                    if (restart)
                    {
                        this.instance.status=EXECUTION_STATUS.running;
                        this.instance.endedAt=null;
                    }
                    let token = await Token.startNewToken(TOKEN_TYPE.Primary,this, node, null, null, null,null, inputData);
                }
                else { //Error 
                    this.getItems().forEach(i => {
                        if (i.id==executionId)
                        {
                        console.log(`** trying to execute item ${i.id} - ${i.node.id} token ${i.token.id} currentItem ${i.token.currentItem.id}- token current ${i.token.currentNode.id} - token status ${i.token.status}`);
                        }
                    });
                    this.error("*** ERROR *** task id not valid:" + executionId);
                }
        }

        this.log('Execution('+this.name+').signal: returning .. waiting for promises status:' + this.instance.status + " id: " + executionId);
        await Promise.all(this.promises);
        await this.save();
        this.log('Execution('+this.name+').signalEvent: finished!');

        return this;

    }


    public async signalRepeatTimerEvent(executionId,prevItem, inputData:any,options={}): Promise<IExecution> {
        this.log('Execution('+this.name+').signalRepeatTimer: executionId=' + executionId + ' data '+JSON.stringify(inputData));
        this.operation = 'signalRepeatTime';
        this.options=options;
        let token = null;

        this.servicesProvider = await this.appDelegate.getServicesProvider();        

        this.appDelegate.executionStarted(this);
        await this.doExecutionEvent(this.process,EXECUTION_EVENT.process_invoke);


        let newToken=await Token.startNewToken(TOKEN_TYPE.BoundaryEvent, this, 
				prevItem.node, null, prevItem.token, prevItem, null);
           
		let newItem = newToken.currentItem;

         newItem.timerCount = prevItem.timerCount+1;     // it increments at start

        this.log('Execution('+this.name+').signal: returning .. waiting for promises status:' + this.instance.status + " id: " + executionId);
        await this.checkEnd();

        await Promise.all(this.promises);

        this.log('Execution('+this.name+').signal: returned process  status:' + this.instance.status + " id: " + executionId);

        await this.save();
        this.log('Execution('+this.name+').signal: finished!');

        return this;
    }
    async save() {
        // save here :
 
        this.log(`..Saving instance ${this.instance.id}`+JSON.stringify(this.instance.data));
        
        const state = this.getState();
    
        this['state']=state;

        await this.doExecutionEvent(this,EXECUTION_EVENT.process_saving);

        await this.server.dataStore.saveInstance(state,this.options);

    }
    getItems(): Item[] {
        const items = [];
        this.tokens.forEach(t => {
            t.path.forEach(i => {
                items.push(i);
            })
        }
        );
        
        return items.sort(function (a, b) { return (a.seq - b.seq); });
    }
    getItemsData() {
        const items = [];
        this.getItems().forEach(item => { items.push(item.save()); });
        return items;
    }
    /* 
     * return the execution State as a Json object
     * to be saved for retrieval later and used in restore
     */

    getState() : IInstanceData {
        const tokens = [];
        const loopsMap = new Map();
        const loops = [];
        this.tokens.forEach(t => {
            if (t.loop)
                loopsMap.set(t.loop.id, t.loop);
            tokens.push(t.save());
        });
        loopsMap.forEach(l => {loops.push(l.save()); });

        const items = [];
        this.getItems().forEach(item => { items.push(item.save()); });

        this.instance.items = items;
        this.instance.loops = loops;
        this.instance.tokens = tokens;

        
        return this.instance;
    }
    private static findSavePoint(state,itemId) {
        let sps=state['savePoints'];

        for (let key in sps)
        {
            let sp=sps[key];
            for(let j=0;j<sp.items.length;j++) {
                let it=sp.items[j];
                if (it.id==itemId)
                    return sp;
            }
        }
        return null;

    }
    /**
     *  re-enstate the execution from db
     * @param state

     */
    static async restore(server,state: IInstanceData,itemId=null): Promise<Execution> {

        let stateTokens=state.tokens;
        let stateItems=state.items;
        let stateLoops=state.loops;

        if (itemId!==null) {
            let savePoint=Execution.findSavePoint(state,itemId);
            if (savePoint) {
                stateTokens=savePoint.tokens||[];
                stateItems=savePoint.items||[];
                stateLoops=savePoint.loops||[];
            }
            else
                server.logger.error("***Error*** No savePoint found for item "+itemId);
        }
        const source = state.source;
        const execution = new Execution(server, state.name, source,state);


        await execution.definition.load();

        const tokenLoops = [];
        const tokens = new Map();
        stateTokens.forEach(t => {
            const token = Token.load(execution, t);
            if (t.loopId!==null)
                tokenLoops.push({ id: t.id, loopId: t.loopId });
            execution.tokens.set(token.id, token);
            tokens.set(token.id, token);
        });

        const loops = new Map();
        stateLoops.forEach(l => {
            l.execution = execution;
            const loop = Loop.load(execution, l);
            loops.set(loop.id, loop);
        });

        tokenLoops.forEach(tl => {
            const token = tokens.get(tl.id);
            const loop = loops.get(tl.loopId);
            token.loop = loop;
        });

        // items
        const items = [];
        stateItems.forEach(i => {
            const token = execution.getToken(i.tokenId);
            const item = Item.load(execution, i, token);
            token.path.push(item);
            items.push(item);
            }); 

        // token.originItem

        stateTokens.forEach(t => {
            const token = execution.getToken(t.id);
            if (t.originItem)
                items.forEach(it => {
                    if (it.id == t.originItem)
                        token.originItem = it;
                });
        });
        //execution.doExecutionEvent(this, EXECUTION_EVENT.process_loaded);


        execution.log('.restore completed');

        const proc = execution.definition.getStartNode().process;

        await execution.restored();
        return execution;
    }
    async restored() {
        await this.doExecutionEvent(this,EXECUTION_EVENT.process_restored);
        this.tokens.forEach(t => {
            t.restored();
        });

    }
    async resume() {
        await this.doExecutionEvent(this.process,EXECUTION_EVENT.process_resumed);
        this.tokens.forEach(t => {
            t.resume();});
    }

    report() {

        this.log('.Execution Report ----');
        this.log('..Status:' + this.instance.status);
        this.tokens.forEach(token => {
            const branch = token.originItem ? token.originItem.elementId : 'root';
            const parent = token.parentToken ? token.parentToken.id : '-';
            let p='';
            for(var i=0;i<token.path.length;i++)
                {p+=''+token.path[i].node.id+'->'; }
            let loop='';
            if (token.loop)
                loop=' Loop: '+token.loop.id+' key:'+token.itemsKey;
            this.log(`..token: ${token.id} - ${token.status} - ${token.type} current: ${token.currentNode.id} from ${branch} child of ${parent} path: ${p} `+loop+' data:'+JSON.stringify(token.data) );
        });

        let indx = 0;
        const items = this.getItems();
        for (indx = 0; indx < items.length; indx++) {
            const item = items[indx];
            let key='';
            if (item.itemKey!==null)
                key=' key:'+item.itemKey;
            if (item.element.type == 'bpmn:SequenceFlow')
                this.log(`..Item:${indx} -T# ${item.token.id} ${item.element.id} Type: ${item.element.type} status: ${item.status}`);
            else
                this.log(`..Item:${indx} -T# ${item.token.id} ${item.element.id} Type: ${item.element.type} status: ${item.status}  from ${this.formatDate(item.startedAt)} to ${this.formatDate(item.endedAt)} id: ${item.id} ${key}`);
        }
        this.log('.data:');
        this.log(JSON.stringify(this.instance.data));
    }
    formatDate(date)
    {
        if (date && date instanceof Date)
            return (date).toISOString();//.split('T')[0];
        else
            return '';
    }

    uids= {};

    getNewId(scope: string) {
        if (!this.uids[scope]) {
            this.uids[scope] = 0;
        }
        return this.uids[scope]++;
    }

    getUUID() {
        return uuid(); //=> '400fa120-5e9f-411e-94bd-2a23f6695704'
    }


    async doExecutionEvent(process,event,eventDetails={}) {
        //this.item = null;
        await this.listener.emit(event, { event, context: this ,eventDetails });
        await this.listener.emit('all', { event, context: this ,eventDetails});
    }

    async doItemEvent(item, event,eventDetails={}) {
        this.item = item;
        await this.listener.emit(event, { event, context: this ,eventDetails });
        await this.listener.emit('all', { event, context: this ,eventDetails});
    }
    log(...msg) {
        this.instance.logs.push(this.logger.log(...msg));
    }
    logS(...msg) {
        this.instance.logs.push(this.logger.logS(...msg));
    }
    logE(...msg) {
        this.instance.logs.push(this.logger.logE(...msg));
    }
    info(...msg) {
        this.instance.logs.push(this.logger.info(...msg));
    }
    error(msg) {
        this.doExecutionEvent(this, EXECUTION_EVENT.process_error);
        this.instance.logs.push(msg);
        this.logger.error(msg);
    }
    appendData(inputData: any,item:Item, dataPath?: any,assignment?:any): void {
    
        DataHandler.appendData(this.instance.data,inputData,item,dataPath,assignment);

    }
    getData(dataPath) {
        return DataHandler.getData(this.instance.data,dataPath);
    }
}
    

export { Execution }