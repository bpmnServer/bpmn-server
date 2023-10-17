"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthorizeRule = exports.Authorization = void 0;
const _1 = require(".");
const { v4: uuidv4 } = require('uuid');
class Authorization {
    constructor() {
        this.id = uuidv4();
    }
    describe() {
        const user = (this.userGroup ? this.userGroup : this.userId);
        return `Authorize '${user}' to '${this.privilege}' by Rule: ${this.ruleId}`;
    }
}
exports.Authorization = Authorization;
/**
 * Authorize {user/group} {privilege} to {process/element}
 * Privilege:
 *      View
 *      Edit
 *      Perform
 *      Assign
 * */
class AuthorizeRule extends _1.AccessRule {
    constructor({ id, user = null, userGroup = null, actor = null, element = null, privilege = null }) {
        const event = element == null ? 'process.start' : 'start';
        super('AuthorizeRule', id, user, userGroup, actor, event, element);
        this.privilege = privilege;
    }
    invoke(context) {
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
exports.AuthorizeRule = AuthorizeRule;
//# sourceMappingURL=Authorization.js.map