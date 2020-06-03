"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Item = void 0;
const Enums_1 = require("./Enums");
class Item {
    constructor(element, token, status = Enums_1.ITEM_STATUS.start) {
        this._endedAt = null;
        this._dbAction = null;
        this.id = token.execution.getUUID();
        this.seq = token.execution.getNewId('item');
        this.element = element;
        this._dbAction = 'add';
        this.token = token;
        this.status = status;
    }
    get name() { return this.element.name; }
    get status() { return this._status; }
    set status(val) {
        this._status = val;
        if (this._dbAction == null)
            this._dbAction = 'update';
    }
    get endedAt() { return this._endedAt; }
    set endedAt(val) {
        this._endedAt = val;
        if (this._dbAction == null)
            this._dbAction = 'update';
    }
    save() {
        return {
            id: this.id, seq: this.seq, tokenId: this.token.id, elementId: this.element.id, name: this.name,
            status: this.status, startedAt: this.startedAt, endedAt: this.endedAt, type: this.element.type
        };
    }
    static load(execution, dataObject, token) {
        const el = execution.getNodeById(dataObject.elementId);
        const item = new Item(el, token, dataObject.status);
        item.id = dataObject.id;
        item.seq = dataObject.seq;
        item.startedAt = dataObject.startedAt;
        item.endedAt = dataObject.endedAt;
        return item;
    }
}
exports.Item = Item;
//# sourceMappingURL=Item.js.map