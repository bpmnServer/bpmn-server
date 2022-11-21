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
exports.TOKEN_TYPE = exports.Token = void 0;
const fs = require('fs');
const __1 = require("../../");
const Loop_1 = require("./Loop");
const Item_1 = require("./Item");
/*
 *  Tokens:
 *          Start                       End                     data
 *
 *      1 start of execution              end of execution          execution
 *      2 start of sbuexecution           end of subexecution       own (new object)
 *      3 start of multi-instances      end of instance         own (new object)
 *      4 diverging                     at converge             parent
 *
 *  Rules:
 *      Node acts synchronisly
 *
 *      parent token go on 'HOLD' waiting for children to finish
 *
 *      token;  parent
 *              holdingForCount   when 0 it proceeds to next node
 *
 *   scenario 1:
 *      Event1 -> Task1->GW1 ->     task1      ->gw2            task 3
 *                                  task2      ->gw2
 *       t1         t1    t1(wait)
 *                                  t2          t2 end -t1 wait
 *                                  t3          t3 end -t1 go
 *
 *          when t2 arrives at gw2 - it ends and t1 count--
 *          when t3 arrives at gw2 - it ends and t1 count--
 *              since count==0 t1 will proceed
 *       gw2 logic t2 is from t1- waits for t1 counter to be
 *
 *
 *       ------- Data ----
 *
 *  execution Data execution.data
 *  nodeData
 *
 *
 */
