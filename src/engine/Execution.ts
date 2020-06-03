
import { Logger } from '../common/Logger';
const fs = require('fs');
import { Item } from './Item';
import { Token  } from './Token';
import { Loop} from './Loop';
import {
    Element, Node, Flow ,  Process  } from '../elements/Elements'
import { EXECUTION_EVENT , NODE_ACTION , FLOW_ACTION, TOKEN_STATUS, EXECUTION_STATUS, IHandler, ITEM_STATUS} from './Enums';
import { EventEmitter } from 'events';
import { Definition } from '../elements/Definition';
import { DefaultHandler } from '../common';

const { v4: uuidv4 } = require('uuid');

var dummy;


/**
 *  is accessed two ways:
 *      execute - start process
 *      signal  - invoke a node (userTask, event, etc.) 
 * */
// ---------------------------------------------
class Execution {
    id;
    name;
    startedAt;
    endedAt;
    saved;
    status: EXECUTION_STATUS;
    tokens = new Map();
    definition: Definition;
    handler;
    source;
    logger;
    data : any;
    logs=[];

    listener: EventEmitter;


    /**
     * 
     * @param name          process name
     * @param source        bpmn source
     * @param handler       a delegate object to handle services
     * @param logger        to capture log messages 
     * @param listener      an event listener
     */
    constructor(name:string, source, handler?: IHandler, logger?, listener?: EventEmitter) {

        this.id = this.getUUID();
        this.name = name;

        this.source = source;

        if (logger) 
            this.logger = logger;
        else
            this.logger = new Logger({ toConsole: false});

        if (handler)
            this.handler = handler;
        else
            this.handler = new DefaultHandler(this.logger);
        
        if (!listener)
            listener = new EventEmitter();
        this.listener = listener;

        this.definition = new Definition(name, source, this.logger);

    }
    public getNodeById(id) {
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
        this.log("execution ended.");
        this.status = EXECUTION_STATUS.end;
        this.doExecutionEvent(EXECUTION_EVENT.execution_end);
    }
    public async execute(startNode = null, inputData = {}) {

        this.log('execute:');

        await this.definition.load();

        this.status = EXECUTION_STATUS.running;

        
        if (inputData)
            this.data = inputData;
        else
            this.data = {};

        this.startedAt = new Date();

        this.doExecutionEvent(EXECUTION_EVENT.execution_execute);
        if (!startNode)
            startNode = this.definition.getStartNode();
        if (!startNode) {
            this.logger.error("No Start Node");
            return;

        }

        this.log('starting at :' + startNode.id);
        dummy = await Token.startNewToken(this, startNode, null, null, null,null);

        this.log('-----execute returned ');
        await this.doExecutionEvent(EXECUTION_EVENT.execution_executed);
        this.report();
    }
    public async signal(executionId, inputData:any) {
        /*
        var exKey = ExecutionId.getTokenNode(executionId);
        var tokenId = exKey.tokenId;
        var nodeId = exKey.nodeId;
        var seq = exKey.seq;
        var token = this.getToken(tokenId); */
        this.log('-----signal ' + executionId + ' startedAt ');
        this.log('------------------------ ');
        let token = null;

        this.applyInput(inputData);

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

        if (token)
            await token.signal(inputData);
        else
            this.log("*** ERROR *** task id not valid");
        this.doExecutionEvent(EXECUTION_EVENT.execution_invoked);

        this.log('-----signal returned process  status:' + this.status + " id: "+ executionId );
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
    /* 
     * return the execution State as a Json object
     * to be saved for retrieval later and used in restore
     */

    getState() {
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
            status: this.status, saved: this.saved, data: this.data, logs: this.logs
        };

        return state;
    }
    static async restore(state, handler, logger): Promise<Execution> {
        const source = state.source;
        const execution = new Execution(state.name,source, handler, logger);


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
        execution.doExecutionEvent(EXECUTION_EVENT.execution_restored);
        execution.saved = state.saved;
        execution.logs = state.logs;
        execution.log('-restore completed');
        execution.report();

        return execution;
    }
    resume() {
        this.doExecutionEvent(EXECUTION_EVENT.execution_resumed);
        this.tokens.forEach(t => {
            t.resume();});
    }

    report() {

        this.log('---Execution Report ----');
        this.log('Status:' + this.status);
        this.tokens.forEach(token => {
            const branch = token.branchNode ? token.branchNode.id : 'root';
            this.log(`token: ${token.id} - ${token.status} - current: ${token.currentNode.id} from ${branch}  `+JSON.stringify(token.data));
        });

        let indx = 0;
        const items = this.getItems();
        for (indx = 0; indx < items.length; indx++) {
            const item = items[indx];
            const endedAt = (item.endedAt) ? item.endedAt.toLocaleDateString("en-US") : '-';

            if (item.element.type == 'bpmn:SequenceFlow')
                this.log(`Item:${indx} -T# ${item.token.id} ${item.element.id} Type: ${item.element.type} status: ${item.status}`);
            else
                this.log(`Item:${indx} -T# ${item.token.id} ${item.element.id} Type: ${item.element.type} status: ${item.status} start ${item.startedAt.toLocaleDateString("en-US")} end ${endedAt} `);
        }
        this.log('Data:');
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

        await this.listener.emit(event, this);
        await this.listener.emit('all',event, this);
    }
    doTokenEvent(token, event) {
        this.listener.emit(event, token);
        this.listener.emit('all', event, token);
    }

    doItemEvent(item, event) {
        this.listener.emit(event, item);
        this.listener.emit('all', event, item);
    }
    log(msg) {
        this.logs.push(msg);
        this.logger.log(msg);
    }
    static scopeEval(scope, script) {
    return Function('"use strict";return (' + script + ')').bind(scope)();
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
            console.log("*** Error *** target is not defined");
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

//    execution_restored = 'execution.restored', execution_wait = 'execution.wait',
export { Execution }