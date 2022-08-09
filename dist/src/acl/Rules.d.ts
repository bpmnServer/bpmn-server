import { IExecution } from "../interfaces/engine";
/**
 *  Notify Rule
 *  Notify {user} on {event} of {object} using {template}
 *
 *
 **/
declare class AccessRule {
    type: any;
    id: any;
    event: any;
    user: any;
    actor: any;
    userGroup: any;
    element: any;
    privilege: any;
    template: any;
    assignActor: any;
    delay: any;
    repeat: any;
    cancelEvent: any;
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
    
     * @param template
     * @param assignActor
     *
     * -- delay
     *
     * @param delay
     * @param repeat
     * @param cancelEvent
     *
     */
    constructor(type: any, id: any, user: any, userGroup: any, actor: any, event: any, element?: any);
    invoke(context: any): void;
    assignUser(obj: any, context: any): void;
    getActor(context: any, actor: any): any;
    describe(): string;
    describeUser(): string;
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
/**
 *  Notify Rule
 *  Notify {user} on {event} of {object} using {template}
 *
 *
 * */
declare class NotifyRule extends AccessRule {
    constructor({ id, user, userGroup, actor, event, element, assignActor, template, privilege, delay, repeat, cancelEvent }: {
        id: any;
        user?: any;
        userGroup?: any;
        actor?: any;
        event: any;
        element?: any;
        assignActor?: any;
        template?: any;
        privilege?: any;
        delay?: any;
        repeat?: any;
        cancelEvent?: any;
    });
    invoke(context: IExecution): void;
    describe(): string;
}
/**
 *  Notify Rule
 *  Notify {user} on {event} of {object} using {template}
 *
 *
 * */
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
export { AssignRule, DesignateRule, NotifyRule, AuthorizeRule };
