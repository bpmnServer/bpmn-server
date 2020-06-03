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
exports.MyHandler = void 0;
const src_1 = require("../src");
const fs = require('fs');
var seq = 1;
class MyHandler {
    constructor(logger = null) {
    }
    executionStarted(execution) { }
    messageIssued(messageId, data, item) { }
    signalIssued(messageId, data, item) { }
    serviceCalled(elementId, data, item) { }
    service1(item) {
        return __awaiter(this, void 0, void 0, function* () {
            seq++;
            yield delay(15000 - (seq * 100), 'test');
            item.token.log("SERVICE 1" + item.token.currentNode.id);
        });
    }
    nodeResponse(item) {
        throw new Error("Method not implemented.");
    }
    flowResponse(item) {
        let flow = item.element;
        let action = src_1.FLOW_ACTION.take; // default
        let data = item.token.data;
        if (flow) {
            item.token.log('=== ' + flow.id);
            //        console.log(msg);
            if (flow.id == 'flow_gateway_repair') {
                if (data.needsRepairs == false)
                    action = src_1.FLOW_ACTION.discard;
                item.token.log(data);
            }
        }
        return action;
    }
}
exports.MyHandler = MyHandler;
function delay(time, result) {
    let i = 0;
    for (i = 0; i < (time / 500); i++) {
        let file = fs.readFileSync('./modlle2.txt', { encoding: 'utf8', flag: 'r' });
    }
    console.log("read the file " + i);
}
function delay2(time, result) {
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
//# sourceMappingURL=handler.js.map