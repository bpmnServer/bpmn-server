"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Item = void 0;
const __1 = require("../../");
class Item {
    get endedAt() {
        return this._endedAt;
    }
    set endedAt(val) {
        this._endedAt = val;
        if (this._dbAction == null)
            this._dbAction = 'update';
    }
    get status() {
        return this._status;
    }
    set status(val) {
        this._status = val;
        if (this._dbAction == null)
            this._dbAction = 'update';
    }
    log(msg) { return this.token.log(msg); }
    get data() { return this.token.data; }
    set data(val) { this.token.appendData(val); }
    setData(val) { this.token.appendData(val); }
    get context() { return this.token.execution; }
    get elementId() { return this.element.id; }
    get name() {
        return this.element.name;
    }
    get tokenId() {
        return this.token.id;
    }
    get type() {
        return this.element.type;
    }
    get node() {
        return this.element;
    }
    constructor(element, token, status = __1.ITEM_STATUS.start) {
        this._endedAt = null;
        this.assignments = [];
        this.authorizations = [];
        this.notifications = [];
        this.input = {};
        this.output = {};
        this.vars = {};
        this._dbAction = null;
        this.id = token.execution.getUUID();
        this.seq = token.execution.getNewId('item');
        this.element = element;
        this._dbAction = 'add';
        this.token = token;
        this.status = status;
        const user = token.execution.currentUser;
        if (user)
            this.userId = user.userId;
        token.log(`Item:new Item ${element.id} for token ${token.id} `);
    }
    save() {
        return {
            id: this.id, seq: this.seq, itemKey: this.itemKey, tokenId: this.token.id, elementId: this.elementId, name: this.name,
            status: this.status, userId: this.userId, startedAt: this.startedAt, endedAt: this.endedAt, type: this.type, timeDue: this.timeDue,
            data: null, vars: this.vars, instanceId: this.instanceId,
            messageId: this.messageId, signalId: this.signalId,
            assignments: this.assignments, authorizations: this.authorizations, notifications: this.notifications
        };
    }
    static load(execution, dataObject, token) {
        const el = execution.getNodeById(dataObject.elementId);
        const item = new Item(el, token, dataObject.status);
        item.id = dataObject.id;
        item.itemKey = dataObject.itemKey;
        item.seq = dataObject.seq;
        item.startedAt = dataObject.startedAt;
        item.endedAt = dataObject.endedAt;
        item.timeDue = dataObject.timeDue;
        item.authorizations = dataObject.authorizations;
        item.assignments = dataObject.assignments;
        item.notifications = dataObject.notifications;
        item.vars = dataObject.vars;
        return item;
    }
}
exports.Item = Item;
//# sourceMappingURL=Item.js.map