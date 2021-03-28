import { Node } from './Node';
import { BPMN_TYPE } from '../interfaces/Enums';

import {
    UserTask, ScriptTask, ServiceTask, SendTask, ReceiveTask, BusinessRuleTask,
    Gateway, EventBasedGateway, XORGateway , 
    Event, CatchEvent, ThrowEvent, EndEvent , SubProcess, BoundaryEvent, CallActivity, StartEvent
} from '.';


class NodeLoader {

    static loadNode(el, process): Node {

        switch (el.$type) {
            case BPMN_TYPE.UserTask:
                return new UserTask(el.id, process, el.$type, el);
                break;
            case BPMN_TYPE.ScriptTask:
                return new ScriptTask(el.id, process, el.$type, el);
                break;
            case BPMN_TYPE.ServiceTask:
                return new ServiceTask(el.id, process, el.$type, el);
                break;
            case BPMN_TYPE.BusinessRuleTask:
                return new BusinessRuleTask(el.id, process, el.$type, el);
                break;
            case BPMN_TYPE.SendTask:
                return new SendTask(el.id, process, el.$type, el);
                break;
            case BPMN_TYPE.ReceiveTask:
                return new ReceiveTask(el.id, process, el.$type, el);
                break;
            case BPMN_TYPE.SubProcess:
                return new SubProcess(el.id, process, el.$type, el);
                break;
            case BPMN_TYPE.ParallelGateway:
                return new Gateway(el.id, process, el.$type, el);
                break;
            case BPMN_TYPE.EventBasedGateway:
                return new EventBasedGateway(el.id, process, el.$type, el);
                break;
            case BPMN_TYPE.InclusiveGateway:
                return new Gateway(el.id, process, el.$type, el);
                break;
            case BPMN_TYPE.ExclusiveGateway:
                return new XORGateway(el.id, process, el.$type, el);
                break;
            case BPMN_TYPE.IntermediateCatchEvent:
                return new CatchEvent(el.id, process, el.$type, el);
                break;
            case BPMN_TYPE.IntermediateThrowEvent:
                return new ThrowEvent(el.id, process, el.$type, el);
                break;
            case BPMN_TYPE.BoundaryEvent:
                return new BoundaryEvent(el.id, process, el.$type, el);
                break;
            case BPMN_TYPE.EndEvent:
                return new EndEvent(el.id, process, el.$type, el);
                break;
            case BPMN_TYPE.StartEvent:
                return new StartEvent(el.id, process, el.$type, el);
                break;
            case BPMN_TYPE.CallActivity:
                return new CallActivity(el.id, process, el.$type, el);
                break;
            default:
                return new Node(el.id, process, el.$type, el);
                break;
        }
    }

}

export {NodeLoader , BPMN_TYPE}