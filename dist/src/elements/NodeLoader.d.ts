import { Node } from '.';
declare enum BPMN_TYPE {
    UserTask = "bpmn:UserTask",
    ScriptTask = "bpmn:ScriptTask",
    ServiceTask = "bpmn:ServiceTask",
    SendTask = "bpmn:SendTask",
    ReceiveTask = "bpmn:ReceiveTask",
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
declare class NodeLoader {
    static loadNode(el: any, processId: any): Node;
}
export { NodeLoader, BPMN_TYPE };
