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
const configuration_js_1 = require("../configuration.js");
const __1 = require("../");
const logger = new __1.Logger({ toConsole: true });
test();
function test() {
    return __awaiter(this, void 0, void 0, function* () {
        let name = 'Loop';
        const server = new __1.BPMNServer(configuration_js_1.configuration, logger);
        let response = yield server.engine.start(name, { records: [1, 2, 3] });
        response.items.forEach(item => {
            console.log(`-<${item.elementId}> id: <${item.id}> `);
            console.log(item['data']);
        });
    });
}
function log(msg) {
    logger.log(msg);
}
//# sourceMappingURL=testLoop.js.map