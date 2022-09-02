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
export { AccessRule };
