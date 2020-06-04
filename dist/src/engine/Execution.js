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
const Logger_1 = require("../common/Logger");
const fs = require('fs');
const Item_1 = require("./Item");
const Token_1 = require("./Token");
const Loop_1 = require("./Loop");
const Enums_1 = require("./Enums");
const events_1 = require("events");
const Definition_1 = require("../elements/Definition");
const common_1 = require("../common");
const { v4: uuidv4 } = require('uuid');
var dummy;
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
     * @param handler       a delegate object to handle services
     * @param logger        to capture log messages
     * @param listener      an event listener
     */
    constructor(name, source, handler, logger, listener) {
        this.tokens = new Map();
        this.logs = [];
        this.uids = {};
        this.id = this.getUUID();
        this.name = name;
        this.source = source;
        if (logger)
            this.logger = logger;
        else
            this.logger = new Logger_1.Logger({ toConsole: false });
        if (handler)
            this.handler = handler;
        else
            this.handler = new common_1.DefaultHandler(this.logger);
        if (!listener)
            listener = new events_1.EventEmitter();
        this.listener = listener;
        this.definition = new Definition_1.Definition(name, source, this.logger);
    }
    getNodeById(id) {
        return this.definition.getNodeById(id);
    }
    getToken(id) {
        return this.tokens.get(id);
    }
    tokenEnded(token) {
        let active = 0;
        this.tokens.forEach(t => { if (t.status != Enums_1.TOKEN_STATUS.end)
            active++; });
        if (active == 0) {
            this.end();
        }
    }
    end() {
        return __awaiter(this, void 0, void 0, function* () {
            this.log("execution ended.");
            this.endedAt = new Date().toISOString();
            ;
            this.status = Enums_1.EXECUTION_STATUS.end;
            this.doExecutionEvent(Enums_1.EXECUTION_EVENT.execution_end);
        });
    }
    /**
     *
     * causes the execution to stop from running any further
     * */
    stop() {
    }
    execute(startNode = null, inputData = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            this.log('execute:');
            yield this.definition.load();
            this.status = Enums_1.EXECUTION_STATUS.running;
            if (inputData)
                this.data = inputData;
            else
                this.data = {};
            this.startedAt = new Date().toISOString();
            ;
            this.doExecutionEvent(Enums_1.EXECUTION_EVENT.execution_execute);
            if (!startNode)
                startNode = this.definition.getStartNode();
            if (!startNode) {
                this.logger.error("No Start Node");
                return;
            }
            this.log('starting at :' + startNode.id);
            dummy = yield Token_1.Token.startNewToken(this, startNode, null, null, null, null);
            this.log('-----execute returned ');
            yield this.doExecutionEvent(Enums_1.EXECUTION_EVENT.execution_executed);
            this.report();
        });
    }
    signal(executionId, inputData) {
        return __awaiter(this, void 0, void 0, function* () {
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
            this.doExecutionEvent(Enums_1.EXECUTION_EVENT.execution_invoke);
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
                yield token.signal(inputData);
            else
                this.log("*** ERROR *** task id not valid");
            this.doExecutionEvent(Enums_1.EXECUTION_EVENT.execution_invoked);
            this.log('-----signal returned process  status:' + this.status + " id: " + executionId);
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
            status: this.status, saved: this.saved, data: this.data, logs: this.logs
        };
        return state;
    }
    static restore(state, handler, logger) {
        return __awaiter(this, void 0, void 0, function* () {
            const source = state.source;
            const execution = new Execution(state.name, source, handler, logger);
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
            state.items.forEach(i => {
                const token = execution.getToken(i.tokenId);
                token.path.push(Item_1.Item.load(execution, i, token));
            });
            execution.status = state.status;
            execution.data = state.data;
            execution.id = state.id;
            execution.name = state.name;
            execution.startedAt = state.startedAt;
            execution.endedAt = state.endedAt;
            execution.doExecutionEvent(Enums_1.EXECUTION_EVENT.execution_restored);
            execution.saved = state.saved;
            execution.logs = state.logs;
            execution.log('-restore completed');
            execution.report();
            return execution;
        });
    }
    resume() {
        this.doExecutionEvent(Enums_1.EXECUTION_EVENT.execution_resumed);
        this.tokens.forEach(t => {
            t.resume();
        });
    }
    report() {
        this.log('---Execution Report ----');
        this.log('Status:' + this.status);
        this.tokens.forEach(token => {
            const branch = token.branchNode ? token.branchNode.id : 'root';
            this.log(`token: ${token.id} - ${token.status} - current: ${token.currentNode.id} from ${branch}  ` + JSON.stringify(token.data));
        });
        let indx = 0;
        const items = this.getItems();
        for (indx = 0; indx < items.length; indx++) {
            const item = items[indx];
            const endedAt = (item.endedAt) ? item.endedAt : '-';
            if (item.element.type == 'bpmn:SequenceFlow')
                this.log(`Item:${indx} -T# ${item.token.id} ${item.element.id} Type: ${item.element.type} status: ${item.status}`);
            else
                this.log(`Item:${indx} -T# ${item.token.id} ${item.element.id} Type: ${item.element.type} status: ${item.status} start ${item.startedAt} end ${endedAt} `);
        }
        this.log('Data:');
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
            yield this.listener.emit(event, this);
            yield this.listener.emit('all', event, this);
        });
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