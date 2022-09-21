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
exports.ErrorEventBehaviour = void 0;
const _1 = require(".");
const __1 = require("../../..");
const interfaces_1 = require("../../interfaces");
class ErrorEventBehaviour extends _1.Behaviour {
    init() {
        this.node.subType = __1.NODE_SUBTYPE.error;
    }
    start(item) {
        return __awaiter(this, void 0, void 0, function* () {
            item.context.logger.log("staring an Error Events " + this.node.isCatching);
            if (this.node.isCatching) {
                return interfaces_1.NODE_ACTION.wait;
            }
            else { // throw a message
                item.context.logger.log("Error Event is throwing an error");
                return interfaces_1.NODE_ACTION.error;
            }
        });
    }
    get errorId() {
        if (this.definition['errorRef'])
            return this.definition['errorRef']['id'];
    }
    describe() {
        if (this.node.isCatching)
            return ['Message', `catches message '${this.errorId}'`];
        else
            return ['Message', `throws message '${this.errorId}'`];
    }
}
exports.ErrorEventBehaviour = ErrorEventBehaviour;
//# sourceMappingURL=Error.js.map