
import { Logger } from '../common/Logger';
const fs = require('fs');
import { Item } from './Item';
import { Token, TOKEN_TYPE  } from './Token';
import { Loop} from './Loop';
import { Element, Node, Flow , Definition, CallActivity, Process } from '../elements/'
import { EXECUTION_EVENT, NODE_ACTION, FLOW_ACTION, TOKEN_STATUS, EXECUTION_STATUS, ITEM_STATUS, IDefinition } from '../';
import { IInstanceData, IBPMNServer, IExecution, IAppDelegate , DefaultAppDelegate } from '../';
import { EventEmitter } from 'events';
import { BPMNServer, ServerComponent } from '../server';
import { InstanceObject } from './Model';


const { v4: uuidv4 } = require('uuid');


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
    public tokenEnded(token: Token) {
        let active = 0;
        this.tokens.forEach(t => { if (t.status != TOKEN_STATUS.end && t.status != TOKEN_STATUS.terminated) active++ });

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

        this.log('ACTION:execute:');
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
            this.log('Execution('+this.name+').signalItem: .. signal token is done');
        }   
             
        this.log('Execution('+this.name+').signalItem: returning .. waiting for promises status:' + this.instance.status + " id: " + itemId);
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
     * @param startNodeId
     * @param inputData
     * 
     */
    public async restart(startNodeId, inputData:any,userName, options={}) :Promise<IExecution>  {

        this.log('Execution('+this.name+').restart: startNodeId=' + startNodeId + ' data '+JSON.stringify(inputData));
        this.operation = 'signal';
        this.options=options;
        this.userName=userName;

        let startNode = this.getNodeById(startNodeId);

        this.servicesProvider = await this.appDelegate.getServicesProvider();        

        await this.doExecutionEvent(this.process,EXECUTION_EVENT.process_invoke);

        this.log('..restarting at :' + startNodeId);

        // check if instance has ended
        if (this.instance.status!==EXECUTION_STATUS.end)
        {
            this.error("***ERROR*** restart must be for an instance with end status, current instance has status of"+this.instance.status);
        }
        // check if valid node
        /*
        let items=this.getItems();
        items.forEach(it=>{
            if (it.elementId == startNodeId)
                {
                    let p='';
                    if (it.token.parentToken)
                        p=it.token.parentToken.id;
                    console.log('it',it.token.type,p);
                    if (it.token.parentToken)
                        {
                            this.report();
                            
                            this.error("***Error*** Node:"+startNodeId+" not valid for a restart, it has a parent item use: "+it.token.parentToken.firstItem.elementId);
                        }
                }
        });
        */
        let token = await Token.startNewToken(TOKEN_TYPE.Primary,this, startNode, null, null, null, null,inputData,true);

        await token.execute(inputData);

        this.report();

        await Promise.all(this.promises);
        await this.save();
        this.log('Execution('+this.name+').signalItem: finished!');
        

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
            let node;
                 // check for startEvent of a secondary process
                const startedNodeId = this.tokens.get(0).path[0].elementId;
                let restart=false;
                if (options['restart'] && options['restart']==true )
                    restart=true;

                this.definition.processes.forEach(proc => {
                    let startNodeId = proc.getStartNode().id;
                    if (startNodeId !== startedNodeId) {
                        this.log(`checking for valid other start node: ${startNodeId} is possible`);
                        if (startNodeId == executionId) {
                            // ok we will start new token for this
                            node = this.getNodeById(executionId);
                            if (this.instance.status==EXECUTION_STATUS.end && restart==false)
                                this.error('*** ERROR **** can not start a completed process');
                            this.log('..starting at :' + executionId,this.instance.status);
                        }
                    }
                });

            if (node) {
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


        await this.doExecutionEvent(this.process,EXECUTION_EVENT.process_invoked);

        this.log('Execution('+this.name+').signal: returned process  status:' + this.instance.status + " id: " + executionId);

        this.report();


        await this.save();
        this.log('Execution('+this.name+').signal: finished!');

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
    /**
     *  re-enstate the execution from db
     * @param state

     */
    static async restore(server,state: IInstanceData): Promise<Execution> {

        const source = state.source;
        const execution = new Execution(server, state.name, source,state);


        await execution.definition.load();

        const tokenLoops = [];
        const tokens = new Map();
        state.tokens.forEach(t => {
            const token = Token.load(execution, t);
            if (t.loopId)
                tokenLoops.push({ id: t.id, loopId: t.loopId });
            execution.tokens.set(token.id, token);
            tokens.set(token.id, token);
        });

        const loops = new Map();
        state.loops.forEach(l => {
            l.execution = execution;
            const loop = Loop.load(execution, l);
            loops.set(loop.id, loop);
        });

        tokenLoops.forEach(tl => {
            const token = tokens.get(tl.id);
            const loop = loops.get(tl.loopid);
            token.loop = loop;
        });

        // items
        const items = [];
        state.items.forEach(i => {
            const token = execution.getToken(i.tokenId);
            const item = Item.load(execution, i, token);
            token.path.push(item);
            items.push(item);
            }); 

        // token.originItem

        state.tokens.forEach(t => {
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
            this.log(`..token: ${token.id} - ${token.status} - ${token.type} current: ${token.currentNode.id} from ${branch} child of ${parent} path: ${p} `+JSON.stringify(token.data) );
        });

        let indx = 0;
        const items = this.getItems();
        for (indx = 0; indx < items.length; indx++) {
            const item = items[indx];
            const endedAt = (item.endedAt) ? item.endedAt : '-';

            if (item.element.type == 'bpmn:SequenceFlow')
                this.log(`..Item:${indx} -T# ${item.token.id} ${item.element.id} Type: ${item.element.type} status: ${item.status}`);
            else
                this.log(`..Item:${indx} -T# ${item.token.id} ${item.element.id} Type: ${item.element.type} status: ${item.status}  from ${item.startedAt} to ${endedAt} id: ${item.id}`);
        }
        this.log('.data:');
        this.log(JSON.stringify(this.instance.data));
    }

    uids= {};

    getNewId(scope: string) {
        if (!this.uids[scope]) {
            this.uids[scope] = 0;
        }
        return this.uids[scope]++;
    }

    getUUID() {

        return uuidv4(); // -> '6c84fb90-12c4-11e1-840d-7b25c5ee775a' 

    }


    async doExecutionEvent(process,event) {
        //this.item = null;
        await this.listener.emit(event, { event, context: this });
        await this.listener.emit('all', { event, context: this });
    }

    async doItemEvent(item, event) {
        this.item = item;
        await this.listener.emit(event, { event, context: this });
        await this.listener.emit('all', { event, context: this });
    }
    log(...msg) {
        this.instance.logs.push(this.logger.log(...msg));
    }
    info(...msg) {
        this.instance.logs.push(this.logger.info(...msg));
    }
    error(msg) {
        this.doExecutionEvent(this, EXECUTION_EVENT.process_error);
        this.instance.logs.push(msg);
        this.logger.error(msg);
    }
    // Data Handling 
    /*
     * renamed from applyInput to appendData
     */
    appendData(inputData,item, dataPath = null,assignment=null) {
        let asArray = false;

        if (Array.isArray(inputData))
            asArray = true;

        if (dataPath && dataPath.endsWith('[]')) {
            asArray = true;
        }

        let target = this.getAndCreateData(dataPath, asArray);

        if (!target) {
            this.error("*** Error *** target is not defined");
            return;
        }

        if (inputData) {
            if (asArray) {
                target.push(inputData);
            }
            else {
                Object.keys(inputData).forEach(key => {
                    const val = inputData[key];
                    if (key.startsWith('vars.')) {
                        delete inputData[key];
                        if (item)
                            item.vars[key.substring(5)] = val;
                    }
                    else
                        target[key] = val;
                });
            }
        }
    }

    getData(dataPath) {
        let target = this.instance.data;

        if (dataPath) {
            dataPath.split('.').forEach(de => {
                // strip off []
                de=de.replace('[]', '');
                if (de != '')
                    target = target[de];
            });
        }
        return target;
    }
    getAndCreateData(dataPath, asArray = false) {

        let target = this.instance.data;

        if (dataPath) {
            dataPath.split('.').forEach(de => {
                if (de != '') {
                    de = de.replace('[]', '');
                    if (!target[de]) {
                        if (asArray) 
                                target[de] = [];
                        else 
                                target[de] = {};
                    }
                    target = target[de];

                }
            });
        }
        return target;
    }
}
// ---------------------------------------------

export { Execution }