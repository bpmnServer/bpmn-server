import { Node } from ".";
import { Behaviour_names } from "./behaviours";
import { NODE_ACTION } from "../../";
import { Item } from "../engine/Item";
class Event extends Node {

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

class CatchEvent extends Node {

    /**
     * 
     * 	
     * @param item
     */
    hasMessage() {
        return this.hasBehaviour(Behaviour_names.MessageEventDefinition);
    }
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
class BoundaryEvent extends Node {

    /**
     * 
     * 	
     * @param item
     */
    hasMessage() {
        return this.hasBehaviour(Behaviour_names.MessageEventDefinition);
    }
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
class ThrowEvent extends Node {

    /**
     * 
     * 	using token: check if fromEventBasedGateway;	if yes cancel all other events
     * 	
     * @param item
     */
    async start(item: Item): Promise<NODE_ACTION> {
        return super.start(item);
    }
}
/*  TODO
    <endEvent id="EndEvent_2" name="Tweet rejected">
      <terminateEventDefinition id="TerminateEventDefinition_1"/>

    <endEvent>
 /process>
 */
class EndEvent extends Event {

    end(item: Item) {
        return super.end(item);
    }
}

export {Event, EndEvent , CatchEvent,ThrowEvent , BoundaryEvent}