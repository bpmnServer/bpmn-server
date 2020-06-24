import { Node , UserTask, ScriptTask, ServiceTask, SendTask, ReceiveTask , 
    Gateway, EventBasedGateway, XORGateway , 
    Event, CatchEvent, ThrowEvent, EndEvent , SubProcess, BoundaryEvent, CallActivity
} from '.';


enum BPMN_TYPE  {
    UserTask        = 'bpmn:UserTask',
    ScriptTask      = 'bpmn:ScriptTask',
    ServiceTask     = 'bpmn:ServiceTask',
    SendTask        = 'bpmn:SendTask',
    ReceiveTask     = 'bpmn:ReceiveTask',
    SubProcess      = 'bpmn:SubProces',
    ParallelGateway = 'bpmn:ParallelGateway',
    EventBasedGateway = 'bpmn:EventBasedGateway',
    InclusiveGateway = 'bpmn:InclusiveGateway',
    ExclusiveGateway = 'bpmn:ExclusiveGateway',
    BoundaryEvent   = 'bpmn:BoundaryEvent',
    StartEvent      = 'bpmn:StartEvent',
    IntermediateCatchEvent = 'bpmn:IntermediateCatchEvent',
    IntermediateThrowEvent = 'bpmn:IntermediateThrowEvent',
    EndEvent        = 'bpmn:EndEvent',
    SequenceFlow    = 'bpmn:SequenceFlow',
    MessageFlow = 'bpmn:MessageFlow',
    CallActivity = 'bpmn:CallActivity'
}

class NodeLoader {

    static loadNode(el, processId): Node {

        switch (el.$type) {
            case BPMN_TYPE.UserTask:
                return new UserTask(el.id, processId, el.$type, el);
                break;
            case BPMN_TYPE.ScriptTask:
                return new ScriptTask(el.id, processId, el.$type, el);
                break;
            case BPMN_TYPE.ServiceTask:
                return new ServiceTask(el.id, processId, el.$type, el);
                break;
            case BPMN_TYPE.SendTask:
                return new SendTask(el.id, processId, el.$type, el);
                break;
            case BPMN_TYPE.ReceiveTask:
                return new ReceiveTask(el.id, processId, el.$type, el);
                break;
            case BPMN_TYPE.SubProcess:
                return new SubProcess(el.id, processId, el.$type, el);
                break;
            case BPMN_TYPE.ParallelGateway:
                return new Gateway(el.id, processId, el.$type, el);
                break;
            case BPMN_TYPE.EventBasedGateway:
                return new EventBasedGateway(el.id, processId, el.$type, el);
                break;
            case BPMN_TYPE.InclusiveGateway:
                return new Gateway(el.id, processId, el.$type, el);
                break;
            case BPMN_TYPE.ExclusiveGateway:
                return new XORGateway(el.id, processId, el.$type, el);
                break;
            case BPMN_TYPE.IntermediateCatchEvent:
                return new CatchEvent(el.id, processId, el.$type, el);
                break;
            case BPMN_TYPE.IntermediateThrowEvent:
                return new ThrowEvent(el.id, processId, el.$type, el);
                break;
            case BPMN_TYPE.BoundaryEvent:
                return new BoundaryEvent(el.id, processId, el.$type, el);
                break;
            case BPMN_TYPE.EndEvent:
                return new EndEvent(el.id, processId, el.$type, el);
                break;
            case BPMN_TYPE.StartEvent:
                return new Event(el.id, processId, el.$type, el);
                break;
            case BPMN_TYPE.CallActivity:
                return new CallActivity(el.id, processId, el.$type, el);
                break;
            default:
                return new Node(el.id, processId, el.$type, el);
                break;
        }
    }

}

export {NodeLoader , BPMN_TYPE}