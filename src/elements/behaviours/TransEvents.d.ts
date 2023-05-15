import { Behaviour } from '.';
import { Item } from "../../engine/Item";
import { NODE_ACTION } from "../../interfaces";
declare class CancelEventBehaviour extends Behaviour {
    init(): void;
    start(item: Item): Promise<NODE_ACTION.wait | NODE_ACTION.error>;
    describe(): string[];
}
declare class CompensateEventBehaviour extends Behaviour {
    init(): void;
    start(item: Item): Promise<NODE_ACTION>;
    get TransactionId(): any;
    describe(): string[];
}
export { CompensateEventBehaviour, CancelEventBehaviour };
