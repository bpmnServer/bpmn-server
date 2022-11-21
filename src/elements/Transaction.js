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
exports.Transaction = void 0;
const Token_1 = require("../engine/Token");
const Enums_1 = require("../interfaces/Enums");
const _1 = require(".");
//NO_import { DecisionTable } from 'dmn-engine';
class Transaction extends _1.SubProcess {
    get requiresWait() { return true; }
    end(item) {
        const _super = Object.create(null, {
            end: { get: () => super.end }
        });
        return __awaiter(this, void 0, void 0, function* () {
            console.log('trans ending');
            _super.end.call(this, item);
        });
    }
    /**
     * Cancel Transaction
     *  is called by Throw Cancel Event
     *
     *  1.  Aborts any started items in the transaction
     *  2.  Compensate any completed items
     *
     * @param item
     */
    static Cancel(transaction) {
        return __awaiter(this, void 0, void 0, function* () {
            yield Transaction.Compensate(transaction);
        });
    }
    /**
     * Compensate Transaction
     *  is called by Throw Compensate Event
     *  this is called outside of the transaction
     *
     *  1.  Compensate any completed items
     *
     * @param item
     */
    static Compensate(transItem) {
        return __awaiter(this, void 0, void 0, function* () {
            let trans = transItem.node;
            let items = trans.getItems(transItem);
            console.log("--- Compensating ...", transItem.elementId, " found trans items", items.length);
            for (let i = 0; i < items.length; i++) {
                let item = items[i];
                console.log(" checking item ", item.elementId, item.status);
                if (item.status == Enums_1.ITEM_STATUS.end) {
                    let evnts = item.node.attachments;
                    let toFire = [];
                    if (evnts) {
                        evnts.forEach((event, key) => {
                            console.log(item.elementId, 'event', event.subType);
                            if (event.subType == Enums_1.NODE_SUBTYPE.compensate) {
                                console.log("--- firing event", event.id);
                                toFire.push(event);
                            }
                        });
                        for (let ev = 0; ev < toFire.length; ev++) {
                            console.log(ev);
                            let newToken = yield Token_1.Token.startNewToken(Token_1.TOKEN_TYPE.BoundaryEvent, item.token.execution, toFire[ev], null, item.token, item, null);
                            console.log('New Token', newToken.status, newToken.currentItem.id, newToken.currentItem.status);
                            yield newToken.execution.signal(newToken.currentItem.id, null);
                        }
                    }
                }
            }
        });
    }
    getNodes() {
        return this.childProcess.childrenNodes;
    }
    getItemsForToken(token) {
        let items = [];
        token.childrenTokens.forEach(t => {
            t.path.forEach(it => {
                if (it.node.type !== Enums_1.BPMN_TYPE.SequenceFlow)
                    items.push(it);
            });
            items = items.concat(this.getItemsForToken(t));
        });
        return items;
    }
    getItems(item) {
        return this.getItemsForToken(item.token);
    }
    start(item) {
        const _super = Object.create(null, {
            start: { get: () => super.start }
        });
        return __awaiter(this, void 0, void 0, function* () {
            return _super.start.call(this, item);
        });
    }
}
exports.Transaction = Transaction;
//# sourceMappingURL=Transaction.js.map