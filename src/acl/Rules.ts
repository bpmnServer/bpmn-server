import { Assignment , Involvement , Notification , Authorization } from "./";
import { IExecution } from "../interfaces/engine";


/**
 *  Notify Rule
 *  Notify {user} on {event} of {object} using {template}
 *  
 *  
 **/

class AccessRule {
    type;
    id;
    event;
    /* user specs */
    user;
    actor;
    userGroup;

    /* target */
    element;

    privilege;      /* for Authorize Only */

    template;       /* for notification */
    assignActor;    /* for Designate only */
    delay;
    repeat;
    cancelEvent;
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
    constructor(type,id, user = null, userGroup = null, actor = null, event, element = null ) {
        this.id = id;
        this.type = type;
        this.user = user;
        this.userGroup = userGroup;
        this.actor = actor;
        this.event = event;
        this.element = element;
    }
    invoke(context) {

        let desc = '****>Matched  rule:    ' + this.constructor.name;

        desc += ' for: ' + context.process.name;
        if (context.item)
            desc += ' Element:' + context.item.element.id;

        if (this.user)
            desc += ' user:' + this.user;

    }
    assignUser(obj, context) {

            if (this.actor) {
                obj.userId = this.getActor(context, this.actor);
            }
            else {
                if (this.user == '$current' && context.currentUser)
                    this.user = context.currentUser.userId;
                obj.userId = this.user;
                obj.userGroup = this.userGroup;

            }
    }
    getActor(context, actor) {
        const invls = context.execution.instance.involvements;
        let userId;
        invls.forEach(invl => {
            if (invl.assignActor == actor)
                userId = invl.userId;
        });
        return userId;
    }
    describe() {
        return "Access Rule?";
    }
    describeUser() {
        if (this.user)
            return `User: '${this.user}'`;
        if (this.userGroup)
            return `User Group: '${this.userGroup}'`;
        if (this.actor)
            return `Actor: '${this.actor}'`;
    }

}

export { AccessRule}