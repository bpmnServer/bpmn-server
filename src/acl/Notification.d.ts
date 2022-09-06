import { AccessRule } from ".";
import { IExecution } from "../interfaces";
declare class Notification {
    id: any;
    ruleId: any;
    userId: any;
    userName: any;
    userGroup: any;
    event: any;
    eventDate: any;
    template: any;
    delay: any;
    status: any;
    issueDate: any;
    repeat: any;
    cancelEvent: any;
    cancelDate: any;
    dateCreated: any;
    text: any;
    static invoke(rule: NotifyRule, context: IExecution): void;
    /**
     * will issue the notification through email
     * if delayed, will wait for the cron job to execute it
     *
     * Step 1:  build the template
     *
     * Step 2:  Issue the email;
     * */
    execute(context: IExecution): Promise<void>;
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
export { Notification, NotifyRule };
