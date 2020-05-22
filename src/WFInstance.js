"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WFInstance = void 0;
const { Engine } = require('bpmn-engine');
const { v4: uuidv4 } = require('uuid');
/***
 *	============================================================
 * */
class WFInstance {
    constructor(action = '') {
        this.items = new Map();
        this.logs = [];
        this.modified = false;
        this.dbAction = action;
        this.id = getUUID();
        this.startAt = new Date().toISOString();
        this.logs = [];
        this.items = new Map();
    }
    getDataObject() {
        return {
            id: this.id,
            name: this.name,
            startAt: this.startAt,
            endAt: this.endAt,
            lastAt: this.lastAt,
            lastItem: this.lastItem,
            lastStatus: this.lastStatus,
            engineClassPath: this.engineClassPath,
            data: this.data
        };
    }
    fromDataObject(instanceObj) {
        this.id = instanceObj.id;
        this.name = instanceObj.name;
        this.startAt = instanceObj.startAt;
        this.endAt = instanceObj.endAt;
        this.lastAt = instanceObj.lastAt;
        this.lastItem = instanceObj.lastItem;
        this.lastStatus = instanceObj.lastStatus;
        this.data = instanceObj.data;
        this.items = new Map();
        this.state = instanceObj.state;
        this.logs = instanceObj.logs;
    }
    getItems() {
        let items = [];
        this.items.forEach(item => { items.push(item); });
        return items;
    }
}
exports.WFInstance = WFInstance;
function getUUID() {
    return uuidv4(); // -> '6c84fb90-12c4-11e1-840d-7b25c5ee775a' 
}
//# sourceMappingURL=WFInstance.js.map