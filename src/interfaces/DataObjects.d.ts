import { ITEM_STATUS } from './Enums';
interface IItemData {
    id: string;
    itemKey: string;
    elementId: string;
    name: string;
    type: string;
    tokenId: any;
    userId: any;
    startedAt: any;
    endedAt: any;
    seq: any;
    timeDue: Date;
    status: ITEM_STATUS;
    data: any;
    messageId: any;
    signalId: any;
    assignments: any;
    authorizations: any;
    notifications: any;
}
interface IInstanceData {
    id: any;
    name: any;
    status: any;
    startedAt: any;
    endedAt: any;
    saved: any;
    data: any;
    items: any;
    source: any;
    logs: any;
    tokens: any;
    loops: any;
    parentItemId: any;
    involvements: any;
    authorizations: any;
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
    type: any;
    name: any;
    subType: any;
    signalId?: string;
    messageId?: string;
    expression: any;
    expressionFormat: any;
    referenceDateTime: any;
    maxRepeat: any;
    repeatCount: any;
    timeDue?: Date;
}
interface IBpmnModelData {
    name: any;
    source: any;
    svg: any;
    processes: IProcessData[];
    events: IEventData[];
    saved: any;
}
interface IProcessData {
    id: any;
    name: any;
    isExecutable: any;
}
export { IItemData, IInstanceData, IDefinitionData, IElementData, IFlowData, IBpmnModelData, IProcessData, IEventData };
