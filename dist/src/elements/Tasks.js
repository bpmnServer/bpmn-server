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
exports.CallActivity = exports.SubProcess = exports.ReceiveTask = exports.SendTask = exports.ServiceTask = exports.ScriptTask = exports.UserTask = void 0;
const Token_1 = require("../engine/Token");
const __1 = require("../../");
const Node_1 = require("./Node");
const Enums_1 = require("../interfaces/Enums");
// ---------------------------------------------
class ScriptTask extends Node_1.Node {
    run(item) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.def.script) {
                item.token.log(this.def.script);
                yield item.token.execution.appDelegate.scopeJS(item, this.def.script);
            }
            return __1.NODE_ACTION.end;
        });
    }
}
exports.ScriptTask = ScriptTask;
/**
 *
 *      foo[method]();
 *
 *      await this.token.appDelegate[serviceName](data);
 *
 *
 *      service signature:
 *              output= service (input,context)
 */
class ServiceTask extends Node_1.Node {
    run(item) {
        return __awaiter(this, void 0, void 0, function* () {
            item.context.response.action = null;
            // calling appDelegate by service name
            const appDelegate = item.token.execution.appDelegate;
            let serviceName;
            let output = yield item.node.getOutput(item);
            if (this.def.implementation) {
                serviceName = this.def.implementation;
            }
            let ret;
            if (serviceName && appDelegate.servicesProvider[serviceName])
                ret = yield appDelegate.servicesProvider[serviceName](output, item.context);
            else
                ret = yield appDelegate['serviceCalled'](output, item.context);
            item.log("service returned " + ret);
            yield item.node.setInput(item, ret);
            if (item.context.response.action && item.context.response.action == __1.NODE_ACTION.wait) {
                return item.context.response.action;
            }
            return __1.NODE_ACTION.end;
        });
    }
}
exports.ServiceTask = ServiceTask;
class SendTask extends ServiceTask {
    get isCatching() { return false; }
    run(item) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.def.script) {
                item.token.log(this.def.script);
                yield item.token.execution.appDelegate.scopeJS(item, this.def.script);
            }
            return __1.NODE_ACTION.end;
        });
    }
}
exports.SendTask = SendTask;
class UserTask extends Node_1.Node {
    get requiresWait() { return true; }
    get canBeInvoked() { return true; }
}
exports.UserTask = UserTask;
class ReceiveTask extends Node_1.Node {
    get isCatching() { return true; }
    get requiresWait() { return true; }
    get canBeInvoked() { return true; }
}
exports.ReceiveTask = ReceiveTask;
class SubProcess extends Node_1.Node {
    get requiresWait() { return true; }
    get canBeInvoked() { return false; }
    start(item) {
        return __awaiter(this, void 0, void 0, function* () {
            const token = item.token;
            token.log('..executing a sub process item:' + item.id);
            const startNode = this.childProcess.getStartNodes()[0];
            yield Token_1.Token.startNewToken(token.execution, startNode, this.id, token, this, null);
            return __1.NODE_ACTION.continue;
        });
    }
}
exports.SubProcess = SubProcess;
/**
 *
 * <callActivity id="callCheckCreditProcess" name="Check credit" calledElement="checkCreditProcess" />
 *
 * the called process need to call me back when done.
 *
 * */
class CallActivity extends Node_1.Node {
    get calledElement() {
        return this.def.calledElement;
    }
    ;
    get requiresWait() { return true; }
    get canBeInvoked() { return false; }
    static executionEnded(execution) {
        return __awaiter(this, void 0, void 0, function* () {
            const itemId = execution.parentItemId;
            const executionContext = execution.executionContext;
            const engine = executionContext.engine;
            yield engine.invoke({ "items.id": itemId }, execution.data);
        });
    }
    start(item) {
        return __awaiter(this, void 0, void 0, function* () {
            const token = item.token;
            token.log('..executing a call activity for item:' + item.id + " calling " + this.calledElement);
            const context = item.context;
            const modelName = this.calledElement;
            const data = item.node.getOutput(item);
            const response = yield context.engine.start(modelName, data);
            token.log('..end of executing a call activity for item:' + item.id + " calling " + this.calledElement);
            token.log('..response :' + response.execution.status);
            if (response.execution.status == Enums_1.EXECUTION_STATUS.end)
                return __1.NODE_ACTION.continue;
            else
                return __1.NODE_ACTION.wait;
        });
    }
}
exports.CallActivity = CallActivity;
//# sourceMappingURL=Tasks.js.map