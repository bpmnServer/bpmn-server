import { AccessRule } from ".";
import { IExecution } from "../interfaces";
declare class Assignment {
    id: any;
    ruleId: any;
    userId: any;
    userName: any;
    userGroup: any;
    dateCreated: any;
    describe(): string;
    /**

     * */
    execute(context: IExecution): Promise<void>;
}
declare class AssignRule extends AccessRule {
    /**
     * -- user spec
     * @param user
     * @param userGroup
     * @param actor
     *
     * @param event
     *
     * -- target object
     * @param element

     */
    constructor({ id, user, userGroup, actor, event, element }: {
        id: any;
        user?: any;
        userGroup?: any;
        actor?: any;
        event: any;
        element?: any;
    });
    invoke(context: any): void;
    describe(): string;
}
export { Assignment, AssignRule };
