import { ITEM_STATUS, EXECUTION_STATUS, BPMN_TYPE } from './Enums';

/** MongoDB-style query operator for field-level conditions */
type QueryOperator<T> = T | {
    $eq?: T;
    $gt?: T;
    $gte?: T;
    $lt?: T;
    $lte?: T;
    $in?: T[];
    $exists?: boolean;
};

/**
 * Query for locating process instances.
 * Supports direct instance fields, dot-notation item fields, and data fields.
 */
interface InstanceQuery {
    id?: QueryOperator<string>;
    name?: QueryOperator<string>;
    status?: QueryOperator<EXECUTION_STATUS>;
    startedAt?: QueryOperator<Date>;
    endedAt?: QueryOperator<Date>;
    version?: QueryOperator<number>;
    parentItemId?: QueryOperator<string>;
    /** Dot-notation item fields (e.g., 'items.status', 'items.elementId') */
    'items.id'?: QueryOperator<string>;
    'items.status'?: QueryOperator<ITEM_STATUS>;
    'items.elementId'?: QueryOperator<string>;
    'items.itemKey'?: QueryOperator<string>;
    'items.type'?: QueryOperator<string | BPMN_TYPE>;
    'items.assignee'?: QueryOperator<string | null>;
    'items.candidateUsers'?: QueryOperator<string | null>;
    'items.candidateGroups'?: QueryOperator<string | null>;
    'items.messageId'?: QueryOperator<string>;
    'items.signalId'?: QueryOperator<string>;
    'items.timeDue'?: QueryOperator<Date> | { $exists: boolean };
    'items.name'?: QueryOperator<string>;
    /** $or for complex queries (e.g., security qualification) */
    $or?: InstanceQuery[];
    /** Open for data.* fields and other custom filters */
    [key: string]: any;
}

/**
 * Query for locating specific items within instances.
 * Same shape as InstanceQuery since items are queried via instance-level MongoDB queries.
 */
type ItemQuery = InstanceQuery;

/** Input data passed to engine operations (start, invoke, signal, etc.) */
type InputData = Record<string, any>;

/** Assignment data for user task assignment (assignee, candidateUsers, candidateGroups, etc.) */
type AssignmentData = Record<string, any>;

/** Matching query for throwMessage / throwSignal */
type MatchingQuery = Record<string, any>;

/** Options for findInstances projection */
type FindOption = 'summary' | 'full';

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
    statusDetails?:object;
    data?: any;
    messageId;
    signalId;
    vars;
    output;
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
    svg?;
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
    candidateStarterGroups;
    candidateStarterUsers;
    historyTimeToLive;
    isStartableInTasklist;
}
export { IItemData, IInstanceData , IDefinitionData, IElementData, IFlowData , IBpmnModelData, IProcessData, IEventData,
    InstanceQuery, ItemQuery, InputData, AssignmentData, MatchingQuery, FindOption, QueryOperator }