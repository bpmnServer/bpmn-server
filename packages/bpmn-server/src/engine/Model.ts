import type { IItemData, IInstanceData } from '../interfaces/DataObjects.js';import { ITEM_STATUS, EXECUTION_STATUS } from '../interfaces/Enums.js';
import { BPMN_TYPE } from '../elements/NodeLoader.js';

/**
 * as stored in MongoDB
 * */
class InstanceObject implements IInstanceData {
    id;
    tenantId?: string;
    name;
    status : EXECUTION_STATUS;
    version=null;
    startedAt;
    endedAt;
    saved;
    data;
    items=[];
    source;
    logs=[];
    tokens=[];
    loops=[];
    parentItemId;
    svg?: any;
    vars;
    flags?;

}
/**
 *  as stroed in MongoDB
 * */
class ItemObject implements IItemData {
    id;
    seq;
    itemKey;
    name;
    type : BPMN_TYPE;
    status: ITEM_STATUS;
    userName;
    startedAt;
    endedAt;
    //   derived
    tokenId;
    elementId;
    /**
    *  retrieved from findObjects
    * */
    instanceId;
    processName;
    timeDue: Date;
    data;
    vars;
    output;
    messageId;
    signalId;
    assignee;
    candidateGroups;
    candidateUsers;
    dueDate;
    followUpDate;
    priority;

}
class TokenObject {
    id;
    status;
    dataPath;
    loopId;
    parentTokenId;
    branchNodeId;
    startNodeId;
    currentNodeId;
}

class LoopObject {
    nodeId;
    ownerTokenId;
    dataPath;
    sequence;
}

// Query Objects

class Query {
    private _instanceId;
    private _instanceName;
    private _instanceStatus: EXECUTION_STATUS;
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
    private _itemType: BPMN_TYPE;
    private _itemStatus: ITEM_STATUS;
    private _itemStartedAt;
    private _itemEndedAt;
    private _itemTokenId;
    private _itemElementId;

    constructor({ instanceId = null,
        instanceName = null,
        instanceStatus = null,
        instanceStartedAt = null,
        instanceEndedAt = null,
        instanceSaved = null,
        data = null,
        itemId=null,
        itemSeq=null,
        itemKey=null,
        itemName=null,
        itemType= null,
        itemStatus=null,
        itemStartedAt=null,
        itemEndedAt=null,
        itemTokenId=null,
        itemElementId=null

    }: {
        instanceId?, instanceName?, instanceStatus?: EXECUTION_STATUS, instanceStartedAt?, instanceEndedAt?, instanceSaved?, data?
         itemId?,itemSeq?,itemKey?,itemName?, itemType?: BPMN_TYPE, itemStatus?: ITEM_STATUS,itemStartedAt?,itemEndedAt?,
        itemTokenId?, itemElementId?
    } = {}) {

        this._instanceId = instanceId;
        this._instanceName = instanceName;
        this._instanceStatus = instanceStatus;
        this._instanceStartedAt = instanceStartedAt;
        this._instanceEndedAt = instanceEndedAt;
        this._instanceSaved = instanceSaved;
        this._data = data;
        this._itemId = itemId;
        this._itemSeq = itemSeq;
        this._itemKey = itemKey;
        this._itemName = itemName;
        this._itemType = itemType;
        this._itemStatus = itemStatus;
        this._itemStartedAt =itemStartedAt ;
        this._itemEndedAt = itemEndedAt;
        this._itemTokenId = itemTokenId;
        this._itemElementId = itemElementId;
    }
    instanceId(val): Query { this._instanceId = val; return this; }
    instanceName(val): Query { this._instanceName = val; return this; }
    instanceStatus(val: EXECUTION_STATUS): Query { this._instanceStatus = val; return this; }
    data(val) { this._data = val; return this;}
    itemId(val): Query { this._itemId = val; return this; }
    itemName(val): Query { this._itemName = val; return this; }
    itemStatus(val:ITEM_STATUS): Query { this._itemStatus = val; return this; }
    itemElementId(val): Query { this._itemElementId = val; return this; }
}


export {Query, InstanceObject , ItemObject, TokenObject , LoopObject}
