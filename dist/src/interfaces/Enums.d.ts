declare enum BPMN_TYPE {
    UserTask = "bpmn:UserTask",
    ScriptTask = "bpmn:ScriptTask",
    ServiceTask = "bpmn:ServiceTask",
    SendTask = "bpmn:SendTask",
    ReceiveTask = "bpmn:ReceiveTask",
    BusinessRuleTask = "bpmn:BusinessRuleTask",
    SubProcess = "bpmn:SubProces",
    ParallelGateway = "bpmn:ParallelGateway",
    EventBasedGateway = "bpmn:EventBasedGateway",
    InclusiveGateway = "bpmn:InclusiveGateway",
    ExclusiveGateway = "bpmn:ExclusiveGateway",
    BoundaryEvent = "bpmn:BoundaryEvent",
    StartEvent = "bpmn:StartEvent",
    IntermediateCatchEvent = "bpmn:IntermediateCatchEvent",
    IntermediateThrowEvent = "bpmn:IntermediateThrowEvent",
    EndEvent = "bpmn:EndEvent",
    SequenceFlow = "bpmn:SequenceFlow",
    MessageFlow = "bpmn:MessageFlow",
    CallActivity = "bpmn:CallActivity"
}
declare enum NODE_SUBTYPE {
    timer = "timer",
    message = "message",
    signal = "signal",
    error = "error",
    escalation = "escalation"
}
declare enum EXECUTION_EVENT {
    node_enter = "enter",
    node_start = "start",
    node_wait = "wait",
    node_end = "end",
    node_terminated = "terminated",
    transform_input = "transformInput",
    transform_output = "transformOutput",
    flow_take = "take",
    flow_discard = "discard",
    execution_execute = "execution.execute",
    execution_executed = "execution.executed",
    execution_invoke = "execution.invoke",
    execution_invoked = "execution.invoked",
    execution_restored = "execution.restored",
    execution_resumed = "execution_resumed",
    execution_wait = "execution.wait",
    execution_end = "execution.end",
    execution_terminated = "executeion.terminate",
    token_start = "token.start",
    token_wait = "token.wait",
    token_end = "token.end",
    token_terminated = "token.terminated"
}
declare enum NODE_ACTION {
    continue = 1,
    wait = 2,
    end = 3,
    stop = 4,
    error = 5,
    abort = 6
}
declare enum ITEM_STATUS {
    enter = "enter",
    start = "start",
    wait = "wait",
    end = "end",
    terminated = "terminated",
    discard = "discard"
}
declare enum EXECUTION_STATUS {
    running = "running",
    wait = "wait",
    end = "end",
    terminated = "terminated"
}
declare enum TOKEN_STATUS {
    running = "running",
    wait = "wait",
    end = "end",
    terminated = "terminated"
}
declare enum FLOW_ACTION {
    take = "take",
    discard = "discard"
}
export { BPMN_TYPE, EXECUTION_EVENT, NODE_ACTION, FLOW_ACTION, ITEM_STATUS, TOKEN_STATUS, EXECUTION_STATUS, NODE_SUBTYPE };
