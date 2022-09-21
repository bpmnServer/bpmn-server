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
exports.EscalationEventBehaviour = void 0;
const _1 = require(".");
const __1 = require("../../..");
const interfaces_1 = require("../../interfaces");
class EscalationEventBehaviour extends _1.Behaviour {
    init() {
        this.node.subType = __1.NODE_SUBTYPE.escalation;
    }
    start(item) {
        return __awaiter(this, void 0, void 0, function* () {
            item.context.logger.log("staring an Error Events " + this.node.isCatching);
            if (this.node.isCatching) {
                return interfaces_1.NODE_ACTION.wait;
            }
            else { // throw a message
                item.context.logger.log("Error Event is throwing an error");
                item.token.processEscalation();
                return interfaces_1.NODE_ACTION.continue;
            }
        });
    }
    get escalationId() {
        if (this.definition['escalatonRef'])
            return this.definition['escalationRef']['id'];
    }
    describe() {
        if (this.node.isCatching)
            return ['Message', `catches message '${this.escalationId}'`];
        else
            return ['Message', `throws message '${this.escalationId}'`];
    }
}
exports.EscalationEventBehaviour = EscalationEventBehaviour;
//# sourceMappingURL=Escalation.js.map