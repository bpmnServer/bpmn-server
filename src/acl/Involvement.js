"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DesignateRule = exports.Involvement = void 0;
const _1 = require(".");
const { v4: uuidv4 } = require('uuid');
class Involvement {
    constructor() {
        this.id = uuidv4();
    }
    describe() {
        return `Designate '${this.userId}' as '${this.assignActor}' by Rule: ${this.ruleId}`;
    }
    static invoke(rule, context) {
        const inv = new Involvement();
        inv.ruleId = rule.id;
        rule.assignUser(inv, context);
        inv.assignActor = rule.assignActor;
        context.instance.involvements.push(inv);
    }
}
exports.Involvement = Involvement;
class DesignateRule extends _1.AccessRule {
    constructor({ id, user = null, userGroup = null, assignActor = null }) {
        super('DesignateRule', id, user, userGroup, null, 'process.start', null);
        this.assignActor = assignActor;
    }
    invoke(context) {
        Involvement.invoke(this, context);
    }
    describe() {
        return `#${this.id} Designate '${this.describeUser()}' as '${this.assignActor}'`;
    }
}
exports.DesignateRule = DesignateRule;
//# sourceMappingURL=Involvement.js.map