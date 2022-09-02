import { Behaviour } from '.';
import { Item } from "../../engine/Item";
declare class TerminateBehaviour extends Behaviour {
    start(item: Item): void;
    end(item: Item): void;
    describe(): string[];
}
export { TerminateBehaviour };
