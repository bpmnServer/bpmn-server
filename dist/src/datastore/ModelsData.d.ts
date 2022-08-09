import { Definition } from "../..";
import { IProcessData, IBpmnModelData, IEventData } from "../interfaces/";
declare class BpmnModelData implements IBpmnModelData {
    name: any;
    source: any;
    svg: any;
    processes: IProcessData[];
    events: IEventData[];
    saved: any;
    constructor(name: any, source: any, svg: any, processes: any, events: any);
    parse(definition: Definition): void;
}
declare class ProcessData implements IProcessData {
    id: any;
    name: any;
    isExecutable: any;
}
declare class EventData implements IEventData {
    elementId: any;
    type: any;
    subType: any;
    name: any;
    processId: any;
    signalId: any;
    messageId: any;
    expression: any;
    expressionFormat: any;
    referenceDateTime: any;
    maxRepeat: any;
    repeatCount: any;
    timeDue: any;
}
export { ProcessData, EventData, BpmnModelData };
