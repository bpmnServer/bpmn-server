import { Node } from './Node';
import { NODE_ACTION } from '../interfaces/Enums';
import { SubProcess } from '.';
declare class Transaction extends SubProcess {
    get requiresWait(): boolean;
    end(item: any): Promise<void>;
    /**
     * Cancel Transaction
     *  is called by Throw Cancel Event
     *
     *  1.  Aborts any started items in the transaction
     *  2.  Compensate any completed items
     *
     * @param item
     */
    static Cancel(transaction: any): Promise<void>;
    /**
     * Compensate Transaction
     *  is called by Throw Compensate Event
     *  this is called outside of the transaction
     *
     *  1.  Compensate any completed items
     *
     * @param item
     */
    static Compensate(transItem: any): Promise<void>;
    getNodes(): Node[];
    getItemsForToken(token: any): any[];
    getItems(item: any): any[];
    start(item: any): Promise<NODE_ACTION>;
}
export { Transaction };
