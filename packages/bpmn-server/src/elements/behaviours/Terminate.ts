import { TimerBehaviour } from './Timer.js';
import { Node } from '../Node.js';
import { Behaviour } from './Behaviour.js';
import { Item } from "../../engine/Item.js";

/*
 * will terminate all active nodes as a result of terminate end event
 * 
 */
class TerminateBehaviour extends Behaviour {
    start(item: Item) { }
    end(item: Item) {

        item.token.execution.tokens.forEach(tok => {
            tok.terminate();
            });
    }
    describe() {
        return [['','Terminates all active nodes']];
    }
}

export { TerminateBehaviour }