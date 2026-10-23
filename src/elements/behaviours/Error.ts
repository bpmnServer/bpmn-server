import type { TimerBehaviour } from './Timer.js';
import type { Node } from '../Node.js';
import { Behaviour } from './Behaviour.js';
import type { Item } from "../../engine/Item.js";
import { NODE_SUBTYPE } from '../../interfaces/Enums.js';
import { Event } from '../Events.js';
import { Transaction } from '../Transaction.js';
import { NODE_ACTION, TOKEN_STATUS } from '../../interfaces/Enums.js';
import { BPMN_TYPE } from '../NodeLoader.js';


class ErrorEventBehaviour extends Behaviour {
    init() {
        this.node.subType = NODE_SUBTYPE.error;

    }
    async run(item: Item) {

        //if (item.token.parentToken && (item.token.parentToken.currentItem.status == ITEM_STATUS.end))   // in cancelling mode
        //    return;   why would I call run if am cancelling?
        await Event.terminate(item);
        //  current token is already terminated in the above logic, we need to restore it
        item.token.status=TOKEN_STATUS.running;
     
    }
    async start(item: Item) {
        item.log("staring an Error Events "+this.node.isCatching);
        if (this.node.isCatching) {
            return NODE_ACTION.wait;
        }
        else {  // throw a message
            item.log("Error Event is throwing an error");

            let transItem;

            if (item.token.originItem.type==BPMN_TYPE.Transaction)
                transItem=item.token.originItem;
            else
                transItem=item.token.parentToken.originItem;
            

            await item.token.processError(this.errorId,item);

            await Transaction.Cancel(transItem);

            transItem.token.status=TOKEN_STATUS.terminated;
            
            await transItem.node.end(transItem,true);

            await item.node.end(item,false); // mark me as properly ended

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