
import { Behaviour } from './Behaviour.js';
import { Item } from "../../engine/Item.js";
import { NODE_SUBTYPE } from '../../interfaces/Enums.js';
import { ITEM_STATUS, NODE_ACTION, TOKEN_STATUS } from '../../interfaces/Enums.js';
import { Node } from "../Node.js";
import { Event } from '../Events.js';
import { Transaction } from '../Transaction.js';

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

            // the transaction this ends: its own token, or up through those between (a gateway adds one)
            let scope = item.token;
            while (scope && (scope.originItem?.node as any)?.isTransaction !== true) scope = scope.parentToken;
            let transItem = scope?.originItem ?? item.token.parentToken.originItem;
  
            await item.token.processCancel(item);      // find the event and invoke it
            
            await Transaction.Cancel(transItem);
            // its way out is the cancel boundary event's token: the one that waited on the transaction has nothing left to do,
            // and left waiting it would keep the instance running with every item ended
            if (transItem.token.status === TOKEN_STATUS.wait)
                transItem.token.status = TOKEN_STATUS.terminated;

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