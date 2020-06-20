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
const _1 = require(".");
const fs = require('fs');
var seq = 1;
class MyAppDelegate extends _1.DefaultAppDelegate {
    constructor(logger = null) {
        super(logger);
    }
    executionStarted(execution) {
        super.executionStarted(execution);
    }
    executionEvent({ event, item, execution }) {
        return __awaiter(this, void 0, void 0, function* () {
            let object;
            if (event.startsWith('execution.'))
                object = execution;
            else
                object = item;
        });
    }
    messageIssued(item) { }
    signalIssued(item) { }
    serviceTask(item) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(" Hi this is the serviceTask from appDelegate");
            console.log(item);
            yield delay(5000, 'test');
            console.log(" Hi this is the serviceTask from appDelegate says bye");
        });
    }
    serviceCalled(item) {
        return __awaiter(this, void 0, void 0, function* () {
        });
    }
    service1(item) {
        return __awaiter(this, void 0, void 0, function* () {
            seq++;
            yield delay(3000 - (seq * 100), 'test');
            item.token.log("SERVICE 1" + item.token.currentNode.id);
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
//# sourceMappingURL=appDelegate.js.map