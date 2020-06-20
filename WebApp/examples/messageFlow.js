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
const __1 = require("..");
const configuration_1 = require("../configuration");
const FS = require('fs');
const logger = new __1.Logger({ toConsole: true });
console.log(configuration_1.configuration);
console.log(configuration_1.configuration.timers);
test();
function test() {
    return __awaiter(this, void 0, void 0, function* () {
        const server = new __1.BPMNServer(configuration_1.configuration, logger);
        let response = yield server.engine.start('messageFlow', '');
        //await server.checkTimers();
        //    logger.log('status:' + response.execution.status);
        logger.save(__dirname + '/messageFlow.log');
        console.log("Done...............");
        return;
    });
}
function checkItem(items, criteria) {
    if (items.length == 0) {
        console.log(" No items");
        return;
    }
    const item = items[0];
    let pass = '';
    Object.keys(criteria).forEach(key => {
        if (item[key] != criteria[key])
            pass += `${key} not same ${item[key]} vs ${criteria[key]}`;
    });
    console.log('check:' + pass);
}
function delay(time) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("delaying ... " + time);
        return new Promise(function (resolve) {
            setTimeout(function () {
                console.log("delayed is done.");
                resolve();
            }, time);
        });
    });
}
//# sourceMappingURL=messageFlow.js.map