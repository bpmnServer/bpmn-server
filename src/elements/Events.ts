import { Node } from ".";
import { Behaviour_names } from "./behaviours";
import { Loop, NODE_ACTION } from "../";
import { Item } from "../engine/Item";
import { ITEM_STATUS, TOKEN_STATUS } from "../interfaces";

class Event extends Node {

    hasMessage() {
        return this.getBehaviour(Behaviour_names.MessageEventDefinition);
    }
    hasSignal() {
        return this.getBehaviour(Behaviour_names.SignalEventDefinition);
    }
    hasTimer() {
        return this.getBehaviour(Behaviour_names.TimerEventDefinition);
    }
    /**
     * 
     * 	using token: check if fromEventBasedGateway;	if yes cancel all other events
     * 	
     * @param item
     */
    async start(item: Item): Promise<NODE_ACTION> {
        return super.start(item);
    }

    async end(item: Item,cancel: Boolean=false) {

        return await super.end(item,cancel);
    }
    get canBeInvoked() { return true; }

    /**
     * is called by 
     *  -   boundaryEvent (intrupting)
     *  -   Error,Cancel Event
     *  -   End event (abort)
     *  
     * 
     * @param item the curremt event item 
     */
    static async terminate(item) {

        if (!item.token.parentToken)
            return;
        item.token.log('BoundaryEvent(' + item.node.id + ').run: isCancelling .. parentToken: '+item.token.parentToken.id);
        item.token.parentToken.currentItem.status = ITEM_STATUS.end; //force status so it would not run
        /* fix bug #86
        */
        item.status = ITEM_STATUS.end;

        // check for loop:
        if (item.node.attachedTo.loopDefinition)
            {   // cancel all items of the loop

                await Loop.cancel(item);
            }
        else 
            {
                await item.token.parentToken.terminate();
            }
        if (item.token.parentToken.originItem && item.token.parentToken.originItem.elementId==item.node.attachedTo.id) { // finding the attached item
            item.token.parentToken.originItem.node.end(item.token.parentToken.originItem,true);
        }
   
    }    
}

class CatchEvent extends Event {

    get isCatching(): boolean { return true; } 

    get requiresWait() {
        return true; // return this.hasMessage(); 
    }
    get canBeInvoked() {
        return true; // return this.hasMessage();
    }

    async start(item: Item): Promise<NODE_ACTION> {
        return super.start(item);
    }
}
class BoundaryEvent extends Event {

    get isCatching(): boolean { return true; } 

    isCancelling: boolean;
    constructor(id, process, type, def) {
        super(id, process, type, def);

        this.isCancelling = true;
        if ((typeof this.def['cancelActivity'] !=='undefined') && (this.def['cancelActivity'] === false))
            this.isCancelling=false;

    }
    get requiresWait() {
        return true; 
    }
    get canBeInvoked() {
        return true; 
    }

    async start(item: Item): Promise<NODE_ACTION> {
        return await super.start(item);
    }
    async run(item: Item): Promise<NODE_ACTION> {

        //if (item.token.parentToken && (item.token.parentToken.currentItem.status == ITEM_STATUS.end))   // in cancelling mode
        //    return;   why would I call run if am cancelling?
        var ret=await super.run(item);

        if (this.isCancelling) {
            await Event.terminate(item);
            //  current token is already terminated in the above logic, we need to restore it
            item.token.status=TOKEN_STATUS.running;
        }

        return ret;
    }
}
class ThrowEvent extends Event {

    /**
     * 
     * 	using token: check if fromEventBasedGateway;	if yes cancel all other events
     */

    get isCatching(): boolean { return false; } 

    async start(item: Item): Promise<NODE_ACTION> {
        return await super.start(item);
    }
    async run(item: Item): Promise<NODE_ACTION> {

        return NODE_ACTION.end;
    }
}

class EndEvent extends Event {

    get isCatching(): boolean { return false; } 
    async end(item: Item,cancel) {

        let subProcessToken=item.token.getSubProcessToken();
        if (subProcessToken && item.status !== ITEM_STATUS.end)
        {
            await subProcessToken.end(cancel);
        }
        
        return super.end(item,cancel);
    }
}
class StartEvent extends Event {
    constructor(id, process, type, def) {
        super(id, process, type, def);
        this.candidateGroups= this.def.$attrs["camunda:candidateGroups"];
        this.candidateUsers = this.def.$attrs["camunda:candidateUsers"];
        if (this.def.$attrs && this.def.$attrs["camunda:initiator"]) {
            this.initiator = this.def.$attrs["camunda:initiator"];
        }
    }
    async start(item: Item): Promise<NODE_ACTION> {

        if (this.initiator)
            {
            item.token.data[this.initiator]=item.userName;
            }
        return await super.start(item);
    }

    get isCatching(): boolean { return true; }
}

export {Event,StartEvent, EndEvent , CatchEvent,ThrowEvent , BoundaryEvent}