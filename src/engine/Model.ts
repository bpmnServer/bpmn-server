import { IItemData, IInstanceData} from  '../../'
import { ITEM_STATUS , EXECUTION_STATUS } from '../../';
import { BPMN_TYPE } from '../elements';

/**
 * as stored in MongoDB
 * */
class InstanceObject implements IInstanceData {
    id;
    name;
    status : EXECUTION_STATUS;
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
    involvements=[];
    authorizations=[];

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
    userId;
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
    messageId;
    signalId;
    assignments;
    authorizations;
    notifications;

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

class DataQuery {
    instance;
    item;

    constructor(instance,item) {

    }
}
function test() {
//    new DataQuery(new InstanceQuery())
}
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

class InstanceQuery 
{
    _id;
    _name;
    _status: EXECUTION_STATUS;
    _startedAt;
    _endedAt;
    _saved;
    _data;
    items : ItemQuery = new ItemQuery();
    _source;
    _parentNodeId;

    constructor({ id = null,
        name = null,
        status = null,
        startedAt = null,
        endedAt = null,
        saved = null,
        data = null,
        items = new ItemQuery()
    }: { id?, name?, status?: EXECUTION_STATUS , startedAt?, endedAt?, saved?,data?,items?: ItemQuery} = {})
    {
        this._id = id;
        this._name = name;
        this._status = status;
    }
    id(val):InstanceQuery { this._id = val; return this;}
    name(val): InstanceQuery { this._name = val; return this; }
}
class ItemQuery {
    _id;
    _seq;
    _itemKey;
    _name;
    _type: BPMN_TYPE;
    _status: ITEM_STATUS;
    _startedAt;
    _endedAt;
    _tokenId;
    _elementId;
    constructor({ id = null,
        name = null,
        seq = null,
        status = null,
        itemKey = null,
        type = null,
        startedAt = null,
        endedAt = null,
        tokenId = null,
        elementId = null,

    }: { id?, name?, seq?, status?: ITEM_STATUS, itemKey?, type?: BPMN_TYPE, startedAt?, endedAt?, tokenId?, elementId?} = {}) {
        this._id = id;
        this._seq = seq;
        this._itemKey = itemKey;
        this._name = name;
        this._type = type;
        this._status = status;
        this._startedAt = startedAt;
        this._endedAt = endedAt;
        this._tokenId = tokenId;
        this._elementId = elementId;

    }
    id(val) { this._id = val; return this;}
    name(val) { this._name = val; return this;}
    status(val) { this._status = val; return this;}

}



export {Query, InstanceObject , ItemObject, TokenObject , LoopObject}