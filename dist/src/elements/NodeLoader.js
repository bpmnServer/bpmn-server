"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BPMN_TYPE = exports.NodeLoader = void 0;
const _1 = require(".");
var BPMN_TYPE;
(function (BPMN_TYPE) {
    BPMN_TYPE["UserTask"] = "bpmn:UserTask";
    BPMN_TYPE["ScriptTask"] = "bpmn:ScriptTask";
    BPMN_TYPE["ServiceTask"] = "bpmn:ServiceTask";
    BPMN_TYPE["SendTask"] = "bpmn:SendTask";
    BPMN_TYPE["ReceiveTask"] = "bpmn:ReceiveTask";
    BPMN_TYPE["SubProcess"] = "bpmn:SubProces";
    BPMN_TYPE["ParallelGateway"] = "bpmn:ParallelGateway";
    BPMN_TYPE["EventBasedGateway"] = "bpmn:EventBasedGateway";
    BPMN_TYPE["InclusiveGateway"] = "bpmn:InclusiveGateway";
    BPMN_TYPE["ExclusiveGateway"] = "bpmn:ExclusiveGateway";
    BPMN_TYPE["BoundaryEvent"] = "bpmn:BoundaryEvent";
    BPMN_TYPE["StartEvent"] = "bpmn:StartEvent";
    BPMN_TYPE["IntermediateCatchEvent"] = "bpmn:IntermediateCatchEvent";
    BPMN_TYPE["IntermediateThrowEvent"] = "bpmn:IntermediateThrowEvent";
    BPMN_TYPE["EndEvent"] = "bpmn:EndEvent";
    BPMN_TYPE["SequenceFlow"] = "bpmn:SequenceFlow";
    BPMN_TYPE["MessageFlow"] = "bpmn:MessageFlow";
    BPMN_TYPE["CallActivity"] = "bpmn:CallActivity";
})(BPMN_TYPE || (BPMN_TYPE = {}));
exports.BPMN_TYPE = BPMN_TYPE;
class NodeLoader {
    static loadNode(el, processId) {
        switch (el.$type) {
            case BPMN_TYPE.UserTask:
                return new _1.UserTask(el.id, processId, el.$type, el);
                break;
            case BPMN_TYPE.ScriptTask:
                return new _1.ScriptTask(el.id, processId, el.$type, el);
                break;
            case BPMN_TYPE.ServiceTask:
                return new _1.ServiceTask(el.id, processId, el.$type, el);
                break;
            case BPMN_TYPE.SendTask:
                return new _1.SendTask(el.id, processId, el.$type, el);
                break;
            case BPMN_TYPE.ReceiveTask:
                return new _1.ReceiveTask(el.id, processId, el.$type, el);
                break;
            case BPMN_TYPE.SubProcess:
                return new _1.SubProcess(el.id, processId, el.$type, el);
                break;
            case BPMN_TYPE.ParallelGateway:
                return new _1.Gateway(el.id, processId, el.$type, el);
                break;
            case BPMN_TYPE.EventBasedGateway:
                return new _1.EventBasedGateway(el.id, processId, el.$type, el);
                break;
            case BPMN_TYPE.InclusiveGateway:
                return new _1.Gateway(el.id, processId, el.$type, el);
                break;
            case BPMN_TYPE.ExclusiveGateway:
                return new _1.XORGateway(el.id, processId, el.$type, el);
                break;
            case BPMN_TYPE.IntermediateCatchEvent:
                return new _1.CatchEvent(el.id, processId, el.$type, el);
                break;
            case BPMN_TYPE.IntermediateThrowEvent:
                return new _1.ThrowEvent(el.id, processId, el.$type, el);
                break;
            case BPMN_TYPE.BoundaryEvent:
                return new _1.BoundaryEvent(el.id, processId, el.$type, el);
                break;
            case BPMN_TYPE.EndEvent:
                return new _1.EndEvent(el.id, processId, el.$type, el);
                break;
            case BPMN_TYPE.StartEvent:
                return new _1.StartEvent(el.id, processId, el.$type, el);
                break;
            case BPMN_TYPE.CallActivity:
                return new _1.CallActivity(el.id, processId, el.$type, el);
                break;
            default:
                return new _1.Node(el.id, processId, el.$type, el);
                break;
        }
    }
}
exports.NodeLoader = NodeLoader;
//# sourceMappingURL=NodeLoader.js.map