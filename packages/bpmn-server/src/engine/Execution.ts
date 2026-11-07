import { v4 as uuid } from '@lukeed/uuid';
import { Item } from './Item.js';
import { Token, TOKEN_TYPE  } from './Token.js';
import { Loop} from './Loop.js';
import { Definition } from '../elements/Definition.js';
import { Process } from '../elements/Process.js';
import { CallActivity } from '../elements/Tasks.js';import { EXECUTION_EVENT, TOKEN_STATUS, EXECUTION_STATUS, NODE_ACTION, ITEM_STATUS } from '../interfaces/Enums.js';
import type { IDefinition } from '../interfaces/elements.js';
import type { IInstanceData } from '../interfaces/DataObjects.js';
import type { IExecution } from '../interfaces/engine.js';
import { DataHandler } from './DataHandler.js';
import { ServerComponent } from '../server/ServerComponent.js';
import { InstanceObject } from './Model.js';

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
    svg:string; 

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

        if (active == 0 && this.instance.status != EXECUTION_STATUS.end) {
            await this.end();
        }
    }
    async end() {
        this.log(".execution ended.");
        this.instance.endedAt = new Date();
        this.instance.status = EXECUTION_STATUS.end;
        if (this.instance.parentItemId) {
            await CallActivity.executionEnded(this);
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
    public async execute(startNodeId = null, inputData = {}, options = {},userName=null) {

        this.log('^ACTION:execute:');
        this.info(JSON.stringify({type:'execution', label:'Start Process',
            userName,
            action:'execute',
            name:this.name,
            startNodeId,
            options,
            inputData}));
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
        // Deferred tokens (e.g. cross-pool message-flow delivery) settle in this.promises
        // AFTER the checkEnd() above, so re-check completion before saving.
        await this.checkEnd();
        await this.save();

    }
    /**
     * @param executionId
     * @param inputData
     * 
     */
    public async assign(executionId, inputData: any, assignment = {}, userName,options={}) {

        this.log('Execution(' + this.name + ').assign: executionId=' + executionId + ' data ' + JSON.stringify(inputData)+' assignment:'+JSON.stringify(assignment));
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
        // the item records who completed it (it was created with the user of the call that reached it);
        // a restart only goes back to it
        if (token && userName && !options['restart'])
            token.currentItem.userName = userName;
        this.info(JSON.stringify({type:'execution', label:'Invoke Item',
            action:'signalInput',
            id:token.currentNodeId,
            itemId,
            userName,
            options,
            inputData}));

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
     *   options.rewind: an instance that has not ended goes back to the node too
     *
     * @param itemId
     * @param inputData
     *
     */

/** Runs a failed item's work again (an item whose status is `error`), and on from it. */
public async retry(itemId, userName?: string) :Promise<IExecution>  {
    this.log('Execution('+this.name+').retry: item ' + itemId);
    this.operation = 'retry';
    this.userName = userName;
    let token: Token = null;
    this.tokens.forEach(t => { if (t.currentItem && t.currentItem.id == itemId) token = t; });
    const item = token?.currentItem;
    if (!item || item.status !== ITEM_STATUS.error)
        throw new Error(`Item ${itemId} has not failed: only an item whose status is error can be retried`);
    this.servicesProvider = await this.appDelegate.getServicesProvider();
    this.process = this.tokens.get(0).path[0].node.process;
    this.appDelegate.executionStarted(this);
    this.item = item;
    this.info(JSON.stringify({ type: 'execution', label: 'Retry Item', action: 'retry', id: item.elementId, itemId, userName }));
    await token.retry(item);
    await this.checkEnd();
    await Promise.all(this.promises);
    this.report();
    await this.save();
    return this;
}

public async restart(itemId, inputData:any,userName, options={}) :Promise<IExecution>  {

    this.log('Execution('+this.name+').restart: from item: ' + itemId+ ' data '+JSON.stringify(inputData));
    this.operation = 'signal';
    this.options=options;
    this.userName=userName;

    this.log('..restarting at :' + itemId);

    // check if instance has ended
    if (this.instance.status!==EXECUTION_STATUS.end && !options['rewind'])
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

        this.info(JSON.stringify({type:'execution', label:'Invoke Event',
            action:'signalEvent',
            id:executionId,
            userName,
            options,
            inputData}));
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


        // from the store, when recovered after a restart: this execution's own item has its node and token
        const previous = prevItem.node ? prevItem : this.getItems().find(item => item.id === prevItem.id);
        let newToken=await Token.startNewToken(TOKEN_TYPE.BoundaryEvent, this,
				previous.node, null, previous.token, previous, null);
           
		let newItem = newToken.currentItem;

         newItem.timerCount = Number(previous.timerCount ?? 0)+1;     // it increments at start

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

        await this.server.logger.saveForInstance(this.instance.id);

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
   
        this.instance.source = this.definition.source;
        this.instance.svg = this.svg;
   
        
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
        let source = state.source;
        let svg= state.svg;

        if (!source)
            source = await server.definitions.getSource(state.name);
        if (!svg)
            svg = await server.definitions.getSVG(state.name);

        const execution = new Execution(server, state.name, source,state);
        execution.svg=svg;


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
        // the next item's seq: after the highest (loading counted the items, and seqs may have gaps: a join's)
        const highest = items.reduce((max, it) => it.seq != null && it.seq > max ? it.seq : max, -1);
        execution.uids['item'] = Math.max(execution.uids['item'] ?? 0, highest + 1);

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
    reportToken(token:Token,level) {
            
        const branch = token.originItem ? token.originItem.elementId : 'root';
        const parent = token.parentToken ? token.parentToken.id : '-';
        let p='';
        for(var i=0;i<token.path.length;i++)
            {p+=''+token.path[i].node.id+'->'; }
        let loop='';
        if (token.loop)
            loop=' Loop: '+token.loop.id+' key:'+token.itemsKey;
        
        this.log('..'.repeat(level+1)+`token: ${token.id} - ${token.type} - ${token.status}  current: ${token.currentNode.id} from ${branch} child of ${parent} path: ${p} `+loop+' data:'+JSON.stringify(token.data) );

        token.childrenTokens.forEach(t => {
            this.reportToken(t,level+1);
        });

    }
    report() {

        this.log('.Execution Report ----');
        this.log('..Status:' + this.instance.status);
        this.tokens.forEach(token => {
            if (!token.parentToken)
                this.reportToken(token,0);
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

    /** The next id of a scope; items are numbered from 1 (their seq), tokens and loops from 0. */
    getNewId(scope: string) {
        if (!this.uids[scope]) {
            this.uids[scope] = scope === 'item' ? 1 : 0;
        }
        return this.uids[scope]++;
    }

    getUUID() {
        return uuid(); //=> '400fa120-5e9f-411e-94bd-2a23f6695704'
    }


    async doExecutionEvent(process,event,eventDetails={}) {
        //this.item = null;
        await this.dispatch(event, eventDetails);
    }

    async doItemEvent(item, event,eventDetails={}) {
        this.item = item;
        await this.dispatch(event, eventDetails);
    }
    /** The server's listeners, then its lifecycle subscribers (server/Listener.ts); a plain emitter only emits. */
    private async dispatch(event, eventDetails) {
        const payload = { event, context: this, eventDetails };
        if (typeof this.listener.dispatch === 'function') return this.listener.dispatch(event, payload);
        this.listener.emit(event, payload);
        this.listener.emit('all', payload);
    }
    /** The instance keeps its log lines only when they are saved (its flags.saveLogs, else dataStore.saveLogs, the default). */
    private get keepLogs(): boolean {
        return this.instance?.flags?.saveLogs ?? this.server?.dataStore?.saveLogs !== false;
    }
    private record(entry) {
        if (this.keepLogs) this.instance.logs.push(entry);
    }
    log(...msg) {
        this.record(this.logger.log(...msg));
    }
    logS(...msg) {
        this.record(this.logger.logS(...msg));
    }
    logE(...msg) {
        this.record(this.logger.logE(...msg));
    }
    info(...msg) {
        this.record(this.logger.info(...msg));
    }
    /**
     * Why the engine took a path: kept in the instance's log, as a 'decision' entry. A decision object is written as a block
     * (seq and element, action, why); the entry also keeps its seq, element and action.
     */
    decision(...msg) {
        const d: ExecutionDecision = msg.length === 1 && typeof msg[0] === 'object' && msg[0]?.action ? msg[0] : null;
        const args = d ? [formatDecision(d)] : msg;
        const entry = typeof this.logger.decision === 'function' ? this.logger.decision(...args) : this.logger.info('decision:', ...args);
        if (d && entry && typeof entry === 'object')
            Object.assign(entry, { seq: d.seq, element: d.element, action: d.action });
        this.record(entry);
    }
    error(msg) {
        this.doExecutionEvent(this, EXECUTION_EVENT.process_error);
        this.record(msg);
        this.logger.error(msg);
    }
    appendData(inputData: any,item:Item, dataPath?: any,assignment?:any): void {
    
        DataHandler.appendData(this.instance.data,inputData,item,dataPath,assignment);

    }
    getData(dataPath) {
        return DataHandler.getData(this.instance.data,dataPath);
    }
    // Process not currently used
    
    async processQueue(): Promise<void> {

        while (true) {
            let running=false;
            for(let token of this.tokens.values()) {
                
                if (token.status===TOKEN_STATUS.queued)
                {
                    running=true;
                    await token.execute();
                }
            }
            if (!running)
                break;
        }
    }
}


export { Execution }

/** Why the engine did something at an element: its item's seq, the element, what it did, and the reasons. */
export interface ExecutionDecision {
    seq?: number;
    /** e.g. "flow 'yes' (f1)", "gateway 'Covered?' (Covered)" */
    element: string;
    /** e.g. "taken", "not taken", "takes 'yes' (f1)", "waits", "continues" */
    action: string;
    /** The reasons, a line each; a list is written under the line before it, indented. */
    why?: (string | string[])[];
}

/**
 * A decision as a block:
 *
 *     seq: 3   flow 'repair' (flow_gw1_repair)
 *     action: taken
 *     why:
 *         condition
 *             (item.data.needsRepairs=="Yes") || item.data.needsRepairs
 *         result: true (needsRepairs="Yes")
 */
export function formatDecision(d: ExecutionDecision): string {
    const lines = [`seq: ${d.seq ?? '-'}   ${d.element}`, `action: ${d.action}`];
    if (d.why?.length) {
        lines.push('why:');
        for (const reason of d.why)
            for (const line of Array.isArray(reason) ? reason.map(r => '    ' + r) : [reason])
                lines.push('    ' + line);
    }
    return lines.join('\n');
}
