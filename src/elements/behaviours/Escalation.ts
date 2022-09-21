import { TimerBehaviour } from ".";
import { Node } from "..";
import { Behaviour } from '.';
import { Item } from "../../engine/Item";
import { NODE_SUBTYPE } from "../../..";
import { NODE_ACTION } from "../../interfaces";


class EscalationEventBehaviour extends Behaviour {
    init() {
        this.node.subType = NODE_SUBTYPE.escalation;

    }
    async start(item: Item) {
        item.context.logger.log("staring an Error Events "+this.node.isCatching);
        if (this.node.isCatching) {
            return NODE_ACTION.wait;
        }
        else {  // throw a message
            item.context.logger.log("Error Event is throwing an error");

            item.token.processEscalation();
            return NODE_ACTION.continue;

        }

    }

    get escalationId() {
        if (this.definition['escalatonRef'])
            return this.definition['escalationRef']['id'];
    }
    describe() {
        if (this.node.isCatching) 
            return ['Message', `catches message '${this.escalationId}'`];
        else
            return ['Message', `throws message '${this.escalationId}'`];
    }
}
export { EscalationEventBehaviour}