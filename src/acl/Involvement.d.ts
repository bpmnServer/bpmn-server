import { AccessRule } from ".";
import { IExecution } from "../interfaces";
declare class Involvement {
    id: any;
    ruleId: any;
    userId: any;
    assignActor: any;
    describe(): string;
    static invoke(rule: DesignateRule, context: IExecution): void;
}
declare class DesignateRule extends AccessRule {
    constructor({ id, user, userGroup, assignActor }: {
        id: any;
        user?: any;
        userGroup?: any;
        assignActor?: any;
    });
    invoke(context: IExecution): void;
    describe(): string;
}
export { Involvement, DesignateRule };
