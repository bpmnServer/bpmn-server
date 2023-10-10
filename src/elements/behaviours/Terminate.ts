import { TimerBehaviour } from ".";
import { Node } from "..";
import { Behaviour } from '.';
import { Item } from "../../engine/Item";

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
        return ['','Terminates all active nodes'];
    }
}

export { TerminateBehaviour }