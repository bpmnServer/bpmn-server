import { IItemData, IInstanceData } from '../../';
import { ITEM_STATUS, EXECUTION_STATUS } from '../../';
import { BPMN_TYPE } from '../elements';
/**
 * as stored in MongoDB
 * */
declare class InstanceObject implements IInstanceData {
    id: any;
    name: any;
    status: EXECUTION_STATUS;
    startedAt: any;
    endedAt: any;
    saved: any;
    data: any;
    items: any[];
    source: any;
    logs: any[];
    tokens: any[];
    loops: any[];
    parentItemId: any;
    involvements: any[];
    authorizations: any[];
}
/**
 *  as stroed in MongoDB
 * */
declare class ItemObject implements IItemData {
    id: any;
    seq: any;
    itemKey: any;
    name: any;
    type: BPMN_TYPE;
    status: ITEM_STATUS;
    userId: any;
    startedAt: any;
    endedAt: any;
    tokenId: any;
    elementId: any;
    /**
    *  retrieved from findObjects
    * */
    instanceId: any;
    processName: any;
    timeDue: Date;
    data: any;
    messageId: any;
    signalId: any;
    assignments: any;
    authorizations: any;
    notifications: any;
}
declare class TokenObject {
    id: any;
    status: any;
    dataPath: any;
    loopId: any;
    parentTokenId: any;
    branchNodeId: any;
    startNodeId: any;
    currentNodeId: any;
}
declare class LoopObject {
    nodeId: any;
    ownerTokenId: any;
    dataPath: any;
    sequence: any;
}
declare class Query {
    private _instanceId;
    private _instanceName;
    private _instanceStatus;
    private _instanceStartedAt;
    private _instanceEndedAt;
    private _instanceSaved;
    private _instanceData;
    private _instanceSource;
    private _instanceParentNodeId;
    private _data;
    private _itemId;
    private _itemSeq;
    private _itemKey;
    private _itemName;
    private _itemType;
    private _itemStatus;
    private _itemStartedAt;
    private _itemEndedAt;
    private _itemTokenId;
    private _itemElementId;
    constructor({ instanceId, instanceName, instanceStatus, instanceStartedAt, instanceEndedAt, instanceSaved, data, itemId, itemSeq, itemKey, itemName, itemType, itemStatus, itemStartedAt, itemEndedAt, itemTokenId, itemElementId }?: {
        instanceId?: any;
        instanceName?: any;
        instanceStatus?: EXECUTION_STATUS;
        instanceStartedAt?: any;
        instanceEndedAt?: any;
        instanceSaved?: any;
        data?: any;
        itemId?: any;
        itemSeq?: any;
        itemKey?: any;
        itemName?: any;
        itemType?: BPMN_TYPE;
        itemStatus?: ITEM_STATUS;
        itemStartedAt?: any;
        itemEndedAt?: any;
        itemTokenId?: any;
        itemElementId?: any;
    });
    instanceId(val: any): Query;
    instanceName(val: any): Query;
    instanceStatus(val: EXECUTION_STATUS): Query;
    data(val: any): this;
    itemId(val: any): Query;
    itemName(val: any): Query;
    itemStatus(val: ITEM_STATUS): Query;
    itemElementId(val: any): Query;
}
export { Query, InstanceObject, ItemObject, TokenObject, LoopObject };
