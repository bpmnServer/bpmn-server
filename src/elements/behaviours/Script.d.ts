import { Behaviour } from '.';
declare class ScriptBehaviour extends Behaviour {
    scripts: string[];
    init(): void;
    describe(): any[];
}
export { ScriptBehaviour };
