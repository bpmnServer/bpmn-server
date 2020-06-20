import { TimerBehaviour } from ".";
import { Node } from "..";
import { Behaviour } from '.';
import { Item } from "../../engine/Item";

/*
 * will prepare input at start
 * will prepare output at end
 *
 */
class IOBehaviour extends Behaviour {
    start(item: Item) {
    }
    end(item: Item) {

    }
    describe() {
        return ['', 'manages IO'];
    }
}

export { IOBehaviour }