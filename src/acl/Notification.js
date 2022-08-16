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
exports.NotifyRule = exports.Notification = void 0;
const _1 = require(".");
const { v4: uuidv4 } = require('uuid');
class Notification {
    constructor() {
        this.id = uuidv4();
    }
    static invoke(rule, context) {
        const note = new Notification();
        note.ruleId = rule.id;
        rule.assignUser(note, context);
        note.event = rule.event;
        //note.eventDate = today;
        note.template = rule.template;
        note.delay = rule.delay;
        note.status; // created; but not issued
        // issued;
        // cancelled
        note.issueDate; //  eventDate+delay
        note.repeat = rule.repeat;
        note.cancelEvent = rule.cancelEvent;
        note.dateCreated;
        note.text;
        note.execute(context);
        context.item.notifications.push(note);
    }
    /**
     * will issue the notification through email
     * if delayed, will wait for the cron job to execute it
     *
     * Step 1:  build the template
     *
     * Step 2:  Issue the email;
     * */
    execute(context) {
        return __awaiter(this, void 0, void 0, function* () {
            const pug = require('pug');
            const template = this.template ? this.template : 'default';
            let users;
            context.logger.log("Notification:execute" + this.describe());
            if (this.userGroup) {
                context.logger.log("User Group:" + this.userGroup);
                users = yield context.server.iam.getUsersForGroup(this.userGroup);
            }
            else
                users = [yield context.server.iam.getUser(this.userId)];
            users.forEach(user => {
                if (user) {
                    const path = context.server.configuration.templatesPath + '/' + template;
                    const msg = pug.renderFile(path + '.message.pug', { context, notification: this, user });
                    const body = pug.renderFile(path + '.body.pug', { context, notification: this, user });
                    console.log("email msg", msg, user);
                    console.log("emailbody", body);
                    context.server.appDelegate.sendEmail(user.email, msg, body);
                }
            });
        });
    }
    describe() {
        const user = (this.userGroup ? this.userGroup : this.userId);
        return `Notify '${user}' on '${this.event}' by Rule: ${this.ruleId}`;
    }
}
exports.Notification = Notification;
/**
 *  Notify Rule
 *  Notify {user} on {event} of {object} using {template}
 *
 *
 * */
class NotifyRule extends _1.AccessRule {
    constructor({ id, user = null, userGroup = null, actor = null, event, element = null, assignActor = null, template = null, privilege = null, delay = null, repeat = null, cancelEvent = null }) {
        super('NotifyRule', id, user, userGroup, actor, event, element);
    }
    invoke(context) {
        const note = new Notification();
        note.ruleId = this.id;
        this.assignUser(note, context);
        note.event = this.event;
        //note.eventDate = today;
        note.template = this.template;
        note.delay = this.delay;
        note.status; // created; but not issued
        // issued;
        // cancelled
        note.issueDate; //  eventDate+delay
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
exports.NotifyRule = NotifyRule;
//# sourceMappingURL=Notification.js.map