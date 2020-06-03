import { Execution } from "./Execution";
import { ITEM_STATUS } from "./Enums";
import {Element } from '../elements';

class Item {
    id;
    element: Element;
    token;
    startedAt;
    seq;
    _status: ITEM_STATUS;
    _endedAt = null;
    _dbAction: 'add' | 'update' | null = null;
    get name() { return this.element.name; }
    get status() { return this._status; }
    set status(val: ITEM_STATUS) {
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

    constructor(element, token, status = ITEM_STATUS.start) {
        this.id = token.execution.getUUID();
        this.seq = token.execution.getNewId('item');
        this.element = element;
        this._dbAction = 'add';
        this.token = token;
        this.status = status;
    }
    save() {

        return {
            id: this.id, seq: this.seq, tokenId: this.token.id, elementId: this.element.id, name: this.name,
            status: this.status, startedAt: this.startedAt, endedAt: this.endedAt, type: this.element.type

        };

    }
    static load(execution: Execution, dataObject: any, token) {
        const el = execution.getNodeById(dataObject.elementId);
        const item = new Item(el, token, dataObject.status);
        item.id = dataObject.id;
        item.seq = dataObject.seq;
        item.startedAt = dataObject.startedAt;
        item.endedAt = dataObject.endedAt;
        return item;
    }
}

export {Item}