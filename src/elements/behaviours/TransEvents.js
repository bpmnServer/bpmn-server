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
exports.CancelEventBehaviour = exports.CompensateEventBehaviour = void 0;
const _1 = require(".");
const __1 = require("../../..");
const interfaces_1 = require("../../interfaces");
const __2 = require("../");
class CancelEventBehaviour extends _1.Behaviour {
    init() {
        this.node.subType = __1.NODE_SUBTYPE.cancel;
    }
    start(item) {
        return __awaiter(this, void 0, void 0, function* () {
            item.context.logger.log("staring an Error Events " + this.node.isCatching);
            if (this.node.isCatching) {
                return interfaces_1.NODE_ACTION.wait;
            }
            else { // throw a message
                yield __2.Transaction.Cancel(item.token.parentToken.currentItem);
                item.context.logger.log("Error Event is throwing an error");
                return interfaces_1.NODE_ACTION.error;
            }
        });
    }
    describe() {
        return ['CancelTransaction', ``];
    }
}
exports.CancelEventBehaviour = CancelEventBehaviour;
class CompensateEventBehaviour extends _1.Behaviour {
    init() {
        this.node.subType = __1.NODE_SUBTYPE.compensate;
    }
    start(item) {
        return __awaiter(this, void 0, void 0, function* () {
            item.context.logger.log("staring an Error Events " + this.node.isCatching);
            if (this.node.isCatching) {
                return interfaces_1.NODE_ACTION.continue;
            }
            else { // throw a message
                item.context.logger.log("Compensate Event");
                var nodeId = this.TransactionId;
                // challenge: find the item for a node, assuming there is only one item
                var transItem;
                item.token.execution.tokens.forEach(t => {
                    t.path.forEach(i => {
                        if (i.node.id == this.TransactionId) {
                            transItem = i;
                            //console.log(" transItem", transItem);
                        }
                    });
                });
                console.log("--- calling Compensate");
                yield __2.Transaction.Compensate(transItem);
                console.log("---- called Compensate");
                return interfaces_1.NODE_ACTION.continue;
            }
        });
    }
    get TransactionId() {
        if (this.definition['activityRef'])
            return this.definition['activityRef']['id'];
    }
    describe() {
        return ['Compensate', ``];
    }
}
exports.CompensateEventBehaviour = CompensateEventBehaviour;
//# sourceMappingURL=TransEvents.js.map