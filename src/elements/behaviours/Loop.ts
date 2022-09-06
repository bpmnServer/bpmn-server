import { TimerBehaviour } from ".";
import { Node } from '..';
import {Behaviour } from ".";
import { Item } from "../../engine/Item";

/**
 * 
 * 1.   sequential:
 *       <bpmn2:multiInstanceLoopCharacteristics isSequential="true" />
 * 2.   parallel
 *       <bpmn2:multiInstanceLoopCharacteristics  />
 * 3.   repeater
 *       <bpmn2:standardLoopCharacteristics />
 * 
 */
class LoopBehaviour extends Behaviour {
    init() {
    }

    get collection() {
        if (this.isStandard())
            return null;
        else if (this.node.def.loopCharacteristics.collection)
            return this.node.def.loopCharacteristics.collection;
        else {
            return this.node.def.loopCharacteristics.$attrs["camunda:collection"];
        }
    }
    isStandard() {
        return (this.node.def.loopCharacteristics['$type'] =='bpmn:StandardLoopCharacteristics');
    }

    isSequential() {
        if (this.node.def.isSequential)
            return this.node.def.isSequential;
        else
            return false;
    }
    describe() {
        if (this.isSequential)
            return ['loop', `is a sequential loop based on '${this.collection}'`];
        else
            return ['loop', `is a parallel loop based on '${this.collection}'`];

    }

}

export { LoopBehaviour }