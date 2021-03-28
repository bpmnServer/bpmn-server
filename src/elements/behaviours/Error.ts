import { TimerBehaviour } from ".";
import { Node } from "..";
import { Behaviour } from '.';
import { Item } from "../../engine/Item";
import { NODE_SUBTYPE } from "../../..";
import { NODE_ACTION } from "../../interfaces";


class ErrorEventBehaviour extends Behaviour {
    init() {
        this.node.subType = NODE_SUBTYPE.error;

    }
    async start(item: Item) {
        item.context.logger.log("staring an Error Events "+this.node.isCatching);
        if (this.node.isCatching) {
            return NODE_ACTION.wait;
        }
        else {  // throw a message
            item.context.logger.log("Error Event is throwing an error");
            
            return NODE_ACTION.error;

             const output = await this.node.getOutput(item);
            const matchingKey = item.context.messageMatchingKey;
            item.token.log(`.Throwing Message <${this.errorId}> - output: ${JSON.stringify(output)} - matching key : ${JSON.stringify(matchingKey)}`);
            await item.context.appDelegate.messageThrown(this.errorId,output, matchingKey, item);
        }

    }

    get errorId() {
        if (this.definition['errormessageRef'])
            return this.definition['messageRef']['id'];
    }
    describe() {
        if (this.node.isCatching) 
            return ['Message', `catches message '${this.errorId}'`];
        else
            return ['Message', `throws message '${this.errorId}'`];
    }
}
export { ErrorEventBehaviour}