"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ItemInstance = void 0;
const { v4: uuidv4 } = require('uuid');
function getUUID() {
    return uuidv4(); // -> '6c84fb90-12c4-11e1-840d-7b25c5ee775a' 
}
class ItemInstance {
    constructor() {
        this.id = getUUID();
        this.startAt = new Date().toISOString();
        //	 invoked at start of invoke
    }
    getUrl() {
        return this.instanceId + '.' + this.id;
    }
    static fromTask(task, instance, event) {
        let item = new ItemInstance();
        item.instanceId = instance.id;
        item.task = task; // don't save
        item.taskId = task.id;
        item.type = task.type;
        item.name = task.name;
        item.startAt = new Date().toISOString();
        item.endAt = null;
        item.executionId = task.executionId;
        item.data = instance.data;
        item.itemData = [];
        item.status = event;
        item.isoDuration = task.content.isoDuration;
        item.timeout = task.content.timeout;
        return item;
    }
    static fromDB(record) {
        let item = new ItemInstance();
        item.id = record.id;
        item.instanceId = record.instanceId,
            item.taskId = record.taskId;
        item.name = record.name;
        item.processName = record.name;
        item.type = record.type;
        item.startAt = record.startAt;
        item.endAt = record.endAt;
        item.executionId = record.executionId;
        item.itemData = record.itemData;
        item.status = record.status;
        item.user = record.user;
        item.isoDuration = record.isoDuration;
        item.timeout = record.timeout;
        item.inputFields = record.inputFields;
        return item;
    }
    //	called before inserting
    getDataObject(instance) {
        return {
            id: this.id,
            instanceId: this.instanceId,
            taskId: this.task.id,
            name: this.task.name,
            processName: instance.name,
            type: this.task.type,
            startAt: this.startAt,
            endAt: this.endAt,
            executionId: this.executionId,
            data: this.data,
            itemData: this.itemData,
            status: this.status,
            user: this.user,
            isoDuration: this.isoDuration,
            timeout: this.timeout,
            inputFields: this.inputFields
        };
    }
}
exports.ItemInstance = ItemInstance;
//# sourceMappingURL=ItemInstance.js.map