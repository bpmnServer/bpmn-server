import { AccessRule } from ".";
import { IExecution } from "../interfaces";

const { v4: uuidv4 } = require('uuid');

class Involvement {
    id = uuidv4();
    ruleId;
    userId;
    assignActor;
    describe() {
        return `Designate '${this.userId}' as '${this.assignActor}' by Rule: ${this.ruleId}`;
    }

    static invoke(rule: DesignateRule, context: IExecution) {
        const inv = new Involvement();
        inv.ruleId = rule.id;
        rule.assignUser(inv, context);
        inv.assignActor = rule.assignActor;
        context.instance.involvements.push(inv);
    }
}

class DesignateRule extends AccessRule {
    constructor({ id, user = null, userGroup = null, assignActor = null }) {

        super('DesignateRule', id, user, userGroup, null, 'process.start', null);
        this.assignActor = assignActor;
    }
    invoke(context: IExecution) {
        Involvement.invoke(this, context);
    }
    describe() {
        return `#${this.id} Designate '${this.describeUser()}' as '${this.assignActor}'`;
    }
}

export {  Involvement , DesignateRule }