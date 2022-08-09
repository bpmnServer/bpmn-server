"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoopObject = exports.TokenObject = exports.ItemObject = exports.InstanceObject = exports.Query = void 0;
/**
 * as stored in MongoDB
 * */
class InstanceObject {
    constructor() {
        this.items = [];
        this.logs = [];
        this.tokens = [];
        this.loops = [];
        this.involvements = [];
        this.authorizations = [];
    }
}
exports.InstanceObject = InstanceObject;
/**
 *  as stroed in MongoDB
 * */
class ItemObject {
}
exports.ItemObject = ItemObject;
class TokenObject {
}
exports.TokenObject = TokenObject;
class LoopObject {
}
exports.LoopObject = LoopObject;
// Query Objects
class DataQuery {
    constructor(instance, item) {
    }
}
function test() {
    //    new DataQuery(new InstanceQuery())
}
class Query {
    constructor({ instanceId = null, instanceName = null, instanceStatus = null, instanceStartedAt = null, instanceEndedAt = null, instanceSaved = null, data = null, itemId = null, itemSeq = null, itemKey = null, itemName = null, itemType = null, itemStatus = null, itemStartedAt = null, itemEndedAt = null, itemTokenId = null, itemElementId = null } = {}) {
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
        this._itemStartedAt = itemStartedAt;
        this._itemEndedAt = itemEndedAt;
        this._itemTokenId = itemTokenId;
        this._itemElementId = itemElementId;
    }
    instanceId(val) { this._instanceId = val; return this; }
    instanceName(val) { this._instanceName = val; return this; }
    instanceStatus(val) { this._instanceStatus = val; return this; }
    data(val) { this._data = val; return this; }
    itemId(val) { this._itemId = val; return this; }
    itemName(val) { this._itemName = val; return this; }
    itemStatus(val) { this._itemStatus = val; return this; }
    itemElementId(val) { this._itemElementId = val; return this; }
}
exports.Query = Query;
class InstanceQuery {
    constructor({ id = null, name = null, status = null, startedAt = null, endedAt = null, saved = null, data = null, items = new ItemQuery() } = {}) {
        this.items = new ItemQuery();
        this._id = id;
        this._name = name;
        this._status = status;
    }
    id(val) { this._id = val; return this; }
    name(val) { this._name = val; return this; }
}
class ItemQuery {
    constructor({ id = null, name = null, seq = null, status = null, itemKey = null, type = null, startedAt = null, endedAt = null, tokenId = null, elementId = null, } = {}) {
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
    id(val) { this._id = val; return this; }
    name(val) { this._name = val; return this; }
    status(val) { this._status = val; return this; }
}
//# sourceMappingURL=Model.js.map