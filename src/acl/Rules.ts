import { Assignment , Involvement , Notification , Authorization } from "./Repository";
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
/**
 * Authorize {user/group} {privilege} to {process/element}
 * Privilege:
 *      View
 *      Edit
 *      Perform
 *      Assign
 * */
class AuthorizeRule extends AccessRule {
    constructor({id, user = null, userGroup = null, actor = null, element = null,
        privilege = null } ) {
        const event = element == null ? 'process.start' : 'start';

        super('AuthorizeRule',id, user, userGroup, actor, event, element);
        this.privilege = privilege;
        
    }
    invoke(context: IExecution) {

        const auth = new Authorization();
        auth.ruleId = this.id;
        this.assignUser(auth, context);
        auth.privilege = this.privilege;
        if (context.item)
            context.item.authorizations.push(auth);
        else
            context.instance.authorizations.push(auth);

    }
    describe() {
        let target;
        if (this.element)
            target = this.element;
        else
            target = 'Process';
        
        return `#${this.id} Authorize '${this.describeUser()}' to '${this.privilege}' on '${target}'`;
    }
}
class DesignateRule extends AccessRule {
    constructor({ id,user = null, userGroup = null,assignActor = null}) {

        super('DesignateRule',id,user, userGroup, null, 'process.start', null);
        this.assignActor = assignActor;
    }
    invoke(context: IExecution) {
        const inv = new Involvement();
        inv.ruleId = this.id;
        this.assignUser(inv, context);
        inv.assignActor = this.assignActor;
        context.instance.involvements.push(inv);
    }
    describe() {
        return `#${this.id} Designate '${this.describeUser()}' as '${this.assignActor}'`;
    }
}
/**
 *  Notify Rule
 *  Notify {user} on {event} of {object} using {template}
 *
 *
 * */
class NotifyRule extends AccessRule {

    constructor({ id,user = null, userGroup = null, actor = null, event, element = null,
        assignActor = null,
        template = null, privilege = null,
        delay = null, repeat = null, cancelEvent = null }) {
        super('NotifyRule',id,user, userGroup, actor, event, element);
    }
    invoke(context: IExecution) {
        const note = new Notification();
        note.ruleId = this.id;
        this.assignUser(note, context);
        note.event = this.event;
        //note.eventDate = today;
        note.template = this.template;
        note.delay = this.delay;
        note.status;     // created; but not issued
        // issued;
        // cancelled
        note.issueDate;  //  eventDate+delay
        note.repeat = this.repeat;
        note.cancelEvent = this.cancelEvent;
        note.dateCreated;
        note.text;

        note.execute(context);

        context.item.notifications.push(note);
    }
    describe() {
        return `#${this.id} Notify '${this.describeUser()}' on '${this.event}' of Element '${this.element}' using '${this.template}' Template`;
    }

}
/**
 *  Notify Rule
 *  Notify {user} on {event} of {object} using {template}
 *
 *
 * */
class AssignRule extends AccessRule {
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
    constructor({ id,user = null, userGroup = null, actor = null, event, element = null }) {
        super('AssignRule',id,user, userGroup, actor, event, element);
    }
    invoke(context) {
        const note = new Assignment();
        note.ruleId = this.id;
        this.assignUser(note, context);
        //note.eventDate = today;
        // issued;
        // cancelled

        context.item.assignments.push(note);
    }
    describe() {
        return `#${this.id} Assign '${this.describeUser()}' to '${this.element}' on '${this.event}'`;
    }

}
export { AssignRule, DesignateRule, NotifyRule , AuthorizeRule}