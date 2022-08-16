"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AssignRule = exports.Assignment = void 0;
const _1 = require(".");
const { v4: uuidv4 } = require('uuid');
class Assignment {
    constructor() {
        this.id = uuidv4();
    }
    describe() {
        const user = (this.userGroup ? this.userGroup : this.userId);
        return `Assign Task to '${user}' by Rule: ${this.ruleId} by Rule: ${this.ruleId}`;
    }
    /**

     * */
    execute(context) {
        return __awaiter(this, void 0, void 0, function* () {
        });
    }
}
exports.Assignment = Assignment;
class AssignRule extends _1.AccessRule {
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
exports.AssignRule = AssignRule;
//# sourceMappingURL=Assignment.js.map