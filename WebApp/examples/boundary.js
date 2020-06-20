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
const __1 = require("..");
const events_1 = require("events");
const logger = new __1.Logger({ toConsole: true });
console.log(configuration_js_1.configuration);
configuration_js_1.configuration.timers.forceTimersDelay = 50000;
console.log(configuration_js_1.configuration);
test();
var response;
function test() {
    return __awaiter(this, void 0, void 0, function* () {
        const server = new __1.BPMNServer(configuration_js_1.configuration, logger);
        const listener = new events_1.EventEmitter();
        response = yield server.engine.start('boundary-event');
        response.items.forEach(item => {
            log(`  <${item.name}> -<${item.elementId}> id: <${item.id}> status: <${item.status}>  `);
        });
        log('without waiting complete the task');
        response = yield server.engine.invoke({ instance: { id: response.execution.id }, items: { elementId: 'user_task' } }, null);
        response.items.forEach(item => {
            log(`  <${item.name}> -<${item.elementId}> id: <${item.id}>  status: <${item.status}>   `);
        });
        if (getItem('BoundaryEvent_message').status != 'end')
            log("Error item should be end");
        if (getItem('BoundaryEvent_timer').status != 'end')
            log("Error item should be end");
        logger.save('boundary.log');
        return;
        response = yield server.engine.invoke({ instance: { id: response.execution.id }, items: { elementId: 'task_Buy' } }, { model: 'Thunderbird', needsRepairs: false, needsCleaning: false });
        console.log("Ready to drive");
        let item = response.items.filter(item => {
            return (item.name == 'Drive');
        })[0];
        console.log('item: -------------');
        console.log(item.data);
        item.data = { cost: 45000 };
        console.log('item: -------------');
        console.log(item.data);
        response = yield server.engine.invoke({ instance: { id: response.execution.id }, items: { elementId: 'task_Drive' } });
        console.log(`that is it!, process is now complete status=<${response.execution.status}>`);
    });
}
function log(msg) {
    logger.log(msg);
}
function getItem(id) {
    const item = response.items.filter(item => { return item.elementId == id; })[0];
    if (!item) {
        log('item ' + id + ' not found');
    }
    return item;
}
//# sourceMappingURL=boundary.js.map