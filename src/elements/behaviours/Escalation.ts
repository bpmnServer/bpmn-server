

import { Behaviour } from '.';
import { Item } from "../../engine/Item";
import { NODE_SUBTYPE } from "../../";
import { NODE_ACTION } from "../../interfaces";


class EscalationEventBehaviour extends Behaviour {
    constructor(node,def) {
        super(node,def);

    }
    init() {
        this.node.subType = NODE_SUBTYPE.escalation;

    }
    async start(item: Item) {
        item.log("staring an Error Events "+this.node.isCatching);
        if (this.node.isCatching) {
            return NODE_ACTION.wait;
        }
        else {  // throw a message
            item.log("Error Event is throwing an error");

            await item.token.processEscalation(this.escalationId,item);
            return NODE_ACTION.continue;

        }

    }

    get escalationId() {
        let ref=this.definition['bpmn:escalationRef'];
        if (ref)
            {
                return ref['escalationCode'];
            }

    }
    describe() {
        if (this.node.isCatching) 
            return [['Message', `catches message '${this.escalationId}'`]];
        else
            return [['Message', `throws message '${this.escalationId}'`]];
    }
}
export { EscalationEventBehaviour}