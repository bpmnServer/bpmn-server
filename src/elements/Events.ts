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

    get requiresWait() {
        return true; 
    }
    get canBeInvoked() {
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