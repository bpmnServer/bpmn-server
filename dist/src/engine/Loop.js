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
const Behaviour_1 = require("../Elements/Behaviour");
const Execution_1 = require("./Execution");
var dummy;
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
            this.definition = node.getBehaviour(Behaviour_1.Behaviour_names.LoopCharacteristics);
            const coll = this.definition.collection;
            token.log('loop collection:' + coll);
            this.completed = 0;
            this.items = Execution_1.Execution.scopeEval(token.data, coll);
            this.dataPath = token.dataPath + '.' + this.node.id + '[]';
            this.sequence = 0;
        }
    }
    isSequential() { return (this.definition.isSequential()); }
    save() {
        return {
            id: this.id, nodeId: this.node.id, ownerTokenId: this.ownerToken.id, dataPath: this.dataPath,
            items: this.items, completed: this.completed, sequence: this.sequence
        };
    }
    static load(execution, dataObject) {
        let node = execution.getNodeById(dataObject.nodeId);
        let ownerToken = execution.getToken(dataObject.ownerTokenId);
        let loop = new Loop(node, ownerToken, dataObject);
        loop.dataPath = dataObject.dataPath;
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
            const loopDefinition = token.currentNode.getBehaviour(Behaviour_1.Behaviour_names.LoopCharacteristics);
            if (loopDefinition) {
                if (loopDefinition.isSequential()) {
                    // are we starting a new loop or continueing in an exiting one?
                    if (token.loop) // already assigned a loop
                        return true; // go ahead and execute
                    let loop = new Loop(token.currentNode, token);
                    let seq = loop.getNext();
                    let data = {};
                    data[loop.getKeyName()] = seq;
                    let newToken = yield Token_1.Token.startNewToken(token.execution, token.currentNode, loop.dataPath, token, token.currentNode, loop);
                    newToken.applyInput(data);
                    return false; // launching new token; stop this one
                }
                else { // parallel 
                    // launch as many tokens as needed
                    if (token.loop) // already assigned a loop
                        return true; // go ahead and execute
                    let loop = new Loop(token.currentNode, token);
                    loop.items.forEach(function (inst) {
                        return __awaiter(this, void 0, void 0, function* () {
                            let data = {};
                            data[loop.getKeyName()] = inst;
                            let newToken = yield Token_1.Token.startNewToken(token.execution, token.currentNode, loop.dataPath, token, token.currentNode, loop);
                            newToken.applyInput(data);
                        });
                    });
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
                        let newToken = yield Token_1.Token.startNewToken(token.execution, token.currentNode, token.loop.dataPath, token, token.currentNode, token.loop);
                        newToken.applyInput(data);
                        return false;
                    }
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