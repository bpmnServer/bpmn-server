import { ITEM_STATUS, } from './Enums';

interface IItemData {
    id: string;            // System generated unique Id
    itemKey: string;        // application assigned key to call the item by
    elementId: string;   // bpmn element
    name: string;       // name of bpmn element
    type: string;       // bpmn element type
    instanceId: string;   // Instance Id of the item
    processName?: string;
    tokenId: any;         // execution Token
    userName: any;
    startedAt: any;
    endedAt: any;
    seq: any;
    timeDue: Date;
    status: ITEM_STATUS;
//    data: any;
    messageId;
    signalId;
    vars;
    assignee;
    candidateGroups;
    candidateUsers;
    dueDate;
    followUpDate;
    priority;

}
interface IInstanceData {
    id;
    name;
    status;
    version;
    startedAt;
    endedAt;
    saved;
    data;
    items;
    source;
    logs;
    tokens;
    loops;
    parentItemId;   // used for subProcess Calls
}



interface IDefinitionData {
    name: any;
    processes: Map<any, any>;
    rootElements: any;
    nodes: Map<any, any>;
    flows: any[];
    source: any;
    logger: any;
    accessRules: any[];
}


interface IElementData {
    id: any;
    type: any;
    name: any;
    behaviours: Map<any, any>;
}

interface IFlowData {

}

interface IEventData {
    elementId: string;
    processId: string;
    type;
    name;
    subType;
    signalId?: string;
    messageId?: string;
    // timer info
    expression;
    expressionFormat; // cron/iso
    referenceDateTime; //        start time of event   or last time timer ran
    maxRepeat;
    repeatCount;
    timeDue?: Date;
    lane?: string;
    candidateGroups?;
    candidateUsers?;

}
interface IBpmnModelData {
    name;
    source;
    svg;
    processes: IProcessData[];
    events: IEventData[];
    saved;
    //    parse(definition: IDefinition);
}
interface IProcessData {
    id;
    name;
    isExecutable;
}
export { IItemData, IInstanceData , IDefinitionData, IElementData, IFlowData , IBpmnModelData, IProcessData, IEventData }