'use strict';
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
const BPMNServer_1 = require("../src/BPMNServer");
const config = require('../configuration.js').configuration;
let server, instance;
test();
function test() {
    return __awaiter(this, void 0, void 0, function* () {
        //    let name = 'Buy Used Car';
        let name = 'timerBeforeUser';
        server = new BPMNServer_1.BPMNServer(config);
        let execution = yield server.execute(name, {}, { caseId: 999 });
        let instance = execution.instance;
        let items = execution.instance.items;
        return;
        let engine = execution.engine;
        console.log("instance");
        console.log('instanceId:' + instance.id + " items " + items.length);
        let waiting = yield server.findItems({ instanceId: instance.id, status: 'wait', data: { caseId: 999 } });
        if (waiting.length > 0) {
            let item = waiting[0];
            console.log(`item ${name} is waiting - let us invoke it`);
            let newResults = yield server.invoke({ instanceId: instance.id, status: 'wait', name: 'Buy Car' }, { model: 'Thunderbird' });
            console.log("new results");
            console.log(newResults);
        }
        else {
            console.log("Error something went wrong");
        }
    });
}
//# sourceMappingURL=example.js.map