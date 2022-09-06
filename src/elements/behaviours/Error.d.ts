import { Behaviour } from '.';
import { Item } from "../../engine/Item";
import { NODE_ACTION } from "../../interfaces";
declare class ErrorEventBehaviour extends Behaviour {
    init(): void;
    start(item: Item): Promise<NODE_ACTION.wait | NODE_ACTION.error>;
    get errorId(): any;
    describe(): string[];
}
export { ErrorEventBehaviour };
