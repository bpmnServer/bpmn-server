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
exports.Node = void 0;
const _1 = require(".");
const Token_1 = require("../engine/Token");
const Enums_1 = require("../interfaces/Enums");
const Item_1 = require("../engine/Item");
const Enums_2 = require("../interfaces/Enums");
const BehaviourLoader_1 = require("./behaviours/BehaviourLoader");
// ---------------------------------------------
class Node extends _1.Element {
    constructor(id, process, type, def) {
        super();
        this.scripts = new Map();
        this.id = id;
        this.process = process;
        this.type = type;
        this.def = def;
        this.inbounds = [];
        this.outbounds = [];
        this.name = def.name;
        this.attachments = [];
        BehaviourLoader_1.BehaviourLoader.load(this);
    }
    get processId() {
        return this.process.id;
    }
    doEvent(item, event, newStatus) {
        return __awaiter(this, void 0, void 0, function* () {
            item.token.log('Node(' + this.name + '|' + this.id + ').doEvent: executing script for event:' + event);
            if (newStatus)
                item.status = newStatus;
            ///item.token.log('..>' + event + ' ' + this.id);
            const scripts = this.scripts.get(event);
            if (scripts) {
                for (var s = 0; s < scripts.length; s++) {
                    var script = scripts[s];
                    item.token.log('--executing script for event:' + event);
                    yield item.token.execution.appDelegate.scopeJS(item, script);
                }
            }
            return yield item.token.execution.doItemEvent(item, event);
        });
    }
    /**
     * is Called after execution
     * transform data using input rules
     * todo
     * @param item
     */
    setInput(item, input) {
        return __awaiter(this, void 0, void 0, function* () {
            item.token.log('Node(' + this.name + '|' + this.id + ').setInput: input' + JSON.stringify(input));
            //
            //item.token.log('--setting input ' + JSON.stringify(input));
            const data = yield this.getInput(item, input);
            item.token.appendData(data);
        });
    }
    getInput(item, input) {
        return __awaiter(this, void 0, void 0, function* () {
            item.token.log('Node(' + this.name + '|' + this.id + ').getInput: input' + JSON.stringify(input));
            item.context.input = input;
            yield this.doEvent(item, Enums_1.EXECUTION_EVENT.transform_input, null);
            return item.context.input;
        });
    }
    /**
     * transform data using output rules
     * todo
     * @param item
     */
    getOutput(item) {
        return __awaiter(this, void 0, void 0, function* () {
            return item.context.output;
            console.log(item.context.output);
            if (item.context.output) { }
            if (Object.keys(item.context.output).length == 0)
                item.context.output = item.data;
            return item.context.output;
        });
    }
    enter(item) {
        item.token.log('Node(' + this.name + '|' + this.id + ').enter: item=' + item.id);
        item.startedAt = new Date().toISOString();
        ;
    }
    /*
     * does the need require to go into wait
     * tasks like UserTasks, receiveTask, timer
     */
    get requiresWait() { return false; }
    /*
     * Can the Node be invoked externally (not from the workflow)
     * tasks like UserTasks, receiveTask, or events like receive,signal can be invoked
     */
    get canBeInvoked() { return false; }
    get isCatching() { return false; } // catching events and tasks
    /**
     * this is the primary exectuion method for a node
     *
     * considerations: the following are handled by Token
     *      1.  Loops we are inside a loop already (if any)
     *      2.  Gatways
     *      3.  Subprocess the parent node is fired as normal
     *              run method will fire the subprocess invoking a new token and will go into wait
     */
    execute(item) {
        return __awaiter(this, void 0, void 0, function* () {
            item.token.log('Node(' + this.name + '|' + this.id + ').execute: item=' + item.id);
            //  2  enter
            //  --------
            item.token.log('Node(' + this.name + '|' + this.id + ').execute: execute enter ...');
            yield this.doEvent(item, Enums_1.EXECUTION_EVENT.node_enter, Enums_1.ITEM_STATUS.enter);
            this.enter(item); // no choice
            const behaviourlist = [];
            this.behaviours.forEach(b => { behaviourlist.push(b); });
            for (var i = 0; i < behaviourlist.length; i++) {
                const b = behaviourlist[i];
                const bRet = yield b.enter(item);
            }
            //  3   start
            //  --------
            item.token.log('Node(' + this.name + '|' + this.id + ').execute: execute start ...');
            yield this.doEvent(item, Enums_1.EXECUTION_EVENT.node_start, Enums_1.ITEM_STATUS.start);
            let ret = yield this.start(item);
            for (var i = 0; i < behaviourlist.length; i++) {
                const b = behaviourlist[i];
                const bRet = yield b.start(item);
                if (bRet > ret)
                    ret = bRet;
            }
            // check for attachments - boundary events:
            if (ret == Enums_1.NODE_ACTION.error || ret == Enums_1.NODE_ACTION.abort)
                return ret;
            else if (ret == Enums_1.NODE_ACTION.wait) {
                yield this.doEvent(item, Enums_1.EXECUTION_EVENT.node_wait, Enums_1.ITEM_STATUS.wait);
                return ret;
            }
            //  4   run  perform the work
            //  --------
            item.token.log('Node(' + this.name + '|' + this.id + ').execute: execute run ...');
            //item.token.log('..>run ' + this.id);
            ret = yield this.run(item);
            switch (ret) {
                case Enums_1.NODE_ACTION.error:
                    return ret;
                    break;
                case Enums_1.NODE_ACTION.abort:
                    return ret;
                    break;
            }
            //  5   continue    
            //  --------
            //          end
            item.token.log('Node(' + this.name + '|' + this.id + ').execute: execute continue...');
            return yield this.continue(item);
        });
    }
    /*
     *  called by execute or by token.invoke to continue work already started
     */
    continue(item) {
        return __awaiter(this, void 0, void 0, function* () {
            item.token.log('Node(' + this.name + '|' + this.id + ').continue: item=' + item.id);
            yield this.end(item);
            return;
        });
    }
    start(item) {
        return __awaiter(this, void 0, void 0, function* () {
            item.token.log('Node(' + this.name + '|' + this.id + ').start: item=' + item.id);
            yield this.startBoundaryEvents(item, item.token);
            if (this.requiresWait) {
                return Enums_1.NODE_ACTION.wait;
            }
            return Enums_1.NODE_ACTION.continue;
        });
    }
    run(item) {
        return __awaiter(this, void 0, void 0, function* () {
            item.token.log('Node(' + this.name + '|' + this.id + ').run: item=' + item.id);
            return Enums_1.NODE_ACTION.end;
        });
    }
    end(item) {
        return __awaiter(this, void 0, void 0, function* () {
            item.token.log('Node(' + this.name + '|' + this.id + ').end: item=' + item.id);
            /**
             * Rule:    boundary events are canceled when owner task status is 'end'
             * */
            // cancel boundary events
            let i, t;
            for (i = 0; i < this.attachments.length; i++) {
                let boundaryEvent = this.attachments[i];
                let childrenTokens = item.token.getChildrenTokens();
                for (t = 0; t < childrenTokens.length; t++) {
                    let token = childrenTokens[t];
                    if (token.startNodeId == boundaryEvent.id) {
                        yield token.terminate();
                    }
                }
            }
            for (i = 0; i < this.outbounds.length; i++) {
                let flow = this.outbounds[i];
                if (flow.type == Enums_2.BPMN_TYPE.MessageFlow) {
                    let flowItem = new Item_1.Item(flow, item.token);
                    yield flow.execute(flowItem);
                }
            }
            if (item.status == Enums_1.ITEM_STATUS.end)
                return;
            item.endedAt = new Date().toISOString();
            ;
            this.behaviours.forEach(function (b) {
                return __awaiter(this, void 0, void 0, function* () { yield b.end(item); });
            });
            yield this.doEvent(item, Enums_1.EXECUTION_EVENT.node_end, Enums_1.ITEM_STATUS.end);
            item.token.log('Node(' + this.name + '|' + this.id + ').end: setting item status to end itemId=' + item.id + ' itemStatus=' + item.status);
            this.behaviours.forEach(function (b) {
                return __awaiter(this, void 0, void 0, function* () { yield b.exit(item); });
            });
            item.token.log('Node(' + this.name + '|' + this.id + ').end: finished');
        });
    }
    /**
     * is called by the token after an execution resume for every active (in wait) item
     * different than init, which is called for all items
     * @param item
     */
    resume(item) {
    }
    init(item) {
    }
    /* to be overwritten by XOR gateway */
    getOutbounds(item) {
        item.token.log('Node(' + this.name + '|' + this.id + ').getOutbounds: itemId=' + item.id);
        const outbounds = [];
        this.outbounds.forEach(flow => {
            if (flow.type == Enums_2.BPMN_TYPE.MessageFlow) {
            }
            else {
                let flowItem = new Item_1.Item(flow, item.token);
                if (flow.run(flowItem) == Enums_1.FLOW_ACTION.take)
                    outbounds.push(flowItem);
            }
        });
        //item.token.log('..return outbounds' + outbounds.length);
        item.token.log('Node(' + this.name + '|' + this.id + ').getOutbounds: return outbounds' + outbounds.length);
        return outbounds;
    }
    startBoundaryEvents(item, token) {
        return __awaiter(this, void 0, void 0, function* () {
            item.token.log('Node(' + this.name + '|' + this.id + ').startBoundaryEvents: itemId=' + item.id);
            let i;
            // check for attachments - boundary events:
            for (i = 0; i < this.attachments.length; i++) {
                let event = this.attachments[i];
                if (event.subType !== Enums_1.NODE_SUBTYPE.compensate)
                    yield Token_1.Token.startNewToken(Token_1.TOKEN_TYPE.BoundaryEvent, item.token.execution, event, null, token, item, null);
            }
        });
    }
}
exports.Node = Node;
//# sourceMappingURL=Node.js.map