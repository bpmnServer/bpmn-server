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
const server_1 = require("../server");
const Model_1 = require("./Model");
const { v4: uuidv4 } = require('uuid');
/**
 *  is accessed two ways:
 *      execute - start process
 *      signal  - invoke a node (userTask, event, etc.)
 * */
// ---------------------------------------------
class Execution extends server_1.ServerComponent {
    /**
     *
     * @param name          process name
     * @param source        bpmn source
     */
    constructor(server, name, source, state = null) {
        super(server);
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
        this.tokens = new Map();
        this.input = {};
        this.output = {};
        this.promises = [];
        this.uids = {};
        if (state == null) {
            this.instance = new Model_1.InstanceObject();
            this.instance.id = this.getUUID();
            this.instance.name = name;
            this.instance.source = source;
        }
        else
            this.instance = state;
        this.definition = new elements_1.Definition(name, source, this.server);
    }
    get id() { return this.instance.id; }
    get name() { return this.instance.name; }
    get status() { return this.instance.status; }
    get execution() { return this; } // backward compatible
    tillDone() {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield this.worker;
            return this;
        });
    }
    // end move from ExecutionContext;
    get listener() {
        return this.server.listener;
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
            this.instance.endedAt = new Date().toISOString();
            ;
            this.instance.status = __1.EXECUTION_STATUS.end;
            if (this.instance.parentItemId) {
                elements_1.CallActivity.executionEnded(this);
            }
            yield this.doExecutionEvent(this.process, __1.EXECUTION_EVENT.process_end);
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
            this.input = Object.assign({}, inputData);
            this.output = {};
            this.instance.status = __1.EXECUTION_STATUS.running;
            this.appDelegate.executionStarted(this);
            if (inputData)
                this.instance.data = Object.assign({}, inputData);
            else
                this.instance.data = {};
            this.instance.startedAt = new Date().toISOString();
            ;
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
            yield this.doExecutionEvent(this.process, __1.EXECUTION_EVENT.process_start);
            this.log('..starting at :' + startNode.id);
            let token = yield Token_1.Token.startNewToken(Token_1.TOKEN_TYPE.Primary, this, startNode, null, null, null, null, null, true);
            // start all event sub processes for the process
            const proc = startNode.process;
            yield proc.start(this, token);
            yield token.execute(null);
            yield Promise.all(this.promises);
            this.log('.execute returned');
            yield this.doExecutionEvent(this.process, __1.EXECUTION_EVENT.process_wait);
            this.report();
            yield this.save();
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
            this.log('Execution(' + this.name + ').signal: executionId=' + executionId + ' startedAt ');
            let token = null;
            this.appDelegate.executionStarted(this);
            yield this.doExecutionEvent(this.process, __1.EXECUTION_EVENT.process_invoke);
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
                this.log('Execution(' + this.name + ').signal: .. launching a token signal');
                let result = yield token.signal(inputData);
                this.log('Execution(' + this.name + ').signal: .. signal token is done');
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
                    this.logger.error("*** ERROR *** task id not valid" + executionId);
                }
            }
            this.log('Execution(' + this.name + ').signal: returning .. waiting for promises status:' + this.instance.status + " id: " + executionId);
            yield Promise.all(this.promises);
            yield this.doExecutionEvent(this.process, __1.EXECUTION_EVENT.process_invoked);
            this.log('Execution(' + this.name + ').signal: returned process  status:' + this.instance.status + " id: " + executionId);
            this.report();
            yield this.save();
            this.log('Execution(' + this.name + ').signal: finished!');
        });
    }
    save() {
        return __awaiter(this, void 0, void 0, function* () {
            // save here :
            this.log("..Saving instance " + this.instance.id);
            const state = this.getState();
            yield this.server.dataStore.saveInstance(state, this.getItems());
        });
    }
    getItems() {
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
        this.instance.items = items;
        this.instance.loops = loops;
        this.instance.tokens = tokens;
        return this.instance;
    }
    /**
     *  re-enstate the execution from db
     * @param state

     */
    static restore(server, state) {
        return __awaiter(this, void 0, void 0, function* () {
            const source = state.source;
            const execution = new Execution(server, state.name, source, state);
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
            //execution.doExecutionEvent(this, EXECUTION_EVENT.process_loaded);
            execution.log('.restore completed');
            execution.report();
            const proc = execution.definition.getStartNode().process;
            yield execution.restored();
            return execution;
        });
    }
    restored() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.doExecutionEvent(this, __1.EXECUTION_EVENT.process_restored);
            this.tokens.forEach(t => {
                t.restored();
            });
        });
    }
    resume() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.doExecutionEvent(this.process, __1.EXECUTION_EVENT.process_resumed);
            this.tokens.forEach(t => {
                t.resume();
            });
        });
    }
    report() {
        this.log('.Execution Report ----');
        this.log('..Status:' + this.instance.status);
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
        this.log('.data:');
        this.log(JSON.stringify(this.instance.data));
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
    doExecutionEvent(process, event) {
        return __awaiter(this, void 0, void 0, function* () {
            //this.item = null;
            yield this.listener.emit(event, { event, context: this });
            yield this.listener.emit('all', { event, context: this });
        });
    }
    doItemEvent(item, event) {
        return __awaiter(this, void 0, void 0, function* () {
            this.item = item;
            yield this.listener.emit(event, { event, context: this });
            yield this.listener.emit('all', { event, context: this });
        });
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
                de = de.replace('[]', '');
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
exports.Execution = Execution;
//# sourceMappingURL=Execution.js.map