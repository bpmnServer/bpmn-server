import { AccessRule } from ".";
import { IExecution } from "../interfaces";
declare class Authorization {
    id: any;
    ruleId: any;
    userId: any;
    userName: any;
    userGroup: any;
    privilege: any;
    dateCreated: any;
    describe(): string;
}
/**
 * Authorize {user/group} {privilege} to {process/element}
 * Privilege:
 *      View
 *      Edit
 *      Perform
 *      Assign
 * */
declare class AuthorizeRule extends AccessRule {
    constructor({ id, user, userGroup, actor, element, privilege }: {
        id: any;
        user?: any;
        userGroup?: any;
        actor?: any;
        element?: any;
        privilege?: any;
    });
    invoke(context: IExecution): void;
    describe(): string;
}
export { Authorization, AuthorizeRule };
