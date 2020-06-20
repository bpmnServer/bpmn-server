import { TimerBehaviour } from ".";
import { Node } from '..';
import {Behaviour } from ".";
import { Item } from "../../engine/Item";
class LoopBehaviour extends Behaviour {
    init() {
    }

    get collection() {
        if (this.node.def.loopCharacteristics.collection)
            return this.node.def.loopCharacteristics.collection;
        else {
            return this.node.def.loopCharacteristics.$attrs["camunda:collection"];
        }
    }
    isSequential() {
        return this.node.def.isSequential;
    }
    describe() {
        if (this.isSequential)
            return ['loop', `is a sequential loop based on '${this.collection}'`];
        else
            return ['loop', `is a parallel loop based on '${this.collection}'`];

    }

}

export { LoopBehaviour }