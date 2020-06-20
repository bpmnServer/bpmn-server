import { Node , UserTask, ScriptTask, ServiceTask, SendTask, ReceiveTask , 
    Gateway, EventBasedGateway, XORGateway , 
    Event, CatchEvent, ThrowEvent, EndEvent , SubProcess, BoundaryEvent
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
}

class NodeLoader {

    static loadNode(el, processId): Node {

        switch (el.$type) {
            case 'bpmn:UserTask':
                return new UserTask(el.id, processId, el.$type, el);
                break;
            case 'bpmn:ScriptTask':
                return new ScriptTask(el.id, processId, el.$type, el);
                break;
            case 'bpmn:ServiceTask':
                return new ServiceTask(el.id, processId, el.$type, el);
                break;
            case 'bpmn:SendTask':
                return new SendTask(el.id, processId, el.$type, el);
                break;
            case 'bpmn:ReceiveTask':
                return new ReceiveTask(el.id, processId, el.$type, el);
                break;
            case 'bpmn:SubProcess':
                return new SubProcess(el.id, processId, el.$type, el);
                break;
            case 'bpmn:ParallelGateway':
                return new Gateway(el.id, processId, el.$type, el);
                break;
            case 'bpmn:EventBasedGateway':
                return new EventBasedGateway(el.id, processId, el.$type, el);
                break;
            case 'bpmn:InclusiveGateway':
                return new Gateway(el.id, processId, el.$type, el);
                break;
            case 'bpmn:ExclusiveGateway':
                return new XORGateway(el.id, processId, el.$type, el);
                break;
            case 'bpmn:IntermediateCatchEvent':
                return new CatchEvent(el.id, processId, el.$type, el);
                break;
            case 'bpmn:IntermediateThrowEvent':
                return new ThrowEvent(el.id, processId, el.$type, el);
                break;
            case 'bpmn:BoundaryEvent':
                return new BoundaryEvent(el.id, processId, el.$type, el);
                break;
            case 'bpmn:EndEvent':
                return new EndEvent(el.id, processId, el.$type, el);
                break;
            case 'bpmn:StartEvent':
                return new Event(el.id, processId, el.$type, el);
                break;
            default:
                return new Node(el.id, processId, el.$type, el);
                break;
        }
    }

}

export {NodeLoader , BPMN_TYPE}