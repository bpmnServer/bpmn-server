import { AccessRule } from ".";
import { IExecution } from "../interfaces";

const { v4: uuidv4 } = require('uuid');

class Assignment {
    id = uuidv4();
    ruleId;
    userId;
    userName;
    userGroup;
    dateCreated;
    describe() {
        const user=(this.userGroup ? this.userGroup : this.userId);
        return `Assign Task to '${user}' by Rule: ${this.ruleId} by Rule: ${this.ruleId}`;
    }
    /**

     * */
    async execute(context: IExecution) {

    }
}


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
    constructor({ id, user = null, userGroup = null, actor = null, event, element = null }) {
        super('AssignRule', id, user, userGroup, actor, event, element);
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

export { Assignment , AssignRule}