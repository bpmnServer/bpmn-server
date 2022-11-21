
import { Logger } from '../common/Logger';
const fs = require('fs');
import { Item } from './Item';
import { Token, TOKEN_TYPE  } from './Token';
import { Loop} from './Loop';
import { Element, Node, Flow , Definition, CallActivity, Process } from '../elements/'
import { EXECUTION_EVENT, NODE_ACTION, FLOW_ACTION, TOKEN_STATUS, EXECUTION_STATUS, ITEM_STATUS, IDefinition } from '../../';
import { IInstanceData, IBPMNServer, IExecution, IAppDelegate , DefaultAppDelegate } from '../../';
import { EventEmitter } from 'events';
import { Authorization, Involvement } from '../acl/';
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
    /* instance 
    id;
    name;
    status : EXECUTION_STATUS;
    startedAt;
    endedAt;
    saved;
    data;
    items;
    source;
    logs;
    tokens;
    loops;
    parentItemId;
    accessRules;
    involvements;
    authorizations;

     */
    tokens = new Map();
    definition: IDefinition;
    process : Process;
    // moved from Execution Context
    errors;
    item;
    input = {};
    output = {} ;
    messageMatchingKey;
    worker;
    currentUser;
    promises = [];

    get id() { return this.instance.id; }
    get name() { return this.instance.name; }
    get status() { return this.instance.status;}
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
        this.instance.endedAt = new Date().toISOString();;
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
        await this.definition.load();

        this.input= Object.assign({}, inputData);
        this.output = {};

        this.instance.status = EXECUTION_STATUS.running;
        this.appDelegate.executionStarted(this);

        
        if (inputData)
            this.instance.data = Object.assign({}, inputData);
        else
            this.instance.data = {};

        this.instance.startedAt = new Date().toISOString();;

        let startNode;
        if (!startNodeId)
            startNode = this.definition.getStartNode();
        else
            startNode = this.getNodeById(startNodeId);
        if (!startNode) {

            this.logger.error("No Start Node");
            return;

        }

        this.process = startNode.process;
        //await this.doExecutionEvent(this, EXECUTION_EVENT.process_loaded);

        await this.doExecutionEvent(this.process, EXECUTION_EVENT.process_start);

        this.log('..starting at :' + startNode.id);
        let token = await Token.startNewToken(TOKEN_TYPE.Primary,this, startNode, null, null, null, null,null,true);

        // start all event sub processes for the process

        const proc = startNode.process;
        await proc.start(this, token);
        await token.execute(null);

        await Promise.all(this.promises);
        this.log('.execute returned');
        await this.doExecutionEvent(this.process, EXECUTION_EVENT.process_wait);

        this.report();


        await this.save();

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
    public async signal(executionId, inputData:any) {

        this.log('Execution('+this.name+').signal: executionId=' + executionId + ' startedAt ');
        let token = null;

        this.appDelegate.executionStarted(this);
        await this.doExecutionEvent(this.process,EXECUTION_EVENT.process_invoke);

        this.tokens.forEach(t => {
            if (t.currentItem && t.currentItem.id == executionId)
                token = t;
        });

        if (!token) {
            this.tokens.forEach(t => {
                if (t.currentNode && t.currentNode.id == executionId)
                    token = t;
            });
        }


        if (token) {
            this.log('Execution('+this.name+').signal: .. launching a token signal');
            let result=await token.signal(inputData);
            this.log('Execution('+this.name+').signal: .. signal token is done');
        }
        else
            {  // check for startEvent of a secondary process
            let node = null;
            const startedNodeId = this.tokens.get(0).path[0].elementId;
            this.definition.processes.forEach(proc => {
                let startNodeId = proc.getStartNode().id;
                if (startNodeId !== startedNodeId) {
                    this.log(`checking for valid other start node: ${startNodeId} is possible`);
                    if (startNodeId == executionId) {
                        // ok we will start new token for this
                        node = this.getNodeById(executionId);
                        this.log('..starting at :' + executionId);
                    }
                }
            });


            if (node) {
                let token = await Token.startNewToken(TOKEN_TYPE.Primary,this, node, null, null, null, inputData);
            }
            else {
                this.getItems().forEach(i => {
                    this.logger.log(`Item: ${i.id} - ${i.elementId} - ${i.status} - ${i.timeDue}`);
                });
                this.logger.error("*** ERROR *** task id not valid" + executionId);
            }
        }


        this.log('Execution('+this.name+').signal: returning .. waiting for promises status:' + this.instance.status + " id: " + executionId);
        await Promise.all(this.promises);


        await this.doExecutionEvent(this.process,EXECUTION_EVENT.process_invoked);

        this.log('Execution('+this.name+').signal: returned process  status:' + this.instance.status + " id: " + executionId);

        this.report();


        await this.save();
        this.log('Execution('+this.name+').signal: finished!');
    }

    private async save() {
        // save here :
        this.log("..Saving instance "+this.instance.id);
        const state = this.getState();
        await this.server.dataStore.saveInstance(state, this.getItems());

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
        loopsMap.forEach(l => { loops.push(l.save()); });

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
        execution.report();

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
            this.log(`..token: ${token.id} - ${token.status} - ${token.type} current: ${token.currentNode.id} from ${branch} child of ${parent} `+JSON.stringify(token.data));
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
    error(msg) {
        this.instance.logs.push(msg);
        this.logger.error(msg);
    }
    // Data Handling 
    /*
     * renamed from applyInput to appendData
     */
    appendData(inputData, dataPath = null) {
        let asArray = false;

        if (Array.isArray(inputData))
            asArray = true;

        if (dataPath && dataPath.endsWith('[]')) {
            asArray = true;
        }

        let target = this.getAndCreateData(dataPath, asArray);

        if (!target) {
            this.logger.error("*** Error *** target is not defined");
            return;
        }

        if (inputData) {
            if (asArray) {
                target.push(inputData);
            }
            else {
                Object.keys(inputData).forEach(key => {
                    const val = inputData[key];
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