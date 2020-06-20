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
const _1 = require("../.");
const configuration_1 = require("../configuration");
const logger = new _1.Logger({ toConsole: false });
const server = new _1.BPMNServer(configuration_1.configuration, logger);
console.log(configuration_1.configuration);
//=-=-=-==============================
test();
function test() {
    return __awaiter(this, void 0, void 0, function* () {
        let name = 'loop';
        let context;
        let items;
        let data = { records: [1, 2, 3] };
        context = yield server.engine.start(name, data);
        delay(500, 'test');
        items = context.items;
        console.log(items.filter(i => i.element.id == 'scriptTask').length + " Should be 3");
        console.log(items.filter(i => i.element.id == 'serviceTask').length + " should be 3");
        console.log(context.execution.status);
        let fileName = __dirname + '/' + name + '.log';
        logger.save(fileName);
    });
}
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
//# sourceMappingURL=loop.js.map