import { Node } from ".";
import { Behaviour_names } from "./behaviours";
import { NODE_ACTION } from "../../";
import { Item } from "../engine/Item";
import { ITEM_STATUS } from "../interfaces";
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

    end(item: Item) {

        return super.end(item);
    }
    get canBeInvoked() { return true; }

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
        return super.start(item);
    }
    async run(item: Item): Promise<NODE_ACTION> {

        if (item.token.parentToken.currentItem.status == ITEM_STATUS.end)   // in cancelling mode
            return;
        if (this.isCancelling) {
            item.token.parentToken.currentItem.status = ITEM_STATUS.end; //force status so it would not run
            await item.token.parentToken.terminate();
        }
        return super.run(item);
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
    end(item: Item) {
        return super.end(item);
    }
}
class StartEvent extends Event {
    get isCatching(): boolean { return true; }
}

export {Event,StartEvent, EndEvent , CatchEvent,ThrowEvent , BoundaryEvent}