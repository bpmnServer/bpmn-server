
import { Logger } from '../common/Logger';
const fs = require('fs');
import { Item } from './Item';
import { Token  } from './Token';
import { Loop} from './Loop';
import { Element, Node, Flow , Definition } from '../elements/'
import { EXECUTION_EVENT, NODE_ACTION, FLOW_ACTION, TOKEN_STATUS, EXECUTION_STATUS, ITEM_STATUS, IDefinition, ExecutionContext } from '../../';
import { IInstanceData, IBPMNServer, IExecution, IAppDelegate , DefaultAppDelegate } from '../../';
import { EventEmitter } from 'events';


const { v4: uuidv4 } = require('uuid');


/**
 *  is accessed two ways:
 *      execute - start process
 *      signal  - invoke a node (userTask, event, etc.) 
 * */
// ---------------------------------------------

class Execution implements IExecution {
    id;
    name;
    startedAt;
    endedAt;
    saved;
    status: EXECUTION_STATUS;
    tokens = new Map();
    definition: IDefinition;
    appDelegate :IAppDelegate;
    source;
    logger;
    data : any;
    logs=[];
    parentNodeId;

    listener: EventEmitter;
    executionContext;

    promises = [];

    /**
     * 
     * @param name          process name
     * @param source        bpmn source
     * @param executionContext 
     */
    constructor(name:string, source, executionContext: ExecutionContext ) {

        this.id = this.getUUID();
        this.name = name;

        this.source = source;

        this.logger = executionContext.logger;
        this.appDelegate = executionContext.appDelegate;
        
        this.listener = executionContext.listener;

        this.definition = new Definition(name, source, this.logger);

        this.executionContext = executionContext;

    }
    public getNodeById(id)  {
        return this.definition.getNodeById(id);
    }
    public getToken(id: number): Token {
        return this.tokens.get(id);
    }
    public tokenEnded(token: Token) {
        let active = 0;
        this.tokens.forEach(t => { if (t.status != TOKEN_STATUS.end) active++ });

        if (active == 0) {
            this.end();
        }
    }
    async end() {
        this.log(".execution ended.");
        this.endedAt = new Date().toISOString();;
        this.status = EXECUTION_STATUS.end;
        this.doExecutionEvent(EXECUTION_EVENT.execution_end);
    }
    /**
     * 
     * causes the execution to stop from running any further
     * */
    stop() {

    }
    public async execute(startNodeId = null, inputData = {}) {

        this.log('ACTION:execute:');
        await this.definition.load();

        this.status = EXECUTION_STATUS.running;
        this.appDelegate.executionStarted(this.executionContext);

        
        if (inputData)
            this.data = inputData;
        else
            this.data = {};

        this.startedAt = new Date().toISOString();;

        this.doExecutionEvent(EXECUTION_EVENT.execution_execute);
        let startNode;
        if (!startNodeId)
            startNode = this.definition.getStartNode();
        else
            startNode = this.getNodeById(startNodeId);
        if (!startNode) {

            this.logger.error("No Start Node");
            return;

        }

        this.log('..starting at :' + startNode.id);
        let result = await Token.startNewToken(this, startNode, null, null, null, null);

        await Promise.all(this.promises);
        this.log('.execute returned ');
        await this.doExecutionEvent(EXECUTION_EVENT.execution_executed);
        this.report();
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
     * Obselete -- remove later 
     */
    public async signal(executionId, inputData:any) {

        this.log('Action:signal ' + executionId + ' startedAt ');
        let token = null;

        this.applyInput(inputData);

        this.appDelegate.executionStarted(this.executionContext);
        this.doExecutionEvent(EXECUTION_EVENT.execution_invoke);

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
            this.log('..launching a token signal');
            let result=await token.signal(inputData);
            this.log('..signal token is done');
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
                let token = await Token.startNewToken(this, node, null, null, null, null);
            }
            else {
                this.getItems().forEach(i => {
                    this.logger.log(`Item: ${i.id} - ${i.elementId} - ${i.status} - ${i.timeDue}`);
                });
                this.logger.error("*** ERROR *** task id not valid");
            }
        }
        this.log('.signal returning .. waiting for promises status:' + this.status + " id: " + executionId);
        await Promise.all(this.promises);

        this.doExecutionEvent(EXECUTION_EVENT.execution_invoked);

        this.log('.signal returned process  status:' + this.status + " id: "+ executionId );
        this.report();
    }
    getItems(query=null): Item[] {
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
        const state= {
            source: this.source, items, tokens, loops,
            id: this.id , name: this.name, startedAt: this.startedAt, endedAt: this.endedAt,
            status: this.status, saved: this.saved, data: this.data, logs: this.logs, parentNodeId: this.parentNodeId
        };

        return state;
    }
    static async restore(state: IInstanceData, executionContext): Promise<Execution> {
        const source = state.source;
        const execution = new Execution(state.name,source, executionContext);


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

        state.items.forEach(i => {
            const token = execution.getToken(i.tokenId);
            token.path.push(Item.load(execution, i,token));
            }); 


        execution.status = state.status;
        execution.data = state.data;
        execution.id = state.id;
        execution.name = state.name;
        execution.startedAt = state.startedAt;
        execution.endedAt = state.endedAt;
        execution.saved = state.saved;
        execution.logs = state.logs;
        execution.parentNodeId = state.parentNodeId;
        execution.log('.restore completed');
        execution.report();

        execution.restored();
        return execution;
    }
    restored() {
        this.doExecutionEvent(EXECUTION_EVENT.execution_restored);
        this.tokens.forEach(t => {
            t.restored();
        });

    }
    resume() {
        this.doExecutionEvent(EXECUTION_EVENT.execution_resumed);
        this.tokens.forEach(t => {
            t.resume();});
    }

    report() {

        this.log('.Execution Report ----');
        this.log('..Status:' + this.status);
        this.tokens.forEach(token => {
            const branch = token.branchNode ? token.branchNode.id : 'root';
            this.log(`..token: ${token.id} - ${token.status} - current: ${token.currentNode.id} from ${branch}  `+JSON.stringify(token.data));
        });

        let indx = 0;
        const items = this.getItems();
        for (indx = 0; indx < items.length; indx++) {
            const item = items[indx];
            const endedAt = (item.endedAt) ? item.endedAt : '-';

            if (item.element.type == 'bpmn:SequenceFlow')
                this.log(`..Item:${indx} -T# ${item.token.id} ${item.element.id} Type: ${item.element.type} status: ${item.status}`);
            else
                this.log(`..Item:${indx} -T# ${item.token.id} ${item.element.id} Type: ${item.element.type} status: ${item.status}  from ${item.startedAt} to ${endedAt} id: ${item.id} `);
        }
        this.log('.Data:');
        this.log(JSON.stringify(this.data));
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


    async doExecutionEvent(event) {

        await this.listener.emit(event, { event, execution: this });
        await this.listener.emit('all', {event, execution: this});
    }
    async doTokenEvent(token, event) {
        await this.listener.emit(event,{event, token});
        await this.listener.emit('all', { event, token });
    }

    async doItemEvent(item, event) {
        await this.listener.emit(event, { event, item });
        await this.listener.emit('all', {event, item});
    }
    log(msg) {
        this.logs.push(msg);
        this.logger.log(msg);
    }
    // Data Handling 
    /*
     * 
     */
    applyInput(inputData, dataPath = null) {
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
        let target = this.data;

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

        let target = this.data;

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