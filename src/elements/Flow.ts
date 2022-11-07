
import { Execution } from '../engine/Execution';
import { Token, TOKEN_TYPE } from '../engine/Token';
import { IBehaviour, Behaviour} from "./behaviours";
import { NODE_ACTION, FLOW_ACTION, EXECUTION_EVENT, TOKEN_STATUS, ITEM_STATUS, IFlow } from '../../';

import { Item } from '../engine/Item';
import { Node, Element } from '.';
import { IExecution } from '../interfaces';

class Flow extends Element implements IFlow {
    from: Node;
    to: Node;
    def;
    isMessageFlow = false;
    constructor(id, type, from, to, def) {
        super();
        this.id = id;
        this.type = type;
        this.from = from;
        this.to = to;
        this.def = def;
        this.name = def.name;
        this.isFlow = true;
    }
    describe() {

        if (this.def.conditionExpression) {
            // conditionExpression:{"$type":"bpmn:Expression","body":"true"}
            let expression = this.def.conditionExpression.body;
            return [['condition: ' , expression]];
        }
        else
            super.describe();
    }
    /**
     * 
     * <Rule> if flow has a condition, it must be evaluated and if result is true flow will continue
     *  otherwise, flow will be discarded.
     * </Rule> 
     * @param item
     */
    run(item: Item) {
        item.token.log('Flow(' + this.name +'|'+ this.id + ').run: from='+this.from.name+' to=' + this.to.name + " find action... " );
        let action = FLOW_ACTION.take;
        if (this.def.conditionExpression) {
            // conditionExpression:{"$type":"bpmn:Expression","body":"true"}
            let expression = this.def.conditionExpression.body;
            item.token.log('..conditionExpression:' + JSON.stringify(expression));
            item.token.log(JSON.stringify(item.token.data));
            let result = item.token.execution.appDelegate.scopeEval(item, expression);
            item.token.log('..conditionExpression:' + expression + " result: " + result);
            if (result == false) {
                action = FLOW_ACTION.discard;
            }
        }
        item.token.log('Flow(' + this.name +'|'+ this.id + ').run: going to ' + this.to.id + " action : " + action);
        return action;
    }
    async execute(item) {

    }
}
// ---------------------------------------------
/**
* 
* <Rule>MessageFlow: can only be sent to active node in waiting
 * or to a start event
* </Rule>
* */
class MessageFlow extends Flow {
    isMessageFlow = true;

    async execute(item: Item) {
        item.token.log('..MessageFlow -' + this.id + ' going to ' + this.to.id);

        const execution:IExecution = item.token.execution;
        let token = null;

        execution.tokens.forEach(t => {
            if (t.currentNode && t.currentNode.id == this.to.id)
                token = t;
        });
        if (token) {
            item.token.log('    signalling token:' + token.id );
            execution.promises.push(token.signal(null));

        }
        else {
            item.token.log('    signalling new token:');
            execution.promises.push(Token.startNewToken(TOKEN_TYPE.Primary,execution, this.to, null, null, null, null));
        }
    }

}
export { Flow , MessageFlow}