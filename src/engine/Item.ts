import { Execution } from "./Execution";
import { ITEM_STATUS, IItem, } from "../";
import { IItemData } from "../";
import { Element , Node } from '../elements';
import { Token } from "./Token";

class Item implements IItem {
    id;                 
    itemKey: string; // Used for multi-instance
    element: Element;   
    token : Token;      
    seq;
    userName;
    startedAt;              // dateTime Started
    endedAt = null;
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
    status: ITEM_STATUS;
    statusDetails:object;
    log(...msg) { return this.token.log(msg); }
    get data() { return this.token.data; }
    set data(val) { this.token.appendData(val,this); }
    setData(val) { this.token.appendData(val,this); }
    get options() { return this.token.execution.options;  }
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

    constructor(element, token, status = ITEM_STATUS.start) {
        this.id = token.execution.getUUID();
        this.seq = token.execution.getNewId('item');

        this.messageId= element.messageId;
        this.signalId=element.signalId;

        this.element = element;
        this.token = token;
        this.status = status;
        this.userName = token.execution.userName;

        this.itemKey=token.itemsKey;//token.dataPath;


    }
    save() : IItemData {

        return {
            id: this.id, seq: this.seq, itemKey: this.itemKey, tokenId: this.token.id, elementId: this.elementId, name: this.name,
            status: this.status, statusDetails: this.statusDetails, userName: this.userName, startedAt: this.startedAt, endedAt: this.endedAt, type: this.type, timeDue: this.timeDue,
            /*data: null ,*/ vars: this.vars, output:this.output, instanceId: this.instanceId,
            messageId: this.messageId, signalId: this.signalId,
            assignee:this.assignee,
            candidateGroups:this.candidateGroups,
            candidateUsers:this.candidateUsers,
            dueDate:this.dueDate,
            followUpDate:this.followUpDate,
            priority:this.priority
        };

    }
    static load(execution: Execution, dataObject: IItemData, token) {
        const el = execution.getNodeById(dataObject.elementId);
        const item = new Item(el, token, dataObject.status);
        item.id = dataObject.id;
        item.itemKey = dataObject.itemKey;
        item.seq = dataObject.seq;
        item.userName = dataObject.userName;
        item.startedAt = dataObject.startedAt;
        item.endedAt = dataObject.endedAt;
        item.timeDue = dataObject.timeDue;
        item.statusDetails = dataObject.statusDetails;
        item.messageId= dataObject.messageId;
        item.signalId= dataObject.signalId;
        item.assignee= dataObject.assignee;
        item.candidateGroups=dataObject.candidateGroups;
        item.candidateUsers=dataObject.candidateUsers;
        item.dueDate=dataObject.dueDate;
        item.followUpDate=dataObject.followUpDate;
        item.priority=dataObject.priority;
        item.vars = dataObject.vars;
        item.output=dataObject.output;
        return item;
    }
}

export {Item}