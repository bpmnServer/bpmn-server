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
exports.Loop = void 0;
const Token_1 = require("./Token");
const elements_1 = require("../elements/");
class Loop {
    constructor(node, token, dataObject) {
        this.node = node;
        this.ownerToken = token;
        if (dataObject) {
            this.id = dataObject.id;
            this.items = dataObject.items;
            this.completed = dataObject.completed;
            this.sequence = dataObject.sequence;
        }
        else {
            this.id = token.execution.getNewId('loop');
            this.definition = node.getBehaviour(elements_1.Behaviour_names.LoopCharacteristics);
            this.completed = 0;
            this.sequence = 0;
            const coll = this.definition.collection;
            this.dataPath = token.dataPath + '.' + this.node.id + '[]';
            if (coll) {
                token.log('loop collection:' + coll);
                this.items = token.execution.appDelegate.scopeEval(token, coll);
            }
            else
                this.items = [];
        }
    }
    isSequential() { return (this.definition.isSequential()); }
    isStandard() { return (this.definition.isStandard()); }
    save() {
        return {
            id: this.id, nodeId: this.node.id, ownerTokenId: this.ownerToken.id, dataPath: this.dataPath,
            //            items: this.items,
            completed: this.completed, sequence: this.sequence
        };
    }
    static load(execution, dataObject) {
        let node = execution.getNodeById(dataObject.nodeId);
        let ownerToken = execution.getToken(dataObject.ownerTokenId);
        let loop = new Loop(node, ownerToken, dataObject);
        loop.dataPath = dataObject.dataPath;
        loop.sequence = dataObject.sequence;
        return loop;
    }
    getKeyName() {
        return 'loopKey';
    }
    isDone() {
        return (this.sequence > this.items.length - 1);
    }
    getNext() {
        if (this.isDone)
            return this.items[this.sequence++];
        else
            return null;
    }
    static checkStart(token) {
        return __awaiter(this, void 0, void 0, function* () {
            // loop
            const loopDefinition = token.currentNode.getBehaviour(elements_1.Behaviour_names.LoopCharacteristics);
            if (loopDefinition) {
                if (loopDefinition.isSequential()) {
                    // are we starting a new loop or continueing in an exiting one?
                    if (token.loop) // already assigned a loop
                        return true; // go ahead and execute
                    let loop = new Loop(token.currentNode, token);
                    let seq = loop.getNext();
                    let data = {};
                    data[loop.getKeyName()] = seq;
                    let newToken = yield Token_1.Token.startNewToken(Token_1.TOKEN_TYPE.Instance, token.execution, token.currentNode, loop.dataPath + '.' + seq, token, token.currentItem, loop, data);
                    return false; // launching new token; stop this one
                }
                else if (loopDefinition.isStandard()) {
                    console.log("standard loop");
                    // are we starting a new loop or continueing in an exiting one?
                    if (token.loop) // already assigned a loop
                        return true; // go ahead and execute
                    let loop = new Loop(token.currentNode, token);
                    try {
                        let seq = loop.getNext();
                        let data = {};
                        data[loop.getKeyName()] = seq;
                        let newToken = yield Token_1.Token.startNewToken(Token_1.TOKEN_TYPE.Instance, token.execution, token.currentNode, loop.dataPath + '.' + seq, token, token.currentItem, loop, data);
                    }
                    catch (exc) {
                        console.log(exc);
                    }
                    return false; // launching new token; stop this one
                }
                else { // parallel 
                    // launch as many tokens as needed
                    if (token.loop) // already assigned a loop
                        return true; // go ahead and execute
                    let loop = new Loop(token.currentNode, token);
                    let seq;
                    if (loop.items) {
                        for (seq = 0; seq < loop.items.length; seq++) {
                            let entry = loop.items[seq];
                            let data = {};
                            data[loop.getKeyName()] = entry;
                            let newToken = yield Token_1.Token.startNewToken(Token_1.TOKEN_TYPE.Instance, token.execution, token.currentNode, loop.dataPath + '.' + seq, token, token.currentItem, loop, data);
                        }
                    }
                    else {
                        token.error("loop has no items");
                    }
                    token.log('..loop: fired all tokens' + seq);
                    return false; // launching new tokens; stop this one
                }
            }
            else
                return true; // continue with the normal logic 
        });
    }
    static checkNext(token) {
        return __awaiter(this, void 0, void 0, function* () {
            if (token.loop) {
                if (token.loop.isSequential()) {
                    if (token.loop.isDone()) {
                        // need to converge here ;
                        token.end();
                        yield token.parentToken.goNext();
                        return false;
                    }
                    else {
                        token.end();
                        let seq = token.loop.getNext();
                        let data = {};
                        data[token.loop.getKeyName()] = seq;
                        let newToken = yield Token_1.Token.startNewToken(Token_1.TOKEN_TYPE.Instance, token.execution, token.currentNode, token.loop.dataPath, token, token.currentItem, token.loop, data);
                        return false;
                    }
                }
                else if (token.loop.isStandard()) {
                    token.loop.completed++;
                    token.end();
                    if (token.loop.completed == token.loop.items.length) {
                        // need to converge here ;
                        yield token.parentToken.goNext();
                    }
                    return false; // no further action
                }
                else { // parallel 
                    token.loop.completed++;
                    token.end();
                    if (token.loop.completed == token.loop.items.length) {
                        // need to converge here ;
                        yield token.parentToken.goNext();
                    }
                    return false; // no further action
                }
            }
            return true; // continue with the normal logic 
        });
    }
}
exports.Loop = Loop;
//# sourceMappingURL=Loop.js.map