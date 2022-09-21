import type { TimerBehaviour } from ".";
import type { Node } from "..";
import { Behaviour } from '.';
import { Item } from "../../engine/Item";
import { NODE_SUBTYPE } from "../../..";
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
        item.context.logger.log("message event behaviour start");
        if (this.node.isCatching) {
            item.messageId = this.messageId;
        }
        else {  // throw a message
            const output = await this.node.getOutput(item);
            const matchingKey = item.context.messageMatchingKey;
            item.token.log(`.Throwing Message <${this.messageId}> - output: ${JSON.stringify(output)} - matching key : ${JSON.stringify(matchingKey)}`);
            await item.context.appDelegate.messageThrown(this.messageId,output, matchingKey, item);
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
            return ['Message', `catches message '${this.messageId}'`];
        else
            return ['Message', `throws message '${this.messageId}'`];
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
            const output = await this.node.getOutput(item);
            const matchingKey = item.context.messageMatchingKey;
            item.token.log(`.Throwing Signal <${this.signalId}> - output: ${JSON.stringify(output)} - matching key : ${JSON.stringify(matchingKey)}`);
            item.context.appDelegate.signalThrown(this.signalId, output, matchingKey, item);
        }


    }
    end(item: Item) {
    }
    describe() {
        if (this.node.isCatching)
            return ['Signal', `catches signal '${this.signalId}'`];
        else
            return ['Signal', `throws signal '${this.signalId}'`];
    }
    get signalId() {
        if (this.definition['signalRef'])
            return this.definition['signalRef']['name'];
    }
}

export { MessageEventBehaviour , SignalEventBehaviour}