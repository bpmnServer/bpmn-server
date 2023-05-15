import { Behaviour } from ".";
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
declare class LoopBehaviour extends Behaviour {
    init(): void;
    get collection(): any;
    isStandard(): boolean;
    isSequential(): any;
    describe(): string[];
}
export { LoopBehaviour };
