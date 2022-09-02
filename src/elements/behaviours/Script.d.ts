import { Behaviour } from '.';
declare class ScriptBehaviour extends Behaviour {
    event: any;
    scripts: string[];
    init(): void;
    describe(): (string | string[])[];
}
export { ScriptBehaviour };
