
import { Behaviour } from '.';
import { Item } from "../../engine/Item";
import { NODE_SUBTYPE } from "../../..";
import { NODE_ACTION } from "../../interfaces";
import { Node } from "../Node";
import { Transaction } from "../";

class CancelEventBehaviour extends Behaviour {
    init() {
        this.node.subType = NODE_SUBTYPE.cancel;

    }
    async start(item: Item) {
        item.context.logger.log("staring an Error Events " + this.node.isCatching);
        if (this.node.isCatching) {
            return NODE_ACTION.wait;
        }
        else {  // throw a message
            await Transaction.Cancel(item.token.parentToken.currentItem);

            item.context.logger.log("Error Event is throwing an error");

            return NODE_ACTION.error;
        }

    }

    describe() {
            return ['CancelTransaction', ``];
    }
}
class CompensateEventBehaviour extends Behaviour {
    init() {
        this.node.subType = NODE_SUBTYPE.compensate;

    }
    async start(item: Item) {
        item.context.logger.log("staring an Error Events " + this.node.isCatching);
        if (this.node.isCatching) {
            return NODE_ACTION.continue;
        }
        else {  // throw a message
            item.context.logger.log("Compensate Event");
            var nodeId = this.TransactionId;
            // challenge: find the item for a node, assuming there is only one item
            var transItem;
            item.token.execution.tokens.forEach(t => {
                t.path.forEach(i => {
                    if (i.node.id == this.TransactionId) {
                        transItem = i;
                        //console.log(" transItem", transItem);
                    }

                });
            });
            console.log("--- calling Compensate");
            await Transaction.Compensate(transItem);
            console.log("---- called Compensate");

            return NODE_ACTION.continue;
        }

    }

    get TransactionId() {
        if (this.definition['activityRef'])
            return this.definition['activityRef']['id'];
    }
    describe() {
            return ['Compensate', ``];
    }
}


export { CompensateEventBehaviour , CancelEventBehaviour}