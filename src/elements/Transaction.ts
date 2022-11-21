import { Node } from './Node';

import { Token, TOKEN_TYPE } from '../engine/Token';
import { BPMN_TYPE, ITEM_STATUS, NODE_ACTION, NODE_SUBTYPE } from '../interfaces/Enums'

import { Process } from './Process';
import { IExecution } from '../interfaces/engine';
import { EXECUTION_STATUS } from '../interfaces/Enums';
import { Item } from '../engine/Item';
import { SubProcess } from '.';

//NO_import { DecisionTable } from 'dmn-engine';

class Transaction extends SubProcess {
    get requiresWait() { return true; }       

    async end(item) {
        console.log('trans ending');
        super.end(item);

    }
    /**
     * Cancel Transaction
     *  is called by Throw Cancel Event
     *  
     *  1.  Aborts any started items in the transaction
     *  2.  Compensate any completed items
     *  
     * @param item
     */
    static async Cancel(transaction) {
        await Transaction.Compensate(transaction);
    }
    /**
     * Compensate Transaction
     *  is called by Throw Compensate Event
     *  this is called outside of the transaction
     *  
     *  1.  Compensate any completed items
     *  
     * @param item
     */
    static async Compensate(transItem) {
        let trans = transItem.node as Transaction;
        let items = trans.getItems(transItem);

        console.log("--- Compensating ...",transItem.elementId," found trans items",items.length);
        for (let i = 0; i < items.length; i++) {
            let item: Item = items[i];
            console.log(" checking item ", item.elementId, item.status);
            if (item.status == ITEM_STATUS.end) {

                let evnts = item.node.attachments;
                let toFire = [];
                if (evnts) {
                    evnts.forEach((event, key) => {
                        console.log(item.elementId, 'event', event.subType);
                        if (event.subType == NODE_SUBTYPE.compensate) {
                            console.log("--- firing event", event.id);
                            toFire.push(event);
                        }
                    });
                    for (let ev = 0; ev < toFire.length; ev++) {
                        console.log(ev);
                        let newToken=await Token.startNewToken(TOKEN_TYPE.BoundaryEvent, item.token.execution, toFire[ev], null, item.token, item, null);
                        console.log('New Token', newToken.status, newToken.currentItem.id, newToken.currentItem.status);
                        await newToken.execution.signal(newToken.currentItem.id,null);
                    }

                }
            }
        }
    }
    getNodes() {
        return this.childProcess.childrenNodes;
    }

    getItemsForToken(token) {

        let items = [];
        token.childrenTokens.forEach(t => {
            t.path.forEach(it => {
                if (it.node.type !== BPMN_TYPE.SequenceFlow)
                    items.push(it);
            });
            items = items.concat(this.getItemsForToken(t));
        });

        return items;
    }

    public getItems(item) {

        return this.getItemsForToken(item.token);
    }

    async start(item): Promise<NODE_ACTION> {
        return super.start(item);
    }
}


export {Transaction }