import { Node } from ".";
import { NODE_ACTION } from "../../";
import { Item } from "../engine/Item";
declare class Event extends Node {
    hasMessage(): any;
    hasSignal(): any;
    hasTimer(): any;
    /**
     *
     * 	using token: check if fromEventBasedGateway;	if yes cancel all other events
     *
     * @param item
     */
    start(item: Item): Promise<NODE_ACTION>;
    end(item: Item): Promise<void>;
    get canBeInvoked(): boolean;
}
declare class CatchEvent extends Event {
    get isCatching(): boolean;
    get requiresWait(): boolean;
    get canBeInvoked(): boolean;
    start(item: Item): Promise<NODE_ACTION>;
}
declare class BoundaryEvent extends Event {
    get isCatching(): boolean;
    get requiresWait(): boolean;
    get canBeInvoked(): boolean;
    start(item: Item): Promise<NODE_ACTION>;
}
declare class ThrowEvent extends Event {
    /**
     *
     * 	using token: check if fromEventBasedGateway;	if yes cancel all other events
     */
    get isCatching(): boolean;
    start(item: Item): Promise<NODE_ACTION>;
    run(item: Item): Promise<NODE_ACTION>;
}
declare class EndEvent extends Event {
    get isCatching(): boolean;
    end(item: Item): Promise<void>;
}
declare class StartEvent extends Event {
    get isCatching(): boolean;
}
export { Event, StartEvent, EndEvent, CatchEvent, ThrowEvent, BoundaryEvent };
