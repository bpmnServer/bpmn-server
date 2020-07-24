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
exports.DefaultAppDelegate = void 0;
const js_bpmn_moddle_1 = require("../elements/js-bpmn-moddle");
var seq = 1;
class DefaultAppDelegate {
    constructor(logger = null) {
        this.servicesProvider = this;
    }
    get moddleOptions() {
        return js_bpmn_moddle_1.moddleOptions;
    }
    executionStarted(execution) {
        return __awaiter(this, void 0, void 0, function* () {
            let self = this;
            execution.listener.on('all', function (eventApi) {
                return __awaiter(this, void 0, void 0, function* () {
                    yield self.executionEvent(eventApi);
                });
            });
        });
    }
    executionEvent({ event, item, execution }) {
        return __awaiter(this, void 0, void 0, function* () {
            let object;
            if (event.startsWith('execution.'))
                object = execution;
            else
                object = item;
        });
    }
    /**
     *  is called when a event throws a message
     *
     * @param messageId
     * @param data
     * @param messageMatchingKey
     * @param item
     */
    messageThrown(messageId, data, messageMatchingKey, item) {
        return __awaiter(this, void 0, void 0, function* () {
            const msgId = item.node.messageId;
            item.context.logger.log("Message Issued" + msgId);
            // issue it back for others to receive
            console.log(item.context.engine);
            const resp = yield item.context.engine.throwMessage(msgId, data, messageMatchingKey);
            if (resp && resp.instance) {
                item.context.logger.log(" invoked another process " + resp.instance.id + " for " + resp.instance.name);
            }
            else
                yield this.issueMessage(messageId, data);
        });
    }
    /**
     *
     * is called when an event throws a message that can not be answered by another process
     *
     * @param messageId
     * @param data
     */
    issueMessage(messageId, data) {
        return __awaiter(this, void 0, void 0, function* () {
        });
    }
    issueSignal(signalId, data) {
        return __awaiter(this, void 0, void 0, function* () {
        });
    }
    signalThrown(signalId, data, messageMatchingKey, item) {
        return __awaiter(this, void 0, void 0, function* () {
            const msgId = item.node.messageId;
            item.context.logger.log("Signal Issued" + signalId);
            // issue it back for others to receive
            console.log(item.context.engine);
            const resp = yield item.context.engine.throwSignal(msgId, data, messageMatchingKey);
            if (resp && resp.instance) {
                item.context.logger.log(" invoked another process " + resp.instance.id + " for " + resp.instance.name);
            }
            else
                yield this.issueSignal(signalId, data);
        });
    }
    serviceCalled(serviceName, data, item) {
        return __awaiter(this, void 0, void 0, function* () {
        });
    }
    scopeEval(scope, script) {
        let result;
        try {
            result = Function('"use strict";return (' + script + ')').bind(scope)();
        }
        catch (exc) {
            console.log(exc);
        }
        return result;
    }
    scopeJS(scope, script) {
        return __awaiter(this, void 0, void 0, function* () {
            const AsyncFunction = Object.getPrototypeOf(function () {
                return __awaiter(this, void 0, void 0, function* () { });
            }).constructor;
            let result;
            try {
                scope.token.log("..executing js " + scope.id);
                result = yield new AsyncFunction('"use strict";' + script).bind(scope)();
                scope.token.log("..executing js is done " + scope.id);
            }
            catch (exc) {
                console.log(exc);
            }
            return result;
        });
    }
}
exports.DefaultAppDelegate = DefaultAppDelegate;
function delay(time, result) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("delaying ... " + time);
        return new Promise(function (resolve) {
            setTimeout(function () {
                console.log("delayed is done.");
                resolve(result);
            }, time);
        });
    });
}
//# sourceMappingURL=DefaultAppDelegate.js.map