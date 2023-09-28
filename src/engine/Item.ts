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
    userId;
    startedAt;              // dateTime Started
    _endedAt = null;
    instanceId;
    input = {};
    output = {};
    vars = {};
    assignee;
    candidateGroups;
    candidateUsers;
    dueDate;
    followUpDate;
    priority;
    

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
    get node() : Node {
        return this.element as Node;
    }
    // timer
    timeDue: Date;
    timerCount;

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
        this.userId = token.execution.userId;

        token.log(`Item:new Item ${element.id} for token ${token.id} `);
    }
    save() : IItemData {

        return {
            id: this.id, seq: this.seq, itemKey: this.itemKey, tokenId: this.token.id, elementId: this.elementId, name: this.name,
            status: this.status, userId: this.userId, startedAt: this.startedAt, endedAt: this.endedAt, type: this.type, timeDue: this.timeDue,
            data: null, vars: this.vars, instanceId: this.instanceId,
            messageId: this.messageId, signalId: this.signalId,
            assignee:this.assignee,
            candidateGroups:this.candidateGroups,
            candidateUsers:this.candidateUsers,
            dueDate:this.dueDate,
            followUpDate:this.followUpDate,
            priority:this.priority
//                assignments: this.assignments,authorizations: this.authorizations, notifications: this.notifications
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
        
        item.assignee= dataObject.assignee;
        item.candidateGroups=dataObject.candidateGroups;
        item.candidateUsers=dataObject.candidateUsers;
        item.dueDate=dataObject.dueDate;
        item.followUpDate=dataObject.followUpDate;
        item.priority=dataObject.priority;
  /*      item.authorizations=dataObject.authorizations;
        item.assignments=dataObject.assignments;
        item.notifications = dataObject.notifications; */
        item.vars = dataObject.vars;
        return item;
    }
}

export {Item}