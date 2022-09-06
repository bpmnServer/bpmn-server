import { Behaviour } from '.';
import { Item } from "../../engine/Item";
/**
 *
 *
 * it is part of the following:
 *
 *  events
 *  sendTask
 *  receiveTask
 * */
declare class MessageEventBehaviour extends Behaviour {
    init(): void;
    start(item: Item): Promise<void>;
    end(item: Item): void;
    get messageId(): any;
    describe(): string[];
}
declare class SignalEventBehaviour extends Behaviour {
    init(): void;
    start(item: Item): void;
    end(item: Item): void;
    describe(): string[];
    get signalId(): any;
}
export { MessageEventBehaviour, SignalEventBehaviour };
