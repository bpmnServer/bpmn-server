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
const __1 = require("..");
const fs = require('fs');
var seq = 1;
class MyAppDelegate extends __1.DefaultAppDelegate {
    constructor(logger = null) {
        super(logger);
        this.servicesProvider = new MyServices();
    }
    sendEmail(to, msg, body) {
        console.log(`sendign email to ${to}`);
    }
    executionStarted(execution) {
        const _super = Object.create(null, {
            executionStarted: { get: () => super.executionStarted }
        });
        return __awaiter(this, void 0, void 0, function* () {
            yield _super.executionStarted.call(this, execution);
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
            console.log("Add Service");
            console.log(v1, v2);
            return v1 + v2;
        });
    }
    service1(input, context) {
        return __awaiter(this, void 0, void 0, function* () {
            let item = context.item;
            seq++;
            let vName = item.elementId + '_input';
            let v = {};
            v[vName] = input;
            //item.setData(v);
            yield delay(50, 'test');
            item.token.log("SERVICE 1: input: " + JSON.stringify(input) + item.token.currentNode.id + " current seq: " + seq);
            console.log('appDelegate item:', item.elementId, item.seq, item.input, item.data);
            console.log('appDelegate service1 is now complete input:', input, 'output:', seq, 'item.data', item.id, item.data);
            return { seq, text: 'test' };
        });
    }
}
//# sourceMappingURL=appDelegate.js.map