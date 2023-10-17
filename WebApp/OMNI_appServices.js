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
exports.AppServices = void 0;
var seq = 0;
class AppServices {
    serviceTask(input, context) {
        return __awaiter(this, void 0, void 0, function* () {
            let item = context.item;
            console.log(" Hi this is the serviceTask from appDelegate");
            console.log(item.elementId);
            yield delay(5000, 'test');
            console.log(" Hi this is the serviceTask from appDelegate says bye");
        });
    }
    simulateCrash(input, context) {
        return __awaiter(this, void 0, void 0, function* () {
            let item = context.item;
            let data = item.token.data;
            if (data['crash'] == 'Yes') {
                data['crash'] = 'No';
                yield item.token.execution.save();
                console.log('Will Crash now', item.token.data);
                process.exit(100);
            }
            else
                console.log('no crash');
        });
    }
    add({ v1, v2 }) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("Add Service", v1, v2);
            return Number(v1) + Number(v2);
        });
    }
    service99() {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('>>>>>>>>>>appDelegate service99');
        });
    }
    notifyhead() {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('>>>>>>>>>>appDelegate notifyhead');
        });
    }
    service1(input, context) {
        return __awaiter(this, void 0, void 0, function* () {
            let item = context.item;
            let wait = 5000;
            if (input.wait)
                wait = input.wait;
            item.vars = input;
            seq++;
            yield delay(wait, 'test');
            item.token.log("SERVICE 1: input: " + JSON.stringify(input) + item.token.currentNode.id + " current seq: " + seq);
            console.log('appDelegate service1 is now complete input:', input, 'output:', seq, 'item.data', item.data);
            return { seq, text: 'test' };
        });
    }
}
exports.AppServices = AppServices;
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
//# sourceMappingURL=OMNI_appServices.js.map