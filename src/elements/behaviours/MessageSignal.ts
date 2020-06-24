import { TimerBehaviour } from ".";
import { Node } from "..";
import { Behaviour } from '.';
import { Item } from "../../engine/Item";

class MessageEventBehaviour extends Behaviour {
    start(item: Item) { }
    end(item: Item) {

    }
    get messageId() {
        return this.definition['bpmn:messageRef'];
    }
    describe() {
        return ['', 'has a message'];
    }
}
class SignalEventBehaviour extends Behaviour {
    start(item: Item) { }
    end(item: Item) {
    }
    describe() {
        return ['', 'has a signal'];
    }
    get signalId() {
        return this.definition['bpmn:signalRef'];
    }
}

export { MessageEventBehaviour , SignalEventBehaviour}