import { Node } from ".";
import { Behaviour_names } from "./behaviours";
import { NODE_ACTION } from "../../";
import { Item } from "../engine/Item";
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
    canBeInvoked() { return true; }

}

class CatchEvent extends Event {

    /**
     * 
     * 	
     * @param item
     */
    requiresWait() {
        return true; // return this.hasMessage(); 
    }
    canBeInvoked() {
        return true; // return this.hasMessage();
    }

    async start(item: Item): Promise<NODE_ACTION> {
        return super.start(item);
    }
}
class BoundaryEvent extends Event {

    /**
     * 
     * 	
     * @param item
     */
    requiresWait() {
        return true; 
    }
    canBeInvoked() {
        return true; 
    }

    async start(item: Item): Promise<NODE_ACTION> {
        return super.start(item);
    }
}
class ThrowEvent extends Event {

    /**
     * 
     * 	using token: check if fromEventBasedGateway;	if yes cancel all other events
     * 	
     * @param item
     */
    async start(item: Item): Promise<NODE_ACTION> {
        return super.start(item);
    }
    async run(item: Item): Promise<NODE_ACTION> {

        if (this.hasMessage())
            await item.token.execution.appDelegate.messageIssued(item);
        if (this.hasSignal())
            await item.token.execution.appDelegate.signalIssued(item);

        return NODE_ACTION.end;
    }
}

class EndEvent extends Event {

    end(item: Item) {
        return super.end(item);
    }
}

export {Event, EndEvent , CatchEvent,ThrowEvent , BoundaryEvent}