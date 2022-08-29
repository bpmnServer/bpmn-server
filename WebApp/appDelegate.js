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
exports.MyAppDelegate = void 0;
const index_1 = require("./index");
const fs = require('fs');
var seq = 1;
class MyAppDelegate extends index_1.DefaultAppDelegate {
    constructor(server) {
        super(server);
        this.servicesProvider = new MyServices();
    }
    sendEmail(to, msg, body) {
        console.log(`Sending email to ${to}`);
        const key = process.env.SENDGRID_API_KEY;
        if (key && (key != '')) {
            const sgMail = require('@sendgrid/mail');
            sgMail.setApiKey(process.env.SENDGRID_API_KEY);
            const email = {
                to: to,
                from: 'ralphhanna@hotmail.com',
                subject: msg,
                text: body,
                html: body
            };
            sgMail
                .send(email)
                .then((response) => {
                this.server.logger.log('responseCode', response[0].statusCode);
                this.server.logger.log('responseHeaders', response[0].headers);
            })
                .catch((error) => {
                console.error('Email Error:' + error);
            });
        }
        else {
            console.log(`email is disabled`);
        }
    }
    executionStarted(execution) {
        const _super = Object.create(null, {
            executionStarted: { get: () => super.executionStarted }
        });
        return __awaiter(this, void 0, void 0, function* () {
            yield _super.executionStarted.call(this, execution);
        });
    }
    executionEvent(context, event) {
        return __awaiter(this, void 0, void 0, function* () {
            if (context.item) {
                //            console.log(`----->Event: '${event}' for ${context.item.element.type} '${context.item.element.id}' id: ${context.item.id}`);
                if (event == 'wait' && context.item.element.type == 'bpmn:UserTask')
                    console.log(`----->Waiting for User Input for '${context.item.element.id}' id: ${context.item.id}`);
            }
            //       else
            //           console.log('----->All:' + event, context.definition.name);
        });
    }
    messageThrown(messageId, data, matchingQuery, item) {
        const _super = Object.create(null, {
            messageThrown: { get: () => super.messageThrown }
        });
        return __awaiter(this, void 0, void 0, function* () {
            yield _super.messageThrown.call(this, messageId, data, matchingQuery, item);
        });
    }
    signalThrown(signalId, data, matchingQuery, item) {
        const _super = Object.create(null, {
            signalThrown: { get: () => super.signalThrown }
        });
        return __awaiter(this, void 0, void 0, function* () {
            yield _super.signalThrown.call(this, signalId, data, matchingQuery, item);
        });
    }
    serviceCalled(input, context) {
        return __awaiter(this, void 0, void 0, function* () {
            this.server.logger.log("service called");
        });
    }
}
exports.MyAppDelegate = MyAppDelegate;
function delay(time, result) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("delaying ... " + time);
        return new Promise(function (resolve) {
            setTimeout(function () {
                console.log("delayed is done.");
                resolve(result);
            }, time);
        });
    });
}
class MyServices {
    serviceTask(input, context) {
        return __awaiter(this, void 0, void 0, function* () {
            let item = context.item;
            console.log(" Hi this is the serviceTask from appDelegate");
            console.log(item);
            yield delay(5000, 'test');
            console.log(" Hi this is the serviceTask from appDelegate says bye");
        });
    }
    add({ v1, v2 }) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("Add Service", v1, v2);
            return Number(v1) + Number(v2);
        });
    }
    service1(input, context) {
        return __awaiter(this, void 0, void 0, function* () {
            let item = context.item;
            seq++;
            yield delay(5000, 'test');
            item.token.log("SERVICE 1: input: " + input + item.token.currentNode.id + " current seq: " + seq);
            console.log('appDelegate service1 is now complete input:', input, 'output:', seq);
            return { seq, text: 'test' };
        });
    }
}
//# sourceMappingURL=appDelegate.js.map