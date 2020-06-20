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
const __1 = require("../");
const configuration_1 = require("../configuration");
const FS = require('fs');
const logger = new __1.Logger({ toConsole: false });
var caseId = Math.floor(Math.random() * 10000);
var server, response;
test();
var instanceId;
function test() {
    return __awaiter(this, void 0, void 0, function* () {
        let option = 'b';
        server = new __1.BPMNServer(configuration_1.configuration, logger);
        //execute(name: any, user: any, data ?: any, source ?: string, startNodeId ?: string
        response = yield server.execute('invoice', null, { reminderCounter: 0, caseId: caseId }, null, 'StartEvent_AP');
        instanceId = response.execution.id;
        log(instanceId);
        expect(getItem('task_issue_invoice').status, 'equals', 'wait');
        log('invoking issue invoice');
        let items = yield server.findItems({ instance: { id: instanceId }, items: { elementId: 'task_issue_invoice' } });
        items.forEach(item => {
            console.log('item:' + item.elementId + ' status:' + item.status);
        });
        response = yield server.invoke({ instance: { id: instanceId }, items: { elementId: 'task_issue_invoice' } }, null);
        if (response.error) {
            console.log('got error');
            console.log(response.error);
            return;
        }
        if (option == 'a') {
            // option a:
            yield delay(12000);
            response = yield server.restore({ id: instanceId });
            expect(response.items.filter(item => { return (item.elementId == 'event_cancel' && item.status == 'wait'); }).length, 'equals', 1);
            expect(response.items.filter(item => { return (item.elementId == 'task_got_payment' && item.status == 'wait'); }).length, 'equals', 1);
            // option a:
            response = yield server.invoke({ instance: { id: instanceId }, items: { elementId: 'event_cancel' } }, null);
        }
        else {
            console.log("option b 1");
            // option b:
            response = yield server.invokeSignal(instanceId, 'StartEvent_Manager', null);
            console.log("option b 2");
            response = yield server.invoke({ instance: { id: instanceId }, items: { elementId: 'Task_cancelByAdmin' } }, null);
            console.log("option b 3");
        }
        logger.save('invoice-cancel.log');
    });
}
function delay(time) {
    return __awaiter(this, void 0, void 0, function* () {
        log("delaying ... " + time);
        return new Promise(function (resolve) {
            setTimeout(function () {
                log("delayed is done.");
                resolve();
            }, time);
        });
    });
}
function log(msg) {
    logger.log(msg);
}
function expect(object, operation, value) {
    if (object == value)
        return true;
    else {
        log('***Error:' + object + ' does not equal ' + value);
    }
}
function getItem(id) {
    return response.items.filter(item => { return (item.elementId == id); })[0];
}
//# sourceMappingURL=invoice-cancel.js.map