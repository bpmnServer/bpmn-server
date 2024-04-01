import type { TimerBehaviour } from ".";
import type { Node } from "..";
import { Behaviour } from '.';
import type { Item } from "../../engine/Item";
import { NODE_SUBTYPE } from "../../";
import { NODE_ACTION } from "../../interfaces";


class ErrorEventBehaviour extends Behaviour {
    init() {
        this.node.subType = NODE_SUBTYPE.error;

    }
    async start(item: Item) {
        item.log("staring an Error Events "+this.node.isCatching);
        if (this.node.isCatching) {
            return NODE_ACTION.wait;
        }
        else {  // throw a message
            item.log("Error Event is throwing an error");
            await item.token.processError(this.errorId);
            return NODE_ACTION.error;
        }

    }

    get errorId() {
        let ref=this.definition['bpmn:errorRef'] || this.definition['errorRef'];
        if (ref)
            {
                return ref['errorCode'];
            }
    }
    describe() {
        if (this.node.isCatching) 
            return [['Message', `catches message '${this.errorId}'`]];
        else
            return [['Message', `throws message '${this.errorId}'`]];
    }
}

export { ErrorEventBehaviour }