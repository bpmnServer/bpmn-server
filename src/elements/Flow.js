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
exports.MessageFlow = exports.Flow = void 0;
const Token_1 = require("../engine/Token");
const __1 = require("../../");
const _1 = require(".");
class Flow extends _1.Element {
    constructor(id, type, from, to, def) {
        super();
        this.isMessageFlow = false;
        this.id = id;
        this.type = type;
        this.from = from;
        this.to = to;
        this.def = def;
        this.name = def.name;
        this.isFlow = true;
    }
    describe() {
        if (this.def.conditionExpression) {
            // conditionExpression:{"$type":"bpmn:Expression","body":"true"}
            let expression = this.def.conditionExpression.body;
            return [['condition: ', expression]];
        }
        else
            super.describe();
    }
    /**
     *
     * <Rule> if flow has a condition, it must be evaluated and if result is true flow will continue
     *  otherwise, flow will be discarded.
     * </Rule>
     * @param item
     */
    run(item) {
        item.token.log('Flow(' + this.name + '|' + this.id + ').run: from=' + this.from.name + ' to=' + this.to.name + " find action... ");
        let action = __1.FLOW_ACTION.take;
        if (this.def.conditionExpression) {
            // conditionExpression:{"$type":"bpmn:Expression","body":"true"}
            let expression = this.def.conditionExpression.body;
            item.token.log('..conditionExpression:' + JSON.stringify(expression));
            item.token.log(JSON.stringify(item.token.data));
            let result = item.token.execution.appDelegate.scopeEval(item, expression);
            item.token.log('..conditionExpression:' + expression + " result: " + result);
            if (result == false) {
                action = __1.FLOW_ACTION.discard;
            }
        }
        item.token.log('Flow(' + this.name + '|' + this.id + ').run: going to ' + this.to.id + " action : " + action);
        return action;
    }
    execute(item) {
        return __awaiter(this, void 0, void 0, function* () {
        });
    }
}
exports.Flow = Flow;
// ---------------------------------------------
/**
*
* <Rule>MessageFlow: can only be sent to active node in waiting
 * or to a start event
* </Rule>
* */
class MessageFlow extends Flow {
    constructor() {
        super(...arguments);
        this.isMessageFlow = true;
    }
    execute(item) {
        return __awaiter(this, void 0, void 0, function* () {
            item.token.log('..MessageFlow -' + this.id + ' going to ' + this.to.id);
            const execution = item.token.execution;
            let token = null;
            execution.tokens.forEach(t => {
                if (t.currentNode && t.currentNode.id == this.to.id)
                    token = t;
            });
            if (token) {
                item.token.log('    signalling token:' + token.id);
                execution.promises.push(token.signal(null));
            }
            else {
                item.token.log('    signalling new token:');
                execution.promises.push(Token_1.Token.startNewToken(Token_1.TOKEN_TYPE.Primary, execution, this.to, null, null, null, null));
            }
        });
    }
}
exports.MessageFlow = MessageFlow;
//# sourceMappingURL=Flow.js.map