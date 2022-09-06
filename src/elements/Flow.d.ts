import { FLOW_ACTION, IFlow } from '../../';
import { Item } from '../engine/Item';
import { Node, Element } from '.';
declare class Flow extends Element implements IFlow {
    from: Node;
    to: Node;
    def: any;
    isMessageFlow: boolean;
    constructor(id: any, type: any, from: any, to: any, def: any);
    describe(): any[][];
    /**
     *
     * <Rule> if flow has a condition, it must be evaluated and if result is true flow will continue
     *  otherwise, flow will be discarded.
     * </Rule>
     * @param item
     */
    run(item: Item): FLOW_ACTION;
    execute(item: any): Promise<void>;
}
/**
*
* <Rule>MessageFlow: can only be sent to active node in waiting
 * or to a start event
* </Rule>
* */
declare class MessageFlow extends Flow {
    isMessageFlow: boolean;
    execute(item: Item): Promise<void>;
}
export { Flow, MessageFlow };
