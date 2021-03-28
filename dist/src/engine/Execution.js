"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Execution = void 0;
const fs = require('fs');
const Item_1 = require("./Item");
const Token_1 = require("./Token");
const Loop_1 = require("./Loop");
const elements_1 = require("../elements/");
const __1 = require("../../");
const { v4: uuidv4 } = require('uuid');
/**
 *  is accessed two ways:
 *      execute - start process
 *      signal  - invoke a node (userTask, event, etc.)
 * */
// ---------------------------------------------
class Execution {
    /**
     *
     * @param name          process name
     * @param source        bpmn source
     * @param executionContext
     */
    constructor(name, source, executionContext) {
        this.tokens = new Map();
        this.logs = [];
        this.promises = [];
        this.uids = {};
        this.id = this.getUUID();
        this.name = name;
        this.source = source;
        this.logger = executionContext.logger;
        this.appDelegate = executionContext.appDelegate;
        this.listener = executionContext.listener;
        this.definition = new elements_1.Definition(name, source, executionContext.server);
        this.executionContext = executionContext;
    }
    getNodeById(id) {
        return this.definition.getNodeById(id);
    }
    getToken(id) {
        return this.tokens.get(id);
    }
    tokenEnded(token) {
        let active = 0;
        this.tokens.forEach(t => { if (t.status != __1.TOKEN_STATUS.end && t.status != __1.TOKEN_STATUS.terminated)
            active++; });
        if (active == 0) {
            this.end();
        }
    }
    end() {
        return __awaiter(this, void 0, void 0, function* () {
            this.log(".execution ended.");
            this.endedAt = new Date().toISOString();
            ;
            this.status = __1.EXECUTION_STATUS.end;
            if (this.parentItemId) {
                elements_1.CallActivity.executionEnded(this);
            }
            this.doExecutionEvent(__1.EXECUTION_EVENT.execution_end);
        });
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
        this.tokens.forEach(t => {
            t.stop();
        });
    }
    execute(startNodeId = null, inputData = {}, options = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            this.log('ACTION:execute:');
            yield this.definition.load();
            this.status = __1.EXECUTION_STATUS.running;
            this.appDelegate.executionStarted(this.executionContext);
            if (inputData)
                this.data = inputData;
            else
                this.data = {};
            this.startedAt = new Date().toISOString();
            ;
            this.doExecutionEvent(__1.EXECUTION_EVENT.execution_execute);
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
            let token = yield Token_1.Token.startNewToken(Token_1.TOKEN_TYPE.Primary, this, startNode, null, null, null, null, null, true);
            // start all event sub processes for the process
            const proc = startNode.process;
            yield proc.start(this, token);
            yield token.execute(null);
            yield Promise.all(this.promises);
            this.log('.execute returned ');
            yield this.doExecutionEvent(__1.EXECUTION_EVENT.execution_executed);
            this.report();
        });
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
    signal(executionId, inputData) {
        return __awaiter(this, void 0, void 0, function* () {
            this.log('Action:signal ' + executionId + ' startedAt ');
            let token = null;
            this.appDelegate.executionStarted(this.executionContext);
            this.doExecutionEvent(__1.EXECUTION_EVENT.execution_invoke);
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
                let result = yield token.signal(inputData);
                this.log('..signal token is done');
            }
            else { // check for startEvent of a secondary process
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
                    let token = yield Token_1.Token.startNewToken(Token_1.TOKEN_TYPE.Primary, this, node, null, null, null, inputData);
                }
                else {
                    this.getItems().forEach(i => {
                        this.logger.log(`Item: ${i.id} - ${i.elementId} - ${i.status} - ${i.timeDue}`);
                    });
                    this.logger.error("*** ERROR *** task id not valid");
                }
            }
            this.log('.signal returning .. waiting for promises status:' + this.status + " id: " + executionId);
            yield Promise.all(this.promises);
            this.doExecutionEvent(__1.EXECUTION_EVENT.execution_invoked);
            this.log('.signal returned process  status:' + this.status + " id: " + executionId);
            this.report();
        });
    }
    getItems(query = null) {
        const items = [];
        this.tokens.forEach(t => {
            t.path.forEach(i => {
                items.push(i);
            });
        });
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
        const state = {
            source: this.source, items, tokens, loops,
            id: this.id, name: this.name, startedAt: this.startedAt, endedAt: this.endedAt,
            status: this.status, saved: this.saved, data: this.data, logs: this.logs, parentItemId: this.parentItemId
        };
        return state;
    }
    static restore(state, executionContext) {
        return __awaiter(this, void 0, void 0, function* () {
            const source = state.source;
            const execution = new Execution(state.name, source, executionContext);
            yield execution.definition.load();
            const tokenLoops = [];
            const tokens = new Map();
            state.tokens.forEach(t => {
                const token = Token_1.Token.load(execution, t);
                if (t.loopId)
                    tokenLoops.push({ id: t.id, loopId: t.loopId });
                execution.tokens.set(token.id, token);
                tokens.set(token.id, token);
            });
            const loops = new Map();
            state.loops.forEach(l => {
                l.execution = execution;
                const loop = Loop_1.Loop.load(execution, l);
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
                const item = Item_1.Item.load(execution, i, token);
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
            execution.status = state.status;
            execution.data = state.data;
            execution.id = state.id;
            execution.name = state.name;
            execution.startedAt = state.startedAt;
            execution.endedAt = state.endedAt;
            execution.saved = state.saved;
            execution.logs = state.logs;
            execution.parentItemId = state.parentItemId;
            execution.log('.restore completed');
            execution.report();
            execution.restored();
            return execution;
        });
    }
    restored() {
        this.doExecutionEvent(__1.EXECUTION_EVENT.execution_restored);
        this.tokens.forEach(t => {
            t.restored();
        });
    }
    resume() {
        this.doExecutionEvent(__1.EXECUTION_EVENT.execution_resumed);
        this.tokens.forEach(t => {
            t.resume();
        });
    }
    report() {
        this.log('.Execution Report ----');
        this.log('..Status:' + this.status);
        this.tokens.forEach(token => {
            const branch = token.originItem ? token.originItem.elementId : 'root';
            const parent = token.parentToken ? token.parentToken.id : '-';
            this.log(`..token: ${token.id} - ${token.status} - ${token.type} current: ${token.currentNode.id} from ${branch} child of ${parent} ` + JSON.stringify(token.data));
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
        this.log('.Data:');
        this.log(JSON.stringify(this.data));
    }
    getNewId(scope) {
        if (!this.uids[scope]) {
            this.uids[scope] = 0;
        }
        return this.uids[scope]++;
    }
    getUUID() {
        return uuidv4(); // -> '6c84fb90-12c4-11e1-840d-7b25c5ee775a' 
    }
    doExecutionEvent(event) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.listener.emit(event, { event, context: this.executionContext });
            yield this.listener.emit('all', { event, context: this.executionContext });
        });
    }
    doItemEvent(item, event) {
        return __awaiter(this, void 0, void 0, function* () {
            this.executionContext.item = item;
            yield this.listener.emit(event, { event, context: this.executionContext });
            yield this.listener.emit('all', { event, context: this.executionContext });
        });
    }
    log(msg) {
        this.logs.push(msg);
        this.logger.log(msg);
    }
    error(msg) {
        this.logs.push(msg);
        this.logger.error(msg);
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
                de = de.replace('[]', '');
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
exports.Execution = Execution;
//# sourceMappingURL=Execution.js.map