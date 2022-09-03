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
exports.SignalEventBehaviour = exports.MessageEventBehaviour = void 0;
const _1 = require(".");
const __1 = require("../../..");
/**
 *
 *
 * it is part of the following:
 *
 *  events
 *  sendTask
 *  receiveTask
 * */
class MessageEventBehaviour extends _1.Behaviour {
    init() {
        this.node.messageId = this.messageId;
        this.node.subType = __1.NODE_SUBTYPE.message;
    }
    start(item) {
        return __awaiter(this, void 0, void 0, function* () {
            item.context.logger.log("message event behaviour start");
            if (this.node.isCatching) {
                item.messageId = this.messageId;
            }
            else { // throw a message
                const output = yield this.node.getOutput(item);
                const matchingKey = item.context.messageMatchingKey;
                item.token.log(`.Throwing Message <${this.messageId}> - output: ${JSON.stringify(output)} - matching key : ${JSON.stringify(matchingKey)}`);
                yield item.context.appDelegate.messageThrown(this.messageId, output, matchingKey, item);
            }
        });
    }
    end(item) {
    }
    get messageId() {
        if (this.definition['messageRef'])
            return this.definition['messageRef']['name'];
    }
    describe() {
        if (this.node.isCatching)
            return ['Message', `catches message '${this.messageId}'`];
        else
            return ['Message', `throws message '${this.messageId}'`];
    }
}
exports.MessageEventBehaviour = MessageEventBehaviour;
class SignalEventBehaviour extends _1.Behaviour {
    init() {
        this.node.signalId = this.signalId;
        this.node.subType = __1.NODE_SUBTYPE.signal;
    }
    start(item) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.node.isCatching) {
                item.signalId = this.signalId;
            }
            else { // throw a message
                const output = yield this.node.getOutput(item);
                const matchingKey = item.context.messageMatchingKey;
                item.token.log(`.Throwing Signal <${this.signalId}> - output: ${JSON.stringify(output)} - matching key : ${JSON.stringify(matchingKey)}`);
                item.context.appDelegate.signalThrown(this.signalId, output, matchingKey, item);
            }
        });
    }
    end(item) {
    }
    describe() {
        if (this.node.isCatching)
            return ['Signal', `catches signal '${this.signalId}'`];
        else
            return ['Signal', `throws signal '${this.signalId}'`];
    }
    get signalId() {
        if (this.definition['signalRef'])
            return this.definition['signalRef']['name'];
    }
}
exports.SignalEventBehaviour = SignalEventBehaviour;
//# sourceMappingURL=MessageSignal.js.map