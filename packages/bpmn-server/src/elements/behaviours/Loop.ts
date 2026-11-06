import { TimerBehaviour } from './Timer.js';
import { Node } from '../Node.js';
import { Behaviour } from './Behaviour.js';
import { Item } from "../../engine/Item.js";

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
    /** The name each round's element takes in its data (camunda:elementVariable); none: rounds get nothing. */
    get elementVariable(): string | undefined {
        const lc = this.node.def.loopCharacteristics;
        return lc.elementVariable ?? lc.$attrs?.['camunda:elementVariable'] ?? undefined;
    }
    /** The multi-instance loop's completion condition: checked after each round; true, no more rounds. */
    get completionCondition(): string | undefined {
        return this.node.def.loopCharacteristics.completionCondition?.body || undefined;
    }

    isSequential() {
        if (this.node.def.loopCharacteristics.isSequential)
            return this.node.def.loopCharacteristics.isSequential;
        else
            return false;
    }
    describe() {
        if (this.isSequential())
            return [['loop', `is a sequential loop based on '${this.collection}'`]];
        else
            return [['loop', `is a parallel loop based on '${this.collection}'`]];

    }

}

export { LoopBehaviour }