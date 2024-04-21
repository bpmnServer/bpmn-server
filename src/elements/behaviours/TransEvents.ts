
import { Behaviour } from '.';
import { Item } from "../../engine/Item";
import { NODE_SUBTYPE } from "../../";
import { ITEM_STATUS, NODE_ACTION, TOKEN_STATUS } from "../../interfaces";
import { Node } from "../Node";
import { Event, Transaction } from "../";

class CancelEventBehaviour extends Behaviour {
    init() {
        this.node.subType = NODE_SUBTYPE.cancel;

    }
    async run(item: Item) {

        await Event.terminate(item);
        //  current token is already terminated in the above logic, we need to restore it
        item.status=ITEM_STATUS.wait;
        item.token.status=TOKEN_STATUS.running;

    }    
    async start(item: Item) {
        item.log("staring an Cancel Event " + this.node.isCatching);
        if (this.node.isCatching) {
            return NODE_ACTION.wait;
        }
        else {  // throw a message
            item.log("Cancel Event is throwing a TransactionCancel");

            let transItem=item.token.parentToken.originItem;
  
            await item.token.processCancel(item);      // find the event and invoke it
            
            await Transaction.Cancel(transItem);
            /*transItem.token.status=TOKEN_STATUS.terminated;
            
            await transItem.node.end(transItem,true);*/

            return NODE_ACTION.error;
        }

    }

    describe() {
            return [['CancelTransaction', ``]];
    }
}
class CompensateEventBehaviour extends Behaviour {
    init() {
        this.node.subType = NODE_SUBTYPE.compensate;

    }
    async start(item: Item) {
        item.log("staring an Error Events " + this.node.isCatching);
        if (this.node.isCatching) {
            return NODE_ACTION.continue;
        }
        else {  // throw a message
            item.log("Compensate Event");
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
            //console.log("--- calling Compensate");
            await Transaction.Compensate(transItem);
            //console.log("---- called Compensate");

            return NODE_ACTION.continue;
        }

    }

    get TransactionId() {
        if (this.definition['activityRef'])
            return this.definition['activityRef']['id'];
    }
    describe() {
            return [['Compensate', ``]];
    }
}


export { CompensateEventBehaviour , CancelEventBehaviour}