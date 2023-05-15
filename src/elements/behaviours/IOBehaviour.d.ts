import { Behaviour } from '.';
import type { Item } from "../../engine/Item";
declare class IOParameter {
    type: any;
    name: any;
    value: any;
    isInput(): boolean;
    isOutput(): boolean;
    constructor(type: any, name: any, value: any);
}
declare class IOBehaviour extends Behaviour {
    parameters: IOParameter[];
    init(): void;
    enter(item: Item): void;
    process(item: Item): void;
    exit(item: Item): void;
    describe(): string[][];
}
export { IOBehaviour };
