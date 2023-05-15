import { Behaviour } from '.';
import { Item } from "../../engine/Item";
import { NODE_ACTION } from "../../interfaces";
declare class EscalationEventBehaviour extends Behaviour {
    init(): void;
    start(item: Item): Promise<NODE_ACTION.continue | NODE_ACTION.wait>;
    get escalationId(): any;
    describe(): string[];
}
export { EscalationEventBehaviour };
