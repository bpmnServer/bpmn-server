import { Execution } from "./Execution";
import { ITEM_STATUS, IItem, } from "../../";
import { IItemData } from "../../";

import { Element , Node } from '../elements';

import { Token } from "./Token";

class Item implements IItem {
    id;                 
    itemKey: string;
    element: Element;   
    token : Token;      
    seq;
    startedAt;              // dateTime Started
    _endedAt = null;
    get endedAt() {         // dateTime ended
        return this._endedAt;
    }   
    set endedAt(val) {
        this._endedAt = val;
        if (this._dbAction == null)
            this._dbAction = 'update';
    }
    _status: ITEM_STATUS;
    get status() {          // current Status
        return this._status;
    }
    set status(val: ITEM_STATUS) {
        this._status = val;
        if (this._dbAction == null)
            this._dbAction = 'update';
    }
    log(msg) { return this.token.log(msg); }
    get data() { return this.token.data; }
    set data(val) { this.token.applyInput(val); }
    get context() { return this.token.execution.executionContext; }
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
    get node() : Node {
        return this.element as Node;
    }
    // timer
    timeDue: Date;
    messageId;
    signalId;

    _dbAction: 'add' | 'update' | null = null;

    constructor(element, token, status = ITEM_STATUS.start) {
        this.id = token.execution.getUUID();
        this.seq = token.execution.getNewId('item');
        this.element = element;
        this._dbAction = 'add';
        this.token = token;
        this.status = status;
    }
    save() : IItemData {

        return {
            id: this.id, seq: this.seq, itemKey: this.itemKey, tokenId: this.token.id, elementId: this.elementId, name: this.name,
            status: this.status, startedAt: this.startedAt, endedAt: this.endedAt, type: this.type, timeDue: this.timeDue,
            data: undefined , messageId: this.messageId, signalId: this.signalId

        };

    }
    static load(execution: Execution, dataObject: IItemData, token) {
        const el = execution.getNodeById(dataObject.elementId);
        const item = new Item(el, token, dataObject.status);
        item.id = dataObject.id;
        item.itemKey = dataObject.itemKey;
        item.seq = dataObject.seq;
        item.startedAt = dataObject.startedAt;
        item.endedAt = dataObject.endedAt;
        item.timeDue = dataObject.timeDue;
        return item;
    }

}

export {Item}