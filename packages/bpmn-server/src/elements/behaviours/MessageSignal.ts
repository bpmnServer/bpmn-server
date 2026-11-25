import type { TimerBehaviour } from './Timer.js';
import type { Node } from '../Node.js';
import { Behaviour } from './Behaviour.js';
import { Item } from "../../engine/Item.js";
import { NODE_SUBTYPE } from '../../interfaces/Enums.js';
import { itemContext } from '../../engine/Context.js';

/**
 * A throw's output and its matching key (docs/docs/examples/msg-throw-catch.md): an output field `matchingKey` is the
 * key, not part of what is thrown; else what a script set, `this.context.messageMatchingKey`. Either is this throw's
 * only: the execution's is cleared, so a later throw in the same run is not narrowed by it.
 */
function takeMatchingKey(item: Item, output: any): { output: any; matchingKey: any } {
    let matchingKey = item.context.messageMatchingKey;
    item.context.messageMatchingKey = undefined;
    if (output && typeof output === 'object' && !Array.isArray(output) && 'matchingKey' in output) {
        ({ matchingKey, ...output } = output);
    }
    return { output, matchingKey };
}
/**
 * 
 * 
 * it is part of the following:
 * 
 *  events
 *  sendTask
 *  receiveTask
 * */

class MessageEventBehaviour extends Behaviour {
    init() {
        this.node.messageId = this.messageId;
        this.node.subType = NODE_SUBTYPE.message;

    }
    async start(item: Item) {
        item.log("message event behaviour start");
        if (this.node.isCatching) {
            item.messageId = this.messageId;
        }
        else {  // throw a message
            const { output, matchingKey } = takeMatchingKey(item, await this.node.getOutput(item));
            item.token.log(`.Throwing Message <${this.messageId}> - output: ${JSON.stringify(output)} - matching key : ${JSON.stringify(matchingKey)}`);
            await item.context.appDelegate.messageThrown(this.messageId,output, matchingKey, item, itemContext(item, { what: 'message', input: output }));
        }

    }
    end(item: Item) {

    }
    get messageId() {
        if (this.definition['messageRef'])
            return this.definition['messageRef']['name'];
    }
    describe() {
        if (this.node.isCatching) 
            return [['Message', `catches message '${this.messageId}'`]];
        else
            return [['Message', `throws message '${this.messageId}'`]];
    }
}
class SignalEventBehaviour extends Behaviour {
    init() {
        this.node.signalId = this.signalId;
        this.node.subType = NODE_SUBTYPE.signal;
    }
    async start(item: Item) {

        if (this.node.isCatching) {
            item.signalId = this.signalId;
        }
        else {  // throw a message
            const { output, matchingKey } = takeMatchingKey(item, await this.node.getOutput(item));
            item.token.log(`.Throwing Signal <${this.signalId}> - output: ${JSON.stringify(output)} - matching key : ${JSON.stringify(matchingKey)}`);
            // Awaited, as a message's is: the delegate's decision is part of the step, and its failure the step's.
            await item.context.appDelegate.signalThrown(this.signalId, output, matchingKey, item, itemContext(item, { what: 'signal', input: output }));
        }


    }
    end(item: Item) {
    }
    describe() {
        if (this.node.isCatching)
            return [['Signal', `catches signal '${this.signalId}'`]];
        else
            return [['Signal', `throws signal '${this.signalId}'`]];
    }
    get signalId() {
        if (this.definition['signalRef'])
            return this.definition['signalRef']['name'];
    }
}

export { MessageEventBehaviour , SignalEventBehaviour}