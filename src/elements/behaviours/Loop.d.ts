import { Behaviour } from ".";
declare class LoopBehaviour extends Behaviour {
    init(): void;
    get collection(): any;
    isSequential(): any;
    describe(): string[];
}
export { LoopBehaviour };
