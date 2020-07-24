import { Behaviour } from '.';
import { Item } from "../../..";
declare class ScriptBehaviour extends Behaviour {
    event: any;
    script: any;
    init(): void;
    start(item: Item): void;
    run(item: Item): void;
    end(item: Item): void;
    resume(item: Item): void;
    executeScript(item: any): void;
    describe(): any[];
}
export { ScriptBehaviour };
