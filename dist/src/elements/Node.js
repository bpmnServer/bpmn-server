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
const __1 = require("../../");
const Item_1 = require("../engine/Item");
const NodeLoader_1 = require("./NodeLoader");
const BehaviourLoader_1 = require("./behaviours/BehaviourLoader");
// ---------------------------------------------
class Node extends _1.Element {
    constructor(id, processId, type, def) {
        super();
        this.scripts = new Map();
        this.id = id;
        this.processId = processId;
        this.type = type;
        this.def = def;
        this.inbounds = [];
        this.outbounds = [];
        this.name = def.name;
        this.attachments = [];
        BehaviourLoader_1.BehaviourLoader.load(this);
    }
    doEvent(item, event, newStatus) {
        return __awaiter(this, void 0, void 0, function* () {
            if (newStatus)
                item.status = newStatus;
            item.token.log('..>' + event + ' ' + this.id);
            const script = this.scripts.get(event);
            if (script) {
                yield item.token.execution.appDelegate.scopeJS(item, script);
            }
            return yield item.token.execution.doItemEvent(item, event);
        });
    }
    /**
     * transform data using input rules
     * todo
     * @param item
     */
    setInput(item, input) {
        return __awaiter(this, void 0, void 0, function* () {
            //
            item.token.log('--setting input ' + JSON.stringify(input));
            const data = this.getInput(item, input);
            item.token.applyInput(data);
        });
    }
    getInput(item, input) {
        return __awaiter(this, void 0, void 0, function* () {
            item.context.response.input = input;
            yield this.doEvent(item, __1.EXECUTION_EVENT.transform_input, null);
            return item.context.response.input;
        });
    }
    /**
     * transform data using output rules
     * todo
     * @param item
     */
    getOutput(item) {
        return __awaiter(this, void 0, void 0, function* () {
            item.context.response.output = item.data;
            item.context.response.messageMatchingKey = {};
            yield this.doEvent(item, __1.EXECUTION_EVENT.transform_output, null);
            return item.context.response.output;
        });
    }
    enter(item) {
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
            //  2  enter
            //  --------
            yield this.doEvent(item, __1.EXECUTION_EVENT.node_enter, __1.ITEM_STATUS.enter);
            this.enter(item); // no choice
            //  3   start
            //  --------
            yield this.doEvent(item, __1.EXECUTION_EVENT.node_start, __1.ITEM_STATUS.start);
            let ret = yield this.start(item);
            let wait = ret == __1.NODE_ACTION.wait;
            this.behaviours.forEach(b => {
                if (b.start(item) == __1.NODE_ACTION.wait) {
                    item.token.log("..behaviour returned wait");
                    wait = true;
                }
            });
            // check for attachments - boundary events:
            let i;
            for (i = 0; i < this.attachments.length; i++) {
                let event = this.attachments[i];
                item.token.log('..executing boundary event -' + event.id);
                yield Token_1.Token.startNewToken(item.token.execution, event, null, item.token, this, null);
                item.token.log('..executing boundary event -' + event.id + ' ended');
            }
            if (wait) {
                yield this.doEvent(item, __1.EXECUTION_EVENT.node_wait, __1.ITEM_STATUS.wait);
                return __1.NODE_ACTION.wait;
            }
            //  4   run  perform the work
            //  --------
            item.token.log('..>run ' + this.id);
            ret = yield this.run(item);
            switch (ret) {
                case __1.NODE_ACTION.error:
                    return ret;
                    break;
                case __1.NODE_ACTION.abort:
                    return ret;
                    break;
            }
            //  5   continue    
            //  --------
            //          end
            return yield this.continue(item);
        });
    }
    /*
     *  called by execute or by token.invoke to continue work already started
     */
    continue(item) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.end(item);
            return;
        });
    }
    start(item) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.requiresWait) {
                return __1.NODE_ACTION.wait;
            }
            return __1.NODE_ACTION.continue;
        });
    }
    run(item) {
        return __awaiter(this, void 0, void 0, function* () {
            return __1.NODE_ACTION.end;
        });
    }
    end(item) {
        return __awaiter(this, void 0, void 0, function* () {
            /// fire message flow
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
                if (flow.type == NodeLoader_1.BPMN_TYPE.MessageFlow) {
                    let flowItem = new Item_1.Item(flow, item.token);
                    yield flow.execute(flowItem);
                }
            }
            if (item.status == __1.ITEM_STATUS.end)
                return;
            item.endedAt = new Date().toISOString();
            ;
            this.behaviours.forEach(function (b) {
                return __awaiter(this, void 0, void 0, function* () { yield b.end(item); });
            });
            yield this.doEvent(item, __1.EXECUTION_EVENT.node_end, __1.ITEM_STATUS.end);
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
        const outbounds = [];
        this.outbounds.forEach(flow => {
            if (flow.type == NodeLoader_1.BPMN_TYPE.MessageFlow) {
            }
            else {
                let flowItem = new Item_1.Item(flow, item.token);
                if (flow.run(flowItem) == __1.FLOW_ACTION.take)
                    outbounds.push(flowItem);
            }
        });
        item.token.log('..return outbounds' + outbounds.length);
        return outbounds;
    }
}
exports.Node = Node;
//# sourceMappingURL=Node.js.map