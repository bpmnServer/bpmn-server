"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BPMN_TYPE = exports.NodeLoader = void 0;
const Node_1 = require("./Node");
const Enums_1 = require("../interfaces/Enums");
Object.defineProperty(exports, "BPMN_TYPE", { enumerable: true, get: function () { return Enums_1.BPMN_TYPE; } });
const _1 = require(".");
class NodeLoader {
    static loadNode(el, process) {
        switch (el.$type) {
            case Enums_1.BPMN_TYPE.UserTask:
                return new _1.UserTask(el.id, process, el.$type, el);
                break;
            case Enums_1.BPMN_TYPE.ScriptTask:
                return new _1.ScriptTask(el.id, process, el.$type, el);
                break;
            case Enums_1.BPMN_TYPE.ServiceTask:
                return new _1.ServiceTask(el.id, process, el.$type, el);
                break;
            case Enums_1.BPMN_TYPE.BusinessRuleTask:
                return new _1.BusinessRuleTask(el.id, process, el.$type, el);
                break;
            case Enums_1.BPMN_TYPE.SendTask:
                return new _1.SendTask(el.id, process, el.$type, el);
                break;
            case Enums_1.BPMN_TYPE.ReceiveTask:
                return new _1.ReceiveTask(el.id, process, el.$type, el);
                break;
            case Enums_1.BPMN_TYPE.SubProcess:
                return new _1.SubProcess(el.id, process, el.$type, el);
                break;
            case Enums_1.BPMN_TYPE.ParallelGateway:
                return new _1.Gateway(el.id, process, el.$type, el);
                break;
            case Enums_1.BPMN_TYPE.EventBasedGateway:
                return new _1.EventBasedGateway(el.id, process, el.$type, el);
                break;
            case Enums_1.BPMN_TYPE.InclusiveGateway:
                return new _1.Gateway(el.id, process, el.$type, el);
                break;
            case Enums_1.BPMN_TYPE.ExclusiveGateway:
                return new _1.XORGateway(el.id, process, el.$type, el);
                break;
            case Enums_1.BPMN_TYPE.IntermediateCatchEvent:
                return new _1.CatchEvent(el.id, process, el.$type, el);
                break;
            case Enums_1.BPMN_TYPE.IntermediateThrowEvent:
                return new _1.ThrowEvent(el.id, process, el.$type, el);
                break;
            case Enums_1.BPMN_TYPE.BoundaryEvent:
                return new _1.BoundaryEvent(el.id, process, el.$type, el);
                break;
            case Enums_1.BPMN_TYPE.EndEvent:
                return new _1.EndEvent(el.id, process, el.$type, el);
                break;
            case Enums_1.BPMN_TYPE.StartEvent:
                return new _1.StartEvent(el.id, process, el.$type, el);
                break;
            case Enums_1.BPMN_TYPE.CallActivity:
                return new _1.CallActivity(el.id, process, el.$type, el);
                break;
            default:
                return new Node_1.Node(el.id, process, el.$type, el);
                break;
        }
    }
}
exports.NodeLoader = NodeLoader;
//# sourceMappingURL=NodeLoader.js.map