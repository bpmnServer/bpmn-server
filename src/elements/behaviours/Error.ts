import type { TimerBehaviour } from ".";
import type { Node } from "..";
import { Behaviour } from '.';
import type { Item } from "../../engine/Item";
import { NODE_SUBTYPE } from "../../..";
import { NODE_ACTION } from "../../interfaces";


class ErrorEventBehaviour extends Behaviour {
    init() {
        this.node.subType = NODE_SUBTYPE.error;

    }
    async start(item: Item) {
        item.context.logger.log("staring an Error Events "+this.node.isCatching);
        if (this.node.isCatching) {
            return NODE_ACTION.wait;
        }
        else {  // throw a message
            item.context.logger.log("Error Event is throwing an error");
            
            return NODE_ACTION.error;
        }

    }

    get errorId() {
        if (this.definition['errorRef'])
            return this.definition['errorRef']['id'];
    }
    describe() {
        if (this.node.isCatching) 
            return ['Message', `catches message '${this.errorId}'`];
        else
            return ['Message', `throws message '${this.errorId}'`];
    }
}

export { ErrorEventBehaviour }