import { Behaviour } from '.';
import { Item } from "../../engine/Item";
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
    start(item: Item): void;
    end(item: Item): void;
    describe(): string[];
}
export { IOBehaviour };
