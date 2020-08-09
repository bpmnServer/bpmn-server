"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NODE_SUBTYPE = exports.EXECUTION_STATUS = exports.TOKEN_STATUS = exports.ITEM_STATUS = exports.FLOW_ACTION = exports.NODE_ACTION = exports.EXECUTION_EVENT = void 0;
var NODE_SUBTYPE;
(function (NODE_SUBTYPE) {
    NODE_SUBTYPE["timer"] = "timer";
    NODE_SUBTYPE["message"] = "message";
    NODE_SUBTYPE["signal"] = "signal";
    NODE_SUBTYPE["error"] = "error";
    NODE_SUBTYPE["escalation"] = "escalation";
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
    EXECUTION_EVENT["execution_execute"] = "execution.execute";
    EXECUTION_EVENT["execution_executed"] = "execution.executed";
    EXECUTION_EVENT["execution_invoke"] = "execution.invoke";
    EXECUTION_EVENT["execution_invoked"] = "execution.invoked";
    EXECUTION_EVENT["execution_restored"] = "execution.restored";
    EXECUTION_EVENT["execution_resumed"] = "execution_resumed";
    EXECUTION_EVENT["execution_wait"] = "execution.wait";
    EXECUTION_EVENT["execution_end"] = "execution.end";
    EXECUTION_EVENT["execution_terminated"] = "executeion.terminate";
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
    NODE_ACTION["continue"] = "continue";
    NODE_ACTION["end"] = "end";
    NODE_ACTION["stop"] = "stop";
    NODE_ACTION["error"] = "error";
    NODE_ACTION["abort"] = "abort";
    NODE_ACTION["wait"] = "wait";
})(NODE_ACTION || (NODE_ACTION = {}));
exports.NODE_ACTION = NODE_ACTION;
var ITEM_STATUS;
(function (ITEM_STATUS) {
    ITEM_STATUS["enter"] = "enter";
    ITEM_STATUS["start"] = "start";
    ITEM_STATUS["wait"] = "wait";
    ITEM_STATUS["end"] = "end";
    ITEM_STATUS["terminated"] = "terminated";
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