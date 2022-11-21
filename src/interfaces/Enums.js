"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NODE_SUBTYPE = exports.EXECUTION_STATUS = exports.TOKEN_STATUS = exports.ITEM_STATUS = exports.FLOW_ACTION = exports.NODE_ACTION = exports.EXECUTION_EVENT = exports.BPMN_TYPE = void 0;
var BPMN_TYPE;
(function (BPMN_TYPE) {
    BPMN_TYPE["UserTask"] = "bpmn:UserTask";
    BPMN_TYPE["ScriptTask"] = "bpmn:ScriptTask";
    BPMN_TYPE["ServiceTask"] = "bpmn:ServiceTask";
    BPMN_TYPE["SendTask"] = "bpmn:SendTask";
    BPMN_TYPE["ReceiveTask"] = "bpmn:ReceiveTask";
    BPMN_TYPE["BusinessRuleTask"] = "bpmn:BusinessRuleTask";
    BPMN_TYPE["SubProcess"] = "bpmn:SubProcess";
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
var NODE_SUBTYPE;
(function (NODE_SUBTYPE) {
    NODE_SUBTYPE["timer"] = "timer";
    NODE_SUBTYPE["message"] = "message";
    NODE_SUBTYPE["signal"] = "signal";
    NODE_SUBTYPE["error"] = "error";
    NODE_SUBTYPE["escalation"] = "escalation";
    NODE_SUBTYPE["cancel"] = "cancel";
    NODE_SUBTYPE["compensate"] = "compensate";
})(NODE_SUBTYPE || (NODE_SUBTYPE = {}));
exports.NODE_SUBTYPE = NODE_SUBTYPE;
/*
 * ALL events
 */
var EXECUTION_EVENT;
(function (EXECUTION_EVENT) {
    EXECUTION_EVENT["node_enter"] = "enter";
    EXECUTION_EVENT["node_start"] = "start";
    EXECUTION_EVENT["node_wait"] = "wait";
    EXECUTION_EVENT["node_end"] = "end";
    EXECUTION_EVENT["node_terminated"] = "terminated";
    EXECUTION_EVENT["transform_input"] = "transformInput";
    EXECUTION_EVENT["transform_output"] = "transformOutput";
    EXECUTION_EVENT["flow_take"] = "take";
    EXECUTION_EVENT["flow_discard"] = "discard";
    EXECUTION_EVENT["process_loaded"] = "process.loaded";
    EXECUTION_EVENT["process_start"] = "process.start";
    EXECUTION_EVENT["process_started"] = "process.started";
    EXECUTION_EVENT["process_invoke"] = "process.invoke";
    EXECUTION_EVENT["process_invoked"] = "process.invoked";
    EXECUTION_EVENT["process_restored"] = "process.restored";
    EXECUTION_EVENT["process_resumed"] = "process_resumed";
    EXECUTION_EVENT["process_wait"] = "process.wait";
    EXECUTION_EVENT["process_end"] = "process.end";
    EXECUTION_EVENT["process_terminated"] = "process.terminated";
    EXECUTION_EVENT["token_start"] = "token.start";
    EXECUTION_EVENT["token_wait"] = "token.wait";
    EXECUTION_EVENT["token_end"] = "token.end";
    EXECUTION_EVENT["token_terminated"] = "token.terminated";
})(EXECUTION_EVENT || (EXECUTION_EVENT = {}));
exports.EXECUTION_EVENT = EXECUTION_EVENT;
/*
 *  possible actions by node
 */
//   must be same as above
var NODE_ACTION;
(function (NODE_ACTION) {
    NODE_ACTION[NODE_ACTION["continue"] = 1] = "continue";
    NODE_ACTION[NODE_ACTION["wait"] = 2] = "wait";
    NODE_ACTION[NODE_ACTION["end"] = 3] = "end";
    NODE_ACTION[NODE_ACTION["stop"] = 4] = "stop";
    NODE_ACTION[NODE_ACTION["error"] = 5] = "error";
    NODE_ACTION[NODE_ACTION["abort"] = 6] = "abort";
})(NODE_ACTION || (NODE_ACTION = {}));
exports.NODE_ACTION = NODE_ACTION;
;
var ITEM_STATUS;
(function (ITEM_STATUS) {
    ITEM_STATUS["enter"] = "enter";
    ITEM_STATUS["start"] = "start";
    ITEM_STATUS["wait"] = "wait";
    ITEM_STATUS["end"] = "end";
    ITEM_STATUS["terminated"] = "terminated";
    ITEM_STATUS["cancelled"] = "cancelled";
    ITEM_STATUS["discard"] = "discard";
})(ITEM_STATUS || (ITEM_STATUS = {}));
exports.ITEM_STATUS = ITEM_STATUS;
//type ITEMSTATUS = 'enter' | 'start' | 'wait' | 'end' | 'terminated' | 'discard';
var EXECUTION_STATUS;
(function (EXECUTION_STATUS) {
    EXECUTION_STATUS["running"] = "running";
    EXECUTION_STATUS["wait"] = "wait";
    EXECUTION_STATUS["end"] = "end";
    EXECUTION_STATUS["terminated"] = "terminated";
})(EXECUTION_STATUS || (EXECUTION_STATUS = {}));
exports.EXECUTION_STATUS = EXECUTION_STATUS;
var TOKEN_STATUS;
(function (TOKEN_STATUS) {
    TOKEN_STATUS["running"] = "running";
    TOKEN_STATUS["wait"] = "wait";
    TOKEN_STATUS["end"] = "end";
    TOKEN_STATUS["terminated"] = "terminated";
})(TOKEN_STATUS || (TOKEN_STATUS = {}));
exports.TOKEN_STATUS = TOKEN_STATUS;
/*
 * possible actions by flow
 */
//   must be same as above
var FLOW_ACTION;
(function (FLOW_ACTION) {
    FLOW_ACTION["take"] = "take";
    FLOW_ACTION["discard"] = "discard";
})(FLOW_ACTION || (FLOW_ACTION = {}));
exports.FLOW_ACTION = FLOW_ACTION;
//# sourceMappingURL=Enums.js.map