// ---------------------------------------------
var TOKEN_TYPE;
(function (TOKEN_TYPE) {
    TOKEN_TYPE["Primary"] = "Primary";
    TOKEN_TYPE["SubProcess"] = "SubProcess";
    TOKEN_TYPE["Instance"] = "Instance";
    TOKEN_TYPE["Diverge"] = "Diverge";
    TOKEN_TYPE["EventSubProcess"] = "EventSubProces";
    TOKEN_TYPE["BoundaryEvent"] = "BoundaryEvent";
})(TOKEN_TYPE || (TOKEN_TYPE = {}));
exports.TOKEN_TYPE = TOKEN_TYPE;
// ---------------------------------------------
class Token {
    constructor(type, execution, startNode, dataPath, parentToken, originItem) {
        this.execution = execution;
        this.type = type;
        if (dataPath)
            this.dataPath = dataPath;
        else
            this.dataPath = '';
        this.startNodeId = startNode.id;
        this.currentNode = startNode;
        this.parentToken = parentToken;
        this.originItem = originItem;
        this.id = execution.getNewId('token');
        this.processId = startNode.processId;
        this.path = [];
    }
    get data() {
        return this.execution.getData(this.dataPath);
    }
    get currentItem() {
        return this.path[this.path.length - 1];
    }
    get firstItem() {
        return this.path[0];
    }
    get lastItem() {
        let nodes = this.path.filter(function (value) {
            return (value.element.type == 'bpmn:SequenceFlow') ? false : true;
        });
        if (nodes.length > 1)
            return nodes[nodes.length - 2];
        else
            return null;
    }
    get childrenTokens() {
        const list = [];
        this.execution.tokens.forEach(t => { if (t.parentToken && t.parentToken.id == this.id)
            list.push(t); });
        return list;
    }
    /**
     *
     * @param execution
     * @param startNode
     * @param dataPath
     * @param parentToken
     * @param originItem
     * @param loop
     * @param data
     */
    static startNewToken(type, execution, startNode, dataPath, parentToken, originItem, loop, data = null, noExecute = false) {
        return __awaiter(this, void 0, void 0, function* () {
            const token = new Token(type, execution, startNode, dataPath, parentToken, originItem);
            token.log('Token(*).startNewToken:  starting new Token with id=' + token.id + ' start node=' + startNode.id);
            token.loop = loop;
            execution.tokens.set(token.id, token);
            token.appendData(data);
            if (noExecute == false)
                yield token.execute(data);
            return token;
        });
    }
    save() {
        let parentToken, originItem, loopId;
        if (this.parentToken)
            parentToken = this.parentToken.id;
        if (this.originItem)
            originItem = this.originItem.id;
        if (this.loop)
            loopId = this.loop.id;
        const items = [];
        this.path.forEach(i => {
            items.push(i.save());
        });
        return {
            id: this.id, type: this.type, status: this.status, dataPath: this.dataPath, loopId,
            parentToken, originItem, startNodeId: this.startNodeId,
            currentNode: this.currentNode.id
        };
    }
    static load(execution, da) {
        const startNode = execution.getNodeById(da.startNodeId);
        const parentToken = execution.getToken(da.parentToken);
        const currentNode = execution.getNodeById(da.currentNode);
        const token = new Token(da.type, execution, startNode, da.dataPath, parentToken, null);
        token.id = da.id;
        token.startNodeId = da.startNodeId;
        token.currentNode = currentNode;
        token.status = da.status;
        token.path = [];
        return token;
    }
    stop() {
    }
    /*
     * is fired once after the execution is resumed from restrt
     *
     *  fire resume for all existing items to wakeup the timers
     *
     */
    resume() {
        this.currentNode.resume(this.currentItem);
    }
    restored() {
        this.path.forEach(item => {
            item.element.restored(item);
        });
    }
    getSubProcessToken() {
        if (this.type == TOKEN_TYPE.SubProcess)
            return this;
        else if (this.parentToken == null)
            return null;
        else
            return this.parentToken.getSubProcessToken();
    }
    getChildrenTokens() {
        const children = [];
        this.execution.tokens.forEach(token => {
            if (token.parentToken && (token.parentToken.id == this.id))
                children.push(token);
        });
        return children;
    }
    /*
     *  is called before Node execute and before an item is created
     *
     */
    preExecute() {
        return __awaiter(this, void 0, void 0, function* () {
            // loop
            return yield Loop_1.Loop.checkStart(this);
        });
    }
    /*
     * is called just before moving to next item in the flow
     */
    preNext() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Loop_1.Loop.checkNext(this);
        });
    }
    /**
     * this is the primary exectuion method for a token
     */
    execute(input) {
        return __awaiter(this, void 0, void 0, function* () {
            this.log('Token(' + this.id + ').execute: input' + JSON.stringify(input));
            if (this.status == __1.TOKEN_STATUS.end) {
                this.log('Token(' + this.id + ').execute: token status is end: return from execute!');
                return;
            }
            if (!(yield this.preExecute()))
                return; // loop logic will take care of it
            let ret;
            const item = new Item_1.Item(this.currentNode, this);
            this.path.push(item);
            this.log('Token(' + this.id + ').execute: new Item created itemId=' + item.id);
            if (input)
                yield this.currentNode.setInput(item, input);
            this.log('Token(' + this.id + ').execute: executing currentNodeId=' + this.currentNode.id);
            ret = yield this.currentNode.execute(item);
            /*
                    // check for subprocess
                    if (this.currentNode.type == 'bpmn:SubProcess') {
                        this.log('..executing a sub process item:' + this.currentNode.id + " " + item.id + " is done");
                        const subProcess = this.currentNode as SubProcess;
                        const proc = subProcess.childProcess;
                        const startNode = proc.getStartNode();
            
                        const newToken = await Token.startNewToken(this.execution, startNode, null, this, this.currentNode, null);
            
                    }
            */
            this.log('Token(' + this.id + ').execute: executing currentNodeId=' + this.currentNode.id + " itemId=" + item.id + " is done!");
            if (ret == __1.NODE_ACTION.wait) {
                this.status = __1.TOKEN_STATUS.wait;
                return; // goto sleep for now will call you by signal
            }
            else if (ret == __1.NODE_ACTION.error) {
                yield this.processError();
            }
            else if (ret == __1.NODE_ACTION.abort) {
                this.execution.terminate();
                return;
            }
            const result = yield this.goNext();
            return result;
        });
    }
    processError() {
        return __awaiter(this, void 0, void 0, function* () {
            let errorHandlerToken = null;
            // two types of error handlers
            //  1.  eventSubProcess 
            //  2.  boundaryEvents  
            let contextItem = this.currentItem;
            let contextToken = this;
            while (contextToken && errorHandlerToken == null) {
                contextToken.childrenTokens.forEach(ct => {
                    if ((ct.type == TOKEN_TYPE.EventSubProcess || ct.type == TOKEN_TYPE.BoundaryEvent)
                        && ct.currentNode.subType == __1.NODE_SUBTYPE.error) {
                        errorHandlerToken = ct;
                    }
                });
                contextToken = contextToken.parentToken;
            }
            if (errorHandlerToken) {
                yield errorHandlerToken.signal(null);
                this.currentItem.status = __1.ITEM_STATUS.end;
                yield this.end();
            }
            else {
                this.log("Aborting due to error");
                this.execution.terminate();
                return;
            }
        });
    }
    processEscalation() {
        return __awaiter(this, void 0, void 0, function* () {
            let errorHandlerToken = null;
            // two types of error handlers
            //  1.  eventSubProcess 
            //  2.  boundaryEvents  
            let contextItem = this.currentItem;
            let contextToken = this;
            while (contextToken && errorHandlerToken == null) {
                contextToken.childrenTokens.forEach(ct => {
                    if ((ct.type == TOKEN_TYPE.EventSubProcess || ct.type == TOKEN_TYPE.BoundaryEvent)
                        && ct.currentNode.subType == __1.NODE_SUBTYPE.escalation) {
                        errorHandlerToken = ct;
                    }
                });
                contextToken = contextToken.parentToken;
            }
            if (errorHandlerToken) {
                yield errorHandlerToken.signal(null);
            }
        });
    }
    /**
     *
     *  renamed from applyInput to appendData
     * @param inputData
     */
    appendData(inputData) {
        this.execution.appendData(inputData, this.dataPath);
    }
    /**
     *  is called by Gateways to cancel current token
     *
     * */
    terminate() {
        return __awaiter(this, void 0, void 0, function* () {
            this.log('Token(' + this.id + ').terminate: terminating ....');
            yield this.currentNode.end(this.currentItem);
            yield this.end();
            this.log('Token(' + this.id + ').terminate: terminating is done!');
        });
    }
    /**
     *  is called by events to cancel current token
     *
     * */
    continue() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.currentNode.end(this.currentItem);
            yield this.goNext();
        });
    }
    /*
     *  is called to invoke an element like userTask, or trigger an envent or signal
     *
     */
    signal(data) {
        return __awaiter(this, void 0, void 0, function* () {
            // check if valid node and valid status
            // find the item
            const item = this.currentItem;
            //this.log(`..token.signal ${this.currentNode.id} ${this.currentNode.type}`);
            this.log('Token(' + this.id + ').signal: invoking ' + this.currentNode.id + ' ' + this.currentNode.type + ' with data=' + JSON.stringify(data));
            yield this.currentNode.setInput(item, data);
            if (item.status == __1.ITEM_STATUS.wait) { // || item.type=='bpmn:SubProcess') {
                const ret = yield this.currentNode.run(item);
                let result = yield this.currentNode.continue(item);
                result = yield this.goNext();
            }
            else
                this.log(`*** ERROR===== invoking a type of  ${this.currentNode.type} with status of ${item.status}`);
            this.log('Token(' + this.id + ').signal: invoke ' + this.currentNode.id + ' ' + this.currentNode.type + ' finished!');
        });
    }
    /*
     *  is called to mark this token end
     */
    end() {
        return __awaiter(this, void 0, void 0, function* () {
            this.log('Token(' + this.id + ').end: currentNode=' + this.currentNode.id + ' status=' + this.status + ' currentItem.status=' + this.currentItem.status);
            if (this.currentItem.status != __1.ITEM_STATUS.end)
                this.log('..**token ended but item is still ' + this.currentItem.status);
            this.status = __1.TOKEN_STATUS.end;
            this.execution.tokenEnded(this);
            // check if subprocess then continue parent
            if (this.type == TOKEN_TYPE.SubProcess) {
                this.log('..subprocess token has ended');
                yield this.parentToken.signal(null);
            }
            let i;
            const children = this.childrenTokens;
            for (i = 0; i < children.length; i++) {
                const child = children[i];
                if (child.type == TOKEN_TYPE.EventSubProcess) {
                    yield child.terminate();
                }
            }
            this.log('Token(' + this.id + ').end(): finished!');
        });
    }
    setCurrentNode(newCurrentNode) {
        this.log('Token(' + this.id + ').goNext():  newCurrentNode.id=' + newCurrentNode.id + ' currentNode=' + this.currentNode);
        this.currentNode = newCurrentNode;
    }
    /*
     *  once node is completed the token will move to next action
     *
     */
    goNext() {
        return __awaiter(this, void 0, void 0, function* () {
            this.log('Token(' + this.id + ').goNext(): currentNodeId=' + this.currentNode.id + ' type=' + this.currentNode.type + ' currentItem.status=' + this.currentItem.status);
            //this.log(`..token.goNext from ${this.currentNode.id} ${this.currentNode.type}`);
            if (!(yield this.preNext()))
                return;
            const outbounds = this.currentNode.getOutbounds(this.currentItem);
            if (outbounds.length == 0) {
                this.log('Token(' + this.id + ').goNext(): no more outbounds - ending this token ' + this.id);
                return yield this.end();
            }
            let thisNode = this.currentNode;
            let thisItem = this.currentItem;
            const self = this;
            const promises = [];
            //        if (outbounds.length > 1) {
            //            this.end();
            //        }
            this.log('Token(' + this.id + ').goNext(): verify outbonds....');
            outbounds.forEach(function (flowItem) {
                return __awaiter(this, void 0, void 0, function* () {
                    self.log('Token(' + self.id + ').goNext(): ... outbonds flowItemId=' + flowItem.id);
                    /// need to check if next node is converging; therefore no new item``
                    flowItem.status = __1.ITEM_STATUS.end;
                    self.path.push(flowItem);
                    let nextNode = flowItem.element['to'];
                    self.log('Token(' + self.id + ').goNext(): ... currentNodeId(' + self.currentNode.name + '|' + self.currentNode.id + ') processing  Flow(' + flowItem.element.id + ") to " + nextNode.id);
                    if (nextNode) {
                        if (outbounds.length == 1) {
                            self.currentNode = nextNode;
                            promises.push(self.execute(null));
                        }
                        else {
                            promises.push(Token.startNewToken(TOKEN_TYPE.Diverge, self.execution, nextNode, null, self, thisItem, null));
                        }
                    }
                });
            });
            if (outbounds.length > 1) {
                this.end();
            }
            this.log('Token(' + this.id + ').goNext(): waiting for num promises ' + promises.length);
            yield Promise.all(promises);
            this.log('Token(' + this.id + ').goNext(): is done currentNodeId=' + this.currentNode.id);
        });
    }
    log(msg) {
        this.execution.log(msg);
    }
    error(msg) {
        this.execution.error(msg);
    }
}
exports.Token = Token;
//# sourceMappingURL=Token.js.map